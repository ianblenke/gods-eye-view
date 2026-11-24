## Context

Upstream main is `fca2c81d8`. The shared ancestor with the fork is `7f2dc81cf`, the last commit of the eleventh sync.

## Decisions

### D1: One merge, plan first

The plan commit comes before the merge commit. The merge uses `git rerere`, so a second merge replays the resolutions.

## Risks

A change to the renderer ports or the layer tokens by upstream can break the fork layers. The tasks check this after the merge.
