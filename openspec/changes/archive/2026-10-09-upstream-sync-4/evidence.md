## Faults

The lead made three faults in the register test of `qa-scripts-023`. The runs used the files of commit c9047528.

The first fault removes the argument `manifest`. The second fault removes the argument `adopts`. The third fault changes the expected count from 90 to 89.

Each fault fails the test of `qa-scripts-023`. The file `evidence/mutations.txt` contains one line for each fault and the line without a fault.

## Host tests

The lead ran each test file under `src` on the host, except `gates.test.mjs`. For `gates.test.mjs`, the lead ran only the tests with `change-review-03` or `qa-scripts` in their names.

The runs used the files of commit c9047528. The file `evidence/host-run-head.txt` contains the commit.

The file `evidence/host-run.txt` contains one line for each test file. Each line shows 0 failed tests, and no test file lacks a module on the host. Two files skip all their tests on the host: `src/data/focusAllocations.test.mjs` and `src/overlays/worldOverlayAllocation.test.mjs`. The host has Node 26, and the tests need Node 24. The file `evidence/host-node.txt` shows both versions. One test of `src/keySetupHardening.test.mjs` runs only on Windows, so it skips on each Linux run.

## Upstream check

The file `evidence/upstream-check.txt` contains the answer of the upstream remote for its main branch and the local ref `upstream/main`. It contains the two parents of the merge commit 4011f2a6 and the number of upstream commits.

It lists the 33 files that the merge changes. The merge adds six of them, and all six are upstream code.
The lines after the list of the 33 files show that none of the 33 files is in `openspec/ownership.json`. They also show that the merge changes nothing under `openspec`, `.claude`, `AGENTS.md`, `Makefile` or `scripts/spec`. The last lines show that the plan commit 7c1a511e holds the delta spec. They also show the order of the plan commit, the merge commit and the test commit.

## Checks

The lead ran the format check, the import direction check, the package boundary check and the layer token check on the host. The lead also ran the STE lint and `openspec validate --specs`.

The file `evidence/checks.log` starts with the commit and the changed files of the tree. It contains the last lines of each output. Each status is 0, and the lint gives 0 errors.
