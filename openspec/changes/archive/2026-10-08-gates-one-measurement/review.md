# Review: gates-one-measurement

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-08
Gates: make gates CHANGE=gates-one-measurement passed
Rounds: 3
Scope: diff a9db7ad
Reviewed-Tree: 599722b90d13575726f4e9f3aa1f68f0c4e16bb205f559f4b24ede98961c2528

## Findings

Full agent reports: `review/round-1/`, `review/round-2/`, `review/spec-adversary.md`, `review/ste-adversary.md`.
The reviewers did not read the prose corrections after round 3 again. The lead ran the lint after them.

### Round 1 (scope: full) - FAIL (spec-adversary FAIL, ste-adversary FAIL)

- [x] FINDING major (spec-adversary) The marker command of the document gates had no `.gev-cache` exclusion, so markers for ignored files in the cache were copied back and changed real cache files. Corrected in pass 2: the exclusion, a marker list, and a copy back of `.gev-cache/spec` only.
- [x] FINDING major (spec-adversary, 2 findings) Operand mutations of the trust check survived, and the trusted commit of scenario 080 was not asserted. Corrected in pass 2: tests and mutation rows for each operand and for the commit line.
- [x] FINDING minor (spec-adversary, 7 findings) The order of the file class and the path test, a ref that was not a commit hash, the `Command:` line of `check`, the `&&` in `precheck`, the two meanings of "protected", the files that Git hides, and a history re-read without a test. Corrected in pass 2 or recorded as Known limits in the proposal.
- [x] FINDING major (ste-adversary, 7 findings) The dirty list in the history rule, the log words "measurement" and "Trusted commit:", the words "document" and "protected", the review command text, and "refusal" with two statuses. Corrected in pass 2.
- [x] FINDING minor (ste-adversary, 6 findings) Tense, verbs used as nouns, "image" with two meanings, vague verbs, stale evidence text and -ing words. Corrected in pass 2.

### Round 2 (scope: diff 14f78cb) - FAIL (spec-adversary FAIL, ste-adversary FAIL)

- [x] FINDING major (spec-adversary) Most pathspecs of the marker command had no test or mutation row. Corrected in pass 3: a table test runs the real marker command with one ignored file for each class, and one mutation row deletes each pathspec.
- [x] FINDING major (spec-adversary) The requirement to keep the runtime, local environment, QA header, coverage filter, source import and coverage comment gates had no scenario for the QA header, the import or the comment. Corrected in pass 3: a scenario and a test for the QA capability gates, and the two gates that cannot fire in the document mode are removed with the reason in the spec.
- [x] FINDING minor (spec-adversary, 5 findings) The `includes` mutant of the path prefix, the time lines of the other commands, the ratchet that reused the changed file list taken before the trace writes, the `Ratchet commit:` line of three refusals, and the false sentence about the snapshot hash. Corrected in pass 3: tests and rows.
- [x] FINDING major (ste-adversary, 3 findings) The false sentence "Only the document mode reads the snapshot hash", "ignored input files" and the stale design line about the ratchet verdict. Corrected in pass 3.
- [x] FINDING minor (ste-adversary, 10 findings) The undefined "ratchet commit" and "input file", the word "test" for a code check, one name for each thing, passive log text, test titles and stale evidence text. Corrected in pass 3.

### Round 3 (scope: diff a9db7ad) - PASS (spec-adversary PASS, ste-adversary PASS)

The lead ran one image probe for the finding about the image shell. An ignored test file in the clone made the document target refuse and name the file, so the marker loop works in the image shell. The evidence records the probe.

- [x] FINDING minor (spec-adversary) The unbounded sentence "The image shell was proven by the image runs". Corrected after round 3: the proposal states the probe and its bound.
- [x] FINDING minor (spec-adversary, 2 findings) No test pins rule 8 of `AGENTS.md`, and rule 9 holds only for `check`, `ratchet` and the document mode. Recorded as the Known limits `rule-8-unpinned` and `rule-9-bound` in the proposal. Accepted by Ian Blenke.
- [x] FINDING minor (spec-adversary, 3 findings) No document mode test runs the local environment gate, the `node_modules` exclude has a test only at the top level, and the `includes` mutant of the `.gev-cache/` prefix survives. Recorded as the Known limits `local-env-document-test`, `nested-node-modules` and `nested-gev-cache` in the proposal. They need a new test and mutation row and stay open. Accepted by Ian Blenke.
- [x] FINDING minor (spec-adversary) The sentences of the coverage-gate spec and of the design say that the coverage flag scan reads only files under the three allowed paths. The design is corrected after round 3. The spec sentence needs a new ratchet: the Known limit `flag-scan-wide` records it. Accepted by Ian Blenke.
- [x] FINDING minor (ste-adversary, 9 findings) Prose in the design, tasks, evidence and proposal: missing articles, "Their results", "calls", "each other", the second instruction of the correction tasks, the words "following", "brief" and "sandbox child process", the labels of the evidence reports, and "to skip a history line". Corrected after round 3.
- [x] FINDING minor (ste-adversary, 6 findings) Wording in the delta specs, `AGENTS.md`, `review.md`, the roadmap text, the Makefile comment and four test titles. These need a new ratchet and stay open: the Known limit `spec-wording-minors` records them. Accepted by Ian Blenke.
