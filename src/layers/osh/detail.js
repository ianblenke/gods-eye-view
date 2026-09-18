/**
 * Pure HTML for the selected OSH system detail: the system fields, then one
 * block per datastream with its newest result as key/value rows.
 */

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

function renderDatastream(datastream) {
  const rows = datastream.observation?.rows;
  const time = datastream.observation?.resultTime;
  return `<div class="osh-detail-datastream">
    <h4>${escapeHtml(datastream.name || datastream.id)}</h4>
    <div class="osh-detail-time">${time ? escapeHtml(time) : '—'}</div>
    ${renderRows(rows)}
  </div>`;
}

function renderSystemHeader(system) {
  return `<div class="osh-detail-system">
    <h3>${escapeHtml(system.name || system.id)}</h3>
    <div class="osh-detail-field">UID: ${escapeHtml(system.uid || '—')}</div>
    <div class="osh-detail-field">${escapeHtml(system.description || '')}</div>
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
