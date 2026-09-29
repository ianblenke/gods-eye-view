## Why

The wind layer has no backfill spec. The ledger records code gaps and old tests without scenario IDs. This is a backfill change for current behavior.

## What Changes

- Add the `wind` capability with 42 scenarios.
- Tag old wind tests and add tests for code gaps.
- Change four browser QA script headers to name `wind`.
- Do not change a production layer file.

## Capabilities

### New Capabilities

- `wind`: weather grid source, field data, globe display, inspection and layer life cycle.

### Modified Capabilities

None.

## Impact

The ledger has these gaps at commit `9ee5019`. The after counts come from host Node coverage. The lead will check them in the gate image.

- `fields.js`: 0 lines, 6 branches and 0 functions before; 0 lines, 0 branches and 0 functions after. `fields.test.mjs`: 5 untraced tests before; 0 after.
- `gpuRendering.js`: 0 lines, 6 branches and 1 function before; 0 lines, 0 branches and 0 functions after. `gpuRendering.test.mjs`: 7 untraced tests before; 0 after.
- `index.js`: 15 lines, 19 branches and 5 functions before; 0 lines, 1 branch and 0 functions after. `index.test.mjs`: 14 untraced tests before; 0 after.
- `inspection.js`: 0 lines, 9 branches and 0 functions before; 0 lines, 0 branches and 0 functions after. `inspection.test.mjs`: 3 untraced tests before; 0 after.
- `model.js`: 0 lines, 0 branches and 0 functions before; 0 lines, 0 branches and 0 functions after. `model.test.mjs`: 3 untraced tests before; 0 after.
- `presentation.js`: 0 lines, 2 branches and 0 functions before; 0 lines, 0 branches and 0 functions after. `presentation.test.mjs`: 1 untraced test before; 0 after.
- `relief.js`: 4 lines, 2 branches and 0 functions before; 0 lines, 0 branches and 0 functions after. `relief.test.mjs`: 4 untraced tests before; 1 after.
- `rendering.js`: 25 lines, 48 branches and 2 functions before; 0 lines, 1 branch and 0 functions after. `rendering.test.mjs`: 36 untraced tests before; 0 after.
- `source.js`: 0 lines, 3 branches and 1 function before; 0 lines, 0 branches and 0 functions after. `source.test.mjs`: 8 untraced tests before; 0 after.
- `streamlines.js`: 0 lines, 8 branches and 0 functions before; 0 lines, 1 branch and 0 functions after. `streamlines.test.mjs`: 5 untraced tests before; 0 after.

The ten test files have 86 untraced tests before and one after. This change opens no new gap. The lead will record closed gaps with the ratchet command.

## Known limits and later changes

- The host Node version can give counts that differ from the gate image. The lead will check final counts.
- One old relief test has the banned word `prior`. It keeps its name and has no scenario tag.
- The branch total of `rendering.js` can change between V8 runs. The branch at line 515 cannot run.
- `index.js` line 177 has code that runs after the catch. Each path returns before this point.
- `streamlines.js` line 31 checks a middle latitude above 88.5 degrees. Seed latitude stays below 88 degrees, and a half step adds at most 0.375 degrees.
- `rendering.js` line 515 checks for old listeners on attach. Only `start` calls `attach`, and `stop` clears listeners before the next `start`.
- The four browser QA scripts get only a change to `@covers`. The scripts do not run in this change.
- Known limit `wind-old-test-names`: five old test names keep words this review would replace, in `index.test.mjs`, `rendering.test.mjs`, `relief.test.mjs` and `gpuRendering.test.mjs`. The rule of the owner is that an old test name does not change. New prose for the same scenarios uses the replacement words instead.
- Known limit `wind-old-test-subjects`: many old test names start with a subject, such as "wind source" or "GPU owner", instead of a plain description. This style choice predates this change in most of the ten wind files. A rename to fix it alone is out of scope here.
- Known limit `wind-tag-or-add`: each task in section 2 says "Tag or add tests for wind-XXX." These words already appear in the merged change `backfill-perimeters`. A stricter rule would split it into two steps. But each scenario needs only the action that applies, so "and" would overstate most tasks.
