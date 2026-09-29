import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const root = new URL('../../', import.meta.url);
const source = (file) => readFileSync(new URL(file, root), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, '');
const serverFiles = ['server/providers/osh-control.js', ...readdirSync(new URL('server/providers/osh-control/', root)).filter((name) => name.endsWith('.js')).map((name) => `server/providers/osh-control/${name}`)];

test('[osh-control-022] Keep one upstream POST and one browser fetch call site', () => {
  for (const file of serverFiles) {
    const text = source(file);
    assert.equal((text.match(/\bfetchImpl\s*\(/g) || []).length, file.endsWith('/post.js') ? 1 : 0, file);
    assert.equal(/['"](?:DELETE|PUT|PATCH)['"]/i.test(text), false, file);
    assert.equal(/\bWebSocket\s*\(|from\s*['"](?:node:http|node:https|undici|ws)['"]/.test(text), false, file);
  }
  assert.match(source('server/providers/osh-control/post.js'), /method:\s*'POST'/);
  const client = source('src/layers/oshControl/client.js');
  assert.equal((client.match(/\bfetchImpl\s*\(/g) || []).length, 1);
  assert.match(client, /\/api\/control\/osh\/commands/);
  assert.match(client, /method:\s*'POST'/);
});

test('[osh-control-023] Keep imports outside the old scan set', () => {
  const old = ['server/providers/osh.js', 'server/providers/common/http.js', 'src/sources/httpBody.js', ...readdirSync(new URL('server/providers/osh/', root)).filter((name) => name.endsWith('.js')).map((name) => `server/providers/osh/${name}`), ...readdirSync(new URL('src/data/', root)).filter((name) => /^osh.*\.js$/.test(name)).map((name) => `src/data/${name}`)];
  for (const file of old) assert.equal(/(?:import|from)\s*['"][^'"]*osh-control/.test(source(file)), false, file);
  for (const file of serverFiles) assert.equal(/from\s*['"][^'"]*\/post\.js['"]/.test(source(file)), file === 'server/providers/osh-control.js', file);
});
