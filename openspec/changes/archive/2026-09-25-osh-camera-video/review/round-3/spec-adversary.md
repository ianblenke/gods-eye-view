Verdict: FAIL

Findings:
- [ ] F1 (major) osh-093 and D79 say the world overlay hides an entry, and it does not: the AND line is at `openspec/changes/archive/2026-09-25-osh-camera-video/specs/osh/spec.md:213`, the same line at `openspec/specs/osh/spec.md:851`, and D79 at `design.md:86` ("it hides an entry that lies under the panel").
  - The code treats `#osh-panel` as a soft preference, not a hide. `src/overlays/worldOverlay.js:1664-1694` moves the label to a placement clear of the panel. If none is clear, the entry stays and is painted under the panel. Only chrome that stacks below the host (z-index 6 or lower) vetoes an entry (`worldOverlay.js:1203-1205`). `.osh-panel` has z-index 99 (`style.css:36`), so it is always soft.
  - Two existing tests contradict the line. `worldOverlay.test.mjs:1351-1383` asserts that the card survives a viewport-filling exclusion. `:1385-1420` asserts that chrome above the host keeps the soft preference, with `paintedCount` equal to 1.
  - The only tagged test, `worldOverlay.test.mjs:1528`, checks that the list includes `#osh-panel`. It cannot show the AND line, so a scenario statement is wrong and untested.
  - This wording is new since round 2. Round 2 said only "treats the panel host as an occluder".
  - Fix: delete the AND line from osh-093 in the delta and the synced spec. If you keep a second line, write what the code does: "the world overlay places the label of an entry clear of a visible element of the list when it can". Then add a tagged test with a mock occluder `id: 'osh-panel'` that asserts the placement clears the rect. Change D79 to say the same. The named limit `osh-panel-layout-unchecked` can stay.

- [ ] F2 (minor) osh-092 has a WHEN that does not name its two conditions, and the round-2 note says it does: `specs/osh/spec.md:83` and `review/round-2/skeptics.md:3`.
  - Round-2 S2 asked for a WHEN that names "no root answers" and "the hub is full". The WHEN says only "with a key set and a good id". The two conditions are inside the THEN and AND lines.
  - The note "whose WHEN names both cases" is false.
  - Fix: write the WHEN as "... with a key set and a good id, and either no root answers or the hub already has eight datastreams open". Correct the note in `skeptics.md`. Change both spec files.

- [ ] F3 (minor) The real-client test can fail about once in a thousand runs: `src/data/oshLive.test.mjs:2183-2186`, and the wait at `:2204`.
  - `steadyFrames` is counted per `data` chunk with `chunk.split('event: frame').length - 1`.
  - Each frame is 2.67 MB, and HTTP reads arrive in pieces of at most 64 KB. A read boundary inside the 12 characters of `event: frame` loses one count.
  - `until(() => steadyFrames === written, 5000)` then times out and the test fails.
  - The helper `readStream` (`:1949-1951`) already accumulates text.
  - Fix: keep a carry of the last 11 characters. For example: `const text = carry + chunk; steadyFrames += text.split('event: frame').length - 1; carry = text.slice(-11);`.

- [ ] F4 (minor) The osh-094 test task now comes after the page code tasks, which breaks the spec-first order: `tasks.md:139-143`.
  - "Camera panel" is `Origin: spec-first`. Task 7.4 (write the `[osh-094]` tests) comes after 7.1 (`index.html`), 7.2 (`style.css`) and 7.3.
  - Round-2 F8 asked to move the mutation task after the page tasks. The fix moved the test task instead. Before round 3, the test was in 6.3, before the page code.
  - Fix: move the 7.4 test task before 7.1, or split it so the test is written first and 7.1 and 7.2 say "until 7.4 passes".

- [ ] F5 (minor) D74 still says "A message of more than 2097152 bytes closes the socket": `design.md:48`.
  - A text message of any size does not close the socket. `live.js:187` returns before the size check. Round-2 F3 fixed the spec line to "a binary message" but not this design line.
  - Fix: write "A binary message of more than 2097152 bytes closes the socket".

- [ ] F6 (minor) The osh-094 tests do not link the page to the style, and the style test can be satisfied by a comment: `src/data/osh.test.mjs:211-227`.
  - The last line of osh-094 speaks of an element with the class `osh-panel`. No test checks that the `aside` in `index.html` has `class="osh-panel"`.
  - Removing that class leaves every test green. The rule `.osh-panel[hidden]` and all the docking style then do not apply.
  - `readStylesheet` does not remove comments. The regex `/\.osh-panel\[hidden\]\s*\{[^}]*display:\s*none/` also matches a rule inside a comment or a media query. Mutations L20 and L21 remove or change the rule, so they do not show this.
  - Fix: add `assert.match(opening[0], /\sclass="[^"]*\bosh-panel\b/)` to the `index.html` test. Either strip comments before the style regex, or name this in `osh-panel-layout-unchecked`.

- [ ] F7 (minor) Two parts of the new osh-080 lines have no video test: `oshLive.test.mjs:2218-2228` and `spec.md:117-119`.
  - "each client receives the event `down`" and "each client receives `open`": the test has one client.
  - "and then after longer delays": the test checks only the first delay of 1000 ms.
  - The retry code in `live.js` is shared with the live kind, so the risk is low.
  - Fix: add a second client to the test. Close the second socket and assert the 2000 ms delay. Or say in the scenario that the delays are those of `osh-065` and are not repeated for video.

- [ ] F8 (minor) The claim of a real-player run has no record in the repository, and its actor is now wrong: `proposal.md:45`.
  - It says "A person ran the real player in a browser on a synthetic clip". The caller says the lead ran it in headless Chrome. Round-2 F7 asked to remove the claim or record it.
  - Task 7.6, the person's check, is still open.
  - Fix: write "The real player ran once in a headless browser on a synthetic clip. No test repeats it." Or record the run in `review.md`. Keep the person's check as task 7.6.

Checked:
- Round-2 findings. Corrected:
  - STE S1 (key message definition), S3, S4 to S21 (spec, design, tasks, proposal, the test names that are new in this change, and the two comments), and spec-adversary F2 to F9.
  - Spec F1 (`labelArbiter.js`) is named in the proposal Impact. `history.jsonl` shows the same 50/52 flips under `teardown-guard`, so the drift is real.
  - S2 is corrected in its two wrong statements (a ninth datastream, and the two error codes). F2 above is the WHEN.
- The changed and new scenarios, read against the code:
  - osh-079, osh-080, osh-081, osh-090, osh-091 and osh-092 (`live.js`, `osh.js:680-730`).
  - osh-083 and osh-084 (`oshVideo.js`, `videoPlayer.js`).
  - osh-087 (`index.js:289-316`).
  - osh-093 and osh-094 (`worldOverlay.js`, `style.css`, `index.html`).
  - Except for F1, F2 and F5, each line matches the code.
- The new tests read:
  - The text message of 2097153 characters, the video `down` then `open`, the exact limit of 8388608, and "socket writes no message frame". Their mutations V17 to V19, V23 and V24 would fail them.
  - The real HTTP client test is loopback only and bound to 127.0.0.1. It writes at most 60 messages and stops when the lagging response closes. `steady` cannot reach 8 MB of backlog, because it reads about 2 MB per loop turn. Only F3 is a flake risk.
- The base requirement text of "GET only" and "Live layer" is not in the round-3 diff. The synced spec matches the delta for osh-079 to osh-094.
- Trace:
  - `links.json` has all renamed and new names (18 of 18 patterns).
  - `ids.json` has osh-092 to osh-094.
  - No old test name is left in `links.json` or `gaps.json`, and `retired-ids.json` has no osh ID.
  - The `history.jsonl` lines for this change are the same as in round 2.
- Standing constraints: no `send` outside a comment in the scanned files, no non-GET method, no network call except loopback, no real host or stream ID. No test that exists on `main` was renamed. `format-scope.json` has no OSH test file, so the long lines in the new test do not matter.

Could not check:
- I cannot run code, the lint, the ratchet, the mutations, or the gates run after the archive, so I did not see gate warnings.
- I could not check real Node behaviour of `writableLength` and `destroy()`, or the headless Chrome run.
- I could not check the STE limits by tool. The new sentences I read are 25 words or fewer.
- I could not run `git diff` against `main` for the base spec text. I relied on the diff hunks, which start after the carried scenarios.
- The real VideoDecoder is a known limit.
