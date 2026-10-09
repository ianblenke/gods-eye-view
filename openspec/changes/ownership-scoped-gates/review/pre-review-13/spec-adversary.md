Verdict: FAIL

Tree: clone ownership-gates, commit 12b044bcd1c1d841882ccc8134567b3e0db471c3 (read from .git/refs/heads/ownership-gates). I ran no code. E = openspec/changes/ownership-scoped-gates/evidence.md.

- [ ] FINDING major E:3521 "The scenario names no other result" is false. gap-ledger-138 (gap-ledger/spec.md:795-798) names a THEN, "the gate gives no tolerance from this requirement", and an AND, LEDGER-ADOPT-FROM. The 138 test (gates.test.mjs:2707-2715) asserts only the AND. No test asserts the THEN, and the title still claims it. The new row hides this. The only trace is the proposal.md:41 minor, and that is future ("will list"). Fix: write "The test asserts the AND of gap-ledger-138 only. After the early source check the gate makes no comparison, so no gate test can assert the THEN. The title and the THEN stay in the open minor that review.md lists." Name the THEN in that minor.

- [ ] FINDING minor E:3619 "on the clean commit 0040282f". pass15/host-checks.log:4-8 shows evidence.md and tasks.md modified and three untracked files during the host checks. The lint (0 errors) ran on a draft of E. No record shows lint on the final text of 12b044bc. Fix: "on the code files and test files of commit 0040282f". Run the lint at 12b044bc and file the result.

- [ ] FINDING minor E:3673 "The code files and the file gates.test.mjs are the same ... except one test title". The one title is in ledger.test.mjs (pass15/changes-since-final-run.txt), not in those files. Fix: "The code files and gates.test.mjs are the same as at the final run of Pass 14. The only change in src and scripts is one test title in ledger.test.mjs."

- [ ] FINDING minor E:3504 (new sentence) "The code files and test files were those of commit b35c27d1" has no record. pass13/host-checks.log has no commit line, but the pass14 and pass15 logs have one. The fault run at E:3478 is backed by the fence titles; the host run is not. Fix: say that the log names no commit, or drop the sentence.

- [ ] FINDING minor E:3611 and E:3655-3669 "ran that fault against the final test". print-assertions.py.txt:9-10 replaces the count line with a null-safe `(match ?? []).length`. In the final test, gates.test.mjs:2830 `.match(...).length` throws a TypeError on null under the Pass 13 fault. The test fails there, and the history assertion never runs. "history error: FAILS" in the second fence is a result of the copy only. Fix: say "a copy of the final test with a null-safe count line" and name the TypeError.

Checked and true:
- The fences of pass13/, pass14/ and pass15/ equal their files.
- The two message files fit the first failed assertion of each 151 fault. Fault 1 gives [] against ['LEDGER-ADOPT-FROM'] at ledger.test.mjs:1603. Fault 2 gives [] against ['LEDGER-STALE'] at :1606.
- The drop-throw and adoptsOf assertion results agree with ownership.mjs:83-97 and gates.mjs:535-585.
- The debug copy is not left in src.
- Pre-review 11 counts (5+3, 7+8) and pre-review 12 counts (1+5, 4+2+5) are right.
- The 055 fixture (adoptedTotals) has only a total count difference, so it meets the WHEN.
- spec.md:276 and D11 agree and point at gap-ledger/spec.md:906. The library test (ledger.test.mjs:1597-1608) uses the same adoptedFile lambda as gates.mjs:643. Faults 1 and 2 fail it at different assertions.
- gates.test.mjs reads no file that changed since 85eaab08, outside src and scripts.
- Tasks 15, 16 and 17 each have a record.
- No script changed. The status assertion stays covered at gates.mjs:537 by the ownership-031 test (gates.test.mjs:2627-2634). Rule 18 is met.

Minors not listed.
