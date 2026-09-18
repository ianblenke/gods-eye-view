/**
 * The datastream-id boundary. A datastream id from the browser becomes part
 * of an upstream URL, so this file keeps the id to a strict grammar, builds
 * the URL one fixed way, and re-checks the built URL before any network
 * call. See design decision D13 in the change proposal.
 */

/** A datastream id has no scheme, authority, dot segment, separator or space. */
export const OSH_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

/** Fixed query for the newest-observation request (S7, low confidence). */
export const OSH_OBSERVATIONS_QUERY = 'limit=1&resultTime=latest';

/**
 * Read the `datastream` query parameter and check it against the id
 * pattern. Returns null for a missing, empty, repeated or malformed value —
 * never a partial or decoded value.
 * @param {URLSearchParams} searchParams
 * @returns {?string}
 */
export function readDatastreamId(searchParams) {
  const values = searchParams.getAll('datastream');
  if (values.length !== 1) return null;
  const [value] = values;
  return OSH_ID_PATTERN.test(value) ? value : null;
}

/**
 * Build the observations URL for one datastream id. The id sits between two
 * fixed path segments, and the query is assigned as a whole after the id is
 * in place, so the id cannot extend the path or append to the query.
 * @param {URL} root - Resolved API root, trailing slash.
 * @param {string} id - An id already checked by readDatastreamId.
 * @returns {URL}
 */
export function observationUrl(root, id) {
  const url = new URL(`datastreams/${encodeURIComponent(id)}/observations`, root);
  url.search = OSH_OBSERVATIONS_QUERY;
  return url;
}

/**
 * Re-check a built observation URL against its root and id. Throws when the
 * origin, the path or the query does not match exactly what
 * observationUrl() would build. Runs on every request, even if a later edit
 * relaxes OSH_ID_PATTERN.
 * @param {URL} url
 * @param {URL} root
 * @param {string} id
 */
export function assertObservationUrl(url, root, id) {
  const expectedPathname = `${root.pathname}datastreams/${id}/observations`;
  if (
    url.origin !== root.origin ||
    url.pathname !== expectedPathname ||
    url.search !== `?${OSH_OBSERVATIONS_QUERY}` ||
    url.hash !== ''
  ) {
    throw new Error('OSH observation URL failed the safety check');
  }
}

/** Fixed query for the per-system datastreams request. */
export const OSH_SYSTEM_DATASTREAMS_QUERY = 'limit=100';

/**
 * Read the `system` query parameter and check it against the id pattern.
 * Returns null for a missing, empty, repeated or malformed value — never a
 * partial or decoded value. Mirrors readDatastreamId() above.
 * @param {URLSearchParams} searchParams
 * @returns {?string}
 */
export function readSystemId(searchParams) {
  const values = searchParams.getAll('system');
  if (values.length !== 1) return null;
  const [value] = values;
  return OSH_ID_PATTERN.test(value) ? value : null;
}

/**
 * Build the per-system datastreams URL for one system id. The id sits
 * between two fixed path segments, and the query is assigned as a whole
 * after the id is in place, so the id cannot extend the path or append to
 * the query. Mirrors observationUrl() above.
 * @param {URL} root - Resolved API root, trailing slash.
 * @param {string} id - An id already checked by readSystemId.
 * @returns {URL}
 */
export function systemDatastreamsUrl(root, id) {
  const url = new URL(`systems/${encodeURIComponent(id)}/datastreams`, root);
  url.search = OSH_SYSTEM_DATASTREAMS_QUERY;
  return url;
}

/**
 * Re-check a built per-system datastreams URL against its root and id.
 * Throws when the origin, the path or the query does not match exactly what
 * systemDatastreamsUrl() would build. Mirrors assertObservationUrl() above.
 * @param {URL} url
 * @param {URL} root
 * @param {string} id
 */
export function assertSystemDatastreamsUrl(url, root, id) {
  const expectedPathname = `${root.pathname}systems/${id}/datastreams`;
  if (
    url.origin !== root.origin ||
    url.pathname !== expectedPathname ||
    url.search !== `?${OSH_SYSTEM_DATASTREAMS_QUERY}` ||
    url.hash !== ''
  ) {
    throw new Error('OSH system datastreams URL failed the safety check');
  }
}

/**
 * Build the schema URL for one datastream id. The id sits between two fixed
 * path segments, and the URL carries no query. Mirrors observationUrl()
 * above.
 * @param {URL} root - Resolved API root, trailing slash.
 * @param {string} id - An id already checked by readDatastreamId.
 * @returns {URL}
 */
export function schemaUrl(root, id) {
  const url = new URL(`datastreams/${encodeURIComponent(id)}/schema`, root);
  url.search = '';
  return url;
}

/**
 * Re-check a built schema URL against its root and id. Throws when the
 * origin, the path or the query does not match exactly what schemaUrl()
 * would build.
 * @param {URL} url
 * @param {URL} root
 * @param {string} id
 */
export function assertSchemaUrl(url, root, id) {
  const expectedPathname = `${root.pathname}datastreams/${id}/schema`;
  if (
    url.origin !== root.origin ||
    url.pathname !== expectedPathname ||
    url.search !== '' ||
    url.hash !== ''
  ) {
    throw new Error('OSH schema URL failed the safety check');
  }
}

/**
 * Build the URL of one system by id. The id sits after a fixed path
 * segment, and the URL carries no query. Mirrors observationUrl() above.
 * @param {URL} root - Resolved API root, trailing slash.
 * @param {string} id - An id already checked by readSystemId.
 * @returns {URL}
 */
export function systemUrl(root, id) {
  const url = new URL(`systems/${encodeURIComponent(id)}`, root);
  url.search = '';
  return url;
}

/**
 * Re-check a built system URL against its root and id. Throws when the
 * origin, the path or the query does not match exactly what systemUrl()
 * would build.
 * @param {URL} url
 * @param {URL} root
 * @param {string} id
 */
export function assertSystemUrl(url, root, id) {
  const expectedPathname = `${root.pathname}systems/${id}`;
  if (
    url.origin !== root.origin ||
    url.pathname !== expectedPathname ||
    url.search !== '' ||
    url.hash !== ''
  ) {
    throw new Error('OSH system URL failed the safety check');
  }
}

/** Newest-per-feature page size: the number of distinct features one `latest` request answers. */
export const OSH_LATEST_LIMIT = 300;

/** Fixed query for the newest-per-feature observations request (D45). */
export const OSH_LATEST_QUERY = `limit=${OSH_LATEST_LIMIT}&resultTime=latest`;

/**
 * Build the newest-per-feature observations URL for one datastream id. The
 * id sits between two fixed path segments, and the query is assigned as a
 * whole after the id is in place. Mirrors observationUrl() above; unlike
 * it, this page is never walked (see design decision D45).
 * @param {URL} root - Resolved API root, trailing slash.
 * @param {string} id - An id already checked by readDatastreamId.
 * @returns {URL}
 */
export function observationsLatestUrl(root, id) {
  const url = new URL(`datastreams/${encodeURIComponent(id)}/observations`, root);
  url.search = OSH_LATEST_QUERY;
  return url;
}

/**
 * Re-check a built newest-per-feature URL against its root and id. Throws
 * when the origin, the path or the query does not match exactly what
 * observationsLatestUrl() would build.
 * @param {URL} url
 * @param {URL} root
 * @param {string} id
 */
export function assertObservationsLatestUrl(url, root, id) {
  const expectedPathname = `${root.pathname}datastreams/${id}/observations`;
  if (
    url.origin !== root.origin ||
    url.pathname !== expectedPathname ||
    url.search !== `?${OSH_LATEST_QUERY}` ||
    url.hash !== ''
  ) {
    throw new Error('OSH newest-per-feature URL failed the safety check');
  }
}
