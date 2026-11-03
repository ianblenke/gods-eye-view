## Why

This backfill records the share codec at commit `5fd416b9ed4a80c9a1ceeded81836aa69f3ebc0c`.
Share links carry a camera, entity, style, layers and panels without a server.
The permanent format keeps old links valid.

## What Changes

- Add the `share-codec` capability.
- Add scenario tags and tests in `src/share/`.
- Check decisions, keys and operands with mutations.

## Capabilities

### New Capabilities

- `share-codec`: Compact bytes, view state, follow geometry, legacy conversion and link paths.

### Modified Capabilities

None.

## Impact

This change targets each ledger gap for the five scope modules.
The baseline evidence records the ledger entries and old test names.
The change keeps production code and QA scripts unchanged.
New test files keep the upstream class of their adjacent modules.
The lead runs the ratchet, gates and formal reviews.

## Measured impact

The baseline ledger records 59 old tests and coverage gaps in the scope modules.
This change tags 58 old names and leaves the banned old title without a tag.
The design and evidence name the coverage limits.
The measurement command supplies these values.

```bash
cd /home/ianblenke/docker/gev-work/sharecodec && python3 /home/ianblenke/docker/gev-tools/sharecodec/measure.py
```
