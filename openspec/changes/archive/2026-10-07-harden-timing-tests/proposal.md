## Why

A chance test failure stops a gates run under the rule in `AGENTS.md` about command output.
The phase3-analysis.md records failures under simultaneous container load.
The lead must repeat the gates run when a test fails by chance.

Evidence command: inspect the phase3-analysis.md with `cat` and search the container logs with `rg` for `TRACE-FAILED-TEST`.
Base commit 290b5d2; later merges of main do not change the 17 test files.

## What Changes

Replace short real timer margins in test files with mock clocks or promises for the required events.
Keep each assertion, test title and scenario tag.
Use a longer timer margin only when the test needs a real clock.
Measure each file before and after the test changes under the same load.
Check each changed test against a production mutation in a separate copy.

No specs delta; the lead archives with `--skip-specs`.
The change adds no requirement and no scenario.

## Impact

The change edits test files and the change directory only.
The change edits no production file and no scenario text.
The change must not reduce covered production lines.
The ratchet command changed the ledger by one line.
The branch total of `server/providers/cctv/stream.js` rises from 135 to 136.
The uncovered counts of that file stay at 22 lines, 18 branches and 4 functions.

## Known limits

The host runtime differs from the image runtime.
The lead checks the complete gates in the image.
A clean local measurement does not prove the cause of a failure in the container logs.
The process limit has priority over load when launcher children need Node.
Synchronous source checks and surface identity checks need no timer change without a timer fault.
The design lists the real delays and the later changes.

- `remaining-inequalities`: The controller stop test keeps the mock-Date inequality below 250 ms; its assertion that stop() returns true carries the proof.
  The mock clock fixes the elapsed value, so the inequality cannot fail.
  The nominatim stalled-body test keeps the real-clock inequality below 5000 ms for its 300 ms deadline.
- `poll-timer-unasserted`: The cctvHlsStream test does not assert that pollTimer is defined.
  If production renames entry.timer, cleared.includes(undefined) can still pass.
- `exact-elapsed-constants`: The cctvProxy, gbfsProxy and requests elapsed assertions equal their clock steps by construction.
  No production change can make those elapsed assertions fail; the signal assertions carry the proof.
- `evidence-outside-repo`: The evidence files are outside the repository.
  The directory is `/home/ianblenke/docker/gev-tools/harden-timing/`.
  Files: `prompt-1.md`, `audit.md`, `before.md`, `after.md`, `coverage.md`, `mutation-specs.json` and `round2-*.log`.
  The file `phase3-analysis.md` is in `/home/ianblenke/docker/gev-tools/docker-concurrency/`.
