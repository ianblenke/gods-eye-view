**Round 1, STE adversary — osh-observation-age.** Scope: full, against `8ca0002`. Read-only.

**1. BLOCKS — `osh-032` blurs *unknown* with *not fresh*.** The line read: "a block whose observation is not fresh carries the text `old` and the class `osh-detail-old`, and one with `ageMs:null` carries the text `age unknown`". That reads as two exclusive cases. The code marks a null age **both** ways: `renderAge(null)` emits the class and the text `age unknown old`. The change's own test asserted it. A contract line that hides a behaviour its test asserts.

Related, and user-visible: the panel renders the string **`age unknown old`**. Two words for two different states in one phrase. It tells the viewer the reading is old when the age is in fact unknown.

**2. BLOCKS — `osh-050` names the wrong actor.** "a record whose `phenomenonTime` is ahead of the injected `now` keeps its negative age and moves an entity". The WHEN is the observations route answering. The route moves no entity; the layer does, and `osh-031` already states it. A record is not an actor. Two behaviours, two components, one THEN.

**5. BLOCKS — `stale` carries two meanings.** The design used "a stale one" for *not fresh*, while `osh-022` and `osh-023` already ship `stale` as the cache flag in the payload. One word, one meaning: `stale` must mean only the cache flag. Use *not fresh* for the condition and *old* only for the rendered word. The commit message has the same error.

**6. BLOCKS — a fourth synonym.** "never mistakes an old reading for a current one" adds *current* beside fresh, old, stale and not fresh, in the sentence that defines the goal.

**8. BLOCKS — a third meaning of *fresh* in a code comment.** `server/providers/osh.js` said the age is "computed **fresh** on every answer", in a change whose whole subject is *fresh*. Write "recomputed on every answer".

**Minors, accepted by name.**

- **3.** Passive and personified lines in the scenario; one is carried from `main`.
- **4.** Three definitions packed into one AND, and "pure" as undefined jargon.
- **9.** A fifty-five word doc comment chain on `oshObservationAgeMs`.
- **10.** "a few seconds ahead" where the design carries the measurement, two to five seconds.
- **11.** Three test names with no subject or with idiom.
- **12.** "shows the age **beside** its time" — the markup emits two block elements, so the age renders **below** the time. A layout claim the code does not keep.
- **13.** The proposal counts four changed files and claims five test files for them.
- **14.** The `0 s` rule for a negative age is in the design and not in the spec. A negative age is the normal live case on this server, so it is the most-rendered value of the set and the contract does not mention it.

**On the lead's ruling for finding 1**, keep the class and drop the word. The class is the only thing that stops an unknown age from rendering like a fresh one, and the text already names the state exactly. What the styling says is "do not trust this position", which is true of both states; only the word `old` makes the false claim that the age is a number and large. The class encodes *not fresh*, so `osh-detail-not-fresh` would be the honest name, but that is CSS churn and I would not hold the change for it. Do not use `osh-detail-stale`: `stale` is the cache flag now.

Verdict: FAIL
