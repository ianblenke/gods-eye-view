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
  assert.match(job, /- name: Keep the gate results\n\s+if: always\(\)\n\s+uses: actions\/upload-artifact@v4\n\s+with:\n\s+name: spec-gate-results\n\s+path: \.gev-cache\/spec\//);
});

test('[ci-gates-007] runs the gates with make in the Docker image', () => {
  const makefile = read('Makefile');
  assert.match(makefile, /^GATES := docker run --rm -v "\$\(CURDIR\)":\/src \$\(IMAGE\) sh -c '\$\(GATES_COPY\) \|\| exit 2; env -u NODE_ENV -u HOST -u PORT node scripts\/spec\/gates\.mjs "\$\$@"; status=\$\$\?; \$\(GATES_BACK\) \|\| exit 2; exit \$\$status' gates$/m);
  const copy = makefile.match(/^GATES_COPY := (.*)$/m)[1];
  assert.deepEqual(copy.split(' && '), [
      "mkdir -p /tmp/work",
      "cd /src",
      "git ls-files -z --cached --others --exclude-standard > /tmp/listed",
      "git ls-files -z --deleted > /tmp/removed",
      "sort -zu /tmp/listed > /tmp/all",
      "sort -zu /tmp/removed > /tmp/deleted",
      "comm -z -23 /tmp/all /tmp/deleted > /tmp/files",
      "tar --null --verbatim-files-from -T /tmp/files -cf /tmp/copy.tar",
      "tar -xf /tmp/copy.tar -C /tmp/work",
      "cp -a /src/.git /tmp/work/.git",
      "ln -s /app/node_modules /tmp/work/node_modules",
      "mkdir -p /tmp/work/.gev-cache",
      "cd /tmp/work"
  ]);
  assert.match(makefile, /^GATES_BACK := rm -rf \/src\/\.gev-cache\/spec && cp -a \/tmp\/work\/openspec\/trace\/\. \/src\/openspec\/trace\/ && mkdir -p \/src\/\.gev-cache && cp -a \/tmp\/work\/\.gev-cache\/\. \/src\/\.gev-cache\/$/m);
  assert.doesNotMatch(makefile, /:\/app\/\.env/);
  assert.match(makefile, /^RUN_IMAGE := docker run --rm .* \$\(IMAGE\)$/m);
  assert.match(makefile, /^gates: ensure-image\n\t\$\(GATES\) check \$\(CHANGE_ARG\) \$\(BASE_ARG\)$/m);
  assert.match(makefile, /^CHANGE_ARG := \$\(if \$\(CHANGE\),--change \$\(CHANGE\),\)$/m);
  assert.match(makefile, /^BASE_ARG := \$\(if \$\(BASE\),--base \$\(BASE\),\)$/m);
  for (const [target, command] of [['gates-init', 'init $(BASE_ARG)'], ['ratchet', 'ratchet $(CHANGE_ARG) $(BASE_ARG)'], ['lint', 'lint'], ['tree', 'tree $(CHANGE_ARG) $(BASE_ARG)']]) {
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

test('[gap-ledger-099] runs the adopt command with make', () => {
  const makefile = read('Makefile');
  assert.match(makefile, /^FROM_ARG := \$\(if \$\(FROM\),--from \$\(FROM\),\)$/m);
  assert.equal(makefile.match(/^FROM_ARG :=/gm).length, 1);
  assert.ok(makefile.includes('\nadopt: ensure-image\n\t$(GATES) adopt $(CHANGE_ARG) $(BASE_ARG) $(FROM_ARG)\n'));
  assert.match(makefile, /^\.PHONY: .*\badopt\b/m);
});
