Verdict: FAIL

Commit read: 3abf4d84dc0020a3f53694361fb4a6fecd673a78 (clone gev-work/vite-deny-runtime-state), the diff since 42151bc8 and the changed files in full. "archive" means openspec/changes/archive/2026-10-11-vite-deny-runtime-state/.

- [ ] FINDING major archive/proposal.md:40 (`nested-paths`) "The fault `**/.gev-logs/*` (one star) passes both tests" is false. mutations-run.txt and mutations.txt show that this fault fails `dev-server-files-001`, which pins the entry text. Its note says it "fails only [dev-server-files-001]". Only 002 passes. Write: "The fault `**/.gev-logs/*` (one star) passes `dev-server-files-002`. It fails `dev-server-files-001`, which pins the entry text. `evidence/nested-paths.txt` shows that Vite then loads a file in a subfolder of the log folder." The sentences have 15 and 18 words. The limit then has 6 sentences, at the limit.
- [ ] FINDING major archive/evidence/probe.md:9 "The other 20 paths give the index page on both servers" is false. probe-encodings-output.txt shows 18 of them with HTTP 200 and no canary. The other two give errors on both servers: HTTP 400 for the path ending in `#x` (output file line 22) and HTTP 500 for the path with `%c0%ae` (line 30). Write: "Of the other 20 paths, 18 give HTTP 200 and no canary on both servers, because they do not name a real file. The other two give an error on both servers: HTTP 400 and HTTP 500." I used "HTTP 200 and no canary" and not "index page", because no file says the 18 answers are the index page.
- [ ] FINDING minor archive/proposal.md:30 "The gaps stay at 37 and 13" does not name the metric. Write: "The branch gaps stay at 37 and 13." gaps.json has `branches` 37 for flow.js and 13 for surface.js, and history.jsonl lines 2692 and 2693 show the totals 196 to 198 and 165 to 166.
- [ ] FINDING minor archive/evidence/head-requests.txt:1 gives 2026-10-11T01:33:26Z, and proposal.md:5 says "On 2026-10-10". The folder date is UTC and the lead's date is local. Write "(2026-10-10 in local time)" in the proposal, or say that the file repeats the check.
- [ ] FINDING minor archive/proposal.md:39 (`older-names`) "removes a temp file" is not exact. key-setup.js:230-235 renames it into place or removes it on failure. Write: "renames a temp file to the final name or removes it after a few milliseconds".
- [ ] FINDING minor archive/evidence/mutations.txt:10 The row "Use one star instead of two" is under `dev-server-files-002`, but it fails only `dev-server-files-001`. The note is only in mutations-run.txt. Add the same note to mutations.txt.

I checked these and found them true:
- SECURITY.md line 80 now has sentences of 14 and 17 words.
- Tasks 3.2 and 3.3 have one instruction each.
- The `lexical-match` claim is true. The only `linkSync` is `server/mcp/panelKey.js:103`, both names are in `.gev-cache`, no non-test code creates a symlink, and no write goes under `public`. The Makefile `ln -s` is in the gates container, not the app.
- The 14 faults appear in mutations.txt, mutations-run.txt and the script.
- probe-encodings-output.txt has 39 forms, 19 base leaks and 0 patched leaks.
- nested-paths.txt agrees with its Known limit.
- Design D2 on `fs.strict: false` matches the fault run. I could not read the Vite source to check "Vite allows each file before it reads the list".

The accepted-by-name items are not major: scenario 001 and 002 pin the literal entries and files, so "name the folders" and "available" each have one outcome. The test title "the old files" is true under both readings.
