# ASD-STE100 adversary — `osh-marker-depth`, round 1

Round 1 read `9b26215` and raised 35 findings over four passes: 22 against `9b26215`, nine
against the corrections in `491213e`, three against the clause in `ea38f73`, and one of my
own that round 1 had missed. `5f16e15` closes 31 of them. The four that remain are minors
and are carried forward by name at the end of this file.

This file records `5f16e15`, read in a private `git archive` copy at
`/tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/tree5f16e15`.
Nothing was written in `/home/ianblenke/docker/gev-depth`. No container was started, so no
gate was run from here: `make lint`, `make ratchet` and `make gates` each build one through
`ensure-image`. The ratchet and gate results in this change are the implementer's, not mine.

Every line number and every quotation below is from `5f16e15`. A checked box quotes the
corrected text, not the text as found.

Scope: `proposal.md`, `design.md` (D59–D64), `tasks.md`, `specs/osh/spec.md`
(`osh-061`, `osh-062`), and the code comments, section comments, test names and assertion
messages the change adds to `src/layers/osh/index.js` and `src/data/oshLayer.test.mjs`.

## Findings

- [x] FINDING blocker all four documents plus both source files — `marker` in the entity sense, 24 times in `design.md`, 17 in `proposal.md`, 3 in `tasks.md`, both scenario titles, two section comments, four assertion messages and the helper's own name. The live spec uses `entity` 26 times and `marker` once, at `openspec/specs/osh/spec.md` L217, "one marker row", which is the truncation sense. Round 3 of `osh-geo-discovery` called the entity sense "indefensible" and deleted it from `index.js` L22. Corrected throughout. `grep -rn marker` over the change folder and both source files now returns three lines: `proposal.md` L11, which is about the folder name, and `tasks.md` L63 and L65, which are `make` command arguments. The requirement is "### Requirement: Entity depth and horizon", the scenarios are "Draw every entity on top of the terrain, at its own altitude" and "Hide an entity beyond the horizon", the helper is `entityAlwaysOnTop()` at `src/layers/osh/index.js` L34 and its five call sites, and the four assertion messages read "an entity under the camera stays visible", "an entity at the antipode starts hidden, before any moveEnd", "the near entity is now beyond the horizon" and "the camera now sees the far entity". The two known-limit names are `osh-entity-through-near-structure` and `osh-ground-entity-at-datum`.
- [x] FINDING blocker `proposal.md` L41 — the `osh-horizon-on-settle-only` clause wrote `stale` for the freshness of a `show` flag. `stale` is the cache flag of `osh-022`/`osh-023`, used that way in the live spec at L122, L127, L157, L266, L269 and L276, and the `osh-location-streams` review corrected this exact drift across four documents. `make lint` cannot see it, because the word is not on the word list. Corrected to "That entity keeps that `show` value until the next refresh or the next `moveEnd`."
- [x] FINDING blocker `design.md` L91; `tasks.md` L34 — `fresh` in the sense "newly written", alongside four correct uses for the freshness condition. Corrected to "Its own assertion reddens when a new literal replaces the reused `LabelGraphics`." and "M13: replace the re-added entity's `label: selectedSystemEntity.label` with a new literal."
- [x] FINDING blocker `tasks.md` L36, L53 — `pass` as the verb for a green test, which the `osh-location-streams` review had corrected twelve times. Corrected to "until 3.1 is green" and "until 4.1 is green".
- [x] FINDING blocker `proposal.md` L7, L41; `design.md` L9; `tasks.md` L55, L58 — the noun `pass` for two different walks, unqualified, at five sites, plus a fourth sense at `tasks.md` L58. All corrected: "A horizon pass over the layer's entities hides each one beyond the ellipsoid horizon. The horizon pass reads the occluder this project already shares", "the horizon pass runs when the camera settles", "The horizon pass that walks the icons is per layer", "The horizon pass call inside the poll runs once after the loop", and "after the first run through M1-M12". `design.md` L48 "the same pass", L74 "no pass" and L76 "A shared pass" each follow "horizon pass" within one or two sentences and read back to it.
- [x] FINDING blocker `design.md` L11 — three of the six new terms were undefined, so D59 could not be checked without Cesium's documentation. Corrected, and the two definitions that carry the argument are exact: "`depth test` means Cesium's default check that hides a point behind a nearer drawn surface" and "`window` means a finite `disableDepthTestDistance`, a camera distance past which the depth test runs again." That second one states the direction the finding said was missing. `occluder` is defined too.
- [x] FINDING blocker `design.md` L34 to L48 — D59 rested on how deep an entity sits below the surface, which a binary depth test does not measure, and it never answered the reader who wants a 15 kilometre window. Rewritten: "The depth test does not measure how far a point sits below the surface. It is binary. Inside a window's camera distance the test never runs, so a buried point still shows. Beyond the window the test runs, and any burial, however small, hides the point." The discriminator is now sampled against unsampled, and L42 answers the alternative directly: "A 15-kilometre window does keep the entity visible inside 15 kilometres, the near band. It does not keep the entity visible beyond 15 kilometres, the far band. ... `osh-045` shows a feature label out to 200 kilometres, and a system label at any distance. So the far band sits inside this layer's own requirement." The falsifier stands at L44: "Show that OSH records carry a true altitude, or add a ground sample. Then a window is an option again."
- [x] FINDING blocker `design.md` L32 — the citation of "the facts file" and its quoted phrase "once already", neither of which is in the repository. Deleted.
- [x] FINDING blocker `design.md` L32, L82 — two counts of one population, "Six layers" and "Eight layers", where it is nine. Corrected to "Nine layers — bikeshare, cctv, firms, flights, installations, launches, military, satellites and vessels — use positive infinity." and "Nine layers set the literal in place today". I re-ran the count against `5f16e15`: `grep -rl "disableDepthTestDistance: Number.POSITIVE_INFINITY" src/layers/` gives those nine package names and no others.
- [x] FINDING blocker `design.md` L94 to L98 — "every current fixture stays visible" was false: the `osh-057` location fixture at longitude 30, latitude 31 sits 39.9 degrees from the camera against a 35.94-degree horizon. Corrected, and L98 states the boundary rather than a universal: "A fixture from another scenario can sit beyond this horizon too. `osh-057`'s location fixture, at longitude 30 and latitude 31, is one example. No test in this suite reads `show` on it. So its visibility under this camera is not a claim this design makes."
- [x] FINDING blocker `design.md` L96 — the first replacement for that finding named `SYSTEM_B` among "the fixtures the tests assert `show` on". No test does: every `osh-062` test builds from `[SYSTEM_A, SYSTEM_FAR]` or `[SYSTEM_A]`, and no `osh-061` test asserts `show` at all. Corrected to "The `osh-062` tests assert `show` on four fixtures. `SYSTEM_A` and `FEATURE_A` sit under the camera and stay visible. `SYSTEM_FAR` and `FEATURE_FAR` sit at the antipode and the occluder hides them."
- [x] FINDING minor `design.md` L44, L52 — `reader` named a person, where the live spec uses it for the object `readOshSchemaLocation()` builds at L221, L222, L225, L262, L267, L515 and L521. Corrected to "A later engineer can check this claim directly." and "An engineer sees the decision at the site, and a test can pin it against a clamp."
- [x] FINDING minor `design.md` L68, L100; `proposal.md` L41; `tasks.md` L45; `src/layers/osh/index.js` L169; `src/data/oshLayer.test.mjs` L2072, L2106 — `limb` and `horizon` named one boundary in seven places, where the contract uses `horizon` only. All seven corrected: "can cross the horizon between refreshes", "a poll move across the horizon", "An entity that crosses the horizon during one camera motion", "a poll move across the horizon hides the selected entity", "// An entity the poll moved can cross the horizon between refreshes", the test name "[osh-062] a poll move across the horizon hides the selected entity, and a later move back shows it", and "'the poll carried it past the horizon'".
- [x] FINDING minor `proposal.md` L5, L38; `design.md` L40, L42; `src/layers/osh/index.js` L24 — `submerge` and `burial` named one idea, and "brought the submerge back" was a phrasal verb with no approved sense. All five corrected, and `submerge` now appears nowhere in the change: "a finite distance let the depth test hide the icon again at far zoom" (twice), "the loaded surface rises above the entity, and the depth test hides it", "does keep the entity visible inside 15 kilometres", and "The cctv layer met this exact defect at a field test on 2026-07-06".
- [x] FINDING minor `src/layers/osh/index.js` L169 — the comment wrote `may`, which `openspec/ste/words.json` maps to `can`, and it was the change's only word-list hit. The project's `make lint` does not reach source comments. Corrected to "// An entity the poll moved can cross the horizon between refreshes".
- [x] FINDING minor `design.md` L68 — the rewritten cadence paragraph had a missing article and a sentence with no verb. Corrected to "An entity that the loop moves can cross the horizon between refreshes. It runs once after the loop, not once per datastream with a fresh location."
- [x] FINDING minor `proposal.md` L5, L11; `design.md` L42 — three semicolons, each joining two ideas. All corrected: "Every other layer that draws a ground-anchored icon sets one of the two properties. The OSH layer sets neither, and the cctv layer met this exact symptom in a field test on 2026-07-06.", "`osh-geo-discovery`, round 3, dropped `marker` from this repository's entity sense. `entity` is the project's word.", and "Traffic's far band sits outside traffic's requirement, and OSH's far band sits inside OSH's requirement."
- [x] FINDING minor `design.md` L3 — the Context was in the present tense and its three line numbers were `main`'s, not the shipping tree's. Corrected by dropping the numbers: "They are the system entity, the re-added entity for a selected system that a refresh did not place, and the feature entity." That is better than the base-naming fix I proposed, because no later edit can make it wrong.
- [x] FINDING minor `design.md` L66 and `tasks.md` L54 — the design handed the reader a job instead of a fact. Corrected to "It writes `show` without a same-value guard. Cesium's `Entity.show` setter returns early for an unchanged value, so this design adds no guard." I confirmed the fact: `@cesium/engine/Source/DataSources/Entity.js` L288 to L290 returns early when the new value equals `this._show`.
- [x] FINDING minor `specs/osh/spec.md` L4 — "its" had no clear noun; its nearest antecedent was "the mesh". Corrected to "at the entity's record altitude". The second half of this finding is carried forward below.
- [x] FINDING minor `design.md` L30 — "a label that sinks while its point shows is the same defect in a smaller shape" was two metaphors in one sentence, and one idea too many. Corrected to "The label gets it too. A label that fails the depth test while its point still shows repeats the same defect, at a smaller scale."
- [x] FINDING minor `design.md` L36, L44, L52 — `read` carried three senses: a value fetched in code, a person looking at the map, and the text the panel renders that `osh-032` owns. The person sense is now `see` throughout: "Traffic never asks a viewer to see a dot from further away", plus the two `reader` corrections above.
- [x] FINDING minor `design.md` L52 — "It is set on purpose" named no actor. Corrected to "This change sets it on purpose."
- [x] FINDING minor `design.md` L80 — "The three point constructions and the two label constructions pass through it" said a construction moves, and used `pass` a third way. Corrected to "Each of the three point constructions and the two label constructions calls it."
- [x] FINDING minor `design.md` L108 — `old` named something other than the word the detail panel renders, in "no old id needs a changed test". This text was in `9b26215` and round 1 missed it; I record it as mine to have missed. Corrected to "no id from before this change needs a changed test".
- [x] FINDING minor `src/data/oshLayer.test.mjs` L1903 — the test name said less than the test asserts. The body asserts both properties on the point (L1936, L1937) and on the label (L1941, L1942). Corrected to "[osh-061] the re-added entity for a selected system draws on top, on its point and its label".
- [x] FINDING minor `tasks.md` L27, L64 — two sentences over 24 words, each with an em-dash or a comma carrying a second idea. Both split: "Use `FEATURE_ALT`, whose `alt` is 75, and read the height back the same way. Every other feature fixture carries `alt:0`, which leaves `feature.alt || 0` mutation-proof." and "It ran again after the STE fix renamed the requirement and scenario titles. The scenario hash covers the name."
- [x] FINDING minor `design.md` L46 — the paragraph repeated what L36, L38 and L42 already carried. Corrected by merging it into the rejection: "Rejected: a finite window, at 15 kilometres or another value. `osh-045` needs visibility at any camera distance, and every window leaves a far band open where the entity's burial reappears. A later change that wants to replace positive infinity with a number must first give OSH entities a ground sample."
- [x] FINDING minor `design.md` L44 — "So a window trades one camera-distance range with no fix for another" was hard to parse on one reading. Corrected to "So a window fixes the depth test in one camera-distance range and not in another."
- [x] FINDING minor `tasks.md` 2.1 to 4.3 — boxes unchecked for work already in the tree. Corrected: 1.1 to 5.4 are `[x]`, and 5.5 is correctly still `[ ]`, because `review.md` does not exist yet.
- [x] FINDING minor `design.md` L100, `tasks.md` 4.1 — the mutation list grew with the change and the design matches it: "The task list names fourteen mutations, M1 to M14." I checked L92's supporting claim: `FEATURE_A`, `FEATURE_ORPHAN`, `FEATURE_NO_HOST`, `FEATURE_NO_NAME` and `FEATURE_FAR` all carry `alt:0`, and `FEATURE_ALT` carries 75, so "Every feature fixture but one carries `alt:0`" is exact.

## Carried forward

These four are minors. They are recorded here by name so the next author knows they were
seen and left, not missed. None of them changes what a reader would build.

- [ ] FINDING minor `proposal.md` L5, L41; `design.md` L11, L32, L34, L36, L42, L56, L58, L62, L66, L68 — twelve paragraphs of six sentences each, where the rule is under six. Round 1 found ten, the D59 rewrite opened six more and closed four, and this commit closed two. Each needs one break: `proposal.md` L5 before "An OSH entity samples no ground"; L41 before "A poll cycle that changes selection partway through"; `design.md` L11 becomes a list, one term per line; L32 before "Traffic's live jam dots"; L34 before "So a window does not need to cover the size of a burial"; L36 before "Beyond 15 kilometres the depth test runs again"; L42 before "`osh-045` shows a feature label"; L56 before "A clamp discards the altitude"; L58 before "An aircraft on the ground reports"; L62 before "A split would need an altitude threshold"; L66 before "It writes `show` without a same-value guard"; L68 before "And the poll runs it once after the loop".
- [ ] FINDING minor `specs/osh/spec.md` L4; `tasks.md` L55 — two sentences of exactly 25 words, where the rule is under 25. Both crossed the line because of a correction I asked for: the spec sentence grew by one word when "its" became "the entity's", and the task line grew by one when "The pass call" became "The horizon pass call". Write "The browser layer MUST draw every system entity and every feature entity on top of the terrain and the mesh, at the record's own altitude." and "The horizon pass runs once inside the poll, after the loop over the selected system's datastreams, not once per datastream."
- [ ] FINDING minor `specs/osh/spec.md` L4 — "on top of the terrain and the mesh" still reads in the spatial sense, while `design.md` L11 defines `on top` as never taking the depth test. An entity at the ellipsoid under a plateau is not above the terrain; it is drawn over it. The scenario's THEN lines state the property values, so no behaviour is ambiguous, and the phrase is now the scenario title as well, so a change here rehashes. Write, when something else rehashes these scenarios anyway: "The browser layer MUST draw every system entity and every feature entity without the depth test, so the terrain and the mesh never hide one."
- [ ] FINDING minor `design.md` L32, L74 — two metaphors with no approved sense: "Traffic's window works" and "The fix is cheap". Write "Traffic's window covers traffic, and a window needs no horizon pass at all." and "The horizon pass costs little, and the far-side entities draw through the planet without it."

## The two judgements you asked for

**The folder name.** I accept keeping it, and `proposal.md` L11 is an acceptable statement of
why. Its last sentence is the checkable one and it holds: the folder name is not spec text,
and nothing under `openspec/specs/` and neither new scenario names it. One residual the
paragraph does not state, and which I do not think it needs to: the archive keeps folder
names, so the word will survive in `2026-09-xx-osh-marker-depth` after the change lands. The
paragraph's own argument already covers that cost.

**The boundary sentence at `design.md` L98.** Honest, and I would change nothing in it. It
states what the design does not claim rather than implying a claim it cannot support, and
L94's "about 36 degrees" gives a later author the number to check a new fixture against. It
is better than the sentence I proposed, because mine listed today's fixtures and would go
stale while this states a rule about fixtures in general.

**On the clause, which you also asked me to judge.** The mechanism is right, and I checked it
rather than took it: the early return at `src/layers/osh/index.js` L150 fires inside the
datastream loop, before `refreshHorizonVisibility()` at L171, and an earlier iteration can
already have set `entity.position` at L162 to L166. The final wording drops "across the
horizon" from the middle sentence, which makes the limit broader and more accurate: any move
by an aborted cycle leaves a `show` value the pass did not re-test, not only a move that
crosses the horizon.

## What holds

The project word list holds. I ran all 23 words and the four phrases of
`openspec/ste/words.json` against all four documents and against every line the change adds
to both source files. Not one appears. The change's only hit, `may` in a source comment, is
corrected.

The vocabulary holds on every word the project has fought for. `entity` is the word for what
the map draws, in all four documents and both source files. `marker` survives only in the
folder name and in the truncation row of `osh-026`, which is the other sense. `fresh` names
the freshness condition and nothing else. `stale` appears nowhere in the change except the
two `getSystems()` cache-flag keys in its test fixtures, at `src/data/oshLayer.test.mjs`
L1907 and L2077, which is the `osh-022` sense the file already uses at 30 other lines. `old`
appears nowhere. `reader` appears nowhere, so the object sense the live spec owns is
undisturbed. `placed`, `candidate`, `stream-placed` and `pass` each carry one meaning, and
every horizon-pass use is qualified or reads back to a qualified one within two sentences.

D59 is the part of this change I would defend to a later reader. It names the mechanism
(binary), the discriminator (sampled against unsampled), the specific alternative
(15 kilometres), the band that alternative leaves open, the requirement that band collides
with (`osh-045`), and the measurement that would reopen the question (a ground sample). Each
step can be checked against the code rather than taken on the conclusion. The round-1 version
could not be read without Cesium's documentation and rested on a quantity the depth test does
not measure; this one does neither.

D61 describes the code. The correction hoisted `refreshHorizonVisibility()` out of the
datastream loop rather than rewording the decision to match the old placement, and the new
limit clause then states what the hoist costs.

Six code citations are exact and I opened each: `src/layers/cctv/lifecycle.js:145`,
`src/layers/traffic/policy.js:176`, `src/layers/traffic/model.js:106`,
`src/data/iconOrientation.js:226`, `@cesium/engine/Source/DataSources/Entity.js:288`, and
`src/layers/osh/index.js:150` for the early return the new clause describes.

The contract's actor holds. Both sentences of the new requirement use "The browser layer
MUST", which is the form `osh-029` and `osh-045` already use at `openspec/specs/osh/spec.md`
L275 and L443. Every THEN line of `osh-061` and `osh-062` names what carries the value or
what the layer does, and none states a reason instead of a behaviour.

## Seen and not raised

`proposal.md` L3 dates the owner's report 2026-09-20 while `9b26215` is committed
2026-09-19 22:14 -0400, which is 2026-09-20 02:14 UTC. The archive folder
`2026-09-20-osh-location-streams` uses the later date the same way, so I read this as a
timezone convention, not an error.

`design.md` L76 says cctv and firms "each walk a `BillboardCollection`". cctv walks
`layerState._records` and reads `record.billboard` (`src/layers/cctv/rendering.js:145`). The
sentence's point, that both hold billboards and this layer holds entities, stands.

`design.md` L38's "not only inside a window" is an awkward contrast for a burial that is
present everywhere. The sentence before it gives the rule.

`design.md` L48's "pure math" and L62's "same physics" are loose, and neither argument rests
on them.

I did not verify the scenario hashes or the ratchet. The requirement text changed in
`f827cd0`, which rehashes both scenarios under it, and the implementer reports that the
ratchet ran and that `openspec/trace/links.json` carries the new test titles. Confirming that
needs a container, and I started none.

Verdict: PASS
