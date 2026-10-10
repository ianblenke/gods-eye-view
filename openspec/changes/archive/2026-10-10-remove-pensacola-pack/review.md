# Review: remove-pensacola-pack

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-10
Gates: make gates CHANGE=remove-pensacola-pack passed
Rounds: 4
Scope: diff 5f35f3453137698dacaf623404e55798f7f7b8b0
Reviewed-Tree: TREE_HASH_PLACEHOLDER

## Findings

The reports of round 1 are in `review/round-1/`, the reports of round 2 in `review/round-2/` and the reports of round 3 in `review/round-3/`. The reports of round 4 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the final message of the agent.

Verdicts (spec adversary / STE adversary): round 1 FAIL / FAIL; round 2 FAIL / FAIL; round 3 FAIL / PASS; round 4 PASS / PASS.
The agents of the session kept the old severity instructions during these reviews. The brief of each round gave the severity rule of the owner, and the reports follow that rule. The rules allow a fourth round after a major finding in round 3.

### Round 1 (scope full) - FAIL / FAIL

- [x] FINDING major (spec-adversary and ste-adversary) `design.md` said that no part of the pack stays and that the change removes every entry, but the add entry of `CHANGELOG.md` and the old trace lines stay. Corrected: D1 and the Source section name what stays.
- [x] FINDING minor (spec-adversary and ste-adversary) The new entry of `CHANGELOG.md` had no date for the count of 17 cameras. Corrected: the entry says "On 2026-10-09".
- [x] FINDING minor (spec-adversary and ste-adversary) The Known limit `pr-605` used "it" for two things, the label "Rule 25" did not fit a change with no sync, and the proposal did not list the `retired-ids.json` edit. Corrected in `proposal.md`.
- [x] FINDING minor (spec-adversary and ste-adversary) D2 did not name the hand edit of `links.json` or the 21 entries of `ids.json`, the date of the old change was unclear, and the search covered the word Pensacola only. Corrected: D2 and the Source section name them, and `evidence/host-checks.txt` has the wider search.

### Round 2 (scope diff 7c2426e5) - FAIL / FAIL

- [x] FINDING major (spec-adversary and ste-adversary) A sentence of the lead in `evidence/host-checks.txt` called the account id of the layer address the item id of the layer. Corrected: the sentence names both ids, and the search includes both.
- [x] FINDING major (spec-adversary) Box 3.2 was checked, but the record covered 22 test files of `src/data` and not each CCTV test file. Corrected: the lead ran 33 test files (381 tests, each `fail 0`) and the record lists them.
- [x] FINDING minor (spec-adversary and ste-adversary) D1 left out the count text of the README row, the proposal had a bullet with two instructions and no bullet for `links.json`, and the word "records" was too wide. Corrected in `design.md` and `proposal.md`.

### Round 3 (scope diff ca8f87fe) - FAIL / PASS

- [x] FINDING major (spec-adversary) A new sentence of the lead in `evidence/host-checks.txt` said "31 files with cctv in the file name", but three of the files have cctv only in the folder name. Corrected: the sentence says "in the path".
- [x] FINDING minor (spec-adversary and ste-adversary) One test file only loads the CCTV provider modules through the server plugin, D1 listed four texts with a list of two, and task 3.1 did not say which names. Corrected: "load", a new D1 text and a new text of task 3.1 (18 words).

### Round 4 (scope diff 5f35f345) - PASS / PASS

- [x] FINDING minor (ste-adversary) Task 3.1 "the pack and layer names and ids" can read as the ids of the pack. The lead keeps the text: the replacement of the agent has 20 words, the limit for a task, and the spec adversary found the text of task 3.1 true.

## Own mistakes of the lead in this change

- [x] FINDING minor (lead) Three corrections of the lead added a new fault to the same file: the id sentence (round 2), the file count (round 2 and round 3) and a D1 sentence of 27 words that `make lint` found at once. The lead now checks each count in a document with a command before the document says it.

## Record of the image ratchet

The lead ran the image ratchet with `make ratchet CHANGE=remove-pensacola-pack` in the Docker image `gods-eye-view:local` on commit `716a7869ed1d8a05e4c3520be474a43e3ce3cc33`, before the archive. Its log starts with `docker run` and has the line `Command: ratchet`. The only error is the missing `review.md`. The verdict lines are:

```text
Command: ratchet
Ownership: 9 owned, 8 upstream
Trace: 936 scenarios, 915 verified, 21 open. 9600 tests, 3705 traced, 5895 untraced.
Coverage: 1067 files, 305 complete, 53 not loaded, 0 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 760 code files, 46573 lines, 497 test files, 5895 tests.
COVERAGE-DIFF: 0 changed lines, 0 brought by the merged upstream commit, 0 need coverage.
Ratchet: 2 history lines for remove-pensacola-pack.
Ledger: 0 entries do not match the current gaps.
ERROR REVIEW-MISSING openspec/changes/remove-pensacola-pack/review.md Change remove-pensacola-pack has no review.md
```

The 21 open scenarios are the scenarios `live-sources-010` to `live-sources-030`. They were still in the spec at that time, and their tests were gone.

After the archive, the lead added the 21 IDs to `openspec/trace/retired-ids.json` and removed the 21 empty links of these IDs from `openspec/trace/links.json`, both as text edits. The command `make gates-docs` then gave only the error REVIEW-MISSING at commit 7c2426e5. Later, the lead changed `CHANGELOG.md`, which lies outside the three paths, so `make gates-docs` refused to run ("NO TEST RUN: refused"). The lead ran the final `make gates` on the final tree.

## Known limits for the owner to confirm

- [x] FINDING minor (lead) Rule 23: the change removes two paths from `openspec/ownership.json`, `server/providers/cctv/pensacola.js` and `src/data/cctvPensacola.test.mjs`. The owner asked for the removal of the pack and reads this diff in the pull request.
- [x] FINDING minor (lead) A server that has a `CCTV_PENSACOLA` setting in its environment ignores it after this change (limit `env`).
- [x] FINDING minor (lead) Upstream pull request 605 adds a Florida pack from the same layer. If the pull request lands, the Pensacola cameras can return through the Florida pack (limit `pr-605`).
- [x] FINDING minor (lead) Tasks 4.4 to 4.6 stay unchecked, because `tasks.md` is part of the reviewed tree. They are the review, this file and the final gate run.
