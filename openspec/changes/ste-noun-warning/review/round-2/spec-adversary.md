Verdict: PASS

Commit read: fc1646c8ba61. A = openspec/changes/archive/2026-10-07-ste-noun-warning. I ran no code. I did not read the Node-image gate run, `mutations-final-round2.log` or `words.md`. I could not read git objects, so I used `.git/logs/HEAD`. `gaps.json` (17848 lines) and `history.jsonl` (2009 lines) have the same line counts as main. I found no critical or major finding.

- [ ] FINDING minor .claude/commands/opsx/review.md:20 The STE agent now says the caller gives only the warnings of changed files (ste-adversary.md:13,31). Step 7 gives all STE warnings of the gate output: 429, with 79 STE-NOUN, mostly in old prose. The base requirement (specs/ste-lint/spec.md:78) says "each warning". Write "the STE warnings for the changed files" in step 7.
- [ ] FINDING minor .claude/agents/ste-adversary.md:42 The new exception "open major finding from the round before" cannot work. The Input (lines 11-14) and review.md steps 6-7 do not give those findings to the agent. spec-adversary.md:20 still says "the only exception". Add the earlier findings to both Inputs and to steps 6-7.
- [ ] FINDING minor A/specs/ste-lint/spec.md:18 `Test "<title>":` is wrong. ste.mjs:236 prints `record.name`, which has the tag. `title` in the records and in ste-lint-027 has no tag. For titles the code reports line 0 (test line 313), but the spec says "the line of the listed word". Write `<name>` and state line 0 for titles.
- [ ] FINDING minor A/proposal.md:16 The proposal says "an ADDED requirement", but the delta has two. "What Changes" omits the title cleaning: base `tokensOf(record.title, 0)` is now `cleanLine`, which changes every rule for tagged titles. Add a bullet.
- [ ] FINDING minor scripts/spec/lib/ste.mjs:231 `cleanLine` on titles also replaces links and URLs and strips `**` and `__`. ste-lint-027 and its test prove only inline code. A change to an inline-code-only replace would pass every test. Test it, or add it to the known limit `title-rules`.
- [ ] FINDING minor A/proposal.md:24 The ratchet text is stale, and a correction added it. ids.json:3007 and links.json:3212 hold ste-lint-027 and renamed links from the ratchet at 03d6954. The text says 020 to 026 and names only e9b1bf8 (also tasks.md:45 and design.md:76). Write 020 to 027 and name the last ratchet commit.
- [ ] FINDING minor A/tasks.md:25 Mutation rows 020-inner-quote and 021-bare-determiner have no task line. muts.json is outside the repo, so a reviewer cannot re-run them. Add task lines.
- [ ] FINDING minor A/proposal.md:37 The limit `nounVerbs-unchecked` names entries only. A value that is not an array fails: a number or object throws TypeError, and a string splits into letters and silently disables the rule. Add this to the limit.

Checked by reading only:
- Each round-1 finding is corrected in text, code or test.
- The new assertions use literal values.
- Each of the 17 mutation rows fails a test of this change for the reason it names.
- Each operand of the compound condition at ste.mjs:181 has its own mutation row.
- gates.test.mjs:380, 554 and 556 hold the real agent files to 0 warnings.
