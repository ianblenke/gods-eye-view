# Share codec correction report

Source commit: `4cf8e3706060658bf303d3d6e49643d0a4cb6a9f`.
Branch: `backfill-share-codec`.
At the correction host snapshot, the worker left the changes uncommitted. The lead later committed the corrections in `27e7a909`.

## Findings

| Finding | Commit | File and line | Correction | Check |
| --- | --- | --- | --- | --- |
| Spec F1 | `4cf8e370` | `src/share/backfill.test.mjs:296` | Select the open-name tag per input. Add scenario 059 for known detection names. | R001 to R006, R031, R036 |
| Spec F2 | `4cf8e370` | `src/share/viewCodec.test.mjs:1093` | Assign size scenario 060 and signed-angle scenario 061. Keep both old titles. | R007 to R009 |
| Spec F3 | `4cf8e370` | `src/share/viewCodec.test.mjs:836` | Assert the complete failure result with the literal reason bad-base64. | R010 |
| Spec F4 | `4cf8e370` | `openspec/specs/share-codec/spec.md:129` | Limit canonical equality to share times at or before the clock. Check both clock boundaries. | R011 to R013 |
| STE F1 | `4cf8e370` | `openspec/changes/archive/2026-11-03-backfill-share-codec/evidence.md:6` | Name the earlier host snapshot and the later ratchet and archive. | Full lint |
| STE F2 | `4cf8e370` | `openspec/changes/archive/2026-11-03-backfill-share-codec/design.md:102` | Use the approved verb and add the article. | Full lint |
| STE F3 | `4cf8e370` | `openspec/changes/archive/2026-11-03-backfill-share-codec/evidence.md:180` | Use each other test. | Full lint |
| STE F4 | `4cf8e370` | `openspec/changes/archive/2026-11-03-backfill-share-codec/audit.md:1611` | Use a clause for an id in the set. | Full lint |
| STE F5 | `4cf8e370` | `openspec/changes/archive/2026-11-03-backfill-share-codec/audit.md:1697` | Use the active voice. | Full lint |
| STE F6 | `4cf8e370` | `src/share/backfill.test.mjs:1532` | Name the available byte count. | R027 |
| STE F7 | `4cf8e370` | `src/share/backfill.test.mjs:1154` | Add the articles to the generated titles and the default phrase. | R023, R029, R030 |
| STE F8 | `4cf8e370` | `src/share/backfill.test.mjs:460` | Use selects the supplied view before a tracked entity. | R028 |

The Spec F2 angle tests use scenario 061 at the location below.
The Spec F4 boundary tests use literal state and code values.

```text
src/share/backfill.test.mjs:2299
src/share/backfill.test.mjs:2648
src/share/backfill.test.mjs:2670
```

## Search evidence

This search reads the files after the corrections.

```bash
cd /home/ianblenke/docker/gev-work/sharecodec && rg -n "host snapshot|lead later ran|lead gets|each other test|already in the set|module freezes" openspec/changes/archive/2026-11-03-backfill-share-codec/evidence.md openspec/changes/archive/2026-11-03-backfill-share-codec/design.md openspec/changes/archive/2026-11-03-backfill-share-codec/audit.md
```

```text
openspec/changes/archive/2026-11-03-backfill-share-codec/audit.md:1611:| A101-right | EQUIVALENT | The extra layer id duplicates an id that is already in the set. normalizeLayerState uses a Set and fixed registry order at layerState.js:937. It returns private arrays and normalized primitive options, so custom array methods cannot survive. |
openspec/changes/archive/2026-11-03-backfill-share-codec/audit.md:1697:| A331-true | EQUIVALENT | Every field currently lacks a retired flag. The module freezes the field array and each row. A public code or state object cannot add a retired registry entry. |
openspec/changes/archive/2026-11-03-backfill-share-codec/evidence.md:4:The original host snapshot reads commit `5fd416b9ed4a80c9a1ceeded81836aa69f3ebc0c`.
openspec/changes/archive/2026-11-03-backfill-share-codec/evidence.md:6:At the host snapshot, the tests and delta were uncommitted.
openspec/changes/archive/2026-11-03-backfill-share-codec/evidence.md:7:The lead later ran the ratchet and archived the change.
openspec/changes/archive/2026-11-03-backfill-share-codec/evidence.md:39:The ledger at the original host snapshot records 59 old tests in this scope.
openspec/changes/archive/2026-11-03-backfill-share-codec/evidence.md:180:Separate checks cover boundaries, each named key, each other test and negative zero.
openspec/changes/archive/2026-11-03-backfill-share-codec/evidence.md:228:At the host snapshot, the worker did not run full gates, ratchet or archive.
openspec/changes/archive/2026-11-03-backfill-share-codec/evidence.md:229:The lead later ran the ratchet and archived the change.
openspec/changes/archive/2026-11-03-backfill-share-codec/design.md:102:The lead gets both formal reviews before the merge.
```

The test records give the generated titles below.

```text
src/share/backfill.test.mjs:460: [share-codec-022] The codec selects the supplied view before a tracked entity
src/share/backfill.test.mjs:1172: [share-codec-050] The layer option handles an unknown owner
src/share/backfill.test.mjs:1172: [share-codec-050] The layer option handles an unknown key
src/share/backfill.test.mjs:1172: [share-codec-050] The layer option handles an invalid value
src/share/backfill.test.mjs:1383: [share-codec-023] The fix time uses the current fix
src/share/backfill.test.mjs:1532: [share-codec-050] The decoder checks the option length cap before the available byte count
src/share/backfill.test.mjs:1546: [share-codec-019] The panel pin differs while its collapse value stays at its default
```

The source search shows the test tags, error reason and clock condition.

```bash
cd /home/ianblenke/docker/gev-work/sharecodec && rg -n "share-codec-059|share-codec-060|share-codec-061|share-codec-062|share-codec-063|share-codec-064|encodes normalized state with|deepEqual\(decode\(form\)|canonical state keeps|drops the share time one" src/share/backfill.test.mjs src/share/viewCodec.test.mjs openspec/specs/share-codec/spec.md
```

```text
openspec/specs/share-codec/spec.md:81:#### Scenario: Known detection names `share-codec-059`
openspec/specs/share-codec/spec.md:129:- **WHEN** the caller encodes normalized state with an absent share time or a share time at or before the decoder clock
openspec/specs/share-codec/spec.md:133:#### Scenario: Camera example size `share-codec-060`
openspec/specs/share-codec/spec.md:139:#### Scenario: Signed angle fields `share-codec-061`
openspec/specs/share-codec/spec.md:224:#### Scenario: Known place kind `share-codec-062`
openspec/specs/share-codec/spec.md:229:#### Scenario: Empty thing message `share-codec-064`
openspec/specs/share-codec/spec.md:257:#### Scenario: Fix wire data `share-codec-063`
src/share/viewCodec.test.mjs:836:    assert.deepEqual(decode(form), { ok: false, reason: 'bad-base64' }, form);
src/share/viewCodec.test.mjs:1093:test('[share-codec-060] size: a camera-only place view', () => {
src/share/backfill.test.mjs:322:  test(`[share-codec-059] The closed name ${key} accepts known text`, () => {
src/share/backfill.test.mjs:534:  test(`[${name.endsWith('place') ? 'share-codec-062' : name === 'empty entity' ? 'share-codec-064' : 'share-codec-030'}] The view kind uses the ${name} path`, () => {
src/share/backfill.test.mjs:1487:test('[share-codec-063] The complete fix supplies every coordinate and altitude', () => {
src/share/backfill.test.mjs:2299:  test(`[share-codec-061] The angle ${key} at ${value} uses the nearest signed turn`, () => {
src/share/backfill.test.mjs:2648:  test(`[share-codec-036] The canonical state keeps the share time at clock ${nowMs}`, () => {
src/share/backfill.test.mjs:2670:test('[share-codec-027] The decoder drops the share time one millisecond after the clock', () => {
```

## Full test sweep

The sweep reads all test files in the share module.
The test audit checks each leaf title and each assertion callback.
The scenario map records every leaf tag.

| Shape | Correction or decision | Check |
| --- | --- | --- |
| Tags with separate input conditions | Select tags for valid names, invalid names, known place kinds and empty thing messages. | R001 to R006, R014 to R016 |
| Tags for other behavior | Assign the valid fix to 063 and legacy layer conversion to 039, 040 and 041. | R017 to R021, R037, R038, R040 |
| Failure reason | Compare the URL forms with the complete literal failure result. | R010 |
| Camera values from production | Use literal camera values for unknown entities and absent thing messages. | R024, R025, R039 |
| Fixture at its default | Use six distinct camera values for place kinds and offsets without a fix. | R015, R022, R035 |
| Absent properties | Use Object.hasOwn for absent reports and fallbacks. | R036 |
| Several items | Check every unknown report, every known panel, all options and all tracking slots. | R023, R032 to R034 |
| Start state | Check all initial tracking slots before the selection. | The tracked-entity tests |
| Zero fields | Check both literal zero values and the absent altitude field. | R021, R037 |
| Canonical state | State the clock condition and check equality and the next millisecond. | R011 to R013 |
| Invalid parameters | Check all Noir parameter defaults with literals. | R026 |

The canonical-state tests keep their normalization and equality checks.
The corrupt-input test keeps its normalization invariant.
These property checks supplement the literal field tests.
The shared round-trip helper also checks normalization and canonical equality.
Each behavior with a new correction uses a literal result or a byte assertion.

The original titles keep their text as the owner instructs.
The title audit reports zero errors and 28 warnings.
The warnings name old titles or technical terms such as tracking, padding and celestialRing.
The correction does not change the word list.

## Counts and sources

```bash
cd /home/ianblenke/docker/gev-work/sharecodec && python3 /home/ianblenke/docker/gev-tools/sharecodec/review-measure.py
cd /home/ianblenke/docker/gev-work/sharecodec && node /home/ianblenke/docker/gev-tools/sharecodec/test-audit.mjs
```

```json
{
  "tests": 476,
  "taggedTests": 475,
  "scenarios": 64,
  "mutations": 1259,
  "killed": 1151,
  "equivalent": 108,
  "reviewMutations": 40,
  "reviewKilled": 40,
  "oldTests": 59,
  "oldTagged": 58,
  "auditRows": 347,
  "auditTested": 341,
  "auditEquivalent": 4,
  "auditDefaultValue": 2,
  "auditOpen": 0,
  "keyMutations": 427,
  "titleErrors": 0,
  "titleWarnings": 28
}
```

The leaf records supply the test counts and scenario links.
The live and archived specs supply the scenario count.
The original mutation data supplies 1219 historical cases.

The correction spec supplies the new cases.
The mutation log supplies each new result and failed test name.
The audit JSON supplies the row counts.
The original ledger at commit `5fd416b9` supplies the old test counts.

## Mutation output

The new mutation spec records each exact production edit and test pattern.
The helper makes each edit and restores the production file after its test.
The original mutation suite does not repeat in this correction.
The results keep its original records.

```text
R001: KILLED [share-codec-032] The open name hudVariant checks future_name-2; [share-codec-032] The open name mapStack checks future_name-2
R002: KILLED [share-codec-032] The open name hudVariant checks future_name-2; [share-codec-032] The open name mapStack checks future_name-2
R003: KILLED [share-codec-056] The open name hudVariant checks bad name; [share-codec-056] The open name hudVariant checks empty; [share-codec-056] The open name mapStack checks bad name; [share-codec-056] The open name mapStack checks empty
R004: KILLED [share-codec-056] The open name hudVariant checks bad name; [share-codec-056] The open name hudVariant checks empty; [share-codec-056] The open name mapStack checks bad name; [share-codec-056] The open name mapStack checks empty
R005: KILLED [share-codec-059] The closed name detectionAllocation accepts known text; [share-codec-059] The closed name detectionMode accepts known text
R006: KILLED [share-codec-059] The closed name detectionAllocation accepts known text; [share-codec-059] The closed name detectionMode accepts known text
R007: KILLED [share-codec-060] size: a camera-only place view
R008: KILLED [share-codec-061] The angle heading at 181 uses the nearest signed turn; [share-codec-061] The angle roll at 359 uses the nearest signed turn
R009: KILLED [share-codec-061] The angle heading at 180 uses the nearest signed turn
R010: KILLED [share-codec-034] a code is the bare base64url payload; URL forms are not codes
R011: KILLED [share-codec-036] The canonical state keeps the share time at clock 1767225617000
R012: KILLED [share-codec-027] The decoder drops the share time one millisecond after the clock
R013: KILLED [share-codec-036] The canonical state keeps the share time at clock 1767225617001
R014: KILLED [share-codec-062] The view kind uses the number place path; [share-codec-062] The view kind uses the text place path
R015: KILLED [share-codec-062] The view kind uses the number place path; [share-codec-062] The view kind uses the text place path
R016: KILLED [share-codec-064] The view kind uses the empty entity path
R017: KILLED [share-codec-063] The complete fix supplies every coordinate and altitude
R018: KILLED [share-codec-063] The complete fix supplies every coordinate and altitude
R019: KILLED [share-codec-063] The complete fix supplies every coordinate and altitude
R020: KILLED [share-codec-063] The complete fix supplies every coordinate and altitude
R021: KILLED [share-codec-063] The complete fix supplies every coordinate and altitude
R022: KILLED [share-codec-020] The follow offset heading uses its own field; [share-codec-020] The follow offset pitch uses its own field; [share-codec-020] The follow offset range uses its own field
R023: KILLED [share-codec-050] The layer option handles an invalid value; [share-codec-050] The layer option handles an unknown key; [share-codec-050] The layer option handles an unknown owner
R024: KILLED [share-codec-031] an unknown or invalid entity falls back to the camera its fix implies
R025: KILLED [share-codec-030] an unknown view kind falls back to the stored camera
R026: KILLED [share-codec-015] invalid style parameters keep the style’s own value
R027: KILLED [share-codec-050] The decoder checks the option length cap before the available byte count
R028: KILLED [share-codec-022] The codec selects the supplied view before a tracked entity
R029: KILLED [share-codec-023] The fix time uses the current fix
R030: KILLED [share-codec-019] The panel pin differs while its collapse value stays at its default
R031: KILLED [share-codec-032] The open name hudVariant checks future_name-2; [share-codec-032] The open name mapStack checks future_name-2
R032: KILLED [share-codec-049] future panel values and style tokens are skipped, not applied
R033: KILLED [share-codec-049] future panel values and style tokens are skipped, not applied
R034: KILLED [share-codec-049] future panel values and style tokens are skipped, not applied
R035: KILLED [share-codec-062] The view kind uses the number place path; [share-codec-062] The view kind uses the text place path
R036: KILLED [share-codec-032] The open name hudVariant checks future_name-2; [share-codec-032] The open name mapStack checks future_name-2
R037: KILLED [share-codec-063] The complete fix supplies every coordinate and altitude
R038: KILLED [share-codec-039 share-codec-040 share-codec-041] The legacy view without layers supplies the entity
R039: KILLED [share-codec-030] The unknown numeric view kind reports one value
R040: KILLED [share-codec-039 share-codec-040 share-codec-041] The legacy view without layers supplies the entity
```

## Tests and coverage

The full host suite passes all 476 leaf tests.
Each coverage command completes with exit status zero.
The coverage remains equal to the earlier host evidence.

| File | Line % | Branch % | Function % |
| --- | ---: | ---: | ---: |
| `src/share/follow.js` | 100.00 | 100.00 | 100.00 |
| `src/share/legacyShareState.js` | 100.00 | 100.00 | 100.00 |
| `src/share/shareLinkPath.js` | 100.00 | 100.00 | 100.00 |
| `src/share/viewCodec.js` | 100.00 | 98.68 | 100.00 |
| `src/share/wire.js` | 100.00 | 100.00 | 100.00 |

The test output records the full command on its first line.
The coverage output records each exact command and result.
The measurement data records the source hashes.

## Scope and limits

The live and archived requirement bodies match byte for byte.
The Purpose paragraph keeps its original bytes.
At the correction host snapshot, production files, QA scripts and trace files matched commit `4cf8e370`. The lead later changed the trace files in `af2b614e`.

The correction does not run make, Docker, the ratchet or the full gates.
The worker did not create a commit and did not push.
The lead owns the final gates and formal review records.

No reviewer finding needs a different correction from its stated purpose.
Prose corrections have no executable behavior for a production mutation to check.
The full prose lint checks those edits.
The behavior corrections name their failed mutations above.

## Final checks

The formatter writes and checks 1673 source files.
The separate format check accepts all share test files.
The full prose lint reports zero errors and 1275 warnings.
The title audit reports zero errors and 28 warnings.
The [check output](review-validation.txt) records each command and result.

The final check compares each test hash with the completed test suite.
The final check also compares all protected files with commit `4cf8e370`.
Both comparisons pass.

The status command gives the paths below.

```text
 M openspec/changes/archive/2026-11-03-backfill-share-codec/audit.md
 M openspec/changes/archive/2026-11-03-backfill-share-codec/coverage.txt
 M openspec/changes/archive/2026-11-03-backfill-share-codec/design.md
 M openspec/changes/archive/2026-11-03-backfill-share-codec/evidence.md
 M openspec/changes/archive/2026-11-03-backfill-share-codec/measurement.json
 M openspec/changes/archive/2026-11-03-backfill-share-codec/mutation-results.json
 M openspec/changes/archive/2026-11-03-backfill-share-codec/specs/share-codec/spec.md
 M openspec/changes/archive/2026-11-03-backfill-share-codec/tasks.md
 M openspec/changes/archive/2026-11-03-backfill-share-codec/test-audit.json
 M openspec/changes/archive/2026-11-03-backfill-share-codec/test-links.json
 M openspec/changes/archive/2026-11-03-backfill-share-codec/test-run.txt
 M openspec/specs/share-codec/spec.md
 M src/share/backfill.test.mjs
 M src/share/viewCodec.test.mjs
?? openspec/changes/archive/2026-11-03-backfill-share-codec/corrections.md
?? openspec/changes/archive/2026-11-03-backfill-share-codec/review-mutation-run.txt
?? openspec/changes/archive/2026-11-03-backfill-share-codec/review-mutations.json
?? openspec/changes/archive/2026-11-03-backfill-share-codec/review-validation.txt
```
