# Review: backfill-wind

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-29
Gates: make gates CHANGE=backfill-wind passed
Rounds: 4
Scope: diff 613d765
Reviewed-Tree: a82f90df3ddc0bb50cb0a9f505c28621f804cab32a450a660fc9ce2d9fdae161

## Findings

### Round 1 (scope: full) — FAIL

Full agent reports: `review/round-1/spec-adversary.md`, `review/round-1/ste-adversary.md`.

- [x] major (spec-adversary F1) The function `sameWind` in `rendering.js` compares 16 keys. The `[wind-033]` tests changed only 8 of them, and the file still had 100% branch coverage. Corrected: 8 new `[wind-033]` cases, one for each key not tested before. Each case was checked by a mutation of the production file, and only that case failed.
- [x] minor (spec-adversary F2) The function `checkCamera` compares 8 values. Only `heading` had a test. Corrected: 4 new `[wind-025]` cases for `position.y`, `position.z`, `pitch` and `roll`. Each case was checked by a mutation.
- [x] major (ste-adversary S1, S2, S3) The scenario text used a verb as a noun ("dismissal or disable", "until a clear"). Two words for one meaning ("missing" and "absent") were in use. Corrected in the spec and in the new test names. The old test names keep their words (known limit `wind-old-test-names`).
- [x] minor (ste-adversary S4 to S12) Words that are not approved, "readiness", "omit", "residual" and "continuation", a bare "no" for a negative instruction, and stacks of four nouns. All corrected in the spec, the proposal, the tasks and the new test names.
- [x] minor (ste-adversary S13, S14, S15) Kept. The words "Tag or add" in the tasks were already merged in `backfill-perimeters` (known limit `wind-tag-or-add`). The other names are old test names, which do not change (known limits `wind-old-test-names` and `wind-old-test-subjects`).

### Round 2 (scope: diff ccb3e40) — FAIL

Full agent reports: `review/round-2/spec-adversary.md`, `review/round-2/ste-adversary.md`.

- [x] (spec-adversary) Verdict PASS. F1 and F2 were traced by hand and are resolved. The wording changes did not change any meaning.
- [x] minor (spec-adversary F3) The ratchet command wrote two history lines for `src/data/labelArbiter.js`, a file that this change does not edit. Corrected: the lead set the ledger entry back to the values in `main` by a text edit. The proposal says so.
- [x] major (ste-adversary S16) The known limit `wind-old-test-names` said five old test names in four files. The real count was eight in five files. Corrected after a search of all ten test files.
- [x] minor (ste-adversary S17 to S20) A conditional "would", the word "predates", "rename" as a noun, and "stricter" in the new known limits. All corrected.

### Round 3 (scope: diff 534b4e1) — FAIL

Full agent reports: `review/round-3/spec-adversary.md`, `review/round-3/ste-adversary.md`.

- [x] (spec-adversary) Verdict PASS. The ledger entry for `labelArbiter.js` matches `main`. The count of old test names was checked again.
- [x] minor (spec-adversary F4) Two history lines still show the drift that the lead corrected in the ledger entry. No gate error comes from this. Kept as known limit `wind-ledger-history`. The lead did not write a history line that no ratchet run made.
- [x] major (ste-adversary S21) The count in `wind-old-test-names` was still too low. The test `index.test.mjs:61` also uses "disable" as a noun. Corrected: nine old test names in five files. The lead searched every test title in the ten files.

### Round 4 (scope: diff 613d765) — PASS

Full agent reports: `review/spec-adversary.md`, `review/ste-adversary.md`.

- [x] (spec-adversary) No findings. The count of nine is correct. The known limit `wind-ledger-history` agrees with `history.jsonl` and `gaps.json`.
- [x] minor (ste-adversary S22, S23) The last sentence of `wind-ledger-history` had no verb, and "reset" has one form for the present and the past. Corrected after the round, with no new round, because both verdicts were PASS.

Round 4 is past the nominal limit of three rounds. Round 3 found a major finding (S21), and a major finding always needs a correction.

## Lessons

- A loop that compares many keys in one `if` reaches 100% branch coverage when one key differs. Coverage does not show that each key has a test. The mutation of each key found 12 untested keys.
- A known limit that gives a count is a claim that a test can check. Three rounds in a row found a higher real count. The lead now searches every title in every file before the lead writes a number.
- A QA script header must say `pending:wind` until the archive command makes the capability folder. It must say `wind` after that. Moving the change out of the archive means the header must go back to `pending:wind`.
