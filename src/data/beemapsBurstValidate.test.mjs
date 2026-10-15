import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import {
  readBodyText,
  readConfig,
  validateConfirm,
  validateList,
  validateQuote,
} from '../../server/providers/beemaps-burst/validate.js';

const BOX = [9.982014, 59.991007, 10.017986, 60.008993];
const CONFIG = readConfig({
  BEEMAPS_BURST_ENABLED: 'true',
  BEEMAPS_BURST_API_KEY: 'k',
});
const quote = (body, config = CONFIG) =>
  validateQuote(typeof body === 'string' ? body : JSON.stringify(body), config);
const refused = (status, payload) => ({ ok: false, status, payload });

test('[beemaps-burst-control-002] reads the flag as true only for the exact text true', () => {
  assert.equal(readConfig({ BEEMAPS_BURST_ENABLED: 'true' }).enabled, true);
  for (const value of [
    'TRUE',
    'True',
    '1',
    'yes',
    ' true',
    'true ',
    '',
    undefined,
    'tru',
    'truee',
  ])
    assert.equal(
      readConfig({ BEEMAPS_BURST_ENABLED: value }).enabled,
      false,
      String(value),
    );
  assert.equal(readConfig({}).enabled, false);
});

test('[beemaps-burst-control-003] reads the key of its own, trimmed, and not the key of the frames provider', () => {
  assert.equal(readConfig({ BEEMAPS_API_KEY: 'frames-key' }).configured, false);
  assert.equal(readConfig({ BEEMAPS_BURST_API_KEY: '   ' }).configured, false);
  assert.equal(readConfig({ BEEMAPS_BURST_API_KEY: '' }).configured, false);
  const config = readConfig({
    BEEMAPS_API_KEY: 'frames-key',
    BEEMAPS_BURST_API_KEY: '  burst-key  ',
  });
  assert.equal(config.configured, true);
  assert.equal(config.key, 'burst-key');
});

test('[beemaps-burst-control-004] gives minCredits 125, maxCredits 125 and dailyCredits 625 by default', () => {
  const config = readConfig({});
  assert.equal(config.minCredits, 125);
  assert.equal(config.maxCredits, 125);
  assert.equal(config.dailyCredits, 625);
});

test('[beemaps-burst-control-004] takes maxCredits and dailyCredits from digits and gives the default for a value below the limit', () => {
  const config = readConfig({
    BEEMAPS_BURST_MAX_CREDITS: '250',
    BEEMAPS_BURST_DAILY_CREDITS: '1000',
  });
  assert.equal(config.maxCredits, 250);
  assert.equal(config.dailyCredits, 1000);
  assert.equal(
    readConfig({ BEEMAPS_BURST_MAX_CREDITS: '124' }).maxCredits,
    125,
  );
  assert.equal(
    readConfig({ BEEMAPS_BURST_MAX_CREDITS: '125' }).maxCredits,
    125,
  );
  assert.equal(
    readConfig({ BEEMAPS_BURST_DAILY_CREDITS: '0' }).dailyCredits,
    625,
  );
  assert.equal(
    readConfig({ BEEMAPS_BURST_DAILY_CREDITS: '1' }).dailyCredits,
    1,
  );
});

test('[beemaps-burst-control-022] reads the daily limit from digits only that are 1 or more', () => {
  for (const [text, limit] of [
    ['625', 625],
    ['007', 7],
    ['1', 1],
    ['0', 625],
    ['00', 625],
    ['', 625],
    ['-5', 625],
    ['1e3', 625],
    ['5.5', 625],
    [' 5', 625],
    ['5 ', 625],
    ['+5', 625],
    ['20abc', 625],
    [undefined, 625],
  ])
    assert.equal(
      readConfig({ BEEMAPS_BURST_DAILY_CREDITS: text }).dailyCredits,
      limit,
      String(text),
    );
});

function body(parts, fail = false) {
  const source = fail
    ? (async function* () {
        yield Buffer.from('{"bbox":');
        throw new Error('aborted');
      })()
    : Readable.from(parts);
  return source;
}

test('[beemaps-burst-control-008] reads a body of exactly the limit and gives null for one byte more', async () => {
  const shell = `{"bbox":${JSON.stringify(BOX)},"x":""}`;
  const exact = `{"bbox":${JSON.stringify(BOX)},"x":"${'a'.repeat(4096 - Buffer.byteLength(shell))}"}`;
  assert.equal(Buffer.byteLength(exact), 4096);
  assert.equal(await readBodyText(body([Buffer.from(exact)]), 4096), exact);
  assert.equal(
    await readBodyText(body([Buffer.from(`${exact}a`)]), 4096),
    null,
  );
  assert.equal(
    await readBodyText(body([Buffer.alloc(2048), Buffer.alloc(2049)]), 4096),
    null,
  );
  assert.equal(await readBodyText(body([], true), 4096), null);
  assert.equal(await readBodyText(body([Buffer.from('€€€')]), 8), null);
  assert.equal(await readBodyText(body([Buffer.from('€€')]), 8), '€€');
  assert.equal(await readBodyText(body([]), 4096), '');
  assert.equal(
    await readBodyText(Readable.from(['{"a":', '1}']), 4096),
    '{"a":1}',
  );
  assert.equal(await readBodyText(Readable.from(['€€€']), 8), null);
});

test('[beemaps-burst-control-008] answers bad_body for a body that is not a JSON object or has another field', () => {
  const bad = refused(400, { error: 'bad_body' });
  for (const text of [
    '',
    'not json',
    '{"bbox":',
    'null',
    '[]',
    '5',
    '"x"',
    'true',
    JSON.stringify([{ bbox: BOX }]),
    JSON.stringify({ bbox: BOX, extra: 1 }),
    JSON.stringify({ bbox: BOX, credits: 125, expiration: 'x' }),
    JSON.stringify({ bbox: BOX, trackedLocation: 'x' }),
    JSON.stringify({ bbox: BOX, deviceType: 'bee' }),
    JSON.stringify({ bbox: BOX, polygon: {} }),
  ])
    assert.deepEqual(quote(text), bad, text);
  assert.equal(quote({ bbox: BOX }).ok, true);
  assert.equal(quote({ bbox: BOX, credits: 125 }).ok, true);
});

test('[beemaps-burst-control-009] answers bad_area for a box that is not four finite numbers', () => {
  const bad = refused(400, { error: 'bad_area' });
  for (const bbox of [
    undefined,
    null,
    'x',
    5,
    {},
    [],
    [1, 2, 3],
    [1, 2, 3, 4, 5],
    ['10', 60, 10.02, 60.01],
    [10, 60, 10.02, null],
    [10, 60, NaN, 60.01],
    [10, 60, Infinity, 60.01],
    [10, 60, 10.02, undefined],
    [10, 60, 10.02, true],
  ])
    assert.deepEqual(quote({ bbox }), bad, JSON.stringify(bbox));
  assert.deepEqual(quote({}), bad);
});

test('[beemaps-burst-control-009] answers bad_area when west is not less than east, south is not less than north, or a value is out of range', () => {
  const bad = refused(400, { error: 'bad_area' });
  for (const bbox of [
    [10.02, 60, 10, 60.01],
    [10, 60, 10, 60.01],
    [10, 60.01, 10.02, 60],
    [10, 60, 10.02, 60],
    [-180.1, 60, 10, 60.01],
    [10, 60, 180.1, 60.01],
    [10, -80.1, 10.02, -79.99],
    [10, 79.99, 10.02, 80.1],
    [10, 85, 10.02, 85.01],
  ])
    assert.deepEqual(quote({ bbox }), bad, JSON.stringify(bbox));
});

test('[beemaps-burst-control-009] accepts a box with a latitude of exactly -80 or 80 and a longitude of exactly -180 or 180', () => {
  assert.equal(quote({ bbox: [10, 79.99, 10.02, 80] }).ok, true);
  assert.equal(quote({ bbox: [10, -80, 10.02, -79.99] }).ok, true);
  assert.equal(quote({ bbox: [-180, 0, -179.99, 0.01] }).ok, true);
  assert.equal(quote({ bbox: [179.99, 0, 180, 0.01] }).ok, true);
});

test('[beemaps-burst-control-010] gives the area of the box in km² with at most 3 decimals', () => {
  assert.deepEqual(quote({ bbox: BOX }), {
    ok: true,
    request: { bbox: BOX, areaKm2: 4, credits: 125 },
  });
  assert.equal(quote({ bbox: [10, 60, 10.02, 60.02] }).request.areaKm2, 2.472);
  assert.equal(
    quote({ bbox: [10, 60, 10.01, 60.0017] }).request.areaKm2,
    0.105,
  );
});

test('[beemaps-burst-control-010] answers bad_area below 0.1 km² and area_too_large above 5 km²', () => {
  assert.deepEqual(
    quote({ bbox: [10, 60, 10.01, 60.0016] }),
    refused(400, { error: 'bad_area' }),
  );
  assert.equal(quote({ bbox: [10, 60, 10.01, 60.0017] }).ok, true);
  assert.deepEqual(
    quote({ bbox: [10, 60, 10.05, 60.02] }),
    refused(400, { error: 'area_too_large', maxKm2: 5 }),
  );
  assert.equal(quote({ bbox: [10, 60, 10.04, 60.02] }).ok, true);
  assert.deepEqual(
    quote({ bbox: [10, 60, 10.002, 60.002] }),
    refused(400, { error: 'bad_area' }),
  );
});

test('[beemaps-burst-control-012] rounds the numbers to 6 decimals before it checks the box and the area', () => {
  const rounded = quote({
    bbox: [9.9820144, 59.9910074, 10.0179856, 60.0089926],
  });
  assert.deepEqual(rounded.request.bbox, BOX);
  assert.deepEqual(
    quote({ bbox: [10.0000001, 60, 10.0000002, 60.01] }),
    refused(400, { error: 'bad_area' }),
  );
  assert.equal(quote({ bbox: [10, 79.99, 10.02, 80.0000004] }).ok, true);
});

test('[beemaps-burst-control-011] accepts whole credits from 125 to maxCredits and uses 125 without credits', () => {
  assert.equal(quote({ bbox: BOX }).request.credits, 125);
  assert.equal(quote({ bbox: BOX, credits: 125 }).request.credits, 125);
  const wide = readConfig({
    BEEMAPS_BURST_ENABLED: 'true',
    BEEMAPS_BURST_API_KEY: 'k',
    BEEMAPS_BURST_MAX_CREDITS: '200',
  });
  assert.equal(quote({ bbox: BOX, credits: 200 }, wide).request.credits, 200);
  assert.deepEqual(
    quote({ bbox: BOX, credits: 201 }, wide),
    refused(400, { error: 'bad_credits' }),
  );
  assert.deepEqual(
    quote({ bbox: BOX, credits: 200 }),
    refused(400, { error: 'bad_credits' }),
  );
});

test('[beemaps-burst-control-011] answers bad_credits for a number that is not whole, below 125, or not a number', () => {
  const bad = refused(400, { error: 'bad_credits' });
  for (const credits of [124, 0, -125, 125.5, '125', null, true, [], {}, NaN])
    assert.deepEqual(
      quote({ bbox: BOX, credits }),
      bad,
      JSON.stringify(credits),
    );
});

test('[beemaps-burst-control-011] answers bad_area before bad_credits when both are wrong', () => {
  assert.deepEqual(
    quote({ bbox: [1, 2, 3], credits: 5 }),
    refused(400, { error: 'bad_area' }),
  );
});

test('[beemaps-burst-control-015] accepts a quoteId of 32 lowercase hexadecimal characters and a key of 16 to 64 allowed characters', () => {
  const id = 'a'.repeat(32);
  const ok = (key) =>
    validateConfirm(JSON.stringify({ quoteId: id, idempotencyKey: key }));
  assert.deepEqual(ok('k'.repeat(16)), {
    ok: true,
    quoteId: id,
    idempotencyKey: 'k'.repeat(16),
  });
  assert.equal(ok('k'.repeat(64)).ok, true);
  assert.equal(ok('Az09_-Az09_-Az09_-').ok, true);
  for (const key of [
    'k'.repeat(15),
    'k'.repeat(65),
    'a b'.repeat(8),
    'é'.repeat(16),
    'k'.repeat(15) + '!',
    5,
    null,
    undefined,
  ])
    assert.deepEqual(ok(key), refused(400, { error: 'bad_body' }), String(key));
});

test('[beemaps-burst-control-015] answers bad_body for a quoteId that is not 32 lowercase hexadecimal characters', () => {
  const bad = refused(400, { error: 'bad_body' });
  for (const quoteId of [
    'a'.repeat(31),
    'a'.repeat(33),
    'A'.repeat(32),
    'g'.repeat(32),
    '',
    5,
    null,
    undefined,
  ])
    assert.deepEqual(
      validateConfirm(
        JSON.stringify({ quoteId, idempotencyKey: 'k'.repeat(16) }),
      ),
      bad,
      String(quoteId),
    );
});

test('[beemaps-burst-control-015] answers bad_body for a body that is not a JSON object or has another field', () => {
  const bad = refused(400, { error: 'bad_body' });
  const id = 'a'.repeat(32);
  for (const text of [
    '',
    'x',
    'null',
    '[]',
    '5',
    JSON.stringify({ quoteId: id }),
    JSON.stringify({ idempotencyKey: 'k'.repeat(16) }),
    JSON.stringify({ quoteId: id, idempotencyKey: 'k'.repeat(16), extra: 1 }),
    JSON.stringify([{ quoteId: id, idempotencyKey: 'k'.repeat(16) }]),
  ])
    assert.deepEqual(validateConfirm(text), bad, text);
});

test('[beemaps-burst-control-033] gives a limit of 20 for an empty object and takes a whole limit from 1 to 100', () => {
  assert.deepEqual(validateList('{}'), { ok: true, limit: 20 });
  assert.deepEqual(validateList('{"limit":1}'), { ok: true, limit: 1 });
  assert.deepEqual(validateList('{"limit":100}'), { ok: true, limit: 100 });
  assert.deepEqual(validateList('{"limit":5}'), { ok: true, limit: 5 });
});

test('[beemaps-burst-control-033] answers bad_body for a body that is not an object, has another field or has a bad limit', () => {
  const bad = refused(400, { error: 'bad_body' });
  for (const text of [
    '',
    'x',
    'null',
    '[]',
    '5',
    '{"skip":1}',
    '{"limit":1,"skip":1}',
    '{"limit":0}',
    '{"limit":101}',
    '{"limit":1.5}',
    '{"limit":"5"}',
    '{"limit":null}',
    '{"limit":-1}',
    '{"limit":true}',
  ])
    assert.deepEqual(validateList(text), bad, text);
});
