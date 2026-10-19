Verdict: FAIL

Tip b3c77820, clone /home/ianblenke/docker/gev-work/gdacs-layer. C = openspec/changes/archive/2026-10-19-gdacs-layer. I could not run code, so each fault result below comes from reading the code and the tests.

- [ ] FINDING major src/layers/gdacs/layer.test.mjs:395-405 @b3c77820 The new scenario line C/specs/gdacs-layer/spec.md:174 ("an answer to the request that the new call aborted changes nothing") and the new sentence at :137 ("It MUST ignore an answer to a request that it aborted") have no test for the usual order. The test always lets the new request answer first (:400-401). So `_request` is already null when the aborted answer arrives, which is the same state as after `disable`. With a real fetch, the aborted request rejects first (source.js:13 passes the signal). This fault passes each test of layer.test.mjs (I traced 012 to 017): at index.js:134, change `if (_request === request) _request = null;` to `_request = null;`. Then the aborted answer clears `_request`, and the answer of the new call is ignored. `update` returns false, and the layer does not show the result of its newest call. Rule 13 is not met for the new line. To correct it, in 016 resolve or reject `waits[1]` before `waits[2]`. Then assert that `await b` is true and that the data source has 1 entity. Add this fault to evidence/faults.txt.
- [ ] FINDING minor C/evidence/faults.txt:177 @b3c77820 The new fault "answer of an aborted request used" changes only the success path (index.js:116). The failure path of the same sentence (the check at index.js:131) has no named fault, but design.md D8 says that each rule has one. layer.test.mjs:414 asserts this path, so only the evidence has the gap. Add the fault that changes `        if (_request === request)\n          _lastError =` to `        _lastError =`.

Round-2 findings that are now closed (no new finding):
- 006: :41 and :72 now have one meaning. records.test.mjs:139-148 tests the "FL-8" pair. Fault :175 is killed: I traced it, and the result is empty.
- 013: :137 and :151 agree with index.js:117-120. The unavailable result now has 2 events (layer.test.mjs:284). Fault :176 is killed.
- 016: the fault at :177 is killed through :390 and :403-405. F1 above is a separate gap.
- 002: the line :20 and the title agree with layer.test.mjs:152-158. Fault :171 is killed.
- These are correct: the heading and the title of 010, 009 :104-109 and 011 :129.
- The renamed fault :184 and the new fault :185 each match one text in dataCredits.js:179.
- The Known limit `labels-after-enable` is true:
  - `enable` does not send the labels again (index.js:91-95).
  - `disable` clears the labels (index.js:102) and keeps the entities.
  - The manager calls `update` right after `enable`, and it disables the layer when that call fails (lifecycle.js:1006-1019, :919-927).
- The browser check is now correct. run.mjs:131-132 needs a text that is not empty (browser.txt:64), and the screenshot shows each label above its point.
- links.json:3720-3762 has the five titles. The main spec equals the delta. ratchet-4.log and docs-6.log give only REVIEW-MISSING.