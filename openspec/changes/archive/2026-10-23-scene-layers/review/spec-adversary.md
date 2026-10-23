Verdict: PASS

Tip c243ed4c, scope diff 69dca8f9. The reviewer read files only. No critical and no major finding. The new tests of scenarios 008 and 009 assert the literal samples, the window at the clock was checked by hand for 2026-03-01 and 2024-03-01, the corrected view centre catches a throw and a point at the centre of the globe, the three new faults are killed by the tests of 009, and the claims of the design and the proposal about the repository are true.

- [ ] FINDING minor src/layers/sceneLayer/layer.test.mjs:1532 No test passes a non-finite latitude or longitude to `scenesBox`. The line of the spec about a non-finite value rests on a file of the layer SkyWatch Scenes that this change does not change.
- [ ] FINDING minor spec.md:101 The order "sky" before "latitude" and "meridian" cannot be tested for "sky", because a view that shows the sky has no centre.
- [ ] FINDING minor evidence/faults.txt:9 Runs 4 and 5 share a commit, and the runner file is outside the repository.
