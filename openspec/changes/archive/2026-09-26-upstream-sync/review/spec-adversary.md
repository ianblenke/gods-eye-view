Verdict: PASS

The round-3 major finding (F1, the unasserted rounding clause) is corrected. I found four minor findings. No critical or major findings remain in the scope of this round. I read the tree at `/home/ianblenke/docker/gev-upstream`. `sync-gates-4.out` holds only the command line, so I have no gate result for round 4. I ran no code and no Git command. I relied on `r4-code-diff.txt` and `r4-doc-diff.txt` for the claim that no code file changed.

- [ ] F1 minor /home/ianblenke/docker/gev-upstream/openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:38 The Impact says "smaller counts for 8 files. Two of these files, `labelArbiter.js` and `lifecycle.js`, are counts that change between runs". That is stale.
  - `history.jsonl` has `smaller` lines for 9 files. The ratchet run of commit `5d4ce02` added line 1474, `ais-store.js` 44 to 40. The other 8 files are `read-dotenv-value.mjs`, `gbfs.js`, `bloom.js`, `lifecycle.js`, `bikeshare/model.js`, `sources/live/vessels.js`, `ui/visualEffects.js` and `labelArbiter.js`.
  - Three files (`ais-store.js`, `labelArbiter.js`, `lifecycle.js`) have a `smaller` line that is not a closed gap. `proposal.md` is older than `gaps.json` by modification time, so the text was written before that ratchet run.
  - `proposal.md:55` (`sync-hand-written-adopt-lines`) describes one hand edit of the `lifecycle.js` entry. The history shows at least two.
    - Lines 1448-1449 wrote 177 and 100 for `lifecycle.js`.
    - Lines 1471-1472 then show "before" 184 and 102, so the entry was set to 184 by hand again.
    - The ratchet run at 1474-1479 wrote no line for the lines or branches of `lifecycle.js`. The entry is 184 and 102.
  - Fix: write "9 files, of which `ais-store.js`, `labelArbiter.js` and `lifecycle.js` are counts that change between runs and not closed gaps". Or state the rule and not the number, because the number moves with each ratchet run. In `sync-hand-written-adopt-lines`, say that the author set the entry by hand before each ratchet run that measured 184.

- [ ] F2 minor /home/ianblenke/docker/gev-upstream/src/search/reverseGeocodeRoute.test.mjs:215 The new test does not vary the longitude alone, so a wrong key survives.
  - The third call, `30.2673, -97.7431`, differs from the first in the latitude only.
  - Mutation A: build the key from the latitude only, `${latitude.toFixed(4)}`. Tests 1, 2 and 3 of the new test behave as before, so the test passes.
  - Mutation B: build the key as `${latitude.toFixed(4)},${latitude.toFixed(4)}`, a copy-paste typo. It also passes.
  - No other test calls `reverseGeocode` with two coordinates on the remembered-answer path. `geospatial.test.mjs` uses stub providers.
  - The scenario says "the same coordinate", so a different longitude at the same latitude must fetch. Left as it is, the provider can answer "no place" for a place far away on the same parallel.
  - Fix: after the third call, add `await provider.reverseGeocode(30.2673, -97.7432)` and assert `calls.length === 3`. Add "Mutation 7: build the key from the latitude only" to task 2.5.

- [ ] F3 minor /home/ianblenke/docker/gev-upstream/openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:45 The gate warns `STE-PASSIVE` "is covered" for the sentence "the code of this change in these files is covered". `sync-gates-3.out` shows it at `proposal.md:43`, and the sentence has not changed.
  - The other STE warnings for this change are the requirement name "Browser geocoding" and older scenario text. The `timing` warning is gone.
  - Fix: write "tests cover the code of this change in these files". This is also the author's own check, which no one has verified.

- [ ] F4 minor /home/ianblenke/docker/gev-upstream/openspec/changes/archive/2026-09-26-upstream-sync/tasks.md:66 Task 4.6 now names the three codes and asks for each error and its file in `review.md`. It still accepts these codes for any file, so round-3 F5 is only half corrected.
  - A real rise of a gap in another adopted file gives `LEDGER-LARGER-GAP` too, and the author writes the record.
  - The ledger shows four files with counts that move: `ais-store.js`, `lifecycle.js`, `labelArbiter.js` and `wind/rendering.js`.
  - Fix: name these four files in task 4.6, and say that an error for any other file stops the build. Or accept the limit by name in `review.md`.

**Round-3 findings checked**
- **F1 (major), corrected.** I traced the new test by hand with the key `${latitude.toFixed(4)},${longitude.toFixed(4)}` at `http.js:98`.
  - Call 1, `30.26721, -97.74311`, gives the key `30.2672,-97.7431`. `ZERO_RESULTS` has a status and gives no place, so the key is remembered.
  - Call 2, `30.26724, -97.74314`, gives the same key and makes no fetch. `calls.length` is 1.
  - Call 3, `30.2673, -97.7431`, gives a new key and fetches. `calls.length` is 2.
  - Mutation 5 (six decimals): call 2 fetches, and the first assertion fails.
  - Mutation 6 (two decimals): call 3 gives the same key `30.27,-97.74`, and the second assertion fails. Three decimals and five decimals also fail.
  - No fifth digit sits on a rounding boundary.
  - The AND line of `credential-boundary-014` ("which the provider rounds to four decimals, makes no fetch") agrees with the code and the tests. The delta spec and the live spec have the same text.
  - The test name has the tag. `links.json` lists all 14 tests of `credential-boundary-014` in sort order.
  - The name of `osh-096` in `links.json` matches the renamed test. Both `osh-095` and `osh-096` are in `ids.json`.
- **F2, F3, F4, F6.** `sync-remembered-statuses` matches `http.js:111`, because only `ZERO_RESULTS` has a test. `sync-counts-change-between-runs` and `sync-hand-written-adopt-lines` now cover the omissions of round-3 F4:
  - four example files;
  - "probably";
  - the three error codes;
  - pull request runs;
  - `history.jsonl` lines 1424 and 1425, which are the hand-written lines;
  - the hand edit of `gaps.json`;
  - the source of the Impact counts.

  The tolerance claim matches `ledger.mjs` (`hasTolerance` needs `sameAsBase`) and `ci.yml:80`. The proposal's "first use of `createGoogleGeocoder` in `src/search/defaults.js`" matches `defaults.js:42-52`. The "8 files" number and the wording about the hand edit are still open (F1).
- **F5.** Half corrected (F4 above).
- **`osh-096`.** The WHEN line now names the three elements, and the test builds a fake document with those three. The fake `fetch`, the click, the read of `/api/osh/systems`, `hidden === false` and `/System A/` match the scenario. The renamed test is new in this change, so the rule about renaming tests on `origin/main` does not apply. The name of the test has no STE warning.
- **Ledger.** The ledger has 799 adopt lines (797 by the command, 2 by hand at 1424 and 1425). The Impact counts of 16 closed entries and of 3 code files plus 1 test file removed match the history. The six lines of the last ratchet (1474-1479) name `upstream-sync`.
- **Other diff parts.** `docs/CURRENT-STATE.md:978` does not contradict the new scenario line.

**Could not check**
- Round-4 gate output. If the run finishes, look for `TRACE-ID-CHANGED` on `credential-boundary-014` and `osh-096`.
  - I could not compute the SHA-256 in `ids.json`.
  - Both live specs are newer than `ids.json` by modification time, and the archived delta specs are older. That is consistent with the ratchet reading the active delta and the live specs being synced after it. I cannot confirm it.
- The Impact sums (60486, 5866, 1683).
- The mutation claims of tasks 2.1 to 2.7 other than 5 and 6, which I traced.
- That no code file changed. I relied on the diff files and could not run Git.

**Not a finding, outside this round**
- In `http.js:111`, `!place &&` has no test on its own. If it is removed, a place answer is remembered too, and a second call for the same coordinate returns `null`. Every test that calls the same coordinate twice starts with an answer that has no place. If the lead wants it recorded, add it to `sync-remembered-statuses`.
- `design.md:5` says the proposal names three roles. The proposal now says the owner is the person who accepts the change, so it names two.
