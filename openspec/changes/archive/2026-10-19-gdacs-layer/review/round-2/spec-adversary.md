Verdict: FAIL

Tip 8c12aec5, clone /home/ianblenke/docker/gev-work/gdacs-layer. C = openspec/changes/archive/2026-10-19-gdacs-layer. The main spec has the same text, 3 lines lower. I ran no code, so each fault result below is from reading the code.

- [ ] FINDING major C/specs/gdacs-layer/spec.md:136 @8c12aec5 The corrected text "the newest result of the source" has two meanings. It can mean the result of the newest call of `update`, or the result that arrives last. The 016 test (layer.test.mjs:393-401) lets the aborted request answer after the new one, and expects 1 entity. So it asserts only the first meaning. Scenario 016 (:172) says only that the new call aborts the old request. No fault in evidence/faults.txt removes the check `if (_request === request)` (index.js:116), so rule 13 has no evidence for this line. Add "It MUST ignore an answer to a request that it aborted." to the requirement. Add "AND an answer to the request that the new call aborted changes nothing" to 016. Add the fault that changes index.js:116 to `{`.
- [ ] FINDING major C/specs/gdacs-layer/spec.md:41 @8c12aec5 "It MUST keep only the first event of each `id`" has two meanings when the first event with that id does not meet the rules. It can mean "keep no event of that id" or "keep the first valid one". records.js:101 keeps the first valid one. No test puts an invalid event before a valid event with the same id. So this fault passes each test: at records.js:101-102, write `if (seen.has(record?.id)) continue; seen.add(record?.id); if (!item) continue;`. Write "the first event of each `id` among the events that meet the rules". Add that sample to 006 and to its test, and add the fault.
- [ ] FINDING minor C/specs/gdacs-layer/spec.md:136 @8c12aec5 `disable` clears the entries (index.js:102), and `enable` (index.js:91-95) does not send them again. So the layer is then enabled and shows the old points with no labels until an update succeeds. "it MUST keep those points and labels" is then false. The manager calls `update` right after `enable` (lifecycle.js:1006-1019), and it disables the layer when that call fails (lifecycle.js:919-927). So the gap lasts only for one request. Name this in a Known limit, or make `enable` send the entries again.
- [ ] FINDING minor C/evidence/browser.txt:64 @8c12aec5 The new check also passes when `Runtime.evaluate` fails. In run.mjs:130, `String(undefined)` does not contain the loading text. The screenshot shows the view at longitude 110 with each label above its point, so I see no wrong result now. Make the check fail when the value is undefined.

Round-1 findings with complete corrections (no new finding):
- design.md:45 and DATA_SOURCES.md:127 are now true. dataCredits.js:179 holds both sentences of the disclaimer from gdacs.js:21-22.
- The corrections to proposal.md:7, :20 and :46 and to CHANGELOG.md:3 are true. Tasks 2.6 to 2.16 name each test change.
- The spec corrections at :45, :91, :107, :115, :129 and :145 are complete.
- Each of these new behaviors has a test that asserts it and a killed fault (faults.txt:171-174 and :182):
  - an init after destroy
  - error null when an unavailable result follows a failed request
  - the reverse-order input of 011
  - the total 2^53
  - the second sentence of the credit
- Tasks 2.17 and 3.20 keep tests before code.
- The renamed titles have no banned word, and links.json has them.
- The main spec matches the delta, and the Purpose matches design.md.

Numbers for review.md (no finding):
- faults.txt:381 gives 159 faults with 159 killed (154 + 5 new), not 154.
- browser.txt has 6 PASS lines, not 5.