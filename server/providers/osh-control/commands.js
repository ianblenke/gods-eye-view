import { OSH_ID_PATTERN } from '../osh/ids.js';

export const OSH_CONTROL_COMMANDS = Object.freeze({
  mavEnableLocationControl: {
    fields: { EnableLocationControl: { type: 'boolean' } },
  },
  mavControl: {
    fields: {
      Latitude: { type: 'number', min: -90, max: 90, unit: 'deg' },
      Longitude: { type: 'number', min: -180, max: 180, unit: 'deg' },
      AltitudeAGL: { type: 'number', min: 1, max: 120, unit: 'm' },
      returnToStart: { type: 'boolean' },
      hoverSeconds: { type: 'number', min: 0, max: 600, unit: 's' },
      heading: { type: 'number', min: 0, max: 360, unit: 'deg' },
    },
  },
  offboardControl: {
    fields: {
      vx: { type: 'number', min: -10, max: 10, unit: 'm/s' },
      vy: { type: 'number', min: -10, max: 10, unit: 'm/s' },
      vz: { type: 'number', min: -5, max: 5, unit: 'm/s' },
      yawRate: { type: 'number', min: -90, max: 90, unit: 'deg/s' },
    },
  },
  mavRTLControl: { fields: { rtl: { type: 'boolean' } } },
  mavTakeoffControl: {
    fields: {
      TakeoffAltitudeAGL: { type: 'number', min: 1, max: 120, unit: 'm' },
    },
  },
  mavPauseMissionControl: { fields: { Resume: { type: 'boolean' } } },
  mavFlightModeControl: {
    fields: { FlightMode: { type: 'number', min: 0, max: 25 } },
  },
  mavLandingControl: { fields: { disarm: { type: 'boolean' } } },
});

function schemaHasField(schema, name) {
  const fields = schema?.fields || [];
  for (const field of fields) {
    if (field.name === name) return true;
    if (
      Array.isArray(field.coordinates) &&
      field.coordinates.some((coordinate) => coordinate.name === name)
    )
      return true;
  }
  return false;
}

export function validateCommand(
  body,
  schema = null,
  byteLength = Buffer.byteLength(JSON.stringify(body)),
) {
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    byteLength > 4096 ||
    !Object.keys(body)
      .sort()
      .join(',')
      .match(/^command,parameters,system$/)
  )
    return { reason: 'bad_body' };
  if (typeof body.system !== 'string' || !OSH_ID_PATTERN.test(body.system))
    return { reason: 'bad_body' };
  if (
    typeof body.command !== 'string' ||
    !Object.hasOwn(OSH_CONTROL_COMMANDS, body.command)
  )
    return { reason: 'unknown_command' };
  const fields = OSH_CONTROL_COMMANDS[body.command].fields;
  const parameters = body.parameters;
  if (
    !parameters ||
    typeof parameters !== 'object' ||
    Array.isArray(parameters)
  )
    return { reason: 'bad_parameter' };
  const fieldNames = Object.keys(fields);
  if (Object.keys(parameters).length !== fieldNames.length)
    return { reason: 'bad_parameter' };
  for (const name of fieldNames) {
    if (!Object.hasOwn(parameters, name)) return { reason: 'bad_parameter' };
    const field = fields[name];
    const value = parameters[name];
    if (
      field.type === 'number' &&
      (typeof value !== 'number' ||
        !Number.isFinite(value) ||
        value < field.min ||
        value > field.max)
    )
      return { reason: 'bad_parameter' };
    if (field.type === 'boolean' && typeof value !== 'boolean')
      return { reason: 'bad_parameter' };
  }
  if (schema && fieldNames.some((name) => !schemaHasField(schema, name)))
    return { reason: 'schema_mismatch' };
  return {
    reason: null,
    value: {
      system: body.system,
      command: body.command,
      parameters: Object.fromEntries(
        fieldNames.map((name) => [name, parameters[name]]),
      ),
    },
  };
}
