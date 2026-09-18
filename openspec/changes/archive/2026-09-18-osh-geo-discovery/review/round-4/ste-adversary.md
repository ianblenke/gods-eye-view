**Round 4, STE adversary — osh-geo-discovery.** Confirmation pass against the merged tree, HEAD `b959c05`, with the change archived at `openspec/changes/archive/2026-09-18-osh-geo-discovery/`. Read-only.

**1. The catch comment, `src/layers/osh/index.js:406-412`.** Both faults are gone. The referent points the right way — "The code that can throw … runs after that check." Every sentence is one idea and active; the em-dash in sentence 3 only names the two referents, so it does not carry a second idea. No metaphor, no "now". The absolute is no longer false: the conclusion is chained off a stated premise ("A production record is parsed JSON data"), so a reader sees exactly what the claim rests on and what would break it. That is the right shape for an invariant. Only residue: "in that region" leans on the preceding sentence for its referent — minor, and I am not reopening it.

**2. "point" to "station".** Clean in both files. `design.md:3` and `proposal.md:5` now read "the stations of a radio mesh. Each station is a feature of interest with a `Point`." The dropped noun after "Each" is restored in both. No "point" in the mesh-site sense survives in either file; every remaining `Point` is the GeoJSON geometry.

One note, no action needed: the Radio layer uses "station" for an internet radio stream, so "radio mesh" and "station" sit near each other in the repository's wider vocabulary. But "station" appears nowhere in `openspec/specs/`, and these two documents never mention the Radio layer, so nothing is ambiguous where it is read.

**3. `index.js:22` JSDoc.** "the entity it moves" — correct. Two "marker" uses remain in the OSH scope, `openspec/specs/osh/spec.md:198` and its archived copy, both the same "one marker row" line in the row-terminator sense agreed to stay. None in the entity sense anywhere in the layer, its tests, or its specs.

`341e299`'s own message is active, has verbs throughout, and names what changed and why in three plain paragraphs.

All three edits are right, and nothing I raised is left open.

Verdict: PASS
