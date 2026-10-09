Verdict: PASS

Tree: clone /home/ianblenke/docker/gev-work/upstream-sync-3, branch upstream-sync-3, commit ab3e2b62 as the brief names it. I cannot run git, so I did not confirm HEAD. A/ = openspec/changes/archive/2026-10-08-upstream-sync-3/.

Under the brief's severity list I found no major finding. The grep found no owner word in new prose except the quoted `expose` at A/design.md:230, which round 1 excluded. No task has two instructions. Every other fault is minor. Item 1 of the findings is the one to read first.

## Read and not read

Read:
- The brief, report-round2.md and the full round2.diff (1182 lines).
- My round-1 report.
- The current A/design.md, proposal.md, tasks.md and specs/credential-boundary/spec.md.
- The osh and qa-scripts deltas, as they appear in the diff.
- The five QA headers, the test titles in src/googleGeocodeProxy.test.mjs, and server/providers/places/geocode.js:80-120.
- scripts/build-panel.mjs, and the Systems layer requirement in openspec/specs/osh/spec.md.
- Greps over A/ for the owner words and for -ing words.

Not read:
- The whole of SECURITY.md in the clone; I read only the changed lines through the diff.
- The osh and qa-scripts deltas word by word against main. The applied osh diff changes only osh-033, which shows the carried text is unchanged.
- The QA script bodies.
- The test bodies, except the diff hunks.

## Round-1 replacements

I checked each replacement of my round-1 report against the files. These are in place and keep the same meaning:
- the mcpPanelKey comment
- the 4000 ms ceiling text
- the osh-033 title and the "four allowed sentinels" title
- the voice-off wording
- the QA purposes and the voice-bench @run
- "Source tree:" and "Work for the lead"
- the Purpose text
- the 30 and 88 counts in the deltas

Items 3, 4 and 6 to 10 below list the replacements that are wrong or only partly done.

## Findings

Facts that disagree. Items 1 and 2 are for the spec adversary.

- [ ] FINDING minor A/design.md:341,361,363,377,383 and A/tasks.md:68 "Source tree: `7adfc97a…`, with the nine test corrections above" and "All eight changed test processes pass" -> "eight" in the pass-4 lines, or "eight, and Pass 5 adds the ninth".
  - Lines 341 and 363 say eight for the same pass-4 run that lines 361 and 383 call nine. Line 377 and task 5.3 also say nine.
  - The ninth file, mcpPanelKey.test.mjs, comes from Pass 5 (lines 318-331), after the tree 7adfc97a.
  - My round-1 request to change "eight" at 362 and 384 was wrong for the pass-4 history. The worker applied it.
  - Under my base rule ("disagrees with the other prose of the change") this would be major. The brief's severity list does not include it, so I mark it minor. The lead should still correct it.
- [ ] FINDING minor A/proposal.md:104 "SECURITY.md and build-panel.mjs now name the same three browser credentials" -> "The panel build uses the standalone config, so it carries the same three browser credentials as the app. SECURITY.md names the same three."
  - scripts/build-panel.mjs names no credential. It calls `standaloneConfig`.
- [ ] FINDING minor A/proposal.md:46,52 The `###` limit sections (lines 63-114) sit under `## Pass 3 decision`, not under `## Known limits and later changes` -> "Move the heading `## Pass 3 decision` above line 46, or make the limit sections children of line 46."
- [ ] FINDING minor A/proposal.md:100 and A/design.md:38 "OSH token `3` meets the next free upstream digit `3`" -> "OSH token `3` uses a digit that upstream has not used yet. A later upstream change can use the same digit and cause a conflict."
  - Design.md says "The next free digit is `4`". One phrase has two values, 3 and 4.
  - "meets" is also vague.

New faults that a correction adds (checks 1, 3, 5)

- [ ] FINDING minor A/design.md:111,279 "one test failsed" -> line 111: "one test failed and one was skipped". Line 279: "seven test files with leaked timers and one failed row test".
  - A global replace of "one fail" broke both lines. Line 279 is now garbled.
- [ ] FINDING minor A/design.md:151 "an short-lived secret" -> "a short-lived secret".
- [ ] FINDING minor A/design.md:227 "Each fault restores `build/vite.js`" -> "Each fault check restores `build/vite.js`".
  - A fault does not restore a file.
- [ ] FINDING minor A/design.md:385,387,430 "8669 passes, zero failures and one test is skipped", "one test failure and one test is skipped", "zero fail, and one test is skipped" -> "8670 tests: 8669 pass, no test fails and one test is skipped", "6184 tests: 6182 pass, one test fails and one test is skipped", "8674 tests: 8673 pass, no test fails and one test is skipped".
  - These lines mix nouns and a clause. "zero fail" uses a verb as a noun.
- [ ] FINDING minor A/design.md:155,357 "finds the absent layer", "Run all absent files" -> "finds that the layer `osh-systems` has no entry", "Run each file that the result list does not name".
  - An absent file cannot run.
- [ ] FINDING minor A/design.md:188 "Pass 4 supersedes this limit with a 4000 ms ceiling" -> "Pass 4 replaces the 400 ms ceiling with a 4000 ms ceiling".
  - The sentence that named the 400 ms limit is gone, so "this limit" has no antecedent.
- [ ] FINDING minor A/design.md:184,188 and A/tasks.md:30 "supersede(s)" -> "replace(s)". I am fairly sure "supersede" is not approved STE. The text already uses "replaces" at design.md:206.
- [ ] FINDING minor A/tasks.md:30 "2.9 Passes 3 to 5 supersede the two-key conflict." -> "2.9 Record that passes 3 to 5 replace the two-key conflict." A task must start with an imperative verb.
- [ ] FINDING minor A/tasks.md:26 "2.6 Run each stated fault." -> "2.6 Make each stated fault." A fault is not something to run.
- [ ] FINDING minor A/design.md:377 "as read tree `7adfc97a`" -> "as source tree `7adfc97a`". A leftover of my round-1 "Read tree" finding, on a line the diff changed.
- [ ] FINDING minor A/proposal.md:84 "Vendored production code still leaves bounded one-shot timers." -> "Upstream production code still leaves bounded one-shot timers." Round 1 removed "vendored" at line 3.
- [ ] FINDING minor A/proposal.md:94,96 "both sets of child processes omit `NODE_V8_COVERAGE`", "record this acceptance in `review.md`" -> "the child processes of both race tests start without `NODE_V8_COVERAGE`", "record in `review.md` that the owner accepts this gap". "omit" is not approved and has two readings, and "acceptance" is a verb used as a noun.
- [ ] FINDING minor A/design.md:423 "A return to larger gaps needs a ledger-refresh change." -> "If the gaps become larger again, use a ledger-refresh change."
- [ ] FINDING minor A/design.md:407 "the Mapillary define", "the define is `undefined`" -> "the Mapillary entry in `define`", "the entry is `undefined`". "define" is a verb used as a noun.
  - The test title `…no server key in the browser define` is acceptable as a technical name.
- [ ] FINDING minor A/design.md:413 "Tests for the six variable gaps" -> "Tests for the six files whose gaps differ between runs". I am not sure "variable" is an approved adjective.
- [ ] FINDING minor A/design.md:422 and A/proposal.md:113 "run these files", "check these tests" -> "run the test files of this table", "check the tests of these files".
  - In the table, "files" can mean the code files or the test files. In proposal.md the paragraph names no test.

One word, one meaning (check 2)

- [ ] FINDING minor A/design.md:400,444 and A/specs/credential-boundary/spec.md:44 "The shared install serves dev and preview" and "The dev and preview installs MUST use this gate".
  - "install" is a noun from a verb. It means one function at line 400 and two hook installs at line 444 and in the requirement. The requirement has one reading alone.
  - Replace the requirement with "The route MUST call this gate on the dev server and on the preview server."
  - Replace line 400 with "The route code is shared, so the dev server and the preview server use the same gate."
  - Replace line 444 with "in the dev server and in the preview server".
  - This requirement is ADDED, so rewording it does not rehash a carried scenario. The edit changes the hash of credential-boundary-017 and credential-boundary-018; run the ratchet again after it.
- [ ] FINDING minor A/proposal.md:95, A/design.md:327 and src/tools/mcpPanelKey.test.mjs:110 "winner arms", "race branches", "race paths" -> use "branches" everywhere ("the winning branches", "no test covers the race branches").
- [ ] FINDING minor A/design.md:103,104,188,296 and A/proposal.md:90 "limit" names three things: a rate limit (103, 104), the 400 ms bound (188, proposal.md:90) and a Known-limits entry (296). The round-1 named line design.md:104 is still unchanged.
  - Write "The Google default rate limit is 120 requests per minute. The OpenAI default rate limit is 30. A value of zero removes each rate limit." Write "the entry `ranking-ceiling-not-measured`" at line 296.
  - "ceiling", "budget" (design.md:214, 287, tasks.md:66) and "limit" also name the same time bound.
- [ ] FINDING minor A/specs/credential-boundary/spec.md:13,18,35,36 "Mapillary token" -> "Mapillary client token". Line 5 of the same requirement says "the Mapillary client token". Write "the sentinel for the Mapillary client token".
- [ ] FINDING minor A/tasks.md:19 and A/design.md:72,108,168,187,216,252,268,291,337,387 "pristine" -> "unchanged upstream". Round 1 named "pristine probe" once; the word is still in 11 places.
- [ ] FINDING minor A/design.md:431 "The two allocation probes" -> "The two allocation tests". Lines 83 and 390 say "allocation tests". "probe" elsewhere names the timer probe.
- [ ] FINDING minor A/specs/credential-boundary/spec.md:47-57 and A/design.md:400-444 "gate" means the `admitSameSite` check in the requirement and scenarios, and the `make gates` gates in proposal.md:114 ("Do not weaken the gate") and tasks.md:42. Use "the same-site check" for `admitSameSite`.

Articles, nouns and verbs (checks 3 and 6)

- [ ] FINDING minor A/proposal.md:15,20 "render test cleanup blocks", "upstream remote main check" -> "the cleanup blocks in the two render tests", "the check of main on the upstream remote". Both lines were named in round 1 and are still open (four nouns).
- [ ] FINDING minor A/specs/credential-boundary/spec.md:29 "Google key, OpenAI key, JWT or Mapillary client token pattern" -> "…or a pattern for a Mapillary client token". Named in round 1, still four nouns. Scenario 004 is already in the modified list, so the edit costs nothing extra.
- [ ] FINDING minor A/design.md:424,436,443,452 noun groups and verbs used as nouns: "panel key race tests", "Google title and QA register edits", "key read count", "panel key child coverage gap" ->
  - line 424: "the child processes of both race tests of the panel key give no coverage"
  - line 436: "the final edits to the bundle test, the Google title and the QA register test"
  - line 443: "because the route reads the key once"
  - line 452: "the accepted gap in the coverage of the panel key child processes"
- [ ] FINDING minor A/specs/credential-boundary/spec.md:43 "checks the method" -> "checks the HTTP method". "method" can mean a code method.
- [ ] FINDING minor A/specs/credential-boundary/spec.md:49,57 "the same error body as the Google Places gate", "a successful upstream response gives status `200`" -> "the same error body as the Google Places routes", "the route answers `200` for a successful upstream response".
- [ ] FINDING minor src/googleGeocodeProxy.test.mjs:561,595 "${mode} refuses cross-site geocode before key access", "${mode} admits same-site geocode" -> "${mode} refuses a cross-site geocode request before key access", "${mode} admits a same-site geocode request". An article is missing, and "geocode" is a verb used as a noun. Both titles start with the scenario ID.
- [ ] FINDING minor scripts/qa-panel-resize.mjs:3, scripts/qa-panelDrag.mjs:2 and A/design.md:54,55 "after each resize", "each header press" -> "after each change of size", "each press on a header". Both are verbs used as nouns. The first is my own round-1 replacement. A header edit needs another ratchet, so the owner can accept it.
- [ ] FINDING minor A/tasks.md:81 "6.5 Correct the QA headers and the review prose." -> split into "Correct the QA headers." and "Correct the review prose." One verb with two unlike objects, the same shape as the old 5.2. I do not count it as two instructions.
- [ ] FINDING minor SECURITY.md:35,79 "The explicit browser `define` block", "the explicit `HOST=0.0.0.0` LAN opt-in" -> "The browser `define` block", "the `HOST=0.0.0.0` LAN opt-in". Owner word on lines the diff changed. The first is also in main at line 34, so it predates this change.

## Not reported

- "admit" and "admission" are technical names from `admitSameSite`. The same word is already in director/spec.md.
- "refuse" is used in existing specs and test titles.
- The carried osh and qa-scripts delta text has passive voice and -ing words ("placed", "once seen"). Rewording a carried requirement rehashes its scenarios, and the diff changed only the counts and one AND line.
- -ing words in the new prose are all technical names or prepositions: ranking, rendering, tooling, including, geocoding, `pending:` and during.
- The SECURITY.md sentence at line 106 is long, 34 words. Its structure predates this change; I changed only the noun phrase.

Note for the spec adversary: the three items at the top of the findings (eight and nine, build-panel.mjs, next free digit 3 or 4) are disagreements with other prose or with code. The brief's STE severity list does not include them, so they stay minor here.
