import { createHook } from 'node:async_hooks';
const live = new Map();
createHook({
  init(id, type, trigger, resource) {
    if (type === 'Timeout' || type === 'Immediate') live.set(id, { type, resource, stack: new Error().stack });
  },
  destroy(id) { live.delete(id); },
}).enable();
globalThis.__dumpTimers = (label) => {
  const active = process.getActiveResourcesInfo().filter((type) => type === 'Timeout' || type === 'Immediate');
  if (!active.length) return;
  process.stderr.write(`ACTIVE ${label} ${JSON.stringify(active)}\n`);
  for (const [id, item] of live) {
    if (item.resource._destroyed || !item.resource.hasRef?.()) continue;
    process.stderr.write(`TIMER ${id} ${item.type} ${item.stack}\n`);
  }
};
process.on('exit', () => globalThis.__dumpTimers('exit'));
