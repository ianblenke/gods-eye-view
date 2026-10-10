import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = new URL('../../', import.meta.url);
const read = (name) => readFileSync(fileURLToPath(new URL(name, ROOT)), 'utf8');
const lines = (text) => text.split('\n');
const code = (text) =>
  lines(text).filter((line) => line.trim() !== '' && !/^\s*#/.test(line));

test('[app-container-001] the Codex override uses the host network, resets the ports and sets PORT', () => {
  const override = lines(read('compose.codex.yaml'));
  assert.ok(override.includes('  gods-eye-view:'));
  assert.ok(override.includes('    network_mode: host'));
  assert.ok(override.includes('    ports: !reset []'));
  assert.ok(override.includes('      PORT: ${GEV_PORT:-4173}'));
});

test('[app-container-002] the Codex override mounts the Codex folder read-only and mounts no other volume', () => {
  const override = code(read('compose.codex.yaml'));
  const start = override.indexOf('    volumes:');
  const mounts = [];
  for (const line of override.slice(start + 1)) {
    if (!line.startsWith('      ')) break;
    mounts.push(line);
  }
  assert.deepEqual(mounts, ['      - ${HOME}/.codex:/home/node/.codex:ro']);
});

test('[app-container-003] the target up-codex builds and starts the app with both compose files', () => {
  const makefile = read('Makefile');
  assert.match(
    makefile,
    /^up-codex:\n\tdocker compose -f compose\.yaml -f compose\.codex\.yaml build\n\tdocker compose -f compose\.yaml -f compose\.codex\.yaml up --force-recreate\n(?!\s*\t)/m,
  );
  const phony = lines(makefile).find((line) => line.startsWith('.PHONY:'));
  assert.ok(phony.split(/\s+/).includes('up-codex'));
});

test('[app-container-004] the default compose file and the target up stay as they are', () => {
  const base = read('compose.yaml');
  assert.ok(lines(base).includes('      - "${GEV_PORT:-4173}:4173"'));
  assert.equal(
    code(base).some((line) => line.includes('network_mode')),
    false,
  );
  assert.equal(
    code(base).some((line) => line.includes('.codex')),
    false,
  );
  assert.match(
    read('Makefile'),
    /^up:\n\tdocker compose build\n\tdocker compose up --force-recreate\n(?!\s*\t)/m,
  );
});
