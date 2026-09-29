Spec-adversary review of `osh-control-auto-targets`, round 2 of 3, scope: diff since b80142c.

Tree reviewed: commit 4384d92 (working tree in /home/ianblenke/docker/gev-work/osh-control-auto-targets, branch osh-control-auto-targets).

Verdict: PASS
Findings: none

Verified each round-1 fix against the actual files, not just your summary:

- F1 (critical): src/layers/oshControl/client.test.mjs:17 now reads `[osh-control-034] Build the targets query string with the system id`. openspec/trace/links.json:1868-1872 confirms osh-control-034 now traces to all three real tests (two in route.test.mjs plus this one), and osh-control-016's links no longer include it. Correct fix.

- F2 (minor): src/control/table.test.mjs:14-18, the osh-control-033 test now loops over `42, true, ['sys-fixture-one']` in addition to the malformed strings. I re-checked the logic myself: `typeof body.system !== 'string'` was previously never true in any test (system was always a string, even when malformed) — these three new cases are exactly the ones needed to make that branch's true side true. Correct fix, and I independently confirm the array case specifically defeats the `RegExp.test()` auto-coercion trap I flagged (a single-element array stringifies to its own element and would otherwise pass `OSH_ID_PATTERN`).

- F3/F4 (minor): proposal.md:27 now reads "Retires `osh-control-030` too, and replaces it with `osh-control-034` and `osh-control-035`" — accurate. A "Known limits and later changes" section was added (proposal.md:31-34) carrying the two real open risks from design.md. As a bonus, design.md:60 itself picked up the same "retires... and replaces" correction, even though you didn't list design.md as touched — good, no discrepancy remains between the two documents.

- F5: openspec/trace/history.jsonl still ends at line 1608 for labelArbiter.js/keylessGeocoder.js — no new lines appended since round 1 (checked by counting all 94 occurrences of both filenames and reading the tail). Net effect over this change's ratchet runs is zero, as expected from the count-tolerance mechanism; this is long-standing noise going back to 2026-09-15/16 across many unrelated changes, not something this change caused or needs to fix.

Also checked the requirement rename you mentioned (not one of my findings, but touches the same file): "Target allowlist" → "Target resolution" is a clean REMOVED+ADDED pair in the archived delta (openspec/changes/archive/2026-09-28-osh-control-auto-targets/specs/osh-control/spec.md) with all four scenarios (006, 033, 034, 035) carried into the new ADDED block — none dropped. osh-control-008's removal is unaffected by this rename; it was always under the separate "Command table and validator" MODIFIED requirement, and openspec/trace/retired-ids.json still lists it correctly. ids.json's hashes for 033/034/035 changed (new content hash) with `since`/`change` unchanged, exactly as expected for a same-change wording edit — the scenario IDs themselves were never reused. No new findings from this reordering.

No new critical/major/minor issues found in the round-2 diff.
