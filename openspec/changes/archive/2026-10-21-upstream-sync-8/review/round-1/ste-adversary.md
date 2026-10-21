Verdict: FAIL

I read the tree /home/ianblenke/docker/gev-work/upstream-sync-8 at 08848f26, in the folder openspec/changes/archive/2026-10-21-upstream-sync-8/. The paths below are in that folder. I ran no code and no git. The new prose has no banned word from words.json, and no form of one with -s, -ed or -ing. The spec deltas have no SHALL, SHOULD or MAY. The requirement text of qa-scripts-023 is unchanged.

- [ ] FINDING major proposal.md:10 (08848f26) "the change `fix-ontario-511`", also at design.md:50. No change has this name. The archive folder is 2026-10-09-fix-ontario-511-key, and openspec/trace/ids.json:3095 gives "fix-ontario-511-key". history.jsonl has 0 records for "fix-ontario-511". Write: "the change `fix-ontario-511-key`".
- [ ] FINDING major evidence/leaks.txt:6 (08848f26) "the 87 test files that the merge adds or changes". The command (`origin/main HEAD` at 4b35414c) also counts the fork commits after the merge. The commit 4b35414c edits src/tooling/spec/qaRegister.test.mjs, and openspec/ownership.json:118 owns that file. But proposal.md:35 says that no file of the merge is owned. Write: "the 87 test files that the branch adds or changes at 4b35414c". I could not check the count 87.
- [ ] FINDING minor proposal.md:18 (08848f26) One word, one meaning. "test" means a test file in proposal.md:18 ("four upstream tests"), design.md:79,85 and tasks.md:15. It means one test in design.md:94. proposal.md:38 and design.md:82 say "test files", and D6 edits the close code of each file (for example src/layers/launches/ingestion.test.mjs:156). proposal.md:18 also gives the two aims of D6 and D7 to all four edits. Write "test files" for D6. Write one sentence for D6 and one sentence for D7.
- [ ] FINDING minor design.md:24 (08848f26) One name for one thing. proposal.md:10 and specs/live-sources/spec.md:4 call `ONTARIO_511_API_KEY` "the key". specs/live-sources/spec.md:5 calls it "the environment variable". The words "the fork name of the key" tell the reader that upstream uses a different name. But server/providers/cctv/sources.js:557 reads the same name. Write in spec.md:5: "The server reads the same key `ONTARIO_511_API_KEY`." Write in design.md:24: "Keep the key name `ONTARIO_511_API_KEY`." I could not read the upstream row.
- [ ] FINDING minor design.md:52 (08848f26) Two meanings. Two texts can state a general rule of the owner, or a decision for this case: "The owner decided in sync 6 to use the upstream code when upstream adds the same function", and spec.md:4 "as the owner decided for the same case in sync 6". The sync 6 record (2026-10-18-upstream-sync-6/design.md:78) gives one decision only, for the geocoding routes. Write: "In sync 6, the owner decided to use the upstream geocoding routes. The lead uses the upstream code here for the same reason." I could not check the chat.
- [ ] FINDING minor design.md:74 (08848f26) Verbs.
  - "had added" is the past perfect. Write "The fork added".
  - evidence/street-level.txt:16 "turn on" is a phrasal verb. Write "use mock timers", as design.md:76 does.
  - proposal.md:3 "to sync" uses a noun as a verb. Write "to start the eighth sync".
  - design.md:88-94 and tasks.md:17 use the verb "decode" as a noun ("a slice of the decode", "Add a decode").
  - "turn" means the time that the page gets, and also the function of the option `pause` ("The default turn is the function nextTask()").
  - "The assertion decodes" (design.md:94) gives the action to an assertion.

  Write "the default pause function nextTask()". Write "Add a call of decodeCoverageTileSliced() with the default pause function and clock" in tasks.md:17. Write "The assertion calls decodeCoverageTileSliced()" in design.md:94.

I found more minor items and did not list them. They are at design.md:62 ("It" after a sentence about the user), design.md:65 ("The change counts": the scenario counts) and proposal.md:6,8 ("opt-in" and "provenance" are not STE words). I can send them.
