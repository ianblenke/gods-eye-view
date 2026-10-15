import { readResponseJsonCapped } from '../../sources/httpBody.js';
import { normalizeAnswer } from './records.js';

const MAX_RESPONSE_BYTES = 1024 * 1024;
export const REQUEST_TIMEOUT_MS = 30_000;
export const FRAME_LIMIT = 200;
const STATUS_URL = '/api/beemaps/status';
const FRAMES_URL = '/api/beemaps/frames';

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

/** The browser side of the two routes of the provider. It never retries. */
export function createBeemapsSource({
  fetchImpl = (...args) => globalThis.fetch(...args),
  setTimer = setTimeout,
  clearTimer = clearTimeout,
} = {}) {
  return {
    /** @returns {Promise<{ok:true, configured:boolean}|{ok:false}>} */
    async getStatus({ signal } = {}) {
      try {
        const response = await fetchImpl(STATUS_URL, { signal });
        if (!response.ok) return { ok: false };
        const body = await readResponseJsonCapped(
          response,
          MAX_RESPONSE_BYTES,
          signal,
        );
        return typeof body?.configured === 'boolean'
          ? { ok: true, configured: body.configured }
          : { ok: false };
      } catch {
        return { ok: false };
      }
    },

    /**
     * @param {{bbox:number[], signal?:AbortSignal}} options
     * @returns {Promise<{ok:true, answer:object}|{ok:false, status:number, error:string}>}
     */
    async getFrames({ bbox, signal } = {}) {
      signal?.throwIfAborted();
      const controller = new AbortController();
      const abort = () => controller.abort();
      signal?.addEventListener('abort', abort, { once: true });
      const timer = setTimer(abort, REQUEST_TIMEOUT_MS);
      try {
        let response;
        try {
          response = await fetchImpl(FRAMES_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bbox, limit: FRAME_LIMIT }),
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
        const answer = normalizeAnswer(body);
        return answer === null
          ? { ok: false, status, error: 'bad_answer' }
          : { ok: true, answer };
      } finally {
        clearTimer(timer);
        signal?.removeEventListener('abort', abort);
      }
    },
  };
}
