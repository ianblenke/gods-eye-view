# Review: beemaps-frames

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-15
Gates: make gates CHANGE=beemaps-frames passed
Rounds: 2
Scope: diff 3c9496d4117ef375624451544d0f7d66c616931d
Reviewed-Tree: 7a490b4a56ed2fc00c1f8686ab8ae06293647e2a3ef3e1274bd44d88bade8394

## Findings

The reports of round 1 are in `review/round-1/`. The reports of round 2 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word.

The review agents of this session are the teammates `cp-spec-adversary` and `cp-ste-adversary`. They do the task of `spec-adversary` and `ste-adversary`. The brief of each review gave the severity rule of the owner, and the reports follow that rule.

Four informal reviews came before round 1, at the commits c1f0e8b5, f786fa6c, f50b2bb2 and 6c6fb1bd. The first three gave FAIL from both reviewers. The fourth gave PASS from both. The tools folder of the lead holds their dispositions.

Round 1 had the scope full, at the commit 3c9496d4. Both reviewers gave FAIL. The change then moved out of the archive. The lead made the corrections, ran the ratchet again and archived the change again. Round 2 had the scope diff 3c9496d4, and both reviewers gave PASS.

The label "Fetching…" and the test title "after the rounding" are -ing words that give warnings only. Both reviewers accepted them by name. Accepted by the lead.

### Round 1 (commit 3c9496d4)

- [x] FINDING major (STE adversary) Scenario 013 used "own" with two meanings, for the signal that the source makes and for the signal of the caller. Fixed: the spec says "a signal that the source makes" and "a call rejects with the abort error when the signal of the call is aborted", in both spec files.
- [x] FINDING minor (STE adversary) Scenario 006 said "no earlier press has failed", and a press with no box also leaves a message. Fixed: the scenario says "the info text shows no message of a press", and the Known limit `press-message-first` says the same in other words.
- [x] FINDING minor (STE adversary) The Known limit `press-message-first` used verbs as nouns. Fixed in round 1, and worded again after a finding of round 2.
- [x] FINDING minor (STE adversary) Sentences of the evidence files had more than 25 words. Fixed: the generator of the evidence checks the length of each prose sentence.
- [x] FINDING minor (STE adversary) A fault name had a banned word, and a sentence said that two runs follow when only the first follows. Fixed: the fault has a new name, and the text says that the first run follows.
- [x] FINDING major (spec adversary) The evidence said "2 faults" for run A and named three. Fixed: the evidence files were made again and say 3.
- [x] FINDING minor (spec adversary) Three fault lines had a scenario that is not among their failing tests, and the [012] test did not pin the signal of the fetch function. Fixed: the three faults have the scenarios 007, 003 and 020, and the [012] test asserts that the signal is not the signal of the caller.
- [x] FINDING minor (spec adversary) The spend paths of the layer had no fault with a named failing test. Fixed: five faults were added. They are a retry once, a retry through a timer in the layer, a method `setParams` that presses, a press in `getRowControls` and a press in `getStats`.
- [x] FINDING minor (spec adversary) The radius 6371008.8 was pinned by no row. Fixed: the row (39.975, 0.0) was added to scenario 008 and to the box test. The fault with the radius now fails [beemaps-frames-008], and no equivalent fault is left.
- [x] FINDING minor (spec adversary) Scenario 006 and the Known limit did not cover a press with no box. Fixed in the same way as the first minor finding of the STE adversary.

### Round 2 (commit 12691c10)

- [x] FINDING minor (STE adversary) A line of the browser run file had 8 sentences. Fixed: the line is split, and the four causes are list lines.
- [x] FINDING minor (STE adversary) Two fault lines had the scenario 002, and no test of 002 fails for them. Fixed: the faults have the scenarios 003 and 007, and both fault runs were repeated.
- [x] FINDING minor (STE adversary) A sentence of the evidence called the fault with the radius an equivalent fault, and round 1 then found a row. Fixed: the sentence says that the fault was marked as an equivalent fault at that time.
- [x] FINDING minor (STE adversary) The proposal said "The message goes when someone disables and enables the layer". Fixed: "The layer removes the message when someone disables and enables it."
- [x] FINDING minor (STE adversary) The browser run file said that the fake upstream throws for another address. This was false, because the fake answers every request. Fixed: the file says that the fake records the URL of each request, and that the run checks the URL of the first request.
- [x] FINDING minor (spec adversary) No test reads `getRowControls` or `getStats` and asserts that the read sends no request. Accepted by the lead: the Known limit `stats-send-no-request-unpinned`. The faults that press in these methods fail tests, and the evidence names them.
- [x] FINDING minor (spec adversary) The fault with a method `setParams` that presses fails only the test [beemaps-frames-001], because the test of `setLayerParams` never enables the layer. Accepted by the lead: the Known limit `setparams-press-unpinned`.
- [x] FINDING minor (spec adversary) Scenario 006 says that the info text is the text for no key, and after a good press the text also shows the answer. Accepted by the lead: the Known limit `info-text-with-answer`.
- [x] FINDING minor (spec adversary) Two of the three abort cases of the source test do not assert the name of the error. Accepted by the lead: the Known limit `abort-class-unpinned`.
