# Review: osh-fusion

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-09-17
Gates: make gates CHANGE=osh-fusion passed
Rounds: 7
Scope: diff 4de06fe
Reviewed-Tree: d0c8ab12ccfce671c43f70351819bb23e58d9c4fb2dfa702ac2a8fe44ebb98c3

The output of each round is in `review/round-<n>/`. The output in `review/` is the output of round 7, where both agents gave PASS.

The `Scope` line gives the commit `4de06fe`, the first commit of this branch for this change. Round 6 and round 7 each read the diff since that commit, so the line is true for the last round and for the round before it. A second commit holds the corrections of round 5, round 6 and round 7, so the branch keeps `4de06fe` and the `Scope` line names a commit that stays. No commit records the tree of a round.

The number of findings decreased in each round until round 4: 35 in round 1, 24 in round 2, 13 in round 3 and 1 in round 4. Round 4 was a narrow round for one known limit.

Round 5 found 18, and round 6 found 35, which is the joint-highest of the seven rounds. The owner asked whether a GET request can cause a deletion in OSH. That question opened the change again, and the author wrote a new scenario, new code and 14 new tests for it. Round 7 read the corrections and gave PASS from both agents.

This is the largest change of the project: 36 scenarios, 12 new source files, 13 test files and three synthetic fixtures. A planning agent wrote the plan, an implementing agent wrote the code and the tests, and the two review agents read the result. The plan is in the scratchpad of the session, not in the repository.

## What the review found

The two safety properties of this change are that the provider sends only GET requests, and that a datastream id from the browser cannot change the upstream URL. The account for the OSH server can create and delete streams, so both matter more than the layer itself.

Both properties held in the design from round 1. What the review found was that the **proof** of each was weaker than the design:
- The test that proves one upstream call site read a fixed list of five files, matched a method name in upper case only, and never asserted that the one file holds exactly one call.
- The URL builder and its safety check were injectable options, so a caller could replace the id boundary.
- Two tests carried a scenario tag and asserted nothing that the scenario named.

The code changed for all of these. One real defect also came out of round 1: the page walk discarded the HTTP status, so an upstream 401 or 500 became an empty list that the five-minute cache then stored over a good snapshot.

## Findings

### Round 1: spec-adversary

- [x] F1 critical The test of `osh-029` never read the entity list, so a failed fetch could remove every entity and the test would pass. It now asserts the count.
- [x] F2 critical No test asserted `getStats().stale`. A source that returns `stale: true` now proves it.
- [x] F3 major `oshPages()` discarded the page status, so a 401, 403, 404 or 500 became an empty list, answered as 200 with count 0, and the list cache stored it for five minutes. It now throws outside 200 to 299, as the observation fetch does.
- [x] F4 major The one-call-site proof read a fixed list of five files and missed each imported module. It now discovers the provider folder and reads the OSH adapters.
- [x] F5 major The same proof matched a method name in upper case only, matched `body:` as a literal, and never asserted one call in `get.js`. All three are corrected.
- [x] F6 major No test asserted the 200 body of the observations route.
- [x] F7 major The repository hygiene scan missed the test files under `src/layers/osh/`.
- [x] F8 minor The address match needed a scheme. See the known limit `osh-hygiene-scope-limited`.
- [x] F9 minor The URL builder and the safety check were injectable, so a caller could defeat the id boundary. Both are now module-private, and the design records that the guard branch cannot run for an accepted id.
- [x] F10 minor The Impact said the change closes no gap, but it closes the gap of `src/data/localLayers.js`.
- [x] F11 minor The ledger recorded a branch count that moves for a file this change does not touch. See the Impact and `banked-branch-count`.
- [x] F12 minor `writeOshDetail()` was exported but never called, so it reached 100% coverage only through its own test. The layer now calls it.
- [x] F13 minor The cache cap test asserted only the size, so a cache that dropped the newest id would pass.
- [x] F14 minor The oversized-body test asserted only the rejection, not that the body stayed unread.

### Round 1: ste-adversary

- [x] S1 to S21 All 21 findings corrected. Nine were disagreements between a scenario and the code, and in each the code was right: `disable()` hides while `destroy()` removes, the id pattern refuses more than the character class, `flattenOshResult()` marks only an object or an array, and the keyless path answers 503 rather than 404. The rest were wording.

### Round 2: spec-adversary (Verdict: PASS)

- [x] F1 to F7 The page-status throw gained a scenario line, the scanned-file guard gained a count, the no-seam test became structural, `osh-034` matched its test, and the Impact named the closed gap. Two items stayed open into round 3.

### Round 2: ste-adversary

- [x] S1 to S17 All corrected. Five were majors created by the round-1 code fixes: the `DELETE` sentence was false because `observations.js` holds `cache.delete()`, `osh.js` imports `oshPages` rather than `oshGet`, the scan reads more files than the spec said, `osh-014` had no line for the page status, and `osh-034` said `osh*` when the test matches the path.

### Round 3: spec-adversary (Verdict: PASS)

- [x] F1 to F6 The `osh-005` WHEN now describes discovery, the no-seam test gained a text assertion, the `osh-014` WHEN covers any page walk, and the hygiene match no longer depends on a list of top-level domains. The scanned-set gap is recorded as `osh-get-test-is-text`.

### Round 3: ste-adversary

- [x] S1 major The Impact said the `labelArbiter.js` entry equals its base value. It did not at that moment. The text now states the behaviour: each run gives 50 or 52 not-covered branches, the covered count stays 355, and the entry holds the count of the last run.
- [x] S2 major The Impact said two files stay fully covered. Both have an open gap. The Impact now gives each.
- [x] S3 major "the three OSH adapters" was four files, one of which is not an adapter.
- [x] S4 major The design said a value past depth four gets a marker. The code marks at depth four, and only an object or an array.
- [x] S5 to S7 Wording.

### Round 4: spec-adversary (Verdict: PASS)

- [x] No finding. Round 3 gave PASS with no open major, so this output is the round-3 output.

### Round 4: ste-adversary (Verdict: PASS)

- [x] S1 major The known limit `osh-hygiene-scope-limited` said `osh-034` refuses a URL whose host is not `*.example`. The check also accepts `localhost`, which `server/providers/osh.js` uses. The spec stated it correctly; only the limit overstated it. Corrected and confirmed.

### Round 5: spec-adversary (Verdict: FAIL)

The owner asked whether a GET request can cause a deletion in OSH. Round 5 is the round that answers it. The agent did a mutation test on `isSamePageWalk()` one clause at a time, and found three ways past the check. The author reproduced all three before the fix.

- [x] F1 major No test failed when the origin clause was absent. The one foreign-origin case used another path too, so the path clause refused it first. The clause ran, so the branch count stayed complete, but nothing asserted it. Two cases now test it: a unit case with the same path and another origin, and a walk case with a protocol-relative link.
- [x] F2 major The allowlist did not stop a `;`. `URLSearchParams` splits a query on `&` only, so `?limit=1;_method=DELETE` gave the key list `['limit']` and passed, and `oshGet()` sent the raw string upstream. OSH runs on Jetty. Earlier versions of Jetty also split a query on `;`. The fix is not a rule against `;`. `buildNextPageUrl()` now builds the next URL from the resolved root's origin and the path of the current page, and rebuilds the query one allowlisted key at a time from the candidate's own parsed values. Every URL this provider sends is one it built.
- [x] F3 major A username and a password passed the check, because `URL.origin` drops them. Node then refuses a URL with credentials, so the walk lost every page it already had. The check now refuses them.
- [x] F4 minor The silent stop was in the design only. The proposal has the known limit `osh-page-link-allowlist`.
- [x] F5 minor Two test names used a word that ends in -ing. Renamed.
- [x] F6 minor Four of the five cases called the check directly and never did the action of the scenario's WHEN. One walk case per clause now does.

### Round 5: ste-adversary (Verdict: PASS)

- [x] S1 to S12 All 12 minor findings corrected. The proposal and the design now use one name for the same list: "a fixed query-key allowlist". The design says "makes sure that" in place of "proves". The spec line for `_method` gives the check as the actor. The D10a heading and the requirement say "a later page of the same request". Two test names no longer hold a word that ends in -ing.

## The mutation test

Each clause of the check has a test that fails without it. The author measured this, on a copy of the tree, after the corrections of round 5:

| Clause absent | Tests that fail |
| --- | --- |
| origin | 3 |
| path | 2 |
| username and password | 2 |
| the username half, with the password half kept | 1 |
| the password half, with the username half kept | 1 |
| fragment | 2 |
| query-key allowlist | 2 |
| the query that `buildNextPageUrl()` builds again | 2 |

A clause with no test that fails is in the code, but nothing shows that it operates. Round 5 found one such clause, and this table is the record that none is left.

Round 6 found that the two halves of the username-and-password clause had no test of their own: both cases gave a username and a password together, so either half alone made both cases pass. The test now also gives a link with only a username, and a link with only a password. The fourth and fifth rows of the table record each half.

### Round 6: spec-adversary (Verdict: PASS)

The agent traced each byte that reaches `fetchImpl`. A key reaches the server only after `includes()` matches it against one of the six literal strings, and `URLSearchParams.toString()` escapes `&`, `=`, `;`, `#`, `/` and `?` in each value. So the only bytes the server controls are the values of six keys, on a path this code pins. The agent also read the `+` of `f=application/geo+json` through the rebuild and found the same value on both sides.

- [x] F1 minor The two cases for the username-and-password clause each gave a username **and** a password, so either half of the `||` answered both. The test of that clause now also gives a link with only a username, and a link with only a password. A mutation test on each half now makes one test fail.
- [x] F2 minor Three texts said the rebuild takes the origin of the current page. The code takes the origin from the resolved root. The behaviour was right and the three sentences were wrong.
- [x] F3 minor The known limit named only the refused link, not the rebuild of the query. The new limit `osh-page-link-rewrite` names it.
- [x] F4 minor The text said the round-2 count was 22. The two round-2 outputs hold 7 and 17 findings, which is 24. The text also said that the count fell in each round, which round 5 made untrue.
- [x] F5 minor The header said `Rounds: 4` and `Scope: full`.
- [x] F6 minor The new capability purpose said "the newest observation of a selected system". A system has no observation. It now says "of each datastream of the selected system", which is what `osh-030` says.

### Round 6: ste-adversary (Verdict: FAIL)

- [x] S1 major Three texts said the origin of the next URL comes from the current page. The code takes it from the resolved root. The spec adversary found two of the three. This agent found the third, in `review.md`.
- [x] S2 to S29 All 28 minor findings corrected. Two of them name a fault that round 5 read and did not report: a phrasal verb in the design, and a use of "page" as a verb that round 5 removed from the design and the author then wrote again in the proposal. Two more corrected the names of tests that this round added. The rest are in the purpose of the capability, in the comments of `get.js`, and in this file.

### Round 7: spec-adversary (Verdict: PASS)

- [x] F1 minor The table text said "the last two rows". The two new rows are the fourth and the fifth.
- [x] F2 minor The text gave the `;` as the one exception. Round 5 found a second: a next link with a username and a password made Node throw, so the walk lost every page it already had.
- [x] F3 minor The count of findings stopped at round 5. Round 6 found 35, the joint-highest of the seven rounds.
- [x] F4 minor The limit `osh-page-link-rewrite` said "signs the bytes of its query string". A server that keeps an opaque cursor and compares it as bytes breaks the same way, with no signature. It now says "reads the bytes".
- [x] F5 minor The `Scope` line names the last round. The agent read my brief, which said round 7 reads the diff since round 6, and reported that `Rounds: 7` would make the line untrue. The brief was wrong, not the line: the file I gave the agent was the diff since `4de06fe`, so round 6 and round 7 read the same base. The header now says `Rounds: 7`, and the text above says which rounds that commit covers.
- [x] F6 minor The stored output of the STE adversary held `Verdict: FAIL`, so `REVIEW-AGENT-NOT-PASS` stopped the build. The round-7 output of both agents is now in `review/`.

The agent confirmed the two new assertions of F1 from round 6. Node reads `https://user@osh.example/...` as a username with an empty password, and `https://:pass@...` as the opposite. Each one reaches the username-and-password clause and nothing else refuses it, so one half kept alive fails one test, and the whole clause removed fails two. That is what rows three, four and five of the table record.

### Round 7: ste-adversary (Verdict: PASS)

- [x] S1 to S29 All corrected, in every place each finding names, with the words the agent gave. The agent read `openspec/trace/links.json` as well, and confirmed the two renamed tests are in it. That file comes from a ratchet run, so a stale copy is a fault no reader would see.
- [x] S30 to S39 Ten more minor findings, all in text that round 6 never read. Nine are wording of `review.md` and the proposal. S37 is the one that matters: the column of the mutation table says "Clause absent", and the two new rows named the half that stays. A row that names the wrong half makes the table say the opposite of what the run measured.

The agent also asked for one name for the check across the change. S38 corrects the last comment that called `isSamePageWalk()` "the guard". The word stays where it names another check: the browser method guard of D3, the datastream id boundary, and the scanned-file guard of `osh-005`. Those are different checks, so one name for all of them would say less, not more.

## What the last two rounds show

Round 5 and round 6 both found that a text said something the code does not do. In each round the code was right. The design of this change did not change after round 1, and every later finding was about the proof or the words.

Round 5 holds the two exceptions. The `;` was a real way past the check. The username and the password were a second: a next link with credentials made Node throw, so the walk lost every page it already had, in place of a clean stop. The owner's question opened the change again and found both.
