import assert from 'node:assert/strict';
import test from 'node:test';
import { findLinkedCameraSystem } from './cameraLink.js';

test('[osh-097] finds the first camera with the same first number token', () => {
  const records = [
    { id: 'selected', name: 'Camera 3' },
    { id: 'empty' },
    { id: 'wrong-first', name: 'Camera 8 model 3' },
    { id: 'first', name: 'Camera 3 model 8' },
    { id: 'second', name: 'camera 3' },
  ];
  assert.equal(findLinkedCameraSystem({ selectedId: 'selected', selectedName: 'unit 3', systemRecords: records }), records[3]);
  assert.equal(findLinkedCameraSystem({ selectedId: 'selected', selectedName: 'unit 8 model 3', systemRecords: records }), records[2]);
});

test('[osh-097] matches camera without regard to letter case', () => {
  const record = { id: 'camera', name: 'Camera 3' };
  assert.equal(findLinkedCameraSystem({ selectedId: 'unit', selectedName: 'unit 3', systemRecords: [record] }), record);
});

test('[osh-097] returns null when the selected name has no number token', () => {
  assert.equal(findLinkedCameraSystem({ selectedId: 'unit', selectedName: 'unit', systemRecords: [{ id: 'camera', name: 'Camera 3' }] }), null);
});

test('[osh-097] returns null when no candidate has both the number token and the word "camera"', () => {
  assert.equal(findLinkedCameraSystem({ selectedId: 'unit', selectedName: 'unit 3', systemRecords: [
    { id: 'a', name: 'Camera 4' },
    { id: 'b', name: 'Sensor 3' },
    { id: 'c' },
    { id: 'unit', name: 'Camera 3' },
  ] }), null);
});
