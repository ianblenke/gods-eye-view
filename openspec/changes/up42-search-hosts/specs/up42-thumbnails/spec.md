## ADDED Requirements

### Requirement: Thumbnail failure log

The route MUST log only the fixed failure kind for an upstream thumbnail failure.

Origin: spec-first

#### Scenario: Name a thumbnail failure `up42-thumbnails-020`

- **WHEN** an upstream thumbnail call fails
- **THEN** the route writes `[up42] thumbnail failed kind=<kind>` with the fixed failure kind
- **AND** the line contains no id, host, URL, user name, password, token or request body
- **AND** a good or kept image writes no line
