## Why

The development server of the app serves files from the project folder. The deny list in `build/vite.js` names `.env`, `.env.*`, `*.{crt,pem}`, `**/.git/**` and `**/ENVIRONMENT`. It does not name the folders `.gev-logs` and `.gev-cache`.

On 2026-10-10 the lead sent HEAD requests to the running app container. The container answered `/.gev-logs/realtime-conversations.jsonl` (1,724,319 bytes) and `/.gev-logs/osh-commands.jsonl` (608 bytes) with HTTP 200.
The server listens on all addresses of the host. So any computer on the network can download the voice conversation log and the command log of the OSH layer. The lead read no content.

## What Changes

- Add the entries `**/.gev-logs/**` and `**/.gev-cache/**` to `server.fs.deny` in `build/vite.js`.
- Add the test file `src/tooling/devServerFiles.test.mjs` with two tests. Add it to `openspec/ownership.json` and `scripts/format-scope.json`.
- Add the capability `dev-server-files` with one requirement and two scenarios.
- Write one sentence in `SECURITY.md` and one entry in `CHANGELOG.md`.

## Capabilities

### New Capabilities

- `dev-server-files`: The requirement "The development server refuses runtime state files" with the scenarios `dev-server-files-001` and `dev-server-files-002`.

### Modified Capabilities

None.

## Impact

Rule 23: the test file is a file that the fork writes, so it goes into `openspec/ownership.json`. The file `build/vite.js` is upstream code and stays out of the manifest.
The change edits one array of `build/vite.js`. The line runs in every test that builds the browser config, so each changed line has coverage. The change opens no coverage gap.

The file `openspec/trace/history.jsonl` also records new branch totals for `src/layers/traffic/flow.js` (196 to 198) and `src/layers/traffic/surface.js` (165 to 166). This change does not edit these files. The gaps stay at 37 and 13.

Nothing in the app loads the two folders over HTTP. The voice diagnostics only print the name `.gev-logs/realtime-conversations.jsonl` as a label.

## Known limits and later changes

- Known limit `upstream-line`: Upstream draft pull request #948 and pull request #894 change the same array. The new sentence in `SECURITY.md` and the new entry at the top of `CHANGELOG.md` are also in upstream files. A later sync can conflict in these places. Keep the entries of both sides then.
- Known limit `files-stay`: The change stops the development server from serving the folders. The files stay in the project folder, and a program on the host can still read them.
- Known limit `lexical-match`: Vite matches the deny glob against the request path, not against the real file. The server serves a symlink or a hard link in the project folder that points to a protected file. It also serves a file under the `public` folder. The base config does the same. The app creates one hard link, in `server/mcp/panelKey.js`, and both of its names are in `.gev-cache`. Nothing in the app creates a symlink or writes under `public`.
- Known limit `older-names`: The deny list leaves some older names open: `.env~`, `ENVIRONMENT.bak`, and the temp files `..env.<8 hex>.tmp` and `.ENVIRONMENT.<8 hex>.tmp` of the credential writer. The writer removes a temp file after a few milliseconds, and a crash can leave one. A later change can add entries for them.
- Known limit `nested-paths`: The test of `dev-server-files-002` uses files one level below each folder. The fault `**/.gev-logs/*` (one star) passes both tests, and `evidence/nested-paths.txt` shows that Vite then loads a file in a subfolder of the log folder. The entry in the code uses two stars, so the code is correct. A later change can add a file in a subfolder to the scenario.
- Known limit `scripts-as-text`: The files `mutations-script.txt`, `nested-paths.txt`, `probe-server.txt` and `probe-encodings.txt` hold scripts as text. No gate measures them.
- Known limit `platform`: The probe ran on Linux only. A case-insensitive file system and Windows are not checked.
- Known limit `dist`: Draft #948 also adds an entry for `dist`. This change adds none, because the build output is served on purpose.
