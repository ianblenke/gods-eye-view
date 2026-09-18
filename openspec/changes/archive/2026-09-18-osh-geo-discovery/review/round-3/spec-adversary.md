**Round 3, spec adversary — osh-geo-discovery.** Scope: diff `020fb86`, against `2f4b101`. Repo untouched; all work in a scratchpad copy. No network.

**Lead finding — the deleted branch IS reachable; the comment is false, the spec is not.**

`src/layers/osh/index.js:406-412` claimed "a stale update never reaches this catch." Wrong. The region between the staleness check and the catch is synchronous, but it runs **source-supplied accessors** — and the diff's own `evilSystem` test establishes those as in-scope input. An accessor that cancels the layer and then throws reaches the catch while stale. Three probes, HEAD versus the restored `if (stale) return false;`:

| probe (accessor on `record.lon`) | HEAD `getStats().error` | branch restored |
|---|---|---|
| A: `layer.disable(); throw` | error set | `null` |
| B: `void layer.update(); layer.disable(); throw` | stale error that nothing clears | `null` |
| C: `layer.destroy(viewer); throw` | error written after destroy | `null` |

C is the sharpest: `destroy()` runs `resetState()`, then the catch writes an error back onto a destroyed layer. Restoring the branch **reds nothing** across all 251 OSH tests — so the suite cannot distinguish the two, and the branch was deleted for coverage, not correctness.

**But `osh-029` now says, unconditionally, that a failure while the layer places or draws the entities also sets `error` and resolves `false`.** That sanctions exactly probes A/B/C. Nothing was lost *silently*; the behaviour change is written down. Only the code comment overclaims. **Minor** — reword the comment to the true invariant, not the false absolute.

**Mutation table** (all 47 in `oshLayer.test.mjs`; survivors re-run against all 251):

| # | mutation | reds | test |
|---|---|---|---|
| M1 | label distance 200_000→100_000 | **yes** | `[osh-045]` — tautology confirmed fixed |
| M2 | `callSourceGetFois` de-`async` | **yes** | `[osh-046]` sync throw |
| M3 | `callSourceGetSystems` de-`async` | no | equivalent mutant, withdrawn |
| M4 | catch stops setting `_lastError` | **yes** | dup-id + non-Error |
| M5 | catch `return true` | **yes** | `[osh-029]` duplicate feature id |
| M6 | `error?.message \|\|` → `error.message` | **yes** | `[osh-029]` thrown non-Error |
| M7 | drop the `getFois`-absent guard | no | genuine survivor; pre-existing, minor |
| M8 | feature label always built | **yes** | `[osh-045]` no-name |

**On probe C, asked whether it deserves its own guard: leave it alone. Do not add the guard.** Three reasons, the first decisive:

1. The proposed `if (!_enabled && !_dataSource)` is no more coverable than the branch it replaces — it needs the same hostile accessor, so its only test is the contrivance we declined to defend against, and it spends the honest 100% claim to do it.
2. **It catches the wrong half.** `destroy()` nulls `_dataSource`; `disable()` does not. So the guard fires for probe C and silently misses probe A. A guard that covers one of two sibling paths is worse than no guard — it reads as a complete defence and is not one.
3. The dirty state is self-healing. `resetState()` already cleared the rest; `init()` calls `resetState()`, so a destroyed-and-reinitialised layer starts clean, and a destroyed-and-abandoned one has no reader. **The defect has no consumer.**

**Adjudication:** round-2 findings 1 closed · 2 closed · 3 closed · 4 not closed (this report) · 5 not closed at entry, fixed in-round · 6 closed · 7 closed.

**Other checks.** Collapse lost nothing. Seven carried scenarios byte-identical to `main`, verified by exact block comparison. `osh-005` is under MODIFIED, so its rewording is allowed; the pinned counts survive. Renames altered no assertion; `links.json` tracks them.

**Blocking merge: nothing.** Two minors stand, both accepted by name: the `index.js` comment rewritten to the true invariant, and the uncovered `getFois`-absent guard.

Verdict: PASS
