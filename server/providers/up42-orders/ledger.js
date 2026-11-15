import path from 'node:path';
import { promises as fsp } from 'node:fs';

/**
 * The file `orders.json` holds the orders that this server placed, their
 * duplicate keys and the two counts of the day. The file is written to a
 * temporary file first and then renamed. The caller writes a count before it
 * sends the call that the count allows.
 */

const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export const HOLD_MS = 600_000;
const whole = (v) => Number.isInteger(v) && v >= 0;

function isValid(saved) {
  return (
    typeof saved?.day === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(saved.day) &&
    whole(saved.counts?.orders) &&
    whole(saved.counts?.accepts) &&
    Array.isArray(saved.orders) &&
    saved.orders.every(
      (o) =>
        typeof o?.id === 'string' &&
        UUID.test(o.id) &&
        typeof o.key === 'string' &&
        Number.isFinite(o.credits) &&
        whole(o.time),
    )
  );
}

/**
 * @param {object} options
 * @param {string} options.dir - Folder of the file `orders.json`.
 * @param {() => number} options.now - Clock in milliseconds.
 * @param {object} [options.fs] - File functions: readFile, mkdir, writeFile, rename.
 */
export function createLedger({ dir, now, fs = fsp }) {
  const file = path.join(dir, 'orders.json');
  let state = null;
  let loading = null;
  let writes = Promise.resolve();

  async function load() {
    let text;
    try {
      text = await fs.readFile(file, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT')
        return { day: '', counts: { orders: 0, accepts: 0 }, orders: [] };
      throw error;
    }
    const saved = JSON.parse(text);
    if (!isValid(saved)) throw new Error('The ledger file is not valid');
    return saved;
  }

  // One shared load: two first requests must not load two states.
  function ready() {
    if (state !== null) return Promise.resolve(true);
    loading ??= load().then(
      (loaded) => {
        state = loaded;
        loading = null;
        return true;
      },
      () => {
        loading = null;
        return false;
      },
    );
    return loading;
  }

  function persist() {
    const text = JSON.stringify(state);
    const write = writes
      .catch(() => {})
      .then(async () => {
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(`${file}.tmp`, text, 'utf8');
        await fs.rename(`${file}.tmp`, file);
      });
    writes = write;
    return write.then(
      () => true,
      () => false,
    );
  }

  function today() {
    const day = new Date(now()).toISOString().slice(0, 10);
    if (state.day !== day)
      state = { ...state, day, counts: { orders: 0, accepts: 0 } };
    return state.counts;
  }

  return {
    ready,
    /** Write the next count of a kind. `ok` is false at the limit or on a write fault. */
    async reserve(kind, limit) {
      const counts = today();
      if (counts[kind] >= limit)
        return { ok: false, full: true, used: counts[kind], limit };
      counts[kind] += 1;
      if (await persist()) return { ok: true };
      counts[kind] -= 1;
      return { ok: false, full: false };
    },
    /** The order of a duplicate key that is younger than the hold, or null. */
    findKey(key) {
      return (
        state.orders.find((o) => o.key === key && now() - o.time < HOLD_MS) ??
        null
      );
    },
    hasOrder: (id) => state.orders.some((o) => o.id === id),
    /** Add an order. The memory keeps it also when the write fails. */
    async add(order) {
      state.orders.push({ ...order, time: now() });
      return persist();
    },
  };
}
