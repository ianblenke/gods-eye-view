## Context

This change records commit `290b5d2cf65d614e39f42a0b3b24a53fc2514985`.
The scene controller uses the pack owner for shot assets.
It uses the share reader before project replacement.

## Decisions

Tests call public functions with local data and custom sources.
They do not request network data.
The trace gate checks tags and assertion methods.
The coverage gate checks each production file.
The STE gate checks prose and tagged titles.
Host coverage does not give a gate verdict.

The lead runs the ratchet, gates and review.

## Related browser QA scripts

- `scripts/qa-director-packs.mjs` proves pack import, display and resource cleanup.
- `scripts/qa-director-sharing.mjs` proves that an author can share a scene with local assets.

## Evidence

The evidence records test links, scope sweeps and host coverage.
The mutation report records exact changes and failed tests.
The scratch audit records each decision expression.

## Sweep commands

The evidence gives each source command for the ledger, titles, imports, scenarios, coverage and mutation results.
The scratch audit gives the decision totals.
The host uses Node 26.8.2.
The lead checks the gate image before the ledger update.

```sh
cd /home/ianblenke/docker/gev-work/director-3 && python3 /home/ianblenke/docker/gev-tools/director-3/sweep.py
cd /home/ianblenke/docker/gev-work/director-3 && SWEEP_MODE=baseline python3 /home/ianblenke/docker/gev-tools/director-3/coverage.py
cd /home/ianblenke/docker/gev-work/director-3 && python3 /home/ianblenke/docker/gev-tools/director-3/coverage.py
cd /home/ianblenke/docker/gev-work/director-3 && NODE_PATH=/home/ianblenke/docker/gev-work/node_modules node /home/ianblenke/docker/gev-tools/director-3/decisions.cjs
cd /home/ianblenke/docker/gev-work/director-3 && python3 /home/ianblenke/docker/gev-tools/director-3/audit.py
```

## Files

This change adds its proposal, design, tasks, spec and evidence.
It edits `src/director/packs/packs.test.mjs` and `src/director/sharing/sharing.test.mjs`.
It adds `src/director/packs/backfill.test.mjs`.
It does not edit the earlier director changes.
