# Review: fix-up42-collection-object

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-16
Gates: make gates CHANGE=fix-up42-collection-object passed
Rounds: 2
Scope: diff e0b392db
Reviewed-Tree: 8bf095b51d3e2e770818b229aa3771f597191698fb208c7f10c9b13f40dae541

## Findings

Round 1 (scope full, tree e0b392db):

- [x] FINDING major: the 160-character and control-character cleaning of an object name had no test. Corrected: test `[up42-quotes-014] cleans the name of the collection object`. The mutation that reads only strings now fails it.
- [x] FINDING minor: refusal cases for null and an object with a name that is not a string were missing. Corrected: two cases in the `[up42-quotes-015]` loop. The mutation `typeof c === 'object'` fails case 9.
- [x] FINDING minor: scenario 014 does not state the empty-name result. Recorded as the known limit `empty-name` in the proposal.
- [x] FINDING major: "each" in the scenario had two meanings. Corrected: the scenario has a WHEN line and an AND line.
- [x] FINDING major: task 4.2 gave two instructions. Corrected: split into tasks 4.2 and 4.3.
- [x] FINDING minor: tasks 1.1, 3.1, the "re-link" verb, "as before", "Other values give undefined", the missing `collection: 7` case in the design, and the long changelog sentence. Corrected in the proposal, design, tasks and changelog.

Round 2 (scope diff e0b392db, tree f9ca15e9): both verdicts PASS.

- [x] FINDING minor: scenario 014 does not state that control characters are removed. Kept. Recorded as the known limit `control-characters-in-scenario`. A test checks it.
- [x] FINDING minor: "Have the lead run ..." uses the verb "have". Kept. The same wording is in earlier merged changes of this project.
- [x] FINDING minor: "answer" and "response" name the same thing. Kept. "Response" names the data of UP42 in the spec. "Answer" names the output of the route in the proposal and the design.
- [x] FINDING minor: the probe date 2026-11-16. Kept. The `Date` header of the UP42 response and `date -u` gave 2026-11-16.
- [x] FINDING minor: "cleanup" in the design. Corrected: the sentence now names the removal of control characters and the 160-character limit.
- [x] FINDING minor: the test names `cleans` and `public shape case N`. Kept. The `public shape case N` name exists from an earlier change. A rename of a test needs another ratchet command. These two minor findings are not accepted by a named person.
