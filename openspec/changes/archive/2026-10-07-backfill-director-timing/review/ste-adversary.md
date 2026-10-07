Verdict: PASS
- [ ] FINDING minor design.md:26-28 "The trace check checks" -> "The trace gate checks" (also coverage, STE) Two names for one thing: design.md:23,24,84 and proposal.md:25 say "gate". The noun and verb also repeat.
- [ ] FINDING minor tasks.md:506 "unknown visual, group, pack and layer fields" -> "unknown visual, visual control, pack and layer fields" Line 510 now says "visual control" for the same thing.
- [ ] FINDING minor evidence.md:824; tasks.md:560 "the next subscriber gets the state", "the next subscriber after an error" -> "each later subscriber gets the snapshot", "each later subscriber" The spec, tasks.md:580 and evidence.md:827 say "later" and "snapshot".
- [ ] FINDING minor spec.md:137,139 "duration 4 seconds", "progress 0.25", "total duration 0" -> "scene duration 4 seconds", "scene progress 0.25", "scene duration 0" One value has two names. Lines 134 and 139 say "scene progress".
- [ ] FINDING minor spec.md:217,219 "the start scene `b` gives shots", "a single scene `a` gives" -> "the queue for start scene `b` gives", "the queue for a single scene `a` gives" Scene b holds only b1. The queue holds b1, a1 and a2.
- [ ] FINDING minor spec.md:145,148,193 "gets the snapshot", "leaves it null", "the timeline gives start time 0" -> "gets a snapshot", "leaves the snapshot null", "... for that absent shot ID" "it" has no clear referent. Line 193 lost its condition.
- [ ] FINDING minor design.md:124; evidence.md:845,847; tasks.md:570,584 "before the last scene", "each stopped subscriber snapshot" -> "that is not the last scene", "the snapshot that each subscriber gets after the stop method" "before" can mean the place of the test. The clock stops, not the subscriber.
- [ ] FINDING minor playback.test.mjs:957 (and evidence.md, mutations.md) "starts at scene a and keeps" -> "starts at scene "a" and keeps" "a" reads as the article. Also document.test.mjs:742 "fields below each version limit" -> "fields at versions below each limit" (a field is not below a limit).
- [ ] FINDING minor proposal.md:32-34 "a count change", "The lines changed", "the same flip appears" -> "a different count", "The line count changed", "the same count change appears" "change" has three meanings in 3 lines. "flip" is not approved.
- [ ] FINDING minor design.md:4,130; evidence.md:3,733,864,874 "the lead's branch", "The source tree read ... was", "The stop test", "probes pass" -> "the working tree", "The worker read commit `32f10e3`", "The test of the stop method", "probes give the same result" "branch" means Git branch here and code branch in "branch audit". Passive voice; "stop" as a noun; "pass" has a third meaning (unsure).
- [ ] FINDING minor tasks.md:592 "Check the final tests, coverage, mutations and prose." -> one task for each check. Four instructions in one task.

Both round-2 majors are closed. "round" now means only "review round", and "pass" means only a worker step. Director-036 states each queue result. The owner words appear only in old test titles and inline code, and the diff adds no test comments.

Tree: /home/ianblenke/docker/gev-work/director, commit c31c23d0c7abf10a1350b4912a6f1ee9557d3fe5. Paths are in openspec/changes/archive/2026-10-07-backfill-director-timing/, and spec.md means specs/director/spec.md (the applied file is one line shorter).

Not read: mutations.md m001-m312, trace files and scratch scripts. Unsure, not filed: "wrap", "brief" as a noun, "calls ... a pass", and semicolons. I did not cut any finding.
