Verified the new prose against `server/providers/osh/get.js`, `base.js`, `osh.js`, and the four new tests. All seven majors are correctly closed.

```
Verdict: PASS

Paths relative to `/home/ianblenke/docker/gev-osh`. `C/` = `openspec/changes/archive/2026-09-17-fix-osh-probe-format/`.

Round-2 majors, each confirmed against the code:
- S1 closed. `osh-037` tags three tests: `oshGet.test.mjs:458`, `:476`, `oshProxy.test.mjs:643`. D28 now says three. `osh-040` tags three (`:708`, `:732`, `:759`), as D28 says.
- S2 closed as a statement of fact; see M1 below for what is left.
- S3 closed. The D24 block at C/design.md:26-39 matches `get.js:28-37` line for line, and line 41 names the check.
- S4 closed and correct. `SYSTEMS_BODY`, `DATASTREAMS_BODY` and `OBSERVATION_BODY` (`oshProxy.test.mjs:10-14`) carry no `links` key, so `osh-038` runs no walk.
- S5 closed. C/proposal.md:11 now says both pages decode to the same value, and that this was not the question.
- S6 closed. "Location" is gone from C/specs/osh/spec.md:36 and openspec/specs/osh/spec.md:262; the new wording matches `new URL('systems', root)` and the pin at `oshGet.test.mjs:464`.
- S7 closed. C/tasks.md:3 names four scenarios.

New prose, each checked against the code:
- D24:46 is true. `base.js:65` sits inside `probeOnce`'s per-candidate `try`; `failureReasonFor()` gives `network_error`, so a throw is one miss, not a stopped pass.
- D27:72 is true. `get.js:169` reads `current.searchParams.has('f')`; `:173` forces the format, `:175` drops the key.
- D27:74 is true. A candidate with no `f` adds none, and `listOfSystems()` is at `osh.js:37` and accepts `features` or `items`.
- D27:70 is true. `oshProxy.test.mjs:717` drives the raw `+` link; `:726` pins `f=application%2Fgeo%2Bjson`.
- Spec `osh-037`:39 matches `base.js:11`, `osh.js:109` and `osh.js:118`, and the pins at `oshProxy.test.mjs:650-652`.

No host name, system id, datastream id, count or place name entered the repository. Every address is `osh.example`, `attacker.example`, `other.example` or `localhost`; every id is `sys-fixture-`, `ds-fixture-` or `obs-fixture-`. No new word ends in -ing outside `string` and `toString`.

Minor findings, each open and each safe to accept by name:
- [ ] M1 minor C/design.md:77 "a two-clause branch, the safety check; the two new tests for it each drive one branch outcome" One word, one meaning. "branch outcome" reads as the two outcomes of the `if`, but the clause count invites a reader to check three. `oshGet.test.mjs:478` and `:482` drive both clauses in one test. Write: "one loop and one check with two clauses. One test drives each clause, and one test drives the pass."
- [ ] M2 minor src/data/oshProxy.test.mjs:708 "echoes" Approved words. "echo" is not an approved STE verb. Design.md:68 now says "repeat". Write: "even when a server writes a different f value". The same word stays in the `get.js:157` comment, which is code and outside my checks.
- [ ] M3 minor src/data/oshGet.test.mjs:476 and C/proposal.md:16 "would leave" Verbs. Use the simple present, as C/design.md:41 already does with "leaves". Write: "leaves the root's origin or the root's path".
- [ ] M4 minor C/proposal.md:21 "Otherwise it drops the key, never the link's own value" Articles and nouns. After "drops the key", "never the link's own value" reads as a second object of "drops". Write: "Otherwise it drops the key. It never carries the link's own value."
- [ ] M5 minor C/proposal.md:40 "A value built by string concatenation has an empty literal at scan time" One word, one meaning. The literal is `f=`; its value is empty, not the literal. Write: "A value built by string concatenation leaves an empty value in the literal at scan time."
- [ ] M6 minor C/design.md:62 "It also refuses a string that holds `?` followed by such a pair" One word, one meaning. "such a pair" points back to a pair with a bad byte, but `LITERAL_QUERY` at `oshProxy.test.mjs:684` refuses any `?key=`, which line 64's own example, `systems?limit=1`,shows. The spec line 51 is correct. Write: "It also refuses a string that holds `?` followed by any `key=value` pair." (This sentence is older than the round-2 diff.)
- [ ] M7 minor C/design.md:41 "so the check cannot fire" Approved words. "fire" has no approved verb sense here, and `oshGet.test.mjs:476` does make the check throw. Write: "so the check cannot throw at a call site today".
```

Under the round-3 rule, none of these blocks the build: every one has a single clear meaning and none disagrees with the code.

Both notes taken. On D27:74, I confirmed the named function and stopped there; the claim was about what happens to a default-shape page, so the check owed a step to `mapOshSystems()` at the consumer. I will follow the data to its use when a sentence asserts an effect rather than a return value. On M2, I will report prose in code comments as in-scope rather than setting it aside.
