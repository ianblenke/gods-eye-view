## MODIFIED Requirements

### Requirement: Repository register
The real repository MUST pass the register check after the headers are complete.
Origin: spec-first

#### Scenario: The real repository passes the register check `qa-scripts-023`
- **WHEN** the register checks the tracked QA scripts of this repository
- **THEN** it checks all 88 tracked QA scripts
- **AND** the register reports no QA error
- **AND** qa-browserEvidence, qa-panel-resize and qa-panelDrag each name `pending:application-shell` in their covers tag
