## Why

The command view showed an empty `select` for every boolean command field. The view never wrote `<option>` values into the `<select>` it built. A person was not able to choose `true` or `false` for `rtl`, `disarm`, `Resume`, `returnToStart` or `EnableLocationControl`. Five of the eight table commands were not usable in a real browser.

The fault reached `main`, because the test fixture's fake `<select>` accepts a `.value` write with no options present. No test caught the fault. An owner reported it, and a fix already merged as a fast fix, outside the spec-first process, because a drone was in flight. This change writes the missing spec scenario and runs the normal two-agent review of that fix.

This change's name adds `-options` to the `backfill-<capability>` form. `osh-control` already has many `Origin: spec-first` requirements. A bare name `backfill-osh-control` could wrongly suggest this change backfills the whole capability, when it backfills one narrow fact about one field type.

## What Changes

- Adds one scenario that states the command view MUST let the owner select `true` or `false` for a command field of type `boolean`.
- Adds no code. The code fix merged already, on `main` at commit `924adb3`. This change gives that fix a scenario ID, a dedicated test for the new scenario ID, and a review.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `osh-control`: adds one requirement, "Command field controls", for a command field of type `boolean`. Origin: backfill.

## Impact

- Closes no coverage gap. `src/layers/oshControl/view.js` already has full line, branch and function coverage.
- Adds the scenario ID `osh-control-036` to `openspec/specs/osh-control/spec.md` and one new, dedicated test `[osh-control-036]` in `src/layers/oshControl/view.test.mjs`. The fast fix's own assertion stays tagged `[osh-control-016]`, its own scenario ID from before this change, unchanged.
