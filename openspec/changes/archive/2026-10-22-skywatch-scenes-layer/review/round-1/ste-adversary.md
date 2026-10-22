Verdict: FAIL

STE adversary, round 1 (scope: full), change skywatch-scenes-layer, tip commit 95f26aee. I only read files. Each spec finding also applies to `openspec/specs/skywatch-scenes-layer/spec.md`.

- [ ] FINDING major openspec/changes/archive/2026-10-22-skywatch-scenes-layer/specs/skywatch-scenes-layer/spec.md:47 (95f26aee) The requirement says "MUST read the status route at each call of `update`". This disagrees with its scenario at line 24 ("`update` on a layer that is not enabled returns false, and the layer calls no function of the source"). It also disagrees with src/layers/skywatchScenes/index.js:319. Write: "The layer MUST read the status route at each call of `update` while it is enabled."
- [ ] FINDING major openspec/changes/archive/2026-10-22-skywatch-scenes-layer/specs/skywatch-scenes-layer/spec.md:298 (95f26aee) "MUST show the footprints of the answer to its newest press" has two meanings. In this spec, "answer" is the HTTP answer, which can fail (line 147). It is also the result of `normalizeAnswer` (line 143). Under the first meaning, a newest press that fails shows no footprints. That disagrees with "keep them when a later press fails" and with line 315. Also, "release everything when it is disabled" disagrees with line 324 (the data source stays, hidden) and line 333 (only destroy removes it). Write: "While it is enabled, the layer MUST show the footprints of its newest good answer, also after a later press fails. When the manager disables it, it MUST stop each request and remove the footprints and the card. When the manager destroys it, it MUST release everything." I did not check the effect on the trace hashes.
- [ ] FINDING minor openspec/changes/archive/2026-10-22-skywatch-scenes-layer/specs/skywatch-scenes-layer/spec.md:391 (95f26aee) "after the abort of its request" uses a verb as a noun. Write: "after the layer aborts its request".
- [ ] FINDING minor src/layers/skywatchScenes/source.test.mjs:384,552 (95f26aee) Some test titles use the passive or the present perfect, and two names for one signal:
  - source.test.mjs:384 "the signal of the caller is aborted". The spec (lines 155-158) and source.test.mjs:350 say "the signal of the call". Write "when the signal of the call aborts".
  - source.test.mjs:552: write "when that signal aborts".
  - layer.test.mjs:755: write "a status request that ended".
  - layer.test.mjs:782: write "and can initialize again".
  - layer.test.mjs:1180: write "after the layer aborts its request".

  The new names change the trace links and the titles in evidence/faults.txt.
- [ ] FINDING minor openspec/changes/archive/2026-10-22-skywatch-scenes-layer/tasks.md:36,53 (95f26aee) "row" has three meanings:
  - the row of the layer in the panel (proposal.md:5, design.md:55)
  - a row of the ledger (tasks.md:36,53, design.md:65)
  - a sample line of the spec (box.test.mjs:11,162 and messages.test.mjs:15,100)

  Each text is true in its context. In the test titles, write "the samples of the spec" and "the text of its sample".
- [ ] FINDING minor docs/CURRENT-STATE.md:4713 (95f26aee) This changed line has the banned word "explicit" ("explicit OFF"). Also, "The script proves ... legacy-token compatibility" can be read as a completed proof, but evidence/browser.txt:68 says that check did not run. Write: "The script checks encoding, a cold-recipient reload, restoration, an OFF action of the user, and legacy-token compatibility." I know the OFF step of the script only from its PASS line.
- [ ] FINDING minor openspec/changes/archive/2026-10-22-skywatch-scenes-layer/specs/skywatch-scenes-layer/spec.md:218,219 (95f26aee) The UI text "The daily limit of 20 searches is used." (messages.js:59-60) is passive. Also, "is used" can mean that the limit applies or that it is spent. Write, for example: "No more searches today. The daily limit is 20." This needs a change to the scenario, the test, the code and the faults.

I did not list some other minor items:
- proposal.md:37 uses the present tense for how the QA script and CURRENT-STATE.md were before the change.
- The spec uses two names for one text: "info text" and "readout".
- The chip has two names: "search" and "Search scenes here".
- "press" is used as a noun. I am not sure that STE refuses this.

I found no SHALL, SHOULD or MAY. I found no banned word in the change documents or the new test titles. The UI texts in the spec are the same as the texts in messages.js and model.js. Ask me if you want the other minor items.
