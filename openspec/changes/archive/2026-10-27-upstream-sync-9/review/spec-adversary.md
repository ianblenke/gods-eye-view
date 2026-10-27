Verdict: PASS

Tip 17c2c5a5, round 3 (narrow), spec adversary. I read the files and ran no code.

Checks: (1) The statements are true against the files. I could not check the CI run ids and the error lines, because I cannot run gh. They are consistent with each other, and the only error of the last run is REVIEW-TREE. (2) The text is honest: D17 calls the wait a margin and says one run is evidence and not proof; the Known limit vite-teardown names it; faults.txt gives the reason for the missing fault; ci-leak.txt lists the local attempts. (3) evidence/adapted-files.txt has 23 file entries (24 lines with the header), and the decisions D1 to D17 are consistent. (4) In src/tooling/viteBuild.test.mjs lines 437-442 the wait sits after close() inside finally, in both loop iterations, and it cannot hide a failure.

- [ ] FINDING minor design.md:123 D17 says "twice in two runs of the same commit"; ci-leak.txt describes one run with two attempts. Change the text to "two attempts of one run".
- [ ] FINDING minor design.md:126 "as the memory of an earlier leak of the same kind suggests" points to a source that is not in the repository. Name the earlier change or delete the clause.
- [ ] FINDING minor design.md:121 D17 sits after the section "Purpose at archive time". Move it up to follow D16, or accept the order.
