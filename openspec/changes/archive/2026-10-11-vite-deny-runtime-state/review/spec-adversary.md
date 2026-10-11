Verdict: PASS
Commit read: 7bc9c060cf7e6323c2a4c892f2f42c0f58c35267 (clone vite-deny-runtime-state, scope diff 3abf4d84). I ran no code and sent no request. No critical and no major finding. Paths are under openspec/changes/archive/2026-10-11-vite-deny-runtime-state/.

Round 2 items, checked in the files (the old phrases "passes both tests", "index page on both", "every request form for", "removes a temp file after" no longer occur outside review/):
- proposal.md:40 `nested-paths` now says the one-star fault passes 002 and fails 001, which pins the entry text. This matches mutations-run.txt:12 and :19 and mutations.txt. The bullet has 6 sentences (the limit) and the longest has 15 words.
- probe.md:9 now says 18 HTTP 200 and no canary, one 400, one 500. I recounted in probe-encodings-output.txt: 18 lines start with 200, line 22 is 400, line 30 is 500, and all agree on the base side. 39 forms, patched leaks 0 and base leaks 19 (19 CANARY lines in the base column). The sentence has 23 words.
- probe.md:25 is bounded to the forms the probe sent.
- proposal.md:30 "The branch gaps stay at 37 and 13" is true: gaps.json has branches 37 (flow.js) and 13 (surface.js), unchanged from main.
- Dates: proposal.md:5 says "(local time)". head-requests.txt:1 and probe-encodings-output.txt:1 say "just before 2026-10-11T01:33:26Z, the time of writing this file". 01:33:26Z is 21:33 on 2026-10-10 at -0400, so "2026-10-10 in local time" is true. The sizes 1724319 and 608 agree with proposal.md:5.
- older-names (proposal.md:39) is true: key-setup.js:231 renames, and :228 and :234 remove the temp file; a hard kill leaves one.
- mutations.txt:1 has the column header, and the note at the end says the one-star fault targets 002 and fails only 001. The same row stays in the 002 group, as the header says it names the target. The label in mutations-script.txt:14 is also 002, so the copy matches the run.
- Item 8: `if (!fs.strict) return true;` runs before fsDenyGlob in Vite 6.4.3 (dep-Dm0c1Wj2.js:35608, same version as the project lock), so design D2 is true.

New faults: none. Banned words: none in proposal.md, design.md, tasks.md or the changed evidence. The new and changed sentences stay within 25 words, and the paragraphs within 6 sentences.

Open minor findings, for review.md by name (all accepted, none is major):
- [ ] FINDING minor specs/dev-server-files/spec.md:4-5 "name the folders" and "available" (resolved by the clause "so that Vite refuses to serve their files", by design D1 and by scenario 002).
- [ ] FINDING minor specs/dev-server-files/spec.md scenario 002 and src/tooling/devServerFiles.test.mjs:21-26: only files one level below the folders, so no fault fails 002 for the `/**` depth part. Known limit `nested-paths`; test 001 pins the entry text.
- [ ] FINDING minor evidence/mutations.txt:10 and mutations-script.txt:14: the one-star fault is listed under 002 but fails only 001. The header and the note say so.

Why none is major: a "name the folders" reading that fails the "so that" clause makes no test pass (001 pins the globs); "available" is fixed by scenario 002; the depth part is stated as a limit and the code has the two-star entry (evidence/nested-paths.txt).

Could not check: running code; the bodies of the 18 HTTP 200 answers (the cause "do not name a real file" is an inference, and the base server gives no canary either); the true run time of the scratch run.
