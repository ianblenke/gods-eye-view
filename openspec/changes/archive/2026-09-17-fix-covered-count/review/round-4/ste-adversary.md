Verdict: FAIL

- [ ] S1 major `openspec/changes/archive/2026-09-17-fix-covered-count/design.md:43` "In the first case the gate records the entry as not current." Untrue for a file with the tolerance conditions, and my round-3 wording caused it. `gap-ledger-078` splits the case in the change's own delta spec (`specs/gap-ledger/spec.md:34`: "with the tolerance conditions, the gate does not record the entry as not current"; `:35` gives the other half). The code agrees: `scripts/spec/lib/ledger.mjs:271` pushes stale only with `!tolerant`, and `hasTolerance` is the tolerance conditions (`ledger.mjs:268`). The test agrees: `src/tooling/spec/ledger.test.mjs:160` asserts `{ errors: [], stale: [] }` with `sameAsBase: () => true`, and `:162` asserts `LEDGER-STALE` only without it. The sentence is false for `src/search/placeSearch.js`, the file this change is about. Write: "In the first case, without the tolerance conditions, the gate records the entry as not current."

- [ ] S2 minor `.../design.md:31` "a function with covered branches of its own, V8 removes its nested functions too" Two faults, both from the collapse. First, the qualifier is the one S8 added to `proposal.md:34` to separate the two shapes; the same qualified clause now stands in both files for opposite shapes, so it separates nothing, and it names branches while this paragraph explains a fall of both function counts. Second, "its own" and "its" are two pronouns for the function with V8 between the second one and the function. Write: "When a caller in another file no longer calls a function, V8 removes the nested functions of that function too."

- [ ] S3 minor `src/tooling/spec/ledger.test.mjs:186` "A caller in another file that no longer calls a function removes its nested functions too" S5 is not corrected at the line I gave it on. The collapse moved the corrected sentence into `design.md:31` and left this comment as it was, so the caller is still the agent of "removes" and "its" still has two readings. Write: "When a caller in another file no longer calls a function, V8 removes the nested functions of that function too."

Correct, checked against the code and the spec, not against each other:
- S2 of round 3: `proposal.md:25` now names `src/data/labelArbiter.js`. The counts at `:28` and `:29` agree: 405 minus 50 and 407 minus 52 are both 355.
- S3: `design.md:31` now gives two sentences and names `Math.min`. Both are true of the ternary at `ledger.mjs:53`: the fall wins when the not-covered count falls, because `Math.min` would return the negative difference.
- S4: `proposal.md:35` now writes "does not follow", which agrees with "the code follows them" in the same bullet and leaves "keep" for "to retain".
- S6: no occurrence of "corner" in any file of the change.
- S7: `proposal.md:29` now writes "for both runs".
- S1, the second case: "The second case needs the tolerance conditions, because the tolerance is 0 without them" is true. `toleranceOf` gives 0 without them, so a rise of one is above it.
- No mirror of the S1 fault. `proposal.md:34` and `design.md:55` name the two cases and make no claim about a not-current entry, so only `design.md:43` needs the correction.

Not reported, as instructed: the "Count tolerance" requirement text.