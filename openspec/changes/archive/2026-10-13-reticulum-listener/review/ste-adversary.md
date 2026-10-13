Verdict: PASS
Commit read: ac70edf97627ff43586dd42af3a027527034819b. A = openspec/changes/archive/2026-10-13-reticulum-listener/

I found no critical and no major finding. There are four minor findings. The ratchet has run, so a change to a test title now costs a new ratchet. I list no minor finding about a title for that reason (see the last line of "Checked").

- [ ] FINDING minor A/design.md:15 @ac70edf9 "A read of the list and a write of an announce" uses two verbs as nouns (lint warning STE-NOUN). Write: "The code cannot read the list and write an announce at the same time in one process." The lock (`discovery_lock`, Discovery.py line 492) covers the file read at line 534 and the write of an announce, so the text stays true.

- [ ] FINDING minor A/design.md:25 @ac70edf9 "The raw list would reach the 4 MiB cap" is a conditional. Write: "The raw list reaches the 4 MiB cap of the provider at about 4,700 records." This is right: size.txt:14 gives 4,681 records at 896 bytes.

- [ ] FINDING minor A/proposal.md:43,46 @ac70edf9 "are fixed" is passive (two lint warnings), and the same sentence appears twice. Write for `image`: "The Dockerfile names exact versions of `rns` and `lxmf`. See the limit `dependencies`." Write for `dependencies`: "The Dockerfile names exact versions of `rns` and `lxmf`. Their own dependencies, such as `cryptography`, can change."

- [ ] FINDING minor C/docs/fork/reticulum-docker.md:51 @ac70edf9 "a fixed version of `rns`" omits `lxmf`, which the Dockerfile also fixes (step 2 of the document names both). Write: "fixed versions of `rns` and `lxmf`".

Checked, no finding:
- The counts match: 7 requirements, 14 scenarios and 14 test titles (links.json); 954 verified scenarios = 940 + 14; tasks 3.1-3.15 give one verb each; "three targets" is in proposal.md:33 and tasks.md:13.
- 127 faults (mutations.txt: 127 lines; mutations-run.txt: lines 4-130).
- The Purpose in design.md:72 can be copied word for word.
- Rule 12 of AGENTS.md (line 25) is quoted correctly.
- The sizes recompute: 371,878 / 415 = 896; 129,990 / 415 = 313; 4,194,304 / 896 = 4,681. The sampler lines show 415 at 08:51 and 420 at 09:21, which is "30 more minutes" (size.txt:18-19).
- Scenario 012 now says "a URL parser reads the host of that address from the URL that `tapUrl` builds", which has the comparator. It matches test 012.
- Privacy path in listener.py: `public_list()` (lines 45-56) builds each item from `FIELDS` only. Bytes go through `RNS.hexrep`. Other paths answer 404, which does not echo the path. `log_message` is silent.
- The real run covers the final code. listener.py, the Dockerfile and the config did not change after the commit 52d07aa7 (the reflog commits after it change documents, tests and evidence only; the pre-review diffs show it).
- The compose file equals scenarios 010-012. compose.yaml and compose.codex.yaml are unchanged. `GEV_PORT` exists (compose.codex.yaml:14).
- No banned word. All sentences have 25 words or fewer, and the paragraphs have 6 sentences or fewer. The docs use fenced blocks for the two long commands. The lint warnings "read" (tasks.md:21) and "be between" are false alarms.
- The passive "that are enabled" in the title of test 008 is accepted for the ratchet cost.

Not checked: Docker (no container started), Docker Desktop, the 311 related tests (not rerun), the licence texts, and the RNS source beyond the lines I read.
