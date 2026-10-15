Verdict: PASS

Tip commit 26d6cffde7d77e479efa1fcf18dd0ca904d7e508, checked against `.git/refs/heads/beemaps-source`. I ran nothing and called no one. I found no critical and no major finding.

- [ ] FINDING minor openspec/changes/archive/2026-10-15-beemaps-source/specs/beemaps-source/spec.md:76,78,79,126,145,157,172,179,218-221,226-228,235 (26d6cffd) Passive voice in normative text where the active voice is possible. The lint warns about each line, and the same text stands in `openspec/specs/beemaps-source/spec.md` at 79-82, 129, 148, 160, 175, 182, 221-224, 229-231 and 238. A scenario change costs another ratchet, so accept the finding by name, or change the lines with the next ratchet. Write:
  - ":218 the route drops an item when its `timestamp` is not a text of the form ..."; the same shape for :219-221, :226, :227 and :235.
  - ":228 the route orders the frames with the newest first, and with the smaller `id` first for equal times".
  - ":76 the route refuses the box"; the same for :78, :79 and :172 ("the route refuses the 7th request").
  - ":126 It MUST refuse a call when the count has reached the daily limit." This agrees with scenario 016 ("when the count is at least the daily limit").
  - ":145 or the route cannot write it"; ":157 the route serves an answer that is 599 seconds old from memory, and not an answer that is 600 seconds old".
- [ ] FINDING minor openspec/changes/archive/2026-10-15-beemaps-source/design.md:7,39,63,67,84 and proposal.md:3,44 (26d6cffd) STE-NOUN "one read call" (design.md:7), and passives ("cannot be written", "are rounded", "is dropped", "can be refused"; "to be mapped", "is refused"). Write: ":7 The Bee Maps API has one call that reads new frames"; ":39 or the provider cannot write it"; ":63 The provider rounds `lat` and `lon` to 6 decimals"; ":67 The provider drops an item of another shape"; "proposal.md:3 a way to ask Bee Maps to map an area again".
- [ ] FINDING minor proposal.md:46 (26d6cffd) Known limit `no-failure-hold` names only "500 or the wrong shape". In `beemaps.js`, `startHold` acts for `key_rejected`, `no_credit` and a `429` only. Every other failure starts no hold: any other status, a timeout, a thrown error and a body that is not JSON. Write: "An upstream failure other than 401, 402, 403 and 429 starts no hold. Such a failure is another status, a timeout, a thrown error or a body of the wrong shape. Each one lets 6 requests in 60 seconds use the default daily limit of 20 in about 3 minutes."
- [ ] FINDING minor test titles (26d6cffd) Three titles use the passive voice and two use `toISOString`, which the lint flags as an -ing word.
  - beemapsBudget.test.mjs:252 "cannot be written": "when the route cannot write the file".
  - beemapsProxy.test.mjs:494 "is stored again": "that the memory stores again".
  - beemapsProxy.test.mjs:910 "is used": "when the count has reached the daily limit".
  - beemapsFrames.test.mjs:94,156 "toISOString": "writes the time as an ISO text".
  - A title change needs the next ratchet, or accept the finding by name.

Checked, no finding:
- The Purpose of design.md equals, word for word, the Purpose of `openspec/specs/beemaps-source/spec.md`. It has 3 sentences of 25 words or fewer.
- Tasks 1.1 to 4.1 are ticked and true, 4.2 to 4.4 are open, and each task has one verb and fewer than 20 words. All 28 IDs are named.
- mutations.txt counts agree with the raw lines: 340 fault lines (89-428), 306 + 18 + 16, 2 lines "failing: NONE" that are the 2 equivalent faults, and the scenario of every fault line among its failing tests. I read all the lines of the final 16.
- The evidence commit statements agree with the reflog (7ca52ba9, then evidence, trace and archive commits). 118 titles = 118 tests in the image, and 117 on the host with 1 skipped.
- The Known limits `status-sources` (401 only under `/mcp`, line 932 of the description), `local-programs`, `box-area`, `ring-order` and `status-gate` agree with the code and the description.
- The comments of `validate.js` and `normalize.js` are plain. Grep finds no banned word in the prose or the titles.

Not checked: the raw logs of the two fault runs ("identical lines"), the SHA-256 values, the size 87599 bytes, the example id, the live API, and the rest of local-run.txt (I re-read only its header).
