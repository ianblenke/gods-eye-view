## ADDED Requirements

### Requirement: Patched Node version
The file `.node-version` MUST name a Node release that has the fix for the Brotli flaw CVE-2026-111497.
Origin: spec-first

#### Scenario: Pin a Node release with the Brotli fix `ci-gates-013`
- **WHEN** a test reads `.node-version`
- **THEN** the version is 24.22.1 or later of the line 24, or 26.12.1 or later of the line 26, or a later line
- **AND** the version 24.21.0 and the version 26.12.0 are refused
- **AND** the version 25.0.0 is refused, because the line 25 has no fix
