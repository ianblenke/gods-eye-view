import * as Cesium from 'cesium';
import {
  RETICULUM_COLLISION_CAPACITY,
  RETICULUM_LABEL_LIMIT,
  RETICULUM_OVERLAY_SOURCE_ID,
  createLabelEntry,
  pointStyle,
  selectLabelCohort,
} from './model.js';
export * from './model.js';
export { createReticulumSource } from './source.js';

const SOURCE_ID = RETICULUM_OVERLAY_SOURCE_ID;

/** Own the display of the Reticulum interfaces and its refresh lifecycle. */
export function createReticulumLayer({ source, overlayHost } = {}) {
  if (typeof source?.getSnapshot !== 'function')
    throw new TypeError('Reticulum requires a snapshot source');
  if (!overlayHost) throw new TypeError('Reticulum requires an overlay host');
  let _viewer = null;
  let _request = null;
  let _dataSource = null;
  let _count = 0;
  let _lastUpdate = null;
  let _lastError = null;
  let _guidance = null;
  let _enabled = false;

  function createPoint(item, position) {
    const style = pointStyle(item);
    return new Cesium.Entity({
      id: `reticulum:${item.id}`,
      position,
      point: {
        pixelSize: style.size,
        color: Cesium.Color.fromCssColorString(style.color).withAlpha(
          style.alpha,
        ),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
  }

  function showInterfaces(interfaces) {
    const positions = new Map();
    const points = interfaces.map((item) => {
      const position = Cesium.Cartesian3.fromDegrees(
        item.longitude,
        item.latitude,
      );
      positions.set(item.id, position);
      return createPoint(item, position);
    });
    _dataSource.entities.removeAll();
    for (const point of points) _dataSource.entities.add(point);
    overlayHost.setEntries(
      SOURCE_ID,
      selectLabelCohort(interfaces).map((item, index) =>
        createLabelEntry({ item, position: positions.get(item.id), index }),
      ),
      {
        cohortLimit: RETICULUM_LABEL_LIMIT,
        collisionCapacity: RETICULUM_COLLISION_CAPACITY,
        moving: false,
      },
    );
  }

  function clearInterfaces() {
    _dataSource.entities.removeAll();
    overlayHost.clearSource(SOURCE_ID);
  }

  return {
    id: 'reticulum',
    name: 'Reticulum Network',
    icon: '📡',
    source: 'Reticulum discovery',
    updateInterval: 300000,

    init(viewer) {
      if (_viewer) throw new Error('Reticulum layer is already initialized');
      _viewer = viewer;
      _dataSource = new Cesium.CustomDataSource('reticulum');
      _dataSource.show = false;
      viewer.dataSources.add(_dataSource);
      overlayHost.setVisible(SOURCE_ID, false);
    },

    enable() {
      _enabled = true;
      _dataSource.show = true;
      overlayHost.setVisible(SOURCE_ID, true);
    },

    disable() {
      _request?.abort();
      _request = null;
      _enabled = false;
      _dataSource.show = false;
      overlayHost.clearSource(SOURCE_ID);
      overlayHost.setVisible(SOURCE_ID, false);
    },

    async update() {
      if (!_enabled) return false;
      _request?.abort();
      const request = new AbortController();
      _request = request;
      let updated = false;
      try {
        const { interfaces, meta } = await source.getSnapshot({
          signal: request.signal,
        });
        if (!request.signal.aborted && _request === request) {
          if (meta.unavailable) {
            clearInterfaces();
            _count = 0;
            _guidance = meta.reason;
          } else {
            showInterfaces(interfaces);
            _count = interfaces.length;
            _guidance = null;
          }
          _lastUpdate = Date.now();
          _lastError = null;
          updated = true;
        }
      } catch (error) {
        if (!request.signal.aborted && _request === request)
          _lastError = error?.message || 'Reticulum source unavailable';
      } finally {
        if (_request === request) _request = null;
      }
      return updated;
    },

    destroy(viewer = _viewer) {
      _request?.abort();
      _request = null;
      _viewer = null;
      _enabled = false;
      overlayHost.clearSource(SOURCE_ID);
      overlayHost.setVisible(SOURCE_ID, false);
      if (_dataSource) {
        viewer.dataSources.remove(_dataSource, true);
        _dataSource = null;
      }
      _count = 0;
      _lastUpdate = null;
      _lastError = null;
      _guidance = null;
    },

    getStats() {
      return {
        count: _count,
        lastUpdate: _lastUpdate,
        error: _lastError,
        ...(_guidance ? { status: 'idle', statusMessage: _guidance } : {}),
      };
    },
  };
}
