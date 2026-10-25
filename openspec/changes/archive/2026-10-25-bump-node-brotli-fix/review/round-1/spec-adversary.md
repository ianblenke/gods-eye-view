Verdict: FAIL

Commit add86d24. The reviewer read the spec, proposal, design, tasks, evidence, Dockerfile, CHANGELOG entry and src/tooling/spec/ciFiles.test.mjs. It ran nothing.

- [ ] FINDING major specs/ci-gates/spec.md:9 The THEN line says "or a later line", and the AND line refuses 25.0.0. Line 25 is later than line 24, so the scenario contradicts itself. Replacement: "or a line above 26".
- [ ] FINDING major specs/ci-gates/spec.md:4 The requirement says .node-version MUST name a release with the fix. The CVE fix also exists in 22.23.4, but the test refuses every 22.x. Narrow the requirement to the lines that the project allows, or add a scenario line that refuses the line 22 on purpose.
- [ ] FINDING minor src/tooling/spec/ciFiles.test.mjs:68 No sample has a patch above the fixed patch within the same minor (24.22.2, 26.12.2). The fault "patch === first[1]" would survive. Add the samples and run and record that fault.
- [ ] FINDING minor src/tooling/spec/ciFiles.test.mjs:66 The sample 22.23.4 is never tested, so the choice to refuse the line 22 is untested. Cover it with the requirement fix.
- [ ] FINDING minor evidence/faults.txt:14 The surviving fault is equivalent, but the reason says 25.0.0 and 27.0.0 "give the same result" in a way that can be read as false. Reword it.
