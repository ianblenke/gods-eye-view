## ADDED Requirements

### Requirement: One-time coverage baseline
The ledger MUST permit one explicit rebaseline step only in the change gates-coverage-race that first adds the exact merge module.
Origin: spec-first

#### Scenario: The command records unchanged file values `gap-ledger-110`

- **WHEN** the checked change adds the merge module and requests rebaseline
- **THEN** the first fixture changes lines from 1 to 3 and branches from 1 to 2
- **AND** it changes functions from 1 to 0 and adds a file with 2 uncovered lines
- **AND** each unchanged file with different metric values gets its measured entry and metric history
- **AND** each history line records old and new values, totals, content hash and change name, and the command lists each file

#### Scenario: The command rejects other changes `gap-ledger-111`

- **WHEN** the command lacks the active gates-coverage-race change or its merge module change
- **THEN** the command stops before any test
- **AND** a base tree that already contains the merge module also stops the command
- **AND** an absent current or base ledger also stops the command

#### Scenario: Changed source files keep the normal rules `gap-ledger-112`

- **WHEN** a source file differs from its base content
- **THEN** rebaseline leaves its entry and history unchanged
- **AND** untrue or unloaded source files also keep the normal rules

#### Scenario: History permits only the recorded values `gap-ledger-113`

- **WHEN** the checked change supplies valid rebaseline history for unchanged source files
- **THEN** the gate uses the recorded entries for its base comparison
- **AND** a later measurement above the ledger still stops the gate
- **AND** the ratchet command stops when the baseline history differs from the exact measurement

#### Scenario: The gate rejects false history `gap-ledger-114`

- **WHEN** a rebaseline line lacks the checked change, module change, base content, exact old values or exact measured values
- **THEN** the gate gives no allowance from that line
- **AND** the gate retains its LEDGER errors and rejects incomplete metric sets and repeated file metric pairs

#### Scenario: The command permits one explicit step `gap-ledger-115`

- **WHEN** the checked change already records a rebaseline step
- **THEN** the command stops before any test
- **AND** the command changes no ledger file after a test error
- **AND** the command stops when no metric differs
- **AND** the command stops when the current history lacks the base history prefix
