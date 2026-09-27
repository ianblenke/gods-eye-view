# How the lead handled the findings of round 1

Round 1 read the whole change. Both agents ran as read-only `codex` runs with the model `gpt-6-sol`. Both gave FAIL. The spec adversary gave F1 and F2 (critical) and F3 and F4 (minor). The STE adversary gave F1 (major) and F2 to F5 (minor). The lead checked each finding against the tree at commit `e51a2df`.

## Spec adversary

- F1 critical and F2 critical: correct. No test ran the call of `startApplicationView` in `src/app/controls.js`, and the tests of scenario `startup-view-001` did not show that the application calls `flyToStartView`. `controls.js` could not be imported by a test on Node 26, because its static import of `StyleManager` loads the package `mgrs`, which fails there. The lead had a worker change `controls.js`: `Controls` is now a required parameter, and the cloud effects can be given as a parameter (`initCloudEffects`). `src/standalone/controls.js` imports `StyleManager` and passes it. The tests of scenarios 001, 004 and 005 now call the real `createApplicationControls` with fakes, and check the flight, the texts and the stop function. New mutations `001-app-call`, `004-app-share`, `005-app-loader` and `005-app-defer` fail them.
- F3 minor: corrected in the proposal.
- F4 minor: not a defect. The error `REVIEW-MISSING` is the reason for the review.

## STE adversary

- F1 major: corrected in the proposal ("The ratchet reports different coverage totals for `src/data/labelArbiter.js` in different runs.").
- F2 to F5 minor: corrected in the proposal, the design, the tasks and the name of the test of scenario `startup-view-003` ("destroyed viewer").
