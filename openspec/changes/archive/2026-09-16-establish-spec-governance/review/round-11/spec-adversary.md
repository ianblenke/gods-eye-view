Verdict: FAIL
- [ ] F1 major scripts/spec/lib/ledger.mjs:317 The round-10 F2 correction (gap-ledger-062) uses the low counts only when the content hash in the entry is not the current hash (:170–171). It also does not stop an author who edits `gaps.json` by hand. The base comparison uses the base low counts only for a file with the base content (:317). For a changed file, it compares with the base high counts (:322, :335). Thus a change can still add not-covered lines, branches or functions to an unstable file, up to the width of its range. I tested a copy of `ledger.mjs` (`review-spec-r11/hand-sha.mjs`) with the real entry of `src/voice/gevActions.js` (lines 1302 to 1304, branches 219 to 221). The author edits the file, and the run gives lines 1304, branches 221 and total branches 800. With the real entry, `compareLedger` gave `LEDGER-LARGER-GAP` two times, which is correct. Then I tried two hand edits of `gaps.json`:
  - Edit A changes only `sha` to the new hash and keeps the range. `compareLedger` gave no errors and no stale entries. `compareWithBase` with `sameAsBase: () => false` and `outsideChanged: true` gave `[]`.
  - Edit B removes `low` and writes the new hash, the new total counts and the high counts 1304 and 221. `compareLedger` gave no errors and no stale entries. `compareWithBase` gave `[]`.

  Neither edit needs a history line. The gate does not compare the history with the ledger. Thus 2 new lines and 2 new branches that no test covers pass the gates. This case is not in "Known limits and later changes". design.md:113 says that the ratchet command removes the range, but the gate does not make an author use the ratchet command.

  Correction: in `compareWithBase`, stop the build for an entry with a range when the file content is not the base content. For a file with content that is not the base content and a base entry with a range, compare the not-covered counts of the entry with the low counts of the base entry (`LEDGER-LARGER-THAN-BASE`, `LEDGER-MORE-THAN-BASE`). Add a scenario and a test for edit A and edit B.
- [ ] F2 minor src/tooling/spec/ledger.test.mjs:447 The gap-ledger-050 test does not assert the new AND line: "the base comparison stops for the moved range when the file has the base content". The test does not call `compareWithBase`. In a copy, I replaced the `LEDGER-UNSTABLE-MOVED-UP` check (ledger.mjs:317) with `if (false)`. Only the gap-ledger-060 test failed, and the gap-ledger-050 test passed. The gap-ledger-060 test checks this behavior, so no gap passes the gates. Correction: in the gap-ledger-050 test, call `compareWithBase` with the ratchet result, the base entry and `sameAsBase: () => true`, and assert `LEDGER-UNSTABLE-MOVED-UP`. Or remove the AND line from gap-ledger-050, because gap-ledger-060 already has this rule.

Round-10 findings:
- **Corrected:** F1.
  - `compareLedger` gives `LEDGER-BAD-RANGE` from `correctRange` (ledger.mjs:132–140, :204–208).
  - gap-ledger-061 is in the spec, `ids.json`, `links.json` and task 4.60, and task 4.60 comes before task 4.62.
  - Its test (ledger.test.mjs:589) has these cases: `null` low with a numeric high, low above high, a negative low, a low that is not an integer, a missing low, a low that is a string, and a half range for an unloaded file. It asserts the full error, and it asserts that the ratchet command stops.
  - When I replaced the check with `if (false)` in a copy, only the gap-ledger-061 test failed.
- **Corrected:** F2, for the ratchet path only (see new F1).
  - `compareCoverageEntry` uses the low counts for a changed file (:171).
  - The ratchet command removes the range with a `range` / `content changed` history line (:405, :429).
  - The gap-ledger-062 test (ledger.test.mjs:611) asserts both messages, `LEDGER-STALE` at the low counts, the removed range, the history line and a clean compare after the ratchet command.
  - I made three changes in copies: `allowed` returns the high count, `keepRange` ignores the hash, and the `range` history line is removed. For each change, only the gap-ledger-062 test failed.
- **Corrected:** F3. The WHEN line of gap-ledger-018 (spec.md:49) says "and the entry has no range". gap-ledger-050 has the AND line (spec.md:151), but see new F2.
- **Corrected:** F4. design.md:111 says "a range that is not wider than the base range also cannot move above the base range". design.md:89 and :113 describe the low counts and the removed range.

Gate output: the only error is `REVIEW-MISSING`, which you expected. There are no warnings.

Other checks:
- Tasks 4.58 to 4.61 (tests) come before task 4.62 (code).
- The six history lines name establish-spec-governance.
- The archived spec files and `openspec/specs/` are the same, except for the Purpose sections.
- Since round 10, the only changed code and test files are `scripts/spec/lib/ledger.mjs` and `src/tooling/spec/ledger.test.mjs`.
- In `tree/`, `ledger.test.mjs` passed 58 of 58 tests with local Node v26.

I did not change files in the repository. The experiments are in `/tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/review-spec-r11/`:
- `hash-edit.mjs` uses `copy/ledger.mjs`.
- `tree/` holds the copy for the changed-code test runs. I put back its original `ledger.mjs` after each run.

F1 and F2 use only the logic of the ledger, so they do not depend on the Node version.