import test from 'node:test';
import assert from 'node:assert/strict';
import { createQuotes } from '../../server/providers/beemaps-burst/quotes.js';

const REQUEST = {
  bbox: [9.982014, 59.991007, 10.017986, 60.008993],
  areaKm2: 4,
  credits: 125,
};

function make() {
  const clock = { t: Date.UTC(2026, 9, 15, 12, 0, 0) };
  return { clock, quotes: createQuotes({ now: () => clock.t }) };
}

test('[beemaps-burst-control-013] gives each quote an id of 32 lowercase hexadecimal characters and a life of 120 seconds', () => {
  const { quotes } = make();
  const first = quotes.add(REQUEST);
  const second = quotes.add(REQUEST);
  assert.match(first.quoteId, /^[0-9a-f]{32}$/);
  assert.match(second.quoteId, /^[0-9a-f]{32}$/);
  assert.notEqual(first.quoteId, second.quoteId);
  assert.equal(first.expiresInSeconds, 120);
});

test('[beemaps-burst-control-013] gives the stored request once, 119.999 seconds after the quote, and nothing at 120 seconds', () => {
  const { clock, quotes } = make();
  const a = quotes.add(REQUEST);
  clock.t += 119_999;
  assert.deepEqual(quotes.take(a.quoteId), REQUEST);
  const b = quotes.add(REQUEST);
  clock.t += 120_000;
  assert.equal(quotes.take(b.quoteId), null);
  const c = quotes.add(REQUEST);
  clock.t += 120_001;
  assert.equal(quotes.take(c.quoteId), null);
});

test('[beemaps-burst-control-013] uses up a quote at the first take and knows no id that it never gave', () => {
  const { quotes } = make();
  const { quoteId } = quotes.add(REQUEST);
  assert.deepEqual(quotes.take(quoteId), REQUEST);
  assert.equal(quotes.take(quoteId), null);
  assert.equal(quotes.take('a'.repeat(32)), null);
  assert.equal(quotes.take(undefined), null);
  assert.equal(quotes.take('__proto__'), null);
});

test('[beemaps-burst-control-013] keeps at most 8 quotes, and the ninth quote ends the oldest', () => {
  const { quotes } = make();
  const ids = Array.from({ length: 9 }, () => quotes.add(REQUEST).quoteId);
  assert.equal(quotes.take(ids[0]), null);
  for (const id of ids.slice(1)) assert.deepEqual(quotes.take(id), REQUEST);
});

test('[beemaps-burst-control-013] counts only quotes that have not ended toward the limit of 8', () => {
  const { clock, quotes } = make();
  const old = Array.from({ length: 8 }, () => quotes.add(REQUEST).quoteId);
  clock.t += 120_000;
  const fresh = Array.from({ length: 8 }, () => quotes.add(REQUEST).quoteId);
  for (const id of old) assert.equal(quotes.take(id), null);
  for (const id of fresh) assert.deepEqual(quotes.take(id), REQUEST);
});

test('[beemaps-burst-control-013] gives a copy of the request that the caller cannot change in the store', () => {
  const { quotes } = make();
  const request = { ...REQUEST, bbox: [...REQUEST.bbox] };
  const { quoteId } = quotes.add(request);
  request.credits = 999;
  request.bbox[0] = 0;
  assert.deepEqual(quotes.take(quoteId), REQUEST);
});
