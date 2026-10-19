Verdict: FAIL
Tip 9896f1af (clone /home/ianblenke/docker/gev-work/gdacs-layer). C = openspec/changes/archive/2026-10-19-gdacs-layer. The main spec openspec/specs/gdacs-layer/spec.md has the same text, 3 lines lower.

- [ ] FINDING major C/specs/gdacs-layer/spec.md:40 @9896f1af "It MUST NOT count a second event with the same `id`" has two meanings. The sentence before it says "counts the event toward the limit". So one reading only keeps that event out of the count. Under that reading, a normalizer that keeps both "FL-7" events obeys the requirement and fails :70. Write: "It MUST keep only the first event of each `id`, and it MUST NOT count a second event with that `id` toward the limit."
- [ ] FINDING major C/specs/gdacs-layer/spec.md:90,128 @9896f1af "emoji" has two meanings. It can be one code point, or one symbol of more code points, for example U+2764 U+FE0F. Under the second meaning, 125 emoji give 60 emoji, and "so a name of 40 emoji gives 32 emoji" is false (it gives 16). The tests use U+1F30A (records.test.mjs:199, model.test.mjs:133). Write "a name of 125 copies of U+1F30A gives its first 120 copies" and "so 40 copies of U+1F30A give 32 copies".
- [ ] FINDING major C/specs/gdacs-layer/spec.md:135 @9896f1af "show the points and the labels of the result of its newest request. It MUST keep them when that request fails." A failed newest request has no result. So the text can mean "show nothing" or "keep the old points" (:159-163). Write: "...MUST show the points and the labels of the newest result of the source. When a later request fails, it MUST keep those points and labels."
- [ ] FINDING major C/proposal.md:20 @9896f1af "`design.md` D6 names each test" is false. D6 says only "The tests that count layers" (design.md:49). design.md does not name src/app/constructCatalog.test.mjs or src/app/sourceComposition.test.mjs. Tasks 2.10 and 2.11 name them. Write: "Tasks 2.6 to 2.16 name each change of these tests."
- [ ] FINDING minor src/layers/gdacs/source.test.mjs:46, records.test.mjs:160, model.test.mjs:28,43, layer.test.mjs:336, registration.test.mjs:111 @9896f1af These titles break STE rules:
  - 003 "the normalized document": spec:22 calls it the result. Write "the result of the normalizer".
  - 007 "sets current": write "makes current true only for the value true".
  - 010 and 011 have no articles, use "styles" as a verb and use "modified" as a noun. Write "by the alert level and the current flag" and "the modified date".
  - 016 "while enabled": write "while the layer is enabled".
  - 021 "credits ... the disclaimer": write "names GDACS and its two partners and gives the disclaimer of the estimates".
- [ ] FINDING minor C/specs/gdacs-layer/spec.md:44,114,144 @9896f1af
  - :44 "each run of white space": the spec uses "run" as a verb at :26, :160 and :172. Write "each sequence of white space characters".
  - :114 has no articles. Write "by the alert level and the current flag".
  - :144 "that call" has no noun before it. Write "the call of `setEntries`".
- [ ] FINDING minor CHANGELOG.md:3 @9896f1af "as points in the group "Events"": the layer is in that panel group, not the points. Write: "The layer is in the group "Events" and shows the events of `/api/gdacs` as points: ...".
- [ ] FINDING minor DATA_SOURCES.md:127 @9896f1af "the credits of the layer hold this warning": the credit (src/data/dataCredits.js:179) holds only the first of the two sentences before it, in other words. Write "hold the warning that an estimate can be wrong".
- [ ] FINDING minor C/proposal.md:46 @9896f1af "A label shows the name of an event": the plan correction changed :7 to "the first 32 code points of the name", but it did not change this line. Write the same text here.

Checked, no finding:
- The prose and the 22 titles have no banned word, and no form of a banned word with -s, -ed or -ing.
- Each -ing word is an allowed word or code.
- The STE-NOUN warning "abort" (:22) is part of the technical name AbortSignal.
- The STE-PASSIVE warning "is green" (:42) is a value, and "is enabled" (:135, :139) is a state.
- Each task gives one instruction.
- The evidence sentences agree with the output: 787 files, and 154 of 154 faults killed.