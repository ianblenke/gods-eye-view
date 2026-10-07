Verdict: PASS

Tree: gev-work/ste-words at 92d9818, scope `diff c6af7eb`. I ran no code. `C` = `openspec/changes/archive/2026-10-07-ste-new-prose-words`.

- [ ] FINDING minor C/proposal.md:30-32 `date-cutoff` is stale. `harden-timing-tests` is already archived on 2026-10-07 and merged, so "before it merges" is false; `ste-noun-warning` is the same. "ratchet or archive" is imprecise. The archive folder date decides the rule for documents. The ratchet `since` decides it only for titles. Name both folders and both dates.
- [ ] FINDING minor C/proposal.md:28-29 `titles-of-old-ids` says the adversary checks the words. But `.claude/agents/ste-adversary.md:27` says not to report words from words.json, and no line covers `STE-WORD-OLD`. Say the check needs a later change to that agent file, and list that change under "later changes".
- [ ] FINDING minor C/proposal.md:26 No limit names the hand edits that turn errors into warnings. These are `since` in ids.json (the gates compare only the hash, and the ratchet keeps the entry), the date in an archive folder name, and a Purpose line under `openspec/specs/`. Round 2 asked for this and only the `typeof` part was done. Add a limit.
- [ ] FINDING minor C/proposal.md:26 (owner) A MODIFIED requirement must carry its text and scenarios unchanged, because of the hashes. The delta is new prose. Old specs still hold the words: osh/spec.md:198,206,236,275,393; cyclones/spec.md:32,45,67; wind/spec.md:72; credential-boundary/spec.md:7,35,39. A change to those requirements gets `STE-WORD` errors. Rewording rehashes each scenario. Add a limit or a later change.
- [ ] FINDING minor scripts/spec/lib/ste.mjs:239 The title-side `?? ''` is dead. `'2026-10-06' < undefined` is false, as it is with `''`. Only the row `date-default-title` (to '9999-12-31') fails, and no author would make that edit. Round 3 removed the Markdown twin. Remove this operand too. Remove C/specs/ste-lint/spec.md:22 ("gives the empty string") as well, because it is false for the Markdown code.
- [ ] FINDING minor scripts/spec/lib/ste.mjs:296 Test 045 checks only the prefix and a space. Removing `${error.message}` still passes, but C/design.md:31 claims the JSON reason. Valid JSON `null` gives a raw TypeError at `registry[id]`; this failed the same way before the change. The catch also wraps read errors that no scenario names. Assert the reason, or drop the claim.
- [ ] FINDING minor C/tasks.md:49,51 The report says boxes 2.5 and 2.7 are checked. The tree has `[ ]` for 2.5, 2.7 and 3.1-3.4. Check each box with its output (rules 17 and 19).

Checked, no fault:
- **Mutations:** each operand of lines 229 and 239 and of the try/catch is killed by a row or by a throwing test. `typeof` is killed only by the array case, and that case is present. `?.` removal throws on `a-099`. `constructor`, `__proto__` and `toString` as registry keys give a new title, which is safe.
- **Test 041:** the four malformed folder names kill the rows `archive-month`, `archive-year` and `archive-separator`.
- **Scenarios 028-045:** each test makes its WHEN and asserts the whole findings list. The key list has 34 forms and matches words.json. Test 036 also pins `newWordsFrom`.
- **Trace files:** the applied spec equals the delta. ids.json and links.json hold 045 and the new test titles.
- **Limits and prose:** `titles-of-old-ids` is named once. Words from `newWords` occur only in inline code in this change. The `since` date is UTC (`gates.mjs:376`).

Not read or not verified: gate output, history.jsonl, git objects, audit.md. I did not check the counts 450, 489 and 44. The report says 481 warnings and your message says 489. Round-2 majors are closed.
