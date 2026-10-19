import { readResponseJsonCapped } from '../../sources/httpBody.js';
import { normalizeGdacsDocument } from './records.js';

const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;

/** Request the normalized document through the same-origin route /api/gdacs. */
export function createGdacsSource({
  fetchImpl = (...args) => globalThis.fetch(...args),
} = {}) {
  return {
    async getSnapshot({ signal } = {}) {
      signal?.throwIfAborted();
      const response = await fetchImpl('/api/gdacs', { signal });
      if (!response.ok) throw new Error(`GDACS HTTP ${response.status}`);
      const payload = await readResponseJsonCapped(
        response,
        MAX_RESPONSE_BYTES,
        signal,
      );
      const snapshot = normalizeGdacsDocument(payload);
      if (!snapshot) throw new Error('Invalid GDACS document');
      return snapshot;
    },
  };
}
