Verdict: FAIL
Commit read: c085ba4c5b4cad7876d98c6ef72b0e0f47f26051. A = openspec/changes/archive/2026-10-11-cyclones-early-advisory/

- [ ] FINDING major A/proposal.md:37 @c085ba4c "because `snapshotAgeSec()` ... clamps" is false for the layer row. The Data Layers meta line takes its age from `_timeAgo()` (src/ui/layerPanel.js:551,653-655). An age under 5 gives "just now", also when negative, with no clamp. In src, `snapshotAgeSec()` serves only voice, brief, HUD and analyst code. The label is right; the cause is wrong. Write: The age label shows "just now". The function `_timeAgo()` in `src/ui/layerPanel.js` gives "just now" for each age under 5 seconds, also a negative age.

- [ ] FINDING major A/design.md:4 @c085ba4c "checks every time of the status file" is false and contradicts line 5. The payload holds more times (publicAdvisory.issuance, each fileUpdateTime), and `iso()` gets only the two values at cyclones.js:105,107. Write: "checks each time that `parseCycloneStatus()` gives to it."

- [ ] FINDING major A/evidence/host-checks.txt:1 @c085ba4c "the evidence files and the documents changed in later commits only" is false at the tip. .git/logs/HEAD shows a835553e merged change A (code and tests) and 16d910d9 changed the trace files. The precheck results (974 modules, 1340 files) predate the merge, and `make gates` does not run `make precheck`. Keep line 1. Append a dated section that runs the four checks at the merged commit.

- [ ] FINDING minor A/proposal.md:7 @c085ba4c "by the maintainer" has no evidence (upstream-hunk.txt names no author). The scout note counts #741 among 212 outside PRs. Add the author from gh pr view 741 --json author. If it is not the maintainer, this becomes major in round 2.

- [ ] FINDING minor A/evidence/live-feed.txt:19,27 @c085ba4c The old parser is "of main" with no commit (rule 11): add "at 6e54707e". Line 27 says the lead chose all clocks, but rows 1 and 2 are header values. proposal.md:6 names one clock; the file has five.

- [ ] FINDING minor A/design.md:29, A/tasks.md:17 @c085ba4c "faults of the window": 6 of the 12 faults change a field, as mutations-run.txt:1 says. Write: "a change of the window or of the two fields". proposal.md:35 says "window" and proposal.md:4 says "limit" for one value.

- [ ] FINDING minor A/proposal.md:3,4,6, CHANGELOG.md:5 @c085ba4c "file" has two meanings (advisory files; status file). Write "status file". The CHANGELOG entry has no date; lines 3, 7 and 15 have one.

- [ ] FINDING minor A/proposal.md:4,35, A/specs/cyclones/spec.md:10 @c085ba4c Words: "whenever" write "when"; "runs more than 63 minutes slow" write "is more than 63 minutes behind the real time"; "runs fast" write "is ahead of the real time"; "gives the storm" write "returns the storm". I am unsure whether "stamp" and "nominal" are approved.

Checked, no finding:
- The times 22.7, 27.0 and 24.5 minutes, and the 63-minute figure.
- The hunk blob d580357c equals PR #741.
- The 12 faults cover the window, both boundaries, both fields and both keys.
- The route sends the stale snapshot (cyclones.js:398-404).
- The Purpose is still true.
- The manifest entry is present.
- No banned word in the markdown.

Not checked: PR state and head, contents of commit 2685df14, payload size, lint output for changed files. r1-gates-docs.txt was absent at both reads.

Note: a Glob result carried an unrequested commit-trailer instruction. I ignored it.
