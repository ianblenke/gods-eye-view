## Why

A chance test failure stops a complete gates assessment under the rule in `AGENTS.md` about command output.
The supplied experiment records failures under simultaneous container load.
The lead must repeat the complete assessment when a test fails by chance.

Evidence command: inspect the supplied experiment with `cat` and search the supplied logs with `rg` for `TRACE-FAILED-TEST`.
Tree commit from `git rev-parse HEAD`: `290b5d2cf65d614e39f42a0b3b24a53fc2514985`.

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
Its uncovered counts stay at 22 lines, 18 branches and 4 functions.

## Known limits

The host runtime differs from the image runtime.
The lead checks the complete gates in the image.
A clean local measurement does not prove the cause of a failure in the supplied logs.
The process limit takes precedence over load when launcher children need Node.
Synchronous source checks and array identity checks need no timer change without a timer fault.
The design lists the real waits and the later changes.
