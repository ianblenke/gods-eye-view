import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_ZIGZAG_MAGNITUDE, WireReader, WireWriter } from './wire.js';

test('[share-codec-003] a signed field round-trips through a signed varint, and the codec refuses a value past the limit', () => {
  for (const value of [
    0,
    1,
    -1,
    63,
    -64,
    MAX_ZIGZAG_MAGNITUDE,
    -MAX_ZIGZAG_MAGNITUDE,
  ]) {
    const writer = new WireWriter();
    writer.sintField(1, value);
    const reader = new WireReader(writer.finish());
    reader.tag();
    assert.equal(reader.svarint(), value);
  }
  for (const value of [MAX_ZIGZAG_MAGNITUDE + 1, 1.5, Number.NaN]) {
    assert.throws(() => new WireWriter().sintField(1, value), RangeError);
  }
});
