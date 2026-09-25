Verdict: PASS

I found no critical or major fault in the round-3 corrections. The four minor findings below can be recorded as known limits. I used only Read, Grep and Glob and ran no code. Findings are at commit ccb23a9.

- [ ] F1 minor /home/ianblenke/docker/gev-adopt/openspec/changes/archive/2026-09-25-ledger-adopt/specs/gap-ledger/spec.md:159 The correction of round-3 F1 is only half done. The wrong claim ("no full hash gives no error") is gone from 095, and 095 now matches `adoptsOf`. Three things are still open.
  - **Field name:** 095 keys on the field `from`, but no scenario says that this field holds the hash of the merged commit. Scenario 089 (line 104) says only "the line also has the full hash of the merged commit". `design.md:37` says the same.
  - **Text that is not a commit:** 096 still says "names a commit that is not a merged commit". `checkAdopts` (`ledger.mjs:297-300`) gives `LEDGER-ADOPT-FROM` to any string in `from` that is not in the set of merged hashes. Examples are `lost` (the unit test at `ledger.test.mjs:1064-1078` uses it), a short hash, and a branch name that points to the merged commit. The last one stops a line that is correct in meaning.
  - **Missing antecedent:** After the correction, the bullet "If the commit is not a merged commit" at `design.md:41` has no antecedent, because the text now names the fields `file` and `from`.
  - **Fix:** Name the field `from` in 089 and in `design.md:37`. Write in 096 and in D3 that a field `from` that is not the full hash of a merged commit gives `LEDGER-ADOPT-FROM`. Or record this as a known limit. A change to a scenario needs a new ratchet run.

- [ ] F2 minor /home/ianblenke/docker/gev-adopt/src/tooling/spec/gates.test.mjs:1163 The new assertion at line 1183 checks an AND line of scenario 095 at gate level ("the gate shows no error for such a line"), but the test has no `gap-ledger-095` tag.
  - `links.json` therefore shows 095 only with the unit test at `ledger.test.mjs:1038`, which does not run the gate.
  - The mutation that the assertion kills is not in `tasks.md`. Task 5.4 (line 89) lists only "do not pass the errors of `checkAdopts` to the report", and task 7.3 (line 109) makes the `review.md` report follow the task list.
  - **Fix:** Add the tag `gap-ledger-095` to this test. The test is new in this change, and `lintTestNames` lints the title without its tags, so no word is added. Add "Mutation 2: drop the shape checks from the adopt lines. The test must fail." to task 5.4 and run the ratchet again. Or accept both gaps.

- [ ] F3 minor /home/ianblenke/docker/gev-adopt/openspec/changes/archive/2026-09-25-ledger-adopt/design.md:23 The lead's note says one role name is used, but this line still says "tells the reviewer nothing". The paragraph below it (line 25) now says "the person who merges the change" for the same reader. The line is not in the diff, and the changed lines make the term inconsistent. **Fix:** write "tells the person who merges the change nothing", or accept it.

- [ ] F4 minor /home/ianblenke/docker/gev-adopt/openspec/changes/archive/2026-09-25-ledger-adopt/specs/gap-ledger/spec.md:155 The new wording "the same errors as it shows with no such line" is stronger than the code.
  - `compareWithBase` (`ledger.mjs:483-488`) reads every history line of the change, of any kind and with any shape, and takes each file of a line with `metric: 'totals'` into `totalsHistory`.
  - A hand-written adopt line that 095 rejects (for example `lines: -1`) and that also has `metric: 'totals'` for a file with the base content therefore hides `LEDGER-TOTALS-NOT-BASE`.
  - The adopt command never writes this field, and any other history line with that field has the same effect. The exposure is old, and the claim is wrong only for this input.
  - The same words are in `design.md:50`, so the fix must change both places.
  - **Fix:** name it in the known limit `adopt-by-hand`, or write "no adopt error" in place of "the same errors".

**Round-3 findings**

- **F1 (full hash text):** Half corrected, see F1 above. Scenario 095 and D3 now match `adoptsOf` (`ledger.mjs:274-277`): `typeof file` and `typeof from`, the metric check, `isCount(untraced)`. The text "full hash" is gone from 095 and from D3's list of checks. The unit test at `ledger.test.mjs:1045-1053` has one case for each check (`file: 7`, `from: undefined`, negative and non-whole counts, a null `untraced`).
- **F2 (rule 21, `review.md` record):** Corrected. Rule 21 in `AGENTS.md`, `proposal.md:23`, the limits at `proposal.md:156-158`, and `design.md:25` and `design.md:52` all name the person who merges the change and `review.md`. The wording of `adopt-own-merge-commit` matches rule 21. Only F3 above is left.
- **F3 (gate-level test for a line that 095 rejects):** Corrected, and the mutation is killed.
  - **How the mutation fails:** If `adoptsOf` loses the shape checks, the new line `ADOPT_LINE(root, 'src/merged.js', {lines: -1, from: main})` reaches `checkAdopts`. `mergeParents` does not contain `main`, so the gate writes `ERROR LEDGER-ADOPT-FROM src/merged.js ...`.
  - **Match:** This is the same output format that the assertion at `gates.test.mjs:1180` matches for `src/math.js`. The regex at line 1183 matches it, so `doesNotMatch` fails.
  - **Correct code:** The earlier `adopt` run wrote a valid `src/merged.js` line from `up`, and no adopt error names that file, so the assertion passes for the right reason.
  - **Limit:** At gate level the assertion kills only mutations that let this line pass. A mutation of a single check other than the metric check is killed only by the unit test.
- **F4 (D6 wording):** Corrected at `design.md:74` ("does not stop the build for the untrue coverage of its file").

**Scenarios 094 to 097 against the code and the tests**

- **094:** The new AND line ("a test name that the base entry does not have, or a name with a higher count") is exactly the `extra` filter at `ledger.mjs:546`. The THEN and AND lines match `ledger.mjs:548-550`.
- **095:** The base-history and other-change conditions come from `historyLinesOf` (`ledger.mjs:234-241`). The unit test asserts the head commit and the date are not checked, with `src/l.js`.
- **096 and 097:** "The scenario 095 does not reject the line" follows the order `adoptsOf`, then `checkAdopts` (`gates.mjs:529-533`). The requirement text at line 89 already uses "reject", so the word is consistent.
- **Delta and live spec:** The two texts of 094 to 097 are identical. The live spec is the source of the `ids.json` hashes.
- **Ledger and trace:** The requirement text did not change, and the test names did not change, so `links.json` needs no change. The ratchet stops on any difference between the archived delta and the live spec. The delta is older than the last ratchet outputs, and the live spec equals it now. So `ids.json` should hold the hashes of this text, although the live spec file is newer than `ids.json`.

**No code change, no renamed test**

- The supplied code diff has only `AGENTS.md` and `gates.test.mjs`. In `gates.test.mjs` it has only added lines. The name of the 096/097 test appears only in the hunk header. Both tests named in the task keep their names.
- I read `adoptsOf`, `checkAdopts`, `compareWithBase`, `adoptedCounts` and the adopt command in `gates.mjs`. I saw no leftover mutation. `gates.mjs` and `ledger.mjs` have a newer modification time than `gates.test.mjs`. That fits the restored mutation runs of H22 and V1/V2.

**STE lint by hand, changed lines only**

- I found no sentence above 25 words, no paragraph above 6 sentences, no contraction, no banned word and no passive form.
- These lines are exactly at a limit, so any later edit adds an error:
  - The sentence "A line is valid when its fields..." (`design.md:39`), at 25 words.
  - The bullet `adopt-own-merge-commit` (`proposal.md:158`), at 6 sentences.
  - The heading of 094, at 25 words.
- I made no lint check of the test comment, which is not in a linted file.

**Could not check**

- **Gate run of round 4:** `adopt-gates-5.out` holds only its command line. I have no STE result, trace result, ledger result or `TRACE-ID-CHANGED` result for this state. Read that file for `TRACE-ID-CHANGED`, `TRACE-LINKS-STALE`, `SPEC-DELTA-NOT-APPLIED` and `STE-SENTENCE`. If any of these appear, the verdict is void.
- **Git:** I could not run Git. I could not compare the working tree with the commit, or read `origin/main`. Please run `git status` and `git diff --stat 67ad53b ccb23a9` to confirm the diff.
- **Mutations:** I traced all mutations by hand.
