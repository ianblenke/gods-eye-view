Verdict: FAIL

I read the three documents and the diff. I read the scripts only where I could check a purpose. I did not run anything.

- [ ] FINDING major scripts/qa-admin-outlines.mjs:3 "and do not move" -> "and do not redraw while the camera does not move". The script asserts `stableWhileStill` ("no redraw when still"). It does not check whether outlines move. My round-1 text was inexact, so the purpose is not true to the script.
- [ ] FINDING major scripts/qa-alpr-journey.mjs:3 "appear quickly and do not move along a camera journey" -> "appear quickly and do not change while the camera does not move". The script checks marker stability and flicker with a still camera (lines 24, 342). "Do not move" is false. Check the second half of the new sentence against the script before you accept it.
- [ ] FINDING major proposal.md:50 "The 13 new QA headers name capabilities with the prefix `pending:`, and the header of `qa-journey-recorder.mjs` has `unmapped:`." -> "12 of the 13 new QA headers name capabilities with the prefix `pending:`. The header of `qa-journey-recorder.mjs` has `unmapped:`." As written, the 13 headers all have `pending:` and one header also has `unmapped:`. That is 14 headers, or a contradiction. The meaning is also unclear for D3 in design.md:23.
- [ ] FINDING minor tasks.md:11 "Report the test that fails in `review.md`." -> "Report the result of each mutation in `review.md`." Tasks 2.3, 2.4 and 2.6 do not fail a test. The first two give a live timer. Task 2.6 gives a time-out. The sentence is wrong for them.
- [ ] FINDING minor proposal.md:48 "stops the polling of the guard in that test" -> "stops the timers of the guard in that test". "Polling" is an -ing word. The text calls the same thing "timers" in the other lines.
- [ ] FINDING minor proposal.md:48 "hides the leaked timers" -> "hides the timers that stay live". "Leaked" is a participle, and design.md uses "stay live".
- [ ] FINDING minor proposal.md:46 "the values of the adopt run" -> "the values of the run of the command `adopt`". This uses one name for one thing, like the other lines.
- [ ] FINDING minor scripts/qa-military-names.mjs:3 "at close zoom" -> "when the camera is close". "Zoom" is a noun here. Also use one word, "frame rate" or "frame speed", in all headers. This line and `qa-journey-recorder.mjs` use different words.

Checked and no fault found:
- The numbers agree across the three documents: 29 rows, 83 scripts, 159 = 152 + 7, 6 mutations, 4 timers.
- The `@covers` line of `qa-overpass-offload.mjs` now has `pending:alpr`.
- The `@run` and `@needs` lines of `qa-layer-token-twochar.mjs` agree with the script: it reads `QA_BASE_URL` and defaults to 127.0.0.1:4173.
- The D2, D5, D6 and D4 sentences, the heading "How the gates measure this change", and the comment in `src/data/militaryInstallations.test.mjs`.
