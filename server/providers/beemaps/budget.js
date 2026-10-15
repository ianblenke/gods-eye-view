import path from 'node:path';
import { promises as fsp } from 'node:fs';

/** Daily count of upstream calls, kept in a file so that it survives a restart. */

const DEFAULT_DAILY_LIMIT = 20;

function dailyLimit(env) {
  const text = env.BEEMAPS_DAILY_QUERIES;
  return /^\d+$/.test(text) && Number(text) >= 1
    ? Number(text)
    : DEFAULT_DAILY_LIMIT;
}

/**
 * @param {object} options
 * @param {string} options.dir - Folder of the budget file.
 * @param {object} options.env - Environment with BEEMAPS_DAILY_QUERIES.
 * @param {() => number} options.now - Clock in milliseconds.
 * @param {object} [options.fs] - File functions: readFile, mkdir, writeFile.
 */
export function createBudget({ dir, env, now, fs = fsp }) {
  const file = path.join(dir, 'budget.json');
  const limit = dailyLimit(env);
  const today = () => new Date(now()).toISOString().slice(0, 10);
  let state = null;
  let loading = null;
  let writes = Promise.resolve();

  async function load() {
    let text;
    try {
      text = await fs.readFile(file, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') return { date: today(), count: 0 };
      throw error;
    }
    const saved = JSON.parse(text);
    if (
      typeof saved?.date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(saved.date) ||
      !Number.isInteger(saved.count) ||
      saved.count < 0
    ) {
      throw new Error('The budget file has no date and count');
    }
    return { date: saved.date, count: saved.count };
  }

  /**
   * Check the count against the daily limit, add 1 and write the file.
   * Nothing waits between the check and the addition.
   */
  async function reserve() {
    if (state === null) {
      try {
        loading ??= load();
        state = await loading;
      } catch {
        loading = null;
        return { ok: false, reason: 'unavailable' };
      }
    }
    if (state.date !== today()) state = { date: today(), count: 0 };
    if (state.count >= limit) {
      return { ok: false, reason: 'limit', used: state.count, limit };
    }
    state.count += 1;
    const used = state.count;
    const text = JSON.stringify({ date: state.date, count: used });
    const write = writes
      .catch(() => {})
      .then(async () => {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(file, text, 'utf8');
      });
    writes = write;
    try {
      await write;
    } catch {
      return { ok: false, reason: 'unavailable' };
    }
    return { ok: true, used, limit };
  }

  /** The count of today and the daily limit. Call it after a reserve. */
  function current() {
    return { used: state.date === today() ? state.count : 0, limit };
  }

  return { reserve, current };
}
