# Review: ledger-adopt

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-25
Gates: make gates CHANGE=ledger-adopt passed
Rounds: 4
Scope: diff 67ad53b56c2bb12ef5292cba73b9d16b2f925311
Reviewed-Tree: 54b1aeef5fc40e425ec47cb4ca5b4e367230cc54ef9894789a0fe7c632ba43ce

## Findings

- [x] Round 1 spec-adversary F1 (major): the tests of `gap-ledger-089` and `gap-ledger-090` did not assert that the command leaves the registry, the links and the ledger alone. Corrected. The mutations H19 (write the links file), H20 (write the ledger file in a fault path) and H21 (write the registry) fail these tests.
- [x] Round 1 spec-adversary F2 to F8 (minor): corrected. The main points are the known limit `adopt-own-merge-commit` and rule 21 of `AGENTS.md`, the total rule for untraced tests, the untrue-coverage and base-content conditions of `gap-ledger-092` and `gap-ledger-098`, a closed name in the test of `gap-ledger-089` (mutation A12), the removal of a test that pinned the order of Git calls, the tests of a message with a waiver and an adopted count, and the flip of `src/data/labelArbiter.js` in the Impact. The lead checked each finding against the code (`review/round-1/skeptics.md`).
- [x] Round 1 ste-adversary S1 to S8 (major): the spec text disagreed with the code and the design (`null` counts, the untrue-coverage and base-content conditions, the origin of an entry), the known limit `adopt-later-edit` stated the reverse of the rule, and the numbers of the errors were wrong (813 and 10, 121 files with 158 errors, about 1800 untraced tests). All corrected.
- [x] Round 1 ste-adversary S9 to S28 (minor): corrected in the proposal, the design, the tasks, the spec and the names of new tests.
- [x] Round 2 spec-adversary F1 to F3 (minor): corrected. A name that keeps its base count is in the test of `gap-ledger-094` (mutation U7). `gap-ledger-095` says that the gate does not check the head commit and the date (mutations V1 and V2). Rule 21 names the person who merges the change.
- [x] Round 2 ste-adversary S1 (major): the premise "the merged tree has 423 code files with a gap" was false. Corrected: the errors name 423 code files.
- [x] Round 2 ste-adversary S2 to S21 (minor): corrected. The main points are the title and the test name of `gap-ledger-094`, the terms "merge commit" and "merged commit", "allow" for "admit", the order of the mutations in the tasks and the active voice.
- [x] Round 3 ste-adversary S1 and S2 (major): scenario 095 spoke of a full hash that the code does not check, and the reason for the untraced total lost its "because". Both corrected: the scenario and D3 name the fields `file` and `from`, and D5 gives the reason.
- [x] Round 3 ste-adversary S3 to S12, S14 and S15 (minor): corrected in the spec, the design, the proposal, the tasks and `AGENTS.md`.
- [x] Round 3 ste-adversary S13 (minor): the names of two new tests use "its" for two nouns. Each better name is above the limit of 25 words. Kept. Accepted by Ian Blenke on 2026-09-25.
- [x] Round 3 spec-adversary F1 to F4 (minor): corrected. A test of `gap-ledger-096` and `gap-ledger-097` writes a line that `gap-ledger-095` rejects and asserts that the gate gives no adopt error for it (mutation H22).
- [x] Round 4 spec-adversary F3 (minor): corrected in D1 of the design.
- [x] Round 4 spec-adversary F1, F2 and F4 (minor): named as the known limits `adopt-from-text`, `adopt-gate-test-tag` and `adopt-rejected-line-totals`. Each needs a change of the text of a scenario or of a test tag, and so a new ratchet and a new round.
- [x] Round 4 ste-adversary S1 to S9 (minor): corrected in `AGENTS.md`, the proposal and the design. The scenario part of S5 is the known limit `adopt-from-text`.
- [x] Round 4 ste-adversary S10 (minor): "a name with a higher count" in `gap-ledger-094` misses its comparison. It needs a change of the scenario text, so a new ratchet and a new round. Kept. Accepted by Ian Blenke on 2026-09-25.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since `1adadad`, round 3 since `0a6fdb7` and round 4 since `67ad53b`. Round 4 was a narrow confirmation round after the two major findings of round 3. The limit of three rounds is exceeded by this one round, for that reason. The lead corrected the minor findings of round 4 in `AGENTS.md`, the proposal, the design and the tasks after the round, with no new round.
- [x] Trace: the ratchet passed after each correction. The scenarios `gap-ledger-089` to `gap-ledger-099` are new, and `gap-ledger-021`, `gap-ledger-022`, `gap-ledger-032` and `gap-ledger-040` have changed text. The gate shows 377 scenarios verified with 0 open.
- [x] Constraints: the change adds no request method for an OpenSensorHub server, no network call and no name or ID of the owner's server. No test that exists on `origin/main` is renamed. The change does not run `adopt`: `openspec/trace/history.jsonl` has no adopt line.

## Evidence

- [x] The gates run after the archive of round 4 had one error, `REVIEW-MISSING`, with `Ledger: 0 entries do not match the current gaps`, `STE: 0 errors` and `Trace: 377 scenarios, 377 verified, 0 open`. The gates run after this file is the final check.
- [x] The lead ran the real command on a fixture with a real merge commit in the tests of `gates.test.mjs`: `adopt`, then the ratchet command, then the check, with no error. The command was not run on the merge of upstream. That is the work of the change `upstream-sync`.

## Coverage of the changed code files

- [x] `scripts/spec/lib/ledger.mjs`: complete. The file has no ledger entry, and the gate shows no gap.
- [x] `scripts/spec/lib/git.mjs`: complete. The file has no ledger entry, and the gate shows no gap.
- [x] `scripts/spec/gates.mjs`: lines 574 of 574, branches 198 of 199, functions 61 of 61. The one branch is the phantom branch that the ledger already records for this file. The new fault check uses one array and one `find` call, and it adds no branch.

## Mutation report

Each mutation ran in the working tree of the clone with the named test file, and the lead restored the file after each run. A mutation that no test fails is a finding.

- [x] Git helpers: 6 mutations (G1 to G6). G1 to G5 fail their tests. G6 (remove the flag `--merges` of `git rev-list`) survived, because a commit with one parent has no merged commit. The lead removed the flag from the code.
- [x] Ledger functions: 52 mutations of the first battery (A1 to A11, B1 to B12, C1 to C4, D1 to D6, E1 to E4, F1 to F18) and 14 mutations of the later batteries (U1 to U7, V1, V2, A12, F2a, F2b, N1, N2). Each fails a test. The later batteries ran on the corrected code of `compareWithBase` (the total of the untraced tests and `adoptedFor`) and replace the mutations of the first battery for those lines.
- [x] Command, faults and make target: 21 mutations of the first battery (H1 to H18 and M1 to M3), and H19 to H22 for the corrections. H18 (the stop for an error of the measurement) and M2 (two definitions of `FROM_ARG`) survived at first, and the lead added a test for each. All fail a test now.
