/**
 * Pure HTML for the selected OSH system detail: the system fields, then one
 * block per datastream with its newest result as key/value rows.
 */

import { isOshObservationAhead, isOshObservationFresh } from '../../data/oshObservations.js';

const AGE_SECOND_MS = 1000;
const AGE_MINUTE_MS = 60 * AGE_SECOND_MS;
const AGE_HOUR_MS = 60 * AGE_MINUTE_MS;
const AGE_DAY_MS = 24 * AGE_HOUR_MS;

/**
 * The age in words: `12 s`, `5 min`, `3 h`, `6 d`. `age unknown` for a null
 * or otherwise non-finite age. A negative age — the record's own time is
 * ahead of the provider's clock — reads as `0 s`, not as a negative amount.
 * @param {*} ageMs
 * @returns {string}
 */
export function formatOshAge(ageMs) {
  if (!Number.isFinite(ageMs)) return 'age unknown';
  // Further ahead of our clock than drift explains. The record is not new,
  // it is wrong, so it does not read as an amount of time.
  if (isOshObservationAhead(ageMs)) return 'ahead of the clock';
  const clamped = ageMs < 0 ? 0 : ageMs;
  if (clamped < AGE_MINUTE_MS) return `${Math.round(clamped / AGE_SECOND_MS)} s`;
  if (clamped < AGE_HOUR_MS) return `${Math.round(clamped / AGE_MINUTE_MS)} min`;
  if (clamped < AGE_DAY_MS) return `${Math.round(clamped / AGE_HOUR_MS)} h`;
  return `${Math.round(clamped / AGE_DAY_MS)} d`;
}

function renderAge(ageMs) {
  const text = formatOshAge(ageMs);
  if (isOshObservationFresh(ageMs)) {
    return `<div class="osh-detail-age">${escapeHtml(text)}</div>`;
  }
  // An unknown age, and a time further ahead than drift explains, both keep
  // the class and refuse the word `old`. Neither is a large age: one is not
  // known, and the other is not a past time at all.
  if (!Number.isFinite(ageMs) || isOshObservationAhead(ageMs)) {
    return `<div class="osh-detail-age osh-detail-old">${escapeHtml(text)}</div>`;
  }
  return `<div class="osh-detail-age osh-detail-old">${escapeHtml(text)} old</div>`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderRows(rows) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return '<div class="osh-detail-row osh-detail-empty">No data</div>';
  }
  return rows
    .map(
      (row) =>
        `<div class="osh-detail-row"><span class="osh-detail-path">${escapeHtml(row.path)}</span><span class="osh-detail-value">${escapeHtml(row.value)}</span></div>`,
    )
    .join('');
}

/**
 * A video datastream has a picture and no rows, so the block shows no time,
 * no age and no `No data`: it would say the datastream is empty while the
 * panel plays it (osh-088).
 */
function renderVideoDatastream(datastream) {
  return `<div class="osh-detail-datastream">
    <h4>${escapeHtml(datastream.name || datastream.id)}</h4>
    <div class="osh-detail-row osh-detail-video">Video</div>
  </div>`;
}

function renderDatastream(datastream) {
  if (datastream.video) return renderVideoDatastream(datastream);
  const observation = datastream.observation;
  const rows = observation?.rows;
  const time = observation?.resultTime;
  return `<div class="osh-detail-datastream">
    <h4>${escapeHtml(datastream.name || datastream.id)}</h4>
    <div class="osh-detail-time">${time ? escapeHtml(time) : '—'}</div>
    ${renderAge(observation ? (observation.ageMs ?? null) : null)}
    ${renderRows(rows)}
  </div>`;
}

/**
 * A system placed only by a fresh stream record shows which datastream
 * placed it, and the record's own age in the same words the datastream
 * blocks below use (osh-032, mirroring the entity's own stream-placed
 * lifecycle, osh-057).
 */
function renderPlacedBy(placedBy) {
  if (!placedBy) return '';
  const name = placedBy.datastreamName || '—';
  return `<div class="osh-detail-field osh-detail-placed-by">Placed by ${escapeHtml(name)} (${escapeHtml(formatOshAge(placedBy.ageMs))})</div>`;
}

function renderSystemHeader(system) {
  return `<div class="osh-detail-system">
    <h3>${escapeHtml(system.name || system.id)}</h3>
    <div class="osh-detail-field">UID: ${escapeHtml(system.uid || '—')}</div>
    <div class="osh-detail-field">${escapeHtml(system.description || '')}</div>
    ${renderPlacedBy(system.placedBy)}
  </div>`;
}

/**
 * The feature's own name, above its host's name — or the host's id when the
 * host has no record, or an em dash when the feature has no host.
 */
function renderFeatureHeader(feature, hostId, system) {
  const hostLabel = system ? system.name || system.id : hostId || '—';
  return `<div class="osh-detail-feature">
    <h3>${escapeHtml(feature.name || feature.id)}</h3>
    <div class="osh-detail-field">Host: ${escapeHtml(hostLabel)}</div>
    ${renderPlacedBy(feature.placedBy)}
  </div>`;
}

/**
 * @param {?{feature: ?object, hostId: ?string, system: ?object, datastreams: Array}} detail
 * @returns {string} HTML, or an empty string for no selection.
 */
export function renderOshDetail(detail) {
  if (!detail || (!detail.system && !detail.feature)) return '';
  const { feature = null, hostId = null, system = null, datastreams = [] } = detail;
  const header = feature
    ? renderFeatureHeader(feature, hostId, system)
    : renderSystemHeader(system);
  return header + datastreams.map(renderDatastream).join('');
}

/**
 * Write the detail into a host element, or clear it for no selection.
 * @param {?{innerHTML: string}} host
 * @param {?object} detail
 */
export function writeOshDetail(host, detail) {
  if (!host) return;
  host.innerHTML = detail ? renderOshDetail(detail) : '';
}
