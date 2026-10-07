## ADDED Requirements

### Requirement: Review measurement sequence
The review command MUST start with `precheck` and MUST keep all steps and checks.
Steps for documents MUST use `gates-docs` after the ratchet verdict.
The final tree MUST get full gates and CI before merge.
The ratchet commit MUST contain all input files before document steps.
Origin: spec-first

#### Scenario: Keep the final measurement `change-review-033`
- **WHEN** the review command describes its steps
- **THEN** document steps use `gates-docs` and the final tree gets full gates before merge
- **AND** the ratchet commit contains the input files
