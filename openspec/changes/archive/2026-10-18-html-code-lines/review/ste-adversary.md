Verdict: FAIL

Commit a88378d8 (branch html-code-lines, clone /home/ianblenke/docker/gev-work/html-code-lines). C = openspec/changes/archive/2026-10-18-html-code-lines. I only read files. I did not run code, git or the lint.

Q1: Closed. C/specs/ownership/spec.md:16-17 and openspec/specs/ownership/spec.md:85-86 have the same text: "a script start tag with a src attribute and ...". That text agrees with scripts/spec/lib/coverage.mjs:124-130 and with the tests at src/tooling/spec/coverage.test.mjs:191-192.

Q2: The diff adds one new major fault, in the new Known limit `gt-in-value` (the finding below). The rest of the diff has no critical or major fault:
- The new text has no banned word.
- The 22 faults in C/design.md:43-64 agree with C/evidence/faults.txt:3-24.
- The test at coverage.test.mjs:191 now has `x();` on line 3. It gives [1, 2]. The new fault adds line 3, so the test fails.
- The three comments and the sentence at design.md:20 agree with the code.

- [ ] FINDING major C/proposal.md:42 (a88378d8) This is a false statement: "Then a handler attribute after that `&gt;` gives no code line." It is true only when a src attribute comes before that `&gt;`. Without such a src attribute, coverage.mjs:124 sets `inline`, and coverage.mjs:131-135 adds each line of the text that is not blank, from that `&gt;` on. So `&lt;script data-x="a&gt;b"` / `onload="init()"&gt;` / `x();` / `&lt;/script&gt;` gives lines 1, 2 and 3, and line 2 has the handler. An edit of line 2 gets COVERAGE-DIFF, as spec.md:24 says. The round-3 spec report described this limit only for a start tag with a src attribute. Write: "When a src attribute comes before that `&gt;`, a handler attribute after that `&gt;` gives no code line." (I did not lint this text.)
