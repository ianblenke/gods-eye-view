- [ ] FINDING major: design.md:27. "a thumbnail is rarely above 1 MiB" disagrees with proposal.md:3-4, where four of eight thumbnails were above it.
- [ ] FINDING major: proposal.md and tasks.md:12. Task 2.3 adds tests for `up42-scenes-layer-012`, `-013` and `-014`. The proposal gives no reason for them.
- [ ] FINDING minor: design.md:23. "The limit for the body of a JSON error stays small in effect" is vague.
- [ ] FINDING minor: design.md:6. "The server then reads too many bytes" can be wrong. The code stops at the cap.
- [ ] FINDING minor: the word "limit" has three meanings. Use "size limit" for a size.
- [ ] FINDING minor: units mix MB and MiB.
- [ ] FINDING minor: specs/up42-thumbnails/spec.md:16. Two topics share one sentence. The spec does not give the number 4194305.
- [ ] FINDING minor: specs/up42-scenes-layer/spec.md:43. "the source reads a body of 4194304 bytes" does not say what the call gives.
- [ ] FINDING minor: test name of `[up42-scenes-layer-012]` uses "array of one flag" and "ok false".
- [ ] FINDING minor: test names of 013 and 014 do not follow the scenario text ("another search", "a 502 error body").
- [ ] FINDING minor: proposal.md:32. "No trace gap must open" is an odd use of "must".
- [ ] FINDING minor: proposal.md:37. "keeps at most 32 thumbnails for 10 minutes" is ambiguous.
- [ ] FINDING minor: server/providers/up42/auth.js:15. The comment has two topics joined by a semicolon.
- [ ] FINDING minor: tasks.md:25-28. "Have the lead run" gives the work to another person.

Verdict: FAIL
