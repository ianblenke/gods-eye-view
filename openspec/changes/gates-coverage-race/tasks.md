## 1. Specs and tests

- [x] 1.1 Write the proposal, design and added specs.

- [x] 1.2 Write the test for `coverage-gate-055` before its code.
  Mutation: Use the second block. The test must fail.

```js
? 1 : 0
```

```js
? 0 : 0
```

- [x] 1.3 Write the test for `coverage-gate-056` before its code.
  Mutation: Use the second block. The test must fail.

```js
match[1] ?? '1'
```

```js
undefined ?? '1'
```

- [x] 1.4 Write the test for `coverage-gate-057` before its code.
  Mutation: Use the second block. The test must fail.

```js
if (index > 0) item.counted = true;
```

```js
if (false) item.counted = true;
```

- [x] 1.5 Write the test for `coverage-gate-058` before its code.
  Mutation: Use the second block. The test must fail.

```js
lines[index].count > 0 || lines[index].ignore
```

```js
lines[index].ignore
```

- [x] 1.6 Write the test for `coverage-gate-059` before its code.
  Mutation: Use the second block. The test must fail.

```js
[fn.functionName, fn.ranges[0].startOffset, fn.ranges[0].endOffset]
```

```js
[fn.ranges[0].startOffset, fn.ranges[0].endOffset]
```

- [x] 1.7 Write the test for `coverage-gate-060` before its code.
  Mutation: Use the second block. The test must fail.

```js
return parent.covered;
```

```js
return false;
```

- [x] 1.8 Write the test for `coverage-gate-061` before its code.
  Mutation: Use the second block. The test must fail.

```js
occurrences.get(extent) ?? 0
```

```js
undefined ?? 0
```

- [x] 1.9 Write the test for `coverage-gate-062` before its code.
  Mutation: Use the second block. The test must fail.

```js
for (const state of states) {
```

```js
for (const state of states.slice(0, 1)) {
```

- [x] 1.10 Write the test for `coverage-gate-063` before its code.
  Mutation: Use the second block. The test must fail.

```js
for (const script of process.result) {
```

```js
for (const script of process.result.slice(0, 1)) {
```

- [x] 1.11 Write the test for `coverage-gate-064` before its code.
  Mutation: Use the second block. The test must fail.

```js
NODE_V8_COVERAGE: coverageDir
```

```js
NODE_V8_COVERAGE: '/wrong'
```

- [x] 1.12 Write the test for `coverage-gate-065` before its code.
  Mutation: Use the second block. The test must fail.

```js
return !loaded.has(source[1]);
```

```js
return loaded.has(source[1]);
```

- [x] 1.13 Write the test for `gap-ledger-110` before its code.
  Mutation: Use the second block. The test must fail.

```js
next.coverage[record.file] = { ...gap, ...origin };
```

```js
next.coverage[record.file] = { ...gap, ...origin, lines: 0 };
```

- [x] 1.14 Write the test for `gap-ledger-111` before its code.
  Mutation: Use the second block. The test must fail.

```js
if (change !== BASELINE_CHANGE) return false;
```

```js
if (false) return false;
```

- [x] 1.15 Write the test for `gap-ledger-112` before its code.
  Mutation: Use the second block. The test must fail.

```js
if (!sameAsBase(record.file)) continue;
```

```js
if (false) continue;
```

- [x] 1.16 Write the test for `gap-ledger-113` before its code.
  Mutation: Use the second block. The test must fail.

```js
return { baseLedger: expected.ledger, errors: [] };
```

```js
return { baseLedger, errors: [] };
```

- [x] 1.17 Write the test for `gap-ledger-114` before its code.
  Mutation: Use the second block. The test must fail.

```js
if (!baselineContext(input)) return invalid();
```

```js
if (false) return invalid();
```

- [x] 1.18 Write the test for `gap-ledger-115` before its code.
  Mutation: Use the second block. The test must fail.

```js
if (!input.history.startsWith(input.baseHistory))
```

```js
if (false)
```

## 2. Code and checks

- [x] 2.1 Write the process union and gate interface.
- [x] 2.2 Write the bounded baseline command and history checks.
- [x] 2.3 Execute the oracle and raw retention experiment.
- [x] 2.4 Check each compound operand with a mutation.
- [x] 2.5 Measure host coverage and execute all spec tests.
- [x] 2.6 Check prose and format.

- [x] 2.7 Check the absent-file waiver case for `gap-ledger-080`.
  Mutation: Use the second block. The test must fail.

```js
file: file || '', message: fault[1]
```

```js
file: file || '/wrong', message: fault[1]
```

- [x] 2.8 Check raw folder removal for `coverage-gate-066`.
  Mutation: Remove the raw folder deletion. The test must fail.

## 3. Gates and review

- [ ] 3.1 Execute rebaseline in the image.
- [ ] 3.2 Execute the ratchet in the image.
- [ ] 3.3 Execute the gates in the image.
- [ ] 3.4 Get both review agent verdicts.
- [ ] 3.5 Record the tree and verdicts in review.md.
