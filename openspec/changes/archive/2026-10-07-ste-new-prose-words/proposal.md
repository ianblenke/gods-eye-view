## Why

Reviewers repeatedly report the same word faults.
Errors in new prose stop these faults before review.
Warnings in old prose keep the text of past changes and applied scenarios intact.

## What Changes

- Add the map `newWords` with the approved words and their forms.
- Add errors for new prose and warnings for old prose.
- Use active delta scenario IDs to classify tagged titles.

## Capabilities

### Modified Capabilities

- `ste-lint`: Add a requirement for new prose and old prose.

## Impact

The change edits the STE lint, the word list and the tests under `src/tooling/spec/`.
The change opens no coverage gap and closes no old gap.
The lead checks this statement with the image gates.
The change does not edit the trace files.

## Known limits

- Known limit `titles-old-after-archive`: After archive, titles that name only applied scenario IDs become old prose.
- Known limit `merged-spec-title`: A title with only IDs from a merged spec is old prose.
- Known limit `existing-word-rule`: The existing map `words` still gives errors in old prose.
- Known limit `host-check`: Host coverage does not replace the image gates.
