# Review: osh-geo-discovery

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-18
Gates: make gates CHANGE=osh-geo-discovery passed
Rounds: 4
Scope: diff 020fb86
Reviewed-Tree: adb0fdb9dc9d75293fa2457c5ba30bfa651113f82778c61d97497232666fe210

The output of each round is in `review/round-<n>/`. The output in `review/`
is the output of round 4, where both agents gave PASS.

Rounds 1 to 3 ran on the branch. Round 4 is a confirmation round that ran
after the merge, because the merge went to `main` before the change was
archived and before this file existed. The `Scope` line names `020fb86`,
the commit that round 3 read from. Round 4 read the one commit after it,
`341e299`, and the archive commit `b959c05`.

Three of the four rounds found something that changed the code.

## What the review found

The change was reviewed for one property above all: that a test proves
what its scenario claims. Each round found a different way for that to
fail, and the third corrected the reviewer of the first two.

- **Round 1 found code with no test.** `index.js` cleared the selection
  when the selected feature left the refreshed list, and no test executed
  the branch. Deleting those three lines left the whole suite green. The
  spec asserted the behaviour twice, and the task list marked the work
  done.
- **Round 2 found a test that proved nothing.** The label rule says 200 km.
  The test asserted that the drawn value equalled the constant it was
  drawn from, so both sides moved together. Setting the constant to 5 000
  left 48 of 48 tests passing.
- **Round 3 found a deleted branch that was reachable.** The author removed
  a staleness guard and argued it could not run. The author and the lead
  both checked for an `await` between the guard and the throwing code and
  found none. The adversary found that a synchronous region can still
  re-enter through a source-supplied accessor, and proved it with three
  probes.

Two of those came from mutation, not from reading. The adversary ran every
mutation the plan named, and named the single test that each one turned
red. Where a mutation turned nothing red, it said so and judged whether
the survivor was a gap or an equivalent mutant.

## Two decisions the review changed

**The system map is a union, and the feature map is not.** The systems
list samples: consecutive walks of it share about a twentieth of their
ids, and a walk repeats itself. The shipped layer cleared the selection
whenever a refresh omitted the selected system, so a click would expire
within one refresh. The union fixes that. The feature list is stable, so
the feature map drops what a refresh omits. The distinction is the whole
of `osh-049`, and it exists because the review forced the two collections
to be treated differently.

**A synchronous throw and a rejection now behave the same.** The getters
were called inside the `Promise.allSettled` argument list, so a getter
that threw synchronously escaped past `allSettled` and discarded the whole
update, including the successful systems read. The same failure as a
rejection kept the systems drawn. No scenario justified the difference,
and the only explanation for it was that a source adapter had not been
written as an async function. The lead chose to change the code rather
than write the asymmetry into the specification. Three tests collapsed
into one, and `osh-046` became true as written.

## Findings

### Round 1: spec-adversary

- [x] F1 blocker A spec'd behaviour had no test; deleting the code passed the suite. A test now selects a feature, drops it from the next refresh, and asserts both selections and the poll stop.
- [x] F2 major `osh-049`'s poll clause did not discriminate. The union test now advances the timer and asserts the poll continued; the new test asserts the poll stopped.
- [x] F3 major `osh-047` required a `400` for an absent `system` key, which contradicted `osh-048`. The WHEN was narrowed to a present key, and a THEN now covers the fall-through.
- [x] F4 major The `catch` body was dead, and no scenario described it. See round 2 and round 3.
- [x] F5 minor `osh-045`'s label rule was vaguer than the code. See round 2 F2.
- [x] F6 minor `spec.md` overstated `disable()`. It now says `disable()` does not empty the map.
- [x] F7 minor A `keyRequired` features answer had no THEN. One was added to `osh-046`.

### Round 1: ste-adversary

- [x] F1 major `osh-041`'s WHEN was byte-identical to `osh-024`'s while "feature" meant two things. `osh-041` now names its actor.
- [x] F2 minor `osh-005`'s WHEN stated a failure, with a singular pronoun for two sets.
- [x] F3 minor `osh-044`'s THEN mixed a rule with its consequence.
- [x] F4 minor `osh-045`'s THEN joined two unrelated events.
- [x] F5 minor D33 read as the wrong adapter. On challenge the adversary confirmed the sentence was accurate about the code, so the fix named the input instead of changing the claim.
- [x] F6 minor "four layers" was a metaphor, and "layer" already had a meaning here.
- [x] F7 major Synonym drift: feature of interest, feature, node; host system, host, gateway.
- [x] F8 major Marker and entity drift across four documents.
- [x] F9 minor Vague quantifiers where a rule belonged.
- [x] F10 minor Metaphor and hedge in D31, D32 and D34.
- [x] F11 minor "A marker must open something" was idiom.
- [x] F12 minor An ambiguous "that" in the proposal.
- [x] F13 minor A hedged passive in the proposal.
- [x] F14 minor Test names too long, or stating more than one thing.
- [ ] F15 minor Commit-message wording on a commit that is not the tip. **Accepted by the lead**, because rewriting a non-tip commit message needs an interactive rebase this environment does not provide. The tip commit was corrected.

### Round 2: spec-adversary

- [x] F1 blocker The three synchronous-throw tests asserted the negation of `osh-046`. The code changed so that a throw and a rejection behave alike.
- [x] F2 blocker The label assertion was a tautology: both sides were the same imported symbol. It now asserts the literal the spec states, and the constant is module-private again.
- [x] F3 major A test proved something `osh-045` did not claim. A THEN was added.
- [x] F4 major Closing round-1 F3 orphaned two tests. A THEN now covers the absent key, and both tests stay where they are.
- [ ] F5 minor The `getFois`-absent guard has no test; a mutation of it survives all 251 tests. **Accepted by the lead**: pre-existing logic, relocated by this change, cleared in rounds 1 and 2.

### Round 2: ste-adversary

- [x] F1 blocker The marker-to-entity sweep left three test names behind, one the direct twin of a name this change added, while the change itself added a rule that STE lint checks every test name.
- [x] F2 major Two test names added in the round broke the rule.
- [x] F3 minor `osh-005`'s WHEN still stated a failure.
- [x] F4 minor Two vague quantifiers survived.
- [x] F5 minor A verbless fragment in D31.
- [x] F6 minor The ledger commit message had no verb.

### Round 3: spec-adversary

- [x] F1 major The comment justifying the deleted branch was false: the branch is reachable through a source-supplied accessor, proved with three probes. The comment now states the invariant it actually rests on. The branch stays deleted, and `osh-029` already sanctions the observable result.
- [x] F2 note The proposed guard for the destroyed-layer case was refused, and the adversary gave the deciding reason: `destroy()` nulls the data source and `disable()` does not, so the guard would cover one of two sibling paths while reading as a complete defence.

### Round 3: ste-adversary

- [x] F1 blocker "point" collided with the GeoJSON `Point` one clause away, in two documents. The lead's round-2 ruling to delete "node" had pushed the writer toward the worse word. Both now read "station".
- [x] F2 blocker The comment's referent pointed the wrong way: it said "the code below" when the throwing code is above.
- [x] F3 minor The last "marker" in the entity sense, in a JSDoc line.

### Round 4: both agents

Both confirmed the three edits and gave PASS. The spec adversary also
compared the archived spec against the delta it had reviewed: all 23
scenarios are byte-identical, and the four change files moved with
zero-line diffs, so the archive step moved the text and did not alter it.

## What the gates could not see

Two failures reached `main` and were caught by CI, not by the review or
the local gates.

- The layer gained an import of `src/data/oshSystems.js`, and the package
  manifest did not give that module to the `osh-layer` package. `make
  gates` does not run `npm run check:boundaries`; CI does. Fixed in
  `7fcef8d`.
- The change was merged before it was archived. Fixed in `b959c05`.

Neither is a finding against the reviewers. Both agents reviewed the diff
they were given, and both were right about it. What nobody checked was
whether the local gate command runs the checks CI runs. Until that is
fixed, "gates green" does not mean "CI will pass", and each agent must
read `.github/workflows/ci.yml` and satisfy every step by hand.
