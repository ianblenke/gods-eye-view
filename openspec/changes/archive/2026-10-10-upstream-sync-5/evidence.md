## Fault

The lead made one fault in the catalog. The fault removes the line `createApplicationOsh(),` from `src/app/constructCatalog.js`. The runs used the files of commit `c394af4a`.

Without the fault, both layer count tests pass. With the fault, the two tests with the changed number 31 fail, and four other tests fail too. The file `evidence/mutations.txt` has the counts and the test names.

## Host tests

The lead ran each test file on the host, one process for each file. `evidence/host-run.txt` has one line for each of the 592 files. The run has 9585 tests, 9570 pass, 0 fail and 15 skip.

The file `src/tooling/spec/gates.test.mjs` needs more than 590 seconds. The lead ran it alone with a limit of 2400 seconds, and all 241 tests pass.
Two files skip 14 tests on the host, because the host has Node 26 and the tests need Node 24: `src/data/focusAllocations.test.mjs` (1) and `src/overlays/worldOverlayAllocation.test.mjs` (13). One Windows test in `src/keySetupHardening.test.mjs` skips on Linux. The file `evidence/host-node.txt` shows both Node versions, the function that checks the version and the three skip lines.

## Upstream check

The file `evidence/upstream-check.txt` has the answer of the upstream remote for its main branch and the local ref `upstream/main`. It has the two parents of the merge commit and the number of upstream commits.
It lists the five pull requests that the merge brings (#982 to #986) and the 50 files that the merge changes. The merge adds nine of them, and all nine are upstream code.
The last lines show that none of the 50 files is in `openspec/ownership.json`. They also show that the merge changes no file under `openspec`, `.claude`, `scripts/spec` or `server`, and not `AGENTS.md` or the Makefile.

## Checks

The lead ran the format check, the import direction check, the package boundary check and the layer token check on the host. The lead also ran the STE lint and `openspec validate --specs`.
The file `evidence/checks.log` has the last lines of each output. Each status is 0, and the lint gives 0 errors.

## Read-only checks

Four analysts checked the merged tree: the OSH layer, the security of the upstream part, the fork specs and documents, and the configuration. The file `evidence/workflow.md` has the result. One analyst reported one finding with the severity blocker: the untagged upstream tests in `src/layers/recentImagery/rendering.test.mjs` and `src/layers/recentImagery/thumbnails.test.mjs`. A skeptic agent checked it and found the fact true and the severity too high. The adopt command records both files (`untraced 1` for each).

The analysts found no other blocker and no major problem. The file `evidence/workflow-result.txt` has their full reports.
