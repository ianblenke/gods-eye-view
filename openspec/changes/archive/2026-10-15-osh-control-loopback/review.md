# Review: osh-control-loopback

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-15
Gates: make gates CHANGE=osh-control-loopback passed
Rounds: 1
Scope: full
Reviewed-Tree: fcc61e49e2935402d2e7fec05b5d25e385acfa8ab28b657259920b5b1e14b59c

## Findings

The reports of round 1 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word.
The review agents of this session are the teammates `cp-spec-adversary` and `cp-ste-adversary`. They do the task of `spec-adversary` and `ste-adversary`. The brief of each round gave the severity rule of the owner, and the reports follow that rule.
Three short pre-reviews ran before the ratchet. They are listed in the last section. Tasks 4.2 to 4.4 stay open in `tasks.md`, as in the earlier changes.
The first image ratchet stopped on an unrelated test, `src/overlays/worldOverlayAllocation.test.mjs`, at a machine load of 82. The same file passed 13 of 13 in three later runs, and the second ratchet run passed. The evidence of the ratchet is the second run.
The reviewers sent copies of their reports as idle notifications. The report files hold the first message of each reviewer.

Verdicts (spec adversary / STE adversary): round 1 PASS / PASS.

### Round 1 (scope full) - PASS / PASS

- [x] FINDING minor (spec-adversary) The sentence "The route gives the same `403` as before" in `design.md` had two meanings. Corrected: "The route gives `403` with the same body as for any other refusal."
- [x] FINDING minor (spec-adversary) No Known limit named the modes that the evidence did not measure. Corrected: the Known limit `modes` in `proposal.md`.
- [x] FINDING minor (ste-adversary) The edited sentence in `docs/roadmap/mcp-agent-backends.md` had about 50 words, and one line was longer than 80 columns. Corrected: the sentence is split into short sentences, and the lines are wrapped.
- [x] FINDING minor (ste-adversary) The note about the command route stood between the flag and the account variables in `.env.example`. Corrected: the note is above `# OSH_CONTROL_ENABLED=`.

### Pre-reviews, before the ratchet

- [x] FINDING major (spec-adversary, pre-review 1) The history of the evidence said that each removed check "left the result of every request the same", and that is false for the lower-case step of the host. The old gate let a Host in capital letters pass. Corrected: scenario 028 has the AND for a host with a capital letter, the test refuses `LOCALHOST:5173` and `Localhost:5173`, the fault "Compare the host in lower case" is caught, and `evidence/mutations-run.txt` says that this is a change of behavior.
- [x] FINDING major (both, pre-review 1) The documents said that `make up` shows the address `172.17.0.1`, but the probe ran on the default bridge. Corrected: `evidence/peer-address.txt` has three measurements (the default bridge, a user-defined bridge network and the host network), and the documents say "the gateway address of the project network".
- [x] FINDING major (ste-adversary, pre-review 1) The proposal said that one gate serves each route that sends a request to an outside system, and the design says that other routes have their own gate. Corrected: "the OSH control route and the Bee Maps route share one function".
- [x] FINDING major (ste-adversary, pre-review 1) Tasks 3.5 and 3.6 had two instructions each. Corrected: tasks 3.5 to 3.8 have one instruction each.
- [x] FINDING major (ste-adversary, pre-review 2) The design said that the gate has "the same rules as the key panel", and the key panel changes the host to lower case and this gate does not. Corrected: "the same lists as the key panel", and design D2 names the difference.
- [x] FINDING minor (both, pre-reviews 1 to 3) Several minor findings: the control account in the proposal and the CHANGELOG, the `HOST` sentence of the design, the audit client in scenario 028 and 039, "a request to `localhost`", the route-level case for a capital host, the order of the design paragraphs, the verbs "lower-case" and "shows", and long sentences in the evidence. Corrected.
