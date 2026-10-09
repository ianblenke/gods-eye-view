Verdict: PASS

Tree: `/home/ianblenke/docker/gev-work/fix-ontario-511`, branch `fix-ontario-511-key`, commit `c13dffd46e1c7f80f045299bfb50682a2110e6b7` (read from `.git/refs/heads/fix-ontario-511-key`). I ran no code and no git. D = `openspec/changes/archive/2026-10-09-fix-ontario-511-key/`.

The round 1 major finding is closed. The checked boxes and the Purpose sentence show no new fault.

**1. Purpose sentence**
- `openspec/specs/live-sources/spec.md:4` ends with "The capability also has requirements for the Ontario camera key. It has requirements for the Ontario row rules."
- A search with `$` anchors finds this text exactly once in `spec.md:4` and exactly once in `D/design.md:110`, so the two sentences match word for word.
- The first two sentences of the Purpose are unchanged in the diff.
- "credential" and "covers" are gone. The sentence uses "key" and "has requirements for", as the glossary (`D/design.md:46,55`) and pre-review 2 require.
- No word in the sentence is in `openspec/ste/words.json`. Each word has one meaning in the change.
- The diff changes no other line of `spec.md`. The Purpose is in no scenario hash (round 1 checked `specs.mjs:38-41,75`), so the edit has no ledger consequence.
- Not filed: "It" in the second sentence could point at "key" by distance. Only "The capability" can have requirements, so the meaning is clear. A change would break the match with `design.md:110`.

**2. Three task boxes (`D/tasks.md:141-143`)**
- Each box keeps one imperative verb: "Add" (141), "Run" (142), "Keep" (143).
- Rule 17, box 141: the record is `spec.md:4`, which equals `design.md:110`.
- Rule 17, box 142: `trace/history.jsonl` lines 2055-2061 hold the ratchet entries for `fix-ontario-511-key`, and `trace/ids.json` lines 2060-2095 hold eight entries for the change. The verdict "833 scenarios, 833 verified, 0 open" is in the report and the command output. No file of the change holds it.
- Rule 17, box 143: `history.jsonl:2056-2058` records `sources.js` going from 411 to 314 lines, 107 to 103 branches and 7 to 3 functions. `trace/gaps.json:619-627` now shows 314, 103 and 3 for the file.
- No live sentence states "113", "7 open", or a task count. The only hits are in `review/round-1/` records and `pre-review-3/ste-adversary.md:43`, which are past records.
- Boxes 140 and 144-146 stay open, as the brief says.

**3. Rest of the diff**
- The diff touches only `tasks.md` and `spec.md`. I found no other change.

- [ ] FINDING minor D/review/round-1/ste-adversary.md:36 The round 1 text says "you may then check it: 114 of 120, 6 open". With boxes 141-143 checked the count is 116 of 120, 4 open. This is a dated record, not a live sentence. -> Leave it. If `review.md` gives a task count, write 116 of 120 and 4 open (boxes 140, 144, 145, 146).

- [ ] FINDING minor D/review.md (to write) "The ratchet verdict 833 scenarios, 833 verified, 0 open appears in no file of the change." -> Copy the verdict line and the image ratchet log into `review.md`. Box 142 then has a record inside the change.

Read: the brief, the diff, `D/design.md` (all), `D/tasks.md:100-146`, the round 1 STE report, `spec.md:1-12`, and searches in `D/`, `openspec/trace/` and `openspec/ste/words.json`.

Not read: `evidence.md` (grep only), the code, and the other specs.
