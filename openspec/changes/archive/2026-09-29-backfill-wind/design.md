## Context

The wind layer reads a weather grid and shows particles and scalar fields on a globe. The ledger records code gaps and old tests without tags.

## Goals

- Record current wind behavior in one capability.
- Tag the old tests and add tests for reachable gaps.
- Check scenario assertions with code mutations.

## Non-goals

- Change production code.
- Change provider data or browser controls.

## Decisions

### D1 One capability

The ten wind files form one globe wind feature. The spec groups 42 scenarios by file and behavior.

### D2 Test doubles

Unit tests use fake network, browser, globe and GPU objects. They make no network request.

### D3 Gate checks

The trace gate checks tags and assertion calls. Coverage checks lines, branches and functions. STE checks prose and tagged names. The lead runs the ratchet, gates and review.

## Related browser QA scripts

- `scripts/qa-wind-canvas.mjs` checks visible wind pixels on a real canvas.
- `scripts/qa-weather-perf.mjs` measures frame cost with wind on and with other weather layers.
- `scripts/qa-weather-teardown.mjs` checks that wind state and resources clear after use.
- `scripts/qa-weather-journey.mjs` checks wind controls, field and model changes, and scene health.

## Files

This change adds four OpenSpec files, changes ten wind test files and changes four QA script headers. The lead can later update `openspec/trace/`.
