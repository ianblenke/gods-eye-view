import * as Cesium from 'cesium';
import { burstBox } from './box.js';
import {
  QUOTE_ENDED,
  STATUS_FAILED,
  describeCreated,
  describeFailure,
  describeReason,
  describeUnknown,
} from './messages.js';
import {
  LABELS,
  QUOTE_STYLE,
  TITLES,
  burstStyle,
  confirmLabel,
  readoutText,
} from './model.js';
export { createBeemapsBurstSource } from './source.js';

const QUOTE_ENTITY_ID = 'beemaps-bursts:quote';
const CONFIRM_LOCK_MS = 1000;
const SOURCE_METHODS = ['getStatus', 'quote', 'confirm', 'list'];

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

/** An idempotency key of 32 hexadecimal characters. */
function randomKey() {
  const bytes = globalThis.crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

/**
 * The layer of Bee Maps bursts. A confirm request leaves only after a person
 * presses "quote" and then the Confirm chip of that quote. The layer never
 * sends a request again after an error.
 */
export function createBeemapsBurstsLayer({
  source,
  now = Date.now,
  makeKey = randomKey,
  setTimer = setTimeout,
  clearTimer = clearTimeout,
} = {}) {
  if (SOURCE_METHODS.some((name) => typeof source?.[name] !== 'function'))
    throw new TypeError(
      'Bee Maps Bursts requires a source with getStatus, quote, confirm and list',
    );
  let _viewer = null;
  let _dataSource = null;
  let _enabled = false;
  let _statusRequest = null;
  let _request = null;
  let _requestKind = null;
  let _usable = null;
  let _statusMessage = null;
  let _message = null;
  let _quote = null;
  let _quoteTimer = null;
  let _unlockTimer = null;
  let _confirming = null;
  let _confirmText = null;
  let _list = null;
  let _created = [];
  let _lastUpdate = null;
  let _lastError = null;
  let _statusError = null;
  let _listener = null;

  const notify = () => _listener?.();

  function addBox(id, bbox, style) {
    if (_dataSource.entities.getById(id)) return;
    _dataSource.entities.add(
      new Cesium.Entity({
        id,
        rectangle: {
          coordinates: Cesium.Rectangle.fromDegrees(...bbox),
          material: Cesium.Color.fromCssColorString(style.color).withAlpha(
            style.alpha,
          ),
        },
      }),
    );
  }

  /** The bursts of the last list, then the bursts that a confirm created and the list lacks. */
  function knownBursts() {
    const listed = _list?.bursts ?? [];
    const ids = new Set(listed.map((burst) => burst.id));
    return [...listed, ..._created.filter((burst) => !ids.has(burst.id))];
  }

  function draw() {
    if (!_dataSource) return;
    _dataSource.entities.removeAll();
    if (_quote) addBox(QUOTE_ENTITY_ID, _quote.bbox, QUOTE_STYLE);
    for (const burst of knownBursts()) {
      if (burst.bbox) {
        addBox(`beemaps-bursts:${burst.id}`, burst.bbox, burstStyle(burst));
      }
    }
  }

  function clearQuoteTimers() {
    if (_quoteTimer !== null) clearTimer(_quoteTimer);
    _quoteTimer = null;
    if (_unlockTimer !== null) clearTimer(_unlockTimer);
    _unlockTimer = null;
  }

  function clearQuote() {
    clearQuoteTimers();
    _quote = null;
  }

  function unlock() {
    _unlockTimer = null;
    notify();
  }

  function expire() {
    clearQuote();
    _message = QUOTE_ENDED;
    draw();
    notify();
  }

  function reset() {
    _statusRequest?.abort();
    _statusRequest = null;
    _request?.abort();
    _request = null;
    _requestKind = null;
    clearQuote();
    _usable = null;
    _statusMessage = null;
    _message = null;
    _list = null;
    _created = [];
    _lastUpdate = null;
    _lastError = null;
    _statusError = null;
    draw();
  }

  /** A good answer of a press also clears the text of a failed status. */
  function clearStatusFailure() {
    if (_statusError !== null) {
      _statusError = null;
      _statusMessage = null;
    }
  }

  async function pressQuote() {
    if (!_enabled || _request || _confirming || _quote || _usable === false) {
      return;
    }
    const box = burstBox(viewCentre(_viewer));
    if (!box.ok) {
      _message = describeReason(box.reason);
      _lastError = _message;
      notify();
      return;
    }
    const request = new AbortController();
    _request = request;
    _requestKind = 'quote';
    notify();
    let result;
    try {
      result = await source.quote({ bbox: box.bbox, signal: request.signal });
    } catch {
      result = { ok: false, status: 0, error: 'unreachable' };
    }
    if (_request !== request) return;
    _request = null;
    _requestKind = null;
    if (result.ok) {
      const seconds = result.quote.expiresInSeconds;
      const shown = now();
      _quote = {
        ...result.quote,
        key: makeKey(),
        endsAt: shown + seconds * 1000,
        unlocksAt: shown + CONFIRM_LOCK_MS,
      };
      _quoteTimer = setTimer(expire, seconds * 1000);
      _unlockTimer = setTimer(unlock, CONFIRM_LOCK_MS);
      _confirmText = null;
      _message = null;
      _lastError = null;
      clearStatusFailure();
      draw();
    } else {
      _message = describeFailure(result);
      _lastError = _message;
    }
    notify();
  }

  async function pressList() {
    if (!_enabled || _request || _confirming || _usable === false) return;
    const request = new AbortController();
    _request = request;
    _requestKind = 'list';
    notify();
    let result;
    try {
      result = await source.list({ signal: request.signal });
    } catch {
      result = { ok: false, status: 0, error: 'unreachable' };
    }
    if (_request !== request) return;
    _request = null;
    _requestKind = null;
    if (result.ok) {
      _list = {
        bursts: result.bursts,
        total: result.total,
        cached: result.cached,
      };
      _lastUpdate = now();
      _message = null;
      _lastError = null;
      clearStatusFailure();
      draw();
    } else {
      _message = describeFailure(result);
      _lastError = _message;
    }
    notify();
  }

  function pressCancel() {
    if (!_enabled || !_quote || _confirming) return;
    clearQuote();
    draw();
    notify();
  }

  /** Show what the answer of a confirm says. A created burst joins the list. */
  function showConfirm(quote, result) {
    if (result?.outcome === 'created') {
      const credits = result.burst.credits ?? quote.credits;
      _confirmText = describeCreated({
        credits,
        creditsRemaining: result.creditsRemaining,
      });
      _lastError = null;
      _lastUpdate = now();
      _created = [
        ..._created,
        {
          id: result.burst.id,
          status: result.burst.status,
          isHit: false,
          bbox: quote.bbox,
        },
      ];
    } else {
      _confirmText =
        result?.outcome === 'refused'
          ? describeFailure(result)
          : describeUnknown(result ?? {});
      _lastError = _confirmText;
    }
  }

  /** The one place that sends a confirm request. The chip is already disabled. */
  async function pressConfirm(quote) {
    if (!_enabled || _quote !== quote || _confirming || _request) return;
    if (now() < quote.unlocksAt) return;
    if (now() >= quote.endsAt) {
      expire();
      return;
    }
    _confirming = quote;
    clearQuoteTimers();
    notify();
    let result;
    try {
      result = await source.confirm({
        quoteId: quote.quoteId,
        idempotencyKey: quote.key,
      });
    } catch {
      result = { outcome: 'unknown', status: 0 };
    }
    if (_confirming !== quote) return;
    _confirming = null;
    _quote = null;
    showConfirm(quote, result);
    draw();
    notify();
  }

  return {
    id: 'beemaps-bursts',
    name: 'Bee Maps Bursts',
    icon: '🐝',
    source: 'Bee Maps',
    updateInterval: 0,

    init(viewer) {
      if (_viewer) throw new Error('Bee Maps Bursts is already initialized');
      _viewer = viewer;
      _dataSource = new Cesium.CustomDataSource('beemaps-bursts');
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
    },

    async update() {
      if (!_enabled) return false;
      _statusRequest?.abort();
      const request = new AbortController();
      _statusRequest = request;
      let status;
      try {
        status = await source.getStatus({ signal: request.signal });
      } catch {
        status = { ok: false };
      }
      if (_statusRequest !== request) return false;
      _statusRequest = null;
      if (status.ok) {
        _usable = status.enabled && status.configured;
        _statusMessage = !status.enabled
          ? describeFailure({ error: 'burst_off' })
          : !status.configured
            ? describeFailure({ error: 'no_key' })
            : null;
        _statusError = null;
      } else {
        _usable = null;
        _statusMessage = STATUS_FAILED;
        _statusError = STATUS_FAILED;
      }
      notify();
      return true;
    },

    getRowControls() {
      const busy = Boolean(_request) || Boolean(_confirming);
      const unusable = _usable === false;
      const chips = [];
      if (_enabled) {
        const quote = _quote;
        if (quote) {
          chips.push({
            id: `confirm:${quote.quoteId}`,
            label: _confirming ? LABELS.sending : confirmLabel(quote),
            title: TITLES.confirm,
            disabled: busy || now() < quote.unlocksAt,
            busy: Boolean(_confirming),
            onClick: () => pressConfirm(quote),
          });
          if (!_confirming) {
            chips.push({
              id: 'cancel',
              label: LABELS.cancel,
              title: TITLES.cancel,
              disabled: false,
              onClick: pressCancel,
            });
          }
        } else {
          chips.push({
            id: 'quote',
            label: _requestKind === 'quote' ? LABELS.quoting : LABELS.quote,
            title: TITLES.quote,
            disabled: busy || unusable,
            busy: _requestKind === 'quote',
            onClick: pressQuote,
          });
        }
        chips.push({
          id: 'list',
          label: _requestKind === 'list' ? LABELS.listing : LABELS.list,
          title: TITLES.list,
          disabled: busy || unusable,
          busy: _requestKind === 'list',
          onClick: pressList,
        });
      }
      const press = _message ?? _statusMessage;
      return {
        chips,
        info: readoutText({
          message: [_confirmText, press].filter(Boolean).join(' · '),
          quote: _confirming ? null : _quote,
          list:
            _list !== null || _created.length > 0
              ? {
                  bursts: knownBursts(),
                  total: _list?.total ?? null,
                  cached: _list?.cached ?? false,
                }
              : null,
        }),
      };
    },

    setRowControlsListener(listener) {
      _listener = listener;
    },

    destroy(viewer = _viewer) {
      reset();
      _enabled = false;
      _confirming = null;
      _confirmText = null;
      _viewer = null;
      if (_dataSource) {
        viewer.dataSources.remove(_dataSource, true);
        _dataSource = null;
      }
    },

    getStats() {
      return {
        count: knownBursts().length,
        lastUpdate: _lastUpdate,
        error: _lastError ?? _statusError,
      };
    },
  };
}
