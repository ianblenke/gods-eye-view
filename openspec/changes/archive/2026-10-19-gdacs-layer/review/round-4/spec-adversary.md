Verdict: PASS

Tip 746c6eef, clone /home/ianblenke/docker/gev-work/gdacs-layer (from `.git/logs/HEAD`). C = openspec/changes/archive/2026-10-19-gdacs-layer. I could not run code. Each fault result below comes from tracing the code and the tests by hand.

- [ ] FINDING minor C/specs/gdacs-layer/spec.md:137 @746c6eef The sentence "It MUST show the labels of that result until the next call of `disable`" has no limit for `destroy`. Scenario 017 is in the same requirement. Its test calls `destroy` on an enabled layer and does not call `disable` (layer.test.mjs:433-439). Then `destroy` clears the labels (index.js:144), so the requirement text and 017 contradict. In the app, the manager calls `disable` before `destroy` when the layer is enabled (src/data/lifecycle.js:2147-2149). Only a direct call, as in the test, causes the conflict. Write "until the next call of `disable` or `destroy`" in the delta and in the main spec at :140. I did not lint this text.

Item 1 is closed. Both faults fail the test:
- The new block (layer.test.mjs:416-429) lets the aborted request (waits[5]) answer before the newest call (waits[6]). Then it asserts that `newer` gives true, with 2 entities, `count` 2 and `error` null.
- Fault faults.txt:178 ("aborted answer clears the newest request"): the `finally` of the older call sets `_request` to null. The newest answer then fails the check at index.js:116, so `newer` gives false and :426 fails. All earlier blocks pass under this fault, so the new block is the only test that kills it.
- Fault faults.txt:179 ("error of an aborted request used"): the rejection after `disable` at :412 sets `_lastError` to "after disable", so :414 fails.
- The search text of each fault occurs once in index.js (:134, :131-132). The output gives KILLED at :378-379 and "faults 164, killed 164, survived 0" at :391. The faults ran on 7e74c9bf, the round-3 code and test commit.

Item 2 is closed, apart from the minor finding above:
- The points of the last result that the layer accepted stay on while a newer call waits. This agrees with index.js:116 and the round-1 issue does not come back.
- The labels go at `disable` (index.js:102), and `enable` does not give them again (:91-95). This agrees with the Known limit `labels-after-enable` (proposal.md:55).
- The words "MUST NOT accept an answer to a request that it aborted" agree with 016 (:176, :179) and with 017 (:182).
- An unavailable result that holds events (013) shows no points. Paragraph 2 names this case directly, so the reading is clear.
- The main spec (:140, :142) equals the delta.

Item 3, all four minor corrections are complete and true:
- The failure-path fault is at faults.txt:179, in the exact form that round 3 asked for.
- :139 now reads "When a request fails, it MUST keep the points and the labels that it shows" and "remove all the points and the labels". Both are true against index.js:117-132.
- The 006 title (records.test.mjs:98) "keeps the first valid event of each id" is true: :132-138 gives "A", and :139-148 gives "B". links.json:3732 has the new title.
- Scenario 002 at :20 now says "calls of `init`, `enable` and `update` add one data source and show 3 points". This agrees with layer.test.mjs:152-158 and with the main spec at :23.

The changed lines have no banned word ("abort" is only a noun-verb warning in `words.json`).