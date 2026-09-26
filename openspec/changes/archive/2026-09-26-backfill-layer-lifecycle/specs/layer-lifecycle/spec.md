## ADDED Requirements

### Requirement: Failed layer removal
The manager MUST keep a layer when its destroy function returns `false` or throws an error.
Origin: backfill

#### Scenario: Keep a layer after a destroy error `layer-lifecycle-001`
- **WHEN** a layer destroy function returns `false` or throws an error
- **THEN** `destroyLayer()` returns `false` and the layer stays in the manager
- **AND** the entry has `destroying` set to `false` and `visibilityIntentEnabled` set to its current enabled state
- **AND** the manager sends a `status` activity event
- **AND** the manager logs a warning with the layer id and `destroy error:`

### Requirement: Activity listener errors
The manager MUST continue to the next activity listener when one listener throws an error.
Origin: backfill

#### Scenario: Continue after an activity listener error `layer-lifecycle-002`
- **WHEN** an activity listener throws an error
- **THEN** the next listener gets the same activity event
- **AND** the manager logs `[Data] activity listener error:` with the error
