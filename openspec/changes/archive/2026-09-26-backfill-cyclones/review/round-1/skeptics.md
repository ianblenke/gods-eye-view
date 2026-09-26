# How the lead handled the findings of round 1

Round 1 gave FAIL from both agents. Both agents ran as read-only `codex` runs with the model `gpt-6-sol`. The spec adversary gave F1 (critical), F2 and F3 (major), and F4 and F5 (minor). The STE adversary gave F1 to F3 (major) and F4 to F15 (minor). The lead checked each finding against the tree at commit `59d046c`.

## Spec adversary

- F1 critical: correct. The code tests `Math.abs(...) < 1`, so a hit exactly 1 px away does not serve the click. Scenario `cyclones-024` now says "less than 1 px from the click on each axis".
- F2 major: correct in its result. The first worker had changed the word "prior" to "earlier" in the name of one old test, because the full gates give the error `STE-WORD` for that word in a tagged name. The lead put the old word back and the full gates then gave that error. The rule of the owner does not allow a rename, so the lead removed the tag from that one old test (known limit `cyclones-untagged-old-test`). The ratchet keeps one untraced test name for it. The lead also compared all 32 old names with `origin/main` after removing the tags: all 32 are the same.
- F3 major: the three files (`lifecycle.js`, `wind/rendering.js`, `worldOverlay.js`) are not edited by this change, and no test of this change closes their gaps. The ratchet command writes the count that it measures, and these counts change between runs (see `sync-counts-change-between-runs` in `upstream-sync`). The lead did not edit the ledger by hand. The proposal names the three files and the values in the known limit `cyclones-ratchet-noise`. The file `labelArbiter.js`, which the first ratchet run also wrote, did not change in the last run.
- F4 minor: not a defect. The gate output had only the error `REVIEW-MISSING`, and that error is the reason for the review.
- F5 minor: the STE warnings in the prose are corrected. The warnings for the 32 old test names stay, and the known limit `cyclones-old-test-names` says why.

## STE adversary

- F1 major: corrected in the proposal ("adds tests for each line, branch and function that a test can reach").
- F2 and F3 major: corrected with F2 of the spec adversary. The proposal and the design no longer mention a changed word.
- F4, F5, F7 and F8 minor: corrected in the design, the proposal and the tasks.
- F6 minor: corrected. In each task, the tag of the old tests is now a sub-line, and the task has one instruction.
- F9 to F14 minor: these are old test names, and they exist on `origin/main`. Only the tag was added. The owner does not allow a change of an old name, so they stay. Known limit `cyclones-old-test-names`.
- F15 minor: correct. The name was new, and it is now "after clear, a selection change leaves the removed center as it was".
