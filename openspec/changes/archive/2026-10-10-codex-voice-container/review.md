# Review: codex-voice-container

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-10
Gates: make gates CHANGE=codex-voice-container passed
Rounds: 2
Scope: diff 9469f0885ef6fa84680f0c6ceb53fd0e3555dc54
Reviewed-Tree: TREE_HASH_PLACEHOLDER

## Findings

The reports of round 1 are in `review/round-1/`. The reports of round 2 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the final message of the agent.
Before the ratchet, the two agents reviewed the plan three times (pre-reviews 1 to 3). The reports are outside the repository, in `/home/ianblenke/docker/gev-tools/cctv-pensacola/` (`acc-pre1-spec.md` to `acc-pre3-ste.md`).

Verdicts (spec adversary / STE adversary): pre-review 1 FAIL / FAIL; pre-review 2 FAIL / FAIL; pre-review 3 FAIL / FAIL; round 1 FAIL / FAIL; round 2 PASS / PASS.
The agents of the session kept the old severity instructions during these reviews. The brief of each round gave the severity rule of the owner, and the reports follow that rule.

### Plan pre-reviews 1 to 3

- [x] FINDING major (spec-adversary and ste-adversary) The plan had false statements: "Docker refuses ports with the host network" (Docker discards them and prints a warning), a scenario line "the service has no other volume" that was false for the running service, a test that passed with a mount of `${HOME}`, a task with two instructions, and "The check ran with Compose 5.5.1" for a container check. Corrected, and the container check measured the port warning.
- [x] FINDING minor (spec-adversary and ste-adversary) Many wording points, missing Known limits and faults. Corrected: 22 named faults, then 28, and the limits `folder`, `local-programs`, `user`, `missing-folder`, `provider-settings`, `compose` and `not-run`.

### Round 1 (scope full) - FAIL / FAIL

- [x] FINDING major (ste-adversary) The document, the proposal and D3 said that the sign-in button of the app shows an error in the container. It starts `codex login` only when the sign-in of the host is missing or has expired. Corrected in the three files after the lead read `src/keySetup.js` and `codex-auth.js`.
- [x] FINDING major (spec-adversary) The document and the proposal said that a port conflict can stop the app. Vite sets no `strictPort`, so it starts on the next free port. Corrected: both files say this, and that the lead read it in the code and did not run it.
- [x] FINDING major (spec-adversary) `evidence/e2e.txt` said that the browser must open `localhost`. A page at 127.0.0.1 passes too. Corrected: "The browser must not use the LAN address of the host."
- [x] FINDING minor (spec-adversary) The two Makefile regexes let a third recipe line after a blank line pass. Corrected: both end with `(?!\s*\t)`, and two faults show it.
- [x] FINDING minor (spec-adversary) Four parts had no named fault (the source of the mount, the Codex file in the build line, the order of the `up` lines, `ports: []` without `!reset`). Corrected: six new faults. The test of `app-container-001` matches lines anywhere in the file: recorded as the Known limit `override-scope`.
- [x] FINDING minor (spec-adversary) Known limits missing: the host program of Codex cannot finish a sign-in in the read-only mount, `/mcp` and Provider Settings answer any local program, and the voice token route, a voice session and `make down` were not run. Corrected in the proposal and the document.
- [x] FINDING minor (spec-adversary and ste-adversary) Wording: the user number, the pointer to `SECURITY.md`, the sentence of the Impact paragraph about the 21 retired IDs, the sentence "Sign in once", the bullet of `evidence/e2e.txt` with 7 sentences, and the note `make down`. Corrected.
- [x] FINDING minor (ste-adversary) The requirement text says "The target `up` MUST stay as it is". Kept on purpose: scenario 004 pins the lines, and a change of a requirement text needs a new image ratchet.

### Round 2 (scope diff 9469f088) - PASS / PASS

- [x] FINDING minor (spec-adversary and ste-adversary) The pointer to `SECURITY.md`, the word "it" for two things, the order of two sentences in `evidence/e2e.txt`, "does not fit", "after it" and the text "PR #27". Corrected in the document, the proposal and the evidence.
- [x] FINDING minor (spec-adversary) No fault changed the value of the published port of `compose.yaml`. Corrected: the fault "Change the published port value of the base file" (29 faults in all, each fails the right test).
- [x] FINDING minor (spec-adversary) The key-name read of `auth.json` had no recorded command. Corrected: `evidence/e2e.txt` names the command and the keys. The lead also listed the names of the entries of the Codex folder (names only, no content).
- [x] FINDING minor (ste-adversary) The words "settings and the history of Codex" were not measured. Corrected: `evidence/e2e.txt` lists the entry names, and the document and the proposal now name the sessions too.

## Own mistakes of the lead in this change

- [x] FINDING minor (lead) Several sentences of the lead were false when written: the ports (4199, "the same image"), the Compose version for a container check, the sign-in button, the port conflict and "the browser must open localhost". The lead now reads the code or runs the check before a sentence says it. A correction of the lead also made a sentence of 27 words twice (found by `make lint`).
- [x] FINDING minor (lead) The first image ratchet ran on a base that was out of date: the change `remove-pensacola-pack` merged during the run. The lead dropped the trace writes, merged main into the branch (one conflict in `scripts/format-scope.json`) and ran the ratchet again.

## Record of the image ratchet

The lead ran the image ratchet with `make ratchet CHANGE=codex-voice-container` in the Docker image `gods-eye-view:local` on commit `79c85e3e90e910b6d55f179a6d4388aa68a08c1a` (the merge of main `c2a24cb1` into the branch). Its log starts with `docker run` and has the line `Command: ratchet`. The only error is the missing `review.md`. The verdict lines are:

```text
Command: ratchet
Trace: 919 scenarios, 919 verified, 0 open. 9604 tests, 3709 traced, 5895 untraced.
Coverage: 1067 files, 305 complete, 53 not loaded, 0 untrue.
Owned gaps: 2 code files, 0 lines, 0 test files, 0 tests.
Upstream gaps: 760 code files, 46573 lines, 497 test files, 5895 tests.
COVERAGE-DIFF: 0 changed lines, 0 brought by the merged upstream commit, 0 need coverage.
Ratchet: 1 history lines for codex-voice-container.
Ledger: 0 entries do not match the current gaps.
ERROR REVIEW-MISSING openspec/changes/codex-voice-container/review.md Change codex-voice-container has no review.md
```

The first ratchet, on the older base (940 scenarios, only the same error), is not used: its trace writes were dropped.

After the ratchet, the lead changed the compose file comment, the document, the test file (the two regexes), the fault list and the change documents. `make gates-docs` would refuse these changes, so the lead ran the final `make gates` on the final tree.

## Known limits for the owner to confirm

- [x] FINDING minor (lead) The lead did NOT run `make up-codex`, because it replaces the app container of the owner. The container checks used `docker run` with the same network, mount and image (built from the same Dockerfile). To use the feature: run `codex login` on the host, then `make up-codex`, then open `http://localhost:4173`. Restarting the app is the choice of the owner.
- [x] FINDING minor (lead) With the host network, any program on the host passes the loopback check. The route `/mcp`, the OAuth routes and the Provider Settings panel then answer any local program. The container can also read the whole folder `~/.codex` of the host (config, history, sessions, memories, thread databases and `auth.json` with the tokens).
- [x] FINDING minor (lead) Provider Settings can save keys inside the container (measured with a fake test value). A new container does not have them.
- [x] FINDING minor (lead) Tasks 4.8 to 4.10 stay unchecked, because `tasks.md` is part of the reviewed tree. They are the review, this file and the final gate run.
