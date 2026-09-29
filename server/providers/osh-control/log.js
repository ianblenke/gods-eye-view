import { promises as fs } from 'node:fs';
import path from 'node:path';
import { defaultSourceRoot } from '../common/source-root.js';
import { OSH_ID_PATTERN } from '../osh/ids.js';
import { OSH_CONTROL_COMMANDS } from './commands.js';

const LOG_LIMIT = 4 * 1024 * 1024;
const REASONS = new Set([
  'control_off',
  'no_key',
  'no_account',
  'same_account',
  'bad_body',
  'unknown_command',
  'bad_parameter',
  'schema_mismatch',
  'command_not_found',
  'rate_limited',
  'busy',
  'log_failed',
  'cross_origin',
  'upstream_failed',
  'timeout',
  'redirect',
]);

export function createCommandLog({
  sourceRoot = defaultSourceRoot,
  append,
} = {}) {
  const dir = path.join(sourceRoot, '.gev-logs');
  const file = path.join(dir, 'osh-commands.jsonl');
  let queue = Promise.resolve();
  const write =
    append ||
    (async (line) => {
      await fs.mkdir(dir, { recursive: true });
      const size = await fs.stat(file).then(
        (stat) => stat.size,
        () => 0,
      );
      if (size + Buffer.byteLength(line) > LOG_LIMIT) {
        await fs.rm(`${file}.1`, { force: true });
        await fs.rename(file, `${file}.1`);
      }
      await fs.appendFile(file, line);
    });
  return (event) => {
    const command = Object.hasOwn(OSH_CONTROL_COMMANDS, event.command)
      ? event.command
      : null;
    const fields = command ? OSH_CONTROL_COMMANDS[command].fields : null;
    const parameters =
      command &&
      event.parameters &&
      typeof event.parameters === 'object' &&
      Object.keys(event.parameters).length === Object.keys(fields).length &&
      Object.keys(fields).every((name) => Object.hasOwn(event.parameters, name))
        ? Object.fromEntries(
            Object.keys(fields).map((name) => [name, event.parameters[name]]),
          )
        : null;
    const line = `${JSON.stringify({
      time: new Date().toISOString(),
      requestId: event.requestId || null,
      outcome: event.outcome,
      reason: REASONS.has(event.reason) ? event.reason : null,
      client: event.client || null,
      system: OSH_ID_PATTERN.test(event.system || '') ? event.system : null,
      controlStream: OSH_ID_PATTERN.test(event.controlStream || '')
        ? event.controlStream
        : null,
      command,
      parameters,
      upstreamStatus: Number.isInteger(event.upstreamStatus)
        ? event.upstreamStatus
        : null,
      durationMs: Number.isFinite(event.durationMs) ? event.durationMs : null,
    })}\n`;
    const done = queue.then(() => write(line));
    queue = done.catch(() => {});
    return done;
  };
}

export async function runLoggedCommand({ log, event, send }) {
  try {
    await log({ ...event, outcome: 'accepted' });
  } catch {
    return {
      outcome: 'refused',
      reason: 'log_failed',
      upstreamStatus: null,
      requestId: event.requestId,
    };
  }
  const started = Date.now();
  let outcome = 'sent';
  let reason = null;
  let upstreamStatus = null;
  try {
    const result = await send();
    upstreamStatus = result.status;
    if (result.status < 200 || result.status >= 300) {
      outcome = 'failed';
      reason = 'upstream_failed';
    }
  } catch (error) {
    outcome = 'failed';
    reason =
      error?.code === 'OSH_REDIRECT'
        ? 'redirect'
        : error?.name === 'TimeoutError'
          ? 'timeout'
          : 'upstream_failed';
    upstreamStatus = Number.isInteger(error?.status) ? error.status : null;
  }
  await log({
    ...event,
    outcome,
    reason,
    upstreamStatus,
    durationMs: Date.now() - started,
  });
  return { outcome, reason, upstreamStatus, requestId: event.requestId };
}
