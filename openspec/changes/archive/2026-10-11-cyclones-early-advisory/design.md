## Context

Base commit: `6e54707e` (main, after the merge of `upstream-sync-5`).
The function `iso()` in `server/providers/cyclones.js` checks every time of the status file. It rejects a time that is more than 5 minutes ahead of its clock, or more than 12 hours behind it.
`parseCycloneStatus()` calls `iso()` for the advisory time and for the position time of each storm. One rejected time rejects the whole file.

## Decisions

### D1: The same hunk as upstream

The change replaces `5 * 60_000` with the constant `EARLY_ADVISORY_MS`, which is `90 * 60_000`, and adds the comment of upstream. The hunk equals the hunk of pull request #741, so a later sync brings the same lines. The file `evidence/upstream-hunk.txt` holds the hunk of the pull request.

### D2: The tests

The fork writes its own tests in a new file, because the test file of the status function is upstream code.
The test time is 2026-09-16T03:00:00.000Z. The test puts it in one field and an earlier time in the other field.
The test of `cyclones-026` gives `parseCycloneStatus()` a clock 26 minutes before the test time and a clock exactly 90 minutes before it. It does this for the advisory time and for the position time.
The test of `cyclones-027` uses a clock 90 minutes and 1 millisecond before the test time.

### D3: What the change leaves out

The lower limit of 12 hours stays. The client validator in `src/layers/cyclones/source.js` stays. It does not check the clock.

## Files and measures

The change edits `server/providers/cyclones.js`, `CHANGELOG.md`, `openspec/ownership.json` and `scripts/format-scope.json`. It adds the test file, the spec delta and the evidence.

The trace gate checks that the tests carry the IDs `cyclones-026` and `cyclones-027`. The format check measures the edited files. The prose lint checks STE.
The named faults measure whether a change of the window makes a test fail.
The lead runs the gates in Docker and both review agents on the final tree.
