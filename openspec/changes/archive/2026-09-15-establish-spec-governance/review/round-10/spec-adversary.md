Verdict: FAIL
- [ ] F1 major scripts/spec/lib/ledger.mjs:239 A person can set one low count of a range to `null` by hand, and the gate does not stop. `width` gives 0 for a `null` low count. Thus the range is not "wider" (:276), it is not "too wide" (:272), and it does not "move up" (:302). `inRange` (:129) then compares the count with `null`, and JavaScript changes `null` to 0. Thus each count from 0 to the high count agrees with the entry, and the ledger never becomes "not current" for that metric. No `unstable` history line is necessary, and the diff can change any file. I tested a copy of `ledger.mjs` (`review-spec-r10/null-low.mjs`) with the real entry of `src/voice/gevActions.js`, and set `low.branches` to `null`:
  - Change A edits only `gaps.json`. `compareWithBase` with `outsideChanged: true` gave `[]`. `compareLedger` gave no errors and no stale entries.
  - Change B adds tests, and the not-covered branches go from 219 to 100. `compareLedger` gave no errors and no stale entries. With the real entry, it gave `LEDGER-STALE`, which is the gap-ledger-008 result.
  - Change C removes those tests, and the count goes back to 221. `compareLedger` gave no errors.

  Thus change C removes the coverage of 119 branches, and the gates do not stop. gap-ledger-008 is false for this entry. This case is not in "Known limits and later changes".

  Correction: make the gate stop for an entry with a range when a low count is not an integer and its high count is a number. Also make it stop when a low count is more than its high count. Use a new error code, or use `compareWithBase` and `compareLedger`. Add a scenario and a test with `low.branches: null` and a numeric high count.
- [ ] F2 major scripts/spec/lib/ledger.mjs:166 For a changed file with a range, the gate compares the not-covered counts with the high count of the range. The ratchet command keeps the range for the new content (:384–403). The range comes from the samples of the old content, but the gate also applies it to the new content. Thus a change can add code with not-covered lines, branches or functions, up to the width of the range. I tested a copy (`review-spec-r10/changed-slack.mjs`) with the real entry of `src/voice/gevActions.js`, which has lines 1302 to 1304 and branches 219 to 221:
  - The author edits the file so that the run gives the low counts. The author also adds 2 lines and 2 branches that no test covers. The run gives lines 1304, branches 221 and total branches 800.
  - `compareLedger` gave only `LEDGER-STALE`. After the ratchet command, `compareLedger` gave no errors. The entry keeps `low` 1302 and 219, and the history has only `hash` and `totals` lines.
  - `compareWithBase` with `sameAsBase: () => false` gave `[]`.
  - The same run with an entry without a range at 1302 and 219 gave `LEDGER-LARGER-GAP` two times.

  `deterministic-tests` and `range-totals` (proposal.md:60, :66) do not name this case. design.md:89 says that the gate compares the not-covered counts of a changed file, but it does not say that a range adds an allowance.

  Correction: for a file with content that is not the hash of its entry, compare the not-covered counts with the low counts. Make the ratchet command remove `low` when the content hash changes. Add a scenario and a test for a changed file with a range. If you do not do this, add this case to `deterministic-tests` and to design.md "Unstable coverage".
- [ ] F3 minor openspec/changes/archive/2026-09-14-establish-spec-governance/specs/gap-ledger/spec.md:48 gap-ledger-018 says that the gate does not stop for branches that a new test shows in an unchanged file. For an entry with a range, the gate now always stops for this case:
  - Before the ratchet command runs, the gate gives `LEDGER-STALE`.
  - After the ratchet command runs (gap-ledger-050), `compareWithBase` gives `LEDGER-UNSTABLE-MOVED-UP` (ledger.mjs:303).

  I tested a copy (`review-spec-r10/shown-018.mjs`) with the real entry of `src/data/labelArbiter.js`. The run had 2 more not-covered branches, 3 more total branches and history lines from the ratchet command. The result was `["LEDGER-UNSTABLE-MOVED-UP"]`. design.md:111 accepts this, but gap-ledger-018 and gap-ledger-050 do not name it. Thus the gate never accepts the ledger that gap-ledger-050 writes for a file with the base content.

  Correction: add "and the entry has no range" to the WHEN line of gap-ledger-018. In gap-ledger-050, add an AND line that says that the base comparison stops for the moved range when the file has the base content (gap-ledger-060).
- [ ] F4 minor openspec/changes/archive/2026-09-14-establish-spec-governance/design.md:111 The text says: "For a file with the base content, a range also cannot move above the base range." This is not true for a wider range. design.md:109, gap-ledger-052 and the code (ledger.mjs:287–293) let a wider range have a high count up to 5 above the base count. The gap-ledger-037 test (ledger.test.mjs:548) accepts high count 52 for base count 50. Correction: change the sentence to "For a file with the base content, a range that is not wider than the base range also cannot move above the base range."

Round-9 findings:
- **Corrected:** F1.
  - `compareWithBase` gives `LEDGER-UNSTABLE-MOVED-UP` when the entry has a range, the file has the base content and a count is above the base count (ledger.mjs:301–305).
  - gap-ledger-060 is in the spec, `ids.json`, `links.json` and task 4.59, and task 4.59 comes before task 4.60.
  - Its test (ledger.test.mjs:576) uses the attack from round 9 with a history line that a person wrote. It asserts the full error. It also asserts `LEDGER-MORE-THAN-BASE` for a changed file, and no errors for a range that moves down.
  - When I replaced the new check with `if (false)` in a copy, only the gap-ledger-060 test failed.
  - design.md:111 names the rule (see F4).
- **Corrected:** F2. proposal.md:66 has "while each not-covered count is in its range".
- **Corrected:** F3. The WHEN line of gap-ledger-021 (spec.md:224) names "an entry without a range".
- **Corrected:** F4. design.md:101 says "For each file below 100% with different counts".

Gate output: the only error is `REVIEW-MISSING`, which you expected. There are no warnings.

Since round 9, the only changed code and test files are `scripts/spec/lib/ledger.mjs` (the `LEDGER-UNSTABLE-MOVED-UP` check) and `src/tooling/spec/ledger.test.mjs` (the gap-ledger-060 test and a renamed gap-ledger-059 test). The six history lines name establish-spec-governance.

I did not change files in the repository. The experiments are in `/tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/review-spec-r10/`:
- `null-low.mjs`, `changed-slack.mjs` and `shown-018.mjs` use `copy/ledger.mjs`.
- In `tree/`, `ledger.test.mjs` passed 56 of 56 tests with the local Node v26. That `tree/ledger.mjs` now contains the `if (false)` change.

F1 to F3 use only the logic of the ledger, so they do not depend on the Node version.