## Context

The merged `osh-control` design gives each command field a browser input. A command field of type `boolean` gets a `<select>`. `view.js` set the `<select>`'s `.value` to `'false'`, but it never added `<option>` elements.

A real browser ignores a `.value` write on a `<select>` with no options. The select stayed empty. Commit `924adb3` fixes the fault on `main`. This change adds the missing scenario and its own dedicated test.

## Goals / Non-Goals

**Goals:**

- State the scenario that the fault broke: a command field of type `boolean` MUST let the owner select `true` or `false`.
- Add one test for the real fact that the old test fixture missed. The rendered `<select>` must have an `<option>` for each value, and a test can check this.

**Non-Goals:**

- This change does not change `view.js`. The fix already merged.
- This change does not change the fake `documentImpl` of the test file. The new test reads the same `children` array the fake already tracks.

## Decisions

### D1 A new requirement, not a new scenario of "Confirmation step"

"Confirmation step" already has `Origin: spec-first` for its own two scenarios (`osh-control-016`, `osh-control-017`). Neither is a backfill. A new scenario about field controls needs `Origin: backfill`, so this change adds a separate requirement, "Command field controls", with its own origin line.

### D2 A new, dedicated test

One existing test already checks the rendered `<option>` values, added by the fast fix. That test keeps its own scenario ID, from before this change. This change adds one small, separate test, tagged `[osh-control-036]`, for direct evidence of the new scenario.

## Risks / Trade-offs

1. **Two tests check almost the same fact.** Mitigation: this is a one-line duplication (`select.children` values), and it keeps the "do not rename a carried test" rule intact.

## How the gates measure this change

Coverage: `src/layers/oshControl/view.js` already has full line, branch and function coverage; this change adds no line to it.

Trace: the new scenario `osh-control-036` needs a passing test with an assertion. The new test in `view.test.mjs` gives it one.
