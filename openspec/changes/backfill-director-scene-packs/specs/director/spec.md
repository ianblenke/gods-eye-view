# Director shot pack specification

## ADDED Requirements

### Requirement: The legacy sequence
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The legacy sequence `director-151`
- **WHEN** the Nepal scene contains only Shot 1, Shot 2 and Shot 3
- **THEN** the director gives the scene 25 shots and keeps the first three shot IDs and cameras
- **AND** the checkpoint records the original project
- **AND** the pack call disables its checkpoint, control updates and notice

### Requirement: The authored legacy scene
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The authored legacy scene `director-152`
- **WHEN** the legacy scene title, shot total or a shot title differs
- **THEN** the director leaves the scene unchanged

### Requirement: The legacy checkpoint error
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The legacy checkpoint error `director-153`
- **WHEN** storage rejects the legacy checkpoint
- **THEN** the director reports a storage error and leaves the scene unchanged

### Requirement: The legacy pack refusal
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The legacy pack refusal `director-154`
- **WHEN** the pack rejects the legacy scene after its checkpoint
- **THEN** the director restores the project from before the change

### Requirement: The legacy selection
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The legacy selection `director-155`
- **WHEN** the legacy bootstrap accepts a pack change
- **THEN** the director selects the scene and its first shot
- **AND** an empty scene selects null

### Requirement: The absent scene
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The absent scene `director-156`
- **WHEN** the target scene ID is absent
- **THEN** the pack returns scene-not-found

### Requirement: The absent pack
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The absent pack `director-157`
- **WHEN** the pack ID is absent
- **THEN** the pack returns pack-not-found

### Requirement: The current pack marker
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The current pack marker `director-158`
- **WHEN** the stored pack version equals or exceeds the recipe version
- **THEN** the pack returns already-appended without a project change

### Requirement: The first Nepal pack
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The first Nepal pack `director-159`
- **WHEN** the scene contains the eight original Nepal shots without a pack marker
- **THEN** the pack adds 17 shots and records version 18
- **AND** the result records a patch total of 14

### Requirement: The older Nepal pack
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The older Nepal pack `director-160`
- **WHEN** the stored version is 12 or 17 with an approved older beat sequence
- **THEN** the pack completes the sequence without replacement of authored cameras or titles

### Requirement: The incorrect older beats
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The incorrect older beats `director-161`
- **WHEN** an older pack contains an incomplete or reordered beat sequence
- **THEN** the pack returns source-pack-mismatch without a scene change

### Requirement: The final view adoption
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The final view adoption `director-162`
- **WHEN** one authored shot matches an adoptable pack title during expansion
- **THEN** the pack uses that shot ID and camera for the matched beat
- **AND** the pack keeps other authored layers

### Requirement: The final view candidates
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The final view candidates `director-163`
- **WHEN** the pack does not expand, or the authored final view is absent, duplicated or belongs to another pack
- **THEN** the pack does not adopt that shot

### Requirement: The stored final beat
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The stored final beat `director-164`
- **WHEN** the older pack already contains the final beat
- **THEN** the pack does not adopt another authored Final view shot

### Requirement: The addition order
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The addition order `director-165`
- **WHEN** the older pack needs more beats
- **THEN** the pack inserts each addition in recipe order
- **AND** the last addition follows an unrelated authored tail

### Requirement: The initial inventory
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The initial inventory `director-166`
- **WHEN** the initial shot inventory differs in length or title order
- **THEN** the pack returns shot-inventory-mismatch

### Requirement: The renamed bound shots
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The renamed bound shots `director-167`
- **WHEN** the pack marker binds renamed shots to the required titles
- **THEN** the pack uses the bound shot IDs

### Requirement: The absent bound shot
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The absent bound shot `director-168`
- **WHEN** a required title binds to an absent shot ID
- **THEN** the pack returns shot-inventory-mismatch

### Requirement: The repeated bound shot
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The repeated bound shot `director-169`
- **WHEN** two required titles bind to the same shot ID
- **THEN** the pack returns shot-inventory-mismatch

### Requirement: The source beat inventory
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The source beat inventory `director-170`
- **WHEN** the source beat inventory differs in length or order
- **THEN** the pack returns source-pack-mismatch

### Requirement: The absent patch target
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The absent patch target `director-171`
- **WHEN** a patch cannot find its bound shot
- **THEN** the pack returns shot-bindings-incomplete

### Requirement: The patch title match
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The patch title match `director-172`
- **WHEN** a patch title matches zero or more than one shot
- **THEN** the pack returns shot-bindings-incomplete

### Requirement: The camera patch
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The camera patch `director-173`
- **WHEN** a camera patch targets a shot whose title equals the patch title
- **THEN** the pack uses the normalized patch camera when the pack does not expand
- **AND** expansion keeps the authored camera

### Requirement: The hold patch
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The hold patch `director-174`
- **WHEN** a patch supplies a finite hold value
- **THEN** the pack sets the hold to that value with a zero lower limit

### Requirement: The visual patch
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The visual patch `director-175`
- **WHEN** a patch supplies visual fields
- **THEN** the pack combines those fields with the shot visual fields

### Requirement: The layer patch
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The layer patch `director-176`
- **WHEN** a patch supplies layer targets
- **THEN** the pack normalizes each target and keeps other shot layers

### Requirement: The layer list
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The layer list `director-177`
- **WHEN** the scene and recipe supply layer lists
- **THEN** the pack combines the lists without duplicate layer IDs

### Requirement: The pack checkpoint
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The pack checkpoint `director-178`
- **WHEN** storage rejects the pack checkpoint
- **THEN** the pack returns checkpoint-failed without a shot change

### Requirement: The pack selection
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The pack selection `director-179`
- **WHEN** the pack completes a change
- **THEN** the pack selects its target scene and selects its first addition when present

### Requirement: The project and controls
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The project and controls `director-180`
- **WHEN** the pack completes a change with the default options
- **THEN** the pack calls the project storage method before updates to both scene controls

### Requirement: The pack notice
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The pack notice `director-181`
- **WHEN** the pack completes a change with notices active
- **THEN** the pack reports the addition total or the patch total

### Requirement: The marker replacement
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The marker replacement `director-182`
- **WHEN** the pack completes a change with an older marker
- **THEN** the pack replaces that marker without a duplicate marker
- **AND** the new marker records the recipe version
- **AND** the pack does not add shots without expansion

### Requirement: The recipe defaults
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The recipe defaults `director-183`
- **WHEN** the director handles the field forms in the default field table
- **THEN** the director uses the corresponding defaults

### Requirement: The title based references
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The title based references `director-184`
- **WHEN** the stored shot reference is absent for a required title
- **THEN** the pack records the ID of its title match

### Requirement: The silent options
The director MUST support the stated shot pack behavior.
Origin: backfill

#### Scenario: The silent options `director-185`
- **WHEN** the caller disables the checkpoint, controls and notice
- **THEN** the pack calls the project storage method without those optional actions

