# How the lead handled the findings of round 2

Round 2 read the diff since the commit `e51a2df` of round 1. Both agents ran as read-only `codex` runs with the model `gpt-6-sol`. The spec adversary gave PASS with F1 (minor). The STE adversary gave FAIL with F1 and F2 (major).

## Round 1 in short

The spec adversary asked for a test of the call of `startApplicationView` in `src/app/controls.js`. The lead first changed `controls.js` so that a test could import it. The ratchet command then stopped with `LEDGER-NO-BASELINE` (a file cannot change and load for the first time in one change) and with `LEDGER-LARGER-GAP` for `src/standalone/controls.js`. The lead went back to the first design, stated the scenarios as the behavior of `startApplicationView`, and named the untested call as the known limit `controls-call-untested`. The text of `round-1/skeptics.md` about the changed `controls.js` describes the first try only.

## Spec adversary

- F1 minor: not a defect. The error `REVIEW-MISSING` is the reason for the review.

## STE adversary

- F1 and F2 major: correct. The sentences of the known limit `controls-call-untested` had two possible meanings. The lead rewrote the limit with the wording of the adversary, after the round. Round 3 confirms the change.
