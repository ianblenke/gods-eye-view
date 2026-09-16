import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

/** The OpenSpec version that the gates use for the spec checks. */
export const OPENSPEC_VERSION = '1.3.1';

const require = createRequire(import.meta.url);
const COUNTED_OPERATION = /^(ADDED|MODIFIED)$/;

/**
 * Run the OpenSpec CLI of the project dependency, with no color and no usage statistics.
 *
 * @param {string} root - The project root, used as the working folder.
 * @param {string[]} args - The CLI arguments.
 * @param {{spawn?: Function, resolve?: (id: string) => string}} [options]
 * @returns {{status: number|null, stdout: string, error: string|null}}
 */
export function runOpenSpec(root, args, { spawn = spawnSync, resolve = (id) => require.resolve(id) } = {}) {
  let bin;
  try {
    bin = path.join(path.dirname(resolve('@fission-ai/openspec')), '..', 'bin', 'openspec.js');
  } catch (error) {
    return { status: null, stdout: '', error: `the OpenSpec CLI is not installed (${error.message})` };
  }
  const result = spawn(process.execPath, [bin, ...args], { cwd: root, encoding: 'utf8', env: { ...process.env, NO_COLOR: '1', OPENSPEC_TELEMETRY: '0' } });
  return { status: result.status, stdout: result.stdout ?? '', error: result.error ? result.error.message : null };
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function sortedCounts(counts) {
  return [...counts].sort((a, b) => a - b).join(',');
}

function specFolders(root, folder) {
  const absolute = path.join(root, folder);
  if (!existsSync(absolute)) return [];
  return readdirSync(absolute, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(path.join(absolute, entry.name, 'spec.md')))
    .map((entry) => entry.name)
    .sort();
}

/** The scenario count of each requirement in one spec file, from the gate parser. */
function gateCounts(specs, file) {
  return specs.requirements.filter((item) => item.file === file && !item.removed).map((item) => item.scenarios.length);
}

/**
 * Compare the specs with the pinned OpenSpec CLI. The CLI must accept each main spec in
 * strict mode. For each main spec and each active change with a proposal, the CLI must
 * read the same number of requirements and scenarios as the gate parser.
 *
 * @param {object} input
 * @param {string} input.root - The project root.
 * @param {object} input.specs - The result of loadSpecs.
 * @param {(args: string[]) => {status: number|null, stdout: string, error: string|null}} input.run - Runs the CLI.
 * @returns {object[]} Errors.
 */
export function checkOpenSpec({ root, specs, run }) {
  const version = run(['--version']);
  const found = version.error ?? version.stdout.trim();
  if (found !== OPENSPEC_VERSION) {
    return [{ code: 'GATES-OPENSPEC', file: 'package.json', message: `The spec checks need OpenSpec ${OPENSPEC_VERSION}, but the CLI gave: ${found}` }];
  }
  const errors = [];
  const validation = parseJson(run(['validate', '--specs', '--strict', '--json', '--no-interactive']).stdout);
  if (!validation) {
    return [{ code: 'GATES-OPENSPEC', file: 'openspec', message: 'OpenSpec validate gave no JSON result' }];
  }
  for (const item of validation.items.filter((entry) => !entry.valid)) {
    const issues = item.issues.map((issue) => `${issue.level} ${issue.path}: ${issue.message}`).join('; ');
    errors.push({ code: 'SPEC-OPENSPEC-INVALID', file: `openspec/specs/${item.id}/spec.md`, message: `OpenSpec does not accept spec ${item.id} in strict mode: ${issues}` });
  }

  const compare = (file, theirs, show) => {
    const ours = gateCounts(specs, file);
    if (sortedCounts(ours) === sortedCounts(theirs)) return;
    errors.push({
      code: 'SPEC-OPENSPEC-COUNT',
      file,
      message: `The gates read ${ours.length} requirements with ${ours.reduce((a, b) => a + b, 0)} scenarios, but OpenSpec ${show} reads ${theirs.length} requirements with ${theirs.reduce((a, b) => a + b, 0)} scenarios`,
    });
  };
  const show = (args, file) => {
    const result = parseJson(run(['show', ...args, '--json', '--no-interactive']).stdout);
    if (!result) errors.push({ code: 'SPEC-OPENSPEC-INVALID', file, message: `OpenSpec show ${args[0]} gave no JSON result` });
    return result;
  };

  for (const capability of specFolders(root, 'openspec/specs')) {
    const file = `openspec/specs/${capability}/spec.md`;
    const result = show([capability, '--type', 'spec'], file);
    if (result) compare(file, result.requirements.map((item) => item.scenarios.length), 'show');
  }
  for (const change of [...specs.changeIds.keys()].filter((name) => existsSync(path.join(root, 'openspec/changes', name, 'proposal.md')))) {
    const result = show([change, '--type', 'change', '--deltas-only'], `openspec/changes/${change}`);
    if (!result) continue;
    for (const capability of specFolders(root, `openspec/changes/${change}/specs`)) {
      const deltas = result.deltas.filter((delta) => delta.spec === capability && COUNTED_OPERATION.test(delta.operation));
      compare(`openspec/changes/${change}/specs/${capability}/spec.md`, deltas.map((delta) => delta.requirement.scenarios.length), 'show --deltas-only');
    }
  }
  return errors;
}
