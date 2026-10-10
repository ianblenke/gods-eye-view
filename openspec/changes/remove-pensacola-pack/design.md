## Source

Base commit: `3d3c1f5e` (main, after the merge of `traffic-timing-child`).
The change `cctv-pensacola` added the pack on 2026-10-09 (main `4f0db4ae`). This change removes every file, entry and requirement of that change, and it leaves the archived change folder as it is.

## Key decisions

### D1: Remove the whole pack

The module, its test, the catalog entry, the settings, the documents and the manifest entries go together. No part stays.
The catalog loads one pack less, and no other pack changes.

### D2: Retire the scenario IDs

The delta spec removes the three requirements. The IDs `live-sources-010` to `live-sources-030` stay in the registry as retired IDs.
The archive does not write `openspec/trace/retired-ids.json`. The lead adds the IDs by hand after the archive, because an ID that is still in a spec makes the gate stop.

### D3: The documents

`CHANGELOG.md` keeps the entry that added the pack and gets a new entry for the removal. The history of the repository stays true.
The CCTV row of `README.md` keeps the text "Up to 4,000 public cameras".

## Files and measures

The change deletes `server/providers/cctv/pensacola.js` and `src/data/cctvPensacola.test.mjs`. It edits `server/providers/cctv/catalog.js`, `scripts/package-boundaries.json`, `scripts/format-scope.json`, `openspec/ownership.json`, `.env.example`, `DATA_SOURCES.md`, `README.md`, `docs/CURRENT-STATE.md`, `CHANGELOG.md` and `openspec/trace/retired-ids.json`.

The trace gate checks that no test and no spec has a retired ID. The ledger gate compares the entry of `catalog.js` with the measured numbers.
The package boundary check and the format check measure the edited configuration. The prose lint checks STE.
The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead removes these sentences from the live-sources Purpose at archive time:
"The capability also has requirements for the Pensacola camera pack. It has requirements for the layer request and the pack settings."
