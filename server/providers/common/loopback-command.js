import { hasProxySignals } from '../../../src/localRequestGate.mjs';

/** Socket addresses that count as the machine that runs the server. */
const LOOPBACK_ADDRESSES = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1']);
/** Host names that a loopback request may use. */
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

/**
 * Whether a POST comes from the machine that runs the server, to a loopback
 * host, from the same origin, as JSON, and not through a proxy. The checks run
 * in this order, and each one stops at once.
 *
 * @param {import('node:http').IncomingMessage} req The request.
 * @returns {boolean} True when the request passes every check.
 */
export function isLoopbackCommand(req) {
  const headers = req.headers;
  if (headers['content-type'] !== 'application/json') return false;
  if (hasProxySignals(headers)) return false;
  if (!LOOPBACK_ADDRESSES.has(req.socket?.remoteAddress)) return false;
  const host = headers.host;
  if (typeof host !== 'string') return false;
  let parsed;
  try {
    parsed = new URL(`http://${host}`);
  } catch {
    return false;
  }
  if (parsed.host !== host) return false;
  const name = parsed.hostname.replace(/^\[|\]$/g, '');
  if (!LOOPBACK_HOSTS.has(name)) return false;
  return (
    headers.origin === `${req.socket?.encrypted ? 'https' : 'http'}://${host}`
  );
}
