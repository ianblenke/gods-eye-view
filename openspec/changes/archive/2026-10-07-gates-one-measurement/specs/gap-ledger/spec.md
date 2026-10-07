## ADDED Requirements

### Requirement: Ratchet comparison verdict
The ratchet command MUST use one measurement to write the files and all gate comparisons.
The command writes the trace files before the comparisons.
The comparison verdict decides status 0 for success or status 2 for errors.
The command keeps the errors that stop it before it writes the files, with status 1.

The command keeps `REVIEW-MISSING` when the review file is absent.
The first output line is `Command: ratchet`.
The comparisons use the repaired ledger, history, registry and links.
The set `RATCHET_FIXES` applies only before the command writes the files.
Origin: spec-first

#### Scenario: Compare one ratchet measurement `gap-ledger-123`
- **WHEN** the ratchet writes the ledger, history, registry and links
- **THEN** the command uses its own measurement for all comparisons

#### Scenario: Fail for an absent review `gap-ledger-124`
- **WHEN** the ratchet writes the files but the change has no review file
- **THEN** the command reports `REVIEW-MISSING` and exits with status 2

#### Scenario: Pass after all comparisons `gap-ledger-125`
- **WHEN** the ratchet completes all comparisons without an error
- **THEN** the command prints `Gates passed.` and exits with status 0

#### Scenario: Compare repaired ledger values `gap-ledger-126`
- **WHEN** the ratchet repairs stale entries, absent totals or the ledger version
- **THEN** the comparisons use the repaired ledger and keep all other errors
- **AND** the comparisons read the history line that the ratchet adds for absent totals

### Requirement: Ratchet measurement record
The ratchet MUST record the snapshot hash, commit and change even when no ledger gap changes.
The ratchet summary MUST give the number of history lines that the command writes.
The ratchet MUST keep history unchanged when the last line for this change has the same snapshot hash, commit and dirty list.
Origin: spec-first

#### Scenario: Record a snapshot without a changed gap `gap-ledger-127`
- **WHEN** the ratchet has no changed gap and no snapshot record for this change
- **THEN** the command adds a history line with kind `measurement`, the snapshot hash, the commit and the change
- **AND** the summary includes that line

#### Scenario: Keep history for an identical snapshot `gap-ledger-128`
- **WHEN** the last history line for this change has the same snapshot hash, commit and dirty list
- **THEN** the ratchet keeps history unchanged

#### Scenario: Record a different snapshot `gap-ledger-129`
- **WHEN** the snapshot hash, commit or change name differs from the last snapshot record
- **THEN** the ratchet adds a line with the current snapshot hash, commit and change

### Requirement: Ratchet input state
The ratchet MUST record changed files outside `openspec/changes/`, `openspec/specs/` and `openspec/trace/` in the history field `dirty`.
Compare current files with HEAD, with the same path rule as the document mode.
Include ignored input files with the same exceptions.
Changed code files and test files under the three allowed paths also cause a dirty list.
A clean ratchet MUST have no `dirty` field.
The decision to keep history unchanged MUST compare the snapshot, commit and sorted dirty list.

History readers MUST accept the extra field.
Origin: spec-first

#### Scenario: Record dirty input paths `gap-ledger-130`
- **WHEN** a file outside the allowed paths differs from HEAD at the ratchet
- **THEN** the history line has the sorted `dirty` list

#### Scenario: Omit dirty paths for a clean ratchet `gap-ledger-131`
- **WHEN** no input file, code file or test file differs from HEAD
- **THEN** the history line has no `dirty` field

#### Scenario: Record a different dirty list `gap-ledger-132`
- **WHEN** the snapshot and commit stay the same but the dirty list changes
- **THEN** the ratchet adds a history line

#### Scenario: Accept the extra history field `gap-ledger-133`
- **WHEN** a real history line has the extra `dirty` field
- **THEN** ledger comparisons accept the line

### Requirement: Dirty names in the ratchet container
The ratchet container MUST add the same protected ignored file markers as the document container.
The history comparison then sees ignored input files that the container copy omits.
Origin: spec-first

#### Scenario: Keep ignored names for ratchet history `gap-ledger-134`
- **WHEN** the container copy omits a protected ignored file before the ratchet
- **THEN** the ratchet container adds its name marker before the gate command
- **AND** the marker definition comes before the immediate command expansion
