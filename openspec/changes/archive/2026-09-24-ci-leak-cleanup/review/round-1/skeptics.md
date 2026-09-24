# Skeptic verdicts of round 1

One skeptic for each major or critical finding. Minor findings had none.

## ste S2: real=True, severity fair=True, fix ok=True

Real contradiction. proposal.md:7 lists four live timers across three files, including one in trafficTiming.test.mjs. proposal.md:9 then says the tracer "named each timer". proposal.md:30 (`trafficTiming-timer-unnamed`) says "the tracer named no timer for src/data/trafficTiming.test.mjs". The two lines cannot both hold, so the change disagrees with its own prose, which fits the major definition. This matches the lead's fact (3): timers were named only for previewServing.test.mjs (200 ms and 50 ms optimizer timers, then the 1000 ms watcher throttle) and trackedModelRegime.test.mjs (165 ms drip timer). trafficTiming leaked in one whole-project run only. One citation is wrong: design.md:24 covers only previewServing and does not say the tracer named no timer for trafficTiming. design.md:26 and :28 discuss trafficTiming but also do not say it. Only proposal.md:30 makes that statement. This does not refute the finding, because the conflict is inside proposal.md (line 9 vs line 30). The proposed rewrite is accurate and fits the limits. "A tracer on the GitHub runner named the timers of `previewServing.test.mjs` and `trackedModelRegime.test.mjs`." is 13 words (limit 25), and the line 9 paragraph stays at 4 sentences (limit 6). It does not clash with proposal.md:30, which explains the trafficTiming gap. It also does not commit to the "two" in line 7, since previewServing showed a third timer once the optimizer was off (design.md:24). No mutation was needed. I did not change the repository. The working-tree diff (trafficTiming.test.mjs gets optimizeDeps noDiscovery and watch: null; trackedModelRegime.test.mjs gets a mock setTimeout) matches the prose. Optional: report the citation as proposal.md:9 versus proposal.md:30 only.

## ste S1: real=True, severity fair=True, fix ok=True

CONFIRMED. proposal.md:5 says "This check is the first step of the Node 24, Node 26 and Windows jobs". .github/workflows/ci.yml disagrees. In job `verify` (name `Node ${{ matrix.node }}`, so "Node 24.14.0" and "Node 26.x") the steps are: checkout (l.28), setup-node (l.33), `npm ci` (l.39), `npm run doctor` (l.42), then `npm run format:check` (l.45). That is step 5, and it is not even the first check, because doctor comes before it. In job `windows-onboarding` (name "Windows onboarding") the steps are: checkout (l.98), setup-node (l.103), pinokio-install (l.109), then `npm run format:check` (l.112). That is step 4. ci.yml is identical to origin/main (`git diff origin/main -- .github` is empty), so the change does not touch it. The consequence in the text, that the jobs stop at the failed check, is true: ci.yml has no `continue-on-error`, and the only `if: always()` is in `spec-gates` (l.83). So the wrong part is "first step". Severity major is fair, because the text does not agree with the code. design.md and tasks.md do not repeat the claim (grep for "first step", "Node 24", "Windows" finds only proposal.md:5). The proposed job names are right: "Node 24.14.0", "Node 26.x", "Windows onboarding". Fix check: the rewrite reads "This check is a step of the jobs "Node 24.14.0", "Node 26.x" and "Windows onboarding". When the check fails, the job stops and the later steps do not run." The two sentences have 15 and 14 words, and the paragraph goes from 2 to 3 sentences (limits are 25 and 6). I applied it in a private copy and ran `node scripts/spec/gates.mjs lint --root <copy>`. Result: 0 errors. The only new item is a WARN STE-ING on the word "onboarding" at proposal.md:5. It is a job name, it is a warning only, and it cannot be avoided if the exact name is used. The rewrite is correct as proposed. The quote style matches the existing "Spec gates" on line 7. The repository was not changed (`git status` is clean). The mutation copy is at /tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/ci-r1/skeptic-ste-S1/copy.

## ste S7: real=True, severity fair=True, fix ok=True

Real. design.md:49 says "the three tests serve fixture pages and provider JSON." That is false for the third test. The Vite test in src/data/trafficTiming.test.mjs (test at line 125, createServer at line 160, `middlewareMode: true, watch: null` at line 168) only calls `server.ssrLoadModule('/src/data/traffic.js')` at line 177. A grep of that file shows no `listen`, no `middlewares`, no `transformIndexHtml` and no `index.html`. The only "JSON" there is a stubbed `globalThis.fetch` at about lines 179-186, which Vite does not serve. Only the two tests in src/tooling/previewServing.test.mjs serve a page and JSON. Test 1 (line 29) fetches `/api/*` and `/`, and test 2 (line 161, the credential-boundary-007 test) fetches the geocode route. Each writes a fixture index.html. Test 2 fetches only JSON, but its server does sit over the fixture page, so "serve a fixture page" is acceptable there. The count "three" fits 2 + 1, but the sentence can also be read as three tests in one file or as the three files, and that is a second reading. Line 26 gives the reason "The page of each fixture has no script" only for the fixture tests. The trafficTiming test gets "the same two options" with no reason. Line 49 also contradicts line 26, which describes trafficTiming as a middleware-mode server over the project root. The design says nothing about the optimizer for trafficTiming. Major is fair under the lead's definition, since the text disagrees with the code.

Fix is correct. I linted it in a private copy (/tmp/claude-1000/-home-ianblenke-docker-gods-eye-view/bdb4f5c7-182e-45ee-82b1-3e3b1892873d/scratchpad/ci-r1/skeptic-ste-S7/lint-s7.mjs) using the repo's own scripts/spec/lib/ste.mjs. The rewritten bullet gives no new error or warning. The sentence lengths are 12, 9 and 8 words, plus one 5-word lead sentence and the "Unlikely:" sentence of 13 words. That is 4 sentences, below the 6-sentence limit and under the 25-word limit. The only warnings are the existing -ing words at lines 5, 38 and 48. "None of the three tests checks the optimizer" is true and keeps the old meaning of "They do not test the optimizer."

Two small adjustments:
1. Write "Unlikely." with a period, not "Unlikely: The", because the capital T after a colon reads as a slip. The linter treats both the same.
2. Optionally tighten design.md:26 so it does not cover trafficTiming by accident: "The page of each fixture has no script, so the two `previewServing.test.mjs` tests need no dependency discovery and no file watcher." That is 21 words and lints clean. The finding does not require it.

## ste S5: real=True, severity fair=True, fix ok=True

CONFIRMED. The cited text disagrees with the code. Evidence:
- design.md:32 says "The two fleet-loader tests ... call the fleet loader of a flights layer. The loader queues a type enrichment. The queue parks one drip timer". proposal.md:16 says "The flights layer parks a drip timer in these tests". The second test in src/data/trackedModelRegime.test.mjs uses militaryFlightsLayer (LAYERS entry at :222). It comes from createMilitaryFlightLayer in src/layers/military/index.js.
- `grep setTimeout` over src/layers/military, src/data/militaryFlights.js and src/data/militaryRegistry.js finds nothing. src/layers/military has no enrichment.js and no `_enqueueEnrich`.
- `_enrichDripTimer` appears only in src/layers/flights/{state.js:384, enrichment.js:45-46, lifecycle.js:311}. The setTimeout is at enrichment.js:46 (`wait = ENRICH_DISPATCH_GAP_MS(200) - elapsed`).
- The two tests are one body in a `for (const fixture of LAYERS)` loop (:248-249, mock at :252). So the mock is applied to both runs, but only the flights run has a timer to mock.
- Mutation, run in a private copy with the mock line removed and the preload2.mjs tracer:
  - `--test-name-pattern '^flights: production fleet loader'` gave active resources ["PipeWrap","PipeWrap","Timeout"] and one pending Timeout from `_drainEnrich <- _enqueueEnrich` at flights/enrichment.js:46.
  - `--test-name-pattern '^militaryFlights: production fleet loader'` gave ["PipeWrap","PipeWrap"], no Timeout.
  - Running both gave the same single flights timer.
- The reading "a flights layer" = any flight layer does not save the text. The next sentences ("The loader queues a type enrichment. The queue parks one drip timer") are false for the military loader. The text and the code disagree, which the rubric rates major. Severity is fair.

Fix: the proposed rewrite is correct, and it fits the limits. It is 4 sentences of at most 15 words each. I applied it in the private copy together with a matching proposal edit and ran `node scripts/spec/gates.mjs lint --root .`. It gave 0 errors and no new warnings against the 4 existing ones in this change (timing x2, formatting, "is proven").
- Two gaps remain in it.
  - The next sentence, "The layer clears that timer only in its own teardown, and these tests do not run it", keeps "these tests" (plural). Change it to "the `flights` test does not run it". The design paragraph is then 5 sentences, within the 6 limit.
  - proposal.md:16 needs its own edit, because the finding's text is for design.md only. Suggested: "In `src/data/trackedModelRegime.test.mjs`, use a mock `setTimeout` in the fleet-loader test body. The `flights` test parks a drip timer, and the real one stays live."
- Optional and not a blocker: "about 165 ms" is the runner value. The code delay is 200 ms minus the time since the last dispatch (policy.js:234). The host tracer showed about 80 ms. "of up to 200 ms" would match the code better.
- tasks.md:24 ("the two fleet-loader tests") is acceptable as it stands: it counts two named test instances.

## ste S4: real=True, severity fair=True, fix ok=False

REAL. design.md:16 (Non-Goals) reads "Every leak is in test code, or in a library that a test starts." D2 (design.md:32) says "The queue parks one drip timer ... The layer clears that timer only in its own teardown", and design.md:34 says "A change to the layer ... is a code change, and this change makes none". Its 'D2 cites enrichment.js:46' claim is loose: D2 names no path, but the line is right. src/layers/flights/enrichment.js:45-46 is `flightState._enrichDripTimer = setTimeout(...)` inside `_drainEnrich`, and `git diff origin/main -- src` touches only the 3 test files. I reproduced it in a private copy at skeptic-ste-S4/copy with origin/main's trackedModelRegime.test.mjs and preload2.mjs. The tracer printed `[leak] pending Timeout 82ms ... setTimeout <- _drainEnrich (src/layers/flights/enrichment.js:46:42) <- _enqueueEnrich (enrichment.js:29:5)`. So the timer is created in production app code. It is not test code, and a flights layer is not a "library" like Vite. The sentence has two readings. Reading 1: "leak" means the timer's creation site, and then it is false for the drip timer and contradicts D2. Reading 2: "leak" means a missing teardown, and then the Vite leaks are called "in a library", which is inconsistent. It also sits under the Non-Goal "Change a production code file" and wrongly implies no leak lives in production code. Major is fair under the rubric (two meanings, and it disagrees with D2 and the code). proposal.md:3 ("Both faults are in test files") makes a similar claim, but it means the failing files, so it is out of this finding's scope.

FIX: the proposed sentence is accurate in substance and STE-clean (19 words; lintMarkdown returns no findings). But "a timer that a test starts" is wrong in its own way. A test does not start a timer. Vite starts its timers (D1), and the flights queue starts the drip timer (D2). It also lets "in a library (Vite) or in the flights layer" attach to either "timer" or "test", so a second ambiguity remains. Use: "Every leak is a timer in a library (Vite) or in the flights layer, and a test starts both." (19 words; I ran lintMarkdown on it in a scratch file and it gave no STE finding). Simpler alternative, also STE-clean: "Every leak is a timer in Vite or in the flights layer. A test starts both, and it can avoid each timer." Both keep "a test starts" on the library and the layer, where the original had it, and both agree with D1 and D2.

## ste S6: real=True, severity fair=True, fix ok=False

REAL, major is fair. I could not check which run gave which result, because I have no gh or network access.

Evidence for the defect:
- design.md:38 says "The fix branch ran on the runner with the plain gates against `HEAD`. The run listed no `GATES-TEST-LEAK` and no formatting error."
- scripts/spec/gates.mjs and scripts/spec/lib/test-guard.mjs contain no formatting check. Grep for "format" in scripts/spec finds nothing relevant. The gate codes are GATES-TEST-RUN, GATES-TEST-LEAK, GATES-BASE and so on (gates.mjs:41, 156, 241, 345, 393).
- "Needs formatting: <name>" exists only at scripts/format.mjs:90, run as `npm run format:check` (package.json:37).
- In .github/workflows/ci.yml, `npm run format:check` is the step "Check adopted formatting" (lines 45-46 and 112-113). It is in the jobs "Node 24.14.0", "Node 26.x" and "Windows onboarding". The job "Spec gates" (lines 57-80) runs only `node scripts/spec/gates.mjs ci --base origin/...`.
- proposal.md:28 says `make gates` does not run `npm run format:check`. design.md:44 lists the format check as a separate condition.
- So a run of the plain gates cannot list a formatting error. "No formatting error" is true only because the gates never look. It is therefore no runner evidence for the format fix, and it disagrees with the code and the other prose.

Sanity check, done in a private copy of the working tree: `node scripts/format.mjs --check` printed "Checked 457 adopted files." and exited 0. The current tree passes the format check. Task 5.4 is still unchecked in tasks.md.

The proposed fix is wrong as written, for four reasons:
1. It asserts that the fix branch "ran the CI workflow" and that the step `npm run format:check` passed. The lead's fact (4) and design.md:38 say only "plain gates". tasks.md:1.2 says the tracer branch used a temporary workflow, and ci.yml runs only on pull_request or push to main. Nothing in the repo shows that the full CI workflow ran on the fix branch.
2. The step `npm run format:check` is not in the job "Spec gates". The fix names no job for it, so a reader can place it in "Spec gates".
3. The next sentence, "Its only errors were the two temporary diagnostic files", loses its antecedent. "Its" now points at "the step" or "the job". That is a new ambiguity.
4. I could not check either claim (see the top).

Correct fix. Pick the variant that matches the lead's record of the run.

Variant A applies if the full CI workflow ran on the fix branch and the format step passed. Name the job of the format step in place of the second sentence if that is known. Sentence 4 has 20 words and the paragraph has 5 sentences.
"The fix branch ran the CI workflow on the runner. The job "Spec gates" listed no `GATES-TEST-LEAK`. The step `npm run format:check` passed. The job "Spec gates" also listed two errors, for the two temporary diagnostic files, which this change does not contain."

Variant B applies if only the gates ran, as fact (4) says. Sentence 3 has 17 words and the paragraph has 6 sentences with the untouched first one.
"The fix branch ran `node scripts/spec/gates.mjs ci` on the runner. The run listed no `GATES-TEST-LEAK`. The run listed two errors, for the two temporary diagnostic files, which this change does not contain. The gates do not check the format. Task 5.4 runs `npm run format:check`."

Variant B is more likely to be true, given the lead's wording. It removes the runner claim about formatting, so it is honest.

Adjacent, outside S6: proposal.md:5 says format:check is "the first step" of the Node and Windows jobs. In ci.yml it is the fifth step in "verify" (after checkout, setup-node, npm ci and doctor) and the fourth in "windows-onboarding" (after checkout, setup-node and the Pinokio install). Say "first check" or name the step.

Files: /home/ianblenke/docker/gev-ci/openspec/changes/archive/2026-09-24-ci-leak-cleanup/design.md, /home/ianblenke/docker/gev-ci/.github/workflows/ci.yml, /home/ianblenke/docker/gev-ci/scripts/format.mjs, /home/ianblenke/docker/gev-ci/scripts/spec/gates.mjs.

## ste S3: real=True, severity fair=True, fix ok=False

REAL and major fair. I opened every cited line in the working tree.

Evidence of the disagreement:
- proposal.md:22 says each fix is "proven leak-free with the tracer on the GitHub runner, and with the gates in the Docker image".
- proposal.md:7 says the Docker image gates "showed neither fault, so `make gates` passed while CI failed". design.md:5 says the same. So a passing Docker gate is the same before and after the fix and proves nothing.
- design.md:36-38 (D3) makes the proof the plain gates on the runner. It names no tracer run on the runner after the fix. The lead's fact (4) says the same.
- tasks.md:12, 19 and 25 run the tracer "in the gate image". The finding cites 2.3 and 4.2. Task 3.2 says it too, and has no "Confirm" sub-line.
- The project linter confirms the passive: `node scripts/spec/gates.mjs lint` in a private copy gives "WARN STE-PASSIVE ...proposal.md:22 Check for passive voice: "is proven"".

Host measurement with preload2.mjs (`--test-force-exit`). I ran the base files from origin/main in a private copy, three times each. I ran the fixed files in the working tree, once each.
- Base trackedModelRegime lists `Timeout` in all 3 runs (`pending Timeout 84ms ... _drainEnrich`). Fixed lists none.
- Base previewServing lists no `Timeout` in all 3 runs, only FSReqCallback and PipeWrap. Fixed lists none. So for this file a tracer run on a machine that does not leak cannot show the fix works. proposal.md:7 says the gate image is such a machine.
- Base and fixed trafficTiming list no `Timeout`.
- Result: the gate-image tracer can only confirm "no timer now", not "the fix works". "Proven" is wrong for it.

The proposed fix is right in substance but not safe to apply as written:
1. Present tense ("list", "lists") makes a standing claim from one run. That contradicts proposal.md:29-30 (`leak-is-timing-dependent`, and "One run on the runner then showed no leak" for trafficTiming). It would draw a new major finding. Use the past tense and say "one run".
2. "The plain gates" is defined only in design.md D3. The proposal never says what "plain" means. Say "without the tracer".
3. "The two files" are not named in the proposal. Name them.
4. Term: proposal.md:7 and :22 say "Docker image". Tasks use "gate image" (the precedent 2026-09-20 does too). In the proposal, keep "Docker image".

Correct replacement for proposal.md:22, a bullet of 2 sentences, 15 and 13 words. The project linter gives 0 findings on it, checked with lintMarkdown on a private copy:
"- One run of the gates on the GitHub runner, without the tracer, listed no `GATES-TEST-LEAK`. The tracer in the Docker image listed no `Timeout` for `src/tooling/previewServing.test.mjs` and `src/data/trackedModelRegime.test.mjs`."

The proposed 14-word and 17-word sentences also fit the STE limits and pass the linter. The problem with them is the tense and the undefined "plain", not the length. No change to design.md or tasks.md is needed. They already agree with this bullet: D3 gives the runner proof, and tasks 2.3 and 4.2 give the gate image tracer check.
