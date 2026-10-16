Verdict: FAIL
Tip 097c91c6 (read from .git/refs). Full scope. Read only: no run, no git. Replacement texts are not STE-linted. Purpose and merged osh and frames specs match base.
P=openspec/changes/archive/2026-10-16-beemaps-burst-panel S=openspec/specs/beemaps-bursts/spec.md L=src/layers/beemapsBursts

- [ ] FINDING major S:242 @097c91c6 "treat any answer as unknown when the server did not state a refusal" also covers a clear created answer, so it contradicts 023. Write: unknown unless the server clearly states a created burst or a refusal.
- [ ] FINDING major S:165 @097c91c6 Last AND of 016: no test asserts a Confirm chip for a new quote after an unclear answer (L/layer.test.mjs:1108 stops at the info text). "The server then refuses ... its hold" is false when the server created the burst and the answer was lost (status 0): ledger.js:132 holds only unknown or pending records, and a stored list can hide it. Step 9 of the browser run shows the hold only after a server 502. Test the chip; fix this line and P/proposal.md:57.
- [ ] FINDING major S:224 @097c91c6 "a press that changes no box asks for no frame" is contradicted by L/registration.test.mjs:151-168 (same ID): a list press with bursts [] changes no box and gets a frame, because draw() (L/index.js:125) always asks. P/design.md:90 (D16) has the same wording. Compare the boxes, or name the events that ask.
- [ ] FINDING major P/evidence/mutations.txt:360 @097c91c6 Equivalent reason is false. Input: update() answers enabled:false while a quote request is open, then the quote answers ok. The code keeps "Bursts are off..." in the info text; the fault (if (true), L/index.js:172) clears it. Add a test and an AND in 005.
- [ ] FINDING major L/layer.test.mjs:2055 @097c91c6 Cannot fail: the cancel handler belongs to layer q, the assertion reads layer h, and typeof stale is constant. Assert on q or delete it.
- [ ] FINDING major P/evidence/mutations.txt:738 @097c91c6 Rule 13: no test destroys the layer while a quote is shown (destroy calls at L/layer.test.mjs:246,279,871,912,1156,1499,1791,2144 follow no quote or an open confirm), and no fault "Confirm on destroy" exists. "if (_quote) pressConfirm(_quote)" in destroy would pass. Also unnamed (tests likely catch): confirm in unlock(), a retry in source.confirm.
- [ ] FINDING major S:227 @097c91c6 "MUST tell the panel through its listener when the controls or the info text change" is false for enable, disable and destroy (L/index.js:336-345,442-452 never call notify). Name the events of 030.
- [ ] FINDING minor L/index.js:140 @097c91c6 unlock() runs on a 1000 ms timer, but the chip tests now() >= unlocksAt (:388). A timer that fires 1 ms early leaves the chip disabled with no later notice. Not a Known limit.
- [ ] FINDING minor P/evidence/browser-run.txt:58 @097c91c6 Steps 4 and 8 show a lower bound only (1927, 3207 ms) and no run without the lock.
- [ ] FINDING minor DATA_SOURCES.md:107 @097c91c6 and CHANGELOG.md:3: "offers no second confirm" has two meanings; one contradicts new-quote-after-unclear.
- [ ] FINDING minor L/index.js:268 @097c91c6 {outcome:'created'} with no burst throws before the warning text is set (016: "unknown shape"). The real source cannot give it.
- [ ] FINDING minor P/proposal.md:50 @097c91c6 status-once still says "enabled or updated", the phrase the plan review fixed in the requirement.
More minors on request.
