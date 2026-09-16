Verified the prose against the code and the ledger data, and computed the tolerance sums from `openspec/trace/gaps.json`.

```
Verdict: FAIL
- [ ] S1 major proposal.md:39 "For the covered branches and functions the new tolerance is much smaller: the sum goes from 1802 to 532." One word, one meaning. 1802 and 532 are the branch sums alone. For the branches and the functions together the sums are 3567 and 618. Write: "For the covered branches the sum goes from 1802 to 532, and for the covered functions from 1765 to 86."
- [ ] S2 major design.md:13 "Keep the gate as strong as the three mechanisms together for the covered counts." The text does not agree with the ledger. The new tolerance is larger than the old band `max(5, ceil(covered * 0.02))` for 18 metrics of the 706 loaded metrics, and 16 of them had no range. `src/annotations/annotationEngine.js` gets 8 branches in place of 5. Write: "Keep the gate as strong as the three mechanisms together for the covered counts of almost each file", and name the 18 metrics in the known limit `line-tolerance-larger`.
- [ ] S3 major proposal.md:19 "the ratchet command does not write a smaller count that is inside the tolerance" (also design.md:50 "a count that is smaller than the entry count by less than the tolerance") One word, one meaning. The correction of S1 makes "the entry count" the not-covered count in each spec line. For the not-covered lines the command writes the smaller count: `toleranceCounts` writes `Math.min(entry.lines, gap.lines)`. Write: "the ratchet command does not write a worse count", as `gap-ledger-073` writes it.
- [ ] S4 minor design.md:12 and :14 "Give the ledger one rule for a count difference." and "Give the gate one rule for a count difference, also when the line tolerance becomes larger." One word, one meaning. The two goals have the same words for the same thing. Write the third goal as: "Accept a line tolerance that is larger than the old band."
- [ ] S5 minor proposal.md:38 "The gate allows a difference of the tolerance" Approved words. The correction of S18 writes "at most the tolerance" in the spec and in the Purpose. Write: "a difference of at most the tolerance".
- [ ] S6 minor proposal.md:39 "The sum of the allowed lines goes from 1965 to 2039" (also "the sum goes from 1802 to 532") Verbs. The correction of S19 removed "go from ... to" as a phrasal verb. Write: "The sum of the allowed lines becomes 2039 in place of 1965."
- [ ] S7 minor proposal.md:41 "the observed counts of seven files" One word, one meaning. The correction of S14 makes "measured" the one word, and the name of the limit is `tolerance-not-measured`. Write: "the measured counts".
- [ ] S8 minor design.md:72 "go away with their 25 scenario IDs" Verbs. Round 1 S8 is open here: this is a phrasal verb, and the active voice is possible. Write: "This change removes the requirement "Count band for band files" and the requirement "Unstable coverage", with their 25 scenario IDs."
- [ ] S9 minor specs/gap-ledger/spec.md:34 "the command keeps the entry count of each metric that is worse than in the entry" Articles and nouns. The metric is not worse; its current count is. Write: "the command keeps the entry count of each metric with a worse current count".
- [ ] S10 minor specs/gap-ledger/spec.md:58 "For each code file below 100% ... It also records the not-covered lines, branches and functions, and the total lines, branches and functions." The text does not agree with the code. 107 entries of a file that no test loads record null for the branches, the functions and their totals, and the requirement "Total counts of the ledger" writes "of a loaded code file". Write: "For each loaded code file, it also records the total lines, branches and functions."
- [ ] S11 minor openspec/specs/spec-trace/spec.md:5 and openspec/specs/ci-gates/spec.md:5 Round 1 S21 is open. The hand-written Purpose of `openspec/specs/gap-ledger/spec.md` still has no empty line before "## Requirements". This change now also removes that empty line from the two other main specs. The four main specs that this change does not edit keep it. Add the empty line in the three files.
```

Round 1: S1 to S7, S9 to S13, S15 to S20 are closed. S8, S14 and S21 are open (see S8, S7 and S11 above). The corrected texts of S18 and S19 came back in new prose (see S5 and S6).

Checked and correct:
- `gap-ledger-071` agrees with `toleranceOf`: 200 gives 8, 199 gives 7, 24 gives 0.
- "the covered count of its entry minus the tolerance" agrees with `now < before - tolerance(metric)` in `compareCoverageEntry` in each place of the spec.
- The line numbers of `line-tolerance-larger`: 206 of 353 loaded entries, and the sums 1965 and 2039, are correct.
- The requirement "Removal of a requirement" and `spec-trace-054` agree with `removedIds` in `loadSpecs` and with `evaluateTrace`.
- The 13 new and changed test names are descriptions without a subject, in the simple present and the active voice.
