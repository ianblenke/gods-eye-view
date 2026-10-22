Verdict: PASS

STE adversary, narrow round 4 (scope: diff 14f9d252, only the two major findings of round 3). Tip commit c4ae480f, clone /home/ianblenke/docker/gev-work/skywatch-scenes-layer. In the findings, C is openspec/changes/archive/2026-10-22-skywatch-scenes-layer. I read files only. I ran no code and no git.

1. The STE major of round 3 is closed. C/specs/skywatch-scenes-layer/spec.md:299 and the main spec at line 302 have the same text.
   - "that runs" gives "request" one meaning. "runs" has the -s form, but "forget" and "remove" do not. So "forget" and "remove" go with "MUST", not with "request".
   - The text agrees with 026 (lines 323-324 and 330) and with 032 (line 394). Scenarios 024, 025, 027 and 028 do not conflict with it.
   - It agrees with the code. `reset()` (index.js:226-230) aborts `_statusRequest`, `_request` and `_thumbRequest`. Each of them is null after its request ends (index.js:330, 266 and 208). `disable()` removes the entities (index.js:313), and `releaseCard()` clears the card.
2. The spec major of round 3 is closed. layer.test.mjs:376-377 read the chip before `disable` (line 379).
   - The fault at faults.py:361 keeps `_request` set after a failure. Then `disabled` is true and the label is "Searching…" (index.js:363-364), so the assertion at line 376 fails.
   - The fault at faults.py:362 starts a timer of 30 s. That timer runs inside the 10 mocked minutes, so the assertion at line 375 fails.
   - faults-7.log:300-301 and 322-323 and the files faults-7.head, faults-7.start and faults-7.end agree with faults.txt:4,6. faults.txt has 321 lines that start with "KILLED:".
3. New faults from the corrections:
   - The title at layer.test.mjs:350 agrees with the spec at line 42 ("the fake clock") and with links.json:6279.
   - Task 1.15 is true.
   - The changed lines have no banned word and no SHALL, SHOULD or MAY.

- [ ] FINDING minor C/evidence/faults.txt:6 (c4ae480f) "did not read the chip after an error before disable and enable" uses the method names as nouns with no article. Also, "before" can go with "an error" or with "read". The sentence is true under each meaning. Write: "did not read the chip between the error and the calls of disable and enable".
- [ ] FINDING minor C/specs/skywatch-scenes-layer/spec.md:335 (c4ae480f, outside the scope) Scenario 027 says "each request in flight", but lines 299 and 394 say "each request that runs". These are two names for one thing, and "in flight" is an idiom. Write "each request that runs", and make the same change in the main spec at line 338. This finding does not change the verdict.
