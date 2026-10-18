## Why

The change `upstream-sync-6` marks an `aria-label` attribute in `src/ui/templates/context.html` for translation, because the upstream text check needs the mark.
The ratchet of that change then stops with COVERAGE-DIFF for that line of markup.
The diff coverage gate asks covered line data for each changed line of a code file, and an HTML file has no line data.
The scenario `coverage-gate-012` records an HTML file without inline scripts as complete. So the two rules do not agree for a line of markup, and no change can edit an HTML template.
The owner decided on 2026-10-18 to correct the gate before the sync continues.

## What Changes

- Add the function `htmlCodeLines()` to `scripts/spec/lib/coverage.mjs`. It gives the code lines of an HTML file. A line of code in a script element without a src attribute is a code line. Each line of an event handler attribute and its value is a code line too. So is each line of a `javascript:` URL, up to the first quote or `>` after it.
- In `syncChangedLines()` of `scripts/spec/lib/ownership.mjs`, keep only the code lines of each HTML file before the gate counts the changed lines.
- Add the scenario `ownership-056` to the requirement "Diff coverage". The requirement text and the scenario `ownership-007` stay as they are.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ownership`: The diff coverage gate asks coverage only for the code lines of an HTML file.

## Impact

The change edits `scripts/spec/lib/coverage.mjs`, `scripts/spec/lib/ownership.mjs`, `src/tooling/spec/coverage.test.mjs` and `src/tooling/spec/ownership.test.mjs`. `openspec/ownership.json` lists all four paths, through the folders `scripts/spec/` and `src/tooling/spec/`.
A changed line of markup in an HTML file no longer needs coverage. A changed line of inline script, event handler or `javascript:` URL still needs coverage, and an HTML file cannot give it. The gate rules for other files do not change.
The change adds no dependency and no route.

## Known limits and later changes

- Known limit `same-patterns`: `htmlCodeLines()` uses the patterns of `inlineScriptLines()`. So a text such as ` onload=` in visible text or in a comment also makes a code line, as it also counts in the measure.
- Known limit `no-template-engine`: The function reads HTML as text. It does not know the template markers of `build/application-html.js`.
