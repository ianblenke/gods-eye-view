import { OSH_ID_PATTERN } from '../osh/ids.js';
import { oshGet } from '../osh/get.js';
import { OSH_CONTROL_COMMANDS } from './commands.js';
import { oshControlStreamsUrl, oshControlSchemaUrl } from './url.js';

export function parseTargets(raw, warn = () => {}) {
  if (!String(raw || '').trim()) return { reason: 'no_targets', systems: [] };
  const systems = String(raw)
    .split(',')
    .map((item) => item.trim());
  const seen = new Set();
  for (let index = 0; index < systems.length; index += 1) {
    if (!OSH_ID_PATTERN.test(systems[index]) || seen.has(systems[index])) {
      warn(`[osh-control] bad target at position ${index + 1}`);
      return { reason: 'bad_targets', systems: [] };
    }
    seen.add(systems[index]);
  }
  return { reason: null, systems };
}

export function routeConfig(env, warn) {
  if (env.OSH_CONTROL_ENABLED !== 'true') return { reason: 'control_off' };
  try {
    new URL(String(env.OSH_URL || ''));
  } catch {
    return { reason: 'no_key' };
  }
  const username = String(env.OSH_CONTROL_USERNAME || '').trim();
  const password = String(env.OSH_CONTROL_PASSWORD || '').trim();
  if (!username || !password) return { reason: 'no_account' };
  if (
    username.toLowerCase() ===
    String(env.OSH_USERNAME || '')
      .trim()
      .toLowerCase()
  )
    return { reason: 'same_account' };
  const targets = parseTargets(env.OSH_CONTROL_TARGETS, warn);
  if (targets.reason) return { reason: targets.reason };
  return {
    reason: null,
    username,
    password,
    systems: targets.systems,
    url: String(env.OSH_URL).trim(),
  };
}

export function staticTargets(systems) {
  return systems.map((system) => ({ system, commands: OSH_CONTROL_COMMANDS }));
}

export async function resolveCommand({
  cache,
  root,
  system,
  command,
  headers,
  fetchImpl,
}) {
  if (!cache.has(system)) {
    const url = oshControlStreamsUrl(root, system);
    const result = await oshGet(fetchImpl, url, { headers });
    if (result.status !== 200) throw new Error('Control streams read failed');
    const map = new Map();
    for (const stream of result.json?.items || result.json?.features || []) {
      if (!OSH_ID_PATTERN.test(stream.id)) continue;
      const schemaResult = await oshGet(
        fetchImpl,
        oshControlSchemaUrl(root, stream.id),
        { headers },
      );
      if (schemaResult.status !== 200) continue;
      const schema = schemaResult.json?.parametersSchema;
      if (Object.hasOwn(OSH_CONTROL_COMMANDS, schema?.name))
        map.set(schema.name, { id: stream.id, schema });
    }
    cache.set(system, map);
  }
  return cache.get(system).get(command) || null;
}
