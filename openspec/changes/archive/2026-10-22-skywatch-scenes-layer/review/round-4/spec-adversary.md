Verdict: PASS

Spec adversary, narrow round 4 (scope: diff 14f9d252, the two majors of round 3). Tip c4ae480f, clone /home/ianblenke/docker/gev-work/skywatch-scenes-layer. I only read files. I ran no fault.

**Item 1 (closed).** spec.md:299 and the main spec at :302 have the same text, "abort each request that runs".
- `reset()` (index.js:225-239) aborts only `_statusRequest`, `_request` and `_thumbRequest`.
- Each of these is null after its request ends (index.js:208, 266, 330).
- So the text agrees with 026 (spec :322-330, test :767-792), 027 ("in flight"), 032 :394, and 024, 025 and 028.
- design.md and proposal.md do not conflict with it.
- A search for "abort each request," finds no old text.

**Item 2 (closed).**
- layer.test.mjs:376-377 assert `disabled` false and "Search scenes here" after the 10 minutes, before `disable` (:379).
- Fault faults.py:361 sets `_request = null` only when the result is `ok`. Then `_request` stays set after a failure. index.js:363-364 give `disabled` true and "Searching…", so :376 fails in the first case.
- At 14f9d252 only :384 read the chip, after `reset()` had cleared `_request`. So the fault survived then.
- Fault faults.py:362 runs `press` at 30 s, only for upstream_rate_limit. The mocked tick and the real setImmediate let `press` send a second call, so :375 fails in the second case.
- faults-7.log:300-301 show KILLED for both faults. Lines :322-323 give 321 faults, 321 killed, and "131 ... 0". faults-7.head is cbcede94. The start and end times agree with faults.txt:4.
- The reflog shows that only evidence, trace and archive commits come after cbcede94.

**Item 3: no new fault.**
- The new title is the same in links.json:6279 and faults.txt.
- The new assertions compare with literal values (rule 14).
- faults.txt:6 agrees with faults.py:361-362 and with the log.

- [ ] FINDING minor src/layers/skywatchScenes/layer.test.mjs:385 (c4ae480f) No test presses the chip after a failed search without `disable` and `enable` first. In 025 (:633-689), the failed search is the last press, and the other failure is a press with no box. By my reading, this fault survives: add `|| (_lastError !== null && _answer === null)` to the guard at index.js:242. The order of the lines of 005 (spec :43 before :44) allows the test. The requirement text "until a person presses that chip again" (spec.md:17) does not. Add a press after :377 and assert one more `searchScenes` call, or record this as a Known limit.
- [ ] FINDING minor src/layers/skywatchScenes/index.js:105 (c4ae480f) The JSDoc says the layer "never sends a search again after an error". That is false for a press after an error. design.md:29 correctly says "by itself". This is outside the scope of this round, because the code did not change after d3fcdd69.
