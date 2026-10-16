Verdict: PASS
Tip read: 509c4156, in the working tree of the clone. I have no git, so I cannot confirm that the tree equals the tip.

I found no critical and no major finding. The round-3 STE major (CHANGELOG.md:3 and DATA_SOURCES.md:105, "at most one create request") is corrected. The round-3 minors are corrected, but some corrections added the faults below. Searches found:
- No "redraw" is left in the spec, the design, the tests, CHANGELOG.md, DATA_SOURCES.md or the evidence. Only the history line mutations.txt:51 names it.
- No "text `id`" and no old title of 024 is left.
- No banned word or form of it is in the changed lines.
- D17 and the Known limit `lost-answer` are true against ledger.js:132-133 (600 seconds, "unknown" or "pending").
- browser-run.txt:15 agrees with both transcripts.

- [ ] FINDING minor openspec/changes/archive/2026-10-16-beemaps-burst-panel/specs/beemaps-bursts/spec.md:232 @509c4156 (main spec line 235; design.md:89-90) "draws the boxes" was my own round-3 replacement text. It can mean every call of `draw()`, also one that leaves no box, or only a draw that puts a box on the globe. `layer.test.mjs:2194-2195` (cancel), `2203-2204` (disable) and `2429` (list with no burst) need a render with no box drawn, and no 020 line names them. Line 234 treats "removes the box" as a separate case. I rate it minor because the code and the tests follow the first reading. If you read it the other way, it is two meanings in a scenario. In design.md:89-90 "draw" also names the renderer ("does not draw a new image", "drew a new image"). Write: "each time the layer draws its boxes, also when it draws none, it calls ...". In the design, write "does not render a new image" and "until something else rendered a new image".

- [ ] FINDING minor openspec/changes/archive/2026-10-16-beemaps-burst-panel/specs/beemaps-bursts/spec.md:186 @509c4156 (main spec line 189; proposal.md:5; layer.test.mjs:1573) Scenario 029 defines "lock" by an appositive: "until T plus 1000 milliseconds, the lock of the Confirm chip, the Confirm chip keeps ...". The lock can read as a second time limit. `proposal.md:5` "a lock of one second" names no object. `layer.test.mjs:1573` still says "its own period of 1000 milliseconds", and scenario 029 says "its own lock". Write: "THEN the lock of the Confirm chip is the time from T to T plus 1000 milliseconds" and "AND in the lock the Confirm chip keeps its label and is disabled". Write "a lock of the Confirm chip for one second after the quote shows" in the proposal. Write "gives the next quote its own lock of 1000 milliseconds" in the test title. A change of the scenario or the title needs a new ratchet.

- [ ] FINDING minor openspec/changes/archive/2026-10-16-beemaps-burst-panel/design.md:102 @509c4156 The corrected Risks line has "keeps refusing", which is an -ing form. It also dropped the bound of 600 seconds that D17 gives, so it reads as unbounded. Write: "After an unknown or pending record of its own, the server refuses new confirm requests until 600 seconds after that record."

- [ ] FINDING minor openspec/changes/archive/2026-10-16-beemaps-burst-panel/proposal.md:59 @509c4156 In the new Known limit `empty-id`, "such a row" uses "row" for a test case. `proposal.md:10` and the CHANGELOG use "row" for the panel row. I checked the claim against the files. The tests `records.test.mjs:195` and `source.test.mjs:458` have `id: ''`, and the layer tests have none. Write: "No test of the layer gives the layer such an answer."

- [ ] FINDING minor openspec/changes/archive/2026-10-16-beemaps-burst-panel/evidence/mutations.txt:51,567 @509c4156 Line 51: "No fault changed." follows "Ten faults got a new name" and can read as a contradiction. Write: "The edit of each fault stayed the same." Line 567: "Skip the draw after a confirm answer" uses "draw" as a noun. `faults.py:550` removes the call `draw();`. Write: "Skip the call of draw after a confirm answer". The name lives in the fault script and in its logs, so a rename means a new run of the generator. I did not check how it reads names.

Not reported:
- "sends one create request" in DATA_SOURCES.md:101 and CHANGELOG.md:4 are change-3 lines about the route. They are outside this diff.
- I am not sure about the STE status of "match" (Browser source requirement), "treat" and "draw". The change used them in earlier rounds, and the lint passes.
