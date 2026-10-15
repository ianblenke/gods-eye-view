import path from 'node:path';
import { promises as fsp } from 'node:fs';

/**
 * One durable record for each idempotency key, in the file `ledger.json`. The
 * plugin writes the record "pending" before it sends, and it changes the state
 * when the confirm ends. A record "pending" that a restart finds means that the
 * outcome is unknown. The file is written to a temporary file first and then
 * renamed, so a crash never leaves half a file.
 */

export const HOLD_MS = 600_000;
const MAX_FINISHED = 500;
const KEY = /^[A-Za-z0-9_-]{16,64}$/;
const QUOTE_ID = /^[0-9a-f]{32}$/;
const STATES = new Set(['pending', 'created', 'refused', 'unknown']);

const isFinished = (record) =>
  record.state === 'created' || record.state === 'refused';

function isValid(record) {
  if (typeof record?.key !== 'string' || !KEY.test(record.key)) return false;
  if (typeof record.quoteId !== 'string' || !QUOTE_ID.test(record.quoteId)) {
    return false;
  }
  if (!STATES.has(record.state)) return false;
  if (!Number.isInteger(record.time) || record.time < 0) return false;
  if (record.state === 'created') {
    return typeof record.burst?.id === 'string';
  }
  if (record.state === 'refused') {
    return Number.isInteger(record.status) && typeof record.error === 'string';
  }
  return true;
}

/** A copy with the fields of the state and no other field. */
function clean(record) {
  const copy = {
    key: record.key,
    quoteId: record.quoteId,
    state: record.state,
    time: record.time,
  };
  if (record.state === 'created') {
    copy.burst = { ...record.burst };
    copy.creditsRemaining = record.creditsRemaining ?? null;
  }
  if (record.state === 'refused') {
    copy.status = record.status;
    copy.error = record.error;
    if (record.retryAfter !== undefined) copy.retryAfter = record.retryAfter;
  }
  return copy;
}

/**
 * @param {object} options
 * @param {string} options.dir - Folder of the file `ledger.json`.
 * @param {() => number} options.now - Clock in milliseconds.
 * @param {object} [options.fs] - File functions: readFile, mkdir, writeFile, rename.
 */
export function createLedger({ dir, now, fs = fsp }) {
  const file = path.join(dir, 'ledger.json');
  let records = null;
  let loading = null;
  let writes = Promise.resolve();

  async function load() {
    let text;
    try {
      text = await fs.readFile(file, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
    const saved = JSON.parse(text);
    if (!saved.records.every(isValid)) {
      throw new Error('The ledger file has no valid records');
    }
    return saved.records.map(clean);
  }

  async function ready() {
    if (records !== null) return;
    loading ??= load();
    try {
      records = await loading;
    } finally {
      loading = null;
    }
  }

  function prune() {
    let finished = records.filter(isFinished).length;
    for (let index = 0; index < records.length && finished > MAX_FINISHED;) {
      if (isFinished(records[index])) {
        records.splice(index, 1);
        finished -= 1;
      } else {
        index += 1;
      }
    }
  }

  function persist() {
    const text = JSON.stringify({ records });
    const write = writes
      .catch(() => {})
      .then(async () => {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(`${file}.tmp`, text, 'utf8');
        await fs.rename(`${file}.tmp`, file);
      });
    writes = write;
    return write;
  }

  /** The whole seconds that remain of the hold after an unknown outcome. */
  function holdSeconds() {
    let seconds = 0;
    for (const record of records) {
      if (record.state !== 'unknown' && record.state !== 'pending') continue;
      const remaining = record.time + HOLD_MS - now();
      seconds = Math.max(seconds, Math.ceil(remaining / 1000));
    }
    return seconds;
  }

  /**
   * The record of a key, or null, and the seconds of the hold after an unknown
   * outcome. `ok` is false when the file fails.
   */
  async function find(key) {
    try {
      await ready();
    } catch {
      return { ok: false };
    }
    const record = records.find((entry) => entry.key === key);
    return {
      ok: true,
      record: record === undefined ? null : clean(record),
      holdSeconds: holdSeconds(),
    };
  }

  /** Write the record "pending" of a key and its quote. */
  async function begin(key, quoteId) {
    try {
      await ready();
    } catch {
      return { ok: false };
    }
    records.push({ key, quoteId, state: 'pending', time: now() });
    prune();
    try {
      await persist();
    } catch {
      records = null;
      return { ok: false };
    }
    return { ok: true };
  }

  /**
   * Change the state of a record when the confirm ends. The memory keeps the
   * new state also when the write fails.
   */
  async function finish(key, state, details) {
    const index = records?.findIndex((entry) => entry.key === key) ?? -1;
    if (index < 0) return { ok: false };
    const changed = { ...records[index], ...details, state, time: now() };
    records[index] = clean(changed);
    prune();
    try {
      await persist();
    } catch {
      return { ok: false };
    }
    return { ok: true };
  }

  return { find, begin, finish };
}
