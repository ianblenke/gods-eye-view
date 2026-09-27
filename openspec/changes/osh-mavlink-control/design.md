## Context

The OpenSensorHub server of the owner has ArduPilot SITL drones. A MAVSDK driver publishes the telemetry datastreams of each drone. The OSH layer shows that telemetry, and the camera panel shows the video of a fixed camera. The video datastreams of the drones send no frames. The owner reports that a drone starts its camera only when it flies, and no part of this project can tell a drone to fly.

MAVLink is the message protocol of the drones. The Connected Systems API of OSH carries messages in two directions. A system can have control streams. A client sends one command as a POST request to `controlstreams/<id>/commands`. The driver then gives the command to the drone as a MAVLink message.

The OSH provider sends only GET requests. `osh-004` records each upstream call as a GET with no body. `osh-005` scans the provider files for the names of the other methods, for a request body and for the word `send`. `osh-006` answers `405` for each browser request that is not a GET. The reason is the account: the account in `.env` can create and delete streams on a real server.

A second rule of the project limits the design. No tracked file holds a host name, a system id, a stream id, a count or a place name of the owner's server. Each fixture is synthetic.

The read-only discovery of 2026-09-27 found a blocker. No account can read a control stream today, so the command schema is unknown. The proposal gives the facts in `control-streams-unreadable`. This design stays abstract where it depends on the schema, and D9 gives the next step.

## Goals / Non-Goals

**Goals:**

- Let the owner send an allowlisted command to an allowlisted drone from the camera panel, after a confirmation step.
- Keep the command path off unless the owner sets a flag and a separate command account.
- Prove with a scan of the source that no code of the capability sends DELETE, PUT or PATCH.
- Record each command request, sent or refused, with no credential.

**Non-Goals:**

- Change `osh-004`, `osh-005` or `osh-006`, or make them weaker for any path.
- Send a POST from a file of the OSH provider.
- Send a POST to any path other than the commands path of an allowlisted control stream.
- Send a command from a test or from CI. Each test uses a fake fetch and a fake environment object, and no test reads `.env`.
- Keep the command account anywhere but `.env`. No test, fixture, log line or response holds it.
- Accept a free text field, a list, a nested object or a command that the command table does not name.
- Send a command again after a failure or a timeout. The owner decides each command.
- Plan a mission, change a parameter that the drone stores, or clear the memory of the drone.

## Decisions

### D1 New files outside the scan of `osh-005`

The capability gets its own files, and no new file is in the set that `osh-005` scans. That set has `server/providers/osh.js` and each file directly in `server/providers/osh/`. It also has each `src/data/osh*.js` file, `server/providers/common/http.js` and `src/sources/httpBody.js`.

The new server files:

- `server/providers/osh-control.js`: the plugin `oshControlProxy()`. It installs the routes under `/api/control/osh` on the dev server and the preview server.
- `server/providers/osh-control/post.js`: the only upstream call site of the capability. `oshPostCommand()` sends one POST request and no other method.
- `server/providers/osh-control/url.js`: the URL builders and their safety checks, for the command path and the two reads of D3 and D4.
- `server/providers/osh-control/targets.js`: reads the flag, the command account and the target allowlist.
- `server/providers/osh-control/commands.js`: the command table and its validator.
- `server/providers/osh-control/log.js`: the command log.

The new browser files:

- `src/layers/oshControl/client.js`: the GET of the targets and the one same-origin POST of the browser.
- `src/layers/oshControl/view.js`: the command block and the confirmation step.

The folder names keep the new files out of the two patterns that `osh-005` discovers. So the pinned counts of `osh-005` stay five and six. The hyphen in `osh-control` also keeps the new server files apart from `osh.js` and `osh/` when a person reads a path. The new server files import `oshGet()`, `createOshBase()` and `OSH_ID_PATTERN` from the OSH provider, and they change no file of it.

The alternative is an exception inside `osh-005`. The requirement "GET only" says that the provider sends only GET requests, through one file. An exception needs new text for that requirement, and new requirement text rehashes each scenario under it. So `osh-004`, `osh-005` and `osh-006` all change. The exception also puts the POST call site in the same files as the account that can delete. The chosen design keeps the old rule true, word for word, and adds a second rule next to it.

The mount path `/api/control/osh` shares no prefix with `/api/osh`. So the rule of `osh-006` for each sub-path of `/api/osh` holds with no argument. A POST to any sub-path of `/api/osh` still answers `405`.

Two new scenarios of `osh-control` give the proof in place of an edit to `osh-005`:

- A scan of the new files, with comments removed. Only `post.js` calls `fetch` or `fetchImpl`, one time, with the method `'POST'`. No new file has `delete`, `put` or `patch` as a quoted string, in any letter case. No new file calls `WebSocket`, or imports `node:http`, `node:https`, `undici` or `ws`. The browser `client.js` is the one exception to the first rule: it has one `fetch` call to the fixed same-origin path.
- A boundary scan. No file of the `osh-005` set imports `server/providers/osh-control.js` or a module of `server/providers/osh-control/`. Only `server/providers/osh-control.js` imports `post.js`.

Rule 13 of `AGENTS.md` needs a mutation for each test. For the two scans, the mutations are these. Change `'POST'` to `'PUT'` in `post.js`. Add a second `fetchImpl(` call to `targets.js`. Add an import of `post.js` to `server/providers/osh.js`. Each mutation must make one of the two scans fail.

### D2 The flag and the conditions of the route

The flag is `OSH_CONTROL_ENABLED`. Only the exact text `true` enables the route. An absent value, an empty value, `1`, `yes` and `TRUE` all leave the route off. The route reads the flag and the other values at request time, as the OSH provider does for `osh-003`.

The route is on only when each of these conditions is true:

- The flag has the value `true`.
- `OSH_URL` parses as a URL.
- `OSH_CONTROL_USERNAME` and `OSH_CONTROL_PASSWORD` are both set.
- The command user name is not the user name in `OSH_USERNAME`. The route compares the two names after it removes white space, with no regard to letter case.
- `OSH_CONTROL_TARGETS` parses with one or more entries (D3).

When one condition is false, the route is off. It then gives a fixed reason code: `control_off`, `no_key`, `no_account`, `same_account`, `no_targets` or `bad_targets`. A reason code never holds a value from `.env`.

When the route is off, it sends zero upstream requests. `GET /api/control/osh/targets` answers `200` with `{enabled:false, reason, targets:[]}`. `POST /api/control/osh/commands` answers `403` with `{error:<reason>}`, and it writes one log line with the outcome `refused` (D7).

### D3 The target allowlist

The format of the value is a comma list of pairs:

```
OSH_CONTROL_TARGETS=<system-id>:<controlstream-id>,<system-id>:<controlstream-id>
```

Each pair is one target. Each id must match `OSH_ID_PATTERN` of `server/providers/osh/ids.js`, the pattern of `osh-020`. The pattern has no `:` and no `,`, so a separator cannot occur inside an id.

The parser removes white space at the two ends of each entry. When one entry is bad, the parser refuses the full list with the reason `bad_targets`. Its warning names only the position of that entry. When a system id occurs two times, the parser also refuses the full list.

Each system has one control stream in the list. D9 can show that a drone has more than one control stream. The later round then changes this format in its spec, before it writes code.

The browser never sends a control stream id. It sends a system id, and the server finds the paired control stream in the list. The targets route answers the system ids of the list, and for each one the commands of the table (D4). It never answers a control stream id.

Before the first command to a target, the server reads the record of the control stream with one GET. The read goes through `oshGet()` with the command account. The server refuses the target, with the reason `target_mismatch`, when the record does not name the paired system as its parent. D9 records the field that names the parent. The server keeps the result for each target until the process stops.

The repository holds no real id. `.env.example` shows the format only with the placeholder `<system-id>:<controlstream-id>` in a comment. Each new key in `.env.example` has an empty value. Each test fixture uses ids that start with `sys-fixture-` or `cs-fixture-`.

### D4 The command table

`commands.js` holds the frozen table `OSH_CONTROL_COMMANDS`. Each entry names one command. For each field of that command, the entry gives the type and the allowed values. This example shows the shape with placeholder names only, because D9 has not found the real names:

```js
export const OSH_CONTROL_COMMANDS = Object.freeze({
  '<command-a>': { fields: {} },
  '<command-b>': {
    fields: { '<field-x>': { type: 'number', min: 0, max: 100, unit: 'm' } },
  },
  '<command-c>': {
    fields: { '<field-y>': { type: 'token', values: ['<value-1>', '<value-2>'] } },
  },
});
```

The validator applies these rules. The first rule that fails gives the reason code.

- The body is one JSON object of at most 4096 bytes, with exactly the keys `system`, `command` and `parameters`. Else the reason is `bad_body`.
- `system` names a target of D3. Else the reason is `not_a_target`.
- `command` is an own key of the table. Else the reason is `unknown_command`.
- `parameters` is an object with exactly the fields of that command, with no extra key and no absent key. Else the reason is `bad_parameter`.
- A `number` field takes a finite number from `min` to `max`, both included. The validator never changes a text into a number.
- A `token` field takes one text of its `values`, in the same letter case.
- A `boolean` field takes `true` or `false` only.

No other field type exists in the first table. The server builds the upstream body from the table and the checked values, in the shape that D9 records. It never copies an object from the browser into the upstream body.

The table holds names only. It never holds a definition URN with the vendor segment of the owner's server. When the upstream body needs such a URN, the server reads it from the schema at run time. Before the first command to a target, the server reads the schema of the control stream with one GET. It refuses the command, with the reason `schema_mismatch`, when a table field of that command has no field of the same name in the schema.

The table starts empty. So the route refuses each command with `unknown_command` until the later round adds entries. The owner selects the first entries after D9. Probable candidates are the MAVLink commands for arm, takeoff to a height, land and return. The table never holds a command that changes a stored parameter, clears a mission or restarts the drone.

### D5 The confirmation step in the camera panel

The command block extends the camera panel, `aside#osh-panel` in `src/ui/templates/context.html`. The template gets one new element, `<div id="osh-panel-control" hidden>`, after `#osh-panel-detail`. `osh-094` stays true, because each of its three ids is still on one element.

`view.js` exports `createOshCommandView({host, client, documentImpl})`. The view has two methods, `show({systemId, systemName})` and `clear()`. The OSH layer gets one optional input, `commandView`. The layer calls `show()` at each change of the selected system, and `clear()` when the selection ends or at `destroy()`. With no `commandView`, the layer does the same as before.

The scenario for this input is in `osh-control`, and no OSH scenario changes. If a review wants it in the `osh` spec, it goes there as an ADDED requirement, never as a MODIFIED one.

`show()` reads the targets route, which sends no upstream request. When the route answers `enabled:false`, or the system is not a target, the view keeps the host hidden. Otherwise, the block shows one button for each command of the table. It also shows one input for each field, with the range or the values that the targets route gives.

A click on a command button sends nothing. It opens the confirmation step in the block. The step shows the name and the id of the system, the command, and each value with its unit. It has two buttons, "Send command" and "Cancel". The focus goes to "Cancel", so the Enter key does not send the command.

Only a click on "Send command" calls the POST of `client.js`. The block then disables each button until the response arrives. It then shows the outcome: sent, refused with its reason, or failed. The step closes after "Cancel", after a new selection, after `clear()`, or 30 seconds after it opens. The view has no option to send a later command with no confirmation.

### D6 The rate limit

The route calls `makeRateLimiter()` from `server/providers/common/rate-limit.js`, which exports it from `src/sources/rateLimit.js`. The plugin makes one limiter for each plugin instance:

```js
const allow = makeRateLimiter({ windowMs: 60_000, max: 4, globalMax: 8 });
```

The key of the limiter is the system id of the target, not the client address. The risk of a command is a risk to one drone, and `globalMax` limits all drones together. The route writes `clientKey(req)` to the command log only.

The route applies its checks in this order. First come the method, the origin check of D11, and the conditions of D2. Then come the validator rules of D4, in their order. Then come the rate limit and the check for one command in flight. Last come the two reads of D3 and D4 for a new target, the `accepted` log line and the POST. So a bad body never uses the budget of a drone.

Over the limit, the route answers `429` with `Retry-After: 60` and `{error:'rate_limited'}`, as `firePerimeters.js` does. It also writes a `refused` log line.

The route allows one command in flight for each system. A second request for a system with an open upstream call gets `409` with `{error:'busy'}`. So a double click cannot send two commands.

`makeRateLimiter()` reads `Date.now()` itself and takes no clock. So a test of the window needs the `Date` mock of `mock.timers` in `node:test`.

### D7 The command log

The log is the file `.gev-logs/osh-commands.jsonl` under the source root. `.gitignore` and `.dockerignore` already name `.gev-logs/`, so git never tracks the log. The log follows `server/providers/openai/debug-log.js`: one chain of appends, and one old generation `.1`. The file rotates at 4 MiB.

The log has one JSON line for each event. A refused request gives one line with the outcome `refused`. An accepted request gives a line `accepted` before the POST, and a line `sent` or `failed` after the response. The same `requestId`, a random UUID, links the two lines.

Each line has these fields:

- `time`: the time of the event, in ISO 8601 UTC.
- `requestId` and `outcome`: `accepted`, `sent`, `refused` or `failed`.
- `reason`: a fixed reason code, or null.
- `client`: the value of `clientKey(req)`.
- `system`: the system id when it matches the id pattern, else null.
- `controlStream`: the control stream id of a target, else null.
- `command` and `parameters`: a name from the table and the checked values, else null.
- `upstreamStatus` and `durationMs`: numbers, or null.

A line never holds the `Authorization` header, a user name, a password, the value of `OSH_URL` or any URL. It never holds the raw request body, a browser text that failed a check, or the upstream response body.

The log holds real system ids and control stream ids. So the lead never copies a line of it into a commit, a report or an issue.

When the route cannot write the `accepted` line, it sends no command. It answers `500` with `{error:'log_failed'}`. So no command goes to the server without a log line.

### D8 The command account

The owner makes a new OSH account for commands only. The owner matches each item below to the names that the admin console of the server shows. This design does not guess those names.

The account must have these rights:

- Read the system list. The root probe of `server/providers/osh/base.js` reads `systems?limit=1`.
- Read the control streams of each target system, and the record of each target control stream.
- Read the command schema of each target control stream.
- Create a command on each target control stream. This is the POST.
- Read the commands and their status on a target control stream. This right is optional, for a later status display.

The account must not have these rights:

- Delete any resource: a system, a datastream, a control stream, an observation, a command, a feature or a user.
- Create or change a system, a datastream, a control stream or a feature.
- Write an observation.
- Manage users, roles, server modules or the configuration of the server.
- Send a command to a control stream that is not a target, when the server can limit an account to single control streams.

An account with the right to delete also got `403` for each control stream read. So on this server, the right to delete does not include the right to read control streams, or the control streams do not exist. If the server cannot give the rights above without the right to delete, the later round does not start. The owner then decides again.

### D9 The next discovery step

The lead does these steps in one session, after the owner reports that the server exposes the control streams. Each request is a GET.

1. Ask the owner to confirm that the command account exists with the rights of D8.
2. Make sure that `.env` has `OSH_CONTROL_USERNAME` and `OSH_CONTROL_PASSWORD`. Report only their presence and their length.
3. Keep `OSH_CONTROL_ENABLED` absent from `.env` for the full session.
4. Send each request from a shell with the command account, not from the app.
5. Write each measured value only in the notes of the lead, outside the repository.
6. Read `systems/<system-id>/controlstreams` for one SITL system. Expect `200` and a list.
7. If the response is `403` again, stop the session and tell the owner.
8. Record the field names of one item, and the number of control streams of that system.
9. Read `controlstreams/<controlstream-id>` for each control stream. Record the field that names the parent system.
10. Read `controlstreams/<controlstream-id>/schema`, the same path shape as the schema read of `osh-053`.
11. Record each field of the schema: its name, type, unit, allowed values or range, and whether it is optional.
12. Read `controlstreams/<controlstream-id>/commands?limit=1`. An old command, if one exists, shows the body that the server keeps.
13. Read the list of step 6 again with the account of `OSH_USERNAME`. Record whether that account now gets `200`.
14. Send no POST in this session.
15. Write the command table of D4 with the owner. Then write `specs/osh-control/spec.md` and `tasks.md`.

Step 13 tells whether the old `403` came from the rights of the account or from absent control streams. The first real command comes only after the gates and the two reviews pass. The owner sends it from the panel, and watches the SITL console.

### D10 The upstream POST

`oshPostCommand(fetchImpl, url, {headers, body})` is the one upstream call site of the capability. It sends the method `'POST'` with `redirect: 'manual'`. Its `Content-Type` is the command format that D9 records. It uses the timeout `OSH_REQUEST_TIMEOUT_MS` of `get.js`, 15 seconds, and it reads at most 64 KiB of the response body.

A response with a status from 300 to 399 is a failure, as `osh-013` says for `oshGet()`. The function never tries a second time, never shares one request between two callers, and keeps no cache. A timeout does not tell whether the server received the command. So the route answers `failed` with `upstreamStatus:null`, and the owner decides the next command.

`oshCommandUrl(root, controlStreamId)` builds the root path plus `controlstreams/<id>/commands`, with no query. `assertCommandUrl()` throws for another origin, prefix, path or query. It also throws for a user name, a password or a fragment, as the checks of `osh-021` and `osh-064` do. The two reads of D3 and D4 get the same pair of a builder and a check.

The route finds the API root with its own `createOshBase()` from `server/providers/osh/base.js`, with the command account. The probes are GET requests. The route shares no state with the OSH provider.

The route answers the browser only with `{outcome, reason, upstreamStatus, requestId}`. It never answers the upstream response body.

### D11 The origin check

The app container runs Vite with `HOST=0.0.0.0`, and it publishes the port on each interface. `build/vite.js` then accepts each host name. So the page of another site in the browser of the owner can send a request to the route. A host on the local network can also send one.

The command route refuses a POST with `403` and `{error:'cross_origin'}` unless these conditions are true:

- The `Host` header names `localhost`, an IP address, or a name that ends in `.local`.
- The `Origin` header is present, and it equals the scheme and the value of the `Host` header.
- The `Content-Type` is `application/json`.

The first condition stops a page of another site whose domain name points to the address of this machine. That page sends its own domain name in `Host`. The second condition stops a page of another origin. A direct HTTP client can send any header, so the flag and the published port are the guards against it (the known limit `lan-exposure`).

### D12 How the gates measure the later round

Coverage: each new file has full line, branch and function coverage. Each branch that the change adds to a changed file has a test. The later round adds no ledger entry.

Trace: each test names the `osh-control` scenario IDs that it checks, at most three for each test. No new test file has a name that starts with `osh`, and no new test file is in a folder named `osh`. So the pinned count of `osh-034` stays at 18. The proposed test files are `src/control/route.test.mjs`, `src/control/scan.test.mjs`, `src/control/table.test.mjs`, `src/control/log.test.mjs`, and two test files in `src/layers/oshControl/`.

STE lint: the lint reads the proposal, this file, the tasks, the delta spec and each tagged test name. Boundaries: `scripts/package-boundaries.json` gets a new group for the server files of the capability.

Mutations: each test task in `tasks.md` names the change to the code that must make its test fail. D1 names the mutations of the two scans.

No test sends a request to a real server. Each test gives a fake `fetchImpl` and a fake environment object to the plugin.

### Files

New, in the later round: `server/providers/osh-control.js`, `server/providers/osh-control/post.js`, `server/providers/osh-control/url.js`, `server/providers/osh-control/targets.js`, `server/providers/osh-control/commands.js`, `server/providers/osh-control/log.js`, `src/layers/oshControl/client.js`, `src/layers/oshControl/view.js`, the test files of D12, `openspec/changes/osh-mavlink-control/tasks.md` and `openspec/changes/osh-mavlink-control/specs/osh-control/spec.md`.

Changed, in the later round: `server/providers/local.js`, `src/layers/osh/index.js`, `src/app/layers/osh.js`, `src/ui/templates/context.html`, `src/ui/styles/osh-panel.css`, `.env.example` and `scripts/package-boundaries.json`.

Changed in this round: only this file and `proposal.md`.

## Risks / Trade-offs

1. **A pair in `.env` names the control stream of a different system.** Guard: the parent check of D3, before the first command to that target.
2. **The schema on the server changes after the table exists.** Guard: the schema check of D4, before the first command to a target in each process.
3. **The command account has more rights than D8 lists.** No code can find this. The scan and the allowlists limit what the code sends, not what the account can do. The owner examines the account against D8.
4. **A timeout hides whether the command arrived.** The route answers `failed` and never tries again. The owner reads the telemetry before the next command.
5. **A double click sends two commands.** Guard: one command in flight for each system (D6), and the disabled buttons (D5).
6. **The registry test of `credential-boundary` stops the build for `OSH_CONTROL_PASSWORD`.** That test fails for a credential name that no file documents. Guard: `.env.example` documents the new key, with an empty value.

## Open Questions

- Which commands, fields and value ranges does the first command table hold? The owner decides after D9.
- Can the OSH server limit an account to named control streams, or only to types of resources?
- Does the owner open the app from another machine? If not, the compose file can publish the port on `127.0.0.1` only while the flag is on.
- Does a drone have more than one control stream? D3 allows one control stream for each system.
- Does the server answer a POST with the id of the command or a status link? If so, a later change can show the status in the panel.
- Are four commands for each system and eight commands in total, for each minute, the correct limits for the owner?
