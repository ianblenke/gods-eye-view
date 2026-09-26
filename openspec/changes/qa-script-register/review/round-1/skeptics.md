# How the lead handled the findings of round 1

Round 1 read the whole change. Both agents ran as read-only `codex` runs with the model `gpt-6-sol`. The spec adversary gave PASS with F1 to F3 (minor). The STE adversary gave FAIL with F1 (major) and F2 to F6 (minor). The lead checked each finding against the tree at commit `4b9dee6`.

## Spec adversary

- F1 minor: correct. `qaAdvice` reads each entry of the `specs` folder of a change as a capability name, and a file there gives a false name. The names of real deltas are folders, so the input is unusual. Named as the known limit `qa-advice-delta-files`.
- F2 minor: the lead corrected the warnings that the STE adversary named. The other warnings come from old files that this change does not edit.
- F3 minor: not a defect. The error `REVIEW-MISSING` is the reason for the review.

## STE adversary

- F1 major: correct. The name of the test of `qa-scripts-025` said that the gate omits headers, and the spec says that it omits scripts. The new name is "stops for both covers errors and omits scripts with valid QA headers". The list in the guard test `coverage-gate-046` has the new name.
- F2 minor: corrected in D1 of the design.
- F3 minor: corrected. Tasks 5.1 and 5.2 each have one instruction, and the second instruction is a sub-line.
- F4 minor: corrected in the header of `scripts/qa-draw-tool.mjs` and in the table of the design.
- F5 minor: corrected. The 62 headers say "an app server that runs" in `@needs`.
- F6 minor: corrected. The title of scenario `qa-scripts-010`, the name of its test, task 2.10 and the prose of D2 now say "a pending area that has a capability folder". The error code `QA-COVERS-LANDED` keeps its name.
