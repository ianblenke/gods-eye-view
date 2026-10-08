# Former survivor results

Base commit: `290b5d2`.

KILLED names a failed tagged test.
EQUIVALENT names a proved public API claim.
`KNOWN LIMIT` names a Known limit.
KNOWN means known in that status name.
LIMIT means limit in that status name.
HTTP means Hypertext Transfer Protocol.

Pass 4 correction check 2 recorded 192 killed results and 68 survived results.
It labeled 64 cases as equivalent and four as Known limits.
Pass 5 kills four of those equivalent cases.
The old table now has 196 killed, 60 equivalent and four Known limit results.

The public function probes support each equivalent claim.
The claim covers returned data, error fields, getters and callback calls with standard built-in functions.
The claim excludes source text and diagnostic stack locations.

The campaign command and status totals are in [evidence.md](evidence.md).
The source audit is [audit.md](audit.md).

| id | file:line | class | verdict | test title or probe file or limit name |
| --- | --- | --- | --- | --- |
| a0004 | src/director/packs/manifest.js:10 | `object` | KILLED | [director-088] The session rejects a caller change to the data pack limits |
| a0107 | src/director/packs/manifest.js:24 | `regex` | KILLED | [director-076] The validator returns without an error for z in both character positions for the asset path |
| a0108 | src/director/packs/manifest.js:24 | `regex` | KILLED | [director-076] The validator returns without an error for Z in both character positions for the asset path |
| a0110 | src/director/packs/manifest.js:24 | `regex` | KILLED | [director-076] The validator returns without an error for z in both character positions for the asset path |
| a0111 | src/director/packs/manifest.js:24 | `regex` | KILLED | [director-076] The validator returns without an error for Z in both character positions for the asset path |
| a0121 | src/director/packs/manifest.js:34 | `statement` | KILLED | [director-077] The validator checks fields before ID and rejects the call |
| a0122 | src/director/packs/manifest.js:34 | `statement` | KILLED | [director-077] The validator checks fields before ID and rejects the call |
| a0123 | src/director/packs/manifest.js:34 | `statement` | KILLED | [director-077] The validator checks fields before ID and rejects the call |
| a0124 | src/director/packs/manifest.js:33 | `statement` | KILLED | [director-077] The validator checks fields before ID and rejects the call |
| a0126 | src/director/packs/manifest.js:34 | `arguments` | KILLED | [director-077] The validator checks fields before ID and rejects the call |
| a0215 | src/director/packs/manifest.js:47 | `arguments` | KILLED | [director-077] The validator checks format before source fields and rejects the call |
| a0217 | src/director/packs/manifest.js:47 | `argument-drop` | KILLED | [director-077] The validator checks format before source fields and rejects the call |
| a0224 | src/director/packs/manifest.js:48 | `arguments` | KILLED | [director-077] The validator names the source object and rejects the call |
| a0250 | src/director/packs/manifest.js:50 | `arguments` | KILLED | [director-076 director-078] The validator checks source path before attribution fields and rejects the call |
| a0252 | src/director/packs/manifest.js:50 | `argument-drop` | KILLED | [director-076 director-078] The validator checks source path before attribution fields and rejects the call |
| a0253 | src/director/packs/manifest.js:51 | `statement` | KILLED | [director-078] The validator names the extra attribution field and rejects the call |
| a0254 | src/director/packs/manifest.js:51 | `statement` | KILLED | [director-078] The validator names the extra attribution field and rejects the call |
| a0255 | src/director/packs/manifest.js:51 | `statement` | KILLED | [director-078] The validator names the extra attribution field and rejects the call |
| a0256 | src/director/packs/manifest.js:50 | `statement` | KILLED | [director-078] The validator names the extra attribution field and rejects the call |
| a0258 | src/director/packs/manifest.js:51 | `arguments` | KILLED | [director-078] The validator names the extra attribution field and rejects the call |
| a0338 | src/director/packs/manifest.js:60 | `arguments` | KILLED | [director-078 director-079] The validator checks URL before byteLength and rejects the call |
| a0340 | src/director/packs/manifest.js:60 | `argument-drop` | KILLED | [director-078 director-079] The validator checks URL before byteLength and rejects the call |
| a0354 | src/director/packs/manifest.js:63 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a0359 | src/director/packs/manifest.js:63 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a0364 | src/director/packs/manifest.js:63 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a0369 | src/director/packs/manifest.js:63 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a0380 | src/director/packs/manifest.js:70 | `arguments` | KILLED | [director-078] The validator names the link protocol and rejects the call |
| a0382 | src/director/packs/manifest.js:70 | `argument-drop` | KILLED | [director-078] The validator names the link protocol and rejects the call |
| a0390 | src/director/packs/manifest.js:74 | `arguments` | KILLED | [director-079] The validator checks byteLength before digest and rejects the call |
| a0402 | src/director/packs/manifest.js:75 | `arguments` | KILLED | [director-079] The validator checks byteLength before digest and rejects the call |
| a0405 | src/director/packs/manifest.js:75 | `arguments` | EQUIVALENT | [evidence/probe-number-flag.txt](evidence/probe-number-flag.txt) |
| a0410 | src/director/packs/manifest.js:75 | `argument-drop` | EQUIVALENT | [evidence/probe-number-flag.txt](evidence/probe-number-flag.txt) |
| a0417 | src/director/packs/manifest.js:75 | `boolean` | KILLED | [director-079] The validator names the numeric text and rejects the call |
| a0431 | src/director/packs/manifest.js:76 | `arguments` | KILLED | [director-079] The validator names the integer field and rejects the call |
| a0433 | src/director/packs/manifest.js:76 | `argument-drop` | KILLED | [director-079] The validator names the integer field and rejects the call |
| a0457 | src/director/packs/manifest.js:79 | `operand-order` | KILLED | [director-079] The validator checks the digest type before it converts text and rejects the call |
| a0484 | src/director/packs/manifest.js:84 | `statement` | KILLED | [director-080] The validator names the extra placement field and rejects the call |
| a0485 | src/director/packs/manifest.js:84 | `statement` | KILLED | [director-080] The validator names the extra placement field and rejects the call |
| a0486 | src/director/packs/manifest.js:84 | `statement` | KILLED | [director-080] The validator names the extra placement field and rejects the call |
| a0487 | src/director/packs/manifest.js:83 | `statement` | KILLED | [director-080] The validator names the extra placement field and rejects the call |
| a0489 | src/director/packs/manifest.js:86 | `arguments` | KILLED | [director-080] The validator names the extra placement field and rejects the call |
| a0536 | src/director/packs/manifest.js:95 | `arguments` | KILLED | [director-081] The validator names an unknown anchor and rejects the call |
| a0538 | src/director/packs/manifest.js:95 | `argument-drop` | KILLED | [director-081] The validator names an unknown anchor and rejects the call |
| a0552 | src/director/packs/manifest.js:98 | `arguments` | KILLED | [director-080] The validator checks the height reference before it checks the bounds and rejects the call |
| a0554 | src/director/packs/manifest.js:98 | `argument-drop` | KILLED | [director-080] The validator checks the height reference before it checks the bounds and rejects the call |
| a0591 | src/director/packs/manifest.js:102 | `arguments` | KILLED | [director-080] The validator checks the bounds length before it checks each coordinate and rejects the call |
| a0593 | src/director/packs/manifest.js:102 | `argument-drop` | KILLED | [director-080] The validator checks the bounds length before it checks each coordinate and rejects the call |
| a0607 | src/director/packs/manifest.js:109 | `arguments` | EQUIVALENT | [evidence/probe-number-flag.txt](evidence/probe-number-flag.txt) |
| a0612 | src/director/packs/manifest.js:108 | `argument-drop` | EQUIVALENT | [evidence/probe-number-flag.txt](evidence/probe-number-flag.txt) |
| a0664 | src/director/packs/manifest.js:112 | `operand-order` | KILLED | [director-080] The validator compares west with east before it compares south with north |
| a0705 | src/director/packs/manifest.js:114 | `arguments` | EQUIVALENT | [evidence/probe-number-flag.txt](evidence/probe-number-flag.txt) |
| a0710 | src/director/packs/manifest.js:114 | `argument-drop` | EQUIVALENT | [evidence/probe-number-flag.txt](evidence/probe-number-flag.txt) |
| a0772 | src/director/packs/manifest.js:126 | `arguments` | KILLED | [director-077 director-082] The validator checks the declaration before it checks for duplicate IDs and rejects the call |
| a0790 | src/director/packs/manifest.js:128 | `arguments` | KILLED | [director-082] The validator rejects the invalid duplicate ID for the scene |
| a0792 | src/director/packs/manifest.js:128 | `argument-drop` | KILLED | [director-082] The validator rejects the invalid duplicate ID for the scene |
| a0812 | src/director/packs/manifest.js:132 | `arguments` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0819 | src/director/packs/manifest.js:133 | `statement` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0820 | src/director/packs/manifest.js:133 | `statement` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0821 | src/director/packs/manifest.js:133 | `statement` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0822 | src/director/packs/manifest.js:132 | `statement` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0824 | src/director/packs/manifest.js:133 | `arguments` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0825 | src/director/packs/manifest.js:133 | `arguments` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0827 | src/director/packs/manifest.js:133 | `argument-drop` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0828 | src/director/packs/manifest.js:133 | `argument-drop` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0829 | src/director/packs/manifest.js:133 | `constant` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0830 | src/director/packs/manifest.js:133 | `constant` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0831 | src/director/packs/manifest.js:133 | `limit` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0832 | src/director/packs/manifest.js:133 | `limit` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a0842 | src/director/packs/manifest.js:134 | `operand-order` | KILLED | [director-082] The validator rejects duplicate references before it searches for known IDs |
| a0863 | src/director/packs/manifest.js:135 | `arguments` | KILLED | [director-082] The validator rejects the invalid duplicate reference for the scene |
| a0865 | src/director/packs/manifest.js:135 | `argument-drop` | KILLED | [director-082] The validator rejects the invalid duplicate reference for the scene |
| a0926 | src/director/packs/geojson.js:18 | `operand-order` | EQUIVALENT | [evidence/probe-position-counter.txt](evidence/probe-position-counter.txt) |
| a0931 | src/director/packs/geojson.js:18 | `operand-order` | KILLED | [director-085] The decoder rejects a null position |
| a0936 | src/director/packs/geojson.js:18 | `operand-order` | KILLED | [director-085] The decoder rejects a null position |
| a0941 | src/director/packs/geojson.js:18 | `operand-order` | KILLED | [director-085] The decoder rejects a null position |
| a0946 | src/director/packs/geojson.js:18 | `operand-order` | KILLED | [director-085] The decoder rejects a null position |
| a0951 | src/director/packs/geojson.js:18 | `operand-order` | KILLED | [director-085] The decoder rejects a null position |
| a1022 | src/director/packs/geojson.js:23 | `operand` | KNOWN LIMIT | geojson-inherited-height |
| a1025 | src/director/packs/geojson.js:23 | `operand-drop` | KNOWN LIMIT | geojson-inherited-height |
| a1026 | src/director/packs/geojson.js:23 | `operand-order` | KNOWN LIMIT | geojson-inherited-height |
| a1038 | src/director/packs/geojson.js:23 | `operand-order` | EQUIVALENT | [evidence/probe-height-order.txt](evidence/probe-height-order.txt) |
| a1084 | src/director/packs/geojson.js:27 | `logical` | KILLED | [director-085] The decoder keeps a negative zero height |
| a1100 | src/director/packs/geojson.js:29 | `default` | EQUIVALENT | [evidence/probe-ring-default.txt](evidence/probe-ring-default.txt) |
| a1113 | src/director/packs/geojson.js:30 | `operand-order` | KILLED | [director-086] The decoder rejects a null line |
| a1149 | src/director/packs/geojson.js:33 | `operand-order` | EQUIVALENT | [evidence/probe-line-end.txt](evidence/probe-line-end.txt) |
| a1190 | src/director/packs/geojson.js:40 | `operand-order` | EQUIVALENT | [evidence/probe-feature-order.txt](evidence/probe-feature-order.txt) |
| a1205 | src/director/packs/geojson.js:40 | `operand-order` | EQUIVALENT | [evidence/probe-feature-order.txt](evidence/probe-feature-order.txt) |
| a1326 | src/director/packs/session.js:8 | `condition` | KILLED | [director-092] The session reads the source signal reason once during another source signal event |
| a1328 | src/director/packs/session.js:8 | `branch` | KILLED | [director-092] The session reads the source signal reason once during another source signal event |
| a1335 | src/director/packs/session.js:9 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1336 | src/director/packs/session.js:9 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1342 | src/director/packs/session.js:10 | `arguments` | KILLED | [director-092] The session reads the source signal reason once during another source signal event |
| a1343 | src/director/packs/session.js:10 | `argument-drop` | KILLED | [director-092] The session reads the source signal reason once during another source signal event |
| a1344 | src/director/packs/session.js:10 | `method` | KILLED | [director-092] The source signal event stops work before the renderer |
| a1392 | src/director/packs/session.js:20 | `statement` | KILLED | [director-089] The session returns true and does not read the reason after the source promise settles |
| a1393 | src/director/packs/session.js:20 | `statement` | KILLED | [director-089] The session returns true and does not read the reason after the source promise settles |
| a1394 | src/director/packs/session.js:20 | `statement` | KILLED | [director-089] The session returns true and does not read the reason after the source promise settles |
| a1395 | src/director/packs/session.js:19 | `statement` | KILLED | [director-089] The session returns true and does not read the reason after the source promise settles |
| a1396 | src/director/packs/session.js:20 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1397 | src/director/packs/session.js:20 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1398 | src/director/packs/session.js:20 | `boolean` | KILLED | [director-089] The session returns true and does not read the reason after the source promise settles |
| a1415 | src/director/packs/session.js:26 | `condition` | EQUIVALENT | [evidence/probe-late-rejection.txt](evidence/probe-late-rejection.txt) |
| a1417 | src/director/packs/session.js:26 | `branch` | EQUIVALENT | [evidence/probe-late-rejection.txt](evidence/probe-late-rejection.txt) |
| a1420 | src/director/packs/session.js:27 | `statement` | KILLED | [director-089] The session reads the reason zero times after a later event for error |
| a1421 | src/director/packs/session.js:27 | `statement` | KILLED | [director-089] The session reads the reason zero times after a later event for error |
| a1422 | src/director/packs/session.js:27 | `statement` | KILLED | [director-089] The session reads the reason zero times after a later event for error |
| a1423 | src/director/packs/session.js:26 | `statement` | KILLED | [director-089] The session reads the reason zero times after a later event for error |
| a1424 | src/director/packs/session.js:27 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1425 | src/director/packs/session.js:27 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1426 | src/director/packs/session.js:27 | `boolean` | KILLED | [director-089] The session reads the reason zero times after a later event for error |
| a1431 | src/director/packs/session.js:28 | `arguments` | EQUIVALENT | [evidence/probe-late-rejection.txt](evidence/probe-late-rejection.txt) |
| a1432 | src/director/packs/session.js:28 | `argument-drop` | EQUIVALENT | [evidence/probe-late-rejection.txt](evidence/probe-late-rejection.txt) |
| a1433 | src/director/packs/session.js:28 | `method` | KILLED | [director-090] The session rejects asset data from a source error |
| a1435 | src/director/packs/session.js:40 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a1436 | src/director/packs/session.js:40 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a1438 | src/director/packs/session.js:37 | `default` | KILLED | [director-088 director-092] The session rejects a numeric source name with no source map |
| a1439 | src/director/packs/session.js:37 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a1441 | src/director/packs/session.js:38 | `default` | KILLED | [director-088 director-092] The session rejects a numeric renderer name with no renderer map |
| a1442 | src/director/packs/session.js:38 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a1472 | src/director/packs/session.js:50 | `statement` | KILLED | [director-089] The session removes resources after source cancellation and timer removal |
| a1473 | src/director/packs/session.js:50 | `statement` | KILLED | [director-089] The session removes resources after source cancellation and timer removal |
| a1474 | src/director/packs/session.js:50 | `statement` | KILLED | [director-089] The session removes resources after source cancellation and timer removal |
| a1475 | src/director/packs/session.js:49 | `statement` | KILLED | [director-089] The session removes resources after source cancellation and timer removal |
| a1487 | src/director/packs/session.js:52 | `arguments` | EQUIVALENT | [evidence/probe-splice-default.txt](evidence/probe-splice-default.txt) |
| a1512 | src/director/packs/session.js:57 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1513 | src/director/packs/session.js:57 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1549 | src/director/packs/session.js:66 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a1550 | src/director/packs/session.js:66 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a1567 | src/director/packs/session.js:68 | `operand-order` | KILLED | [director-088 director-091] The session checks the new list after it disposes old resources |
| a1613 | src/director/packs/session.js:74 | `operand-order` | KILLED | [director-088] The session returns false without a caller signal access after destruction |
| a1618 | src/director/packs/session.js:75 | `condition` | KILLED | [director-088] The session returns true for an empty list without asset work |
| a1620 | src/director/packs/session.js:75 | `statement` | KILLED | [director-088] The session returns true for an empty list without asset work |
| a1623 | src/director/packs/session.js:75 | `predicate` | KILLED | [director-088] The session returns true for an empty list without asset work |
| a1640 | src/director/packs/session.js:81 | `callback` | KILLED | [director-089] The session removes resources after source cancellation and timer removal |
| a1641 | src/director/packs/session.js:81 | `callback` | KILLED | [director-089] The session removes resources after source cancellation and timer removal |
| a1642 | src/director/packs/session.js:81 | `arguments` | KILLED | [director-089] The session sets and removes the caller listener |
| a1643 | src/director/packs/session.js:81 | `arguments` | KILLED | [director-089] The session sets and removes the caller listener |
| a1646 | src/director/packs/session.js:81 | `call-value` | KILLED | [director-089] The session removes resources after source cancellation and timer removal |
| a1648 | src/director/packs/session.js:81 | `string` | KILLED | [director-089] The session sets and removes the caller listener |
| a1649 | src/director/packs/session.js:84 | `condition` | KILLED | [director-091] The session keeps new resources after the old caller listener fires |
| a1651 | src/director/packs/session.js:84 | `branch` | KILLED | [director-091] The session keeps new resources after the old caller listener fires |
| a1668 | src/director/packs/session.js:87 | `arguments` | KILLED | [director-089] The session sets and removes the caller listener |
| a1671 | src/director/packs/session.js:87 | `argument-drop` | KILLED | [director-089] The session sets and removes the caller listener |
| a1675 | src/director/packs/session.js:87 | `object` | KILLED | [director-089] The session sets and removes the caller listener |
| a1676 | src/director/packs/session.js:87 | `object` | KILLED | [director-089] The session sets and removes the caller listener |
| a1677 | src/director/packs/session.js:87 | `boolean` | KILLED | [director-089] The session sets and removes the caller listener |
| a1691 | src/director/packs/session.js:89 | `arguments` | KILLED | [director-092] The session gives its cause to the source signal for the deadline and rejects the call |
| a1692 | src/director/packs/session.js:89 | `argument-drop` | KILLED | [director-092] The session gives its cause to the source signal for the deadline and rejects the call |
| a1717 | src/director/packs/session.js:97 | `operand-order` | EQUIVALENT | [evidence/probe-registry-order.txt](evidence/probe-registry-order.txt) |
| a1722 | src/director/packs/session.js:98 | `exception` | KILLED | [director-092] The session does not read the global error property for absent source and rejects the call |
| a1757 | src/director/packs/session.js:107 | `statement` | KILLED | [director-089] The session checks the signal before it removes the timer and reports the ready state |
| a1758 | src/director/packs/session.js:107 | `statement` | KILLED | [director-089] The session checks the signal before it removes the timer and reports the ready state |
| a1759 | src/director/packs/session.js:107 | `statement` | KILLED | [director-089] The session checks the signal before it removes the timer and reports the ready state |
| a1760 | src/director/packs/session.js:106 | `statement` | KILLED | [director-089] The session checks the signal before it removes the timer and reports the ready state |
| a1772 | src/director/packs/session.js:110 | `operand-order` | KILLED | [director-093] The session does not read declared byteLength again for null bytes and rejects the call |
| a1777 | src/director/packs/session.js:110 | `operand-order` | KILLED | [director-093] The session checks byte type before it reads the length |
| a1782 | src/director/packs/session.js:110 | `operand-order` | KILLED | [director-093] The session checks byte type before it reads the length |
| a1801 | src/director/packs/session.js:113 | `operand-order` | KILLED | [director-093] The session returns true and reads bytes.length three times without declared byteLength |
| a1805 | src/director/packs/session.js:115 | `exception` | KILLED | [director-092] The session does not read the global error property for invalid bytes and rejects the call |
| a1822 | src/director/packs/session.js:118 | `exception` | KILLED | [director-092] The session does not read the global error property for excess total and rejects the call |
| a1873 | src/director/packs/session.js:128 | `exception` | KILLED | [director-092] The session does not read the global error property for wrong digest and rejects the call |
| a1908 | src/director/packs/session.js:135 | `operand-order` | EQUIVALENT | [evidence/probe-null-handle.txt](evidence/probe-null-handle.txt) |
| a1914 | src/director/packs/session.js:136 | `exception` | KILLED | [director-092] The session does not read the global error property for invalid handle and rejects the call |
| a1924 | src/director/packs/session.js:137 | `operand-order` | KILLED | [director-090] The cleared session returns false and does not read the source signal state |
| a1944 | src/director/packs/session.js:144 | `statement` | KILLED | [director-089] The session checks the signal before it removes the timer and reports the ready state |
| a1945 | src/director/packs/session.js:144 | `statement` | KILLED | [director-089] The session checks the signal before it removes the timer and reports the ready state |
| a1946 | src/director/packs/session.js:144 | `statement` | KILLED | [director-089] The session checks the signal before it removes the timer and reports the ready state |
| a1947 | src/director/packs/session.js:143 | `statement` | KILLED | [director-089] The session checks the signal before it removes the timer and reports the ready state |
| a1972 | src/director/packs/session.js:149 | `operand-order` | KILLED | [director-090] The load call returns false when the caller signal destroys the session after a source error |
| a1977 | src/director/packs/session.js:149 | `operand-order` | KILLED | [director-090] The session returns false and does not read the caller signal state again after cancellation |
| a2012 | src/director/packs/source.js:10 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a2017 | src/director/packs/source.js:10 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a2022 | src/director/packs/source.js:10 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a2027 | src/director/packs/source.js:10 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a2032 | src/director/packs/source.js:10 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a2210 | src/director/packs/source.js:57 | `value` | KILLED | [director-096] The source joins chunks of different lengths |
| a2254 | src/director/sharing/bundle.js:7 | `object` | KILLED | [director-102] The bundle helpers reject a caller change to the share limits |
| a2385 | src/director/sharing/bundle.js:32 | `relational` | KILLED | [director-101] The export reads no chunk past the asset end |
| a2439 | src/director/sharing/bundle.js:38 | `operand-order` | KILLED | [director-099] The import checks the base64 type before it converts text and rejects the call |
| a2444 | src/director/sharing/bundle.js:38 | `operand-order` | KILLED | [director-099] The import rejects a null base64 value |
| a2449 | src/director/sharing/bundle.js:38 | `operand-order` | KILLED | [director-099] The import rejects a null base64 value |
| a2454 | src/director/sharing/bundle.js:38 | `operand-order` | KILLED | [director-099] The import rejects a null base64 value |
| a2483 | src/director/sharing/bundle.js:40 | `number` | EQUIVALENT | [evidence/probe-aligned-base64-limit.txt](evidence/probe-aligned-base64-limit.txt) |
| a2504 | src/director/sharing/bundle.js:42 | `regex` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a2512 | src/director/sharing/bundle.js:43 | `operand-order` | EQUIVALENT | [evidence/probe-base64-tail.txt](evidence/probe-base64-tail.txt) |
| a2525 | src/director/sharing/bundle.js:43 | `regex` | KILLED | [director-099] The import rejects an equals sign at the start |
| a2527 | src/director/sharing/bundle.js:43 | `regex` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a2528 | src/director/sharing/bundle.js:43 | `regex` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a2529 | src/director/sharing/bundle.js:43 | `regex` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a2552 | src/director/sharing/bundle.js:46 | `arguments` | EQUIVALENT | [evidence/probe-character-index.txt](evidence/probe-character-index.txt) |
| a2553 | src/director/sharing/bundle.js:46 | `argument-drop` | EQUIVALENT | [evidence/probe-character-index.txt](evidence/probe-character-index.txt) |
| a2570 | src/director/sharing/bundle.js:50 | `operand-order` | KILLED | [director-102] The export checks the asset size before the total size and rejects the call |
| a2624 | src/director/sharing/bundle.js:62 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a2625 | src/director/sharing/bundle.js:62 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a2647 | src/director/sharing/bundle.js:65 | `operand-order` | KILLED | [director-098] The import rejects null text |
| a2680 | src/director/sharing/bundle.js:74 | `statement` | KILLED | [director-098] The import rejects invalid JSON of 5242881 characters |
| a2681 | src/director/sharing/bundle.js:74 | `statement` | KILLED | [director-098] The import rejects invalid JSON of 5242881 characters |
| a2683 | src/director/sharing/bundle.js:74 | `statement` | KILLED | [director-098] The import rejects invalid JSON of 5242881 characters |
| a2684 | src/director/sharing/bundle.js:73 | `statement` | KILLED | [director-098] The import rejects invalid JSON of 5242881 characters |
| a2685 | src/director/sharing/bundle.js:74 | `arguments` | KILLED | [director-098] The import names the invalid JSON path and rejects the call |
| a2687 | src/director/sharing/bundle.js:74 | `argument-drop` | KILLED | [director-098] The import names the invalid JSON path and rejects the call |
| a2745 | src/director/sharing/bundle.js:79 | `arguments` | KILLED | [director-099] The import names the invalid version and rejects the call |
| a2747 | src/director/sharing/bundle.js:79 | `argument-drop` | KILLED | [director-099] The import names the invalid version and rejects the call |
| a2787 | src/director/sharing/bundle.js:86 | `arguments` | KILLED | [director-099] The import names the invalid extra field and rejects the call |
| a2792 | src/director/sharing/bundle.js:86 | `string` | KILLED | [director-099] The import names the invalid extra field and rejects the call |
| a2805 | src/director/sharing/bundle.js:87 | `statement` | KILLED | [director-099] The import names the invalid path and rejects the call |
| a2806 | src/director/sharing/bundle.js:87 | `statement` | KILLED | [director-099] The import names the invalid path and rejects the call |
| a2807 | src/director/sharing/bundle.js:87 | `statement` | KILLED | [director-099] The import names the invalid path and rejects the call |
| a2808 | src/director/sharing/bundle.js:86 | `statement` | KILLED | [director-099] The import names the invalid path and rejects the call |
| a2827 | src/director/sharing/bundle.js:89 | `arguments` | KILLED | [director-099] The import names the invalid duplicate path and rejects the call |
| a2829 | src/director/sharing/bundle.js:89 | `argument-drop` | KILLED | [director-099] The import names the invalid duplicate path and rejects the call |
| a2869 | src/director/sharing/bundle.js:95 | `arguments` | KILLED | [director-100] The import names the invalid digest and rejects the call |
| a2871 | src/director/sharing/bundle.js:95 | `argument-drop` | KILLED | [director-100] The import names the invalid digest and rejects the call |
| a2906 | src/director/sharing/bundle.js:101 | `arguments` | KILLED | [director-100] The import names the invalid source and rejects the call |
| a2908 | src/director/sharing/bundle.js:101 | `argument-drop` | KILLED | [director-100] The import names the invalid source and rejects the call |
| a2945 | src/director/sharing/bundle.js:109 | `arguments` | KILLED | [director-100] The import names the invalid reference and rejects the call |
| a2947 | src/director/sharing/bundle.js:109 | `argument-drop` | KILLED | [director-100] The import names the invalid reference and rejects the call |
| a2958 | src/director/sharing/bundle.js:111 | `arguments` | KILLED | [director-100] The import names the invalid unused asset and rejects the call |
| a2960 | src/director/sharing/bundle.js:111 | `argument-drop` | KILLED | [director-100] The import names the invalid unused asset and rejects the call |
| a3048 | src/director/sharing/bundle.js:137 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a3049 | src/director/sharing/bundle.js:137 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a3054 | src/director/sharing/bundle.js:139 | `method` | EQUIVALENT | [evidence/probe-repeat-parser.txt](evidence/probe-repeat-parser.txt) |
| a3101 | src/director/sharing/bundle.js:149 | `arguments` | KILLED | [director-102] The export names excess asset entries and rejects the call |
| a3103 | src/director/sharing/bundle.js:149 | `argument-drop` | KILLED | [director-102] The export names excess asset entries and rejects the call |
| a3130 | src/director/sharing/bundle.js:155 | `arguments` | KILLED | [director-102] The export names the invalid absent asset and rejects the call |
| a3132 | src/director/sharing/bundle.js:155 | `argument-drop` | KILLED | [director-102] The export names the invalid absent asset and rejects the call |
| a3144 | src/director/sharing/bundle.js:157 | `operand` | KNOWN LIMIT | bundle-nonnumeric-length |
| a3150 | src/director/sharing/bundle.js:157 | `number` | KILLED | [director-102] The export keeps its total after an asset without a byte length |
| a3152 | src/director/sharing/bundle.js:157 | `number` | KILLED | [director-102] The export keeps its total after an asset without a byte length |
| a3186 | src/director/sharing/bundle.js:163 | `operand-order` | KILLED | [director-102] The export checks declared byteLength before declared digest and rejects the call |
| a3192 | src/director/sharing/bundle.js:163 | `operand-order` | KILLED | [director-102] The export does not compare an absent declared byteLength and returns bundle text |
| a3201 | src/director/sharing/bundle.js:164 | `operand-order` | KILLED | [director-102] The export reads an absent declared digest once before it writes the digest |
| a3208 | src/director/sharing/bundle.js:166 | `arguments` | KILLED | [director-102] The export names the invalid declared byteLength and rejects the call |
| a3210 | src/director/sharing/bundle.js:166 | `argument-drop` | KILLED | [director-102] The export names the invalid declared byteLength and rejects the call |
| a3212 | src/director/sharing/bundle.js:167 | `arguments` | KILLED | [director-101] The export calls the filename slice with a start of zero |
| a3234 | src/director/sharing/bundle.js:167 | `number` | KILLED | [director-101] The export limits each source filename to 160 characters and returns bundle text |
| a3235 | src/director/sharing/bundle.js:167 | `number` | KILLED | [director-101] The export limits each source filename to 160 characters and returns bundle text |
| a3236 | src/director/sharing/bundle.js:167 | `number` | KILLED | [director-101] The export limits each source filename to 160 characters and returns bundle text |
| a3237 | src/director/sharing/bundle.js:167 | `number` | KILLED | [director-101] The export limits each source filename to 160 characters and returns bundle text |
| a3295 | src/director/sharing/bundle.js:178 | `operand-order` | EQUIVALENT | [evidence/probe-digest-order.txt](evidence/probe-digest-order.txt) |
| a3301 | src/director/sharing/bundle.js:178 | `operand-order` | EQUIVALENT | [evidence/probe-digest-order.txt](evidence/probe-digest-order.txt) |
| a3310 | src/director/sharing/bundle.js:179 | `operand-order` | EQUIVALENT | [evidence/probe-digest-order.txt](evidence/probe-digest-order.txt) |
| a3320 | src/director/sharing/bundle.js:181 | `arguments` | KILLED | [director-103] The export names different shared integrity and rejects the call |
| a3322 | src/director/sharing/bundle.js:181 | `argument-drop` | KILLED | [director-103] The export names different shared integrity and rejects the call |
| a3403 | src/director/sharing/bundle.js:193 | `arguments` | KILLED | [director-102] The export rejects encoded bundle text above 52428800 bytes |
| a3405 | src/director/sharing/bundle.js:193 | `argument-drop` | KILLED | [director-102] The export rejects encoded bundle text above 52428800 bytes |
| a3424 | src/director/sharing/bundle.js:201 | `default` | EQUIVALENT | [evidence/probe-empty-map.txt](evidence/probe-empty-map.txt) |
| a3477 | src/director/sharing/bundle.js:212 | `default` | KILLED | [director-105] The store accepts its default byte limit for the byte store and returns byte copies |
| a3484 | src/director/sharing/bundle.js:214 | `statement` | KILLED | [director-105] The store rejects an invalid path that it holds for the byte store |
| a3485 | src/director/sharing/bundle.js:214 | `statement` | KILLED | [director-105] The store rejects an invalid path that it holds for the byte store |
| a3486 | src/director/sharing/bundle.js:214 | `statement` | KILLED | [director-105] The store rejects an invalid path that it holds for the byte store |
| a3487 | src/director/sharing/bundle.js:213 | `statement` | KILLED | [director-105] The store rejects an invalid path that it holds for the byte store |
| a3635 | src/director/sharing/preview.js:6 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a3636 | src/director/sharing/preview.js:6 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a3637 | src/director/sharing/preview.js:6 | `default` | EQUIVALENT | [evidence/probe-empty-set.txt](evidence/probe-empty-set.txt) |
| a3638 | src/director/sharing/preview.js:6 | `default` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a3640 | src/director/sharing/preview.js:6 | `default` | EQUIVALENT | [evidence/probe-empty-set.txt](evidence/probe-empty-set.txt) |
| a3641 | src/director/sharing/preview.js:6 | `default` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a3788 | src/director/sharing/preview.js:33 | `operand` | EQUIVALENT | [evidence/probe-empty-keys.txt](evidence/probe-empty-keys.txt) |
| a3818 | src/director/sharing/preview.js:39 | `operand-order` | KILLED | [director-110] The preview reports external content from applied shot packs before it reads source pack IDs |

## Counts by class

| class | killed | equivalent | known limit | open |
| --- | ---: | ---: | ---: | ---: |
| `limit` | 2 | 0 | 0 | 0 |
| `relational` | 1 | 0 | 0 | 0 |
| `condition` | 3 | 1 | 0 | 0 |
| `branch` | 2 | 1 | 0 | 0 |
| `boolean` | 4 | 0 | 0 | 0 |
| `logical` | 1 | 0 | 0 | 0 |
| `operand` | 0 | 1 | 2 | 0 |
| `operand-drop` | 0 | 0 | 1 | 0 |
| `callback` | 2 | 0 | 0 | 0 |
| `call-value` | 1 | 0 | 0 | 0 |
| `method` | 2 | 1 | 0 | 0 |
| `object` | 4 | 0 | 0 | 0 |
| `string` | 2 | 0 | 0 | 0 |
| `number` | 6 | 1 | 0 | 0 |
| `constant` | 2 | 0 | 0 | 0 |
| `regex` | 9 | 0 | 0 | 0 |
| `value` | 1 | 8 | 0 | 0 |
| `exception` | 5 | 0 | 0 | 0 |
| `default` | 5 | 16 | 0 | 0 |
| `statement` | 49 | 0 | 0 | 0 |
| `arguments` | 39 | 6 | 0 | 0 |
| `argument-drop` | 27 | 5 | 0 | 0 |
| `operand-order` | 28 | 20 | 1 | 0 |
| `predicate` | 1 | 0 | 0 | 0 |

## Pass 5 extension results

Pass 5 kills the four old JSON mutations.
The old table now has 196 killed, 60 equivalent and four Known limit results.
The extension run checks 711 new mutations.
It gives 644 killed and 67 survived results.
Each survived result is equivalent within its stated bound.
The [extension probe](evidence/probe-extension.txt) gives the script, output and bounds.

| id | file:line | class | verdict | test title or probe file or limit name |
| --- | --- | --- | --- | --- |
| a9000 | src/director/packs/manifest.js:19 | `default-shape` | KILLED | [director-076] The validator rejects the path type before it reads a segment |
| a9001 | src/director/packs/manifest.js:19 | `default-shape` | KILLED | [director-076] The validator rejects the path type before it reads a segment |
| a9002 | src/director/packs/manifest.js:19 | `default-shape` | KILLED | [director-076] The validator rejects the path type before it reads a segment |
| a9003 | src/director/packs/manifest.js:19 | `default-shape` | KILLED | [director-076] The validator rejects the path type before it reads a segment |
| a9004 | src/director/packs/manifest.js:20 | `statement-order` | KILLED | [director-076] The validator rejects the path type before it reads a segment |
| a9005 | src/director/packs/manifest.js:24 | `regex-member` | KILLED | [director-076] The validator returns without an error for A in both character positions for the asset path |
| a9006 | src/director/packs/manifest.js:24 | `regex-member` | KILLED | [director-076] The validator returns without an error for A in both character positions for the asset path |
| a9007 | src/director/packs/manifest.js:24 | `regex-member` | KILLED | [director-076] The validator returns without an error for 0 in both character positions for the asset path |
| a9008 | src/director/packs/manifest.js:24 | `regex-member` | KILLED | [director-076] The validator returns without an error for _x/_y for the asset path |
| a9009 | src/director/packs/manifest.js:24 | `regex-member` | KILLED | [director-076] The validator returns without an error for -x/-y for the asset path |
| a9010 | src/director/packs/manifest.js:24 | `regex-member` | KILLED | [director-076] The validator returns without an error for a in both character positions for the asset path |
| a9011 | src/director/packs/manifest.js:24 | `regex-member` | KILLED | [director-076] The validator returns without an error for A in both character positions for the asset path |
| a9012 | src/director/packs/manifest.js:24 | `regex-member` | KILLED | [director-076] The validator returns without an error for 0 in both character positions for the asset path |
| a9013 | src/director/packs/manifest.js:24 | `regex-member` | KILLED | [director-076] The validator returns without an error for safe names for the asset path |
| a9014 | src/director/packs/manifest.js:24 | `regex-member` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9015 | src/director/packs/manifest.js:24 | `regex-member` | KILLED | [director-076] The validator returns without an error for safe names for the asset path |
| a9016 | src/director/packs/manifest.js:34 | `statement-order` | KILLED | [director-077] The validator checks fields before ID and rejects the call |
| a9017 | src/director/packs/manifest.js:44 | `statement-order` | KILLED | [director-077] The validator checks ID before version and rejects the call |
| a9018 | src/director/packs/manifest.js:45 | `statement-order` | KILLED | [director-077] The validator checks version before format and rejects the call |
| a9019 | src/director/packs/manifest.js:46 | `statement-order` | KILLED | [director-077] The validator checks format before source fields and rejects the call |
| a9020 | src/director/packs/manifest.js:48 | `statement-order` | KILLED | [director-077] The validator names the source object and rejects the call |
| a9021 | src/director/packs/manifest.js:49 | `statement-order` | KILLED | [director-076 director-077] The validator checks source name before path and rejects the call |
| a9022 | src/director/packs/manifest.js:50 | `statement-order` | KILLED | [director-076 director-078] The validator checks source path before attribution fields and rejects the call |
| a9023 | src/director/packs/manifest.js:51 | `statement-order` | KILLED | [director-078] The validator names the attribution object and rejects the call |
| a9024 | src/director/packs/manifest.js:52 | `statement-order` | KILLED | [director-078] The validator checks text before license and rejects the call |
| a9025 | src/director/packs/manifest.js:53 | `statement-order` | KILLED | [director-078] The validator checks license before URL and rejects the call |
| a9026 | src/director/packs/manifest.js:54 | `statement-order` | KILLED | [director-078 director-079] The validator checks URL before byteLength and rejects the call |
| a9027 | src/director/packs/manifest.js:74 | `statement-order` | KILLED | [director-079] The validator checks byteLength before digest and rejects the call |
| a9028 | src/director/packs/manifest.js:78 | `statement-order` | KILLED | [director-079] The validator checks the digest before it reads the placement |
| a9029 | src/director/packs/manifest.js:82 | `statement-order` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9030 | src/director/packs/manifest.js:84 | `statement-order` | KILLED | [director-080] The validator names the placement object and rejects the call |
| a9031 | src/director/packs/manifest.js:55 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9031 |
| a9032 | src/director/packs/manifest.js:56 | `statement-order` | KILLED | [director-078] The validator names the link protocol and rejects the call |
| a9033 | src/director/packs/manifest.js:57 | `statement-order` | KILLED | [director-078 director-079] The validator checks URL before byteLength and rejects the call |
| a9034 | src/director/packs/manifest.js:58 | `new-argument` | KILLED | [director-078] The validator names the link protocol and rejects the call |
| a9035 | src/director/packs/manifest.js:58 | `new-argument` | KILLED | [director-078] The validator names the link protocol and rejects the call |
| a9036 | src/director/packs/manifest.js:75 | `statement-order` | KILLED | [director-079] The validator names the numeric text and rejects the call |
| a9037 | src/director/packs/manifest.js:79 | `regex-member` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9038 | src/director/packs/manifest.js:79 | `regex-member` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9039 | src/director/packs/manifest.js:97 | `statement-order` | KILLED | [director-080] The validator checks the height reference before it checks the bounds and rejects the call |
| a9040 | src/director/packs/manifest.js:100 | `statement-order` | KILLED | [director-080] The validator checks the bounds array before it reads the length |
| a9041 | src/director/packs/manifest.js:101 | `statement-order` | KILLED | [director-080] The validator checks the bounds length before it checks each coordinate and rejects the call |
| a9042 | src/director/packs/manifest.js:103 | `statement-order` | KILLED | [director-080] The validator checks bounds values before edge order and rejects the call |
| a9043 | src/director/packs/manifest.js:112 | `statement-order` | KILLED | [director-080] The validator checks edge order before height and rejects the call |
| a9044 | src/director/packs/manifest.js:121 | `statement-order` | KILLED | [director-082] The validator checks the list before it reads the anchors |
| a9045 | src/director/packs/manifest.js:122 | `statement-order` | KILLED | [director-082] The validator checks the list before it reads the anchors |
| a9046 | src/director/packs/manifest.js:123 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9046 |
| a9047 | src/director/packs/manifest.js:124 | `statement-order` | KILLED | [director-077 director-082] The validator checks the declaration before it checks for duplicate IDs and rejects the call |
| a9048 | src/director/packs/manifest.js:125 | `statement-order` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a9049 | src/director/packs/manifest.js:123 | `new-argument` | KILLED | [director-082] The validator uses supplied anchors for the scene and returns without an error |
| a9050 | src/director/packs/manifest.js:126 | `statement-order` | KILLED | [director-077 director-082] The validator checks the declaration before it checks for duplicate IDs and rejects the call |
| a9051 | src/director/packs/manifest.js:127 | `statement-order` | KILLED | [director-077 director-082] The validator checks the declaration before it checks for duplicate IDs and rejects the call |
| a9052 | src/director/packs/manifest.js:133 | `statement-order` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a9053 | src/director/packs/manifest.js:134 | `new-argument` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a9054 | src/director/packs/manifest.js:134 | `new-argument` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a9055 | src/director/packs/geojson.js:5 | `statement-order` | KILLED | [director-085] The decoder rejects a null position |
| a9056 | src/director/packs/geojson.js:8 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9056 |
| a9057 | src/director/packs/geojson.js:14 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9057 |
| a9058 | src/director/packs/geojson.js:15 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9058 |
| a9059 | src/director/packs/geojson.js:16 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9059 |
| a9060 | src/director/packs/geojson.js:29 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9060 |
| a9061 | src/director/packs/geojson.js:6 | `new-argument` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9061 |
| a9062 | src/director/packs/geojson.js:6 | `new-argument` | KILLED | [director-085] The decoder rejects a null position |
| a9063 | src/director/packs/geojson.js:6 | `new-argument` | KILLED | [director-083] The decoder rejects invalid UTF8 bytes |
| a9064 | src/director/packs/geojson.js:6 | `new-argument` | KILLED | [director-083] The decoder rejects invalid UTF8 bytes |
| a9065 | src/director/packs/geojson.js:17 | `statement-order` | KILLED | [director-085] The decoder rejects a null position |
| a9066 | src/director/packs/geojson.js:29 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9066 |
| a9067 | src/director/packs/geojson.js:29 | `default-shape` | KILLED | [director-086] The decoder accepts an open line and returns coordinates |
| a9068 | src/director/packs/geojson.js:29 | `default-shape` | KILLED | [director-086] The decoder accepts an open line and returns coordinates |
| a9069 | src/director/packs/geojson.js:30 | `statement-order` | KILLED | [director-086] The decoder rejects a null line |
| a9070 | src/director/packs/geojson.js:32 | `statement-order` | KILLED | [director-086] The decoder rejects unclosed field 0 for the ring |
| a9071 | src/director/packs/geojson.js:33 | `statement-order` | KILLED | [director-086] The decoder rejects unclosed field 0 for the ring |
| a9072 | src/director/packs/geojson.js:38 | `statement-order` | KILLED | [director-085] The decoder rejects a null position |
| a9073 | src/director/packs/geojson.js:39 | `statement-order` | KILLED | [director-085] The decoder rejects a null position |
| a9074 | src/director/packs/geojson.js:47 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9074 |
| a9075 | src/director/packs/geojson.js:48 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9075 |
| a9076 | src/director/packs/geojson.js:49 | `statement-order` | KILLED | [director-085] The decoder keeps a negative zero height |
| a9077 | src/director/packs/geojson.js:50 | `statement-order` | KILLED | [director-085] The decoder rejects a null position |
| a9078 | src/director/packs/session.js:4 | `default-shape` | KILLED | [director-092] The session reads the source signal reason once during another source signal event |
| a9079 | src/director/packs/session.js:4 | `default-shape` | KILLED | [director-092] The session reads the source signal reason once during another source signal event |
| a9080 | src/director/packs/session.js:4 | `default-shape` | KILLED | [director-092] The session reads the source signal reason once during another source signal event |
| a9081 | src/director/packs/session.js:4 | `default-shape` | KILLED | [director-092] The session reads the source signal reason once during another source signal event |
| a9082 | src/director/packs/session.js:5 | `new-argument` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9083 | src/director/packs/session.js:5 | `new-argument` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9084 | src/director/packs/session.js:6 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9084 |
| a9085 | src/director/packs/session.js:7 | `statement-order` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9086 | src/director/packs/session.js:13 | `statement-order` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9087 | src/director/packs/session.js:14 | `statement-order` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9088 | src/director/packs/session.js:9 | `statement-order` | KILLED | [director-092] The session reads the source signal reason once during another source signal event |
| a9089 | src/director/packs/session.js:17 | `statement-order` | KILLED | [director-092] The session rejects the load call for a source signal event during listener removal after success |
| a9090 | src/director/packs/session.js:20 | `statement-order` | KILLED | [director-089] The session returns true and does not read the reason after the source promise settles |
| a9091 | src/director/packs/session.js:25 | `statement-order` | KILLED | [director-092] The session rejects the load call for a source signal event during listener removal after error |
| a9092 | src/director/packs/session.js:27 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9092 |
| a9093 | src/director/packs/session.js:40 | `default-shape` | KILLED | [director-088] The session reports idle state after creation |
| a9094 | src/director/packs/session.js:40 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9094 |
| a9095 | src/director/packs/session.js:40 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9095 |
| a9096 | src/director/packs/session.js:37 | `destructure-remove` | KILLED | [director-088] The session reads source entries before renderer entries |
| a9097 | src/director/packs/session.js:38 | `destructure-remove` | KILLED | [director-088] The session reads source entries before renderer entries |
| a9098 | src/director/packs/session.js:38 | `destructure-remove` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9099 | src/director/packs/session.js:37 | `default-shape` | KILLED | [director-088] The session reports idle state after creation |
| a9100 | src/director/packs/session.js:37 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9100 |
| a9101 | src/director/packs/session.js:37 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9101 |
| a9102 | src/director/packs/session.js:38 | `default-shape` | KILLED | [director-088] The session reports idle state after creation |
| a9103 | src/director/packs/session.js:38 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9103 |
| a9104 | src/director/packs/session.js:38 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9104 |
| a9105 | src/director/packs/session.js:39 | `default-shape` | KILLED | [director-093] The session returns true for exact bytes and digest |
| a9106 | src/director/packs/session.js:39 | `default-shape` | KILLED | [director-093] The session returns true for exact bytes and digest |
| a9107 | src/director/packs/session.js:39 | `default-shape` | KILLED | [director-093] The session returns true for exact bytes and digest |
| a9108 | src/director/packs/session.js:39 | `default-shape` | KILLED | [director-093] The session returns true for exact bytes and digest |
| a9109 | src/director/packs/session.js:41 | `statement-order` | KILLED | [director-088] The session reads source entries before renderer entries |
| a9110 | src/director/packs/session.js:42 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9110 |
| a9111 | src/director/packs/session.js:43 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9111 |
| a9112 | src/director/packs/session.js:45 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9112 |
| a9113 | src/director/packs/session.js:41 | `new-argument` | KILLED | [director-088] The session reads source entries before renderer entries |
| a9114 | src/director/packs/session.js:42 | `new-argument` | KILLED | [director-088] The session reads source entries before renderer entries |
| a9115 | src/director/packs/session.js:46 | `statement-order` | KILLED | [director-088] The session reads source entries before renderer entries |
| a9116 | src/director/packs/session.js:47 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9116 |
| a9117 | src/director/packs/session.js:48 | `statement-order` | KILLED | [director-089] The session removes resources after source cancellation and timer removal |
| a9118 | src/director/packs/session.js:49 | `statement-order` | KILLED | [director-089] The session removes resources after source cancellation and timer removal |
| a9119 | src/director/packs/session.js:50 | `statement-order` | KILLED | [director-089] The session removes resources after source cancellation and timer removal |
| a9120 | src/director/packs/session.js:51 | `statement-order` | KILLED | [director-089] The session removes resources after source cancellation and timer removal |
| a9121 | src/director/packs/session.js:57 | `statement-order` | KILLED | [director-088] The session returns false for a load call during source cancellation for the destroyed session |
| a9122 | src/director/packs/session.js:66 | `default-shape` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9123 | src/director/packs/session.js:66 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9123 |
| a9124 | src/director/packs/session.js:66 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9124 |
| a9125 | src/director/packs/session.js:66 | `destructure-remove` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9126 | src/director/packs/session.js:66 | `destructure-remove` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9127 | src/director/packs/session.js:66 | `default-shape` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9128 | src/director/packs/session.js:66 | `default-shape` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9129 | src/director/packs/session.js:66 | `default-shape` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9130 | src/director/packs/session.js:67 | `statement-order` | KILLED | [director-088 director-091] The session checks the new list after it disposes old resources |
| a9131 | src/director/packs/session.js:68 | `statement-order` | KILLED | [director-088] The session checks the list before it reads the anchors |
| a9132 | src/director/packs/session.js:70 | `statement-order` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9133 | src/director/packs/session.js:71 | `statement-order` | KILLED | [director-088] The session checks declarations before it reads the caller signal |
| a9134 | src/director/packs/session.js:74 | `statement-order` | KILLED | [director-088] The session returns false for a load call during source cancellation for the destroyed session |
| a9135 | src/director/packs/session.js:75 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9135 |
| a9136 | src/director/packs/session.js:76 | `statement-order` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9137 | src/director/packs/session.js:77 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9137 |
| a9138 | src/director/packs/session.js:83 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9138 |
| a9139 | src/director/packs/session.js:86 | `statement-order` | KILLED | [director-090] The session returns false for a caller event during listener registration |
| a9140 | src/director/packs/session.js:87 | `statement-order` | KILLED | [director-089] The session attaches the caller listener before the deadline timer starts |
| a9141 | src/director/packs/session.js:88 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9141 |
| a9142 | src/director/packs/session.js:92 | `statement-order` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9143 | src/director/packs/session.js:70 | `new-argument` | KILLED | [director-089] The session calls the media renderer once and returns true |
| a9144 | src/director/packs/session.js:94 | `statement-order` | KILLED | [director-089] The session checks the signal before it removes the timer and reports the ready state |
| a9145 | src/director/packs/session.js:144 | `statement-order` | KILLED | [director-089] The session checks the signal before it removes the timer and reports the ready state |
| a9146 | src/director/packs/session.js:145 | `statement-order` | KILLED | [director-089] The session checks the signal before it removes the timer and reports the ready state |
| a9147 | src/director/packs/session.js:146 | `statement-order` | KILLED | [director-089] The session disposes handles in reverse order |
| a9148 | src/director/packs/session.js:95 | `statement-order` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9149 | src/director/packs/session.js:97 | `statement-order` | KILLED | [director-092] The session rejects an absent renderer without a source call |
| a9150 | src/director/packs/session.js:99 | `statement-order` | KILLED | [director-089] The session checks the signal before it removes the timer and reports the ready state |
| a9151 | src/director/packs/session.js:107 | `statement-order` | KILLED | [director-090 director-093] The session rejects the signal error before it reads bytes |
| a9152 | src/director/packs/session.js:108 | `statement-order` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9153 | src/director/packs/session.js:109 | `statement-order` | KILLED | [director-093] The session checks byte type before it reads the length |
| a9154 | src/director/packs/session.js:116 | `statement-order` | KILLED | [director-093] The session checks total bytes before it reads the digest |
| a9155 | src/director/packs/session.js:117 | `statement-order` | KILLED | [director-093] The session checks total bytes before it reads the digest |
| a9156 | src/director/packs/session.js:119 | `statement-order` | KILLED | [director-093] The data pack session checks bytes and integrity before the renderer call and rejects inherited registered source names |
| a9157 | src/director/packs/session.js:130 | `statement-order` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9158 | src/director/packs/session.js:135 | `statement-order` | KILLED | [director-090] The session guard rejects a detached resource |
| a9159 | src/director/packs/session.js:137 | `statement-order` | KILLED | [director-090] The session disposes the handle before it adds the handle to its list |
| a9160 | src/director/packs/session.js:99 | `await-remove` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9161 | src/director/packs/session.js:108 | `destructure-remove` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9162 | src/director/packs/session.js:120 | `statement-order` | KILLED | [director-093] The session returns true for exact bytes and digest |
| a9163 | src/director/packs/session.js:124 | `statement-order` | KILLED | [director-093] The session returns true for exact bytes and digest |
| a9164 | src/director/packs/session.js:120 | `await-remove` | KILLED | [director-093] The session returns true for exact bytes and digest |
| a9165 | src/director/packs/session.js:124 | `new-argument` | KILLED | [director-093] The session returns true for exact bytes and digest |
| a9166 | src/director/packs/session.js:124 | `new-argument` | KILLED | [director-093] The session returns true for exact bytes and digest |
| a9167 | src/director/packs/session.js:130 | `await-remove` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9168 | src/director/packs/session.js:138 | `statement-order` | KILLED | [director-090] The session disposes the handle before it adds the handle to its list |
| a9169 | src/director/packs/session.js:139 | `statement-order` | KILLED | [director-090] The session disposes the handle before it adds the handle to its list |
| a9170 | src/director/packs/session.js:149 | `statement-order` | KILLED | [director-092] The session rejects the load call for a source signal event during listener removal after success |
| a9171 | src/director/packs/session.js:150 | `statement-order` | KILLED | [director-090] The session checks destroyed state after it reads the signal |
| a9172 | src/director/packs/session.js:151 | `statement-order` | KILLED | [director-092] The session reads the source signal reason once during another source signal event |
| a9173 | src/director/packs/source.js:5 | `destructure-remove` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9174 | src/director/packs/source.js:5 | `destructure-remove` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9175 | src/director/packs/source.js:6 | `default-shape` | KILLED | [director-095] The source uses the default fetch function and returns bytes |
| a9176 | src/director/packs/source.js:6 | `default-shape` | KILLED | [director-095] The source uses the default fetch function and returns bytes |
| a9177 | src/director/packs/source.js:6 | `default-shape` | KILLED | [director-095] The source uses the default fetch function and returns bytes |
| a9178 | src/director/packs/source.js:6 | `default-shape` | KILLED | [director-095] The source uses the default fetch function and returns bytes |
| a9179 | src/director/packs/source.js:8 | `statement-order` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9180 | src/director/packs/source.js:9 | `statement-order` | KILLED | [director-094] The factory rejects protocol |
| a9181 | src/director/packs/source.js:8 | `new-argument` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9182 | src/director/packs/source.js:8 | `new-argument` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9183 | src/director/packs/source.js:20 | `destructure-remove` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9184 | src/director/packs/source.js:20 | `destructure-remove` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9185 | src/director/packs/source.js:20 | `destructure-remove` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9186 | src/director/packs/source.js:20 | `default-shape` | KILLED | [director-096] The source joins chunks of different lengths |
| a9187 | src/director/packs/source.js:20 | `default-shape` | KILLED | [director-096] The source rejects 8388609 bytes without a caller limit |
| a9188 | src/director/packs/source.js:20 | `default-shape` | KILLED | [director-096] The source joins chunks of different lengths |
| a9189 | src/director/packs/source.js:20 | `default-shape` | KILLED | [director-096] The source joins chunks of different lengths |
| a9190 | src/director/packs/source.js:21 | `statement-order` | KILLED | [director-095] The source checks the path before it checks the caller signal and rejects the call |
| a9191 | src/director/packs/source.js:22 | `statement-order` | KILLED | [director-097] The source rejects early cancellation |
| a9192 | src/director/packs/source.js:23 | `statement-order` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9193 | src/director/packs/source.js:30 | `statement-order` | KILLED | [director-097] The source waits for body cancellation before it rejects the asset request |
| a9194 | src/director/packs/source.js:34 | `statement-order` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9195 | src/director/packs/source.js:35 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9195 |
| a9196 | src/director/packs/source.js:36 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9196 |
| a9197 | src/director/packs/source.js:37 | `statement-order` | KILLED | [director-096] The source joins chunks of different lengths |
| a9198 | src/director/packs/source.js:38 | `statement-order` | KILLED | [director-096] The source joins chunks of different lengths |
| a9199 | src/director/packs/source.js:53 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9199 |
| a9200 | src/director/packs/source.js:54 | `statement-order` | KILLED | [director-096] The source joins chunks of different lengths |
| a9201 | src/director/packs/source.js:55 | `statement-order` | KILLED | [director-096] The source joins chunks of different lengths |
| a9202 | src/director/packs/source.js:23 | `await-remove` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9203 | src/director/packs/source.js:23 | `new-argument` | KILLED | [director-095] The source sets its fixed options for the asset request |
| a9204 | src/director/packs/source.js:23 | `new-argument` | KILLED | [director-095] The source sets its fixed options for the asset request |
| a9205 | src/director/packs/source.js:23 | `new-argument` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9206 | src/director/packs/source.js:23 | `new-argument` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9207 | src/director/packs/source.js:31 | `statement-order` | KILLED | [director-097] The source waits for body cancellation before it rejects the asset request |
| a9208 | src/director/packs/source.js:31 | `await-remove` | KILLED | [director-097] The source waits for body cancellation before it rejects the asset request |
| a9209 | src/director/packs/source.js:39 | `statement-order` | KILLED | [director-096] The source checks the header limit before it reads the first stream chunk |
| a9210 | src/director/packs/source.js:42 | `statement-order` | KILLED | [director-097] The source checks the signal before it reads the stream chunk |
| a9211 | src/director/packs/source.js:43 | `statement-order` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9212 | src/director/packs/source.js:44 | `statement-order` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9213 | src/director/packs/source.js:45 | `statement-order` | KILLED | [director-096] The source rejects excess chunk bytes for the stream |
| a9214 | src/director/packs/source.js:46 | `statement-order` | KILLED | [director-096] The source rejects excess bytes before it keeps a chunk |
| a9215 | src/director/packs/source.js:43 | `destructure-remove` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9216 | src/director/packs/source.js:43 | `destructure-remove` | KILLED | [director-096] The source joins chunks of different lengths |
| a9217 | src/director/packs/source.js:43 | `await-remove` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9218 | src/director/packs/source.js:50 | `statement-order` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9219 | src/director/packs/source.js:50 | `await-remove` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9220 | src/director/packs/source.js:53 | `new-argument` | KILLED | [director-096] The source joins chunks of different lengths |
| a9221 | src/director/packs/source.js:53 | `new-argument` | KILLED | [director-096] The source joins chunks of different lengths |
| a9222 | src/director/packs/source.js:56 | `statement-order` | KILLED | [director-096] The source joins chunks of different lengths |
| a9223 | src/director/sharing/bundle.js:11 | `new-argument` | KILLED | [director-101] The export writes each asset index and filename |
| a9224 | src/director/sharing/bundle.js:11 | `new-argument` | KILLED | [director-101] The export writes each asset index and filename |
| a9225 | src/director/sharing/bundle.js:27 | `new-argument` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9226 | src/director/sharing/bundle.js:27 | `new-argument` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9227 | src/director/sharing/bundle.js:27 | `await-remove` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9228 | src/director/sharing/bundle.js:31 | `statement-order` | KILLED | [director-101] The export writes each asset index and filename |
| a9229 | src/director/sharing/bundle.js:32 | `statement-order` | KILLED | [director-099 director-101] The export writes each base64 character in plain text |
| a9230 | src/director/sharing/bundle.js:37 | `statement-order` | KILLED | [director-099] The import rejects an equals sign at the start |
| a9231 | src/director/sharing/bundle.js:42 | `regex-member` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9232 | src/director/sharing/bundle.js:42 | `regex-member` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9233 | src/director/sharing/bundle.js:42 | `regex-member` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9234 | src/director/sharing/bundle.js:42 | `regex-member` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9235 | src/director/sharing/bundle.js:42 | `regex-member` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9236 | src/director/sharing/bundle.js:42 | `regex-member` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9237 | src/director/sharing/bundle.js:43 | `regex-member` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9238 | src/director/sharing/bundle.js:43 | `regex-member` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9239 | src/director/sharing/bundle.js:43 | `regex-member` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9240 | src/director/sharing/bundle.js:43 | `regex-member` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9241 | src/director/sharing/bundle.js:43 | `regex-member` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9242 | src/director/sharing/bundle.js:62 | `default-shape` | KILLED | [director-098] The import returns an empty asset map for plain project JSON |
| a9243 | src/director/sharing/bundle.js:62 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9243 |
| a9244 | src/director/sharing/bundle.js:62 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9244 |
| a9245 | src/director/sharing/bundle.js:62 | `destructure-remove` | KILLED | [director-098] The import returns an empty asset map for plain project JSON |
| a9246 | src/director/sharing/bundle.js:63 | `statement-order` | KILLED | [director-098 director-107] The import checks the signal before it checks the text type and rejects the call |
| a9247 | src/director/sharing/bundle.js:64 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9247 |
| a9248 | src/director/sharing/bundle.js:70 | `statement-order` | KILLED | [director-098] The import returns an empty asset map for plain project JSON |
| a9249 | src/director/sharing/bundle.js:71 | `statement-order` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9250 | src/director/sharing/bundle.js:76 | `statement-order` | KILLED | [director-098] The import returns an empty asset map for plain project JSON |
| a9251 | src/director/sharing/bundle.js:78 | `statement-order` | KILLED | [director-099] The import checks top-level fields before version and rejects the call |
| a9252 | src/director/sharing/bundle.js:79 | `statement-order` | KILLED | [director-099] The import checks version before project and rejects the call |
| a9253 | src/director/sharing/bundle.js:80 | `statement-order` | KILLED | [director-099] The import checks project before assets and rejects the call |
| a9254 | src/director/sharing/bundle.js:81 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9254 |
| a9255 | src/director/sharing/bundle.js:82 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9255 |
| a9256 | src/director/sharing/bundle.js:83 | `statement-order` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9257 | src/director/sharing/bundle.js:84 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9257 |
| a9258 | src/director/sharing/bundle.js:98 | `statement-order` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9259 | src/director/sharing/bundle.js:99 | `statement-order` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9260 | src/director/sharing/bundle.js:111 | `statement-order` | KILLED | [director-100] The import names the invalid unused asset and rejects the call |
| a9261 | src/director/sharing/bundle.js:85 | `statement-order` | KILLED | [director-099 director-107] The import checks the signal before it checks asset fields and rejects the call |
| a9262 | src/director/sharing/bundle.js:86 | `statement-order` | KILLED | [director-099] The import checks asset fields before path and rejects the call |
| a9263 | src/director/sharing/bundle.js:87 | `statement-order` | KILLED | [director-099] The import checks path before media type and rejects the call |
| a9264 | src/director/sharing/bundle.js:88 | `statement-order` | KILLED | [director-099] The import checks media type before duplicate path and rejects the call |
| a9265 | src/director/sharing/bundle.js:89 | `statement-order` | KILLED | [director-099] The import checks duplicate path before base64 and rejects the call |
| a9266 | src/director/sharing/bundle.js:90 | `statement-order` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9267 | src/director/sharing/bundle.js:91 | `statement-order` | KILLED | [director-099] The import accepts the total byte limit and rejects one more byte and returns assets |
| a9268 | src/director/sharing/bundle.js:92 | `statement-order` | KILLED | [director-099] The import checks asset bytes before the digest call and rejects the call |
| a9269 | src/director/sharing/bundle.js:93 | `statement-order` | KILLED | [director-107] The bundle helpers stop import after a digest |
| a9270 | src/director/sharing/bundle.js:94 | `statement-order` | KILLED | [director-100 director-107] The import checks the signal before it compares digests |
| a9271 | src/director/sharing/bundle.js:95 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9271 |
| a9272 | src/director/sharing/bundle.js:93 | `await-remove` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9273 | src/director/sharing/bundle.js:100 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9273 |
| a9274 | src/director/sharing/bundle.js:102 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9274 |
| a9275 | src/director/sharing/bundle.js:103 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9275 |
| a9276 | src/director/sharing/bundle.js:117 | `statement-order` | KILLED | [director-106] The share helpers reject excess file bytes before they read text and cancel a stalled project file |
| a9277 | src/director/sharing/bundle.js:120 | `statement-order` | KILLED | [director-106] The share helpers check the file limit before they read the signal and reject the invalid input |
| a9278 | src/director/sharing/bundle.js:127 | `statement-order` | KILLED | [director-106 director-107] The share helpers check the signal before they read text and reject the invalid input |
| a9279 | src/director/sharing/bundle.js:128 | `statement-order` | KILLED | [director-107] The share helpers check the signal after the text promise settles and return the project |
| a9280 | src/director/sharing/bundle.js:129 | `statement-order` | KILLED | [director-106] The share helpers call throwIfAborted three times and return the project |
| a9281 | src/director/sharing/bundle.js:128 | `await-remove` | KILLED | [director-106] The share helpers reject excess file bytes before they read text and cancel a stalled project file |
| a9282 | src/director/sharing/bundle.js:137 | `default-shape` | KILLED | [director-101] The export writes each asset index and filename |
| a9283 | src/director/sharing/bundle.js:137 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9283 |
| a9284 | src/director/sharing/bundle.js:137 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9284 |
| a9285 | src/director/sharing/bundle.js:137 | `destructure-remove` | KILLED | [director-101] The export writes each asset index and filename |
| a9286 | src/director/sharing/bundle.js:139 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9286 |
| a9287 | src/director/sharing/bundle.js:140 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9287 |
| a9288 | src/director/sharing/bundle.js:142 | `statement-order` | KILLED | [director-101] The export writes each asset index and filename |
| a9289 | src/director/sharing/bundle.js:143 | `statement-order` | KILLED | [director-101] The export writes each asset index and filename |
| a9290 | src/director/sharing/bundle.js:186 | `statement-order` | KILLED | [director-101] The export writes each asset index and filename |
| a9291 | src/director/sharing/bundle.js:192 | `statement-order` | KILLED | [director-102] The export rejects encoded bundle text above 52428800 bytes |
| a9292 | src/director/sharing/bundle.js:144 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9292 |
| a9293 | src/director/sharing/bundle.js:145 | `statement-order` | KILLED | [director-101] The export writes each asset index and filename |
| a9294 | src/director/sharing/bundle.js:146 | `statement-order` | KILLED | [director-101] The export writes each asset index and filename |
| a9295 | src/director/sharing/bundle.js:147 | `statement-order` | KILLED | [director-101] The export writes each asset index and filename |
| a9296 | src/director/sharing/bundle.js:182 | `statement-order` | KILLED | [director-101] The export writes source then byteLength then digest |
| a9297 | src/director/sharing/bundle.js:183 | `statement-order` | KILLED | [director-101] The export writes source then byteLength then digest |
| a9298 | src/director/sharing/bundle.js:148 | `statement-order` | KILLED | [director-102] The export checks the asset count before the next resolver call and rejects the call |
| a9299 | src/director/sharing/bundle.js:150 | `statement-order` | KILLED | [director-107] The bundle helpers stop export after asset bytes |
| a9300 | src/director/sharing/bundle.js:154 | `statement-order` | KILLED | [director-102 director-107] The export checks the signal before it checks for an absent asset and rejects the call |
| a9301 | src/director/sharing/bundle.js:155 | `statement-order` | KILLED | [director-102] The export names the invalid absent asset and rejects the call |
| a9302 | src/director/sharing/bundle.js:156 | `statement-order` | KILLED | [director-101] The export writes each asset index and filename |
| a9303 | src/director/sharing/bundle.js:157 | `statement-order` | KILLED | [director-102] The export checks the asset size before the total size and rejects the call |
| a9304 | src/director/sharing/bundle.js:158 | `statement-order` | KILLED | [director-102] The export checks bytes before the media type and rejects the call |
| a9305 | src/director/sharing/bundle.js:159 | `statement-order` | KILLED | [director-102] The export checks the media type before the digest call and rejects the call |
| a9306 | src/director/sharing/bundle.js:160 | `statement-order` | KILLED | [director-107] The bundle helpers stop export after a digest |
| a9307 | src/director/sharing/bundle.js:161 | `statement-order` | KILLED | [director-102 director-107] The export checks the signal before it checks declared integrity and rejects the call |
| a9308 | src/director/sharing/bundle.js:162 | `statement-order` | KILLED | [director-102] The export checks integrity before it reads the filename |
| a9309 | src/director/sharing/bundle.js:167 | `statement-order` | KILLED | [director-101] The export writes each asset index and filename |
| a9310 | src/director/sharing/bundle.js:168 | `statement-order` | KILLED | [director-103] The export names different shared integrity and rejects the call |
| a9311 | src/director/sharing/bundle.js:175 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9311 |
| a9312 | src/director/sharing/bundle.js:150 | `await-remove` | KILLED | [director-101] The export writes each asset index and filename |
| a9313 | src/director/sharing/bundle.js:160 | `await-remove` | KILLED | [director-101] The export copies bytes and attribution and keeps the project without an asset request for the selected scene bundle |
| a9314 | src/director/sharing/bundle.js:190 | `destructure-remove` | KILLED | [director-101] The export copies bytes and attribution and keeps the project without an asset request for the selected scene bundle |
| a9315 | src/director/sharing/bundle.js:190 | `destructure-remove` | KILLED | [director-101] The export writes each asset index and filename |
| a9316 | src/director/sharing/bundle.js:199 | `statement-order` | KILLED | [director-104] The store reports zero bytes after an absent replacement map |
| a9317 | src/director/sharing/bundle.js:201 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9317 |
| a9318 | src/director/sharing/bundle.js:201 | `default-shape` | KILLED | [director-104] The store reports zero bytes after an absent replacement map |
| a9319 | src/director/sharing/bundle.js:201 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9319 |
| a9320 | src/director/sharing/bundle.js:201 | `default-shape` | KILLED | [director-104] The store reports zero bytes after an absent replacement map |
| a9321 | src/director/sharing/bundle.js:202 | `new-argument` | KILLED | [director-105] The store accepts its default byte limit for the byte store and returns byte copies |
| a9322 | src/director/sharing/bundle.js:202 | `new-argument` | KILLED | [director-105] The store accepts its default byte limit for the byte store and returns byte copies |
| a9323 | src/director/sharing/bundle.js:207 | `new-argument` | KILLED | [director-104] The store copies the asset map |
| a9324 | src/director/sharing/bundle.js:207 | `new-argument` | KILLED | [director-104] The store copies the asset map |
| a9325 | src/director/sharing/bundle.js:212 | `destructure-remove` | KILLED | [director-105] The store accepts its default byte limit for the byte store and returns byte copies |
| a9326 | src/director/sharing/bundle.js:212 | `destructure-remove` | KILLED | [director-105] The store accepts its default byte limit for the byte store and returns byte copies |
| a9327 | src/director/sharing/bundle.js:212 | `destructure-remove` | KILLED | [director-105] The store accepts its default byte limit for the byte store and returns byte copies |
| a9328 | src/director/sharing/bundle.js:212 | `default-shape` | KILLED | [director-105] The store accepts its default byte limit for the byte store and returns byte copies |
| a9329 | src/director/sharing/bundle.js:212 | `default-shape` | KILLED | [director-105] The store rejects 8388609 bytes without a caller limit |
| a9330 | src/director/sharing/bundle.js:212 | `default-shape` | KILLED | [director-105] The store accepts its default byte limit for the byte store and returns byte copies |
| a9331 | src/director/sharing/bundle.js:212 | `default-shape` | KILLED | [director-105] The store accepts its default byte limit for the byte store and returns byte copies |
| a9332 | src/director/sharing/bundle.js:213 | `statement-order` | KILLED | [director-105] The store checks the signal before it checks the path and rejects the call |
| a9333 | src/director/sharing/bundle.js:214 | `statement-order` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9333 |
| a9334 | src/director/sharing/bundle.js:215 | `statement-order` | KILLED | [director-105] The store accepts its default byte limit for the byte store and returns byte copies |
| a9335 | src/director/sharing/bundle.js:216 | `statement-order` | KILLED | [director-104] The store removes old data after replacement and uses no network source for the import byte store |
| a9336 | src/director/sharing/lifetime.js:3 | `statement-order` | KILLED | [director-101] The export writes each asset index and filename |
| a9337 | src/director/sharing/lifetime.js:4 | `new-argument` | KILLED | [director-107] The helper does not attach a listener to a cancelled signal and rejects the call |
| a9338 | src/director/sharing/lifetime.js:4 | `new-argument` | KILLED | [director-107] The helper does not attach a listener to a cancelled signal and rejects the call |
| a9339 | src/director/sharing/lifetime.js:5 | `statement-order` | KILLED | [director-107] The helper does not attach a listener to a cancelled signal and rejects the call |
| a9340 | src/director/sharing/lifetime.js:9 | `statement-order` | KILLED | [director-107] The helper does not attach a listener to a cancelled signal and rejects the call |
| a9341 | src/director/sharing/lifetime.js:14 | `statement-order` | KILLED | [director-107] The helper attaches its listener before it reads the work promise |
| a9342 | src/director/sharing/lifetime.js:6 | `statement-order` | KILLED | [director-107] The helper removes its listener before it reads the reason |
| a9343 | src/director/sharing/lifetime.js:10 | `statement-order` | KILLED | [director-107] The helper reads cancelled work before its reason |
| a9344 | src/director/sharing/lifetime.js:11 | `statement-order` | KILLED | [director-107] The helper does not attach a listener to a cancelled signal and rejects the call |
| a9345 | src/director/sharing/lifetime.js:17 | `statement-order` | KILLED | [director-107] The helper checks cancellation after listener removal and rejects the call |
| a9346 | src/director/sharing/lifetime.js:21 | `statement-order` | KILLED | [director-107] The helper rejects with the cancellation reason during listener removal after a work error |
| a9347 | src/director/sharing/preview.js:5 | `destructure-remove` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9348 | src/director/sharing/preview.js:5 | `destructure-remove` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9349 | src/director/sharing/preview.js:6 | `default-shape` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9350 | src/director/sharing/preview.js:6 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9350 |
| a9351 | src/director/sharing/preview.js:6 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9351 |
| a9352 | src/director/sharing/preview.js:6 | `destructure-remove` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9353 | src/director/sharing/preview.js:6 | `destructure-remove` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9354 | src/director/sharing/preview.js:6 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9354 |
| a9355 | src/director/sharing/preview.js:6 | `default-shape` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9356 | src/director/sharing/preview.js:6 | `default-shape` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9357 | src/director/sharing/preview.js:6 | `default-shape` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9357 |
| a9358 | src/director/sharing/preview.js:6 | `default-shape` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9359 | src/director/sharing/preview.js:6 | `default-shape` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9360 | src/director/sharing/preview.js:8 | `statement-order` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9361 | src/director/sharing/preview.js:10 | `statement-order` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9362 | src/director/sharing/preview.js:8 | `new-argument` | KILLED | [director-109] The preview reports a configured source |
| a9363 | src/director/sharing/preview.js:8 | `new-argument` | KILLED | [director-109] The preview reports a configured source |
| a9364 | src/director/sharing/preview.js:9 | `new-argument` | KILLED | [director-110] The preview lists distinct absent layers |
| a9365 | src/director/sharing/preview.js:9 | `new-argument` | KILLED | [director-110] The preview lists distinct absent layers |
| a9366 | src/director/sharing/preview.js:31 | `spread-remove` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9367 | src/director/packs/manifest.js:24 | `regex-quantifier` | KILLED | [director-076] The validator returns without an error for A in both character positions for the asset path |
| a9368 | src/director/packs/manifest.js:44 | `template-expression` | KILLED | [director-077] The validator checks ID before version and rejects the call |
| a9369 | src/director/packs/manifest.js:48 | `template-expression` | KILLED | [director-077] The validator names the source object and rejects the call |
| a9370 | src/director/packs/manifest.js:49 | `template-expression` | KILLED | [director-076 director-077] The validator checks source name before path and rejects the call |
| a9371 | src/director/packs/manifest.js:50 | `template-expression` | KILLED | [director-076 director-078] The validator checks source path before attribution fields and rejects the call |
| a9372 | src/director/packs/manifest.js:51 | `template-expression` | KILLED | [director-078] The validator names the extra attribution field and rejects the call |
| a9373 | src/director/packs/manifest.js:52 | `template-expression` | KILLED | [director-078] The validator checks text before license and rejects the call |
| a9374 | src/director/packs/manifest.js:53 | `template-expression` | KILLED | [director-078] The validator checks license before URL and rejects the call |
| a9375 | src/director/packs/manifest.js:54 | `template-expression` | KILLED | [director-078 director-079] The validator checks URL before byteLength and rejects the call |
| a9376 | src/director/packs/manifest.js:83 | `template-expression` | KILLED | [director-080] The validator checks bounds values before edge order and rejects the call |
| a9377 | src/director/packs/manifest.js:100 | `template-expression` | KILLED | [director-080] The validator checks the bounds array before it reads the length |
| a9378 | src/director/packs/manifest.js:106 | `template-expression` | KILLED | [director-080] The validator checks bounds values before edge order and rejects the call |
| a9379 | src/director/packs/manifest.js:106 | `template-expression` | KILLED | [director-080] The validator checks bounds values before edge order and rejects the call |
| a9380 | src/director/packs/manifest.js:114 | `template-expression` | KILLED | [director-080] The validator rejects text for each geographic field for the image |
| a9381 | src/director/packs/manifest.js:122 | `template-expression` | KILLED | [director-082] The validator checks the list before it reads the anchors |
| a9382 | src/director/packs/manifest.js:126 | `template-expression` | KILLED | [director-077 director-082] The validator checks the declaration before it checks for duplicate IDs and rejects the call |
| a9383 | src/director/packs/manifest.js:126 | `template-expression` | KILLED | [director-077 director-082] The validator checks the declaration before it checks for duplicate IDs and rejects the call |
| a9384 | src/director/packs/manifest.js:132 | `template-expression` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a9385 | src/director/packs/manifest.js:132 | `template-expression` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a9386 | src/director/packs/geojson.js:13 | `new-error-argument` | KILLED | [director-083] The decoder rejects invalid type for the collection |
| a9387 | src/director/packs/geojson.js:13 | `new-error-argument` | KILLED | [director-083] The decoder rejects invalid type for the collection |
| a9388 | src/director/packs/geojson.js:26 | `new-error-argument` | KILLED | [director-085] The decoder rejects a null position |
| a9389 | src/director/packs/geojson.js:26 | `new-error-argument` | KILLED | [director-085] The decoder rejects a null position |
| a9390 | src/director/packs/geojson.js:31 | `new-error-argument` | KILLED | [director-086] The decoder rejects a null line |
| a9391 | src/director/packs/geojson.js:31 | `new-error-argument` | KILLED | [director-086] The decoder rejects a null line |
| a9392 | src/director/packs/geojson.js:34 | `new-error-argument` | KILLED | [director-086] The decoder rejects unclosed field 0 for the ring |
| a9393 | src/director/packs/geojson.js:34 | `new-error-argument` | KILLED | [director-086] The decoder rejects unclosed field 0 for the ring |
| a9394 | src/director/packs/geojson.js:46 | `new-error-argument` | KILLED | [director-084] The decoder rejects type for the feature |
| a9395 | src/director/packs/geojson.js:46 | `new-error-argument` | KILLED | [director-084] The decoder rejects type for the feature |
| a9396 | src/director/packs/geojson.js:59 | `new-error-argument` | KILLED | [director-087] The decoder rejects invalid type for the geometry |
| a9397 | src/director/packs/geojson.js:59 | `new-error-argument` | KILLED | [director-087] The decoder rejects invalid type for the geometry |
| a9398 | src/director/packs/session.js:69 | `new-error-argument` | KILLED | [director-088 director-091] The session checks the new list after it disposes old resources |
| a9399 | src/director/packs/session.js:69 | `new-error-argument` | KILLED | [director-088 director-091] The session checks the new list after it disposes old resources |
| a9400 | src/director/packs/session.js:72 | `template-expression` | KILLED | [director-088] The session checks declarations before it reads the caller signal |
| a9401 | src/director/packs/session.js:89 | `new-error-argument` | KILLED | [director-092] The session gives its cause to the source signal for the deadline and rejects the call |
| a9402 | src/director/packs/session.js:89 | `new-error-argument` | KILLED | [director-092] The session gives its cause to the source signal for the deadline and rejects the call |
| a9403 | src/director/packs/session.js:98 | `new-error-argument` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9403 |
| a9404 | src/director/packs/session.js:98 | `new-error-argument` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9404 |
| a9405 | src/director/packs/session.js:115 | `new-error-argument` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9405 |
| a9406 | src/director/packs/session.js:115 | `new-error-argument` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9406 |
| a9407 | src/director/packs/session.js:118 | `new-error-argument` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9407 |
| a9408 | src/director/packs/session.js:118 | `new-error-argument` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9408 |
| a9409 | src/director/packs/session.js:128 | `new-error-argument` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9409 |
| a9410 | src/director/packs/session.js:128 | `new-error-argument` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9410 |
| a9411 | src/director/packs/session.js:136 | `new-error-argument` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9411 |
| a9412 | src/director/packs/session.js:136 | `new-error-argument` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9412 |
| a9413 | src/director/packs/session.js:154 | `new-error-argument` | KILLED | [director-092] The session rejects the load call for a source signal event during listener removal after success |
| a9414 | src/director/packs/source.js:18 | `new-error-argument` | KILLED | [director-094] The factory rejects protocol |
| a9415 | src/director/packs/source.js:32 | `new-error-argument` | KILLED | [director-097] The source waits for body cancellation before it rejects the asset request |
| a9416 | src/director/packs/source.js:32 | `new-error-argument` | KILLED | [director-097] The source waits for body cancellation before it rejects the asset request |
| a9417 | src/director/packs/source.js:35 | `new-error-argument` | KILLED | [director-097] The source rejects an absent stream |
| a9418 | src/director/packs/source.js:35 | `new-error-argument` | KILLED | [director-097] The source rejects an absent stream |
| a9419 | src/director/packs/source.js:40 | `new-error-argument` | KILLED | [director-096] The source checks the header limit before it reads the first stream chunk |
| a9420 | src/director/packs/source.js:40 | `new-error-argument` | KILLED | [director-096] The source checks the header limit before it reads the first stream chunk |
| a9421 | src/director/packs/source.js:46 | `new-error-argument` | KILLED | [director-096] The source rejects excess chunk bytes for the stream |
| a9422 | src/director/packs/source.js:46 | `new-error-argument` | KILLED | [director-096] The source rejects excess chunk bytes for the stream |
| a9423 | src/director/sharing/bundle.js:33 | `call-spread-remove` | KILLED | [director-099 director-101] The export writes each base64 character in plain text |
| a9424 | src/director/sharing/bundle.js:43 | `regex-quantifier` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9424 |
| a9425 | src/director/sharing/bundle.js:43 | `regex-quantifier` | KILLED | [director-099] The import accepts the total byte limit and rejects one more byte and returns assets |
| a9426 | src/director/sharing/bundle.js:43 | `regex-quantifier` | KILLED | [director-099] The import rejects invalid padding for the base64 |
| a9427 | src/director/sharing/bundle.js:167 | `template-expression` | KILLED | [director-101] The export writes each asset index and filename |
| a9428 | src/director/sharing/bundle.js:217 | `new-error-argument` | KILLED | [director-104] The store removes old data after replacement and uses no network source for the import byte store |
| a9429 | src/director/sharing/bundle.js:217 | `new-error-argument` | KILLED | [director-104] The store removes old data after replacement and uses no network source for the import byte store |
| a9430 | src/director/packs/manifest.js:58 | `constructor` | KILLED | [director-078 director-079] The validator checks URL before byteLength and rejects the call |
| a9431 | src/director/packs/manifest.js:123 | `constructor` | KILLED | [director-082] The validator uses supplied anchors for the scene and returns without an error |
| a9432 | src/director/packs/manifest.js:124 | `constructor` | KILLED | [director-077 director-082] The validator checks the declaration before it checks for duplicate IDs and rejects the call |
| a9433 | src/director/packs/manifest.js:134 | `constructor` | KILLED | [director-082] The validator returns without an error for eight references and rejects nine references for the shot |
| a9434 | src/director/packs/geojson.js:6 | `constructor` | KILLED | [director-085] The decoder rejects a null position |
| a9435 | src/director/packs/geojson.js:15 | `constructor` | KILLED | [director-085] The decoder rejects a null position |
| a9436 | src/director/packs/session.js:5 | `constructor` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9437 | src/director/packs/session.js:41 | `constructor` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9438 | src/director/packs/session.js:42 | `constructor` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9439 | src/director/packs/session.js:70 | `constructor` | KILLED | [director-089] The session calls the media renderer once and returns true |
| a9440 | src/director/packs/session.js:76 | `constructor` | KILLED | [director-089] The session attaches the source listener, checks the source signal state and reads the work promise in that order |
| a9441 | src/director/packs/session.js:124 | `constructor` | KILLED | [director-093] The session returns true for exact bytes and digest |
| a9442 | src/director/packs/source.js:8 | `constructor` | KILLED | [director-097] The source waits for stream cancellation before it releases the reader lock |
| a9443 | src/director/packs/source.js:23 | `constructor` | KILLED | [director-095] The source sets its fixed options for the asset request |
| a9444 | src/director/packs/source.js:53 | `constructor` | KILLED | [director-096] The source joins chunks of different lengths |
| a9445 | src/director/sharing/bundle.js:11 | `constructor` | KILLED | [director-101] The export writes each asset index and filename |
| a9446 | src/director/sharing/bundle.js:27 | `constructor` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9447 | src/director/sharing/bundle.js:67 | `constructor` | KILLED | [director-098] The import returns an empty asset map for plain project JSON |
| a9448 | src/director/sharing/bundle.js:77 | `constructor` | KILLED | [director-098] The import returns an empty asset map for plain project JSON |
| a9449 | src/director/sharing/bundle.js:82 | `constructor` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9450 | src/director/sharing/bundle.js:98 | `constructor` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9451 | src/director/sharing/bundle.js:141 | `constructor` | KILLED | [director-101] The export writes each asset index and filename |
| a9452 | src/director/sharing/bundle.js:192 | `constructor` | KILLED | [director-101] The export writes each asset index and filename |
| a9453 | src/director/sharing/bundle.js:199 | `constructor` | KILLED | [director-105] The store rejects absent bytes |
| a9454 | src/director/sharing/bundle.js:201 | `constructor` | EQUIVALENT | [probe-extension.txt](evidence/probe-extension.txt): a9454 |
| a9455 | src/director/sharing/bundle.js:202 | `constructor` | KILLED | [director-105] The store accepts its default byte limit for the byte store and returns byte copies |
| a9456 | src/director/sharing/bundle.js:207 | `constructor` | KILLED | [director-104] The store copies the asset map |
| a9457 | src/director/sharing/lifetime.js:4 | `constructor` | KILLED | [director-107] The helper does not attach a listener to a cancelled signal and rejects the call |
| a9458 | src/director/sharing/preview.js:8 | `constructor` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9459 | src/director/sharing/preview.js:9 | `constructor` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9460 | src/director/sharing/preview.js:31 | `constructor` | KILLED | [director-109 director-110] The preview reports unavailable sources and absent layers without ID lists |
| a9461 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for a in both character positions for the asset path |
| a9462 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for b in both character positions for the asset path |
| a9463 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for c in both character positions for the asset path |
| a9464 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for d in both character positions for the asset path |
| a9465 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for e in both character positions for the asset path |
| a9466 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for f in both character positions for the asset path |
| a9467 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for g in both character positions for the asset path |
| a9468 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for h in both character positions for the asset path |
| a9469 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for i in both character positions for the asset path |
| a9470 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for j in both character positions for the asset path |
| a9471 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for k in both character positions for the asset path |
| a9472 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for l in both character positions for the asset path |
| a9473 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for m in both character positions for the asset path |
| a9474 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for n in both character positions for the asset path |
| a9475 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for o in both character positions for the asset path |
| a9476 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for p in both character positions for the asset path |
| a9477 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for q in both character positions for the asset path |
| a9478 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for r in both character positions for the asset path |
| a9479 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for s in both character positions for the asset path |
| a9480 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for t in both character positions for the asset path |
| a9481 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for u in both character positions for the asset path |
| a9482 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for v in both character positions for the asset path |
| a9483 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for w in both character positions for the asset path |
| a9484 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for A in both character positions for the asset path |
| a9485 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for y in both character positions for the asset path |
| a9486 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for A in both character positions for the asset path |
| a9487 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for B in both character positions for the asset path |
| a9488 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for C in both character positions for the asset path |
| a9489 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for D in both character positions for the asset path |
| a9490 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for E in both character positions for the asset path |
| a9491 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for F in both character positions for the asset path |
| a9492 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for G in both character positions for the asset path |
| a9493 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for H in both character positions for the asset path |
| a9494 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for I in both character positions for the asset path |
| a9495 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for J in both character positions for the asset path |
| a9496 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for K in both character positions for the asset path |
| a9497 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for L in both character positions for the asset path |
| a9498 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for M in both character positions for the asset path |
| a9499 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for N in both character positions for the asset path |
| a9500 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for O in both character positions for the asset path |
| a9501 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for P in both character positions for the asset path |
| a9502 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for Q in both character positions for the asset path |
| a9503 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for R in both character positions for the asset path |
| a9504 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for S in both character positions for the asset path |
| a9505 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for T in both character positions for the asset path |
| a9506 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for U in both character positions for the asset path |
| a9507 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for V in both character positions for the asset path |
| a9508 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for W in both character positions for the asset path |
| a9509 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for X in both character positions for the asset path |
| a9510 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for Y in both character positions for the asset path |
| a9511 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 0 in both character positions for the asset path |
| a9512 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 1 in both character positions for the asset path |
| a9513 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 2 in both character positions for the asset path |
| a9514 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 3 in both character positions for the asset path |
| a9515 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 4 in both character positions for the asset path |
| a9516 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 5 in both character positions for the asset path |
| a9517 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 6 in both character positions for the asset path |
| a9518 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 7 in both character positions for the asset path |
| a9519 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 8 in both character positions for the asset path |
| a9520 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for a in both character positions for the asset path |
| a9521 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for b in both character positions for the asset path |
| a9522 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for c in both character positions for the asset path |
| a9523 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for d in both character positions for the asset path |
| a9524 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for e in both character positions for the asset path |
| a9525 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for f in both character positions for the asset path |
| a9526 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for g in both character positions for the asset path |
| a9527 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for h in both character positions for the asset path |
| a9528 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for i in both character positions for the asset path |
| a9529 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for j in both character positions for the asset path |
| a9530 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for k in both character positions for the asset path |
| a9531 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for l in both character positions for the asset path |
| a9532 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for m in both character positions for the asset path |
| a9533 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for n in both character positions for the asset path |
| a9534 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for o in both character positions for the asset path |
| a9535 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for p in both character positions for the asset path |
| a9536 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for q in both character positions for the asset path |
| a9537 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for r in both character positions for the asset path |
| a9538 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for s in both character positions for the asset path |
| a9539 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for t in both character positions for the asset path |
| a9540 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for u in both character positions for the asset path |
| a9541 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for v in both character positions for the asset path |
| a9542 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for w in both character positions for the asset path |
| a9543 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for x in both character positions for the asset path |
| a9544 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for y in both character positions for the asset path |
| a9545 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for A in both character positions for the asset path |
| a9546 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for B in both character positions for the asset path |
| a9547 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for C in both character positions for the asset path |
| a9548 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for D in both character positions for the asset path |
| a9549 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for E in both character positions for the asset path |
| a9550 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for F in both character positions for the asset path |
| a9551 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for G in both character positions for the asset path |
| a9552 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for H in both character positions for the asset path |
| a9553 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for I in both character positions for the asset path |
| a9554 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for J in both character positions for the asset path |
| a9555 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for K in both character positions for the asset path |
| a9556 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for L in both character positions for the asset path |
| a9557 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for M in both character positions for the asset path |
| a9558 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for N in both character positions for the asset path |
| a9559 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for O in both character positions for the asset path |
| a9560 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for P in both character positions for the asset path |
| a9561 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for Q in both character positions for the asset path |
| a9562 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for R in both character positions for the asset path |
| a9563 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for S in both character positions for the asset path |
| a9564 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for T in both character positions for the asset path |
| a9565 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for U in both character positions for the asset path |
| a9566 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for V in both character positions for the asset path |
| a9567 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for W in both character positions for the asset path |
| a9568 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for X in both character positions for the asset path |
| a9569 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for Y in both character positions for the asset path |
| a9570 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 0 in both character positions for the asset path |
| a9571 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 1 in both character positions for the asset path |
| a9572 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 2 in both character positions for the asset path |
| a9573 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 3 in both character positions for the asset path |
| a9574 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 4 in both character positions for the asset path |
| a9575 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 5 in both character positions for the asset path |
| a9576 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 6 in both character positions for the asset path |
| a9577 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 7 in both character positions for the asset path |
| a9578 | src/director/packs/manifest.js:24 | `regex-character` | KILLED | [director-076] The validator returns without an error for 8 in both character positions for the asset path |
| a9579 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9580 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9581 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9582 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9583 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9584 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9585 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9586 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9587 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9588 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9589 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9590 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9591 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9592 | src/director/packs/manifest.js:79 | `regex-character` | KILLED | [director-079] The validator returns without an error for each hexadecimal digest character |
| a9593 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9594 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9595 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9596 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9597 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9598 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9599 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9600 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9601 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9602 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9603 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9604 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9605 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9606 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9607 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9608 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9609 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9610 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9611 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9612 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9613 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9614 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9615 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9616 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9617 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9618 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9619 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9620 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9621 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9622 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9623 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9624 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9625 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9626 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9627 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9628 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9629 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9630 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9631 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9632 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9633 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9634 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9635 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9636 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9637 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9638 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9639 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9640 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9641 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9642 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9643 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9644 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9645 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9646 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9647 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9648 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9649 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9650 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9651 | src/director/sharing/bundle.js:42 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in plain text and returns assets |
| a9652 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9653 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9654 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9655 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9656 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9657 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9658 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9659 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9660 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9661 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9662 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9663 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9664 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9665 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9666 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9667 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9668 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9669 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9670 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9671 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9672 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9673 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9674 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9675 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9676 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9677 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9678 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9679 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9680 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9681 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9682 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9683 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9684 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9685 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9686 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9687 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9688 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9689 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9690 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9691 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9692 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9693 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9694 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9695 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9696 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9697 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9698 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9699 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9700 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9701 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9702 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9703 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9704 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9705 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9706 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9707 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9708 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9709 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |
| a9710 | src/director/sharing/bundle.js:43 | `regex-character` | KILLED | [director-099] The import accepts each base64 character in padded text and returns assets |

### Extension class totals

| class | mutations | killed | equivalent | known limit |
| --- | ---: | ---: | ---: | ---: |
| `await-remove` | 12 | 12 | 0 | 0 |
| `call-spread-remove` | 1 | 1 | 0 | 0 |
| `constructor` | 31 | 30 | 1 | 0 |
| `default-shape` | 61 | 42 | 19 | 0 |
| `destructure-remove` | 24 | 24 | 0 | 0 |
| `new-argument` | 38 | 37 | 1 | 0 |
| `new-error-argument` | 38 | 28 | 10 | 0 |
| `regex-character` | 250 | 250 | 0 | 0 |
| `regex-member` | 24 | 24 | 0 | 0 |
| `regex-quantifier` | 4 | 3 | 1 | 0 |
| `spread-remove` | 1 | 1 | 0 | 0 |
| `statement-order` | 207 | 172 | 35 | 0 |
| `template-expression` | 20 | 20 | 0 | 0 |

## Pass 6 killer title source

The automatic rows use the first failed test of the final rerun of the lead after pass 5.
The source files are results-mutants.json and results-mutants-new.json under director-3-final2.
The pass 6 title correction maps each old title to its current title.
Worker reruns do not replace this source.
