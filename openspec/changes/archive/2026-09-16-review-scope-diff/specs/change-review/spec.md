## ADDED Requirements

### Requirement: Review rounds
The file `review.md` MUST record the number of review rounds and the scope of the last round. The scope is the full change or the diff against the Git commit of the round before. The first round MUST have the full change as its scope.

The severity of a finding is the second word of its text. An open finding with the severity minor MUST give the name of the person who accepts it. After three rounds, the review gate MUST NOT stop the build for such a finding.
Origin: spec-first

#### Scenario: Stop for a review file without a rounds line or a scope line `change-review-024`
- **WHEN** `review.md` has no "Rounds:" line, or no "Scope:" line
- **THEN** the review gate stops the build

#### Scenario: Do not stop for a correct scope line `change-review-025`
- **WHEN** `review.md` has the line "Scope: diff <commit>" with a commit of 7 to 40 lowercase hexadecimal characters, or the line "Scope: full"
- **THEN** the review gate does not stop the build for that line

#### Scenario: Do not stop for an open finding that a person accepts after three rounds `change-review-026`
- **WHEN** `review.md` has a finding with a box that is not checked
- **AND** the second word of the finding text is "minor", and the text has the words "Accepted by " and a name
- **AND** the "Rounds:" line has the number 3 or more
- **THEN** the review gate does not stop the build for that finding

#### Scenario: Stop for an open finding that a person accepts before three rounds or without the severity minor `change-review-028`
- **WHEN** `review.md` has a finding with a box that is not checked and the words "Accepted by " and a name
- **AND** the "Rounds:" line has a number less than 3, or the second word of the finding text is not "minor"
- **THEN** the review gate stops the build

#### Scenario: Stop for a scope line that the gate does not accept `change-review-029`
- **WHEN** the "Scope:" line of `review.md` is not "full" and not "diff <commit>" with 7 to 40 lowercase hexadecimal characters
- **THEN** the review gate stops the build
- **AND** the gate shows the line

#### Scenario: Stop for a first round with a scope that is not the full change `change-review-030`
- **WHEN** the "Rounds:" line of `review.md` has the number 1
- **AND** the "Scope:" line is not "full"
- **THEN** the review gate stops the build

#### Scenario: Stop for a rounds line with a number less than 1 `change-review-031`
- **WHEN** the "Rounds:" line of `review.md` has the number 0
- **THEN** the review gate stops the build

### Requirement: Scope rules of the review command
The file `.claude/commands/opsx/review.md` MUST name the scope of a round, the two new lines of `review.md` and the limit of three rounds.
Origin: spec-first

#### Scenario: Stop for a review command without the scope rules `change-review-032`
- **WHEN** the review command file does not name the scope of a round, the "Rounds:" line, the "Scope:" line or the limit of three rounds
- **THEN** the review gate stops the build
- **AND** a review command file that is not there also stops the build

### Requirement: Scope rules of the review agents
Each review agent file MUST have a section with the heading "Scope of a round". The file MUST have the words "diff since the round" and the words "limit of three rounds".
Origin: spec-first

#### Scenario: Stop for an agent file without the scope rules `change-review-027`
- **WHEN** a review agent file has no heading "Scope of a round"
- **AND** the file has another heading, for example "## Scope", with the two rules
- **THEN** the review gate stops the build
- **AND** a file without the words "diff since the round" or "limit of three rounds" also stops the build
