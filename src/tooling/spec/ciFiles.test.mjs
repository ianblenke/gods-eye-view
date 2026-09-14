import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (file) => readFileSync(new URL(`../../../${file}`, import.meta.url), 'utf8');

/** The lines of one top-level job in a GitHub Actions workflow. */
function jobBlock(workflow, job) {
  const lines = workflow.split('\n');
  const start = lines.indexOf(`  ${job}:`);
  assert.notEqual(start, -1, `job ${job}`);
  const end = lines.findIndex((line, index) => index > start && /^ {2}\S/.test(line));
  return lines.slice(start, end === -1 ? undefined : end).join('\n');
}

test('[ci-gates-006] runs the CI command in the workflow with the pinned Node version and the full history', () => {
  const job = jobBlock(read('.github/workflows/ci.yml'), 'spec-gates');
  assert.match(job, /run: node scripts\/spec\/gates\.mjs ci --base origin\//);
  assert.match(job, /node-version-file: \.node-version/);
  assert.match(job, /fetch-depth: 0/);
});

test('[ci-gates-007] runs the gates with make in the Docker image', () => {
  const makefile = read('Makefile');
  assert.match(makefile, /^GATES := \$\(RUN_IMAGE\) node scripts\/spec\/gates\.mjs$/m);
  assert.match(makefile, /^RUN_IMAGE := docker run --rm .* \$\(IMAGE\)$/m);
  assert.match(makefile, /^gates: ensure-image\n\t\$\(GATES\) check \$\(CHANGE_ARG\) \$\(BASE_ARG\)$/m);
  assert.match(makefile, /^CHANGE_ARG := \$\(if \$\(CHANGE\),--change \$\(CHANGE\),\)$/m);
  assert.match(makefile, /^BASE_ARG := \$\(if \$\(BASE\),--base \$\(BASE\),\)$/m);
  for (const [target, command] of [['gates-init', 'init $(BASE_ARG)'], ['ratchet', 'ratchet $(CHANGE_ARG) $(BASE_ARG)'], ['stability', 'stability $(CHANGE_ARG) $(BASE_ARG)'], ['lint', 'lint'], ['tree', 'tree $(CHANGE_ARG) $(BASE_ARG)']]) {
    assert.ok(makefile.includes(`\n${target}: ensure-image\n\t$(GATES) ${command}\n`), target);
  }
});

test('[ci-gates-008] pins the Node version of the image and installs Git', () => {
  const version = read('.node-version').trim();
  const dockerfile = read('Dockerfile');
  assert.match(version, /^\d+\.\d+\.\d+$/);
  assert.match(dockerfile, new RegExp(`^FROM node:${version.replaceAll('.', '\\.')}-bookworm-slim$`, 'm'));
  assert.match(dockerfile, /apt-get install -y --no-install-recommends git/);
});
