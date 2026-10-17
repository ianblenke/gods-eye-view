Verdict: FAIL

Tip commit 9515c3d9 (read from `.git/refs/heads/beemaps-frames-limits`). The scope is `git diff 698fa03f 9515c3d9` for `proposal.md`, `design.md`, `DATA_SOURCES.md` and `CHANGELOG.md`. C is `openspec/changes/archive/2026-10-17-beemaps-frames-limits`.

- [ ] FINDING major DATA_SOURCES.md:112 and C/proposal.md:15 (9515c3d9) The round-2 correction added a false statement. The text says the log line has the credits "when the answer reports them". `design.md:14` defines an answer as the reply of Bee Maps. That includes an error reply and a body over 4 MiB.
  - **The route:** `upstream.js:96-98` sends a reply with a status other than 2xx to `failureOf` and never reads its body. `upstream.js:38-44` drops a body over 4 MiB. `beemaps.js:155-157` then writes `failed kind=... status=... bytes=... ms=...` with no credit field.
  - **The spec and the test:** Spec 030 (lines 31-38 and 40) gives the same lines. The test at `beemapsCredits.test.mjs:232` builds `new Response('{"creditsUsed":99}', {status:500})`. The log line for it has no credits.
  - **Why it matters:** The over-limit reply is the most likely cause of the owner's failure (proposal.md:7). It is the case where the log must be exact. The wording is true only if "answer" means a JSON body that the route reads, and that reading is not the defined one. Only the CHANGELOG wording "any credits" is true under each reading.
  - **Correction:** In DATA_SOURCES.md:112 write "The line has the status, the size and the time. When the route reads a JSON body, the line also has the credit fields of that body." In proposal.md:15 write "...and the time, and it names the credits when the route reads a JSON body." Spec 029 and 030 agree with this wording: a good answer has three credit fields, and a wrong-shape JSON body has `creditsUsed`, also for `null` and `[]`.
- [ ] FINDING minor DATA_SOURCES.md:112 (9515c3d9) "The route writes one line to the log ... for each upstream request" is not exact. Spec 035 lines 118-119 and `beemaps.js:162-164` add the line "[beemaps] credits file not written" before the result line. proposal.md:15 and spec 029 say "one result line". Write "one result line".

Checks of my round-2 findings, with the files read again:
- **frames-dropped-by-route (proposal.md:67), complete.** `source.js:62` sends `limit: FRAME_LIMIT` (200). `beemaps.js:208` cuts with `slice(0, limit)`, and `validate.js:7` caps the limit at 200. Grep shows no other use of the old name.
- **DATA_SOURCES.md:116, complete.** `getFrames` is called only from `press()` (`index.js:109`). `update()` calls `getStatus` only.
- **comment-in-proxy-test (proposal.md:72), complete and true.**
  - The test sets `cacheDir` to a file. The real `fsp.readFile` gives ENOTDIR at `budget.js:33-36`, so `reserve` returns `unavailable` before any write.
  - The comment is at `beemapsProxy.test.mjs:985`.
  - `beemapsBudget.test.mjs:259` (tag 017) shows the failed write.
- **lines-without-test (proposal.md:71), true.**
  - No 034 test sends a request that a step before the hold step refuses.
  - The only earlier-step case is the memory answer at `beemapsCredits.test.mjs:546`, and that step answers.
  - No 033 test makes a timeout or a body that is too large.
- **Box sentence (proposal.md:29), true.** The base text in `archive/2026-10-16-beemaps-burst-panel/specs/beemaps-bursts/spec.md:62` was one sentence. The delta splits it in two.
- **proposal.md:36, true.** The added `bbox` assertions are at `layer.test.mjs:586` (009), `:636` (010) and `:698` (011). The titles for 006, 007 and 008 differ from main.
- **design.md:86, true.** `credits.js:95` sets the text at the time of the addition.
- **Other round-2 items, complete.** "crash after an answer and before the plugin writes the credit file", "A file keeps the count across a restart", "unit with no link to that balance" and "Bee Maps can use credits for" are in place. "whether" in DATA_SOURCES.md:114 is old text, as the base line 108 shows.
- **New prose:** No word from `words.json` is in the new prose. The longest new sentence has 25 words (proposal.md:15). The CHANGELOG entry has 6 sentences.
