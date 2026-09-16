## Context

The class `hud-classification` and the left part of the top bar both show the same marking that is not correct. The two texts are in one template string in `_buildDOM` of `src/hud.js`. The styles are in `src/ui/styles/overlays.css`.

## Changed files

`src/hud.js`, `src/ui/styles/overlays.css`, `src/hudMarkings.test.mjs` and `openspec/ste/words.json`.

## Goals / Non-Goals

**Goals:**
- Remove each classification marking that is not correct from the HUD.
- Keep the layout of the top bar.

**Non-Goals:**
- Change the other text of the HUD, for example the mission number or the sensor number.
- Make the HUD a different design. The change `hud-variants` will do this.

## Decisions

### The left part of the top bar

The group rule for `.hud-top-bar` and `.hud-bottom-bar` has `justify-content: space-between`, and the bar has three parts. If the change removes the left part, the center part moves to the left. So the change keeps the element `hud-top-bar-left` and removes only its text.

With that rule the center part is in the middle only when the left part and the right part have the same width. The left part is now empty and the right part shows "PAGE 1/1". So the change gives the two parts `flex: 1 1 0`. The right part is now half of the free width, so the change also gives it `text-align: right` to keep its text at the right edge.

### The corner element

The element `hud-classification` shows only the marking, so the change removes the element. The change also removes its rule at `src/ui/styles/overlays.css:214`. It removes its selector line for the minimal variant at `src/ui/styles/overlays.css:353`.

### How the gates measure the requirements

The coverage gate measures coverage only for the file types `.js`, `.mjs`, `.cjs`, `.ts`, `.tsx`, `.html` and `.sh`. So `src/ui/styles/overlays.css` is not a code file for that gate. So the new test reads the HUD files as text and checks the words. It compares the text in upper case, because `#intel-hud *` has the rule `text-transform: uppercase`. See `hud-markings-001`, `hud-markings-002`, `hud-markings-003` and `hud-markings-004`.
