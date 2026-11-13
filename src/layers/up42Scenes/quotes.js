/** Records and texts of the quote flow of the UP42 Scenes layer. */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_TEXT = 160;
const NAMES = ['validation', 'estimate', 'feasibility', 'opportunities'];
const LABELS = {
  validation: 'Validation',
  estimate: 'Estimate',
  feasibility: 'Feasibility',
  opportunities: 'Passes',
};

const FAILURES = Object.freeze({
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
});
const GENERIC = 'UP42 did not give a quote.';
export const ASKING = 'Asking for a quote…';
export const LOADING_PRODUCTS = 'Reading the product list…';
export const NO_PRODUCTS = 'UP42 lists no tasking product.';
export const CACHED = 'This quote is kept from before.';

const whole = (value) => Number.isInteger(value) && value >= 0;
const text = (value) =>
  typeof value === 'string' && value.length > 0 && value.length <= MAX_TEXT;
const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/** The products of a good answer, or null when one product is not valid. */
export function normalizeProducts(body) {
  if (!Array.isArray(body?.products)) return null;
  const products = [];
  for (const item of body.products) {
    if (!isObject(item) || typeof item.id !== 'string' || !UUID.test(item.id))
      return null;
    products.push({
      id: item.id,
      title: text(item.title) ? item.title : item.id,
    });
  }
  return products;
}

const FACTS = {
  validation: { status: text },
  estimate: { credits: Number.isFinite, size: Number.isFinite, unit: text },
  feasibility: { outcome: text, difficulty: text },
  opportunities: { count: whole },
};
const REQUIRED = {
  validation: 'status',
  estimate: 'credits',
  feasibility: 'outcome',
  opportunities: 'count',
};

function normalizeCheck(name, value) {
  if (!isObject(value) || typeof value.ok !== 'boolean')
    return { ok: false, error: 'bad_answer' };
  if (!value.ok)
    return { ok: false, error: text(value.error) ? value.error : 'bad_answer' };
  const facts = {};
  for (const [key, accept] of Object.entries(FACTS[name])) {
    if (accept(value[key])) facts[key] = value[key];
  }
  return Object.hasOwn(facts, REQUIRED[name])
    ? { ok: true, ...facts }
    : { ok: false, error: 'bad_answer' };
}

/** The quote of a good answer, or null when it has no valid fact. */
export function normalizeQuote(body) {
  if (!isObject(body) || !isObject(body.results)) return null;
  if (typeof body.cached !== 'boolean') return null;
  const budget = body.budget;
  if (!isObject(budget) || !whole(budget.used) || !whole(budget.limit))
    return null;
  const results = {};
  for (const name of NAMES) {
    if (Object.hasOwn(body.results, name))
      results[name] = normalizeCheck(name, body.results[name]);
  }
  return Object.keys(results).length === 0
    ? null
    : {
        results,
        cached: body.cached,
        budget: { used: budget.used, limit: budget.limit },
      };
}

const FACT_TEXT = {
  validation: (r) => r.status,
  estimate: (r) =>
    `${r.credits} credits` +
    (Number.isFinite(r.size)
      ? ` for ${r.size}${r.unit ? ` ${r.unit}` : ''}`
      : ''),
  feasibility: (r) => r.outcome,
  opportunities: (r) => String(r.count),
};

/** The text of a quote: one part for each check, then the budget. */
export function describeQuote({ results, cached, budget }) {
  const parts = [];
  for (const name of NAMES) {
    const result = results[name];
    if (result === undefined) continue;
    parts.push(
      result.ok
        ? `${LABELS[name]}: ${FACT_TEXT[name](result)}`
        : `${LABELS[name]}: not available (${describeQuoteFailure({ error: result.error })})`,
    );
  }
  if (cached) parts.push(CACHED);
  parts.push(
    `Quotes today: ${budget.used} of ${budget.limit}. No order was made.`,
  );
  return parts.join(' · ');
}

/** The text for a failed quote call: `{status?, error}`. */
export function describeQuoteFailure({ error }) {
  return Object.hasOwn(FAILURES, error) ? FAILURES[error] : GENERIC;
}

/** The text that asks a person to confirm one quote. */
export const confirmText = (title) =>
  `Quote ${title} for this view? This gives no order and spends no credits.`;
