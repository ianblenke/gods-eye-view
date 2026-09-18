import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, writeFile, rm, readFile, readdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { build } from 'vite';
import { createBrowserViteConfig } from '../../build/vite.js';
import { KEY_SETUP_KEYS, knownKeySetupEnvVars } from '../keySetupCore.mjs';

/** Every `NAME=` (commented or not) named in `.env.example`. */
function envExampleNames() {
  const text = readFileSync(new URL('../../.env.example', import.meta.url), 'utf8');
  const names = new Set();
  for (const match of text.matchAll(/^#?\s*([A-Z][A-Z0-9_]*)=/gm)) names.add(match[1]);
  return names;
}

/** The AIS live knobs. Not credentials; allowed to reach the bundle by design. */
const AIS_KNOB_NAMES = ['VITE_AIS_LIVE_API_URL', 'VITE_AIS_LIVE_MAX_ROWS', 'VITE_AIS_LIVE_LABEL_MAX_ROWS'];

/** Every credential name the build must keep out of the browser bundle. */
function combinedCredentialNames() {
  const names = new Set([...knownKeySetupEnvVars(), ...envExampleNames()]);
  for (const name of AIS_KNOB_NAMES) names.delete(name);
  return names;
}

/** The names the build is allowed to expose, by design. */
function allowedNames() {
  const clientExposed = KEY_SETUP_KEYS.filter((entry) => entry.clientExposed).flatMap(
    (entry) => entry.envVars,
  );
  return new Set([...clientExposed, 'VITE_AIS_LIVE_MAX_ROWS']);
}

/** Recursively list every file under a directory, as absolute paths. */
async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(full)));
    else files.push(full);
  }
  return files;
}

/**
 * Build a fixture page through the real browser config, with a sentinel value
 * for every credential name plus a probe outside the AIS `VITE_` prefix, then
 * scan every output file for `GEV_SENTINEL_...` text. No name's value is ever
 * printed; only its presence in the output is asserted.
 */
async function buildFixture(t) {
  const names = [...combinedCredentialNames()];
  // VITE_AIS_LIVE_MAX_ROWS stands for the whole AIS prefix, as a positive
  // control; VITE_GEV_PROBE_SECRET proves an unrelated VITE_ name does not.
  const extraNames = ['VITE_GEV_PROBE_SECRET', 'VITE_AIS_LIVE_MAX_ROWS'];
  const previous = new Map();
  for (const name of [...names, ...extraNames]) {
    previous.set(name, process.env[name]);
    process.env[name] = `GEV_SENTINEL_${name}`;
  }
  t.after(() => {
    for (const [name, value] of previous) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  });

  const root = await mkdtemp(path.join(tmpdir(), 'gev-bundle-credentials-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(
    path.join(root, 'index.html'),
    '<!doctype html><title>fixture</title><script type="module" src="./main.js"></script>',
  );
  const probeLines = [...names, ...extraNames]
    .map((name) => `probe.${name} = import.meta.env.${name};`)
    .join('\n');
  await writeFile(
    path.join(root, 'main.js'),
    `const probe = {};\n${probeLines}\nprobe.__ENV__ = JSON.stringify(import.meta.env);\nwindow.__GEV_BUNDLE_PROBE__ = probe;\n`,
  );

  const outDir = path.join(root, 'dist');
  const config = createBrowserViteConfig({
    googleApiKey: process.env.GOOGLE_MAPS_API_KEY,
    cesiumToken: process.env.CESIUM_ION_TOKEN,
  });
  await build({
    root,
    configFile: false,
    envFile: false,
    publicDir: false,
    logLevel: 'silent',
    envPrefix: config.envPrefix,
    define: config.define,
    build: { outDir, write: true },
  });

  const files = await listFiles(outDir);
  const found = new Set();
  const byFile = new Map();
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    for (const match of text.matchAll(/GEV_SENTINEL_[A-Z0-9_]+/g)) {
      found.add(match[0]);
      if (!byFile.has(match[0])) byFile.set(match[0], path.relative(root, file));
    }
  }
  return { names, found, byFile };
}

test('[credential-boundary-001] a fixture build exposes only the allowed sentinels', async (t) => {
  const { found } = await buildFixture(t);
  const allowed = new Set([...allowedNames()].map((name) => `GEV_SENTINEL_${name}`));
  assert.deepEqual(found, allowed);
});

test('[credential-boundary-001] every secret sentinel stays out of the built output, by name', async (t) => {
  const { names, found, byFile } = await buildFixture(t);
  const allowed = allowedNames();
  const secretNames = names.filter((name) => !allowed.has(name));
  for (const name of secretNames) {
    const sentinel = `GEV_SENTINEL_${name}`;
    assert.equal(
      found.has(sentinel),
      false,
      `${name} reached the browser bundle in ${byFile.get(sentinel)}`,
    );
  }
  for (const name of allowedNames()) {
    const sentinel = `GEV_SENTINEL_${name}`;
    assert.equal(found.has(sentinel), true, `${name} is missing from the bundle; the scan is broken`);
  }
});

test('[credential-boundary-002] a VITE_ value outside the AIS prefix never reaches the bundle', async (t) => {
  const { found } = await buildFixture(t);
  assert.equal(found.has('GEV_SENTINEL_VITE_GEV_PROBE_SECRET'), false);
  assert.equal(found.has('GEV_SENTINEL_VITE_AIS_LIVE_MAX_ROWS'), true);
});

test('[credential-boundary-016] the server key stays out of the bundle and out of the global, named on failure', async (t) => {
  const { found, byFile } = await buildFixture(t);
  const sentinel = 'GEV_SENTINEL_GOOGLE_MAPS_SERVER_API_KEY';
  assert.equal(
    found.has(sentinel),
    false,
    `GOOGLE_MAPS_SERVER_API_KEY reached the browser bundle in ${byFile.get(sentinel)}`,
  );
  const mainSource = readFileSync(new URL('../main.js', import.meta.url), 'utf8');
  assert.match(mainSource, /googleApiKey:\s*import\.meta\.env\.GOOGLE_MAPS_API_KEY/);
  assert.equal(mainSource.includes('SERVER_API_KEY'), false);
});

/** Key-shaped literal patterns a browser source file must never contain. */
const KEY_SHAPED_PATTERNS = [
  { name: 'a Google API key', pattern: /AIza[0-9A-Za-z_-]{35}/, sample: `AIza${'A'.repeat(35)}` },
  { name: 'an OpenAI secret key', pattern: /sk-[A-Za-z0-9_-]{32,}/, sample: `sk-${'a'.repeat(32)}` },
  { name: 'a JWT', pattern: /eyJ[A-Za-z0-9_-]{16,}\.eyJ/, sample: `eyJ${'a'.repeat(16)}.eyJ` },
];

/** Every non-test `.js` file directly under a directory, recursively. */
async function jsFilesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await jsFilesUnder(full)));
    else if (entry.name.endsWith('.js') && !entry.name.endsWith('.test.js')) files.push(full);
  }
  return files;
}

test('[credential-boundary-004] no key-shaped literal appears in browser source', async () => {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const files = [
    path.join(root, 'index.html'),
    ...(await jsFilesUnder(path.join(root, 'build'))),
    ...(await jsFilesUnder(path.join(root, 'src'))),
  ];
  for (const { name, pattern, sample } of KEY_SHAPED_PATTERNS) {
    assert.match(sample, pattern, `the pattern for ${name} must match its own synthetic sample`);
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      assert.doesNotMatch(text, pattern, `${file} contains what looks like ${name}`);
    }
  }
});

test('[credential-boundary-015] no direct call to Google geocoding remains in the browser source', async () => {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const pattern = /maps\.googleapis\.com\/maps\/api\/geocode/;
  const browserFiles = await jsFilesUnder(path.join(root, 'src'));
  for (const file of browserFiles) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), pattern, file);
  }
  const serverFiles = await jsFilesUnder(path.join(root, 'server'));
  const matches = serverFiles.filter((file) => pattern.test(readFileSync(file, 'utf8')));
  assert.deepEqual(matches, [path.join(root, 'server/providers/places/geocode.js')]);
});
