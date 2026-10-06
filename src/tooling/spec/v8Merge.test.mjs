import test from 'node:test';
import assert from 'node:assert/strict';
import { createCoverage, addProcess, combineCoverage, coverageCounts, coverageLcov, replaceLcov } from '../../../scripts/spec/lib/v8-merge.mjs';

const url = 'file:///repo/a.js';
const range = (startOffset, endOffset, count) => ({ startOffset, endOffset, count });
const fn = (functionName, ranges, isBlockCoverage = true) => ({ functionName, ranges, isBlockCoverage });
const data = (functions, sourceUrl = url) => ({ result: [{ url: sourceUrl, functions }] });
function state(source, processes) {
  const result = createCoverage(() => source);
  for (const process of processes) addProcess(result, process);
  return result;
}
function values(source, processes) {
  return coverageCounts(state(source, processes)).get(url);
}

test('[coverage-gate-055] A process keeps line offsets and inner zero values', () => {
  assert.deepEqual(values('aa\r\n\ncc\n', [data([fn('', [range(0, 8, 1), range(5, 7, 0)])])]), { LF: 3, LH: 2, BRF: 2, BRH: 1, FNF: 0, FNH: 0 });
  assert.equal(values('aa\nbb', [data([fn('', [range(0, 5, 1)])])]).LH, 2);
  assert.equal(values('', [data([])]).LH, 1);
  assert.equal(values('aa\nbb', [data([fn('', [range(1, 4, 1)])])]).LH, 0);
  assert.equal(values('aa\r\nbb', [data([fn('', [range(3, 6, 1)])])]).LH, 0);
  assert.equal(values('aa', [data([fn('', [range(0, 0, 1)])])]).LH, 0);
  assert.equal(values('aa', [data([fn('', [range(9, 10, 1)])])]).LH, 0);
  assert.equal(values('aa', [data([fn('', [range(0, 2, 1)]), fn('x', [range(0, 2, 0)])])]).LH, 0);
});

test('[coverage-gate-056] The comments set and reset the line state', () => {
  const source = '/* node:coverage ignore next 2 */\na\n/* node:coverage ignore next */\nb\n/* node:coverage disable */\nc\n/* node:coverage enable */\nd';
  assert.equal(values(source, [data([])]).LH, 4);
  assert.equal(values('/* node:coverage ignore next */\na\nb', [data([])]).LH, 1);
  assert.equal(values('/* node:coverage ignore next 2 */\na\nb\nc', [data([])]).LH, 2);
  assert.equal(values('/* node:coverage ignore next 2 */\n/* node:coverage enable */\na', [data([])]).LH, 1);
  assert.equal(values('/* node:coverage disable */\n/* node:coverage ignore next */\n/* node:coverage enable */\na', [data([])]).LH, 2);
});

test('[coverage-gate-057] A process measures branches and later functions', () => {
  assert.deepEqual(values('aa\nbb\ncc', [data([fn('', [range(0, 8, 1), range(3, 5, 0)]), fn('x', [range(6, 8, 0)]), fn('empty', []), fn('plain', [range(0, 2, 1)], false)])]), { LF: 3, LH: 1, BRF: 3, BRH: 1, FNF: 2, FNH: 1 });
  const source = '/* node:coverage ignore next */\naa';
  assert.deepEqual(values(source, [data([fn('', [range(0, source.length, 0)]), fn('x', [range(32, 34, 0)])])]), { LF: 2, LH: 1, BRF: 2, BRH: 1, FNF: 1, FNH: 1 });
  assert.equal(values('a', [data([fn('', []), fn('negative', [range(0, 1, -1)])])]).FNH, 1);
  assert.equal(values('a', [data([fn('', [range(5, 6, 0)])])]).BRH, 1);
});

test('[coverage-gate-058] The line merge keeps only process coverage', () => {
  assert.deepEqual(values('aa\nbb\ncc', [data([fn('', [range(0, 8, 1), range(3, 8, 0)])]), data([fn('', [range(0, 8, 1), range(0, 2, 0), range(6, 8, 0)])])]), { LF: 3, LH: 2, BRF: 4, BRH: 3, FNF: 0, FNH: 0 });
});

test('[coverage-gate-059] The function identities keep each name and extent', () => {
  assert.deepEqual(values('aa\nbb\ncc', [data([fn('', []), fn('x', [range(0, 8, 0)]), fn('x', [range(3, 8, 0)]), fn('x', [range(0, 5, 0)]), fn('y', [range(0, 8, 0)])])]), { LF: 3, LH: 0, BRF: 4, BRH: 0, FNF: 4, FNH: 0 });
  assert.deepEqual(values('aa\nbb', [data([fn('', []), fn('x', [range(0, 2, 0)]), fn('x', [range(3, 5, 1)]), fn('y', [range(0, 2, 0)])]), data([fn('', []), fn('x', [range(0, 2, 1)])]), data([])]), { LF: 2, LH: 2, BRF: 3, BRH: 2, FNF: 3, FNH: 2 });
});

test('[coverage-gate-060] An absent branch uses the innermost parent value', () => {
  assert.equal(values('aa\nbb\ncc', [data([fn('', [range(0, 8, 1), range(2, 8, 0), range(3, 8, 0)])]), data([fn('', [range(0, 8, 1), range(3, 8, 0)])])]).BRF, 3);
  assert.equal(values('aa\nbb\ncc', [data([fn('', [range(0, 8, 1), range(3, 8, 0), range(3, 5, 0)])]), data([fn('', [range(0, 8, 1), range(3, 5, 0)])])]).BRF, 3);
  assert.equal(values('aa\nbb\ncc', [data([fn('', [range(0, 8, 1), range(6, 8, 0), range(3, 5, 0)])]), data([fn('', [range(0, 8, 1), range(3, 5, 0)])])]).BRH, 2);
  assert.equal(values('aa\nbb\ncc', [data([fn('', [range(0, 8, 1), range(0, 2, 0), range(6, 8, 0)])]), data([fn('', [range(0, 8, 1), range(6, 8, 0)])])]).BRH, 2);
  const a = data([fn('', []), fn('x', [range(0, 8, 1), range(3, 5, 0)])]);
  const b = data([fn('', []), fn('x', [range(0, 8, 1)])]);
  assert.deepEqual(values('aa\nbb\ncc', [a, b]), { LF: 3, LH: 3, BRF: 2, BRH: 2, FNF: 1, FNH: 1 });
  assert.equal(values('aa\nbb\ncc', [a, data([fn('', []), fn('x', [range(0, 8, 1)], false)])]).BRH, 2);
  assert.equal(values('aa\nbb\ncc', [a, data([fn('', []), fn('x', [range(0, 8, 1), range(3, 5, 0)], false)])]).BRH, 2);
  assert.equal(values('aa\nbb\ncc', [data([fn('', []), fn('x', [range(0, 8, 1), range(3, 8, 0), range(3, 5, 0)])]), data([fn('', []), fn('x', [range(0, 8, 1), range(3, 8, 0)])])]).BRH, 1);
  assert.equal(values('aa\nbb\ncc', [a, data([fn('', []), fn('x', [range(0, 8, 0)], false)])]).BRH, 1);
  assert.equal(values('aa\nbb\ncc', [a, data([])]).BRH, 1);
  assert.equal(values('aa\nbb\ncc', [data([fn('', [range(0, 8, 0), range(6, 8, 0)])]), data([fn('', [range(0, 8, 0), range(3, 5, 0)])])]).BRH, 0);
  assert.equal(values('aa\nbb', [data([fn('', [range(0, 2, 0), range(3, 5, 0)])]), data([fn('', [range(0, 2, 0)])])]).BRH, 0);
  assert.equal(values('aa\nbb\ncc', [data([fn('', [range(0, 8, 1), range(3, 8, 0), range(2, 8, 0), range(4, 5, 0)])]), data([fn('', [range(0, 8, 1), range(3, 8, 0), range(2, 8, 1)])])]).BRH, 2);
});

test('[coverage-gate-060] The later equal parent gives the absent branch value', () => {
  const listed = data([fn('', [range(0, 5, 0), range(2, 4, 0)])]);
  const parents = data([fn('', [range(0, 5, 1), range(0, 5, 0)])]);
  assert.deepEqual(values('aa\nbb', [listed, parents]), { LF: 2, LH: 0, BRF: 3, BRH: 1, FNF: 0, FNH: 0 });
});

test('[coverage-gate-061] The equal extents keep separate occurrences', () => {
  const a = data([fn('', [range(0, 5, 1), range(0, 5, 0)])]);
  assert.deepEqual(values('aa\nbb', [a]), { LF: 2, LH: 0, BRF: 2, BRH: 1, FNF: 0, FNH: 0 });
  assert.deepEqual(values('aa\nbb', [a, data([fn('', [range(0, 5, 1)])])]), { LF: 2, LH: 2, BRF: 2, BRH: 2, FNF: 0, FNH: 0 });
});

test('[coverage-gate-062] The process permutations and groups give equal values', () => {
  const urls = state('aa', [data([fn('', [range(0, 2, 1)])]), data([fn('', [range(0, 2, 0)])], 'file:///repo/b.js')]);
  const combinedUrls = coverageCounts(combineCoverage([urls]));
  assert.deepEqual([...combinedUrls.keys()], ['file:///repo/a.js', 'file:///repo/b.js']);
  assert.deepEqual(combinedUrls.get('file:///repo/a.js'), { LF: 1, LH: 1, BRF: 1, BRH: 1, FNF: 0, FNH: 0 });
  assert.deepEqual(combinedUrls.get('file:///repo/b.js'), { LF: 1, LH: 0, BRF: 1, BRH: 0, FNF: 0, FNH: 0 });
  const multiple = combineCoverage([state('aa\nbb', [data([fn('', [range(0, 5, 1)]), fn('x', [range(0, 2, 1)]), fn('y', [range(3, 5, 0)])])])]);
  assert.deepEqual(coverageCounts(multiple).get(url), { LF: 2, LH: 1, BRF: 3, BRH: 2, FNF: 2, FNH: 1 });
  const counted = combineCoverage([state('aa', [data([fn('', []), fn('x', [range(0, 2, 1)])])]), state('aa', [data([fn('', []), fn('x', [range(0, 2, 0)])])])]);
  assert.deepEqual(coverageCounts(counted).get(url), { LF: 1, LH: 1, BRF: 1, BRH: 1, FNF: 1, FNH: 1 });
  const processes = [data([fn('', [range(0, 8, 1), range(3, 8, 0)])]), data([fn('', [range(0, 8, 1), range(0, 2, 0), range(6, 8, 0)])]), data([])];
  let seed = 17;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const order = [...processes];
    for (let i = order.length - 1; i > 0; i -= 1) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const j = seed % (i + 1);
      [order[i], order[j]] = [order[j], order[i]];
    }
    assert.deepEqual(values('aa\nbb\ncc', order), { LF: 3, LH: 2, BRF: 4, BRH: 3, FNF: 0, FNH: 0 });
    const parts = order.map(process => state('aa\nbb\ncc', [process]));
    const left = combineCoverage([combineCoverage([parts[0], parts[1]]), parts[2]]);
    const right = combineCoverage([parts[0], combineCoverage([parts[1], parts[2]])]);
    assert.deepEqual(coverageCounts(left).get(url), { LF: 3, LH: 2, BRF: 4, BRH: 3, FNF: 0, FNH: 0 });
    assert.deepEqual(coverageCounts(right).get(url), { LF: 3, LH: 2, BRF: 4, BRH: 3, FNF: 0, FNH: 0 });
    const grouped = combineCoverage([state('aa\nbb\ncc', order.slice(0, 1)), state('aa\nbb\ncc', order.slice(1))]);
    assert.deepEqual(coverageCounts(grouped).get(url), { LF: 3, LH: 2, BRF: 4, BRH: 3, FNF: 0, FNH: 0 });
    assert.deepEqual(coverageCounts(combineCoverage([grouped, state('aa\nbb\ncc', [])])).get(url), { LF: 3, LH: 2, BRF: 4, BRH: 3, FNF: 0, FNH: 0 });
  }
});

test('[coverage-gate-063] The merge module writes one lcov record per URL', () => {
  const result = state('aa', [{ result: [...data([fn('', [range(0, 2, 1)])], 'file:///repo/a.js?x').result, ...data([fn('', [range(0, 2, 0)])]).result] }]);
  assert.equal(coverageCounts(result).size, 2);
  assert.equal(coverageLcov(result), 'SF:/repo/a.js\nLF:1\nLH:0\nBRF:1\nBRH:0\nFNF:0\nFNH:0\nend_of_record\nSF:/repo/a.js\nLF:1\nLH:1\nBRF:1\nBRH:1\nFNF:0\nFNH:0\nend_of_record\n');
});

test('[coverage-gate-065] The replacement keeps unloaded lcov records', () => {
  const result = state('aa', [data([fn('', [range(0, 2, 1)])])]);
  const text = 'SF:/repo/a.js\nLF:8\nLH:0\nend_of_record\nSF:/repo/z.js\nLF:9\nLH:0\nend_of_record\n';
  assert.equal(replaceLcov(text, result), 'SF:/repo/z.js\nLF:9\nLH:0\nend_of_record\nSF:/repo/a.js\nLF:1\nLH:1\nBRF:1\nBRH:1\nFNF:0\nFNH:0\nend_of_record\n');
  const two = state('aa', [data([fn('', [range(0, 2, 1)])]), data([fn('', [range(0, 2, 0)])], 'file:///repo/z.js')]);
  assert.equal(replaceLcov(text, two), 'SF:/repo/a.js\nLF:1\nLH:1\nBRF:1\nBRH:1\nFNF:0\nFNH:0\nend_of_record\nSF:/repo/z.js\nLF:1\nLH:0\nBRF:1\nBRH:0\nFNF:0\nFNH:0\nend_of_record\n');
  const empty = createCoverage(() => { throw new Error('excluded'); });
  addProcess(empty, data([]), () => false);
  assert.equal(replaceLcov(text, empty), text);
  assert.equal(replaceLcov('TN:demo\nSF:/repo/z.js\nLF:9\nend_of_record\n', empty), 'TN:demo\nSF:/repo/z.js\nLF:9\nend_of_record\n');
});
