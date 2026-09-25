Verdict: PASS

Findings:
- [ ] F1 (minor) osh-093 says "an element of the list" and drops the word "visible": the AND line is at `/home/ianblenke/docker/gev-video/openspec/changes/archive/2026-09-25-osh-camera-video/specs/osh/spec.md:211`, in the synced spec at `/home/ianblenke/docker/gev-video/openspec/specs/osh/spec.md:849`, and D79 is at `design.md:86`. The overlay skips an element with the attribute `hidden`, or one that is not visible (`src/overlays/worldOverlay.js:1145` and `:1241`). The panel is `hidden` at the start (osh-094). The test "UI exclusions ignore chrome the user cannot see" (`src/overlays/worldOverlay.test.mjs:1315`) shows this rule, and no spec states it. The effect is small: a hidden element has a zero rect. Round 3 offered the wording "a visible element" once. Fix: write "clear of a visible element of the list" in the delta spec, the synced spec and D79. No test needs a change. Or add this as a known limit.
- [ ] F2 (minor) The `[osh-094]` test of `index.html` can pass with no panel: `src/data/osh.test.mjs:213-222`. The round-3 fix strips the comments of the stylesheet only. The HTML test does not strip `<!-- -->`. Comment out the whole `<aside id="osh-panel" ...>` element and every assertion still passes. The regex, the count `id="osh-panel"` equal to 1, and the two inner ids all match inside the comment. The class check `\bosh-panel\b` at `:216` also matches `class="osh-panel-old"`. Fix: remove HTML comments from `html` before the regex, and match the class as `(?:\s|")osh-panel(?:\s|")`. Or name this in `osh-panel-layout-unchecked`.
- [ ] F3 (minor) Task 6.8 and the ledger do not show the new `[osh-093]` placement test: `tasks.md:122` says "Write the `[osh-093]` test of the occluder selector" in the singular, but `src/overlays/worldOverlay.test.mjs:1532` is now a second test, of the card placement. D79 (`design.md:88`) and the limit `osh-panel-layout-unchecked` (`proposal.md:51`) list what the tests check and leave out this test and the class check. Nothing is false. Fix: write "Write the `[osh-093]` tests of the occluder selector and of the card placement". Add the two omitted checks to the D79 list if you touch that line.
- [ ] F4 (minor) The tasks still say "good message" and "bad message", but the spec, the design and the test names now say "valid": `tasks.md:43` ("a good message gives an event `frame`. Each kind of bad message gives no event."). Round-3 S11 was about this term. Fix: "a valid message gives an event `frame`. A message that is not valid gives no event."
- [ ] F5 (minor) No file of the repository records the headless run of the real player yet: `proposal.md:45` states that it ran once, and `review/round-3/skeptics.md` says "`review.md` records the run". The folder has no `review.md`, and task 8.8 is open. Fix: write the run in `review.md` (the date, that the clip was synthetic, and the result), with no host or stream name. Keep task 7.6 open for the person's check.

Round-3 findings, one by one:
- Spec F1 (major) is corrected apart from F1 above. osh-093 and D79 now say what the code does (`worldOverlay.js:1664-1694`, soft or hard veto, "when it can"). The delta spec and the synced spec agree. The new test at `worldOverlay.test.mjs:1532` builds the panel from the shipped `.osh-panel` rule (position `fixed`, z-index 99, above the host). It asserts that the default place of the card collides with the panel. It asserts that the card steps clear when the panel exists. It fails for L19: the fixture assertion in `installMockEnvironment` (`:323-327`) throws when `#osh-panel` is not in the list.
- Spec F2 is corrected: the WHEN of osh-092 names both cases (24 words).
- Spec F3 is corrected. `text.slice(-'event: frame'.length + 1)` keeps the last 11 characters. A match has 12 characters, so the carry cannot hold a whole match, and no count is doubled.
- Spec F4 is corrected: 7.1 (the `[osh-094]` tests) comes before 7.2, 7.3 and 7.4. The test of osh-093 is task 6.8, before the code task 7.4.
- Spec F5 is corrected (D74).
- Spec F6 is corrected apart from F2 above. The class check exists, and the style test strips the comments (L22 and L23 fail as claimed).
- Spec F7 is corrected. `live.js:111-112` gives 1000 and then 2000, and the reset happens only after 30 seconds of an open socket. The test has two clients, closes the second socket at once, and checks 1999 and 2000. V25 fails it. osh-080 points to osh-069.
- Spec F8 is corrected in the proposal text. See F5 above for the record.
- STE S1 is corrected (see Spec F1).
- S2 is corrected (5.3 and P6). S3 is corrected (osh-092). S4 is corrected (two triggers in the WHEN of osh-080, and the condition in each THEN or AND line).
- S5 is corrected: lines 164, 165 and 169 of the delta spec, and D77 says "A key message with a PPS and a new SPS". This matches `videoPlayer.js:109`.
- S6 is corrected: `videoPlayer.js:174` and the test at `videoPlayer.test.mjs:669-671`.
- S7 is corrected apart from F2 above (osh-094 text and the two test names).
- S8 is corrected: `writableLength` is defined once in osh-090, and the tasks and V17 agree.
- S9 and S10 are corrected in the names. Every old name is gone from `src` and from `openspec/trace`. The new names are in `links.json`, and none is longer than 25 words.
- S11 is corrected in the spec and the test names (see F4 for the tasks). S12 is corrected: `history.jsonl` lines 616 to 620 show 52, 50, 52 under this change, and `gaps.json` has 52. S13 is corrected (5.3 and 7.5).

What I checked:
- All 13 files of the diff, and the current text of the delta spec, the synced spec, the design, the proposal and the tasks.
- The delta spec and the synced spec are identical for osh-079, osh-080, osh-083, osh-084, osh-087, osh-090, osh-092, osh-093 and osh-094.
- The code behind each changed line: `worldOverlay.js` (the list of selectors, `elementIsVisible`, `occluderStacksAboveHost`, the two placement passes, `getOverlayPaintRect`, the destroy of the pool), `live.js` (the retry delays and `down()`), `videoPlayer.js` (the configure rule, the status and the title), `style.css`, and `index.html`.
- The STE rules in `scripts/spec/lib/ste.mjs`. The task limit applies to the checkbox lines only, and the test names are linted with the same limits. I counted the words of the changed lines and test names. All are at or under the limits.
- The standing constraints for this diff: there is no `send`, no non-GET request, no network call except loopback `127.0.0.1`, and no real name or ID. No test that exists on `main` was renamed.
- The trace files: `links.json` has the new and renamed names, `history.jsonl` has lines that name this change, and `retired-ids.json` has no OSH ID.

What I could not check:
- I cannot run code. I could not run the tests, the lint, the ratchet, the mutations (L19, L22, L23, V25) or the gates run after the archive. I checked each mutation by reading the test and the code. I saw no gate warnings.
- I did not check the headless Chrome run or the look of the panel.
- The real VideoDecoder is a known limit.
