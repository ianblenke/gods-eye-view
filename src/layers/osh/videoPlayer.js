/**
 * The browser side of the camera video (design decisions D76 and D77). The
 * player decodes the video messages of one stream with WebCodecs and draws
 * each frame on a canvas. The view is the block of DOM that holds the canvas.
 * The decoder classes, the canvas and the document are options, so the tests
 * use fakes and the real decoder runs only in a browser.
 */
import {
  buildAvcConfig,
  codecStringOf,
  findParameterSets,
  hasKeyNal,
  readOshVideoMessage,
  splitNalUnits,
  toAvccSample,
} from '../../data/oshVideo.js';

/** The player ignores delta messages while the decoder queue holds more chunks than this. */
const MAX_DECODE_QUEUE = 8;

function sameBytes(first, second) {
  return first.length === second.length && first.every((byte, at) => byte === second[at]);
}

/**
 * Decode the video messages of one stream onto a canvas.
 * @param {object} options
 * @param {{width: number, height: number, getContext: Function}} options.canvas
 * @param {Function} [options.VideoDecoderImpl] The `VideoDecoder` class.
 * @param {Function} [options.EncodedVideoChunkImpl] The `EncodedVideoChunk` class.
 * @param {(status: string) => void} [options.onStatus] Called with `unsupported`,
 *   `waiting`, `live` or `error`.
 * @returns {{push: (bytes: Uint8Array) => void, close: () => void}} `push` takes
 *   the bytes of one whole video message.
 */
export function createVideoPlayer({
  canvas,
  VideoDecoderImpl = globalThis.VideoDecoder,
  EncodedVideoChunkImpl = globalThis.EncodedVideoChunk,
  onStatus = () => {},
}) {
  // A page that is not secure has no WebCodecs.
  if (typeof VideoDecoderImpl !== 'function' || typeof EncodedVideoChunkImpl !== 'function') {
    onStatus('unsupported');
    return { push() {}, close() {} };
  }

  let decoder = null;
  // The SPS that the decoder is configured with. A new SPS needs a new configuration.
  let sps = null;
  let originMs = null;
  let closed = false;
  let live = false;
  // After an ignored message the delta messages that follow refer to a message that the decoder never got.
  let droppingDeltas = false;
  let shownWidth = null;
  let shownHeight = null;

  function output(frame) {
    if (closed) {
      frame.close();
      return;
    }
    try {
      // A new size clears the canvas, so the size is set only when it changes.
      if (frame.displayWidth !== shownWidth || frame.displayHeight !== shownHeight) {
        shownWidth = frame.displayWidth;
        shownHeight = frame.displayHeight;
        canvas.width = shownWidth;
        canvas.height = shownHeight;
      }
      canvas.getContext('2d').drawImage(frame, 0, 0);
    } finally {
      // An open frame holds decoder memory, so it is closed even when the draw throws.
      frame.close();
    }
    if (!live) {
      live = true;
      onStatus('live');
    }
  }

  function error() {
    if (closed) return;
    onStatus('error');
    try {
      decoder.close();
    } catch {
      // The decoder can be closed already, or the class could not make one.
    }
    decoder = null;
    sps = null;
    live = false;
    onStatus('waiting');
  }

  onStatus('waiting');

  return {
    push(bytes) {
      if (closed) return;
      const message = readOshVideoMessage(bytes);
      if (message === null) return;
      const nals = splitNalUnits(message.data);
      const key = hasKeyNal(nals);
      if (key) {
        droppingDeltas = false;
        const found = findParameterSets(nals);
        if (found.sps && found.pps && (sps === null || !sameBytes(sps, found.sps))) {
          try {
            decoder ??= new VideoDecoderImpl({ output, error });
            decoder.configure({
              codec: codecStringOf(found.sps),
              description: buildAvcConfig(found.sps, found.pps),
              optimizeForLatency: true,
            });
          } catch {
            // A configuration that the browser refuses is the same as a decoder error.
            error();
            return;
          }
          // A copy, so the bytes of the message do not stay in memory or change.
          sps = found.sps.slice();
        }
      }
      if (decoder === null) return;
      const sample = toAvccSample(nals);
      if (sample === null) return;
      if (!key && (droppingDeltas || decoder.decodeQueueSize > MAX_DECODE_QUEUE)) {
        droppingDeltas = true;
        return;
      }
      originMs ??= message.timestampMs;
      try {
        decoder.decode(
          new EncodedVideoChunkImpl({
            type: key ? 'key' : 'delta',
            timestamp: Math.round((message.timestampMs - originMs) * 1000),
            data: sample,
          }),
        );
      } catch {
        // A decoder that throws from `decode` is broken, so the player starts again at the next key message.
        error();
      }
    },

    close() {
      closed = true;
      if (decoder === null) return;
      try {
        decoder.close();
      } catch {
        // The decoder can be closed already.
      }
      decoder = null;
    },
  };
}

/**
 * Build the block of the video in a host: a title, a canvas and a status.
 * @param {object} options
 * @param {Document} options.document
 * @param {Element} options.host
 * @param {string} [options.name] The title. `Video` when it is empty.
 * @returns {{canvas: Element, setStatus: (text: string) => void, destroy: () => void}}
 */
export function createVideoView({ document, host, name }) {
  const block = document.createElement('div');
  block.className = 'osh-video';
  const title = document.createElement('div');
  title.className = 'osh-video-title';
  title.textContent = name || 'Video';
  const canvas = document.createElement('canvas');
  canvas.className = 'osh-video-canvas';
  const status = document.createElement('div');
  status.className = 'osh-video-status';
  block.appendChild(title);
  block.appendChild(canvas);
  block.appendChild(status);
  host.appendChild(block);
  let removed = false;
  return {
    canvas,
    setStatus(text) {
      status.textContent = text;
    },
    destroy() {
      if (removed) return;
      removed = true;
      host.removeChild(block);
    },
  };
}
