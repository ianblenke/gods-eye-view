Verdict: PASS
Commit read: 821ca9a919397e123e06acfd59e58a1ed27dd6a2. A = openspec/changes/archive/2026-10-13-reticulum-provider/

No critical and no major finding. There are five minor findings. Two of them (the first) repeat a wording that I suggested in pre-review 2.

- [ ] FINDING minor A/specs/reticulum-source/spec.md:59,74 (merged spec: openspec/specs/reticulum-source/spec.md:62,77) @821ca9a9 Two lint warnings. "after the cleaning" is a verb used as a noun, and I suggested that wording in pre-review 2. "a type that is named like" is passive. Write: "is empty after the provider cleans it" and "for a type with the name of an inherited property such as `constructor`".

- [ ] FINDING minor A/tasks.md:30 @821ca9a9 Task 4.1 is not ticked, but the ratchet has run: r1-gate-output.txt shows 940 scenarios and 940 verified, and the ratchet recorded the 14 new IDs and one history line. Tick 4.1. The archived tasks of the earlier changes show 4.1 ticked at this stage.

- [ ] FINDING minor A/specs/reticulum-source/spec.md:69,94,105 @821ca9a9 Two words for one thing. "the source answers" (008 WHEN), "Report a source that is not set" (011 heading) and "when the source fails" (012 heading) mean the listener. The requirements say "listener". Write "listener" in these three places.

- [ ] FINDING minor A/specs/reticulum-source/spec.md:26 @821ca9a9 "The raw `type` includes the word "Interface" in its count" does not say what "its count" counts. Write: "The 1 to 40 characters of the raw `type` include the word "Interface"." (13 words.) Test 004 (35+"Interface" dropped, 31+"Interface" kept) fits this text.

- [ ] FINDING minor A/proposal.md:36 @821ca9a9 Known limit `names` covers the name only. The `type` (1 to 40 letters or digits, taken from the announce) is also free text of the operator, and `counts.byType` repeats it. A contact address of 32 hex characters fits the type rule. I could not check whether the RNS announce lets an operator set an arbitrary type. Add: "The `type` can hold such text too."

Checked, no finding:
- The Purpose in design.md:52 equals the merged spec Purpose word for word.
- The merged spec equals the delta. There are 9 requirements and 14 scenarios, and 14 test titles in links.json match them.
- Test 014 and the exact 4 MiB case are true. 121 faults appear in both evidence files (mutations.txt, 121 lines; mutations-run.txt, lines 4-124), and the 8 + 11 + 8 cases are named.
- The privacy path in `normalizeRecord()`: there is no spread of `record`. Only `id`, `type`, `name`, `latitude`, `longitude`, `heightM`, `hops`, `lastHeard`, `status` and `radio` are read. The reason texts and the `coverage` and `attribution` texts are fixed. The stale document is a copy of the cached document.
- `redirect: 'error'`, the 8 s timer with `clearTimer`, the 4 MiB cap in `readResponseTextCapped`, the 60 s cache and `coalesceProxyRequest`, as the requirements say.
- Known limit `address` is true (local-receivers.js resolves and pins a name; neither route has a same-site gate or a rate limit).
- Both new files are in ownership.json and format-scope.json; `local.js` has two changed lines.
- All sentences have 25 words or fewer. The paragraphs "Record rules" and "Source failure" have 6 sentences with the Origin line (at the limit). DATA_SOURCES has paragraphs of 2, 4, 4 and 5 sentences. The CHANGELOG entry has 6 sentences.
- No banned word. Tasks have 12 words or fewer.

Not checked: that Reticulum builds `discovery_hash` from `transport_id` and the name, the licence text, issue #241, the 283 related tests and the coverage figure (not rerun), and the bytes of the spike. The warnings "be between" (design.md:23) and "spreading" and "coding" are false alarms or LoRa terms.
