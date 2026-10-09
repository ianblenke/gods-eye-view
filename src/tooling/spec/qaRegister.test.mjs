import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listTrackedFiles } from '../../../scripts/spec/lib/inventory.mjs';
import { adoptableQaScript, readQaRegister, qaAdvice } from '../../../scripts/spec/lib/qa-register.mjs';
import { readOwnership } from '../../../scripts/spec/lib/ownership.mjs';

for (const key of Object.keys(process.env)) if (key.startsWith('GIT_')) delete process.env[key];
Object.assign(process.env, {
  GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_SYSTEM: '/dev/null', LC_ALL: 'C',
  GIT_CONFIG_COUNT: '4', GIT_CONFIG_KEY_0: 'user.name', GIT_CONFIG_VALUE_0: 'Test',
  GIT_CONFIG_KEY_1: 'user.email', GIT_CONFIG_VALUE_1: 'test@example.com',
  GIT_CONFIG_KEY_2: 'safe.directory', GIT_CONFIG_VALUE_2: '*',
  GIT_CONFIG_KEY_3: 'commit.gpgsign', GIT_CONFIG_VALUE_3: 'false',
});

const PROJECT = fileURLToPath(new URL('../../../', import.meta.url));
const FILE = 'scripts/qa-example.mjs';
const PURPOSE = 'Prove that the layer works.';
const header = (covers = 'pending:example') => `/**\n * @purpose ${PURPOSE}\n * @covers ${covers}\n * @run node scripts/qa-example.mjs\n * @needs A browser and a server.\n */\n`;
function fixture(fn) {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-qa-register-'));
  const put = (file, value = '') => {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), value);
  };
  try { return fn({ root, put, scan: (tracked = [FILE]) => readQaRegister({ root, tracked }) }); }
  finally { rmSync(root, { recursive: true, force: true }); }
}
function errorCodes(result) { return result.errors.map(({ code }) => code); }
function headerError(result) {
  assert.deepEqual(result.errors, [{ code: 'QA-HEADER', file: FILE, message: 'scripts/qa-example.mjs: add one first block with one nonempty line for each QA tag and valid covers items.' }]);
  assert.deepEqual([...result.validQaScripts], []);
}

test('[qa-scripts-001] accepts a shebang and reads all four tags', () => fixture(({ put, scan }) => {
  put(FILE, `#!/usr/bin/env node\n${header()}`);
  const result = scan();
  assert.deepEqual(result.errors, []);
  assert.deepEqual([...result.validQaScripts], [FILE]);
  assert.deepEqual(result.scripts, [{ file: FILE, purpose: PURPOSE, covers: ['pending:example'], run: 'node scripts/qa-example.mjs', needs: 'A browser and a server.' }]);
}));
test('[qa-scripts-002] rejects code before the first block', () => fixture(({ put, scan }) => { put(FILE, `export {};\n${header()}`); headerError(scan()); }));
test('[qa-scripts-003] rejects an absent tag', () => fixture(({ put, scan }) => { put(FILE, header().replace(' * @needs A browser and a server.\n', '')); headerError(scan()); }));
test('[qa-scripts-004] rejects a repeated tag', () => fixture(({ put, scan }) => { put(FILE, header().replace(' * @covers', ' * @purpose Another purpose.\n * @covers')); headerError(scan()); }));
test('[qa-scripts-005] rejects an empty tag', () => fixture(({ put, scan }) => { put(FILE, header().replace('@run node scripts/qa-example.mjs', '@run ')); headerError(scan()); }));
test('[qa-scripts-006] rejects a covers item with a space', () => fixture(({ put, scan }) => { put(FILE, header('pending:example, pending:other')); headerError(scan()); }));
test('[qa-scripts-007] accepts a capability folder', () => fixture(({ put, scan }) => { put(FILE, header('example')); put('openspec/specs/example/spec.md'); assert.deepEqual(scan().errors, []); }));
test('[qa-scripts-008] reports an unknown capability', () => fixture(({ put, scan }) => { put(FILE, header('example')); assert.deepEqual(scan().errors, [{ code: 'QA-COVERS-UNKNOWN', file: FILE, message: 'scripts/qa-example.mjs: example has no capability folder in openspec/specs/.' }]); }));
test('[qa-scripts-009] accepts an open pending area', () => fixture(({ put, scan }) => { put(FILE, header('pending:example')); assert.deepEqual(scan().errors, []); }));
test('[qa-scripts-010] reports a pending area that has a capability folder', () => fixture(({ put, scan }) => { put(FILE, header('pending:example')); put('openspec/specs/example/spec.md'); assert.deepEqual(scan().errors, [{ code: 'QA-COVERS-LANDED', file: FILE, message: 'scripts/qa-example.mjs: replace pending:example with example; its capability folder exists.' }]); }));
test('[qa-scripts-011] accepts one unmapped reason', () => fixture(({ put, scan }) => { put(FILE, header('unmapped: No area fits this check')); assert.deepEqual(scan().errors, []); }));
test('[qa-scripts-012] rejects an unmapped list', () => fixture(({ put, scan }) => { put(FILE, header('unmapped: reason,pending:example')); headerError(scan()); }));
test('[qa-scripts-016] gives delta advice with the script purpose', () => fixture(({ root, put, scan }) => { put(FILE, header('example')); put('openspec/specs/example/spec.md'); put('openspec/changes/add-example/specs/example/spec.md'); assert.deepEqual(qaAdvice({ root, change: 'add-example', scripts: scan().scripts }), ['QA: scripts/qa-example.mjs covers example: Prove that the layer works.']); }));
test('[qa-scripts-017] gives advice for a backfill area', () => fixture(({ root, put, scan }) => { put(FILE, header('pending:example')); put('openspec/changes/backfill-example/proposal.md'); assert.deepEqual(qaAdvice({ root, change: 'backfill-example', scripts: scan().scripts }), ['QA: scripts/qa-example.mjs covers example: Prove that the layer works.']); }));
test('[qa-scripts-018] gives the no match line', () => fixture(({ root, put, scan }) => { put(FILE, header()); put('openspec/changes/add-other/specs/other/spec.md'); assert.deepEqual(qaAdvice({ root, change: 'add-other', scripts: scan().scripts }), ['QA: no script covers the capabilities of this change.']); }));
test('[qa-scripts-019] gives no advice without a change', () => fixture(({ root, put, scan }) => { put(FILE, header()); assert.deepEqual(qaAdvice({ root, scripts: scan().scripts }), []); }));
test('[qa-scripts-020] tells authors to read advice and add a header', () => {
  const rule = readFileSync(path.join(PROJECT, 'AGENTS.md'), 'utf8').match(/^22\..*$/m)?.[0];
  assert.match(rule || '', /read the QA lines/i);
  assert.match(rule || '', /conflict with a listed purpose/i);
  assert.match(rule || '', /header to each new QA script/i);
});
test('[qa-scripts-021] gives QA lines to the spec adversary', () => {
  const command = readFileSync(path.join(PROJECT, '.claude/commands/opsx/review.md'), 'utf8');
  assert.match(command, /spec-adversary[^\n]*QA lines from the gate output/i);
});
test('[qa-scripts-022] asks the spec adversary to read each QA check', () => {
  const prompt = readFileSync(path.join(PROJECT, '.claude/agents/spec-adversary.md'), 'utf8');
  const check = prompt.match(/^11\.\s+\*\*QA scripts\.\*\*.*$/m)?.[0] || '';
  assert.match(check, /Read each listed script purpose and its checks\./);
  assert.match(check, /conflicts with the checks/);
  assert.match(check, /proved behavior with no scenario/);
});
test('[qa-scripts-023] checks all tracked QA scripts in this repository', () => {
  const tracked = listTrackedFiles(PROJECT).filter((file) => /^scripts\/qa-.*\.mjs$/.test(file));
  assert.equal(tracked.length, 90);
  const result = readQaRegister({ root: PROJECT, tracked, manifest: readOwnership(PROJECT).manifest, adopts: tracked.map((file) => ({ file })) });
  assert.equal(result.scripts.length, 90);
  assert.equal(result.validQaScripts.size, 90);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.scripts.filter((script) => script.synthetic).map((script) => script.file), ['scripts/qa-voice-auth-focus.mjs', 'scripts/qa-voice-auth.mjs']);
  for (const file of ['scripts/qa-browserEvidence.mjs', 'scripts/qa-panel-resize.mjs', 'scripts/qa-panelDrag.mjs']) {
    assert.deepEqual(result.scripts.find((script) => script.file === file).covers, ['pending:application-shell']);
  }
});
test('[qa-scripts-026] gives advice from an archived change', () => fixture(({ root, put, scan }) => { put(FILE, header('example')); put('openspec/specs/example/spec.md'); put('openspec/changes/archive/2026-09-26-add-example/specs/example/spec.md'); assert.deepEqual(qaAdvice({ root, change: 'add-example', scripts: scan().scripts }), ['QA: scripts/qa-example.mjs covers example: Prove that the layer works.']); }));
test('[qa-scripts-027] sorts advice by script then capability', () => fixture(({ root, put, scan }) => {
  put(FILE, header('b,a')); put('scripts/qa-zed.mjs', header('a,b'));
  for (const name of ['a', 'b']) { put(`openspec/specs/${name}/spec.md`); put(`openspec/changes/add-both/specs/${name}/spec.md`); }
  assert.deepEqual(qaAdvice({ root, change: 'add-both', scripts: scan([FILE, 'scripts/qa-zed.mjs']).scripts }), [
    'QA: scripts/qa-example.mjs covers a: Prove that the layer works.',
    'QA: scripts/qa-example.mjs covers b: Prove that the layer works.',
    'QA: scripts/qa-zed.mjs covers a: Prove that the layer works.',
    'QA: scripts/qa-zed.mjs covers b: Prove that the layer works.',
  ]);
}));
test('[qa-scripts-028] rejects a header continuation line', () => fixture(({ put, scan }) => { put(FILE, header().replace(' * @covers', ' * Extra text.\n * @covers')); headerError(scan()); }));

test('[qa-scripts-005] rejects a purpose without a final mark', () => fixture(({ put, scan }) => {
  put(FILE, header().replace('Prove that the layer works.', 'Prove that the layer works'));
  headerError(scan());
}));
test('[qa-scripts-005] rejects an empty needs value', () => fixture(({ put, scan }) => {
  put(FILE, header().replace('@needs A browser and a server.', '@needs '));
  headerError(scan());
}));
test('[qa-scripts-018] gives no match advice for an unknown change', () => fixture(({ root, put, scan }) => {
  put(FILE, header());
  assert.deepEqual(qaAdvice({ root, change: 'unknown', scripts: scan().scripts }), ['QA: no script covers the capabilities of this change.']);
}));
test('[qa-scripts-025] sorts two covers errors for one script', () => fixture(({ put, scan }) => {
  put(FILE, header('unknown,pending:landed'));
  put('openspec/specs/landed/spec.md');
  assert.deepEqual(errorCodes(scan()), ['QA-COVERS-LANDED', 'QA-COVERS-UNKNOWN']);
}));

test('[qa-scripts-008] rejects a file that has a capability name', () => fixture(({ put, scan }) => {
  put(FILE, header('example'));
  put('openspec/specs/example');
  assert.deepEqual(errorCodes(scan()), ['QA-COVERS-UNKNOWN']);
}));

test('[qa-scripts-025] gives no advice for invalid covers items', () => fixture(({ root, put, scan }) => {
  put(FILE, header('unknown,pending:landed'));
  put('openspec/specs/landed/spec.md');
  put('openspec/changes/add-both/specs/unknown/spec.md');
  put('openspec/changes/add-both/specs/landed/spec.md');
  assert.deepEqual(qaAdvice({ root, change: 'add-both', scripts: scan().scripts }), ['QA: no script covers the capabilities of this change.']);
}));

test('[qa-scripts-011] gives no advice for an unmapped reason', () => fixture(({ root, put, scan }) => {
  put(FILE, header('unmapped: No area fits this check'));
  put('openspec/changes/add-example/specs/example/spec.md');
  assert.deepEqual(qaAdvice({ root, change: 'add-example', scripts: scan().scripts }), ['QA: no script covers the capabilities of this change.']);
}));

test('[qa-scripts-025] gives no advice for a file with a capability name', () => fixture(({ root, put, scan }) => {
  put(FILE, header('example'));
  put('openspec/specs/example');
  put('openspec/changes/add-example/specs/example/spec.md');
  assert.deepEqual(qaAdvice({ root, change: 'add-example', scripts: scan().scripts }), ['QA: no script covers the capabilities of this change.']);
}));

const manifest = { version: 1, owned: ['src/own/', 'single.js'] };
test('[ownership-009] uses a synthetic upstream QA header', () => fixture(({ root, put }) => {
  put('scripts/qa-new.mjs', '#!/usr/bin/env node\nexport {};\n');
  const result = readQaRegister({ root, tracked: ['scripts/qa-new.mjs'], manifest, readBaseFile: () => 'export {};\n' });
  assert.deepEqual(result.errors, []);
  assert.deepEqual([...result.validQaScripts], ['scripts/qa-new.mjs']);
  assert.deepEqual(result.scripts[0], { file: 'scripts/qa-new.mjs', purpose: 'Check upstream code.', covers: ['unmapped: upstream'], run: 'node scripts/qa-new.mjs', needs: 'The upstream script needs its own setup.', synthetic: true });
  assert.deepEqual(qaAdvice({ root, scripts: result.scripts }), ['QA: scripts/qa-new.mjs uses the synthetic header with the covers item unmapped: upstream.']);
  assert.deepEqual(qaAdvice({ root, change: 'unknown', scripts: result.scripts }), ['QA: scripts/qa-new.mjs uses the synthetic header with the covers item unmapped: upstream.', 'QA: no script covers the capabilities of this change.']);
}));
test('[ownership-010] rejects an owned script with no header and an upstream script with an invalid header', () => fixture(({ root, put }) => {
  const file = 'scripts/qa-new.mjs';
  put(file, 'export {};');
  assert.equal(readQaRegister({ root, tracked: [file], manifest: { version: 1, owned: ['scripts/'] } }).errors[0].code, 'QA-HEADER');
  put(file, '  /**\n * @purpose Bad.\n */\n');
  assert.equal(readQaRegister({ root, tracked: [file], manifest }).errors[0].code, 'QA-HEADER');
}));

test('[ownership-009 ownership-010] keeps a valid upstream QA header and its capability checks', () => fixture(({ root, put }) => {
  put(FILE, header('unknown'));
  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* Base license. */\n' });
  assert.deepEqual(errorCodes(result), ['QA-COVERS-UNKNOWN']);
  assert.deepEqual(result.scripts[0].covers, ['unknown']);
  assert.equal(Object.hasOwn(result.scripts[0], 'synthetic'), false);
}));

test('[ownership-015] accepts an upstream first comment with no QA tags', () => fixture(({ root, put }) => {
  put(FILE, '/* Upstream license. */\nexport {};\n');
  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* Base license. */\n' });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.scripts[0], { file: 'scripts/qa-example.mjs', purpose: 'Check upstream code.', covers: ['unmapped: upstream'], run: 'node scripts/qa-example.mjs', needs: 'The upstream script needs its own setup.', synthetic: true });
  put(FILE, '/**\n * @purpose Bad.\n */\n');
  assert.deepEqual(errorCodes(readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* Base license. */\n' })), ['QA-HEADER']);
}));

test('[ownership-010] rejects an upstream QA block with no end', () => fixture(({ root, put }) => {
  put(FILE, '/**\n * @purpose Bad.\n');
  assert.deepEqual(errorCodes(readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* Base license. */\n' })), ['QA-HEADER']);
}));

test('[ownership-010] rejects a bad upstream QA block after a shebang', () => fixture(({ root, put }) => {
  put(FILE, '#!/usr/bin/env node\n/**\n * @purpose Bad.\n */\n');
  assert.deepEqual(errorCodes(readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* Base license. */\n' })), ['QA-HEADER']);
}));

test('[ownership-010] rejects a shebang inside a QA comment', () => fixture(({ root, put }) => {
  put(FILE, '/**\n * #! @purpose Bad.\n */\n');
  assert.deepEqual(readQaRegister({ root, tracked: [FILE], manifest: { version: 1, owned: [] }, readBaseFile: () => '/* Base license. */\n' }).errors, [{ code: 'QA-HEADER', file: 'scripts/qa-example.mjs', message: 'scripts/qa-example.mjs: add one first block with one nonempty line for each QA tag and valid covers items.' }]);
}));

test('[ownership-009] uses the synthetic header for a later comment', () => fixture(({ root, put }) => {
  put(FILE, 'export {};\n/**\n * @purpose Bad\n */\n');
  const result = readQaRegister({ root, tracked: [FILE], manifest: { version: 1, owned: [] }, readBaseFile: () => 'export {};\n' });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.scripts, [{ file: 'scripts/qa-example.mjs', purpose: 'Check upstream code.', covers: ['unmapped: upstream'], run: 'node scripts/qa-example.mjs', needs: 'The upstream script needs its own setup.', synthetic: true }]);
}));

test('[ownership-034] prints QA-HEADER for a new script that no adopt record names', () => fixture(({ root, put }) => {
  put(FILE, 'export {};\n');
  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => null, adopts: [] });
  assert.deepEqual(errorCodes(result), ['QA-HEADER']);
  assert.equal(result.validQaScripts.has(FILE), false);
  assert.deepEqual(errorCodes(readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => null, adopts: [{ file: 'scripts/qa-other.mjs' }] })), ['QA-HEADER']);
}));
test('[ownership-035] prints QA-HEADER for a script that had a QA tag at the base and has none now', () => fixture(({ root, put }) => {
  put(FILE, 'export {};\n');
  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => header(), adopts: [] });
  assert.deepEqual(errorCodes(result), ['QA-HEADER']);
  assert.equal(result.validQaScripts.has(FILE), false);
}));

test('[ownership-009 ownership-015] gives the synthetic header to a file that a valid adopt record names', () => fixture(({ root, put }) => {
  put(FILE, '/* Upstream license. */\nexport {};\n');
  const result = readQaRegister({ root, tracked: [FILE], manifest, adopts: [{ file: FILE }] });
  assert.deepEqual(result.errors, []);
  assert.equal(result.scripts[0].synthetic, true);
  assert.equal(result.scripts[0].covers[0], 'unmapped: upstream');
}));


test('[ownership-010] rejects an owned base script without a header', () => fixture(({ root, put }) => {
  put(FILE, 'export {};\n');
  const result = readQaRegister({ root, tracked: [FILE], manifest: { version: 1, owned: ['scripts/'] }, readBaseFile: () => 'export {};\n' });
  assert.deepEqual(errorCodes(result), ['QA-HEADER']);
  assert.equal(result.validQaScripts.has(FILE), false);
}));

test('[ownership-009] gives the synthetic header to a file that one of three adopt records names', () => fixture(({ root, put }) => {
  put(FILE, 'export {};\n');
  const result = readQaRegister({ root, tracked: [FILE], manifest, adopts: [{ file: 'other.js' }, { file: FILE }, { file: 'last.js' }] });
  assert.deepEqual(result.errors, []);
  assert.equal(result.scripts[0].synthetic, true);
  assert.equal(Object.hasOwn(result.scripts[0], 'synthetic'), true);
  assert.equal(result.scripts[0].covers[0], 'unmapped: upstream');
}));

test('[ownership-009] gives the synthetic header when an empty comment comes before a comment with a QA tag', () => fixture(({ root, put }) => {
  put(FILE, '/**/\n/**\n * @purpose Bad.\n */\n');
  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* License. */\n' });
  assert.deepEqual(result.errors, []);
  assert.equal(result.scripts[0].synthetic, true);
}));

test('[ownership-010] prints a QA error after an empty shebang', () => fixture(({ root, put }) => {
  put(FILE, '#!\n/**\n * @purpose Bad.\n */\n');
  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* License. */\n' });
  assert.deepEqual(errorCodes(result), ['QA-HEADER']);
}));

test('[ownership-009] gives the synthetic header when code follows a shebang that ends with CR', () => fixture(({ root, put }) => {
  put(FILE, '#!node\rtrue\n/**\n * @purpose Bad.\n */\n');
  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => '/* License. */\n' });
  assert.deepEqual(result.errors, []);
  assert.equal(result.scripts[0].synthetic, true);
}));

test('[ownership-035] prints QA-HEADER for a base QA tag even with an adopt record', () => fixture(({ root, put }) => {
  put(FILE, 'export {};\n');
  const result = readQaRegister({ root, tracked: [FILE], manifest, readBaseFile: () => header(), adopts: [{ file: FILE }] });
  assert.deepEqual(errorCodes(result), ['QA-HEADER']);
  assert.equal(result.validQaScripts.has(FILE), false);
}));

test('[ownership-054] accepts only upstream scripts with no current or base QA tag', () => {
  const input = { file: FILE, text: 'export {};\n', baseText: null, manifest };
  assert.equal(adoptableQaScript(input), true);
  assert.equal(adoptableQaScript({ ...input, baseText: '/* License. */\n' }), true);
  for (const patch of [{ file: 'src/not-qa.mjs' }, { manifest: undefined }, { manifest: { version: 1, owned: ['scripts/'] } }, { text: header() }, { baseText: header() }]) {
    assert.equal(adoptableQaScript({ ...input, ...patch }), false);
  }
});
