import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { OPENSPEC_VERSION, checkOpenSpec, runOpenSpec } from '../../../scripts/spec/lib/openspec.mjs';

function withRoot(files, body) {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-openspec-'));
  try {
    for (const file of files) {
      mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
      writeFileSync(path.join(root, file), '# spec\n');
    }
    return body(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

const VALID = { items: [{ id: 'demo', type: 'spec', valid: true, issues: [] }] };

/** A fake CLI that answers each command from a table. */
function fakeCli(answers) {
  const calls = [];
  const run = (args) => {
    calls.push(args.join(' '));
    const key = Object.keys(answers).find((prefix) => args.join(' ').startsWith(prefix));
    const answer = key === undefined ? { stdout: '' } : answers[key];
    return { status: 0, error: null, stdout: typeof answer.stdout === 'string' ? answer.stdout : JSON.stringify(answer.stdout), ...(answer.error ? { error: answer.error } : {}) };
  };
  return { run, calls };
}

const requirement = (file, scenarios, removed = false) => ({ file, removed, scenarios: Array.from({ length: scenarios }, () => ({})) });

test('[spec-lint-020] stops when the OpenSpec CLI does not have the pinned version', () => {
  const specs = { requirements: [], changeIds: new Map() };
  const missing = fakeCli({ '--version': { stdout: '', error: 'the OpenSpec CLI is not installed (not found)' } });
  assert.deepEqual(checkOpenSpec({ root: '/repo', specs, run: missing.run }), [
    { code: 'GATES-OPENSPEC', file: 'package.json', message: `The spec checks need OpenSpec ${OPENSPEC_VERSION}, but the CLI gave: the OpenSpec CLI is not installed (not found)` },
  ]);
  const old = fakeCli({ '--version': { stdout: '1.2.0\n' } });
  assert.deepEqual(checkOpenSpec({ root: '/repo', specs, run: old.run }).map((error) => error.code), ['GATES-OPENSPEC']);
  assert.deepEqual(old.calls, ['--version']);
  assert.equal(OPENSPEC_VERSION, '1.3.1');
});

test('[spec-lint-020] runs the OpenSpec CLI from the development dependency', () => {
  const seen = [];
  const spawn = (command, args, options) => {
    seen.push([command, args, options.cwd, options.env.NO_COLOR, options.env.OPENSPEC_TELEMETRY]);
    return { status: 0, stdout: '1.3.1\n' };
  };
  const result = runOpenSpec('/repo', ['--version'], { spawn, resolve: () => '/deps/openspec/dist/index.js' });
  assert.deepEqual(result, { status: 0, stdout: '1.3.1\n', error: null });
  assert.deepEqual(seen, [[process.execPath, [path.join('/deps/openspec/bin/openspec.js'), '--version'], '/repo', '1', '0']]);
  const failed = runOpenSpec('/repo', ['--version'], { spawn: () => ({ status: null, error: new Error('spawn failed') }), resolve: () => '/deps/openspec/dist/index.js' });
  assert.deepEqual(failed, { status: null, stdout: '', error: 'spawn failed' });
  const missing = runOpenSpec('/repo', ['--version'], {
    resolve: () => {
      throw new Error('no module');
    },
  });
  assert.deepEqual(missing, { status: null, stdout: '', error: 'the OpenSpec CLI is not installed (no module)' });
  const installed = runOpenSpec(process.cwd(), ['--version'], { spawn: () => ({ status: 0, stdout: 'x' }) });
  assert.ok(installed.stdout === 'x' || installed.error.startsWith('the OpenSpec CLI is not installed'), JSON.stringify(installed));
});

test('[spec-lint-018] stops for a spec that OpenSpec does not accept in strict mode', () => {
  withRoot([], (root) => {
    const specs = { requirements: [], changeIds: new Map() };
    const invalid = {
      items: [
        { id: 'demo', type: 'spec', valid: false, issues: [{ level: 'WARNING', path: 'overview', message: 'Purpose section is too brief' }] },
        { id: 'radio', type: 'spec', valid: false, issues: [{ level: 'ERROR', path: 'requirements', message: 'No scenario' }, { level: 'ERROR', path: 'overview', message: 'Too short' }] },
        { id: 'fine', type: 'spec', valid: true, issues: [] },
      ],
    };
    const cli = fakeCli({ '--version': { stdout: `${OPENSPEC_VERSION}\n` }, validate: { stdout: invalid } });
    assert.deepEqual(checkOpenSpec({ root, specs, run: cli.run }), [
      { code: 'SPEC-OPENSPEC-INVALID', file: 'openspec/specs/demo/spec.md', message: 'OpenSpec does not accept spec demo in strict mode: WARNING overview: Purpose section is too brief' },
      { code: 'SPEC-OPENSPEC-INVALID', file: 'openspec/specs/radio/spec.md', message: 'OpenSpec does not accept spec radio in strict mode: ERROR requirements: No scenario; ERROR overview: Too short' },
    ]);
    assert.deepEqual(cli.calls, ['--version', 'validate --specs --strict --json --no-interactive']);
    const broken = fakeCli({ '--version': { stdout: OPENSPEC_VERSION }, validate: { stdout: 'not json' } });
    assert.deepEqual(checkOpenSpec({ root, specs, run: broken.run }), [{ code: 'GATES-OPENSPEC', file: 'openspec', message: 'OpenSpec validate gave no JSON result' }]);
  });
});

test('[spec-lint-019] stops when OpenSpec and the gates read a different number of requirements or scenarios', () => {
  const files = ['openspec/specs/demo/spec.md', 'openspec/specs/radio/spec.md', 'openspec/changes/add-demo/proposal.md', 'openspec/changes/add-demo/specs/demo/spec.md', 'openspec/changes/add-demo/specs/radio/spec.md', 'openspec/specs/empty/notes.md', 'openspec/changes/draft/specs/demo/spec.md'];
  withRoot(files, (root) => {
    const specs = {
      requirements: [
        requirement('openspec/specs/demo/spec.md', 1),
        requirement('openspec/specs/demo/spec.md', 2),
        requirement('openspec/specs/radio/spec.md', 1),
        requirement('openspec/changes/add-demo/specs/demo/spec.md', 1),
        requirement('openspec/changes/add-demo/specs/demo/spec.md', 0, true),
        requirement('openspec/changes/add-demo/specs/radio/spec.md', 3),
      ],
      changeIds: new Map([['add-demo', ['demo-001']], ['draft', []]]),
    };
    const cli = fakeCli({
      '--version': { stdout: OPENSPEC_VERSION },
      validate: { stdout: VALID },
      'show demo': { stdout: { requirements: [{ scenarios: [{}, {}] }, { scenarios: [{}] }] } },
      'show radio': { stdout: { requirements: [{ scenarios: [{}] }, { scenarios: [] }] } },
      'show add-demo': {
        stdout: {
          deltas: [
            { spec: 'demo', operation: 'ADDED', requirement: { scenarios: [{}] } },
            { spec: 'demo', operation: 'REMOVED', requirement: { scenarios: [] } },
            { spec: 'radio', operation: 'MODIFIED', requirement: { scenarios: [{}, {}] } },
          ],
        },
      },
    });
    assert.deepEqual(checkOpenSpec({ root, specs, run: cli.run }), [
      { code: 'SPEC-OPENSPEC-COUNT', file: 'openspec/specs/radio/spec.md', message: 'The gates read 1 requirements with 1 scenarios, but OpenSpec show reads 2 requirements with 1 scenarios' },
      { code: 'SPEC-OPENSPEC-COUNT', file: 'openspec/changes/add-demo/specs/radio/spec.md', message: 'The gates read 1 requirements with 3 scenarios, but OpenSpec show --deltas-only reads 1 requirements with 2 scenarios' },
    ]);
    assert.deepEqual(cli.calls.slice(2), ['show demo --type spec --json --no-interactive', 'show radio --type spec --json --no-interactive', 'show add-demo --type change --deltas-only --json --no-interactive']);
    const noShow = fakeCli({ '--version': { stdout: OPENSPEC_VERSION }, validate: { stdout: VALID } });
    assert.deepEqual(checkOpenSpec({ root, specs, run: noShow.run }).map((error) => [error.code, error.file, error.message]), [
      ['SPEC-OPENSPEC-INVALID', 'openspec/specs/demo/spec.md', 'OpenSpec show demo gave no JSON result'],
      ['SPEC-OPENSPEC-INVALID', 'openspec/specs/radio/spec.md', 'OpenSpec show radio gave no JSON result'],
      ['SPEC-OPENSPEC-INVALID', 'openspec/changes/add-demo', 'OpenSpec show add-demo gave no JSON result'],
    ]);
  });
  withRoot([], (root) => {
    const cli = fakeCli({ '--version': { stdout: OPENSPEC_VERSION }, validate: { stdout: VALID } });
    assert.deepEqual(checkOpenSpec({ root, specs: { requirements: [], changeIds: new Map() }, run: cli.run }), []);
  });
});
