Verdict: FAIL

Tree read: `/home/ianblenke/docker/gev-upstream` at `f89ecdd` (branch `upstream-sync`). The archived change is in `openspec/changes/archive/2026-09-26-upstream-sync/`. `sync-gates-2.out` holds only the command line, so I could not read a gate result.

- [ ] F1 major /home/ianblenke/docker/gev-upstream/openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:42 The known limit `sync-hand-merged-files` says three code files "have no adopt line, because they have no gap": `src/app/constructCatalog.js`, `src/search/defaults.js` and `src/search/http.js`. This is false.
  - **What the ledger shows.** `openspec/trace/history.jsonl` has adopt lines for all three (lines 719, 1045, 1047). `openspec/trace/gaps.json` has origin `upstream-sync` entries with gaps:
    - `constructCatalog.js`: 3 lines, 4 branches, 1 function.
    - `defaults.js`: 2 branches.
    - `http.js`: 4 branches, 2 functions.
  - **Why it matters.** These three files are not in `both-files.txt`. They are upstream files that the change edited by hand after the merge for the credential boundary and the OSH layer. `adopt` measured the tree after those edits, so the adopted count includes any uncovered code that the change wrote.
  - **The correction made it worse.** Round 1 F8 asked for a corrected list. The new text drops the true sentence "The command `adopt` adopts the whole gap of these files". It tells the person who accepts the change that no gap exists here. `design.md:56` tells that person to read the Git diff of the hand-resolved files, and the three files fall outside that set.
  - **Fix.** Write that the three files have adopt lines and gaps, and give the counts above. Say the adopted gap includes the code that this change wrote in them. Name them as files to diff. Better: state which uncovered items of `http.js` are not the code the change wrote (`unconfigured`, `noPlace`, the `configured:false` branch).

- [ ] F2 minor /home/ianblenke/docker/gev-upstream/openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:50 The known limit `sync-counts-change-between-runs` leaves out three facts. The two hand-written adopt lines are valid, but the text is incomplete.
  - **Recorded entry.** `gaps.json` records 44 lines for `ais-store.js`, as the limit says. It records 177 lines and 100 branches for `lifecycle.js`, not 184 and 102. `history.jsonl:1448-1449` show the last ratchet wrote "smaller" 184 to 177 and 102 to 100. So the third measurement of `lifecycle.js` is 177, and the hand-written line (184/102) is only headroom above the entry. The entry does not need it. Either remove that line, or say in the limit that the entry records 177/100 and the line is headroom.
  - **No tolerance in this change.** `lifecycle.js` is new and `ais-store.js` differs from the base. So `hasTolerance` is false and `compareLedger` compares the measured count exactly (`ledger.mjs:187`, `:352`, `:422`). A gate run that measures another count gives `LEDGER-LARGER-GAP` or `LEDGER-STALE`. The sentence "After this change, the tolerance covers such a change" holds only for later changes and for a push to `main`, where `--base origin/main` equals HEAD. It is false for the gates of this change and for a CI run on a pull request. Say so.
  - **Branch tolerance is thin.** The `ais-store.js` total branches already moved 76 to 74 (`history.jsonl:1435`). Its branch tolerance is 2, so the tolerance is thin for that metric.

- [ ] F3 minor /home/ianblenke/docker/gev-upstream/openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:36 "smaller counts for 5 files" does not match the history. Reason `smaller` appears for 7 files:
  - `scripts/read-dotenv-value.mjs`
  - `server/providers/gbfs.js`
  - `src/bloom.js`
  - `src/data/lifecycle.js`
  - `src/layers/bikeshare/model.js`
  - `src/sources/live/vessels.js`
  - `src/ui/visualEffects.js`

  The counts of 16 closed entries and of 3 code files plus 1 test file removed are correct. Correct the number, or list the files. The `lifecycle.js` "smaller" is a drop against the hand-written 184, not a real closure. Say so or leave it out.

- [ ] F4 minor /home/ianblenke/docker/gev-upstream/openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:48 "Two tests of `credential-boundary-013` count three calls" is wrong. Only one test asserts `urls.length, 3` (`src/search/placeSearch.test.mjs:87`, in a loop over the statuses 429 and 502). The test at `:43` answers the third route but does not count calls. Write "One test counts three calls, and another test answers the third route."

- [ ] F5 minor /home/ianblenke/docker/gev-upstream/src/app/layers/osh.test.mjs:20 The link from the catalog to `createApplicationOsh()` is proved only by the layer id, its place and its token. Replace `createApplicationOsh()` in `src/app/constructCatalog.js:161` with `createOshLayer({ source: createOshSource() })`. Then `[osh-095]` and `[osh-096]` still pass. `[osh-096]` builds the wrapper alone, and `[osh-095]` builds a second wrapper only to read its id. Production would show no panel. The requirement says "The application catalog MUST build ... with ... the hosts of the page". This needs an unusual edit, so it is minor. Add a test that gives a fake `document` and a fake `fetch` to `createApplicationCatalog()`, takes the `osh-systems` layer from the catalog, clicks a system, and asserts the panel. Or name it as a known limit.

- [ ] F6 minor /home/ianblenke/docker/gev-upstream/src/search/reverseGeocodeRoute.test.mjs:126 The two renamed tests are tagged `[credential-boundary-014]`, but no line of the scenario says that a fetch failure or an answer that is not JSON makes the lookup reject. The caller that turns the rejection into "no place" is `src/voice/gevActions.js:3840` (`catch { return null }`). No test covers it. The known limit `sync-dropped-reverse-cache-test` does not name this catch. Add it to that limit. Also `proposal.md:46` says "the owner sees this in `review.md`", but `review.md` does not exist in the folder yet. Write the rename into `review.md`, or the sentence is false.

- [ ] F7 minor /home/ianblenke/docker/gev-upstream/openspec/specs/osh/spec.md:36 The scenario `osh-005` lists the files that the test reads: `server/providers/osh.js`, the discovered files and `server/providers/common/http.js`. The test (`src/data/oshProxy.test.mjs:213-220`) now also reads `src/sources/httpBody.js`. The scenario does not say so, and the delta does not carry it. Modifying it would rehash every scenario of its requirement, so name it as a known limit, or add the file to the scenario.

**The renamed tests.**
- Both new names are correct. `a fetch failure makes the reverse lookup reject` asserts `assert.rejects(..., /offline/)`. `an answer that is not JSON makes the reverse lookup reject` asserts `SyntaxError`.
- The old names were false after the move. The provider throws, where the old voice wrapper returned null.
- `links.json` lines 392 and 399 carry the new keys under `credential-boundary-014`, in sorted order. No old key remains for the two names.
- The keys of the moved tests are new anyway, because the file is new. The owner decides on the rule.

**The two hand-written adopt lines.**
- They are valid under `gap-ledger-095`, `gap-ledger-096` and `gap-ledger-097`. They are new lines after the base history. They name `upstream-sync`. `file` and `from` are strings, and the counts are whole numbers. `from` is the merged commit, and `adopt` already wrote valid lines for the same two files.
- `ais-store.js` (44/30/2) equals `gaps.json`. `lifecycle.js` (184/102/15) does not, see F2.
- This does not hide an own gap. Neither file is in `both-files.txt` or in the design's file list. `lifecycle.js` does not exist on `main`. `ais-store.js` has base entry 40, and its first history line (`history.jsonl:1`) records the fork's own range [40,44].
- The counts are consistent: 799 adopt lines for 797 files, 272 test lines with `lines:null`, and 17 `untrue`.
- The mechanism can hide a rise in any file the merged commit changed. That is the known limit `adopt-by-hand` of `ledger-adopt`, and here the proposal names both files and both counts.

**Checked and found sound.**
- The restored ALPR test in `src/voice/gevActions.test.mjs:162-184` is identical to the upstream text at `resolution-diff.txt:2334-2356`. The adopted count is 81 (`history.jsonl:1419`) and `gaps.json:18300` has the name once.
- The other `-test(` lines in `resolution-diff.txt` are two `viteBuild` tests that carry the fork's `[credential-boundary-003]` tag. No other test was dropped.
- `[osh-096]` makes the WHEN condition (fake page, fake fetch, a captured click) and asserts the route, `hidden === false` and `/System A/`. Mutations O1 and O2 fail it, because the panel stays hidden and the systems route is not asked. It leaks no timer, because `destroy` clears the poll.
- `[osh-034]` and `[osh-005]`: the new lists are correct. `httpBody.js` has no `send`, no `body:` key and no quoted mutating method after comments are stripped, so the scan passes with it. The count of 18 OSH test files is unchanged.
- The `credential-boundary-014` lines match the tests and the code (`src/search/http.js`, `:62-67`, `:97-112`). The 13 tests are in `links.json`. The `osh-094` line "one `aside`" matches `src/data/osh.test.mjs:217`.
- The changed regions of the delta specs equal the live specs (`osh-094`, the requirement "Application catalog", `osh-095`, `osh-096`, `credential-boundary-014`). The ids hashes for `osh-033`, `osh-094` and `credential-boundary-014` differ from those on `main`. The ids for `osh-095` and `osh-096` exist.
- The hand-merged list matches `adopt-summary.txt`: 8 code files and 10 test files.
- The `docs/CURRENT-STATE.md` text and the `context.html` comment now agree with the code.

**Could not check.**
- The gate output of round 2 (empty), and any test or mutation. I read that no run gave the 60486 lines, 5866 branches and 1683 functions of the Impact, and I could not sum them.
- Git: the merge commit and its parents, whether the upstream remote has `b210ab0`, and the 177, 179 and 184 line counts of `lifecycle.js` that the limit reports for the adopt and ratchet runs.
- `make lint` and `check:boundaries`.
- The remark that the lead compared all upstream test names with the tree. I saw only the `resolution-diff.txt` side of it, for the 32 files.
- Which uncovered branches of `http.js`, `defaults.js` and `constructCatalog.js` belong to the code this change wrote (see F1).
