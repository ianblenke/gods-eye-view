## Why

Reviewers repeatedly report the same word faults.
Errors in new prose stop these faults before review.
Warnings in old prose keep the text of past changes and applied scenarios intact.

## What Changes

- Add `newWords` with the words that the owner chose and their regular forms.
- Add `newWordsFrom` to classify archive files and tagged titles by date.
- Give errors in new prose and warnings in old prose.

## Capabilities

### Modified Capabilities

- `ste-lint`: Add a requirement for the rule for `newWords`.

## Impact

The change edits the STE lint, the word list and tests under `src/tooling/spec/`.
The host coverage check must show no new gap.
The lead checks coverage with the image gates.
The ratchet adds `ste-lint-028` to `ste-lint-044` to the trace files.

## Known limits

The design records the known limits.
