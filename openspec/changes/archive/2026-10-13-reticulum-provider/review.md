# Review: reticulum-provider

Verdict: PASS
Reviewers: spec-adversary, ste-adversary
Date: 2026-10-13
Gates: make gates CHANGE=reticulum-provider passed
Rounds: 2
Scope: diff 821ca9a919397e123e06acfd59e58a1ed27dd6a2
Reviewed-Tree: dd17360df6666ba8ab8748afa580124b021282e86949ea0e97800dc3cb87698c

## Findings

The reports of round 1 are in `review/round-1/`. The reports of round 2 are `review/spec-adversary.md` and `review/ste-adversary.md`. Each file holds the report word for word.
The review agents of this session are the teammates `cp-spec-adversary` and `cp-ste-adversary`. They do the task of `spec-adversary` and `ste-adversary`. The brief of each round gave the severity rule of the owner, and the reports follow that rule.
Five short pre-reviews ran before the two rounds. They are listed in the last section. Tasks 4.2 to 4.4 stay open in `tasks.md`, as in the earlier changes.

Verdicts (spec adversary / STE adversary): round 1 FAIL / PASS; round 2 PASS / PASS.

### Round 1 (scope full) - FAIL / PASS

- [x] FINDING major (spec-adversary) The requirement "Source address" said "the loopback, a private network", but the shared rule accepts IPv4 hosts only. Corrected: the requirement names the IPv4 ranges, test 011 refuses `[::1]:8081` and `100.64.0.1:8081`, and the documents say IPv4.
- [x] FINDING minor (spec-adversary) The faults "Refuse the empty path" and "Refuse the slash path" named test 010. Corrected: they name 008.
- [x] FINDING minor (spec-adversary) "does not answer in 8 seconds" had two readings. Corrected: the text says "does not send the whole answer in 8 seconds", test 012 stalls the body, and a fault clears the timer when the headers arrive.
- [x] FINDING minor (spec-adversary) The scenarios had no text for the header `Content-Type` and for the status 200 of an unavailable document. Corrected: one AND each, and the fault "Answer 503 when the listener is unavailable".
- [x] FINDING minor (spec-adversary) The cut at 80 characters counts UTF-16 units, and format characters such as U+202E stay in a name. Recorded in the Known limit `names`. No test, because the Known limit states the behavior.
- [x] FINDING minor (spec-adversary) The proposal said "one line in `.env.example`" for a note of six lines and one variable. Corrected: "a note and one variable".
- [x] FINDING minor (ste-adversary) "after the cleaning" and "named like" were a verb used as a noun and a passive. Corrected in scenarios 007 and 008.
- [x] FINDING minor (ste-adversary) Task 4.1 was not ticked. Corrected after the second ratchet.
- [x] FINDING minor (ste-adversary) "source" and "listener" named one thing. Corrected: "listener" in the WHEN of scenario 008 and in the headings of 011 and 012.
- [x] FINDING minor (ste-adversary) "in its count" did not say what it counts. Corrected with the text of the reviewer: "The 1 to 40 characters of the raw `type` include the word "Interface"."
- [x] FINDING minor (ste-adversary) The `type` can be free text of the operator. Not changed. Reticulum drops a type that is not in a fixed list (`DISCOVERABLE_INTERFACE_TYPES`, lines 77 and 356 of `Discovery.py` of RNS 1.5.7). Both reviewers accepted this later.

### Round 2 (scope diff 821ca9a9) - PASS / PASS

- [x] FINDING minor (spec-adversary) The file order of the scenarios is 012, 014, 013. Kept: scenario 014 belongs under the requirement "Source failure". Recorded as the Known limit `scenario-order`.
- [x] FINDING minor (spec-adversary) The brief said 10 faults on the shared rule, and the evidence holds 12. Corrected in the brief by a message to both reviewers. The evidence says 10 for pre-review 4 and 2 for pre-review 5.
- [x] FINDING minor (spec-adversary) A later message of the reviewer corrects the line numbers of the stalled-body test (lines 521 to 533 and 554). The verdict and the findings stay. The report file keeps the first text.
- [x] FINDING minor (ste-adversary) No named fault removes the arms of the shared rule for 192.168/16, `localhost` and a `.local` name. Corrected: three faults in `evidence/mutations-round2.txt`, and two runs gave the same lines.
- [x] FINDING minor (ste-adversary) The first version of the fault for 192.168/16 left a trailing operator, so the test file did not load. Corrected: the fault replaces the arm with `false`, and `mutations-round2.txt` says so.
- [x] FINDING minor (ste-adversary) The paragraph in design D4 did not say that the provider also refuses a host that a URL parser rejects. Corrected.
- [x] FINDING minor (ste-adversary) "setting" in `proposal.md` and `tasks.md` is an -ing word. Corrected: "variable".

### Pre-reviews, before the first ratchet (1 and 2)

- [x] FINDING major (spec-adversary, pre-review 1) `tasks.md` named only 6 of the 11 scenario IDs. Corrected: tasks 1.1 to 1.5 name each ID.
- [x] FINDING major (both, pre-review 1) The request to the listener had no `redirect` option, so a redirect could send the server to another host. Corrected: `redirect: 'error'`, the text of the requirement, test 012 and two faults.
- [x] FINDING major (spec-adversary, pre-review 1) The cache scenario was false for a request that comes while the first waits. Corrected: the provider shares one request, and scenario 013 and a test show it.
- [x] FINDING major (spec-adversary, pre-review 1) "control character" had two meanings. Corrected: the requirement names U+0000 to U+001F and U+007F to U+009F, the regular expression follows, and four faults.
- [x] FINDING major (spec-adversary, pre-review 1) The THEN of one scenario accepted a 405 or a 400. Corrected: scenario 009 for the method and scenario 010 for a query or a sub-path.
- [x] FINDING major (spec-adversary, pre-review 1) The spec said "empty" and the test also used spaces, and the rounding rule had no THEN. Corrected in scenarios 011 and 005.
- [x] FINDING major (both, pre-review 1) The design said that `stamp` and `value` identify a node, and that test files are in the coverage inventory. Both are false. Corrected. The Purpose text now says "public fields".
- [x] FINDING minor (both, pre-review 1) A type named `constructor` gave a wrong count in `byType`. Corrected with `Object.hasOwn`, a test and two faults. Other minor findings are corrected or recorded in the Known limits `names`, `id` and `address`.
- [x] FINDING major (both, pre-review 2) A scenario AND ("a list of exactly 4 MiB is accepted") did not follow from its WHEN. Corrected: scenario 014 with its own test.
- [x] FINDING major (ste-adversary, pre-review 2) The length of the raw `type` had two meanings. Corrected in the requirement, with a test and a fault.
- [x] FINDING major (both, pre-review 2) Two Known limits were false: the `id` is not a hash of dropped fields only, and the local receivers resolve a name. Corrected.
- [x] FINDING minor (both, pre-review 2) Eight faults were missing (hops, name, radio numbers, order of the checks), and some wording was open. Corrected: eight faults and the wording.

### Pre-reviews, before the second ratchet (3, 4 and 5)

- [x] FINDING minor (both, pre-review 3) PASS / PASS, with three wording fixes. Corrected.
- [x] FINDING major (spec-adversary, pre-review 4) `design.md` line 5 had the two meanings of the old address text. Corrected.
- [x] FINDING minor (ste-adversary, pre-review 4) A host with a leading zero, such as `010.0.0.1`, passes the shared rule, and a URL parser reads it as 8.0.0.1. Corrected in the provider: it refuses a host that the URL parser changes, with tests and 11 faults.
- [x] FINDING major (spec-adversary, pre-review 5) `new URL` throws for `10.0.0.08`, which the shared rule accepts, and the check was outside a `try`. Corrected: the helper `urlHostOf`, two refused hosts in test 011 and the fault "Let the URL error escape".
- [x] FINDING major (ste-adversary, pre-review 5) `new URL` can throw for a `.local` host such as `xn--a.local`. Not changed, on the condition of the reviewer. The command tried 104127 hosts and `new URL` threw for none of them. The IPv4 case above was the real one.
- [x] FINDING minor (both, pre-review 5) The Known limit `address` suggested that the local receivers accept `010.0.0.1`. Corrected: they read the host through a URL parser first. The hosts 11.20 and 11.168 got two more faults.
