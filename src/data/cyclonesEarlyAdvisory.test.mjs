import assert from 'node:assert/strict';
import test from 'node:test';
import { parseCycloneStatus } from '../../server/providers/cyclones.js';

const MINUTE = 60_000;
const TIME = '2026-09-16T03:00:00.000Z';
const EARLIER = '2026-09-16T00:00:00.000Z';
const STAMP = Date.parse(TIME);

function status({ issuance = EARLIER, lastUpdate = EARLIER } = {}) {
  return {
    activeStorms: [
      {
        id: 'ep152026',
        name: 'Fifteen-E',
        classification: 'PTC',
        intensity: '25',
        pressure: '1006',
        longitudeNumeric: -125.8,
        latitudeNumeric: 15.5,
        movementDir: 255,
        movementSpeed: 12,
        lastUpdate,
        forecastAdvisory: {
          advNum: '010',
          issuance,
          url: 'https://www.nhc.noaa.gov/text/MIATCMEP5.shtml',
        },
      },
    ],
  };
}

// Each case puts the time TIME in one field and an earlier time in the other.
const FIELDS = [
  ['advisory time', (time) => status({ issuance: time }), 'issuedAt'],
  ['position time', (time) => status({ lastUpdate: time }), 'positionAt'],
];

test('[cyclones-026] a time 26 or 90 minutes ahead of the clock is accepted for the advisory and for the position', () => {
  for (const [name, build, key] of FIELDS) {
    for (const ahead of [26, 90]) {
      const storms = parseCycloneStatus(build(TIME), STAMP - ahead * MINUTE);
      assert.equal(storms.length, 1, `${name} ${ahead} minutes ahead`);
      assert.equal(storms[0][key], TIME, `${name} ${ahead} minutes ahead`);
    }
  }
});

test('[cyclones-027] a time 90 minutes and 1 millisecond ahead of the clock throws invalid_cyclone_data', () => {
  for (const [name, build] of FIELDS) {
    assert.throws(
      () => parseCycloneStatus(build(TIME), STAMP - 90 * MINUTE - 1),
      { message: 'invalid_cyclone_data' },
      name,
    );
  }
});
