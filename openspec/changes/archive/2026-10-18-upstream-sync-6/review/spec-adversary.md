Verdict: PASS

Spec adversary, round 3 (scope: diff 3deef1e9), upstream-sync-6. Clone: /home/ianblenke/docker/gev-work/upstream-sync-6 at commit 9b635bd2. Short paths start in openspec/changes/archive/2026-10-18-upstream-sync-6/. I could not run git.

**Round-2 findings: all closed (9b635bd2)**
- **Status test:** src/search/placeSearch.test.mjs:103-112 gives a ZERO_RESULTS body for 429 and for 502, and it checks both answers in one deepEqual. Without src/search/google.js:46, each status gives answered:true, so each case can fail alone. evidence/fault-020.txt:90-92 agrees with my reading.
- **Helper bodies:** the bodies at :82-83 equal server/providers/places/google.js:402-406 and :457-461. src/search/google.js:49-59 gives answered:false for each body, so the comment at :77-80 is true.
- **Differences from 013:** proposal.md:55 and specs/credential-boundary/spec.md:10 now name three differences. Each one agrees with the code:
  - a configured:false answer gives answered:false (src/search/google.js:49-59);
  - the place search keeps no miss (src/search/placeSearch.js:55);
  - with no key, no request goes out (src/search/defaults.js:55).
- **Scenario lines 33-34:** the test at :45-63 asserts a second route request, and the cache fault (fault-020.txt:100) kills it.
- **Trace:** the main spec agrees with the delta. The six links agree with the six titles, and the 11 retired IDs have no links. I found no banned word in the new prose or titles.

- [ ] FINDING minor design.md:96 (9b635bd2) "Outside the QA scripts, four files are of that kind" counts more than the command looked at. evidence/silent-files.txt:3 reads only .js/.mjs under src/, server/ and scripts/. Its `grep -v test` also drops code files such as src/testSupport/*.mjs. scripts/spec/lib/inventory.mjs:3 counts .html and .sh as code, and build/*.js, vite.config.js and pinokio/*.js are outside the pathspecs. I found no missed file: build/vite.js has an upstream-sync-6 adopt record (openspec/trace/history.jsonl:2759), and src/ui/templates/context.html has 86 upstream data-i18n marks. I could not check scripts/*.sh, index.html or pinokio/. To correct: name the measured subset in design.md:96 and silent-files.txt:1, or widen the command.
- [ ] FINDING minor proposal.md:57 (9b635bd2) The list of test changes leaves out two changes to the configured:false test (placeSearch.test.mjs:45). Its fixture is now keylessRouteAnswer (status REQUEST_DENIED; it was null at the base). It also has a new assertion, urls.length 3. "The test of the keyless server" can mean only the test at :34. To correct, write: "The two tests of a keyless server use the answer of the upstream route", and name the request count. I checked that :37 and :51 both use keylessRouteAnswer.
- [ ] FINDING minor evidence/scenario-tests.txt:37 (9b635bd2) "The tests use the error bodies of the upstream route" is not true for the status test, which gives ZERO_RESULTS bodies (placeSearch.test.mjs:104). Only the Photon place test (:117) uses routeErrorBodies. To correct, write: "The test of the Photon place uses the error bodies of the upstream route" (the text of proposal.md:57).
