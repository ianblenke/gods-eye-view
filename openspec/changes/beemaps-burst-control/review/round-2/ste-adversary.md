Verdict: FAIL
Tip 03caafb4. I read the diff since fb23c4c1, the files it touches, the capability spec, and the evidence prose against the code and the log. I ran nothing. There are two majors and three minors.

- [ ] FINDING major openspec/specs/beemaps-burst-control/spec.md:137 (03caafb4) Scenario 013 contradicts the new Holds requirement (line 286). Line 137 says "the same quote with a new idempotency key gets `quote_expired`, also after an unknown outcome". Within 600 seconds the key gets the hold, a 409 `outcome_unknown`, because the hold step comes before the quote step (scenarios 007 and 040, `beemaps-burst.js:228-257`). After 600 seconds the quote has expired by time (120 seconds), so "used up" cannot show. The old test (`beemapsBurstProxy.test.mjs:793`) moves the clock by 601 seconds, which proves nothing about "used up". The new test title already says "after every outcome that is not a hold". Write "gets `quote_expired` after every outcome that starts no hold, and gets the answer of the hold after an outcome that starts a hold". The archived delta has the same text at line 135.
- [ ] FINDING major openspec/changes/archive/2026-10-15-beemaps-burst-control/design.md:77 (03caafb4) D14 says "After the send the record is still 'pending'". The new bullet in scenario 001 (line 17), the new Known limit `internal-error-after-send` and the new test (`beemapsBurstProxy.test.mjs:662`) say the record keeps the state it had when the error came. The test shows 'created'. Write "After the send the record keeps the state that it has when the error comes, so the hold and the replay rules apply to that state."
- [ ] FINDING minor openspec/specs/beemaps-burst-control/spec.md:286 (03caafb4) "key" still has two meanings. Line 286 uses "a new idempotency key" in sentence 1 and "a refusal of the key" (the API key) in sentence 2. "a new key" means the idempotency key at spec.md:246 and :292, design.md:53, proposal.md:46 and DATA_SOURCES.md paragraph 3. Write "a refusal of the API key" and "a new idempotency key".
- [ ] FINDING minor src/data/beemapsBurstLedger.test.mjs:164 (03caafb4) The title still says "reads a missing file" (an -ing word). The spec now says "a file that does not exist". Write "reads a file that does not exist as an empty ledger".
- [ ] FINDING minor openspec/specs/beemaps-burst-control/spec.md:18 (03caafb4) "when that error comes after the send" points to the error in line 16, but line 17 ("every answer has the content type JSON ...") sits between them. Write "when an error that nobody expects comes after the send". The archived delta has the same text at line 15.

Closed since round 1, checked in the files:
- The 28-word comment is now two sentences, 24 words in the second.
- CHANGELOG.md has 6 sentences (the longest 22 words), and DATA_SOURCES.md has four paragraphs of at most 4 sentences.
- The "holds" in test titles, comments and DATA_SOURCES.md now say "refuses" or "contains".
- The "closing line", "neighbouring", "reserves" and "mapping" wordings are replaced.
- The evidence counts match the file: 1197 fault lines, 15 equivalent faults, 2 hangs, 3 test files that stop, and 212 tests (208 plus the 4 new tests).
- The local-run raw output is consistent with the new code commit.

Checked, no finding:
- The new Known limits `two-instances` and `internal-error-after-send` are true against `credits.js` and `ledger.js` (state in memory), the guard, and the new test.
- The `refusal-sources` limit is bounded to the create call. The version 1.3.0 `/bursts` lists only 200 and 500.
- The statement that the code files changed only in comments matches the diff.
- The commit order shows d097f0b0 is the last code commit.
- There is no banned word in the diff.

Not checked: any run, and the second fault run (only the first run's lines are in the file).
