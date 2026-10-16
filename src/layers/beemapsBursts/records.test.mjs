import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCreated, normalizeList, normalizeQuote } from './records.js';

const QUOTE_ID = 'a1b2c3d4e5f60718293a4b5c6d7e8f90';
const GOOD_QUOTE = {
  quoteId: QUOTE_ID,
  expiresInSeconds: 120,
  request: {
    bbox: [9.982014, 59.991007, 10.017986, 60.008993],
    areaKm2: 4,
    credits: 125,
  },
  budget: { used: 0, limit: 625, remaining: 625 },
};
const withRequest = (changes) => ({
  ...GOOD_QUOTE,
  request: { ...GOOD_QUOTE.request, ...changes },
});
const withBudget = (changes) => ({
  ...GOOD_QUOTE,
  budget: { ...GOOD_QUOTE.budget, ...changes },
});

test('[beemaps-bursts-022] reads a good quote answer into its fields', () => {
  assert.deepEqual(normalizeQuote(GOOD_QUOTE), {
    quoteId: QUOTE_ID,
    expiresInSeconds: 120,
    bbox: [9.982014, 59.991007, 10.017986, 60.008993],
    areaKm2: 4,
    credits: 125,
    budget: { used: 0, limit: 625, remaining: 625 },
  });
  const copy = normalizeQuote(GOOD_QUOTE);
  assert.notEqual(copy.bbox, GOOD_QUOTE.request.bbox);
  assert.notEqual(copy.budget, GOOD_QUOTE.budget);
});

test('[beemaps-bursts-022] accepts the edges of the quoteId, the seconds, the credits and the budget', () => {
  assert.equal(
    normalizeQuote({ ...GOOD_QUOTE, expiresInSeconds: 1 }).expiresInSeconds,
    1,
  );
  assert.equal(
    normalizeQuote({ ...GOOD_QUOTE, expiresInSeconds: 600 }).expiresInSeconds,
    600,
  );
  assert.equal(normalizeQuote(withRequest({ credits: 1 })).credits, 1);
  assert.equal(normalizeQuote(withRequest({ areaKm2: 0.001 })).areaKm2, 0.001);
  assert.deepEqual(
    normalizeQuote(withBudget({ used: 0, limit: 0, remaining: 0 })).budget,
    { used: 0, limit: 0, remaining: 0 },
  );
});

test('[beemaps-bursts-022] rejects a quoteId that is not 32 characters of lower case hexadecimal', () => {
  for (const quoteId of [
    undefined,
    7,
    '',
    QUOTE_ID.slice(1),
    `${QUOTE_ID}0`,
    QUOTE_ID.toUpperCase(),
    `${QUOTE_ID.slice(1)}g`,
    [QUOTE_ID],
    { toString: () => QUOTE_ID },
  ]) {
    assert.equal(normalizeQuote({ ...GOOD_QUOTE, quoteId }), null);
  }
});

test('[beemaps-bursts-022] rejects seconds that are not a whole number from 1 to 600', () => {
  for (const expiresInSeconds of [undefined, '120', 0, -1, 601, 1.5, NaN]) {
    assert.equal(normalizeQuote({ ...GOOD_QUOTE, expiresInSeconds }), null);
  }
});

test('[beemaps-bursts-022] rejects a box that does not contain 4 finite numbers', () => {
  for (const bbox of [
    undefined,
    'box',
    [1, 2, 3],
    [1, 2, 3, 4, 5],
    [1, 2, 3, '4'],
    [1, 2, NaN, 4],
    [1, 2, Infinity, 4],
    [1, 2, null, 4],
  ]) {
    assert.equal(normalizeQuote(withRequest({ bbox })), null);
  }
  assert.equal(normalizeQuote({ ...GOOD_QUOTE, request: undefined }), null);
  assert.equal(normalizeQuote({ ...GOOD_QUOTE, request: null }), null);
});

test('[beemaps-bursts-022] rejects an area that is not above 0, and credits that are not a whole number from 1', () => {
  for (const areaKm2 of [undefined, '4', 0, -4, NaN, Infinity]) {
    assert.equal(normalizeQuote(withRequest({ areaKm2 })), null);
  }
  for (const credits of [undefined, '125', 0, -125, 125.5, NaN]) {
    assert.equal(normalizeQuote(withRequest({ credits })), null);
  }
});

test('[beemaps-bursts-022] rejects a budget field that is not a whole number from 0', () => {
  for (const name of ['used', 'limit', 'remaining']) {
    for (const value of [undefined, '1', -1, 1.5, NaN, null]) {
      assert.equal(normalizeQuote(withBudget({ [name]: value })), null);
    }
  }
  assert.equal(normalizeQuote({ ...GOOD_QUOTE, budget: undefined }), null);
  assert.equal(normalizeQuote(null), null);
  assert.equal(normalizeQuote(undefined), null);
  assert.equal(normalizeQuote('quote'), null);
});

const BURST = {
  id: '6501aa11bb22cc33dd44ee55',
  status: 'active',
  validUntil: '2026-10-22T12:00:00.000Z',
  credits: 125,
};
const CREATED = {
  ok: true,
  outcome: 'created',
  replayed: false,
  burst: BURST,
  creditsRemaining: 875,
};

test('[beemaps-bursts-023] reads a created answer into its fields', () => {
  assert.deepEqual(normalizeCreated(CREATED), {
    replayed: false,
    burst: BURST,
    creditsRemaining: 875,
  });
  assert.equal(normalizeCreated({ ...CREATED, replayed: true }).replayed, true);
  assert.equal(
    normalizeCreated({ ...CREATED, replayed: 'yes' }).replayed,
    false,
  );
  assert.equal(
    normalizeCreated({ ...CREATED, burst: { ...BURST, validUntil: null } })
      .burst.validUntil,
    null,
  );
  const extra = normalizeCreated({ ...CREATED, burst: { ...BURST, extra: 1 } });
  assert.deepEqual(Object.keys(extra.burst), [
    'id',
    'status',
    'validUntil',
    'credits',
  ]);
});

test('[beemaps-bursts-023] gives null for creditsRemaining when the body has no whole number for it', () => {
  for (const creditsRemaining of [undefined, null, '875', -1, 1.5, NaN]) {
    assert.equal(
      normalizeCreated({ ...CREATED, creditsRemaining }).creditsRemaining,
      null,
    );
  }
  assert.equal(
    normalizeCreated({ ...CREATED, creditsRemaining: 0 }).creditsRemaining,
    0,
  );
});

test('[beemaps-bursts-023] keeps a burst with a null status, a null validUntil or null credits', () => {
  const burst = normalizeCreated({
    ...CREATED,
    burst: { id: 'x', status: null, validUntil: null, credits: null },
  }).burst;
  assert.deepEqual(burst, {
    id: 'x',
    status: null,
    validUntil: null,
    credits: null,
  });
  assert.equal(
    normalizeCreated({ ...CREATED, burst: { ...BURST, credits: 125.5 } }).burst
      .credits,
    125.5,
  );
});

test('[beemaps-bursts-023] rejects an answer that is not ok, not created or has an unreadable burst', () => {
  assert.equal(normalizeCreated({ ...CREATED, ok: false }), null);
  assert.equal(normalizeCreated({ ...CREATED, ok: 'true' }), null);
  assert.equal(normalizeCreated({ ...CREATED, outcome: 'unknown' }), null);
  assert.equal(normalizeCreated({ ...CREATED, outcome: undefined }), null);
  for (const burst of [
    undefined,
    null,
    'burst',
    { ...BURST, id: '' },
    { ...BURST, id: 5 },
    { ...BURST, status: 5 },
    { ...BURST, status: undefined },
    { ...BURST, validUntil: 5 },
    { ...BURST, validUntil: undefined },
    { ...BURST, credits: '125' },
    { ...BURST, credits: NaN },
    { ...BURST, credits: Infinity },
    { ...BURST, credits: undefined },
  ]) {
    assert.equal(normalizeCreated({ ...CREATED, burst }), null);
  }
  assert.equal(normalizeCreated(null), null);
  assert.equal(normalizeCreated(undefined), null);
});

const BOX = [9.982014, 59.991007, 10.017986, 60.008993];
const LISTED = (id, changes = {}) => ({
  id,
  status: 'active',
  isHit: false,
  latestHitAt: null,
  validUntil: '2026-10-22T12:00:00.000Z',
  credits: 125,
  bbox: BOX,
  ...changes,
});

test('[beemaps-bursts-025] reads a good list answer and keeps the order of the bursts', () => {
  const answer = normalizeList({
    bursts: [LISTED('b'), LISTED('a', { isHit: true, status: 'ended' })],
    total: 2,
    cached: false,
  });
  assert.deepEqual(answer, {
    bursts: [
      { id: 'b', status: 'active', isHit: false, credits: 125, bbox: BOX },
      { id: 'a', status: 'ended', isHit: true, credits: 125, bbox: BOX },
    ],
    total: 2,
    cached: false,
  });
  assert.notEqual(answer.bursts[0].bbox, BOX);
  assert.deepEqual(normalizeList({ bursts: [], total: 0, cached: true }), {
    bursts: [],
    total: 0,
    cached: true,
  });
});

test('[beemaps-bursts-025] keeps a burst with a null status, null credits or a null box', () => {
  const answer = normalizeList({
    bursts: [
      LISTED('a', { status: null }),
      LISTED('b', { credits: null }),
      LISTED('c', { bbox: null }),
      LISTED('d', { credits: 12.5 }),
    ],
    total: 4,
    cached: false,
  });
  assert.deepEqual(
    answer.bursts.map((burst) => [
      burst.id,
      burst.status,
      burst.credits,
      burst.bbox,
    ]),
    [
      ['a', null, 125, BOX],
      ['b', 'active', null, BOX],
      ['c', 'active', 125, null],
      ['d', 'active', 12.5, BOX],
    ],
  );
});

test('[beemaps-bursts-025] drops a burst that fails the rules and keeps the others', () => {
  const answer = normalizeList({
    bursts: [
      LISTED('a'),
      LISTED(''),
      LISTED(7),
      LISTED('c', { status: 5 }),
      LISTED('c2', { status: undefined }),
      LISTED('d', { isHit: 'yes' }),
      LISTED('e', { isHit: undefined }),
      LISTED('f', { credits: '125' }),
      LISTED('f2', { credits: undefined }),
      LISTED('f3', { credits: NaN }),
      LISTED('h', { bbox: [1, 2, 3] }),
      LISTED('i', { bbox: [1, 2, 3, NaN] }),
      LISTED('i2', { bbox: undefined }),
      null,
      'burst',
      LISTED('j'),
    ],
    total: 99,
    cached: false,
  });
  assert.deepEqual(
    answer.bursts.map((burst) => burst.id),
    ['a', 'j'],
  );
  assert.equal(answer.total, 99);
});

test('[beemaps-bursts-025] rejects an answer with no array, a bad total or a bad cached flag', () => {
  const good = { bursts: [], total: 0, cached: false };
  for (const changes of [
    { bursts: undefined },
    { bursts: {} },
    { bursts: 'list' },
    { total: undefined },
    { total: -1 },
    { total: 1.5 },
    { total: '3' },
    { cached: undefined },
    { cached: 'false' },
    { cached: 0 },
  ]) {
    assert.equal(normalizeList({ ...good, ...changes }), null);
  }
  assert.equal(normalizeList(null), null);
  assert.equal(normalizeList(undefined), null);
});
