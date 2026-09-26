Verdict: PASS

The round-3 major finding S1 is corrected. The clone has no major finding. It has 14 minor findings, listed below.

- [ ] S1 minor openspec/changes/archive/2026-09-26-upstream-sync/design.md:37 "The clone does not have this test" One word, one meaning. "The clone" has no definition in the change, and the change says "the fork" everywhere else. After the archive, a reader cannot know what "the clone" is. I suggested these words in round 3, and they were wrong. Write: "The tree of the merge commit does not have this test (the known limit `sync-dropped-reverse-cache-test`)."

- [ ] S2 minor openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:48 "the test seams that the test used are gone. ... The `catch` clause in that file that changes a rejected reverse lookup to "no place" has no test." Words and articles.
  - "seams" is not an approved word and the change does not define it. The two functions are `_reverseGeocodeForTest` and `_resetReverseGeocodeForTest`. My search of `src/` found neither of them.
  - "in that file that changes" can attach to "file" or to "clause".
  - Write: "The upstream project replaced that cache with a cache for each service, and the functions `_reverseGeocodeForTest` and `_resetReverseGeocodeForTest`, which the test used, are gone. The code of the new cache is still in `src/voice/gevActions.js`, and no test checks it. In the function `reverseGeocode` of that file, the `catch` clause changes a rejected reverse lookup to "no place". No test checks this clause. A backfill change for the voice actions writes both tests."
  - The code agrees with this text. `cachesFor(service)` is at line 302 and the `catch` is at line 3840. `src/voice/*.test.mjs` never says `reverseGeocode`.

- [ ] S3 minor openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:5 "the owner of the project is the person who accepts this change on `main`" (also proposal.md:45, :55 and design.md:5, :57) One word, one meaning. The paragraph makes "the owner" and "the person who accepts this change" one person. The text then uses both names for that person, and `design.md:5` lists them as two roles: "the owner, the person who accepts this change on `main`, and the author of this change". A reader can count three people. Round-3 S4 asked for one name for one person.
  - Write in proposal.md:5: "The owner of the project accepts this change on `main`. Rule 21 of `AGENTS.md` calls the owner "the person who merges a change". The author of this change is the agent that wrote this change."
  - Write in design.md:5: "The proposal names the roles: the owner and the author of this change."
  - Write "the owner" in proposal.md:45, :55 and design.md:57 (twice: "That person" and "this person").
  - I could not check that the person who accepts the change is the owner. Change the text if it is not true.

- [ ] S4 minor openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:45 "a person then changed them in this change" (also design.md:3, :17, :57 "A person ... resolved the conflicts by hand") One word, one meaning. The proposal now says the author of this change is an agent. "A person" is a fourth role with no definition. The reader cannot tell if "a person" is the owner or the author. If the author changed the files, write: "The fork did not change them before this change. Only the upstream project changed them. The author of this change then changed them." Do the same in design.md:3, :17 and :57. If the owner did some of this work, name that work. I am not sure who did the work.

- [ ] S5 minor openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:14 "call the server route `/api/google/geocode`" (also proposal.md:18 "the scan for calls that are not GET" and tasks.md:50 "Write the server route calls") One word, one meaning. Round 3 made "request" the word for the network and "call" the word for a function. These three places use "call" for the network. Write: "send requests to the server route `/api/google/geocode`, with no key in the request", "the scan for requests that do not use GET", and "Write the requests to the server route in `src/search/http.js` and `src/search/defaults.js` until the tests of `credential-boundary-014` pass". The other uses of "call" agree with the convention: the spec lines 16, 18 and 19 and the "call of `createOshLayer`" in tasks.md:24.

- [ ] S6 minor openspec/changes/archive/2026-09-26-upstream-sync/design.md:12 "The known limits `sync-share-token` and `sync-third-geocoder-call` name two changes." Agreement with the other prose, and two possible meanings. The goal says "Keep the behavior", and the next sentence names "two changes". The proposal uses "later changes" for future OpenSpec changes, so "two changes" can mean two later changes. The next goal (line 13) says "Change only how ... connect", but these two limits change the behavior. Write: "Keep the behavior of the OSH layers and of the geocoders as it was in the fork, with two differences: the share-link token of the OSH layer (`sync-share-token`) and the third request of a forward lookup (`sync-third-geocoder-call`)."

- [ ] S7 minor openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:38 "smaller counts for 8 files. Two of these files, `src/data/labelArbiter.js` and `src/data/lifecycle.js`, are counts that change between runs" Numbers, and words. I read the history as it is in the clone.
  - `openspec/trace/history.jsonl` now has a later ratchet run, at commit 5d4ce02 (lines 1474 to 1479). Line 1474 has a `smaller` line for `server/providers/vessels/ais-store.js` (44 to 40). Lines 1476 and 1477 put `labelArbiter.js` back (50 to 52, "shown by test"). So 9 files have a `smaller` line, and 3 of them are counts that change between runs.
  - "Two of these files ... are counts" is wrong: a file is not a count.
  - Choose the rule for the number and write it. For example: "and smaller counts for 9 files. The counts of three of them, `server/providers/vessels/ais-store.js`, `src/data/labelArbiter.js` and `src/data/lifecycle.js`, change between runs (`sync-counts-change-between-runs`)."
  - I could not run Git. I do not know if the working tree is exactly commit d48185d.

- [ ] S8 minor openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:54 "probably because a test runs different lines when its events happen at different times ... `src/layers/wind/rendering.js` (a total that changes by 1) and `src/data/labelArbiter.js` (2 branches) ... the gates of a pull request do not" Words, and agreement. There are five problems:
  - "probably" is not in my list of approved words. I am not sure about it. Write: "The cause is not measured. A possible cause is that a test runs different lines when the events in the code happen at different times."
  - "its events" refers to "a test", but the code has the events.
  - The first sentence says "a not-covered count". The `rendering.js` example is a total of branches (333 or 334, history lines 1473 and 1479), and it is not a not-covered count. Write: "(333 or 334 branches in total)".
  - "(2 branches)" gives a difference. The first two examples give the two values. Write: "(50 or 52 branches not covered)".
  - "the gates of a pull request do not" uses "do" in place of a verb. Write: "the gates of a pull request do not use the tolerance".

- [ ] S9 minor openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:56 "remembers each Google status that comes with no place on an HTTP 200 answer ... must not be remembered" Voice, verbs and agreement. The code (`src/search/http.js:111`) remembers the coordinate of an answer, and not the status. The spec line 17 says "remembers an answer". "comes with" is a phrasal verb, and "must not be remembered" is passive when the active voice is possible. Other limits say "in `review.md`". Write: "The HTTP geospatial provider remembers each HTTP 200 answer that has a Google status and gives no place. Only the answer with the status `ZERO_RESULTS` has a test. The owner decides in `review.md` if the provider must not remember an answer with a status such as `REQUEST_DENIED`."

- [ ] S10 minor openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:49 "The standing rule of the owner" Words that end in -ing. "standing" is not in `allowedIng`, is not a technical name, and is not an approved word. Write: "The rule of the owner is that a test name that exists on `origin/main` does not change."

- [ ] S11 minor openspec/changes/archive/2026-09-26-upstream-sync/proposal.md:46 "The change edits two upstream tests ... can conflict with these edits" Verbs used as nouns. I suggested "these edits" in round 3, and "edit" is not an approved word as far as I know (I am not sure). "edits" is a noun here. Write: "This change changes two upstream tests, and neither test has a scenario. A later change of these two tests in the upstream project can conflict with the changes that this change makes to them, when the fork merges that change." The clause "The gates allow the gap of an edited file" in design.md:63 is older text and is not part of this finding.

- [ ] S12 minor openspec/changes/archive/2026-09-26-upstream-sync/specs/credential-boundary/spec.md:18 "**AND** a later call for the same coordinate, which the provider rounds to four decimals, makes no fetch" (also openspec/specs/credential-boundary/spec.md:110) One clear meaning, but two problems.
  - The line no longer says which answer it follows. Without "then", it can read as true for every earlier answer, and line 19 says the provider fetches again after an error answer. "The same coordinate" can also mean the identical coordinate. In that reading the rounding has no effect, but the new test asserts the rounding: 30.26721 and 30.26724 are two coordinates.
  - "decimals" is a noun that STE does not approve. The technical name is "decimal places".
  - Write: "**AND** a later call makes no fetch for a coordinate that has the same four decimal places as the coordinate of that answer". Change the live spec in the same way. The delta spec and the live spec are equal at this line, so no disagreement exists now.

- [ ] S13 minor src/search/reverseGeocodeRoute.test.mjs:215 "a coordinate that rounds to the same four decimals makes no fetch, and one that differs at the fourth decimal fetches" Test names, articles and nouns. "the same four decimals" has no comparison: the same as which coordinate? "one" is a pronoun with no clear noun, and "decimals" is a problem as in S12. The other 13 names use "a later call ... after ...". Write: "a coordinate with the same four decimal places as the first coordinate makes no fetch, and a coordinate with a different fourth decimal place fetches". Change the key in `openspec/trace/links.json` (line 392) with it. The name is new, so the rename is free. The assertions match the mutations of tasks 2.5. By hand, 2 decimals gives one fetch where the test needs two, and 6 decimals gives two fetches where the test needs one.

- [ ] S14 minor openspec/changes/archive/2026-09-26-upstream-sync/tasks.md:32 "round the coordinate to six decimals in the key of the memory" (also :33) One word, one meaning. "memory" does not appear anywhere else in the change. The change says the provider "remembers" an answer, and the code holds the coordinates in a set (`noPlace`). Write: "round the coordinate to six decimal places in the key that the provider uses to remember an answer" and the same with "two decimal places".

**Round-3 findings checked**
- The round-3 major S1 is corrected. Its two claims agree with the code: the cache is still in `src/voice/gevActions.js` (`cachesFor` at line 302, `reverseGeocode` at lines 3823 to 3848), and the two test functions are gone from `src/`. The words in S1 and S2 above are only wording.
- S2, S5, S6, S8, S11 and S14 of round 3 are corrected. S13 is corrected in the wording, and S12 above still applies to the same line.
- S3, S4, S7, S9, S10 and S12 of round 3 are only partly corrected. They come back as S7, S3 and S4, S11, S6, and S5 of this round. Round-3 S12 (task 4.6) gets no new finding here. Task 4.6 now names the three error codes and asks for `review.md`.
- S15 of round 3 is corrected: the new name of `osh-096` is in `openspec/trace/links.json` (line 1538), and the old name is gone. The new name has no STE problem.
- The new WHEN of `osh-096` agrees with `osh-089` (the three element ids) and with the test. The delta specs equal the live specs at the two changed lines.

**Not checked**
- I could not run Git, code, tests or mutations. I got no lint output. I found the -ing words by hand. "standing" is the only new one.
- I could not check that the person who accepts the change on `main` is the owner (S3).
- I could not check if a voice test reaches `reverseGeocode` through another action. No test outside `src/search` says `reverseGeocode`.
- I did not check the hashes in `openspec/trace/ids.json` for the two changed scenarios.
- I did not check the sums of the Impact.
