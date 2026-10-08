# Former survivor results

Base commit: `290b5d2`.

KILLED names a failed tagged test.
EQUIVALENT names a proved public API claim.
KNOWN is the code fault status marker.
LIMIT is the code fault status word.
The table uses KNOWN LIMIT for a code fault.

The complete campaign gives 192 killed results and 68 survived results.
The survived results comprise 64 equivalent cases and four cases of Known limits.
The public function probes support each equivalent claim.
The claim covers returned data, error fields, getters and callback calls with standard built-in functions.
The claim excludes source text and diagnostic stack locations.

The campaign command and status totals are in [evidence.md](evidence.md).
The source audit is [audit.md](audit.md).

| id | file:line | class | verdict | test title or probe file or limit name |
| --- | --- | --- | --- | --- |
| a0004 | src/director/packs/manifest.js:10 | `object` | KILLED | [director-088] The data pack limits reject a caller change |
| a0107 | src/director/packs/manifest.js:24 | `regex` | KILLED | [director-076] The asset path accepts z/Zz |
| a0108 | src/director/packs/manifest.js:24 | `regex` | KILLED | [director-076] The asset path accepts z/Zz |
| a0110 | src/director/packs/manifest.js:24 | `regex` | KILLED | [director-076] The asset path accepts z/Zz |
| a0111 | src/director/packs/manifest.js:24 | `regex` | KILLED | [director-076] The asset path accepts Z/zZ |
| a0121 | src/director/packs/manifest.js:34 | `statement` | KILLED | [director-077] The manifest names the extra data pack field |
| a0122 | src/director/packs/manifest.js:34 | `statement` | KILLED | [director-077] The manifest names the extra data pack field |
| a0123 | src/director/packs/manifest.js:34 | `statement` | KILLED | [director-077] The manifest names the extra data pack field |
| a0124 | src/director/packs/manifest.js:33 | `statement` | KILLED | [director-077] The manifest names the extra data pack field |
| a0126 | src/director/packs/manifest.js:34 | `arguments` | KILLED | [director-077] The manifest names the extra data pack field |
| a0215 | src/director/packs/manifest.js:47 | `arguments` | KILLED | [director-077] The manifest names the format field |
| a0217 | src/director/packs/manifest.js:47 | `argument-drop` | KILLED | [director-077] The manifest names the format field |
| a0224 | src/director/packs/manifest.js:48 | `arguments` | KILLED | [director-077] The manifest names the source object |
| a0250 | src/director/packs/manifest.js:50 | `arguments` | KILLED | [director-076] The manifest names the source path |
| a0252 | src/director/packs/manifest.js:50 | `argument-drop` | KILLED | [director-076] The manifest names the source path |
| a0253 | src/director/packs/manifest.js:51 | `statement` | KILLED | [director-078] The manifest names the extra attribution field |
| a0254 | src/director/packs/manifest.js:51 | `statement` | KILLED | [director-078] The manifest names the extra attribution field |
| a0255 | src/director/packs/manifest.js:51 | `statement` | KILLED | [director-078] The manifest names the extra attribution field |
| a0256 | src/director/packs/manifest.js:50 | `statement` | KILLED | [director-078] The manifest names the extra attribution field |
| a0258 | src/director/packs/manifest.js:51 | `arguments` | KILLED | [director-078] The manifest names the extra attribution field |
| a0338 | src/director/packs/manifest.js:60 | `arguments` | KILLED | [director-078] The manifest names the link syntax |
| a0340 | src/director/packs/manifest.js:60 | `argument-drop` | KILLED | [director-078] The manifest names the link syntax |
| a0354 | src/director/packs/manifest.js:63 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a0359 | src/director/packs/manifest.js:63 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a0364 | src/director/packs/manifest.js:63 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a0369 | src/director/packs/manifest.js:63 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a0380 | src/director/packs/manifest.js:70 | `arguments` | KILLED | [director-078] The manifest names the link protocol |
| a0382 | src/director/packs/manifest.js:70 | `argument-drop` | KILLED | [director-078] The manifest names the link protocol |
| a0390 | src/director/packs/manifest.js:74 | `arguments` | KILLED | [director-079] The manifest names the numeric text |
| a0402 | src/director/packs/manifest.js:75 | `arguments` | KILLED | [director-079] The manifest names the numeric text |
| a0405 | src/director/packs/manifest.js:75 | `arguments` | EQUIVALENT | [evidence/probe-number-flag.txt](evidence/probe-number-flag.txt) |
| a0410 | src/director/packs/manifest.js:75 | `argument-drop` | EQUIVALENT | [evidence/probe-number-flag.txt](evidence/probe-number-flag.txt) |
| a0417 | src/director/packs/manifest.js:75 | `boolean` | KILLED | [director-079] The manifest names the numeric text |
| a0431 | src/director/packs/manifest.js:76 | `arguments` | KILLED | [director-079] The manifest names the integer field |
| a0433 | src/director/packs/manifest.js:76 | `argument-drop` | KILLED | [director-079] The manifest names the integer field |
| a0457 | src/director/packs/manifest.js:79 | `operand-order` | KILLED | [director-079] The digest type check precedes text conversion |
| a0484 | src/director/packs/manifest.js:84 | `statement` | KILLED | [director-080] The manifest names the extra placement field |
| a0485 | src/director/packs/manifest.js:84 | `statement` | KILLED | [director-080] The manifest names the extra placement field |
| a0486 | src/director/packs/manifest.js:84 | `statement` | KILLED | [director-080] The manifest names the extra placement field |
| a0487 | src/director/packs/manifest.js:83 | `statement` | KILLED | [director-080] The manifest names the extra placement field |
| a0489 | src/director/packs/manifest.js:86 | `arguments` | KILLED | [director-080] The manifest names the extra placement field |
| a0536 | src/director/packs/manifest.js:95 | `arguments` | KILLED | [director-081] The manifest names an unknown anchor |
| a0538 | src/director/packs/manifest.js:95 | `argument-drop` | KILLED | [director-081] The manifest names an unknown anchor |
| a0552 | src/director/packs/manifest.js:98 | `arguments` | KILLED | [director-080] The manifest names the height reference |
| a0554 | src/director/packs/manifest.js:98 | `argument-drop` | KILLED | [director-080] The manifest names the height reference |
| a0591 | src/director/packs/manifest.js:102 | `arguments` | KILLED | [director-080] The manifest names the bound list |
| a0593 | src/director/packs/manifest.js:102 | `argument-drop` | KILLED | [director-080] The manifest names the bound list |
| a0607 | src/director/packs/manifest.js:109 | `arguments` | EQUIVALENT | [evidence/probe-number-flag.txt](evidence/probe-number-flag.txt) |
| a0612 | src/director/packs/manifest.js:108 | `argument-drop` | EQUIVALENT | [evidence/probe-number-flag.txt](evidence/probe-number-flag.txt) |
| a0664 | src/director/packs/manifest.js:112 | `operand-order` | KILLED | [director-080] The edge order check starts with west and east |
| a0705 | src/director/packs/manifest.js:114 | `arguments` | EQUIVALENT | [evidence/probe-number-flag.txt](evidence/probe-number-flag.txt) |
| a0710 | src/director/packs/manifest.js:114 | `argument-drop` | EQUIVALENT | [evidence/probe-number-flag.txt](evidence/probe-number-flag.txt) |
| a0772 | src/director/packs/manifest.js:126 | `arguments` | KILLED | [director-082] The scene names the invalid declaration |
| a0790 | src/director/packs/manifest.js:128 | `arguments` | KILLED | [director-082] The scene names the invalid duplicate ID |
| a0792 | src/director/packs/manifest.js:128 | `argument-drop` | KILLED | [director-082] The scene names the invalid duplicate ID |
| a0812 | src/director/packs/manifest.js:132 | `arguments` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0819 | src/director/packs/manifest.js:133 | `statement` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0820 | src/director/packs/manifest.js:133 | `statement` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0821 | src/director/packs/manifest.js:133 | `statement` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0822 | src/director/packs/manifest.js:132 | `statement` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0824 | src/director/packs/manifest.js:133 | `arguments` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0825 | src/director/packs/manifest.js:133 | `arguments` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0827 | src/director/packs/manifest.js:133 | `argument-drop` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0828 | src/director/packs/manifest.js:133 | `argument-drop` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0829 | src/director/packs/manifest.js:133 | `constant` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0830 | src/director/packs/manifest.js:133 | `constant` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0831 | src/director/packs/manifest.js:133 | `limit` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0832 | src/director/packs/manifest.js:133 | `limit` | KILLED | [director-082] The shot accepts eight references and rejects nine references |
| a0842 | src/director/packs/manifest.js:134 | `operand-order` | KILLED | [director-082] The distinct reference check precedes the search for known IDs |
| a0863 | src/director/packs/manifest.js:135 | `arguments` | KILLED | [director-082] The scene names the invalid duplicate reference |
| a0865 | src/director/packs/manifest.js:135 | `argument-drop` | KILLED | [director-082] The scene names the invalid duplicate reference |
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
| a1326 | src/director/packs/session.js:8 | `condition` | KILLED | [director-089] The completed source listener ignores a later event after success |
| a1328 | src/director/packs/session.js:8 | `branch` | KILLED | [director-089] The completed source listener ignores a later event after success |
| a1335 | src/director/packs/session.js:9 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1336 | src/director/packs/session.js:9 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1342 | src/director/packs/session.js:10 | `arguments` | KILLED | [director-092] The source signal event stops work before the renderer |
| a1343 | src/director/packs/session.js:10 | `argument-drop` | KILLED | [director-092] The source signal event stops work before the renderer |
| a1344 | src/director/packs/session.js:10 | `method` | KILLED | [director-092] The source signal event stops work before the renderer |
| a1392 | src/director/packs/session.js:20 | `statement` | KILLED | [director-089] The completed source listener ignores a later event after success |
| a1393 | src/director/packs/session.js:20 | `statement` | KILLED | [director-089] The completed source listener ignores a later event after success |
| a1394 | src/director/packs/session.js:20 | `statement` | KILLED | [director-089] The completed source listener ignores a later event after success |
| a1395 | src/director/packs/session.js:19 | `statement` | KILLED | [director-089] The completed source listener ignores a later event after success |
| a1396 | src/director/packs/session.js:20 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1397 | src/director/packs/session.js:20 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1398 | src/director/packs/session.js:20 | `boolean` | KILLED | [director-089] The completed source listener ignores a later event after success |
| a1415 | src/director/packs/session.js:26 | `condition` | EQUIVALENT | [evidence/probe-late-rejection.txt](evidence/probe-late-rejection.txt) |
| a1417 | src/director/packs/session.js:26 | `branch` | EQUIVALENT | [evidence/probe-late-rejection.txt](evidence/probe-late-rejection.txt) |
| a1420 | src/director/packs/session.js:27 | `statement` | KILLED | [director-089] The completed source listener ignores a later event after error |
| a1421 | src/director/packs/session.js:27 | `statement` | KILLED | [director-089] The completed source listener ignores a later event after error |
| a1422 | src/director/packs/session.js:27 | `statement` | KILLED | [director-089] The completed source listener ignores a later event after error |
| a1423 | src/director/packs/session.js:26 | `statement` | KILLED | [director-089] The completed source listener ignores a later event after error |
| a1424 | src/director/packs/session.js:27 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1425 | src/director/packs/session.js:27 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1426 | src/director/packs/session.js:27 | `boolean` | KILLED | [director-089] The completed source listener ignores a later event after error |
| a1431 | src/director/packs/session.js:28 | `arguments` | EQUIVALENT | [evidence/probe-late-rejection.txt](evidence/probe-late-rejection.txt) |
| a1432 | src/director/packs/session.js:28 | `argument-drop` | EQUIVALENT | [evidence/probe-late-rejection.txt](evidence/probe-late-rejection.txt) |
| a1433 | src/director/packs/session.js:28 | `method` | KILLED | [director-090] The session rejects asset data from a source error |
| a1435 | src/director/packs/session.js:40 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a1436 | src/director/packs/session.js:40 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a1438 | src/director/packs/session.js:37 | `default` | KILLED | [director-088 director-092] The absent source map gives no source for a numeric name |
| a1439 | src/director/packs/session.js:37 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a1441 | src/director/packs/session.js:38 | `default` | KILLED | [director-088 director-092] The absent renderer map gives no renderer for a numeric name |
| a1442 | src/director/packs/session.js:38 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a1472 | src/director/packs/session.js:50 | `statement` | KILLED | [director-089] The session sets and removes the caller listener |
| a1473 | src/director/packs/session.js:50 | `statement` | KILLED | [director-089] The session sets and removes the caller listener |
| a1474 | src/director/packs/session.js:50 | `statement` | KILLED | [director-089] The session sets and removes the caller listener |
| a1475 | src/director/packs/session.js:49 | `statement` | KILLED | [director-089] The session sets and removes the caller listener |
| a1487 | src/director/packs/session.js:52 | `arguments` | EQUIVALENT | [evidence/probe-splice-default.txt](evidence/probe-splice-default.txt) |
| a1512 | src/director/packs/session.js:57 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1513 | src/director/packs/session.js:57 | `value` | EQUIVALENT | [evidence/probe-truth-state.txt](evidence/probe-truth-state.txt) |
| a1549 | src/director/packs/session.js:66 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a1550 | src/director/packs/session.js:66 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a1567 | src/director/packs/session.js:68 | `operand-order` | KILLED | [director-088] The session rejects a null list |
| a1613 | src/director/packs/session.js:74 | `operand-order` | KILLED | [director-088] The destroyed session does not read the caller signal state |
| a1618 | src/director/packs/session.js:75 | `condition` | KILLED | [director-088] The session accepts an empty list without asset work |
| a1620 | src/director/packs/session.js:75 | `statement` | KILLED | [director-088] The session accepts an empty list without asset work |
| a1623 | src/director/packs/session.js:75 | `predicate` | KILLED | [director-088] The session accepts an empty list without asset work |
| a1640 | src/director/packs/session.js:81 | `callback` | KILLED | [director-089] The session sets and removes the caller listener |
| a1641 | src/director/packs/session.js:81 | `callback` | KILLED | [director-089] The session sets and removes the caller listener |
| a1642 | src/director/packs/session.js:81 | `arguments` | KILLED | [director-089] The session sets and removes the caller listener |
| a1643 | src/director/packs/session.js:81 | `arguments` | KILLED | [director-089] The session sets and removes the caller listener |
| a1646 | src/director/packs/session.js:81 | `call-value` | KILLED | [director-089] The session sets and removes the caller listener |
| a1648 | src/director/packs/session.js:81 | `string` | KILLED | [director-089] The session sets and removes the caller listener |
| a1649 | src/director/packs/session.js:84 | `condition` | KILLED | [director-091] The old caller listener does not change new resources |
| a1651 | src/director/packs/session.js:84 | `branch` | KILLED | [director-091] The old caller listener does not change new resources |
| a1668 | src/director/packs/session.js:87 | `arguments` | KILLED | [director-089] The session sets and removes the caller listener |
| a1671 | src/director/packs/session.js:87 | `argument-drop` | KILLED | [director-089] The session sets and removes the caller listener |
| a1675 | src/director/packs/session.js:87 | `object` | KILLED | [director-089] The session sets and removes the caller listener |
| a1676 | src/director/packs/session.js:87 | `object` | KILLED | [director-089] The session sets and removes the caller listener |
| a1677 | src/director/packs/session.js:87 | `boolean` | KILLED | [director-089] The session sets and removes the caller listener |
| a1691 | src/director/packs/session.js:89 | `arguments` | KILLED | [director-092] The deadline gives its cause to the source signal |
| a1692 | src/director/packs/session.js:89 | `argument-drop` | KILLED | [director-092] The deadline gives its cause to the source signal |
| a1717 | src/director/packs/session.js:97 | `operand-order` | EQUIVALENT | [evidence/probe-registry-order.txt](evidence/probe-registry-order.txt) |
| a1722 | src/director/packs/session.js:98 | `exception` | KILLED | [director-092] The session does not read the global error property for absent source |
| a1757 | src/director/packs/session.js:107 | `statement` | KILLED | [director-090] The session checks its source signal before byte access and after renderer work |
| a1758 | src/director/packs/session.js:107 | `statement` | KILLED | [director-090] The session checks its source signal before byte access and after renderer work |
| a1759 | src/director/packs/session.js:107 | `statement` | KILLED | [director-090] The session checks its source signal before byte access and after renderer work |
| a1760 | src/director/packs/session.js:106 | `statement` | KILLED | [director-090] The session checks its source signal before byte access and after renderer work |
| a1772 | src/director/packs/session.js:110 | `operand-order` | KILLED | [director-093] The null bytes do not cause another declared length read |
| a1777 | src/director/packs/session.js:110 | `operand-order` | KILLED | [director-093] The session checks byte type before length access |
| a1782 | src/director/packs/session.js:110 | `operand-order` | KILLED | [director-093] The session checks byte type before length access |
| a1801 | src/director/packs/session.js:113 | `operand-order` | KILLED | [director-093] The absent declared length does not cause another byte length read |
| a1805 | src/director/packs/session.js:115 | `exception` | KILLED | [director-092] The session does not read the global error property for invalid bytes |
| a1822 | src/director/packs/session.js:118 | `exception` | KILLED | [director-092] The session does not read the global error property for excess total |
| a1873 | src/director/packs/session.js:128 | `exception` | KILLED | [director-092] The session does not read the global error property for wrong digest |
| a1908 | src/director/packs/session.js:135 | `operand-order` | EQUIVALENT | [evidence/probe-null-handle.txt](evidence/probe-null-handle.txt) |
| a1914 | src/director/packs/session.js:136 | `exception` | KILLED | [director-092] The session does not read the global error property for invalid handle |
| a1924 | src/director/packs/session.js:137 | `operand-order` | KILLED | [director-090] The detached handle check does not read the source signal state |
| a1944 | src/director/packs/session.js:144 | `statement` | KILLED | [director-090] The session checks its source signal before byte access and after renderer work |
| a1945 | src/director/packs/session.js:144 | `statement` | KILLED | [director-090] The session checks its source signal before byte access and after renderer work |
| a1946 | src/director/packs/session.js:144 | `statement` | KILLED | [director-090] The session checks its source signal before byte access and after renderer work |
| a1947 | src/director/packs/session.js:143 | `statement` | KILLED | [director-090] The session checks its source signal before byte access and after renderer work |
| a1972 | src/director/packs/session.js:149 | `operand-order` | KILLED | [director-090] The session observes destruction during caller signal access after a source error |
| a1977 | src/director/packs/session.js:149 | `operand-order` | KILLED | [director-090] The replaced load call does not read the caller signal state again |
| a2012 | src/director/packs/source.js:10 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a2017 | src/director/packs/source.js:10 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a2022 | src/director/packs/source.js:10 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a2027 | src/director/packs/source.js:10 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a2032 | src/director/packs/source.js:10 | `operand-order` | EQUIVALENT | [evidence/probe-url-fields.txt](evidence/probe-url-fields.txt) |
| a2210 | src/director/packs/source.js:57 | `value` | KILLED | [director-096] The source joins chunks of different lengths |
| a2254 | src/director/sharing/bundle.js:7 | `object` | KILLED | [director-102] The share limits reject a caller change |
| a2385 | src/director/sharing/bundle.js:32 | `relational` | KILLED | [director-101] The export reads no chunk past the asset end |
| a2439 | src/director/sharing/bundle.js:38 | `operand-order` | KILLED | [director-099] The base64 type check precedes text conversion |
| a2444 | src/director/sharing/bundle.js:38 | `operand-order` | KILLED | [director-099] The bundle rejects a null base64 |
| a2449 | src/director/sharing/bundle.js:38 | `operand-order` | KILLED | [director-099] The bundle rejects a null base64 |
| a2454 | src/director/sharing/bundle.js:38 | `operand-order` | KILLED | [director-099] The bundle rejects a null base64 |
| a2483 | src/director/sharing/bundle.js:40 | `number` | EQUIVALENT | [evidence/probe-aligned-base64-limit.txt](evidence/probe-aligned-base64-limit.txt) |
| a2504 | src/director/sharing/bundle.js:42 | `regex` | KILLED | [director-099] The bundle accepts base64 zz== |
| a2512 | src/director/sharing/bundle.js:43 | `operand-order` | EQUIVALENT | [evidence/probe-base64-tail.txt](evidence/probe-base64-tail.txt) |
| a2525 | src/director/sharing/bundle.js:43 | `regex` | KILLED | [director-099] The bundle rejects a leading equals sign |
| a2527 | src/director/sharing/bundle.js:43 | `regex` | KILLED | [director-099] The bundle accepts base64 ZZ== |
| a2528 | src/director/sharing/bundle.js:43 | `regex` | KILLED | [director-099] The bundle accepts base64 zz== |
| a2529 | src/director/sharing/bundle.js:43 | `regex` | KILLED | [director-099] The bundle accepts base64 99== |
| a2552 | src/director/sharing/bundle.js:46 | `arguments` | EQUIVALENT | [evidence/probe-character-index.txt](evidence/probe-character-index.txt) |
| a2553 | src/director/sharing/bundle.js:46 | `argument-drop` | EQUIVALENT | [evidence/probe-character-index.txt](evidence/probe-character-index.txt) |
| a2570 | src/director/sharing/bundle.js:50 | `operand-order` | KILLED | [director-102] The export checks the asset size before the total size |
| a2624 | src/director/sharing/bundle.js:62 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a2625 | src/director/sharing/bundle.js:62 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a2647 | src/director/sharing/bundle.js:65 | `operand-order` | KILLED | [director-098] The bundle rejects null text |
| a2680 | src/director/sharing/bundle.js:74 | `statement` | EQUIVALENT | [evidence/probe-repeat-json-error.txt](evidence/probe-repeat-json-error.txt) |
| a2681 | src/director/sharing/bundle.js:74 | `statement` | EQUIVALENT | [evidence/probe-repeat-json-error.txt](evidence/probe-repeat-json-error.txt) |
| a2683 | src/director/sharing/bundle.js:74 | `statement` | EQUIVALENT | [evidence/probe-repeat-json-error.txt](evidence/probe-repeat-json-error.txt) |
| a2684 | src/director/sharing/bundle.js:73 | `statement` | EQUIVALENT | [evidence/probe-repeat-json-error.txt](evidence/probe-repeat-json-error.txt) |
| a2685 | src/director/sharing/bundle.js:74 | `arguments` | KILLED | [director-098] The bundle names the invalid JSON path |
| a2687 | src/director/sharing/bundle.js:74 | `argument-drop` | KILLED | [director-098] The bundle names the invalid JSON path |
| a2745 | src/director/sharing/bundle.js:79 | `arguments` | KILLED | [director-099] The bundle names the invalid version |
| a2747 | src/director/sharing/bundle.js:79 | `argument-drop` | KILLED | [director-099] The bundle names the invalid version |
| a2787 | src/director/sharing/bundle.js:86 | `arguments` | KILLED | [director-099] The bundle names the invalid extra field |
| a2792 | src/director/sharing/bundle.js:86 | `string` | KILLED | [director-099] The bundle names the invalid extra field |
| a2805 | src/director/sharing/bundle.js:87 | `statement` | KILLED | [director-099] The bundle names the invalid path |
| a2806 | src/director/sharing/bundle.js:87 | `statement` | KILLED | [director-099] The bundle names the invalid path |
| a2807 | src/director/sharing/bundle.js:87 | `statement` | KILLED | [director-099] The bundle names the invalid path |
| a2808 | src/director/sharing/bundle.js:86 | `statement` | KILLED | [director-099] The bundle names the invalid path |
| a2827 | src/director/sharing/bundle.js:89 | `arguments` | KILLED | [director-099] The bundle names the invalid duplicate path |
| a2829 | src/director/sharing/bundle.js:89 | `argument-drop` | KILLED | [director-099] The bundle names the invalid duplicate path |
| a2869 | src/director/sharing/bundle.js:95 | `arguments` | KILLED | [director-100] The bundle names the invalid digest |
| a2871 | src/director/sharing/bundle.js:95 | `argument-drop` | KILLED | [director-100] The bundle names the invalid digest |
| a2906 | src/director/sharing/bundle.js:101 | `arguments` | KILLED | [director-100] The bundle names the invalid source |
| a2908 | src/director/sharing/bundle.js:101 | `argument-drop` | KILLED | [director-100] The bundle names the invalid source |
| a2945 | src/director/sharing/bundle.js:109 | `arguments` | KILLED | [director-100] The bundle names the invalid reference |
| a2947 | src/director/sharing/bundle.js:109 | `argument-drop` | KILLED | [director-100] The bundle names the invalid reference |
| a2958 | src/director/sharing/bundle.js:111 | `arguments` | KILLED | [director-100] The bundle names the invalid unused asset |
| a2960 | src/director/sharing/bundle.js:111 | `argument-drop` | KILLED | [director-100] The bundle names the invalid unused asset |
| a3048 | src/director/sharing/bundle.js:137 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a3049 | src/director/sharing/bundle.js:137 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a3054 | src/director/sharing/bundle.js:139 | `method` | EQUIVALENT | [evidence/probe-repeat-parser.txt](evidence/probe-repeat-parser.txt) |
| a3101 | src/director/sharing/bundle.js:149 | `arguments` | KILLED | [director-102] The export names excess asset entries |
| a3103 | src/director/sharing/bundle.js:149 | `argument-drop` | KILLED | [director-102] The export names excess asset entries |
| a3130 | src/director/sharing/bundle.js:155 | `arguments` | KILLED | [director-102] The export names the invalid absent asset |
| a3132 | src/director/sharing/bundle.js:155 | `argument-drop` | KILLED | [director-102] The export names the invalid absent asset |
| a3144 | src/director/sharing/bundle.js:157 | `operand` | KNOWN LIMIT | bundle-nonnumeric-length |
| a3150 | src/director/sharing/bundle.js:157 | `number` | KILLED | [director-102] The export keeps its total after an absent length |
| a3152 | src/director/sharing/bundle.js:157 | `number` | KILLED | [director-102] The export keeps its total after an absent length |
| a3186 | src/director/sharing/bundle.js:163 | `operand-order` | KILLED | [director-102] The export checks declared length before declared digest |
| a3192 | src/director/sharing/bundle.js:163 | `operand-order` | KILLED | [director-102] The export does not compare an absent declared length |
| a3201 | src/director/sharing/bundle.js:164 | `operand-order` | KILLED | [director-102] The absent digest stops its check after one field read |
| a3208 | src/director/sharing/bundle.js:166 | `arguments` | KILLED | [director-102] The export names the invalid declared length |
| a3210 | src/director/sharing/bundle.js:166 | `argument-drop` | KILLED | [director-102] The export names the invalid declared length |
| a3212 | src/director/sharing/bundle.js:167 | `arguments` | KILLED | [director-101] The filename slice starts at zero |
| a3234 | src/director/sharing/bundle.js:167 | `number` | KILLED | [director-101] The export limits each source filename to 160 characters |
| a3235 | src/director/sharing/bundle.js:167 | `number` | KILLED | [director-101] The export limits each source filename to 160 characters |
| a3236 | src/director/sharing/bundle.js:167 | `number` | KILLED | [director-101] The export limits each source filename to 160 characters |
| a3237 | src/director/sharing/bundle.js:167 | `number` | KILLED | [director-101] The export limits each source filename to 160 characters |
| a3295 | src/director/sharing/bundle.js:178 | `operand-order` | EQUIVALENT | [evidence/probe-digest-order.txt](evidence/probe-digest-order.txt) |
| a3301 | src/director/sharing/bundle.js:178 | `operand-order` | EQUIVALENT | [evidence/probe-digest-order.txt](evidence/probe-digest-order.txt) |
| a3310 | src/director/sharing/bundle.js:179 | `operand-order` | EQUIVALENT | [evidence/probe-digest-order.txt](evidence/probe-digest-order.txt) |
| a3320 | src/director/sharing/bundle.js:181 | `arguments` | KILLED | [director-103] The export names different shared integrity |
| a3322 | src/director/sharing/bundle.js:181 | `argument-drop` | KILLED | [director-103] The export names different shared integrity |
| a3403 | src/director/sharing/bundle.js:193 | `arguments` | KILLED | [director-102] The export checks its encoded text budget |
| a3405 | src/director/sharing/bundle.js:193 | `argument-drop` | KILLED | [director-102] The export checks its encoded text budget |
| a3424 | src/director/sharing/bundle.js:201 | `default` | EQUIVALENT | [evidence/probe-empty-map.txt](evidence/probe-empty-map.txt) |
| a3477 | src/director/sharing/bundle.js:212 | `default` | KILLED | [director-105] The byte store accepts its default byte limit |
| a3484 | src/director/sharing/bundle.js:214 | `statement` | KILLED | [director-105] The byte store rejects an unsafe path before its lookup |
| a3485 | src/director/sharing/bundle.js:214 | `statement` | KILLED | [director-105] The byte store rejects an unsafe path before its lookup |
| a3486 | src/director/sharing/bundle.js:214 | `statement` | KILLED | [director-105] The byte store rejects an unsafe path before its lookup |
| a3487 | src/director/sharing/bundle.js:213 | `statement` | KILLED | [director-105] The byte store rejects an unsafe path before its lookup |
| a3635 | src/director/sharing/preview.js:6 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a3636 | src/director/sharing/preview.js:6 | `default` | EQUIVALENT | [evidence/probe-empty-options.txt](evidence/probe-empty-options.txt) |
| a3637 | src/director/sharing/preview.js:6 | `default` | EQUIVALENT | [evidence/probe-empty-set.txt](evidence/probe-empty-set.txt) |
| a3638 | src/director/sharing/preview.js:6 | `default` | KILLED | [director-109 director-110] The preview uses empty source and layer lists |
| a3640 | src/director/sharing/preview.js:6 | `default` | EQUIVALENT | [evidence/probe-empty-set.txt](evidence/probe-empty-set.txt) |
| a3641 | src/director/sharing/preview.js:6 | `default` | KILLED | [director-109 director-110] The preview uses empty source and layer lists |
| a3788 | src/director/sharing/preview.js:33 | `operand` | EQUIVALENT | [evidence/probe-empty-keys.txt](evidence/probe-empty-keys.txt) |
| a3818 | src/director/sharing/preview.js:39 | `operand-order` | KILLED | [director-110] The applied shot packs decide external content before source pack IDs |

## Counts by class

| class | killed | equivalent | limit | open |
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
| `statement` | 45 | 4 | 0 | 0 |
| `arguments` | 39 | 6 | 0 | 0 |
| `argument-drop` | 27 | 5 | 0 | 0 |
| `operand-order` | 28 | 20 | 1 | 0 |
| `predicate` | 1 | 0 | 0 | 0 |
