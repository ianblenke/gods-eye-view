**Round 4, spec adversary — osh-geo-discovery.** Confirmation pass against the merged tree, HEAD `b959c05`. Read-only; clean.

**`341e299`, the catch comment — correct, and it is what I meant.** The false absolute is gone. The wording now states the premise explicitly and derives the conclusion from it: *"A production record is parsed JSON data. So nothing in that region re-enters the layer, and a stale update does not reach this catch."* That is a conditional resting on a named, falsifiable premise, not a claim of impossibility — a maintainer who later feeds the layer accessor-bearing records sees exactly which sentence they broke. It does **not** claim a stale update can never reach the catch.

Two things I did not ask for and welcome: the commit message records the accessor path and the `disable()`-then-throw mechanism in prose, so the probe survives the comment; and the stale "the code below" pointer is fixed — it pointed at `placeOshEntities()` and the Cesium entity construction, which sit *above* the catch in the try.

One nit, not a finding: the commit message says "does not reach this catch **in practice**" and the comment drops "in practice". The premise sentence carries that weight, so the comment is honest as written. I would not hold the merge for three words.

**`b959c05`, the archive — the text moved, it was not altered.** All 23 scenarios in the delta at `341e299` compare byte-identical to their counterparts in the applied `openspec/specs/osh/spec.md`; zero differ. All seven requirement headers (`GET only`, `Records`, `Systems layer`, `Synthetic fixtures`, `Features of interest`, `Feature entities`, `Datastreams of one system`) are present in the applied spec — the three added and four modified. The change tree moved to `openspec/changes/archive/2026-09-18-osh-geo-discovery` with all four files at 0-line diffs, so nothing was rewritten in transit. Everything I reviewed in round 3 — `osh-005`'s WHEN/THEN split, `osh-029`'s draw-failure THEN, `osh-045`'s no-name THEN, `osh-046`, `osh-047`'s absent-key THEN — is in the applied spec verbatim.

Nothing blocks. The two minors from round 3 are now one: the uncovered `getFois`-absent guard, pre-existing and relocated.

Verdict: PASS
