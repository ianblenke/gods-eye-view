Verdict: PASS
- [ ] FINDING minor openspec/changes/archive/2026-10-07-backfill-director-camera-interactions/tasks.md:274 Task 3.4 cites m134 and m144 for the new in-`execute` state checks (session.test.mjs:93, :198-211). The older tests already killed both rows. Add a row that moves `changed(state());` (session.js:34) after the race. The old 070 and 074 tests pass against it and the new checks fail.
- [ ] FINDING minor openspec/specs/director/spec.md:358 Scenario 048 has no line for the 0.55 test (cameraMoves.test.mjs:299 asserts 11.271). Add AND "latitude 10 to 12 degrees gives 11.271 degrees at progress 0.55".
- [ ] FINDING minor src/director/interactions/session.test.mjs:366 Scenario 073 says the signal "still reports aborted false", but the test reads `signal.aborted` only before the event. Add `assert.equal(signal.aborted, false)` after the awaited dispatch. A listener that also aborts the controller passes today.
- [ ] FINDING minor src/director/cameraDocument.test.mjs:706 Scenario 051 says "only in versions 1 and 2", but no test of this change rejects pose text at version 4 or later. `version < 3` to `version !== 3` survives. Add a version 4 text test or narrow the line.
- [ ] FINDING minor proposal.md:52 `session-builtin-patch` names m149 only. The m253 bound (a patched `AbortSignal` `aborted` getter) is in audit.md:399 and mutations.md only. Name m253 in the limit.
- [ ] FINDING minor audit.md:215 Rows m252 to m254 lie after the Test names block, outside the table (76 table rows; Totals says 79). Move them into the table. Give the m253 reason: the guard at session.js:47 decides each cancelled result.
- [ ] FINDING minor evidence/probe-equivalent.txt:1 JavaScript in a .txt file with a hard-coded /home/ianblenke path, which no gate runs. Its re-entrant case acts in the activate callback, not the line-34 callback. State that the m149 and m253 claims rest on reading session.js 10-60.
- [ ] FINDING minor openspec/specs/director/spec.md:518 Scenario 060 "of the same shot" has two readings: the shot that holds the shot action field, or the target shot. The tests use the first. Write "the shot that holds the shot action field".

Round-2 minors: all 10 are closed.
- Split: m250 and m251 are killed by the 0.55 test (11.271 against 11.331).
- Survivors: m252 and m254 are killed. m253 and m149 are equivalent for the public API, by my reading. The line-47 guard `!current.signal.aborted` decides every cancelled result, also when a line-34 callback calls `clear` and the listener is added late. `active` is false only when the Map is empty after `clear` or `activate`, also with re-entrant callbacks.
- `Object.hasOwn`: m255 gives a TypeError, not a `SceneDocumentError`, so the test kills it.
- Version 1 text: m256 and m257 are killed.
- Audit DEFAULT rows now cite m147, m148 and m116.
- The 060 AND line is present, "can recover" is bounded, and the five old titles match main.

Each `old` string of m250 to m257 occurs once in its file. The 234 tests count matches. session.js 23 of 24 branches matches gaps.json (branches 1 of 24), and the Known limit at line 51 is correct. History lines 2031-2037 name this change. I expect one unrecorded survivor, `t <= 0.5`, which is equal at 0.5.

Tree: clone director-2, commit 794d94e. I read files only and ran nothing, so every kill and every equivalence is by reading. I did not read the gate output, wording, or the QA script bodies beyond their headers.
