import * as Cesium from 'cesium';
import { writeOshDetail } from './detail.js';
export { createOshSource } from './source.js';
export { renderOshDetail, writeOshDetail } from './detail.js';

/** Poll interval for the datastreams and observations of a selected system. */
const POLL_INTERVAL_MS = 15_000;

function entityIdFor(systemId) {
  return `osh:${systemId}`;
}

function propertyValue(entity, key) {
  return entity.properties[key].getValue(Cesium.JulianDate.now());
}

/**
 * Own the OSH systems display, the selected system's datastream poll and
 * the marker it moves when a newest result carries a location.
 * @param {object} options
 * @param {{getSystems: Function, getDatastreams: Function, getObservation: Function}} options.source
 * @param {?{innerHTML: string}} [options.detailHost]
 */
export function createOshLayer({ source, detailHost = null } = {}) {
  if (typeof source?.getSystems !== 'function')
    throw new TypeError('OSH layer requires a systems source');
  let _viewer = null;
  let _dataSource = null;
  let _enabled = false;
  let _request = null;
  let _count = 0;
  let _lastUpdate = null;
  let _lastError = null;
  let _keyRequired = false;
  let _stale = false;
  let _selectedId = null;
  let _clickHandler = null;
  let _pollTimer = null;
  let _pollGeneration = 0;

  function writeDetail(detail) {
    writeOshDetail(detailHost, detail);
  }

  function stopPolling() {
    _pollGeneration += 1;
    if (_pollTimer) {
      clearInterval(_pollTimer);
      _pollTimer = null;
    }
  }

  function clearSelection() {
    if (!_selectedId) return;
    _selectedId = null;
    stopPolling();
    writeDetail(null);
  }

  async function pollSelected() {
    // selectSystem() only calls this while _selectedId names an entity that
    // is on the screen, so the entity always exists at this point.
    const generation = _pollGeneration;
    const systemId = _selectedId;
    const entity = _dataSource.entities.getById(entityIdFor(systemId));
    const datastreamsResult = await source.getDatastreams().catch(() => null);
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
    const detailDatastreams = [];
    for (const datastream of datastreams) {
      const observationResult = await source
        .getObservation(datastream.id)
        .catch(() => null);
      if (generation !== _pollGeneration) return;
      const observation =
        observationResult && !observationResult.keyRequired
          ? observationResult.observation
          : null;
      detailDatastreams.push({
        id: datastream.id,
        name: datastream.name,
        outputName: datastream.outputName,
        observation,
      });
      if (observation?.location) {
        entity.position = Cesium.Cartesian3.fromDegrees(
          observation.location.lon,
          observation.location.lat,
          observation.location.alt || 0,
        );
      }
    }
    writeDetail({
      system: {
        id: systemId,
        uid: propertyValue(entity, 'uid'),
        name: propertyValue(entity, 'name'),
        description: propertyValue(entity, 'description'),
      },
      datastreams: detailDatastreams,
    });
  }

  function selectSystem(systemId) {
    if (_selectedId === systemId) return;
    _selectedId = systemId;
    stopPolling();
    _pollTimer = setInterval(() => {
      void pollSelected();
    }, POLL_INTERVAL_MS);
    void pollSelected();
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
      if (pickedId && pickedId.startsWith('osh:')) {
        selectSystem(pickedId.slice(4));
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
      _count = 0;
      _lastUpdate = null;
      _lastError = null;
      _keyRequired = false;
      _stale = false;
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
        const result = await source.getSystems({ signal: request.signal });
        if (request.signal.aborted || _request !== request || !_enabled) {
          release();
          return false;
        }
        _keyRequired = Boolean(result.keyRequired);
        if (_keyRequired) {
          _dataSource.entities.removeAll();
          _count = 0;
          _lastUpdate = Date.now();
          _lastError = null;
          _stale = false;
          clearSelection();
          release();
          return true;
        }
        const now = Cesium.JulianDate.now();
        const selectedEntity = _selectedId
          ? _dataSource.entities.getById(entityIdFor(_selectedId))
          : null;
        const selectedPosition = selectedEntity?.position?.getValue(now) ?? null;
        const nextEntities = [];
        for (const record of result.systems) {
          const isSelected = record.id === _selectedId;
          const position =
            isSelected && selectedPosition
              ? selectedPosition
              : Cesium.Cartesian3.fromDegrees(record.lon, record.lat, record.alt || 0);
          nextEntities.push(
            new Cesium.Entity({
              id: entityIdFor(record.id),
              position,
              point: {
                pixelSize: 10,
                color: Cesium.Color.LIME,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 1,
              },
              label: record.name
                ? {
                    text: record.name,
                    font: '12px sans-serif',
                    pixelOffset: new Cesium.Cartesian2(0, -16),
                  }
                : undefined,
              properties: {
                uid: record.uid,
                name: record.name,
                description: record.description,
              },
            }),
          );
        }
        _dataSource.entities.removeAll();
        for (const entity of nextEntities) _dataSource.entities.add(entity);
        _count = nextEntities.length;
        _lastUpdate = Date.now();
        _lastError = null;
        _stale = Boolean(result.stale);
        if (_selectedId && !result.systems.some((record) => record.id === _selectedId)) {
          clearSelection();
        }
        release();
        return true;
      } catch (error) {
        const stale = request.signal.aborted || _request !== request || !_enabled;
        release();
        if (stale) return false;
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
      if (_dataSource && viewer) viewer.dataSources.remove(_dataSource, true);
      _dataSource = null;
      _viewer = null;
      _count = 0;
      _lastUpdate = null;
      _lastError = null;
    },

    getStats() {
      return {
        count: _count,
        lastUpdate: _lastUpdate,
        error: _lastError,
        keyRequired: _keyRequired,
        stale: _stale,
        selectedId: _selectedId,
      };
    },
  };
  return layer;
}
