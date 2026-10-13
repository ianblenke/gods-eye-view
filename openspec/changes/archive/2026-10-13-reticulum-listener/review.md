# Review: reticulum-listener

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-13
Gates: make gates CHANGE=reticulum-listener passed
Rounds: 1
Scope: full
Reviewed-Tree: ebec02724b93ca688cfe54225e3ea7dab971f010d839956bcc5234ac7fda8d55

## Findings

The reports of round 1 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word.
The review agents of this session are the teammates `cp-spec-adversary` and `cp-ste-adversary`. They do the task of `spec-adversary` and `ste-adversary`. The brief of each round gave the severity rule of the owner, and the reports follow that rule.
Three short pre-reviews ran before the ratchet. They are listed in the last section. Tasks 4.2 to 4.4 stay open in `tasks.md`, as in the earlier changes.
The real run of the listener found two defects before any review: the image needed the package `lxmf`, and the two Backbone entries of the first default config reconnected every 5 seconds. Both are corrected, and `evidence/real-run.txt` shows the run with the final files.

Verdicts (spec adversary / STE adversary): round 1 PASS / PASS.

### Round 1 (scope full) - PASS / PASS

- [x] FINDING minor (spec-adversary) The subnet claim in `design.md` had no evidence file. Corrected: `evidence/networks.txt` holds the subnets of the Docker networks and the routes of the host, and `design.md` points to it.
- [x] FINDING minor (spec-adversary) The requirement says that the targets `up` and `up-codex` stay as they are, and no scenario of this capability checks it. Recorded as the Known limit `app-container-pin`. The tests `app-container-003` and `app-container-004` pin the two targets.
- [x] FINDING minor (spec-adversary) Test 009 pins the line `os.makedirs(CONFIG_DIR, exist_ok=True)`, and no scenario names the header `Content-Type` or the status 200. Accepted by name as the Known limit `unpinned-details`. A change of a scenario costs a new ratchet.
- [x] FINDING minor (spec-adversary) The proposal said "the use of its data to train AI", and the licence says "in the creation of an artificial intelligence, machine learning or language model training dataset". Corrected in `proposal.md` and in `DATA_SOURCES.md`. The text of the licence is in the headers of the RNS source files.
- [x] FINDING minor (spec-adversary) The Known limits did not name two facts. Corrected: the Known limit `health` (the health check shows only that HTTP answers) and the Known limit `clients` (the server has no client limit, and only `pids_limit` bounds the threads).
- [x] FINDING minor (ste-adversary) "A read of the list and a write of an announce" in `design.md` used two verbs as nouns. Corrected.
- [x] FINDING minor (ste-adversary) "The raw list would reach the 4 MiB cap" in `design.md` was a conditional. Corrected: "reaches".
- [x] FINDING minor (ste-adversary) The Known limits `image` and `dependencies` used the passive "are fixed", and the same sentence stood twice. Corrected with the text of the reviewer.
- [x] FINDING minor (ste-adversary) `docs/fork/reticulum-docker.md` said "a fixed version of `rns`" and the Dockerfile also names `lxmf`. Corrected: "fixed versions of `rns` and `lxmf`".

### Pre-reviews, before the ratchet

- [x] FINDING major (spec-adversary, pre-review 1) The tests pinned only the list `FIELDS`. A loop over the whole record would have kept every test green and would have sent every field. Corrected: scenario 004 pins the function `public_list` line by line, with 6 exact lines in test 004 and 5 new faults.
- [x] FINDING major (spec-adversary, pre-review 1) The requirement said "no Linux capability", and the test checked only `cap_drop`. Corrected: scenario 010 says that the service has no `cap_add`, no `privileged` and no `user`, with a test and 3 faults.
- [x] FINDING major (both, pre-review 1) Tasks 3.3 to 3.6 gave two or three instructions each. Corrected: one verb for each task, tasks 3.1 to 3.15.
- [x] FINDING major (both, pre-review 1) The proposal and the tasks said "two" Makefile targets, and the change adds three. Corrected.
- [x] FINDING major (both, pre-review 1) The design said that the program drops the other twelve fields of the record, and the record has more fields (`transport`, `received`, `discovered`, `heard_count`, `status`). Corrected: "every other field".
- [x] FINDING major (both, pre-review 1) The text said that rule 12 of `AGENTS.md` names the app container and one gates container. The rule says only "Run one container at a time". Corrected in the design and in the Known limit `second-container`.
- [x] FINDING major (both, pre-review 1) The AND "no line of code outside a comment holds the name of a dropped field" was false for the variable `value`. Corrected: "in quotation marks".
- [x] FINDING major (spec-adversary, pre-review 1) The sizes and the growth of the test node had no evidence file, and the text said "still rising" while the node had nearly stopped growing. Corrected: `evidence/size.txt` with the commands and the sampler lines.
- [x] FINDING minor (both, pre-review 1) Several minor findings. Corrected: the folder `/data` in scenario 002 with a test and 3 faults, `inSubnet` reads the defaults from the file, the path in `compose-config.txt`, two fenced blocks in the document, the count of public nodes, and the Known limits `dependencies`, `no-login` and `scripts-as-text`.
- [x] FINDING major (spec-adversary, pre-review 2) The Known limit `image` said that the package versions are fixed, and the new Known limit `dependencies` said that some are not. Corrected. Two more lines of `public_list` are pinned, with 2 faults.
- [x] FINDING major (spec-adversary, pre-review 3) "The same host" in scenario 012 had no referent. Corrected with the text of the reviewer: "a URL parser reads the host of that address from the URL that `tapUrl` builds". The STE adversary found the same fault as a minor finding.
