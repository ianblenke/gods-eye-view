**Round 3, STE adversary — osh-geo-discovery.** Scope: diff `020fb86`, against `2f4b101`. Read-only. Renames verified name-only; assertions unchanged.

**BLOCKERS (2), both one-line fixes.**

**1. `proposal.md:5` and `design.md:3`** — "The places the owner wants are the points of a radio mesh. Each is a feature of interest with a `Point`."
One word, one meaning. Round 2's "node" fix traded one fault for a worse one: "point" now carries the mesh-site sense and the GeoJSON `Point` geometry sense one clause apart, in both documents. A reader cannot tell whether "the points of a radio mesh" are geometries.
Fix: "are the **stations** of a radio mesh. Each **station** is a feature of interest with a `Point`." **Blocks merge.**

**2. `src/layers/osh/index.js:406-412`** — "By the time **the code below** can throw — `placeOshEntities()`, or Cesium building an entity — the explicit staleness check above has already run and passed…"
Unambiguous reference. Nothing below this line can throw; the catch body is below it. The throwing code is *above*, in the `try`. The reachability argument that justifies deleting the guard rests on a referent pointing the wrong way. **Blocks merge.**

**Minors, all accepted by name with reasons.**

- `index.js:22` "the datastream poll and **the marker** it moves" — the last "marker" in the entity sense. Outside the diff, but indefensible; fix it. `spec.md:48` "one marker row" is a third sense and correctly left.
- `index.js:406` "Both getters **now** fail through `Promise.allSettled`" — "now" dates a permanent comment; "fail through" is loose. L412 semicolon splice; L207-210 "keeps a source … from escaping … and killing the whole refresh" — the source does not escape, the error does; "killing" is metaphor.
- Four new THEN lines (`osh-005`, `osh-047`, `osh-042`, `osh-045`) — each is true, active and testable as written. Splitting improves the reading, but **no reader reaches a wrong conclusion about behaviour from any of them**. `osh-047` is the weakest.
- `aaeaf2a`'s three faults — a missing "that", a 90-word semicolon chain, and "killing" in the subject — accepted because it is not the tip commit and cannot be rewritten without an interactive rebase.
- `proposal.md:3` "most refreshes … at all" — accepted. "Most" is vague, but with no count from the owner's server permitted, every alternative is vague in the same degree, so the fix is not an improvement.
- Three test-file items (`getter/source` slash, `evilSystem` anthropomorphism, long comments) — accepted as naming and style inside test bodies the keep-test rule protects.

**Closed from round 2:** finding 5 (D31 has a verb), 9 (D33 rewritten), and the `tasks.md` "marker kinds". `2f4b101`'s message is two active sentences with verbs — **finding 15 closed**.

**For the record on scope:** the three renames are name-only. I diffed the hunks — every context line around each renamed `test(` is unchanged, and no assertion moved.

With the two one-line edits applied and nothing else touched, nothing in my list blocks, and I do not need a fourth round.

Verdict: FAIL
