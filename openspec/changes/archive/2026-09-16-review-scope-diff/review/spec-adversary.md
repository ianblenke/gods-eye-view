I have read the round-3 output, the agent file, and every corrected text: `proposal.md`, `tasks.md`, `design.md`, `scripts/spec/lib/review.mjs`, the delta spec and `openspec/specs/change-review/spec.md`, `src/tooling/spec/review.test.mjs`, plus the gate code that the changed scenario lines describe and the full changed-file list.

Round-3 closure check (scope: the corrections of round 3, round 4):

- **F1 closed.** `proposal.md:34` now has the known limit `severity-self-reported` with the right words: no gate compares the severity of a finding in `review.md` with the output of the review agents. It sits with `rounds-self-reported` and `human-acceptance`, so the three self-reported fields of `review.md` are all named.
- **F2 closed.** `tasks.md` now has the test tasks for `change-review-027` (1.8) and `change-review-032` (1.9) before the code task 1.10, which writes `scripts/spec/lib/review.mjs` and `scripts/spec/gates.mjs`. All nine test tasks 1.1 to 1.9 are before every code task, so the spec-first rule of `openspec/config.yaml:64` holds for the nine scenarios. Tasks 2.1 and 2.2 write the agent files and the command file after the tests 1.8 and 1.9, which assert `checkAgents(PROJECT_ROOT)` and `checkReviewCommand(PROJECT_ROOT)` on the real files. No other file names a task number, so the renumbering makes no text wrong.
- **F3 closed in part.** `proposal.md:22` now names `scripts/spec/gates.mjs`, and `design.md:15` has the new section "Changed files". The design list is not complete, see F1 below.
- **F4 closed.** `scripts/spec/lib/review.mjs:12` now writes "the diff against the Git commit of the round before", which agrees with `openspec/specs/change-review/spec.md` and step 5 of `.claude/commands/opsx/review.md`.

The STE corrections make no new gap. The new AND line of `change-review-027` ("the file has another heading, for example `## Scope`, with the two rules") has its assertion: the first `withRoot` block of the test gives `ste-adversary` the heading `## Scope` with both rules and asserts the one error. The new wording "a number less than 3" in `change-review-028` has the new assertion with `Rounds: 1` next to the older one with `Rounds: 2`. The gate output has only the expected `REVIEW-MISSING`.

```
Verdict: PASS
- [ ] F1 minor openspec/changes/archive/2026-09-16-review-scope-diff/design.md:17 The new section "Changed files" names only the seven code, test, agent and command files. The change also changes `openspec/changes/archive/2026-09-16-establish-spec-governance/review.md` by hand, which adds the "Rounds:" and "Scope:" lines to that record. The proposal names that file in its own bullet (proposal.md:23), so the design and the proposal do not agree. The rule for the design in openspec/config.yaml:61 needs each file that the change adds or changes. Add `openspec/changes/archive/2026-09-16-establish-spec-governance/review.md` to the section "Changed files".
```
