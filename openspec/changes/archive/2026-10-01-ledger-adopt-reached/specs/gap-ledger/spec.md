## MODIFIED Requirements

### Requirement: Adoption of merged code
The ledger command `adopt` MUST record the gaps of the files that a merge commit brought into the tree. The gates MUST allow a ledger entry above the base entry, up to the adopted count of each metric. The adopted count of a metric for a file is the largest count in its valid adopt lines, and 0 with no such line. A merged commit is a parent, other than the first parent, of a merge commit between the base commit and HEAD. An adopt line is valid when the scenarios `gap-ledger-095`, `gap-ledger-096` and `gap-ledger-097` do not reject it.
Origin: spec-first

#### Scenario: Record the gaps of the merged files `gap-ledger-089`
- **WHEN** you run the ledger command `adopt` with a change name and the option `--from`
- **AND** the change is active, and the ledger file is there
- **AND** the option names a merged commit
- **AND** the content of a tracked file is not equal to its content in the base commit
- **AND** the merged commit changed the file since its merge base with the base commit
- **AND** the file is a code file with a not-covered count above 0, or a test file with untraced tests
- **THEN** the command writes the ledger entry of the file with the measured counts and the content hash
- **AND** the entry keeps its origin and its date when the ledger had an entry
- **AND** the entry gets the change name and the date when the ledger had none
- **AND** the command adds one line to `openspec/trace/history.jsonl` with the kind `adopt`
- **AND** the line has the date, the change name, the head commit and the file
- **AND** the line also has the full hash of the merged commit and the not-covered counts
- **AND** the line also has the number of untraced tests of the file and the mark for untrue coverage
- **AND** the line has `null` for each not-covered count of a test file
- **AND** the command changes no entry of a file that does not have these conditions
- **AND** the command does not change the registry or the links
- **AND** the command writes nothing when the measurement has an error, such as a failed test

#### Scenario: Stop the adopt command for a fault before it runs a test `gap-ledger-090`
- **WHEN** you run the ledger command `adopt` with a fault
- **AND** a fault is one of these: the change is not active, the option `--from` is not there, or Git cannot find the commit
- **AND** a fault is also one of these: the commit is not a merged commit, or the ledger file is not there
- **THEN** the command stops and shows the fault
- **AND** the command runs no test and does not change `openspec/trace/gaps.json` or `openspec/trace/history.jsonl`

#### Scenario: Adopt no gap of a file that the merged commit did not change `gap-ledger-091`
- **WHEN** you run the ledger command `adopt` with correct options for a file without the conditions of `gap-ledger-100`
- **AND** a code file has a not-covered count above 0, or a test file has untraced tests
- **AND** the content of the file is equal to its content in the base commit, or the merged commit did not change the file
- **THEN** the command writes no entry and no history line for that file

#### Scenario: Allow a ledger entry that the base does not have for an adopted file `gap-ledger-092`
- **WHEN** the ledger has an entry for a file
- **AND** the base ledger has no entry for that file
- **AND** the content of the file is not equal to its content in the base commit
- **AND** the file has one or more valid adopt lines of the checked change
- **AND** for a coverage entry, each not-covered count is not above the adopted count of its metric
- **AND** for an entry of untraced test names, the number of untraced tests is not above the adopted count of untraced tests
- **AND** the entry does not record untrue coverage, or the conditions of `gap-ledger-098` are true for the file
- **THEN** the gate does not stop the build for that entry

#### Scenario: Allow a rise above the base entry up to the adopted count `gap-ledger-093`
- **WHEN** the content of a file is not equal to its content in the base commit
- **AND** its ledger entry has more not-covered lines, branches or functions than the base entry
- **AND** the count of the entry is not above the adopted count of that metric
- **THEN** the gate does not stop the build for that metric
- **AND** a count above the adopted count and above the base count plus the waived count stops the build

#### Scenario: Allow an entry with more untraced tests than the base entry when its number of untraced tests is not above the adopted count `gap-ledger-094`
- **WHEN** a test file has a ledger entry and a base ledger entry
- **AND** the content of the file is not equal to its content in the base commit
- **AND** the entry has a test name that the base entry does not have, or a name with a higher count
- **AND** the number of untraced tests of the entry is not above the adopted count of untraced tests
- **THEN** the gate does not stop the build for these test names
- **AND** a number above the adopted count stops the build for each of these test names

#### Scenario: Give no adopted count for a line that is not valid `gap-ledger-095`
- **WHEN** an adopt line is in the base history, or it has another change name
- **THEN** the adopted count of its file does not include the line
- **AND** a line whose field `file` or field `from` is not a string gives no adopted count
- **AND** a line with a not-covered count that is not `null` and not a whole number of 0 or more gives no adopted count
- **AND** a line whose number of untraced tests is not a whole number of 0 or more gives no adopted count
- **AND** the gate shows no error for such a line, and it shows the same errors as it shows with no such line
- **AND** the gate does not check the head commit and the date of an adopt line

#### Scenario: Stop for an adopt line with a commit that is not a merged commit `gap-ledger-096`
- **WHEN** an adopt line of the checked change names a commit that is not a merged commit
- **AND** the scenario `gap-ledger-095` does not reject the line
- **AND** the line does not have the field `reached` with the value `true`
- **THEN** the gate stops the build with the code `LEDGER-ADOPT-FROM`
- **AND** the adopted count of the file does not include that line

#### Scenario: Stop for an adopt line with a file that the merged commit did not change `gap-ledger-097`
- **WHEN** an adopt line of the checked change names a merged commit and a file
- **AND** the scenario `gap-ledger-095` does not reject the line
- **AND** the line does not have the field `reached` with the value `true`
- **AND** the file has the same content in the merged commit as at the merge base of that commit and the base commit
- **THEN** the gate stops the build with the code `LEDGER-ADOPT-FILE`
- **AND** the adopted count of the file does not include that line

#### Scenario: Allow untrue coverage of an adopted file `gap-ledger-098`
- **WHEN** a ledger entry records untrue coverage
- **AND** the same entry in the base ledger does not record untrue coverage, or the base ledger has no entry for the file
- **AND** the content of the file is not equal to its content in the base commit
- **AND** a valid adopt line of the checked change names the file and records untrue coverage
- **THEN** the gate does not stop the build for the untrue coverage

#### Scenario: Run the adopt command with make `gap-ledger-099`
- **WHEN** a test reads `Makefile`
- **THEN** the target `adopt` runs the gate command `adopt` in the Docker image with the options `CHANGE`, `BASE` and `FROM`
- **AND** the target uses the same copy and copy-back steps as the target `ratchet`


#### Scenario: Record a reached file with untrue coverage `gap-ledger-100`
- **WHEN** you run `adopt` with correct options and a merged commit
- **AND** a tracked code file has the same content as in the base commit and measured untrue coverage
- **AND** the base ledger has no entry for the file, or its entry has an `untrue` field that is false
- **AND** a path of static or literal dynamic relative imports leads from a code file that the merged commit changed to the file
- **AND** the path uses the edges of the HEAD graph
- **AND** at least one edge of that path exists in the merged commit graph and is absent in the base graph
- **AND** an edge is a pair of two code files: the file that has the import and the file that it imports
- **THEN** the command writes the measured gap and one adopt line for the file
- **AND** the adopt line has `untrue: true` and `untraced: 0`
- **AND** the entry keeps its origin and date when an entry exists

#### Scenario: Reject a reached file with true coverage `gap-ledger-101`
- **WHEN** a file with the same content as in the base commit has an import path with a new edge but true coverage
- **THEN** the command writes no entry or history line for the file
- **AND** the command also rejects a file whose base entry does not have an `untrue` field that is false

#### Scenario: Reject a file without an import path `gap-ledger-102`
- **WHEN** a code file has the same content as in the base commit and measured untrue coverage
- **AND** no import path with a new edge leads from a code file that the merged commit changed to the file
- **AND** a new edge must exist in the merged commit graph and be absent in the base graph
- **THEN** the command writes no entry or history line for the file
- **AND** a test file cannot supply the import path or become a reached file

#### Scenario: Use the old rule for other content `gap-ledger-103`
- **WHEN** a file has an import path with a new edge from a code file that the merged commit changed
- **AND** its content is not equal to its content in the base commit
- **THEN** the command rejects the reached exception for that file
- **AND** the old rule adopts its gap only when the merged commit changed the file

#### Scenario: Allow a valid reached adopt line `gap-ledger-104`
- **WHEN** a reached adopt line has all the conditions of `gap-ledger-100`
- **THEN** the gate allows a ledger entry up to its adopted counts
- **AND** the gate allows a new entry or a rise above the base entry
- **AND** the gate stops the build for a count above that limit
- **AND** the gate allows the measured null branch and function counts and the new total counts
- **AND** the gate does not stop the build for the untrue coverage of the file with the base content

#### Scenario: Stop for a reached adopt line that is not valid `gap-ledger-105`
- **WHEN** a reached adopt line lacks a condition of `gap-ledger-100`, including its new-edge condition
- **AND** the reached adopt line also lacks a condition when `untrue` is not true or `untraced` is not 0
- **THEN** the gate reports `LEDGER-ADOPT-REACHED` and names the file
- **AND** a reached adopt line that is not valid gives no adopted count
- **AND** this rule replaces the commit and file errors for a reached adopt line

#### Scenario: Record the reached field `gap-ledger-106`
- **WHEN** the command writes an adopt line for a reached file
- **THEN** the reached adopt line has boolean `reached: true` and boolean `untrue: true`
- **AND** the reached adopt line has the same other fields as an old adopt line
- **AND** an adopt line for a changed file has no reached field

#### Scenario: Reject a path with only base edges `gap-ledger-107`
- **WHEN** a code file has the base content and measured untrue coverage
- **AND** every edge of each import path from a code file that the merged commit changed exists in the base graph
- **AND** a new edge must exist in the merged commit graph and be absent in the base graph
- **THEN** the command writes no entry or history line for that file
- **AND** the gate stops the build with `LEDGER-ADOPT-REACHED` for a reached adopt line that names the file

#### Scenario: Allow a path with a new middle edge `gap-ledger-108`
- **WHEN** a code file has all the other conditions of `gap-ledger-100`
- **AND** its import path has an edge of the merged commit graph absent in the base graph, between base edges
- **THEN** the command writes the entry and adopt line for the file
- **AND** the gate allows the valid reached adopt line
- **AND** a cycle ends because the search visits each file and new-edge state once
- **AND** the base graph resolves imports only to tracked code files of the base commit

#### Scenario: Reject a path with only an author-added new edge `gap-ledger-109`
- **WHEN** a code file has all the other conditions of `gap-ledger-100`
- **AND** its HEAD import path has an edge absent in the base graph
- **AND** every such edge is absent in the merged commit graph
- **THEN** the command writes no entry or history line for the file
- **AND** the gate stops the build with `LEDGER-ADOPT-REACHED` for a reached adopt line that names the file
