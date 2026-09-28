import test from 'node:test';
import assert from 'node:assert/strict';
import { OSH_CONTROL_COMMANDS, validateCommand } from '../../server/providers/osh-control/commands.js';

const good = { system: 'sys-fixture-one', command: 'mavRTLControl', parameters: { rtl: true } };
const check = (body, bytes = Buffer.byteLength(JSON.stringify(body))) => validateCommand(body, null, bytes);

test('[osh-control-007] Refuse a body that is not a small exact object', () => {
  for (const body of [null, [], 'text', { ...good, extra: true }, { system: good.system, command: good.command }, { command: good.command, parameters: good.parameters }]) assert.equal(check(body).reason, 'bad_body');
  assert.equal(check(good, 4097).reason, 'bad_body');
  assert.equal(check(good, 4096).reason, null);
});

test('[osh-control-033] Refuse a system id of the wrong shape', () => {
  for (const system of ['', 'bad/id', 'bad id', 'x'.repeat(65), 42, true, ['sys-fixture-one']]) {
    assert.equal(check({ ...good, system }).reason, 'bad_body');
  }
});

test('[osh-control-009] Refuse a command that is not an own table key', () => {
  assert.equal(check({ ...good, command: 'toString' }).reason, 'unknown_command');
  assert.equal(check({ ...good, command: 'mavShellControl' }).reason, 'unknown_command');
});

test('[osh-control-010] Refuse extra, absent, wrong-type, and non-object parameters', () => {
  for (const parameters of [{ rtl: true, extra: 1 }, {}, { rtl: 'true' }, { wrong: true }, null, [], 'yes']) assert.equal(check({ ...good, parameters }).reason, 'bad_parameter');
});

test('[osh-control-011] Refuse numbers outside the finite inclusive range', () => {
  for (const value of [Infinity, -Infinity, NaN, 0, 121, '12']) assert.equal(check({ ...good, command: 'mavTakeoffControl', parameters: { TakeoffAltitudeAGL: value } }).reason, 'bad_parameter');
  assert.equal(check({ ...good, command: 'mavTakeoffControl', parameters: { TakeoffAltitudeAGL: 1 } }).reason, null);
  assert.equal(check({ ...good, command: 'mavTakeoffControl', parameters: { TakeoffAltitudeAGL: 120 } }).reason, null);
});

test('[osh-control-013] Refuse a boolean field with a non-boolean value', () => {
  assert.equal(check({ ...good, parameters: { rtl: 1 } }).reason, 'bad_parameter');
  assert.equal(check({ ...good, parameters: { rtl: false } }).reason, null);
});

test('[osh-control-014] Refuse a field absent from the resolved schema', () => {
  // The real OSH schema is a SWE Common DataRecord: a top-level `fields` array,
  // and a Vector field (like `locationVectorLLA`) nests its own field names one
  // level down, in `coordinates`. This fixture uses that real shape, not an
  // invented `properties` map.
  const mavControlBody = {
    system: 'sys-fixture-one',
    command: 'mavControl',
    parameters: { Latitude: 1, Longitude: 2, AltitudeAGL: 10, returnToStart: true, hoverSeconds: 1, heading: 1 },
  };
  const fullSchema = {
    fields: [
      { type: 'Boolean', name: 'returnToStart' },
      { type: 'Count', name: 'hoverSeconds' },
      { type: 'Quantity', name: 'heading' },
      {
        type: 'Vector',
        name: 'locationVectorLLA',
        coordinates: [{ name: 'Latitude' }, { name: 'Longitude' }, { name: 'AltitudeAGL' }],
      },
    ],
  };
  const missingOneCoordinate = {
    fields: [
      ...fullSchema.fields.slice(0, 3),
      { type: 'Vector', name: 'locationVectorLLA', coordinates: [{ name: 'Latitude' }, { name: 'Longitude' }] },
    ],
  };
  assert.equal(validateCommand(mavControlBody, fullSchema).reason, null);
  assert.equal(validateCommand(mavControlBody, missingOneCoordinate).reason, 'schema_mismatch');
  assert.equal(validateCommand(good, { fields: [{ name: 'different' }] }).reason, 'schema_mismatch');
  assert.equal(validateCommand(good, { fields: [] }).reason, 'schema_mismatch');
  assert.equal(validateCommand(good, {}).reason, 'schema_mismatch');
  assert.equal(validateCommand(good, { fields: [{ type: 'Boolean', name: 'rtl' }] }).reason, null);
});

test('[osh-control-015] Keep the exact eight command definitions', () => {
  assert.deepEqual(Object.keys(OSH_CONTROL_COMMANDS), ['mavEnableLocationControl', 'mavControl', 'offboardControl', 'mavRTLControl', 'mavTakeoffControl', 'mavPauseMissionControl', 'mavFlightModeControl', 'mavLandingControl']);
  assert.deepEqual(Object.keys(OSH_CONTROL_COMMANDS.mavControl.fields), ['Latitude', 'Longitude', 'AltitudeAGL', 'returnToStart', 'hoverSeconds', 'heading']);
  assert.deepEqual(OSH_CONTROL_COMMANDS.mavTakeoffControl.fields.TakeoffAltitudeAGL, { type: 'number', min: 1, max: 120, unit: 'm' });
  assert.equal(Object.hasOwn(OSH_CONTROL_COMMANDS, 'mavShellControl'), false);
});
