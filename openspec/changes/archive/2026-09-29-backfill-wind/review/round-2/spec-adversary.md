# spec-adversary — backfill-wind — Round 2 (scope: diff ccb3e40)

Read at commit 534b4e1 (branch backfill-wind, repo /home/ianblenke/docker/gev-work/wind). Scope: diff since ccb3e40 (the round-1 checkpoint), per assignment. Files re-read in full: src/layers/wind/rendering.js, src/layers/wind/rendering.test.mjs (whole file, to trace the diff in context), openspec/changes/archive/2026-09-29-backfill-wind/proposal.md, .../specs/wind/spec.md, .../tasks.md, openspec/specs/wind/spec.md, openspec/trace/gaps.json (wind + labelArbiter.js entries), openspec/trace/history.jsonl (lines 1609-1636), openspec/trace/ids.json and openspec/trace/links.json (wind-025/wind-033 entries), plus the round-1 spec-adversary.md/ste-adversary.md checkpoints for context.

Verdict: PASS

### F1 (round-1 major finding) — resolved

sameWind() (src/layers/wind/rendering.js:25-42) compares 16 keys across four loops (3 top-level, 5 cycle, 6 grid, 2 arrays). I hand-traced all 8 new [wind-033] cases (units, forecastHour, date, hour, gridWidth→nx, gridHeight→ny, gridTop→la1, gridRowSpacing→dy) against the original fixture object at rendering.test.mjs:954-964. In every case the named key is the only value that differs between the two setField calls — all other compared keys stay identical (same primitives or, for grid/u/v, the same underlying object/array references where unchanged). Since builds only increments on the second call when sameWind returns false, and reuseGeometry requires gpuActive (already true from the first call) plus sameWind(...) true, a mutation dropping or misassigning the comparison for any one of these 8 keys would make the second setField wrongly reuse geometry, holding builds at 1 and failing assert.equal(builds, 2). Combined with the pre-existing 8 cases (model, level, cycle→runIso, validTime→validIso, grid→lo1, spacing→dx, revisedU, revisedV), all 16 keys sameWind compares are now individually load-bearing. openspec/trace/links.json:2675-2691 confirms all 17 [wind-033]-tagged tests (16 loop cases + the separate "rejects an absent vector" test) are linked.

### F2 (round-1 minor finding) — resolved

checkCamera() (rendering.js:154-173) compares an 8-element signature. The new parametrized [wind-025] loop (rendering.test.mjs:377-405) adds position.y, position.z, pitch, roll — exactly the four keys F2 named as untested. I traced each: apply(h) mutates only the named field on the shared camera/positionWC object; nothing else in the harness changes cssWidth/cssHeight or triggers resize()'s own dimension check, so changed = resized || checkCamera(...) depends solely on checkCamera detecting the mutated index. painted is captured after setOptions({paused: true}) (which itself already triggers one static paint), so the subsequent preRender.emit() only produces additional strokes if checkCamera reports a change — a dropped comparison for any of the four keys would leave h.strokes.length === painted, failing assert.ok(...). This reuses the same mechanism as the pre-existing, already-accepted heading case in the "pause keeps a static field..." test (rendering.test.mjs:348-375), so the tagging convention itself is not new to this round.

### Wording fixes (S1, S2, S4, S5, S6) — no meaning change

Checked each against openspec/specs/wind/spec.md (canonical) and the archived delta, and against the code they describe:
- S1 (wind-014, line 72): "...until the person dismisses it or disables inspection" — same logic as the original "dismissal or disable," just disambiguated; no scenario-logic change.
- S2 (wind-032, line 164): "...until the layer clears it" — matches that rendering.js's clear() is invoked by the owning layer, not internally; accurate, not a meaning change.
- S4 (wind-022, line 118): "Adjust relief for terrain and viewer" — word swap only (Adapt→Adjust).
- S5 (wind-031, lines 158-160): "Report that the GPU is ready" / "...reports once that it is ready" — matches the code's ready flag (rendering.js:451), not "readiness."
- S6 (wind-024/wind-028, lines 132/148): "does not draw hidden paths" / "does not draw a long stroke" — logically equivalent to "omits," no behavior change.

None of these introduce a new claim about behavior; each is a same-meaning reword.

### Ledger check — one process note, not a defect in this change

openspec/trace/history.jsonl:1635-1636 (both dated 2026-09-29, both naming backfill-wind, commit ccb3e40122620f32802eafb77910a49c20d9d217) record src/data/labelArbiter.js branches going from 52→50 not-covered ("smaller"/improvement), total branches 407→405. This file is untouched by backfill-wind's diff. openspec/trace/gaps.json:2569-2581 shows the current entry matches (branches: 50). Checking history.jsonl further back, this exact 50↔52 oscillation for labelArbiter.js recurs across multiple unrelated past changes (e.g. lines 2, 193-194, 480-483, all from establish-spec-governance/simplify-ledger in September), confirming this is the known whole-project trace-flakiness pattern, not something backfill-wind caused. The delta (2) is well inside the 8-count tolerance (gap-ledger spec's "Count tolerance" requirement, openspec/specs/gap-ledger/spec.md:263-283, total ≥200 ⇒ tolerance 8), it is an improvement not a regression, and it doesn't hide a gap. Recording as a minor/process finding rather than a spec defect:

- [ ] F3 minor openspec/trace/history.jsonl:1635-1636 The round-2 ratchet run picked up an unrelated src/data/labelArbiter.js branch-count drift (52→50, within the 8-count tolerance) from the known whole-project trace-flakiness pattern this file has shown before. Not a defect in backfill-wind; no action needed beyond noting it as a known limit if this recurs.

### tasks.md checkboxes

3.1 and 3.2 are checked, 3.3/3.4 remain unchecked, matching the report that ratchet/gates ran and review is still pending. No inconsistency found in the surrounding text.

### Not re-litigated (already covered by round-1, unchanged by this diff)

Scenario/test tagging, weak-test check, spec/code mapping for the other 40 scenarios, QA script headers, and the documented Known Limits were all re-confirmed unchanged and out of this round's diff scope, per openspec/trace/gaps.json's unchanged rendering.js/index.js/streamlines.js entries (still branches:1 each, matching the proposal's stated known-limit unreachable branches — unaffected by the new tests, as expected since those tests close a coverage-blind gap the V8 branch metric never flagged in the first place).

### Final verdict

PASS. No critical or major findings remain open from round 1 (F1 and F2 are both genuinely resolved — hand-traced all 12 new test cases and confirmed each isolates exactly its named key with a load-bearing assertion). No new critical/major issue found in this round's diff. One minor process note recorded above (F3, labelArbiter.js ledger drift — known flakiness pattern, within tolerance, not caused by this change) for the lead to accept by name or record as a known limit.
