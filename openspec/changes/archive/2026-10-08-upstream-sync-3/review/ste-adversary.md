Verdict: PASS

Tree: clone /home/ianblenke/docker/gev-work/upstream-sync-3, branch upstream-sync-3. I read the commit from .git/refs/heads/upstream-sync-3. It is c5550c683e385932ee69e2f7045f51852f096c35, and .git/HEAD points to that branch. "A/" below means openspec/changes/archive/2026-10-08-upstream-sync-3/.

I found no major finding. Under the brief's list, none of these is a banned word, a two-meaning word in a requirement, scenario or test title, or a task with two instructions. Every finding below is minor. The two closest to major are explained after the findings. Some minor findings are the lead's own new faults. Some come from the replacement text that round 2 gave. I mark those "(round-2 text)".

## Read and not read

Read:
- report-round3.md and the whole round3.diff.
- My round-2 report in A/review/ste-adversary.md.
- The current A/design.md, A/proposal.md and A/tasks.md, in full.
- openspec/ste/words.json.
- server/providers/mapillary/tiles.js lines 195-284.
- src/tooling/mapillaryProvider.test.mjs lines 440-509, plus a grep of its test titles.
- The -ing words and the owner words, by grep, over A/design.md, A/proposal.md and A/tasks.md.
- The same owner-word grep over the three QA headers.
- scripts/qa-panelDrag.mjs, by grep.
- src/ui/panelPositionControls.js:730, to confirm the 0 ms delay of panelDock.
- src/googleGeocodeProxy.test.mjs:577-608, by grep.
- /tmp/claude-1000/gcr/tiles-image.log, tiles-image2.log and tiles-image3.log.
- The word "tolerance" and the QA "advice" lines in openspec/specs/.

Not read:
- The delta specs, review.md and SECURITY.md.
- The QA script bodies, except the grepped lines.
- The 18 test files.
- Any lint output. The brief gave none, and I cannot run it. I checked these by hand:
  - No new sentence is over 25 words.
  - No paragraph is over 6 sentences. The paragraph at A/design.md:439-442 has exactly 6, so one more sentence breaks the limit.
  - The only owner word in A/ is the quoted `expose` at A/design.md:232. That line is unchanged, and round 1 excluded it.
  - The diff adds no allowedIng word.
  - No task has two instructions.

## Findings

Check 1 (words) and check 2 (one word, one meaning)

- [ ] FINDING minor A/proposal.md:62,65,66,78 and A/design.md:439,441 and A/tasks.md:103,105,106 "Ten upstream test edits", "these test corrections", "The test edit adds no test", "Edit the sweep test", "after the test edit" -> One thing has two names, "edit" and "correction". "Edit" is also a verb used as a noun. Use "correction" as lines 65-66 and the "Pass 4 test corrections" table do. Heading: "Ten upstream test corrections". design.md:441: "The correction adds no test." Task 7.4: "Run the image ratchet after the test correction." Task 7.5: "Run the final image gates on the tree after the test correction."
- [ ] FINDING minor A/proposal.md:101,99,138 and A/design.md:329 "winner branches", "the branches that only the winner of the race reaches", "race branches" -> One thing has two names. Use "race branches" in all four places. Line 99: "The branches at lines 37, 49 and 108 of that file are the race branches that only the winner of the race reaches." A line is not a branch. Line 101: "are not race branches".
- [ ] FINDING minor A/proposal.md:150,151 and A/design.md:405 "a forwarding header", "a proxy signal", "proxy headers" -> Three names for one thing. "Forwarding" is an -ing word that is not a technical name. The test uses the header x-forwarded-for (src/googleGeocodeProxy.test.mjs:578). Line 150: "an `X-Forwarded-For` header". Line 151: "The `X-Forwarded-For` header is a proxy header, not a cross-site header." design.md:405: "proxy headers" can stay.
- [ ] FINDING minor A/design.md:411,412 "The QA voice bench command needs ...", "Its header example uses" -> This noun group has four nouns (QA, voice, bench, command). "Header" here means the QA header, and the same text elsewhere means a panel header. Write: "The script `scripts/qa-voice-bench.mjs` needs the options `--provider` and `--model`. The `@run` line in its header shows the example `--provider ollama --model <id>`."
- [ ] FINDING minor A/design.md:359 "the result file list" and "the result list" -> One thing has two names, in two sentences next to each other. Use "the result file list" twice. The second sentence also has a word that can attach to two verbs: "Run each file that the result list does not name before the final report." Write: "Before the final report, run each file that the result file list does not name."
- [ ] FINDING minor A/proposal.md:126 "files with base content", "covers" -> "Covers" means "applies to" here, and it means test coverage in the rest of the section. "Base content" has no article. Write: "The count tolerance applies only to files that have the content of the base commit. The lead expects that it does not apply to these two files." "We" is also not used elsewhere in the prose.
- [ ] FINDING minor A/proposal.md:133 and A/design.md:430 "wording minors in files that need a new ratchet or upstream text", "Pass 6" -> "Wording" is an -ing word that is not a technical name. "Minors" is an adjective used as a noun. "Files that need ... upstream text" can be read in two ways. Write: "Review round 2 lists minor wording findings in two kinds of file: files where a change needs a new ratchet, and files with text from upstream." design.md:430 heading "Pass 6": this is a note only. Only this heading uses that label, and the work after pass 5 is called "Round 1" in other headings. A name such as "Final gates correction" is clearer. The section also sits between "Round 1 decisions" and "Round 1 host result", which belong together.

Check 3 (verbs)

- [ ] FINDING minor A/proposal.md:122 and A/design.md:432,435,436,440,441 "The first final gates run found", "in 10 image runs", "ran in 7 runs", "The handler now runs in each run", "The host run passes" -> "Run" is a verb used as a noun. "The first final gates run found" can also be read as "the final gates run [verb]". Line 440 uses "run" in two roles in one clause: the handler executes, and a test execution is a run. Write proposal.md:122: "The first run of the final gates found 7 uncovered functions". design.md:435: "when the image ran them 10 times". design.md:436: "ran in 7 of these 10 times". design.md:440: "The handler now runs each time that the test file runs, so the count of uncovered functions stays at 6." design.md:441: "The test file passes all 51 tests on the host, and the handler runs once."
- [ ] FINDING minor A/proposal.md:122 "hit that race", "and alone it never did" -> "Hit" is a vague verb. "Did" stands in for another verb, and STE does not allow that. Write: "Under load, the process of `mapillaryProvider.test.mjs` reached that case in 7 of 10 image runs." The second clause is in the finding on "Three test files" below.
- [ ] FINDING minor A/proposal.md:125 "Totals can drift between runs." -> "Drift" is not an approved verb. Write: "Totals can change between runs."
- [ ] FINDING minor A/proposal.md:88 "Each timer fires once." -> "Fires" is vague in this sense. Write: "Each timer calls its function once."
- [ ] FINDING minor A/proposal.md:143,145 "its test pin `pending:application-shell`", "a later spec would not show them" -> "Pin" is vague. "Its test pin" can be read as a noun group. "Would" is not an approved tense. Write: "The scenario `qa-scripts-023` and its test check the tag `pending:application-shell` for three scripts only." and "so the advice will not show them to the author of a later spec."
- [ ] FINDING minor A/design.md:39 and A/proposal.md:106 "the digit that upstream allocates next" -> The action is in the future, so STE needs the simple future. The text also guesses what upstream will do. Write: "OSH token `3` is the digit that comes next in the upstream allocation order, so a later upstream change can cause a conflict." Use the same words in proposal.md:106.
- [ ] FINDING minor A/proposal.md:150,151 "The tests for `017` refuse four request shapes", "The tests also refuse a POST request" -> The route refuses a request, not the tests. Write: "The tests for `017` check that the route refuses four request shapes" and "The tests also check that the route refuses a POST request with a cross-site header before the method check."
- [ ] FINDING minor A/design.md:437 and A/design.md:439 "while a write moves its temporary file", "A replacement of `fsp.stat` makes" -> "Write" and "replacement" are verbs used as nouns. Write for 437: "A background sweep lists the cache folder while the cache writes a tile and renames the temporary file of that tile. The stat call for the old name of the temporary file then fails, the handler returns `null`, and the sweep skips the file." Write for 439: "The test replaces `fsp.stat` for a short time, so the stat call of that file fails. The test checks that the sweep skips the file."

Check 4 (voice)

- [ ] FINDING minor A/design.md:402 "The route code is shared, so the dev server and the preview server use the same gate." -> This is passive in a description (round-2 text). Write: "The dev server and the preview server share the route code, so both use the same gate."
- [ ] FINDING minor src/tooling/mapillaryProvider.test.mjs:479 "A tile that vanishes between the directory listing and its stat is skipped." -> Passive voice. "Listing" is an -ing word that is not in allowedIng. "Directory" and "folder" (design.md:437) name one thing. "Its stat" uses "stat" as a noun. Write: "The sweep skips a tile file that vanishes after the sweep lists the folder and before it calls `stat` on the file."

Check 6 (articles and nouns)

- [ ] FINDING minor A/design.md:428,470 "both panel key race tests", "the panel key child processes" -> Each group has four nouns. Round 2 gave a replacement for the first one, and the correction did not follow it. Write: "the child processes of the two race tests of the panel key give no coverage". Line 470: "the accepted gap in the coverage of the child processes of the panel key tests".
- [ ] FINDING minor A/proposal.md:128 "The lead must check the tests of these files in the image." -> "These files" can mean the six files (line 118), the two files (line 125), or tiles.js (line 122). Write: "The lead must check in the image the tests of the six files above and of `server/providers/places/google.js`."
- [ ] FINDING minor A/proposal.md:137 "the two test titles lack an article" -> "Lack" is not an approved verb. Write: "the two test titles have no article".
- [ ] FINDING minor A/design.md:435 and A/proposal.md:122 "Three test files ... never ran any of them", "alone it never did" -> "Them" has its noun in the paragraph above. "Alone" means one file, but design says three files. The log tiles-image.log shows 62 tests in each of its 10 runs. design.md:441 says mapillaryProvider.test.mjs has 51 tests, so that run was not the file alone. I infer this from the counts; I did not see the command. Write for design.md:435: "In 10 image runs of three test files that load `tiles.js`, no process ran any of these 7 handlers." Write for proposal.md:122: "In 10 image runs of three test files, no process reached it." The spec adversary should check the numbers (see below).
- [ ] FINDING minor A/proposal.md:84,85,87 "Upstream production code still leaves one-shot timers", "The streetLevelControls test leaves", "The gevRealtime fixtures leave" -> The subject changes. Line 84 says the production code leaves the timers. Lines 85 and 87 say the tests leave them. Write line 85: "The streetLevelControls test ends with one animation frame callback still open." Write line 87: "The gevRealtime fixtures end with 56 metric deadlines and 10 narration deadlines still open".

Check 7 (instructions)

- [ ] FINDING minor A/tasks.md:30 "2.9 Record that pass 3 replaces the two-key conflict." -> A conflict is resolved, not replaced. design.md:172 says "Pass 3 resolves the spec conflict". Write: "2.9 Record that pass 3 resolves the two-key conflict."
- [ ] FINDING minor A/tasks.md:42,98,106 "3.6 Run make gates ... on the final tree", "Run the final image gates on the tree after round 2", "7.5 Run the final image gates on the tree after the test edit" -> Three open tasks name one run. The run after round 2 already happened and failed. The text is not false, because the final tree is also "the tree after round 2", so I rate it minor. Delete line 98, or merge it into 7.5.
- [ ] FINDING minor A/tasks.md:103 and A/proposal.md:122 "Edit the sweep test", "The edit to the sweep test in that file" -> The file has at least three tests with "sweep" in the title (lines 471, 498, 515). design.md:439 names the right one, but the task does not. Write: "7.2 Edit the test `the disk sweep removes expired tiles and keeps fresh ones` so that the stat handler runs each time." Proposal: "The change to the test `the disk sweep removes expired tiles and keeps fresh ones` makes the function run each time."

## The two items closest to major

- A/design.md:437 "The stat call of the moved file then fails, and the handler skips it" is minor, not major. The sentence before it says "its temporary file", so "the moved file" means the temporary file. tiles.js:198,208,255 agree: the listed name is *.tmp, and the rename removes it. A reader could still take "the moved file" for the tile at its new name. The text at design.md:439 and the test comment speak of a "tile file" that vanishes. The mechanism is loose in one more place. The handler returns null, and the loop at tiles.js:256 skips the file. The replacement is in the "Write" finding on design.md:437 above.
- A/tasks.md:98 is minor, not major, as I explain in its finding. Round 2 used the same rule. A text that is not false, and gives no reader a wrong action, stays minor.

## Notes for the spec adversary and the lead

- The number-source claims in A/proposal.md:122 and A/design.md:436 say "7 of 10" and "only in the process of mapillaryProvider.test.mjs". tiles-image2.log has 10 runs and 7 hits, with no attribution. tiles-image3.log has 8 runs, 7 hits, and attribution to that file. The "only in" claim therefore rests on 8 runs, and the "10 runs" claim has no attribution. The logs record only line 255, so I cannot confirm "never ran any of them" for the other six handlers.
- A/proposal.md:78 adds a tenth candidate to the list that "the owner approves" for an upstream pull request. The table at A/design.md:305-315 has nine rows with "Send upstream? yes" and no row for mapillaryProvider.test.mjs. No text says the owner approved the tenth.

## Not reported, with reasons

- "press" in scripts/qa-panelDrag.mjs:2 and A/design.md:56: I accept it. It is the technical name of the test action (code field `pressed`, selector `.panel-header`). It is the round-2 replacement, and I do not change my advice. "Header" has two meanings there, the QA header and the panel header, but the code names the panel part `panel-header`.
- "after each change of size" (scripts/qa-panel-resize.mjs:3, A/design.md:57): "change" is an approved noun.
- "is skipped" and "was skipped" in A/design.md:113,387,389,448 are test status words, and round 2 accepted them.
- The noun "run" in other design text that the diff does not touch.
- "The Google default rate limit" (A/design.md:105,106): "default" is an adjective, so the group has three nouns.
- The words "gate", "install" and "method" in the credential-boundary spec: the lead accepts them by name in A/proposal.md:135.
- The @needs line of scripts/qa-voice-bench.mjs ("A local Ollama server with the model, or credentials for the other selected providers."): clear, one reading, and it agrees with the @run line.
- "digit" and "token" in A/design.md:39,40 and A/proposal.md:106-108: the same pair, used the same way in both files. They agree with each other.
