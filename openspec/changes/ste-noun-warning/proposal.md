## Why

Reviewers repeatedly report verbs that authors use as nouns.
Word class faults also cause extra review rounds without a change of meaning.

## What Changes

- Add the warning `STE-NOUN` for listed words directly after determiners.
- Add the list `nounVerbs` to the project word list.
- Change the review guidance for severity, repeated faults and later rounds.

## Capabilities

### Modified Capabilities

- `ste-lint`: Add an ADDED requirement for the noun warning.

## Impact

The change edits the STE lint, its tests, the word list and the agent guidance.
The change opens no coverage gap and closes no old gap.
The lead must confirm the gaps with the gates in the Docker image.

The ratchet command wrote `ids.json` and `links.json` in `openspec/trace/`.
It added `ste-lint-020` to `ste-lint-026` and their test links.
The command `git show --stat e9b1bf8` confirms these files.
The change does not edit `gaps.json`.

## Known limits and later changes

- Known limit `determiner-only`: The rule cannot find a verb that authors use as a noun after another word.
- Known limit `exact-form`: The rule does not match plurals or possessives.
- Known limit `small-list`: The list `nounVerbs` contains only verbs from archived review quotes.
- Known limit `host-check`: Host coverage cannot replace the gates in the Docker image.

- Known limit `guidance-untested`: Part B adds no scenario and no test of its own.
- Known limit `nounVerbs-unchecked`: The lint does not check entries of the list `nounVerbs`.
  An entry with a capital letter or a non-string entry never matches and gives no error.
- Known limit `quote-variants`: Tests do not check every position of every quote mark.
  Tests check quotes at the start, a quote at the end and an internal quote.
- Known limit `title-rules`: The new title test checks only `STE-WORD`.
  It does not test each other rule with inline code in a tagged title.
- Known limit `punctuation-variants`: Tests do not check every punctuation mark or each combination with a determiner.
