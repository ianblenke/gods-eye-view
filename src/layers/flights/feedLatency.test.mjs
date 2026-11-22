import test from 'node:test';
import { feedLatencyCases } from '../../testSupport/aircraftFeedLatency.mjs';
import { RENDER_DELAY_SEC } from './policy.js';

// A slow live feed, as measured: reports about 90 s old every poll, now and
// then a fresh fallback feed, a report that does not move on, or an outage.
for (const [name, body] of feedLatencyCases('flights', RENDER_DELAY_SEC)) test(name, body);
