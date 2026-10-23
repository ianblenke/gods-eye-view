Verdict: FAIL

Tip 69dca8f9, scope full. The reviewer read the spec, the code and the layer, records and registration tests, and ran no code.

- [ ] FINDING major openspec/specs/scene-layers/spec.md:83-110 (tests layer.test.mjs:520, :563) No test that names `scene-layers-008` or `scene-layers-009` asserts most of their THEN and AND lines: the two other box samples, the start and the end at the clock, the non-finite centre, the order of the reasons, the limit samples and the east value 180 and the west value -180. The sample values exist only in the SkyWatch box test, which has SkyWatch IDs. Add tests that name 008 and 009, or cut the lines.
- [ ] FINDING minor spec.md:117 The line "the routes of Planet and SkyFi use that function for their checks" has no assertion. Add a test or move the line.
- [ ] FINDING minor spec.md:193 "a scene when an earlier scene has the same `id`" has two meanings. Write "an earlier kept scene".
- [ ] FINDING minor spec.md:84-88 The order of the sample pairs (latitude, longitude) is not stated.
- [ ] FINDING minor src/layers/sceneLayer/source.js:151 `getThumbnail` puts the id in the URL without encoding. The layer passes only checked ids. Name this as a limit, or encode the id.
