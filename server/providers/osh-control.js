import {
  routeConfig,
  staticTargets,
  resolveCommand,
} from './osh-control/targets.js';
import { makeRateLimiter } from './common/rate-limit.js';
import { clientKey } from './common/rate-limit.js';
import { oshPostCommand } from './osh-control/post.js';
import { oshCommandUrl, assertCommandUrl } from './osh-control/url.js';
import { validateCommand } from './osh-control/commands.js';
import { createOshBase } from './osh/base.js';
import { runLoggedCommand } from './osh-control/log.js';
import { randomUUID } from 'node:crypto';
import { isIP } from 'node:net';

export function isSameOriginCommand(req) {
  if (req.headers['content-type'] !== 'application/json') return false;
  const host = req.headers.host;
  const origin = req.headers.origin;
  if (typeof host !== 'string' || typeof origin !== 'string') return false;
  let parsed;
  try {
    parsed = new URL(`http://${host}`);
  } catch {
    return false;
  }
  if (
    parsed.host !== host.toLowerCase() ||
    parsed.pathname !== '/' ||
    parsed.username ||
    parsed.password
  )
    return false;
  const name = parsed.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (name !== 'localhost' && !name.endsWith('.local') && !isIP(name))
    return false;
  return origin === `${req.socket?.encrypted ? 'https' : 'http'}://${host}`;
}

export function createCommandGate() {
  const allow = makeRateLimiter({ windowMs: 60_000, max: 4, globalMax: 8 });
  const inflight = new Set();
  return {
    enter(system) {
      if (!allow(system)) return 'rate_limited';
      if (inflight.has(system)) return 'busy';
      inflight.add(system);
      return null;
    },
    leave(system) {
      inflight.delete(system);
    },
  };
}

export function oshControlProxy({ env, fetchImpl, warn, log }) {
  const gate = createCommandGate();
  const base = createOshBase({ fetchImpl });
  const cache = new Map();
  function install(server) {
    server.middlewares.use('/api/control/osh', async (req, res, next) => {
      const path = String(req.url || '').split('?')[0];
      if (path !== '/targets' && path !== '/commands') return next();
      const send = (status, body) => {
        res.statusCode = status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
      };
      const config = routeConfig(env, warn);
      if (path === '/targets' && req.method === 'GET') {
        send(
          200,
          config.reason
            ? { enabled: false, reason: config.reason, targets: [] }
            : { enabled: true, targets: staticTargets(config.systems) },
        );
        return;
      }
      if (path === '/commands' && req.method === 'POST') {
        const requestId = randomUUID();
        const client = clientKey(req);
        const refuse = async (status, reason) => {
          await log({ requestId, client, outcome: 'refused', reason });
          if (reason === 'rate_limited') res.setHeader('Retry-After', '60');
          send(status, { error: reason });
        };
        if (!isSameOriginCommand(req)) {
          await refuse(403, 'cross_origin');
          return;
        }
        if (config.reason) {
          await refuse(403, config.reason);
          return;
        }
        let raw = '';
        for await (const chunk of req) {
          raw += chunk;
          if (Buffer.byteLength(raw) > 4096) {
            await refuse(400, 'bad_body');
            return;
          }
        }
        let body;
        try {
          body = JSON.parse(raw);
        } catch {
          await refuse(400, 'bad_body');
          return;
        }
        const checked = validateCommand(
          body,
          config.systems,
          null,
          Buffer.byteLength(raw),
        );
        if (checked.reason) {
          await refuse(400, checked.reason);
          return;
        }
        const system = checked.value.system;
        const admitted = gate.enter(system);
        if (admitted) {
          await refuse(admitted === 'rate_limited' ? 429 : 409, admitted);
          return;
        }
        try {
          const headers = {
            Authorization: `Basic ${Buffer.from(`${config.username}:${config.password}`).toString('base64')}`,
          };
          const state = await base.resolveRoot(config.url, headers);
          if (!state.root) {
            await refuse(502, 'upstream_failed');
            return;
          }
          const stream = await resolveCommand({
            cache,
            root: state.root,
            system,
            command: checked.value.command,
            headers,
            fetchImpl,
          });
          if (!stream) {
            await refuse(400, 'command_not_found');
            return;
          }
          const schemaCheck = validateCommand(
            body,
            config.systems,
            stream.schema,
            Buffer.byteLength(raw),
          );
          if (schemaCheck.reason) {
            await refuse(400, schemaCheck.reason);
            return;
          }
          const url = oshCommandUrl(state.root, stream.id);
          assertCommandUrl(url, state.root, stream.id);
          const result = await runLoggedCommand({
            log,
            event: {
              requestId,
              client,
              system,
              controlStream: stream.id,
              command: checked.value.command,
              parameters: schemaCheck.value.parameters,
            },
            send: () =>
              oshPostCommand(fetchImpl, url, {
                headers,
                body: { parameters: schemaCheck.value.parameters },
              }),
          });
          send(
            result.reason === 'log_failed'
              ? 500
              : result.outcome === 'sent'
                ? 200
                : 502,
            result,
          );
        } catch {
          await refuse(502, 'upstream_failed');
        } finally {
          gate.leave(system);
        }
        return;
      }
      send(405, { error: 'method_not_allowed' });
    });
  }
  return {
    name: 'osh-control-proxy',
    configureServer: install,
    configurePreviewServer: install,
  };
}
