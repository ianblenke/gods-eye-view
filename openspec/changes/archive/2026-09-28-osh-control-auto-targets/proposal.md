## Why

The merged `osh-control` capability needs a system id in `OSH_CONTROL_TARGETS`, and a redeploy, before the owner can send a command to a new drone. The owner wants the app to find a valid target on its own, from the real server, with no list to edit and no redeploy.

## What Changes

- **BREAKING**: remove `OSH_CONTROL_TARGETS` and its parser. The `.env` file no longer names a system.
- **BREAKING**: remove the `not_a_target` refusal reason and the fixed-list check that gives it.
- The route accepts a system id from the browser, then checks the real server. The route checks whether that system has a control stream whose schema matches the wanted command. A match lets the command proceed. No match gives `command_not_found` or `schema_mismatch`, the same reasons the merged design already uses for a bad target.
- The targets route (`GET /api/control/osh/targets`) changes from one static answer for a fixed list to a live answer for the one system the browser names.
- The command table (D4 of the merged design), the confirmation step, the rate limit, and the command log stay as they are.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `osh-control`: the target requirement no longer names a fixed list of system ids in `.env`. It now checks the real server live, for the one system id the browser sends.

## Impact

- Changes `server/providers/osh-control/targets.js`, `server/providers/osh-control.js`, `server/providers/osh-control/commands.js`, `src/layers/oshControl/{client,view}.js`.
- Retires scenarios `osh-control-004`, `osh-control-005` (both test the removed list parser) and `osh-control-008` (`not_a_target`).
- Retires `osh-control-030` too, and replaces it with `osh-control-034` and `osh-control-035`. The targets route now reads the real server, for the one system asked about, not a fixed list.
- Removes `OSH_CONTROL_TARGETS` from `.env.example`.
- Opens no gap in `openspec/trace`. Every changed file keeps full line, branch and function coverage.

## Known limits and later changes

- No code in this app stops a system the owner never meant to expose from matching a table command by schema name alone. The schema-name match is now the only gate that decides which system gets through; no owner-typed list decides this anymore. The command table stays narrow: 8 commands, none of them the shell command or a mission upload. The confirmation step still needs a second click, and the command log still records every attempt.
- The route now reads a system's control streams and schemas live on each selection. The old design proved the fixed table needed no GET; this change removes that property on purpose. A per-system cache limits this to one round trip per system for the life of the process.
