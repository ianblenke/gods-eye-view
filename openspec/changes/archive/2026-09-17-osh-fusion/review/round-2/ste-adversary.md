Round-1 findings: S1, S2, S4, S6, S7 closed. S3 not closed (carried as S2 below). S5 closed for the object/primitive split; the depth count stays under-specified. S8 partly closed. Of the minors, "until it passes" and the fixtures README are closed; "marker"/"entity" and the hyphen class are not.

The four spec-adversary-driven code changes all landed, but the prose was not updated with them — that is where the majors are.

```
Verdict: FAIL

- [ ] S1 major specs/osh/spec.md:34 "no file contains the word `POST`, `PUT`, `PATCH` or `DELETE`, or a `body:` key" The test now matches a quoted method token in any letter case. Taken as written the line is false: `server/providers/osh/observations.js:49` holds `cache.delete(oldestKey)`. Write: "no file has `post`, `put`, `patch` or `delete` as a quoted string, in any letter case, and no file has a `body:` key".
- [ ] S2 major specs/osh/spec.md:36 "every other file that sends an upstream request imports `oshGet`" `server/providers/osh.js:2` imports `oshPages`, not `oshGet`. Write: "imports `oshGet` or `oshPages`".
- [ ] S3 major specs/osh/spec.md:31 The test also reads the OSH adapters under `src/data/` and `server/providers/common/http.js`, and asserts the file count it discovers. Name them all.
- [ ] S4 major specs/osh/spec.md:90 osh-014 gives no line for the new page status check, and design.md:54 (D10) also omits it. Write, as a new AND line: "**AND** a page with a status outside 200 to 299 fails the walk".
- [ ] S5 major specs/osh/spec.md:232 "each `osh*` test file" The test now matches the path. Write: "each test file whose name starts with `osh` or that sits in an `osh/` directory".
- [ ] S6 minor specs/osh/spec.md:79 "the 60 second hold" → "the 60-second hold".
- [ ] S7 minor specs/osh/spec.md:129 "tried on its own" → "when the test sends each value on its own".
- [ ] S8 minor specs/osh/spec.md:209 "Move the marker" → "Move the entity".
- [ ] S9 minor specs/osh/spec.md:200 "a `keyRequired` result" → "a `keyRequired` answer".
- [ ] S10 minor specs/osh/spec.md:175 "past a depth of 4" → "an object or an array with a path of four or more names".
- [ ] S11 minor design.md:65 "Both come from the fixed `ids.js` import" → name the two items.
- [ ] S12 minor src/data/oshGet.test.mjs:168 "instead of returning an empty list" → "and does not give an empty list".
- [ ] S13 minor src/data/oshProxy.test.mjs:129 "names a mutating method" → "names POST, PUT, PATCH or DELETE".
- [ ] S14 minor src/data/oshProxy.test.mjs:548 "are not an option a caller can replace" → "a caller cannot replace the URL builder or its safety check".
- [ ] S15 minor src/data/oshRepositoryHygiene.test.mjs:81 "every OSH test file has no real address" → "no OSH test file has a real address".
- [ ] S16 minor src/layers/osh/detail.test.mjs:91 "a write to an absent host is a no-op" → "the function does nothing when there is no host".
- [ ] S17 minor src/data/oshLayer.test.mjs:180 "disable stops further updates" → "disable stops more updates".
```
