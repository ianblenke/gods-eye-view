## ADDED Requirements

### Requirement: Contact dot image
The cockpit MUST draw the image of the contact dot once. Each later call MUST give the same data URL.
Origin: backfill

#### Scenario: Share one contact dot image `cockpit-contact-dot-001`
- **WHEN** a caller asks for the contact dot image more than once
- **THEN** the cockpit draws one canvas
- **AND** each call gives the same data URL
