import { randomBytes as nodeRandomBytes } from 'node:crypto';

/** Single-use quotes in memory: each one lives 120 seconds, and the store keeps 8. */

export const QUOTE_LIFE_MS = 120_000;
const MAX_QUOTES = 8;

/**
 * @param {object} options
 * @param {() => number} options.now - Clock in milliseconds.
 * @param {(size: number) => Buffer} [options.randomBytes]
 */
export function createQuotes({ now, randomBytes = nodeRandomBytes }) {
  const store = new Map();

  function prune() {
    for (const [id, quote] of store) {
      if (now() - quote.at >= QUOTE_LIFE_MS) store.delete(id);
    }
  }

  /** Keep a copy of the request and give the id of the quote. */
  function add(request) {
    prune();
    while (store.size >= MAX_QUOTES) store.delete(store.keys().next().value);
    const quoteId = randomBytes(16).toString('hex');
    store.set(quoteId, {
      at: now(),
      request: { ...request, bbox: [...request.bbox] },
    });
    return { quoteId, expiresInSeconds: QUOTE_LIFE_MS / 1000 };
  }

  /** The request of a quote that has not ended, once. Else null. */
  function take(quoteId) {
    prune();
    const quote = store.get(quoteId);
    if (quote === undefined) return null;
    store.delete(quoteId);
    return quote.request;
  }

  return { add, take };
}
