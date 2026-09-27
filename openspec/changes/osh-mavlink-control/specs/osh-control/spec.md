## ADDED Requirements

### Requirement: Route conditions
The command route MUST use the flag, URL, command account, and target list at request time.
Origin: spec-first

#### Scenario: Keep the route off without the exact flag `osh-control-001`
- **WHEN** `OSH_CONTROL_ENABLED` is absent, empty, `1`, `yes`, or `TRUE`
- **THEN** the targets route answers `200` with `{enabled:false, reason:'control_off', targets:[]}`
- **AND** the commands route answers `403` with `{error:'control_off'}`
- **AND** the route sends no upstream request

#### Scenario: Refuse the same command account `osh-control-002`
- **WHEN** the command user name and `OSH_USERNAME` are equal after white space removal and a case fold
- **THEN** the commands route answers `403` with `{error:'same_account'}`
- **AND** the route sends no upstream request

#### Scenario: Refuse absent route inputs `osh-control-003`
- **WHEN** the flag is `true`, but the URL is invalid, an account field is absent, or the target list is empty
- **THEN** the route gives `no_key`, `no_account`, or `no_targets`, in that order
- **AND** the route sends no upstream request

### Requirement: Target allowlist
The route MUST use a full, valid list of unique system ids. It also gives the static command table for each valid target, and resolves a real command through its schema name.
Origin: spec-first

#### Scenario: Refuse one bad target id `osh-control-004`
- **WHEN** one entry of `OSH_CONTROL_TARGETS` does not match `OSH_ID_PATTERN` after white space removal
- **THEN** the route refuses the full list with `bad_targets`
- **AND** the warning names only the position of the bad entry

#### Scenario: Refuse a repeated target id `osh-control-005`
- **WHEN** two entries of `OSH_CONTROL_TARGETS` name the same system id
- **THEN** the route refuses the full list with `bad_targets`

#### Scenario: Resolve a command by schema name `osh-control-006`
- **WHEN** a target has control streams with schemas that name commands in `parametersSchema.name`
- **THEN** the route maps each matching command name to that stream id for the process lifetime
- **AND** the route gives `command_not_found` when no schema name matches the requested command

#### Scenario: Give the static command list for each valid target `osh-control-030`
- **WHEN** the flag is `true` and the targets route answers a request
- **THEN** it answers `200` with `{enabled:true, targets:[{system, commands}]}`, one entry for each system id of the list
- **AND** `commands` is the same 8-command table of the requirement below, for every system
- **AND** the route reads no control stream to build this answer

### Requirement: Command table and validator
The route MUST accept only the eight table commands and the exact fields and values of each command.
Origin: spec-first

#### Scenario: Refuse a bad body `osh-control-007`
- **WHEN** the body is not one JSON object of at most 4096 bytes with exactly `system`, `command`, and `parameters`
- **THEN** the route refuses it with `bad_body`

#### Scenario: Refuse a system outside the target list `osh-control-008`
- **WHEN** the body names a system that is not in the valid target list
- **THEN** the route refuses it with `not_a_target`

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

`osh-control-012` is retired. The first command table has no `token` field, so no test can check a `token` rule. A later table adds this scenario back, with its own test, when a command needs one.

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

### Requirement: Confirmation step
The command view MUST send a command only after a second click on `Send command`.
Origin: spec-first

#### Scenario: Confirm before the browser sends a command `osh-control-016`
- **WHEN** the owner first clicks a command button for a target system
- **THEN** the view sends no command and shows the system, command, values, units, and two action buttons
- **AND** the view puts focus on `Cancel`
- **AND** only a click on `Send command` sends the command

#### Scenario: Close a confirmation without a command `osh-control-017`
- **WHEN** the owner clicks `Cancel`, changes the system, clears the view, or waits 30 seconds
- **THEN** the view closes the confirmation and sends no command

### Requirement: Command rate limit
The route MUST limit commands by system id and across all systems.
Origin: spec-first

#### Scenario: Enforce the minute limits `osh-control-018`
- **WHEN** a system has four commands or all systems have eight commands in a 60 second window
- **THEN** the next command gets `429`, `Retry-After: 60`, and `{error:'rate_limited'}`

#### Scenario: Keep one command in flight per system `osh-control-019`
- **WHEN** a second command arrives for a system with an open upstream command call
- **THEN** the second command gets `409` with `{error:'busy'}`
- **AND** the route sends no second upstream command

### Requirement: Command log
The route MUST log each refused request and each accepted command without sensitive values.
Origin: spec-first

#### Scenario: Record sent and refused commands `osh-control-020`
- **WHEN** the route refuses a request or sends a command
- **THEN** a refusal has one `refused` line
- **AND** a sent command has one `accepted` line and one `sent` or `failed` line with the same `requestId`
- **AND** no line holds a credential, URL, raw request body, rejected browser text, or upstream body

#### Scenario: Stop a command when the log fails `osh-control-021`
- **WHEN** the route cannot write the `accepted` line
- **THEN** it answers `500` with `{error:'log_failed'}`
- **AND** it sends no upstream command

### Requirement: Separate command call site
The new files MUST keep the command POST outside the `osh-005` scan set.
Origin: spec-first

#### Scenario: Scan the new call sites `osh-control-022`
- **WHEN** a test scans the new files after it removes comments
- **THEN** only `post.js` has one upstream `fetchImpl` call with method `POST`
- **AND** `client.js` has one browser `fetch` call to the fixed same-origin path
- **AND** no new file names `DELETE`, `PUT`, or `PATCH` as a quoted method
- **AND** no new file calls `WebSocket` or imports `node:http`, `node:https`, `undici`, or `ws`

#### Scenario: Keep imports outside the old scan set `osh-control-023`
- **WHEN** a test scans imports of each file in the `osh-005` scan set
- **THEN** no file in that set imports a new command file
- **AND** only `server/providers/osh-control.js` imports `post.js`

### Requirement: Command URL and upstream result
The route MUST send commands to the checked commands path and return only a small result to the browser.
Origin: spec-first

#### Scenario: Build the command URL without a query `osh-control-024`
- **WHEN** `oshCommandUrl` gets an API root and a control stream id
- **THEN** it builds only `controlstreams/<id>/commands` below that root with no query

#### Scenario: Reject an unsafe command URL `osh-control-025`
- **WHEN** `assertCommandUrl` gets another origin, prefix, path, query, user name, password, or fragment
- **THEN** it throws an error

#### Scenario: Return only the command result fields `osh-control-026`
- **WHEN** the upstream server answers a command request
- **THEN** the browser receives only `outcome`, `reason`, `upstreamStatus`, and `requestId`
- **AND** the browser receives no upstream response body

#### Scenario: Fail for a redirect or timeout `osh-control-027`
- **WHEN** an upstream POST gets a status from 300 to 399 or reaches its 15 second timeout
- **THEN** the route reports `failed` without a second POST
- **AND** a timeout has `upstreamStatus:null`

### Requirement: Same-origin command request
The route MUST refuse a POST unless the host, origin, and content type pass the origin check.
Origin: spec-first

#### Scenario: Refuse a cross-origin POST `osh-control-028`
- **WHEN** `Host` is not localhost, an IP address, or a `.local` name, or `Origin` is absent or differs from the host scheme and value
- **THEN** the route answers `403` with `{error:'cross_origin'}`

#### Scenario: Refuse a POST without JSON content type `osh-control-029`
- **WHEN** `Content-Type` is not `application/json`
- **THEN** the route answers `403` with `{error:'cross_origin'}`
