## ADDED Requirements

### Requirement: Ontario camera credential
The Ontario camera pack MUST use an optional server key, make no request without it, and keep the key out of logs and errors.
Origin: spec-first

#### Scenario: Send the server key `live-sources-002`
- **WHEN** the server has `ONTARIO_511_API_KEY`
- **THEN** the camera request has that value in the `key` parameter
- **AND** the pack maps the camera rows as before

#### Scenario: Stop without a key `live-sources-003`
- **WHEN** the server has no key or a blank key and calls the Ontario pack twice
- **THEN** the pack makes no request and returns an empty list each time
- **AND** the process writes one warning that names `ONTARIO_511_API_KEY`

#### Scenario: Reject an invalid key `live-sources-004`
- **WHEN** the camera endpoint answers HTTP 400 with `Invalid Key` twice
- **THEN** the pack returns an empty list each time and writes one warning
- **AND** no log or error has the key text

#### Scenario: Keep error text secret `live-sources-005`
- **WHEN** the fetch or JSON reader throws an error with the key text
- **THEN** the pack returns an empty list and writes fixed warning text without the key
