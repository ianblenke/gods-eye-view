## MODIFIED Requirements

### Requirement: Quote text
The layer MUST show the facts of a quote as short parts and show a fixed text for each failed check.

Origin: spec-first

#### Scenario: Show the facts `up42-quote-panel-007`
- **WHEN** a test gives results with validation status "VALID", estimate credits 120 with size 4 and unit "SQ_KM", feasibility outcome "FEASIBLE" and 3 passes
- **AND** the budget has `used` 2 and `limit` 20
- **THEN** the info text starts with the parts "Validation: VALID", "Estimate: 120 credits (about EUR 1.20) for 4 SQ_KM", "Feasibility: FEASIBLE" and "Passes: 3"
- **AND** the parts have the joiner " · "
- **AND** the quote text ends with the part "Quotes today: 2 of 20. No order was made."
- **AND** a failed check gives the part "<Name>: not available (<fixed text>)" and the other parts stay
- **AND** an answer with `cached` true adds the part "This quote is kept from before."
