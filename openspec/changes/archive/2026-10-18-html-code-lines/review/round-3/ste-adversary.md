Verdict: FAIL

Commit 6ca69967, branch html-code-lines, clone /home/ianblenke/docker/gev-work/html-code-lines. C = openspec/changes/archive/2026-10-18-html-code-lines. Scope: diff 901ffe62. I only read files. I did not run the lint on my replacement texts. I could not check the commits 122cf0e9 and a1aecc48 that the evidence names.

A to D are closed:
- A: AGENTS.md:13 and openspec/config.yaml:23.
- B: C/proposal.md:40.
- C: C/specs/ownership/spec.md:20-21, with the tests at src/tooling/spec/coverage.test.mjs:185,187,189.
- D: C/design.md:28.

The new text has no banned word and no -ing word. The 21 fault names at C/design.md:43-63 agree with C/evidence/faults.txt:3-23.

- [ ] FINDING major C/specs/ownership/spec.md:16-17 (6ca69967; also openspec/specs/ownership/spec.md:85-86) Two meanings in a scenario: "a start tag with a src attribute and an event handler attribute gives each of its lines as a code line". The line does not say "script element", so it can mean the start tag of any element. Under that meaning, `&lt;img src="a.png"` / `onerror="go()"&gt;` gives lines 1 and 2. The code gives only line 2. The reason is that coverage.mjs:123-130 looks for a src attribute only in a script element, and coverage.mjs:141-142 starts the handler span after the line end. Line 17 has the same fault: `&lt;iframe` / `src="javascript:go()"&gt;` gives only line 2 in the code (coverage.mjs:145-148). C/design.md:16, C/proposal.md:13 and the JSDoc at coverage.mjs:93 all say "a script element with a src attribute", so the scenario is the only text with the second meaning. Write: "**AND** a script start tag with a src attribute and an event handler attribute gives each line of that tag as a code line". For line 17, write: "**AND** a script start tag with a src attribute and a `javascript:` URL gives each line of that tag as a code line" (23 and 22 words, not linted).
- [ ] FINDING minor C/design.md:20 (6ca69967) "A URL can follow `=` and a quote, with white space before or after the quote." This was my round-2 replacement. It does not say "only", but spec.md:20 and coverage.mjs:96 do. For `href="x javascript:f('a',` the code ends the URL at the first quote of either type (coverage.mjs:150), not at the next quote of the same type. Write: "with only white space before or after the quote".
- [ ] FINDING minor src/tooling/spec/coverage.test.mjs:188 (6ca69967) "the quote of such a value". The comment before it names "A URL in single quotes", but the test string at line 189 has double quotes. Write: "White space can come before and after the quote of a URL value."
- [ ] FINDING minor src/tooling/spec/coverage.test.mjs:190 (6ca69967) "is code when it has a handler or a URL". Each src value is a URL, so "a URL" can mean every src start tag. But the fixture at line 161 (`&lt;script type="module" src="b.js"&gt;`, fixture line 14) gives no code line. "it" can also refer to the tag or to the element. Use the words of coverage.mjs:126-127: "is code when the tag has a handler attribute or a script URL".
