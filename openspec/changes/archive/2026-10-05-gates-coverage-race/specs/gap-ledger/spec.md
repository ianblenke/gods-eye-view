## ADDED Requirements

### Requirement: One-time coverage baseline
The ledger MUST permit one explicit rebaseline step only in the change gates-coverage-race that first adds the exact merge module.
The old values must equal the base values exactly. The new values must stay within the count tolerance of the current measurement.
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
- **AND** the temporary base retains true loaded coverage when the old entry lacked true loaded coverage
- **AND** a later measurement above the ledger by more than the count tolerance still stops the gate
- **AND** the ratchet command stops when the baseline history differs from the current measurement by more than the count tolerance

#### Scenario: The gate rejects false history `gap-ledger-114`

- **WHEN** a rebaseline line lacks the checked change, module change, base content, exact old values or new values within the count tolerance
- **THEN** the gate gives no allowance from that line
- **AND** the gate retains its LEDGER errors and rejects incomplete metric sets and repeated file metric pairs
- **AND** the gate rejects metric names outside lines, branches and functions

#### Scenario: The command permits one explicit step `gap-ledger-115`

- **WHEN** the checked change already records a rebaseline step
- **THEN** the command stops before any test
- **AND** the command changes no ledger file after a test error
- **AND** the command stops when no metric differs
- **AND** the command stops when the current history lacks the base history prefix

#### Scenario: The real metric differences stay within tolerance `gap-ledger-116`

- **WHEN** the history records lines 44 of 310, branches 30 of 74 and branches 10 of 53
- **THEN** measurements 40 of 310, 30 of 76 and 10 of 54 permit that history

#### Scenario: The boundary stops a larger difference `gap-ledger-117`

- **WHEN** the history records 49 uncovered lines of 310 and the measurement gives 40
- **THEN** the gate rejects the difference above the tolerance

#### Scenario: Small totals permit no difference `gap-ledger-118`

- **WHEN** the history records 2 uncovered items of 24 and the measurement gives 1
- **THEN** the gate rejects the difference

#### Scenario: The start values and source stay exact `gap-ledger-119`

- **WHEN** the history changes an old value, old total or source hash
- **THEN** the gate rejects each false value
- **AND** the gate accepts only true loaded source files
- **AND** the gate rejects metric values without whole numbers

#### Scenario: An unchanged metric retains its bound `gap-ledger-120`

- **WHEN** the history records a metric that equals the base in the current measurement
- **THEN** the gate accepts a difference at the tolerance and rejects a larger difference

#### Scenario: The ledger snapshot stays within tolerance `gap-ledger-121`

- **WHEN** a ledger entry differs from the current measurement
- **THEN** the gate accepts differences within tolerance and rejects larger differences and false source properties
