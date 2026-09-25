No skeptic agent ran in round 2. The lead checked each finding against the code and the text, and ran the mutations for the new tests. Result:

- STE S1, S2 and S3 (major) confirmed. S1: the design context now says that a key message has an IDR slice, and that an SPS and a PPS are normal but not required. S2: the good-request lines moved to `osh-091`, and the two refusal lines are the new scenario `osh-092`, whose WHEN names both cases. S3: the tests in `videoPlayer.test.mjs` now say "chunks" and "ignores each delta message until the next key message".
- STE S4 to S10 (minor) corrected in the spec, the design, the proposal and the tasks. The word for the response is now `destroy` everywhere, in the spec, the design, the tasks, the tests and the two comments.
- STE S11 to S20 (minor) corrected in the text, the comments and the test names that are new in this change. `hold` and `host` stay in some names of older tests. The name `the host` of a DOM element stays, as the code names it.
- STE S21 (minor) corrected. The occluder line is the scenario `osh-093`, and the `index.html` and `style.css` lines are the scenario `osh-094`, each with a WHEN that names its condition.
- Spec F1 (minor): the proposal Impact names the drift of `src/data/labelArbiter.js`. Its count flips between 50 and 52 across ratchet runs, and the history of `teardown-guard` shows the same flips on `main`. No file of this change touches it.
- Spec F2 (minor) corrected in `osh-084`: the conditions of the new configuration and of the canvas size, the ignored messages, and the whole microseconds.
- Spec F3 (minor) confirmed. New test for a text message of 2097153 characters. `osh-079` says "a text message of any size" and "a binary message of more than 2097152 bytes". Mutation V23 fails the test.
- Spec F4 (minor) corrected: `osh-091` says "the property `binaryType` of the socket", and each failure has its own WHEN in `osh-092`.
- Spec F5 (minor) corrected: new lines in `osh-080` and `osh-087`, and a new test that a video client gets `down` and then `open`. Mutation V24 fails that test.
- Spec F6 (minor) corrected: one test with a real HTTP client that does not read. It runs on a real response, and mutation V16 fails it.
- Spec F7 (minor) corrected: the test names, `design.md`, `live.js` and the proposal use the words of the spec.
- Spec F8 (minor) corrected: the tasks about `index.html`, `style.css` and the occluder come before their mutations.
- Spec F9 (minor) corrected: the test in `osh.test.mjs` reads the stylesheet, and mutations L20 and L21 fail it.
