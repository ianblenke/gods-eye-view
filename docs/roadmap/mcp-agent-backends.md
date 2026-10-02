# MCP agent backends: roadmap spec

Status: draft roadmap. This file is not a gated change. It lives in `docs/` on
purpose. Each step below becomes one change that `/opsx:propose` writes, with
`MUST` requirements and `WHEN`/`THEN` scenarios, as `openspec/config.yaml` needs.
The scenario IDs here are proposed IDs. Tree read: main at 96af7d1.

## Purpose

The owner wants the AI interface to use more than one MCP backend. The first
backend is the MCP server of the OSH SITL drones. The user then gives intent
commands, for example "orbit here" or "what is the fleet battery". The user does
not see the raw MAVLink controls.

## What exists now (read from the code)

- The one AI interface is OpenAI Realtime voice, with a typed text channel. The
  browser talks to OpenAI over WebRTC. `server/providers/openai/realtime.js`
  holds the key and mints an ephemeral secret. It also sends the tool list.
- The tool list is fixed when the session starts, on the server. The browser
  runs the tools. About 30 tools come from `src/voice/actionSchemas.js` and
  `server/providers/openai/tools.js`. `src/voice/gevActions.js` runs them.
- No confirmation step exists in the voice path. Each tool runs at once.
- No MCP client exists. `package.json` has no MCP package.
- No spec covers voice. All files in `src/voice/*` and
  `server/providers/openai/*` are open gaps in `openspec/trace/gaps.json`. A
  change must not make a gap larger. New work goes into new files.
- The OSH control route `/api/control/osh` has these gates in this order: same
  origin, `OSH_CONTROL_ENABLED`, separate control account, 4 KB body limit,
  the fixed command table, the rate limit and the one-in-flight gate, the live
  control stream check, and the audit log. The log line is written before the
  send. The command table has 8 commands. It has no shell command and no
  mission upload.
- The old system allowlist is gone. The only scope is a system that has a
  matching control stream.

## The OSH MCP server: not found

No MCP server for the SITL drones exists in this repo, in the sibling
directories or in the local tool configuration. The assumption of this roadmap:

- The server runs on the OSH host next to the simulator.
- The app reaches it over the network with Streamable HTTP or SSE. Stdio cannot
  cross hosts.
- The server has no authentication or a token.
- The server may talk to MAVLink directly. If so, it bypasses the OSH gates.

The owner must confirm the name, transport, URL, authentication and tool list.
See open question 1.

## WebMCP status

- WebMCP is a W3C Community Group proposal. It is not on a standards track.
- Chrome has `navigator.modelContext` since version 146. The name moves to
  `document.modelContext`. `registerTool` and `unregisterTool` remain.
- WebMCP lets a page offer tools to an agent in the browser. It does not let a
  page use remote MCP servers. That is plain MCP client work.
- The API changed names in three Chrome releases. Treat it as unstable.
- The owner's agent is the Realtime session in the page. WebMCP does not help
  with the drone goal.

## Decision D1: server-side MCP broker

The Node layer gets an MCP broker. WebMCP is a later and optional step.

```
 Browser (same origin)                    Node (Vite middleware)            Outside
 +-------------------------+  WebRTC     +---------------------------+
 | Realtime session        |<----------->| /api/realtime/token       |--> OpenAI
 |  existing GEV tools     |             |  adds tools from broker   |
 |  + prefixed agent tools |  POST       +---------------------------+
 | tool runner ------------+------------>| MCP BROKER (new files)    |
 |                         |  /api/agent | registry, health          |  Streamable
 | plan overlay + CONFIRM  |<--events----| prefix names, classes     |--> HTTP to the
 | STOP / HOLD button      |  /confirm   | pending plans, audit log  |    drone MCP
 | expert OSH panel (kept) |  /stop      |                           |
 +-------------------------+             | existing osh-control.js --+--> OSH
                                         +---------------------------+
```

Reasons:

- Credentials of a backend stay in `.env`, away from the browser.
- The same-origin `/api/*` pattern already exists.
- The OSH gates run on the server and the agent must not go around them.
- The browser is not a trusted party in the control design.

## Backend registry

- The registry is a JSON file. `.env` gives its path. The file is never in the
  repo. Test fixtures are synthetic.
- Each entry has: `id`, `url`, `transport`, `enabled`, `authEnv`, `include`
  and `classes`.
- The broker reads `tools/list` from each enabled backend when a session starts.
- A backend that is down is reported. Its tools are dropped. The session still
  starts.
- `GET /api/agent/backends` shows the health of each backend.
- The broker prefixes each tool name with the backend id, for example
  `drone.takeoff`. A name collision is refused.
- The broker changes each input schema to the Realtime function shape.
- A session has at most 15 backend tools. A lazy `agent_list_tools` tool gives
  the rest.

## Requirements and proposed scenarios

### Broker registry (`mcp-broker`)

The broker must load backends only from the registry file.

- `mcp-broker-001` An unknown field in a registry entry is refused.
- `mcp-broker-002` A backend whose tool list fails is dropped. The session
  still starts.
- `mcp-broker-003` Each tool name has the backend prefix. A collision is refused.
- `mcp-broker-004` The tool count is capped.
- `mcp-broker-005` A disabled backend gives no tools.
- `mcp-broker-006` The health route shows the last result and its time.

### Tools in the session (`mcp-broker`)

- `mcp-broker-010` The session tools include the broker tools of read class.
- `mcp-broker-011` The browser sends a prefixed tool call to the broker.
- `mcp-broker-012` A tool without a class is not callable.

### Safety (`agent-safety`)

The server must enforce each rule. The model and the browser are not trusted.

- `agent-safety-001` A call with no fresh user turn is refused with `no_user_turn`.
- `agent-safety-002` A reversible tool gives a pending plan. The plan runs only
  after a confirm with its plan id.
- `agent-safety-003` A pending plan expires after 30 seconds.
- `agent-safety-004` STOP cancels pending plans and in-flight calls. It does not
  use a model turn.
- `agent-safety-005` The log line is written before the call to the backend. It
  holds no credential and no URL.
- `agent-safety-006` A dangerous tool needs the typed system name.
- `agent-safety-007` A tool result is wrapped as data. Control characters are
  removed. Long strings are cut.
- `agent-safety-008` A backend that has no OSH gates needs its own control flag.

### Intents (`agent-intents`)

- `agent-intents-001` "Look at" gives one command body that the OSH validator
  accepts.
- `agent-intents-002` An absent drone gives `target_absent`.
- `agent-intents-003` "Drone 2" matches a system by its name number.
- `agent-intents-004` A fleet query gives one status for each drone. No status
  is merged.
- `agent-intents-005` A plan draws on the map in a pending style before it runs.

### WebMCP page tools (`webmcp`, optional)

- `webmcp-001` The page registers only read-only tools.
- `webmcp-002` The page registers no `drone.*` tool.
- `webmcp-003` Nothing registers when the flag is off.

## Safety model

1. Tool classes. The registry gives a class to each tool. The default is
   `dangerous`.
   - `read`: battery, position, system list.
   - `reversible`: orbit here, look at a point, hold, at the current altitude.
   - `dangerous`: takeoff, land, disarm, return home, mode change, velocity
     control, mission upload, and each unknown tool.
2. Confirmation. A reversible or dangerous call gives a pending plan. The
   browser draws the plan. The user clicks CONFIRM or CANCEL. This matches the
   two-click step of `osh-control`.
3. User turn rule. Each call carries the last user turn. The server holds a
   token that only a user turn can create. A tool result or a map event cannot
   create it.
4. OSH gates. When an intent becomes an OSH command, the broker calls the same
   `validateCommand`, `createCommandGate` and `runLoggedCommand` code. It does
   not copy it.
5. Audit. The log file is `.gev-logs/agent-calls.jsonl`. A line has: time,
   request id, backend, tool, class, outcome, reason, plan id and a hash of the
   user turn.
6. Prompt injection. Names, telemetry and camera text can carry instructions. The
   session instructions say that a tool result is data. A dangerous tool still
   needs a human click.
7. STOP. A button calls `POST /api/agent/stop` and does not go through the
   model. The broker sends the hold tool of the backend.

## Intent layer

- The drone MCP server gives primitives: go to a point, orbit, look at, return
  home, land, hold and telemetry.
- GEV composes the intent. Only GEV knows the map.
  - "Look at this building": the footprint gives a centre and a standoff point.
  - "Orbit here": a map click or the view target gives the centre.
  - "Drone 2": a match on the system name, as `cameraLink.js` does.
  - "The selected drone": the selected entity gives the system.
- The expert OSH panel stays as the fallback. It shares the audit log.

## Failure modes

- A backend is down: its tools are absent. The model says so.
- A tool is slow: a read call times out at 10 seconds. A command call times out
  at 30 seconds.
- The simulator toggles: drones appear and disappear. The broker resolves the
  target on each call. It gives `target_absent` for a missing drone.
- A fleet result is partial: return one status for each drone.

## Change order (smallest first)

1. `mcp-broker-registry`: registry, health, fake MCP fixture, names, collisions.
   No model and no commands.
2. `mcp-broker-session-tools`: add the read-class tools to the session through a
   new module. The browser forwards through a new `src/voice/agentTools.js`.
3. `agent-plan-confirm`: classes, pending plans, user turn token, audit log, STOP.
4. `agent-osh-intents`: intents that use `osh-control`. The plan overlay.
5. `webmcp-page-tools`: optional and later.

Do not edit `gevActions.js` or `realtime.js`, except one import line if needed.
An edit makes the open gaps grow. Add a group for `mcp-broker` to
`scripts/package-boundaries.json`. CI runs `check:boundaries`. `make gates` does
not run it. Check each change name first.

## Test plan

Use `node:test` and `node:assert`. A fake MCP server is an in-process handler
that speaks JSON-RPC through `fetchImpl`. All ids are synthetic.

| Scenario | Change to the code that must fail a test |
|---|---|
| mcp-broker-003 | Remove the prefix join |
| mcp-broker-004 | Remove the tool cap |
| agent-safety-001 | Remove the user turn check |
| agent-safety-002 | Make confirm ignore the plan id |
| agent-safety-005 | Swap the order of the log and the send |
| agent-safety-007 | Pass the result as text, not as data |

Add one mutation for each part of a compound condition. Compare values with the
literal that the spec names. All new files keep 100% coverage. Run one gates
container at a time.

## Open questions for the owner

1. Which MCP server do the drones have? Give its name, host, transport,
   authentication and tool list. Does it bypass OSH with direct MAVLink?
2. The old allowlist is gone. Does the agent get a narrower set of target
   drones than the expert panel? A name pattern or a list of ids can do this.
3. STOP means hold or return home?
4. Is "reversible" right for orbit and go-to at the current altitude? Or is
   each motion dangerous until real flights show it is safe?
5. What is the tool count limit? Does the app load tools lazily?
6. Does the owner want WebMCP at all? It works only in Chrome and it changes.

## Not verified

No runtime behavior. No server started. No request sent. The existence,
transport and tools of the drone MCP server. The WebMCP claims come from public
pages, not from a Chrome build. No STE lint ran on this file. The lint code reads
only `openspec/` and the process files.

## Sources

- WebMCP explainer: https://github.com/webmachinelearning/webmcp
- Community MAVLink MCP servers: https://github.com/deepak61296/mavlink-mcp and
  https://github.com/ion-g-ion/MAVLinkMCP
