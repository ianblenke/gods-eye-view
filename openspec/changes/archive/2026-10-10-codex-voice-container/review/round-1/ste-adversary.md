Verdict: FAIL

Commit read: 9469f0885ef6fa84680f0c6ceb53fd0e3555dc54 (clone gev-work/codex-voice-container). "archive" means openspec/changes/archive/2026-10-10-codex-voice-container/. I found no banned word or form in the new prose, except in a quoted app message (below).

- [ ] FINDING major docs/fork/codex-voice-docker.md:24 (9469f088) "The sign-in button of the app shows an error" is false when the sign-in of the host is valid. This is the same button that step 4 tells the user to choose.
  - keySetup.js:472-486 reads `oauth-status` first and selects OAuth with no login.
  - codex-auth.js:281 `start()` returns without a spawn when `credentials().available`.
  - Only a missing or expired sign-in reaches the spawn and the error.
  - The same flaw is in archive/proposal.md:31 (`sign-in`) and archive/design.md:25 (D3, "The sign-in button starts `codex login`").
  - No check measured the `oauth-login` route (e2e.txt:60 says so).
  - I checked the three replacements against keySetup.js and codex-auth.js; the longest new sentence has 22 words.
    - Doc: "The image has no Codex program. When the sign-in of the host is missing or has expired, the button of the app starts `codex login` and shows an error. Sign in on the host with `codex login`."
    - Proposal: the same second sentence, then "The user signs in on the host with `codex login`."
    - D3: "When the sign-in is missing or has expired, the sign-in button starts `codex login` with no terminal, and Codex opens the browser itself."

The rest of the checks found no major:
- **Spec and evidence:** the Purpose equals design.md. The delta spec equals the main spec. The 22 faults in mutations.txt cover each part of the four scenarios, and all 22 appear in mutations-run.txt. The numbers fit: 919 = 915 + 4 scenarios, and 9604 = 9600 + 4 tests.
- **Claims checked true:** the LAN address and localhost results in e2e.txt, the "keys: available" reading (codex-auth.js:241-259), the discarded port warning, the root-owned folder, and the account of the missing `.env` after a new container. The compose.yaml comment is true for `make up` only.
- **Not measured:**
  - "Codex opens the browser itself".
  - "The file holds a refresh token" (proposal `tokens`, doc:30).
  - `make down` after `make up-codex` (doc:12).
  - `ssh -L` passing the loopback check.
- **Limits:** I found no sentence over 25 words and no task over 20 words. Every paragraph has 6 sentences or fewer, except the one below.

- [ ] FINDING minor archive/evidence/e2e.txt:53 One bullet has 7 sentences (limit 6). Split it into two bullets. It also quotes the app message "Provider Settings requires an exact local Origin", which holds the banned word "requires". This is a quote, so keep it.
- [ ] FINDING minor docs/fork/codex-voice-docker.md:32 and archive/proposal.md:37 "has the number 1000" does not say whose number. Write "has the user number 1000".
- [ ] FINDING minor docs/fork/codex-voice-docker.md:31 "The server reads only `auth.json`" and line 25 ("looks for a Codex program") look contradictory. Write: "The server reads only `auth.json` from it, and it can start a Codex program (see the limit above)."
- [ ] FINDING minor compose.codex.yaml:2 "Sign in once on the host" disagrees with the expiry limit. Write: "Sign in on the host with: codex login".
- [ ] FINDING minor archive/specs/app-container/spec.md:5 "The target `up` MUST stay as it is" is vague, though scenario 004 pins the lines. Write: 'The target `up` MUST run "docker compose build" and then "docker compose up --force-recreate" and no other command.' This matches Makefile lines 22-24, but it needs a new ratchet, so the lead may keep it.
- [ ] FINDING minor archive/proposal.md:45 (`not-run`) Add that `make down` after `make up-codex` was not run, as doc:12 tells the user to use it.
