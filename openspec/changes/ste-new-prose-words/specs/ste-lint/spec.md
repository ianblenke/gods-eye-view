## ADDED Requirements

### Requirement: Word rules for new prose and old prose
The STE lint MUST give errors for words from `newWords` in new prose and warnings for those words in old prose.
The file `openspec/ste/words.json` supplies the map `newWords` for each project check.
Old prose consists of Markdown under `openspec/specs/` and `openspec/changes/archive/`.
All other Markdown in the lint scope is new prose.
A tagged title is new prose when any tag names a scenario that an active delta spec defines.
All other tagged titles are old prose.

The rules are `STE-WORD` at error level and `STE-WORD-OLD` at warning level.
Both rules use the existing word message with the suggestion from the map.
The new word rule ignores case and excludes inline code and fenced code blocks.
Quote marks around a word do not prevent a match.
All existing rules keep their behavior.
Origin: spec-first

#### Scenario: Stop for new prose in an active change `ste-lint-028`
- **WHEN** a file in an active change contains a word from `newWords`
- **THEN** the word gives `STE-WORD` at error level

#### Scenario: Warn for old prose in the archive `ste-lint-029`
- **WHEN** a file under `openspec/changes/archive/` contains a word from `newWords`
- **THEN** the word gives `STE-WORD-OLD` at warning level

#### Scenario: Warn for old prose in an applied spec `ste-lint-030`
- **WHEN** a file under `openspec/specs/` contains a word from `newWords`
- **THEN** the word gives `STE-WORD-OLD` at warning level

#### Scenario: Stop for new prose in an agent file `ste-lint-031`
- **WHEN** an agent file contains a word from `newWords`
- **THEN** the word gives `STE-WORD` at error level

#### Scenario: Stop for a new title `ste-lint-032`
- **WHEN** a tagged title names an active delta scenario and contains a listed word, with or without quote marks
- **THEN** the word gives `STE-WORD` at error level

#### Scenario: Warn for an old title `ste-lint-033`
- **WHEN** a tagged title names only an applied scenario and contains a listed word
- **THEN** the word gives `STE-WORD-OLD` at warning level

#### Scenario: Use new prose rules for mixed tags `ste-lint-034`
- **WHEN** a title contains a listed word and tags for both an active delta scenario and an applied scenario
- **THEN** the word gives `STE-WORD` at error level

#### Scenario: Read the word list for each check `ste-lint-035`
- **WHEN** the author changes `newWords` in the word list file
- **THEN** the next project check uses the new map

#### Scenario: Check the approved word map `ste-lint-036`
- **WHEN** the test reads the real word list file
- **THEN** the keys and suggestions match the approved literal map in the test

#### Scenario: Keep success for old prose warnings `ste-lint-037`
- **WHEN** the lint command finds only `STE-WORD-OLD` warnings
- **THEN** the command exits with status zero

#### Scenario: Exclude code from the new word rule `ste-lint-038`
- **WHEN** a listed word occurs only in inline code or a fenced code block
- **THEN** the new word rule gives no finding

#### Scenario: Show the suggested word `ste-lint-039`
- **WHEN** new prose contains `retain`
- **THEN** the error message is `Use "keep", not "retain"`

