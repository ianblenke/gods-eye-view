import { up42Plugins } from '../up42.js';
import { createClient } from '../up42/auth.js';
import { up42ThumbnailProxy } from './thumbnails.js';

/** The scenes and thumbnail plugins share one client and answer store. */
export function up42SourcePlugins(options = {}) {
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
  const [scenes] = up42Plugins({ ...options, client });
  return [
    scenes,
    up42ThumbnailProxy({
      ...options,
      client,
      thumbnailHostOf: scenes.thumbnailHostOf,
    }),
  ];
}
