**Round 3, STE adversary — osh-observation-age.** Scope: `9e33fd8..6944bc3`. Tree clean at `6944bc3`; verified with `git status` rather than taken on the lead's word.

**B3 closed.** Each function now carries its own block: the two-bound, null-is-never-fresh rule sits above `isOshObservationFresh`, and the one-bound predicate above `isOshObservationAhead`. The splice is now two sentences, and dropping the em-dash aside from the fresh doc left one idea per sentence throughout.

**B4 withdrawn** on the lead's account of the reset. The change was archived, then `git reset --hard` rolled the applied delta back out of `openspec/specs/osh/spec.md`, which is why the published spec had lost `osh-050` and reverted `osh-031` and `osh-032`. The re-archive before merge is the condition I am relying on.

**D40** now names the function that holds the lower bound.

One wording I merely prefer, **accepted by name**: D40 says `isOshObservationFresh` "and the detail" call it, where the code comment says three places — `formatOshAge`, `renderAge` and `isOshObservationFresh`.

Vocabulary holds: four states, four readings, `stale` only the cache flag, `old` only the rendered word.

Verdict: PASS
