import {
  ONTARIO_511_CAMERAS_URL,
  CCTV_SOURCE_FETCH_TIMEOUT_MS,
} from './constants.js';

let warnedMissingKey = false;
let warnedRequestError = false;

export async function readOntarioCameraRows() {
  const key = (process.env.ONTARIO_511_API_KEY || '').trim();
  if (!key) {
    if (!warnedMissingKey) {
      warnedMissingKey = true;
      console.warn('[CCTV] Ontario 511 needs ONTARIO_511_API_KEY.');
    }
    return [];
  }
  try {
    const url = new URL(ONTARIO_511_CAMERAS_URL);
    url.searchParams.set('key', key);
    const response = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(CCTV_SOURCE_FETCH_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error('Ontario camera request failed');
    return await response.json();
  } catch {
    if (!warnedRequestError) {
      warnedRequestError = true;
      console.warn(
        '[CCTV] Ontario 511 camera request failed. Check ONTARIO_511_API_KEY.',
      );
    }
    return [];
  }
}
