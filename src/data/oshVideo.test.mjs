import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  OSH_VIDEO_ENVELOPE_BYTES,
  buildAvcConfig,
  codecStringOf,
  findParameterSets,
  hasKeyNal,
  isOshVideoKeyMessage,
  nalTypeOf,
  readOshVideoMessage,
  splitNalUnits,
  toAvccSample,
} from './oshVideo.js';

// Synthetic NAL units. Only the first byte, the type, matters to the helper.
const SPS = Uint8Array.from([0x67, 0x4d, 0x00, 0x1f, 0xaa, 0xbb]);
const PPS = Uint8Array.from([0x68, 0xce, 0x3c, 0x80]);
const IDR = Uint8Array.from([0x65, 0x88, 0x84, 0x01, 0x02]);
const IDR_TWO = Uint8Array.from([0x65, 0x11, 0x22]);
const DELTA = Uint8Array.from([0x41, 0x9a, 0x20, 0x33]);
const SEI = Uint8Array.from([0x06, 0x05, 0x10]);
const AUD = Uint8Array.from([0x09, 0xf0]);

const START4 = [0, 0, 0, 1];
const START3 = [0, 0, 1];

/** Annex B data: each NAL unit after its start code. */
function annexB(units, start = START4) {
  return Uint8Array.from(units.flatMap((unit) => [...start, ...unit]));
}

/** A whole message: the envelope and the data. `length` can be wrong on purpose. */
function message(data, { seconds = 1_790_000_000.25, length = data.length } = {}) {
  const bytes = new Uint8Array(OSH_VIDEO_ENVELOPE_BYTES + data.length);
  const view = new DataView(bytes.buffer);
  view.setFloat64(0, seconds);
  view.setUint32(8, length);
  bytes.set(data, OSH_VIDEO_ENVELOPE_BYTES);
  return bytes;
}

test('[osh-083] the reader returns the time stamp in milliseconds and the H.264 data of a good message', () => {
  const data = annexB([SPS, PPS, IDR]);
  const read = readOshVideoMessage(message(data));
  assert.equal(read.timestampMs, 1_790_000_000_250);
  assert.deepEqual([...read.data], [...data]);
  const empty = readOshVideoMessage(message(new Uint8Array(0)));
  assert.equal(empty.data.length, 0);
});

test('[osh-083] the reader gives null for a message with a wrong length field, a short message or a time stamp that is not a number', () => {
  const data = annexB([IDR]);
  assert.equal(readOshVideoMessage(message(data, { length: data.length + 1 })), null);
  assert.equal(readOshVideoMessage(message(data, { length: data.length - 1 })), null);
  assert.equal(readOshVideoMessage(message(data, { length: 0 })), null);
  assert.equal(readOshVideoMessage(new Uint8Array(OSH_VIDEO_ENVELOPE_BYTES - 1)), null);
  assert.equal(readOshVideoMessage(new Uint8Array(0)), null);
  assert.equal(readOshVideoMessage(message(data, { seconds: Number.NaN })), null);
  assert.equal(readOshVideoMessage(message(data, { seconds: Number.POSITIVE_INFINITY })), null);
});

test('[osh-083] the reader reads a message that is a view into a larger buffer', () => {
  const data = annexB([DELTA]);
  const whole = message(data);
  const padded = new Uint8Array(whole.length + 10);
  padded.set(whole, 5);
  const read = readOshVideoMessage(padded.subarray(5, 5 + whole.length));
  assert.equal(read.timestampMs, 1_790_000_000_250);
  assert.deepEqual([...read.data], [...data]);
});

test('[osh-083] the splitter cuts H.264 data at a start code of three bytes and at a start code of four bytes', () => {
  for (const start of [START4, START3]) {
    const units = splitNalUnits(annexB([SPS, PPS, IDR], start));
    assert.deepEqual(units.map((unit) => [...unit]), [[...SPS], [...PPS], [...IDR]], `start code of ${start.length} bytes`);
  }
  const mixed = Uint8Array.from([...START4, ...SPS, ...START3, ...PPS, ...START4, ...IDR]);
  assert.deepEqual(splitNalUnits(mixed).map((unit) => [...unit]), [[...SPS], [...PPS], [...IDR]]);
});

test('[osh-083] the splitter removes the zero bytes before the next start code and ignores bytes before the first one', () => {
  const data = Uint8Array.from([9, 9, ...START4, ...IDR, 0, 0, ...START4, ...DELTA, 0]);
  const units = splitNalUnits(data);
  assert.deepEqual(units.map((unit) => [...unit]), [[...IDR], [...DELTA]]);
  assert.deepEqual(splitNalUnits(Uint8Array.from([1, 2, 3, 4])), []);
  assert.deepEqual(splitNalUnits(new Uint8Array(0)), []);
  assert.deepEqual(splitNalUnits(Uint8Array.from(START4)).map((unit) => unit.length), [0]);
});

test('[osh-083] the type of a NAL unit is the low five bits of its first byte', () => {
  assert.equal(nalTypeOf(SPS), 7);
  assert.equal(nalTypeOf(PPS), 8);
  assert.equal(nalTypeOf(IDR), 5);
  assert.equal(nalTypeOf(DELTA), 1);
  assert.equal(nalTypeOf(Uint8Array.from([0xe5])), 5);
});

test('[osh-083] a list of NAL units is a key list only when it holds a NAL unit of type 5', () => {
  assert.equal(hasKeyNal([SPS, PPS, IDR]), true);
  assert.equal(hasKeyNal([DELTA, DELTA]), false);
  assert.equal(hasKeyNal([SEI, AUD]), false);
  assert.equal(hasKeyNal([]), false);
});

test('[osh-083] a whole message is a key message only when it is valid and holds an IDR slice', () => {
  assert.equal(isOshVideoKeyMessage(message(annexB([SPS, PPS, IDR]))), true);
  assert.equal(isOshVideoKeyMessage(message(annexB([IDR_TWO]))), true);
  assert.equal(isOshVideoKeyMessage(message(annexB([DELTA, DELTA]))), false);
  assert.equal(isOshVideoKeyMessage(message(annexB([SPS, PPS]))), false);
  assert.equal(isOshVideoKeyMessage(message(annexB([IDR]), { length: 1 })), false);
  assert.equal(isOshVideoKeyMessage(new Uint8Array(3)), false);
});

test('[osh-083] the parameter sets are the first SPS and the first PPS of the list', () => {
  const other = Uint8Array.from([0x67, 0x01, 0x02, 0x03]);
  const found = findParameterSets([DELTA, SPS, other, PPS, PPS]);
  assert.deepEqual([...found.sps], [...SPS]);
  assert.deepEqual([...found.pps], [...PPS]);
  assert.deepEqual(findParameterSets([IDR]), { sps: null, pps: null });
  assert.equal(findParameterSets([SPS]).pps, null);
  assert.equal(findParameterSets([PPS]).sps, null);
});

test('[osh-083] the codec string is avc1 and the three bytes after the NAL header of the SPS in hexadecimal', () => {
  assert.equal(codecStringOf(SPS), 'avc1.4D001F');
  assert.equal(codecStringOf(Uint8Array.from([0x67, 0x42, 0xc0, 0x0a])), 'avc1.42C00A');
  assert.equal(codecStringOf(Uint8Array.from([0x67, 0x64, 0x00, 0x28])), 'avc1.640028');
});

test('[osh-083] the avcC record holds the profile bytes, the length of the SPS and the length of the PPS', () => {
  const config = buildAvcConfig(SPS, PPS);
  assert.deepEqual(
    [...config],
    [1, 0x4d, 0x00, 0x1f, 0xff, 0xe1, 0, 6, ...SPS, 1, 0, 4, ...PPS],
  );
  const long = new Uint8Array(300).fill(0x11);
  long[0] = 0x67;
  const big = buildAvcConfig(long, PPS);
  assert.equal(big[6], 1);
  assert.equal(big[7], 44);
  assert.equal(big.length, 11 + 300 + PPS.length);
  assert.deepEqual([...big.subarray(8 + 300, 8 + 300 + 3)], [1, 0, 4]);
});

test('[osh-083] the sample holds the slice NAL units only, each with its length in four bytes before it', () => {
  const sample = toAvccSample([SPS, PPS, SEI, IDR, AUD, IDR_TWO, DELTA]);
  assert.deepEqual(
    [...sample],
    [0, 0, 0, 5, ...IDR, 0, 0, 0, 3, ...IDR_TWO, 0, 0, 0, 4, ...DELTA],
  );
  const big = Uint8Array.from({ length: 70_000 }, (_, index) => (index === 0 ? 0x41 : 7));
  const bigSample = toAvccSample([big]);
  assert.deepEqual([...bigSample.subarray(0, 4)], [0, 1, 0x11, 0x70]);
  assert.equal(bigSample.length, 70_004);
});

test('[osh-083] the sample is null when the list holds no slice', () => {
  assert.equal(toAvccSample([SPS, PPS, SEI, AUD]), null);
  assert.equal(toAvccSample([]), null);
});
