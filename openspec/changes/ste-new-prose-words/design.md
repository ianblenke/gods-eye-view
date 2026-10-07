## Context

The tree starts at commit `01c5c6471499c9c3db7da8406d640d485de16694`, from `git rev-parse HEAD`.
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
Read `newWordsFrom` from the word list, with the empty string as the default.
Compare date strings in the form `YYYY-MM-DD`.
Only a date at the start of an archive folder name supplies the archive date.
After the change goes to the archive, the folder date still selects the word rule.
Exclude inline code and code blocks as the current rules do.

### D2: The rule for `newWords` in titles

Read `openspec/trace/ids.json` in `lintProject`.
An absent registry supplies an empty object.
Use each ID date from the registry, without active delta specs.
Any unknown ID or date on or after `newWordsFrom` makes a title new prose.
A changed scenario keeps the old date from the registry.
The lint command still works without test records.

Quote marks around a word from `newWords` do not prevent a match in a title.
Inline code in a title remains outside the rule.

### D3: The word list and its forms

Keep the words that the owner chose and their regular forms.
Remove `explicitly` and `verification` from `newWords`.
Use `run` for the past form `executed` to suit passive voice.
Keep the other past forms that the lead names.
Use `Object.hasOwn` to exclude parent object keys.
The test checks `constructor`, `__proto__`, `toString` and `valueOf` against the rule for `newWords`.

The current rule `STE-ING` can still warn for `toString`.

### D4: The effect on work in progress

Active documents use new prose when their branches get this change from main.
The lead corrects word faults in other branches after those branches get the change.
Run the command below to find the hits in this repository.

```sh
node scripts/spec/gates.mjs lint --change ste-new-prose-words
```

Quote an old banned title in a fenced block: inline code of more than 4 words gives `STE-CODE-SPAN`.

## Known limits

- Known limit `replacement-suggestions`: The suggestions do not receive a dictionary check. A noun such as `dismissal` gets a verb suggestion.
- Known limit `explicit-derivatives`: The rule for `newWords` does not catch `explicitly` or `verification`.
- Known limit `existing-word-rule`: The map `words` keeps `prior` as an error in all prose.
- Known limit `host-check`: Host coverage does not replace the image gates.

## Checks

Each mutation changes production code. A repository test must fail for it.
The host coverage run measures `scripts/spec/lib/ste.mjs`.
All spec tool test files must pass on the host.
The lint command checks the whole tree.
The lead runs the ratchet command, the image gates and the review.
