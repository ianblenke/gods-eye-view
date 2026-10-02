Verdict: FAIL

I read the three documents, the 13 QA headers and the test comments. Round 1 is complete. I did not run the scripts, so I could not check whether each purpose is true.

- [ ] FINDING major proposal.md:49 "name capabilities with the prefix `pending:`" -> "name capabilities with the prefix `pending:`, except `qa-journey-recorder.mjs`, which has `unmapped:`". D3 in design.md:41-ish says the same exception, so the two documents disagree.
- [ ] FINDING major design.md:50 "Remove the `@covers` line of `scripts/qa-terrain-429.mjs`." -> "Remove the header of `scripts/qa-terrain-429.mjs`." tasks.md:15 names a different mutation, the header.
- [ ] FINDING major design.md:54 "Make `resolveRegionRingForQuery` wait for the lookup." -> "Make the lookup wait for the slow source." tasks.md:25 names a different mutation. The same fault is in row 2.5: design says "build the key for each call", tasks says "give a new key for each call". Use one text.
- [ ] FINDING major design.md:41 "Each has an import path from a changed file that uses an edge of the merged commit that the base lacks." -> "Each has an import path from a changed file. The path uses an import link that the merged commit adds and the base does not have." "that uses" can refer to the file or to the path, and "edge" is not defined.
- [ ] FINDING major scripts/qa-military-names.mjs:3 "keep the frame speed and give close identities" -> "keep a fast frame rate and show the name of each area at close zoom". Both phrases have two possible meanings. Confirm the second against the script.
- [ ] FINDING major scripts/qa-overpass-offload.mjs:3 "work with no Overpass request" -> "work and the page does not send an Overpass request". The `@covers` line lacks `pending:alpr`, but qa-alpr-journey.mjs uses it for ALPR. Add it or explain.
- [ ] FINDING minor proposal.md:47 "The fix is in the tests" -> "The tests correct the problem". "Fix" is a noun here.
- [ ] FINDING minor proposal.md:5 "in an old install" -> "in an old installation". "Install" is a verb used as a noun.
- [ ] FINDING minor proposal.md:48 "The ceiling finds only a very large increase of the time." -> "The ceiling detects only a very large increase in time."
- [ ] FINDING minor proposal.md:44 "The adopt command records" -> "The command `adopt` records". This matches the wording of the other lines. Also design.md:45 "the tool records" -> "the command `adopt` records" (D5), so one word names one thing.
- [ ] FINDING minor design.md:45 "the file was restored after it" -> "the author restored the file after it". Active voice is possible.
- [ ] FINDING minor design.md:17 "has the token `3` since the first sync" -> "has had the token `3` since the first sync". It is the present perfect, and STE does not allow it. Use: "The first sync gave the OSH layer the token `3`."
- [ ] FINDING minor design.md:56 "measure the requirement" -> "measure this change". The change has no requirement.
- [ ] FINDING minor src/data/militaryInstallations.test.mjs:14 "A bounded ground floor resolve leaves a 1200 ms deadline timer. Let each one end." -> "A bounded ground floor lookup leaves a 1200 ms deadline timer. Wait until each timer ends." "Resolve" is a noun, a four-noun group follows, and "one" is not clear.
- [ ] FINDING minor scripts/qa-terrain-429.mjs:3 "the client retry loads terrain tiles that the server first throttles" -> "the client loads terrain tiles again after the server first throttles them". "Retry" is a noun.
- [ ] FINDING minor scripts/qa-journey-recorder.mjs:2 "screen recording and frame timing helpers" -> "helpers that record the screen and time the frames". The text has -ing words and a long noun group.
- [ ] FINDING minor scripts/qa-layer-token-twochar.mjs:3 "and a reload keep" -> "and a new page load keep". "Reload" is a noun.
- [ ] FINDING minor scripts/qa-installation-polish.mjs:2 "an item is selected" -> "the user selects an item". The text is passive.
- [ ] FINDING minor scripts/qa-alpr-journey.mjs:3 "show fast and stay stable" -> "appear quickly and do not move". "Show" has two meanings here.
- [ ] FINDING minor scripts/qa-traffic-oblique.mjs:3 "the reticle covers traffic on oblique arrivals and on zoom revisits" -> "the reticle area includes traffic after oblique arrivals and after the camera zooms to a place again". "Covers" also means `@covers`, and "revisits" is a noun.
- [ ] FINDING minor scripts/qa-traffic-motion.mjs:3 "hold still while the camera holds" -> "stay in place while the camera does not move". "Hold" has two meanings.
- [ ] FINDING minor scripts/qa-admin-outlines.mjs:3 "stay still" -> "do not move". "with no geocode request" -> "and the page does not send a geocode request".

The numbers agree across the documents (159 = 152 + 7, 13 headers, 83 scripts, 70 before, 29 rows, 6 mutations), and the checkboxes match the text.
