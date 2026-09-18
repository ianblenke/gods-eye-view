**Round 1, STE adversary — osh-geo-discovery.** Scope: full, against `b3d28e0`.

### specs/osh/spec.md

**1. `osh-041`'s WHEN is byte-identical to `osh-024`'s, and "feature" carries two meanings.** In `osh-024` a "feature" is a GeoJSON entry that becomes a *system* record; in `osh-041` it is a feature of interest. A reader cannot tell the two contracts apart from the WHEN. `osh-024` is text I must not disturb, so the fix lands on the ADDED side: name the actor, `mapOshFois()`.

**2. `osh-005`** "it fails when the first set is not four files, or the second set is not five files, its pinned sizes" — singular "its" for two sets, and a WHEN line that states a failure.

**3. `osh-044`'s THEN mixes a rule with its consequence.** One idea per sentence; split into a THEN and an AND.

**4. `osh-045`'s THEN** joins two unrelated events with "both" twice. Split into two AND lines.

### design.md

**5. D33 names the wrong thing.** The heading says "The system adapter keeps every system"; the text says `mapOshSystems()` keeps a record for every **feature**. *(Adjudicated on challenge: the sentence is factually accurate — the code reads a GeoJSON `FeatureCollection` — so the fix names the input rather than changing the claim.)*

**6. "four layers" is metaphor**, and "layer" already means the browser map layer here. Use "the same four checks".

**7. Synonym drift, one thing with three names.** "feature of interest" / "feature" / "node"; "host system" / "host" / "gateway". Keep "feature of interest" and "host system"; delete "node" and "gateway".

**8. Marker versus entity.** The spec is the contract and uses "entity". Use one name everywhere.

**9. Vague quantifiers:** "Almost no system carries one", "Two full walks of it share few ids", "The marker count stays far below the feature count", and 2 more. Give a rule, not a quantity.

**10. Metaphor and hedge:** D31 "a key into the held list … never a fetch"; D32 "Each route degrades and caches on its own"; D34's second clause has no verb.

### proposal.md

**11.** "A marker must open something." — idiom.
**12.** "A later change adds that." — "that" has two referents.
**13.** "a node's own descriptive stream, if it has one, is not read" — hedge plus passive.

### Test names

**14.** The `osh-049` name is 28 words and states four assertions. Also "with a snapshot in hand" is idiom; one "it" is ambiguous between the id and the feature; one name is 26 words.

**15. Commit messages, minor.** "close the coverage gaps" and "tighten" are idiom; "the secondary datastreams list key" is a four-word noun cluster.

Findings 1, 4 and 5 change meaning. Findings 7 and 8 are the drift pattern across all four documents.

Verdict: FAIL
