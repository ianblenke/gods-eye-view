import path from 'node:path';
import { promises as fsp } from 'node:fs';

/**
 * Daily count of the credits that confirms spend, kept in a file so that it
 * survives a restart. A reserve counts the credits and writes the file before it
 * answers. Nothing gives credits back.
 */

/**
 * @param {object} options
 * @param {string} options.dir - Folder of the file `credits.json`.
 * @param {number|(() => number)} options.limit - Credits for each UTC day, or a function that gives them.
 * @param {() => number} options.now - Clock in milliseconds.
 * @param {object} [options.fs] - File functions: readFile, mkdir, writeFile.
 */
export function createCredits({ dir, limit, now, fs = fsp }) {
  const file = path.join(dir, 'credits.json');
  const limitNow = () => (typeof limit === 'function' ? limit() : limit);
  const today = () => new Date(now()).toISOString().slice(0, 10);
  let state = null;
  let loading = null;
  let writes = Promise.resolve();

  async function load() {
    let text;
    try {
      text = await fs.readFile(file, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') return { date: today(), credits: 0 };
      throw error;
    }
    const saved = JSON.parse(text);
    if (
      typeof saved?.date !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(saved.date) ||
      !Number.isInteger(saved.credits) ||
      saved.credits < 0
    ) {
      throw new Error('The credits file has no date and credits');
    }
    return { date: saved.date, credits: saved.credits };
  }

  async function ready() {
    if (state === null) {
      loading ??= load();
      try {
        state = await loading;
      } finally {
        loading = null;
      }
    }
    if (state.date !== today()) state = { date: today(), credits: 0 };
  }

  /** The credits used today and the limit, or `ok` false when the file fails. */
  async function peek() {
    try {
      await ready();
    } catch {
      state = null;
      return { ok: false, reason: 'unavailable' };
    }
    return { ok: true, used: state.credits, limit: limitNow() };
  }

  /** Count the credits, write the file, and answer. Nothing waits between the check and the count. */
  async function reserve(credits) {
    try {
      await ready();
    } catch {
      state = null;
      return { ok: false, reason: 'unavailable' };
    }
    const daily = limitNow();
    if (state.credits + credits > daily) {
      return { ok: false, reason: 'limit', used: state.credits, limit: daily };
    }
    state.credits += credits;
    const used = state.credits;
    const text = JSON.stringify({ date: state.date, credits: used });
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
      state = null;
      return { ok: false, reason: 'unavailable' };
    }
    return { ok: true, used, limit: daily };
  }

  return { peek, reserve };
}
