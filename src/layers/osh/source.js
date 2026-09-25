/**
 * Read the OpenSensorHub systems, datastreams, features, locations and
 * newest-observation endpoints. The server already applies the shared
 * adapters before it caches a response, so this file validates the
 * envelope and passes the records through unchanged. It also opens the
 * live stream and the video stream of one datastream.
 */

async function readOshResponse(fetchImpl, path, { signal } = {}) {
  const response = await fetchImpl(path, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });
  if (response.status === 503) {
    const body = await response.json().catch(() => null);
    if (body?.error === 'no_key') return { keyRequired: true, payload: null };
    throw new Error(`OSH HTTP ${response.status}`);
  }
  if (!response.ok) throw new Error(`OSH HTTP ${response.status}`);
  const payload = await response.json();
  signal?.throwIfAborted();
  return { keyRequired: false, payload };
}

/**
 * Give the events of the route that show the state of the upstream to their
 * callbacks. The browser also raises `open` when the connection itself opens.
 * Only the event of the route has data, and it says the upstream is open. The
 * `error` event of the browser also means `down`.
 */
function listenToStreamState(stream, { onOpen, onDown, onUnsupported }) {
  stream.addEventListener('open', (event) => {
    if (typeof event.data === 'string') onOpen();
  });
  stream.addEventListener('down', () => onDown());
  stream.addEventListener('unsupported', () => onUnsupported());
  stream.addEventListener('error', () => onDown());
}

/**
 * The bytes of a `frame` event: its data is one JSON string of base64 text.
 * @returns {?Uint8Array} Null when the data is not that.
 */
function decodeFrameData(data) {
  let text;
  try {
    text = JSON.parse(data);
  } catch {
    return null;
  }
  if (typeof text !== 'string') return null;
  let binary;
  try {
    binary = atob(text);
  } catch {
    return null;
  }
  const bytes = new Uint8Array(binary.length);
  for (let at = 0; at < binary.length; at += 1)
    bytes[at] = binary.charCodeAt(at);
  return bytes;
}

export function createOshSource({
  fetchImpl = (...args) => globalThis.fetch(...args),
  eventSourceImpl,
} = {}) {
  return {
    async getSystems({ signal } = {}) {
      const { keyRequired, payload } = await readOshResponse(
        fetchImpl,
        '/api/osh/systems',
        {
          signal,
        },
      );
      if (keyRequired) return { keyRequired: true, systems: [], stale: false };
      if (!Array.isArray(payload?.systems))
        throw new Error('Malformed OSH systems payload');
      return {
        keyRequired: false,
        systems: payload.systems,
        stale: Boolean(payload.stale),
      };
    },

    async getDatastreams({ system, signal } = {}) {
      const path = system
        ? `/api/osh/datastreams?system=${encodeURIComponent(system)}`
        : '/api/osh/datastreams';
      const { keyRequired, payload } = await readOshResponse(fetchImpl, path, {
        signal,
      });
      if (keyRequired) return { keyRequired: true, datastreams: [] };
      if (!Array.isArray(payload?.datastreams))
        throw new Error('Malformed OSH datastreams payload');
      return { keyRequired: false, datastreams: payload.datastreams };
    },

    async getFois({ signal } = {}) {
      const { keyRequired, payload } = await readOshResponse(
        fetchImpl,
        '/api/osh/fois',
        {
          signal,
        },
      );
      if (keyRequired) return { keyRequired: true, fois: [], truncated: false };
      if (!Array.isArray(payload?.fois))
        throw new Error('Malformed OSH fois payload');
      return {
        keyRequired: false,
        fois: payload.fois,
        truncated: Boolean(payload.truncated),
      };
    },

    async getLocations({ signal } = {}) {
      const { keyRequired, payload } = await readOshResponse(
        fetchImpl,
        '/api/osh/locations',
        {
          signal,
        },
      );
      if (keyRequired) return { keyRequired: true, locations: [], failed: 0 };
      if (!Array.isArray(payload?.locations))
        throw new Error('Malformed OSH locations payload');
      return {
        keyRequired: false,
        locations: payload.locations,
        failed: Number.isFinite(payload.failed) ? payload.failed : 0,
      };
    },

    async getObservation(datastreamId, { signal } = {}) {
      const path = `/api/osh/observations?datastream=${encodeURIComponent(datastreamId)}`;
      const { keyRequired, payload } = await readOshResponse(fetchImpl, path, {
        signal,
      });
      if (keyRequired) return { keyRequired: true, observation: null };
      if (
        !payload ||
        typeof payload !== 'object' ||
        !('observation' in payload)
      )
        throw new Error('Malformed OSH observation payload');
      return { keyRequired: false, observation: payload.observation };
    },

    /**
     * Open the live stream of one datastream (osh-071). One same-origin GET
     * with no credentials; the browser opens the connection again after a
     * break. The route sends the events `observation`, `open`, `down` and
     * `unsupported`, and the `error` event of the browser also means `down`.
     */
    openLive(datastreamId, { onObservation, onOpen, onDown, onUnsupported }) {
      const url = `/api/osh/live?datastream=${encodeURIComponent(datastreamId)}`;
      const stream = new (eventSourceImpl ?? globalThis.EventSource)(url);
      stream.addEventListener('observation', (event) => {
        let observation;
        try {
          observation = JSON.parse(event.data);
        } catch {
          return;
        }
        if (
          observation &&
          typeof observation === 'object' &&
          !Array.isArray(observation)
        ) {
          onObservation(observation);
        }
      });
      listenToStreamState(stream, { onOpen, onDown, onUnsupported });
      return { close: () => stream.close() };
    },

    /**
     * Open the video stream of one datastream (osh-082). One same-origin GET
     * with no credentials. The route sends the events `frame`, `open`, `down`
     * and `unsupported`, as the live route does. The data of a `frame` is one
     * whole video message as base64 text in one JSON string, and the callback
     * gets its bytes.
     */
    openVideo(datastreamId, { onFrame, onOpen, onDown, onUnsupported }) {
      const url = `/api/osh/video?datastream=${encodeURIComponent(datastreamId)}`;
      const stream = new (eventSourceImpl ?? globalThis.EventSource)(url);
      stream.addEventListener('frame', (event) => {
        const bytes = decodeFrameData(event.data);
        if (bytes !== null) onFrame(bytes);
      });
      listenToStreamState(stream, { onOpen, onDown, onUnsupported });
      return { close: () => stream.close() };
    },
  };
}
