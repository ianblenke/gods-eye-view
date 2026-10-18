# Review: html-code-lines

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-18
Gates: make gates CHANGE=html-code-lines passed
Rounds: 6
Scope: diff 500f233af4aa8457607418a2a10444daccdd0357
Reviewed-Tree: 66276b0721e0270c3aa2a466a2bba195c1c6392d0b221bedb0e22dac24ac26f8

## Findings

The reports of rounds 1 to 5 are in `review/round-1/` to `review/round-5/`. The reports of round 6 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word.

Round 1 had the scope full, at the commit 18703fb7. Both reviewers gave FAIL. Round 2 had the scope diff 18703fb7, at the commit 901ffe62. Both reviewers gave FAIL. Round 3 had the scope diff 901ffe62, at the commit 6ca69967. Both reviewers gave FAIL with one major finding each, the same one.

Rounds 4, 5 and 6 were narrow confirmations, because round 3 gave a major finding. A major finding always stops the build, so the lead corrected it and asked for one more round. Each narrow round asked only two questions: is the major finding of the round before closed, and does the diff add a new critical or major finding? Round 4 had the scope diff 6ca69967, at the commit a88378d8. Both reviewers gave FAIL with the same new major finding in the new Known limit `gt-in-value`. Round 5 had the scope diff a88378d8, at the commit 500f233a. The spec adversary gave PASS, and the STE adversary gave FAIL with one more case of that Known limit. Round 6 had the scope diff 500f233a, at the commit bae4b67a. Both reviewers gave PASS with no findings.

The corrections after rounds 4 and 5 changed only the proposal. So the change stayed in the archive, as step 10 of the review procedure allows, and no ratchet ran. The lead checked each new sentence with node on the code of the tip.

### Round 1 (commit 18703fb7)

- [x] FINDING major (spec adversary) The proposal said that `openspec/ownership.json` lists the folder `src/tooling/spec/`. Fixed: the manifest lists the folder `scripts/spec/` and the two test files by name, and the proposal says so.
- [x] FINDING major (spec adversary) The scenario `ownership-056` said "edits", but the spec separates added lines from edited lines. Fixed: "adds or edits" and "added or edited line", and the test has an added line of markup.
- [x] FINDING major (spec adversary) The Purpose of the ownership spec, rule 5 of `AGENTS.md` and `openspec/config.yaml` had no HTML rule. Fixed: each has one more sentence, and the sentences that `ownership-012` checks did not change.
- [x] FINDING major (spec adversary) The words "no change can edit an HTML template" were false. Fixed: the proposal and the design limit the claim to an added or edited line of markup.
- [x] FINDING minor (spec adversary) No test had a script start tag on two lines. Fixed: the fixture has one, and a fault kills the test.
- [x] FINDING minor (spec adversary) A `javascript:` URL stopped at the first quote of either type. Fixed in the code: a URL at the start of a quoted value ends at the next quote of the same type, with a test and a fault.
- [x] FINDING minor (spec adversary) An unclosed start tag joins the next script element. Added as the Known limit `unclosed-start-tag`.
- [x] FINDING minor (spec adversary) A change that removes `src` made code with no COVERAGE-DIFF. Fixed in the code: each line of the start tag of a script element without a src attribute is a code line, with a fault.
- [x] FINDING minor (spec adversary) No test reached the branch for a URL with no quote or `>` after it. Fixed: separate edge strings, one for each branch.
- [x] FINDING major (STE adversary) The same false statement about the folders of `openspec/ownership.json`. Fixed as above.
- [x] FINDING major (STE adversary) "a line of code" and "a code line" had two meanings, and blank lines were not clear. Fixed: the scenario says that each line of the text is a code line when the line is not blank, and the start tag lines have their own line.
- [x] FINDING major (STE adversary) The JSDoc said "up to its closing quote", and that was false. Fixed: the JSDoc names the two URL cases as the code does.
- [x] FINDING major (STE adversary) The same words "no change can edit an HTML template". Fixed as above.
- [x] FINDING minor (STE adversary) "A changed line of markup" had two meanings. Fixed: "An added or edited line of markup".
- [x] FINDING minor (STE adversary) "after the first read" used a verb as a noun. Fixed in round 1, and fixed again after round 2.
- [x] FINDING minor (STE adversary) "its second quote" and "applies" were not exact. Fixed: "the next quote of the same type", and the filter sentence names the file names that end in `.html`.
- [x] FINDING minor (STE adversary) "closing quote" in the code and in a test comment. Fixed: "end quote".

### Round 2 (commit 901ffe62)

- [x] FINDING major (spec adversary) No test could fail for the single quote and the white space of the pattern for a quoted URL value. Fixed: two edge strings, three faults, and the scenario says where white space can come.
- [x] FINDING major (spec adversary) A handler attribute in the start tag of a script element with a src attribute gave no code line. Fixed in the code: such a start tag gives each of its lines when it has a handler attribute or a `javascript:` URL, with tests and faults.
- [x] FINDING major (spec adversary) The new sentence in `AGENTS.md` said "the script elements", which has two meanings. Fixed in `AGENTS.md` and `openspec/config.yaml`: the sentence now names the scenario `ownership-056`.
- [x] FINDING minor (spec adversary) A change can delete only the src line of a start tag on more than one line. Added as the Known limit `deleted-src-line`.
- [x] FINDING major (STE adversary) The same sentence in `AGENTS.md` and `openspec/config.yaml`. Fixed as above.
- [x] FINDING major (STE adversary) The Known limit `unclosed-start-tag` was false for a start tag without a src attribute. Fixed with the replacement text.
- [x] FINDING major (STE adversary) The scenario had two meanings for white space around the quote of a URL value and for a value with no end quote. Fixed: one line for each case, with tests.
- [x] FINDING minor (STE adversary) "it reads" had no clear subject. Fixed: "`syncChangedLines()` reads the changed lines".

### Round 3 (commit 6ca69967)

- [x] FINDING major (spec adversary) Two lines of the scenario said "a start tag with a src attribute" with no "script". Fixed: "a script start tag with a src attribute".
- [x] FINDING minor (spec adversary) A `>` in a quoted value ends the attributes that the functions read. Added as the Known limit `gt-in-value`, and its text was corrected after rounds 4 and 5.
- [x] FINDING minor (spec adversary) No test failed when the code added the text of a script element with a src attribute and a handler. Fixed: the test element has a text line, and a new fault kills the test.
- [x] FINDING minor (spec adversary) "the ledger count of the file" was false for an owned HTML file. Fixed: "of an upstream file".
- [x] FINDING major (STE adversary) The same two lines of the scenario. Fixed as above.
- [x] FINDING minor (STE adversary) The design did not say "only" for the white space around the quote. Fixed.
- [x] FINDING minor (STE adversary) A test comment said "such a value" before a test string with the other quote. Fixed: "a URL value".
- [x] FINDING minor (STE adversary) A test comment said "when it has a handler or a URL". Fixed: "when the tag has a handler attribute or a script URL".

### Round 4 (commit a88378d8)

- [x] FINDING major (spec adversary) The Known limit `gt-in-value` was false for a start tag without a src attribute before the `>`. Fixed in the archived proposal, and fixed again after round 5.
- [x] FINDING major (STE adversary) The same Known limit. Fixed as above.

### Round 5 (commit 500f233a)

- [x] FINDING major (STE adversary) The third sentence of the Known limit `gt-in-value` was false when the cut value has the text `src=`. Fixed: the Known limit now says what the functions do, with no list of cases. The lead did not use the replacement text, because it listed cases again.

### Round 6 (commit bae4b67a)

Both reviewers gave PASS with no findings.
