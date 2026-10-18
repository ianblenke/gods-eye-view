## Context

The coverage gate counts the code of an HTML file with `inlineScriptLines()`. It counts the lines of code in a script element without a src attribute. It also counts each event handler attribute and each `javascript:` URL.
An HTML file without such code is complete, and the gate has no line data for it (`coverage-gate-012`).
The diff coverage gate (`ownership-007`) asks covered line data for each changed line of each code file in the inventory. An HTML file is a code file, so each changed line of markup gets COVERAGE-DIFF.

## Decisions

### D1: The code lines of an HTML file

`htmlCodeLines(html)` gives a set of line numbers, from 1.
For each script element whose start tag has no src attribute, it adds each line of its code that is not blank. The test for the src attribute is the test of `inlineScriptLines()`: a quoted value does not count.

For each event handler attribute outside the script elements, it adds each line from the attribute name to the end of the value. The value ends at its second quote, or at the first white space or `>` of a value without quotes. A value with no second quote ends at the end of the file.
For each `javascript:` URL outside the script elements, it adds each line from the URL to the first quote or `>` after it. With no such character, it adds only the line of the URL.

The pattern of an event handler attribute starts with a white space character. When that character is a line end, the attribute starts on the next line, and the function starts at that next line.
A value or a URL can continue on more lines. The measure counts each attribute and each URL as code, so each of their lines must stay a changed line.

### D2: The place of the filter

`syncChangedLines()` reads the changed lines of all files, and then it removes the lines that the adopt source brings.
The change keeps only the code lines of each HTML file directly after the first read. So the three counts of the advice line count the same lines as the gate.
`changedLines()` does not change, because its tests give the raw diff lines.

### D3: No change for other files

The filter applies only to a file name that ends in `.html`. A JavaScript file and a shell file keep each changed line.

## Faults

The tests must fail for each of these faults:

- The filter in `syncChangedLines()` is not there.
- The function does not add the lines of code in a script element.
- The function does not add the lines of an event handler attribute.
- The function does not add the lines of a `javascript:` URL.
- The function counts a script element with a src attribute.
- The function takes a src text in a quoted value as a src attribute.
- The function takes the line before an attribute that starts after a line end.
- The function counts a blank line in a script element.
- The function adds only the first line of an event handler attribute.
- The function adds only the first line of a `javascript:` URL.
- The function does not skip the white space before an attribute value.
