## Why

The change `upstream-sync-6` marks an `aria-label` attribute in `src/ui/templates/context.html` for translation, because the upstream text check needs the mark.
The ratchet of that change then stops with COVERAGE-DIFF for that line of markup.
The diff coverage gate asks covered line data for each changed line of a code file, and an HTML file has no line data.
The scenario `coverage-gate-012` records an HTML file without inline scripts as complete. So the two rules do not agree, and the gate stops the build when a person adds or edits a line of markup.
The owner decided on 2026-10-18 to correct the gate before the sync continues.

## What Changes

- Add the function `htmlCodeLines()` to `scripts/spec/lib/coverage.mjs`. It gives the code lines of an HTML file.
- A script element without a src attribute gives the lines of its start tag and the lines of its text that are not blank.
- A script element with a src attribute gives its start tag lines when that tag has an event handler attribute or a `javascript:` URL.
- Each line of an event handler attribute and its value is a code line. So is each line of a `javascript:` URL.
- In `syncChangedLines()` of `scripts/spec/lib/ownership.mjs`, keep only the code lines of each HTML file before the gate counts the changed lines.
- Add the scenario `ownership-056` to the requirement "Diff coverage". The requirement text and the scenario `ownership-007` stay as they are.
- Add the HTML rule to the Purpose of `openspec/specs/ownership/spec.md`, to rule 5 of `AGENTS.md` and to `openspec/config.yaml`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ownership`: The diff coverage gate asks coverage only for the code lines of an HTML file.

## Impact

The change edits `scripts/spec/lib/coverage.mjs`, `scripts/spec/lib/ownership.mjs`, `src/tooling/spec/coverage.test.mjs` and `src/tooling/spec/ownership.test.mjs`. `openspec/ownership.json` lists all four paths: the folder `scripts/spec/` and the two test files by name.
It also edits `AGENTS.md`, `openspec/config.yaml` and the Purpose of `openspec/specs/ownership/spec.md`.

An added or edited line of markup in an HTML file no longer needs coverage. An added or edited code line of an HTML file still needs coverage, and an HTML file cannot give it. The gate rules for other files do not change.
The change adds no dependency and no route.

## Known limits and later changes

- Known limit `same-patterns`: `htmlCodeLines()` uses the patterns of `inlineScriptLines()`. So a text such as ` onload=` in visible text or in a comment also makes a code line, as it also counts in the measure.
- Known limit `unclosed-start-tag`: A start tag with no end tag can be in an HTML comment, for example. The script element pattern of both functions joins it to the end tag of the next script element. When that start tag has a src attribute, neither function sees the code between them. Without a src attribute, both functions count each line between them that is not blank as script code.
- Known limit `deleted-src-line`: A change can delete only the line with the src attribute of a start tag on more than one line. The diff then has no added or edited line, so the text of that element becomes code with no COVERAGE-DIFF. Only the ledger count of an upstream file can stop it.
- Known limit `gt-in-value`: A `>` in a quoted value of a script start tag ends the attributes that both functions read. Then a handler attribute after that `>` gives no code line.
- Known limit `no-template-engine`: The function reads HTML as text. It does not know the template markers of `build/application-html.js`.
