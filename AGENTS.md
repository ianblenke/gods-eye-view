# Spec-first process

These rules are for each person and each AI agent that changes this project.

## Rules

1. Write or change the spec before you write or change code.
2. Give each scenario a stable ID. Put the ID at the end of the scenario heading, in backticks.
3. Write the tests from the scenarios. Put the scenario IDs at the start of each test name. Use a method of `node:assert`, such as `assert.equal`. The gate does not count a direct `assert()` call.
4. Write the code until the tests pass.
5. Keep each code file at 100% line, branch and function coverage.
6. Write all new prose in ASD-STE100 Simplified Technical English.
7. Get a passed review from the two review agents before you merge the change.

`openspec/config.yaml` has the full rules for the scenario IDs, the test tags and the prose.

## Gates

The gates run on the Node version in `.node-version`. Use the Docker image, because other Node versions give different coverage counts.

| Command | Purpose |
|---|---|
| `make gates` | Run all gates for the current tree |
| `make gates CHANGE=<name>` | Run all gates. The named change must be complete. |
| `make ratchet CHANGE=<name>` | Record the closed gaps, the new scenario IDs and the test links |
| `make lint` | Run the STE lint on the prose files |
| `make tree CHANGE=<name>` | Show the tree hash for `review.md` |

A gap is a code file below 100% coverage or a test without a scenario ID. The file `openspec/trace/gaps.json` records each open gap. The gates stop the build in these conditions:
- A gap opens.
- A gap becomes larger.
- A gap closes, and you do not run the ratchet command.
- A person changes the ledger files to hide a gap.

## Steps for a change

1. Run `/opsx:propose` to write the proposal, the specs, the design and the tasks.
2. Do the tasks in order. Write each test before its code.
3. Run `make ratchet CHANGE=<name>`.
4. Run `make gates CHANGE=<name>`. Correct each error, except the review errors.
5. Run `/opsx:review <name>`. This command archives the change, runs the two review agents and writes `review.md`.
6. Commit the change, the archive folder and the files in `openspec/trace/`.

## Steps for a backfill change

A backfill change adds specs and tests for old code. Its name is `backfill-<capability>`.

1. Select one capability and its code files from `openspec/trace/gaps.json`.
2. Write the specs from what the code does now. Use `Origin: backfill` for each requirement.
3. Add scenario IDs to the old tests of each scenario. Add tests for the lines, branches and functions that are not covered.
4. Run `make ratchet CHANGE=backfill-<capability>`. The history records the closed gaps with the change name.
5. Do steps 4 to 6 of the change steps.
