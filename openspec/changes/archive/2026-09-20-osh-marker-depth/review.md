# Review: osh-marker-depth

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-20
Gates: make ratchet CHANGE=osh-marker-depth passed; make gates pending this file
Rounds: 1
Scope: full
Reviewed-Tree: 56fa643a603c9360e91eca5e27fdfe5696ff74ab051a484f4cbd32b369027081

Both agents returned `Verdict: PASS`. Their full output is in
`review/spec-adversary.md` and `review/ste-adversary.md`.

## What the review found

**Two test gaps, both closed with a mutation-verified test.** `osh-061`'s
label clause was unasserted for the re-added selected entity — the one site
whose mechanism is reuse (`selectedSystemEntity.label`) rather than the
`entityAlwaysOnTop()` helper, so no M1-M12 mutation touched it. And every
feature fixture but the new `FEATURE_ALT` carried `alt:0`, leaving
`feature.alt || 0` mutation-proof for the feature side of the altitude
clause. Both closed at `85546c5`, with M13 and M14 added to the mutation
list. Detail in `review/spec-adversary.md`.

**Two mutations spot-checked by reading, both genuine**: M4 (the re-added
point) and M11 (the poll's horizon re-test, re-checked again after the
hoist described below). M9, M10, M12, M13 and M14 were read against the
code; M1-M3 and M5-M8 are direct value mutations the reviewer did not check
individually.

**One behaviour change from the hoist, read specifically and not raised as
a finding.** `refreshHorizonVisibility()` moved out of the poll's
`for (const datastream of datastreams)` loop and now runs once after it.
The reviewer confirmed no null-dereference window opens — `destroy()` nulls
`_viewer` and `_dataSource` only after `stopPolling()`, which cannot race a
poll in flight — but one case changed: a poll cycle whose selection changes
mid-loop now skips the pass entirely, so an entity an earlier datastream in
that cycle already moved keeps its `show` value until the next refresh or
`moveEnd`. Same bound as the accepted `osh-horizon-on-settle-only` limit,
so it became a clause on that limit (`proposal.md`) rather than a new
finding.

**31 ASD-STE100 findings from round 1 (22 against `9b26215`, nine against
`491213e`, three against the `ea38f73` clause, one the reviewer's own
round-1 miss), plus two more the correction pass introduced and caught
before sending — 33 in total, all corrected.** The two largest patterns:
`marker` surviving in the entity sense 24 times in `design.md`, 17 in
`proposal.md` and 3 in `tasks.md`, both scenario titles, the helper's name
and four assertion messages, corrected throughout to `entity`, the word
`osh-geo-discovery` round 3 already established; and the noun `pass` used
unqualified for two, then a third, then a fourth distinct sense, corrected
to "horizon pass" at every site. Full line-by-line detail, each with the
corrected text, is in `review/ste-adversary.md`.

**Two blockers came from the correction pass itself and were caught before
the reviewer's second read**, both from the `osh-horizon-on-settle-only`
clause and the `design.md`/`tasks.md` label-mutation prose: `stale` used
for a `show` flag's freshness where the project reserves that word for the
`osh-022`/`osh-023` cache flag, and `fresh` used for "newly written"
alongside its correct freshness sense. Both closed at `5f16e15`.

**One correction was itself wrong and was corrected again.** `design.md`
named `SYSTEM_B` among the fixtures the tests assert `show` on; no test
does. Corrected to the four fixtures actually asserted: `SYSTEM_A` and
`FEATURE_A` visible, `SYSTEM_FAR` and `FEATURE_FAR` hidden.

## Findings

- [x] FINDING blocker `design.md` L96 named `SYSTEM_B` among the fixtures the `osh-062` tests assert `show` on; no test does. Corrected to the four fixtures actually asserted, at `5f16e15`.
- [x] FINDING blocker `proposal.md` L41 wrote `stale` for a `show` flag's freshness, the project's reserved word for the `osh-022`/`osh-023` cache flag. Corrected at `5f16e15`.
- [x] FINDING blocker `design.md` L91, `tasks.md` L34 wrote `fresh` for "newly written", alongside the freshness condition's correct sense. Corrected to `new` at `f827cd0`.
- [x] FINDING blocker all four documents and both source files carried `marker` in the entity sense (marker/marker-depth is the change's own folder name only). Corrected to `entity` throughout at `f827cd0`, including both scenario titles, the requirement title, the helper's name (`entityAlwaysOnTop`) and every assertion message.
- [x] FINDING blocker `tasks.md` L36, L53 used `passes` as the verb for a green test. Corrected to "is green" at `ea38f73`.
- [x] FINDING blocker the noun `pass` was unqualified for two, then a third, then a fourth distinct sense across `proposal.md`, `design.md` and `tasks.md`. Every site qualified to "horizon pass", or reworded ("run" for a mutation pass, "calls it" for D62's pass-through), at `f827cd0`.
- [x] FINDING blocker `design.md` L11 defined three of six new terms, leaving `depth test`, `window` and `occluder` undefined. All six defined at `f827cd0`.
- [x] FINDING blocker `design.md` D59 (L34-L48) rested on burial depth, which a binary depth test does not measure, and never answered the 15 km alternative directly. Rewritten around the sampled/unsampled discriminator and the near/far band split at `f827cd0`.
- [x] FINDING blocker `design.md` L32 cited "the facts file" and a quoted phrase, neither in the repository. Deleted at `f827cd0`.
- [x] FINDING blocker `design.md` L32, L82 gave two different wrong counts (six, eight) for one population of nine layers. Corrected and the nine named at `f827cd0`.
- [x] FINDING blocker `design.md` L94-L98 claimed "every current fixture stays visible", which is false for an unrelated scenario's fixture 39.9° out against a 35.94° horizon. Narrowed to the fixtures actually asserted, with an explicit boundary statement, at `f827cd0`.
- [x] FINDING minor `design.md` L44, L52 used `reader` for a person, where the live spec uses that word for an object. Corrected to a named actor ("a later engineer", "an engineer") at `f827cd0`.
- [x] FINDING minor `limb` and `horizon` named one boundary in seven sites across `design.md`, `proposal.md`, `tasks.md`, `index.js` and the test file. All corrected to `horizon` at `f827cd0`/`5f16e15`.
- [x] FINDING minor `submerge`/`burial` named one idea in five sites, and "brought the submerge back" had no approved sense. Corrected to literal depth-test language at `f827cd0`.
- [x] FINDING minor `index.js` L169 carried `may`, the change's only word-list hit, invisible to `make lint` because it does not read source comments. Corrected to `can` at `5f16e15`.
- [x] FINDING minor `design.md` L68 had a missing article and a verbless fragment. Corrected at `f827cd0`.
- [x] FINDING minor three semicolons joined two ideas each, in `proposal.md` (twice) and `design.md`. Split at `f827cd0`.
- [x] FINDING minor `design.md` L3 gave `main`'s line numbers in the present tense; the shipping tree's numbers differ. Corrected by dropping the numbers entirely at `f827cd0`.
- [x] FINDING minor `design.md` L66 handed the reader a verification task instead of stating the fact. Corrected to state the Cesium fact directly at `f827cd0`.
- [x] FINDING minor `specs/osh/spec.md` L4's `its` had no clear antecedent. Corrected to name the entity explicitly at `f827cd0`.
- [x] FINDING minor `design.md` L30 packed two metaphors into one sentence. Split and de-metaphored at `f827cd0`.
- [x] FINDING minor `read` carried three senses (code value, human perception, panel text) across `design.md`. The human sense corrected to `see` at `f827cd0`.
- [x] FINDING minor `design.md` L52 named no actor for "it is set on purpose". Corrected to "This change sets it" at `f827cd0`.
- [x] FINDING minor `design.md` L80's "constructions pass through it" used `pass` as a third verb sense. Corrected to "calls it" at `f827cd0`.
- [x] FINDING minor `design.md` L108's `old` named something other than the detail panel's own word. Corrected at `f827cd0`.
- [x] FINDING minor the re-added-entity test's name said less than it asserts. Renamed to name both the point and the label at `f827cd0`.
- [x] FINDING minor two sentences over the 24-word instruction limit, in `tasks.md`. Both split at `f827cd0`.
- [x] FINDING minor `design.md` L46 repeated what L36, L38 and L42 already carried. Merged into the rejection paragraph at `f827cd0`.
- [x] FINDING minor `design.md` L44's "a window trades one camera-distance range" was hard to parse on one reading. Reworded at `f827cd0`.
- [x] FINDING minor `tasks.md` 2.1-4.3 had unchecked boxes for work already in the tree. Checked at `491213e`; 5.5 correctly stays open until this file existed.
- [x] FINDING minor `design.md`/`tasks.md`'s mutation count needed to track M13/M14. Updated to "fourteen mutations, M1 to M14" at `f827cd0`.

## Deferred (carried forward, not blocking)

The STE reviewer found four minors it does not consider blocking, and
recommends queuing rather than fixing now, since two of them (the spec
sentence length and the `on top` reading) would themselves rehash `osh-061`
if touched in isolation. Recorded here by name, as prose, so a later change
picks them up rather than rediscovering them:

Twelve paragraphs across `proposal.md` and `design.md` run to exactly six
sentences, at the rule's limit rather than under it — `proposal.md` L5 and
L41, `design.md` L11, L32, L34, L36, L42, L56, L58, L62, L66 and L68. Each
needs one paragraph break; the reviewer named where in each.

Two sentences sit at exactly 25 words, the rule's limit: `specs/osh/spec.md`
L4, which grew by one word when `its` became `the entity's` in this round's
fix, and `tasks.md` L55, which grew by one word when "The pass call" became
"The horizon pass call". Both need one word cut; the reviewer supplied
replacement text for each.

`specs/osh/spec.md` L4's "on top of the terrain and the mesh" still reads
in the spatial sense, while `design.md` L11 defines `on top` as never
taking the depth test — no scenario behaviour is ambiguous, but the phrase
now sits in the scenario title too, so fixing it rehashes both scenarios.
Left for a change that touches this scenario anyway.

Two metaphors with no approved sense remain: `design.md` L32's "Traffic's
window works" and L74's "The fix is cheap". The reviewer supplied literal
replacement text for both.

## What holds

The project word list holds across all four documents and both source
files: every word and phrase in `openspec/ste/words.json` was checked and
none appears except the corrected `may`. `entity` is the word for what the
map draws, everywhere. `marker` survives only in the folder name (with the
proposal's own paragraph explaining why) and the pre-existing truncation
row of `osh-026`. `fresh`, `stale`, `old` and `reader` each carry one
meaning, undisturbed from the rest of the project.

D59 is the section the spec-adversary said it would defend to a later
reader: it names the mechanism (binary), the discriminator (sampled
against unsampled), the specific alternative (15 km), the band that
alternative leaves open, the requirement that band collides with
(`osh-045`), and the measurement that would reopen the question. D61
describes the code as it now stands, because the hoist fixed the
behaviour rather than the design being reworded around the old placement.

The depth and height rules are applied at every site the design names —
five of five constructions — and the rendering assertions compare against
outside values (`Infinity`, `Cesium.HeightReference.NONE`, a fixture's own
number read back through `Cartographic.fromCartesian`), never against a
value the layer itself produced. The horizon pass is pinned with the real
`EllipsoidalOccluder`, not a stub, against fixtures at the exact antipode.

Six code citations were opened and confirmed exact, including
`@cesium/engine/Source/DataSources/Entity.js:288`, which backs D61's claim
that `Entity.show`'s setter returns early for an unchanged value.

## Not verified by the reviewers

Neither reviewer started a container. The ratchet and gate verdicts in
this file are the implementer's own runs, read from each command's output,
not re-run by either agent. The spec-adversary confirmed the commit order
of the trace files (`8aa3421` follows `85546c5`) by reading `ids.json` and
`links.json`, but did not recompute either hash. The team lead separately
confirmed `links.json` carries both renamed test titles from `f827cd0`
("across the horizon" present, "across the limb" absent) and neither old
title survives.
