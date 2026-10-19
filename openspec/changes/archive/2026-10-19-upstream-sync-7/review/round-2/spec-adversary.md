Verdict: FAIL

Tree: dbc214aa. Clone: /home/ianblenke/docker/gev-work/upstream-sync-7. These round-1 corrections are complete and true:
- proposal.md:38 now names three tests, at route.test.mjs lines 211, 304 and 319.
- design.md:58 now uses the words of proposal.md:43. The lock now has sharp 0.35.5 and @img/* 0.35.5 and 1.3.4. The base lock has 0.35.4 and 1.3.3.
- design.md:48, design.md:67, host-run.txt:19 and silent-files.txt:2 are corrected.
- The comm -12 list in silent-files.txt has the same 8 files as the Auto-merging lines of conflicts.txt.
- The six files named in `address-history` are correct. mutations-script.txt:36 adds the old address to LOOPBACK_ADDRESSES, as `old-fault-039` says. Fault 039 of fault-d4.txt fails test 29.

The round-1 finding about the first ratchet run stays open for review.md.

- [ ] FINDING major openspec/changes/archive/2026-10-19-upstream-sync-7/proposal.md:51 (dbc214aa) "six archived files keep the address or a part of it" is false at dbc214aa. That commit adds review/round-1/spec-adversary.md. That file has the full old LAN address on line 5 and its first three numbers on line 10. So seven archived files keep it, and this change adds the address to the public fork, against the owner request of D4. Before the merge, replace the address in that report with "the old LAN address" and record the edit in review.md. Or name the file in the Known limit and give the correct count. I could not check if dbc214aa is on a public remote.
- [ ] FINDING major openspec/changes/archive/2026-10-19-upstream-sync-7/evidence/checks.txt:2 (dbc214aa) The round-1 correction adds a false count. The line says each output shows two lines, or three for openspec validate. But three outputs show one line each: format (line 5), import directions (line 9) and layer tokens (line 18). Write "Each output below shows at most its last two lines, or its last three lines for openspec validate." I could not see the full outputs.
- [ ] FINDING minor openspec/changes/archive/2026-10-19-upstream-sync-7/evidence/conflicts.txt:2 (dbc214aa) "It writes no file and no ref" is false under one meaning. `git merge-tree --write-tree` writes the merged tree and blob objects into .git/objects. Write "It writes no file in the working tree and no ref."
- [ ] FINDING minor openspec/changes/archive/2026-10-19-upstream-sync-7/proposal.md:52 (dbc214aa) "The archived fault 039" can mean any of nine faults, because mutations-script.txt lines 29 to 37 all have the ID 039. Only line 36 adds the old address. Name line 36, or name the fault "Accept the address of a LAN host" (mutations.txt:25).
- [ ] FINDING minor openspec/changes/archive/2026-10-19-upstream-sync-7/design.md:16 (dbc214aa) conflicts.txt shows a new merge in memory (2026-10-19 03:11:44 UTC), not the output of the trial merge d1c50b0e. The command also drops the tree hash, so no file compares the result with 91de1b68. A hand edit in a file that only one side changed is thus not in the evidence. Add `git show --remerge-diff --stat 91de1b68`, or write "A merge of the same two commits in memory reports one file with a conflict."
- [ ] FINDING minor openspec/changes/archive/2026-10-19-upstream-sync-7/evidence/silent-files.txt:97 (dbc214aa) The text says a count of 0 shows "the fork lines on top of the upstream file". But the command drops the hunk headers (-U0 and grep '^[-+]'). So a count of 0 shows the same changed lines, not the same places. Say that the count does not compare line positions.

This report does not write the old address or its prefix.

Not checked: the full outputs of checks.txt, the owner's words for D4, and the upstream text of vite.config.js. I could not read the upstream file, so I could not confirm the count 2 at silent-files.txt:103.