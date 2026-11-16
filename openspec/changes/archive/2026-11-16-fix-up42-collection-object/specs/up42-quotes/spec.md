## MODIFIED Requirements

### Requirement: Public products

The products route MUST give only products with id, title and an optional collection string from the public TASKING list.

Origin: spec-first

#### Scenario: Read the products `up42-quotes-014`

- **WHEN** the public response contains content with UUID ids and optional titles
- **AND** each optional collection is a string or an object with a string name
- **THEN** the route gives products without credentials or a daily count
- **AND** absent titles use the id, and the collection is the string or the name
- **AND** strings have at most 160 characters
