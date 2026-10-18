## Context

The coverage gate counts the code of an HTML file with `inlineScriptLines()`. It counts the lines of code in a script element without a src attribute. It also counts each event handler attribute and each `javascript:` URL.
An HTML file without such code is complete, and the gate has no line data for it (`coverage-gate-012`).

The diff coverage gate (`ownership-007`) asks covered line data for each changed line of each code file in the inventory. An HTML file is a code file. So each added or edited line of markup gets COVERAGE-DIFF, unless it equals the file in the adopt source in a sync.

## Decisions

### D1: The code lines of an HTML file

`htmlCodeLines(html)` gives a set of line numbers, from 1.

For each script element whose start tag has no src attribute, it adds each line of the start tag. It also adds each line of the text that is not blank. The test for the src attribute is the test of `inlineScriptLines()`: a quoted value does not count.
The start tag lines are code lines because a change that removes a src attribute makes the text of that element code.
A script element with a src attribute gives code lines only for a start tag with an event handler attribute or a `javascript:` URL. Its text gives no code line.

For each event handler attribute outside the script elements, it adds each line from the attribute name to the end of the value. The value ends at the next quote of the same type, or at the first white space or `>` of a value without quotes. A value with no end quote ends at the end of the file.

For each `javascript:` URL outside the script elements, it adds each line of the URL. A URL can follow `=` and a quote, with white space before or after the quote. Such a URL ends at the next quote of the same type, or at the end of the file. Another URL ends at the first quote or `>` after it. With no such character, the function adds only the line of the URL.

The pattern of an event handler attribute starts with a white space character. When that character is a line end, the attribute starts on the next line, and the function starts at that next line.
A value or a URL can continue on more lines. The measure counts each attribute and each URL as code, so each of their lines must stay a changed line.

### D2: The place of the filter

`syncChangedLines()` reads the changed lines of all files, and then it removes the lines that the adopt source brings.
The change keeps only the code lines of each HTML file directly after `syncChangedLines()` reads the changed lines. So the three counts of the advice line count the same lines as the gate.
`changedLines()` does not change, because its tests give the raw diff lines.

### D3: No change for other files

The filter is only for a file name that ends in `.html`. A JavaScript file and a shell file keep each changed line.

### D4: The texts that state the rule

The Purpose of the ownership spec, rule 5 of `AGENTS.md` and `openspec/config.yaml` say that each changed line needs coverage. Each one gets one more sentence for HTML files. The sentences that the test of `ownership-012` checks stay as they are.

## Faults

The tests must fail for each of these faults:

- The filter in `syncChangedLines()` is not there.
- The function does not add the lines of the text of a script element.
- The function does not add the lines of a start tag.
- The function counts the text lines from the start of the start tag.
- The function does not add the lines of an event handler attribute.
- The function does not add the lines of a `javascript:` URL.
- The function counts a script element with a src attribute.
- The function takes a src text in a quoted value as a src attribute.
- The function takes the line before an attribute that starts after a line end.
- The function counts a blank line in a script element.
- The function adds only the first line of an event handler attribute.
- The function does not skip the white space before an attribute value.
- A URL in a quoted value ends at the first quote of either type.
- A URL in a quoted value with no end quote gives only its first line.
- A URL outside a quoted value gives only its first line.
- A URL with no quote or `>` after it continues to the end of the file.
- The function does not add the start tag of a script element with a src attribute and a handler.
- The function does not add the start tag of a script element with a src attribute and a URL.
- A URL value can only be in double quotes.
- The function does not take white space after the quote of a URL value.
- The function does not take white space before the quote of a URL value.
