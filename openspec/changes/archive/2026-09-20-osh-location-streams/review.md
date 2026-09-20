# Review: osh-location-streams

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-19
Gates: make ratchet CHANGE=osh-location-streams passed; make gates pending this file
Rounds: 1
Scope: full
Reviewed-Tree: 4b4398f12a21cf20b202db1562a96ebf45265e25b76ef218fbb2b08e1869227a

Both agents returned `Verdict: PASS`. Their full output is in
`review/spec-adversary.md` and `review/ste-adversary.md`.

## What the review found

**One real defect: `osh-029`.** Its scenario carried "and none for a system
with no `Point`" byte-identical from `main`, while `osh-042` and `osh-057` in
the same delta place a system with no `Point` from a fresh stream location —
this change's own headline behaviour. A contradiction between scenarios, not
a silence. Fixed at `5d86da4`, qualified the way `osh-042`'s own clause
reads, and `placed` was added to the `getStats()` enumeration the same
scenario had omitted.

**Four more test gaps, each closed with a mutation-verified test**, in
`review/spec-adversary.md`'s findings:

- `osh-046` pinned `keyRequired` for the features read and never for the
  locations read — a spec gap as well as a test gap. Fixed at `87e602c`.
- `osh-057` asserted `getStats().placed.stream` by name with nothing pinning
  it; a mutation counting every placed system survived. Fixed at `87e602c`.
- `src/data/oshSystems.js:136` looked up a location's feature by `foiId`
  when present, else by `foiUid`, so a location with an unheld `foiId`
  alongside a held `foiUid` was dropped, where `osh-042` says it moves.
  Fixed at `85c4a27`. The obvious test proved nothing under the old code;
  the discriminating one asserts the moved coordinate.
- The coverage gate itself found one more, mid-review: a branch in the
  `osh-057` counter fix from earlier the same night had no test of its own.
  Closed at `702e61e`.

**One reported mutant was equivalent, not a gap**, and no test is owed for
it: `src/layers/osh/index.js:402`'s label-fallback ordering cannot be killed
by any input, because the one record shape that reaches it always has a null
`name`. The genuine precedence gap was a different line, `effectiveName` at
`:139`, and that one is fixed and pinned.

**Seven findings were withdrawn.** All were raised from a copy of the tree at
`7a78a88`, predating three commits' worth of fixes already on this branch,
or (one case) investigated and confirmed not a defect. Each is named in
`review/spec-adversary.md` with what was claimed and why it does not stand
at `0e44403` or later.

**21 ASD-STE100 findings, all corrected**: 8 blockers and 13 minors, spanning
`proposal.md`, `design.md`, `tasks.md`, `specs/osh/spec.md`,
`server/providers/osh.js`, and 5 test names. The largest pattern was
`stale` used for the freshness condition where this project already spells
`stale` as the cache flag of `osh-022`/`osh-023` — corrected to "not fresh"
everywhere it had drifted, in the contract and outside it. Full detail,
line by line, is in `review/ste-adversary.md`.

**The STE reviewer corrected its own round-1 count** of the `passes`→`is
green` drift: it claimed nine occurrences, the true number was twelve. All
twelve are fixed. A count in a review is a claim like any other, and this
one wrote its own correction down rather than leaving it standing.

## What holds

GET-only holds on every new call: no OpenSensorHub host, id, count or place
name in the provider, the adapters, the layer, the fixtures or
`.env.example`. Base text for every carried scenario — `osh-020`, `021`,
`024`, `025`, `029`(qualified, not reworded), `030`, `031`, `033`, `041`,
`047`, `048`, `049` — is byte-identical to `git show main:` except this
change's own additions. No requirement description text changed; every
edit is to a scenario body already carried as MODIFIED, or to prose outside
the spec contract.

The frame rule, the axis-id binding, the depth cap and D51's five
deletions were each checked against a caller or a mutation, not against
coverage alone — the standard D51 itself sets.

## Found here, fixed elsewhere

`src/data/oshLayer.test.mjs` has 63 `layer.destroy(viewer)` calls and one
`finally`. A failing assertion skips teardown, a poll timer stays armed, and
`node --test` cannot exit cleanly — the suite prints its failure and hangs
with no plan line. This change did not introduce the pattern and does not
fix it. It is queued as its own change; the fix is `t.after(() => layer
.destroy(viewer))` at every site.

## Mutation evidence

42 mutants across five batteries, host-run, no Docker: `L1`-`L13` and `S1`
against the layer half of `osh-057` and `osh-031`'s clock-skew lower bound,
`INV` reinstating the fixed `id === _selectedId` disjunct, `M1`-`M23`
against the schema reader, the page mapper, the placement merge and the
provider. The full table, with tree and result for each, is in
`review/spec-adversary.md`.
