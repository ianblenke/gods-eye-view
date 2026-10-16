# Review: beemaps-burst-control

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-16
Gates: make gates CHANGE=beemaps-burst-control passed
Rounds: 4
Scope: diff 98094929f7a303506c2b66fd3f2ef5660fe7c967
Reviewed-Tree: 139f9408865d59d60b0c767ab2293735ec45dba2b05550c49265db22c53f7635

## Findings

The reports of rounds 1, 2 and 3 are in `review/round-1/`, `review/round-2/` and `review/round-3/`. The reports of round 4 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word.

The review agents of this session are the teammates `cp-spec-adversary` and `cp-ste-adversary`. They do the task of `spec-adversary` and `ste-adversary`. The brief of each round gave the severity rule of the owner, and the reports follow that rule.

Round 1 had the scope full, at the commit fb23c4c1. The spec adversary gave FAIL with 8 major findings. The STE adversary gave PASS. The change moved out of the archive, the lead made the corrections, and the fault runs, the ratchet and the archive were done again.

Round 2 had the scope diff fb23c4c1, at the commit 03caafb4. Both reviewers gave FAIL. Round 3 had the scope diff 03caafb4, at the commit 98094929. The STE adversary gave PASS, and the spec adversary gave FAIL with 1 major finding that came from a replacement text of round 2 that the lead had copied without a check of the code.

Round 4 had the scope diff 98094929, at the commit b595fd00. Both reviewers gave PASS with 2 minor findings each. The lead corrected three of the four minor findings and accepted one by name. The ratchet ran again after those corrections, and no file under `src`, `server` or `build` changed after the last fault runs, except for the title of one test.

After round 2, the ratchet found a test title of 26 words, and it ran again. The first ratchet attempt of the change stopped at a failed test of another layer (`meshSampler.test.mjs`), wrote no trace file and gave no verdict. The test uses mock timers and passed 6 of 6 on the host. The ratchet ran again with no change of any file.

### Round 1 (commit fb23c4c1)

- [x] FINDING major (spec adversary) The first-column claim of `evidence/mutations.txt` was false for 2 lines, where only a test file stopped. Fixed: the evidence names the 2 faults, and the generator asserts the claim for every other line of both runs.
- [x] FINDING major (spec adversary) The blocked line was asserted for 7 of the refusals after the rate limit, not for busy, key_reused, the hold after an unknown outcome, budget_unavailable and ledger_unavailable. Fixed: a new test asserts the line for each of them, and 9 faults answer at one site with no line.
- [x] FINDING major (spec adversary) The test of scenario 013 reused the quote only after 239999 and 601000 ms, so an unspent quote gave the same 410. Fixed: a new test uses the same quote again at once after six outcomes, and 5 faults give the quote back.
- [x] FINDING major (spec adversary) No fault covered the leak paths of scenario 032 or the rule that a refusal does not read the body. Fixed: 12 faults for the leak paths and 1 fault that reads the body of a refusal. A first version of one fault threw before it leaked, so it was written again and checked by hand.
- [x] FINDING major (spec adversary) Nothing pinned the hold after an unknown outcome before the quote step, and no Move fault covered method and local request or quote and budget. Fixed: a new test sends a quote that was never given during the hold, and 3 faults move or add a step.
- [x] FINDING major (spec adversary) The hold rule "MUST refuse each confirm until a hold ends" had two meanings, because a repeat of a key is answered during a hold. Fixed: the requirement, the scenario line, the proposal, the design and the repository documents say "with a new idempotency key".
- [x] FINDING major (spec adversary) The Known limit `refusal-sources` was false, because the version 1.3.0 of the description lists 401 for another call. Fixed: the limit is bounded to the create call.
- [x] FINDING major (spec adversary) The proposal said "one upstream request for each confirm", which is false for the steps of the local run that send nothing. Fixed: "for each confirm that passes every step".
- [x] FINDING minor (spec adversary) No Known limit named two plugin instances on one cache folder. Fixed: the Known limit `two-instances`.
- [x] FINDING minor (spec adversary) An error after the send was in no scenario, test or Known limit. Fixed: a line in scenario 001, a new test and the Known limit `internal-error-after-send`.
- [x] FINDING minor (spec adversary) The line "a repeat gets 026, a new key 040" had no scope. Fixed: the line begins with "in that new plugin".
- [x] FINDING minor (STE adversary) A comment of the plugin had a sentence of 28 words. Fixed: two sentences.
- [x] FINDING minor (STE adversary) DATA_SOURCES.md had 7 sentences in a paragraph, and the verb "hold" meant "block" and "contain". Fixed: paragraphs of at most 4 sentences, and the words "refuses" and "contains" in the text, the comments and the test titles.
- [x] FINDING minor (STE adversary) CHANGELOG.md had 8 sentences. Fixed: 6 sentences. The first correction left 8 sentences, and a second correction after round 2 made 6.
- [x] FINDING minor (STE adversary) In scenario 027 "the check of the key" could mean the API key. Fixed: "the check of the idempotency key".
- [x] FINDING minor (STE adversary) The words "mapping", "missing", "closing line", "neighbouring" and "reserves" were -ing words or verbs used as nouns. Fixed in the proposal, the spec and the test titles.

### Round 2 (commit 03caafb4)

- [x] FINDING major (spec adversary) The sentence "A repeat of a key that has a record still gets the answer of its record" was false for a key with another quote. Fixed: "A repeat of a key with the quoteId of its record". The requirement Idempotency, scenario 031 and scenario 040 were corrected in the same way.
- [x] FINDING major (spec adversary) Two lines of scenario 013 were false, because the hold comes before the quote step. Fixed: "when no hold answers first", a list of the outcomes after which the quote is used up, and a line for the hold.
- [x] FINDING major (spec adversary) No fault read the body before the check of the local request. Fixed: 3 faults, one for each route. Test 006 kills them.
- [x] FINDING minor (spec adversary) The exceptions in the evidence did not name the 15 equivalent faults. Fixed: the sentence names them.
- [x] FINDING minor (spec adversary) The title of the test of scenario 029 lacked "with a new key", and the test of scenario 013 with the clock moved by 601 seconds had a misleading title. Fixed: both titles were changed.
- [x] FINDING minor (spec adversary) Only the hold of the ledger had a Move fault before the replay. Fixed: the fault "Move the hold after a refusal before the replay".
- [x] FINDING minor (spec adversary) No fault in the guard breaks the new sentence about the record after an error. Accepted by the lead: the sentence is a pin of the order of the update of the record and the audit line. The guard does not touch the ledger.
- [x] FINDING major (STE adversary) Scenario 013 said that the same quote gets `quote_expired` also after an unknown outcome, but the hold answers first. Fixed with the lines of the first major finding of the spec adversary.
- [x] FINDING major (STE adversary) D14 said that the record is still "pending" after the send, but the record keeps the state it has. Fixed: D14 says that the record keeps the state that it has when the error comes.
- [x] FINDING minor (STE adversary) The word "key" had two meanings in the Holds requirement. Fixed: "the API key" and "a new idempotency key" in the requirement and in the lines of the spec, the proposal, the design and DATA_SOURCES.md.
- [x] FINDING minor (STE adversary) A test title said "reads a missing file". Fixed: "reads a file that does not exist".
- [x] FINDING minor (STE adversary) The line in scenario 001 about the error after the send pointed to the wrong error. Fixed: "when an error that nobody expects comes after the send".

### Round 3 (commit 98094929)

- [x] FINDING major (spec adversary) The list of outcomes in scenario 013 was false for ledger_unavailable. The code reads the ledger before it takes the quote, so a failed read leaves the quote alive. Fixed: the list names a failed write of the "pending" record, and a separate line gives the hold with its time bound. The wrong text came from a replacement text of round 2 that was copied without a check. The same overclaim in D8 and in a line of the evidence was fixed too.
- [x] FINDING minor (spec adversary) The bare word "repeat" remained in scenario 027 and in the lines about the new plugin. Fixed: "a confirm with that key and the quoteId of its record".
- [x] FINDING minor (STE adversary) The word "key" was still bare in Goals, D2 and D8 of the design, in a comment of the code and in two test titles. Fixed in Goals, D2 and D8. Accepted by the lead for the comment of the code and the two test titles: each sentence is true under both meanings, and a change of a title repeats the fault runs.
- [x] FINDING minor (STE adversary) The line about the hold in scenario 013 had no time bound. Fixed with the lines of the major finding of the spec adversary.
- [x] FINDING minor (STE adversary) The sentence "Then come hold, quote, ..." put the verb before the subject. Fixed: "The next steps are hold, quote, budget, audit line, record of the attempt and upstream request."

### Round 4 (commit b595fd00)

- [x] FINDING minor (spec adversary) No test sends the same quote with a new key during a hold. Fixed: the line says "a confirm with a new idempotency key gets the hold of scenario 029 or 040, whatever its quote". This is true by the order of the steps.
- [x] FINDING minor (spec adversary) The title of the test of scenario 013 with the clock moved by 239999 ms claims more than its body. Accepted by the lead: the Known limit `test-title-claims-more`. Another test checks the six outcomes, and a change of a title repeats the fault runs.
- [x] FINDING minor (STE adversary) In scenario 013 the pronoun "it" was not clear, and "a hold can start" made the start look optional. Fixed: the line names the quote, and the line says "a hold starts".
- [x] FINDING minor (STE adversary) The verb "works" in scenario 027 was vague, and "its quoteId" in scenario 028 could point to the new plugin. Fixed: "gets the answer of the record" and "the quoteId of its record".
