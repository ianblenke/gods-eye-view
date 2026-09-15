Verdict: FAIL
- [ ] S125 openspec/changes/archive/2026-09-14-establish-spec-governance/proposal.md:60 "Each high count can be at most 5 above the base count, or 2% of the base count when that is more." Articles and nouns (do not leave out words to make a sentence shorter). The word "above" is missing from the second part. Read word by word, the sentence says that a high count can be at most 2% of the base count. The real rule is that it can be at most 2% of the base count above the base count. The range sentence before it has no such problem, because "2% of its low count" is a width. design.md:109 gives the rule in full. I suggested this wording myself in S122, so this problem comes from round 9. Write: "Each high count can be at most the base count plus 5, or plus 2% of the base count when that is more."

Notes for the caller:
- **Round-9 check:** S120 to S124 are all corrected.
  - **S120:** proposal.md:66 now says "checks each changed test for these files".
  - **S121:** proposal.md:66 now says "while each not-covered count is in its range, the gate does not compare the total counts or the covered counts of the entry. The ratchet command then keeps the old total counts." This matches design.md:113.
  - **S122:** proposal.md:60 now has two sentences, one for the range width and one for the high count. S125 is about the second sentence.
  - **S123:** design.md:105 now says "uses these rules".
  - **S124:** test name line 153 now says "for a new range with equal low and high counts".
- **Gate output:** "STE: 0 errors, 0 warnings". There are no STE-PASSIVE or STE-ING warnings to examine.
- **Merged specs:** openspec/specs/*/spec.md is still the same as the delta specs, except for the heading, Purpose and Requirements lines.
- **Test names:** only lines 153 (gap-ledger-059, renamed) and 154 (gap-ledger-060, new) changed since round 9. Neither has a finding.
- **Files changed since round 9:** only proposal.md, design.md, specs/gap-ledger/spec.md and tasks.md. AGENTS.md, config.yaml, the agent files and review.md have not changed since round 9.
- **New or changed prose with no findings:**
  - proposal.md:60, except S125.
  - proposal.md:66.
  - design.md:97–113, which includes the stability paragraph at :101, the rules sentence at :105, the rules list at :106–109 and the range sentences at :111 and :113.
  - gap-ledger-021 and gap-ledger-060.
  - tasks 4.59 and 4.60.
- **Not reported (wording could be clearer, but no STE rule is broken):**
  - **gap-ledger-021:** "an entry without a range for a file" can attach "for a file" to "range" or to "entry". Both readings have the same meaning.
  - **gap-ledger-060:** after "its ledger entry and its base entry have a range", the words "the range" do not name the entry. Only the ledger entry gives a reading that makes sense.
  - **"needs" (proposal.md:60):** I am still not sure that this is an approved STE verb. Earlier rounds accepted it, so I did not report it.
- I did not read .env. I made no changes to files in the repository.