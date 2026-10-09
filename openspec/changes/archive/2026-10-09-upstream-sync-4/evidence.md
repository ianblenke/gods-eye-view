## Faults

The lead ran three faults on the register test of `qa-scripts-023`. The runs used the files of commit 1361629f.

The first fault drops the argument `manifest`. The second fault drops the argument `adopts`. The third fault changes the expected count from 90 to 89.

Each fault fails the test of `qa-scripts-023`. The file `evidence/mutations.txt` holds one line for each fault and the line without a fault.

## Host tests

The lead ran each test file of `src/tooling/spec` on the host, except `gates.test.mjs`. For `gates.test.mjs`, the lead ran only the tests with `change-review-03` or `qa-scripts` in their names.

The lead also ran 14 test files of the application that run on the host. The files cover the Codex sign-in, the voice code, the key setup, the local services, the credentials of the bundle and the vector tiles.

The runs used the files of commit f2f00b5b. The file `evidence/host-run-head.txt` holds the commit. The file `evidence/host-run.txt` holds one line for each run. Each line of a run shows 0 failed tests.

## Upstream check

The file `evidence/upstream-check.txt` holds the answer of the upstream remote for its main branch and the local ref `upstream/main`. It also holds the two parents of the merge commit 4011f2a6.

It lists the files that the merge adds. All six added files are upstream code.

## Checks

The lead ran the format check, the import direction check, the package boundary check and the layer token check on the host. The lead also ran the STE lint and `openspec validate --specs`.

The file `evidence/checks.log` starts with the commit and the changed files of the tree. It holds the last lines of each output. Each status is 0, and the lint gives 0 errors.
