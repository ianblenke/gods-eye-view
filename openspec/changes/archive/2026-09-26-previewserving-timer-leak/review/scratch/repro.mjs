import { createHash } from 'node:crypto';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const root = '/home/ianblenke/docker/gev-work/leakfix';
const file = process.argv[2] || 'src/tooling/previewServing.test.mjs';
const count = Number(process.argv[3] || 30);
const loaded = process.argv[4] === 'loaded';
const diagnostic = process.argv[4] === 'diagnostic';
const out = mkdtempSync(path.join(tmpdir(), 'gev-leak-repro-'));
const inventory = '{}';
writeFileSync(path.join(out, 'inventory.json'), inventory);
const env = { ...process.env };
delete env.NODE_OPTIONS;
delete env.NODE_V8_COVERAGE;
delete env.NODE_TEST_CONTEXT;
env.NODE_OPTIONS = `--require=${JSON.stringify(path.join(root, 'scripts/spec/lib/test-guard.mjs'))}`;
if (diagnostic) env.NODE_OPTIONS += ` --import=${path.join('/home/ianblenke/docker/gev-tools/leakfix', 'timer-hook.mjs')}`;
env.GEV_SPEC_OUT = out;
env.GEV_SPEC_ROOT = root;
env.GEV_SPEC_INVENTORY = createHash('sha256').update(inventory).digest('hex');
const workers = [];
if (loaded) for (let i = 0; i < 16; i++) workers.push(spawn(process.execPath, ['-e', 'while(true){}'], { stdio: 'ignore' }));
let leaks = 0;
let failures = 0;
try {
  for (let i = 0; i < count; i++) {
    const start = new Set(readdirSync(out).filter((name) => /^guard-\d+\.jsonl$/.test(name)));
    const result = spawnSync(process.execPath, ['--test', '--experimental-test-coverage', '--test-force-exit', '--test-coverage-exclude=**/*.test.mjs', '--test-reporter=lcov', `--test-reporter-destination=${out}/lcov.info`, `--test-reporter=${path.join(root, 'scripts/spec/lib/trace-reporter.mjs')}`, `--test-reporter-destination=${out}/trace-${i}.jsonl`, file], { cwd: root, env, encoding: 'utf8', timeout: 120000 });
    const records = readdirSync(out).filter((name) => /^guard-\d+\.jsonl$/.test(name) && !start.has(name)).flatMap((name) => readFileSync(path.join(out, name), 'utf8').split('\n').filter(Boolean).map(JSON.parse));
    const found = records.flatMap((record) => record.leaks || []);
    if (found.length) { leaks++; process.stdout.write(`${i + 1} LEAK ${JSON.stringify(found)}\n`); if (diagnostic) process.stdout.write(result.stderr.slice(-12000)); }
    if (result.status !== 0) { failures++; process.stdout.write(`${i + 1} FAIL status=${result.status} error=${result.error?.message || ''} ${result.stderr.slice(-500)}\n`); }
    if ((i + 1) % 10 === 0) process.stdout.write(`${i + 1}/${count} leaks=${leaks} failures=${failures}\n`);
  }
} finally {
  for (const worker of workers) worker.kill('SIGTERM');
}
process.stdout.write(`TOTAL file=${file} loaded=${loaded} runs=${count} leaks=${leaks} failures=${failures} out=${out}\n`);
