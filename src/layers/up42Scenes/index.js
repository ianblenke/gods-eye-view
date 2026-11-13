import * as Cesium from 'cesium';
import { createSceneImages } from './images.js';
import { scenesBox, searchWindow } from '../skywatchScenes/box.js';
import {
  LOADING_THUMBNAIL,
  NO_THUMBNAIL,
  STATUS_FAILED,
  describeFailure,
  describeReason,
  describeThumbnailFailure,
} from './messages.js';
import {
  dateOf,
  footprintCentre,
  footprintStyle,
  readoutText,
  sceneList,
  thumbnailSize,
} from './model.js';
import {
  ASKING,
  LOADING_PRODUCTS,
  NO_PRODUCTS,
  confirmText,
  describeQuote,
  describeQuoteFailure,
} from './quotes.js';
export { createUp42Source } from './source.js';

const ID = 'up42-scenes';
const CARD_ID = 'selected';
const SEARCH_LABEL = 'Search scenes here';
const SEARCHING_LABEL = 'Searching…';
const SHOW_IMAGES_LABEL = 'Show images';
const HIDE_IMAGES_LABEL = 'Hide images';
const QUOTE_LABEL = 'Quote tasking here';
const CONFIRM_LABEL = 'Confirm quote';
const CANCEL_LABEL = 'Cancel';
const CHOOSE_TEXT = 'Choose a product.';
const MAX_PRODUCT_CHIPS = 6;
const NO_KEY = describeFailure({ status: 0, error: 'no_credentials' });

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

/** The entity of the footprint of a scene, with the style of its selection. */
function footprintEntity(scene, selected, imagesOn) {
  const style = footprintStyle(selected);
  const color = Cesium.Color.fromCssColorString(style.color);
  const positions = Cesium.Cartesian3.fromDegreesArray(scene.ring.flat());
  return new Cesium.Entity({
    id: `${ID}:${scene.id}`,
    polyline: {
      positions,
      clampToGround: true,
      ...(imagesOn ? { zIndex: 25 } : {}),
      width: style.width,
      material: new Cesium.ColorMaterialProperty(
        color.withAlpha(style.outlineAlpha),
      ),
    },
    ...(style.fillAlpha > 0
      ? {
          polygon: {
            ...(imagesOn ? { zIndex: 25 } : {}),
            hierarchy: new Cesium.PolygonHierarchy(positions),
            material: new Cesium.ColorMaterialProperty(
              color.withAlpha(style.fillAlpha),
            ),
          },
        }
      : {}),
  });
}

/** The overlay entry of the thumbnail card of a scene. */
function cardEntry(scene, image, size) {
  const centre = footprintCentre(scene.ring);
  const date = dateOf(scene.time);
  return {
    id: CARD_ID,
    position: Cesium.Cartesian3.fromDegrees(centre.lon, centre.lat),
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
 * The layer of UP42 scenes. It sends a search only when a person presses
 * its chip, and sends no search again by itself after an error. A selection of a
 * scene in the list of the row sends one thumbnail request.
 */
export function createUp42ScenesLayer({
  source,
  overlayHost,
  now = Date.now,
  requestRender = () => {},
  decodeImage = (blob) => globalThis.createImageBitmap(blob),
} = {}) {
  if (
    typeof source?.getStatus !== 'function' ||
    typeof source?.searchScenes !== 'function' ||
    typeof source?.getThumbnail !== 'function'
  )
    throw new TypeError(
      'UP42 Scenes requires a source with getStatus, searchScenes and getThumbnail',
    );
  if (
    typeof overlayHost?.setEntries !== 'function' ||
    typeof overlayHost?.clearSource !== 'function' ||
    typeof overlayHost?.setVisible !== 'function'
  )
    throw new TypeError(
      'UP42 Scenes requires an overlay host with setEntries, clearSource and setVisible',
    );
  let _viewer = null;
  let _dataSource = null;
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
  let _quoteStep = 'idle';
  let _products = [];
  let _product = null;
  let _quoteRequest = null;
  let _quoteMessage = null;

  let _imagesOn = false;
  const notify = () => _listener?.();
  const sceneImages = createSceneImages({
    source,
    decodeImage,
    entities: () => _dataSource.entities,
    changed: () => {
      requestRender(ID);
      notify();
    },
  });

  function imagesUnavailable() {
    return (
      !_answer?.scenes.some((scene) => scene.thumbnail) || _configured === false
    );
  }

  function toggleImages() {
    if (!_enabled || imagesUnavailable()) return;
    releaseCard();
    _imagesOn = !_imagesOn;
    if (_imagesOn) sceneImages.start(_answer.scenes);
    else sceneImages.release();
    showScenes();
    notify();
  }

  function showScenes() {
    for (const entity of _dataSource.entities.values.slice()) {
      if (entity.polyline) _dataSource.entities.remove(entity);
    }
    for (const scene of _answer.scenes) {
      _dataSource.entities.add(
        footprintEntity(scene, scene.id === _selectedId, _imagesOn),
      );
    }
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
        overlayHost.setEntries(ID, [cardEntry(scene, image, size)], {
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
    if (!_imagesOn) {
      if (scene?.thumbnail) void loadThumbnail(scene);
      else if (scene) _thumbMessage = NO_THUMBNAIL;
    }
    notify();
    return true;
  }

  const hasQuotes =
    typeof source.getProducts === 'function' &&
    typeof source.getQuote === 'function';

  function quoteReset() {
    _quoteRequest?.abort();
    _quoteRequest = null;
    _quoteStep = 'idle';
    _products = [];
    _product = null;
    _quoteMessage = null;
  }

  async function startQuote() {
    if (!_enabled || _quoteStep !== 'idle' || _configured === false) return;
    const request = new AbortController();
    _quoteRequest = request;
    _quoteStep = 'loading';
    _quoteMessage = LOADING_PRODUCTS;
    notify();
    let result;
    try {
      result = await source.getProducts({ signal: request.signal });
    } catch {
      result = { ok: false, status: 0, error: 'unreachable' };
    }
    if (_quoteRequest !== request) return;
    _quoteRequest = null;
    if (result.ok && result.products.length > 0) {
      _products = result.products;
      _quoteStep = 'choose';
      _quoteMessage = CHOOSE_TEXT;
    } else {
      _quoteStep = 'idle';
      _quoteMessage = result.ok ? NO_PRODUCTS : describeQuoteFailure(result);
    }
    notify();
  }

  function chooseProduct(product) {
    if (_quoteStep !== 'choose') return;
    _product = product;
    _quoteStep = 'confirm';
    _quoteMessage = confirmText(product.title);
    notify();
  }

  function cancelQuote() {
    if (_quoteStep !== 'choose' && _quoteStep !== 'confirm') return;
    quoteReset();
    notify();
  }

  async function confirmQuote() {
    if (!_enabled || _quoteStep !== 'confirm') return;
    const box = scenesBox(viewCentre(_viewer));
    if (!box.ok) {
      _quoteMessage = describeReason(box.reason);
      notify();
      return;
    }
    const request = new AbortController();
    _quoteRequest = request;
    _quoteStep = 'asking';
    _quoteMessage = ASKING;
    notify();
    let result;
    try {
      result = await source.getQuote({
        dataProduct: _product.id,
        box: box.bbox,
        signal: request.signal,
      });
    } catch {
      result = { ok: false, status: 0, error: 'unreachable' };
    }
    if (_quoteRequest !== request) return;
    _quoteRequest = null;
    _quoteStep = 'idle';
    _products = [];
    _product = null;
    _quoteMessage = result.ok
      ? describeQuote(result)
      : describeQuoteFailure(result);
    notify();
  }

  function quoteChips() {
    if (!hasQuotes || !_enabled || _answer === null) return [];
    if (_quoteStep === 'choose') {
      return [
        ..._products.slice(0, MAX_PRODUCT_CHIPS).map((product, index) => ({
          id: `quote-product-${index}`,
          label: product.title,
          onClick: () => chooseProduct(product),
        })),
        { id: 'quote-cancel', label: CANCEL_LABEL, onClick: cancelQuote },
      ];
    }
    if (_quoteStep === 'confirm') {
      return [
        { id: 'quote-confirm', label: CONFIRM_LABEL, onClick: confirmQuote },
        { id: 'quote-cancel', label: CANCEL_LABEL, onClick: cancelQuote },
      ];
    }
    return [
      {
        id: 'quote',
        label: QUOTE_LABEL,
        disabled: _quoteStep !== 'idle' || _configured === false,
        onClick: startQuote,
      },
    ];
  }

  function reset() {
    quoteReset();
    sceneImages.release();
    _imagesOn = false;
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
    quoteReset();
    const request = new AbortController();
    _request = request;
    notify();
    let result;
    try {
      result = await source.searchScenes({
        box: box.bbox,
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
      if (_imagesOn) {
        sceneImages.release();
        _imagesOn = _answer.scenes.some((scene) => scene.thumbnail);
        if (_imagesOn) sceneImages.start(_answer.scenes);
      }
      showScenes();
    } else {
      _pressMessage = describeFailure(result);
      _lastError = _pressMessage;
    }
    notify();
  }

  return {
    id: ID,
    name: 'UP42 Scenes',
    icon: '🔭',
    source: 'UP42',
    updateInterval: 0,

    init(viewer) {
      if (_viewer) throw new Error('UP42 Scenes layer is already initialized');
      _viewer = viewer;
      _dataSource = new Cesium.CustomDataSource(ID);
      _dataSource.show = false;
      viewer.dataSources.add(_dataSource);
      overlayHost.setVisible(ID, false);
    },

    enable() {
      _enabled = true;
      _dataSource.show = true;
      overlayHost.setVisible(ID, true);
    },

    disable() {
      reset();
      _enabled = false;
      _dataSource.show = false;
      _dataSource.entities.removeAll();
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
        status = {
          ok: false,
          unavailable: error?.code === 'unavailable',
        };
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
        _statusError =
          status.unavailable === true
            ? `Data source not configured: ${ID}`
            : STATUS_FAILED;
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
              ...(!imagesUnavailable()
                ? [
                    {
                      id: 'images',
                      label: _imagesOn ? HIDE_IMAGES_LABEL : SHOW_IMAGES_LABEL,
                      onClick: toggleImages,
                    },
                  ]
                : []),
              ...quoteChips(),
            ]
          : [],
        info: readoutText({
          message: _quoteMessage ?? _pressMessage ?? _statusMessage,
          answer: _answer,
          thumbMessage: _imagesOn ? sceneImages.text() : _thumbMessage,
        }),
        list: sceneList({ answer: _answer, selectedId: _selectedId }),
      };
    },

    setRowControlsListener(listener) {
      _listener = listener;
    },

    destroy(viewer = _viewer) {
      if (!_dataSource) return;
      reset();
      _enabled = false;
      _viewer = null;
      overlayHost.setVisible(ID, false);
      viewer.dataSources.remove(_dataSource, true);
      _dataSource = null;
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
