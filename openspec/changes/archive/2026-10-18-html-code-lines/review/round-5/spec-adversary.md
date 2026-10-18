Verdict: PASS

I read the archived change `html-code-lines` in /home/ianblenke/docker/gev-work/html-code-lines on branch `html-code-lines`, at tip commit 500f233a. The scope is diff a88378d8..500f233a. I only read files. I did not run code, git or the lint.

Q1: The round-4 major is closed. Line 42 of /home/ianblenke/docker/gev-work/html-code-lines/openspec/changes/archive/2026-10-18-html-code-lines/proposal.md now has three sentences, and each agrees with /home/ianblenke/docker/gev-work/html-code-lines/scripts/spec/lib/coverage.mjs:
- With `&lt;script src="a.js" data-x="a&gt;b"` / `onload="init()"&gt;`, the attributes group stops at the first `&gt;`. That group is ` src="a.js" data-x="a` (line 5). The src test finds ` src=` (lines 80 and 124). The group has no handler (line 128), and the element becomes blanks in the outside text (lines 83 and 138). So there is no code line, and the count is 0.
- With no src attribute before the `&gt;`, `inline` is true. Lines 131-135 add each line of the text that is not blank, and line 81 counts the same lines. This matches the lead's node check: [1,2,3] and 3.
- "Such" ties the second case to "a src attribute that comes before that `&gt;`". So a src attribute after the `&gt;` is correctly part of the script text.

Q2: The diff adds no new critical or major fault.
- The reflog shows two commits after a88378d8: 89a56911, which adds the round-4 reports, and 500f233a, which corrects the Known limit. Both are docs commits.
- No other text names `gt-in-value`, so no other sentence contradicts the new text. design.md:14 and :50 still agree with the code.
- The new sentences have no word from the lists `words`, `phrases` or `newWords` in /home/ianblenke/docker/gev-work/html-code-lines/openspec/ste/words.json. "read" is only in the list `nounVerbs`, which gives a warning.
- The round-4 reports in `review/round-4/` keep the round-4 findings as they were written, with the commit a88378d8.
- In /home/ianblenke/docker/gev-tools/hcl-docs-7.log the only error is REVIEW-MISSING (line 2619). The log also shows Ledger: 0 entries do not match the current gaps, STE: 0 errors, and Trace: 1136 scenarios, 1136 verified, 0 open.

Findings: none
