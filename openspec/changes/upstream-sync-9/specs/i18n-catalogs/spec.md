## ADDED Requirements

### Requirement: Catalogs match the code
The catalog of each shipped locale MUST have a text for each message of the code. It MUST have no text that the code does not use.
Origin: backfill

#### Scenario: Check each catalog against the code `i18n-catalogs-001`
- **WHEN** a test checks the catalog of a shipped locale with the messages of the code
- **THEN** the check finds no missing text, no stale text and no error
- **AND** the test runs once for each shipped locale

#### Scenario: Translate the notices of the Director `i18n-catalogs-002`
- **WHEN** a test reads the catalog of a shipped locale for each notice of the Director
- **THEN** the catalog has a text for the notice
- **AND** the text is not equal to the English notice

#### Scenario: Translate the toasts of the shell `i18n-catalogs-003`
- **WHEN** a test reads the catalog of a shipped locale for each toast of the orientation and the navigation
- **THEN** the catalog has a text for the toast
- **AND** the text is not equal to the English toast
