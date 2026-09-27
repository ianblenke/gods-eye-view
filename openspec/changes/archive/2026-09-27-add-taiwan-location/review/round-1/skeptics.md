# How the lead handled the findings of round 1

Round 1 read the whole change. Both agents ran as read-only `codex` runs with the model `gpt-6-sol`. Both gave FAIL. The spec adversary gave F1 (critical) and F2 (minor). The STE adversary gave F1 and F2 (major) and F3 (minor). The lead checked each finding against the tree at commit `9979384`.

## Spec adversary

- F1 critical: correct. The flight test called `flyToPresetLocation` directly, and the pill test used an empty click handler, so no test showed that a click on the Taiwan pill starts the flight. The lead added a second test for scenario `location-presets-004` in `src/ui/locationControls.test.mjs`. It clicks the Taiwan pill, checks that the handler got the id `taiwan`, and checks the range, the pitch, the heading and the target of the flight. The mutation `004-click-id` (the pill passes `austin`) fails it.
- F2 minor: not a defect. The error `REVIEW-MISSING` is the reason for the review.

## STE adversary

- F1 major: correct. The design said that no QA line was available, and the gate prints a QA line. The design now says that the gate reports that no QA script covers this change.
- F2 major: correct. The requirement of scenario `location-presets-005` now says "answer a search for the city name or id".
- F3 minor: corrected in `design.md` ("Keep Taiwan search results inside the preset view bounds").
