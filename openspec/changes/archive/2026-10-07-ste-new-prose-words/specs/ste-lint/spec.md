## ADDED Requirements

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
