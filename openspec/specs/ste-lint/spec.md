# ste-lint Specification

## Purpose
Check new prose against the ASD-STE100 Simplified Technical English rules that a script can check.
## Requirements
### Requirement: Lint scope
The STE lint MUST check each Markdown file in `openspec/`, the process files and the name of each traced test. The lint MUST NOT check code blocks, the text in inline code, URLs, scenario IDs or review files. A review file contains a copy of the agent output.
Origin: spec-first

#### Scenario: Check the Markdown files in openspec `ste-lint-001`
- **WHEN** the lint runs
- **THEN** the lint checks each file in `openspec/` with the extension `.md`

#### Scenario: Do not check the review files `ste-lint-018`
- **WHEN** a change folder has a `review.md` file and a `review/` folder
- **THEN** the lint does not check these files

#### Scenario: Check a review file that is not in a change folder `ste-lint-019`
- **WHEN** a file `review.md` or a folder `review/` in `openspec/` is not directly in a change folder
- **THEN** the lint checks the Markdown files in it

#### Scenario: Check the process files `ste-lint-013`
- **WHEN** the lint runs
- **THEN** the lint checks `AGENTS.md`, each file in `.claude/agents/` and `.claude/commands/opsx/review.md`

#### Scenario: Check only the process files in a project without an openspec folder `ste-lint-017`
- **WHEN** the lint runs in a project that has no `openspec/` folder
- **THEN** the lint checks only the process files

#### Scenario: Check the names of traced tests `ste-lint-002`
- **WHEN** the trace report has a traced test
- **THEN** the lint checks the test name without its tag

#### Scenario: Do not check code and links `ste-lint-003`
- **WHEN** a line has a fenced code block, inline code in backticks or a URL
- **THEN** the lint does not check the text in these parts

#### Scenario: Count inline code as one word `ste-lint-014`
- **WHEN** a sentence has inline code or a URL before its period
- **THEN** the lint counts the inline code or the URL as one word
- **AND** the period ends the sentence

#### Scenario: Stop for long inline code `ste-lint-015`
- **WHEN** inline code in prose has more than 4 words
- **THEN** the lint records the error `STE-CODE-SPAN`

#### Scenario: Check only Markdown with the lint command `ste-lint-016`
- **WHEN** you run the command `lint`
- **THEN** the lint checks the Markdown files and the process files
- **AND** the lint does not read test names from an old test run

### Requirement: Error rules
The STE lint MUST stop the build for each error. The errors are sentence length, task length, paragraph length, contractions, long inline code and words from the project word list.
Origin: spec-first

#### Scenario: Stop for a long sentence `ste-lint-004`
- **WHEN** a sentence has more than 25 words
- **THEN** the lint records the error `STE-SENTENCE` with the file and the line

#### Scenario: Stop for a long task `ste-lint-005`
- **WHEN** a task line in a `tasks.md` file has more than 20 words
- **THEN** the lint records the error `STE-INSTRUCTION`

#### Scenario: Stop for a long paragraph `ste-lint-006`
- **WHEN** a paragraph has more than 6 sentences
- **THEN** the lint records the error `STE-PARAGRAPH`

#### Scenario: Stop for a contraction `ste-lint-007`
- **WHEN** a sentence contains a contraction such as `don't` or `it's`
- **THEN** the lint records the error `STE-CONTRACTION`

#### Scenario: Stop for a word from the word list `ste-lint-008`
- **WHEN** a sentence contains a word from `openspec/ste/words.json`
- **THEN** the lint records the error `STE-WORD`
- **AND** the error shows the word to use from the word list

### Requirement: Rules that give warnings
The STE lint MUST show a warning for possible passive voice and for words that end in `-ing`. A warning MUST NOT stop the build. The STE adversary MUST review each warning.
Origin: spec-first

#### Scenario: Show a warning for possible passive voice `ste-lint-009`
- **WHEN** a sentence has a form of `be` before a word that ends in `-ed` or `-en`
- **THEN** the lint records the warning `STE-PASSIVE`

#### Scenario: Show a warning for an -ing word `ste-lint-010`
- **WHEN** a sentence has a word that ends in `-ing` and the allowed list in `openspec/ste/words.json` does not contain the word
- **THEN** the lint records the warning `STE-ING`

### Requirement: Lint result
The STE lint MUST show each finding with the file, the line, the rule and a message. It MUST exit with a status that is not zero when it finds one or more errors.
Origin: spec-first

#### Scenario: Exit with a failure status for errors `ste-lint-011`
- **WHEN** the lint finds one or more errors
- **THEN** the lint exits with a status that is not zero

#### Scenario: Exit with success for warnings only `ste-lint-012`
- **WHEN** the lint finds warnings and no errors
- **THEN** the lint exits with the status zero

### Requirement: Warning for a verb used as a noun
The STE lint MUST give the warning `STE-NOUN` for each exact listed word in the list `nounVerbs` directly after a determiner.
The file `openspec/ste/words.json` supplies the lower-case list `nounVerbs`.
The determiners are a, an, the, each, every, no, any, this, that, these, those, its, their, another, one and some.
The rule ignores case and finds the listed word when punctuation follows it.
The determiner token must contain only the determiner.
For example, `(the read` and `"the read` give no warning.

The rule checks prose and tagged test titles in the same scope as the other warnings.
The rule excludes inline code, code blocks and a word that starts with a quote mark.
The quote marks are `"`, `'`, `“` and `‘`.
A quote mark at the end of a listed word does not prevent a match.
The rule does not match plurals or possessives of a listed word.

For prose, the message is `Check for a verb` followed by `used as a noun:` and the listed word in double quotes.
For tagged test titles, the message starts with `Test "<name>":`, where the name includes the tags.
Then the lower-case word `check` follows, and the reported line is 0.
The warning does not cause an error status.
Origin: spec-first

#### Scenario: Warn after a determiner `ste-lint-020`
- **WHEN** a listed word follows a determiner directly in prose or a tagged test title
- **THEN** each occurrence gives `STE-NOUN` at warning level
- **AND** prose with `the read` gives the message below

```text
Check for a verb used as a noun: "read"
```

- **AND** the tagged title `[a-001] The read fails` gives the message below

```text
Test "[a-001] The read fails": check for a verb used as a noun: "read"
```

- **AND** the reported line of a prose warning is the line of the listed word
- **AND** the reported line of a tagged test title warning is 0

#### Scenario: Ignore a verb without a determiner `ste-lint-021`
- **WHEN** prose uses a listed word without a determiner directly before it
- **THEN** the rule gives no warning

#### Scenario: Ignore code and words that start with quote marks `ste-lint-022`
- **WHEN** a listed word after a determiner is in inline code, in a code block or starts with a quote mark
- **THEN** the rule gives no warning

#### Scenario: Keep success for the noun warning `ste-lint-023`
- **WHEN** the lint finds only `STE-NOUN` warnings
- **THEN** the lint result records no errors
- **AND** the success status from `ste-lint-012` still applies

#### Scenario: Ignore a word outside the list `ste-lint-024`
- **WHEN** prose puts a word outside the list `nounVerbs` directly after a determiner
- **THEN** the rule gives no warning

#### Scenario: Read the list nounVerbs from the file `ste-lint-025`
- **WHEN** the author changes `nounVerbs` in the word list file
- **THEN** the next lint check uses the new list

#### Scenario: Ignore plural and possessive forms `ste-lint-026`
- **WHEN** prose puts a plural or possessive form of a listed word directly after a determiner
- **THEN** the rule gives no warning

### Requirement: Clean tagged test titles
The STE lint MUST replace inline code with `CODE` before it checks a tagged test title with each rule.
Origin: spec-first

#### Scenario: Exclude inline code from title rules `ste-lint-027`
- **WHEN** a tagged test title contains `should` in inline code
- **THEN** the lint gives no `STE-WORD` error

### Requirement: Word rules for new prose and old prose
The STE lint MUST give errors for words from `newWords` in new prose and warnings for those words in old prose.
The file `openspec/ste/words.json` supplies the map `newWords` for each project check.

A Markdown file is old prose when its path is under `openspec/specs/`.
A file under `openspec/changes/archive/` is old prose when the archive folder date is earlier than `newWordsFrom`.
All other Markdown in the lint scope is new prose.

An ID is old when its `since` date is a string before the cutoff date `newWordsFrom`.
All other IDs are new IDs.
A title is an old title when the registry lists every ID of its tags and all its IDs are old IDs.
All other tagged titles are new titles.

An old title is old prose.
A new title is new prose.

The registry `openspec/trace/ids.json` supplies the IDs and dates.
An absent registry contains no known IDs.
Invalid JSON gives an error with the prefix `Cannot read openspec/trace/ids.json:`.
An absent `newWordsFrom` gives the empty string.
The archive folder date must start the folder name and use the form `YYYY-MM-DD-`.

The rules are `STE-WORD` at error level and `STE-WORD-OLD` at warning level.
Both rules use the current word message with the suggestion from the map.
The rule for `newWords` ignores case and excludes inline code and fenced code blocks.
Quote marks around a word do not prevent a match.
All current rules keep their behavior.
Origin: spec-first

#### Scenario: Stop for new prose in an active change `ste-lint-028`
- **WHEN** a file in an active change contains a word from `newWords`
- **THEN** the word gives `STE-WORD` at error level

#### Scenario: Warn for old prose in the archive `ste-lint-029`
- **WHEN** an archive file dated the day before `newWordsFrom` contains a word from `newWords`
- **THEN** the word gives `STE-WORD-OLD` at warning level

#### Scenario: Warn for old prose in an applied spec `ste-lint-030`
- **WHEN** a file under `openspec/specs/` contains a word from `newWords`
- **THEN** the word gives `STE-WORD-OLD` at warning level

#### Scenario: Stop for new prose in an agent file `ste-lint-031`
- **WHEN** an agent file contains a word from `newWords`
- **THEN** the word gives `STE-WORD` at error level

#### Scenario: Stop for a new title `ste-lint-032`
- **WHEN** a new title contains a word from `newWords`, with or without quote marks
- **THEN** the word gives `STE-WORD` at error level

#### Scenario: Warn for an old title `ste-lint-033`
- **WHEN** a tagged title names only scenarios dated before `newWordsFrom` and contains a word from `newWords`
- **THEN** the word gives `STE-WORD-OLD` at warning level

#### Scenario: Use new prose rules for mixed tags `ste-lint-034`
- **WHEN** a title contains a word from `newWords` and tags for one old ID and one new ID
- **THEN** the word gives `STE-WORD` at error level

#### Scenario: Read the word list for each check `ste-lint-035`
- **WHEN** the author changes `newWords` in the word list file
- **THEN** the next project check uses the new map

#### Scenario: Check the map of the words that the owner chose `ste-lint-036`
- **WHEN** the test reads the real word list file
- **THEN** the keys and suggestions match the map in the test of the words that the owner chose

#### Scenario: Keep success for old prose warnings `ste-lint-037`
- **WHEN** the lint command finds only `STE-WORD-OLD` warnings
- **THEN** the command exits with status zero

#### Scenario: Exclude code from the rule for `newWords` `ste-lint-038`
- **WHEN** a word from `newWords` occurs only in inline code or a fenced code block
- **THEN** the rule for `newWords` gives no finding

#### Scenario: Show the suggested word `ste-lint-039`
- **WHEN** new prose contains `retain`
- **THEN** the error message is `Use "keep", not "retain"`

#### Scenario: Exclude parent keys from the word map `ste-lint-040`
- **WHEN** new prose or a new title contains `constructor`
- **THEN** the rule for `newWords` gives no finding

#### Scenario: Check archive folder dates `ste-lint-041`
- **WHEN** an archive folder date equals or follows `newWordsFrom`, or the folder name does not start with a date in the named form
- **THEN** a word from `newWords` gives `STE-WORD` at error level

#### Scenario: Keep an old title for a changed scenario `ste-lint-042`
- **WHEN** an active delta spec names an ID with a `since` date before `newWordsFrom` in the registry
- **THEN** a word from `newWords` in the title gives `STE-WORD-OLD` at warning level

#### Scenario: Use new prose for unknown IDs `ste-lint-043`
- **WHEN** a title names an unknown ID, its `since` date is not a string, or the registry is absent
- **THEN** a word from `newWords` gives `STE-WORD` at error level

#### Scenario: Use new prose without `newWordsFrom` `ste-lint-044`
- **WHEN** the word list contains no `newWordsFrom`
- **THEN** dated archive files and titles with known IDs use new prose

#### Scenario: Stop for invalid registry JSON `ste-lint-045`
- **WHEN** the registry contains invalid JSON
- **THEN** the project check throws an error with the prefix `Cannot read openspec/trace/ids.json:`

