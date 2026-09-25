import assert from 'node:assert/strict';
import test from 'node:test';
import { createVideoPlayer, createVideoView } from './videoPlayer.js';

/* Synthetic H.264 bytes. No test decodes real video, and no byte comes from a server. */
const START_CODE = [0, 0, 0, 1];
const SPS = [0x67, 0x4d, 0x00, 0x1f, 0xaa, 0xbb];
const SPS_SAME_SIZE = [0x67, 0x64, 0x00, 0x28, 0xaa, 0xcc];
const SPS_LONGER = [0x67, 0x4d, 0x00, 0x1f, 0xaa, 0xbb, 0xcc];
const PPS = [0x68, 0xce, 0x3c, 0x80];
const IDR = [0x65, 0x88, 0x84, 0x01];
const DELTA = [0x41, 0x9a, 0x02, 0x03];
const SEI = [0x06, 0x05, 0x01];

/** One video message: a big-endian double in seconds, the length of the data, and the NAL units. */
function videoMessage(seconds, nals, { lengthDelta = 0 } = {}) {
  const data = Uint8Array.from(nals.flatMap((nal) => [...START_CODE, ...nal]));
  const bytes = new Uint8Array(12 + data.length);
  const view = new DataView(bytes.buffer);
  view.setFloat64(0, seconds);
  view.setUint32(8, data.length + lengthDelta);
  bytes.set(data, 12);
  return bytes;
}

const keyMessage = (seconds, sps = SPS) => videoMessage(seconds, [sps, PPS, IDR]);
const deltaMessage = (seconds) => videoMessage(seconds, [DELTA]);

/** What a decoder gets for one message: the length of each slice in four bytes, then the slice. */
const IDR_SAMPLE = [0, 0, 0, 4, ...IDR];
const DELTA_SAMPLE = [0, 0, 0, 4, ...DELTA];

/** The `avcC` record that the decoder needs for the fixture SPS and PPS, written out byte by byte. */
const AVC_CONFIG = [1, 0x4d, 0x00, 0x1f, 0xff, 0xe1, 0, 6, ...SPS, 1, 0, 4, ...PPS];

/** A decoder class that records its calls in order and lets a test call its callbacks. */
function fakeVideoCodecs() {
  const decoders = [];
  class FakeVideoDecoder {
    constructor(init) {
      this.init = init;
      this.calls = [];
      this.decodeQueueSize = 0;
      this.closeThrows = false;
      this.configureThrows = false;
      this.decodeThrows = false;
      decoders.push(this);
    }

    configure(config) {
      this.calls.push(['configure', config]);
      if (this.configureThrows) throw new Error('the configuration is not supported');
    }

    decode(chunk) {
      this.calls.push(['decode', chunk]);
      if (this.decodeThrows) throw new Error('the decoder is not configured');
    }

    close() {
      this.calls.push(['close']);
      if (this.closeThrows) throw new Error('the decoder is closed');
    }

    of(name) {
      return this.calls.filter((call) => call[0] === name).map((call) => call[1]);
    }
  }
  class FakeEncodedVideoChunk {
    constructor(init) {
      this.init = init;
    }
  }
  return { VideoDecoderImpl: FakeVideoDecoder, EncodedVideoChunkImpl: FakeEncodedVideoChunk, decoders };
}

/** A canvas that records each size it gets and each image it draws. */
function fakeCanvas({ drawThrows = false } = {}) {
  const canvas = {
    sizeWrites: [],
    draws: [],
    contexts: [],
    getContext(kind) {
      canvas.contexts.push(kind);
      return {
        drawImage: (...args) => {
          if (drawThrows) throw new Error('the draw failed');
          canvas.draws.push(args);
        },
      };
    },
  };
  let width = 0;
  let height = 0;
  Object.defineProperties(canvas, {
    width: {
      get: () => width,
      set: (value) => {
        width = value;
        canvas.sizeWrites.push(['width', value]);
      },
    },
    height: {
      get: () => height,
      set: (value) => {
        height = value;
        canvas.sizeWrites.push(['height', value]);
      },
    },
  });
  return canvas;
}

function fakeFrame(displayWidth = 640, displayHeight = 480) {
  return {
    displayWidth,
    displayHeight,
    closes: 0,
    close() {
      this.closes += 1;
    },
  };
}

/** A player with fake codecs, a fake canvas and a list of its statuses. */
function makePlayer(canvasOptions) {
  const codecs = fakeVideoCodecs();
  const canvas = fakeCanvas(canvasOptions);
  const statuses = [];
  const player = createVideoPlayer({ canvas, ...codecs, onStatus: (text) => statuses.push(text) });
  return { player, canvas, statuses, decoders: codecs.decoders };
}

/** A player that has got its first key message, and the decoder that it made. */
function startedPlayer(canvasOptions) {
  const made = makePlayer(canvasOptions);
  made.player.push(keyMessage(100.5));
  return { ...made, decoder: made.decoders[0] };
}

test('[osh-084] the player reports the status `waiting` and makes no decoder when it starts', () => {
  const { statuses, decoders } = makePlayer();
  assert.deepEqual(statuses, ['waiting']);
  assert.equal(decoders.length, 0);
});

test('[osh-084] the player decodes nothing until a key message has an SPS and a PPS', () => {
  const { player, decoders, statuses } = makePlayer();
  player.push(deltaMessage(100.5));
  player.push(videoMessage(100.6, [IDR]));
  player.push(videoMessage(100.7, [SPS, IDR]));
  player.push(videoMessage(100.8, [PPS, IDR]));
  player.push(videoMessage(100.9, [SPS, PPS, DELTA]));
  assert.equal(decoders.length, 0, 'no message made a decoder');
  assert.deepEqual(statuses, ['waiting']);
});

test('[osh-084] the player ignores a message whose length field is wrong or that is too short', () => {
  const { player, decoders } = makePlayer();
  player.push(keyMessage(100.5).subarray(0, 8));
  player.push(videoMessage(100.5, [SPS, PPS, IDR], { lengthDelta: 1 }));
  player.push(videoMessage(100.5, [SPS, PPS, IDR], { lengthDelta: -1 }));
  assert.equal(decoders.length, 0);
});

test('[osh-084] the key message that has an SPS and a PPS configures one decoder', () => {
  const { player, decoders } = makePlayer();
  player.push(keyMessage(100.5));
  assert.equal(decoders.length, 1);
  const [decoder] = decoders;
  assert.equal(typeof decoder.init.output, 'function');
  assert.equal(typeof decoder.init.error, 'function');
  const configures = decoder.of('configure');
  assert.equal(configures.length, 1);
  assert.equal(configures[0].codec, 'avc1.4D001F');
  assert.equal(configures[0].optimizeForLatency, true);
  assert.deepEqual([...configures[0].description], AVC_CONFIG);
  assert.equal(decoder.calls[0][0], 'configure', 'the decoder gets its configuration first');
});

test('[osh-084] the player decodes each message as a key chunk or a delta chunk of its slices', () => {
  const { player, decoder } = startedPlayer();
  player.push(deltaMessage(100.75));
  player.push(keyMessage(101.5));
  const chunks = decoder.of('decode');
  assert.deepEqual(
    chunks.map((chunk) => chunk.init.type),
    ['key', 'delta', 'key'],
  );
  assert.deepEqual(
    chunks.map((chunk) => [...chunk.init.data]),
    [IDR_SAMPLE, DELTA_SAMPLE, IDR_SAMPLE],
    'a chunk holds the slice units only, without the SPS and the PPS',
  );
});

test('[osh-084] the player gives each chunk a time stamp in microseconds after the time stamp of the first decoded message', () => {
  const { player, decoder } = startedPlayer();
  player.push(deltaMessage(100.75));
  player.push(deltaMessage(101.5));
  assert.deepEqual(
    decoder.of('decode').map((chunk) => chunk.init.timestamp),
    [0, 250_000, 1_000_000],
  );
});

test('[osh-084] the player rounds a time stamp to whole microseconds', () => {
  const { player, decoder } = startedPlayer();
  player.push(deltaMessage(100.5037));
  const stamp = decoder.of('decode')[1].init.timestamp;
  assert.equal(stamp, 3700);
  assert.ok(Number.isInteger(stamp));
});

test('[osh-084] the time origin is the first message that the player decodes, and never an ignored message', () => {
  const { player, decoders } = makePlayer();
  player.push(deltaMessage(50));
  player.push(keyMessage(100.5));
  player.push(deltaMessage(100.75));
  assert.deepEqual(
    decoders[0].of('decode').map((chunk) => chunk.init.timestamp),
    [0, 250_000],
  );
});

test('[osh-084] the player ignores a message that has no slice unit', () => {
  const { player, decoder } = startedPlayer();
  player.push(videoMessage(100.6, [SEI]));
  player.push(videoMessage(100.7, [SPS, PPS]));
  assert.equal(decoder.of('decode').length, 1, 'only the first key message became a chunk');
});

test('[osh-084] the player draws each decoded frame at the top left corner of the canvas and closes the frame', () => {
  const { canvas, decoder } = startedPlayer();
  const first = fakeFrame();
  const second = fakeFrame();
  decoder.init.output(first);
  decoder.init.output(second);
  assert.deepEqual(canvas.contexts, ['2d', '2d']);
  assert.deepEqual(canvas.draws, [
    [first, 0, 0],
    [second, 0, 0],
  ]);
  assert.deepEqual([first.closes, second.closes], [1, 1]);
});

test('[osh-084] the player sets the size of the canvas from the first frame and again when it changes', () => {
  const { canvas, decoder } = startedPlayer();
  decoder.init.output(fakeFrame(640, 480));
  assert.deepEqual(canvas.sizeWrites, [
    ['width', 640],
    ['height', 480],
  ]);
  decoder.init.output(fakeFrame(640, 480));
  assert.equal(canvas.sizeWrites.length, 2, 'a frame of the same size leaves the canvas alone');
  decoder.init.output(fakeFrame(800, 480));
  assert.deepEqual(canvas.sizeWrites.slice(2), [
    ['width', 800],
    ['height', 480],
  ]);
  decoder.init.output(fakeFrame(800, 600));
  assert.deepEqual(canvas.sizeWrites.slice(4), [
    ['width', 800],
    ['height', 600],
  ]);
  assert.deepEqual([canvas.width, canvas.height], [800, 600]);
  decoder.init.output(fakeFrame(320, 200));
  assert.deepEqual([canvas.width, canvas.height], [320, 200]);
});

test('[osh-084] when the draw fails, the player closes the frame and reports no live status', () => {
  const { decoder, statuses } = startedPlayer({ drawThrows: true });
  const frame = fakeFrame();
  assert.throws(() => decoder.init.output(frame), /the draw failed/);
  assert.equal(frame.closes, 1);
  assert.deepEqual(statuses, ['waiting']);
});

test('[osh-084] the player reports the status `live` once for a run of frames', () => {
  const { decoder, statuses } = startedPlayer();
  assert.deepEqual(statuses, ['waiting']);
  decoder.init.output(fakeFrame());
  decoder.init.output(fakeFrame());
  decoder.init.output(fakeFrame(800, 600));
  assert.deepEqual(statuses, ['waiting', 'live']);
});

test('[osh-084] when the decoder queue holds more than eight chunks, the player ignores each delta message', () => {
  const { player, decoder } = startedPlayer();
  decoder.decodeQueueSize = 8;
  player.push(deltaMessage(100.6));
  assert.equal(decoder.of('decode').length, 2, 'a queue of eight frames is not too long');
  decoder.decodeQueueSize = 9;
  player.push(deltaMessage(100.7));
  player.push(deltaMessage(100.8));
  assert.equal(decoder.of('decode').length, 2, 'a long queue drops the delta messages');
});

test('[osh-084] after the player ignores a delta message, it ignores each later delta message until the next key message', () => {
  const { player, decoder } = startedPlayer();
  decoder.decodeQueueSize = 9;
  player.push(deltaMessage(100.6));
  decoder.decodeQueueSize = 0;
  player.push(deltaMessage(100.7));
  assert.equal(decoder.of('decode').length, 1, 'a short queue does not end the drop');
  player.push(keyMessage(100.8));
  player.push(deltaMessage(100.9));
  assert.deepEqual(
    decoder.of('decode').map((chunk) => chunk.init.type),
    ['key', 'key', 'delta'],
  );
});

test('[osh-084] the player decodes a key message even when the decoder queue is long', () => {
  const { player, decoder } = startedPlayer();
  decoder.decodeQueueSize = 20;
  player.push(keyMessage(100.6));
  assert.deepEqual(
    decoder.of('decode').map((chunk) => chunk.init.type),
    ['key', 'key'],
  );
});

test('[osh-084] a message that has no slice unit does not make the player ignore later delta messages', () => {
  const { player, decoder } = startedPlayer();
  decoder.decodeQueueSize = 9;
  player.push(videoMessage(100.6, [SEI]));
  decoder.decodeQueueSize = 0;
  player.push(deltaMessage(100.7));
  assert.deepEqual(
    decoder.of('decode').map((chunk) => chunk.init.type),
    ['key', 'delta'],
  );
});

test('[osh-084] a key message with a new SPS configures the same decoder again before it decodes', () => {
  const { player, decoders, decoder } = startedPlayer();
  player.push(keyMessage(100.75, SPS_SAME_SIZE));
  assert.equal(decoders.length, 1, 'the player keeps one decoder');
  assert.deepEqual(
    decoder.calls.map((call) => call[0]),
    ['configure', 'decode', 'configure', 'decode'],
  );
  const configures = decoder.of('configure');
  assert.equal(configures[1].codec, 'avc1.640028');
  assert.deepEqual(
    [...configures[1].description],
    [1, 0x64, 0x00, 0x28, 0xff, 0xe1, 0, 6, ...SPS_SAME_SIZE, 1, 0, 4, ...PPS],
  );
});

test('[osh-084] a key message with an SPS of another size configures the decoder again', () => {
  const { player, decoder } = startedPlayer();
  player.push(keyMessage(100.75, SPS_LONGER));
  assert.equal(decoder.of('configure').length, 2);
  assert.deepEqual(
    [...decoder.of('configure')[1].description].slice(6, 8),
    [0, 7],
    'the record holds the length of the new SPS',
  );
});

test('[osh-084] a key message with the same SPS does not configure the decoder again', () => {
  const { player, decoders, decoder } = startedPlayer();
  player.push(keyMessage(100.75));
  player.push(keyMessage(101));
  assert.equal(decoders.length, 1);
  assert.equal(decoder.of('configure').length, 1);
  assert.equal(decoder.of('decode').length, 3);
});

test('[osh-084] a key message with no PPS does not configure the decoder again', () => {
  const { player, decoder } = startedPlayer();
  player.push(videoMessage(100.75, [SPS_SAME_SIZE, IDR]));
  assert.equal(decoder.of('configure').length, 1);
  assert.deepEqual(
    decoder.of('decode').map((chunk) => chunk.init.type),
    ['key', 'key'],
  );
});

test('[osh-084] the player keeps its own copy of the SPS when the caller reuses the message bytes', () => {
  const { player, decoders } = makePlayer();
  const reused = keyMessage(100.5);
  player.push(reused);
  assert.equal(decoders[0].of('configure').length, 1);
  reused.set(SPS_SAME_SIZE, 12 + START_CODE.length);
  player.push(reused);
  assert.equal(decoders[0].of('configure').length, 2, 'the changed bytes count as a new SPS');
});

test('[osh-084] a decoder error closes the decoder and reports `error`, then `waiting`', () => {
  const { player, statuses, decoders, decoder } = startedPlayer();
  decoder.init.output(fakeFrame());
  decoder.init.error(new Error('the decoder failed'));
  assert.deepEqual(statuses, ['waiting', 'live', 'error', 'waiting']);
  assert.equal(decoder.of('close').length, 1);
  player.push(deltaMessage(100.75));
  player.push(videoMessage(100.8, [IDR]));
  assert.equal(decoder.of('decode').length, 1, 'the old decoder decodes nothing more');
  assert.equal(decoders.length, 1, 'no message without a parameter set makes a new decoder');
});

test('[osh-084] after a decoder error the next key message makes a new decoder, and the player reports `live` again after its first decoded frame', () => {
  const { player, statuses, decoders, decoder } = startedPlayer();
  decoder.init.output(fakeFrame());
  decoder.init.error(new Error('the decoder failed'));
  player.push(keyMessage(101));
  assert.equal(decoders.length, 2);
  const next = decoders[1];
  assert.equal(next.of('configure').length, 1, 'the SPS of the old decoder does not count');
  assert.deepEqual(
    next.of('decode').map((chunk) => [chunk.init.type, chunk.init.timestamp]),
    [['key', 500_000]],
  );
  next.init.output(fakeFrame());
  assert.deepEqual(statuses, ['waiting', 'live', 'error', 'waiting', 'live']);
});

test('[osh-084] after a decoder error the player resets, also when the decoder fails to close', () => {
  const { player, statuses, decoders, decoder } = startedPlayer();
  decoder.closeThrows = true;
  decoder.init.error(new Error('the decoder failed'));
  assert.deepEqual(statuses, ['waiting', 'error', 'waiting']);
  player.push(keyMessage(101));
  assert.equal(decoders.length, 2);
});

test('[osh-084] a configuration that the browser refuses is a decoder error', () => {
  const codecs = fakeVideoCodecs();
  class RefusingDecoder extends codecs.VideoDecoderImpl {
    constructor(init) {
      super(init);
      // The first decoder refuses its configuration, and the second one takes it.
      this.configureThrows = codecs.decoders.length === 1;
    }
  }
  const statuses = [];
  const player = createVideoPlayer({
    canvas: fakeCanvas(),
    ...codecs,
    VideoDecoderImpl: RefusingDecoder,
    onStatus: (text) => statuses.push(text),
  });
  player.push(keyMessage(100.5));
  assert.deepEqual(statuses, ['waiting', 'error', 'waiting']);
  assert.equal(codecs.decoders[0].of('close').length, 1);
  assert.equal(codecs.decoders[0].of('decode').length, 0, 'a refused configuration decodes nothing');
  player.push(keyMessage(101));
  assert.equal(codecs.decoders.length, 2, 'the next key message makes a new decoder');
  assert.equal(codecs.decoders[1].of('decode').length, 1);
});

test('[osh-084] a decoder that throws from decode makes the player reset the decoder, and the player starts again at the next key message', () => {
  const { player, statuses, decoders, decoder } = startedPlayer();
  decoder.decodeThrows = true;
  player.push(deltaMessage(100.75));
  assert.deepEqual(statuses, ['waiting', 'error', 'waiting']);
  assert.equal(decoder.of('close').length, 1);
  player.push(deltaMessage(100.8));
  assert.equal(decoder.of('decode').length, 2, 'the old decoder gets no more messages');
  player.push(keyMessage(101));
  assert.equal(decoders.length, 2);
  assert.equal(decoders[1].of('configure').length, 1, 'the SPS of the old decoder does not count');
  assert.equal(decoders[1].of('decode').length, 1);
});

test('[osh-084] a decoder class that throws from its constructor is a decoder error', () => {
  let made = 0;
  class BrokenDecoder {
    constructor() {
      made += 1;
      if (made === 1) throw new Error('the decoder cannot start');
      this.calls = [];
    }

    configure() {}

    decode() {}

    close() {}
  }
  const statuses = [];
  const player = createVideoPlayer({
    canvas: fakeCanvas(),
    VideoDecoderImpl: BrokenDecoder,
    EncodedVideoChunkImpl: fakeVideoCodecs().EncodedVideoChunkImpl,
    onStatus: (text) => statuses.push(text),
  });
  player.push(keyMessage(100.5));
  assert.deepEqual(statuses, ['waiting', 'error', 'waiting']);
  player.push(deltaMessage(100.75));
  player.push(keyMessage(101));
  assert.equal(made, 2, 'the next key message tries a new decoder');
});

test('[osh-084] the close method closes the decoder, and the player decodes no later message', () => {
  const { player, decoders, decoder } = startedPlayer();
  player.close();
  assert.equal(decoder.of('close').length, 1);
  player.push(deltaMessage(100.75));
  player.push(keyMessage(101, SPS_SAME_SIZE));
  assert.equal(decoder.of('decode').length, 1);
  assert.equal(decoder.of('configure').length, 1);
  player.close();
  assert.equal(decoder.of('close').length, 1, 'a second close does nothing');
  assert.equal(decoders.length, 1);
});

test('[osh-084] the close method makes no decoder when the player has none', () => {
  const { player, decoders } = makePlayer();
  player.close();
  player.push(keyMessage(100.5));
  assert.equal(decoders.length, 0);
});

test('[osh-084] the close method does not throw when the decoder fails to close', () => {
  const { player, decoder } = startedPlayer();
  decoder.closeThrows = true;
  assert.doesNotThrow(() => player.close());
  assert.equal(decoder.of('close').length, 1);
});

test('[osh-084] after the close method the player draws nothing and reports nothing for a callback of the decoder', () => {
  const { player, canvas, statuses, decoder } = startedPlayer();
  player.close();
  const frame = fakeFrame();
  decoder.init.output(frame);
  decoder.init.error(new Error('the decoder failed'));
  assert.equal(frame.closes, 1, 'the player still closes the frame');
  assert.deepEqual(canvas.draws, []);
  assert.deepEqual(canvas.sizeWrites, []);
  assert.deepEqual(statuses, ['waiting']);
  assert.equal(decoder.of('close').length, 1);
});

test('[osh-084] the player takes the global decoder classes and needs no status callback', () => {
  const codecs = fakeVideoCodecs();
  const originalDecoder = globalThis.VideoDecoder;
  const originalChunk = globalThis.EncodedVideoChunk;
  globalThis.VideoDecoder = codecs.VideoDecoderImpl;
  globalThis.EncodedVideoChunk = codecs.EncodedVideoChunkImpl;
  try {
    const player = createVideoPlayer({ canvas: fakeCanvas() });
    player.push(keyMessage(100.5));
    assert.equal(codecs.decoders.length, 1);
    assert.equal(codecs.decoders[0].of('decode').length, 1);
    codecs.decoders[0].init.output(fakeFrame());
    player.close();
  } finally {
    if (originalDecoder === undefined) delete globalThis.VideoDecoder;
    else globalThis.VideoDecoder = originalDecoder;
    if (originalChunk === undefined) delete globalThis.EncodedVideoChunk;
    else globalThis.EncodedVideoChunk = originalChunk;
  }
});

test('[osh-085] the player reports `unsupported` and decodes nothing when it has no decoder class', () => {
  const codecs = fakeVideoCodecs();
  const statuses = [];
  const player = createVideoPlayer({
    canvas: fakeCanvas(),
    VideoDecoderImpl: null,
    EncodedVideoChunkImpl: codecs.EncodedVideoChunkImpl,
    onStatus: (text) => statuses.push(text),
  });
  assert.deepEqual(statuses, ['unsupported']);
  assert.doesNotThrow(() => player.push(keyMessage(100.5)));
  assert.doesNotThrow(() => player.close());
  assert.deepEqual(statuses, ['unsupported']);
  assert.equal(codecs.decoders.length, 0);
});

test('[osh-085] the player reports `unsupported` and decodes nothing when it has no chunk class', () => {
  const codecs = fakeVideoCodecs();
  const statuses = [];
  const player = createVideoPlayer({
    canvas: fakeCanvas(),
    VideoDecoderImpl: codecs.VideoDecoderImpl,
    EncodedVideoChunkImpl: null,
    onStatus: (text) => statuses.push(text),
  });
  player.push(keyMessage(100.5));
  assert.deepEqual(statuses, ['unsupported']);
  assert.equal(codecs.decoders.length, 0);
});

test('[osh-085] the player reports `unsupported` when the page has no global decoder classes', () => {
  const originalDecoder = globalThis.VideoDecoder;
  const originalChunk = globalThis.EncodedVideoChunk;
  delete globalThis.VideoDecoder;
  delete globalThis.EncodedVideoChunk;
  try {
    const statuses = [];
    const player = createVideoPlayer({ canvas: fakeCanvas(), onStatus: (text) => statuses.push(text) });
    player.push(keyMessage(100.5));
    assert.deepEqual(statuses, ['unsupported']);
  } finally {
    if (originalDecoder !== undefined) globalThis.VideoDecoder = originalDecoder;
    if (originalChunk !== undefined) globalThis.EncodedVideoChunk = originalChunk;
  }
});

test('[osh-085] the player reports `unsupported` when a decoder class is not a function', () => {
  const statuses = [];
  createVideoPlayer({
    canvas: fakeCanvas(),
    VideoDecoderImpl: {},
    EncodedVideoChunkImpl: {},
    onStatus: (text) => statuses.push(text),
  });
  assert.deepEqual(statuses, ['unsupported']);
});

/** A small fake of a document, a host and the elements of the view. */
function fakeDocument() {
  const elements = [];
  function createElement(tag) {
    const element = {
      tag,
      className: '',
      textContent: '',
      children: [],
      appendChild(child) {
        element.children.push(child);
        return child;
      },
      removeChild(child) {
        const at = element.children.indexOf(child);
        if (at < 0) throw new Error('The child is not in this element');
        element.children.splice(at, 1);
        return child;
      },
    };
    elements.push(element);
    return element;
  }
  return { createElement, elements };
}

function makeView(name) {
  const document = fakeDocument();
  const host = document.createElement('section');
  const view = createVideoView({ document, host, name });
  return { document, host, view };
}

test('[osh-087] the view puts a title, a canvas and a status in one block of the host', () => {
  const { host, view } = makeView('Camera fixture');
  assert.equal(host.children.length, 1);
  const [block] = host.children;
  assert.equal(block.tag, 'div');
  assert.equal(block.className, 'osh-video');
  assert.deepEqual(
    block.children.map((child) => [child.tag, child.className]),
    [
      ['div', 'osh-video-title'],
      ['canvas', 'osh-video-canvas'],
      ['div', 'osh-video-status'],
    ],
  );
  assert.equal(view.canvas, block.children[1]);
});

test('[osh-087] the view shows the name as its title, and Video when the name is empty', () => {
  const named = makeView('Camera fixture');
  assert.equal(named.host.children[0].children[0].textContent, 'Camera fixture');
  const unnamed = makeView(undefined);
  assert.equal(unnamed.host.children[0].children[0].textContent, 'Video');
  const empty = makeView('');
  assert.equal(empty.host.children[0].children[0].textContent, 'Video');
});

test('[osh-087] the view sets the text of its status', () => {
  const { host, view } = makeView('Camera fixture');
  const status = host.children[0].children[2];
  assert.equal(status.textContent, '');
  view.setStatus('live');
  assert.equal(status.textContent, 'live');
  view.setStatus('reconnecting');
  assert.equal(status.textContent, 'reconnecting');
  assert.equal(host.children[0].children[0].textContent, 'Camera fixture', 'the title stays');
});

test('[osh-087] the destroy method removes the block from the host, and only that block', () => {
  const { document, host, view } = makeView('Camera fixture');
  const other = document.createElement('p');
  host.appendChild(other);
  view.destroy();
  assert.deepEqual(host.children, [other]);
});

test('[osh-087] the destroy method does nothing when the block is already removed', () => {
  const { document, host, view } = makeView('Camera fixture');
  view.destroy();
  const later = document.createElement('p');
  host.appendChild(later);
  assert.doesNotThrow(() => view.destroy());
  assert.deepEqual(host.children, [later], 'the second call leaves the host alone');
});
