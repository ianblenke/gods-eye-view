# Review: fix-up42-thumbnail-size

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-11-17
Gates: make gates CHANGE=fix-up42-thumbnail-size passed
Rounds: 2
Scope: diff 06849bbb
Reviewed-Tree: 26edbae6699cc1f542def096acca653044bef6d17b84a4502d8392fa00337965

## Findings

Round 1 (scope full, tree 06849bbb):

- [x] FINDING major: DATA_SOURCES.md line 191 still said 1 MiB for the UP42 thumbnail route. Corrected to 4 MiB. The lines for Planet and SkyFi stay at 1 MiB.
- [x] FINDING major: the ratchet history lines for geoFileImport.js and i18n/index.js. Kept. They are named as the Known limit `ledger-noise` in the proposal. The same two files changed by the same amounts in the ratchet of fix-up42-collection-object (PR #27).
- [x] FINDING minor: task 4.3 had no record of the failed tests. Corrected: design.md names the two mutation tests.
- [x] FINDING major: design.md said a thumbnail is rarely above 1 MiB. Corrected: the risk text now rests on the restart and the 10-minute store.
- [x] FINDING major: the proposal did not explain the tests for scenarios 012 to 014. Corrected: What Changes and Impact explain them.
- [x] FINDING minor: the vague error-body line, "reads too many bytes", "must open", the 32-thumbnail sentence, and the mix of MB and MiB. Corrected in the proposal and design.
- [x] FINDING minor: spec lines with 4194304 and the test names of 012, 013 and 014. Kept. A change of scenario text or a test name needs another ratchet command, and the text is exact on purpose.
- [x] FINDING minor: the comment above MAX_IMAGE_BYTES in auth.js has two topics. Kept. A code change needs another ratchet command.
- [x] FINDING minor: "Have the lead run ..." in tasks.md. Kept. The same wording is in earlier merged changes of this project.

Round 2 (scope diff 06849bbb, tree 257ff120): both verdicts PASS.

- [x] FINDING minor: the Known limit `ledger-noise` has no command as proof. Kept as an accepted known limit by name. The proof is the ratchet history of PR #27.
- [x] FINDING minor: "later" in design.md and "had" in proposal.md. Corrected.
