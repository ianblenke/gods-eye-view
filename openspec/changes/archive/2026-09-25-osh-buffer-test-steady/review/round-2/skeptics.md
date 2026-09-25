No skeptic agent ran in round 2. Both reviewers gave the verdict PASS, so the lead did not start a new round for their minor findings. The lead corrected each minor finding in `proposal.md`, `design.md` and `tasks.md`, because they change no code file and no test:

- Spec F1 and STE S10 and S11: the known limits `osh-buffer-test-comments` and `osh-buffer-test-exact-limit` now say what the comments and the numbers are. The assertion text "got message N" is named too.
- Spec F2 and STE S1: the known limit `osh-buffer-test-cork` says that the value grows earlier than for a real client, and that the provider runs the same check for both.
- Spec F3 and STE S6: the number of unwritten bytes at the fifth message is "about 10666800".
- STE S2, S3 and S9: "grows with each write", "the start of that message", and "a sign that the fix works".
- STE S4, S5, S7, S8, S12, S13 and S14: one word for one thing (assertion, before each write), the actor of the write, the active heading of D2, the new task 1.4 that removes each mutation, and the sentences of the known limits.
