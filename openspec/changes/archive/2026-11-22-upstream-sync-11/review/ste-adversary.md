Verdict: PASS

Commit read: `5918fcb1a`, scope `diff 8047d72a2`. All round 2 findings are fixed. The reviewer found no new fault that a correction added.

- [ ] FINDING minor proposal.md:53 "The UP42 image set draws opaque." Write: "The UP42 image set draws with no transparency."
- [ ] FINDING minor src/layers/up42Scenes/images.test.mjs:673 "ignores late success and failure" Write: "ignores a late success and a late failure".

Not checked: the lint, the tests, the other delta specs, the test bodies.
