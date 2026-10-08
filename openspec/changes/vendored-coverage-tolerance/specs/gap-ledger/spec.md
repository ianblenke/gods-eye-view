## ADDED Requirements

### Requirement: Count tolerance for adopted files
The gates and the ratchet command MUST extend count tolerance to a file that equals its adopted source of the checked change.
The content hash MUST equal the hash in the ledger entry.
Both the ledger entry and the current gap MUST show true coverage from a test that loads the file.
The adopt line MUST meet the requirement "Adoption of merged code".
The file content MUST equal its content at the `from` commit.

This requirement is an exception to the base content condition of the requirement "Count tolerance" and to scenario gap-ledger-074.
The exception applies to a file that equals its adopted source and to no other file.
These are the tolerance conditions of a file that equals its adopted source.

The commands MUST apply the count tolerance of the requirement "Count tolerance" and its coverage loss errors.
The gate MUST not record an entry as stale for counts inside this count tolerance.

The ratchet command MUST use toleranceCounts for a file with base content, also when the file equals its adopted source.
For a file that equals its adopted source without base content, the ratchet command MUST use never-worse counts.
For each metric, never-worse counts MUST write the current not-covered count and total count when the not-covered count is smaller or equal.
For a larger not-covered count, never-worse counts MUST keep the entry not-covered count and entry total count.
Origin: spec-first

#### Scenario: Allow a file that equals its adopted source `gap-ledger-136`
- **WHEN** a file meets the tolerance conditions of a file that equals its adopted source
- **THEN** the gate applies the count tolerance of the requirement "Count tolerance"
- **AND** the gate does not record the ledger entry as stale for counts inside this count tolerance

#### Scenario: Use no tolerance after an edit `gap-ledger-137`
- **WHEN** a file differs from its adopted source or its content hash differs from the hash in its ledger entry
- **THEN** the gate compares the file with no tolerance from this requirement

#### Scenario: Reject an invalid adopt line `gap-ledger-138`
- **WHEN** an adopt line names a `from` commit that is not a merged commit
- **THEN** the gate gives no tolerance from this requirement
- **AND** the gate still reports the error LEDGER-ADOPT-FROM

#### Scenario: Ignore another change `gap-ledger-139`
- **WHEN** an adopt line names another change
- **THEN** the gate gives no tolerance from this requirement from that adopt line

#### Scenario: Allow a new upstream file `gap-ledger-140`
- **WHEN** a new file has no base content and meets the tolerance conditions of a file that equals its adopted source
- **THEN** the gate applies the count tolerance of the requirement "Count tolerance"

#### Scenario: Use no tolerance for untrue coverage `gap-ledger-141`
- **WHEN** a file equals its adopted source but the ledger entry or the current gap has untrue coverage or no test loads the file
- **THEN** the gate gives no tolerance from this requirement

#### Scenario: Apply the count limits `gap-ledger-142`
- **WHEN** a file meets the tolerance conditions of a file that equals its adopted source
- **AND** a not-covered line count is above the entry count plus the count tolerance
- **THEN** the gate reports LEDGER-LARGER-GAP for lines
- **AND** the gate reports LEDGER-LOST-COVERAGE when both the not-covered count rise and covered count loss exceed the tolerance for branches or functions

#### Scenario: Write the better count `gap-ledger-143`
- **WHEN** the ratchet command compares an entry with a file that meets the tolerance conditions of a file that equals its adopted source
- **THEN** the command uses never-worse counts for a file without base content
- **AND** the command uses toleranceCounts for a file with base content
- **AND** the command writes the smaller not-covered count for a file without base content

#### Scenario: Use one adopted source rule `gap-ledger-144`
- **WHEN** the ci command, the check command or the ratchet command runs for a change with adopt lines
- **THEN** each command checks the adopt line in the same way
- **AND** each command compares the file content with its content at the `from` commit in the same way

#### Scenario: Give no tolerance to an absent file `gap-ledger-145`
- **WHEN** a valid adopt line names a file that the current tree does not have
- **THEN** the gate gives no tolerance from this requirement and does not read the file

#### Scenario: Need the code file in the adopt line `gap-ledger-146`
- **WHEN** valid adopt lines name other files but do not name the code file
- **THEN** the gate gives that code file no tolerance from this requirement

#### Scenario: Write no larger count for a file that equals its adopted source `gap-ledger-154`
- **WHEN** a file equals its adopted source, has no base content and meets the tolerance conditions of this requirement
- **AND** a current not-covered count is above its entry count inside the count tolerance
- **THEN** the ratchet command keeps the entry count and entry total count of that metric
- **AND** the base comparison reports no LEDGER-NOT-IN-BASE and no LEDGER-MORE-THAN-BASE
- **AND** the ratchet command writes the current count and current total count of each metric with a smaller or equal not-covered count
- **AND** the current gap still has its current total counts after the ratchet command

### Requirement: Total counts for adopted files
The gates MUST accept a total-only difference for a file with a valid adopt line of the checked change.
The gate MUST not record the ledger entry as stale for that difference.
Both the ledger entry and the current gap MUST have equal not-covered counts of lines, branches and functions.
Both the ledger entry and the current gap MUST have equal content hashes and true coverage from a test that loads the file.

This requirement is an exception to scenario gap-ledger-078 and to the stale exception sentence of the requirement "Ratchet rule".
That sentence names the tolerance conditions as the only exception to the stale rule.
The exception applies to a file with a valid adopt line of the checked change and equal not-covered counts of lines, branches and functions.
The exception applies to no other file.


This requirement MUST not extend count tolerance to a file that differs from its adopted source.
For a file without base content, the ratchet command MUST write current total counts when that file differs from its adopted source.
For a file that equals its adopted source, the ratchet command MUST apply the count rules of "Count tolerance for adopted files".
Origin: spec-first

#### Scenario: Accept total count differences `gap-ledger-147`
- **WHEN** a file with a valid adopt line of the checked change differs from its adopted source
- **AND** the file has no base content
- **AND** its content hash equals the hash in its ledger entry
- **AND** the ledger entry and the current gap have true loaded coverage and equal not-covered counts of lines, branches and functions
- **AND** their total counts differ
- **THEN** the gate does not record the ledger entry as stale
- **AND** the ratchet command writes the current total counts, for example 399 or 401 for an entry total of 400

#### Scenario: Compare not-covered counts with no tolerance `gap-ledger-148`
- **WHEN** a file with a valid adopt line differs from its adopted source and has no base content
- **AND** the ledger entry and the current gap have equal content hashes and true loaded coverage
- **AND** a not-covered count differs from the ledger entry
- **AND** the current gap and the ledger entry have equal total counts
- **THEN** the gate reports LEDGER-LARGER-GAP or LEDGER-LOST-COVERAGE for a larger count
- **AND** the gate records the entry as stale for a smaller count
- **AND** the build stops until the ratchet command runs for the smaller count

#### Scenario: Need a valid adopt line `gap-ledger-149`
- **WHEN** no valid adopt line names a file without base content and only its total counts differ from its ledger entry
- **THEN** the gate records the ledger entry as stale, and the build stops until the ratchet command runs

#### Scenario: Ignore another change line `gap-ledger-150`
- **WHEN** an adopt line names another change and only total counts differ for a file without base content
- **THEN** the gate records the ledger entry as stale, and the build stops until the ratchet command runs

#### Scenario: Reject an invalid from commit `gap-ledger-151`
- **WHEN** an adopt line has a `from` commit that is not a merged commit and only total counts differ for a file without base content
- **THEN** the gate records the ledger entry as stale, and the build stops until the ratchet command runs
- **AND** the gate still reports LEDGER-ADOPT-FROM

#### Scenario: Compare a different hash with no tolerance `gap-ledger-152`
- **WHEN** a file with a valid adopt line has a content hash that differs from the hash in its ledger entry
- **AND** its total counts differ
- **THEN** the gate records the ledger entry as stale, and the build stops until the ratchet command runs

#### Scenario: Compare untrue or unloaded coverage with no total count exception `gap-ledger-153`
- **WHEN** the ledger entry or the current gap has untrue coverage or no test loads the file
- **AND** the total counts differ for a file with a valid adopt line
- **THEN** the gate gives no total count exception
- **AND** the gate reports COVERAGE-FAKE for an untrue current gap or LEDGER-UNLOADED for an unloaded current gap
- **AND** the gate records the ledger entry as stale when only the ledger entry has untrue or unloaded coverage
