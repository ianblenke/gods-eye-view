Verdict: FAIL
- [ ] S138 openspec/changes/archive/2026-09-14-establish-spec-governance/proposal.md:73 "A pull request can change `scripts/spec/` and turn off a gate." Verbs. "turn off" is a phrasal verb, and it is not an approved STE verb. Elsewhere the change says what a gate does with "stop" ("stops the build"). Write: "A pull request can change `scripts/spec/` so that a gate does not stop the build."
- [ ] S139 openspec/changes/archive/2026-09-14-establish-spec-governance/proposal.md:72 "Each test process loads the test guard as a preload. Thus the guard file gets coverage without a test that loads it." One word, one meaning. In the first sentence, "loads" means that the process loads the guard before each test. In the second sentence, "a test that loads it" means a test that imports the guard and checks it. But each test runs in a process that loads the guard. So with the first meaning, each test "loads" the guard, and the second sentence then says the opposite of what it means. The change uses "imports" for a test that uses a file directly (coverage-gate-019 "code that a test imports", proposal.md:64 "a file that a test also imports"). Write: "Thus the guard file gets coverage also when no test imports it and checks it."

Notes for the caller:
- **S136 is fixed.** proposal.md:70 now says "The gate uses text patterns to find HTML code and the code that loads a test file. It does not use an HTML parser or the module loader." and "The spec adversary checks each changed HTML file and each new line that loads a file." "import" is no longer a noun in this bullet.
- **S137 is fixed.** proposal.md:71 now says "The gates do not measure code in a file with another extension or with no extension."
- **Gate output:** "STE: 0 errors, 0 warnings." There are no STE-PASSIVE or STE-ING warnings to examine.
- **Changed prose with no findings:**
  - `pattern-checks` (proposal.md:70). "unquoted attribute value" is a technical name from HTML.
  - `inventory-extensions` (proposal.md:71).
  - The sentences of `gate-code` other than the one in S138.
  - The tree hash sentence in design.md:159.
  - spec-lint-011, in the delta spec (specs/spec-lint/spec.md:40) and in the merged spec (openspec/specs/spec-lint/spec.md:44).
  - change-review-015, in the delta spec and in the merged spec.
  - Check 3 of .claude/agents/spec-adversary.md:31.
  - The test name "[spec-lint-011] stops for a requirement without a scenario".
- **Not reported:**
  - ci-gates-007 AND line: "the targets ... run their gate commands with the `CHANGE` and `BASE` options that the command uses". The plural "their gate commands" is followed by the singular "the command". A clearer text is "each of the targets ... runs its gate command with the `CHANGE` and `BASE` options that the command uses". A reader still understands the sentence, so I did not count it as a rule violation.
  - "preload" as a noun (proposal.md:72). It is a Node technical name, and the test names already use "preloads".
  - "selects" (proposal.md:71). I think SELECT is an approved STE verb.
- I did not read .env. I did not change any file in the repository.