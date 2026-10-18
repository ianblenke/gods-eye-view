Verdict: FAIL

I read the tip commit 500f233a (branch html-code-lines, clone /home/ianblenke/docker/gev-work/html-code-lines). I did not run git, so I took the diff from the reflog. It has two commits: 89a56911 adds the round-4 reports, and 500f233a changes proposal.md:42. I only read files and did not run code.

Q1: Closed. The claim "a handler attribute after that `&gt;` gives no code line" now applies only "When a src attribute comes before that `&gt;`". Take `&lt;script data-x="a&gt;b"` / `onload="init()"&gt;` / `x();` / `&lt;/script&gt;`. coverage.mjs:124 and :131-135 give lines 1 to 3 for it, as the new text says. The new text has no banned word.

Q2: The new third sentence adds one major fault.

- [ ] FINDING major openspec/changes/archive/2026-10-18-html-code-lines/proposal.md:42 @500f233a False statement: "Without such a src attribute, both functions read the text after that `&gt;` as script text." Input: `&lt;script data-x="a src=b&gt;c" onload="init()"&gt;` / `x();` / `&lt;/script&gt;`. This HTML has no src attribute: coverage-gate-041 (openspec/specs/coverage-gate/spec.md:81-82) says that `src=` in a quoted value is not the src attribute. But the attributes that the functions read stop at the `&gt;`: ` data-x="a src=b`. QUOTED_VALUE (coverage.mjs:6) removes no text, because that quote has no end quote. So SRC_ATTRIBUTE (coverage.mjs:7) finds ` src=`, `inline` is false (coverage.mjs:80, :124), and both functions give no code line. The handler and `x();` get no COVERAGE-DIFF, but the limit says that they are code lines. Possible text: "When a src attribute, or the text `src=` after a white space character in that quoted value, comes before that `&gt;`, a handler attribute after that `&gt;` gives no code line. Without such a text, both functions read the text after that `&gt;` as script text." Run node on this input before you use the text. I could not run it.

Files:
- /home/ianblenke/docker/gev-work/html-code-lines/openspec/changes/archive/2026-10-18-html-code-lines/proposal.md
- /home/ianblenke/docker/gev-work/html-code-lines/scripts/spec/lib/coverage.mjs
