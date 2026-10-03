## Why

Reviewers repeatedly report verbs that authors use as nouns.
Word class faults also cause extra review rounds without a change of meaning.

## What Changes

- Add the warning `STE-NOUN` for listed verbs directly after determiners.
- Add `nounVerbs` to the project word list.
- Change the review guidance for severity, repeated faults and later rounds.

## Capabilities

### Modified Capabilities

- `ste-lint`: Add an ADDED requirement for the noun warning.

## Impact

The change edits the STE lint, its tests, the word list and the agent guidance.
The change opens no coverage gap and closes no old gap.
The lead must confirm the gaps with the gates in the prescribed Node image.
The change does not edit the trace ledger.

## Known limits and later changes

- Known limit `determiner-only`: The rule cannot find a verb that authors use as a noun after another word.
- Known limit `exact-form`: The rule does not match plurals or possessives.
- Known limit `small-list`: The list contains only verbs from archived review quotes.
- Known limit `host-check`: Host coverage cannot replace the gates in the prescribed Node image.
