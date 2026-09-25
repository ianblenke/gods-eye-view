No skeptic agent ran in round 1. The lead checked each finding against the code and the text, and ran the three mutations again on the test alone. Result:

- STE S1 and spec F1 (major) confirmed. Mutation B2 sets the limit to 1677721600, which is 200 times the limit. A doubled limit of 16777216 bytes gives a destroy at the eighth message, so the test would stay green. The design now names B2 as it is, and it says that the other `[osh-090]` tests, with a fake response, pin the exact limit.
- STE S2 and spec F2 (major, minor) confirmed. Five tests carry the tag `[osh-090]`. The lead ran B1, B2 and B3 with the name filter `real HTTP client`. The test with real HTTP clients failed with each mutation. Task 1.3 now names that test.
- STE S3 (major) confirmed. The loop stops at the destroy, and after 40 messages only when the provider does not destroy. The proposal, the design and the tasks now say so.
- STE S4 (major) confirmed. The failed assertion proves one fact: the response of the client that reads had more than 8388608 unwritten bytes at a check. The reason is not proved, and a green CI run shows that the fix works. The proposal now says which is which.
- STE S5 to S22 (minor) corrected in `proposal.md`, `design.md` and `tasks.md`.
- STE S23 and the comment part of S12 (minor) kept, and named as the known limit `osh-buffer-test-comments`. A change of a comment in the test file needs a new ratchet.
- Spec F3 (minor) kept, and named as the known limit `osh-buffer-test-lagging-reads`. Spec F4 (minor): the documents now say "at most one message"; the comment in the test stays. Spec F5 (minor): named as the known limit `osh-buffer-test-exact-limit`.
