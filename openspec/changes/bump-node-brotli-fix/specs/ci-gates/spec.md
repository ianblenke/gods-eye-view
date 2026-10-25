## ADDED Requirements

### Requirement: Patched Node version
The file `.node-version` MUST name a release of the line 24 or of the line 26 that has the fix for the Brotli flaw CVE-2026-111497, or a release of a line after 26.
Origin: spec-first

#### Scenario: Pin a Node release with the Brotli fix `ci-gates-013`
- **WHEN** a test reads `.node-version`
- **THEN** the version is 24.22.1 or later of the line 24, or 26.12.1 or later of the line 26, or a release of a line after 26
- **AND** the versions 24.21.0, 24.22.0 and 26.12.0 are refused
- **AND** the version 25.0.0 is refused, because the line 25 has no fix
- **AND** the version 22.23.4 is refused, because the table has no row for the line 22
