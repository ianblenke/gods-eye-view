Verdict: PASS
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/design.md:107,122,124; openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/evidence.md:382,383 "Corrections A and C give exact AND text" -> "The AND lines of scenario 055 keep their exact text" The letters A, C and D exist nowhere else (tasks use 5.1 to 5.14). "The general panel-agent request" has no referent.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/specs/recent-imagery/spec.md:22 "when a late old fetch ends" -> "when a late old fetch throws AbortError" "ends" also reads as success. thumbnails.test.mjs:637-656 covers only a rejection.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/specs/recent-imagery/spec.md:47,48 (also openspec/specs/recent-imagery/spec.md:612,613; recentImagery.test.mjs:2945,2959; muts.json rows 26-29; evidence.md:322,324,325) "a scroller without a viewport height value"; "a card inside the view" -> "a body without a viewport height value"; "a card inside the viewport" The spec calls the element "the body" and the size "viewport height". "scroller" and "view" are second names.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/specs/recent-imagery/spec.md:23; thumbnails.test.mjs:410 "the proof of a present day"; "an AbortError from the fetch" -> "the proof of a day with present proof"; "an external AbortError from the fetch" Test 658 and the spec use different words. The spec says "external".
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/proposal.md:8,60,62; openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/design.md:120 "makes the scroll request"; "its own scroll position"; "check the move" -> "sends the scroll request" (as spec 050); "its own body scroll position"; "check that the body moves" Two verbs, two names, a verb used as a noun.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/evidence.md:226,227 "The base returns unknown coverage." -> "The code without the mutation returns unknown coverage." "base" is the old commit 81b8bd6 at :138,295. "The mutation of the footprint" can read as a change to the footprint. Write "The mutation 056-sparse-ring fails the test of a footprint with an absent point."
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/evidence.md:159,314,329; openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/tasks.md:71 "host isolation setting"; "open-state card test"; "height test" -> "host isolation option" (:262 says option; "setting" is an -ing word); "test of the panel that shows the DETAILS card" (the old name fits tests 1409 and 2460); "undefined-height test"
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/design.md:84,112,115,116; openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/evidence.md:307,308,316,317 "in every render"; "the extra write"; "into render"; "requests `[]`"; "of 20 instead of 10" -> "each time it renders"; "when the code sets scrollTop again to 40"; "into `render()`"; "and no scroll request"; add "pixels" Verb as noun, bare function name, no unit.
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/proposal.md:52; openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/evidence.md:254,302,371; openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/design.md:97 "changes tier"; "at Git current commit"; "final complete command results" -> "changes the tier"; "at the current Git commit"; "the results of the final complete command". I am not sure STE approves "Thus" (design.md:113) or "actual" (evidence.md:307).
- [ ] FINDING minor openspec/changes/archive/2026-10-07-fix-recent-imagery-defects/tasks.md:74,88,90 "Name the browser QA limit" (also 5.2, 5.6) -> "Write the browser QA limit in the proposal" "Name" gives no place. evidence.md:290 "Each branch of revealCard receives coverage" -> "The tests cover each branch of `revealCard`". evidence.md:328 "Rows 22 and 23 test those guards" -> "The mutations of rows 22 and 23 remove those guards".

Notes. A = openspec/changes/archive/2026-10-07-fix-recent-imagery-defects (the reviewer asked to write the full path when copying).

Tree read: /home/ianblenke/docker/gev-work/fix-ri, commit 2d498e405645176213c318988ae2626533f9e146.

Round 2 majors: both are closed.
- The 055 AND lines now match tests 2920, 2439, 2945 and 2959.
- proposal.md:51 matches design.md:98 and `r2-base-probe.log`.

Checked, no fault found:
- The owner's 16 words: none in the prose, the applied spec or the test names.
- Passive voice, and `MUST`, `WHEN`, `THEN`, `AND`.
- -ing words: "working tree" is a Git name, so I accepted it.
- Sentence, task and paragraph limits.
- The new and changed test names.
- The diff adds no comments to the test files.

Not read: the logs in `evidence/` except `r2-base-probe.log`, the code fields (old and new) of `muts.json`, and the reports of round 1. I also did not run any command.

For this review I read the diff, the full text of proposal.md, design.md, tasks.md, evidence.md and the applied spec lines 546-626. I also read the changed tests, the helper `auditScroll`, the `revealCard` function and `qa-recent-imagery.mjs:1386-1410`.

The history lines for ais-store in `openspec/trace/history.jsonl` agree with proposal.md:55-57.

Verdict: PASS. There are 10 minor findings and no major finding. The two round 2 majors are closed. Minor 1 (the letters A, C and D) is the one to fix first. The other nine are cosmetic or about wording.
