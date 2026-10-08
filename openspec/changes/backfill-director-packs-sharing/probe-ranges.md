# Probe input limits

Base commit: `290b5d2`.

HTTP means Hypertext Transfer Protocol.
HTTPS means HTTP with a secure connection.

The table checks the input limits of the 22 pass 4 probe groups.
A sample alone does not prove that a mutation is equivalent.
Each claim also needs the code guard in the last column.
The claims use the public API of the module with standard built-in functions.
The claims exclude mutations of built-in functions and their prototypes.

| probe | Original input cases | Other public input classes | Code guard or pass 5 check |
| --- | --- | --- | --- |
| aligned-base64-limit | Lengths 11184812, 11184813 and 11184816. | Empty text, unusual characters and large text. | The alignment validation rejects every length between adjacent multiples of four. The same byte check rejects excess decoded bytes. |
| base64-tail | `AQID`, `AA==`, null, an object, `=AA=` and `zZ09`. | +, /, empty text and large text. | The type guard accepts only primitive strings. Both checks are pure and give the same error. New tests use + and /. |
| character-index | Three decoded bytes. | Every byte from 0 to 255 and large arrays. | atob returns a primitive string. Each callback receives one character. An absent index and zero select that character. |
| digest-order | Absent and valid integrity, wrong length, wrong digest and resolver getters. | Empty declarations, prototype keys and custom callbacks. | The serializer makes plain copies. The cache stores plain values. A later resolver cannot use a cached entry. |
| empty-keys | Null layers and a named layer with a getter. | Empty values, unusual names and prototype keys. | Object.keys ignores inherited keys. False and an empty object each give no keys. |
| empty-map | An absent replacement map and one stored asset. | Null, false, zero, empty text and custom iterables. | The default applies only to undefined. new Map(undefined) and new Map() each create an empty map. |
| empty-options | Absent options, absent registries and empty work. | Null options, custom prototypes and getters. | A default applies only to undefined. Its primitive replacement supplies the same absent fields under standard prototypes. |
| empty-set | Absent source and layer IDs. | Empty values and custom iterables. | The default applies only to undefined. Set accepts undefined as an empty input. Other inputs bypass the default. |
| feature-order | Null features, wrong feature types and numeric IDs. | Blank IDs, unusual characters and prototype keys. | JSON.parse makes plain feature values. Both predicates reject with the same error before geometry work. |
| height-order | Two coordinates, height -12000, height 1000000000 and invalid positions. | NaN, Infinity, inherited height and height beyond each limit. | Three-coordinate JSON arrays contain plain values at index 2. The finite-value validation comes before both height comparisons. |
| late-rejection | Source success, source error, cancellation and late error. | Repeated callbacks, custom reasons and getters. | A promise settles once. A late rejection cannot change its result. The outer catch gives the same stable error. |
| line-end | Null lines and lines of two or three positions. | Long lines, empty lines and inherited coordinates. | The decoder makes numeric output arrays before the end validation. The comparison has no caller getter. |
| null-handle | Null and valid renderer handles. | Other false values, absent dispose and dispose getters. | Both orders reject a false handle with the same stable error. A true handle reads dispose in both orders. |
| number-flag | Absent byteLength, numeric text, 1, 0 and 1.5. | NaN, Infinity and numeric limits. | False and undefined each disable conversion in number(). Both calls check the same value and limits. |
| position-counter | Valid positions and invalid longitude, latitude or height. | 49999, 50000 and 50001 positions. | The counter is private. An invalid position ends the call. Every valid position increases the counter once. |
| registry-order | Valid and absent sources and renderers. | Inherited names, getters and both registries absent. | The session copies entries into private Maps. Both guard operands are plain local values. |
| repeat-json-error | One character: {. | Invalid JSON from 5242881 to 52428800 characters. | The claim was false. New director-098 tests check both limits and the bundle file path. |
| repeat-parser | Valid projects, invalid versions, getters and resolver calls. | Huge text, unusual characters and prototype keys. | stringifySceneDocument validates the same text before the second call to parseSceneDocument. Invalid or excess text fails before that call. |
| ring-default | Open lines of two or three positions. | Empty lines, long lines and polygon rings. | Undefined and false each select the open-line branch. Polygon calls supply true and bypass the default. |
| splice-default | Empty sessions, completed handles and cancelled work. | Multiple handles, repeated clear calls and late handles. | Splice converts both undefined and zero to index zero. The handle array is private. |
| truth-state | Success, errors, cancellation and disposal. | Repeated callbacks and custom signal state. | The mutated state is private. The code uses only its truth value. True, 1 and an empty array are true. |
| url-fields | HTTPS, HTTP, credentials, query, fragment and no final slash. | Unicode paths and each forbidden field alone. | URL converts the caller input once. Its standard fields are plain values during both guard orders. |

The older export-parser probe checks the same validator claim as repeat-parser.
The inherited-height, signal-getter and bundle-nonnumeric-length probes record Known limits.
They do not support an equivalent claim.

The 21 expanded equivalent probes pass.
The pass retires the JSON probe because its claim was false.
The four mutations from that probe now fail a tagged test.
