/** Records and texts of the order steps of the UP42 Scenes layer. */

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DECISION = /^[A-Z_]{1,32}$/;

export const isUuid = (value) => typeof value === 'string' && UUID.test(value);
const credits = (value) => Number.isFinite(value) && value >= 0;
const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

/** The order of a good answer, or null. */
export function normalizeOrder(body) {
  return isObject(body) && isUuid(body.orderId) && credits(body.credits)
    ? { orderId: body.orderId, credits: body.credits }
    : null;
}

/** The quotation of a good answer, `{quotation: null}` or `{quotation}`, or null. */
export function normalizeQuotation(body) {
  if (!isObject(body)) return null;
  const q = body.quotation;
  if (q === null) return { quotation: null };
  return isObject(q) &&
    isUuid(q.id) &&
    credits(q.credits) &&
    typeof q.decision === 'string' &&
    DECISION.test(q.decision)
    ? { quotation: { id: q.id, credits: q.credits, decision: q.decision } }
    : null;
}

export const normalizeAccept = (body) =>
  isObject(body) && body.accepted === true && credits(body.credits)
    ? { credits: body.credits }
    : null;
export const normalizeReject = (body) =>
  isObject(body) && body.rejected === true ? {} : null;

const FAILURES = Object.freeze({
  orders_off:
    'Orders are off. Set UP42_ORDERS=true in .env and restart the app.',
  no_cap:
    'No credit cap. Set UP42_ORDER_MAX_CREDITS in .env and restart the app.',
  no_credentials:
    'No UP42 credentials. Set UP42_USERNAME and UP42_PASSWORD in .env and restart the app.',
  credentials_rejected:
    'UP42 refused the credentials. Check UP42_USERNAME and UP42_PASSWORD in .env.',
  store_failed:
    'The server cannot write its order file. Check the volume of the app.',
  rate_limited: 'Too many order requests. Wait 60 seconds.',
  budget: 'No more orders today.',
  busy: 'The server is still working on this request.',
  duplicate: 'This order exists already. Check the quotation.',
  over_cap:
    'The price is above the credit cap of the server. Nothing is spent.',
  over_approved:
    'The price is above the price that you saw. Nothing is spent. Quote again.',
  insufficient_balance: 'The UP42 balance is too low. Nothing is spent.',
  order_refused: 'UP42 refused the order. No order was made.',
  accept_refused: 'UP42 refused to accept the quotation. Nothing is spent.',
  reject_refused: 'UP42 refused to reject the quotation.',
  unknown_order: 'The server does not know this order.',
  unknown_quotation: 'UP42 does not list this quotation.',
  not_ours:
    'This quotation belongs to an order that this server did not place.',
  decided: 'This quotation has its decision already.',
  area_too_large: 'The view is too large for an order. Zoom in and try again.',
  order_unclear:
    'UP42 gave no clear answer. An order can exist. Check UP42 before you try again.',
  accept_unclear:
    'UP42 gave no clear answer. Credits can be spent. Check the order in UP42 before you try again.',
  reject_unclear:
    'UP42 gave no clear answer. Check the order in UP42 before you try again.',
  upstream_failed: 'UP42 did not answer correctly.',
  unreachable: 'The server did not answer.',
  bad_answer: 'The server sent an answer that the layer cannot read.',
});
const GENERIC = 'UP42 did not complete the step.';

/** The text for a failed order call: `{status?, error}`. */
export function describeOrderFailure({ error }) {
  return Object.hasOwn(FAILURES, error) ? FAILURES[error] : GENERIC;
}

export const ORDERING = 'Placing the order…';
export const CHECKING = 'Reading the quotation…';
export const ACCEPTING = 'Accepting the quotation…';
export const REJECTING = 'Rejecting the quotation…';
export const NO_QUOTATION = 'UP42 has no quotation yet.';
export const REJECTED = 'The quotation is rejected. No credits are spent.';

export const orderConfirmText = (title, amount) =>
  `Order ${title} for this view? The estimate is ${amount} credits. This spends no credits yet.`;
export const orderedText = (orderId) =>
  `Order ${orderId.slice(0, 8)} is placed. No credits are spent.`;
export const quotationText = ({ credits: amount, decision }) =>
  decision === 'NOT_DECIDED'
    ? `Quotation: ${amount} credits.`
    : `This quotation is ${decision.toLowerCase()}.`;
export const acceptConfirmText = (amount) =>
  `Accept the quotation of ${amount} credits? This spends ${amount} credits. UP42 cannot reverse it.`;
export const acceptedText = (amount) =>
  `The quotation is accepted. ${amount} credits are spent.`;
export const rejectConfirmText = (amount) =>
  `Reject the quotation of ${amount} credits? The order stays unpaid and spends no credits.`;
