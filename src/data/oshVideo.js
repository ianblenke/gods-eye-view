/**
 * The parts of a video message of an OpenSensorHub datastream (design
 * decisions D73 and D76). One message holds one picture:
 *
 *   8 bytes  time stamp, a big-endian double, in seconds
 *   4 bytes  length of the H.264 data, big-endian
 *   n bytes  H.264 data in Annex B framing (start codes)
 *
 * The module is pure. It has no DOM and no network call, so the server and
 * the browser both use it.
 */

/** The bytes before the H.264 data of a message. */
export const OSH_VIDEO_ENVELOPE_BYTES = 12;

const NAL_SLICE_FIRST = 1;
const NAL_SLICE_IDR = 5;
const NAL_SPS = 7;
const NAL_PPS = 8;

/**
 * Read the envelope of a message.
 * @param {Uint8Array} bytes
 * @returns {?{timestampMs: number, data: Uint8Array}} Null when the message is
 *   shorter than the envelope, when the length field does not equal the size
 *   of the data, or when the time stamp is not a finite number.
 */
export function readOshVideoMessage(bytes) {
  if (bytes.byteLength < OSH_VIDEO_ENVELOPE_BYTES) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const seconds = view.getFloat64(0);
  if (!Number.isFinite(seconds)) return null;
  if (view.getUint32(8) !== bytes.byteLength - OSH_VIDEO_ENVELOPE_BYTES)
    return null;
  return {
    timestampMs: seconds * 1000,
    data: bytes.subarray(OSH_VIDEO_ENVELOPE_BYTES),
  };
}

/**
 * Split H.264 data in Annex B framing into NAL units, without their start
 * codes. A start code has three or four bytes. Bytes before the first start
 * code are not a NAL unit. A NAL unit never ends with a zero byte, so the
 * zero bytes before the next start code are not part of it.
 * @param {Uint8Array} data
 * @returns {Uint8Array[]}
 */
export function splitNalUnits(data) {
  const starts = [];
  for (let at = 0; at + 2 < data.length; at += 1) {
    if (data[at] === 0 && data[at + 1] === 0 && data[at + 2] === 1) {
      starts.push(at + 3);
      at += 2;
    }
  }
  return starts.map((begin, index) => {
    let end = index + 1 < starts.length ? starts[index + 1] - 3 : data.length;
    while (end > begin && data[end - 1] === 0) end -= 1;
    return data.subarray(begin, end);
  });
}

/** The type of a NAL unit: the low five bits of its first byte. */
export function nalTypeOf(nal) {
  return nal[0] & 0x1f;
}

/** True when a list of NAL units holds the slice of an IDR picture. */
export function hasKeyNal(nals) {
  return nals.some((nal) => nalTypeOf(nal) === NAL_SLICE_IDR);
}

/**
 * True for a whole message whose H.264 data holds an IDR slice. A message that
 * is not valid is not a key message.
 * @param {Uint8Array} bytes
 */
export function isOshVideoKeyMessage(bytes) {
  const message = readOshVideoMessage(bytes);
  return message !== null && hasKeyNal(splitNalUnits(message.data));
}

/**
 * The first SPS and the first PPS of a list of NAL units.
 * @param {Uint8Array[]} nals
 * @returns {{sps: ?Uint8Array, pps: ?Uint8Array}}
 */
export function findParameterSets(nals) {
  return {
    sps: nals.find((nal) => nalTypeOf(nal) === NAL_SPS) ?? null,
    pps: nals.find((nal) => nalTypeOf(nal) === NAL_PPS) ?? null,
  };
}

const hex = (byte) => byte.toString(16).toUpperCase().padStart(2, '0');

/**
 * The codec string of WebCodecs for an SPS: `avc1.` and the three bytes after
 * the NAL header (the profile, the constraint flags and the level).
 * @param {Uint8Array} sps
 */
export function codecStringOf(sps) {
  return `avc1.${hex(sps[1])}${hex(sps[2])}${hex(sps[3])}`;
}

/**
 * The `avcC` record that WebCodecs takes as the description of a decoder.
 * @param {Uint8Array} sps
 * @param {Uint8Array} pps
 * @returns {Uint8Array}
 */
export function buildAvcConfig(sps, pps) {
  const config = new Uint8Array(11 + sps.length + pps.length);
  config.set([
    1,
    sps[1],
    sps[2],
    sps[3],
    0xff,
    0xe1,
    sps.length >> 8,
    sps.length & 0xff,
  ]);
  config.set(sps, 8);
  const ppsAt = 8 + sps.length;
  config.set([1, pps.length >> 8, pps.length & 0xff], ppsAt);
  config.set(pps, ppsAt + 3);
  return config;
}

/**
 * One sample for a decoder: the slice NAL units (types 1 to 5) of a list, each
 * with its length in four big-endian bytes before it.
 * @param {Uint8Array[]} nals
 * @returns {?Uint8Array} Null when the list has no slice.
 */
export function toAvccSample(nals) {
  const slices = nals.filter((nal) => {
    const type = nalTypeOf(nal);
    return type >= NAL_SLICE_FIRST && type <= NAL_SLICE_IDR;
  });
  if (slices.length === 0) return null;
  const sample = new Uint8Array(
    slices.reduce((sum, nal) => sum + 4 + nal.length, 0),
  );
  const view = new DataView(sample.buffer);
  let at = 0;
  for (const nal of slices) {
    view.setUint32(at, nal.length);
    sample.set(nal, at + 4);
    at += 4 + nal.length;
  }
  return sample;
}
