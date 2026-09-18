**Round 2, STE adversary — osh-geo-discovery.** Scope: diff `b3d28e0`, against `020fb86`. Read-only; `git` reads and `grep` only; no edits, no network.

**Closed:** 1 (`osh-041` now names `mapOshFois()`), 3, 4, 6 ("four layers" → "four checks"), 10, 11, 12, 13.
**Partly closed:** 2, 9, 14. **Not closed:** 8, 15.

**Finding 8, not closed.** The standardisation stopped at the proposal and the design. Three OSH test names still call an entity a marker, and one is the direct twin of a name this diff adds:

- `:1113` `[osh-029] a system with no name gets a point marker and no label`
- new `[osh-045] a feature with no name gets a point entity and no label`

One thing, two words, in one file. D34 in this same diff says "STE lint checks … every test name", so **the diff writes a rule it breaks**. Rename the three survivors (`:561`, `:1113`, `:1338`).

**Finding 14 reopened.** Two names added this round break the rule:
- `[osh-049] disable() does not clear the system union: a keyRequired answer and destroy() are the only ways to empty it` — 21 words, a colon joining two sentences, a trailing "it".
- `[osh-029] a synchronous throw does not stick: a later, successful update clears the error` — "does not stick" is idiom.

The four names I was asked to judge all pass: each a plain active statement, one idea, no ambiguous pronoun.

**Finding 15, not closed.** `020fb86`: "The gate's copy-back of the new and changed scenario ids and links, after the round-1 fixes and the coverage closure." No verb — not a sentence. `8e54087`: "to run these tests directly instead of by inference, and to watch each new test fail against the code it proves" — idiom, and "it" can read as the test or the code; and a 26-word sentence with three chained possessives.

**`tasks.md:5`** "the two marker kinds" — the last "marker" in the change documents, against D29.

**Finding 9, partly closed.** "share few ids" and "far below" are now rules. Surviving: `proposal.md:3` "so the layer draws almost nothing"; design D33 "Most entries … the entity count reflects only the ones that do".

**Finding 2, partly closed.** `osh-005`'s singular "its" is gone, but the WHEN block still states a failure — a condition, not a stimulus.

**D31** "**Motion:** unchanged in this change." — verbless fragment, and "change" twice.

Verdict: FAIL
