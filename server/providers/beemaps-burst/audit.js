import { promises as fs } from 'node:fs';
import path from 'node:path';
import { defaultSourceRoot } from '../common/source-root.js';

/**
 * The audit file of the burst routes: one JSON line for each step of an attempt,
 * in the file `beemaps-bursts.jsonl` of the folder `.gev-logs`. A field with the
 * wrong shape is written as null, and no other field is written.
 */

const LOG_LIMIT = 4 * 1024 * 1024;
const OUTCOMES = new Set([
  'accepted',
  'created',
  'refused',
  'unknown',
  'blocked',
]);
const REASONS = new Set([
  'burst_off',
  'no_key',
  'bad_body',
  'busy',
  'key_reused',
  'outcome_unknown',
  'key_rejected',
  'no_credit',
  'upstream_rate_limit',
  'bad_request',
  'budget_used',
  'budget_unavailable',
  'quote_expired',
  'ledger_unavailable',
  'log_failed',
]);
const QUOTE_ID = /^[0-9a-f]{32}$/;
const IDEMPOTENCY_KEY = /^[A-Za-z0-9_-]{16,64}$/;
const BURST_ID = /^[A-Za-z0-9_-]{1,64}$/;

const text = (value, max) =>
  typeof value === 'string' && value.length >= 1 && value.length <= max
    ? value
    : null;
const matching = (value, pattern) =>
  typeof value === 'string' && pattern.test(value) ? value : null;
const whole = (value) => (Number.isInteger(value) ? value : null);
const finite = (value) => (Number.isFinite(value) ? value : null);

/**
 * @param {object} [options]
 * @param {string} [options.sourceRoot] - Folder that holds `.gev-logs`.
 * @param {() => number} [options.now] - Clock in milliseconds.
 * @param {(line: string) => Promise<void>} [options.append] - Replaces the file write.
 * @returns {(event: object) => Promise<void>}
 */
export function createAudit({
  sourceRoot = defaultSourceRoot,
  now = Date.now,
  append,
} = {}) {
  const dir = path.join(sourceRoot, '.gev-logs');
  const file = path.join(dir, 'beemaps-bursts.jsonl');
  let queue = Promise.resolve();
  const write =
    append ||
    (async (line) => {
      await fs.mkdir(dir, { recursive: true });
      const size = await fs.stat(file).then(
        (stat) => stat.size,
        () => 0,
      );
      if (size + Buffer.byteLength(line) > LOG_LIMIT) {
        await fs.rename(file, `${file}.1`);
      }
      await fs.appendFile(file, line);
    });
  return (event) => {
    const bbox =
      Array.isArray(event.bbox) &&
      event.bbox.length === 4 &&
      event.bbox.every((value) => finite(value) !== null)
        ? event.bbox
        : null;
    const line = `${JSON.stringify({
      time: new Date(now()).toISOString(),
      requestId: text(event.requestId, 64),
      outcome: OUTCOMES.has(event.outcome) ? event.outcome : null,
      reason: REASONS.has(event.reason) ? event.reason : null,
      client: text(event.client, 64),
      bbox,
      areaKm2: finite(event.areaKm2),
      credits: whole(event.credits),
      quoteId: matching(event.quoteId, QUOTE_ID),
      idempotencyKey: matching(event.idempotencyKey, IDEMPOTENCY_KEY),
      upstreamStatus: whole(event.upstreamStatus),
      burstId: matching(event.burstId, BURST_ID),
      durationMs: finite(event.durationMs),
    })}\n`;
    const done = queue.then(() => write(line));
    queue = done.catch(() => {});
    return done;
  };
}
