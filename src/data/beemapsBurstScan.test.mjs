import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';

const ROOT = new URL('../../', import.meta.url);
const read = (relative) => readFileSync(new URL(relative, ROOT), 'utf8');

/** The plugin file and every file in the folder of the plugin, by relative name. */
function pluginFiles() {
  const base = 'server/providers/';
  const files = { 'beemaps-burst.js': read(`${base}beemaps-burst.js`) };
  for (const name of readdirSync(new URL(`${base}beemaps-burst/`, ROOT)))
    files[`beemaps-burst/${name}`] = read(`${base}beemaps-burst/${name}`);
  return files;
}

/** The text of every source file under a folder. */
function textsUnder(relative) {
  const out = {};
  const walk = (dir) => {
    for (const name of readdirSync(new URL(dir, ROOT))) {
      const child = `${dir}${name}`;
      if (statSync(new URL(child, ROOT)).isDirectory()) walk(`${child}/`);
      else if (/\.(js|mjs|json|cjs)$/.test(name)) out[child] = read(child);
    }
  };
  walk(relative);
  return out;
}

test('[beemaps-burst-control-038] has the plugin file and the files of its own folder, and no file of the frames provider', () => {
  assert.deepEqual(Object.keys(pluginFiles()).sort(), [
    'beemaps-burst.js',
    'beemaps-burst/audit.js',
    'beemaps-burst/credits.js',
    'beemaps-burst/ledger.js',
    'beemaps-burst/quotes.js',
    'beemaps-burst/upstream.js',
    'beemaps-burst/validate.js',
  ]);
  const framesFolder = readdirSync(new URL('server/providers/beemaps/', ROOT));
  assert.deepEqual(framesFolder.sort(), ['budget.js', 'normalize.js', 'upstream.js', 'validate.js']);
});

test('[beemaps-burst-control-038] holds the two upstream addresses once each and no other address in the plugin files', () => {
  const files = Object.values(pluginFiles());
  const urls = files.flatMap((text) => text.match(/https?:\/\/[^\s'"`)]+/g) ?? []);
  assert.deepEqual(urls.sort(), [
    'https://beemaps.com/api/developer/burst/create',
    'https://beemaps.com/api/developer/bursts',
  ]);
  const hosts = files.flatMap((text) => text.match(/beemaps\.com/g) ?? []);
  assert.deepEqual(hosts, ['beemaps.com', 'beemaps.com']);
  assert.equal(
    pluginFiles()['beemaps-burst/upstream.js'].includes("'https://beemaps.com/api/developer/burst/create'"),
    true,
  );
});

test('[beemaps-burst-control-038] holds no text of the frames address or of the frames route in the plugin files', () => {
  for (const [name, text] of Object.entries(pluginFiles())) {
    assert.equal(text.includes('latest/poly'), false, name);
    assert.equal(text.includes('/api/beemaps/frames'), false, name);
    assert.equal(text.includes('BEEMAPS_API_KEY'), false, name);
  }
});

test('[beemaps-burst-control-038] holds no text of the burst routes in the voice, tools and MCP files', () => {
  for (const folder of ['src/voice/', 'src/tools/', 'server/mcp/']) {
    const texts = textsUnder(folder);
    assert.equal(Object.keys(texts).length > 3, true, folder);
    for (const [name, text] of Object.entries(texts))
      assert.equal(text.includes('beemaps/burst'), false, name);
  }
});
