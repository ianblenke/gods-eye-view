## ADDED Requirements

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
