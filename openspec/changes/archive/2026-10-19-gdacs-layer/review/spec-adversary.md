Verdict: PASS

Findings: none

Tip f1ea3798. I read `.git/refs/heads/gdacs-layer`, and HEAD points to that branch. The clone is /home/ianblenke/docker/gev-work/gdacs-layer, and C = openspec/changes/archive/2026-10-19-gdacs-layer. I could not run code, git or the lint, so I traced the code and the tests by hand. I checked only the requirement "Layer display".

Checked, no finding:
- **Round-5 major closed (both reports).** At C/specs/gdacs-layer/spec.md:137 @f1ea3798, the round-5 spec-adversary text is now in the requirement word for word. The rule for the newest call now has a limit: "If the layer did not abort the request of its newest call of `update`". So no answer comes under both the MUST and the MUST NOT.
- **Round-5 minor closed (STE adversary).** "another result" is gone. The text now says "a result with `meta.unavailable` false". The normalizer always gives a boolean (records.js:109, `payload.unavailable === true`), so the true rule and the false rule cover all results with no overlap.
- **Agreement with index.js.** The layer accepts an answer only when `_request === request` (:116, :131). Three things change `_request` while a request waits, and each one aborts it: a newer call (:108-110), `disable` (:98-99) and `destroy` (:140-141). Line :134 clears only the call's own request. A call while the layer is disabled sends no request (:107). The layer is disabled only before the first `enable` or after `disable` or `destroy`, so no request that was not aborted can wait at that time. So for each request, "not aborted and newest" means "accepted". Removal for a true result is at :117-120, and replacement for a false result is at :121-124.
- **Scenarios 012 to 017.** No scenario contradicts the text:
  - 012 :150 agrees with "replace" (test :225-241).
  - 013 :153-154 agrees with "remove all" (test :284-298, a true result with 2 events gives 0 entities).
  - 014 is a false result, so the points of that result replace the old points.
  - 015 :166 agrees with paragraph 2.
  - 016 :173 agrees with the MUST NOT for the request that `disable` aborted (test :385-393, and :410-414 for a late rejection). 016 :175-176 agrees for the request that a newer call aborted (test :396-405, :419-429). Test :406-409 shows that a rejection of the newest request that the layer did not abort is accepted.
  - 017 :182 agrees with the MUST NOT for the request that `destroy` aborted (test :475-481).
- **Known limit `labels-after-enable` (proposal.md:55).** The limit agrees with the text. `disable` removes the labels (index.js:102), and `enable` does not give them again (:91-95). The text has no rule that tells the layer to give them again. A failure keeps what the layer shows, and the next accepted result replaces or removes the points and the labels.
- **Pronouns.** "it" in "a request that it aborted" and in "it MUST accept" can only be the layer. "its newest call" is the newest call of the layer.
- **No banned word.** The new words are "If", "did", "not", "abort" and "false". None of them is in `words`, `phrases` or `newWords` of openspec/ste/words.json. "abort" is only in `nounVerbs`, and here it follows "not", which is not a determiner.
- **Main spec.** The main spec at openspec/specs/gdacs-layer/spec.md:140 and :142 has the same text as the delta at :137 and :139.
- **Task 1.17** (tasks.md:19) gives one instruction.