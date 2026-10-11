# Review: vite-deny-runtime-state

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-11
Gates: make gates CHANGE=vite-deny-runtime-state passed
Rounds: 3
Scope: diff 3abf4d84dc0020a3f53694361fb4a6fecd673a78
Reviewed-Tree: 897188b62dbf34199de9526f2a392043d37779b0d38738e80cc89319a27bb21b

## Findings

The reports of round 1 are in `review/round-1/`. The reports of round 2 are in `review/round-2/`. The reports of round 3 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the final message of the agent.
The agents of the session kept the old severity instructions during these reviews. The brief of each round gave the severity rule of the owner, and the reports follow that rule.

Verdicts (spec adversary / STE adversary): round 1 FAIL / FAIL; round 2 FAIL / FAIL; round 3 PASS / PASS.

### Round 1 (scope full) - FAIL / FAIL

- [x] FINDING major (spec-adversary and ste-adversary) The Known limit `lexical-match` said "Nothing in the app creates a link". `server/mcp/panelKey.js:103` makes one hard link, and both of its names are in `.gev-cache`. Corrected: the proposal says so, and that nothing creates a symlink or writes under `public`.
- [x] FINDING major (spec-adversary and ste-adversary) Task 3.2 had two instructions. Corrected: tasks 3.2 and 3.3 have one instruction each, and the old tasks 3.3 to 3.6 are now 3.4 to 3.7.
- [x] FINDING minor (spec-adversary and ste-adversary) The `SECURITY.md` sentence had 31 words. Corrected: two sentences of 14 and 17 words.
- [x] FINDING minor (spec-adversary and ste-adversary) Scenario 001 pins five old entries, and only three had a fault. Corrected: the faults for `.env` and `*.{crt,pem}` were added, and the fault `fs.strict: false`. There are now 14 faults, and each fails the test that it names.
- [x] FINDING minor (spec-adversary) The test uses files one level below each folder, so the fault `**/.gev-logs/*` (one star) does not fail `dev-server-files-002`. Recorded as the Known limit `nested-paths`, with `evidence/nested-paths.txt`. The scenario text stays, because a change needs a new image ratchet and invalidates the stacked change `cyclones-early-advisory`.
- [x] FINDING minor (spec-adversary) Design D2 did not say which fault only the test of `dev-server-files-002` finds. Corrected: it names the two faults that deny too much and the fault `fs.strict: false`. The lead read `isFileLoadingAllowed` in Vite 6.4.3: `if (!fs.strict) return true;` runs before `config.fsDenyGlob(...)`.
- [x] FINDING minor (spec-adversary) Known limits missing or not exact: `scripts-as-text`, the files of `SECURITY.md` and `CHANGELOG.md` in `upstream-line`, the temp file in `older-names`, and the branch totals of `flow.js` and `surface.js` in `history.jsonl`. Corrected in the proposal.
- [x] FINDING minor (spec-adversary) The outputs of the 39-form run and of the HEAD requests had no record. Corrected: `evidence/probe-encodings-output.txt` and `evidence/head-requests.txt` (status and sizes, no content).
- [x] FINDING minor (ste-adversary) `evidence/probe.md` said that the entries hold "against every form above". Corrected in round 2 to a bounded sentence.

### Round 2 (scope diff 42151bc8) - FAIL / FAIL

- [x] FINDING major (spec-adversary and ste-adversary) The Known limit `nested-paths` said that the one-star fault passes both tests. It fails `dev-server-files-001`, which pins the entry text. Corrected: the proposal says that the fault passes `dev-server-files-002` and fails `dev-server-files-001`. The error was an own mistake of the lead, and the round 1 report of the spec adversary repeated it.
- [x] FINDING major (spec-adversary and ste-adversary) `evidence/probe.md` said that the other 20 paths give the index page on both servers. `evidence/probe-encodings-output.txt` shows 18 paths with HTTP 200, one with HTTP 400 (`#x`) and one with HTTP 500 (`%c0%ae`). Corrected: the sentence says this and names no index page.
- [x] FINDING minor (ste-adversary) "The gaps stay at 37 and 13" did not name the metric. Corrected: "The branch gaps stay at 37 and 13."
- [x] FINDING minor (spec-adversary and ste-adversary) The date of the HEAD requests (UTC in the file, local in the proposal) and the same time stamp on two evidence files. Corrected: the proposal says "(local time)", and both files say that the stamp is the time of writing the file.
- [x] FINDING minor (ste-adversary) `older-names` said that the writer removes the temp file. `server/standalone/key-setup.js` renames it (line 231) or removes it (lines 228 and 234). Corrected.
- [x] FINDING minor (spec-adversary and ste-adversary) The row of the one-star fault is in the group of `dev-server-files-002` but fails only `dev-server-files-001`. Corrected: `evidence/mutations.txt` has a column header and a note. The lead kept the row in the group of the scenario that the fault targets, because `mutations-script.txt` is a copy of the script that ran.
- [x] FINDING minor (spec-adversary) The sentence of `evidence/probe.md` about the two new entries was wider than the evidence. Corrected: "every request form that the probe sent for the two folders".

### Round 3 (scope diff 3abf4d84) - PASS / PASS

The minor findings below stay open by name. The lead accepts each of them. None is major under the owner rule.

- [x] FINDING minor (spec-adversary) The words "name the folders" and "available" in `specs/dev-server-files/spec.md` lines 4 and 5. Accepted by the lead: the clause "so that Vite refuses to serve their files", design D1 and scenario 002 give each word one outcome. A change of the requirement text needs a new image ratchet.
- [x] FINDING minor (spec-adversary) Scenario 002 and its test use only files one level below the folders, so no fault fails 002 for the depth part of `/**`. Accepted by the lead: the Known limit `nested-paths`, `evidence/nested-paths.txt`, and test 001 pins the entry text.
- [x] FINDING minor (spec-adversary) The row of the one-star fault is listed under `dev-server-files-002` in `evidence/mutations.txt` and `mutations-script.txt`. Accepted by the lead: the header and the note say that it fails only `dev-server-files-001`.
- [x] FINDING minor (ste-adversary) The first line of `evidence/head-requests.txt` is clumsy, and the words "in local time" can refer to the requests or to the file. Accepted by the lead: the file is evidence, and a change after the round-3 pass is not reviewed.
- [x] FINDING minor (ste-adversary, round 1) The test title of `dev-server-files-001` says "the old files", and the test checks five old entries. Accepted by the lead: the title is true under both readings, and a change needs a new image ratchet.
- [x] FINDING minor (ste-adversary) The date `2026-10-10` of the `CHANGELOG.md` entry differs from the date `2026-10-11` of the archive folder. Accepted by the lead: the entry uses the local date of the fix commit (2026-10-10 20:32 -0400), and the folder uses the UTC date.

## Own mistakes of the lead in this change

- [x] FINDING minor (lead) Three sentences of the lead were false when written: "Nothing in the app creates a link" (round 1), "the fault passes both tests" and "the other 20 paths give the index page" (round 2). The lead now reads the code or the output before a sentence gives a count or a behaviour. See the memory file `evidence-sentences-need-a-command`.
- [x] FINDING minor (lead) Corrections of the lead made two paragraphs of 7 and 8 sentences. `make lint` found both, and the lead split them.
- [x] FINDING minor (lead) The lead gave line numbers of `key-setup.js` from memory in the brief of round 3 (228, 223 and 232). The lead read the file again before the reviewers read the brief, and the brief has the lines 228, 231 and 234.

## Record of the image ratchet

The lead ran the image ratchet with `make ratchet CHANGE=vite-deny-runtime-state` in the Docker image `gods-eye-view:local` on commit `37a7de6e39f7e321aea0c8a430dc4b64cdbc24ad`. Its log starts with `docker run` and has the line `Command: ratchet`. The only error is the missing `review.md`. The code files and the test files did not change after that commit. The verdict lines are:

```text
Command: ratchet
Ownership: 15 owned, 4 upstream
Trace: 921 scenarios, 921 verified, 0 open. 9634 tests, 3711 traced, 5923 untraced.
Coverage: 1071 files, 304 complete, 53 not loaded, 0 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 765 code files, 46572 lines, 504 test files, 5923 tests.
COVERAGE-DIFF: 11 changed lines, 0 brought by the merged upstream commit, 11 need coverage.
Ratchet: 4 history lines for vite-deny-runtime-state.
Ledger: 0 entries do not match the current gaps.
ERROR REVIEW-MISSING openspec/changes/vite-deny-runtime-state/review.md Change vite-deny-runtime-state has no review.md
```
