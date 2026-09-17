Round-2 majors: S1 closed (`cache.delete(` is not a quoted string, and the test's token is `/['"](post|put|patch|delete)['"]/i`). S2 closed. S3 not closed (see S3 below). S4 closed. S5 closed. Eleven of the twelve minors are closed; "past a depth of 4" was changed and the new design wording is wrong (S4), and the "no-op" sweep missed two test names (S7).

The shortened `osh-005` name still agrees with its scenario.

```
Verdict: FAIL

- [ ] S1 major proposal.md:46 "then back to 50, "smaller". This change does not touch that file. The final ledger entry equals its base value, so no gap opened or closed." Does not agree with the trace files. history.jsonl adds four coverage lines for that file and the last is 50 to 52, "shown by test"; gaps.json records 52 branches against the base 50. Correction: state the banked count, the totals that move with it, and that the covered count stays the same.
- [ ] S2 major proposal.md:45 "It records the same for `server/providers/common/http.js` ... Both files stay fully covered." Does not agree with the trace files. The ledger records only a totals line for http.js, with no hash line, and neither file is fully covered: layerState.js has 68 lines, 75 branches and 5 functions open, and http.js has 19, 4 and 2. Correction: say the open gap of each file stays the same size.
- [ ] S3 major specs/osh/spec.md:31 "the three OSH adapters under `src/data/`" The test reads four files under `src/data/`, and one of them, `src/data/osh.js`, is not an adapter. Write: "the four `osh*.js` files under `src/data/`".
- [ ] S4 major design.md:77 "A value past depth four gets a fixed marker." `src/data/oshObservations.js:28` marks at depth four, not past it, and marks only an object or an array. Write: "An object or an array at depth four or more gets a fixed marker. A primitive keeps its own value at any depth."
- [ ] S5 minor design.md:53, specs/osh/spec.md:95 and the osh-014 test name "fails the walk" STE approves "fail" as a verb without an object. Write: "the walk stops with an error".
- [ ] S6 minor design.md:68 "falls to" is a phrasal verb. Write: "The general error response, `osh-008`, catches a future edit that breaks the invariant. No dedicated branch catches it."
- [ ] S7 minor src/data/oshLayer.test.mjs:194 and :334 "is a no-op" is not an approved word, and the sweep kept these two test names. Write: "does nothing".
```
