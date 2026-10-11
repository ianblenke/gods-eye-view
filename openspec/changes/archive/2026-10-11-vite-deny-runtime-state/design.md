## Context

Base commit: `6e54707e` (main, after the merge of `upstream-sync-5`).
Vite denies a file when a glob of `server.fs.deny` matches its full path. The deny list in `build/vite.js` is the only protection for files in the project folder.
The server writes the log files `.gev-logs/realtime-conversations.jsonl` and `.gev-logs/osh-commands.jsonl`, and many cache files under `.gev-cache`. The MCP panel key is `.gev-cache/mcp-panel-key`.

## Decisions

### D1: The form of the entries

The entries use the form of the existing entry `**/.git/**`. The prefix `**/` matches the folder at any depth, and the suffix `/**` matches every file in it.
An entry without the suffix, such as `**/.gev-logs`, matches the folder name only. It does not match the files, so the test of `dev-server-files-002` must fail for it.

### D2: Two tests

The test of `dev-server-files-001` reads the list. It pins the new entries and the five old entries.
The test of `dev-server-files-002` resolves the browser config with a scratch root and asks Vite itself, with `isFileLoadingAllowed`, whether it loads a file. So the test shows that the glob matches the paths that the server serves, and not only that the list holds a text.

The fault run shows the difference. For the two faults that deny too much, only `dev-server-files-002` fails. For the fault `fs.strict: false`, only `dev-server-files-002` fails, because Vite allows each file before it reads the list.

### D3: What the change leaves out

The change adds no entry for `dist`. The preview server and the build serve `dist` on purpose.
The change does not move the log files or change the places where the code writes them.

## Files and measures

The change edits `build/vite.js`, `SECURITY.md`, `CHANGELOG.md`, `openspec/ownership.json` and `scripts/format-scope.json`. It adds the test file and the evidence.

The trace gate checks that the tests carry the IDs `dev-server-files-001` and `dev-server-files-002`. The format check measures the edited files. The prose lint checks STE.
The named faults measure whether a change of the deny list makes a test fail. The lead also sends requests to a scratch server that uses the new config.
The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead sets this Purpose at archive time:
"Keep the log folder and the cache folder away from the development server. The deny list of the server names both folders."
