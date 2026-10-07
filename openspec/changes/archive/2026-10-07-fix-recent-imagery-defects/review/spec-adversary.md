Verdict: PASS

Tree: `/home/ianblenke/docker/gev-work/fix-ri`, commit 2d498e405645176213c318988ae2626533f9e146, as you named it. I can only read files. I did not confirm HEAD, run tests, mutations or gates, or see raw gate output. I read `.git/index` to check tracking.

Verified by reading:
- **Round-2 minors 1 to 4 and 6 are closed.** The 050 tag is on the tests at lines 1409 and 2460.
  - Each `old` string of rows 27 to 29 occurs once (`src/ui/recentImagery.js` lines 108, 116, 117 and 282).
  - Row 27 is killed only by test 2460. `r2-content-probe.log` shows scrollTop 20 and requests `[20]` where the test expects 10 and `[]`.
  - Rows 28 and 29 are killed by the card-inside test. Without the clamp the write is -30. With `if (true)` the spy records a write of 40. Both give a different result from `[]`.
  - Row 26 uses card top -10, so NaN cannot hide the mutant. The three 055 AND lines match their tests.
  - `qa-details-scroll` is true: the QA script opens DETAILS at lines 1388-1390 and then sets its own scrollTop at line 1403.
- **The NaN sentence is true.** `coversBox` is `!== 'partial'`, and no other recentImagery code reads full or partial. `r2-base-probe.log` gives partial, full, partial. The old code never returned unknown for a ring of three or more points.
- **Mutation rows.** `mutations-final.log` lists all 29 rows and ends with `SURVIVORS: []`. I found no compound operand of the new code that lacks a row, except finding 3.
- **Coverage and scope.** No production file is in the round diff. `r2-single-counts.log` gives gaps of 2, 1, 2 and 2, which match the ledger.
- **Tracking.** The 20 logs and `muts.json` are in `.git/index`. They are force-added, because `.gitignore:11` ignores `*.log`.
- **QA purpose.** The purpose of `scripts/qa-recent-imagery.mjs` has no conflict with 050 or 055.

Findings:
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/evidence.md:390 The text cites logs that are not in `evidence/`: `red-*` (:11), `cont-final-*` (:30), `r1-final-<test file>` (:146) and `r2-final-*` (:263). Line 390 says "The probe sources also exist in `evidence/` as text files", which is false: the folder holds 20 logs and `muts.json`, and no probe source. My round-2 minor 5 named `r1-final-*`, and task 5.7 is checked but not complete. Correct it by force-adding the files from `/home/ianblenke/docker/gev-tools/fix-ri/evidence-extra` (probe sources as `.txt`). Or delete those sentences and reword task 5.7.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/evidence.md:227 "The base returns unknown coverage" is false if "base" means 81b8bd6, as it does elsewhere in this file. Row `056-every` restores the old filter, and the absent-point test kills it. So the old code does not return unknown for that ring. Write "The current code returns unknown coverage."
- [ ] FINDING minor src/ui/recentImagery.js:112 The operands `(scroller.clientTop || 0)` (line 112) and `(scroller.scrollTop || 0)` (line 117) have no row and no test. Every test that reaches them sets clientTop to 0 or 2, and the fake scrollTop starts at 0. So removing either `|| 0` survives, and so do `card?.` and `scroller?.`. Correct it with a test that deletes clientTop, uses card top -10 and scrollTop 40, and expects 30. Or accept the limit by name.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/proposal.md:56 `ledger-count-noise` names only `upstream-sync`. `history.jsonl:2021-2022` records the same ais-store values under `backfill-director-timing`, and :2023-2024 records them under this change. Add that name, or write "under other changes".

I found no critical or major finding.
