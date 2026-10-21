# Review: skywatch-thumbnails

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-21
Gates: make gates CHANGE=skywatch-thumbnails passed
Rounds: 3
Scope: diff 91ea3644
Reviewed-Tree: b2b8a1e15d2b8bdb11d02077bc0daa718db35ce5b1a916fbe654716228e2b252

## Findings

A plan review and a plan re-check came first (both FAIL, at 18cb7ff8 and at 8df49201). The lead corrected their findings in the plan before the first test. Their reports are outside the repository.

Round 1 had the scope full, at the commit 201b1a14. Both reviewers gave FAIL. The corrections changed the tests, the spec and the documents, so the lead moved the change back from the archive (559ba209), restored `openspec/specs` from 2bfb3a5b, ran the faults, the host tests, the checks and the ratchet again, and archived the change again (91ea3644). The code files did not change.

Round 2 had the scope diff 201b1a14. Both reviewers gave FAIL with one major finding each. The corrections changed only documents and evidence, and the lead added one fault (fault run 4). Round 3 had the scope diff 91ea3644, and both reviewers gave PASS.

The reports of each round are in `review/round-<n>/`, and the reports of round 3 are also in `review/`. Each file holds the report word for word.

After round 2, `make gates-docs` refused, because `.env.example`, `CHANGELOG.md` and `DATA_SOURCES.md` differed from the ratchet commit 8bb62bf2. AGENTS.md asks for another ratchet or all gates on the final tree for such a change. The final `make gates` is that check.

### Round 1 (commit 201b1a14)

- [x] FINDING major (spec adversary) No test checked how `localProviderPlugins()` makes the thumbnail plugin. Fixed: an AND line in 001, the test "reads process.env in localProviderPlugins, and finds a scene of the skywatch-proxy plugin of the same list", and the faults "local list makes the two plugins apart" and "thumbnail plugin does not read process.env".
- [x] FINDING major (spec adversary) The line about `x-api-key` in 008 gave only the necessary condition. Fixed: the line gives both cases, with the sample `https://API.SKYWATCH.CO/t.png`.
- [x] FINDING major (spec adversary and STE adversary) `DATA_SOURCES.md` said that each reverse proxy that removes the proxy headers can search. Fixed in round 1 and again in round 2.
- [x] FINDING major (spec adversary) No named fault made three tests fail. Fixed: the fault "port check on the raw text" and the fault "same-site step before the method step". The runner runs each fault of `image.js` on both test files, and it names each test of the change that no fault makes fail.
- [x] FINDING major (STE adversary) The requirement "Image store" said "keep each good image for 600000 ms". Fixed: "at most 32 good images, each for less than 600000 ms", also in the proposal and in `DATA_SOURCES.md`.
- [x] FINDING major (STE adversary) The requirement "Checked thumbnail URL" said "an IP address or a loopback name". Fixed: it names the host name of the URL, also in `DATA_SOURCES.md`.
- [x] FINDING major (STE adversary) The title "clears it only after it reads the body" disagreed with 008. Fixed: "does not clear it before it reads all of the body".
- [x] FINDING minor (spec adversary) The test of 012 did not use the literal URLs of the scenario. Fixed.
- [x] FINDING minor (spec adversary) `design.md` and task 1.3 said that the test of 021 gets the new field. Fixed: that test leaves the field out, and the tests of 006 check the map.
- [x] FINDING minor (spec adversary) `DATA_SOURCES.md` and `.env.example` did not say that the store of the scenes route must still keep the answer. Fixed.
- [x] FINDING minor (STE adversary) "answer" named two things in 009, 010 and 012. Fixed: "upstream answer" and "the thumbnail URL of a thumbnail request".
- [x] FINDING minor (STE adversary) "for each other URL" and "The plugin" were not clear. Fixed.
- [x] FINDING minor (STE adversary) Three test titles had a subject. Fixed.
- [x] FINDING minor (STE adversary) The Known limit `key-host` named only `upstream_failed`. Fixed: `upstream_failed` or `bad_upstream`.
- [x] FINDING minor (STE adversary) "owns the folder" used a word that is not approved. Fixed: "lists the folder ... as owned".

### Round 2 (commit 91ea3644)

- [x] FINDING major (spec adversary) No fault ran the changed test of 021 in `src/data/skywatchScenes.test.mjs`, so the count of the tests of the change in `evidence/faults.txt` was false. Fixed: the fault "map under another field name" and fault run 4 (126 of 126, 54 tests of the change).
- [x] FINDING major (STE adversary) `DATA_SOURCES.md` said that the proxy must send `Origin`. `admitSameSiteRequest()` checks `Origin` only when the request has it. Fixed.
- [x] FINDING minor (spec adversary and STE adversary) `design.md` said "keeps a good image for 600000 ms and at most 32 images". Fixed.
- [x] FINDING minor (spec adversary) `design.md` said "compares the whole result". Fixed in round 2 and again after round 3.
- [x] FINDING minor (spec adversary) The two AND lines of 001 about `localProviderPlugins()` do not follow from the WHEN of 001. Kept: the lead accepts this minor finding under the owner rule. A new WHEN changes the hash of 001 and needs another ratchet. The test of 001 makes the list and sends a search, and two faults make it fail.
- [x] FINDING minor (STE adversary) "the store still keeps" named no store in `.env.example` and `CHANGELOG.md`. Fixed: "the store of the scenes route".
- [x] FINDING minor (STE adversary) A sentence of `evidence/host-run.txt` had no verb. Fixed.
- [x] FINDING minor (STE adversary) The list of the result lines in `evidence/checks.txt` named the wrong checks. Fixed.

### Round 3 (commit 479eb5ba)

Both reviewers gave PASS. The spec adversary gave no finding. The lead corrected the four minor findings of the STE adversary, and the proposal records them as the review minor `round3-wording`.

- [x] FINDING minor (STE adversary) The note about the list of run 3 in `evidence/faults.txt` had two meanings. Fixed.
- [x] FINDING minor (STE adversary) Two sentences of `evidence/faults.txt` used "run" in two ways. Fixed.
- [x] FINDING minor (STE adversary) `design.md` used a phrasal verb in "left out of the comparison". Fixed: "without the fields `scenes` and `thumbnailUrls`".
- [x] FINDING minor (STE adversary) A sentence of `CHANGELOG.md` had 41 words. Fixed: two sentences. The lead also cut the last sentence of that entry to 24 words.
