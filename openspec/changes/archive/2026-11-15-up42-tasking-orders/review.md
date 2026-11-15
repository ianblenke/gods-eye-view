# Review: up42-tasking-orders

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-15
Gates: make gates CHANGE=up42-tasking-orders passed
Rounds: 6
Scope: diff 63172787
Reviewed-Tree: 2d1035fe8e14c6642c83d97ca93813fdeb98751264c369fb84cc9adf7280b4d2

## Findings

The review had six rounds. The rules allow three. The owner allowed rounds 4 to 6 because round 3 still gave a FAIL from the spec adversary for a defect in the spend path. Each round read the diff since the round before. The reports of each round are in `review/round-<n>/`. `review/spec-adversary.md` is the report of round 5 (PASS, no findings). `review/ste-adversary.md` is the report of round 6 (PASS, no findings). The code did not change between round 5 and round 6. Only two words of the spec and one test title changed.

### Round 1 (commit 4da64cf9, scope full)

- [x] FINDING major (spec adversary) Two first requests could load the ledger twice, and the second load could replace a raised count. Fixed: one shared load. A test holds `readFile` and asserts one read for two requests.
- [x] FINDING major (spec adversary) A lost browser answer after an accept gave the accept chips and no warning. Fixed: a lost answer of the order, accept or reject call gives the unclear text and no new chip. Tests cover each call.
- [x] FINDING critical (spec adversary) The reject route needed a cap, but scenario 025 said it needs none. Fixed in code, spec and design: a reject needs no cap and has no count.
- [x] FINDING critical (spec adversary) The tests of scenarios 019, 024, 023, 025 and 026, of page scenarios 001 and 009, and of the file sequence did not make their conditions. Fixed: each test now makes the condition, and the mutations of the lead fail the test.
- [x] FINDING critical (spec adversary) The ledger deleted the oldest order after 500 entries with no scenario. Fixed: the deletion is removed.
- [x] FINDING major (spec adversary) A new quote hid later quote texts under an old order text. Fixed in round 3 by blocking a new quote during an order step.
- [x] FINDING minor (spec adversary) DATA_SOURCES.md split the quote text with the orders text. Fixed.
- [x] FINDING major (STE adversary) Eight statements of the design, the specs and tasks.md disagreed with the code (reject cap, route count, error names, unclear answers, states, failed writes, chip rule, one task with two instructions). Fixed in all files.
- [x] FINDING minor (STE adversary) About 16 findings on -ing forms, verbs as nouns and passive voice, for example "confirm" as a noun. Kept by the lead as a known limit (see the proposal). The owner has not yet accepted them by name.

### Round 2 (commit 281be214, scope diff 4da64cf9)

- [x] FINDING major (spec adversary) A quote could start while an order step showed, and could hide the accept text or the unclear warning. Fixed: the quote chip stays disabled in every order step and a new quote ends the old offer.
- [x] FINDING major (spec adversary and STE adversary) The ledger failure requirement and the write failure after an order disagreed. Fixed: scenario 030 has its own requirement and test.
- [x] FINDING critical (spec adversary) The test of "load once" did not hold the load. Fixed. Scenario 005 had no reject test. Fixed: the test carries both tags.
- [x] FINDING major (STE adversary) "keep one count" had two meanings. Fixed.
- [x] FINDING minor (STE adversary) Style findings of the same kind as round 1. Kept as a known limit.

### Round 3 (commit 4c5b55db, scope diff 281be214)

- [x] FINDING critical (spec adversary) The test did not check the quote block in each state. Fixed: it checks each state and the search press.
- [x] FINDING major (spec adversary) A saved order chip opened a confirmation for a new offer. Fixed: each chip belongs to one epoch of the order steps. A test presses an old chip after a second quote.
- [x] FINDING major (spec adversary) The scenario ID `up42-order-panel-015` changed its meaning. Fixed in round 4: the ID is retired in the spec and in `retired-ids.json`, and the final scenario has the ID `up42-order-panel-016`.
- [x] FINDING minor (STE adversary) Four findings on a verb as a noun, passive voice and a phrasal verb. Kept as a known limit.

### Round 4 (commit a31db270, scope diff 4c5b55db)

- [x] FINDING major (spec adversary) A saved accept chip from an earlier step opened a confirmation after an unclear answer or after the accept. Fixed: each chip also belongs to the step that showed it. A new test presses five saved chips after both outcomes.
- [x] FINDING major (spec adversary) The retire of `up42-order-panel-015` was missing. Fixed (see round 3).
- [x] FINDING major (STE adversary) The phrase "an ended offer or order" had two meanings. Fixed: the scenario says a chip works only in the step that showed it and until the layer resets the order steps.

### Round 5 (commit 63172787, scope diff a31db270)

- [x] FINDING major (STE adversary) The word "required" in the retire note is a form of a banned word. Fixed: the note says "needed".
- [x] FINDING minor (STE adversary) "after the accept" uses a verb as a noun, in the spec and in a test title. Fixed: "after UP42 accepts the quotation".
- The spec adversary gave PASS with no findings.

### Round 6 (commit a23de580, scope diff 63172787)

No findings from the STE adversary. The spec adversary did not run again, because no code or test logic changed after round 5.

## Decisions

- The ratchet logs of the last ratchets list the unrelated files `src/data/geoFileImport.js`, `src/i18n/index.js` and once `src/layers/traffic/flow.js` with changed branch counts. The lead kept those history lines, because they carry the ratchet commit, and restored the values of the three files in `gaps.json` to the base values, as in the earlier UP42 changes.
- The change edits one upstream-class test: `src/tooling/viteBuild.test.mjs` (the list of ignored folders has one more entry).

## Known limits

No test calls the real UP42 order routes, and no real-browser check ran for this change. The shapes of the order answer and the quotation list come from the UP42 documents. The first real order and the first real accept need the explicit approval of the owner. The routes stay off until `UP42_ORDERS=true` and a valid `UP42_ORDER_MAX_CREDITS` are set. The proposal lists the other limits.
