import {
  readResponseBytesCapped,
  readResponseJsonCapped,
} from '../../sources/httpBody.js';
import { normalizeAnswer } from './records.js';

export const MAX_SEARCH_BYTES = 8 * 1024 * 1024;
export const MAX_THUMBNAIL_BYTES = 1024 * 1024;
const MAX_STATUS_BYTES = 1024 * 1024;
export const SEARCH_TIMEOUT_MS = 60_000;
export const THUMBNAIL_TIMEOUT_MS = 20_000;
const STATUS_URL = '/api/skywatch/status';
const SCENES_URL = '/api/skywatch/scenes';
const THUMBNAIL_URL = '/api/skywatch/thumbnail/';
const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

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

const mediaTypeOf = (header) =>
  String(header ?? '')
    .split(';')[0]
    .trim()
    .toLowerCase();

/** The browser side of the three routes of the provider. It never retries. */
export function createSkywatchSource({
  fetchImpl = (...args) => globalThis.fetch(...args),
  setTimer = setTimeout,
  clearTimer = clearTimeout,
} = {}) {
  /**
   * Run one request with a time limit and a signal of its own. `read` gives
   * the result of an answer; a stop of the time limit gives `unreachable`.
   */
  async function request({ url, init = {}, timeoutMs, signal, read }) {
    signal?.throwIfAborted();
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal?.addEventListener('abort', abort, { once: true });
    const timer = setTimer(abort, timeoutMs);
    try {
      let response;
      try {
        response = await fetchImpl(url, { ...init, signal: controller.signal });
      } catch (error) {
        if (signal?.aborted) throw error;
        return { ok: false, status: 0, error: 'unreachable' };
      }
      try {
        return await read(response, controller.signal);
      } catch (error) {
        if (signal?.aborted) throw error;
        return controller.signal.aborted
          ? { ok: false, status: 0, error: 'unreachable' }
          : { ok: false, status: response.status, error: 'bad_answer' };
      }
    } finally {
      clearTimer(timer);
      signal?.removeEventListener('abort', abort);
    }
  }

  /** The failure of an answer that is not 2xx, from its JSON body. */
  async function failureOf(response, maxBytes, signal, names = []) {
    const body = await readResponseJsonCapped(response, maxBytes, signal);
    return {
      ok: false,
      status: response.status,
      error: typeof body?.error === 'string' ? body.error : 'unknown',
      ...countFields(body, names),
    };
  }

  return {
    /** @returns {Promise<{ok:true, configured:boolean}|{ok:false}>} */
    async getStatus({ signal } = {}) {
      try {
        const response = await fetchImpl(STATUS_URL, { signal });
        if (!response.ok) return { ok: false };
        const body = await readResponseJsonCapped(
          response,
          MAX_STATUS_BYTES,
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
     * @param {{bbox:number[], start:string, end:string, signal?:AbortSignal}} options
     * @returns {Promise<{ok:true, answer:object}|{ok:false, status:number, error:string}>}
     */
    searchScenes({ bbox, start, end, signal } = {}) {
      return request({
        url: SCENES_URL,
        init: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bbox, start, end }),
        },
        timeoutMs: SEARCH_TIMEOUT_MS,
        signal,
        async read(response, own) {
          if (!response.ok) {
            return failureOf(response, MAX_SEARCH_BYTES, own, [
              'retryAfter',
              'used',
              'limit',
            ]);
          }
          const body = await readResponseJsonCapped(
            response,
            MAX_SEARCH_BYTES,
            own,
          );
          const answer = normalizeAnswer(body);
          return answer === null
            ? { ok: false, status: response.status, error: 'bad_answer' }
            : { ok: true, answer };
        },
      });
    },

    /**
     * @param {{id:string, signal?:AbortSignal}} options
     * @returns {Promise<{ok:true, blob:Blob}|{ok:false, status:number, error:string}>}
     */
    getThumbnail({ id, signal } = {}) {
      return request({
        url: `${THUMBNAIL_URL}${id}`,
        timeoutMs: THUMBNAIL_TIMEOUT_MS,
        signal,
        async read(response, own) {
          if (!response.ok) {
            return failureOf(response, MAX_THUMBNAIL_BYTES, own);
          }
          const type = mediaTypeOf(response.headers.get('content-type'));
          if (!IMAGE_TYPES.has(type)) {
            return { ok: false, status: response.status, error: 'bad_answer' };
          }
          const bytes = await readResponseBytesCapped(
            response,
            MAX_THUMBNAIL_BYTES,
            own,
          );
          return { ok: true, blob: new Blob([bytes], { type }) };
        },
      });
    },
  };
}
