import test from 'node:test';
import assert from 'node:assert/strict';
import {
  contentHash,
  findCoverageFlags,
  findIgnoreComments,
  findTestImports,
  inlineScriptLines,
  measureCoverage,
  parseLcov,
  untrueFiles,
} from '../../../scripts/spec/lib/coverage.mjs';

const LCOV = [
  'TN:',
  'SF:src/orbit.js',
  'FN:1,orbit',
  'FNDA:3,orbit',
  'FNF:4',
  'FNH:3',
  'BRDA:2,0,0,1',
  'BRF:10',
  'BRH:7',
  'DA:1,1',
  'LF:40',
  'LH:35',
  'end_of_record',
  'SF:/app/src/done.js',
  'FNF:1',
  'FNH:1',
  'BRF:2',
  'BRH:2',
  'LF:5',
  'LH:5',
  'end_of_record',
  'SF:src/outside-inventory.js',
  'LF:1',
  'LH:0',
  'end_of_record',
  '',
].join('\n');

const ENTRIES = parseLcov(LCOV, { root: '/app' });

test('[coverage-gate-004] reads the total and the covered counts for each loaded file', () => {
  assert.deepEqual(ENTRIES.get('src/orbit.js'), {
    lines: { total: 40, covered: 35 },
    branches: { total: 10, covered: 7 },
    functions: { total: 4, covered: 3 },
  });
  assert.deepEqual(ENTRIES.get('src/done.js').lines, { total: 5, covered: 5 });
  assert.deepEqual(ENTRIES.get('src/outside-inventory.js').branches, { total: 0, covered: 0 });
});

test('[coverage-gate-044] uses the entry with the most not-covered items for a file with two coverage report entries', () => {
  const record = (file, [lf, lh, brf, brh, fnf, fnh]) => [`SF:${file}`, `FNF:${fnf}`, `FNH:${fnh}`, `BRF:${brf}`, `BRH:${brh}`, `LF:${lf}`, `LH:${lh}`, 'end_of_record'].join('\n');
  const text = [
    record('src/geo.js', [99, 94, 12, 11, 5, 5]),
    record('/app/src/geo.js', [99, 85, 3, 2, 4, 1]),
    record('src/geo.js', [99, 99, 12, 12, 5, 5]),
    record('src/tie.js', [10, 8, 4, 3, 2, 2]),
    record('src/tie.js', [9, 7, 6, 5, 2, 2]),
    '',
  ].join('\n');
  const entries = parseLcov(text, { root: '/app' });
  assert.deepEqual(entries.get('src/geo.js'), {
    lines: { total: 99, covered: 85 },
    branches: { total: 3, covered: 2 },
    functions: { total: 4, covered: 1 },
  });
  assert.deepEqual(entries.get('src/tie.js'), {
    lines: { total: 9, covered: 7 },
    branches: { total: 4, covered: 3 },
    functions: { total: 2, covered: 2 },
  });
});

test('[coverage-gate-004] records the not-covered counts and the content hash of a loaded file', () => {
  const [orbit] = measureCoverage({ inventory: ['src/orbit.js'], entries: ENTRIES, readFile: () => 'source\n' });
  assert.deepEqual(orbit, {
    file: 'src/orbit.js',
    sha: contentHash('source\n'),
    untrue: false,
    loaded: true,
    complete: false,
    lines: { total: 40, uncovered: 5 },
    branches: { total: 10, uncovered: 3 },
    functions: { total: 4, uncovered: 1 },
  });
  assert.match(orbit.sha, /^[0-9a-f]{64}$/);
});

test('[coverage-gate-005] gives 0% coverage to a JS file that no test loads', () => {
  const sources = { 'src/ui.js': 'a\nb\nc\n', 'src/empty.js': '', 'src/tail.js': 'a\nb' };
  const [ui, empty, tail] = measureCoverage({ inventory: Object.keys(sources), entries: new Map(), readFile: (file) => sources[file] });
  assert.deepEqual(ui, { file: 'src/ui.js', sha: contentHash('a\nb\nc\n'), untrue: false, loaded: false, complete: false, lines: { total: 3, uncovered: 3 }, branches: null, functions: null });
  assert.deepEqual([empty.lines, empty.complete], [{ total: 0, uncovered: 0 }, false]);
  assert.deepEqual(tail.lines, { total: 2, uncovered: 2 });
});

test('[coverage-gate-006] marks a file with all counts covered as complete', () => {
  const [done] = measureCoverage({ inventory: ['src/done.js'], entries: ENTRIES, readFile: () => '' });
  assert.equal(done.complete, true);
  assert.deepEqual([done.lines.uncovered, done.branches.uncovered, done.functions.uncovered], [0, 0, 0]);
});

test('[coverage-gate-021] gives 0% coverage to a file with untrue coverage', () => {
  const [traffic] = measureCoverage({ inventory: ['src/orbit.js'], entries: ENTRIES, readFile: () => 'a\nb\n', untrue: new Set(['src/orbit.js']) });
  assert.deepEqual(traffic, { file: 'src/orbit.js', sha: contentHash('a\nb\n'), untrue: true, loaded: false, complete: false, lines: { total: 2, uncovered: 2 }, branches: null, functions: null });
});

test('[coverage-gate-024] records a file in the coverage report that no guard checked as not loaded and as untrue', () => {
  const untrue = untrueFiles({ entries: ENTRIES, inventory: ['src/orbit.js', 'src/done.js', 'src/ui.js'], checked: new Set(['src/done.js']), violations: new Set(['src/hooked.js']) });
  assert.deepEqual([...untrue].sort(), ['src/hooked.js', 'src/orbit.js']);
});

test('[coverage-gate-012] marks an HTML file without inline scripts as complete', () => {
  const html = '<html><script type="module" src="/src/main.js"></script><script src="a.js" defer></script><script>\n\n</script></html>';
  assert.equal(inlineScriptLines(html), 0);
  const [page] = measureCoverage({ inventory: ['index.html'], entries: new Map(), readFile: () => html });
  assert.deepEqual([page.loaded, page.complete, page.lines], [false, true, { total: 0, uncovered: 0 }]);
});

test('[coverage-gate-013] gives 0% coverage to the inline scripts of an HTML file', () => {
  const html = ['<script>', 'const a = 1;', '', 'run(a);', '</script>', '<SCRIPT type="module">go();</SCRIPT >'].join('\n');
  assert.equal(inlineScriptLines(html), 3);
  const [page] = measureCoverage({ inventory: ['tools/render.html'], entries: new Map(), readFile: () => html });
  assert.deepEqual([page.loaded, page.complete, page.lines, page.branches], [false, false, { total: 3, uncovered: 3 }, null]);
});

test('[coverage-gate-041] measures a script element with a src text that is not the src attribute', () => {
  const html = ['<script data-src="x">', 'run();', 'go();', '</script>', '<script class="src=1">one();</script>', '<script\tsrc="a.js">skip();</script>', "<script type='module' src='b.js'>skip();</script>"].join('\n');
  assert.equal(inlineScriptLines(html), 3);
  const [page] = measureCoverage({ inventory: ['index.html'], entries: new Map(), readFile: () => html });
  assert.deepEqual([page.complete, page.lines], [false, { total: 3, uncovered: 3 }]);
});

test('[coverage-gate-042] gives 0% coverage to event handler attributes and javascript URLs', () => {
  const html = ['<body onload="fetch(1); go()">', '<button ONCLICK = "run()">x</button>', '<a href="javascript:void(0)">y</a>', '<script>', '// onload= in code is counted with the script', '</script>'].join('\n');
  assert.equal(inlineScriptLines(html), 4);
  const [page] = measureCoverage({ inventory: ['index.html'], entries: new Map(), readFile: () => html });
  assert.deepEqual([page.loaded, page.complete, page.lines], [false, false, { total: 4, uncovered: 4 }]);
});

test('[coverage-gate-043] stops for a code file that imports a test file', () => {
  const sources = {
    'src/a.js': "import { helper } from './helper.test.mjs';\nexport const a = helper;\n",
    'src/b.cjs': "const x = 1;\nconst h = require('../lib/h.test.mjs');\n",
    'src/c.js': "const loaded = await import(\"./c.test.mjs\");\n",
    'src/clean.js': "const name = 'runs a.test.mjs files';\nimport { x } from './x.mjs';\n",
  };
  const errors = findTestImports({ inventory: Object.keys(sources), readFile: (file) => sources[file] });
  assert.deepEqual(errors.map((error) => [error.code, error.file, error.line]), [
    ['COVERAGE-TEST-IMPORT', 'src/a.js', 1],
    ['COVERAGE-TEST-IMPORT', 'src/b.cjs', 2],
    ['COVERAGE-TEST-IMPORT', 'src/c.js', 1],
  ]);
  assert.equal(errors[0].message, 'Move the code out of the test file. The gates do not measure test files.');
});

test('[coverage-gate-014] gives 0% coverage to a shell file', () => {
  const shell = '#!/bin/sh\necho one\necho two\n';
  const entries = new Map([['scripts/dev.sh', { lines: { total: 3, covered: 3 }, branches: { total: 0, covered: 0 }, functions: { total: 0, covered: 0 } }]]);
  const [script] = measureCoverage({ inventory: ['scripts/dev.sh'], entries, readFile: () => shell });
  assert.deepEqual([script.loaded, script.complete, script.lines], [false, false, { total: 3, uncovered: 3 }]);
});

test('[coverage-gate-008] stops for each coverage ignore comment', () => {
  const tool = (name) => `${name} ignore`;
  const sources = {
    'src/a.js': `const a = 1;\n/* ${tool('c8')} next */\n`,
    'src/b.js': `// ${tool('istanbul')} else\n/* ${tool('v8')} start */\n`,
    'src/c.js': `/* node:coverage ${'disable'} */\n/* ${tool('node:coverage')} next */\n/* node:coverage ${'enable'} */\n`,
    'src/clean.js': 'const text = "coverage is ignored here only in words";\n',
  };
  const errors = findIgnoreComments({ inventory: Object.keys(sources), readFile: (file) => sources[file] });
  assert.deepEqual(
    errors.map((error) => [error.code, error.file, error.line]),
    [
      ['COVERAGE-IGNORE', 'src/a.js', 2],
      ['COVERAGE-IGNORE', 'src/b.js', 1],
      ['COVERAGE-IGNORE', 'src/b.js', 2],
      ['COVERAGE-IGNORE', 'src/c.js', 1],
      ['COVERAGE-IGNORE', 'src/c.js', 2],
      ['COVERAGE-IGNORE', 'src/c.js', 3],
    ],
  );
  assert.equal(errors[0].message, 'Remove the coverage ignore comment and test the code');
});

test('[coverage-gate-017] stops for a coverage filter option outside the gate command', () => {
  const option = (kind) => `--test-coverage-${kind}=**/lib.mjs`;
  const sources = {
    'package.json': `{"scripts":{"test":"node --test ${option('ex' + 'clude')}"}}`,
    '.github/workflows/ci.yml': `run: node --test\nrun: node --test ${option('in' + 'clude')}\n`,
    'docs/notes.md': `Do not use ${option('ex' + 'clude')}.\n`,
    'scripts/spec/gates.mjs': option('ex' + 'clude'),
    'src/tooling/spec/gates.test.mjs': option('ex' + 'clude'),
  };
  const errors = findCoverageFlags({ tracked: Object.keys(sources), readFile: (file) => sources[file] });
  assert.deepEqual(
    errors.map((error) => [error.code, error.file, error.line]),
    [
      ['COVERAGE-FLAG', 'package.json', 1],
      ['COVERAGE-FLAG', '.github/workflows/ci.yml', 2],
    ],
  );
});
