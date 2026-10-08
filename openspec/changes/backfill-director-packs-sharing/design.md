## Context

The change records commit `290b5d2`.
The scene controller uses the data pack session for shot assets.
It uses the share helpers before project replacement.

## Decisions

Tests call public functions with local data and custom sources.
They use no network data.
The trace gate checks tags and assertion methods.
The coverage gate checks each production file.
The STE gate checks prose and tagged titles.
Host coverage does not give a gate verdict.

The lead runs the ratchet, gates and review.

## Related browser QA scripts

- `scripts/qa-director-packs.mjs` proves data pack import, display and resource cleanup.
- `scripts/qa-director-sharing.mjs` proves that an author can share a scene with local assets.

## Evidence

The evidence records test links, scope sweeps and host coverage.
The mutation report records exact changes and failed tests.
The operand table in audit.md lists each operand and each call argument.

## Sweep commands

The evidence gives the report, test, coverage and ledger commands.
The operand table gives the decision totals.
The host uses Node 26.8.2.
The lead checks the gate image before the ledger update.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && python3 /home/ianblenke/docker/gev-tools/director-3/sweep.py
cd /home/ianblenke/docker/gev-work/director-3 && SWEEP_MODE=baseline python3 /home/ianblenke/docker/gev-tools/director-3/coverage.py
cd /home/ianblenke/docker/gev-work/director-3 && python3 /home/ianblenke/docker/gev-tools/director-3/coverage.py
cd /home/ianblenke/docker/gev-work/director-3 && NODE_PATH=/home/ianblenke/docker/gev-work/node_modules node /home/ianblenke/docker/gev-tools/director-3/decisions.cjs
cd /home/ianblenke/docker/gev-work/director-3 && python3 /home/ianblenke/docker/gev-tools/director-3/audit.py
```

## Files

The change adds its proposal, design, tasks, spec, evidence, checks.md and mutations.md.
It edits `src/director/packs/packs.test.mjs` and `src/director/sharing/sharing.test.mjs`.
It adds `src/director/packs/backfill.test.mjs`.
It does not edit the earlier director changes.

## Corrections of review round 1

Pass 2 uses the terms data pack, shot pack, load call, asset request, renderer and registered source with one meaning each.
The old title about stated references now says given references, because the manifest gives them.
The fixed request options belong to the directory source.
The tests call public functions with local assets, custom signals and call spies.
The production files stay the same as base commit `290b5d2`.
The scenario IDs stay director-076 through director-110.

The tests separate each byte limit from the first value above the limit.
A second preview test separates the shot total from the scene total.
The lead runs the next review round after this correction pass.

The scratch copy contains the repository test files and their source dependencies.
It carries the production files of base commit `290b5d2` with the test changes of pass 2.
The copy does not carry a branch.
The final byte comparison checks each test copy against the repository file.

## Corrections of review round 2

Pass 3 keeps base commit `290b5d2` and scenario IDs director-076 through director-110.
The operand table starts with open rows and records proof only after a test or probe completes.
The export serializer checks the project before the second parser call.
A test of invalid export input alone cannot prove the second parser call.
The production files stay unchanged.

The repeated export parser is equivalent for the public API of the module when built-in functions keep their standard behavior.
The serializer validates the same text first.
The parser returns that parsed object without a change.
The getter and resolver probe is evidence/probe-export-parser.txt.
The probe also checks an invalid project and a version 1 project.

The operand table records open proof gaps as open rows.
A candidate mutation link alone does not close a proof gap.
The lead must not send this change to review with an open proof gap.
