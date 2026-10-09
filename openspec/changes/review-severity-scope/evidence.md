## Mutations

The lead ran 18 mutations with the runner `mutate-pins.py`. The file `evidence/mutate-pins.py.txt` holds a copy of the runner.
Each mutation changes one line of `.claude/agents/ste-adversary.md` or `AGENTS.md`.
The runner runs the tests of `change-review-034`, `change-review-035` and `change-review-036` after each mutation. Then the runner restores the file.

The runs used the code files and test files of commit 9f29ee10. The file `evidence/runs-head.txt` holds the commit.
The file `evidence/mutations.txt` holds one line for each mutation. The line names the failed test, the expected test and the word OK.
The last line shows the run without a mutation.

| Mutations | Change | Test that fails |
|---|---|---|
| R1 to R6 | Remove one pinned line | `change-review-034` |
| R7 to R13 | Remove one pinned line | `change-review-035` |
| A14 to A16 | Put back one of the three old lines | `change-review-035` |
| B1, B2 | Change rule 16 of `AGENTS.md` | `change-review-036` |

## Host tests

The lead ran each test file of `src/tooling/spec` on the host, except `gates.test.mjs`. For `gates.test.mjs`, the lead ran only the tests with `change-review-03` in their names.
The file `evidence/spec-files-run.txt` holds one line for each run. Each line shows 0 failed tests.

## Checks

The lead ran the format check, the lint and OpenSpec validate on the host. The file `evidence/checks.log` starts with the commit and the changed files of the tree, and it holds the last lines of each output. Each status is 0, and the lint gives 0 errors.
