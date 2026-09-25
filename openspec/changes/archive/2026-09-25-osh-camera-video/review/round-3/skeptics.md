No skeptic agent ran in round 3. The lead checked each finding against the code and the text, and ran the mutations for the new tests. Result:

- Spec F1 and STE S1 (major) confirmed. `worldOverlay.js` uses the occluder list as a placement preference, not as a hide: the world overlay places a label or a card clear of the panel when it can, and it keeps the entry when no place is clear. The line in `osh-093` and in D79 was wrong, and it came from a comment of the lead. Both now say what the code does. A new `[osh-093]` test uses the shipped `.osh-panel` stacking and asserts that a card steps clear of the panel. Mutation L19 fails both `[osh-093]` tests.
- Spec F2 and STE S3 (minor) confirmed. The note in `round-2/skeptics.md` was false when it was written, because the WHEN of `osh-092` did not name the two cases. The WHEN now names both.
- Spec F3 (minor) confirmed. The real-client test now keeps the last 11 characters of each read, so a read that ends inside `event: frame` loses no count.
- Spec F4 (minor) corrected. The `[osh-094]` test task now comes before the page code tasks.
- Spec F5 (minor) corrected in D74: only a binary message of more than 2097152 bytes closes the socket.
- Spec F6 (minor) corrected. The `index.html` test checks the class `osh-panel`, and the style test strips the comments first. Mutations L22 and L23 fail these tests.
- Spec F7 (minor) corrected. The `down` and `open` test has two clients and checks the delay of one second and the delay of two seconds. `osh-080` points to the delays of `osh-069`. Mutation V25 fails the test.
- Spec F8 and STE S12 (minor) corrected. The proposal says that the real player ran once in a headless browser on a synthetic clip and that no test repeats it. `review.md` records the run.
- STE S2, S4 to S11 and S13 (minor) corrected in the spec, the design, the tasks and the names of tests that are new in this change. `osh-079`, `osh-083` and `osh-084` now use the word `valid` once, in `osh-083`. `osh-080` has two triggers in its WHEN.
