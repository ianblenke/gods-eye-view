Verdict: PASS

Commit read: c5550c683e385932ee69e2f7045f51852f096c35 (`.git/refs/heads/upstream-sync-3`, clone /home/ianblenke/docker/gev-work/upstream-sync-3). I cannot run git, so I cannot rule out uncommitted edits. I found no critical or major item. There are nine minor findings in the diff and one more outside the diff (the last item, on review.md). This is round 3, so each minor finding stays open and the owner accepts it by name.

## Findings

- [ ] FINDING minor src/tooling/mapillaryProvider.test.mjs:475-494 The new assertion `exists(vanishing) === true` cannot fail. `vanishing` is aged 23 h, so it is fresh. If the `fsp.stat` replacement never fired, the sweep would stat it normally, keep it and return `removed: 1`. All four assertions would still pass. A copy of `tiles.js` without the handler fails the test because the sweep rejects, not because of this assertion. Sentences design.md:439 and the test comment ("is skipped") claim more than the test checks. Fix: age `vanishing` 25 h like `expired`, so a sweep that lists it gives `removed: 2` and `exists(vanishing) === false`. To also catch a handler that returns a fresh stat, assert `result.bytes === 100 + TILE_DISK_FILE_OVERHEAD_BYTES` (already imported at line 14). If the test stays as it is, reword design.md:439 to "the sweep does not fail and keeps the file".

- [ ] FINDING minor design.md:435-436 and proposal.md:122 The evidence sentences contain errors.
  - "Three test files that load `tiles.js`" is false for one of them. `src/layers/streetLevel/providers/mapillary/source.test.mjs` imports only `./source.js` (which imports `policy.js`). It only checks the URL string `/api/mapillary/tiles/...` and never loads the server `tiles.js`. That file is the third file of `/tmp/claude-1000/gcr/tiles-image.sh`.
  - proposal.md:122, "alone it never did", is wrong for the same batch. The 0-of-10 batch ran `mapillaryProvider.test.mjs` with two other files, not alone.
  - design.md:436 mixes two batches. "7 of 10" comes from `tiles-image2.log`, which names no process. "Only in the process of `mapillaryProvider.test.mjs`" comes from `tiles-image3.log`, where 7 of 8 runs hit and each is named.
  - "The 18 test files that load `tiles.js`" is not shown to be the complete set. 29 test files name a provider entry point, and I did not trace all their imports.
  - Fix: write "two test files that load `tiles.js`, with a third file, ran 10 times". Write "in the second batch of 8 runs, only the process of `mapillaryProvider.test.mjs`". Write "18 test files" without the claim that the list is complete.

- [ ] FINDING minor design.md:437 The mechanism is stated as fact: "A background sweep lists the cache folder while a write moves its temporary file." The logs show only which process ran the handler, not which file vanished. Other tests also remove files, for example `fsp.rm` at test lines 390 and 540. Write "likely cause", or add a log that shows the failed path.

- [ ] FINDING minor design.md:417-428 (row 421) and `openspec/trace/history.jsonl:2379` The table says `mapillaryProvider.test.mjs` "imports this file", as the reason for the smaller `tiles.js` gap. Pass 6 shows the import did not cover handler 255. The 7-to-6 entry came from a race that the ratchet run happened to hit. It is now backed by a real test, but only for `tiles.js`. The other four rows (bhoteKoshi, flights and military) use the same "test imports" reason. The logs show no repeated-run measure for them. The limit text names the risk of larger counts, so this is not hidden. Before 7.5, run the test files of those rows several times in the image and compare their uncovered counts. Or state in the proposal limit that only `tiles.js` was measured repeatedly.

- [ ] FINDING minor design.md:441-442 and tasks.md:104 (task 7.3) The host proof ("handler runs once"; "50 of 51 pass" without the handler) cites no log. Pass 4 cites `gev-tools/upstream-sync-3/pass-4-host/`. I found no pass-6 log in `gev-tools/upstream-sync-3/` or `/tmp/claude-1000/gcr/`, so I could not check the claim. By reading `tiles.js:255`, the claim is plausible: without the handler, `listCacheFiles` rejects and `sweepTileDisk` rejects. Save the log and cite it.

- [ ] FINDING minor tasks.md:40, 98, 100-106 The tasks have four faults.
  - Config rule `tasks` asks for a last group with the review agents and `review.md`. Section 7 has none.
  - Task 3.5 is checked, but the review of the test edit is still open (rule 17).
  - Line 98, "final image gates on the tree after round 2", is still open. That run happened and failed (`s3-final.log:794-798`). No one can honestly check it. Reword it to record the failed run, or merge it into 7.5.
  - Tasks 3.6, 98 and 7.5 are three open boxes for one action.

- [ ] FINDING minor tasks.md:105-106 (7.4 before 7.5) Order. The review steps in AGENTS.md put the ratchet before the review. The trace files feed the `Reviewed-Tree` hash (`change-review-015`, `change-review-019`). A ratchet after this review can add "smaller" or "totals changed" history lines that no reviewer read. That is how the unbacked 7-to-6 entry came about. Task 7.4 may be unnecessary, because AGENTS.md allows "another ratchet command or all gates" after a changed test file. If you skip 7.4 and the full `make gates` asks for no ratchet, the reviewed tree stays as read. If you run 7.4, diff `openspec/trace/` afterwards and have a reviewer read the new lines before you set `Reviewed-Tree`.

- [ ] FINDING minor proposal.md:62-78 The "Ten upstream test edits" limit has two faults. The owner approved "carried upstream test fixes" (timer cleanup). The tenth edit is a coverage-stability addition for this fork's gate, and it is not in the design table of "Send upstream?" rows (design.md:305-315). Say that this edit is not yet a candidate, or that the owner has not decided. The edited test also stays untraced under its old name (ledger name count 1, `gaps.json:18717`). The trace gate cannot see the edit or a later weakening of the new assertion. The limit should say this. Under the vendored-code rule I do not ask for a scenario.

- [ ] FINDING minor tasks.md:105-106 (gate output, check 8) The one error of the first final run is `LEDGER-LOST-COVERAGE server/providers/mapillary/tiles.js ... 7 functions not covered and 57 covered. The ledger records 6 and 58` (`s3-final.log:794`). It is fixed in source but not shown fixed in the image. My PASS covers the diff only, and the final `make gates` decides. Also run `npm run format:check` on the test file. CI runs it and `make gates` does not. By my count the new lines fit in 80 columns, except the comment, which Prettier does not reflow.

Outside the diff (reported because you asked in item d):

- [ ] FINDING minor review.md:6, 7-9, 40 These lines are wrong at c5550c68. The `Gates:` line says "passed", but the only final run failed. `Rounds: 2`, `Scope: diff 58b2de7` and `Reviewed-Tree` are stale. Bullet 3 under "Accepted by the owner" names a ledger-refresh change as the repair, but `tiles.js` was repaired with a test edit. Do not write `Gates:` before a passing run. Order: 7.4 only if needed, `make tree`, the round-3 section and header, then 7.5.

## Checked and clean (answers to a to d)

(a) Test edit. It is correct. All earlier assertions are kept, and the patch is restored in `finally`.
- Leak: the test file has no `concurrency` option, and it already depends on sequential tests through `_setTileCacheDirForTest`. The replacement matches only `file === vanishing`, a unique path in this test's temporary folder. Stray `fsp.stat` calls from earlier background work pass through unchanged.
- The replacement cannot make the sweep skip a file it should handle.
- Stable count: the `fnlines.cjs` script tracked all seven lines in 28 image runs (10 + 10 + 8). Only line 255 ever ran.
- The other six, by code reading: line 175 cannot run, because both tasks passed to `track()` handle their own errors. Lines 298, 335 and 339 need `body.cancel()` to reject, and the tests use `new Response(...)` bodies. Line 211 needs `rm({force: true})` to fail. Line 229 needs a `readdir` error other than ENOENT.
- The logs measure function counts only. The branch total drifts (177, 178, 179), as the proposal says.

(b) New claims that are true:
- The 7 handlers at lines 175, 211, 229, 255, 298, 335 and 339 are all catch handlers in `tiles.js`.
- "51 tests": I counted 51 names in the `gaps.json` entry (lines 18673-18723), and the adopt line (`history.jsonl:2314`) has `untraced: 51`.
- "7 of 10": runs 1, 2, 4, 5, 6, 7 and 10 in `tiles-image2.log`.
- "6 and 7 functions": the ledger has 6 (`gaps.json:1088`), and `history.jsonl:2379` records 7 to 6.
- The digits 0, 1, 2, 3 and 4 match `layerStateTokenReservations.json`.
- `panelPositionControls.js:730-732` confirms the 0 ms timer for panelDock. `view.js:20` confirms the 16 ms timer for streetLevel.
- `SECURITY.md:106` matches the "Panel build credentials" text.
- The line numbers in the `spec-wording-minors` limit are right (test lines 561, 595 and 110).
- "Document gates ran after round 1" matches `s3-docs2.log:2` (snapshot of 5954dce0, only `REVIEW-MISSING`).
- The false and unsupported claims are in findings 2 and 3.

(c) Round-2 corrections. They are done right.
- The limits now sit under "Known limits and later changes".
- Task order: 1.6 and 6.5 write the test before the code.
- "Eight" is used throughout, and I found no "nine" in the change files except `review.md`.
- The `osh-059` task is removed, and the nine "Keep the test" lines match the nine osh scenarios.
- The `qa-voice-bench` `@needs` line and its design sentence agree.
- The limits `spec-wording-minors`, `qa-tags-not-pinned` and `site-terms-not-defined` are present and accurate.
- The three QA header edits change wording only. The design table matches the headers. No test pins the old text.
- The diff touches no code file outside the test and the QA headers.

(d) Post-review test change. Yes, `review.md` needs a round-3 note, but not a rule-21 adopt note.
- Adopt needs no new run. The merge commit and the adopt lines are unchanged. `tiles.js` is unchanged. The untraced count of the test file stays 51 with the same name (`history.jsonl:2074` and `:2314`).
- The `Reviewed-Tree` must be recomputed, because the test file and the trace files feed it.
- The round-3 section must name c5550c68 (and the commit after any ratchet) and add `mapillaryProvider.test.mjs` to the files compared with upstream.

## Read and not read

I read:
- the round-3 report and diff;
- `tiles.js` in full;
- `mapillaryProvider.test.mjs` lines 1-120 and 420-550, and the grep of every `fsp` use;
- `source.test.mjs` and the imports of `source.js`;
- the archived `proposal.md`, `design.md`, `tasks.md` and `review.md`, and the round-2 `spec-adversary.md`;
- `AGENTS.md` and `config.yaml`;
- `change-review/spec.md`, `gap-ledger/spec.md` (lines 385-535) and `coverage-gate/spec.md` (lines 440-510);
- `gaps.json` (the `tiles.js` entry and the test-file entry) and `history.jsonl` (lines 2074, 2314, 2376-2408);
- the logs `s3-final.log` and `s3-docs2.log`, and the scripts and logs `tiles-image.sh`, `tiles-image2.sh`, `tiles-image3.sh` (all three logs);
- `SECURITY.md` lines 33-35 and 106, `layerStateTokenReservations.json`, and the QA header lines.

I did not read:
- the round-2 STE report;
- the STE concerns of this round (banned words, sentence length), which belong to the STE reviewer;
- the full `s3-final.log`;
- the full history of other files;
- upstream-vendored code outside `tiles.js`;
- any commit after c5550c68.

I ran nothing, and I could not check the host proof of task 7.3.
