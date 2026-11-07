import { boxAreaKm2 } from '../up42/validate.js';

const UUID =
  /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
const KEYS = new Set(['dataProduct', 'box', 'params', 'checks']);
const PARAMS = new Set([
  'spectralBands',
  'radiometricProcessing',
  'geometricProcessing',
  'pixelCoding',
  'priority',
  'maxIncidenceAngle',
  'maxCloudCover',
  'projection',
  'acquisitionMode',
  'acquisitionStart',
  'acquisitionEnd',
]);
export const CHECKS = [
  'validation',
  'estimate',
  'feasibility',
  'opportunities',
];
export const object = (v) =>
  v !== null && typeof v === 'object' && !Array.isArray(v);
export const isProductId = (v) => typeof v === 'string' && UUID.test(v);
const bad = (error) => ({ ok: false, error });
function scalar(v) {
  return (
    typeof v === 'boolean' ||
    Number.isFinite(v) ||
    (typeof v === 'string' && v.length <= 64 && /^[A-Za-z0-9_.:+ -]*$/.test(v))
  );
}

/** Check all request facts before any upstream call. */
export function validateQuote(text) {
  let v;
  try {
    v = JSON.parse(text);
  } catch {
    return bad('bad_body');
  }
  if (
    !object(v) ||
    !Object.keys(v).every((k) => KEYS.has(k)) ||
    !isProductId(v.dataProduct)
  )
    return bad('bad_body');
  const b = v.box;
  if (
    !Array.isArray(b) ||
    b.length !== 4 ||
    !b.every(Number.isFinite) ||
    b[0] < -180 ||
    b[2] > 180 ||
    b[1] < -90 ||
    b[3] > 90 ||
    b[0] >= b[2] ||
    b[1] >= b[3]
  )
    return bad('bad_bbox');
  const area = boxAreaKm2(b);
  if (area <= 0) return bad('bad_bbox');
  if (area > 2500) return { ok: false, error: 'area_too_large', maxKm2: 2500 };
  const params = v.params === undefined ? {} : v.params;
  if (
    !object(params) ||
    Object.keys(params).length > 11 ||
    !Object.entries(params).every(([k, val]) => PARAMS.has(k) && scalar(val))
  )
    return bad('bad_body');
  const checks = v.checks === undefined ? CHECKS : v.checks;
  if (
    !Array.isArray(checks) ||
    checks.length === 0 ||
    !checks.every((name) => CHECKS.includes(name)) ||
    new Set(checks).size !== checks.length
  )
    return bad('bad_body');
  return {
    ok: true,
    dataProduct: v.dataProduct.toLowerCase(),
    box: [...b],
    params: Object.fromEntries(
      Object.entries(params).sort(([a], [b]) => a.localeCompare(b)),
    ),
    checks: CHECKS.filter((name) => checks.includes(name)),
  };
}
