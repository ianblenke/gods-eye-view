## Context

The merged `osh-control` design (D3) reads `OSH_CONTROL_TARGETS`, a comma list of system ids, once at server start. A system must be in this list before the route will resolve or send a command to it. Adding a drone needs an edit to `.env` and a redeploy.

The owner runs the app and the OpenSensorHub server. The owner wants the route to check the real server for each system the browser asks about, with no list to edit.

## Goals / Non-Goals

**Goals:**

- Remove the fixed list and its parser. The route checks the real server instead.
- Keep every other guard: the flag, the separate command account, the command table, the confirmation step, the rate limit, and the command log.
- Give the browser only the commands that a system's real control streams support, so the panel never offers a command the server will refuse.

**Non-Goals:**

- This change does not add a new command to the table (D4 of the merged design stays as it is).
- This change does not change how the route finds the control stream of a matched command (D3's schema-name match stays as it is).
- This change does not let the browser send an arbitrary system id with no shape check. A string that does not match `OSH_ID_PATTERN` still fails before any GET.

## Decisions

### D1 Drop the list, keep the shape check

`server/providers/osh-control/targets.js` drops `parseTargets` and the `systems` field of `routeConfig`. `routeConfig` still checks the flag, the URL, the account fields, and the same-account rule; it stops there. No entry in `.env.example` names a system.

`commands.js`'s `validateCommand` drops its `targets` parameter and the `not_a_target` check. It gains one new check, first in its order: `body.system` must match `OSH_ID_PATTERN`. A string of the wrong shape gets the reason `bad_body`, the same reason an ill-formed body already gets. This is a shape check, not an allowlist; it costs no GET.

### D2 The targets route takes a system id

`GET /api/control/osh/targets` gains one required query value, `system`. The route reads it, checks its shape, then asks which of the 8 table commands a real control stream of that system supports. It answers `{enabled, reason, commands}`.

- `enabled:false` when the flag or the account fields are wrong (`control_off`, `no_key`, `no_account`, `same_account`), `commands` empty. This half is unchanged from the merged design.
- `enabled:true, reason:'bad_body'` when `system` is missing or the wrong shape, `commands` empty.
- `enabled:true, reason:'upstream_failed'` when the server rejects or fails the control-stream read for that system, `commands` empty.
- `enabled:true, reason:null, commands:{...}` on a real check, with one entry for each table command that system's control streams support. `commands` can be empty; a system with no matching control stream gives an empty object, not an error.

The route never lists every system. It answers only for the one the browser names.

### D3 One resolve call finds every command of a system

D3 of the merged design's `resolveCommand(system, command)` reads a system's control streams once. It matches each one's schema name against the table, and caches the whole map for the life of the process. This change adds `resolveTargets(system)`, which builds the exact same map and returns it whole, instead of one entry. `resolveCommand` becomes a lookup in that same cached map. The two share one cache and one GET for each system.

The cache does not tell the schema-mismatch check of D4 (the merged design) that it can skip its own work. That check still runs before every POST, because the schema on the server can change after the map is built.

### D4 The confirmation panel reads the live answer

`src/layers/oshControl/client.js`'s `targets()` method takes a system id and builds the query string. `view.js`'s `show({systemId, systemName})` reads `result.commands` directly. It no longer searches a list for a matching entry. A system with an empty `commands` object keeps the host hidden, the same behaviour a system outside the old fixed list once got.

## Risks / Trade-offs

1. **A system the owner never meant to expose gets a control stream that matches a table command.** No code in this app can stop this. The schema-name match is now the only gate on which system, not an owner-typed list. Mitigation: the command table itself is narrow (8 commands, none of them the shell command or a mission upload). The confirmation step still needs a second click, and the command log still records every attempt.
2. **A GET on every selection.** Each time the owner selects a system in the panel, the route reads that system's control streams and schemas live. The merged design's `osh-control-030` proved the old targets route made no GET; this change removes that property on purpose. Mitigation: the per-system cache (D3) means only the first selection of a system pays the full cost within one process life.
3. **A malformed or unknown system id now reaches a real GET.** A syntactically valid id that names no real system still costs one round trip before the route learns this. Mitigation: `upstream_failed` and an empty `commands` answer are the same low-cost response the browser already handles for a system with no match.

## How the gates measure this change

Coverage: every file this change touches keeps full line, branch and function coverage. The scan of `osh-005` (D1 of the merged design) is unaffected; this change touches no file in that set.

Trace: `osh-control-004` and `osh-control-005` are retired, because the list parser they test no longer exists. `osh-control-008` is retired, because `not_a_target` no longer exists. `osh-control-030`'s scenario text changes, because its own claim (no GET) is now false on purpose. New scenarios cover the shape check of D1, the per-system answer shape of D2, and the shared-cache and schema-mismatch behaviour of D3.

No test sends a request to a real server. Each test gives a fake `fetchImpl` and a fake environment object, as the merged design's own tests do.
