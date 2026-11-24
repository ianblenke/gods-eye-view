import { fromDegrees } from '../../geo/ellipsoid.js';
import { drawOf } from '../../render/rendererOf.js';
import { cssColor } from '../../render/color.js';
import { msg } from '../../i18n/index.js';
import {
  GDACS_COLLISION_CAPACITY,
  GDACS_LABEL_LIMIT,
  GDACS_OVERLAY_SOURCE_ID,
  createLabelEntry,
  pointStyle,
  selectLabelCohort,
} from './model.js';
export * from './model.js';
export { createGdacsSource } from './source.js';

const SOURCE_ID = GDACS_OVERLAY_SOURCE_ID;

/** Own the display of the GDACS events and its refresh lifecycle. */
export function createGdacsLayer({ source, overlayHost } = {}) {
  if (typeof source?.getSnapshot !== 'function')
    throw new TypeError('GDACS requires a snapshot source');
  if (!overlayHost) throw new TypeError('GDACS requires an overlay host');
  let _viewer = null;
  let _request = null;
  let _points = null;
  let _count = 0;
  let _lastUpdate = null;
  let _lastError = null;
  let _guidance = null;
  let _enabled = false;

  function createPoint(item, position) {
    const style = pointStyle(item);
    const [r, g, b] = cssColor(style.color);
    return {
      id: `gdacs:${item.id}`,
      pos: position,
      pixelSize: style.size,
      color: [r, g, b, style.alpha],
      height: 'clampGround',
    };
  }

  function showEvents(events) {
    const positions = new Map();
    const points = events.map((item) => {
      const position = fromDegrees(item.longitude, item.latitude);
      positions.set(item.id, position);
      return createPoint(item, position);
    });
    _points.set(points);
    overlayHost.setEntries(
      SOURCE_ID,
      selectLabelCohort(events).map((item, index) =>
        createLabelEntry({ item, position: positions.get(item.id), index }),
      ),
      {
        cohortLimit: GDACS_LABEL_LIMIT,
        collisionCapacity: GDACS_COLLISION_CAPACITY,
        moving: false,
      },
    );
  }

  function clearEvents() {
    _points.clear();
    overlayHost.clearSource(SOURCE_ID);
  }

  return {
    id: 'gdacs',
    name: 'Disaster Alerts',
    icon: '🚨',
    source: 'GDACS',
    updateInterval: 600000,

    init(viewer) {
      if (_viewer) throw new Error('GDACS layer is already initialized');
      _viewer = viewer;
      _points = drawOf(viewer).points({ id: 'gdacs:points', show: false });
      overlayHost.setVisible(SOURCE_ID, false);
    },

    enable() {
      _enabled = true;
      _points.show = true;
      overlayHost.setVisible(SOURCE_ID, true);
    },

    disable() {
      _request?.abort();
      _request = null;
      _enabled = false;
      _points.show = false;
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
        const { events, meta } = await source.getSnapshot({
          signal: request.signal,
        });
        if (_request === request) {
          if (meta.unavailable) {
            clearEvents();
            _count = 0;
            _guidance = meta.reason || msg('GDACS unavailable');
          } else {
            showEvents(events);
            _count = events.length;
            _guidance = null;
          }
          _lastUpdate = Date.now();
          _lastError = null;
          updated = true;
        }
      } catch (error) {
        if (_request === request)
          _lastError = error?.message || msg('GDACS source unavailable');
      } finally {
        if (_request === request) _request = null;
      }
      return updated;
    },

    destroy() {
      _request?.abort();
      _request = null;
      _viewer = null;
      _enabled = false;
      overlayHost.clearSource(SOURCE_ID);
      overlayHost.setVisible(SOURCE_ID, false);
      _points?.dispose();
      _points = null;
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
