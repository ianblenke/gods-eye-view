Verdict: PASS

Commit read: `1f20d95bd010572526faa9507b840816399fa080`, from `/home/ianblenke/docker/gev-work/upstream-sync-3/.git/refs/heads/upstream-sync-3`. I read working-tree files and could not check them against that commit's objects, because I have no git. I ran nothing. I have only Read, Grep and Glob, so every count below comes from reading the code and the logs.

Result: I found no critical and no major finding. The correction is sound. The 12 findings are minor. F1 and F2 carry the main residual risk and need a recorded decision from the lead.

## Answers to the three questions

(a) Is the correction right? Yes.
- Earlier assertions kept. The test still asserts `expired` gone, `fresh` kept and `vanishing` kept. `removed` goes from 1 to 3, which is needed. It adds `exists(older[i]) === false` for the two new tiles.
- Without the stat handler. `listCacheFiles` throws, `sweepTileDisk` rejects, and the test fails.
- Without the `fsp.stat` replacement. The sweep lists `vanishing` (25 h old) and removes it, so `removed` is 4, not 3, and `exists(vanishing)` is false. Both assertions fail.
- The path string matches. `file === vanishing` compares `path.join(dir, 'coverage', '14', '3-3.pbf')` with `tileFile(...)`. The host-log fault in step 4 confirms the match matters.
- Cannot fail for a reason that hides a defect. The expected count is the literal 3. The sort puts `fresh` (23 h) last, so the loop runs 4 iterations: 3 removals and 1 break.
- No other test or process changes. `withCacheDir` makes its own `mkdtemp` folder, and its `finally` settles writes before `rm`. The 5 tile files are written only there. In `tiles-image5.log`, no other process has loop ranges.

(b) Is the range structure deterministic? The deterministic part is. The "always" claim has a corner that I cannot exclude. V8 merges the `break;` range (8762-8768) and the continuation range (8768-8853) only when their counts are equal. The failure condition is therefore removals equal to breaks. "Above" is stricter than needed.

Fixed sweeps. Each runs in its own temp folder and nothing else writes there:
- line 493 (test at 471): 4 iterations, 3 removals, 1 break. The skipped `vanishing` is not listed.
- line 514 (test at 505): 2 iterations, 1 removal (cap eviction), 1 break.
- line 1229 (test at 1221): 2 iterations, 1 removal (cap eviction), 1 break.
- the background sweep in the test at 522: 2 iterations, 1 removal, 1 break (files of 30 h and 1 h, plus the new tile).
- Total: 10 iterations, 6 removals, 4 breaks. The fixed margin is +2.
- The `&&`-right range is 8 in all 6 runs of `tiles-image5.log`. That equals 6 breaks plus the 2 cap evictions, so the break count of 6 holds in each of those 6 runs.

Variable sweeps. These run on the shared `cacheDir` and depend on `_lastSweepAt` (15 min interval) and `_sweeping`. `_lastSweepAt` is reset to 0 at module load and at each `withCacheDir` entry and exit. A mocked-clock sweep pushes it into the future.
- The host shows 7 calls: 3 explicit, 1 background and 3 variable. It shows 6 breaks, so exactly one call had no break.
- That call can only be the mocked +25 h sweep at the test at 406. It lists only expired files, at least `(14,0,0)` from the test at 355 and `(14,3,3)`. It adds at least 2 removals and no break.
- The other two variable sweeps break with zero or few removals.
- Result: removals 8 or 9 against breaks 6. The host measured 15 iterations, 6 breaks and 9 removals. Before the correction, the image showed 6 or 7 removals, which is 2 fewer.
- Another test can add breaks only by adding a sweep. At most one sweep per kind (real clock, +2 h, +25 h) can run between two `_lastSweepAt` resets. There are no `concurrency` options in the file, so the tests run one at a time.
- Only the process of `mapillaryProvider.test.mjs` has loop ranges. In all 6 runs of `tiles-image5.log`, the other 17 processes have none.

The corner. The test at 355 (lines 398-403) never settles its background writes. If its sweep is still `_sweeping` when the test at 406 renames its second tile, the +25 h sweep is skipped.
- A different mocked sweep at the test at 424 then breaks once and removes the 23 h-aged tile.
- By my count the margin can then fall to 0 or 1. Equality merges the two ranges again and gives 178.
- This is unlikely. The sweep would have to outlast two upstream cycles with 10 ms polls. I cannot exclude it, and the documents say "always". The count is from reading, not from a run.

(c) False claims? None decides a verdict. The imprecisions are in F2 to F11. The numbers match the logs:
- 15, 6 and 9 match `host.log:27`.
- "8 runs" and "213 keys, 0 keys not in all runs" match `tiles-image6.log`.
- "6 or 7 removals" matches `tiles-image5.log`.
- "7 uncovered functions, ledger 6" matches `s3-final.log:794`.
- "LEDGER-STALE" matches `s3-final2.log:795`.
- The 177→178 and 178→179 steps match `history.jsonl:2380` and `:2407`.
- "28 runs in three batches" is unchanged text. I did not re-check it (see the not-read list).

## Findings

- [ ] FINDING minor src/tooling/mapillaryProvider.test.mjs:476 (F1, for the lead, rule 18) The two extra tiles exist only to change V8 range counts. The instrument counts V8 branch ranges, and V8 merges equal-count neighbours, so the ledger total depends on run-time counts. The vendored test is shaped to the instrument. The proposal and design do not name this as a gate defect. The extra assertions test real behaviour, so the test is not weaker, and this does not block the round. The lead must record a decision: a follow-up such as `gates-trust-hardening`, or an entry in the Known limits. The limit should note that the same count-equality effect can change totals in the five other adopted files.
- [ ] FINDING minor design.md:461 (F2; also proposal.md:127 and review.md:41) The wording is "always stay above" and "so the ranges stay the same in each run". The evidence is 8 image runs that print key sets only, plus 1 host run. Bound the claim to those runs. Give the fixed margin of +2. Name the corner above, where the unsettled test at 355 skips the +25 h sweep. The condition that matters is equality, not "above". The ledger-refresh fallback in the proposal covers it.
- [ ] FINDING minor design.md:455 (F3, regression of round-3 finding, review/spec-adversary.md:12) The sentence "In 8 image runs ... only the loop changed ... and only in the process of mapillaryProvider.test.mjs" joins two batches. `tiles-image4.log` has 8 runs, with key sets only. `tiles-image5.log` has 6 runs, with per-process counts. The "breaks 6 times in each run" and "removes 6 or 7" at line 458 come from the 6-run batch. In that batch the extra removal happened in 2 of 6 runs, which is a minority, not "most". The 6/8 split in `image4` is a key-set count. Name each batch and its size.
- [ ] FINDING minor /tmp/claude-1000/gcr/tiles-image6.log:18 (F4) The 8 "after" runs show 213 keys and no differing key. No log shows that those keys include `8762-8768` and `8768-8853`. The split case is inferred from `image4`, where split runs had 213 keys and merged runs had 212. Print the loop keys of one "after" run, or write "inferred".
- [ ] FINDING minor design.md:465 (F5) The fault checks (host log steps 3 and 4, lines 8-17) and the handler count `{"255":1}` (line 7) ran before the second correction. Step 6 (lines 22-27) prints only a pass and the loop ranges. The paragraph is placed after the second-correction text, so it reads as if it covers the final test. By reasoning it does. Re-run the two fault copies against the final test, or say that they were run on the earlier version. Label the offsets in `host.log:27`: 15 is the loop body, 6 the `break;`, 9 the continuation.
- [ ] FINDING minor design.md:453 (F6) The order of the totals disagrees. `design.md:453` says "177, 179 and 178". `proposal.md:131` says "177, 178 and 179". `history.jsonl` shows the ratchet 177→178 (`:2380`) and 178→179 (`:2407`), and the second final gates gave 178. Label each value with its run. My reading of the cause: 177 is no handler and a merged loop, 178 is one of the two, and 179 is handler plus split.
- [ ] FINDING minor proposal.md:130 (F7) "The last ratchet also records ... (178 to 179)" is the second-to-last ratchet. The last ratchet is `history.jsonl:2409` (commit `6b0a2f0`), a measurement line only. Also `design.md:421`, the table row for `tiles.js`, names only the handler and not the loop correction.
- [ ] FINDING minor review.md:3 (F8) The header is stale after the second correction. "Gates: ... passed" is false for now: two final gates runs failed and the third was running. "Rounds: 3", "Scope: diff ab3e2b6" and "Reviewed-Tree" also need an update. `tasks.md` has no item for this round-4 check, and item 8.1 says round 3. Item 3.6 (final gates on the final tree) is open, and 8.2 and 8.3 follow it. This round is past the three-round limit. `review.mjs` only requires a number of 1 or more, so the gate does not stop it. Record that this round was a narrow extra check requested by the lead.
- [ ] FINDING minor src/tooling/mapillaryProvider.test.mjs:476 (F9) The comment says what the tiles do but not why. "Keep the removals above the breaks" will look redundant in a later cleanup. Nothing in the gates or the tests protects the two tiles, and the flake would come back in rare CI runs. A comment edit needs another full gates run, so the cheaper option is to record the reason as a Known limit.
- [ ] FINDING minor proposal.md:130 (F10) The text "No code changed in these two files between the ratchet runs" is true for the code files. The test file did change, and the first correction is part of why the `tiles.js` total moved. State that, so "Totals can change between runs" does not read as unexplained.
- [ ] FINDING minor proposal.md:135 (F11) The 8 image runs use one `node --test` call on 18 files. The gates run the whole project for about 1600 s under heavier load. The running third final gates (`s3-final3.log`) is the real proof, and one pass does not prove determinism. State that, or keep the ledger-refresh fallback explicit in `review.md`.
- [ ] FINDING minor src/tooling/mapillaryProvider.test.mjs:471 (F12) The correction changed an untraced adopted test and kept its name. Check #7 reports this pattern. It is covered by the owner's vendored-code rule and by the Known limit about the tenth test correction, so I record it only so that you can confirm it.

## Read

- `/home/ianblenke/docker/gev-tools/upstream-sync-3/review/round4-test.diff`.
- `/home/ianblenke/docker/gev-work/upstream-sync-3/src/tooling/mapillaryProvider.test.mjs`: lines 1-210, 205-410, 424-600, 925-1095 and 1195-1295.
- `/home/ianblenke/docker/gev-work/upstream-sync-3/server/providers/mapillary/tiles.js`: lines 190-300 and 480-519, plus the constants file.
- Logs in `/tmp/claude-1000/gcr/`: `tiles-image4.sh`, `tiles-image4.log`, `tiles-image5.sh`, `tiles-image5.log`, `tiles-image6.log`.
- `/home/ianblenke/docker/gev-tools/upstream-sync-3/pass-6-host/host.log`.
- By grep: `s3-final.log` and `s3-final2.log`. First lines only of `s3-final3.log`, which was still running.
- In `/home/ianblenke/docker/gev-work/upstream-sync-3/openspec/changes/archive/2026-10-08-upstream-sync-3/`: `design.md` lines 340-497, `proposal.md` lines 85-163, `tasks.md` lines 95-116, all of `review.md`, and `review/spec-adversary.md` lines 11-14 (the round-3 report).
- `openspec/trace/gaps.json` for `tiles.js`, `history.jsonl` lines 2074 and 2379-2409, and `scripts/spec/lib/measurement.mjs`. For `review.mjs` I grepped the rounds check only.

## Not read

- The rest of `design.md` and `proposal.md`.
- The gate scripts other than `measurement.mjs` and the grep of `review.mjs`.
- `links.json`.
- The first three image batches (`tiles-image.log`, `tiles-image2.log`, `tiles-image3.log`) behind the "28 runs".
- The other 17 test files of the image set.
- The round-3 STE report.
- The Prettier and lint results of the final tree.
