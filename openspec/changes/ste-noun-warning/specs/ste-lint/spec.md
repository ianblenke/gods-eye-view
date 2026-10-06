## ADDED Requirements

### Requirement: Warning for a verb used as a noun
The STE lint MUST give the warning `STE-NOUN` for each exact word in `nounVerbs` directly after a determiner.
The file `openspec/ste/words.json` supplies the lower-case array `nounVerbs`.
The determiners are a, an, the, each, every, no, any, this, that, these, those, its, their, another, one and some.
The rule ignores case and permits punctuation after the listed word.
Punctuation after the determiner prevents a match.

The rule checks prose and tagged test titles in the same scope as the other warnings.
The rule excludes inline code, code blocks and single-word identifiers in straight or curved quotes.
The rule does not match plurals or possessives of a listed word.

The warning names the word with the message prefix "Check for a verb used as a noun:".
The warning does not cause an error status.
Origin: spec-first

#### Scenario: Warn after a determiner `ste-lint-020`
- **WHEN** a listed word follows a determiner directly in prose or a tagged test title
- **THEN** each occurrence gives `STE-NOUN` at warning level
- **AND** the message names the word

#### Scenario: Ignore a verb without a determiner `ste-lint-021`
- **WHEN** prose uses a listed verb without a determiner directly before it
- **THEN** the rule gives no warning

#### Scenario: Ignore code and quoted identifiers `ste-lint-022`
- **WHEN** inline code, a code block or a single-word quoted identifier contains a listed word after a determiner
- **THEN** the rule gives no warning

#### Scenario: Keep success for the noun warning `ste-lint-023`
- **WHEN** the lint finds only `STE-NOUN` warnings
- **THEN** the lint result records no errors
- **AND** the success status from `ste-lint-012` still applies

#### Scenario: Ignore a word outside the list `ste-lint-024`
- **WHEN** prose puts a word outside `nounVerbs` directly after a determiner
- **THEN** the rule gives no warning

#### Scenario: Read the noun verb list from the file `ste-lint-025`
- **WHEN** the author changes `nounVerbs` in the word list file
- **THEN** the next lint check uses the new list

#### Scenario: Ignore plural and possessive forms `ste-lint-026`
- **WHEN** prose puts a plural or possessive form of a listed word directly after a determiner
- **THEN** the rule gives no warning
