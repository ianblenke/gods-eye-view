## Context

Upstream main is `fca2c81d8`. The shared ancestor with the fork is `7f2dc81cf`, the last commit of the eleventh sync.

## Decisions

### D1: One merge, plan first

The plan commit comes before the merge commit. The merge uses `git rerere`, so a second merge replays the resolutions.

### D2: One edit of an upstream test

The test `blenderCameraPartialWrite.test.mjs` runs a child process with a file size limit of 32 KiB. The child inherits the coverage folder, and the limit cuts its coverage file. Then the coverage merge of the gate stops with a JSON error. The change gives that child an empty `NODE_V8_COVERAGE`, so it writes no coverage file. The retry of the same test still measures the tool.

## Risks

A change to the renderer ports or the layer tokens by upstream can break the fork layers. The tasks check this after the merge.
