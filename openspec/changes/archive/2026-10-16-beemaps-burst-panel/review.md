# Review: beemaps-burst-panel

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-16
Gates: make gates CHANGE=beemaps-burst-panel passed
Rounds: 4
Scope: diff f6775e303f486518591e745fbb28043c73e8ca41
Reviewed-Tree: 1cde313718dedc656300e02b0dc3b235a16b3109f6d88ff8d24a0dbaef36ef57

## Findings

The reports of rounds 1, 2 and 3 are in `review/round-1/`, `review/round-2/` and `review/round-3/`. The reports of round 4 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word.

The review agents of this session are the teammates `bp-spec-adversary-r1` to `bp-spec-adversary-r4` and `bp-ste-adversary-r1` to `bp-ste-adversary-r4`. They do the task of `spec-adversary` and `ste-adversary`. The brief of each round gave the severity rule of the owner.

A plan review came before the code. Both plan reviewers gave FAIL, and the lead corrected all findings before the code was final. Round 1 had the scope full, at the commit 097c91c6. Both reviewers gave FAIL.

Round 2 had the scope diff 097c91c6, at the commit 9d578461. Both reviewers gave FAIL again. The lead made the corrections in code, tests, faults and documents, and the fault runs, the browser runs and the ratchet ran again.

Round 3 had the scope diff 9d578461, at the commit f6775e30. Both reviewers gave FAIL with 3 major findings in all. Round 4 had the scope diff f6775e30, at the commit 509c4156. Both reviewers gave PASS with minor findings.

The fault runs and the browser runs did not run again after round 3, because the lead changed no code and one test title and one test comment only. The ratchet ran again. The lead corrected the minor findings of round 4 that lie in the proposal and in the design. The lead kept three minor findings of the STE adversary, and the entries below say why. One attempt of browser run 2 stopped with a timeout in round 2, and the evidence says so.

### Round 1 (commit 097c91c6)

- [x] FINDING major (spec adversary) The sentence "treat any answer as unknown when the server did not state a refusal" also covered a created answer. Fixed: the source treats an answer as unknown unless the answer matches the rules of scenario 023 for a created burst or a refusal.
- [x] FINDING major (spec adversary) No test asserted a Confirm chip for a new quote after an unknown answer, and the hold claim was false when the server created the burst and the browser lost the answer. Fixed: the chip "quote" stays disabled after an unknown answer until a fresh list answer (design D17, scenario 016, Known limit `lost-answer`). New tests and new faults cover it, and step 9 of the browser run runs it.
- [x] FINDING major (spec adversary) The sentence "a press that changes no box asks for no frame" was false for a list answer with no burst. Fixed in round 1 and again in round 2: scenario 020 names the events that call `requestRender`.
- [x] FINDING major (spec adversary) The reason of the equivalent fault "Clear the status text of a good status after a press" was false. Fixed: the fault is a real fault, and a new test of scenario 005 kills it.
- [x] FINDING major (spec adversary) A test of scenario 011 could not fail, because the assertion read another layer. Fixed: a new test asserts on the same layer.
- [x] FINDING major (spec adversary) No test destroyed the layer while a quote was shown, and no fault confirmed from destroy, from the timer of the lock or from the source. Fixed: new tests and the faults "Confirm on destroy", "Confirm when the timer of the lock runs" and three faults that send a second confirm request in the source.
- [x] FINDING major (spec adversary) The requirement "Panel notice" was false for enable, disable and destroy. Fixed: the requirement names the events, and a test of scenario 030 asserts that the three methods call no listener.
- [x] FINDING minor (spec adversary) A timer of the lock that runs early left the chip disabled with no later notice. Fixed: the timer starts a new timer for the rest of the lock (scenario 029, tests, faults).
- [x] FINDING minor (spec adversary) The browser run shows the lock as a lower bound only. Accepted by the lead: the unit faults pin the lock to 1000 milliseconds.
- [x] FINDING minor (spec adversary) The words "offers no second confirm" had two meanings. Fixed in the CHANGELOG and in DATA_SOURCES.md.
- [x] FINDING minor (spec adversary) A created answer with no burst threw before the warning text was set. Fixed: the layer treats it as an unknown answer.
- [x] FINDING minor (spec adversary) The Known limit `status-once` said "enabled or updated". Fixed: "when it is updated".
- [x] FINDING major (STE adversary) The sentence about the unknown answer in the Browser source requirement contradicted scenario 023. Fixed with the first major finding of the spec adversary.
- [x] FINDING major (STE adversary) The words "and no other field" were false for the quote request, which also sends the signal. Fixed in the scenario and in the test title.
- [x] FINDING major (STE adversary) The words "a source without" had two meanings in scenario 001. Fixed: "a source that lacks one of the four methods", also in the test title.
- [x] FINDING major (STE adversary) The sentence about the state after disable and enable was false for a burst that a created answer adds. Fixed: scenario 017 names the exceptions.
- [x] FINDING major (STE adversary) Tasks 4.1 and 2.14 gave two instructions each. Fixed: each task is split in two.
- [x] FINDING major (STE adversary) The CHANGELOG and DATA_SOURCES.md said "a second press of the Confirm button" and "offers no second confirm". Fixed: "only a press of the Confirm chip, after a press of Quote burst here".
- [x] FINDING major (STE adversary) A comment of the layer said "never sends a request again after an error". Fixed: "sends no request by itself after an error".
- [x] FINDING major (STE adversary) The reason of the equivalent fault in `evidence/mutations.txt` was false. Fixed with the fourth major finding of the spec adversary.
- [x] FINDING minor (STE adversary) Banned words "may have taken", "requires" and "require" were in the code and in the fault names. Fixed. One replacement of the reviewer was wrong ("can have taken"), and round 2 fixed it.
- [x] FINDING minor (STE adversary) Two sentences used the present perfect. Fixed in the spec and in a test title.
- [x] FINDING minor (STE adversary) The words "new confirms" and "second confirm" used a verb as a noun. Fixed: "new confirm requests".
- [x] FINDING minor (STE adversary) The words "button", "not clear" and "unclear" named the chip and the unknown answer. Fixed: "chip" and "unknown".
- [x] FINDING minor (STE adversary) The word "frame" had two meanings, and "takes its place" and "wins over" were vague. Fixed in round 2 and in round 3.

### Round 2 (commit 9d578461)

- [x] FINDING major (spec adversary) Scenario 020 said that a press that ends with an error redraws nothing, which is false for a refused or unknown confirm. Fixed: the scenario names the events. A new test covers a failed list (0 calls) and a refused confirm request (1 call), and another covers a list answer with no burst (1 call).
- [x] FINDING major (spec adversary) The proposal said "one create request for each two-press confirm". Fixed: "at most one create request", with the held confirm request that gives none.
- [x] FINDING major (spec adversary) No fault told the panel from enable, disable or destroy. Fixed: the faults "Tell the panel on enable", "on disable" and "on destroy".
- [x] FINDING major (spec adversary) No test showed that an unknown answer that comes while the layer is disabled disables the chip "quote" after the next enable. Fixed: a new AND in scenario 017, an assertion in the test and the fault "Disable the quote chip only while the layer is enabled".
- [x] FINDING minor (spec adversary) No sentence, test or fault said that `update` leaves the chip "quote" disabled. Fixed: a sentence in scenario 016, a test and two faults.
- [x] FINDING minor (spec adversary) The Known limit `warning-in-memory` did not name `destroy`. Fixed.
- [x] FINDING minor (spec adversary) Design D14 still said "takes its place", and the word "frame" remained. Fixed.
- [x] FINDING minor (spec adversary) The evidence compared a commit with itself, and step 9 of the browser run printed no title and no chip state. Fixed: the comparison uses HEAD, and the driver prints the title and the state of the chip.
- [x] FINDING minor (spec adversary) The equivalent fault "Confirm after the list press" did not name its place, and no fault confirmed after a list answer. Fixed: the reason names the place, and the fault "Confirm after the list answer" fails tests of four scenarios.
- [x] FINDING major (STE adversary) Scenario 020 was false for the Confirm chip. Fixed with the first major finding of the spec adversary.
- [x] FINDING major (STE adversary) The title of a test of scenario 020 repeated the false claim. Fixed: the title names a view with no box and a failed quote, and later a new title.
- [x] FINDING major (STE adversary) The Known limit `lost-answer` said "only after an unknown record", and a pending record also holds. Fixed in round 2 ("unknown or pending"), and again in round 3.
- [x] FINDING major (STE adversary) Scenario 029 said "tells the panel when the timer runs", which is false for an early timer. Fixed: "tells the panel when the lock ends".
- [x] FINDING minor (STE adversary) The title of the disabled chip, "A burst is possible.", had two meanings. Fixed: "It is possible that Bee Maps made a burst. Press Check my bursts first." The code changed, so the fault runs and the browser runs ran again.
- [x] FINDING minor (STE adversary) Corrections of round 1 were not complete ("takes its place", "frame", "Require", the title of D16). Fixed.
- [x] FINDING minor (STE adversary) The words "wait" and "block" were verbs used as nouns, and three phrases named a list answer with `cached` false. Fixed: "lock", "disabled chip" and "fresh list answer".
- [x] FINDING minor (STE adversary) Corrections of round 1 added faults of their own ("has checked", "Suppose", "as does a reload", "clearly", "can have taken"). Fixed.
- [x] FINDING minor (STE adversary) The evidence compared a commit with itself, and a line of the transcript said "a new quote is held". Fixed: HEAD, and the driver text says that the server holds the next confirm request.

### Round 3 (commit f6775e30)

- [x] FINDING major (spec adversary) The evidence said "Run 1 ran it, and run 2 skipped it" for the check of the stored list answer, and the transcripts say the reverse. Fixed: the lead had written the sentence from an earlier attempt. The generator now reads the sentence from the two transcripts.
- [x] FINDING major (spec adversary) The words "the server holds new confirm requests only after an unknown or pending record" were false, because the refusals key_rejected, no_credit and upstream_rate_limit also hold. Fixed: the Known limit `lost-answer` and D17 say that the server holds for 600 seconds after an unknown or pending record, and that a record "created" gives no hold.
- [x] FINDING minor (spec adversary) Scenario 020 named a count for an unknown answer that no test pins. Fixed: the scenario names the refusal only.
- [x] FINDING minor (spec adversary) The CHANGELOG and DATA_SOURCES.md said "sends one create request". Fixed: "at most one".
- [x] FINDING minor (spec adversary) No test of the layer gives a created answer with an empty string `id`. Fixed in part: the spec says "string `id`", and the Known limit `empty-id` names the gap. The lead added no test, because a new test needs two new fault runs, and the tests of the source pin the empty `id`.
- [x] FINDING minor (spec adversary) The name of the fault "Give a created answer when the body is not readable" did not match its edit. Fixed: "Classify an empty body when the body is not readable".
- [x] FINDING major (STE adversary) The CHANGELOG and DATA_SOURCES.md said "sends one create request", and the evidence shows 4 confirm requests and 3 create requests. Fixed: "at most one".
- [x] FINDING minor (STE adversary) The word "wait" named the lock in the proposal, in a comment of a test and in four fault names, and the spec did not define the lock. Fixed: "lock" everywhere, and scenario 029 defines it.
- [x] FINDING minor (STE adversary) The word "redraw" was a verb used as a noun. Fixed: "draw" in scenario 020, D16, a test title and five fault names.
- [x] FINDING minor (STE adversary) Three phrases in the spec had two meanings: "a text `id`", "unless it matches" and the title of scenario 024. Fixed: "a string `id`", "unless the answer matches" and "Send a confirm request once and abort it after 60 seconds".
- [x] FINDING minor (STE adversary) D17 started with an imperative ("Think of a burst") and used "could". Fixed: D17 states the facts.
- [x] FINDING minor (STE adversary) The Risks line said "after an unknown record of its own", which was incomplete. Fixed: "unknown or pending".

### Round 4 (commit 509c4156)

- [x] FINDING minor (spec adversary) The Risks line of the design said "keeps refusing" with no time bound. Fixed: "refuses new confirm requests for 600 seconds".
- [x] FINDING minor (STE adversary) The words "draws the boxes" in scenario 020 can mean every call of the function draw, also one that leaves no box. Kept by the lead: the code and the tests follow that meaning, and a change of the scenario needs a new ratchet. The design now says "render a new image" where it meant the renderer.
- [x] FINDING minor (STE adversary) Scenario 029 defines the lock by an appositive, and a test title says "period". Kept by the lead for the scenario and the test title, because a change needs a new ratchet. The proposal now says that a lock of one second disables the Confirm chip.
- [x] FINDING minor (STE adversary) The Risks line of the design had the -ing form "keeps refusing" and no time bound. Fixed with the minor finding of the spec adversary.
- [x] FINDING minor (STE adversary) The Known limit `empty-id` used "row" for a test case. Fixed: "No test of the layer gives the layer such an answer."
- [x] FINDING minor (STE adversary) In the evidence, "No fault changed." can read as a contradiction, and a fault name uses "draw" as a noun. Kept by the lead: the name lives in the fault script and in its logs, and the evidence is generated from them. The history line states that only names changed.
