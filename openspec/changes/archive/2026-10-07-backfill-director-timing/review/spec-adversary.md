Verdict: PASS

Commit read: c31c23d0c7abf10a1350b4912a6f1ee9557d3fe5 (clone `/home/ianblenke/docker/gev-work/director`). Round 3 has no critical or major findings. The four findings below are minor.

- [ ] FINDING minor openspec/changes/archive/2026-10-07-backfill-director-timing/mutations.md:5136 The "New mutation summary" table stops at m310. Rows m311-m318 have sections but no table row. Add the 8 rows, or retitle the table "m289-m310".
- [ ] FINDING minor openspec/specs/director/spec.md:192 The correction "that shot gives" to "the timeline gives start time 0, end time 0 and start progress 0" dropped the input. The line now also fits an absent scene or a zero total. `src/director/timeline.test.mjs:339` asserts it only for the absent shot in a 10 s scene. Write "the absent shot gives ...".
- [ ] FINDING minor openspec/specs/director/spec.md:21 Unchanged tests tagged director-003 assert results that no THEN or AND states. `document.test.mjs:61-62` asserts the migrated version 6 and bloom intensity 25 giving 150. `document.test.mjs:620` asserts that the absent version accepts the numeric text "2". The new WHEN "validation or migration" now covers these results. Add AND lines, or accept this by name.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-backfill-director-timing/proposal.md:35 The known limit `ledger-count-noise` cites `history.jsonl` lines 2021 and 2022. Those lines move if another change merges first. Cite the change name and file instead.

What I checked, against your six points:
1. **director-036:**
   - The single-scene test (`playback.test.mjs:957`) starts at `a` in the list [a, b] and asserts the shot IDs, `queue[i].scene` and the shot objects.
   - m313 (`start + 2`) adds `b1`, so the ID list fails. m314 (copy of the scene) fails the `assert.equal` identity check.
   - The wrap test asserts the same scene identity.
2. **director-037 and the clock AND lines:**
   - The phase test records `context.shot.id`, so m316 fails on the shot ID.
   - The 023 test has two later subscribers. It asserts the full snapshot with `deepEqual`.
   - m317 targets the unique `listener(...)` call at `clock.js:156`. m318 targets `clock.js:80`.
   - The zero-total test at `clock.test.mjs:203` and the stopped-snapshot test at `:1095` match their AND lines.
3. **Version 6:**
   - The accept test with m315 and the reject test at v5 (`document.test.mjs:573`, m081) cover both sides of `document.js:130`.
   - `audit.md` row 130 lists both m081 and m315.
   - A `>= 5` mutant has no row. The v5 test would fail it by inspection. I did not run it.
4. **mutations.md:** I compared m289-m318 against `muts.json`. Old, New and the selected-test names agree. There are 318 headings and 310 `KILLED`, plus the 8 survivor sections.
5. **director-003:**
   - The WHEN fits the version tests and the migration test.
   - The scenario ID is new in this change, so the ID has no earlier meaning.
6. **New faults:**
   - The m207 text is correct. The mutation runs only the first subscriber, so the later subscribers get no snapshot.
   - I found no false "cannot" or "only" claim.
   - The QA scripts use versions 4, 5 and 6 and `single: true`. I found no conflict with the new AND lines.
   - `links.json` holds the new titles and none of the old ones.

Not run or not read:
- I have no shell. I ran no tests, mutations, git commands or gates, and I read no gate output.
- I took the 310 passing tests, the 8 equivalent survivors, the ratchet result and the clean lint from your summary.
- For "source unchanged" I only compared per-file line counts of `src/director/*.js` between the clone and `/home/ianblenke/docker/gods-eye-view`. They are equal for all 17 files. That is not a byte comparison.
- I did not check STE wording, the equivalent probe scripts, or the scratch file `muts-subscriber-round2.json`.
