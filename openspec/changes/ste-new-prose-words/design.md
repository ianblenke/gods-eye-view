## Context

The tree starts at commit `3017ecc6b121f7bb3c9938ee82d55b7ba78ef028`, from `git rev-parse HEAD`.
The owner approved the words on 2026-10-06.
The existing lint checks prose and tagged titles with the same word rules.

## Goals and non-goals

Stop repeated word faults in new prose.
Keep old prose intact and show warnings for the approved words.
Keep all existing rules.
Do not supply a full dictionary.

## Decisions

### D1: The new prose rule for Markdown

Use the file path in `lintMarkdown` to classify prose.
Files under `openspec/specs/` and `openspec/changes/archive/` contain old prose.
All other files in the lint scope contain new prose.
Use exact folder prefixes with a final slash.
Exclude inline code and code blocks as the existing rules do.

### D2: The new title rule

Use `loadSpecs` from the existing spec reader in `lintProject`.
Collect the scenario IDs from its `changeIds` map for all active changes.
Pass that set to `lintTestNames`.
Any matching tag makes the title new prose.
An absent set makes all tagged titles old prose.
The lint command still works without test records.

Quote marks around a listed word do not prevent a match in a title.
Inline code in a title remains outside the rule.
Known limit `titles-old-after-archive`: After archive, titles with only applied IDs become old prose.
Known limit `merged-spec-title`: A title with only IDs from a merged spec is old prose.

### D3: The word list and its forms

Add `newWordsNote` and `newWords` to `openspec/ste/words.json`.
Keep `words` intact.
Include base forms, regular third person forms and regular past forms for verbs.
Include the approved nouns and adjectives without invented verb forms.
Do not add forms that end in `-ing` beyond the approved base word.
The existing rule `STE-ING` still applies.

The search `rg verification openspec` found that form in archived tasks.
Add `verification` with the suggestion `check`.
The search `rg explicitly src` found that form in the tagged title for `osh-052`.
Add `explicitly` with the suggestion `clearly`.

The map `words` already contains `prior`.
That existing rule still gives an error in old prose.
The new word rule also gives its warning for that word.

### D4: The effect on work in progress

Active documents become new prose when their branches get this change from main.
The lead measured word faults in the active documents of other unmerged changes.
The lead corrects their word faults after that merge.
The host sweep records the current hits in the scratch audit.
Counts from other branches do not describe this tree.

## Checks

The tests check paths, title tags, suggestions, code exclusions and the real word map.
Each scenario test precedes its code change.
Mutations change production code and must fail repository tests.
Host coverage measures `scripts/spec/lib/ste.mjs`.
All spec tooling test files must pass on the host.
The lint command checks the whole tree.

The lead runs the ratchet command, the image gates and the review.
