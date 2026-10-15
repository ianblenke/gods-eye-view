Verdict: FAIL
Tip 3c9496d4 (I read the tree at this commit, by hand). Nothing ran. I could not run the lint, the tests, the fault runs, git or Chrome, and I did not check the pull requests 1002 and 1069.

- [ ] FINDING major openspec/specs/beemaps-frames/spec.md:143 (3c9496d4) In scenario 013, "own" has two meanings. Lines 125 and 140 use "a signal of its own" for the signal that the source makes. Line 143 says "a call whose own signal is aborted", and the test source.test.mjs:375 shows this means the signal of the caller. Read as the source's signal, line 143 contradicts line 138, where a timeout gives `unreachable`. The archived delta has the same text at spec.md:140. Write "a call rejects with the abort error when the signal of the call is aborted". The test (source.test.mjs:375-404) covers an abort before the call, during the call and during the body read.
- [ ] FINDING minor openspec/specs/beemaps-frames/spec.md:52 (3c9496d4) Scenario 006 says "no earlier press has failed". A press with no box also leaves its message (index.js:98-100), and the info line then keeps it. The Known limit `press-message-first` (proposal.md:40) has the same gap. Write "and the info text shows no message of a press". For the Known limit write "While the info line shows the message of a press, a status with no key does not replace it." This matches `_pressMessage ?? _statusMessage` (index.js:201).
- [ ] FINDING minor proposal.md:40 (3c9496d4) "A disable and an enable removes the message" uses verbs as nouns, and the verb does not agree with the subject. Write "The message goes when someone disables and enables the layer." This matches `reset()` (index.js:81-93).
- [ ] FINDING minor evidence/browser-run.txt:8 (3c9496d4) The sentence "Each cause was in the driver: ..." has 39 words (limit 25). mutations.txt:3 has 30 words, mutations.txt:4 has 26 and 27, and mutations.txt:17 has more than 25. These .txt files are not linted. Split each into short sentences, for example "The share link needs lat and lon in the hash." and "The data panel starts closed."
- [ ] FINDING minor evidence/mutations.txt:257 (3c9496d4) The fault name "Show KEY REQUIRED when the key is set" uses a banned form (REQUIRED) and names text that no longer exists. Write "Show the text for no key when the key is set". Line 33 says "The two runs ... follow in the lines below", but only the first run's lines follow (line 35), and line 11 says the two runs are identical. Write "The first run follows".

Checked, no finding:
- **Banned words:** none in proposal, design, tasks, the capability spec or the test titles.
- **Accepted -ing words:** "Fetching…" and "after the rounding" are accepted by name, as the brief says. `remaining` in records.test.mjs:168 is a field name.
- **Counts against the files:**
  - There are 27 scenarios.
  - mutations.txt has 342 fault lines, 1 line with NONE, 1 TIMEOUT and 13 untagged lines.
  - browser-run.txt has 29 PASS lines.
  - The host-checks.txt figure of 51 host tests matches the 51 titles in the five host test files.
- **Texts against the code:** every message, the hint, the labels, the 0, 1 and 2 second rows and the Purpose match messages.js, model.js, index.js and design.md word for word.
- **Docs and tasks:** CHANGELOG.md (6 sentences) and DATA_SOURCES.md (6 sentences) are within the limits. Tasks are 20 words or fewer with one instruction each, and the boxes match the evidence.
- **Delta:** the osh delta changes only 31 to 32.
