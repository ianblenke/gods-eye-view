## MODIFIED Requirements

### Requirement: Order confirm

The order step MUST state the amount and that it spends no credits yet. It MUST send nothing before the person presses "Place order".

Origin: spec-first

#### Scenario: Confirm the order `up42-order-panel-005`

- **WHEN** the person presses "Order this visit"
- **THEN** the info text is "Order <title> for this view? The estimate is 120 credits (about EUR 1.20). This spends no credits yet." and the chips are "Place order" and "Cancel"
- **AND** the source gets no call; "Cancel" returns the layer to its state before the step

### Requirement: Quotation step

The chip "Check quotation" MUST read the quotation and MUST show its price. A quotation with a price and the decision NOT_DECIDED shows the chip "Accept quotation".

Origin: spec-first

#### Scenario: Check the quotation `up42-order-panel-007`

- **WHEN** the person presses "Check quotation" and the quotation is null, is undecided with 90 credits, or has the decision ACCEPTED
- **THEN** the info text is "UP42 has no quotation yet.", "Quotation: 90 credits (about EUR 0.90)." with the chips "Accept quotation", "Reject quotation" and "Check quotation", or "This quotation is accepted."

### Requirement: Accept confirm

The accept step MUST state the amount, that it spends credits and that UP42 cannot reverse it. It MUST send nothing before the person presses "Accept and spend".

Origin: spec-first

#### Scenario: Confirm the accept `up42-order-panel-008`

- **WHEN** the person presses "Accept quotation" for a quotation of 90 credits
- **THEN** the info text is "Accept the quotation of 90 credits (about EUR 0.90)? This spends 90 credits. UP42 cannot reverse it." and the chips are "Accept and spend 90 credits" and "Cancel"
- **AND** the source gets no call before the second press
