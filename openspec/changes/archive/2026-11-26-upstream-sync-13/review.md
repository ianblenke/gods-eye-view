# Review: upstream-sync-13

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-26
Gates: make gates CHANGE=upstream-sync-13 passed
Rounds: 3
Scope: diff ee0b84752
Reviewed-Tree: d853ad847e565c0b82252d2d7d0e47fada3a4b6ace011daed99454a056c9dc71

## Rule 21 check

The merge commit `a3a46dc7a` has the parents `1308b509a` and `7646568a9`. `git branch -r --contains` shows that the second parent is in `upstream/main`.

Resolved files: `DATA_SOURCES.md`, `openspec/trace/upstream-test-findings.json`, `package.json`, `scripts/package-boundaries.json`, `scripts/qa-location-controls.mjs`, `scripts/qa-map-source-controls.mjs`, `scripts/qa-map-source-tray.mjs`, `src/app/controls.js`, `src/app/startView.test.mjs`, `src/camera.js`, `src/data/trafficTiming.test.mjs`, `src/i18n/locales/es.json`, `src/i18n/locales/ru.json`, `src/i18n/locales/zh-CN.json`, `src/i18n/locales/zh-Hant.json`, `src/i18n/same-as-english.json`, `src/qaAircraftViewSheetOutput.test.mjs`, `src/ui/locationControls.test.mjs`, `src/ui/views/mountApplicationViews.test.mjs`

## Findings

Round 1 gave FAIL from both reviewers. Round 2 gave PASS from the spec adversary and FAIL from the STE adversary. Round 3 gave PASS from both reviewers. The lead corrected each finding of the three rounds. The reports are in `review/`, `review/round-1/` and `review/round-2/`.

- [x] FINDING major (spec adversary, round 1) The controls did not check a rejected share code. The code now checks it, a test covers it, and the proposal records the other paths.
- [x] FINDING minor (spec adversary, round 1) The report `review/round-1/spec-adversary.md` gives the text as item F2. The lead corrected it.
- [x] FINDING minor (spec adversary, round 1) The report `review/round-1/spec-adversary.md` gives the text as item F3. The lead corrected it.
- [x] FINDING major (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S1. The lead corrected it.
- [x] FINDING major (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S2. The lead corrected it.
- [x] FINDING major (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S3. The lead corrected it.
- [x] FINDING major (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S4. The lead corrected it.
- [x] FINDING major (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S5. The lead corrected it.
- [x] FINDING major (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S6. The lead corrected it.
- [x] FINDING major (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S7. The lead corrected it.
- [x] FINDING major (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S8. The lead corrected it.
- [x] FINDING major (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S9. The lead corrected it.
- [x] FINDING minor (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S10. The lead corrected it.
- [x] FINDING minor (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S11. The lead corrected it.
- [x] FINDING minor (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S12. The lead corrected it.
- [x] FINDING minor (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S13. The lead corrected it.
- [x] FINDING minor (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S14. The lead corrected it.
- [x] FINDING minor (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S15. The lead corrected it.
- [x] FINDING minor (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S16. The lead corrected it.
- [x] FINDING minor (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S17. The lead corrected it.
- [x] FINDING minor (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S18. The lead corrected it.
- [x] FINDING minor (STE adversary, round 1) The report `review/round-1/ste-adversary.md` gives the text as item S19. The lead corrected it.
- [x] FINDING minor (spec adversary, round 2) The requirement did not say what allows an opening. It now names `openingWanted`.
- [x] FINDING major (STE adversary, round 2) The report `review/round-2/ste-adversary.md` gives the text as item S1. The lead corrected it.
- [x] FINDING major (STE adversary, round 2) The report `review/round-2/ste-adversary.md` gives the text as item S2. The lead corrected it.
- [x] FINDING major (STE adversary, round 2) The report `review/round-2/ste-adversary.md` gives the text as item S3. The lead corrected it.
- [x] FINDING minor (STE adversary, round 2) The report `review/round-2/ste-adversary.md` gives the text as item S4. The lead corrected it.
- [x] FINDING minor (STE adversary, round 2) The report `review/round-2/ste-adversary.md` gives the text as item S5. The lead corrected it.
- [x] FINDING minor (STE adversary, round 2) The report `review/round-2/ste-adversary.md` gives the text as item S6. The lead corrected it.
- [x] FINDING minor (STE adversary, round 3) The report `review/ste-adversary.md` gives the text as item S1. The lead corrected it.
