import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';

const ROOT = new URL('../../', import.meta.url);

function repoPath(relative) {
  return new URL(relative, ROOT);
}

const PROVIDER_FILES = [
  'server/providers/osh.js',
  'server/providers/osh/base.js',
  'server/providers/osh/get.js',
  'server/providers/osh/ids.js',
  'server/providers/osh/observations.js',
  'src/data/oshSystems.js',
  'src/data/oshDatastreams.js',
  'src/data/oshObservations.js',
  'src/data/osh.js',
  'src/layers/osh/index.js',
  'src/layers/osh/source.js',
  'src/layers/osh/detail.js',
];

/**
 * Every `*.test.mjs` file under src/ that belongs to the OSH change: its
 * base name starts with "osh" (case-insensitive), or it sits under an
 * `osh/` directory such as `src/layers/osh/`.
 */
function oshTestFiles() {
  const found = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, directory);
      if (entry.isDirectory()) visit(absolute);
      else if (
        /^osh.*\.test\.mjs$/i.test(entry.name) ||
        (/\.test\.mjs$/i.test(entry.name) && /\/osh\//i.test(absolute.pathname))
      ) {
        found.push(absolute);
      }
    }
  };
  visit(repoPath('src/'));
  return found;
}

const SYSTEM_AND_DATASTREAM_FIXTURE_FILES = [
  'src/data/fixtures/osh-systems.json',
  'src/data/fixtures/osh-datastreams.json',
];

/** True for a synthetic fixture host: localhost, or a reserved *.example domain (RFC 2606). */
function isFixtureHost(hostname) {
  return hostname === 'localhost' || hostname === 'example' || hostname.endsWith('.example');
}

// A dotted token whose last label is one of these is a file reference, such
// as `src/data/oshSystems.js` or `osh-datastreams.json`, not a host.
const CODE_FILE_EXTENSIONS = new Set([
  'js', 'mjs', 'cjs', 'ts', 'tsx', 'jsx', 'json', 'md', 'yml', 'yaml', 'css',
  'html', 'txt', 'csv', 'sh',
]);

// A dotted token with an explicit port, or an IPv4 literal, reads as a real
// address under any TLD — an allowlist by shape, not a denylist of TLD
// text. This codebase's own comments hold a dotted JS field path, such as
// `entry.records.length`, at any depth, far too often for a bare dotted
// word with no port to tell a host from prose. The port makes the
// difference unambiguous: prose never writes `word.word:1234`. A token
// straight after a `/` is a file path segment, not a host.
const BARE_HOST_TOKEN =
  /(?<![/a-z0-9-])[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+:\d{2,5}\b|\b(?:\d{1,3}\.){3}\d{1,3}\b(?::\d{2,5})?/g;

/** Text a human wrote by hand: every quoted string, and every comment. */
function proseOf(text) {
  const parts = [];
  for (const m of text.matchAll(/\/\*[\s\S]*?\*\//g)) parts.push(m[0]);
  for (const m of text.matchAll(/(?:^|\s)\/\/.*$/gm)) parts.push(m[0]);
  for (const m of text.matchAll(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g))
    parts.push(m[0]);
  return parts.join('\n');
}

const IPV4_TOKEN = /^(?:\d{1,3}\.){3}\d{1,3}(?::\d{2,5})?$/;

function findBareHost(text) {
  for (const match of text.matchAll(BARE_HOST_TOKEN)) {
    if (IPV4_TOKEN.test(match[0])) return match[0];
    const lastLabel = match[0].split('.').at(-1).replace(/:\d+$/, '');
    if (lastLabel !== 'example' && !CODE_FILE_EXTENSIONS.has(lastLabel)) return match[0];
  }
  return null;
}

/** Every `osh*` file MUST use a scheme-qualified, fixture-only address. */
function assertOnlyFixtureAddress(text, file) {
  const urls = text.match(/https?:\/\/[^\s'"`)]+/g) || [];
  for (const url of urls) {
    let hostname;
    try {
      hostname = new URL(url).hostname;
    } catch {
      continue; // not a parsable address, so not a real one either
    }
    assert.ok(
      isFixtureHost(hostname),
      `${file} has a real-looking address: ${url}`,
    );
  }
}

/**
 * The provider, adapter and layer files MUST also have no real-looking bare
 * host, in a comment or a string. Synthetic ids used only to prove the
 * datastream id pattern, such as `has.dot`, are expected content of the
 * *test* files, so this stricter check runs only on the shipped code.
 */
function assertNoBareHost(text, file) {
  const bareMatch = findBareHost(proseOf(text));
  assert.equal(
    bareMatch,
    null,
    `${file} has a real-looking host with no scheme: ${bareMatch}`,
  );
}

test('[osh-034] the bare-host check catches a real-looking host pasted with no scheme', () => {
  // Built from parts: a literal match here would trip this file's own scan below.
  const dot = '.';
  for (const bad of [
    `const host = "osh-prod${dot}internal:8080";`,
    `// OSH_URL=osh-prod${dot}example${dot}com:8443`,
    `// the sensor gateway is at 10${dot}20${dot}30${dot}40:8443`,
  ]) {
    assert.throws(() => assertNoBareHost(bad, 'synthetic'), /real-looking host/);
  }
  assert.doesNotThrow(() =>
    assertNoBareHost('OSH_URL=https://osh.example/api and localhost:4173', 'synthetic'),
  );
  // A capitalized JS reference in a comment, and a short synthetic id used
  // to prove the datastream id pattern, must not read as a real host.
  assert.doesNotThrow(() => assertNoBareHost('// see Array.isArray', 'synthetic'));
  assert.doesNotThrow(() => assertNoBareHost("{ id: 'has.dot' }", 'synthetic'));
});

test('[osh-034] the provider, adapter and layer files have no real address', () => {
  for (const relative of PROVIDER_FILES) {
    const text = readFileSync(repoPath(relative), 'utf8');
    assertOnlyFixtureAddress(text, relative);
    assertNoBareHost(text, relative);
  }
});

test('[osh-034] no OSH test file has a real address', () => {
  const files = oshTestFiles();
  assert.equal(
    files.length,
    13,
    'the discovered OSH test file count changed; update this number and check the new file too',
  );
  for (const file of files) {
    assertOnlyFixtureAddress(readFileSync(file, 'utf8'), file.pathname);
  }
});

test('[osh-034] every system and datastream fixture id starts with sys-fixture- or ds-fixture-', () => {
  for (const relative of SYSTEM_AND_DATASTREAM_FIXTURE_FILES) {
    const payload = JSON.parse(readFileSync(repoPath(relative), 'utf8'));
    const ids = [];
    for (const feature of payload.features || []) ids.push(feature.id);
    for (const item of payload.items || []) ids.push(item.id);
    assert.ok(ids.length > 0, `${relative} has no ids to check`);
    for (const id of ids) {
      assert.ok(
        id.startsWith('sys-fixture-') || id.startsWith('ds-fixture-'),
        `${relative} has a fixture id that is not synthetic: ${id}`,
      );
    }
  }
});

test('[osh-034] .env.example has the three OSH keys, each with an empty value', () => {
  const text = readFileSync(repoPath('.env.example'), 'utf8');
  for (const key of ['OSH_URL', 'OSH_USERNAME', 'OSH_PASSWORD']) {
    assert.match(
      text,
      new RegExp(`^# ${key}=$`, 'm'),
      `.env.example must have a commented, empty ${key}`,
    );
  }
});
