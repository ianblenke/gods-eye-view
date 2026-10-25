Verdict: FAIL

Commit add86d24, scope full.

- [ ] FINDING major CHANGELOG.md:3 "use Node 24.22.1 or later, or 26.12.1 or later" is false advice under the spec. "24.22.1 or later" includes 25.x, and ci-gates-013 refuses 25.0.0. Write: "Node 24.22.1 or a later release of the line 24, or 26.12.1 or a later release of the line 26."
- [ ] FINDING minor specs/ci-gates/spec.md:9 "or a later line" has no anchor. Write: "or a line after 26".
- [ ] FINDING minor specs/ci-gates/spec.md:4 The requirement says "a Node release that has the fix", and the test refuses 22.23.4, which has the fix. Add a sentence to the proposal that the test refuses 22.23.4.
- [ ] FINDING minor evidence/faults.txt:14 One reading of "give the same result" is false. Write: "Each of the samples gives the same result with the fault and without it."
- [ ] FINDING minor tasks.md:20 Task 4.1 is open, but evidence/checks.txt says the ratchet ran. The open box is the safe side.
- [ ] FINDING minor tasks.md:14 "Run the test against its fault." is vague. Write: "Run the test with each named fault in evidence/faults.txt."
- [ ] FINDING minor proposal.md:33 "a contributor machine does not run the server for other people" has an unclear meaning. Write: "a contributor machine runs the server only for its own user."
- [ ] FINDING minor design.md:3-4 Passive voice and two meanings of "server". The words "crafted", "disclosed" and "taken-over" are not approved STE words.
