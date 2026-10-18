Verdict: FAIL

Tip a88378d8, branch html-code-lines, scope diff 6ca69967..a88378d8. I only read files. I could not run git, so I found the changed lines from the reflog, the round-3 reports and the dispositions file.

Q1: The round-3 major is closed. Lines 16 and 17 of specs/ownership/spec.md and lines 85 and 86 of openspec/specs/ownership/spec.md now say "a script start tag". That agrees with coverage.mjs:128-130 and with the tests at coverage.test.mjs:191-192. The `&lt;img&gt;` case now falls only under line 18, and the code gives only the handler line for it.

Q2: The diff adds one major fault. The other changed parts are correct:
- The three comments at coverage.test.mjs:186-190 agree with their test strings.
- The `x();` line makes the new fault fail at line 191: the result becomes [1, 2, 3].
- Design lines 43-64 and faults.txt lines 3-24 both list the same 22 faults.
- Design line 20 agrees with the pattern `/=\s*(["'])\s*$/`.

- [ ] FINDING major openspec/changes/archive/2026-10-18-html-code-lines/proposal.md:42 @a88378d8 The Known limit `gt-in-value` is false for a script start tag that has no src attribute before the `&gt;`. Example: `&lt;script data-x="a&gt;b"` / `onload="init()"&gt;` / `run();` / `&lt;/script&gt;`. The functions read only ` data-x="a` as the attributes, so they treat the element as having no src attribute (coverage.mjs:124). Then each line of its text that is not blank is a code line (coverage.mjs:131-135), and that includes line 2 with the handler. inlineScriptLines counts that line too (coverage.mjs:80-81). So the sentence "Then a handler attribute after that `&gt;` gives no code line" is true only when the src attribute comes before that `&gt;`. Limit the text to such a start tag, and say that without such a src attribute the lines after the `&gt;` are script text and code lines.

Files:
- /home/ianblenke/docker/gev-work/html-code-lines/openspec/changes/archive/2026-10-18-html-code-lines/proposal.md
- /home/ianblenke/docker/gev-work/html-code-lines/scripts/spec/lib/coverage.mjs
