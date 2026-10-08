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
The automatic audit lists each operator class.
The survivor table gives each result.

## Sweep commands

The evidence gives the report, test, coverage and ledger commands.
The automatic audit gives the operator and status totals.
The host uses Node 26.8.2.
The lead checks the gate image before the ledger update.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && python3 /home/ianblenke/docker/gev-tools/director-3/sweep.py
cd /home/ianblenke/docker/gev-work/director-3 && SWEEP_MODE=baseline python3 /home/ianblenke/docker/gev-tools/director-3/coverage.py
cd /home/ianblenke/docker/gev-work/director-3 && python3 /home/ianblenke/docker/gev-tools/director-3/coverage.py
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass4/build-audit.py
```

## Files

The change adds its proposal, design, tasks, spec, evidence, checks.md, mutations.md, audit.md and survivors.md.
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
The pass 3 operand table started with open rows and recorded proof only after a test or probe completed.
The export serializer checks the project before the second parser call.
A test of invalid export input alone cannot prove the second parser call.
The production files stay unchanged.

The repeated export parser is equivalent for the public API of the module when built-in functions keep their standard behavior.
The serializer validates the same text first.
The parser returns that parsed object without a change.
The getter and resolver probe is evidence/probe-export-parser.txt.
The probe also checks an invalid project and a version 1 project.

The pass 3 operand table recorded open proof gaps as open rows.
A mutation link alone does not close a proof gap.
The lead must not send this change to review with an open proof gap.

## Pass 4 decisions

The automatic audit replaces the hand operand table.
The hand mutation report stays valid.
The survivor table links each result to a failed test, a public function probe or a Known limit.
An equivalent claim applies only to the public API of the module with standard built-in functions.

A callback can change an object that the module gives it.
The probes include those callbacks and property getters.
A probe alone does not prove a kill.
Only a failed repository test proves a kill.

The byte limit tests use real byte buffers.
A shared fixture holds the bytes, base64 text and digest.
The import test builds bundle JSON without an export call.
The export fixture caches equal zero-byte chunks as arrays.

The fixture keeps the real byte length and real digest input.
The import fixture copies decoded bytes with Buffer after it checks all possible byte values of the map function.
The other decoder tests use the native byte copy.

The large export fixture uses the Buffer base64 codec.
The other export tests use the native codec.
The tests accept a value at the limit and reject one byte more.

Campaign 1 stopped at the baseline cap before mutation work.
Campaign 1 gave no complete result.
Campaign 2 checks the original 3849 mutations.

Pass 4 correction check 1 gave 180 kills.
Pass 4 correction check 2 gave 192 kills and left equivalent cases and Known limits.
The final rerun is the lead check of all 3849 mutations.
The new Known limit concerns a custom nonnumeric byte length.
The valid numeric length fallback keeps its tagged test and scenario clause.

## Pass 5 decisions

The extension keeps all 3849 old mutation IDs.
New mutations have IDs from a9000.
The tool adds constructor arguments, await removal, adjacent statement order and regex class members.
It also adds default shapes, destructured fields, spreads, template values, regex quantifiers and constructor changes.
The tool tests cover optional call arguments and optional calls.
The old optional class already generates the same changes in these source files.

The tests check large invalid JSON text, each standard base64 character and snapshot entries.
The probes check input limits, empty values, unusual text, sparse arrays, numeric limits and getters.
The probe range table gives the bound of each claim.
The tests check field order and callback order where a public input can show a difference.
The source files stay unchanged.

Campaign 1 is the stopped baseline command.
Campaign 2 is the original command for 3849 mutations.
The final rerun is the lead command for those 3849 mutations.
The extension run checks the new classes.
Pass 4 correction checks 1 and 2 keep their separate names.

The last sweep adds range character removal as a separate tool class.
The tests check every path letter and digit, each hexadecimal digit and each standard base64 character.
The range check repeats all 67 former extension survivors and kills all 250 new range mutations.
