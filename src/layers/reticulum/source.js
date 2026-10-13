import { readResponseJsonCapped } from '../../sources/httpBody.js';
import { normalizeReticulumSnapshot } from './records.js';

const MAX_RESPONSE_BYTES = 8 * 1024 * 1024;

/** Request the normalized snapshot through the same-origin route /api/reticulum. */
export function createReticulumSource({
  fetchImpl = (...args) => globalThis.fetch(...args),
} = {}) {
  return {
    async getSnapshot({ signal } = {}) {
      signal?.throwIfAborted();
      const response = await fetchImpl('/api/reticulum', { signal });
      if (!response.ok) throw new Error(`Reticulum HTTP ${response.status}`);
      const payload = await readResponseJsonCapped(
        response,
        MAX_RESPONSE_BYTES,
        signal,
      );
      const snapshot = normalizeReticulumSnapshot(payload);
      if (!snapshot) throw new Error('Invalid Reticulum snapshot');
      return snapshot;
    },
  };
}
