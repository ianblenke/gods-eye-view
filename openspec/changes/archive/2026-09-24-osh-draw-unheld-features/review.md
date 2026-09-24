# Review: osh-draw-unheld-features

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-24
Gates: make gates CHANGE=osh-draw-unheld-features passed
Rounds: 2
Scope: diff 27126e7
Reviewed-Tree: 4b9b4b2201f964e99647aab7544f14e48630c0060095332f2cf984d7be5fac08

## Findings

- [x] Round 1 spec-adversary F1 (major): no test fixed the "newer wins" rule of an unheld feature, because the only test lists the older location first. A new `[osh-058]` test lists the newer location first. The mutation A13 (a constant true) fails it.
- [x] Round 1 spec-adversary F2 (major): the layer wiring of `Placed by` for a held feature that a stream moves had no test. A new `[osh-032]` layer test selects a held feature and checks its name and `Placed by`. The mutation L7d, in two readings, fails it.
- [x] Round 1 spec-adversary F3 (major): the documents said that a test has the tags `[osh-057 osh-059]`, and none has. The documents now say that the `[osh-057]` test keeps its name and its tag. An `[osh-059]` test now asserts that `placed.stream` is zero, and the mutation L13 fails it.
- [x] Round 1 spec-adversary F4, F13 (minor): a uid that equals a held id, and the host of a click after a failed features read. Recorded as the known limits `osh-feature-key-collision` and `osh-failed-read-click-host`.
- [x] Round 1 spec-adversary F5, F6, F8, F10 (minor): the base text of `osh-042` and `osh-057`, the depth defect that `osh-061` and `osh-062` already fix, the ordinal of the option in D54, the `osh-059` wording, and the name of the limits section. All corrected.
- [x] Round 1 spec-adversary F7 (minor): the tasks are checked, and the mutation report below records one result for each mutation of the ledger.
- [x] Round 1 spec-adversary F9 (minor): two old test names say that a location is dropped. An existing test keeps its name, so the names stay. Recorded as the known limit `osh-042-old-test-names`, and D56 says it.
- [x] Round 1 spec-adversary F11 (minor): the prose stated proportions and shapes of the owner's server. It had no name, id, count or place, but it is now written with facts of the data model only, and the proportions are removed.
- [x] Round 1 spec-adversary F12 (minor): refuted. The change adds 12 lines `t.after(() => layer.destroy(viewer))`, all in its own new tests. The teardown of the existing tests is the text of `main`.
- [x] Round 1 spec-adversary F14 (minor): the gate output does not itemise the warnings. The STE lint has 0 errors.
- [x] Round 1 ste-adversary S1 to S10 (major): the base text of the delta, the depth defect, the ordinal of the option, the false `[osh-057 osh-059]` test, the list of modified scenarios, the range of decisions D52 to D58, the failed features read, the one-entity-id rule, the `osh-059` wording and the meaning of "failed". All corrected. The one-entity-id rule is now true only for a location whose `foiId` is the `id` of the held feature, and the known limit `osh-feature-key-split` records the other case.
- [x] Round 1 ste-adversary S11, S13, S14, S20, S21, S26 (minor): the prose about the server, the eleventh `[osh-059]` test in task 3.1, "hold" in three places, "stands in for", "Reddens", and the two tasks with two instructions. All corrected.
- [x] Round 1 ste-adversary S12 (minor): the known limit `osh-042-old-test-names`.
- [x] Round 1 ste-adversary S16, S22, S24, S25, S27, S30 (minor): corrected at the places that the findings name. Other places with the same words are kept, because the lint has 0 errors and each sentence has one clear meaning.
- [x] Round 1 ste-adversary S15, S17, S18, S19, S23, S28, S29 (minor): kept. They are opinions about "name" and "read" as words, "would", the passive voice, figurative words and test names. A rename of a tagged test after the review needs a new round.
- [x] Round 2 spec-adversary F1, F2, F3, F5 (minor): the leftover proportion in proposal.md, the third sentence of the proposal, three false phrases in D54 (the set of entity ids, the name in the detail, "before this change"), and the indent and the order of five lines of the ledger. All corrected.
- [x] Round 2 spec-adversary F4 (minor): the wording of a clause of `osh-059` about the record of a stream-drawn feature. Recorded as the known limit `osh-059-record-wording`.
- [x] Round 2 ste-adversary S31 to S38, S40, S41 (minor): the actor of `partial:true`, the words "the `foiId` of its record", the name in the detail and the host of a click, the collision limit, the form "Then the test fails", the indent of the ledger, two instructions in one task, the freshness sentence, "hold" and "have" for the collection, and the reason for the host name. All corrected in the proposal, the design and the tasks.
- [x] Round 2 ste-adversary S39, S42, S43 (minor): kept. S39 renames a test that is new in this change, and S42 rewrites the lines of `osh-060`. Each change touches a test or the spec after the review, and needs a new round. S43 lists words of round 1 that the lead corrected only at the places that the findings name.
- [x] Scope: round 1 read the whole change. Round 2 read the diff since the commit `27126e7`, which is the tree that round 1 read. The four documents were compared with their text in that commit.
- [x] Trace: the ratchet opens and closes no gap, as the proposal says. The V8 drift of `src/data/labelArbiter.js` is not an edit of this change, so its entry and its history lines stay equal to `main`.
- [x] Constraints: the change adds no request and changes no provider file. Every id in the diff has the prefix `foi-fixture-`, `sys-fixture-` or `ds-fixture-`. No test calls a server. No existing test is renamed.

## Coverage of the changed code files

The gates ran in the Docker image (Node 24).

- [x] `src/data/oshSystems.js`: 223 of 223 lines, 110 of 110 branches, 13 of 13 functions.
- [x] `src/layers/osh/index.js`: 629 of 629 lines, 194 of 194 branches, 37 of 37 functions.
- [x] `src/layers/osh/detail.js`: 133 of 133 lines, 61 of 61 branches, 11 of 11 functions.

## Mutation report

Each mutation ran on the final code, in a private copy, with the host `node --test` (Node 26) on the three test files. The baseline passed (35, 90 and 30 tests), and each file was restored after its run. Each mutation failed the test that the ledger names. A mutation with more than one reading ran in each reading.

- [x] A1: 20 tests failed, including `[osh-058]` a fresh location that names an unheld feature and 19 more.
- [x] A2: 6 tests failed, including `[osh-042]` a fresh location naming an unknown feature is and 5 more.
- [x] A3: 3 tests failed, including `[osh-058]` the drawn feature has the stream-placed shape: foiUid and 2 more.
- [x] A4: 2 tests failed, including `[osh-058]` the drawn feature has the stream-placed shape: foiUid and 1 more.
- [x] A5: 1 test failed, including `[osh-058]` a location with foiUid alone draws a feature.
- [x] A6: 1 test failed, including `[osh-058]` the newer of two fresh locations that name.
- [x] A13: 1 test failed, including `[osh-058]` a newer location that comes first wins over.
- [x] A7: 1 test failed, including `[osh-058]` a location that is not fresh draws no.
- [x] A8: 4 tests failed, including `[osh-058]` a held feature is moved, not drawn a and 3 more.
- [x] A9: 6 tests failed, including `[osh-058]` the drawn feature has the stream-placed shape: foiUid and 5 more.
- [x] A10: 5 tests failed, including `[osh-058]` the drawn feature has the stream-placed shape: foiUid and 4 more.
- [x] A11: 19 tests failed, including `[osh-058]` a fresh location that names an unheld feature and 18 more.
- [x] A12: 2 tests failed, including `[osh-042]` a feature that a location moves carries the and 1 more.
- [x] L1: 6 tests failed, including `[osh-059]` the map holds osh-foi:<id> for a stream-drawn feature and 5 more.
- [x] L2: 3 tests failed, including `[osh-059]` the map holds osh-foi:<id> for a stream-drawn feature and 2 more.
- [x] L2b: 3 tests failed, including `[osh-059]` the map holds osh-foi:<id> for a stream-drawn feature and 2 more.
- [x] L2c/host: 1 test failed, including `[osh-059]` three fresh unheld features of one host at.
- [x] L2c/position: 1 test failed, including `[osh-059]` three fresh unheld features of one host at.
- [x] L3: 3 tests failed, including `[osh-059]` the map holds osh-foi:<id> for a stream-drawn feature and 2 more.
- [x] L4: 2 tests failed, including `[osh-059]` a click on a stream-drawn feature selects its and 1 more.
- [x] L5: 2 tests failed, including `[osh-059]` placed.streamFeatures counts the stream-drawn feature and not the and 1 more.
- [x] L6: 2 tests failed, including `[osh-059]` placed.streamFeatures counts the stream-drawn feature and not the and 1 more.
- [x] L7: 1 test failed, including `[osh-059]` the detail for a selected stream-drawn feature shows.
- [x] L7b: 2 tests failed, including `[osh-059]` the detail for a selected stream-drawn feature shows and 1 more.
- [x] L7c: 1 test failed, including `[osh-059]` the detail for a selected stream-drawn feature shows.
- [x] L8: 2 tests failed, including `[osh-059]` a refresh with no fresh location for a and 1 more.
- [x] L9: 1 test failed, including `[osh-059]` a selected stream-drawn feature keeps its selection across.
- [x] L10: 1 test failed, including `[osh-060]` one entity id across a held refresh, a.
- [x] L11: 1 test failed, including `[osh-059]` destroy() forgets the stream-drawn feature and zeroes placed.streamFeatures.
- [x] L12: 6 tests failed, including `[osh-042]` a fresh location naming an unknown feature is and 5 more.
- [x] L13: 2 tests failed, including `[osh-057]` a fresh location that names a feature moves and 1 more.
- [x] L7d/effective: 1 test failed, including `[osh-032]` the detail for a selected held feature that.
- [x] L7d/not-held: 1 test failed, including `[osh-032]` the detail for a selected held feature that.
- [x] D1: 4 tests failed, including `[osh-059]` the detail for a selected stream-drawn feature shows and 3 more.
- [x] D2/feature-header: 1 test failed, including `[osh-032]` a feature with no placedBy shows no Placed.
- [x] D2/shared-renderPlacedBy: 2 tests failed, including `[osh-032]` no Placed by line for a system placed and 1 more.
- [x] D3: 1 test failed, including `[osh-032]` a feature header with no name shows the.
