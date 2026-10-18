Verdict: FAIL

Commit 6ca69967 (branch html-code-lines). Scope: diff 901ffe62..6ca69967. I could not run code, git or the lint, so each claim comes from reading the files.

Round-2 findings:
- F1 is closed. The edge strings at coverage.test.mjs:187 and :189 give [1] under each of the three faults of `/=\s*(["'])\s*$/`, and the test expects [1, 2].
- F2 is closed in code (coverage.mjs:128) and by the tests at :191 and :192. But the new scenario lines have two meanings (finding 1 below).
- F3 is closed at AGENTS.md:13 and config.yaml:23.
- F4 is recorded as the Known limit `deleted-src-line`, with one inexact sentence (finding 4 below).

Faults: I checked each of the 21 faults in evidence/faults.txt against the code and the tests at the tip. Each replaced string is in the code at the tip. Each fault breaks a test that the faults name. The reflog shows only docs, trace and archive commits after 122cf0e9.

Gate output: the only error is REVIEW-MISSING.

- [ ] FINDING major openspec/specs/ownership/spec.md:85-86 (delta specs/ownership/spec.md:16-17) @6ca69967 The scenario has two meanings. The text "a start tag with a src attribute and an event handler attribute gives each of its lines as a code line" does not say "script element". So it can also mean `&lt;img src="a.png"` / ` onerror="f()"&gt;`, and under that meaning lines 1 and 2 are code lines. The code (coverage.mjs:141-142) gives only line 2. A person who edits line 1 gets no COVERAGE-DIFF, and a test written from the literal text would fail. The `javascript:` line has the same fault. Possible text: "the start tag of a script element with a src attribute gives each of its lines as a code line when the tag has an event handler attribute", and the same for a `javascript:` URL. I did not lint it. After the edit, run the ratchet again, because the text of the scenario changes.
- [ ] FINDING minor scripts/spec/lib/coverage.mjs:123-128 @6ca69967 A `&gt;` in a quoted value ends the `attributes` group of SCRIPT_ELEMENT. Two examples:
  - `&lt;script src="a.js" data-x="a&gt;b" onload="init()"&gt;&lt;/script&gt;` gives no code line.
  - In a start tag with a src attribute, a handler value that has a `&gt;` and continues on more lines loses the lines after the `&gt;`.
  So an author can add such a handler with no COVERAGE-DIFF, although the scenario says that each line of the start tag is a code line. Record a Known limit.
- [ ] FINDING minor src/tooling/spec/coverage.test.mjs:191 @6ca69967 No test fails when the code adds the text of a script element with a src attribute and a handler (design.md:16 says "Its text gives no code line"). The element in this test has no text. So the fault "use `inline || handler || URL` for the text block as well" passes every test. Add text such as `x();` to that element, keep the expected [1, 2], and add the fault to design.md and faults.txt.
- [ ] FINDING minor openspec/changes/archive/2026-10-18-html-code-lines/proposal.md:41 @6ca69967 The sentence "Only the ledger count of the file can stop it" is false for an owned HTML file. For such a file, ownership.mjs:145-149 prints COVERAGE-OWNED, because the file becomes incomplete. It is true today, because openspec/ownership.json lists no HTML path. Write "Only the ledger count of an upstream file can stop it".

Files:
- /home/ianblenke/docker/gev-work/html-code-lines/openspec/specs/ownership/spec.md
- /home/ianblenke/docker/gev-work/html-code-lines/openspec/changes/archive/2026-10-18-html-code-lines/specs/ownership/spec.md
- /home/ianblenke/docker/gev-work/html-code-lines/scripts/spec/lib/coverage.mjs
- /home/ianblenke/docker/gev-work/html-code-lines/src/tooling/spec/coverage.test.mjs
- /home/ianblenke/docker/gev-work/html-code-lines/openspec/changes/archive/2026-10-18-html-code-lines/proposal.md
