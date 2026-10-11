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

Nothing in the app loads the two folders over HTTP. The voice diagnostics only print the name `.gev-logs/realtime-conversations.jsonl` as a label.

## Known limits and later changes

- Known limit `upstream-line`: Upstream draft pull request #948 and pull request #894 change the same array. A later sync can conflict in this line. Keep the entries of both sides then.
- Known limit `files-stay`: The change stops the development server from serving the folders. The files stay in the project folder, and a program on the host can still read them.
- Known limit `lexical-match`: Vite matches the deny glob against the request path, not against the real file. The server serves a symlink or a hard link in the project folder that points to a protected file. It also serves a file under the `public` folder. The base config does the same. Nothing in the app creates a link or writes under `public`.
- Known limit `older-names`: The deny list leaves some older names open: `.env~`, `ENVIRONMENT.bak`, and the temp files `..env.<8 hex>.tmp` and `.ENVIRONMENT.<8 hex>.tmp` of the credential writer. The temp files exist for a few milliseconds. A later change can add entries for them.
- Known limit `platform`: The probe ran on Linux only. A case-insensitive file system and Windows are not checked.
- Known limit `dist`: Draft #948 also adds an entry for `dist`. This change adds none, because the build output is served on purpose.
