Verdict: PASS

I found no critical or major fault in the round-3 corrections, only four minor findings. I read the diff since 0a6fdb7 and the current state of the four change documents, the live spec, `scripts/spec/lib/ledger.mjs`, `scripts/spec/lib/git.mjs`, `scripts/spec/gates.mjs`, the changed tests, `links.json`, `ids.json`, `gaps.json` and `history.jsonl`. I used only Read, Grep and Glob and ran no code. Findings are at commit 67ad53b.

- [ ] F1 minor /home/ianblenke/docker/gev-adopt/openspec/changes/archive/2026-09-25-ledger-adopt/specs/gap-ledger/spec.md:152 The new words "no full hash of a commit" are not what the code checks.
  - **What the code does:** `adoptsOf` (`ledger.mjs:275`) only tests `typeof line.from === 'string'`. A grep of `scripts/spec` finds no full-hash check. A short hash, a branch name or `lost` therefore passes `adoptsOf`, and `checkAdopts` gives `LEDGER-ADOPT-FROM`.
  - **Conflicts in the spec and tests:**
    - 095 says the gate shows no error for a line with no full hash. That is false for these values.
    - The new AND line of 096 (line 160) drops such a line from 096, but the code errors on it.
    - The 096/097 unit test (`ledger.test.mjs:1064-1078`) uses `from: 'lost'` and asserts `LEDGER-ADOPT-FROM`. By the new wording, that input is outside 096.
    - The 095 test (`ledger.test.mjs:1040-1056`) and the other ledger tests use `from: 'up1'` as a valid line, and `up1` is not a full hash.
  - **Other places with the same wording:** live spec:451, live spec:459, live spec:465, `design.md:43` and `design.md:39` ("has a file and a commit"). The word "commit" in `design.md:39` can mean the head commit, which the code does not check.
  - **Fix:** in 095 (delta and live spec) and in `design.md:43`, write "no text in the field `from`". Say in 096 that a text that is not a merged commit gives `LEDGER-ADOPT-FROM`. In `design.md:39`, name the field `from`.

- [ ] F2 minor /home/ianblenke/docker/gev-adopt/openspec/changes/archive/2026-09-25-ledger-adopt/proposal.md:49 The round-2 F3 gap is only half corrected.
  - **What was fixed:** rule 21 of `AGENTS.md` and `adopt-own-merge-commit` now name the person who merges the change and say that this person records the result in `review.md`.
  - **What is still open:** `adopt-hand-merged-files` (line 49) and `adopt-by-hand` (line 50) still say "the reviewer ... reads the Git diff" and "the reviewer of a change reads each adopt line". `design.md:25` and `design.md:46` say the same. The two review agents cannot run Git, and no place records this check.
  - **Text made incomplete by the correction:** `proposal.md:23` describes rule 21 only as "an agent uses `adopt` only for code that a merge commit brought". It does not mention the new duty to compare and record.
  - **Fix:** use "the person who merges the change" in these places, name `review.md` as the place of the record, and state the duty in `proposal.md:23`.

- [ ] F3 minor /home/ianblenke/docker/gev-adopt/scripts/spec/gates.mjs:529 No test runs the gate with a line that has a fault named in 095.
  - **Claims that need the whole gate:** 095's AND "the gate shows no error for such a line, and it shows the errors of the gap as if the line was not there", and the new AND lines of 096 and 097.
  - **What the tests check:** only pieces. `adoptsOf` is tested for filtering (`ledger.test.mjs:1038-1061`), and `checkAdopts` is tested with lines that are already valid. The `gates.test.mjs` tests at 1078 and 1163 write only well-formed lines.
  - **Mutation that survives by hand trace:** change the argument at `gates.mjs:530` to a list that keeps the kind and change filter but drops the shape checks of `adoptsOf`. No test writes a line such as `lines: -1` to `history.jsonl`, so all tests stay green.
  - **Fix:** in the 096/097 test at `gates.test.mjs:1163`, add a line with `lines: -1` and a commit that is not a merged commit. Assert that the check gives no `LEDGER-ADOPT-*` error for it. Or accept this as a known limit.

- [ ] F4 minor /home/ianblenke/docker/gev-adopt/openspec/changes/archive/2026-09-25-ledger-adopt/design.md:68 The correction of round-2 S2 made the text wider than `gap-ledger-098`.
  - **The problem:** "A valid adopt line has the mark for untrue coverage. Then the gate does not stop the build for its file." reads as full immunity for the file.
  - **What 098 and its test assert:** only the untrue-coverage stop is removed. The test at `ledger.test.mjs:1162` still expects `LEDGER-HASH-NOT-BASE` for a file with the base content, and counts above the adopted count still stop.
  - **Fix:** write "the gate does not stop the build for the untrue coverage of its file".

**Round-2 findings checked against the code and the tests**

- **Spec F1 (kept name):** corrected.
  - The 094 test (`ledger.test.mjs:1139-1151`) has base `{one:1, kept:4}` and entry `{one:3, two:2, three:1, kept:4}`. The total is 10 and the sum of the extra names is 6.
  - By hand trace, an adopted count of 6 fails the "sum of the extra names" mutation (task 3.7 Mutation 4), and 5 fails the "rise" mutation (Mutation 3). Mutation 2 fails at 5.
  - The `<=` boundary is killed by the assertion `messages([line]) === []` at 10.
  - Scenario 094 (title, "new test name, or a higher count") matches the `extra` filter in `compareWithBase`, and both halves are killed.
- **Spec F2 (head commit and date):** the test half is corrected. The new line `src/l.js` has `commit` and `date` undefined, and it is expected in the result. A mutation that requires `commit` or `date` in `adoptsOf` fails it. The wording half is not correct (see F1).
- **Spec F3 (rule 21 and the limit):** see F2 above.
- **STE S1 and S3 to S8:** corrected in the design, the scenarios, the test names, `testGuard.test.mjs:449` and `links.json` (lines 621, 635, 641, 642, 646). `links.json` has no old test name left.
- **STE S9 to S21:** checked in the text; the remaining faults are in F1, F2 and F4.
- **No renamed test from origin/main:**
  - Every renamed test carries only new IDs from 089 to 099.
  - `ids.json` records those IDs as `since 2026-09-25`, `change ledger-adopt`, and `retired-ids.json` has none of them.
  - The three new tests of `git.test.mjs` (lines 81, 91, 101) are new; the old test at line 22 keeps its name.
  - The tests of 021, 022, 032 and 040 keep their names.
- **Code and ledger:**
  - No code file changed in round 3. The `gates.mjs` entry in `gaps.json` keeps lines 0, branches 1, functions 0 and its hash `a98e785f`.
  - `history.jsonl` has no `adopt` line, and all `ledger-adopt` lines are for `gates.mjs` and `labelArbiter.js`.
  - Files changed since round 2 add no child process, worker or shell call.
- **Delta and live spec:** the four changed hunks (094 to 097) are identical in the two files. The requirement text did not change.
- **STE lint by hand:** no banned word, contraction, `-ing` word (other than `nothing`) or passive form in the change files. No sentence is above 25 words, and no paragraph is above 6 sentences.
  - These lines are at exactly 25 words, so any later edit adds an error: the 094 heading, the AND line of 095 at line 155, the third bullet of D3 (`design.md:43`), and the test name of 096/097 in `gates.test.mjs:1163`.
  - The sentence at `design.md:39` that starts "A line is valid when" is also at 25 words. It did not change this round.

**Could not check**

- **Gate run for round 3:** `adopt-gates-4.out` held only the command line when I read it. I have no STE lint result, no coverage result and no trace result for this state. `adopt-gates-3.out` is the round-2 state; its only error was `REVIEW-MISSING`.
- **`ids.json` hashes for 094 to 097:** I cannot compute SHA-256 by hand. Glob orders the files by modification time, oldest first: `gaps.json`, `ids.json`, `links.json`, `tasks.md`, then the live spec `openspec/specs/gap-ledger/spec.md` last. If the live-spec edit of 094 to 097 came after the last ratchet, the gate will show `TRACE-ID-CHANGED`. Read `adopt-gates-4.out` for that code, for `TRACE-LINKS-STALE`, and for the error "Scenario ... in openspec/specs is not equal to the scenario in the archived change".
- **`origin/main`:** I could not read it. I judged the renamed tests only by their new IDs.
- **Mutation runs:** I traced them by hand only.
- **Numbers:** the 1800, 15 minutes, 8 files and 16 files claims are not measured.
