## Context

The layer reads WFIGS rows through a server proxy. It shows polygons and a selected incident card. InciWeb data can add a link to the card. The ledger has code gaps and 47 old tests with no tag.

## Goals

- Record the behavior of the six code files.
- Tag old tests and add tests for the code gaps.
- Check each scenario with a code mutation.

## Non-goals

- Change production code.
- Change the data feeds or the user interface.

## Decisions

### D1 One capability

The five layer files and the provider make one fire perimeter feature. The spec has one capability and 19 scenarios.

### D2 Test doubles

The tests use fake fetch functions, responses, a viewer and an overlay host. They make no network request.

### D3 Gate checks

The trace gate checks scenario tags and assertion calls. The coverage gate checks lines, branches and functions. The STE gate checks new prose and tagged names. The lead runs the ratchet, full gates and two review agents.

## Related browser QA scripts

None found.

## Files

The change adds this folder and `server/providers/firePerimeters.test.mjs`. It changes the five test files in `src/layers/perimeters/`. The lead can later update `openspec/trace/`.
