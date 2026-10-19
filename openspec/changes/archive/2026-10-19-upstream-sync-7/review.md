# Review: upstream-sync-7

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-19
Gates: make gates CHANGE=upstream-sync-7 passed
Rounds: 3
Scope: diff 1cf424722e1e81b750df09b20068b16df603435d
Reviewed-Tree: 2157f3ff884e97e32a82684c2f9e934edcae123071199aa0dbdb4e74a9feb6dc

## Findings

The reports of rounds 1 and 2 are in `review/round-1/` and `review/round-2/`. The reports of round 3 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word, with one exception. In `review/round-1/spec-adversary.md`, the lead replaced the owner's LAN address with "[the old LAN address]" and its first three numbers with "[the first three numbers of the old LAN address]". The owner asked on 2026-10-18 to remove that address from the public fork (design D4). The two replacements change no verdict and no finding.

Resolved files: `server/standalone/vite.config.js` (the one conflict; design D1). `evidence/conflicts.txt` shows that the merge commit differs from the automatic merge only in that file.

Round 1 had the scope full, at the commit 0c39395a. Both reviewers gave FAIL. Round 2 had the scope diff 0c39395a, at the local commit dbc214aa. Both reviewers gave FAIL. Before the push, the lead rewrote the two local commits after 715253d3, because dbc214aa added the round-1 report with the address. The commit 1cf42472 has the files of dbc214aa with the two replacements. The commit e8ce5590 has the round-2 corrections and reports. Round 3 had the scope diff 1cf42472, at the commit e8ce5590. Both reviewers gave PASS with minor findings only.

After round 3, the lead changed only the proposal, the design and `tasks.md`. The lead added each minor finding of the spec adversary to the Known limits of the proposal, and corrected the sentence of design.md that both reviewers named. The lead kept the minor findings of the STE adversary about the evidence files and wrote them as Known limits, because a change to an evidence file needs another round.

The first ratchet run stopped with one TRACE-FAILED-TEST. The timing test "tool string bounds hold at their edges and on huge arguments" of `src/tools/tool-schema-codepoints.test.mjs` went over its limit of 200 ms. At the same time, the lead ran a host fault runner of another change. The second ratchet run, with no other load on the host, gave only REVIEW-MISSING. The file passes on the host and in CI, and this change does not edit it.

Rule 21: the second parent of the merge commit 91de1b68 is 93ea088f. `evidence/upstream-check.txt` shows that `git ls-remote upstream main` gave 93ea088f. The adopt records name 93ea088f (`make adopt CHANGE=upstream-sync-7 FROM=93ea088f4556a5a65b3292a2d15142d5a6c562bc`).

### Round 1 (commit 0c39395a)

- [x] FINDING major (spec adversary and STE adversary) The proposal said that the change edits two tests, and the design said three. Fixed: the proposal names three tests, two of `osh-control-028` and one of `osh-control-039`.
- [x] FINDING major (spec adversary and STE adversary) The design said that `package-lock.json` changes three packages, but the packages of `sharp` also change. Fixed: the design uses the words of the proposal.
- [x] FINDING major (spec adversary) The Known limit `address-history` named two archived files, but six archived files keep the address or a part of it. Fixed: the Known limit names the six files. The new Known limit `old-fault-039` says that the archived fault of the LAN host no longer fails the edited test.
- [x] FINDING minor (spec adversary) No evidence file showed the conflict list. Fixed: `evidence/conflicts.txt`.
- [x] FINDING minor (spec adversary) The silent-merge check did not list the files that both sides changed. Fixed: `evidence/silent-files.txt` lists the 8 files and compares their changed lines.
- [x] FINDING minor (spec adversary) No document recorded the first ratchet run. Fixed: this review.md records it.
- [x] FINDING minor (STE adversary) design.md: two words "its" referred to two addresses. Fixed.
- [x] FINDING minor (STE adversary) design.md: "measure the configuration" was vague. Fixed: the four checks of `make precheck` are named.
- [x] FINDING minor (STE adversary) host-run.txt: "The later commit" did not name the commit. Fixed: the test commit 98e44aa7.
- [x] FINDING minor (STE adversary) silent-files.txt: a sentence had 30 words. Fixed: two sentences.
- [x] FINDING minor (STE adversary) checks.txt: the header did not say that the outputs are cut. Fixed in round 2.

### Round 2 (local commit dbc214aa)

- [x] FINDING major (spec adversary and STE adversary) The round-1 report of the spec adversary held the owner's LAN address, so the Known limit count was false and the change put the address back into the fork. Fixed: the lead replaced the address in that report (see above), rewrote the local commits before the push, and the Known limit says that six files of older changes keep the address.
- [x] FINDING major (spec adversary and STE adversary) checks.txt: the new header gave a false count of lines. Fixed: "at most its last two lines, or its last three lines", and the header names the three checks that print one line and the lines `exit status` of the lead.
- [x] FINDING minor (spec adversary and STE adversary) conflicts.txt: "It writes no file and no ref" was false for the object store. Fixed: "no file in the working tree and no ref".
- [x] FINDING minor (spec adversary and STE adversary) design.md:16 named a trial merge that conflicts.txt does not show. Fixed: "A merge of the same two commits in memory", and conflicts.txt adds `git show --remerge-diff --stat 91de1b68`.
- [x] FINDING minor (spec adversary) "The archived fault 039" could mean nine faults. Fixed: the Known limit names the fault "Accept the address of a LAN host" and line 36.
- [x] FINDING minor (spec adversary and STE adversary) silent-files.txt: the count of 0 does not compare the positions of the lines, and "on top of" was an idiom. Fixed: the sentence says what the count shows and that it does not compare positions.
- [x] FINDING minor (STE adversary) silent-files.txt: "the branch file" had two meanings, and "covers" can mean coverage. Fixed.
- [x] FINDING minor (STE adversary) proposal.md: "takes its place" had two meanings. Fixed: "takes the place of the old fault".

### Round 3 (commit e8ce5590)

- [x] FINDING minor (spec adversary) `evidence/conflicts.txt` gives no date for its third command. Kept: Known limit `conflicts-wording`.
- [x] FINDING minor (spec adversary and STE adversary) `evidence/silent-files.txt`: the count is the number of lines that `diff` marks, and `diff` compares the lists in order. Kept: Known limit `diff-count`.
- [x] FINDING minor (spec adversary and STE adversary) design.md:16: "the same two commits" had no noun before it, and "it shows" and "that file" had two meanings. Fixed in the design with the text of the STE adversary.
- [x] FINDING minor (STE adversary) `evidence/conflicts.txt` line 2: "The command" can mean each of three commands. Kept: Known limit `conflicts-wording`.
- [x] FINDING minor (STE adversary) `evidence/conflicts.txt` line 19: a diff does not remove lines. Kept: Known limit `conflicts-wording` gives the meaning.
- [x] FINDING minor (STE adversary) `evidence/silent-files.txt`: "design D1" is a second name for decision D1, and one paragraph has seven sentences. Kept: Known limit `diff-count` gives the meaning of "design D1". The lint does not read the evidence files, and a change to an evidence file needs another round.
