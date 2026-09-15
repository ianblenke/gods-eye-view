Verdict: FAIL
- [ ] S136 openspec/changes/archive/2026-09-14-establish-spec-governance/proposal.md:70 "The gate finds HTML code and the imports of test files with text patterns" and "The spec adversary checks each changed HTML file and each new import." Verbs. These sentences use "import" as a noun. Everywhere else in the change, "import" is a verb: design.md:134 "a code file that imports a test file", the title of coverage-gate-043, coverage-gate-019 "a test imports a file", and the test name for coverage-gate-043. S71 and S92 removed the same problem from the coverage-gate spec and from design.md. This bullet also uses "load" as the verb in its fourth sentence ("A code file can also load a test file"). Write: "The gate finds HTML code and the code that loads a test file with text patterns, not with an HTML parser or the module loader." and "The spec adversary checks each changed HTML file and each new line that loads a file."
- [ ] S137 openspec/changes/archive/2026-09-14-establish-spec-governance/proposal.md:71 "Code in a file with another extension or with no extension gets no count." One word, one meaning. check 4 of .claude/agents/spec-adversary.md:32 names the same thing "code in files that the gates do not measure", and design.md:134 says "the gates do not measure test files". So "gets no count" is a second wording for "the gates do not measure". It can also have a different meaning. In the ledger, a "count" is a number of lines, branches or functions, so "gets no count" can mean a count of 0. A file that no test loads does get counts: the gate records each of its lines as not covered (proposal.md:69). Write: "The gates do not measure code in a file with another extension or with no extension."

Notes for the caller:
- **S132 is fixed.** proposal.md:70 now says "The gate counts no lines for HTML code with a syntax that the patterns do not find." The words "less common" are gone.
- **S133 is fixed.** proposal.md:70 now says "A code file can also load a test file with a syntax that the patterns do not find." The word "form" is gone from this bullet.
- **S134 is fixed.** proposal.md:69 now has two sentences: "The gate records each physical line of a file that no test loads as not covered. It records one not-covered line for each event handler attribute." These sentences use "records" like the specs do, and "It" refers to "The gate".
- **S135 is fixed.** design.md:134 now says "The gate measures a shell file as not loaded, because node:test cannot run it."
- **Gate output:** "STE: 0 errors, 0 warnings." There are no STE-PASSIVE or STE-ING warnings to examine. The only error in the gate output is REVIEW-MISSING, and that is not an STE problem.
- **Changed prose with no findings:**
  - `script-coverage` (proposal.md:58). "longer" is a correct form of the approved adjective "long".
  - `uncalled-code` (proposal.md:69).
  - The first, third and fourth sentences of `inventory-extensions` (proposal.md:71).
  - The design.md "Inventory" paragraph (design.md:134), apart from the "imports" verb that S136 quotes as the correct use.
  - Check 3 of .claude/agents/spec-adversary.md:31.
- **Not reported:**
  - "selects" (proposal.md:71). I think SELECT is an approved STE verb, but I am not fully sure of the dictionary entry.
  - "a new or changed file with code that has no code extension" (spec-adversary.md:31). You can read "that has no code extension" as if it refers to "code". But a reader understands the sentence, so it is not a rule violation.
  - "The gate counts no lines for HTML code" (proposal.md:70). This is the wording that S132 gave, and HTML code does get line counts in the gate.
- The test names are unchanged since round 16, so I did not check them again.
- I did not read .env. I did not change any file in the repository.