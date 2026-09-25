import { oshOpenStream } from './get.js';
import { mapOshObservation, oshObservationAgeMs } from '../../../src/data/oshObservations.js';
import { isOshVideoKeyMessage, readOshVideoMessage } from '../../../src/data/oshVideo.js';

/**
 * The live relay of the OpenSensorHub provider (design decisions D65 to
 * D69, and D73 to D75 for video). The hub keeps one upstream WebSocket for
 * each datastream and each kind, shared by every client of that entry, and
 * relays each message to those clients as a server-sent event. It only
 * listens: no scanned file of the provider uses the name `send` outside a
 * comment, and oshOpenStream() in get.js is the only place that builds a
 * socket. The runtime writes only control frames to the upstream: a pong for
 * each ping, and a close frame when a socket closes.
 *
 * A client is `{start, write, end}`. `start()` writes the response head
 * and runs once, before the first `write()`. Every event is `event: <name>`
 * and `data: <one JSON value>`. The names are `observation`, `open`, `down`
 * and `unsupported`, and `frame` for a video entry. A comment line `: hb`
 * keeps a proxy from closing an idle connection.
 *
 * An entry has a kind. The kind `observation` relays each JSON frame as an
 * observation. The kind `video` relays each binary video message as a
 * `frame` event, and it keeps the messages from the last key message on for a
 * client that joins late. The two kinds of one datastream id are two
 * entries, with two sockets.
 */

/** At most this many datastreams count toward the limit, and this many clients listen to one. */
export const OSH_LIVE_MAX_SOCKETS = 8;
export const OSH_LIVE_MAX_CLIENTS = 16;
/** A frame over this many bytes is not an observation. It is a video frame. */
export const OSH_LIVE_MAX_FRAME_BYTES = 65_536;
/** A video message over this many bytes closes the socket. A key message is larger than an observation. */
export const OSH_VIDEO_MAX_MESSAGE_BYTES = 2_097_152;
/** The messages from the last key message on stay only while they total at most this many bytes. */
export const OSH_VIDEO_MAX_GROUP_BYTES = 2_097_152;
/** A client whose response has more than this many bytes not yet written does not read. The route destroys that response. */
export const OSH_LIVE_MAX_CLIENT_BUFFER_BYTES = 8_388_608;
/** The upstream socket stays this long after the last client leaves. */
export const OSH_LIVE_IDLE_MS = 2_000;
/** The route refuses a datastream this long after an oversize frame. */
export const OSH_LIVE_REFUSE_MS = 10 * 60_000;
export const OSH_LIVE_HEARTBEAT_MS = 20_000;
/** A socket that stays open this long resets the delay before the next open. */
export const OSH_LIVE_STABLE_MS = 30_000;
/** The delay before each new attempt, and the last delay repeats. */
export const OSH_LIVE_RETRY_MS = Object.freeze([1_000, 2_000, 4_000, 8_000, 16_000, 30_000]);

const HEARTBEAT = ': hb\n\n';

function eventText(name, data) {
  return `event: ${name}\ndata: ${JSON.stringify(data)}\n\n`;
}

/** The key of an entry: the datastream id, and for a video entry the id with a prefix. */
function entryKey(id, kind) {
  return kind === 'video' ? `video:${id}` : id;
}

/**
 * @param {object} [options]
 * @param {typeof WebSocket} [options.WebSocketImpl] - Injected WebSocket constructor.
 * @param {() => number} [options.now]
 * @param {(...args: any[]) => void} [options.warn]
 * @param {{setTimeout: Function, clearTimeout: Function, setInterval: Function, clearInterval: Function}} [options.timers] - Injected timers.
 */
export function createOshLiveHub({
  WebSocketImpl = globalThis.WebSocket,
  now = Date.now,
  warn = console.warn,
  timers = { setTimeout, clearTimeout, setInterval, clearInterval },
} = {}) {
  const entries = new Map();
  const refusedUntil = new Map();

  function broadcast(entry, text) {
    for (const client of entry.clients.keys()) client.write(text);
  }

  function endClients(entry) {
    for (const client of entry.clients.keys()) client.end();
  }

  /** Clear the timers of one entry, close its socket and forget it. */
  function drop(entry) {
    entries.delete(entry.key);
    for (const timer of [entry.idleTimer, entry.retryTimer, entry.stableTimer]) {
      timers.clearTimeout(timer);
    }
    for (const timer of entry.clients.values()) timers.clearInterval(timer);
    entry.clients.clear();
    const { socket } = entry;
    entry.socket = null;
    entry.open = false;
    if (socket) socket.close();
  }

  /** The socket of an entry is gone. Tell the clients, and open it again while one listens. */
  function down(entry) {
    timers.clearTimeout(entry.stableTimer);
    entry.stableTimer = null;
    entry.socket = null;
    entry.open = false;
    entry.group = [];
    entry.groupBytes = 0;
    broadcast(entry, eventText('down', {}));
    if (entry.clients.size === 0) {
      drop(entry);
      return;
    }
    const delay = OSH_LIVE_RETRY_MS[Math.min(entry.attempt, OSH_LIVE_RETRY_MS.length - 1)];
    entry.attempt += 1;
    entry.retryTimer = timers.setTimeout(() => {
      entry.retryTimer = null;
      connect(entry);
    }, delay);
  }

  function opened(entry) {
    entry.open = true;
    entry.stableTimer = timers.setTimeout(() => {
      entry.attempt = 0;
    }, OSH_LIVE_STABLE_MS);
    broadcast(entry, eventText('open', {}));
  }

  /** A frame or a message over the size limit: stop the stream, and refuse the datastream and the kind. */
  function refuse(entry) {
    refusedUntil.set(entry.key, now() + OSH_LIVE_REFUSE_MS);
    broadcast(entry, eventText('unsupported', {}));
    endClients(entry);
    drop(entry);
  }

  /** Decode one frame, binary or text, and relay it as the observation of osh-022. */
  function relay(entry, data) {
    const bytes = typeof data === 'string' ? Buffer.byteLength(data) : data.byteLength;
    if (bytes > OSH_LIVE_MAX_FRAME_BYTES) {
      refuse(entry);
      return;
    }
    let frame;
    try {
      frame = JSON.parse(typeof data === 'string' ? data : new TextDecoder().decode(data));
    } catch {
      return;
    }
    if (!frame || !Object.hasOwn(frame, 'result')) return;
    const observation = mapOshObservation({ items: [frame] }, entry.reader);
    broadcast(
      entry,
      eventText('observation', {
        ...observation,
        ageMs: oshObservationAgeMs(observation.phenomenonTime, now()),
      }),
    );
  }

  /**
   * Keep the event text of a video message for a client that joins late. A
   * key message starts the group again. Any other message joins the group
   * when one exists. A group over the byte limit is emptied, and it stays
   * empty until the next key message.
   */
  function remember(entry, bytes, text) {
    if (isOshVideoKeyMessage(bytes)) {
      entry.group = [text];
      entry.groupBytes = bytes.byteLength;
    } else if (entry.group.length > 0) {
      entry.groupBytes += bytes.byteLength;
      if (entry.groupBytes > OSH_VIDEO_MAX_GROUP_BYTES) {
        entry.group = [];
        entry.groupBytes = 0;
      } else {
        entry.group.push(text);
      }
    }
  }

  /**
   * Relay one binary video message as a `frame` event. The data of the event
   * is the base64 text of the whole message. A text message, a message that
   * is not a good video message and a message over the size limit are never
   * relayed, and the last one stops the stream like a frame of the live kind.
   */
  function relayVideo(entry, data) {
    if (typeof data === 'string') return;
    if (data.byteLength > OSH_VIDEO_MAX_MESSAGE_BYTES) {
      refuse(entry);
      return;
    }
    const bytes = new Uint8Array(data);
    if (readOshVideoMessage(bytes) === null) return;
    const base64 = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64');
    const text = eventText('frame', base64);
    remember(entry, bytes, text);
    broadcast(entry, text);
  }

  function connect(entry) {
    let socket;
    try {
      socket = oshOpenStream(WebSocketImpl, entry.url, { headers: entry.headers });
    } catch {
      // Fixed text only: the message of a failure can name the URL.
      warn('[osh-live] upstream socket not created');
      down(entry);
      return;
    }
    entry.socket = socket;
    // An event of a socket that the entry no longer holds changes nothing.
    const current = (handler) => (event) => {
      if (entry.socket === socket) handler(event);
    };
    const gone = current((event) => {
      warn(`[osh-live] upstream socket ended, code ${Number(event.code) || 0}`);
      down(entry);
    });
    socket.addEventListener('open', current(() => opened(entry)));
    socket.addEventListener(
      'message',
      current((event) => (entry.kind === 'video' ? relayVideo : relay)(entry, event.data)),
    );
    socket.addEventListener('close', gone);
    socket.addEventListener('error', gone);
  }

  function leave(entry, client) {
    if (!entry.clients.has(client)) return;
    timers.clearInterval(entry.clients.get(client));
    entry.clients.delete(client);
    if (entry.clients.size === 0) {
      entry.idleTimer = timers.setTimeout(() => drop(entry), OSH_LIVE_IDLE_MS);
    }
  }

  /**
   * Add one client to the entry of a datastream and a kind. The first client
   * opens the upstream socket. The reader, the URL and the headers of the
   * first client stay for the life of the entry. A client of a video entry
   * that joins an open socket also gets the messages of the current group,
   * after the event `open`.
   * @param {string} id - Datastream id, already checked by the route.
   * @param {{url: URL, headers: Record<string,string>, reader: ?object, kind?: 'observation'|'video'}} stream
   * @param {{start: () => void, write: (text: string) => void, end: () => void}} client
   * @returns {{error: string}|{leave: () => void}} An error code, or the function that removes the client.
   */
  function join(id, { url, headers, reader, kind = 'observation' }, client) {
    const key = entryKey(id, kind);
    if ((refusedUntil.get(key) ?? 0) > now()) return { error: 'live_unsupported' };
    const existing = entries.get(key);
    const full = existing
      ? existing.clients.size >= OSH_LIVE_MAX_CLIENTS
      : entries.size >= OSH_LIVE_MAX_SOCKETS;
    if (full) return { error: 'live_busy' };
    client.start();
    const entry = existing || {
      key,
      kind,
      url,
      headers,
      reader,
      clients: new Map(),
      socket: null,
      open: false,
      group: [],
      groupBytes: 0,
      attempt: 0,
      idleTimer: null,
      retryTimer: null,
      stableTimer: null,
    };
    entries.set(key, entry);
    timers.clearTimeout(entry.idleTimer);
    entry.idleTimer = null;
    entry.clients.set(client, timers.setInterval(() => client.write(HEARTBEAT), OSH_LIVE_HEARTBEAT_MS));
    if (entry.open) client.write(eventText('open', {}));
    for (const text of entry.group) client.write(text);
    if (!existing) connect(entry);
    return { leave: () => leave(entry, client) };
  }

  /** End every client, clear every timer and close every socket. */
  function close() {
    for (const entry of [...entries.values()]) {
      endClients(entry);
      drop(entry);
    }
  }

  return { join, close };
}
