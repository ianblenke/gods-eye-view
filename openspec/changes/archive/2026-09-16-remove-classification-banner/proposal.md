## Why

The HUD shows the text "TOP SECRET // SI-TK // NOFORN" in two places. God's Eye View is a public program that shows open data: aircraft, ships, satellites, fires, traffic, cameras and radio. The text is a classification marking of the United States government. The program has no classified part, so the marking is not correct.

A marking that is not correct causes two problems. A user can think that the data has a classification. A person who knows the markings can think that the program is a copy of a classified system.

## What Changes

- Remove the marking "TOP SECRET // SI-TK // NOFORN" from the top bar of the HUD.
- Remove the element `hud-classification` from the top left corner of the HUD.
- Keep the three parts of the top bar. Give the left part and the right part the same width, so the center part stays in the middle.
- Keep the text of the right part at the right edge.
- Remove the rule `.hud-classification` and its one selector line for the minimal variant from `src/ui/styles/overlays.css`.

## Capabilities

### New Capabilities
- `hud-markings`: the markings that the HUD shows to the user.

## Impact

- Changed files: `src/hud.js`, `src/ui/styles/overlays.css`, `openspec/ste/words.json` and the new test `src/hudMarkings.test.mjs`.
- The code of the server and the providers stays the same.
- Gaps that this change opens: none. The change removes six lines of `src/hud.js` and adds five lines. The new lines are four comment lines and an element with no text. The ledger entry goes from 293 to 292 lines.
- Gaps that this change closes: none. The file `src/hud.js` keeps its ledger entry, and the new test reads the file as text.

## Known limits and later changes

- `hud-markings-text-only`: The new test reads the HUD files as text. It does not build the HUD in a browser, so it does not show what the user sees.
- `hud-markings-word-list`: The test has a list of the markings. A new marking with another word does not stop the build.
- `hud-markings-file-scope`: The test reads a list of seven HUD files. A marking in another file does not stop the build.
- `hud-markings-width-not-measured`: The test reads the CSS rules as text. No test measures the position of the center part or of the text of the right part in a browser.
