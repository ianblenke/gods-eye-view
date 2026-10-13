Verdict: PASS
Commit read: b7a71a1bc5c0bfea6acd207b08e8a98a7b5512d7. A = openspec/changes/archive/2026-10-13-reticulum-provider/

No critical and no major finding. There are three minor findings, one line each.

- [ ] FINDING minor A/evidence/mutations.txt @b7a71a1b Rule 13. The sentence in the requirement "Source address" has these arms: IPv4 loopback, IPv4 private (10/8, 172.16/12, 192.168/16), `localhost`, `.local` name, IPv4 only, leading zero. Test 011 accepts `192.168.1.5`, `localhost:9000` and `listener.local:8081`, so it can fail. But no named fault removes these arms. The faults of the shared rule cover 127, 10, 172, 192.169, 100.64, 11.x and IPv6 only. Add: "Refuse the host 192.168 (rule of the tap address)", "Refuse localhost" and "Refuse a .local name".

- [ ] FINDING minor A/design.md:35 @b7a71a1b The new paragraph says the provider refuses "a host that a URL parser reads as another address". The code (`urlHostOf()`, reticulum.js:147-153, 236) and test 011 also refuse a host that the URL parser rejects (`10.0.0.08`, `192.168.0.09`). The paragraph sits under D4, "Names, cache and failure". Add: "It also refuses a host that a URL parser rejects, such as `10.0.0.08`." (13 words.)

- [ ] FINDING minor A/proposal.md:15, A/tasks.md:14 @b7a71a1b "one setting" and "the setting" use an -ing word (lint warning). The spec calls `RETICULUM_LISTENER` "the variable" (scenario 011). Write "variable" in both places.

Checked, no finding:
- The Source address sentence is true and testable. "An IPv4 host with a part that has a leading zero and more digits" equals the refusal set of the code: the URL serializer drops every leading zero, and "08" and "09" make the parser fail, so `urlHostOf()` gives a text or null that differs from the host. The single "0" stays valid (`127.0.0.1` and `10.0.0.1` are accepted in test 011). The 22-word sentence has no two-meaning phrase; the requirement has 6 sentences with the Origin line (at the limit). The word "leading" is a technical term.
- Test 011 has 14 refused and 9 accepted hosts. Each host in the list follows the shared rule in tapAddress.js:79-130 and the URL check.
- `urlHostOf()` catches the URL error. The route answers with a JSON document and status 200 for each refused host. The earlier worry about `xn--` hosts is moot: any throw now gives "address not allowed".
- The declined minor holds: Discovery.py lines 77-78 (`DISCOVERABLE_INTERFACE_TYPES`) and 356-357 (the announce is ignored for any other type). This is true for the RNS copy in the scratchpad.
- Evidence: 137 faults (mutations-run.txt lines 4-140; mutations.txt 137 lines; mutations-script.txt holds the tapAddress faults). 25 fault lines name test 011; the 26th line that has "reticulum-source-011" is the note at line 146. The 8 + 11 + 8 + 2 + 11 + 3 cases add up to 137 minus 102 = 35. Host-checks names the code commit ffbd9f04.
- Known limit `address` is true (local-receivers.js:62-73 parses the URL first). Known limit `names` equals the code (U+202E stays; the cut counts UTF-16 units).
- Counts: 9 requirements, 14 scenarios. Task 4.1 is ticked and 4.2-4.4 are not (correct). The archived delta and the merged spec have the same changes. The test titles and headings match.
- No banned word. All sentences have 25 words or fewer. Warnings "be between" (design.md:23), "spreading" and "coding" are false alarms.

Not checked: that the URL parser throws for `10.0.0.08` and reads `010.0.0.1` as 8.0.0.1 (no code run; the tests and the evidence say so), the 104127-host trial, and the 283 related tests.
