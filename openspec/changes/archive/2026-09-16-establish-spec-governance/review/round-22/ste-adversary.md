Verdict: FAIL
- [ ] S151 openspec/changes/archive/2026-09-14-establish-spec-governance/proposal.md:62 "An added lcov record cannot hide a gap" One word, one meaning. S149 is corrected in design.md:45 and in the coverage-gate-044 test name, which now use "entry". This sentence still uses "record" for the same thing. Write: "An entry that a test adds to the lcov report cannot hide a gap".
- [ ] S152 openspec/changes/archive/2026-09-14-establish-spec-governance/specs/spec-lint/spec.md:111-112 "OpenSpec and the gates read a different number of requirements or of scenarios in a requirement" / "the file is a main spec or a delta spec of a change with a `proposal.md` file" Articles and nouns, and one word, one meaning. The AND line says "the file", but no earlier line names a file. The requirement text (:102) and design.md:93 say "the active changes". The AND line says "a change with a `proposal.md` file" for the same thing. The code checks only active changes that have a proposal. Write in the WHEN line: "OpenSpec and the gates read a different number of requirements, or of scenarios in a requirement, in a spec file". Write in the AND line: "the file is a main spec or a delta spec of an active change with a `proposal.md` file". Make the same changes in openspec/specs/spec-lint/spec.md:115-116.
- [ ] S153 src/tooling/spec/specs.test.mjs:294 "stops for an archived added or modified requirement that is not in the main spec with the same text and scenarios" One word, one meaning, and articles. spec-trace-051 says "the same name, the same text and the same scenario IDs". Here "scenarios" stands for "scenario IDs", and the test name leaves out the name. Write: "stops for an archived added or modified requirement that is not in the main spec with the same name, the same text and the same scenario IDs".
- [ ] S154 openspec/changes/archive/2026-09-14-establish-spec-governance/design.md:89 "with the same name, text and scenario IDs" Articles and nouns. Articles are possible here, and spec-trace-051 uses them. Write: "with the same name, the same text and the same scenario IDs".

Notes for the caller:
- **Gate output:** It says "STE: 0 errors, 0 warnings.", so there are no STE-PASSIVE or STE-ING warnings to examine. The only error is REVIEW-MISSING, which is not an STE problem.
- **Round 21 findings:**
  - **Corrected:** S142 (design.md:45), S143 (proposal.md:36), S144 (the split tasks, now numbered 1.38 and 1.39, not 1.40 and 1.41), S145, S146, S147, S150.
  - **S148:** the title and the test name are correct. The new WHEN and AND lines have the problem in S152.
  - **S149:** the fix is not complete. See S151.
- **Changed prose with no findings:**
  - design.md:87, the moved paragraph, which is now under "IDs, registry and links".
  - design.md:93, and the openspec.mjs and specs.mjs rows in the files table.
  - The texts of the requirements "Requirement format", "Tasks for scenarios", "OpenSpec check" and "Archived change specs".
  - Scenarios spec-lint-018, spec-lint-020, spec-lint-021 and spec-lint-022; spec-trace-047 (new AND line), spec-trace-048, spec-trace-049 and spec-trace-052; coverage-gate-044.
  - Test names spec-lint-018, spec-lint-019 and both spec-lint-020 tests; coverage-gate-044 ("coverage report entries" is three nouns, which is allowed); spec-trace-048, spec-trace-052, and "[spec-lint-021 spec-lint-022] ...".
  - Tasks 1.21, 1.22, 1.38, 1.39, 7.22 and 7.23.
  - The delta specs and the main specs agree, except for a blank line at the end of each file.
- **Not reported:**
  - "the spec updates" in design.md:89. Round 21 chose not to report it.
  - "includes" in the spec-trace-047 AND line. The change uses "include" in the same way in design.md:67 and :171.
- **Not an STE problem:** the word "entry" still has three meanings in the change: a ledger entry, an lcov report entry and a result file entry (design.md:43, proposal.md:62). Each one is clear from its context.
- I did not read `.env`, I did not change any file in the repository and I wrote no notes.
