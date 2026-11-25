Tree read: `/home/ianblenke/docker/gev-work/upstream-sync-12`, HEAD `d96d9c8bd` (as the caller gave it) plus the uncommitted archive. I could not run git. Paths below are relative to that folder, and `<change>` is `openspec/changes/archive/2026-11-25-upstream-sync-12`.

Verdict: FAIL

- [ ] FINDING major S1 <change>/specs/director/spec.md:11, openspec/specs/director/spec.md:1144 "the run ends on the last shot with no new flight from the start of the shot" Two meanings in normative text. "the shot" can be the last shot or the shot of the resume moment. These differ when the flight does not go to the last shot. Write two lines: "**AND** the run ends on the last shot" and "**AND** the run starts no new flight from the start of the shot of that moment".

- [ ] FINDING major S2 <change>/specs/perimeters/spec.md:13, openspec/specs/perimeters/spec.md:16 "a response with no rows" Two meanings in normative text (carried text in the delta). It can be a response with no `rows` list or one with an empty list. `source.js:27` rejects only the first. The test `[perimeters-001] the default source calls the host fetch` accepts `{ rows: [] }`, so the second meaning disagrees with the code. Write: "a response with no `rows` list".

- [ ] FINDING major S3 openspec/specs/perimeters/spec.md:43, src/layers/perimeters/cards.forkBackfill.test.mjs:93 "the card model gets an incident row", "a full incident row renders" The text disagrees with the new `perimeters-001` and with the code. After the merge, a row is a response item (`stableId`, `polygons`), and `perimeters-001` makes one fire from each row. The card model takes a snapshot fire (`cards.js:103`, "A snapshot fire") and reads `id`. The code still names that parameter `row`, but the spec now uses "row" and "fire" for different things. Write: "**WHEN** the card model gets a fire of the snapshot" and "[perimeters-006] a fire with all facts renders name, size, containment, and ages". The scenario needs a MODIFIED delta for its requirement. Do not change the requirement text.

- [ ] FINDING major S4 src/layers/perimeters/source.test.mjs:23 "[perimeters-001] a successful response yields normalized perimeter rows" The title disagrees with the modified `perimeters-001` and with the code. The source returns fires and pieces, and the test asserts `snapshot.fires` and `snapshot.pieces`. Write: "[perimeters-001] a successful response yields the fires and the pieces".

- [ ] FINDING minor S5 <change>/specs/director/spec.md:4,7, openspec/specs/director/spec.md:1137,1140 "Go on from the point of the path and the clock", "at the given point" Verbs, and one word for one thing. "Go on" is a phrasal verb, and "point" and "moment" name the same resume position. Write the heading: "Continue from the same moment of the path and the clock". Write the requirement: "The director MUST start a resumed run at the given moment of a camera flight."

- [ ] FINDING minor S6 src/scenes/director.test.mjs:2165 "goes on from that point of the path and clock" Phrasal verb, a missing article, and "that" has no noun before it that it can point to. Write: "[director-111] a run resumed inside a flight continues from the same moment of the path and the clock".

- [ ] FINDING minor S7 <change>/specs/context-contacts-entry/spec.md:7,9,10, openspec/specs/context-contacts-entry/spec.md:10,12,13 "Enter Contacts", "the mode is `flights`", "turn ... on", "turn the flight layer off" One word for one thing, and phrasal verbs. The requirement says "start the Contacts mode" and the heading says "Enter". The scenario does not say that `flights` is the stored value of that mode. Write: "Start Contacts with a tracked aircraft", "the stored Contacts mode is `flights`", "the controls enable the military awareness layer" and "the controls do not disable the flight layer".

- [ ] FINDING minor S8 src/ui/contextActions.forkBackfill.test.mjs:6 "a Contacts request enters Contacts" The requirement uses "start the Contacts mode" for this action. Write: "[context-contacts-entry-001] a Contacts request starts the Contacts mode and keeps the tracked aircraft".

- [ ] FINDING minor S9 <change>/proposal.md:39 "because of its timing" `-ing` word (STE-ING), and "its" can be the test or the behavior. Write: "Upstream removed its test of this behavior because that test depends on time."

- [ ] FINDING minor S10 <change>/design.md:25,29 "`director.test.mjs` first took the upstream removal of the resumed flight test", "the change corrected it" Vague verb with a verb used as a noun, and "it" can be the test or the shape. Write: "The merge first removed the resumed flight test from `director.test.mjs`, as upstream did." and "the change corrected the test".

- [ ] FINDING minor S11 <change>/tasks.md:8,9 "Keep these scenarios" Two possible meanings. `proposal.md:29` says that the change writes again `live-sources-007` and `perimeters-001`, and "keep" can mean "do not change". Write: "Keep these scenario IDs of `live-sources`: ..." and "Keep these scenario IDs of `perimeters`: ...".

- [ ] FINDING minor S12 src/tooling/blenderCameraPartialWrite.test.mjs:74 "so it writes none" "it" can be the child or the size limit. The sentence also gives the cut file as the cause, but the empty `NODE_V8_COVERAGE` is the cause. Write: "The size limit also cuts the coverage file of the child. Thus the child must write no coverage file."

Notes, not findings:
- The other STE warnings for this change need no correction: `design.md:29` "read" is a verb there (false positive), and "abort" is a technical noun.
- The title "[perimeters-002] a malformed successful response ..." has the banned word "malformed". The lint treats it as old prose (`STE-WORD-OLD`), and this change does not add or rename it, so I did not count it. The same applies to "preserves" in the first `[cyclones-001]` title.

Verdict: FAIL

Not checked: git diff (so which lines are new, and the "7 more files" count in `leak-record`), the 265-commit, 358-file and 13-conflict counts, and most unchanged old text in the four canonical specs. S2 and S3 need scenario edits, which change scenario hashes, so the ratchet must run again.
