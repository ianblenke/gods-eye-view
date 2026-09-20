# ASD-STE100 adversary — `osh-location-streams`, round 1

Round 1 read `87e602c` and raised 21 findings. They were corrected in `9895b38`, which
this file records. Both trees were read in a private `git archive` copy; nothing was
written in the working tree and no gate was run from here. Every line number and every
quotation below is from `9895b38`, and each finding quotes the corrected text, not the
text as found.

Scope: `proposal.md`, `design.md`, `tasks.md`, `specs/osh/spec.md`, the code comments and
the test names the change adds.

## Findings

- [x] FINDING blocker `specs/osh/spec.md` L218, L228 — `stale` is the cache flag of `osh-022`/`osh-023`, and this file uses it that way six times (L122, L127, L157, L266, L269, L276). The scenario title and a THEN line used it for the freshness condition, putting two meanings on one word in the document that decides behaviour. Corrected to "retire it when its record is no longer fresh" and "because no fresh location named it".
- [x] FINDING blocker `design.md` L67, `proposal.md` L9, L19 — the same drift outside the contract. Corrected to "One that is not fresh is dropped before any other rule", "A record that is not fresh never moves an entity", "A location that is not fresh is dropped before any other rule". And 5 more of this kind, all corrected: `design.md` L63, `tasks.md` 3.7 twice and 5.4 twice. Every surviving `stale` in the change is now the cache flag.
- [x] FINDING blocker `specs/osh/spec.md` L52-53 — one THEN of 28 words carried five ideas and ended "above a `Point`", which states precedence in the one document where it reads as altitude. Corrected by splitting it: the placement line, then "that placement stands in place of that system's `Point`".
- [x] FINDING blocker `specs/osh/spec.md` L54 — "the newer of two such locations for one system wins" was idiom in a THEN and named no behaviour. Corrected to "the layer places the newer of two such locations for one system".
- [x] FINDING blocker `specs/osh/spec.md` L224 — the clause after the semicolon, "this scenario governs only placement and motion from the pass", was false: the same scenario governs the label, the placeholder, the click and the poll. Corrected by deleting it; the line now ends "as `osh-031` says, unchanged".
- [x] FINDING blocker `specs/osh/spec.md` L187 — "past the threshold" where the scenario names two constants that give opposite renderings. Corrected to "a number past `OSH_FRESH_MAX_AGE_MS`".
- [x] FINDING blocker `design.md` L61 — "concurrent readers share one pass" used `reader` for a caller, where D44 defines a reader as the object `readOshSchemaLocation()` builds. Corrected to "So concurrent callers share one pass".
- [x] FINDING blocker `server/providers/osh.js` L369 — `resolveSystemName()`'s comment cited D48 for text that is D47's word for word, landing a reader in the wrong design section. Corrected to D47, matching L390 twenty-one lines below.
- [x] FINDING minor `specs/osh/spec.md` L174, L185 — one condition written two ways, "further below zero than" and "further ahead than", both stating a sign indirectly. Corrected to "below `-OSH_CLOCK_SKEW_MAX_MS`" in both.
- [x] FINDING minor `specs/osh/spec.md` L184 — "a small negative `ageMs` reads `0 s`, which is the usual reading from a server whose clock leads" carried a vague qualifier, an idiom, and two senses of `read`. Corrected to "a negative `ageMs` within `OSH_CLOCK_SKEW_MAX_MS` reads `0 s`".
- [x] FINDING minor `specs/osh/spec.md` L188, L224 — two THEN lines stated reasoning rather than behaviour. Both clauses are gone from the contract; L188 now ends "and never reads `old`", and the reasoning moved to `design.md` D48 L72, where it belongs.
- [x] FINDING minor `specs/osh/spec.md` L59-60 — the `osh-051` WHEN carried three ideas in nested commas, and "a bounded depth" was unquantified while the test names four. Corrected by splitting it and naming the number: "walking `fields` to a depth of four", then "it walks a `Vector` field's `coordinates`".
- [x] FINDING minor `design.md` L89 — D51's deletion 2 asserted unreachability where the other four name a caller, and "the parser accepts almost anything after one" was a vague qualifier. Corrected to the checkable rule: "WHATWG URL parsing takes any scheme with an opaque path, so `new URL()` throws for no `urn:`-prefixed value that carries no white space."
- [x] FINDING minor `proposal.md` L41, L45 — `old` is only the word the detail panel renders. Corrected to "loses the earliest of them" and "whose newest record is not fresh".
- [x] FINDING minor `proposal.md` L3, L5 — a fragment with no verb, and a colon joining two ideas with the noun after "three" elided. Corrected to one sentence at L3, and "This project measured three position shapes on the owner's server."
- [x] FINDING minor `proposal.md` L5, L7, L9 — idiom and a wrong actor. Corrected to "a rule that uses a field's name", "a list the server samples", "the freshness gate this project already provides". And 2 more of this kind in `design.md` L5 and L7, both corrected the same way.
- [x] FINDING minor `tasks.md` 1.3 — "D44 to D50" where the document ends at D51. Corrected to "D44 to D51".
- [x] FINDING minor `tasks.md`, `specs/osh/spec.md` L150-151 — `pass` carried three senses: D47's noun, the verb for a green test, and "pass-through". Round 1 put the verb at nine occurrences; it was eight, in a drift of twelve in all — eight "until X passes", three "until X and Y pass", one "pass-through". All twelve are corrected, to "is green", "are green" and "the fields it forwards"; the contract now reads "forwards". The count in round 1 was wrong and is corrected here, because a count in a review is a claim like any other.
- [x] FINDING minor test names — three `osh-032` names stated a judgement instead of the rendered text the test asserts. Corrected to "an ageMs far ahead of the clock reads `ahead of the clock`, never `old`", "a negative ageMs within the clock skew reads `0 s`", and "at the skew bound reads `0 s`, and just past it reads `ahead of the clock`".
- [x] FINDING minor test names — two carried two ideas each. Corrected to "[osh-052] two different nowMs values give two different ages" and "[osh-056] createOshSchemaCache() stores a null reader too, not a raw re-read per call".
- [x] FINDING minor `design.md` L9 — no document said which words a reader must already know. Corrected by a Terms line in Context: "`placed`, `candidate`, `pass` and `stream-placed` are new in this change. `fresh`, `entity` and the `stale` cache flag come from `osh-022`/`osh-023`." This is the root cause of the two findings above it, and it is the correction most likely to hold the vocabulary for the next change.

## What holds

The vocabulary holds. `entity` is the word for what the map draws throughout all four
documents; `marker` survives in exactly one place, the truncation row of `osh-026`, which
is the other sense. `candidate`, `placed` and `stream-placed` each carry one meaning
across the proposal, the design, the tasks and the contract. After the corrections, every
`stale` in the change is the cache flag and every `old` is either the panel's rendered
word or `design.md` L72's gloss on it. `reader` and `pass` each carry one sense.

D51 enumerates five deletions against `git diff main..HEAD`. Four name the function whose
prior check makes the line unreachable — `mapOshDatastreams()`, `gatherLocationCandidates()`,
`walkForVector()`, `extractOshLocation()` — and the fifth now names the parsing rule
instead of asserting the outcome. A reviewer can check the argument rather than the
conclusion, which is what the section exists for. Its closing paragraph remains the best
prose in the change: it states the rule left standing, names the value that now passes it
(`javascript:x`), and says why that is contained. That is a residual risk disclosed, not
an assertion.

The contract improved beyond the corrections. `osh-029` splits one THEN into two lines of
one idea each. `osh-031` names the actor — "the layer moves the entity" for the old passive
"the entity moves". `osh-032` splits one overloaded line into six, each naming the rendered
text and, now, the constant that decides it. `osh-046`'s `keyRequired` clause repeats the
features clause word for word, with no synonym drift. `osh-057`'s "that exception governs
the entity only" is one idea, and it resolves a contradiction the earlier text carried.

Of the test names the change adds, all but the five corrected above are plain statements
of what the test proves, each tagged with its scenario id. The three added after round 1
hold to the same standard: `[osh-057] a placeholder that gains a held record and a Point on
a later refresh is not counted as retired`, `[osh-042] a location with an unheld foiId but
a held foiUid still moves that feature`, and the `osh-032` skew-bound name above.

## Seen and not raised

Four things were read and judged not worth a correction, recorded so the next round knows
they were seen rather than missed. `design.md` L40 keeps "measured against the owner's
server", and L69 keeps "above that system's own point" and "wins", which the contract no
longer uses — prose, where neither can be misread as altitude or as an unstated rule.
`design.md` L49 runs to 27 words. `tasks.md` L112 runs to 30. None of the four was
introduced by this round's corrections, and none changes what a reader would build.

Verdict: PASS
