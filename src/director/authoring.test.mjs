import test from 'node:test';
import assert from 'node:assert/strict';
import { editSceneDetails, selectSceneDocument } from './authoring.js';
const project = () => ({
  version: 6,
  scenes: [
    {
      id: 'a',
      title: 'A',
      shots: [
        {
          id: 's',
          title: 'S',
          layers: { traffic: false },
          sourcePackId: 'credit',
        },
      ],
    },
    { id: 'b', shots: [] },
  ],
});

test('[director-019] The edit sets the anchors field', () => {
  const p = project();
  const before = JSON.stringify(p);
  const result = editSceneDetails(
    p,
    'a',
    's',
    {
      anchors: [
        { id: 'x', lat: 1, lon: 2, alt: 3, altitudeReference: 'ellipsoid' },
      ],
    },
    {},
  );
  assert.deepEqual(result.scenes[0].anchors, [
    { id: 'x', lat: 1, lon: 2, alt: 3, altitudeReference: 'ellipsoid' },
  ]);
  assert.equal(Object.hasOwn(result.scenes[0], 'anchors'), true);
  assert.equal(JSON.stringify(p), before);
  assert.equal(result.scenes[0].shots[0].sourcePackId, 'credit');
  assert.deepEqual(result.scenes[0].shots[0].layers, { traffic: false });
});

test('[director-021] The edit removes an absent anchors field', () => {
  const p = project();
  p.scenes[0].anchors = [
    { id: 'x', lat: 1, lon: 2, alt: 3, altitudeReference: 'ellipsoid' },
  ];
  const result = editSceneDetails(p, 'a', 's', {}, {});
  assert.equal(Object.hasOwn(result.scenes[0], 'anchors'), false);
});

test('[director-019] The edit sets the dataPacks field', () => {
  const p = project();
  const before = JSON.stringify(p);
  const result = editSceneDetails(p, 'a', 's', { dataPacks: [] }, {});
  assert.deepEqual(result.scenes[0].dataPacks, []);
  assert.equal(Object.hasOwn(result.scenes[0], 'dataPacks'), true);
  assert.equal(JSON.stringify(p), before);
  assert.equal(result.scenes[0].shots[0].sourcePackId, 'credit');
  assert.deepEqual(result.scenes[0].shots[0].layers, { traffic: false });
});

test('[director-021] The edit removes an absent dataPacks field', () => {
  const p = project();
  p.scenes[0].dataPacks = [];
  const result = editSceneDetails(p, 'a', 's', {}, {});
  assert.equal(Object.hasOwn(result.scenes[0], 'dataPacks'), false);
});

test('[director-019] The edit sets the camera field', () => {
  const p = project();
  const before = JSON.stringify(p);
  const result = editSceneDetails(
    p,
    'a',
    's',
    {},
    { camera: { lat: 1, lon: 2, alt: 3 } },
  );
  assert.deepEqual(result.scenes[0].shots[0].camera, {
    lat: 1,
    lon: 2,
    alt: 3,
  });
  assert.equal(Object.hasOwn(result.scenes[0].shots[0], 'camera'), true);
  assert.equal(JSON.stringify(p), before);
  assert.equal(result.scenes[0].shots[0].sourcePackId, 'credit');
  assert.deepEqual(result.scenes[0].shots[0].layers, { traffic: false });
});

test('[director-021] The edit removes an absent camera field', () => {
  const p = project();
  p.scenes[0].shots[0].camera = { lat: 1, lon: 2, alt: 3 };
  const result = editSceneDetails(p, 'a', 's', {}, {});
  assert.equal(Object.hasOwn(result.scenes[0].shots[0], 'camera'), false);
});

test('[director-019] The edit sets the move field', () => {
  const p = project();
  const before = JSON.stringify(p);
  const result = editSceneDetails(
    p,
    'a',
    's',
    {},
    {
      move: {
        from: { lat: 1, lon: 2, alt: 3, altitudeReference: 'ellipsoid' },
        easing: 'linear',
      },
      camera: { lat: 4, lon: 5, alt: 6, altitudeReference: 'ellipsoid' },
      durationSec: 2,
      holdSec: 0,
    },
  );
  assert.deepEqual(result.scenes[0].shots[0].move, {
    from: { lat: 1, lon: 2, alt: 3, altitudeReference: 'ellipsoid' },
    easing: 'linear',
  });
  assert.equal(Object.hasOwn(result.scenes[0].shots[0], 'move'), true);
  assert.equal(JSON.stringify(p), before);
  assert.equal(result.scenes[0].shots[0].sourcePackId, 'credit');
  assert.deepEqual(result.scenes[0].shots[0].layers, { traffic: false });
});

test('[director-021] The edit removes an absent move field', () => {
  const p = project();
  p.scenes[0].shots[0].move = {
    from: { lat: 1, lon: 2, alt: 3, altitudeReference: 'ellipsoid' },
    easing: 'linear',
  };
  Object.assign(p.scenes[0].shots[0], {
    camera: { lat: 4, lon: 5, alt: 6, altitudeReference: 'ellipsoid' },
    durationSec: 2,
    holdSec: 0,
  });
  const result = editSceneDetails(p, 'a', 's', {}, {});
  assert.equal(Object.hasOwn(result.scenes[0].shots[0], 'move'), false);
});

test('[director-019] The edit sets the durationSec field', () => {
  const p = project();
  const before = JSON.stringify(p);
  const result = editSceneDetails(p, 'a', 's', {}, { durationSec: 2 });
  assert.deepEqual(result.scenes[0].shots[0].durationSec, 2);
  assert.equal(Object.hasOwn(result.scenes[0].shots[0], 'durationSec'), true);
  assert.equal(JSON.stringify(p), before);
  assert.equal(result.scenes[0].shots[0].sourcePackId, 'credit');
  assert.deepEqual(result.scenes[0].shots[0].layers, { traffic: false });
});

test('[director-021] The edit removes an absent durationSec field', () => {
  const p = project();
  p.scenes[0].shots[0].durationSec = 2;
  const result = editSceneDetails(p, 'a', 's', {}, {});
  assert.equal(Object.hasOwn(result.scenes[0].shots[0], 'durationSec'), false);
});

test('[director-019] The edit sets the holdSec field', () => {
  const p = project();
  const before = JSON.stringify(p);
  const result = editSceneDetails(p, 'a', 's', {}, { holdSec: 0 });
  assert.deepEqual(result.scenes[0].shots[0].holdSec, 0);
  assert.equal(Object.hasOwn(result.scenes[0].shots[0], 'holdSec'), true);
  assert.equal(JSON.stringify(p), before);
  assert.equal(result.scenes[0].shots[0].sourcePackId, 'credit');
  assert.deepEqual(result.scenes[0].shots[0].layers, { traffic: false });
});

test('[director-021] The edit removes an absent holdSec field', () => {
  const p = project();
  p.scenes[0].shots[0].holdSec = 0;
  const result = editSceneDetails(p, 'a', 's', {}, {});
  assert.equal(Object.hasOwn(result.scenes[0].shots[0], 'holdSec'), false);
});

test('[director-019] The edit sets the dataPackIds field', () => {
  const p = project();
  const before = JSON.stringify(p);
  const result = editSceneDetails(p, 'a', 's', {}, { dataPackIds: [] });
  assert.deepEqual(result.scenes[0].shots[0].dataPackIds, []);
  assert.equal(Object.hasOwn(result.scenes[0].shots[0], 'dataPackIds'), true);
  assert.equal(JSON.stringify(p), before);
  assert.equal(result.scenes[0].shots[0].sourcePackId, 'credit');
  assert.deepEqual(result.scenes[0].shots[0].layers, { traffic: false });
});

test('[director-021] The edit removes an absent dataPackIds field', () => {
  const p = project();
  p.scenes[0].shots[0].dataPackIds = [];
  const result = editSceneDetails(p, 'a', 's', {}, {});
  assert.equal(Object.hasOwn(result.scenes[0].shots[0], 'dataPackIds'), false);
});

test('[director-019] The edit sets the interactions field', () => {
  const p = project();
  const before = JSON.stringify(p);
  const result = editSceneDetails(p, 'a', 's', {}, { interactions: [] });
  assert.deepEqual(result.scenes[0].shots[0].interactions, []);
  assert.equal(Object.hasOwn(result.scenes[0].shots[0], 'interactions'), true);
  assert.equal(JSON.stringify(p), before);
  assert.equal(result.scenes[0].shots[0].sourcePackId, 'credit');
  assert.deepEqual(result.scenes[0].shots[0].layers, { traffic: false });
});

test('[director-021] The edit removes an absent interactions field', () => {
  const p = project();
  p.scenes[0].shots[0].interactions = [];
  const result = editSceneDetails(p, 'a', 's', {}, {});
  assert.equal(Object.hasOwn(result.scenes[0].shots[0], 'interactions'), false);
});

test('[director-020] The edit rejects an absent scene', () => {
  assert.throws(
    () => editSceneDetails(project(), 'x', 's', {}, {}),
    /Select a scene and shot first/,
  );
});

test('[director-020] The edit rejects an absent shot', () => {
  assert.throws(
    () => editSceneDetails(project(), 'a', 'x', {}, {}),
    /Select a scene and shot first/,
  );
});

test('[director-020] The edit rejects unsupported scene details', () => {
  assert.throws(
    () => editSceneDetails(project(), 'a', 's', { extra: 1 }, {}),
    /Unsupported scene detail/,
  );
});

test('[director-020] The edit rejects unsupported shot details', () => {
  assert.throws(
    () => editSceneDetails(project(), 'a', 's', {}, { extra: 1 }),
    /Unsupported shot detail/,
  );
});

test('[director-022] The selection keeps only its scene', () => {
  const p = project();
  const before = JSON.stringify(p);
  const result = selectSceneDocument(p, 'b');
  assert.deepEqual(result, { version: 6, scenes: [{ id: 'b', shots: [] }] });
  assert.equal(JSON.stringify(p), before);
  assert.notEqual(result.scenes[0], p.scenes[1]);
});

test('[director-022] The selection rejects an absent scene', () => {
  assert.throws(
    () => selectSceneDocument(project(), 'x'),
    /Select a scene first/,
  );
});
