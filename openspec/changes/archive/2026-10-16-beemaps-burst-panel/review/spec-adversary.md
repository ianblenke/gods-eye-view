Verdict: PASS
Tip read: 509c4156 (the branch ref of the clone gives 509c4156; I read the working tree and ran no git). The only gate error is REVIEW-MISSING, which is expected.

- [ ] FINDING minor openspec/changes/archive/2026-10-16-beemaps-burst-panel/design.md:102 @509c4156 "the server keeps refusing new confirm requests" has no time bound. D17 (design.md:94) and the Known limit warning-in-memory say 600 seconds, and the hold ends then (HOLD_MS 600_000 in ledger.js). Write "the server refuses new confirm requests for 600 seconds".

Checked, no finding:
- Hold wording. lost-answer, warning-in-memory and D17 agree with ledger.js. holdSeconds counts only the states unknown and pending, 600 s from record.time. A record "created" gives no hold. confirmLocked checks the replay of the same key, then the in-memory hold of a refusal (startHold), then the ledger hold. No text says "only" now.
- browser-run.txt:15 matches the two transcripts in the same file. Run 1 (:114) is 79 s old and skips the check. Run 2 (:220-221) is 54 s old and passes it. Lines 12-13 describe step 9, and line 15 qualifies them. I read this as true, not as a finding.
- Scenario 020. The count for a refusal is pinned by layer.test.mjs:2414 (1 to 2). Created is pinned by :2178. Unknown is no longer claimed. All three answers go through the one draw() call, so the general line holds.
- Scenario 016 "string id" equals index.js:282. The rows at layer.test.mjs:1040-1042 pin no burst, a burst with no id and id 5. The Known limit empty-id is true: records.test.mjs:195 and source.test.mjs:458 have the '' row, and no layer test has it.
- Scenario 024, new title. It fits the body. The abort at 60 s is pinned by source.test.mjs:498-540.
- Scenario 029, the lock. My call: one meaning. The appositive follows an instant, but every other use ("its own lock of 1000 milliseconds", "the end of the lock", "the timer of the lock") needs the lock to be the period. No reading changes an assertion: disabled at T+999, enabled at T+1000 (layer.test.mjs:1518).
- "At most one create request" in the proposal (:37), CHANGELOG:3 and DATA_SOURCES:105 agree with the evidence: 4 confirm requests and 3 create requests.
- The ten renamed faults. Each name matches its edit in faults.py (:480-486, :550, :558-561, :847). No "wait" or "redraw" is left in a fault name.
- Equivalent faults. mutations.txt has 834 fault lines, 16 of them "failing: NONE". I checked all 16 reasons against the edits in faults.py and the code. All are true.
- Deltas. The osh delta differs from main (cc576adb) only in the osh-033 line (32 to 33). The beemaps-frames delta differs only in the THEN line of 025.

Could not check: the "git diff 3e9d7a12 HEAD" claims in mutations.txt and host-checks.txt, and whether the ten renamed edits are byte-identical to round 3. I compared names with the current faults.py only. The identity of the two runs is not checkable from the file, because it lists one run only.

Outside the scope of this diff, not a finding: the last AND of scenario 028 (the wrapper gives the render governor as requestRender, and a caller can give another function) is asserted only by registration.test.mjs:151, which is tagged 020. The four tests tagged 028 do not assert it. The mutation lines for the wrapper (mutations.txt:515-517) are also under 020.
