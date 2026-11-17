## MODIFIED Requirements

### Requirement: Image

The client MUST accept only PNG, JPEG or WebP with at most 4194304 bytes and the correct first bytes.

Origin: spec-first

#### Scenario: Check the image `up42-thumbnails-010`

- **WHEN** read image responses with valid and invalid types, sizes and first bytes
- **THEN** the client ignores content type parameters and case and sends only a valid image
- **AND** PNG starts with 89 50 4E 47 0D 0A 1A 0A; JPEG starts with FF D8 FF
- **AND** WebP starts with RIFF and has WEBP at bytes 9 through 12
- **AND** a non-image type, empty body, null body, wrong signature or excess size gives bad_upstream with 502
- **AND** exactly 4194304 bytes pass; the client cancels a non-image body before it reads the body
