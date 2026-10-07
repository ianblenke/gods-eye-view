## Why

Reviewers repeatedly report verbs that authors use as nouns.
Word class faults also cause extra review rounds without a change of meaning.

## What Changes

- Add the warning `STE-NOUN` for listed words directly after determiners.
- Add the list `nounVerbs` to the project word list.
- Replace inline code with `CODE` in tagged test titles before each rule checks them.
- Change the review guidance for severity, repeated faults and later rounds.

## Capabilities

### Modified Capabilities

- `ste-lint`: Add two requirements for the noun warning and for the clean tagged test titles.

## Impact

The change edits the STE lint, its tests, the word list and the agent guidance.
The change opens no coverage gap and closes no old gap.
The lead must check the gaps with the gates in the Docker image.

The ratchet command wrote `ids.json` and `links.json` in `openspec/trace/`.
It added `ste-lint-020` to `ste-lint-027` and their test links.
It ran at commits `e9b1bf8` and `03d6954`, and again after the round-2 corrections.
The command `git show --stat` for each of these commits lists these files.
The change does not edit `gaps.json`.

## Known limits and later changes

- Known limit `determiner-only`: The rule cannot find a verb that authors use as a noun after another word.
- Known limit `exact-form`: The rule does not match plurals or possessives.
- Known limit `small-list`: The list `nounVerbs` contains only verbs from archived review quotes.
- Known limit `host-check`: Host coverage cannot replace the gates in the Docker image.

- Known limit `guidance-untested`: The guidance change adds no scenario and no test of its own.
- Known limit `nounVerbs-unchecked`: The lint does not check entries of the list `nounVerbs`.
  An entry with a capital letter or a non-string entry never matches and gives no error.
  A value that is not a list fails: a number or an object throws a TypeError, and a string splits into single letters.
- Known limit `quote-variants`: Tests do not check every position of every quote mark.
  Tests check quotes at the start, a quote at the end and an internal quote.
- Known limit `title-rules`: The new title test checks only `STE-WORD`.
  It does not test any other rule with inline code in a tagged title.
  The title cleaning also replaces links and URLs and removes `**` and `__`. Tests check only inline code.
- Known limit `punctuation-variants`: Tests do not check every punctuation mark or each combination with a determiner.
