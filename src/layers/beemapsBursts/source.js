import { readResponseJsonCapped } from '../../sources/httpBody.js';
import { normalizeCreated, normalizeList, normalizeQuote } from './records.js';

const MAX_RESPONSE_BYTES = 1024 * 1024;
export const REQUEST_TIMEOUT_MS = 30_000;
export const CONFIRM_TIMEOUT_MS = 60_000;
export const LIST_LIMIT = 100;
const STATUS_URL = '/api/beemaps/burst/status';
const QUOTE_URL = '/api/beemaps/burst/quote';
const CONFIRM_URL = '/api/beemaps/burst/confirm';
const LIST_URL = '/api/beemaps/burst/list';
const JSON_HEADERS = { 'Content-Type': 'application/json' };

/** The errors that the confirm route states for a request that took no credits. */
const REFUSED = new Set([
  'cross_origin',
  'rate_limited',
  'burst_off',
  'no_key',
  'bad_body',
  'busy',
  'key_reused',
  'quote_expired',
  'budget_used',
  'budget_unavailable',
  'ledger_unavailable',
  'log_failed',
  'bad_request',
  'key_rejected',
  'no_credit',
  'upstream_rate_limit',
]);

/** Keep the fields of an error body that are whole numbers of 0 or more. */
function countFields(body, names) {
  const fields = {};
  for (const name of names) {
    if (Number.isInteger(body?.[name]) && body[name] >= 0) {
      fields[name] = body[name];
    }
  }
  return fields;
}

/** The answer of a confirm: created, refused with no credits taken, or unknown. */
function classifyConfirm(status, body) {
  if (status === 200) {
    const created = normalizeCreated(body);
    if (created !== null) return { outcome: 'created', ...created };
  } else if (status >= 400 && body?.ok !== true && REFUSED.has(body?.error)) {
    const names =
      body.error === 'budget_used'
        ? ['retryAfter', 'used', 'limit']
        : ['retryAfter'];
    return {
      outcome: 'refused',
      status,
      error: body.error,
      ...countFields(body, names),
    };
  }
  return { outcome: 'unknown', status, ...countFields(body, ['retryAfter']) };
}

/**
 * The browser side of the four routes of the burst plugin. It never retries.
 * Only `confirm` can create a burst, and it never rejects.
 */
export function createBeemapsBurstSource({
  fetchImpl = (...args) => globalThis.fetch(...args),
  setTimer = setTimeout,
  clearTimer = clearTimeout,
} = {}) {
  /** One POST with a deadline: the answer, or `{ok:false, status, error}`. */
  async function post(url, payload, signal, readAnswer) {
    signal?.throwIfAborted();
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal?.addEventListener('abort', abort, { once: true });
    const timer = setTimer(abort, REQUEST_TIMEOUT_MS);
    try {
      let response;
      try {
        response = await fetchImpl(url, {
          method: 'POST',
          headers: JSON_HEADERS,
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } catch (error) {
        if (signal?.aborted) throw error;
        return { ok: false, status: 0, error: 'unreachable' };
      }
      const { status } = response;
      let body;
      try {
        body = await readResponseJsonCapped(
          response,
          MAX_RESPONSE_BYTES,
          controller.signal,
        );
      } catch (error) {
        if (signal?.aborted) throw error;
        return controller.signal.aborted
          ? { ok: false, status: 0, error: 'unreachable' }
          : { ok: false, status, error: 'bad_answer' };
      }
      if (!response.ok) {
        return {
          ok: false,
          status,
          error: typeof body?.error === 'string' ? body.error : 'unknown',
          ...countFields(body, ['retryAfter', 'used', 'limit']),
        };
      }
      const answer = readAnswer(body);
      return answer === null
        ? { ok: false, status, error: 'bad_answer' }
        : { ok: true, ...answer };
    } finally {
      clearTimer(timer);
      signal?.removeEventListener('abort', abort);
    }
  }

  return {
    /** @returns {Promise<{ok:true, enabled:boolean, configured:boolean}|{ok:false}>} */
    async getStatus({ signal } = {}) {
      try {
        const response = await fetchImpl(STATUS_URL, { signal });
        if (!response.ok) return { ok: false };
        const body = await readResponseJsonCapped(
          response,
          MAX_RESPONSE_BYTES,
          signal,
        );
        return typeof body?.enabled === 'boolean' &&
          typeof body.configured === 'boolean'
          ? { ok: true, enabled: body.enabled, configured: body.configured }
          : { ok: false };
      } catch {
        return { ok: false };
      }
    },

    /** @returns {Promise<{ok:true, quote:object}|{ok:false, status:number, error:string}>} */
    quote({ bbox, signal } = {}) {
      return post(QUOTE_URL, { bbox }, signal, (body) => {
        const quote = normalizeQuote(body);
        return quote === null ? null : { quote };
      });
    },

    /**
     * One request, no signal, no retry. Anything but a clear answer is unknown.
     * @returns {Promise<object>} `{outcome:'created'|'refused'|'unknown', ...}`
     */
    async confirm({ quoteId, idempotencyKey }) {
      const controller = new AbortController();
      const timer = setTimer(() => controller.abort(), CONFIRM_TIMEOUT_MS);
      try {
        let response;
        try {
          response = await fetchImpl(CONFIRM_URL, {
            method: 'POST',
            headers: JSON_HEADERS,
            body: JSON.stringify({ quoteId, idempotencyKey }),
            signal: controller.signal,
          });
        } catch {
          return { outcome: 'unknown', status: 0 };
        }
        let body;
        try {
          body = await readResponseJsonCapped(
            response,
            MAX_RESPONSE_BYTES,
            controller.signal,
          );
        } catch {
          return { outcome: 'unknown', status: response.status };
        }
        return classifyConfirm(response.status, body);
      } finally {
        clearTimer(timer);
      }
    },

    /** @returns {Promise<{ok:true, bursts:object[], total:number, cached:boolean}|{ok:false, status:number, error:string}>} */
    list({ signal } = {}) {
      return post(LIST_URL, { limit: LIST_LIMIT }, signal, normalizeList);
    },
  };
}
