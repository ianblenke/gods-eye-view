import path from 'node:path';
import { promises as fsp } from 'node:fs';

/**
 * The credits that Bee Maps reports, added for each UTC day and kept in a file
 * so that the count survives a restart. The price of a query is known only in
 * its answer, so the limit acts after an answer.
 */

export const DEFAULT_CREDIT_LIMIT = 500;

/** The credit limit: `BEEMAPS_DAILY_CREDITS` when it has digits only and is 1 or more. */
export function creditLimit(env) {
  const text = env.BEEMAPS_DAILY_CREDITS;
  return /^\d+$/.test(text) && Number(text) >= 1
    ? Number(text)
    : DEFAULT_CREDIT_LIMIT;
}

/** The credits of an upstream document: a finite number of 0 or more, else 0. */
export function creditsOf(document) {
  const value = document?.creditsUsed;
  return Number.isFinite(value) && value > 0 ? value : 0;
}

/**
 * @param {object} options
 * @param {string} options.dir - Folder of the credit file.
 * @param {object} options.env - Environment with BEEMAPS_DAILY_CREDITS.
 * @param {() => number} options.now - Clock in milliseconds.
 * @param {object} [options.fs] - File functions: readFile, mkdir, writeFile.
 */
export function createCredits({ dir, env, now, fs = fsp }) {
  const file = path.join(dir, 'credits.json');
  const limit = creditLimit(env);
  const today = () => new Date(now()).toISOString().slice(0, 10);
  let state = null;
  let loading = null;
  let writes = Promise.resolve();

  async function load() {
    let text;
    try {
      text = await fs.readFile(file, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') return { date: today(), used: 0 };
      throw error;
    }
    const saved = JSON.parse(text);
    if (
      typeof saved?.date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(saved.date) ||
      !Number.isFinite(saved.used) ||
      saved.used < 0
    ) {
      throw new Error('The credit file has no date and used');
    }
    return { date: saved.date, used: saved.used };
  }

  /** Start a new count when the date (UTC) has changed. */
  function roll() {
    if (state.date !== today()) state = { date: today(), used: 0 };
  }

  /**
   * Read the file once, then compare the count with the limit.
   * @returns {Promise<{ok:true}|{ok:false, reason:'unavailable'}|{ok:false, reason:'limit', used:number, limit:number}>}
   */
  async function check() {
    if (state === null) {
      try {
        loading ??= load();
        state = await loading;
      } catch {
        loading = null;
        return { ok: false, reason: 'unavailable' };
      }
    }
    roll();
    if (state.used >= limit) {
      return { ok: false, reason: 'limit', used: state.used, limit };
    }
    return { ok: true };
  }

  /**
   * Add credits to the count and write the file. Call it after a check.
   * @param {number} amount - A number of credits above 0.
   * @returns {Promise<boolean>} True when the file is written.
   */
  function add(amount) {
    roll();
    state.used += amount;
    const text = JSON.stringify({ date: state.date, used: state.used });
    const write = writes
      .catch(() => {})
      .then(async () => {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(file, text, 'utf8');
      });
    writes = write;
    return write.then(
      () => true,
      () => false,
    );
  }

  return { check, add };
}
