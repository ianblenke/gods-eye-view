Verdict: PASS
- [ ] F1 minor openspec/changes/archive/2026-09-14-establish-spec-governance/design.md:175 "A correction to code, tests or specs needs a new review round." This sentence names only code, tests and specs. Step 10 (.claude/commands/opsx/review.md:26) and design.md:179 let the author change only the proposal and the design after a PASS. `tasks.md`, the files in `.claude/`, `AGENTS.md`, `Makefile`, `Dockerfile` and `package.json` are in neither list. An STE minor finding in a `.claude/` file is a usual case (round-24 S164 was in `.claude/agents/spec-adversary.md:54`). An author who reads design.md:175 can correct such a finding in an agent file after a PASS and start no new round. The tree hash then includes an agent file that no agent read. The known limit `review-attestation` (proposal.md:61) names only changes to the proposal and the design. To correct it, write in design.md:175: "Each other correction needs a new review round." You can also change `review-attestation` so that it says the same thing.
- [ ] F2 minor openspec/changes/archive/2026-09-14-establish-spec-governance/proposal.md:73 The known limit `gate-code` tells a person to check each change to `scripts/spec/`, `.github/workflows/` and `openspec/trace/`. It does not name `.claude/`. The files in `.claude/` set how the review works. They are the agent checks, the severity definitions, the review steps and, when one exists, a `.claude/settings.json` with hooks. A change to these files changes the review of that same change. The gate checks only the front matter keys of the two agent files (change-review-017 and the next scenarios). Step 9 (.claude/commands/opsx/review.md:22) now makes a `.claude/` edit between rounds a usual path, with no move and no ratchet. This round used that path. For example, an author can make the severity definition of "major" weaker in place after a FAIL. The next round then gives PASS, and its output is a real agent output. `review-attestation` tells a person to check the review and the agent outputs, but not the agent instructions. This finding is minor, because such an edit has no other purpose. To correct it, add `.claude/` to the folders in `gate-code` that a person must check in the pull request.

Notes:
- **Scope since round 24:** I compared the tree with the round-24 copy (`scratchpad/review-spec-r24/repo`). Only these files changed:
  - `proposal.md`: line 61 only.
  - `design.md`: lines 85–87, 175 and 179.
  - `tasks.md`: task 9.8 only.
  - `.claude/agents/spec-adversary.md`: line 54 and line 62.
  - `.claude/commands/opsx/review.md`: steps 9 and 10.

  `scripts/`, `src/tooling/`, `openspec/specs/` and `openspec/trace/` did not change, and `.claude/agents/ste-adversary.md` did not change. Thus I did not run the tests again. Round 24 ran them on the same code.
- **Round-24 F1 and F2 are recorded.** `review-attestation` now says these things:
  - After a PASS, the tree hash includes the changes to the proposal and the design.
  - The gate does not compare the severities with the verdict.
  - The gate does not check that `review.md` names each finding of the agent outputs.
  - A person must check the agent outputs.

  design.md:175 and :179 agree with step 10 for the proposal and the design (F1 above is the only gap). The agent output rule at spec-adversary.md:62 now agrees with step 10. Task 9.8 agrees with steps 9 and 10.
- **The in-place path in step 9:** I did not find a gap that the gates and the known limits do not name, except F2.
  - The path starts again at step 3. The gates run again, and the two agents read the new tree. So no text that the path changes goes into the tree hash without a review.
  - The path does not run `make ratchet`. A change to the proposal, the design or `tasks.md` does not change `ids.json`, `links.json` or the ledger. `ids.json` hashes only the scenarios in the specs.
  - `inventory.mjs` does not exclude `.claude/`. A tracked code file in `.claude/` with a code extension is thus a new gap, and the base comparison stops for it. A `.claude/` file with no code extension is in `inventory-extensions`.
  - `tasks.md` in the archive: `lintSpecs` still reads it for SPEC-LINT-NO-TASK (gates.mjs:209–211). Check 9 of the agent checks the task order.
  - Step 3 does not stop for errors that are not review errors. But the spec adversary reports each error (check 8), and steps 10 and 13 need the gates to pass.
  - A critical finding cannot become smaller because of a known limit. So the next round reports it again when the author corrects it only in the proposal.
- **Gate output:** The only error is `REVIEW-MISSING`, which is expected. "STE: 0 errors, 0 warnings." `MaxListenersExceededWarning` is a Node warning, not a gate warning.
- **Not reported:**
  - The Claude Code session possibly reads the agent files only when it starts. If so, an agent file that changed in place applies in the next round only after a restart. The caller for this round told me to read the file, so this round used the current checks. This is not a gap in the gates.
  - `status-before-r25.md5` is not the same as the md5 of `git status --porcelain` now. But no file in the repository, other than files in `.git`, is newer than that file. So the difference comes from a different command, not from a changed file.

I did not change a file in the repository and I did not read `.env`. I wrote no experiment files, because this round changed only text.
