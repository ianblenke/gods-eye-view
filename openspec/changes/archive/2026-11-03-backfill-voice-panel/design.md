## Context

This change reads commit `89fe216472d408b6ac9a0d9b53f65ef20434d917` on branch `backfill-voice-panel`.
The purpose follows the voice panel text in `docs/CURRENT-STATE.md` and the history for `src/voice/panel/`.

## Decisions

Write the delta before the tests.
Use local clocks, custom native objects and the panel DOM fixture.
Compare results with literal values.
Check both presence and absence of optional fields.

The mutation helper restores production bytes after each case.
The audit lists each decision expression and key loop.
The host coverage report gives no calibrated gate verdict.

## Files

The scope includes `actionObserver.js`, `host.js`, `inactivity.js`, `manualPanel.js`, `nativeActivity.js`, `preferences.js` and `testDom.mjs` under `src/voice/panel/`.
Tests in that directory and this change folder hold all persistent edits.
The helper keeps its source bytes.

## Known limits

The final evidence names each old title that cannot receive a scenario tag.
The import sweep includes tests outside the panel directory; this change keeps those tests unchanged.
Browser geometry, live microphone input, provider auth and tool choice need the separate QA checks.

## Gates and review

The host runs the scope tests, coverage checks, mutation checks, format checks and STE lint.
The lead runs the ratchet and final gates in the calibrated container.
The lead gets both formal reviews before the merge.

## Known limit `voice-panel-old-titles`

The word list rejects the old titles in `old-untagged.json`.
The owner forbids a title change.
These tests keep their names without tags.
The measurement command checks every old name against the source ledger.

## Known limit `voice-panel-reentrant-teardown`

At `src/voice/panel/host.js:300`, a card callback can mount a successor during host teardown.
The host sets its disposed flag after that callback.
The successor keeps its listeners and its inactivity model.
Its operations report false for `isCurrent`.
The probe destroys that successor after the check.
No scenario states this behavior.

## Known limit `voice-panel-custom-source-notice`

At `src/voice/panel/preferences.js:141`, a custom source can call its saved listener after disposal.
The binder ignores the new render but still calls its change callback.
The standard model removes that listener during disposal.
No scenario states this behavior.

## Known limit `voice-panel-untracked-delta`

At `src/voice/panel/nativeActivity.js:178`, an audio delta without a response record leaves the initial output knowledge unchanged.
The probe observes this result with a custom native object.
No scenario states this behavior.

## Known limit `voice-panel-source-getter`

The binder reads a custom source more than once during a render.
A custom getter can supply different values for those accesses.
The audit uses that source to distinguish the zero branch from the earlier text value.
No scenario states this behavior.

## Known limit `voice-panel-symbol-accessor`

At `src/voice/panel/actionObserver.js:78`, the descriptor value list excludes symbol keys.
The observer can clone options with a symbol accessor.
The clone keeps that accessor descriptor.
No scenario states this behavior.

## Known limit `voice-panel-method-origin`

At `src/voice/panel/nativeActivity.js:118`, cleanup restores an inherited method as an own property.
The function stays the same, but the property becomes enumerable.
No scenario states this behavior.

## Host coverage limits

The host reaches every line, branch and function in each scope module.
No source line or branch needs an unreachable exception.
The evidence gives the host command for each file.
The calibrated gate result remains a task for the lead.

## Format scope

The scoped formatter writes only the panel test files.
The broad read-only check checks the repository format scope.
The evidence records the final output.

## Purpose at archive time

Describe how the voice panel shows Preview and Voice Settings, stores local preferences, and uses local activity to stop a quiet session.

## Known limit `voice-panel-card-teardown`

Source commit: `74ec10e054a88935c7fcfce96300ea660f7c7747`.
At `src/voice/panel/manualPanel.js:177`, destroy calls sync before it sets disposed.
A card callback can select Preview or Settings during that sync.
The panel and selected pane then stay visible after destroy.

The disposed snapshot reports false for panelOpen, settingsOpen and previewVisible.
The scratch probe checks both DOM panes and snapshot flags for each view.
Scenario `voice-panel-017` excludes this callback case.
No scenario states this behavior.
