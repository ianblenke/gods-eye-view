## Source

Commit read: `e2437f945215860c42b5d8bba6834c85f93a90ce`.

## Decision

Add the optional predicate adoptedAsIs to compareLedger and ratchetLedger. Its default returns false.
The content hash must equal the hash in the ledger entry.
Both the ledger entry and the current gap must show true coverage from a test that loads the file.
The file must also have base content or equal its adopted source.

The gate reads adopt lines through adoptsOf for the checked change after the base history prefix.
The gate uses checkAdopts to check the merged commit, the changed file set and the reached rule.

Only valid adopt lines supply evidence of adopted source content.
The gate compares current file text with its content at the from commit.
An absent current file gives no evidence.
If the current file differs from its content at the from commit, the file gives no evidence.
This includes a conflict that a person resolves by hand.

A file with the adopted-source conditions can have count tolerance without base content. Another change or an invalid adopt line gives no count tolerance.
The gate still reports LEDGER-ADOPT-FROM and the other adopt errors.
The gate computes adoptedAsIs before the ratchet command and the ledger comparison.
The ci command selects the change first. The ci, check and ratchet commands use the same predicate.

The ratchet command uses toleranceCounts when a file has the tolerance conditions, also when adoptedAsIs returns true.

For a file with the adopted-source conditions and no base content, the ratchet command uses neverWorseCounts.
An adopt line has no total counts.
compareWithBase limits the ledger entry of a file with no base content by the adopted counts.
If the base ledger also has that file, the limit is the larger of two numbers.
These numbers are the adopted count, and the base count plus the waived count.

The covered-count rule of toleranceCounts cannot apply to that file.
neverWorseCounts selects the counts of each metric separately.

neverWorseCounts selects current counts for each metric.
This applies when its current not-covered count is smaller than or equal to its ledger entry not-covered count.
Those counts are the current not-covered count and total count.
For each metric, neverWorseCounts selects ledger entry counts when the current not-covered count is larger than the ledger entry not-covered count of that metric.
Those counts are the ledger entry not-covered count and total count.

If the ledger entry total count is absent, neverWorseCounts selects the current gap total count.
This change adds no error code and changes no count comparison of compareLedger, compareWithBase and toleranceOf.
The stale exception of the requirement Total counts for adopted files is the only change to LEDGER-STALE.

### Total count exception

Commit read: `125dc3ae92f9687a830e230914ec0e2b393dda18`.
Add the optional adoptedFile predicate to compareLedger. Its default returns false.
The gate computes adoptedFile from the same valid adopt lines as adoptedAsIs, without an adopted source content check.

The gate accepts total differences only with equal hashes, true loaded coverage and equal not-covered counts of lines, branches and functions.
The requirement "Total counts for adopted files" gives this exception to the stale rule.
compareLedger applies all coverage error rules. The ratchet command applies its existing rule for total counts to files without base content that differ from their adopted source.

## Files

Change scripts/spec/lib/ledger.mjs and scripts/spec/gates.mjs.
Add tests to src/tooling/spec/ledger.test.mjs and src/tooling/spec/gates.test.mjs.
Do not change the first sentence of Count tolerance. Add a separate requirement for the adopted-source conditions.
The requirement "Count tolerance for adopted files" adds an exception to the base content condition.

## Checks

Use host tests with one file per Node process. Use cores 0 through 3 and priority 19.

Measure line, branch and function coverage. Run named mutations and automatic code mutations.
Replay the real CI artifact against a scratch copy of upstream-sync-3.
Run only the lint command from the gate CLI. The lead runs the ratchet command, image gates and reviews.

### Pass 5 words

| Word | Meaning |
| --- | --- |
| file that equals its adopted source | File with current content equal to its adopted source. |
| title Count tolerance for adopted files | Adopted files means files with the adopted-source conditions. |
| title Total counts for adopted files | Adopted files means files with a valid adopt line of the checked change. |
| file with a valid adopt line | File that a valid adopt line of the checked change names, with any current content. |
| adopt line | History line with the kind adopt. |
| valid adopt line | Adopt line that meets Adoption of merged code. |
| adopted-source conditions | Loaded file, true coverage, equal ledger content hash, and content equal to its adopted source through a valid adopt line of the checked change. |
| adopted source | Content of the file at the `from` commit. |
| ledger entry | Coverage record in gaps.json. |
| current gap | Coverage record from the current measurement. |
| content hash | Hash of file content. |
| not-covered count | Count of items that tests do not cover. |
| total count | Count of all measured items. |
| stale | Ledger entry state that stops the build until the ratchet command runs. The base specs call it not current. |
| tolerance | Allowed count difference. |
| count tolerance | Rule from the requirement Count tolerance. |
| check command | Command that checks the current tree. |
| ci command | Command that selects the change and checks the current tree. |
| ratchet command | Command that writes ledger counts and compares the ledger with the base ledger. |
| merged commit | A parent of a merge commit, except the first parent. |
| base commit | The commit that the gate compares with the checked tree. |
| main commit e2437f94 | Main commit before this change. |
| pass 1 commit 125dc3ae | Tree after pass 1. |
| gate | Code that checks the spec and ledger rules. |
| tolerant file | File with the tolerance conditions or the adopted-source conditions. |
| toleranceCounts | Function that selects counts for a file with base content and count tolerance. |
| never-worse counts | For each metric: current counts if the current not-covered count is smaller than or equal to the ledger entry not-covered count of that metric. Ledger entry counts if not. The current gap total count instead of an absent ledger entry total count. |
| neverWorseCounts | Function that selects never-worse counts. |
| adoptedAsIs | Predicate for a file that equals its adopted source. |
| adoptedFile | Predicate for a file with a valid adopt line of the checked change. |
| current measurement | Coverage data from the test command. |
| covered count | Total count minus not-covered count. |
| base content | File content at the base commit. |
| file with base content | File with current content equal to its content at the base commit. |
| tolerance conditions | Loaded file, true coverage, base content and equal ledger content hash, from the requirement Count tolerance. |
| reached adopt line | Adopt line with reached true, under Adoption of merged code. |
| person who merges | Person who checks rule 21 and records the result in review.md. |
| upstream remote | Git remote that has the merged commit. |
| compareLedger | Function that compares current gaps with ledger entries. |
| ratchetLedger | Function that selects ledger entries and history lines. |
| adoptsOf | Function that selects adopt lines of the checked change. |
| checkAdopts | Function that checks adopt lines. |
| toleranceOf | Function that computes the count tolerance. |
| compareWithBase | Function that compares the ledger with the base ledger. |
| lead | Person who decides design corrections, runs image checks and gets both review passes. |
| metric | Lines, branches or functions. |
| history line | JSON object in history.jsonl. |
| base ledger | Ledger at the base commit. |
| test | Node test that calls a method of node:assert. |
| fork | This project with changes to upstream code. |
| sync | Change that merges upstream code into this project. |
| CI artifact | Coverage and guard files from the CI run. |
| hand-edit check | Base comparison that rejects ledger changes without history evidence. |
| V8 split | One measured range becomes two ranges. |
| host | Machine that runs Node commands outside the image. |
| Node process | Process that runs one Node command. |
| fixture | Temporary Git project for a gate test. |
| script copy | Tool that reads the CI artifact with copies of the gate predicates. |
| scratch root | Copy of a project tree for a host command. |
| mutation | Code change that tests must reject. |
| probe | Command that compares two code versions. |
| code AST | JavaScript syntax tree without comments or source offsets. |

### Pass 7 words

| Word | Meaning |
| --- | --- |
| adopted count | Largest not-covered count of a metric for a file in its valid adopt lines of the checked change. Zero with no such line. |
| base count | Not-covered count of a metric for a file in the base ledger. |
| ledger entry not-covered count | Not-covered count of a ledger entry. |
| ledger entry total count | Total count of a ledger entry. |
| current gap total count | Total count of the current gap. |
