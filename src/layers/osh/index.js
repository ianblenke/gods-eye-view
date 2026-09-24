import * as Cesium from 'cesium';
import { writeOshDetail } from './detail.js';
import { placeOshEntities } from '../../data/oshSystems.js';
import { isOshObservationFresh } from '../../data/oshObservations.js';
import { horizonOccluder } from '../../data/iconOrientation.js';
import { createVideoPlayer, createVideoView } from './videoPlayer.js';
export { createOshSource } from './source.js';
export { renderOshDetail, writeOshDetail } from './detail.js';

/** Poll interval for the datastreams and observations of a selected system. */
const POLL_INTERVAL_MS = 15_000;
/** A feature label shows only within this distance of the camera. */
const FEATURE_LABEL_DISTANCE_METERS = 200_000;
/**
 * The selected system opens a live stream for at most this many datastreams (D70).
 * A stream keeps one connection to the server for its whole life, and a browser
 * keeps about six connections to one origin over HTTP/1.1. The other requests
 * to the server need the rest.
 */
const MAX_LIVE_STREAMS = 3;

function systemEntityId(systemId) {
  return `osh:${systemId}`;
}

function featureEntityId(featureId) {
  return `osh-foi:${featureId}`;
}

/**
 * Keep an entity on top of the depth test, at its record's own altitude.
 * The cctv layer met this exact defect at a field test on 2026-07-06
 * (`src/layers/cctv/lifecycle.js:145`): a finite depth distance let the
 * depth test hide the icon again at far zoom. D59 and D60 give the
 * reasons an OSH entity needs positive infinity, not a window, and keeps
 * `heightReference` at `NONE` so the choice to keep the altitude is
 * visible at the site.
 * @param {object} graphics A point or label options object, before
 *   it is passed to a `Cesium.Entity` construction.
 * @returns {object} The same object, for use inline at the call site.
 */
function entityAlwaysOnTop(graphics) {
  graphics.disableDepthTestDistance = Number.POSITIVE_INFINITY;
  graphics.heightReference = Cesium.HeightReference.NONE;
  return graphics;
}

/** Move a system entity to the location of an observation that has a fresh age. */
function moveToObservation(entity, observation) {
  if (!observation?.location || !entity || !isOshObservationFresh(observation.ageMs)) return;
  entity.position = Cesium.Cartesian3.fromDegrees(
    observation.location.lon,
    observation.location.lat,
    observation.location.alt || 0,
  );
}

/**
 * Own the OSH systems and features-of-interest display, the selected
 * system's datastream poll, its live streams, its video and the entity they
 * move when a newest result carries a location.
 * @param {object} options
 * @param {{getSystems: Function, getDatastreams: Function, getObservation: Function, getFois?: Function, getLocations?: Function, openLive?: Function, openVideo?: Function}} options.source
 * @param {?{innerHTML: string}} [options.detailHost]
 * @param {?{hidden: boolean}} [options.panelHost] Shown while the layer holds a detail (osh-086).
 * @param {?object} [options.videoHost] Holds the view of the video of the selected system (osh-087).
 * @param {Function} [options.createPlayer] Builds the player, as `createVideoPlayer` does.
 * @param {Function} [options.createView] Builds the view, as `createVideoView` does.
 * @param {?object} [options.documentImpl] The document that builds the view.
 */
export function createOshLayer({
  source,
  detailHost = null,
  panelHost = null,
  videoHost = null,
  createPlayer = createVideoPlayer,
  createView = createVideoView,
  documentImpl = globalThis.document,
} = {}) {
  if (typeof source?.getSystems !== 'function')
    throw new TypeError('OSH layer requires a systems source');
  let _viewer = null;
  let _dataSource = null;
  let _enabled = false;
  let _request = null;
  let _count = 0;
  let _featuresCount = 0;
  let _lastUpdate = null;
  let _lastError = null;
  let _keyRequired = false;
  let _stale = false;
  let _unplaced = 0;
  let _truncated = false;
  let _partial = false;
  let _selectedId = null;
  let _selectedFeatureId = null;
  let _clickHandler = null;
  let _pollTimer = null;
  let _pollGeneration = 0;
  /**
   * The datastreams of the selected system, by id, with the newest
   * observation, the live stream and its state (D70). Empty with no selection.
   */
  const _datastreamStates = new Map();
  let _liveOpened = false;
  /**
   * The video of the selected system (osh-087): one stream, one player and one
   * view, or null. It closes with the live streams.
   */
  let _videoSession = null;
  /** The states that the last poll wrote to the detail, for a live redraw. */
  let _shownStates = null;
  let _placedStreamCount = 0;
  let _placedStreamFeaturesCount = 0;
  /** Added at init(), removed at destroy(); stays while the layer is off (D61). */
  let _moveEndListener = null;
  /** Union across refreshes: a system seen once keeps its record. */
  const _systemRecords = new Map();
  /** Replaced whole on every refresh: the feature list is stable, not sampled. */
  let _featureRecordsById = new Map();
  let _featureRecordsByUid = new Map();
  /**
   * Ids of systems placed only by a fresh stream location, with no record
   * in `_systemRecords` — a placeholder that never enters the union map
   * (design decision D48). Tracked here, not in `_systemRecords`, so the
   * layer can count one under `unplaced` at the refresh its stream goes
   * stale, the one refresh it is still known.
   */
  let _placeholderStreamIds = new Set();
  /** The last update's placed system records, by id — for the detail's "Placed by" line. */
  let _placedSystemById = new Map();
  /** The last update's placed feature records, by id. */
  let _placedFeatureById = new Map();

  function writeDetail(detail) {
    writeOshDetail(detailHost, detail);
    // The panel shows while a detail exists, and hides with the selection (osh-086).
    if (panelHost) panelHost.hidden = !detail;
  }

  /**
   * Hide every system and feature entity beyond the ellipsoid horizon,
   * and show every entity the camera can see. D61: runs on the camera's
   * `moveEnd`, at the end of each refresh's draw loop, and again right
   * after the poll moves the selected entity. `_dataSource` always holds
   * an entity with a position at each of those three call sites, so this
   * reads none of them behind a guard.
   */
  function refreshHorizonVisibility() {
    const occluder = horizonOccluder(_viewer.camera);
    const now = Cesium.JulianDate.now();
    for (const entity of _dataSource.entities.values) {
      entity.show = occluder.isPointVisible(entity.position.getValue(now));
    }
  }

  function stopPolling() {
    _pollGeneration += 1;
    if (_pollTimer) {
      clearInterval(_pollTimer);
      _pollTimer = null;
    }
    // Every path that ends a selection comes here, so every stream closes here.
    for (const state of _datastreamStates.values()) state.stream?.close();
    closeVideoSession();
    _datastreamStates.clear();
    _liveOpened = false;
    _shownStates = null;
  }

  /** Close the stream and the player, and remove the view, as the selection ends. */
  function closeVideoSession() {
    if (!_videoSession) return;
    const { stream, player, view } = _videoSession;
    _videoSession = null;
    stream?.close();
    player.close();
    view.destroy();
  }

  function clearSelection() {
    if (!_selectedId && !_selectedFeatureId) return;
    _selectedId = null;
    _selectedFeatureId = null;
    stopPolling();
    writeDetail(null);
  }

  function datastreamState(id) {
    let state = _datastreamStates.get(id);
    if (!state) {
      state = { id, observation: null, stream: null, open: false, seq: 0, video: false };
      _datastreamStates.set(id, state);
    }
    return state;
  }

  /** The selected system's detail, from the datastream states in the order given. */
  function writeSelectedDetail(systemId, featureId, states) {
    const systemRecord = _systemRecords.get(systemId) || null;
    const placedRecord = _placedSystemById.get(systemId) || null;
    const featureRecord = featureId ? _featureRecordsById.get(featureId) : null;
    const placedFeature = featureId ? _placedFeatureById.get(featureId) : null;
    const effectiveFeature = featureRecord || placedFeature;
    // A held record's own name wins; with none, the location pass's own
    // name for a stream-placed system stands in (osh-032, mirroring the
    // entity label rule of osh-057). The header still falls back to the
    // id when both are null.
    const effectiveName = systemRecord?.name ?? placedRecord?.streamSystemName ?? null;
    const placedByStream = placedRecord?.locationSource === 'stream';
    const featurePlacedByStream = placedFeature?.locationSource === 'stream';
    writeDetail({
      feature: effectiveFeature
        ? {
            id: effectiveFeature.id,
            name: featureRecord?.name ?? null,
            placedBy: featurePlacedByStream
              ? { datastreamName: placedFeature.datastreamName, ageMs: placedFeature.ageMs }
              : null,
          }
        : null,
      hostId: effectiveFeature ? systemId : null,
      system:
        systemRecord || placedRecord
          ? {
              id: systemId,
              uid: systemRecord?.uid ?? null,
              name: effectiveName,
              description: systemRecord?.description ?? null,
              placedBy: placedByStream
                ? { datastreamName: placedRecord.datastreamName, ageMs: placedRecord.ageMs }
                : null,
            }
          : null,
      datastreams: states.map(({ id, name, outputName, observation, video }) => ({
        id,
        name,
        outputName,
        observation,
        video,
      })),
    });
  }

  /**
   * A live observation replaces the observation of its datastream, moves the
   * entity like a poll does, and draws the detail again (osh-073).
   */
  function showLiveObservation(state, observation) {
    state.observation = observation;
    state.seq += 1;
    moveToObservation(_dataSource.entities.getById(systemEntityId(_selectedId)), observation);
    refreshHorizonVisibility();
    if (_shownStates) writeSelectedDetail(_selectedId, _selectedFeatureId, _shownStates);
  }

  /**
   * A callback of a closed or replaced selection does nothing, as a stale poll
   * does. A live stream and a video stream both guard their callbacks with it.
   */
  function currentOnly(generation, callback) {
    return (data) => {
      if (generation === _pollGeneration) callback(data);
    };
  }

  /**
   * Open the video and the live streams, once for each selection (osh-072,
   * osh-087). The video datastreams leave the live streams: they have no
   * observation to stream, and they must not use one of the three slots.
   */
  function openStreams(states, generation) {
    if (_liveOpened) return;
    _liveOpened = true;
    openVideoSession(
      states.find((state) => state.video),
      generation,
    );
    openLiveStreams(
      states.filter((state) => !state.video),
      generation,
    );
  }

  /**
   * Play the first video datastream of the system: one view, one player and
   * one stream, closed with the selection (osh-087).
   */
  function openVideoSession(state, generation) {
    if (!state || typeof source.openVideo !== 'function' || !videoHost) return;
    const view = createView({ document: documentImpl, host: videoHost, name: state.name || state.id });
    let playerStatus = '';
    const player = createPlayer({
      canvas: view.canvas,
      onStatus: (text) => {
        playerStatus = text;
        view.setStatus(text);
      },
    });
    const session = { stream: null, player, view };
    _videoSession = session;
    // A browser with no WebCodecs cannot show the picture, so the layer does not fetch it.
    if (playerStatus === 'unsupported') return;
    session.stream = source.openVideo(state.id, {
      onFrame: currentOnly(generation, (bytes) => player.push(bytes)),
      // The player reports `live` once, not for each frame. So when the stream
      // is back after `down`, the view shows the last status of the player again.
      onOpen: currentOnly(generation, () => view.setStatus(playerStatus)),
      onDown: currentOnly(generation, () => view.setStatus('reconnecting')),
      onUnsupported: currentOnly(generation, () => {
        view.setStatus('unavailable');
        session.stream.close();
        session.stream = null;
      }),
    });
  }

  /**
   * Open one live stream for each of at most three datastreams (osh-072).
   * @param {object[]} states The datastream states that have no video.
   */
  function openLiveStreams(states, generation) {
    if (typeof source.openLive !== 'function') return;
    // One stream for each id, whatever the list holds.
    for (const state of [...new Set(states)].slice(0, MAX_LIVE_STREAMS)) {
      state.stream = source.openLive(state.id, {
        onObservation: currentOnly(generation, (observation) => showLiveObservation(state, observation)),
        onOpen: currentOnly(generation, () => {
          state.open = true;
        }),
        onDown: currentOnly(generation, () => {
          state.open = false;
        }),
        onUnsupported: currentOnly(generation, () => {
          state.open = false;
          state.stream.close();
        }),
      });
    }
  }

  async function pollSelected() {
    // applySelection() only starts this poll while _selectedId names a
    // system, so systemId is always set at this point; the entity for that
    // system may still be absent, when the host is not on the map.
    const generation = _pollGeneration;
    const systemId = _selectedId;
    const featureId = _selectedFeatureId;
    const entity = _dataSource.entities.getById(systemEntityId(systemId));
    const datastreamsResult = await source
      .getDatastreams({ system: systemId })
      .catch(() => null);
    if (
      generation !== _pollGeneration ||
      !datastreamsResult ||
      datastreamsResult.keyRequired
    ) {
      return;
    }
    const datastreams = datastreamsResult.datastreams.filter(
      (record) => record.systemId === systemId,
    );
    const states = datastreams.map((datastream) => {
      const state = datastreamState(datastream.id);
      state.name = datastream.name;
      state.outputName = datastream.outputName;
      state.video = datastream.video === true;
      return state;
    });
    openStreams(states, generation);
    for (const state of states) {
      // A video datastream has no observation to read (osh-074).
      if (state.video) continue;
      // An open stream that has delivered nothing gets the poll, so a slow
      // datastream shows its newest observation until its first live one.
      if (state.open && state.observation) continue;
      const seq = state.seq;
      const observationResult = await source.getObservation(state.id).catch(() => null);
      if (generation !== _pollGeneration) return;
      // A live observation that came while the poll waited is newer.
      if (state.seq !== seq) continue;
      state.observation =
        observationResult && !observationResult.keyRequired ? observationResult.observation : null;
      moveToObservation(entity, state.observation);
    }
    // An entity the poll moved can cross the horizon between refreshes
    // (D61). One call after the loop, not one per datastream.
    refreshHorizonVisibility();
    _shownStates = states;
    writeSelectedDetail(systemId, featureId, states);
  }

  /** systemId may be null (a feature with no known host); featureId may be null (a direct system click). */
  function applySelection(systemId, featureId) {
    if (_selectedId === systemId && _selectedFeatureId === featureId) return;
    _selectedId = systemId;
    _selectedFeatureId = featureId;
    stopPolling();
    if (systemId) {
      _pollTimer = setInterval(() => {
        void pollSelected();
      }, POLL_INTERVAL_MS);
      void pollSelected();
      return;
    }
    if (featureId) {
      const record = _placedFeatureById.get(featureId);
      const featurePlacedByStream = record?.locationSource === 'stream';
      writeDetail({
        feature: {
          id: featureId,
          name: record ? record.name : null,
          placedBy: featurePlacedByStream
            ? { datastreamName: record.datastreamName, ageMs: record.ageMs }
            : null,
        },
        hostId: null,
        system: null,
        datastreams: [],
      });
    }
  }

  function installClickHandler(viewer) {
    if (_clickHandler) return;
    _clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    _clickHandler.setInputAction((click) => {
      const picked = viewer.scene.pick(click.position);
      const pickedId =
        typeof picked?.id?.id === 'string'
          ? picked.id.id
          : typeof picked?.id === 'string'
            ? picked.id
            : null;
      if (pickedId && pickedId.startsWith('osh-foi:')) {
        const featureId = pickedId.slice('osh-foi:'.length);
        const record = _placedFeatureById.get(featureId);
        applySelection(record ? record.systemId : null, featureId);
        return;
      }
      if (pickedId && pickedId.startsWith('osh:')) {
        applySelection(pickedId.slice(4), null);
        return;
      }
      clearSelection();
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  function removeClickHandler() {
    if (!_clickHandler) return;
    _clickHandler.destroy();
    _clickHandler = null;
  }

  function resetState() {
    _systemRecords.clear();
    _featureRecordsById = new Map();
    _featureRecordsByUid = new Map();
    _placeholderStreamIds = new Set();
    _placedSystemById = new Map();
    _placedFeatureById = new Map();
    _count = 0;
    _featuresCount = 0;
    _placedStreamCount = 0;
    _placedStreamFeaturesCount = 0;
    _lastUpdate = null;
    _lastError = null;
    _keyRequired = false;
    _stale = false;
    _unplaced = 0;
    _truncated = false;
    _partial = false;
  }

  /**
   * Calling an async function always returns a promise: a synchronous
   * throw inside it becomes a rejection, never a throw the caller sees.
   * This keeps a source that throws instead of rejecting from escaping
   * `Promise.allSettled` and killing the whole refresh — the required
   * systems read and the optional features read must fail the same way
   * whether the source rejects or throws.
   */
  async function callSourceGetSystems(signal) {
    return source.getSystems({ signal });
  }

  async function callSourceGetFois(signal) {
    if (typeof source.getFois !== 'function') {
      return { keyRequired: false, fois: [], truncated: false };
    }
    return source.getFois({ signal });
  }

  /**
   * The locations read carries no candidate of the layer's own choosing —
   * source.getLocations() takes no argument but `signal`, and the server
   * finds every candidate itself (design decision D46). See osh-046.
   */
  async function callSourceGetLocations(signal) {
    if (typeof source.getLocations !== 'function') {
      return { keyRequired: false, locations: [], failed: 0 };
    }
    return source.getLocations({ signal });
  }

  const layer = {
    id: 'osh-systems',
    name: 'OSH SYSTEMS',
    icon: '🛰️',
    source: 'OpenSensorHub',
    updateInterval: 300_000,

    init(viewer) {
      if (_viewer) throw new Error('OSH layer is already initialized');
      _viewer = viewer;
      _dataSource = new Cesium.CustomDataSource('osh-systems');
      _dataSource.show = false;
      viewer.dataSources.add(_dataSource);
      resetState();
      // Stays through disable(), so a camera moved while the layer is
      // off still leaves a correct show set for the next enable() (D61).
      _moveEndListener = () => refreshHorizonVisibility();
      viewer.camera.moveEnd.addEventListener(_moveEndListener);
    },

    enable(viewer) {
      _enabled = true;
      if (_dataSource) _dataSource.show = true;
      installClickHandler(viewer);
    },

    disable() {
      _request?.abort();
      _request = null;
      _enabled = false;
      if (_dataSource) _dataSource.show = false;
      clearSelection();
      removeClickHandler();
    },

    async update() {
      if (!_enabled || !_dataSource) return false;
      _request?.abort();
      const request = new AbortController();
      _request = request;
      const release = () => {
        if (_request === request) _request = null;
      };
      try {
        const [systemsSettled, foisSettled, locationsSettled] = await Promise.allSettled([
          callSourceGetSystems(request.signal),
          callSourceGetFois(request.signal),
          callSourceGetLocations(request.signal),
        ]);
        if (request.signal.aborted || _request !== request || !_enabled) {
          release();
          return false;
        }
        if (systemsSettled.status === 'rejected') {
          release();
          _lastError = systemsSettled.reason?.message || 'OSH source unavailable';
          return false;
        }
        const result = systemsSettled.value;
        _keyRequired = Boolean(result.keyRequired);
        if (_keyRequired) {
          _dataSource.entities.removeAll();
          resetState();
          _keyRequired = true;
          _lastUpdate = Date.now();
          clearSelection();
          release();
          return true;
        }

        for (const record of result.systems) _systemRecords.set(record.id, record);

        const partial = foisSettled.status === 'rejected' || locationsSettled.status === 'rejected';
        let featureRecords = [];
        let truncated = false;
        if (foisSettled.status === 'fulfilled' && !foisSettled.value.keyRequired) {
          featureRecords = foisSettled.value.fois;
          truncated = Boolean(foisSettled.value.truncated);
        }
        _featureRecordsById = new Map(featureRecords.map((record) => [record.id, record]));
        _featureRecordsByUid = new Map();
        for (const record of featureRecords) {
          if (record.uid) _featureRecordsByUid.set(record.uid, record);
        }

        let locationRecords = [];
        if (locationsSettled.status === 'fulfilled' && !locationsSettled.value.keyRequired) {
          locationRecords = locationsSettled.value.locations;
        }

        const placed = placeOshEntities({
          systems: [..._systemRecords.values()],
          fois: featureRecords,
          locations: locationRecords,
        });
        _placedSystemById = new Map(placed.systems.map((record) => [record.id, record]));
        _placedFeatureById = new Map(placed.features.map((record) => [record.id, record]));

        const now = Cesium.JulianDate.now();
        const selectedSystemEntity = _selectedId
          ? _dataSource.entities.getById(systemEntityId(_selectedId))
          : null;
        const selectedPosition = selectedSystemEntity?.position?.getValue(now) ?? null;

        // The lifecycle of a stream-placed placeholder (design decision
        // D48, osh-057): a system with no record in the union map, placed
        // only from a fresh location. When its next refresh has no fresh
        // location for it, it is gone from placed.systems, and this
        // refresh — not any later one — is the one that counts it under
        // unplaced, unless it is the current selection.
        const placedIds = new Set(placed.systems.map((record) => record.id));
        const newPlaceholderIds = new Set(
          placed.systems
            .filter((record) => record.locationSource === 'stream' && !_systemRecords.has(record.id))
            .map((record) => record.id),
        );
        // The selected exception in osh-057 governs the entity only: a
        // retired placeholder still counts as unplaced even while its
        // entity stays on the map for the current selection.
        let retiredPlaceholders = 0;
        for (const id of _placeholderStreamIds) {
          if (newPlaceholderIds.has(id) || placedIds.has(id)) continue;
          retiredPlaceholders += 1;
        }
        _placeholderStreamIds = newPlaceholderIds;
        _unplaced = placed.unplaced.length + retiredPlaceholders;
        _placedStreamCount = placed.systems.filter((record) => record.locationSource === 'stream').length;
        _placedStreamFeaturesCount = placed.features.filter(
          (record) => record.locationSource === 'stream' && !_featureRecordsById.has(record.id),
        ).length;

        _dataSource.entities.removeAll();

        for (const record of placed.systems) {
          const isSelected = record.id === _selectedId;
          const position =
            isSelected && selectedPosition
              ? selectedPosition
              : Cesium.Cartesian3.fromDegrees(record.lon, record.lat, record.alt || 0);
          const isPlaceholder = record.locationSource === 'stream' && !_systemRecords.has(record.id);
          // A held record's own name wins; a placeholder falls back to
          // the pass's own name for the system; with neither, the id is
          // the label — a degraded, visible state, not the design.
          const labelText = record.name || (isPlaceholder ? record.streamSystemName || record.id : null);
          _dataSource.entities.add(
            new Cesium.Entity({
              id: systemEntityId(record.id),
              position,
              point: entityAlwaysOnTop({
                pixelSize: 10,
                color: Cesium.Color.LIME,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
              }),
              label: labelText
                ? entityAlwaysOnTop({
                    text: labelText,
                    font: '12px sans-serif',
                    pixelOffset: new Cesium.Cartesian2(0, -16),
                  })
                : undefined,
              properties: {
                uid: record.uid,
                name: record.name,
                description: record.description,
                locationSource: record.locationSource,
              },
            }),
          );
        }

        // The selected system's entity stays at its last position while
        // it drops out of this refresh's placement entirely — a stale
        // stream, or a placeholder whose stream went quiet — until it is
        // deselected (osh-057, mirroring osh-031's rule for the union).
        if (_selectedId && !placedIds.has(_selectedId) && selectedSystemEntity && selectedPosition) {
          _dataSource.entities.add(
            new Cesium.Entity({
              id: systemEntityId(_selectedId),
              position: selectedPosition,
              point: entityAlwaysOnTop({
                pixelSize: 10,
                color: Cesium.Color.LIME,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
              }),
              // Reuses the label object of the entity it replaces, which
              // already carries the two properties (D62).
              label: selectedSystemEntity.label,
              properties: selectedSystemEntity.properties,
            }),
          );
        }

        for (const feature of placed.features) {
          _dataSource.entities.add(
            new Cesium.Entity({
              id: featureEntityId(feature.id),
              position: Cesium.Cartesian3.fromDegrees(
                feature.lon,
                feature.lat,
                feature.alt || 0,
              ),
              point: entityAlwaysOnTop({
                pixelSize: 6,
                color: Cesium.Color.CYAN,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
              }),
              label: feature.name
                ? entityAlwaysOnTop({
                    text: feature.name,
                    font: '11px sans-serif',
                    pixelOffset: new Cesium.Cartesian2(0, -12),
                    distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                      0,
                      FEATURE_LABEL_DISTANCE_METERS,
                    ),
                  })
                : undefined,
              properties: {
                uid: feature.uid,
                name: feature.name,
                description: feature.description,
                systemId: feature.systemId,
              },
            }),
          );
        }

        // A newly drawn entity starts with show:true, and the camera has
        // not moved for this refresh to catch on its own (D61).
        refreshHorizonVisibility();

        _count = placed.systems.length;
        _featuresCount = placed.features.length;
        _truncated = truncated;
        _partial = partial;
        _lastUpdate = Date.now();
        _lastError = null;
        _stale = Boolean(result.stale);

        // The system map is a union, so a system this refresh omitted keeps
        // its selection and its poll. The feature list is not a union: a
        // feature this refresh dropped is gone, and so is its selection.
        if (_selectedFeatureId && !_placedFeatureById.has(_selectedFeatureId)) {
          clearSelection();
        }

        release();
        return true;
      } catch (error) {
        // Promise.allSettled receives every failure of both getters. So
        // nothing before the staleness check can throw. The code that can
        // throw — placeOshEntities(), or Cesium building an entity — runs
        // after that check. Nothing async happens in between. A
        // production record is parsed JSON data. So nothing in that
        // region re-enters the layer, and a stale update does not reach
        // this catch.
        release();
        _lastError = error?.message || 'OSH source unavailable';
        return false;
      }
    },

    destroy(viewer = _viewer) {
      _request?.abort();
      _request = null;
      _enabled = false;
      clearSelection();
      removeClickHandler();
      if (_dataSource && viewer) {
        viewer.dataSources.remove(_dataSource, true);
        viewer.camera.moveEnd.removeEventListener(_moveEndListener);
      }
      _moveEndListener = null;
      _dataSource = null;
      _viewer = null;
      resetState();
    },

    getStats() {
      return {
        count: _count,
        features: _featuresCount,
        lastUpdate: _lastUpdate,
        error: _lastError,
        keyRequired: _keyRequired,
        stale: _stale,
        unplaced: _unplaced,
        truncated: _truncated,
        partial: _partial,
        selectedId: _selectedId,
        selectedFeatureId: _selectedFeatureId,
        placed: {
          stream: _placedStreamCount,
          streamFeatures: _placedStreamFeaturesCount,
        },
      };
    },
  };
  return layer;
}
