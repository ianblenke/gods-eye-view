## Context

The feature searches satellite days for a globe box. It shows pinned days and a swipe divider.
This backfill records code at commit `3a919b7`.
The change has 52 scenarios, 433 tests and 876 mutation checks.

The test declaration sweep finds 432 declarations; the path loop gives 433 tests.
The scenario heading sweep finds 52 scenarios.
The `untracedTests` entries in `openspec/trace/gaps.json` give 93 old tests.
The entries in `muts.json` and `muts3.json` give 828 and 48 mutation checks, for a total of 876.


## Goals

- Record current behavior.
- Tag old tests and add tests for reachable gaps.
- Check assertions with code mutations.

## Non-goals

- Change production code.
- Change a provider, or change a browser QA script except its `@covers` line.

## Decisions

### D1 One capability

The catalog, model, renderer, thumbnail loader, layer and panel form one capability.
The tests use fake fetch, globe and DOM objects. They do not make a network request.

### D2 Gate checks

The trace gate checks scenario tags and assertion calls. Coverage checks lines, branches and functions.
STE checks prose and tagged names. The lead runs the ratchet, gates and review.

## Related browser QA scripts

- `scripts/qa-recent-imagery.mjs` checks search, pins, compare modes, export controls, map change, share state and panel layout.
  The script also checks CCTV stability at two window sizes and measures layout shifts across transitions.
  The QA checks do not have a scenario.

## Files

This change adds the proposal, design, spec and tasks.
It changes these test files:

- `src/layers/recentImagery/catalog.test.mjs`
- `src/layers/recentImagery/index.test.mjs`
- `src/layers/recentImagery/model.test.mjs`
- `src/layers/recentImagery/rendering.test.mjs`
- `src/layers/recentImagery/thumbnails.test.mjs`
- `src/ui/recentImagery.test.mjs`

It adds `src/layers/recentImagery/testDoubles.test.mjs`.
The helper tests call the standard input handlers and the helpers that give globe values.
They also check response status codes and day cloud ranges.
The lead updates the trace ledger after the host checks.

## Host check limits

The host uses Node 26.8.2. The gate image uses Node 24.21.0.
The lead must compare the coverage results with the gate image.
The proposal lists each branch or function without a path through the current API and DOM state.
The audit checks each compound condition and loop key.
The nonpositive pin size mutation survives because later box checks reject the same input.
