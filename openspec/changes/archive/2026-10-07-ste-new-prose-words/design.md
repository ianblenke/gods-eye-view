## Context

The branch starts at commit `3017ecc6`.
The owner chose the words on 2026-10-06.
The current lint checks prose and tagged titles with the same word rules.

## Goals and non-goals

Stop repeated word faults in new prose.
Keep old prose intact and show warnings for the words that the owner chose.
Keep all current rules.
Do not supply a full dictionary.

## Decisions

### D1: The rule for `newWords` in Markdown

Use the definitions of old prose and new prose in the delta spec.
Read the cutoff date `newWordsFrom` from the word list.
Compare date strings in the form `YYYY-MM-DD`.
Only a date at the start of an archive folder name supplies the archive folder date.
After the change goes to the archive, the archive folder date still selects the rule for `newWords`.
An absent archive folder date or cutoff date makes the date comparison false, so the file is new prose.

Exclude inline code and code blocks as the current rules do.

### D2: The rule for `newWords` in titles

Read `openspec/trace/ids.json` in `lintProject`.
An absent registry supplies an empty object.
Invalid JSON throws an error whose message starts with `Cannot read openspec/trace/ids.json:` and holds the reason of the parser; the test checks the prefix.
Use each `since` date from the registry.
Do not use active delta specs.

An unknown ID makes a new title.
A `since` date on or after `newWordsFrom` makes a new title.
A `since` value that is absent, null or not a string makes a new title.
A changed scenario keeps the `since` date from the registry.

The lint command still works without test records.

Quote marks around a word from `newWords` do not prevent a match in a title.
Inline code in a title remains outside the rule.

### D3: The word list and its forms

Keep the words that the owner chose and their regular forms.
Remove `explicitly` and `verification` from `newWords`.
The map in the test of `ste-lint-036` gives the past forms.
Use `Object.hasOwn` to exclude parent object keys.
The test checks `constructor` against the rule for `newWords`.

### D4: The effect on work in progress

Active documents use new prose when their branches get this change from main.
The lead corrects word faults in other branches after those branches get the change.
Run the command below to find the words in this repository.

```sh
node scripts/spec/gates.mjs lint --change ste-new-prose-words
```

Put an old title with a word from `newWords` in a fenced block.
Inline code of more than 4 words gives `STE-CODE-SPAN`.

The proposal records the known limits.

## Checks

Each mutation changes production code. A repository test must fail for it.
The host coverage run measures `scripts/spec/lib/ste.mjs`.
All test files of the spec tools must pass on the host.
The lint command checks the whole tree.
The lead runs the ratchet command, the image gates and the review.
