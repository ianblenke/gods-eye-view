# Review: gates-coverage-race

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-06
Gates: make gates CHANGE=gates-coverage-race passed
Rounds: 3
Scope: diff a885562
Reviewed-Tree: faf52895611a28f5c30e698299fbdaab854a3522865808025946984dd6f6e913

## Findings

Full agent reports: `review/round-1/`, `review/round-2/`, `review/spec-adversary.md`, `review/ste-adversary.md`.

### Round 1 (scope: full) - FAIL

- [x] FINDING major (spec-adversary, 2 findings) The file `runs.json` held the whole gate environment, and a test could forge the raw coverage folder inside the output folder. Corrected: the runs file holds only the environment overlay of each run, and the raw folder is a private temporary folder that the gate removes in a `finally` block.
- [x] FINDING minor (spec-adversary, 5 findings) No error for absent raw files, no rule against rebaseline lines for fully covered files without a base entry, no tie test for equal parents, false facts in the proposal, and the order of the tasks. Corrected in the code, the tests, the mutations and the documents.
- [x] FINDING major (ste-adversary, 7 findings) The lcov names and "LF" had no definition, "complete" and "merge" had two meanings, Node internals looked like repository code, "it" had no referent, the proposal denied the trace writes, and "bounds" had two meanings. Corrected in the specs, the design and the proposal.
- [x] FINDING minor (ste-adversary, 6 groups) Wording faults in the design, the specs, the tasks and the test titles. Corrected.

### Round 2 (scope: diff a7c784a) - FAIL (spec-adversary PASS, ste-adversary FAIL)

- [x] FINDING minor (spec-adversary, 6 findings) The raw folder is reachable from tests, the name is not asserted random, "on every path" is false after a kill signal, no test for absent lcov and absent raw files, a wrong sentence about the camera total, and scenario 122 said "rejects the line". Corrected: the Known limits `raw-folder-reachable`, `raw-folder-after-kill` and `rebaseline-flip-risk`, two new tests with mutations, and the corrected sentences.
- [x] FINDING major (ste-adversary, 1 finding) The term "coverage module" had two referents. Corrected: the text says "the merge module" everywhere.
- [x] FINDING minor (ste-adversary, 11 groups) Wording faults. Corrected, except the optional sentence cuts that the worker report lists. Accepted by Ian Blenke.

### Round 3 (scope: diff a885562) - PASS

- [x] FINDING minor (spec-adversary) The sentences about the camera total in `design.md` gave only one of two steps. Corrected: the design states both steps and the net change of none.
- [x] FINDING minor (spec-adversary) The size "about one GB" after a kill disagreed with the peak of 2112810378 bytes. Corrected in the proposal and the design: two folders, up to about two GB.
- [x] FINDING minor (spec-adversary) The test of scenario `coverage-gate-066` makes only one error inside the measurement. Recorded as the Known limit `finally-test-scope` in the proposal. Accepted by Ian Blenke.
- [x] FINDING minor (spec-adversary) The test of scenario `coverage-gate-066` proves different names, not random names. Recorded as the Known limit `random-name-test-scope`. Accepted by Ian Blenke.
- [x] FINDING minor (spec-adversary) The test of scenario `gap-ledger-122` uses a history with one line. Recorded as the Known limit `history-122-test-scope`. Accepted by Ian Blenke.
- [x] FINDING minor (ste-adversary, 4 findings) The camera sentences in the design, the word "helper" and the word "hole". Corrected in the design and the proposal.
- [x] FINDING minor (ste-adversary, 5 findings) The merge module has no file name in the two requirement texts, "merge module change" has two meanings, "gives its LEDGER errors" lost the word "still", "it" and "also with no raw files" are unclear in the coverage-gate spec, and the tasks say "Test `coverage-gate-055` before the code". These need a change of a spec text or a test title, or a correction makes six tasks longer than 20 words. Accepted by Ian Blenke.
