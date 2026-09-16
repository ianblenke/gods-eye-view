All four corrections verified against the spec texts, the test and the gate output.

**Round-3 findings — closed.**
- **F1 (spec adversary) closed.** `openspec/specs/hud-markings/spec.md:8` and the delta at `:4` now end the requirement with `The open marking "UNCLASSIFIED" is the only exception.`, and the Purpose at `:4` names the same exception, so the requirement no longer forbids what `hud-markings-001` allows. The AND line (published `:13`, delta `:9`) now reads "the two letters before "CLASSIFIED" are not "UN"", which matches `src/hudMarkings.test.mjs:11` letter for letter: `(?<!UN)CLASSIFIED` stops the build for "DECLASSIFIED" ("DE" is not "UN") and passes "UNCLASSIFIED", exactly as the line now states.
- **STE S1 closed** by the same AND line.
- **STE S2 closed.** The last AND line of `hud-markings-003` (published `:35`, delta `:31`) now names `src/ui/styles/overlays.css` and `text-align: right` for the right part; `src/hudMarkings.test.mjs:41-43` reads that file, matches the standalone rule at `overlays.css:163-165` (the `\n\n` guard skips the grouped selector at `:157-161`) and asserts `text-align: right;`. No other rule for `.hud-top-bar-right` exists in any file, so the tested rule is the one that applies.
- **STE S3 closed.** `proposal.md:12` has "Keep the text of the right part at the right." and `tasks.md:10` has task 1.8; the four test tasks 1.1-1.4 still come before the code tasks 1.5-1.8, so the `Origin: spec-first` ordering holds.

No text is made wrong by the corrections: the published spec and the delta agree line for line, `design.md:25` already explained the `text-align: right` decision, the known limits `hud-markings-text-only` and `hud-markings-width-not-measured` cover the still-text-only check of the new AND line, and `openspec/ste/words.json` needs no entry (STE reports 0 errors, 0 warnings). The gate output's only error is the expected `REVIEW-MISSING`; the `MaxListenersExceededWarning` appears in the round-1 through round-3 output as well and does not come from this change.

```
Verdict: PASS
Findings: none
```
