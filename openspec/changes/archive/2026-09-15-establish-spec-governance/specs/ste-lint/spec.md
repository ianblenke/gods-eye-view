## ADDED Requirements

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
