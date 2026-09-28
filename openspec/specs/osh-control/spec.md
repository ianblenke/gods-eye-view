# osh-control Specification

## Purpose
Let the owner send one table command to one real drone system of the OpenSensorHub server. The owner does this from the camera panel, after a second click of confirmation. Keep this path off unless the owner sets a flag and a separate command account. Refuse every command and every system id that the table and a live schema check do not both name exactly. Log each command, sent or refused, without a credential.
## Requirements
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

#### Scenario: Resolve a command by schema name `osh-control-006`
- **WHEN** a target has control streams with schemas that name commands in `parametersSchema.name`
- **THEN** the route maps each matching command name to that stream id for the process lifetime
- **AND** the route gives `command_not_found` when no schema name matches the requested command

#### Scenario: Refuse a malformed system id `osh-control-033`
- **WHEN** the commands route or the targets route gets a `system` value that does not match `OSH_ID_PATTERN`
- **THEN** the route refuses it with `bad_body`
- **AND** the route sends no upstream request

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

### Requirement: OSH layer command view
The OSH layer MUST call an optional command view at selection, deselection, and destruction.
Origin: spec-first

#### Scenario: Show the view for a selected system, with its name `osh-control-031`
- **WHEN** the owner selects a system, and a command view is present
- **THEN** the layer calls the view's `show` method with the system id and its name
- **AND** a system with no held record uses the name of its location, or its id if neither name exists
- **AND** the layer calls the view's `clear` method at deselection and at `destroy()`
- **AND** a layer with no command view selects and destroys the same as before

#### Scenario: Build a real command view only when the page has its host `osh-control-032`
- **WHEN** the application builds the OSH layer, and the page has an element with the id `osh-panel-control`
- **THEN** the layer gets a command view built from that element, the browser client, and the page's own document
- **AND** the application builds the layer with no command view when that element is absent

### Requirement: Command rate limit
The route MUST limit commands by system id and across all systems.
Origin: spec-first

#### Scenario: Enforce the minute limits `osh-control-018`
- **WHEN** a system has four commands or all systems have eight commands in a 60 second window
- **THEN** the next command gets `429`, `Retry-After: 60`, and `{error:'rate_limited'}`

#### Scenario: Keep one command in flight for each system `osh-control-019`
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

