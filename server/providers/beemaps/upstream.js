import { readResponseTextCapped } from '../common/http.js';

/** The one request that this provider sends to Bee Maps. */

export const UPSTREAM_URL = 'https://beemaps.com/api/developer/latest/poly';
export const UPSTREAM_TIMEOUT_MS = 20_000;
export const MAX_UPSTREAM_BYTES = 4 * 1024 * 1024;
const DEFAULT_RETRY_AFTER_S = 60;
const MAX_RETRY_AFTER_S = 600;

/** Seconds from a Retry-After header: digits only, 1 to 600, else 60. */
function retryAfterOf(value) {
  if (!/^\d+$/.test(value) || Number(value) < 1) return DEFAULT_RETRY_AFTER_S;
  return Math.min(Number(value), MAX_RETRY_AFTER_S);
}

function failureOf(response) {
  switch (response.status) {
    case 401:
    case 403:
      return { ok: false, kind: 'key_rejected' };
    case 402:
      return { ok: false, kind: 'no_credit' };
    case 429:
      return {
        ok: false,
        kind: 'upstream_rate_limit',
        retryAfter: retryAfterOf(response.headers.get('retry-after')),
      };
    default:
      return { ok: false, kind: 'upstream_failed' };
  }
}

async function readDocument(response, signal, observe) {
  let text;
  try {
    text = await readResponseTextCapped(response, MAX_UPSTREAM_BYTES, signal);
  } catch (error) {
    if (error.code !== 'RESPONSE_TOO_LARGE') {
      return { ok: false, kind: 'upstream_failed' };
    }
    observe({ bytes: 'over-limit' });
    return { ok: false, kind: 'bad_upstream' };
  }
  observe({ bytes: Buffer.byteLength(text) });
  try {
    return { ok: true, document: JSON.parse(text) };
  } catch {
    return { ok: false, kind: 'bad_upstream' };
  }
}

/**
 * Ask for the newest frames inside the ring, without signed image URLs.
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {string} options.key - Trimmed key.
 * @param {number[][]} options.ring - Closed ring, longitude first.
 * @param {string|null} options.since - Day text YYYY-MM-DD or null.
 * @param {(fn: () => void, ms: number) => unknown} options.setTimer
 * @param {(timer: unknown) => void} options.clearTimer
 * @param {(facts: {status?: number, bytes?: number|string}) => void} [options.observe]
 *   Called with the status when the headers arrive and with the size of the
 *   body when the body is read ('over-limit' for a body that is too large).
 * @returns {Promise<{ok:true, document:unknown}|{ok:false, kind:string, retryAfter?:number}>}
 */
export async function callUpstream({
  fetchImpl,
  key,
  ring,
  since,
  setTimer,
  clearTimer,
  observe = () => {},
}) {
  const url = new URL(UPSTREAM_URL);
  url.searchParams.set('catalog', 'true');
  if (since !== null) url.searchParams.set('min_week', since);
  const controller = new AbortController();
  const timer = setTimer(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  let outcome;
  try {
    const response = await fetchImpl(url.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Basic ${key}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ type: 'Polygon', coordinates: [ring] }),
      redirect: 'error',
      signal: controller.signal,
    });
    observe({ status: response.status });
    outcome = response.ok
      ? await readDocument(response, controller.signal, observe)
      : failureOf(response);
  } catch {
    outcome = { ok: false, kind: 'upstream_failed' };
  } finally {
    clearTimer(timer);
  }
  return outcome;
}
