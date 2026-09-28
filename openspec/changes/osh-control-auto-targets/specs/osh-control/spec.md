## MODIFIED Requirements

### Requirement: Route conditions
The command route MUST use the flag, URL, and command account at request time.
Origin: spec-first

#### Scenario: Keep the route off without the exact flag `osh-control-001`
- **WHEN** `OSH_CONTROL_ENABLED` is absent, empty, `1`, `yes`, or `TRUE`
- **THEN** the targets route answers `200` with `{enabled:false, reason:'control_off', commands:{}}`
- **AND** the commands route answers `403` with `{error:'control_off'}`
- **AND** the route sends no upstream request

#### Scenario: Refuse the same command account `osh-control-002`
- **WHEN** the command user name and `OSH_USERNAME` are equal after white space removal and a case fold
- **THEN** the commands route answers `403` with `{error:'same_account'}`
- **AND** the route sends no upstream request

#### Scenario: Refuse absent route inputs `osh-control-003`
- **WHEN** the flag is `true`, but the URL is invalid or an account field is absent
- **THEN** the route gives `no_key` or `no_account`, in that order
- **AND** the route sends no upstream request

### Requirement: Target allowlist
The route MUST check the real server for the one system id the browser names, and resolve a real command through its schema name.
Origin: spec-first

This change retires `osh-control-004` and `osh-control-005`. The route no longer parses a list of system ids from `.env`, so a bad or a repeated entry in one cannot occur.

#### Scenario: Resolve a command by schema name `osh-control-006`
- **WHEN** a system has control streams with schemas that name commands in `parametersSchema.name`
- **THEN** the route maps each matching command name to that stream id for the process lifetime
- **AND** the route gives `command_not_found` when no schema name matches the requested command

#### Scenario: Refuse a malformed system id `osh-control-033`
- **WHEN** the commands route or the targets route gets a `system` value that does not match `OSH_ID_PATTERN`
- **THEN** the route refuses it with `bad_body`
- **AND** the route sends no upstream request

This change retires `osh-control-030`. The targets route no longer gives one static table for a fixed list. It now gives a live answer for one system, in `osh-control-034` and `osh-control-035`.

#### Scenario: Give the live command list for one system `osh-control-034`
- **WHEN** the flag is `true` and the targets route gets a system id of the right shape
- **THEN** the route reads that system's real control streams and their schemas
- **AND** it answers `200` with `{enabled:true, reason:null, commands:{...}}`, one entry for each table command a real control stream of that system supports
- **AND** a system with no matching control stream gets an empty `commands` object, not an error

#### Scenario: Give upstream_failed when the control-stream read fails `osh-control-035`
- **WHEN** the targets route gets a system id of the right shape, but the control-stream read of that system fails
- **THEN** it answers `200` with `{enabled:true, reason:'upstream_failed', commands:{}}`

### Requirement: Command table and validator
The route MUST accept only the eight table commands and the exact fields and values of each command.
Origin: spec-first

#### Scenario: Refuse a bad body `osh-control-007`
- **WHEN** the body is not one JSON object of at most 4096 bytes with exactly `system`, `command`, and `parameters`
- **THEN** the route refuses it with `bad_body`

This change retires `osh-control-008`. The route no longer keeps a system list, so it no longer refuses a system for being outside one.

#### Scenario: Refuse a command outside the table `osh-control-009`
- **WHEN** the body names a command that is not an own key of `OSH_CONTROL_COMMANDS`
- **THEN** the route refuses it with `unknown_command`

#### Scenario: Refuse a bad parameter object `osh-control-010`
- **WHEN** `parameters` has an extra field, an absent field, a wrong type, or a non-object value
- **THEN** the route refuses it with `bad_parameter`

#### Scenario: Refuse a number outside its range `osh-control-011`
- **WHEN** a number field is not finite or is outside its inclusive `min` and `max`
- **THEN** the route refuses it with `bad_parameter`
- **AND** the route does not change text into a number

This change retires `osh-control-012`. The first command table has no `token` field, so no test can check a `token` rule. A later table adds this scenario back, with its own test, when a command needs one.

#### Scenario: Refuse a value that is not a boolean `osh-control-013`
- **WHEN** a boolean field has a value other than `true` or `false`
- **THEN** the route refuses it with `bad_parameter`

#### Scenario: Refuse a field absent from the schema `osh-control-014`
- **WHEN** a table field of a command has no field with the same name in its resolved schema
- **THEN** the route refuses the command with `schema_mismatch`

#### Scenario: Keep the eight exact command definitions `osh-control-015`
- **WHEN** a test reads the own keys and fields of `OSH_CONTROL_COMMANDS`
- **THEN** it finds exactly the commands and fields in this table
- **AND** it finds no `mavShellControl`

| Command | Fields |
| --- | --- |
| `mavEnableLocationControl` | `EnableLocationControl`: boolean |
| `mavControl` | `Latitude`: number -90..90 deg; `Longitude`: number -180..180 deg; `AltitudeAGL`: number 1..120 m; `returnToStart`: boolean; `hoverSeconds`: number 0..600 s; `heading`: number 0..360 deg |
| `offboardControl` | `vx`: number -10..10 m/s; `vy`: number -10..10 m/s; `vz`: number -5..5 m/s; `yawRate`: number -90..90 deg/s |
| `mavRTLControl` | `rtl`: boolean |
| `mavTakeoffControl` | `TakeoffAltitudeAGL`: number 1..120 m |
| `mavPauseMissionControl` | `Resume`: boolean |
| `mavFlightModeControl` | `FlightMode`: number 0..25 |
| `mavLandingControl` | `disarm`: boolean |
