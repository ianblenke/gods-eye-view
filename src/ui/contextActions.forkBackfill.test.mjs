import assert from 'node:assert/strict';
import test from 'node:test';
import { ContextControls } from './contextControls.js';
import { withEntityRecord } from '../data/entityRecords.js';

test('[context-contacts-entry-001] a Contacts request starts the Contacts mode and keeps the tracked aircraft', async () => {
  const calls = [];
  const viewer = {
    trackedEntity: withEntityRecord({}, { trackedId: 'flights:abc123' }),
  };
  const entity = viewer.trackedEntity;
  const enabled = new Set(['flights', 'weather']);
  const controls = new ContextControls({
    elements: {},
    installations: {},
    actions: {
      getCockpit: () => null,
      claimVisualAuthority() {},
      syncDetection() {},
      scheduleLayout() {},
      showToast() {},
    },
  });
  controls.connect({
    layers: new Map(
      ['flights', 'weather', 'military-awareness'].map((id) => [id, {}]),
    ),
    getEnabledLayerIds: () => [...enabled],
    getLayerParams: () => ({}),
    isEffectivelyEnabled: (id) => enabled.has(id),
    isEnabled: (id) => enabled.has(id),
    setLayerParams: (id, params) => calls.push({ id, params }),
    setEnabled: async (id, value) => {
      calls.push({ id, value });
      if (!value) enabled.delete(id);
      // The flight layer drops the tracked aircraft when it stops.
      if (id === 'flights' && !value) viewer.trackedEntity = null;
      return true;
    },
    _setEnabledWithIntent: (id, value) => {
      calls.push({ id, value });
      enabled.add(id);
      return { intentEpoch: 1, promise: Promise.resolve(true) };
    },
  });
  try {
    const result = await controls.setContextMode('contacts');
    assert.equal(result.ok, true);
    assert.equal(controls.getContextModeState().mode, 'flights');
    assert.equal(viewer.trackedEntity, entity);
    assert.equal(enabled.has('flights'), true);
    assert.equal(
      calls.some(
        (call) => call.id === 'military-awareness' && call.value === true,
      ),
      true,
    );
    assert.equal(
      calls.some((call) => call.id === 'flights'),
      false,
    );
  } finally {
    controls.stop();
    controls.disconnect();
  }
});
