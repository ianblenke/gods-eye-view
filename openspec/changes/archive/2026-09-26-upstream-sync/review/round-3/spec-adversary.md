Verdict: FAIL

Tree read: `/home/ianblenke/docker/gev-upstream` at `9e28f75`, branch `upstream-sync`. `sync-gates-3.out` holds only the command line, so I have no gate result for round 3. I could not run any code, test or mutation, and I could not run Git.

- [ ] F1 major /home/ianblenke/docker/gev-upstream/openspec/changes/archive/2026-09-26-upstream-sync/specs/credential-boundary/spec.md:18 The new AND line of `credential-boundary-014` says a later call "for the same coordinate, rounded to four decimals, then makes no fetch". No test asserts the rounding.
  - The key is built at `src/search/http.js:98` with `toFixed(4)`. Every test that reverse-geocodes twice uses one identical coordinate: `reverseGeocodeTwiceAfter` in `src/search/reverseGeocodeRoute.test.mjs:149-150`, and the configured:false test uses two far-apart points.
  - Mutation: change the key to `${latitude},${longitude}`, or to `toFixed(6)`. As I read the tests, all 13 still pass. Task 2.5 lists no mutation for it.
  - Round-2 STE finding S23 offered "add a test, or write the rounding into the text". The text was chosen, and that added an unasserted clause. Rule 20 of `AGENTS.md` names this risk.
  - Fix: add a test with two coordinates that round to the same four-decimal key (30.26721 and 30.26724) and assert one fetch. In the same test add a coordinate that differs at the fourth decimal and assert a new fetch. Then add that mutation to task 2.5. Alternatively remove the clause.

- [ ] F2 minor /home/ianblenke/docker/gev-upstream/src/search/http.js:111 The scenario says the provider remembers an answer that "has a Google status" and gives no place. Only `ZERO_RESULTS` is tested (`reverseGeocodeRoute.test.mjs:206-213`).
  - Mutation: change `data?.status != null` to `data?.status === 'ZERO_RESULTS'`. As I read the tests, all still pass.
  - The `null` and absent-status tests pin the other side of the condition.
  - Fix: add a test with a second status on an HTTP 200 answer, or change the scenario to name `ZERO_RESULTS`. If the owner does not want a status such as `REQUEST_DENIED` remembered, decide that in `review.md`.

- [ ] F3 minor /home/ianblenke/docker/gev-upstream/openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:36 "smaller counts for 7 files" is stale. Round-2 F3 is only half corrected.
  - `history.jsonl` now has `reason:"smaller"` lines for 8 files. The round-3 ratchet added `src/data/labelArbiter.js` (branches 52 to 50, line 1469). Its total of branches also moved from 407 to 405, which looks like V8 count noise and not a new test.
  - `src/data/lifecycle.js` appears twice, at lines 1448-1449 and again at 1471-1472, both "184 to 177". Its "before" of 184 comes from the hand-written adopt line, not from a real earlier gap. Nothing closed.
  - Fix: write "8 files, of which `lifecycle.js` and `labelArbiter.js` are changes of a count between runs". Or state the rule that gives the number.

- [ ] F4 minor /home/ianblenke/docker/gev-upstream/openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:52 The limits `sync-counts-change-between-runs` and `sync-hand-written-adopt-lines` (lines 52-53) leave out facts that the person who accepts this change needs.
  - Hand edit of `gaps.json`. Before the round-3 ratchet run, the lead set the `lifecycle.js` entry in `gaps.json` to 184/102 by hand. This is the cause of the second pair of history lines. The limit says only that two adopt lines were hand-written.
  - Cause stated as fact. "because the covered code depends on timing" is a stated cause with no measurement. The fork's own ledger already recorded `ais-store.js` as "unstable" at `history.jsonl:1`. Write "probably" or measure it.
  - More files than the two examples. `src/layers/wind/rendering.js` (a change of totals, 333 to 334, `history.jsonl:1473`) gave `LEDGER-STALE` in round 2. `labelArbiter.js` moved in round 3. Neither is named.
  - Missing error code. A changed file with no tolerance can also stop with `LEDGER-LOST-COVERAGE` (`ledger.mjs:366-371`). The limit names only `LEDGER-LARGER-GAP` and `LEDGER-STALE`.
  - Pull request runs. `ci.yml:80` compares with `--base origin/<base_ref>`. A pull request run also compares exactly and has no tolerance. The limit names only the push to `main`.
  - Impact sums. I could not check the Impact sums (60486 lines, 5866 branches). The hand-written lines raise the effective adopted maximum by 11 lines and 2 branches over the machine-written lines. If the sums come from the machine lines only, say so.
  - Position of the hand-written lines. Give them (`history.jsonl:1424-1425`) so that they are easy to find among 799 lines.

- [ ] F5 minor /home/ianblenke/docker/gev-upstream/openspec/changes/archive/2026-09-26-upstream-sync/tasks.md:64 Task 4.6 accepts "errors of a count that changes between runs" with no bound. A real rise of a gap in an adopted file gives the same error code and is easy to dismiss.
  - Fix: name the accepted files (`ais-store.js`, `lifecycle.js`, `wind/rendering.js`, `labelArbiter.js`). Name the accepted codes (`LARGER-GAP`, `LOST-COVERAGE`, `STALE`). State a size limit, for example a difference of 8 or less, which is the largest `toleranceOf` value in `ledger.mjs:10`. Any other file must stop the build.

- [ ] F6 minor /home/ianblenke/docker/gev-upstream/openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:12 "The HTTP geospatial provider and the function `createGoogleGeocoder` call the server route `/api/google/geocode`" is imprecise.
  - `createGoogleGeocoder` (`src/search/google.js:37`) has "caller-owned transport" and holds no URL. The `request` function in `src/search/defaults.js:44-51` calls the route.
  - The same function also serves the local Nominatim route `/api/geocode` (`defaults.js:57-68`).
  - Fix: write "the `request` function in `src/search/defaults.js`".

**Round-2 findings checked against the files**
- **Round-2 F1 (major) and STE S1: corrected.** `sync-files-edited-after-the-merge` names the three files with counts that match `gaps.json` (constructCatalog 3/4/1, defaults 0/2/0, http 0/4/2). `design.md` D5 tells the person who accepts the change to read their diff. The claim "code of this change is covered" is the author's own check, and I could not verify it.
- **F4, F5, F6, F7: corrected.**
  - `sync-third-geocoder-call` is now "one test counts three, another answers the third".
  - `osh-096` uses `createApplicationCatalog()` and `catalog.get('osh-systems')`. The test asserts the route, `hidden === false` and `/System A/`, and the scenario text matches. Task 2.4 mutation 3 is plausible: with no hosts the panel stays hidden.
  - `sync-dropped-reverse-cache-test` names the catch at `gevActions.js:3840`, and `gevActions.test.mjs` has no reverse test.
  - `sync-osh-005-file-list` matches `oshProxy.test.mjs:219` and the `osh-005` scenario at `spec.md:36`.
- **F2: partly corrected.** The tolerance text is right for the push to `main` (`ledger.mjs:187-189`, `ci.yml:80`). Omissions remain, see F4.
- **F3: not fully corrected**, see F3.

**Checked and sound**
- **Adopt lines.** The ledger has 799 adopt lines: 797 by the command plus 2 by hand. 272 have `lines:null` (test files) and 17 are `untrue:true`. The Impact counts of 16 closed entries and 3 code files plus 1 test file removed match the history. No adopt line names a file that only the fork wrote: I found no `osh` fork file, no `hosts.js`, no `reverseGeocodeRoute` and no `scripts/spec` file.
- **Hand-written lines.** Both name files that the merged commit changed, since each has a machine-written adopt line (`ais-store.js` at 698, `lifecycle.js` at 786).
- **Trace files.** `links.json` has all 13 tests of `credential-boundary-014`, in sort order, plus `osh-095` and `osh-096` with the new name. `ids.json` has entries for `osh-095` and `osh-096`.
- **Design claims.** `validateLayerStateRegistry` checks `^[a-z0-9]$` and uniqueness (`layerState.js:641-645`). `npm run check:boundaries` exists. `constructCatalog.test.mjs:65-66` checks the order from `traffic` to `directions`.

**Could not check**
- I have no gate output for round 3 and no run of any test. That includes the new `osh-096` test with its fake `document`.
- I cannot compute the hashes in `ids.json`, so I could not confirm they match the round-3 scenario texts.
- No Git, so I could not check the 1002, 650 and 1025 file counts, or whether the upstream remote has `b210ab0`.
- I could not sum the Impact totals.
- I could not confirm any mutation claim in tasks 2.1 to 2.7.
