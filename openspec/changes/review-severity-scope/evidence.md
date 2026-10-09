## Mutations

The lead ran five mutations on the files of commit ee72a4a2. Each mutation changes one line of `.claude/agents/ste-adversary.md` or `AGENTS.md`.
After each mutation, the lead ran the tests of `change-review-034`, `change-review-035` and `change-review-036`. Then the lead restored the file.
The file `evidence/mutations.txt` holds the output of each run.

| Mutation | Change | Test that fails |
|---|---|---|
| M1 | Remove the sentence "Two possible meanings in other text are minor when the text is true under each meaning." | `change-review-034` |
| M2 | Remove the sentence "Other text includes evidence.md, tasks.md, the notes and tables of design.md, review.md and the title of a test." | `change-review-034` |
| M3 | Replace "major" with "minor" in the line "A banned word in normative text or in a test title." | `change-review-035` |
| M4 | Remove the line "A task that gives two instructions." | `change-review-035` |
| M5 | Replace "`critical`, `major` or `minor`" with "`blocker` or `minor`" in rule 16 of `AGENTS.md`. | `change-review-036` |

## Host tests

The lead ran each test file of `src/tooling/spec` on the host, except `gates.test.mjs`. For `gates.test.mjs`, the lead ran only the tests with `change-review-03` in their names.
The file `evidence/runs-head.txt` holds the commit of the files. The file `evidence/spec-files-run.txt` holds one line for each run. Each line shows 0 failed tests.
