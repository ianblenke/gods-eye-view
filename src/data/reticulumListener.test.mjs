import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parseTapAddress, tapUrl } from './tapAddress.js';

const ROOT = new URL('../../', import.meta.url);
const read = (name) => readFileSync(fileURLToPath(new URL(name, ROOT)), 'utf8');
const lines = (text) => text.split('\n');
/** The lines of a file without blank lines and without full-line comments. */
const code = (text) =>
  lines(text).filter(
    (line) => line.trim() !== '' && !line.trim().startsWith('#'),
  );
const indentOf = (line) => line.length - line.trimStart().length;
/** The lines under a key: up to the next line that is not indented deeper. */
function block(textLines, key) {
  const start = textLines.indexOf(key);
  assert.notEqual(start, -1, key);
  const out = [];
  for (const line of textLines.slice(start + 1)) {
    if (indentOf(line) <= indentOf(key)) break;
    out.push(line);
  }
  return out;
}
/** Whether an IPv4 address is inside an IPv4 subnet in the form a.b.c.d/n. */
function inSubnet(address, subnet) {
  const number = (text) =>
    text.split('.').reduce((total, part) => total * 256 + Number(part), 0);
  const [base, bits] = subnet.split('/');
  const size = 2 ** (32 - Number(bits));
  return Math.floor(number(address) / size) === Math.floor(number(base) / size);
}

const DROPPED = [
  'config_entry',
  'reachable_on',
  'port',
  'ifac_netname',
  'ifac_netkey',
  'operator_lxmf_address',
  'transport_id',
  'network_id',
  'stamp',
  'value',
  'impl_name',
  'version',
];

test('[reticulum-listener-001] installs Reticulum with pip at a fixed version and copies two files', () => {
  const docker = code(read('docker/reticulum/Dockerfile'));
  assert.equal(docker[0], 'FROM python:3.13-slim');
  const installs = docker.filter((line) => line.includes('pip install'));
  assert.equal(installs.length, 1);
  assert.match(installs[0], /^RUN pip install .*\brns==1\.5\.7$/);
  assert.deepEqual(
    docker.filter((line) => line.startsWith('COPY')),
    [
      'COPY listener.py /opt/reticulum/listener.py',
      'COPY config /opt/reticulum/config',
    ],
  );
});

test('[reticulum-listener-002] runs as user 10001 with a port, a health check and an entrypoint', () => {
  const docker = code(read('docker/reticulum/Dockerfile'));
  assert.deepEqual(
    docker.filter((line) => line.startsWith('USER')),
    ['USER 10001'],
  );
  assert.ok(docker.includes('EXPOSE 8081'));
  const checks = docker.filter((line) => line.startsWith('HEALTHCHECK'));
  assert.equal(checks.length, 1);
  assert.ok(checks[0].includes('http://127.0.0.1:8081/interfaces.json'));
  assert.deepEqual(
    docker.filter((line) => line.startsWith('ENTRYPOINT')),
    ['ENTRYPOINT ["python", "/opt/reticulum/listener.py"]'],
  );
});

test('[reticulum-listener-003] serves GET for one route, answers other paths with 404 and sends no-store', () => {
  const program = code(read('docker/reticulum/listener.py'));
  const methods = program
    .map((line) => /^\s+def (do_\w+)\(/.exec(line)?.[1])
    .filter(Boolean);
  assert.deepEqual(methods, ['do_GET']);
  const check = program.indexOf('        if self.path != "/interfaces.json":');
  assert.notEqual(check, -1);
  assert.equal(program[check + 1], '            self.send_error(404)');
  assert.ok(
    program.includes('        self.send_header("Cache-Control", "no-store")'),
  );
});

test('[reticulum-listener-004] sends the twelve fields of the provider and none of the dropped fields', () => {
  const program = code(read('docker/reticulum/listener.py'));
  const joined = program.join('\n');
  const list = /FIELDS = \[([^\]]*)\]/.exec(joined);
  assert.ok(list);
  assert.deepEqual(
    [...list[1].matchAll(/"([a-z_]+)"/g)].map((match) => match[1]),
    [
      'discovery_hash',
      'type',
      'name',
      'last_heard',
      'hops',
      'latitude',
      'longitude',
      'height',
      'frequency',
      'bandwidth',
      'sf',
      'cr',
    ],
  );
  for (const name of DROPPED) {
    assert.equal(joined.includes(`"${name}"`), false, name);
    assert.equal(joined.includes(`'${name}'`), false, name);
  }
});

test('[reticulum-listener-005] sends a byte value as lower case hexadecimal text', () => {
  const program = code(read('docker/reticulum/listener.py'));
  const check = program.findIndex((line) =>
    line.includes('isinstance(value, bytes)'),
  );
  assert.notEqual(check, -1);
  assert.equal(
    program[check + 1].trim(),
    'value = RNS.hexrep(value, delimit=False)',
  );
});

test('[reticulum-listener-006] runs Reticulum and the HTTP server in one process on 0.0.0.0 and port 8081', () => {
  const program = code(read('docker/reticulum/listener.py'));
  assert.ok(program.includes('PORT = 8081'));
  assert.ok(
    program.includes(
      'from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer',
    ),
  );
  assert.ok(
    program.some((line) =>
      line.includes('RNS.Reticulum(configdir=CONFIG_DIR)'),
    ),
  );
  assert.ok(
    program.some((line) =>
      line.includes('ThreadingHTTPServer(("0.0.0.0", PORT), Handler)'),
    ),
  );
  assert.ok(
    program.some((line) =>
      line.includes('RNS.Reticulum.discovered_interfaces()'),
    ),
  );
});

test('[reticulum-listener-007] makes a node that listens and publishes nothing', () => {
  const text = read('docker/reticulum/config');
  const config = code(text).map((line) => line.trim());
  for (const line of [
    'enable_transport = no',
    'share_instance = no',
    'discover_interfaces = yes',
  ])
    assert.ok(config.includes(line), line);
  for (const word of [
    'discoverable',
    'listen_on',
    'AutoInterface',
    'TCPServerInterface',
    'autoconnect_discovered_interfaces',
  ])
    assert.equal(text.includes(word), false, word);
});

test('[reticulum-listener-008] connects to the bootstrap hosts with client interfaces that are enabled', () => {
  const config = code(read('docker/reticulum/config')).map((line) =>
    line.trim(),
  );
  const sections = [];
  for (const line of config.slice(config.indexOf('[interfaces]') + 1)) {
    if (line.startsWith('[[')) sections.push([]);
    else sections.at(-1).push(line);
  }
  assert.ok(sections.length >= 1 && sections.length <= 10);
  for (const section of sections) {
    assert.ok(section.includes('enabled = yes'));
    assert.ok(
      section.includes('type = BackboneInterface') ||
        section.includes('type = TCPClientInterface'),
    );
  }
});

test('[reticulum-listener-009] copies the default config only when the config of the volume does not exist', () => {
  const program = code(read('docker/reticulum/listener.py'));
  assert.ok(program.includes('CONFIG_DIR = "/data/rns"'));
  assert.ok(program.includes('DEFAULT_CONFIG = "/opt/reticulum/config"'));
  const guard = program.indexOf(
    '    if not os.path.exists(os.path.join(CONFIG_DIR, "config")):',
  );
  assert.notEqual(guard, -1);
  assert.equal(
    program[guard + 1],
    '        shutil.copyfile(DEFAULT_CONFIG, os.path.join(CONFIG_DIR, "config"))',
  );
  assert.ok(program.includes('    os.makedirs(CONFIG_DIR, exist_ok=True)'));
});

function composeServices() {
  const compose = code(read('compose.reticulum.yaml'));
  return { compose, services: block(compose, 'services:') };
}

test('[reticulum-listener-010] limits the listener service and publishes no port', () => {
  const { services } = composeServices();
  const service = block(services, '  reticulum:');
  for (const line of [
    '    build: ./docker/reticulum',
    '    restart: unless-stopped',
    '    read_only: true',
    '    init: true',
    '    mem_limit: 512m',
    '    pids_limit: 256',
  ])
    assert.ok(service.includes(line), line);
  assert.deepEqual(block(service, '    cap_drop:'), ['      - ALL']);
  assert.deepEqual(block(service, '    security_opt:'), [
    '      - no-new-privileges:true',
  ]);
  assert.deepEqual(block(service, '    volumes:'), [
    '      - gev-reticulum:/data',
  ]);
  assert.equal(
    service.some((line) => line.trim().startsWith('ports')),
    false,
  );
});

test('[reticulum-listener-011] gives the listener a fixed address inside its subnet and an alias on the default network', () => {
  const { compose, services } = composeServices();
  const networks = block(block(services, '  reticulum:'), '    networks:');
  assert.deepEqual(networks, [
    '      default:',
    '        aliases:',
    '          - reticulum.local',
    '      reticulum:',
    '        ipv4_address: ${GEV_RETICULUM_ADDRESS:-10.213.77.10}',
  ]);
  const top = block(compose, 'networks:');
  assert.deepEqual(top, [
    '  reticulum:',
    '    ipam:',
    '      config:',
    '        - subnet: ${GEV_RETICULUM_SUBNET:-10.213.77.0/24}',
  ]);
  assert.equal(inSubnet('10.213.77.10', '10.213.77.0/24'), true);
  assert.equal(inSubnet('10.213.78.10', '10.213.77.0/24'), false);
});

test('[reticulum-listener-012] tells the app where the listener is and leaves the network of the app alone', () => {
  const { services } = composeServices();
  const app = block(services, '  gods-eye-view:');
  assert.deepEqual(block(app, '    environment:'), [
    '      RETICULUM_LISTENER: ${GEV_RETICULUM_LISTENER:-reticulum.local:8081}',
  ]);
  assert.equal(
    app.some(
      (line) =>
        line.trim().startsWith('networks') ||
        line.trim().startsWith('network_mode'),
    ),
    false,
  );
  for (const address of ['reticulum.local:8081', '10.213.77.10:8081']) {
    const parsed = parseTapAddress(address);
    assert.ok(parsed, address);
    assert.equal(
      new URL(tapUrl(parsed, '/interfaces.json')).hostname,
      parsed.host,
      address,
    );
  }
  assert.equal(parseTapAddress('reticulum:8081'), null);
});

test('[reticulum-listener-013] starts the app with the listener in both network modes', () => {
  const makefile = read('Makefile');
  assert.match(
    makefile,
    /^up-reticulum:\n\tdocker compose -f compose\.yaml -f compose\.reticulum\.yaml build\n\tdocker compose -f compose\.yaml -f compose\.reticulum\.yaml up --force-recreate\n(?!\t)/m,
  );
  assert.match(
    makefile,
    /^up-codex-reticulum:\n\tdocker compose -f compose\.yaml -f compose\.codex\.yaml -f compose\.reticulum\.yaml build\n\tGEV_RETICULUM_LISTENER=\$\$\{GEV_RETICULUM_LISTENER:-10\.213\.77\.10:8081\} docker compose -f compose\.yaml -f compose\.codex\.yaml -f compose\.reticulum\.yaml up --force-recreate\n(?!\t)/m,
  );
  assert.match(
    makefile,
    /^down-reticulum:\n\tdocker compose -f compose\.yaml -f compose\.reticulum\.yaml down\n(?!\t)/m,
  );
  const phony = lines(makefile)
    .find((line) => line.startsWith('.PHONY:'))
    .split(/\s+/);
  assert.ok(phony.includes('up-reticulum'));
  assert.ok(phony.includes('up-codex-reticulum'));
  assert.ok(phony.includes('down-reticulum'));
});

test('[reticulum-listener-014] documents the start, the stop, the egress and the config', () => {
  const doc = read('docs/fork/reticulum-docker.md');
  for (const text of [
    '`make up-reticulum`',
    '`make up-codex-reticulum`',
    '`make down-reticulum`',
    'The operators of the public nodes see your IP address.',
    '`gev-reticulum`',
    '`/data/rns/config`',
  ])
    assert.ok(doc.includes(text), text);
});
