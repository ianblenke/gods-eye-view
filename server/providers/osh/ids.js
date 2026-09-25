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
  const url = new URL(
    `datastreams/${encodeURIComponent(id)}/observations`,
    root,
  );
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

/**
 * The observation format of the live stream (design decision D64) and its
 * fixed query. The serializer encodes the value, so a `+` and a `/` reach
 * the server as bytes of the value and never as a space or a path separator.
 */
export const OSH_LIVE_FORMAT = 'application/om+json';
export const OSH_LIVE_QUERY = new URLSearchParams({
  f: OSH_LIVE_FORMAT,
}).toString();

/**
 * Build the live-stream URL for one datastream id: the observations path
 * of `observationUrl()` with the scheme `ws` for an `http` root and `wss`
 * for an `https` root, the fixed format query and no credentials. The id
 * sits between two fixed path segments, and the query is assigned as a
 * whole after the id is in place. The credentials of the provider travel
 * in a header, never in this URL.
 * @param {URL} root - Resolved API root, trailing slash.
 * @param {string} id - An id already checked by readDatastreamId.
 * @returns {URL}
 */
export function liveUrl(root, id) {
  const url = new URL(
    `datastreams/${encodeURIComponent(id)}/observations`,
    root,
  );
  url.protocol = root.protocol === 'https:' ? 'wss:' : 'ws:';
  url.username = '';
  url.password = '';
  url.search = OSH_LIVE_QUERY;
  return url;
}

/**
 * Re-check a built live-stream URL against its root and id. Throws when the
 * scheme, the host, the path, the query, the user name, the password or the
 * fragment does not match exactly what liveUrl() would build. Mirrors
 * assertObservationUrl() above.
 * @param {URL} url
 * @param {URL} root
 * @param {string} id
 */
export function assertLiveUrl(url, root, id) {
  const expectedProtocol = root.protocol === 'https:' ? 'wss:' : 'ws:';
  const expectedPathname = `${root.pathname}datastreams/${id}/observations`;
  if (
    url.protocol !== expectedProtocol ||
    url.host !== root.host ||
    url.pathname !== expectedPathname ||
    url.search !== `?${OSH_LIVE_QUERY}` ||
    url.username !== '' ||
    url.password !== '' ||
    url.hash !== ''
  ) {
    throw new Error('OSH live URL failed the safety check');
  }
}

/**
 * The binary format of the video stream (design decision D73) and its fixed
 * query. It is the live query with another value of `f`.
 */
export const OSH_VIDEO_FORMAT = 'application/swe+binary';
export const OSH_VIDEO_QUERY = new URLSearchParams({
  f: OSH_VIDEO_FORMAT,
}).toString();

/**
 * Build the video URL for one datastream id: the same URL as
 * liveUrl(), with the format query of the binary video messages. It has the
 * scheme `ws` for an `http` root and `wss` for an `https` root, and no
 * credentials. The credentials of the provider travel in a header, never in
 * this URL.
 * @param {URL} root - Resolved API root, trailing slash.
 * @param {string} id - An id already checked by readDatastreamId.
 * @returns {URL}
 */
export function videoUrl(root, id) {
  const url = new URL(
    `datastreams/${encodeURIComponent(id)}/observations`,
    root,
  );
  url.protocol = root.protocol === 'https:' ? 'wss:' : 'ws:';
  url.username = '';
  url.password = '';
  url.search = OSH_VIDEO_QUERY;
  return url;
}

/**
 * Re-check a built video URL against its root and id. Throws when the
 * scheme, the host, the path, the query, the user name, the password or the
 * fragment does not match exactly what videoUrl() would build. Mirrors
 * assertLiveUrl() above.
 * @param {URL} url
 * @param {URL} root
 * @param {string} id
 */
export function assertVideoUrl(url, root, id) {
  const expectedProtocol = root.protocol === 'https:' ? 'wss:' : 'ws:';
  const expectedPathname = `${root.pathname}datastreams/${id}/observations`;
  if (
    url.protocol !== expectedProtocol ||
    url.host !== root.host ||
    url.pathname !== expectedPathname ||
    url.search !== `?${OSH_VIDEO_QUERY}` ||
    url.username !== '' ||
    url.password !== '' ||
    url.hash !== ''
  ) {
    throw new Error('OSH video URL failed the safety check');
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
  const url = new URL(
    `datastreams/${encodeURIComponent(id)}/observations`,
    root,
  );
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
