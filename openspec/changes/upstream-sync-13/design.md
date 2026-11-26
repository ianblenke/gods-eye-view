## Context

Upstream main is `7646568a9`. The shared ancestor with the fork is `fca2c81d8`, the last commit of the twelfth sync.

## Decisions

### D1: One merge, plan first

The plan commit comes before the merge commit.

## Risks

An upstream change to a shape that a fork test reads can break the test. The tasks check this after the merge.
