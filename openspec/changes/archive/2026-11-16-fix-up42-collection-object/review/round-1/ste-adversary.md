Verdict: FAIL

- [ ] FINDING major: `specs/up42-quotes/spec.md:11` (also `openspec/specs/up42-quotes/spec.md:160`). The text "optional titles and collections, each as a string or as an object with a string name" has two meanings in normative text. "Each" can refer to the collections only, or to the ids, the titles and the collections. Write: "optional titles, and optional collections that are each a string or an object with a string name".
- [ ] FINDING major: `tasks.md:18`. Task 4.2 gives two instructions: "Run the mutation that reads only strings" and "record the failed test". Split it into two tasks.
- [ ] FINDING minor: `tasks.md:12`. "Read the collection name in normalize.js." has two meanings. Write: "Change normalize.js to accept the collection object."
- [ ] FINDING minor: `tasks.md:3`. "Write the proposal, design and delta spec." names three documents in one task. Split it, or accept the one verb.
- [ ] FINDING minor: `tasks.md:19-22`. "Have the lead run ..." and "Have the lead write ..." use the vague verb "have".
- [ ] FINDING minor: `proposal.md:30` and `design.md:33`. "re-link the changed scenario hash" uses "re-link", which is not an approved STE verb. Write: "The lead must run the ratchet command to record the new hash of scenario 014."
- [ ] FINDING minor: `proposal.md:9-11`, `design.md:12`, `specs/up42-quotes/spec.md:11`. Two words name the same thing: "answer" (proposal and design) and "response" (spec). Use one word.
- [ ] FINDING minor: `proposal.md:35` and `design.md:28`. Both give "2026-11-16" as the date of the live probe. Check the date.
- [ ] FINDING minor: `proposal.md:11`. "Refuse an object that has no string name, as before." The old code refused every object. Write: "Refuse a collection that is not a string and has no string name."
- [ ] FINDING minor: `design.md:20`. "Other values give undefined" is not exact. An object with a non-string name gives that name, and the caller then refuses it. Add: "The caller refuses a name that is not a string."
- [ ] FINDING minor: `design.md:32` and `proposal.md:21-31`. They omit the new case `{ content: [{ id: ID, collection: 7 }] }` that the change adds to the loop of `up42-quotes-015`. State the case in the design under Gates.
- [ ] FINDING minor: `changelog.d/1436-up42-collection-object.md:3`. The second sentence joins two topics with "and". Split it.
