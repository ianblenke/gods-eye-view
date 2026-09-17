import { oshGet } from './get.js';

/**
 * Resolve the OpenSensorHub API root from a fixed candidate list, once per
 * process, with GET probes only. See design decision D4-D6.
 */

/** Wait this long after a full miss before the next probe pass. */
export const BASE_HOLD_MS = 60_000;

const PROBE_PATH = 'systems?limit=1&f=application/geo+json';

const CANDIDATE_SUFFIXES = [
  { name: 'root', suffix: '' },
  { name: 'api', suffix: 'api/' },
  { name: 'sensorhub-api', suffix: 'sensorhub/api/' },
];

function candidateRoots(configuredUrl) {
  const root = configuredUrl.href.endsWith('/')
    ? configuredUrl
    : new URL(`${configuredUrl.href}/`);
  return CANDIDATE_SUFFIXES.map(({ name, suffix }) => ({
    name,
    url: suffix ? new URL(suffix, root) : root,
  }));
}

function isListPayload(json) {
  return Array.isArray(json?.features) || Array.isArray(json?.items);
}

function failureReasonFor(error) {
  if (error?.code === 'OSH_REDIRECT') return 'redirect';
  if (error?.code === 'OSH_TOO_LARGE') return 'too_large';
  if (error?.name === 'AbortError' || error?.name === 'TimeoutError') return 'timeout';
  return 'network_error';
}

/**
 * True when a data route should report `auth_failed` instead of the
 * generic `base_unresolved` — at least one candidate answered 401 or 403.
 * @param {Array<{status:?number}>} failures
 */
export function baseErrorCode(failures) {
  return failures.some((failure) => failure.status === 401 || failure.status === 403)
    ? 'auth_failed'
    : 'base_unresolved';
}

/**
 * @param {object} options
 * @param {typeof fetch} options.fetchImpl
 * @param {() => number} [options.now]
 * @returns {{resolveRoot: (configured:string, headers:object) => Promise<object>, getState: () => object}}
 */
export function createOshBase({ fetchImpl, now = Date.now }) {
  let state = { configured: null, root: null, candidate: null, failures: [], probedAt: 0 };
  let inflight = null;

  async function probeOnce(configuredUrl, headers) {
    const failures = [];
    for (const { name, url } of candidateRoots(configuredUrl)) {
      const probeUrl = new URL(PROBE_PATH, url);
      try {
        const { status, json } = await oshGet(fetchImpl, probeUrl, { headers });
        if (status === 200 && isListPayload(json)) {
          return { root: url, candidate: name, failures };
        }
        if (status === 200) {
          failures.push({ candidate: name, status, reason: 'not_a_list' });
        } else {
          failures.push({ candidate: name, status });
        }
      } catch (error) {
        failures.push({
          candidate: name,
          status: Number.isFinite(error?.status) ? error.status : null,
          reason: failureReasonFor(error),
        });
      }
    }
    return { root: null, candidate: null, failures };
  }

  async function resolveRoot(configuredString, headers = {}) {
    if (state.configured !== configuredString) {
      state = { configured: configuredString, root: null, candidate: null, failures: [], probedAt: 0 };
    }
    if (state.root) return state;
    const nowMs = now();
    if (state.probedAt && state.failures.length && nowMs - state.probedAt < BASE_HOLD_MS) {
      return state;
    }
    if (!inflight) {
      const configuredUrl = new URL(configuredString);
      inflight = probeOnce(configuredUrl, headers)
        .then((result) => {
          state = { configured: configuredString, ...result, probedAt: now() };
          return state;
        })
        .finally(() => {
          inflight = null;
        });
    }
    return inflight;
  }

  return { resolveRoot, getState: () => state };
}
