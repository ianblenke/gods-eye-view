Verdict: PASS

Commit read: 5b9ed1a24851e54cba856621995de14561820eac (clone `/home/ianblenke/docker/gev-work/harden-timing`, branch harden-timing-tests). Scope: `diff 7255865`. The files are in `openspec/changes/archive/2026-10-07-harden-timing-tests/`.

Both round-3 majors are closed:
- **Controller stop test.** The fixture sets `closeTimeoutMs` to 30 (`controller.test.mjs:636`, used by the test at 745). The code has two deadlines (`controller.js:933,947`). Two deadlines of 125 ms give 250 ms, and `< 250` fails (`controller.test.mjs:761`). The `stop()` assertion has a limit of 500 ms (`controller.test.mjs:759`).
- **corrections.md rows 31 and 33.** The cells now quote `complete gates assessment` and `short real wait`, as `round-1/ste-adversary.md:8,10` does.

No new banned word appears in the changed lines. "priority" is not "prior".

- [ ] FINDING minor design.md:263 proposal.md:41 "lengthens the two close deadlines to 125 ms or more" -> "sets each of the two close deadlines to 125 ms or more" "The two deadlines to 125 ms" can mean the sum. A sum of 125 ms passes `< 250`, which disagrees with the code. Each deadline at 125 ms gives 250 ms. "lengthen" may not be approved (not sure).
- [ ] FINDING minor design.md:261,264 proposal.md:40 "fixes the elapsed value at 60 ms: two close deadlines of 30 ms" -> "is 60 ms, the sum of two close deadlines of 30 ms"; "it fails only above 500 ms" -> "this assertion fails only when `stop()` takes more than 500 ms" "fixes" is figurative (not sure it is approved). The colon gives a fragment with no verb. "it" can mean the assertion or `stop()`. "above" is used for a number.
- [ ] FINDING minor design.md:266 proposal.md:42 "keeps its inequality below 5000 ms" / "keeps the real-clock assertion below 5000 ms" -> "keeps its assertion that the elapsed time is below 5000 ms" The two files use two names for one thing. "below" attaches to the assertion. This is the same fault as the round-3 finding, in a changed line (proposal.md:42).
- [ ] FINDING minor design.md:332 "the corrections of round 1" -> "the round 2 corrections" `corrections.md:15,111` and the section title `design.md:330` say "Round 2". `review.md` is not in the folder yet, so "records the later corrections" points to a file that does not exist.
- [ ] FINDING minor corrections.md:17 design.md:255 "The worker started at commit 3b72650; the checks cover the edits that commit b95b44f holds." -> "The work started at commit 3b72650. The checks include the changes in commit b95b44f." The facts agree with `.git/logs/HEAD` (3b72650 is the move out of the archive; b95b44f is the round-1 correction). "worker" appears in no other line, and the prose elsewhere says "the lead". "cover" and "holds" are figurative. "edits" is a verb used as a noun.

Not read: the test code of cctvProxy, gbfsProxy and requests (so I did not check proposal.md:46 "No production change can make those elapsed assertions fail", which the diff does not change), `tasks.md`, the lint warning list, the trace files, the tools logs and `review.md`. I could not run git, so I read `.git/logs` for the commit facts. I did not check the new `evidence-outside-repo` file list against the tools directory.
