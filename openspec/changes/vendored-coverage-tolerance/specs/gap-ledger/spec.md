## ADDED Requirements

### Requirement: Count tolerance for adopted files
The gate and the ratchet command MUST extend count tolerance to a file that equals its adopted source of the checked change.
The content hash MUST equal the hash in the ledger entry.
Both the ledger entry and the current gap MUST show true coverage from a test that loads the file.
A valid adopt line is an adopt line that meets the requirement "Adoption of merged code".
The file MUST have a valid adopt line of the checked change.
The file content MUST equal its content at the `from` commit.

The conditions on the content hash, the coverage, the adopt line and the file content are the adopted-source conditions.
This requirement is an exception to the base content condition of "Count tolerance" and to gap-ledger-028, gap-ledger-073 and gap-ledger-074.
The exception applies only to a file with the adopted-source conditions and no base content.
For that file, gap-ledger-028 does not direct the ratchet command to write the larger count.
For that file, gap-ledger-073 does not direct the ratchet command to write ledger entry counts for a smaller covered count.
For that file, gap-ledger-074 does not direct the gate to compare the counts of that file with no tolerance.

The exception also extends the stale exception sentence of "Ratchet rule" to that file.
For that file, the clauses in gap-ledger-004, gap-ledger-013 and gap-ledger-054 use the adopted-source conditions instead of the tolerance conditions.
The stale clauses in gap-ledger-008 and gap-ledger-078 use the adopted-source conditions instead of the tolerance conditions.
The count clauses in gap-ledger-057, gap-ledger-069, gap-ledger-070 and gap-ledger-072 use the adopted-source conditions instead of the tolerance conditions.
The term "tolerance conditions" has only the meaning from the base requirement "Count tolerance".

For a file with base content, the stale exception sentence of "Ratchet rule" has its base meaning.
For a file with base content, these scenarios also have their base meanings:
gap-ledger-004, gap-ledger-008, gap-ledger-013, gap-ledger-054, gap-ledger-057, gap-ledger-069, gap-ledger-070, gap-ledger-072 and gap-ledger-078.
Scenario gap-ledger-071 does not use that term. Its tolerance sizes have their base meaning for all files.

For a file with the adopted-source conditions, the gate and the ratchet command MUST apply the count tolerance of the requirement "Count tolerance".
For that file, the gate and the ratchet command MUST report the coverage loss errors of that requirement.
For that file, the gate MUST NOT record the ledger entry as stale for counts inside the tolerance.

When a file has the tolerance conditions, the ratchet command MUST use toleranceCounts.
This also applies when the file equals its adopted source.
When a file has the adopted-source conditions and no base content, the ratchet command MUST use never-worse counts.

Never-worse counts are the counts that the next three rules direct the ratchet command to write.
For each metric of a file with the adopted-source conditions and no base content, the ratchet command MUST write current counts.
This applies when the current not-covered count of that metric is smaller than or equal to the ledger entry not-covered count of that metric.
Current counts are the current not-covered count and total count.

For that file, the ratchet command MUST write ledger entry counts for a metric.
This applies when the current not-covered count of that metric is larger than the ledger entry not-covered count of that metric.
Ledger entry counts are the ledger entry not-covered count and total count.
For that file and a metric with an absent ledger entry total count, the ratchet command MUST write the current gap total count instead.
Origin: spec-first

#### Scenario: Allow a file that equals its adopted source `gap-ledger-136`
- **WHEN** a file meets the adopted-source conditions
- **THEN** the gate applies the count tolerance of the requirement "Count tolerance"
- **AND** the gate does not record the ledger entry as stale for counts inside the tolerance

#### Scenario: Use no tolerance after an edit `gap-ledger-137`
- **WHEN** a file differs from its adopted source or its content hash differs from the hash in its ledger entry
- **THEN** the gate compares the file with no tolerance from this requirement

#### Scenario: Reject an invalid adopt line `gap-ledger-138`
- **WHEN** an adopt line names a `from` commit that is not a merged commit
- **THEN** the gate gives no tolerance from this requirement
- **AND** the gate still reports the error LEDGER-ADOPT-FROM

#### Scenario: Ignore another change `gap-ledger-139`
- **WHEN** an adopt line names another change
- **THEN** the gate gives no tolerance from that adopt line

#### Scenario: Allow an upstream file without base content `gap-ledger-140`
- **WHEN** a file has no base content and meets the adopted-source conditions
- **THEN** the gate applies the count tolerance of the requirement "Count tolerance"

#### Scenario: Use no tolerance for untrue coverage `gap-ledger-141`
- **WHEN** a file equals its adopted source but the ledger entry or the current gap has untrue coverage or no test loads the file
- **THEN** the gate gives no tolerance from this requirement

#### Scenario: Apply the count tolerance `gap-ledger-142`
- **WHEN** a file meets the adopted-source conditions
- **AND** a not-covered line count is above the ledger entry not-covered count plus the tolerance
- **AND** for branches and functions, a not-covered count is above the ledger entry not-covered count plus the tolerance
- **AND** for branches and functions, a covered count is below the ledger entry covered count minus the tolerance
- **THEN** the gate reports LEDGER-LARGER-GAP for lines
- **AND** the gate reports LEDGER-LOST-COVERAGE for branches and functions

#### Scenario: Write never-worse counts `gap-ledger-143`
- **WHEN** the ratchet command compares a ledger entry with a file that meets the adopted-source conditions
- **THEN** the ratchet command uses never-worse counts for a file without base content
- **AND** the ratchet command uses toleranceCounts for a file with base content
- **AND** the ratchet command writes the smaller of the current and ledger entry not-covered counts of each metric for a file without base content

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
- **WHEN** a file equals its adopted source, has no base content and meets the adopted-source conditions
- **AND** a metric has a current not-covered count larger than its ledger entry not-covered count inside the tolerance
- **AND** another metric has a current not-covered count smaller than or equal to its ledger entry not-covered count
- **THEN** the ratchet command writes ledger entry counts for the metric with the current not-covered count larger than its ledger entry not-covered count
- **AND** the ratchet command reports no LEDGER-NOT-IN-BASE and no LEDGER-MORE-THAN-BASE
- **AND** the ratchet command writes current counts for that other metric
- **AND** the ratchet command does not change the total counts of the current gap

#### Scenario: Write current gap total counts when ledger entry total counts are absent `gap-ledger-155`
- **WHEN** a file has the adopted-source conditions and no base content
- **AND** a metric has a current not-covered count larger than its ledger entry not-covered count inside the tolerance
- **AND** the ledger entry total count of that metric is absent
- **THEN** the ratchet command writes the ledger entry not-covered count and the current gap total count

#### Scenario: Write a ledger entry total count of zero for a larger count `gap-ledger-156`
- **WHEN** a file has the adopted-source conditions and no base content
- **AND** a metric has a current not-covered count larger than its ledger entry not-covered count inside the tolerance
- **AND** the ledger entry total count of that metric is zero
- **THEN** the ratchet command writes the ledger entry total count of zero

### Requirement: Total counts for adopted files
The gate MUST accept a total-only difference for a file with a valid adopt line of the checked change.
The gate MUST NOT record the ledger entry as stale for that difference.
Both the ledger entry and the current gap MUST have equal not-covered counts of lines, branches and functions.
Both the ledger entry and the current gap MUST have equal content hashes and true coverage from a test that loads the file.

This requirement is an exception to scenario gap-ledger-078 and to the stale exception sentence of the requirement "Ratchet rule".
That sentence names the tolerance conditions as an exception to the stale rule.
This requirement gives the total count exception only to a file with a valid adopt line of the checked change and equal content hashes.
Both records MUST have true coverage from a test that loads the file.
The ledger entry and current gap MUST also have equal not-covered counts of lines, branches and functions.
The total count exception applies to no other file.


This requirement MUST NOT extend count tolerance to a file that differs from its adopted source.
For a file without base content, the ratchet command MUST write current gap total counts when that file differs from its adopted source.
For a file that equals its adopted source, the ratchet command MUST apply the count rules of "Count tolerance for adopted files".
Origin: spec-first

#### Scenario: Accept total count differences `gap-ledger-147`
- **WHEN** a file with a valid adopt line of the checked change differs from its adopted source
- **AND** the file has no base content
- **AND** its content hash equals the hash in its ledger entry
- **AND** the ledger entry and the current gap have true loaded coverage and equal not-covered counts of lines, branches and functions
- **AND** their total counts differ
- **THEN** the gate does not record the ledger entry as stale
- **AND** the ratchet command writes the current gap total counts, for example 399 or 401 for a ledger entry total count of 400

#### Scenario: Compare not-covered counts with no tolerance `gap-ledger-148`
- **WHEN** a file with a valid adopt line differs from its adopted source and has no base content
- **AND** the ledger entry and the current gap have equal content hashes and true loaded coverage
- **AND** a not-covered count differs from the ledger entry
- **AND** the current gap and the ledger entry have equal total counts
- **THEN** the gate reports LEDGER-LARGER-GAP or LEDGER-LOST-COVERAGE for a larger count
- **AND** the gate records the ledger entry as stale for a smaller count
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
