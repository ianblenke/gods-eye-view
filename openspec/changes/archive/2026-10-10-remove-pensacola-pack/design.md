## Source

Base commit: `3d3c1f5e` (main, after the merge of `traffic-timing-child`).
The change `cctv-pensacola` (archive date 2026-10-09) added the pack to main `4f0db4ae`. This change removes the files, the catalog entry, the settings, the pack text of the documents, the manifest entries and the requirements of that change. It leaves the archived change folder and the add entry of `CHANGELOG.md` as they are.

## Key decisions

### D1: Remove the whole pack

The module, its test, the catalog entry, the settings, the manifest entries and the pack text of the documents go together. Only the history stays: the add entry of `CHANGELOG.md` (see D3), the archived change folder and the trace records.
The catalog loads one pack less, and no other pack changes.

### D2: Retire the scenario IDs

The delta spec removes the three requirements. The IDs `live-sources-010` to `live-sources-030` go into `openspec/trace/retired-ids.json`, and their 21 entries stay in `openspec/trace/ids.json` until a later ratchet drops them.
The archive does not write `openspec/trace/retired-ids.json`. The lead adds the IDs by hand after the archive, because an ID that is still in a spec makes the gate stop.
The ratchet ran before the archive, so `openspec/trace/links.json` holds 21 empty links of these IDs. The lead removes these 21 lines by hand, because `make gates-docs` stops on them.

### D3: The documents

`CHANGELOG.md` keeps the entry that added the pack and gets a new entry for the removal. The history of the repository stays true.
The CCTV row of `README.md` keeps the text "Up to 4,000 public cameras".

## Files and measures

The change deletes `server/providers/cctv/pensacola.js` and `src/data/cctvPensacola.test.mjs`. It edits `server/providers/cctv/catalog.js`, `scripts/package-boundaries.json`, `scripts/format-scope.json`, `openspec/ownership.json`, `.env.example`, `DATA_SOURCES.md`, `README.md`, `docs/CURRENT-STATE.md`, `CHANGELOG.md`, `openspec/trace/retired-ids.json` and `openspec/trace/links.json`.

The trace gate checks that no test and no spec has a retired ID. The ledger gate compares the entry of `catalog.js` with the measured numbers.
The package boundary check and the format check measure the edited configuration. The prose lint checks STE.
The lead runs the gates in Docker and both review agents on the final tree.

## Purpose at archive time

The lead removes these sentences from the live-sources Purpose at archive time:
"The capability also has requirements for the Pensacola camera pack. It has requirements for the layer request and the pack settings."
