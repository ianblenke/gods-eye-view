import { createClient } from '../up42/auth.js';
import { up42AllPlugins } from '../up42-quotes/plugins.js';
import { up42OrderProxy } from './orders.js';

/** All UP42 routes, with the order routes, use one private token client. */
export function up42TaskingPlugins(options = {}) {
  const client =
    options.client ??
    createClient({
      env: process.env,
      fetchImpl: fetch,
      now: Date.now,
      setTimer: setTimeout,
      clearTimer: clearTimeout,
      ...options,
    });
  const shared = { ...options, client };
  return [...up42AllPlugins(shared), up42OrderProxy(shared)];
}
