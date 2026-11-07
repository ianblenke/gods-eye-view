import { createClient } from '../up42/auth.js';
import { up42SourcePlugins } from '../up42-thumbnails/plugins.js';
import { up42QuoteProxy } from './quotes.js';

/** All UP42 routes use one private token client. */
export function up42AllPlugins(options = {}) {
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
  return [...up42SourcePlugins(shared), up42QuoteProxy(shared)];
}
