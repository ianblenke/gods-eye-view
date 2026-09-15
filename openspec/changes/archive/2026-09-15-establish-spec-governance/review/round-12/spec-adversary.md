Verdict: FAIL
- [ ] F1 minor scripts/spec/lib/ledger.mjs:396 The round-11 correction makes the gate stop for a changed file that is at 100% in the run, when its entry has a range with each low count at 0. The ratchet command cannot correct this. `compareLedger` does not make such an entry stale, also when the file content changed (:224). `ratchetLedger` keeps the entry with the old hash and the range (:396–398). Then `compareWithBase` gives `LEDGER-UNSTABLE-CHANGED` (:323–325), `LEDGER-LARGER-THAN-BASE` and `LEDGER-MORE-THAN-BASE`, because the base low counts are 0 (:326). I tested a copy (`review-spec-r12/tree/zero-range.mjs`). The entry has lines 2, branches 1 and `low` 0, 0, 0 (the stability command writes such entries, see gap-ledger-035 `src/flaky.js`). The file has new content, and the run is complete:
  - `compareLedger` gave no errors and no stale entries.
  - The ratchet command kept the entry and wrote no history lines.
  - `compareWithBase` with `sameAsBase: () => false` gave the three errors above.

  The AND line of gap-ledger-062 (specs/gap-ledger/spec.md:198) says that the ratchet command removes the range of a changed file. The code does not do this for a complete file. The author must remove the entry by hand. No gap passes the gates, so this finding is minor. Correction: in `ratchetLedger`, keep an entry that `completeInRange` accepts only when the current content hash is the hash of the entry. Otherwise, remove the entry and add a `closed` history line. Give the hash of complete files to `compareLedger` so that it makes such an entry stale (gap-ledger-008). Add a case to the gap-ledger-062 test.
- [ ] F2 minor openspec/changes/archive/2026-09-14-establish-spec-governance/design.md:108 The sentence "Thus an author cannot change a test or a caller and use a range to hide the lost coverage" is true only for a new or wider range. A range that is already in the base lets a later change remove coverage up to the width of the range. That change can edit tests or callers outside `openspec/`, and it needs no history line. I tested a copy (`review-spec-r12/tree/in-range-loss.mjs`) with the real entry of `server/providers/vessels/ais-store.js` (lines 40 to 44). A change removes a test, and each run then gives 44 lines. `compareLedger` gave no errors and no stale entries. `compareWithBase` with the same base entry, `sameAsBase: () => true` and `outsideChanged: true` gave `[]`. gap-ledger-033 allows this, but `deterministic-tests` (proposal.md:60) does not name this case. Correction: change design.md:108 so that it is only about a new or wider range. Add a sentence to `deterministic-tests`: "In a file with a range, a change can remove the coverage of lines, branches or functions up to the width of the range. The spec adversary checks each changed test for these files."

Round-11 findings:
- **Corrected:** F1.
  - `compareWithBase` gives `LEDGER-UNSTABLE-CHANGED` for an entry with a range when the file content is not the base content (ledger.mjs:323–325).
  - For a changed file, it compares with the base low counts (`baseAllowed`, :326).
  - Edit A now gives `LEDGER-UNSTABLE-CHANGED`, `LEDGER-LARGER-THAN-BASE` and `LEDGER-MORE-THAN-BASE`. Edit B gives `LEDGER-LARGER-THAN-BASE` (1304 against 1302) and `LEDGER-MORE-THAN-BASE` (221 against 219).
  - gap-ledger-063 is in the spec, in `ids.json`, in `links.json` and in task 4.62. Task 4.62 comes before task 4.63.
  - design.md:113 has the rule.
  - I made two changes in copies. For each change, the 063 test failed:
    - With `if (false)` in place of the check at :323, the gap-ledger-060 and gap-ledger-063 tests failed.
    - With `baseAllowed = base`, only the gap-ledger-063 test failed.
- **Corrected:** F2. gap-ledger-050 (spec.md:152–155) no longer has the AND line. gap-ledger-060 has the rule.

Gate output: the only error is `REVIEW-MISSING`, which you expected. There are no warnings.

Other checks:
- The archived spec files and `openspec/specs/` are the same, except for the Purpose sections.
- The six history lines name establish-spec-governance.
- Each of the 207 scenario IDs has a task.
- Since round 11, the only changed code and test files are `scripts/spec/lib/ledger.mjs` and `src/tooling/spec/ledger.test.mjs`.
- In the copy, `ledger.test.mjs` passed 59 of 59 tests with local Node v26.

I did not change files in the repository. The experiments are in `/tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/review-spec-r12/tree/`. The original `ledger.mjs` is back in that copy. F1 and F2 use only the logic of the ledger, so they do not depend on the Node version.