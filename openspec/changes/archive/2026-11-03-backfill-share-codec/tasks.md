## 1. Specs and tests

- [x] 1.1 Write the delta before the tests.

- [x] 1.2 Add tests for `share-codec-001`.

  Mutation: `S001` changes `src/share/wire.js` below. The test must fail.

  ```json
  {"old": "const a = bytes[i];", "new": "const a = bytes[i] ^ 1;"}
  ```

- [x] 1.3 Add tests for `share-codec-002`.

  Mutation: `S002` changes `src/share/wire.js` below. The test must fail.

  ```json
  {"old": "if (text.length % 4 === 1) throw new ShareWireError('bad-base64');", "new": "if (false) throw new ShareWireError('bad-base64');"}
  ```

- [x] 1.4 Add tests for `share-codec-003`.

  Mutation: `S003` changes `src/share/wire.js` below. The test must fail.

  ```json
  {"old": "value >= 0 ? value * 2 : -value * 2 - 1", "new": "false ? value * 2 : -value * 2 - 1"}
  ```

- [x] 1.5 Add tests for `share-codec-004`.

  Mutation: `S004` changes `src/share/wire.js` below. The test must fail.

  ```json
  {"old": "this.bytes.push(rest);", "new": "this.bytes.push(rest + 1);"}
  ```

- [x] 1.6 Add tests for `share-codec-005`.

  Mutation: `S005` changes `src/share/wire.js` below. The test must fail.

  ```json
  {"old": "if (!Number.isSafeInteger(value) || value < 0)", "new": "if (false)"}
  ```

- [x] 1.7 Add tests for `share-codec-006`.

  Mutation: `S006` changes `src/share/wire.js` below. The test must fail.

  ```json
  {"old": "throw new ShareWireError('non-canonical-varint');", "new": "throw new ShareWireError('truncated');"}
  ```

- [x] 1.8 Add tests for `share-codec-007`.

  Mutation: `S007` changes `src/share/wire.js` below. The test must fail.

  ```json
  {"old": "if (length > this.end - this.pos)", "new": "if (false)"}
  ```

- [x] 1.9 Add tests for `share-codec-008`.

  Mutation: `S008` changes `src/share/wire.js` below. The test must fail.

  ```json
  {"old": "wireType === WIRE_FIXED64 ? 8 : 4", "new": "wireType === WIRE_FIXED64 ? 7 : 4"}
  ```

- [x] 1.10 Add tests for `share-codec-009`.

  Mutation: `S009` changes `src/share/wire.js` below. The test must fail.

  ```json
  {"old": "((crc << 1) ^ 0x07)", "new": "((crc << 1) ^ 0x09)"}
  ```

- [x] 1.11 Add tests for `share-codec-010`.

  Mutation: `S010` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "{ number: 2, key: 'lat', type: 'coord', default: 0 }", "new": "{ number: 28, key: 'lat', type: 'coord', default: 0 }"}
  ```

- [x] 1.12 Add tests for `share-codec-011`.

  Mutation: `S011` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "export const SHARE_VIEW_FORMAT_VERSION = 1;", "new": "export const SHARE_VIEW_FORMAT_VERSION = 2;"}
  ```

- [x] 1.13 Add tests for `share-codec-012`.

  Mutation: `S012` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "const coordinateInt = (degrees) => Math.round(degrees * COORDINATE_SCALE);", "new": "const coordinateInt = (degrees) => Math.round(degrees * 1000);"}
  ```

- [x] 1.14 Add tests for `share-codec-013`.

  Mutation: `S013` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "clamp(Math.round(Number(value)), min, max) + 0", "new": "clamp(Math.floor(Number(value)), min, max) + 0"}
  ```

- [x] 1.15 Add tests for `share-codec-014`.

  Mutation: `S014` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "if (state[field.key] === defaultOf(field, state.style)) break;", "new": "if (false) break;"}
  ```

- [x] 1.16 Add tests for `share-codec-015`.

  Mutation: `S015` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "Math.round(clamp(Number(values[spec.key]), spec.min, spec.max) * 100)", "new": "Math.round(clamp(Number(values[spec.key]), spec.min, spec.max) * 10)"}
  ```

- [x] 1.17 Add tests for `share-codec-016`.

  Mutation: `S016` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "return 36 + a * 36 + LAYER_STATE_TOKEN_ALPHABET.indexOf(token[1]);", "new": "return 35 + a * 36 + LAYER_STATE_TOKEN_ALPHABET.indexOf(token[1]);"}
  ```

- [x] 1.18 Add tests for `share-codec-017`.

  Mutation: `S017` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "if (state.layerState)\n          encodeLayers", "new": "if (false)\n          encodeLayers"}
  ```

- [x] 1.19 Add tests for `share-codec-018`.

  Mutation: `S018` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "if (blob.bytes.length)\n    writer.bytesField(fieldNumber('layerOptions'), blob.finish());", "new": "if (false)\n    writer.bytesField(fieldNumber('layerOptions'), blob.finish());"}
  ```

- [x] 1.20 Add tests for `share-codec-019`.

  Mutation: `S019` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "for (const panel of SHARE_VIEW_PANELS) {\n    const spec = byId.get(panel.id);\n    const defaultPinned", "new": "for (const panel of []) {\n    const spec = byId.get(panel.id);\n    const defaultPinned"}
  ```

- [x] 1.21 Add tests for `share-codec-020`.

  Mutation: `S020` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "if (thing) encodeThing(writer, thing, state);", "new": "if (false) encodeThing(writer, thing, state);"}
  ```

- [x] 1.22 Add tests for `share-codec-021`.

  Mutation: `S021` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "value.trim().toLowerCase()", "new": "value.trim().toUpperCase()"}
  ```

- [x] 1.23 Add tests for `share-codec-022`.

  Mutation: `S022` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "options[policy.optionKey] = null;", "new": "options[policy.optionKey] = id;"}
  ```

- [x] 1.24 Add tests for `share-codec-023`.

  Mutation: `S023` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "(state.sharedAtMs - observed) / 1000", "new": "(observed - state.sharedAtMs) / 1000"}
  ```

- [x] 1.25 Add tests for `share-codec-024`.

  Mutation: `S024` changes `src/share/follow.js` below. The test must fail.

  ```json
  {"old": "east: -horizontal * Math.sin(heading * RAD)", "new": "east: horizontal * Math.sin(heading * RAD)"}
  ```

- [x] 1.26 Add tests for `share-codec-025`.

  Mutation: `S025` changes `src/share/follow.js` below. The test must fail.

  ```json
  {"old": "const EARTH_RADIUS_M = 6_371_000;", "new": "const EARTH_RADIUS_M = 6_000_000;"}
  ```

- [x] 1.27 Add tests for `share-codec-026`.

  Mutation: `S026` changes `src/share/wire.js` below. The test must fail.

  ```json
  {"old": "return crc;", "new": "return 0;"}
  ```

- [x] 1.28 Add tests for `share-codec-027`.

  Mutation: `S027` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "Number.isSafeInteger(ms) && ms <= nowMs", "new": "Number.isSafeInteger(ms) && true"}
  ```

- [x] 1.29 Add tests for `share-codec-028`.

  Mutation: `S028` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "this.entries.push({ scope, field, wireType });", "new": "this.entries.push({ scope, field, wireType: 0 });"}
  ```

- [x] 1.30 Add tests for `share-codec-029`.

  Mutation: `S029` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "unknown.code('flags', flags - (flags % (knownBits + 1)));", "new": "unknown.code('flags', 0);"}
  ```

- [x] 1.31 Add tests for `share-codec-030`.

  Mutation: `S030` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "fallback = 'unknown-view-kind';", "new": "fallback = 'missing-thing';"}
  ```

- [x] 1.32 Add tests for `share-codec-031`.

  Mutation: `S031` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "'unknown-entity-kind' : 'missing-entity-kind'", "new": "'missing-entity-kind' : 'missing-entity-kind'"}
  ```

- [x] 1.33 Add tests for `share-codec-032`.

  Mutation: `S032` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "else writer.textField(field.number, value);", "new": "else writer.textField(field.number, 'normal');"}
  ```

- [x] 1.34 Add tests for `share-codec-033`.

  Mutation: `S033` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "new Set(['detectionMode', 'detectionAllocation'])", "new": "new Set([])"}
  ```

- [x] 1.35 Add tests for `share-codec-034`.

  Mutation: `S034` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "return { ok: false, reason: error.reason };", "new": "return { ok: false, reason: 'internal-error' };"}
  ```

- [x] 1.36 Add tests for `share-codec-035`.

  Mutation: `S035` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "if (error instanceof ShareWireError)\n      return { ok: false, reason: error.reason };", "new": "if (error instanceof ShareWireError)\n      throw error;"}
  ```

- [x] 1.37 Add tests for `share-codec-036`.

  Mutation: `S036` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "sealed[bytes.length] = crc8(bytes);", "new": "sealed[bytes.length] = crc8(bytes) ^ 1;"}
  ```

- [x] 1.38 Add tests for `share-codec-037`.

  Mutation: `S037` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "state.alt = intOr(source.alt, d.alt, -MAX_ALTITUDE_M, MAX_ALTITUDE_M);", "new": "state.alt = intOr(source.alt, 7, 0, 10);"}
  ```

- [x] 1.39 Add tests for `share-codec-038`.

  Mutation: `S038` changes `src/share/legacyShareState.js` below. The test must fail.

  ```json
  {"old": "legacy.layerStateInvalid = false;", "new": "legacy.layerStateInvalid = true;"}
  ```

- [x] 1.40 Add tests for `share-codec-039`.

  Mutation: `S039` changes `src/share/legacyShareState.js` below. The test must fail.

  ```json
  {"old": "? Number(state.view.entity.id)\n        : state.view.entity.id", "new": "? 1\n        : state.view.entity.id"}
  ```

- [x] 1.41 Add tests for `share-codec-040`.

  Mutation: `S040` changes `src/share/legacyShareState.js` below. The test must fail.

  ```json
  {"old": "legacy.layerState = layerState;", "new": "legacy.layerState = { ...layerState, enabledLayerIds: [] };"}
  ```

- [x] 1.42 Add tests for `share-codec-041`.

  Mutation: `S041` changes `src/share/legacyShareState.js` below. The test must fail.

  ```json
  {"old": "entry && !state.layerState", "new": "false"}
  ```

- [x] 1.43 Add tests for `share-codec-042`.

  Mutation: `S042` changes `src/share/legacyShareState.js` below. The test must fail.

  ```json
  {"old": "legacy.layerStateInvalid = false;", "new": "legacy.layerStateInvalid = true;"}
  ```

- [x] 1.44 Add tests for `share-codec-043`.

  Mutation: `S043` changes `src/share/legacyShareState.js` below. The test must fail.

  ```json
  {"old": "key !== 'layerStateInvalid' && Object.hasOwn(parsed, key)", "new": "key !== 'layerStateInvalid' && false"}
  ```

- [x] 1.45 Add tests for `share-codec-044`.

  Mutation: `S044` changes `src/share/legacyShareState.js` below. The test must fail.

  ```json
  {"old": "  'layerStateInvalid',", "new": "  'layerStateInvalid',\n  'newKey',"}
  ```

- [x] 1.46 Add tests for `share-codec-045`.

  Mutation: `S045` changes `src/share/shareLinkPath.js` below. The test must fail.

  ```json
  {"old": "code = decodeURIComponent(code);", "new": "code = ''; "}
  ```

- [x] 1.47 Add tests for `share-codec-046`.

  Mutation: `S046` changes `src/share/shareLinkPath.js` below. The test must fail.

  ```json
  {"old": "url.hash = '';", "new": "url.hash = '#x';"}
  ```

- [x] 1.48 Add tests for `share-codec-047`.

  Mutation: `S047` changes `src/share/shareLinkPath.js` below. The test must fail.

  ```json
  {"old": "url.searchParams.delete('lang');", "new": "url.searchParams.delete('other');"}
  ```

- [x] 1.49 Add tests for `share-codec-048`.

  Mutation: `S048` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "Math.round(clamp(Number(value), -90, 90) * COORDINATE_SCALE)", "new": "Math.round(Number(value) * COORDINATE_SCALE)"}
  ```

- [x] 1.50 Add tests for `share-codec-049`.

  Mutation: `S049` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "unknown.code('style-param', `${style}.${token ?? '?'}`);", "new": "unknown.code('style-param', 'other');"}
  ```

- [x] 1.51 Add tests for `share-codec-050`.

  Mutation: `S050` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "layerEntry?.optionOwner === layerEntry?.id", "new": "true"}
  ```

- [x] 1.52 Add tests for `share-codec-051`.

  Mutation: `S051` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "if (!finite(fix.lat) || !finite(fix.lon)) return null;", "new": "if (!finite(fix.lon)) return null;"}
  ```

- [x] 1.53 Add tests for `share-codec-052`.

  Mutation: `S052` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "return seconds >= 1 && Number.isSafeInteger(seconds * 1000)", "new": "return true && Number.isSafeInteger(seconds * 1000)"}
  ```

- [x] 1.54 Add tests for `share-codec-053`.

  Mutation: `S053` changes `src/share/wire.js` below. The test must fail.

  ```json
  {"old": "if (code < 0x20 || code > 0x7e)", "new": "if (code > 0x7e)"}
  ```

- [x] 1.55 Add tests for `share-codec-054`.

  Mutation: `S054` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "return { ok: false, reason: 'internal-error' };", "new": "return { ok: false, reason: 'checksum' };"}
  ```

- [x] 1.56 Add tests for `share-codec-055`.

  Mutation: `S055` changes `src/share/follow.js` below. The test must fail.

  ```json
  {"old": "if (!(length > 0))", "new": "if (false)"}
  ```

- [x] 1.57 Add tests for `share-codec-056`.

  Mutation: `S056` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "typeof value === 'string' && NAME_GRAMMAR.test(value)", "new": "typeof value === 'string' && true"}
  ```

- [x] 1.58 Add tests for `share-codec-057`.

  Mutation: `S057` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "if (get('style').len) unknown.code('enum:style', raw.style);", "new": "if (false) unknown.code('enum:style', raw.style);"}
  ```

- [x] 1.59 Add tests for `share-codec-058`.

  Mutation: `S058` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "preset.bloom?.intensity ?? g.bloom.intensity", "new": "g.bloom.intensity"}
  ```

- [x] 1.60 Add tests for `share-codec-059`.

  Mutation: `R005` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "!SHARE_VIEW_ENUMS[field.enum].includes(text)", "new": "true"}
  ```

- [x] 1.61 Add tests for `share-codec-060`.

  Mutation: `R007` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "writer.bytes.push(SHARE_VIEW_FORMAT_VERSION);", "new": "writer.bytes.push(SHARE_VIEW_FORMAT_VERSION); writer.uintField(14, 0);"}
  ```

- [x] 1.62 Add tests for `share-codec-061`.

  Mutation: `R008` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "degrees > 180 ? degrees - 360 : degrees", "new": "degrees"}
  ```

- [x] 1.63 Add tests for `share-codec-062`.

  Mutation: `R014` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "} else if (viewKind !== 'place') {", "new": "} else if (true) {"}
  ```

- [x] 1.64 Add tests for `share-codec-063`.

  Mutation: `R017` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "thing.sintField(f.lat, coordinateInt(fix.lat));", "new": "thing.sintField(f.lat, 0);"}
  ```

- [x] 1.65 Add tests for `share-codec-064`.

  Mutation: `R016` changes `src/share/viewCodec.js` below. The test must fail.

  ```json
  {"old": "else fallback = thing?.fallback ?? 'missing-thing';", "new": "else fallback = 'missing-thing';"}
  ```

## 2. Host checks

- [x] 2.1 Check each decision in the audit.
- [x] 2.2 Check each key with its own test.
- [x] 2.3 Check each test with a mutation.
- [x] 2.4 Measure host coverage.
- [x] 2.5 Check the final STE output.
- [x] 2.6 Check the final format output.

## 3. Gates and review

- [x] 3.1 Run `make ratchet CHANGE=backfill-share-codec`.
- [ ] 3.2 Run `make gates CHANGE=backfill-share-codec`.
- [ ] 3.3 Get both formal review agent reports.
- [ ] 3.4 Record both reviews in `review.md`.
