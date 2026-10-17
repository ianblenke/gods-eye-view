Verdict: PASS

Tip commit 9822c2f4, confirmed in `.git/refs/heads/beemaps-frames-limits`. The scope is the diff 9515c3d9..9822c2f4. C is `openspec/changes/archive/2026-10-17-beemaps-frames-limits`. I found no critical or major finding.

**My round-3 findings**
- **Major (credits "when the answer reports them"): corrected in all three files.**
  - Grep for `reports them`, `one line to`, `one log line` and `one line for` finds the old wording nowhere outside `review/` files and `design.md:78,88`. Those two design lines are not in the diff, and they are true.
  - The new wording is in `DATA_SOURCES.md:112`, `proposal.md:15` and `CHANGELOG.md:3`.
  - **Failure path:** `upstream.js:96-98` sends a reply that is not 2xx to `failureOf` and never reads its body. `upstream.js:38-44` drops a body over 4 MiB. `beemaps.js:155-157` then writes the failed line with no credit field. The statement "a JSON body with a status from 200 to 299" excludes these cases. `response.ok` is exactly 200 to 299.
  - **Read-body path:** for a JSON body read on 2xx, `beemaps.js:173` writes `creditsUsed`, `creditsRemaining` and `cost`. `beemaps.js:168` writes `creditsUsed` for a body of the wrong shape. Tests in `beemapsLog.test.mjs` pin both: lines 183-196, 236 and 286-316.
  - **Body that is not JSON:** the sentence says "JSON body", so it also excludes the non-JSON 2xx case.
- **Minor ("one line"): corrected.** "one result line" is now in `DATA_SOURCES.md:112`, `CHANGELOG.md:3` and `proposal.md:15`. Spec 029 and the comment at `beemaps.js:24` use the same term. The `credits.add` call (`beemaps.js:162-164`) writes the extra line "[beemaps] credits file not written" before the result line.

**Faults that the corrections add**
- The words are consistent between the files.
- Sentence lengths:
  - The longest new sentence has 24 words (CHANGELOG). The new DATA_SOURCES sentence has 20 words and the proposal sentence has 21.
  - The paragraph at `DATA_SOURCES.md:112` has 4 sentences.
  - The CHANGELOG entry has 6 sentences.
- No word from `words.json` is in the new text. "reads" is a verb, so the `nounVerbs` warning does not apply.
- `proposal.md:72` (the kept Known limit `comment-in-proxy-test`) is true.
  - `beemapsProxy.test.mjs:993-996` sets `cacheDir` to a file.
  - `budget.js:33` reads `x/budget.json` with the real `fsp`, which gives ENOTDIR. Then `load()` throws and `reserve()` returns `unavailable` (lines 59-62), so the test stops at the read.
  - The credit file uses the fake `creditFs` (ENOENT), so `credits.check()` passes (`credits.js:46`).
  - `beemapsBudget.test.mjs:259-276` is tagged 017 and has a `writeFile` that fails. It asserts `unavailable`, then a later write that works.
  - Keeping it as a minor Known limit is right. Fixing the comment needs a test-file change and so another ratchet. A false comment in a test is not a major on the owner list, because it is not normative.

**Minor findings (at most five; the author can record them as Known limits)**
- [ ] FINDING minor DATA_SOURCES.md:112 and proposal.md:15 (9822c2f4) "a JSON body with a status from 200 to 299": the status belongs to the reply, not to the body. The phrase "with a status" can attach to "reads" or to "body". The sentence is true under each reading. Optional text: "When the reply has a status from 200 to 299 and a JSON body, the line also has its credits."
- [ ] FINDING minor DATA_SOURCES.md:112 (9822c2f4) "the line also has its credits" does not say that a JSON body without a number gives `creditsUsed=none creditsRemaining=none cost=none` (`beemapsLog.test.mjs:189`). A body of the wrong shape gives `creditsUsed` only (`beemaps.js:168`). The sentence is true if "its credits" can be "none". It is not a defined term in a user document.

Files read: `/home/ianblenke/docker/gev-work/beemaps-frames-limits/server/providers/beemaps.js` (lines 15-250), `server/providers/beemaps/upstream.js`, `credits.js`, `budget.js`, `normalize.js:64-84`, the spec `specs/beemaps-source/spec.md` (029-035), `design.md` (8-19, 66-100), `proposal.md`, `src/data/beemapsProxy.test.mjs:940-1001`, `beemapsBudget.test.mjs:236-295`, `beemapsLog.test.mjs` (grep), `openspec/ste/words.json`, and the round-3 reports.
