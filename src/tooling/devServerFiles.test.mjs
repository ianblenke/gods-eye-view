import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { isFileLoadingAllowed, resolveConfig } from 'vite';
import { createBrowserViteConfig } from '../../build/vite.js';

test('[dev-server-files-001] the browser config denies the log folder, the cache folder and the old files', () => {
  const { deny } = createBrowserViteConfig({ plugins: [] }).server.fs;
  for (const entry of [
    '**/.gev-logs/**',
    '**/.gev-cache/**',
    '.env',
    '.env.*',
    '*.{crt,pem}',
    '**/.git/**',
    '**/ENVIRONMENT',
  ]) {
    assert.ok(deny.includes(entry), entry);
  }
});

test('[dev-server-files-002] Vite refuses the files of the log and cache folders and loads the files of the app', async (t) => {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-deny-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const config = await resolveConfig(
    { ...createBrowserViteConfig({ plugins: [] }), configFile: false, root },
    'serve',
  );
  const allowed = (file) => isFileLoadingAllowed(config, path.join(root, file));
  for (const file of [
    '.gev-logs/realtime-conversations.jsonl',
    '.gev-logs/osh-commands.jsonl',
    '.gev-cache/adsbdb.json',
    '.gev-cache/mcp-panel-key',
    'nested/.gev-logs/x.jsonl',
  ]) {
    assert.equal(allowed(file), false, file);
  }
  for (const file of ['package.json', 'src/main.js']) {
    assert.equal(allowed(file), true, file);
  }
});
