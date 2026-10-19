Verdict: FAIL

Tip b3c77820 (I read `.git/refs/heads/gdacs-layer`). Clone /home/ianblenke/docker/gev-work/gdacs-layer. C = openspec/changes/archive/2026-10-19-gdacs-layer. The main spec has the same text, 3 lines lower.

- [ ] FINDING major C/specs/gdacs-layer/spec.md:137 @b3c77820 The first sentence is false, and the new Known limit says so. The sentence is "While it is enabled, the layer MUST show the points and the labels of the result of its newest call of `update`". `disable` clears the labels (index.js:102), and `enable` does not give them again (index.js:91-95). proposal.md:55 says that the layer then "shows its old points with no labels". So the MUST and the Known limit contradict. The correction also brings back the round-1 fault. While the newest call waits, that call has no result, so the text can mean "show nothing" or "keep the old points" (the code keeps them). Possible text: "While it is enabled, the layer MUST show the points of the last result that it accepted. It MUST show the labels of that result until the next call of `disable`. It MUST NOT accept an answer to a request that it aborted." The other choice is to make `enable` give the labels again, with a test and a fault. I could not lint or test this text.
- [ ] FINDING minor C/specs/gdacs-layer/spec.md:137 @b3c77820 "When a later request fails" no longer has a base, because the first sentence now names "its newest call". Also, "remove all points and labels" and "keep the points and labels" have no article before "labels". Write: "When a request fails, it MUST keep the points and the labels that it shows". Also write: "it MUST remove all the points and the labels".
- [ ] FINDING minor src/layers/gdacs/records.test.mjs:98 @b3c77820 The title "keeps the first of two equal ids" is false when you read it alone. In the new sample (:139-148), the normalizer keeps the second of the two "FL-8" events. When you read the title in order, after "drops the events that are not valid", it is true. Write "keeps the first valid event of each id", and update links.json.
- [ ] FINDING minor C/specs/gdacs-layer/spec.md:20 @b3c77820 In "a call of `init`, `enable` and `update` adds ... and shows", one singular noun names three calls. Write: "after `destroy`, calls of `init`, `enable` and `update` add one data source and show 3 points". The test agrees with this text (layer.test.mjs:152-158).

Checked, no finding:
- These have no banned word and no banned form: the diff, the titles of 002 and 010, and the four fault names. The lint gives 0 errors (evidence/checks.txt:23).
- :41 and :72 agree with records.js:98-104 and records.test.mjs:139-148. :151 and :174 agree with layer.test.mjs:284 and :400-405.
- The faults at faults.txt:175-177 were killed (:373-375), and :387 gives 162 faults with 162 killed.
- The renamed fault (faults.txt:184, killed at :381) is true: dataCredits.js:179 holds both sentences of the disclaimer.
- "when that value is" (:107) and "the reverse order of that sort" (:129) are complete corrections. The round-2 "style" verb is gone from :116 and from model.test.mjs:28.
- Tasks 1.14 and 2.18 each give one instruction.
- The main spec agrees with the delta.
- The Known limit `labels-after-enable` agrees with the code: lifecycle.js:1006-1019 calls `update` right after `enable`, and lifecycle.js:919-927 disables the layer when that call fails.