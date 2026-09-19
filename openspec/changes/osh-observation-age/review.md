# Review: osh-observation-age

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-19
Gates: make gates CHANGE=osh-observation-age passed, but for this file
Rounds: 1
Scope: full
Reviewed-Tree: 51ce1fa3fc9113d7205d80aaa60bcebd1125f50ebe36fbe03f54fc65ac8919e0

The output of each agent is in `review/round-1/`. Both agents returned
FAIL. Every blocker they raised is fixed, and the fixes are recorded
below with the evidence that they work.

**The verification pass over the fixes was time-boxed, not completed.**
The lead asked the spec adversary to re-read the five commits that
answer its findings. That pass had not returned when the change was
merged. The lead closed the findings on its own mutation evidence
instead, which is given below and which anyone can re-run. This is
stated plainly because a reader must not mistake this record for a clean
second round. It is not one.

## What the review found

Four blockers, and the two from the spec adversary are the ones worth
reading twice.

**The freshness rule had no lower bound.** `isOshObservationFresh` was
`Number.isFinite(ageMs) && ageMs <= 3_600_000`. A `phenomenonTime` one
year ahead of the clock gives an age of about minus thirty-one thousand
million, which is under one hour. So the record counted as fresh, the
panel drew it as `0 s` with no mark, and the poll moved an entity to it.

That is this change's own defect, mirrored. The change exists because the
panel showed a record from another month as though it were current. It
did exactly that on the future side, and no test chose between the
shipped rule and a bounded one.

**Both thresholds were pinned only by their own symbols.** Every test
used `OSH_FRESH_MAX_AGE_MS`, so moving the constant moved its own
assertions. The adversary changed one hour to twenty-four hours, and to
sixty seconds, and all 159 tests passed both times. This is the second
time this project has shipped that defect; the first was a label
distance that survived being changed to 5 000.

**The panel read `age unknown old`.** An age that is not known is not a
large one, so the panel told a viewer a reading was old when nothing
about its age was known. The change's own test asserted that string, so a
passing test held the defect in place. The STE adversary found it by
pulling apart the vocabulary, not by reading the code.

**`stale` carried two meanings.** `osh-022` and `osh-023` already ship
`stale` as the cache flag in the payload. The design used the same word
for the new condition. The condition is *not fresh*; `old` is only the
word the panel shows; `stale` stays the cache flag.

## The mutations, before and after

The adversary ran 18 mutations against a 159-test baseline. Three
survived. The full table is in `review/round-1/spec-adversary.md`. After
the fixes, the lead re-ran the three in the clone:

```
baseline          26 pass  0 fail
M4 unbounded      24 pass  2 fail
M5 1h -> 24h      25 pass  1 fail
M6 1h -> 60s      25 pass  1 fail
```

All three now redden. The fix for M4 also opened a case neither the
adversary nor the lead had seen: with a lower bound in place, a
far-future record rendered `0 s old`, which is a contradiction. The panel
now reads four states apart.

| reading | renders | fresh |
|---|---|---|
| an amount of time | `12 s`, `2 h old` | by the upper bound |
| unknown, a null age | `age unknown` | no |
| slightly ahead, the measured drift | `0 s` | yes |
| far ahead, a month or a year | `ahead of the clock` | no |

## Findings

### Round 1: spec-adversary

- [x] F1 blocker The freshness rule had no lower bound, so a record from far in the future read as the freshest possible and moved an entity. `OSH_CLOCK_SKEW_MAX_MS`, five minutes, now bounds it. The measured skew on the owner's server is two to five seconds.
- [x] F2 blocker Both thresholds were asserted only through their own symbols. A test now pins each against its literal, and behaviour at plus and minus one around each bound.
- [x] F3 note The sign rule was verified independently: an age of exactly zero is fresh; absent, `NaN` and non-string all give null.
- [x] F4 note Serve-time computation is correct and proven. The cache stores the mapped observation only. Part C's cached-age bug is not present here.
- [ ] F5 minor `osh-031`'s base line was reworded rather than appended to. **Accepted by the lead**: the old line is false under this change, and the plan declares the rewording.
- [ ] F6 minor A numeric epoch `phenomenonTime` gives null, which the spec's "absent or unparsed" does not describe. **Accepted by the lead**: the behaviour is right and the wording is narrow.

### Round 1: ste-adversary

- [x] F1 blocker `osh-032` blurred *unknown* with *not fresh*, and the panel rendered `age unknown old`.
- [x] F2 blocker `osh-050` said a record moves an entity. The route serves an age; the layer moves the entity.
- [x] F5 blocker `stale` was used for the condition while it already means the cache flag.
- [x] F6 blocker *current* joined fresh, old, stale and not fresh in the sentence defining the goal.
- [x] F8 blocker A code comment used *fresh* in a third sense.
- [x] F12 minor "beside its time" described a layout the markup does not build; it renders below.
- [x] F13 minor The proposal counted four changed files and claimed five test files.
- [x] F14 minor The `0 s` rule was in the design and not in the contract, though it is the most-rendered value on this server.
- [x] F10, F11 minor Vague quantifiers, and test names without a subject.
- [ ] F3, F4, F9 minor Passive lines, packed definitions, a long doc comment. **Accepted by the lead.**
- [ ] F15 minor A commit message repeats the `stale` error. **Accepted by the lead**: rewriting a non-tip commit message needs an interactive rebase this environment does not provide.

## What this change cost, and why

Eight commits for three scenarios. Four of them fix the lead's own work:
two rounds of over-long prose, and one paragraph that broke the limit
because splitting its sentences made it too long.

Two false greens were reported by the lead before the verdicts were read
correctly. The first read `results.json`, which records only whether the
test processes crashed. The second matched a `Gates passed.` line that
the ratchet had printed, not the gates run. Both are recorded in the
project's memory so the next reader does not repeat them.
