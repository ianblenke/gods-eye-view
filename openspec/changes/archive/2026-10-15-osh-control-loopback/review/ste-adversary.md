Verdict: PASS

Tree commit 34fc542076f1ad6f0b8611a0d56572e8bd45a6f0, checked against `.git/refs/heads/osh-control-loopback`, scope full. I ran nothing. I found no critical and no major finding. The lint gives 0 errors (r1-gate-output.txt:1312), and the only gate error is REVIEW-MISSING.

- [ ] FINDING minor docs/roadmap/mcp-agent-backends.md:28-31 (34fc5420) The edited sentence "The OSH control route `/api/control/osh` has these gates in this order: local connection and same origin, ..." has about 50 words, and this change makes it 3 words longer. The line at :29 is also longer than the 80 columns of its paragraph. The lint does not read this file. Write: "The OSH control route `/api/control/osh` has these gates in this order. They are the local connection and the same origin, `OSH_CONTROL_ENABLED`, the separate control account, the 4 KB body limit, and the fixed command table. Then come the rate limit and the one-in-flight gate, the live control stream check, and the audit log." This keeps the order of the gates in `osh-control.js:98-131` and `targets.js:6-28`.
- [ ] FINDING minor .env.example:251-253 (34fc5420) The note about the command route sits between `# OSH_CONTROL_ENABLED=` and `# OSH_CONTROL_USERNAME=`. It separates the flag from the account variables, and a reader can take the note as the comment of `OSH_CONTROL_USERNAME`. Move the three lines above `# OSH_CONTROL_ENABLED=`. The text of the note is true and has short sentences.

Checked, no finding:
- All pre-review 3 corrections are in the archive: "changes the host to lower case" (design.md:34, mutations-run.txt:59), "showed" (peer-address.txt:37), "In the two bridge measurements" (peer-address.txt:35).
- The canonical spec equals the delta: scenario 028 with the AND for a host with a capital letter, 039 with the audit client AND, and 040. Scenario 029 and the requirement text equal the base.
- design.md:14 ("the same lists as the key panel") is true, and design.md:34 states the one difference (the key panel lower-cases the host). The proxy list is pinned by `localRequestGate.test.mjs:49` and `keySetupCore.test.mjs:326`.
- Every task has one instruction and is under 20 words. Task 4.1 is ticked after the ratchet.
- Evidence statements agree with the reflog: 49 faults on 49dc9186, then later commits change evidence files, documents and trace files only.
- Grep finds no banned word and no -ing word in the new prose, and the new test titles have none. The word `via` appears only as a header name.
- The title "Refuse malformed host values" is old prose with a changed body, so the lint gives a warning and no error.

Not checked: a real LAN client, the network that `make up` creates, and rootless Docker.
