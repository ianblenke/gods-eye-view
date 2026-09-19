## Context

The detail panel shows a datastream's newest observation, whatever its own time says. The shipped query looked stable. On one server, in one day, it gave two different answers.

In the morning, against a broken database, it gave the oldest record. In the evening, against the restored database, it gave the newest record. Both answers came back as `200`. Nothing in the payload told them apart.

A guard on the query's meaning is a guard on a fact this project cannot see and cannot fix. A guard on the record's own age is a guard on a fact the record itself carries, whatever the query means. This change builds that guard.

The owner's OSH server runs two to five seconds ahead of the provider. This shows up in several live streams read on the evening of 2026-09-18. A live reading's `phenomenonTime` sits two to five seconds ahead of the provider's clock at serve time. So a live reading's age is negative. Negative is the freshest age on this server.

## Goals / Non-Goals

**Goals:**
- State the age of every observation the provider serves, computed at serve time from the provider's own injected clock, never stored in a cache.
- Move an entity only from a fresh record. Name the freshness threshold in the spec, not only in the code.
- Show the age of every datastream in the detail panel. Mark one that is not fresh, so a viewer never reads an old observation as a fresh one. The word `stale` keeps its shipped meaning in this project, which is the cache flag of `osh-022` and `osh-023`. The condition this change adds is *not fresh*, and `old` is only the word the panel shows.
- Treat a negative age as fresh. A guard that needs a non-negative age must fail against this server's own clock skew.

**Non-Goals:**
- Change the observation query. The query's meaning turned out to depend on the server's database state, not on anything this project controls. This change makes the age true under either meaning, so the query stays.
- Read a datastream's schema, or move an entity from any source but the selected system's own newest observation. A later change reads the schema and adds a location survey across systems.

## Decisions

### D39 The route computes the age, once, at serve time

`oshObservationAgeMs(phenomenonTime, nowMs)` in `src/data/oshObservations.js` is pure: `nowMs` minus `Date.parse(phenomenonTime)`, or null when the time is absent or does not parse. The observations route calls it with the provider's injected `now()` when it answers, and adds `ageMs` to the observation it serves. The cache never stores an age, so a stale snapshot served twice carries a larger age the second time. The browser source passes `ageMs` through and computes nothing; the browser clock is never part of an age.

The age compares two clocks, the provider's and the server's, so it carries their difference. The owner's server runs two to five seconds ahead of the provider. So a live record has an age of about minus two to minus five seconds. A negative age is fresh.

A guard that needs a non-negative age, or that treats a negative one as unknown, rejects every live reading from that server. No marker ever moves. A test names that broken guard, so it is ruled out.

### D40 Fresh is two named bounds

`OSH_FRESH_MAX_AGE_MS`, one hour, and `OSH_CLOCK_SKEW_MAX_MS`, five minutes, are exported from `src/data/oshObservations.js` beside `isOshObservationFresh(ageMs)`: true only for a finite `ageMs` at or under the first bound and no further below zero than the second. Null is never fresh. The layer and the detail both import the set, so the same two numbers decide both.

The lower bound exists because the upper one alone is not a freshness rule. Without it, a `phenomenonTime` a year in the future gives an age of about minus thirty-one thousand million, which is under one hour, so the record reads as the freshest the panel can show and moves an entity. That is this change's own defect, mirrored: a record from another month drawn as current. The measured skew on the owner's server is two to five seconds, so five minutes is a generous allowance for drift and still refuses a month.

Both numbers are pinned by a test against their literals. Every other test uses the symbols, and a test that uses only the symbol moves with the constant, so it proves nothing about the number the specification names.

One hour is a statement about this project's confidence in a position, not about the server. Its consequence: most mesh stations never move from an observation, because their newest record is often days old. That is correct. The feature geometry places them, and `osh-selected-only-motion` already limits motion to the selected system. So the visible effect is one marker at most.

### D41 The poll moves an entity only from a fresh record

`pollSelected()` in `src/layers/osh/index.js` moves the selected system's entity only when the observation has a location and `isOshObservationFresh(observation.ageMs)` is true. The rest of `osh-031` holds unchanged.

### D42 The detail shows the age in words

`formatOshAge(ageMs)` in `src/layers/osh/detail.js` is pure: `12 s`, `5 min`, `3 h`, `6 d`, or `age unknown` for a null or otherwise non-finite age. A negative age reads as `0 s`, not as a negative amount. Each datastream block shows the age below its time. This holds whether or not that datastream has an observation yet.

One with none reads `age unknown`, the same words a null `phenomenonTime` gives. A block whose observation is not fresh carries the class `osh-detail-old`. A block whose age is a number past the threshold also carries the text `old`. An unknown age never carries that word, because the age is not known to be large. The mark reads as text, in any theme and in a test, not by colour alone.

### D43 How the gates measure this change

Coverage: `oshObservations.js`, `osh.js`, `source.js`, `index.js` and `detail.js` stay at 100% line, branch and function coverage. Trace: `osh-050` tags new tests; `osh-031` and `osh-032` each have at least one changed test with its tag, which `TRACE-ID-CHANGED-NO-TEST` demands. Spec lint and STE lint as before.

## Risks / Trade-offs

- **A wrong clock reading makes every age wrong by the same amount.** The provider trusts its own `now()`; nothing checks it against a time authority. Accepted, because the alternative — trusting the server's own claim about freshness — is the defect this change closes.
- **One hour is a guess, not a measurement of how often any one station reports.** A station that reports every ninety minutes never shows as fresh. Accepted for this change; a later change can tune the threshold from more data.

## Migration Plan

None. The route, the layer and the detail change in place; no stored data or on-disk cache changes shape.

## Open Questions

None.
