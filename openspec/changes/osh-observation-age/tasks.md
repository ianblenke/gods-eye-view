## 1. Spec and proposal

- [x] 1.1 Write `specs/osh/spec.md`: `osh-050` ADDED, `osh-031`/`osh-032` MODIFIED, the rest carried from `main`.
  - Carried byte for byte from `git show origin/main:openspec/specs/osh/spec.md`: `osh-022`, `osh-023`, `osh-028`, `osh-029`, `osh-030`, `osh-033`, `osh-046`, `osh-049`.
- [x] 1.2 Write `proposal.md` with the Why, both measurements with their dates and their database, the Impact and the closed limits.
- [x] 1.3 Write `design.md` with D39 to D43.
- [x] 1.4 Write `tasks.md` from this list, with the rules-out line under each test task.

## 2. Age and freshness

- [x] 2.1 Write the `[osh-050]` tests of `oshObservationAgeMs()` and `isOshObservationFresh()` in `oshObservations.test.mjs`.
  - Cases: a parsed time, an absent time, the text `NaN`, the threshold at one hour and one hour plus one millisecond, and null.
  - Also: a `phenomenonTime` five seconds ahead of `nowMs`, which gives a negative age that is fresh.
  - Rules out: a function that treats null as zero. One that uses `<` instead of `<=` at the threshold. One that reads the browser or wall clock instead of `nowMs`. One that clamps a negative age to zero or to null. One that needs `ageMs >= 0`, which would reject every live reading from a server whose clock runs ahead.
- [x] 2.2 Write both functions and the constant until 2.1 passes.
- [x] 2.3 Write the `[osh-050]` route tests in `oshProxy.test.mjs`.
  - Cases: `ageMs` from the injected `now`; a larger age on a second cached answer; `ageMs:null` with no `phenomenonTime`; `observation:null` stays null.
  - Rules out: an age computed at cache time that does not grow; an age stored in the cache. A route that adds `ageMs` to a null observation.
- [x] 2.4 Change the observations route in `osh.js` until 2.3 passes.
- [x] 2.5 Write the `[osh-050]` source test in `source.test.mjs`: the getter returns `ageMs` as served.
  - Rules out: a source that strips or recomputes the field. Keep-test on the shipped source: it passed before any edit to `source.js`.

## 3. Motion and detail

- [x] 3.1 Change the `[osh-031]` layer tests for the freshness gate.
  - Cases: a fresh record moves; a negative `ageMs` moves; one millisecond past the threshold does not; `ageMs:null` does not; no-location and refresh cases keep.
  - Rules out: the shipped poll, which moves on any location; a poll that treats null as fresh; a poll that refuses a negative age.
- [x] 3.2 Change `pollSelected()` in `layers/osh/index.js` until 3.1 passes.
- [x] 3.3 Change the `[osh-032]` detail tests for the age display.
  - Cases: age words for seconds, minutes, hours, days; `old` and class past the threshold; `age unknown` for null and for no observation; escapes keep.
  - Rules out: a renderer that shows the time alone; one that marks old by class with no text; one that shows `0 s` for null.
- [x] 3.4 Write `formatOshAge()` and change `renderDatastream()` in `detail.js` until 3.3 passes.

## 4. Gates and review

- [x] 4.1 Run `make lint` until no STE error remains.
- [x] 4.2 Run `make ratchet`.
- [x] 4.3 Run `make gates`. Confirm the five files stay at 100%.
- [ ] 4.4 Run `/opsx:review osh-observation-age`, correct the findings, and record the result in `review.md`.
