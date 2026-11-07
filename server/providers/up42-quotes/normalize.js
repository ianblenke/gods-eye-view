import { isProductId, object } from './validate.js';

const text = (v) =>
  typeof v === 'string'
    ? v.replace(/[\u0000-\u001f\u007f-\u009f]/g, '').slice(0, 160)
    : undefined;
const bad = () => ({ ok: false, error: 'bad_upstream' });
const nonnegative = (v) => Number.isFinite(v) && v >= 0;
function reasons(errors, key) {
  if (errors === undefined) return [];
  if (
    !Array.isArray(errors) ||
    !errors.every((e) => object(e) && typeof e[key] === 'string')
  )
    return null;
  return errors.map((e) => text(e[key]));
}

/** Public discovery facts only. Invalid rows cannot grant membership. */
export function normalizeProducts(v) {
  if (!object(v) || !Array.isArray(v.content)) return null;
  const products = [];
  for (const row of v.content) {
    if (
      !object(row) ||
      !isProductId(row.id) ||
      (row.title !== undefined && typeof row.title !== 'string') ||
      (row.collection !== undefined && typeof row.collection !== 'string')
    )
      return null;
    const product = {
      id: row.id.toLowerCase(),
      title: text(row.title) || row.id.toLowerCase(),
    };
    if (row.collection !== undefined) product.collection = text(row.collection);
    products.push(product);
  }
  return products;
}
function validation(v) {
  const rows = Object.values(v);
  if (rows.length !== 1 || !object(rows[0])) return bad();
  const row = rows[0];
  if (!['VALID', 'INVALID', 'UNAVAILABLE'].includes(row.status)) return bad();
  const errors = reasons(row.errors, 'errorReason');
  if (errors === null) return bad();
  if (typeof row.unavailabilityReason === 'string')
    errors.push(text(row.unavailabilityReason));
  return { ok: true, status: row.status, errors };
}
function estimate(v, errors) {
  const s = v.summary;
  if (
    !object(s) ||
    !nonnegative(s.totalCredits) ||
    !nonnegative(s.totalSize) ||
    !['SQ_KM', 'SCENE', null].includes(s.unit)
  )
    return bad();
  return {
    ok: true,
    credits: s.totalCredits,
    size: s.totalSize,
    unit: s.unit,
    errors,
  };
}
function feasibility(row) {
  if (typeof row.feasibilityStudyRequired !== 'boolean') return bad();
  const out = {
    ok: true,
    feasibilityStudyRequired: row.feasibilityStudyRequired,
  };
  if (['LOW', 'HIGH', null].includes(row.difficulty))
    out.difficulty = row.difficulty;
  if (['FEASIBLE', 'NOT_FEASIBLE', null].includes(row.feasibilityOutcome))
    out.outcome = row.feasibilityOutcome;
  if (typeof row.comment === 'string') out.comment = text(row.comment);
  return out;
}
function opportunities(row) {
  const list = row.opportunities;
  if (!object(list) || !Array.isArray(list.features)) return bad();
  const out = [];
  for (const feature of list.features.slice(0, 50)) {
    if (
      !object(feature) ||
      typeof feature.id !== 'string' ||
      !object(feature.properties)
    )
      return bad();
    const p = feature.properties;
    const pass = { id: text(feature.id) };
    for (const [to, from] of [
      ['start', 'start_datetime'],
      ['end', 'end_datetime'],
    ]) {
      if (typeof p[from] === 'string') pass[to] = text(p[from]);
    }
    for (const [to, from] of [
      ['incidenceAngle', 'view:incidence_angle'],
      ['offNadir', 'view:off_nadir'],
    ]) {
      if (Number.isFinite(p[from])) pass[to] = p[from];
    }
    out.push(pass);
  }
  return {
    ok: true,
    count: out.length,
    opportunities: out,
    truncated: list.features.length > 50,
  };
}

/** A successful HTTP status alone does not prove a geometry result. */
export function normalizeCheck(name, v) {
  if (!object(v)) return bad();
  if (name === 'validation') return validation(v);
  const errors = reasons(v.errors, 'message');
  if (errors === null) return bad();
  if (name === 'estimate') return estimate(v, errors);
  if (errors.length > 0) return { ok: false, error: 'geometry_errors' };
  if (
    !Array.isArray(v.results) ||
    v.results.length !== 1 ||
    !object(v.results[0])
  )
    return bad();
  return name === 'feasibility'
    ? feasibility(v.results[0])
    : opportunities(v.results[0]);
}
