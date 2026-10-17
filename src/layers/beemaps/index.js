import * as Cesium from 'cesium';
import { framesBox } from './box.js';
import { STATUS_FAILED, describeFailure, describeReason } from './messages.js';
import { pointStyle, readoutText } from './model.js';
export { createBeemapsSource } from './source.js';

const FETCH_LABEL = 'Fetch frames here';
const FETCHING_LABEL = 'Fetching…';
const NO_KEY = describeFailure({ status: 0, error: 'no_key' });

/** The point under the middle of the screen, or null when it shows the sky. */
function viewCentre(viewer) {
  const canvas = viewer.scene?.canvas;
  if (!canvas?.clientWidth || !canvas?.clientHeight) return null;
  let hit;
  try {
    hit = viewer.camera.pickEllipsoid(
      new Cesium.Cartesian2(canvas.clientWidth / 2, canvas.clientHeight / 2),
      viewer.scene.globe?.ellipsoid,
    );
  } catch {
    return null;
  }
  if (!hit) return null;
  const position = Cesium.Cartographic.fromCartesian(hit);
  return {
    lat: Cesium.Math.toDegrees(position.latitude),
    lon: Cesium.Math.toDegrees(position.longitude),
  };
}

/**
 * The layer of Bee Maps frames. It sends a request for frames only when a
 * person presses its button, and never sends a request again after an error.
 */
export function createBeemapsLayer({ source, now = Date.now } = {}) {
  if (
    typeof source?.getStatus !== 'function' ||
    typeof source?.getFrames !== 'function'
  )
    throw new TypeError(
      'Bee Maps requires a source with getStatus and getFrames',
    );
  let _viewer = null;
  let _dataSource = null;
  let _enabled = false;
  let _statusRequest = null;
  let _request = null;
  let _configured = null;
  let _statusMessage = null;
  let _pressMessage = null;
  let _answer = null;
  let _lastUpdate = null;
  let _lastError = null;
  let _statusError = null;
  let _listener = null;

  const notify = () => _listener?.();

  function showFrames(frames) {
    _dataSource.entities.removeAll();
    const time = now();
    for (const frame of frames) {
      const style = pointStyle(frame.time, time);
      _dataSource.entities.add(
        new Cesium.Entity({
          id: `beemaps:${frame.id}`,
          position: Cesium.Cartesian3.fromDegrees(frame.lon, frame.lat),
          point: {
            pixelSize: style.size,
            color: Cesium.Color.fromCssColorString(style.color).withAlpha(
              style.alpha,
            ),
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
        }),
      );
    }
  }

  function reset() {
    _statusRequest?.abort();
    _statusRequest = null;
    _request?.abort();
    _request = null;
    _configured = null;
    _statusMessage = null;
    _pressMessage = null;
    _answer = null;
    _lastUpdate = null;
    _lastError = null;
    _statusError = null;
  }

  async function press() {
    if (!_enabled || _request || _configured === false) return;
    const box = framesBox(viewCentre(_viewer));
    if (!box.ok) {
      _pressMessage = describeReason(box.reason);
      _lastError = _pressMessage;
      notify();
      return;
    }
    const request = new AbortController();
    _request = request;
    notify();
    let result;
    try {
      result = await source.getFrames({
        bbox: box.bbox,
        signal: request.signal,
      });
    } catch {
      result = { ok: false, status: 0, error: 'unreachable' };
    }
    if (_request !== request) return;
    _request = null;
    if (result.ok) {
      _answer = result.answer;
      _pressMessage = null;
      _lastError = null;
      if (_statusError !== null) {
        _statusError = null;
        _statusMessage = null;
      }
      _lastUpdate = now();
      showFrames(_answer.frames);
    } else {
      _pressMessage = describeFailure(result);
      _lastError = _pressMessage;
    }
    notify();
  }

  return {
    id: 'beemaps',
    name: 'Bee Maps Frames',
    icon: '📸',
    source: 'Bee Maps',
    updateInterval: 0,

    init(viewer) {
      if (_viewer) throw new Error('Bee Maps layer is already initialized');
      _viewer = viewer;
      _dataSource = new Cesium.CustomDataSource('beemaps');
      _dataSource.show = false;
      viewer.dataSources.add(_dataSource);
    },

    enable() {
      _enabled = true;
      _dataSource.show = true;
    },

    disable() {
      reset();
      _enabled = false;
      _dataSource.show = false;
      _dataSource.entities.removeAll();
    },

    async update() {
      if (!_enabled) return false;
      _statusRequest?.abort();
      const request = new AbortController();
      _statusRequest = request;
      let status;
      try {
        status = await source.getStatus({ signal: request.signal });
      } catch (error) {
        status = { ok: false, error: error?.message };
      }
      if (_statusRequest !== request) return false;
      _statusRequest = null;
      if (status.ok) {
        _configured = status.configured;
        _statusMessage = status.configured ? null : NO_KEY;
        _statusError = null;
      } else {
        _configured = null;
        _statusMessage = STATUS_FAILED;
        _statusError = status.error || STATUS_FAILED;
      }
      notify();
      return true;
    },

    getRowControls() {
      return {
        chips: _enabled
          ? [
              {
                id: 'fetch',
                label: _request ? FETCHING_LABEL : FETCH_LABEL,
                disabled: Boolean(_request) || _configured === false,
                onClick: press,
              },
            ]
          : [],
        info: readoutText({
          message: _pressMessage ?? _statusMessage,
          answer: _answer,
        }),
      };
    },

    setRowControlsListener(listener) {
      _listener = listener;
    },

    destroy(viewer = _viewer) {
      reset();
      _enabled = false;
      _viewer = null;
      if (_dataSource) {
        viewer.dataSources.remove(_dataSource, true);
        _dataSource = null;
      }
    },

    getStats() {
      return {
        count: _answer?.frames.length ?? 0,
        lastUpdate: _lastUpdate,
        error: _lastError ?? _statusError,
      };
    },
  };
}
