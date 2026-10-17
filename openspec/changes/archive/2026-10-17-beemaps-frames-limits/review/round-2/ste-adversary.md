Verdict: FAIL
Tip commit 698fa03f, scope diff eefb43af. C = openspec/changes/archive/2026-10-17-beemaps-frames-limits.

Round-1 corrections, checked with Grep:
- **Balance:** no claim is left. Only design.md:25 states it, and :78 and :130 now name Bee Maps.
- **"not valid":** 0 hits in proposal.md. Line 60 says "not JSON".
- **"paid":** 0 hits.
- **"can pass":** 0 hits.
- **Sentence and paragraph lengths:** the longest sentence is 24 words. Paragraphs have 3 to 5 sentences. The CHANGELOG entry has 6.
- **Test titles:** KEPT. The reason is true and no title has a banned word, so they stay minor.
- **Other kept items:** the log text "credits file not written", "its own answer" in spec 033, "write" as a noun in spec 035 and beemaps.js:24. The reasons are true, so they stay minor.

- [ ] FINDING major C/proposal.md:67 (698fa03f) Known limit `frames-dropped-by-layer` says "the layer drops the others". The layer asks for `limit: 200` (src/layers/beemaps/source.js:62). The route cuts the list with `entry.frames.slice(0, limit)` (server/providers/beemaps.js:208), so the layer never gets the other frames. The name and the sentence contradict proposal.md:9 ("The route also asks for frames that it drops") and design.md:5. The old text had no agent, and the correction added the false one. Write the name `frames-dropped-by-route`. Write: "...more than 200 frames. The route sends 200 to the layer and drops the others. Bee Maps can use credits for them." Grep shows no other file uses the name.
- [ ] FINDING major DATA_SOURCES.md:114 (698fa03f) "Nothing else sends a request." is an unbounded claim, and the code disagrees with it. The layer sends GET /api/beemaps/status with no press (src/layers/beemaps/index.js:162-169 `update()`; source.js:31). The old text, "nothing else sends one", meant one frames request. The split made it "a request". Write: "No other action sends a request for frames."
- [ ] FINDING minor C/proposal.md:51,60,67 "count" has three meanings: the credit count of the route (design.md:17), "a count apart from that balance", and "Bee Maps can count the credits". "their" at :67 can mean the others or the 200 frames. Write: "can be a unit with no link to that balance" and "Bee Maps can use credits for these answers".
- [ ] FINDING minor C/proposal.md:16,29 "A restart keeps the count": a restart cannot keep a count. Write: "A file keeps the count across a restart." At :29 "It splits that sentence": "It" can be the text. Write: "The delta splits that sentence in two."
- [ ] FINDING minor DATA_SOURCES.md:112 "whether" is not STE, and the correction changed it to "if" in proposal.md. Write: "They do not say if other people can see the data".
- [ ] FINDING minor DATA_SOURCES.md:112, CHANGELOG.md:3, C/proposal.md:15 "the line has ... the credits" is true only for a good answer. A failed line has no credits, except for a JSON body of the wrong shape (spec 030; beemaps.js:156). Write: "A good answer adds the credits to the line." The spec holds the exact fields, so this stays minor.
- [ ] FINDING minor C/design.md:86 "it fixes the text at the addition": "fix" can mean "repair" (spec 035 uses "repairs"). I am not sure that STE approves "fix" for "set". Write: "it sets the text at the time of the addition."
