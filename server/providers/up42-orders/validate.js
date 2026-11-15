import { isProductId, object, validateQuote } from '../up42-quotes/validate.js';

const UUID =
  /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
const bad = (error) => ({ ok: false, error });

export const isUuid = (v) => typeof v === 'string' && UUID.test(v);

/** The cap of credits, or null when the text is not a whole number from 1 to 1000000. */
export function capOf(text) {
  if (typeof text !== 'string' || !/^\d{1,7}$/.test(text)) return null;
  const n = Number(text);
  return n >= 1 && n <= 1_000_000 ? n : null;
}

const parse = (text) => {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};
const credits = (v) => Number.isFinite(v) && v > 0;

/** Check an order request before any upstream call. */
export function validateOrder(text, cap) {
  const v = parse(text);
  if (
    !object(v) ||
    !Object.keys(v).every((k) =>
      ['dataProduct', 'box', 'params', 'approvedCredits'].includes(k),
    ) ||
    !isProductId(v.dataProduct) ||
    !credits(v.approvedCredits) ||
    v.approvedCredits > cap
  )
    return bad('bad_body');
  const { approvedCredits, ...rest } = v;
  const input = validateQuote(JSON.stringify(rest));
  if (!input.ok) return input;
  const { checks, ok, ...order } = input;
  return { ok: true, ...order, approvedCredits };
}

/** Check an accept request. */
export function validateAccept(text) {
  const v = parse(text);
  if (
    !object(v) ||
    !Object.keys(v).every(
      (k) => k === 'quotationId' || k === 'approvedCredits',
    ) ||
    !isUuid(v.quotationId) ||
    !credits(v.approvedCredits)
  )
    return bad('bad_body');
  return {
    ok: true,
    quotationId: v.quotationId.toLowerCase(),
    approvedCredits: v.approvedCredits,
  };
}

/** Check a reject request. */
export function validateReject(text) {
  const v = parse(text);
  if (!object(v) || Object.keys(v).length !== 1 || !isUuid(v.quotationId))
    return bad('bad_body');
  return { ok: true, quotationId: v.quotationId.toLowerCase() };
}
