import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ASKING,
  CACHED,
  LOADING_PRODUCTS,
  NO_PRODUCTS,
  confirmText,
  describeQuote,
  describeQuoteFailure,
  normalizeProducts,
  normalizeQuote,
} from './quotes.js';

const ID = '11111111-2222-3333-4444-555555555555';
const GOOD = {
  results: {
    validation: { ok: true, status: 'VALID', errors: ['SECRET'] },
    estimate: { ok: true, credits: 120, size: 4, unit: 'SQ_KM', currency: 'X' },
    feasibility: { ok: true, outcome: 'FEASIBLE', difficulty: 'LOW', extra: 1 },
    opportunities: { ok: true, count: 3, passes: [{ id: 'p' }] },
    other: { ok: true },
  },
  cached: false,
  budget: { used: 2, limit: 20, extra: 1 },
};

test('[up42-quote-panel-001] keeps the id and title of each product and uses the id for a missing title', () => {
  assert.deepEqual(
    normalizeProducts({
      products: [
        { id: ID, title: 'Pléiades', collection: 'c' },
        { id: ID.toUpperCase(), title: '' },
        { id: ID, title: 'x'.repeat(161) },
        { id: ID, title: 7 },
      ],
    }),
    [
      { id: ID, title: 'Pléiades' },
      { id: ID.toUpperCase(), title: ID.toUpperCase() },
      { id: ID, title: ID },
      { id: ID, title: ID },
    ],
  );
  assert.deepEqual(normalizeProducts({ products: [] }), []);
});

test('[up42-quote-panel-001] refuses an answer with no products array or with one invalid product', () => {
  for (const body of [
    null,
    undefined,
    {},
    { products: {} },
    { products: [null] },
    { products: [[]] },
    { products: [{ title: 'a' }] },
    { products: [{ id: 5 }] },
    { products: [{ id: 'not-a-uuid' }] },
    { products: [{ id: ID }, { id: `${ID}0` }] },
  ])
    assert.equal(normalizeProducts(body), null);
});

test('[up42-quote-panel-002] keeps only the named checks, facts, cached flag and budget numbers', () => {
  assert.deepEqual(normalizeQuote(GOOD), {
    results: {
      validation: { ok: true, status: 'VALID' },
      estimate: { ok: true, credits: 120, size: 4, unit: 'SQ_KM' },
      feasibility: { ok: true, outcome: 'FEASIBLE', difficulty: 'LOW' },
      opportunities: { ok: true, count: 3 },
    },
    cached: false,
    budget: { used: 2, limit: 20 },
  });
});

test('[up42-quote-panel-002] refuses a body with no results, a bad cached flag or a bad budget', () => {
  const only = (patch) => ({ ...GOOD, ...patch });
  for (const body of [
    null,
    [],
    'x',
    only({ results: null }),
    only({ results: [] }),
    only({ results: { other: { ok: true } } }),
    only({ results: {} }),
    only({ cached: 'no' }),
    only({ cached: undefined }),
    only({ budget: null }),
    only({ budget: [] }),
    only({ budget: { used: -1, limit: 2 } }),
    only({ budget: { used: 1.5, limit: 2 } }),
    only({ budget: { used: 1, limit: '2' } }),
    only({ budget: { used: 1 } }),
  ])
    assert.equal(normalizeQuote(body), null);
});

test('[up42-quote-panel-002] turns a check that is not valid into bad_answer and keeps the other checks', () => {
  const bad = (check) =>
    normalizeQuote({
      ...GOOD,
      results: { validation: { ok: true, status: 'VALID' }, estimate: check },
    }).results.estimate;
  const BAD = { ok: false, error: 'bad_answer' };
  for (const check of [
    null,
    [],
    'x',
    {},
    { ok: 'yes' },
    { ok: true },
    { ok: true, credits: 'many' },
    { ok: true, credits: Infinity },
    { ok: false },
    { ok: false, error: '' },
    { ok: false, error: 'x'.repeat(161) },
    { ok: false, error: 3 },
  ])
    assert.deepEqual(bad(check), BAD);
  assert.deepEqual(bad({ ok: false, error: 'upstream_failed' }), {
    ok: false,
    error: 'upstream_failed',
  });
  assert.deepEqual(bad({ ok: true, credits: 5, size: 'a', unit: 4 }), {
    ok: true,
    credits: 5,
  });
});

test('[up42-quote-panel-007] shows the facts of each check and the budget', () => {
  assert.equal(
    describeQuote(normalizeQuote(GOOD)),
    'Validation: VALID · Estimate: 120 credits for 4 SQ_KM · Feasibility: FEASIBLE · Passes: 3 · Quotes today: 2 of 20. No order was made.',
  );
});

test('[up42-quote-panel-007] shows an estimate without a size or a unit, a failed check and a kept quote', () => {
  const quote = {
    results: {
      estimate: { ok: true, credits: 7 },
      feasibility: { ok: false, error: 'credentials_rejected' },
      opportunities: { ok: false, error: 'strange' },
    },
    cached: true,
    budget: { used: 0, limit: 0 },
  };
  assert.equal(
    describeQuote(quote),
    'Estimate: 7 credits · Feasibility: not available (UP42 refused the credentials. Check UP42_USERNAME and UP42_PASSWORD in .env.) · Passes: not available (UP42 did not give a quote.) · This quote is kept from before. · Quotes today: 0 of 0. No order was made.',
  );
  assert.equal(
    describeQuote({
      ...quote,
      results: { estimate: { ok: true, credits: 7, size: 2 } },
      cached: false,
    }),
    'Estimate: 7 credits for 2 · Quotes today: 0 of 0. No order was made.',
  );
});

test('[up42-quote-panel-008] gives a fixed text for each known error and a generic text for another name', () => {
  const known = {
    quotes_off:
      'Quotes are off. Set UP42_QUOTES=true in .env and restart the app.',
    rate_limited: 'Too many quote requests. Wait 60 seconds.',
    budget: 'No more quotes today.',
    no_credentials:
      'No UP42 credentials. Set UP42_USERNAME and UP42_PASSWORD in .env and restart the app.',
    credentials_rejected:
      'UP42 refused the credentials. Check UP42_USERNAME and UP42_PASSWORD in .env.',
    area_too_large: 'The view is too large for a quote. Zoom in and try again.',
    bad_bbox: 'The server refused the box of the view.',
    unknown_product: 'UP42 does not list this product now. Choose again.',
    upstream_failed: 'UP42 did not answer correctly.',
    unreachable: 'The server did not answer.',
    bad_answer: 'The server sent an answer that the layer cannot read.',
  };
  for (const [error, text] of Object.entries(known))
    assert.equal(describeQuoteFailure({ status: 400, error }), text);
  for (const error of ['SECRET_UPSTREAM', 'toString', undefined])
    assert.equal(
      describeQuoteFailure({ status: 500, error }),
      'UP42 did not give a quote.',
    );
});

test('[up42-quote-panel-005] names the product in the confirm text and states that no order or credit follows', () => {
  assert.equal(
    confirmText('Pléiades'),
    'Quote Pléiades for this view? This gives no order and spends no credits.',
  );
  assert.deepEqual(
    [ASKING, LOADING_PRODUCTS, NO_PRODUCTS, CACHED],
    [
      'Asking for a quote…',
      'Reading the product list…',
      'UP42 lists no tasking product.',
      'This quote is kept from before.',
    ],
  );
});
