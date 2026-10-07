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
  The file `.claude/agents/ste-adversary.md` tells the adversary not to report the words of the map `words`.
  A later change to that file must cover the warning `STE-WORD-OLD` for the names of changed tests.
- Known limit `date-cutoff`: The dates use Coordinated Universal Time (UTC).
  The archive folder date decides the rule for documents: a folder dated 2026-10-07 or later, such as `2026-10-07-ste-noun-warning` and `2026-10-07-harden-timing-tests`, holds new prose.
  The `since` date of an ID in `ids.json` decides the rule for test titles.
  A change with an archive folder dated before 2026-10-07 stays old prose.
  A branch that gets this change from main must correct its documents if they use the words.
- Known limit `hand-edited-dates`: Three hand edits turn errors into warnings.
  The edits are a `since` date in `openspec/trace/ids.json`, the date in an archive folder name, and a Purpose line under `openspec/specs/`.
  The gates compare only the hash of `ids.json` with the base, and the ratchet keeps each entry.
- Known limit `old-spec-words`: Old specs still hold words from `newWords`.
  The files are `osh/spec.md` (lines 198, 206, 236, 275 and 393) and `cyclones/spec.md` (lines 32, 45 and 67).
  The files `wind/spec.md` (line 72) and `credential-boundary/spec.md` (lines 4, 7, 35 and 39) hold the words too.
  A change that modifies one of those requirements must keep its text and scenarios, so its delta gets the error `STE-WORD`.
  A later change must correct those words.
- Known limit `registry-shape`: Valid JSON of the wrong shape in `openspec/trace/ids.json`, such as `null`, gives a raw TypeError, as before this change.
  The named error covers only invalid JSON and read errors.
- Known limit `dead-default-operand`: The title rule keeps the default `?? ''` for an absent `newWordsFrom`, and it does not change a result.
  For Markdown, an absent `newWordsFrom` makes each date comparison false.
  The requirement text says that an absent `newWordsFrom` gives the empty string, which is not exact for Markdown.
- Known limit `replacement-suggestions`: The lint does not check the suggestions against the STE dictionary.
  The suggestions `invalid`, `single`, `run` for `executed`, and `shown` for `exposed` fit only the passive voice.
  A noun such as `dismissal` gets a verb suggestion.
- Known limit `explicit-derivatives`: The rule for `newWords` does not find `explicitly`, `verification`, `retaining`, `permission`, `execution` or `retention`.
  For a form with the suffix `-ing`, the lint gives only `STE-ING`.
- Known limit `existing-word-rule`: The map `words` gives an error for `prior` in all prose.
- Known limit `host-check`: Host coverage does not replace the image gates.
