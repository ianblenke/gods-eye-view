# Review: upstream-sync-2

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-02
Gates: make gates CHANGE=upstream-sync-2 passed except LEDGER-STALE noise on three changed files (known limit sync2-count-flips)
Rounds: 3
Scope: diff 5236626
Reviewed-Tree: 99c943d6ed7c3e4eca7f2aa92d877c4d9be791fb7435f871375410f2a1780d9c

## Findings

### Round 1 (scope: full) - spec PASS, STE FAIL

Full agent reports: `review/round-1/spec-adversary.md`, `review/round-1/ste-adversary.md`.

- [x] minor (spec-adversary, 8 findings) Known limits for the mocked flight timers and the 1300 ms wait, the third flaky file, mutation texts that differ between the design and the tasks, a stale base test name, the QA variable `QA_BASE_URL`, and the commands that count the files. Corrected in the proposal, the design, the tasks and the QA header. The stale name of `osh-033` is an old test name and stays.
- [x] major (ste-adversary, 6 findings) The `pending:` exception in two documents, mutation texts, the import link sentence, the QA purposes of `qa-military-names.mjs` and `qa-overpass-offload.mjs`, and `pending:alpr`. Corrected.
- [x] minor (ste-adversary, 17 findings) Wording: verbs used as nouns, passive voice, one name for one thing, ten QA purposes. Corrected.

### Round 2 (scope: diff d536a24) - spec PASS, STE FAIL

Full agent reports: `review/round-2/spec-adversary.md`, `review/round-2/ste-adversary.md`.

- [x] minor (spec-adversary, 5 findings) Task 3.2, the gate text of the design, the weak mutation 2.6, the header count, and the rule-21 chain. Corrected in the proposal, the design and the tasks.
- [x] major (ste-adversary) The QA purposes of `qa-admin-outlines.mjs` and `qa-alpr-journey.mjs` were not true to their scripts, and the proposal count of headers contradicted itself. Corrected: each purpose now matches the assertions of its script.
- [x] minor (ste-adversary, 5 findings) Wording of the proposal, the tasks and `qa-military-names.mjs`. Corrected.

### Round 3 (scope: diff 5236626) - PASS

Full agent reports: `review/spec-adversary.md`, `review/ste-adversary.md`.

- [x] minor (spec-adversary, 3 findings) The limit `sync2-count-flips` did not say that the change run still ends with `LEDGER-STALE`, the tolerance was a prediction, and the design lacked the merge commit and the `git ls-remote` result. Corrected in the proposal, the design and the tasks.
- [x] minor (ste-adversary, 2 findings) "holds" for the ledger value, and the name of the limit of the first sync. Corrected.

## Rule 21

- [x] The upstream remote has the second parent of the merge commit. The command `git ls-remote https://github.com/bilawalsidhu/gods-eye-view main` returned `e7707d9a0f34d9fbffc300023c319f95caa5be30` on 2026-10-02.
- [x] The merge commit `b8ff1c4` has the parents `253a07d0d7449eaaa5dcf24d276c24540f852f43` and `e7707d9a0f34d9fbffc300023c319f95caa5be30`.
- [x] The command `adopt` ran with `--from e7707d9`, which is the merged commit and not the merge commit. It recorded 159 files: 152 changed files and 7 reached files, under the rule of the change `ledger-adopt-reached`.

## Accepted noise

- [x] The flaky counts of `src/cameraGroundGuard.js` (total 53 or 54 branches) and `src/data/labelArbiter.js` (46 or 48 branches not covered) give `LEDGER-STALE` in the change run. Accepted by Ian Blenke.
- [x] The flaky counts of `src/annotations/resolver.js` (342 or 359 lines not covered) and `src/app/layers/alprCameras.js` (3 or 0 lines not covered) also give `LEDGER-STALE` or `LEDGER-LARGER-GAP`. Accepted by Ian Blenke.
- [x] The final ratchet run was skipped, because it stops with `LEDGER-LARGER-GAP` on `src/annotations/resolver.js`. This change adds no test and no scenario. Accepted by Ian Blenke.
- [x] The CI run on `main` must confirm that the tolerance of the push run passes. The merge owner checks it after the push.
