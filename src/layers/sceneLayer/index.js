import { fromDegrees } from '../../geo/ellipsoid.js';
import { drawOf } from '../../render/rendererOf.js';
import { scenesBox, searchWindow } from '../skywatchScenes/box.js';
import { footprintItems, viewCentre } from '../skywatchScenes/view.js';
import { messagesFor } from './messages.js';
import { modelFor } from './model.js';
import { serviceOf } from './services.js';
export { createSceneSource } from './source.js';

const CARD_ID = 'selected';
const SEARCH_LABEL = 'Search scenes here';
const SEARCHING_LABEL = 'Searching…';

/** The overlay entry of the thumbnail card of a scene. */
function cardEntry(scene, image, size, { dateOf, footprintCentre }) {
  const centre = footprintCentre(scene.rings[0]);
  const date = dateOf(scene.time);
  return {
    id: CARD_ID,
    position: fromDegrees(centre.lon, centre.lat),
    variant: 'thumbnail',
    paintLane: 'thumbnail',
    title: scene.provider === null ? date : `${date} ${scene.provider}`,
    details: [],
    image,
    requireImage: true,
    thumbnailWidth: size.width,
    thumbnailHeight: size.height,
    priority: 1_000_000,
    protected: true,
    active: true,
    interactive: false,
    collisionGroup: 'ambient-card',
    zIndex: 50,
    minDistance: 0,
    horizonCull: true,
    terrainOcclusion: false,
  };
}

/**
 * The layer of the scenes of one service. It sends a search only when a
 * person presses its chip, and never sends a search again after an error. A
 * selection of a scene in the list of the row sends one thumbnail request.
 * @param {'planet'|'skyfi'} serviceName
 */
export function createSceneLayer(
  serviceName,
  {
    source,
    overlayHost,
    now = Date.now,
    requestRender = () => {},
    decodeImage = (blob) => globalThis.createImageBitmap(blob),
  } = {},
) {
  const service = serviceOf(serviceName);
  const ID = service.layer;
  const messages = messagesFor(serviceName);
  const model = modelFor(serviceName);
  const {
    LOADING_THUMBNAIL,
    NO_THUMBNAIL,
    STATUS_FAILED,
    describeFailure,
    describeReason,
    describeThumbnailFailure,
  } = messages;
  const { footprintStyle, readoutText, sceneList, thumbnailSize } = model;
  const NO_KEY = describeFailure({ status: 0, error: 'no_key' });
  if (
    typeof source?.getStatus !== 'function' ||
    typeof source?.searchScenes !== 'function' ||
    typeof source?.getThumbnail !== 'function'
  )
    throw new TypeError(
      `${service.name} requires a source with getStatus, searchScenes and getThumbnail`,
    );
  if (
    typeof overlayHost?.setEntries !== 'function' ||
    typeof overlayHost?.clearSource !== 'function' ||
    typeof overlayHost?.setVisible !== 'function'
  )
    throw new TypeError(
      `${service.name} requires an overlay host with setEntries, clearSource and setVisible`,
    );
  let _viewer = null;
  let _lines = null;
  let _fills = null;
  let _enabled = false;
  let _statusRequest = null;
  let _request = null;
  let _thumbRequest = null;
  let _configured = null;
  let _statusMessage = null;
  let _pressMessage = null;
  let _thumbMessage = null;
  let _answer = null;
  let _selectedId = null;
  let _image = null;
  let _lastUpdate = null;
  let _lastError = null;
  let _statusError = null;
  let _listener = null;

  const notify = () => _listener?.();

  function showScenes() {
    const lines = [];
    const fills = [];
    for (const scene of _answer.scenes) {
      const items = footprintItems(
        (index) =>
          index === 0 ? `${ID}:${scene.id}` : `${ID}:${scene.id}:${index}`,
        scene.rings,
        footprintStyle(scene.id === _selectedId),
      );
      lines.push(...items.lines);
      fills.push(...items.fills);
    }
    _lines.set(lines);
    _fills.set(fills);
    requestRender(ID);
  }

  /** Stop the thumbnail request, close the image and remove the card. */
  function releaseCard() {
    _thumbRequest?.abort();
    _thumbRequest = null;
    _thumbMessage = null;
    _image?.close();
    _image = null;
    overlayHost.clearSource(ID);
  }

  async function loadThumbnail(scene) {
    const request = new AbortController();
    _thumbRequest = request;
    _thumbMessage = LOADING_THUMBNAIL;
    let result;
    try {
      result = await source.getThumbnail({
        id: scene.id,
        signal: request.signal,
      });
    } catch {
      result = { ok: false, status: 0, error: 'unreachable' };
    }
    if (_thumbRequest !== request) return;
    if (result.ok) {
      let image = null;
      try {
        image = await decodeImage(result.blob);
      } catch {
        image = null;
      }
      if (_thumbRequest !== request) {
        image?.close();
        return;
      }
      const size = image ? thumbnailSize(image.width, image.height) : null;
      if (size === null) {
        image?.close();
        result = { ok: false, status: 0, error: 'bad_image' };
      } else {
        _image = image;
        overlayHost.setEntries(ID, [cardEntry(scene, image, size, model)], {
          cohortLimit: 1,
          moving: false,
        });
      }
    }
    _thumbRequest = null;
    _thumbMessage = result.ok ? null : describeThumbnailFailure(result);
    notify();
  }

  function select(id) {
    if (id === _selectedId) return true;
    releaseCard();
    _selectedId = id;
    showScenes();
    const scene = _answer.scenes.find((item) => item.id === id);
    if (scene?.thumbnail) void loadThumbnail(scene);
    else if (scene) _thumbMessage = NO_THUMBNAIL;
    notify();
    return true;
  }

  function reset() {
    _statusRequest?.abort();
    _statusRequest = null;
    _request?.abort();
    _request = null;
    releaseCard();
    _selectedId = null;
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
    const box = scenesBox(viewCentre(_viewer));
    if (!box.ok) {
      _pressMessage = describeReason(box.reason);
      _lastError = _pressMessage;
      notify();
      return;
    }
    const { start, end } = searchWindow(now());
    const request = new AbortController();
    _request = request;
    notify();
    let result;
    try {
      result = await source.searchScenes({
        bbox: box.bbox,
        start,
        end,
        signal: request.signal,
      });
    } catch {
      result = { ok: false, status: 0, error: 'unreachable' };
    }
    if (_request !== request) return;
    _request = null;
    if (result.ok) {
      releaseCard();
      _selectedId = null;
      _answer = result.answer;
      _pressMessage = null;
      _lastError = null;
      if (_statusError !== null) {
        _statusError = null;
        _statusMessage = null;
      }
      _lastUpdate = now();
      showScenes();
    } else {
      _pressMessage = describeFailure(result);
      _lastError = _pressMessage;
    }
    notify();
  }

  return {
    id: ID,
    name: service.name,
    icon: service.icon,
    source: service.label,
    updateInterval: 0,

    init(viewer) {
      if (_viewer)
        throw new Error(`${service.name} layer is already initialized`);
      _viewer = viewer;
      const draw = drawOf(viewer);
      _lines = draw.lines({ id: `${ID}:lines`, clampTo: 'both', show: false });
      _fills = draw.shapes({ id: `${ID}:fills`, clampTo: 'both', show: false });
      overlayHost.setVisible(ID, false);
    },

    enable() {
      _enabled = true;
      _lines.show = _fills.show = true;
      overlayHost.setVisible(ID, true);
    },

    disable() {
      reset();
      _enabled = false;
      _lines.show = _fills.show = false;
      _lines.clear();
      _fills.clear();
      overlayHost.setVisible(ID, false);
      requestRender(ID);
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

    /** Select the scene `{scene:<id>}` of the answer, or none with `{scene:null}`. */
    setParams(params) {
      if (!_enabled || params === null || typeof params !== 'object') {
        return false;
      }
      const keys = Object.keys(params);
      if (keys.length !== 1 || keys[0] !== 'scene') return false;
      const { scene } = params;
      if (scene === null) return select(null);
      if (!_answer?.scenes.some((item) => item.id === scene)) return false;
      return select(scene);
    },

    getRowControls() {
      return {
        chips: _enabled
          ? [
              {
                id: 'search',
                label: _request ? SEARCHING_LABEL : SEARCH_LABEL,
                disabled: Boolean(_request) || _configured === false,
                onClick: press,
              },
            ]
          : [],
        info: readoutText({
          message: _pressMessage ?? _statusMessage,
          answer: _answer,
          thumbMessage: _thumbMessage,
        }),
        list: sceneList({ answer: _answer, selectedId: _selectedId }),
      };
    },

    setRowControlsListener(listener) {
      _listener = listener;
    },

    destroy() {
      if (!_lines) return;
      reset();
      _enabled = false;
      _viewer = null;
      overlayHost.setVisible(ID, false);
      _lines.dispose();
      _fills.dispose();
      _lines = _fills = null;
      requestRender(ID);
    },

    getStats() {
      return {
        count: _answer?.scenes.length ?? 0,
        lastUpdate: _lastUpdate,
        error: _lastError ?? _statusError,
      };
    },
  };
}
