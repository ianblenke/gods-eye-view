Verdict: FAIL

Commit read: 42151bc8ac9074ca28dcf847c76b8f6819be90ae (clone gev-work/vite-deny-runtime-state). "archive" means openspec/changes/archive/2026-10-11-vite-deny-runtime-state/. I found no banned word or form in the new prose or the test titles.

- [ ] FINDING major archive/proposal.md:36 (`lexical-match`) "Nothing in the app creates a link or writes under `public`" is false. `server/mcp/panelKey.js:103` runs `fs.linkSync(tmp, file)`. That call makes a hard link from a temp file to `.gev-cache/mcp-panel-key`. No other `linkSync` or `symlink` call exists in `server/`, `src/`, `build/` or `scripts/` (grep). Both names are in `.gev-cache`, so the new entry denies them and the risk is small. Write: "The app creates one hard link: `server/mcp/panelKey.js` links a temp file to `.gev-cache/mcp-panel-key`, and both names are in `.gev-cache`. Nothing else in the app creates a link or writes under `public`." The two sentences have 19 and 12 words. The paragraph then has 6 sentences, at the limit. I did not search the repo for writes under `public` outside `server/`.
- [ ] FINDING major archive/tasks.md:16 (3.2) "Run the named faults of the deny list and write `evidence/mutations.txt`" gives two instructions. Write two tasks: "3.2 Run the named faults of the deny list." and "3.3 Write `evidence/mutations.txt` with the result of each fault." Then renumber 3.3 to 3.7. The tasks have 8 and 11 words.
- [ ] FINDING minor SECURITY.md:80 The new sentence has 31 words (limit 25). Write: "The development server refuses to serve the folders `.gev-logs/` and `.gev-cache/` (see `server.fs.deny` in `build/vite.js`). So a computer on the network cannot download the voice conversation log or the OSH command log." The sentences have 15 and 17 words.
- [ ] FINDING minor archive/evidence/probe.md:25 "The two new entries hold against every form above" is false for the symlink, hard link and `public` forms in the same file. Write: "The two new entries hold against every request form for the two folders."
- [ ] FINDING minor archive/evidence/mutations.txt The scenario 001 lists five old entries, but only three have a fault (`.env.*`, ENVIRONMENT, .git). Add faults for the entries `.env` and `*.{crt,pem}`.
- [ ] FINDING minor archive/specs/dev-server-files/spec.md:5 "MUST keep the files of the app available" is vague. Write: "MUST allow the files of the app, such as `package.json` and `src/main.js`". The scenario 002 pins the same two files, and the change needs a new ratchet, so the lead may accept it by name.
- [ ] FINDING minor src/tooling/devServerFiles.test.mjs:7 The title says "the old files", and the test checks five old entries. Write "the old entries". This needs a new ratchet, so the lead may accept it by name.
- [ ] FINDING minor CHANGELOG.md:3 The date (2026-10-10) differs from the folder date (2026-10-11). Confirm which one is meant.

These claims are true:
- The claim that nothing in the app loads the two folders over HTTP is true: the only hit in `src/` is the label in `realtimeDiagnostics.js:205`. The other hits are file-system paths.
- The log file names are in `debug-log.js:80` and `osh-control/log.js:32`.
- The temp name is at `key-setup.js:198`.
- The deny list is only in `build/vite.js`.
- The Purpose equals design.md.
- The test is in the manifest, and `build/vite.js` is not.
- The 39 forms in probe-encodings.txt are 39.

I could not check these claims:
- The Vite matcher option `nocase`: the agent reports say it, and the clone has no node_modules.
- The sizes 1,724,319 and 608 bytes.
- The pull requests #948 and #894.
- Behaviour on Windows.
