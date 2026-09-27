## Why

The OpenSensorHub server of the owner has ArduPilot SITL drones. A MAVSDK driver publishes the telemetry of each drone, and the OSH layer shows it. The video datastreams of the drones send no frames. The owner reports that a drone starts its camera only when it flies. No part of this project can tell a drone to fly.

The Connected Systems API of OSH carries commands to a system. A client sends one command as a POST request to the commands path of a control stream. The driver then gives the command to the drone as a MAVLink message.

Today the OSH provider sends only GET requests, by design. The scenarios `osh-004`, `osh-005` and `osh-006` make this rule. The OSH account in `.env` can create and delete streams on a real server. So a defect or a bad test must never send a request that changes the server.

This change adds one narrow path for commands, apart from the OSH provider. The path is off by default, and it uses a separate account that cannot delete. The GET-only rule of the OSH provider stays as it is.

## What Changes

- Add the capability `osh-control` in new files. No new file is in the set that `osh-005` scans (design D1).
- Add the flag `OSH_CONTROL_ENABLED`. The command route stays off unless the flag has the exact value `true` (D2).
- Add a separate command account, `OSH_CONTROL_USERNAME` and `OSH_CONTROL_PASSWORD`. The owner makes this account on the server, and it cannot delete (D8). The route stays off when this account has the user name of `OSH_USERNAME`.
- Add the target allowlist `OSH_CONTROL_TARGETS`. Each entry pairs one system with one of its control streams. Only `.env` holds the real identifiers (D3).
- Send a command only as a POST to one path template, `controlstreams/<id>/commands`, for a control stream of the allowlist. A test scans the new files and proves that no file names DELETE, PUT or PATCH (D1, D10).
- Accept only a command that the command table names, with the fields and value ranges of the table. Refuse each other command, key and value (D4).
- Show a command block in the camera panel for a system of the allowlist. The browser sends a command only after a second click on a confirmation step (D5).
- Limit the rate of commands for each system and for all systems together. Use the rate limiter of `server/providers/common/rate-limit.js` (D6).
- Write each command request to a command log, sent or refused. The log never holds a credential, a URL or a raw request body (D7).

### The scope of this round

This round writes only this proposal and the design. The command schema of the server is unknown, because the server refuses each read of a control stream. The known limit `control-streams-unreadable` gives the facts. So this round writes no spec, no task list, no test and no code.

A later round of this same change adds the spec, the tasks, the tests and the code. It starts when the discovery step D9 records the schema. The lead does not merge or archive this change with documents only. A change with no spec and no task list is not complete under the steps of `AGENTS.md`. The decisions D1 to D8 do not depend on the schema, so one review can then read them together with the spec.

## Capabilities

### New Capabilities

- `osh-control`: send a command from an allowlist to a control stream from an allowlist, on the OpenSensorHub server. The capability has a separate account, a flag, a confirmation step, a rate limit and a command log.

### Modified Capabilities

None. The scenarios `osh-004`, `osh-005` and `osh-006` keep their text and their tests. D1 gives the reason.

## Impact

This round:

- Adds `proposal.md` and `design.md` to `openspec/changes/osh-mavlink-control/`. It changes no code, no test, no spec and no configuration file.
- Opens no gap and closes no gap in `openspec/trace`. It changes no file of the ledger.

The later round, as the design plans it:

- New server files: `server/providers/osh-control.js` and five files in `server/providers/osh-control/`. Each new file has full coverage.
- New browser files: `client.js` and `view.js` in `src/layers/oshControl/`. Each new file has full coverage.
- Changed files: `server/providers/local.js`, `src/layers/osh/index.js`, `src/app/layers/osh.js`, `src/ui/templates/context.html`, `src/ui/styles/osh-panel.css`, `.env.example` and `scripts/package-boundaries.json`.
- The later round writes new code only. It uses no `adopt` entry, and it expects no waiver.

## Known limits and later changes

- `control-streams-unreadable`: this blocker stops the later round. These are the facts:
  - On 2026-09-27 the lead read the server with GET requests only, with the approval of the owner.
  - The lead used two different accounts. One account can create and delete. The owner calls the second account an admin account.
  - Both accounts read the system list with no error.
  - Both accounts got `403 Permission denied` for each read of the control streams of a system. This was true for each system that the lead tried.
  - A read of the control stream collection with no system answered `400`. That response tells nothing about the cause.
  - Two accounts fail in the same way, so the cause is probably on the server and not in the credentials. The server possibly has no control stream for these systems, or it does not expose them.
  - The owner examines the admin console of the server. The next step is the GET-only discovery of D9.
- `command-schema-unknown`: the names, the types and the value ranges of the command fields are unknown. This round does not guess them. So no scenario can name an exact command body yet, and this round has no `tasks.md` and no `specs/`.
- `command-account-unconfirmed`: the command account does not exist yet. D8 lists the rights that the account needs and the rights that it must not have. No command code uses any account before the owner confirms that list.
- `osh-005-stays`: no OSH scenario changes. Two new scenarios of `osh-control` give the proof in place of an edit to `osh-005`. The first scans the new files for the one POST call site and for the names of the other methods. The second proves that no file of the `osh-005` set imports a new file.
- `osh-005-text-and-test`: the text of `osh-005` names `server/providers/common/http.js`. Its test also reads `src/sources/httpBody.js`, since the upstream merge. This change does not edit `osh-005`. The later round must not put a POST helper in either file, because `osh-005` scans both.
- `osh-034-test-count`: the test of `osh-034` pins the number of OSH test files at 18. It counts each test file whose name starts with `osh`, and each test file in a folder named `osh`. So no new test file has such a name or such a folder. The new capability gets its own scenario for fixture addresses.
- `lan-exposure`: the app container listens on each network interface, and Vite then accepts each host name. A host on the local network can send a request to the command route when the flag is on. D11 refuses a request from the page of another site, but a direct HTTP client can send any header. The flag and the published port of the container are the guards against that client.
- `confirmation-stops-clicks-only`: the confirmation step stops a wrong click in the page. It does not stop a script that calls the route. The guards on the server are the flag, the targets, the command table and the rate limit.
- `branch-base`: this branch starts from `main` at `9ee5019`. Before the later round writes the spec, it rebases on `main` and reads `osh-005`, `osh-006` and `osh-034` again.
