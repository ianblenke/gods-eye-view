# Review: beemaps-frames-limits

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-17
Gates: make gates CHANGE=beemaps-frames-limits passed
Rounds: 4
Scope: diff 9515c3d9c111800059603a2466d19820ff386d51
Reviewed-Tree: 1f1beca5cdab7a8eb06d515750a27fdcc03bba44525f57f7687f6b0c09602bf9

## Findings

The reports of rounds 1, 2 and 3 are in `review/round-1/`, `review/round-2/` and `review/round-3/`. The reports of round 4 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word.

A plan review came before the code. It had three rounds, and both reviewers gave FAIL in each round with fewer major findings each time. The reports are outside the repository, and the lead corrected all findings in the spec before the code was final.

Round 1 had the scope full, at the commit eefb43af. Both reviewers gave FAIL. Round 2 had the scope diff eefb43af, at the commit 698fa03f. Both reviewers gave FAIL again. Round 3 had the scope diff 698fa03f, at the commit 9515c3d9. The spec adversary gave FAIL with one major finding, and the STE adversary gave PASS.

Round 4 had the scope diff 9515c3d9, at the commit 9822c2f4. Both reviewers gave PASS with minor findings only. The fourth round exists because round 3 gave a major finding. A major finding always stops the build, so the lead corrected it and asked for one more round.

After the ratchet, the lead changed only the proposal, the design, `tasks.md`, `DATA_SOURCES.md`, `CHANGELOG.md` and `.env.example`. No code file, no test file and no spec file changed. So the lead did not run the faults, the mutation runs or the ratchet again. The lead added the minor findings of the spec adversary to the Known limits of the proposal, and corrected or kept the others with a reason.

### Round 1 (commit eefb43af)

- [x] FINDING major (spec adversary) The design and the proposal treated `creditsRemaining` and `notEnoughCredits` as the balance of the owner. The dashboard showed 110 dollars. Fixed: the design says only that the dashboard did not show -0.25, the design says in its log section that Bee Maps reports the fields, and the proposal says that the dashboard showed 110 dollars after the call.
- [x] FINDING minor (spec adversary) Two AND lines of the scenarios 033 and 034 have no test. Kept as the Known limit `lines-without-test`. No test changed, because a change to a test file needs a new ratchet.
- [x] FINDING minor (spec adversary) The plugin writes the credit file in place, and a clock set back resets the count. Added as the Known limits `credit-file-in-place` and `clock-set-back`.
- [x] FINDING minor (spec adversary) The proposal said that the screen does not show the credits, but the readout shows "credits left". Fixed: the proposal says "the credits used".
- [x] FINDING minor (spec adversary) `tasks.md` had no task for the new test of `beemaps-bursts-006`, and the proposal said "one sentence". Fixed: task 1.18, and the proposal and the Known limit `gate-cost-tests` say what the delta does.
- [x] FINDING minor (spec adversary) A comment in `src/data/beemapsProxy.test.mjs` is false. Kept as the Known limit `comment-in-proxy-test`. The test file did not change, because a change to a test file needs a new ratchet.
- [x] FINDING major (STE adversary) The same claim about the balance in the design and the proposal. Fixed as the first finding of this round.
- [x] FINDING major (STE adversary) The words "or that is not valid" in the proposal have two meanings. Fixed: the proposal says "or that is not JSON".
- [x] FINDING minor (STE adversary) The words "paid for" state a payment as a fact. Fixed in the proposal and the design. The Known limit has the name `frames-dropped-by-route` since round 2.
- [x] FINDING minor (STE adversary) The words "can pass the limit" have two meanings. Fixed in `DATA_SOURCES.md` and `.env.example`: "One request can take the count over the limit".
- [x] FINDING minor (STE adversary) Sentences over 25 words in `CHANGELOG.md` and `DATA_SOURCES.md`, and a wrong subject. Fixed: the sentences are split. Kept: the same wrong subject in the comment at `server/providers/beemaps.js` line 24, because a code change needs a new ratchet.
- [x] FINDING minor (STE adversary) Five test titles have words that STE does not approve. Kept: the titles are traced, a change needs a new ratchet, and no title has a banned word.
- [x] FINDING minor (STE adversary) Names and words that differ between files, and nouns used as verbs. Fixed in the proposal and the design. Kept in the spec text, in the log text "credits file not written" and in the code, because a change there needs a new ratchet.

### Round 2 (commit 698fa03f)

- [x] FINDING major (spec adversary) The Known limit `frames-dropped-by-layer` was false. The route cuts the list to 200 frames. Fixed: the name is `frames-dropped-by-route`, and the text says that the route drops the others.
- [x] FINDING major (spec adversary) The words "Nothing else sends a request" in `DATA_SOURCES.md` were false, because the layer also sends a status request. Fixed: "No other action sends a request for frames."
- [x] FINDING major (spec adversary) The Known limit `comment-in-proxy-test` said "503 in both cases", and that was false. Fixed: the test stops at the step that reads the budget file, and the test in `src/data/beemapsBudget.test.mjs` shows what happens when the plugin cannot write it.
- [x] FINDING minor (spec adversary) "one test of each of those six scenarios" is wrong for 008. Fixed: "at least one test".
- [x] FINDING minor (spec adversary) The Known limit `lines-without-test` left out the steps before the hold step. Fixed.
- [x] FINDING minor (spec adversary) "It splits that sentence in two" had no clear subject. Fixed: "The delta splits that sentence in two."
- [x] FINDING minor (spec adversary) The Known limit `crash-before-write` used "the write" as a noun. Fixed: the text says "before the plugin writes the credit file".
- [x] FINDING minor (spec adversary) The paragraph in `DATA_SOURCES.md` had two topics, and the log line has the credits only for some answers. Fixed: the paragraph is split, and the credit text was corrected again in round 3.
- [x] FINDING major (STE adversary) The same false Known limit `frames-dropped-by-layer`. Fixed as above.
- [x] FINDING major (STE adversary) The same false words "Nothing else sends a request". Fixed as above.
- [x] FINDING minor (STE adversary) The word "count" had three meanings in the proposal. Fixed: "a unit with no link to that balance" and "Bee Maps can use credits for these answers".
- [x] FINDING minor (STE adversary) "A restart keeps the count" has a wrong subject, and "It splits" is not clear. Fixed: "A file keeps the count across a restart." and "The delta splits that sentence in two."
- [x] FINDING minor (STE adversary) The word "whether" in `DATA_SOURCES.md`. Kept: it is old text of the terms of Bee Maps, and the rule limits the check to new prose.
- [x] FINDING minor (STE adversary) The line has the credits only for an answer that has a JSON body. Fixed in `DATA_SOURCES.md`, `CHANGELOG.md` and the proposal, and corrected again in round 3.
- [x] FINDING minor (STE adversary) The words "it fixes the text at the addition" in the design. Fixed: "it sets the text at the time of the addition".

### Round 3 (commit 9515c3d9)

- [x] FINDING major (spec adversary) The text said that the log line has the credits "when the answer reports them". That is false for an error reply and for a body over 4 MiB, because the route does not read those bodies. Fixed: `DATA_SOURCES.md` and the proposal say that the line has the credits when the route reads a JSON body with a status from 200 to 299. `CHANGELOG.md` keeps "any credits".
- [x] FINDING minor (spec adversary) "one line" is not exact, because a failed write of the credit file adds a second line. Fixed: "one result line" in `DATA_SOURCES.md` and `CHANGELOG.md`.
- [x] FINDING minor (STE adversary) The words "the failed read" and "the failed write" are verbs used as nouns. Fixed in the Known limit `comment-in-proxy-test`.
- [x] FINDING minor (STE adversary) The words "when the answer reports them" can mean "only when". Fixed with the major finding of this round.
- [x] FINDING minor (STE adversary) "one line" is not exact. Fixed with the minor finding of the spec adversary in this round.

### Round 4 (commit 9822c2f4)

- [x] FINDING minor (spec adversary) The status belongs to the reply, and not to the body. Kept: the sentence is true under each reading. The Known limit `log-credits-wording` says it.
- [x] FINDING minor (spec adversary) The words "its credits" do not say that a JSON body with no number gives the value `none`, and that a body of the wrong shape gives `creditsUsed` only. Added as the Known limit `log-credits-wording`. The scenarios `beemaps-source-029` and `beemaps-source-030` give the exact fields.
- [x] FINDING minor (STE adversary) The word "its" in "its credits" can mean the route, the body, the status or the line. Kept: the sentence is true under each reading, and the owner rule makes this a minor finding. The Known limit `log-credits-wording` gives the exact fields.
