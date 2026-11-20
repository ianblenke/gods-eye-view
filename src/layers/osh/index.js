import { msg } from '../../i18n/index.js';
import { writeOshDetail } from './detail.js';
import { placeOshEntities } from '../../data/oshSystems.js';
import { isOshObservationFresh } from '../../data/oshObservations.js';
import { fromDegrees } from '../../geo/ellipsoid.js';
import { drawOf } from '../../render/rendererOf.js';
import { inputFor } from '../../input/dispatcher.js';
import { createVideoPlayer, createVideoView } from './videoPlayer.js';
import { findLinkedCameraSystem } from './cameraLink.js';
export { createOshSource } from './source.js';
export { createOshPanelHosts } from './hosts.js';
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

const SET_ID = 'osh-systems:points';
const OVERLAY_SOURCE_ID = 'osh-systems';
/** Most labels the overlay host holds for the layer at one time. */
const LABEL_LIMIT = 500;
const LIME = { r: 0, g: 1, b: 0, a: 1 };
const CYAN = { r: 0, g: 1, b: 1, a: 1 };
const BLACK = { r: 0, g: 0, b: 0, a: 1 };

/**
 * Move a system entry to the location of an observation that has a fresh
 * age. Returns true when the entry moved.
 */
function moveToObservation(entry, observation) {
  if (
    !observation?.location ||
    !entry ||
    !isOshObservationFresh(observation.ageMs)
  )
    return false;
  entry.pos = {
    lon: observation.location.lon,
    lat: observation.location.lat,
    height: observation.location.alt || 0,
  };
  return true;
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
 * @param {?object} [options.overlayHost] Draws the labels; with none, no label shows.
 * @param {Function} [options.input] Finds the input port of a viewer.
 */
export function createOshLayer({
  source,
  detailHost = null,
  panelHost = null,
  videoHost = null,
  commandView = null,
  overlayHost = null,
  input = (viewer) => inputFor(viewer),
  createPlayer = createVideoPlayer,
  createView = createVideoView,
  documentImpl = globalThis.document,
} = {}) {
  if (typeof source?.getSystems !== 'function')
    throw new TypeError('OSH layer requires a systems source');
  let _viewer = null;
  /** The set of points, and the entries it draws, by entity id. */
  let _points = null;
  let _entries = new Map();
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
   * Write the entries to the point set and their labels to the overlay
   * host. The renderer hides what lies beyond the ellipsoid horizon (D61).
   */
  function publish() {
    const items = [];
    const labels = [];
    for (const [id, entry] of _entries) {
      items.push({
        id,
        pos: entry.pos,
        height: 'absolute',
        pixelSize: entry.pixelSize,
        color: entry.color,
        outlineColor: BLACK,
        outlineWidth: 1,
        disableDepthTest: Number.POSITIVE_INFINITY,
      });
      if (entry.label)
        labels.push({
          id,
          position: fromDegrees(entry.pos.lon, entry.pos.lat, entry.pos.height),
          variant: 'label',
          title: entry.label,
          accent: entry.accent,
          priority: 100000 - labels.length,
          collisionGroup: 'ambient-label',
          paintLane: 'ambient-label',
          interactive: false,
          horizonCull: true,
          terrainOcclusion: false,
          gapPx: entry.gap,
          verticalOnly: true,
          placement: 'above',
          ...(entry.maxDistance ? { maxDistance: entry.maxDistance } : null),
        });
    }
    _points.set(items);
    overlayHost?.setEntries(OVERLAY_SOURCE_ID, labels, {
      cohortLimit: LABEL_LIMIT,
      collisionCapacity: LABEL_LIMIT,
      moving: false,
    });
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
    commandView?.clear();
    writeDetail(null);
  }

  function datastreamState(id) {
    let state = _datastreamStates.get(id);
    if (!state) {
      state = {
        id,
        observation: null,
        stream: null,
        open: false,
        seq: 0,
        video: false,
      };
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
    const effectiveName =
      systemRecord?.name ?? placedRecord?.streamSystemName ?? null;
    const placedByStream = placedRecord?.locationSource === 'stream';
    const featurePlacedByStream = placedFeature?.locationSource === 'stream';
    writeDetail({
      feature: effectiveFeature
        ? {
            id: effectiveFeature.id,
            name: featureRecord?.name ?? null,
            placedBy: featurePlacedByStream
              ? {
                  datastreamName: placedFeature.datastreamName,
                  ageMs: placedFeature.ageMs,
                }
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
                ? {
                    datastreamName: placedRecord.datastreamName,
                    ageMs: placedRecord.ageMs,
                  }
                : null,
            }
          : null,
      datastreams: states.map(
        ({ id, name, outputName, observation, video }) => ({
          id,
          name,
          outputName,
          observation,
          video,
        }),
      ),
    });
  }

  /**
   * A live observation replaces the observation of its datastream, moves the
   * entity like a poll does, and draws the detail again (osh-073).
   */
  function showLiveObservation(state, observation) {
    state.observation = observation;
    state.seq += 1;
    if (
      moveToObservation(_entries.get(systemEntityId(_selectedId)), observation)
    )
      publish();
    if (_shownStates)
      writeSelectedDetail(_selectedId, _selectedFeatureId, _shownStates);
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
   * When the selected system has no video of its own, this reads a linked
   * camera's own datastreams and plays its video instead (osh-097).
   */
  async function openStreams(states, generation) {
    if (_liveOpened) return;
    _liveOpened = true;
    const ownVideo = states.find((state) => state.video);
    if (ownVideo) openVideoSession(ownVideo, generation);
    openLiveStreams(
      states.filter((state) => !state.video),
      generation,
    );
    if (ownVideo) return;
    const selectedRecord = _systemRecords.get(_selectedId);
    const linkedRecord = findLinkedCameraSystem({
      selectedId: _selectedId,
      selectedName: selectedRecord?.name,
      systemRecords: _systemRecords.values(),
    });
    if (!linkedRecord) return;
    const result = await source
      .getDatastreams({ system: linkedRecord.id })
      .catch(() => null);
    if (generation !== _pollGeneration || !result || result.keyRequired) return;
    const linkedVideo = result.datastreams.find(
      (record) => record.systemId === linkedRecord.id && record.video === true,
    );
    if (linkedVideo)
      openVideoSession(linkedVideo, generation, linkedRecord.name);
  }

  /**
   * Play the first video datastream of the system: one view, one player and
   * one stream, closed with the selection (osh-087).
   */
  function openVideoSession(state, generation, systemName = null) {
    if (!state || typeof source.openVideo !== 'function' || !videoHost) return;
    const view = createView({
      document: documentImpl,
      host: videoHost,
      name: systemName || state.name || state.id,
    });
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
        onObservation: currentOnly(generation, (observation) =>
          showLiveObservation(state, observation),
        ),
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
    const entry = _entries.get(systemEntityId(systemId));
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
    await openStreams(states, generation);
    if (generation !== _pollGeneration) return;
    let moved = false;
    for (const state of states) {
      // A video datastream has no observation to read (osh-074).
      if (state.video) continue;
      // An open stream that has delivered nothing gets the poll, so a slow
      // datastream shows its newest observation until its first live one.
      if (state.open && state.observation) continue;
      const seq = state.seq;
      const observationResult = await source
        .getObservation(state.id)
        .catch(() => null);
      if (generation !== _pollGeneration) return;
      // A live observation that came while the poll waited is newer.
      if (state.seq !== seq) continue;
      state.observation =
        observationResult && !observationResult.keyRequired
          ? observationResult.observation
          : null;
      moved = moveToObservation(entry, state.observation) || moved;
    }
    // One write after the loop, not one per datastream.
    if (moved) publish();
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
      const record =
        _systemRecords.get(systemId) || _placedSystemById.get(systemId);
      void commandView?.show({
        systemId,
        systemName: record?.name || record?.streamSystemName || systemId,
      });
    } else commandView?.clear();
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

  function installClickHandler() {
    if (_clickHandler || !_viewer) return;
    // A viewer with no renderer input bound takes no clicks.
    let clicks = null;
    try {
      clicks = input(_viewer) ?? null;
    } catch {
      clicks = null;
    }
    if (!clicks) return;
    _clickHandler = clicks.onClick((click) => {
      const hit = click.drawHit;
      const pickedId = hit?.set === SET_ID ? hit.id : null;
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
    });
  }

  function removeClickHandler() {
    _clickHandler?.();
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
      // The renderer hides what lies beyond the horizon, and draws the
      // points over the depth test at their own altitude (D59, D60, D61).
      _points = drawOf(viewer).points({
        id: SET_ID,
        horizonCull: true,
        show: false,
      });
      overlayHost?.setVisible(OVERLAY_SOURCE_ID, false);
      resetState();
    },

    enable() {
      _enabled = true;
      if (_points) _points.show = true;
      overlayHost?.setVisible(OVERLAY_SOURCE_ID, true);
      installClickHandler();
    },

    disable() {
      _request?.abort();
      _request = null;
      _enabled = false;
      if (_points) _points.show = false;
      overlayHost?.setVisible(OVERLAY_SOURCE_ID, false);
      clearSelection();
      removeClickHandler();
    },

    async update() {
      if (!_enabled || !_points) return false;
      _request?.abort();
      const request = new AbortController();
      _request = request;
      const release = () => {
        if (_request === request) _request = null;
      };
      try {
        const [systemsSettled, foisSettled, locationsSettled] =
          await Promise.allSettled([
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
          _lastError =
            systemsSettled.reason?.message || msg('OSH source unavailable');
          return false;
        }
        const result = systemsSettled.value;
        _keyRequired = Boolean(result.keyRequired);
        if (_keyRequired) {
          _entries = new Map();
          resetState();
          _keyRequired = true;
          _lastUpdate = Date.now();
          clearSelection();
          publish();
          release();
          return true;
        }

        for (const record of result.systems)
          _systemRecords.set(record.id, record);

        const partial =
          foisSettled.status === 'rejected' ||
          locationsSettled.status === 'rejected';
        let featureRecords = [];
        let truncated = false;
        if (
          foisSettled.status === 'fulfilled' &&
          !foisSettled.value.keyRequired
        ) {
          featureRecords = foisSettled.value.fois;
          truncated = Boolean(foisSettled.value.truncated);
        }
        _featureRecordsById = new Map(
          featureRecords.map((record) => [record.id, record]),
        );
        _featureRecordsByUid = new Map();
        for (const record of featureRecords) {
          if (record.uid) _featureRecordsByUid.set(record.uid, record);
        }

        let locationRecords = [];
        if (
          locationsSettled.status === 'fulfilled' &&
          !locationsSettled.value.keyRequired
        ) {
          locationRecords = locationsSettled.value.locations;
        }

        const placed = placeOshEntities({
          systems: [..._systemRecords.values()],
          fois: featureRecords,
          locations: locationRecords,
        });
        _placedSystemById = new Map(
          placed.systems.map((record) => [record.id, record]),
        );
        _placedFeatureById = new Map(
          placed.features.map((record) => [record.id, record]),
        );

        const selectedSystemEntity = _selectedId
          ? (_entries.get(systemEntityId(_selectedId)) ?? null)
          : null;
        const selectedPosition = selectedSystemEntity?.pos ?? null;

        // The lifecycle of a stream-placed placeholder (design decision
        // D48, osh-057): a system with no record in the union map, placed
        // only from a fresh location. When its next refresh has no fresh
        // location for it, it is gone from placed.systems, and this
        // refresh — not any later one — is the one that counts it under
        // unplaced, unless it is the current selection.
        const placedIds = new Set(placed.systems.map((record) => record.id));
        const newPlaceholderIds = new Set(
          placed.systems
            .filter(
              (record) =>
                record.locationSource === 'stream' &&
                !_systemRecords.has(record.id),
            )
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
        _placedStreamCount = placed.systems.filter(
          (record) => record.locationSource === 'stream',
        ).length;
        _placedStreamFeaturesCount = placed.features.filter(
          (record) =>
            record.locationSource === 'stream' &&
            !_featureRecordsById.has(record.id),
        ).length;

        const entries = new Map();

        for (const record of placed.systems) {
          const isSelected = record.id === _selectedId;
          const position =
            isSelected && selectedPosition
              ? selectedPosition
              : { lon: record.lon, lat: record.lat, height: record.alt || 0 };
          const isPlaceholder =
            record.locationSource === 'stream' &&
            !_systemRecords.has(record.id);
          // A held record's own name wins; a placeholder falls back to
          // the pass's own name for the system; with neither, the id is
          // the label — a degraded, visible state, not the design.
          const labelText =
            record.name ||
            (isPlaceholder ? record.streamSystemName || record.id : null);
          entries.set(systemEntityId(record.id), {
            pos: position,
            pixelSize: 10,
            color: LIME,
            accent: '#00ff00',
            gap: 16,
            label: labelText,
          });
        }

        // The selected system's entity stays at its last position while
        // it drops out of this refresh's placement entirely — a stale
        // stream, or a placeholder whose stream went quiet — until it is
        // deselected (osh-057, mirroring osh-031's rule for the union).
        if (
          _selectedId &&
          !placedIds.has(_selectedId) &&
          selectedSystemEntity &&
          selectedPosition
        ) {
          // Keeps the label of the entry it replaces (D62).
          entries.set(systemEntityId(_selectedId), selectedSystemEntity);
        }

        for (const feature of placed.features) {
          const id = featureEntityId(feature.id);
          // A second entity with one id is a malformed read: fail the refresh.
          if (entries.has(id)) throw new Error(`Duplicate OSH entity ${id}`);
          entries.set(id, {
            pos: {
              lon: feature.lon,
              lat: feature.lat,
              height: feature.alt || 0,
            },
            pixelSize: 6,
            color: CYAN,
            accent: '#00ffff',
            gap: 12,
            label: feature.name || null,
            maxDistance: FEATURE_LABEL_DISTANCE_METERS,
          });
        }

        _entries = entries;
        publish();

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
        // throw — placeOshEntities(), or building a point — runs
        // after that check. Nothing async happens in between. A
        // production record is parsed JSON data. So nothing in that
        // region re-enters the layer, and a stale update does not reach
        // this catch.
        release();
        _lastError = error?.message || msg('OSH source unavailable');
        return false;
      }
    },

    destroy() {
      _request?.abort();
      _request = null;
      _enabled = false;
      clearSelection();
      commandView?.clear();
      removeClickHandler();
      overlayHost?.clearSource(OVERLAY_SOURCE_ID);
      overlayHost?.setVisible(OVERLAY_SOURCE_ID, false);
      _points?.dispose();
      _points = null;
      _entries = new Map();
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
