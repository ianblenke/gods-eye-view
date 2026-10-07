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
The ratchet adds `ste-lint-028` to `ste-lint-045` to the trace files.

## Known limits and later changes

- Known limit `titles-of-old-ids`: A test that names only IDs with a `since` date before `newWordsFrom` gives only the warning for its words.
  The caller gives the STE adversary the names of the tests that the change adds or renames, and the adversary checks the words.
- Known limit `date-cutoff`: The dates use Coordinated Universal Time (UTC). A change that went through the ratchet or archive before 2026-10-07 stays old prose after it merges.
  A change archived on 2026-10-07 becomes new prose after it merges main. The lead corrects its documents if they use the words.
  The same rule applies to `harden-timing-tests` before it merges.
- Known limit `replacement-suggestions`: The lint does not check the suggestions against the STE dictionary.
  The suggestions `invalid`, `single`, `run` for `executed`, and `shown` for `exposed` fit only some uses.
  A noun such as `dismissal` gets a verb suggestion.
- Known limit `explicit-derivatives`: The rule for `newWords` does not find `explicitly`, `verification`, `retaining`, `permission`, `execution` or `retention`.
  The forms with the suffix `-ing` only warn through `STE-ING`.
- Known limit `existing-word-rule`: The map `words` gives an error for `prior` in all prose.
- Known limit `host-check`: Host coverage does not replace the image gates.
