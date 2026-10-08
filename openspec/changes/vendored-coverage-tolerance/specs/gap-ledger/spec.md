## ADDED Requirements

### Requirement: Count tolerance for adopted files
The gates and the ratchet command MUST extend count tolerance to a file that equals its valid adopted source of the checked change.
The file MUST have the content hash of its ledger entry. Both records MUST show a file that a test loads with true coverage.

The source MUST satisfy adoptsOf and checkAdopts. The file MUST equal its content at the from commit.
The commands MUST keep the same tolerance size, stale rule, coverage loss errors and toleranceCounts rule.
Origin: spec-first

#### Scenario: Allow an adopted source `gap-ledger-136`
- **WHEN** a loaded file with true coverage equals a valid adopted source of this change and its ledger hash
- **THEN** the gate applies the same count tolerance and does not mark counts inside that tolerance as stale

#### Scenario: Use no tolerance after an edit `gap-ledger-137`
- **WHEN** a file differs from its adopted source or its ledger hash
- **THEN** the gate compares the file with no new tolerance

#### Scenario: Reject an invalid source `gap-ledger-138`
- **WHEN** an adopt record names a from commit that no merge after the base brought
- **THEN** the gate gives no new tolerance and keeps LEDGER-ADOPT-FROM

#### Scenario: Ignore another change `gap-ledger-139`
- **WHEN** an adopt record names another change
- **THEN** the gate gives no new tolerance from that record

#### Scenario: Allow a new upstream file `gap-ledger-140`
- **WHEN** a new file has no base content but equals its valid adopted source and its ledger hash
- **THEN** the gate applies the same count tolerance

#### Scenario: Use no tolerance for untrue coverage `gap-ledger-141`
- **WHEN** an adopted file has untrue coverage or no test loads it
- **THEN** the gate gives no new tolerance

#### Scenario: Keep the count limits `gap-ledger-142`
- **WHEN** an adopted file with the tolerance conditions exceeds the same count tolerance
- **THEN** the gate reports LEDGER-LARGER-GAP for lines or LEDGER-LOST-COVERAGE for branches and functions

#### Scenario: Keep the better count `gap-ledger-143`
- **WHEN** the ratchet command compares an adopted file with the tolerance conditions and an entry
- **THEN** the command uses toleranceCounts and never writes a worse count

#### Scenario: Use one source rule `gap-ledger-144`
- **WHEN** ci, check or the ratchet command checks a change with adopt records
- **THEN** each command uses the same valid source and current content checks

#### Scenario: Give no tolerance to an absent file `gap-ledger-145`
- **WHEN** a valid adopt record names a file that the current tree lacks
- **THEN** the gate gives no new tolerance and does not try to read that current file

#### Scenario: Need the file in the adopt record `gap-ledger-146`
- **WHEN** valid adopt records name other files but do not name the production file
- **THEN** the gate gives that production file no new tolerance

### Requirement: Total counts for adopted files
The gates MUST not mark a valid adopted file of the checked change as stale when only its total counts differ.
Both records MUST have equal not-covered counts and equal content hashes with true loaded coverage.
This rule MUST give no count tolerance to a file that differs from its adopted source.
The ratchet command MUST write the current total counts for that file.
Origin: spec-first

#### Scenario: Accept total count differences `gap-ledger-147`
- **WHEN** a valid adopted file differs from its source but has equal ledger and current hashes and not-covered counts
- **AND** both records have true loaded coverage and different total counts
- **THEN** the gate does not mark the file as stale
- **AND** the ratchet command writes current totals, such as 399 or 401 from 400, or 100 from 101

#### Scenario: Keep exact not-covered counts `gap-ledger-148`
- **WHEN** that adopted file has different not-covered counts
- **THEN** the gate keeps each coverage error and the stale rule exact

#### Scenario: Need a valid adopt record `gap-ledger-149`
- **WHEN** no valid adopt record names the file
- **THEN** the gate marks total count differences as stale

#### Scenario: Ignore another change record `gap-ledger-150`
- **WHEN** the adopt record names another change
- **THEN** the gate marks total count differences as stale

#### Scenario: Reject an invalid from commit `gap-ledger-151`
- **WHEN** the adopt record has a from commit that is not a merge second parent
- **THEN** the gate marks total count differences as stale
- **AND** the gate keeps LEDGER-ADOPT-FROM

#### Scenario: Keep a different hash exact `gap-ledger-152`
- **WHEN** an adopted file has a current hash that differs from its ledger hash
- **THEN** the gate marks total count differences as stale

#### Scenario: Keep untrue or unloaded records exact `gap-ledger-153`
- **WHEN** either record has untrue coverage or no test loads the file
- **THEN** the gate gives no total count exception
