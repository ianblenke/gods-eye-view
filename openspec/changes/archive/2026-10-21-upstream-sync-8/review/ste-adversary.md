Verdict: PASS

Tree: /home/ianblenke/docker/gev-work/upstream-sync-8 at 9a4cb5c4, in the folder openspec/changes/archive/2026-10-21-upstream-sync-8/. The paths below are in that folder. The scope is `diff 08848f26`, and I ran no code and no git. The new prose has no word from words.json and no form of one. The deltas have no SHALL, SHOULD or MAY. The STE-ING warning for "geocoding" needs no finding, because "geocoding" is a technical name that the sync 6 specs also use.

Round-1 majors:
- **S1 `fix-ontario-511`:** closed. proposal.md:14 and design.md:50 now say `fix-ontario-511-key`, and a search finds no other form of the name.
- **S2 evidence/leaks.txt:6:** closed. The sentence now names the branch at 4b35414c and the two fork test files. I could not check the counts 87 and 85, because the file gives no file list.

Round-1 minors: all closed. Three of the corrections add the new faults in findings 1, 3 and 4.

- [ ] FINDING minor design.md:53 (9a4cb5c4) "for the same reason", also in specs/live-sources/spec.md:4. No text gives the reason. The sync 6 record (2026-10-18-upstream-sync-6/design.md:77-78) gives only the case: both sides add a route on the same path. Write: "In sync 6, upstream and the fork added a route on the same path, and the owner decided to use the upstream routes. Here both add the same key in the same parameter, so the lead uses the upstream code as a default." I could not check the chat.
- [ ] FINDING minor evidence/host-run.txt:830 (9a4cb5c4) "after the round 1 corrections of D6, D7 and .env.example". Round 1 changed no D6 test file. Outside openspec/, the diff from 08848f26 to 9a4cb5c4 changes only decode.test.mjs and .env.example. The sentence is true only if "D6" means the prose of D6. Write: "after the round 1 corrections of D7 and .env.example".
- [ ] FINDING minor proposal.md:63 (9a4cb5c4) "This gap is older than this change." My own round-1 text added this fault. In proposal.md:25,54 and in AGENTS.md, "gap" means a coverage gap. Write: "This limit is older than this change."
- [ ] FINDING minor design.md:57 (9a4cb5c4) "the key text goes into the log", also in proposal.md:65. This is a phrasal verb, the same fault as round-1 design.md:100. Write: "the loader writes the key text to the log". server/providers/cctv/sources.js:656-659 agrees.
- [ ] FINDING minor proposal.md:64 (9a4cb5c4) "For a missing key". This is an STE-ING word and not a technical name. Write: "When the server has no key, the upstream loader also writes one warning in each process." sources.js:557-565 agrees: one warning in each process.

More minors that I did not list:
- design.md:107 "It asserts" comes after "Each mock function". Write "The test asserts".
- proposal.md:64,65 give the action to a scenario ("the retired scenario ... gave", "kept").
- evidence/decode-coverage.txt:50 says "spies", but design.md:107 says "mock functions". The same line says "the commit ... asserts".
- design.md:56 uses "requests" and "download" for one thing.
- design.md:62 says "entries", but tasks.md:37 says "links".
- evidence/resolutions.txt:35 says "each of these keys", but the list includes the Launch Library 2 text.

I can send these as findings.

One note on the brief: the D7 test diff adds one comment line, not two (decode.test.mjs:139). Line 138 was already in the file.
