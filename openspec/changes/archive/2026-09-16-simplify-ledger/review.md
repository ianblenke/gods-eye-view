# Review: simplify-ledger

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-16
Gates: make gates CHANGE=simplify-ledger passed
Rounds: 3
Scope: full
Reviewed-Tree: cfaad05004f40dc877f175e5e186aab3dac272e1447ab56e3e77e58575bebec9

The output of each round is in `review/round-<n>/`. The output in `review/` is the output of round 3, where both agents gave the verdict PASS.

The number of findings decreased in each round: 28 in round 1, 14 in round 2 and 4 in round 3. Round 2 and round 3 read only the corrections of the round before. No commit records the tree of a round, because the branch has one commit for the change.

This change found three faults of the governance system itself. Each one has its own rule now:
- No change could remove a requirement. The trace gate needed a test for each scenario of `openspec/specs/` until the archive command ran, and the archive command needs the gates to pass. See `spec-trace-054`.
- The archive command of such a change changes the scenarios, so the ID registry and the scenario links need a new ratchet run. The ratchet command stopped for an archived change. See `gap-ledger-077`.
- The tolerance needed the total line count of the ledger entry, which no entry had before the migration. The gate now takes the measured total.

## Findings

### Round 1: spec-adversary

- [x] F1 critical The only test of `spec-trace-054` asserted `loadSpecs().removedIds`, not the gate. `src/tooling/spec/trace.test.mjs` now calls `evaluateTrace` with `removedIds` and asserts the empty error list, the pending count, and that a scenario of the checked change stays required.
- [x] F2 minor The JSDoc of `compareLedger` now gives the tolerance rule.
- [x] F3 minor Removed the dead parameter `outsideChanged` from `compareWithBase`, from `gates.mjs` and from the test.
- [x] F4 minor The requirement "Ledger file" now names the total lines, as a MODIFIED requirement of the delta.
- [x] F5 minor The design goal and the new known limit `line-tolerance-larger` now give the real numbers.
- [x] F6 minor The test of `gap-ledger-077` now asserts `ids.json` and the ledger.
- [x] F7 minor The test of `gap-ledger-074` now covers the file that no test loads.

### Round 1: ste-adversary

- [x] S1 to S21 All 21 findings corrected. The corrections include: "the covered count of its entry minus the tolerance" in each place, because the entry records the not-covered count; a rewritten `gap-ledger-071` without a WHEN line that its own THEN lines exclude; "at most the tolerance"; "measured" in place of "observed"; and 16 wording corrections in the proposal, the design, the tasks and the delta spec.

### Round 2: spec-adversary (Verdict: PASS)

- [x] F1 minor The known limit now gives the branch sums and the function sums apart.
- [x] F2 minor The design goal now names the sum, and the limit names the 18 metrics with a larger tolerance.
- [x] F3 minor The ledger assertion of `gap-ledger-077` could not fail. The test now asserts an untraced test entry that the ratchet run removes.

### Round 2: ste-adversary

- [x] S1 to S11 All 11 findings corrected: the sums of each metric, "does not write a worse count", "at most the tolerance", "the measured counts", the active voice for the removals, "each metric with a worse current count", the total counts of a loaded file, and the empty line before "## Requirements" that the archive command removes.

### Round 3: spec-adversary (Verdict: PASS)

- [x] No finding.

### Round 3: ste-adversary (Verdict: PASS)

- [x] S2 minor The design goal now gives the sum of the tolerances, not the words "in sum".
- [x] S3 minor The proposal now writes "the sum of the line tolerances", because the numbers are sums of the tolerance.
- [x] S4 minor The proposal now writes "the 706 covered metrics of the loaded entries".
- [ ] S1 minor The requirement "Ledger file" writes that the ledger records "the not-covered lines, branches and functions" for each code file below 100%. The 107 entries of a file that no test loads record null for the branches and the functions. Accepted by Ian Blenke. The spec adversary examined the same sentence and did not report it: the clause comes without a change from the base commit `47e355e`, and no author can hide a gap with it. A correction of the requirement text gives each of its five scenarios a new hash, so each of their tests needs a change with no new behaviour to check.
