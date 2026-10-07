import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSceneDocument, stringifySceneDocument } from '../document.js';
import { normalizeProject } from '../../scenes/project.js';
import { createInteractionSession } from './session.js';

const fixture = () => ({
  version: 6,
  scenes: [
    {
      id: 'scene',
      anchors: [
        {
          id: 'view',
          lat: 1,
          lon: 2,
          alt: 3000,
          altitudeReference: 'ellipsoid',
        },
      ],
      dataPacks: [
        {
          id: 'data',
          version: 1,
          format: 'geojson',
          source: { adapter: 'assets', path: 'test.json' },
          attribution: { text: 'Example', license: 'CC0' },
          placement: { altitudeReference: 'ellipsoid' },
        },
      ],
      shots: [
        {
          id: 'one',
          layers: { traffic: false },
          dataPackIds: ['data'],
          interactions: [
            {
              id: 'card',
              label: 'Read',
              target: { packId: 'data', featureId: 'point' },
              action: {
                type: 'card',
                text: '<script>text only</script>',
                url: 'https://example.org/source',
              },
            },
            {
              id: 'focus',
              label: 'Focus',
              target: { packId: 'data', featureId: 'point' },
              action: { type: 'focus', anchorId: 'view' },
            },
            {
              id: 'layer',
              label: 'Traffic',
              target: { packId: 'data', featureId: 'point' },
              action: { type: 'layer', layerId: 'traffic', enabled: true },
            },
            {
              id: 'next',
              label: 'Next',
              target: { packId: 'data', featureId: 'point' },
              action: { type: 'shot', shotId: 'two' },
            },
          ],
        },
        { id: 'two', layers: { traffic: false } },
      ],
    },
  ],
});

test('[director-063] all four inert interactions survive validation, migration and export and no content runs', () => {
  const input = fixture();
  const output = JSON.parse(
    stringifySceneDocument(
      normalizeProject(parseSceneDocument(JSON.stringify(input))),
    ),
  );
  assert.deepEqual(
    output.scenes[0].shots[0].interactions,
    input.scenes[0].shots[0].interactions,
  );
});

test('[director-056 director-060 director-061] reject unknown fields, script syntax, invalid references and missing reset baselines', () => {
  const mutations = [
    (p) => (p.version = 5),
    (p) => {
      p.scenes[0].shots[0].layers.undefined = false;
      delete p.scenes[0].shots[0].interactions[2].action.layerId;
    },
    (p) => (p.scenes[0].shots[0].interactions[0].action.type = ['card']),
    (p) => (p.scenes[0].shots[0].interactions[2].action.layerId = ['traffic']),
    (p) => (p.scenes[0].shots[0].interactions = null),
    (p) =>
      p.scenes[0].shots[0].interactions.push(
        p.scenes[0].shots[0].interactions[0],
      ),
    (p) => (p.scenes[0].shots[0].interactions[0].action.code = 'alert(1)'),
    (p) =>
      (p.scenes[0].shots[0].interactions[0].action.url = 'javascript:alert(1)'),
    (p) =>
      (p.scenes[0].shots[0].interactions[0].action.url =
        'https://user:pass@example.org/'),
    (p) =>
      (p.scenes[0].shots[0].interactions[0].action.url =
        'https://example.org/?token=secret'),
    (p) => (p.scenes[0].shots[0].interactions[0].target.packId = 'missing'),
    (p) => (p.scenes[0].shots[0].dataPackIds = []),
    (p) => (p.scenes[0].shots[0].interactions[1].action.anchorId = 'missing'),
    (p) => (p.scenes[0].shots[0].interactions[2].action.layerId = 'missing'),
    (p) => (p.scenes[0].shots[0].interactions[2].action.enabled = 'yes'),
    (p) => (p.scenes[0].shots[0].interactions[3].action.shotId = 'missing'),
    (p) => (p.scenes[0].shots[1].layers = {}),
    (p) =>
      (p.scenes[0].shots[0].interactions = Array.from(
        { length: 65 },
        (_, i) => ({ ...p.scenes[0].shots[0].interactions[0], id: String(i) }),
      )),
  ];
  const messages = [
    '$.scenes[0].shots[0].interactions: unsupported field',
    '$.scenes[0].shots[0].interactions[2].action.layerId: expected nonempty text, at most 256 characters',
    '$.scenes[0].shots[0].interactions[0].action.type: expected nonempty text, at most 256 characters',
    '$.scenes[0].shots[0].interactions[2].action.layerId: expected nonempty text, at most 256 characters',
    '$.scenes[0].shots[0].interactions: expected an array of at most 64 entries',
    '$.scenes[0].shots[0].interactions[4].id: duplicate ID',
    '$.scenes[0].shots[0].interactions[0].action.code: unsupported field',
    '$.scenes[0].shots[0].interactions[0].url: expected HTTPS source URL without credentials, query or fragment',
    '$.scenes[0].shots[0].interactions[0].url: expected HTTPS source URL without credentials, query or fragment',
    '$.scenes[0].shots[0].interactions[0].url: expected HTTPS source URL without credentials, query or fragment',
    '$.scenes[0].shots[0].interactions[0]: target must belong to a selected GeoJSON pack',
    '$.scenes[0].shots[0].interactions[0]: target must belong to a selected GeoJSON pack',
    '$.scenes[0].shots[0].interactions[1]: unknown anchor',
    '$.scenes[0].shots[0].interactions[2]: layer must have an explicit shot baseline',
    '$.scenes[0].shots[0].interactions[2]: expected enabled boolean',
    '$.scenes[0].shots[0].interactions[3]: unknown shot',
    '$.scenes[0].shots[0].interactions[3]: target shot must declare interactive layer baseline',
    '$.scenes[0].shots[0].interactions: expected an array of at most 64 entries',
  ];
  let caseIndex = 0;
  for (const mutate of mutations) {
    const p = fixture();
    mutate(p);
    assert.throws(() => parseSceneDocument(JSON.stringify(p)), {
      name: 'SceneDocumentError',
      message: messages[caseIndex++],
    });
  }
});

test('[director-068 director-073 director-074] pending interactions cancel promptly, refuse overlap and cannot update a replacement session', async () => {
  let resolve,
    signal,
    calls = 0;
  const session = createInteractionSession({
    execute: (_, s) => {
      calls++;
      signal = s;
      return new Promise((r) => (resolve = r));
    },
  });
  session.activate([{ id: 'old' }]);
  const work = session.dispatch('old');
  await Promise.resolve();
  assert.equal(await session.dispatch('old'), false);
  assert.equal(await session.dispatch('missing'), false);
  session.activate([{ id: 'new' }]);
  assert.equal(signal.aborted, true);
  assert.equal(await work, false);
  resolve(true);
  await Promise.resolve();
  assert.deepEqual(session.getState(), {
    active: true,
    busy: false,
    selected: null,
    count: 1,
  });
  assert.equal(calls, 1);
  session.clear();
  assert.equal(await session.dispatch('new'), false);
});

test('[director-072 director-073] synchronous stop before an adapter call prevents any side effect; rejection unlocks retry', async () => {
  let calls = 0;
  const session = createInteractionSession({
    execute: () => {
      calls++;
      throw new Error('refused');
    },
  });
  session.activate([{ id: 'a' }]);
  const work = session.dispatch('a');
  session.clear();
  assert.equal(await work, false);
  assert.equal(calls, 0);
  session.activate([{ id: 'a' }]);
  assert.equal(await session.dispatch('a'), false);
  assert.equal(session.getState().busy, false);
  assert.equal(await session.dispatch('a'), false);
  assert.equal(calls, 2);
});

test('settled pack shots cannot take the same-shot seek shortcut after Stop released geometry', async () => {
  const { SceneDirector } = await import('../../scenes/director.js');
  const shot = { id: 'shot', dataPackIds: ['pack'] };
  const director = Object.assign(Object.create(SceneDirector.prototype), {
    _destroyed: false,
    _loadedSceneId: 'scene',
    _selectedShotId: 'shot',
    _claimCameraOwnership: () =>
      assert.fail('Must reload the released pack before camera seek'),
  });
  assert.equal(director._seekLoadedShot({ id: 'scene' }, { shot }), false);
});

test('actions preserve camera refusal, layer admission signal and explicit transition cap', async () => {
  const { SceneDirector } = await import('../../scenes/director.js');
  const owner = new AbortController();
  const director = Object.assign(Object.create(SceneDirector.prototype), {
    _running: false,
    _destroyed: false,
    _interactionTransitions: 64,
    _getShot: () => ({ scene: { id: 'scene' }, shot: { id: 'shot' } }),
    _claimCameraOwnership: () => false,
    _setCameraView: () => assert.fail('Refused camera cannot move'),
    _updateStatus: () => {},
    _loadShot: () => assert.fail('Transition budget exceeded'),
    dataManager: {
      getAll: () => [{ id: 'traffic' }],
      setEnabled: (id, enabled, options) => {
        assert.equal(id, 'traffic');
        assert.equal(enabled, true);
        assert.equal(options.signal, owner.signal);
        assert.equal(options.origin, 'scene');
        return false;
      },
    },
  });
  assert.equal(
    await director._executeInteraction({ type: 'focus' }, owner.signal),
    false,
  );
  assert.equal(
    await director._executeInteraction(
      { type: 'shot', shotId: 'next' },
      owner.signal,
    ),
    false,
  );
  assert.equal(
    await director._executeInteraction(
      { type: 'layer', layerId: 'traffic', enabled: true },
      owner.signal,
    ),
    false,
  );
  assert.equal(
    await director._executeInteraction(
      { type: 'layer', layerId: 'unknown', enabled: true },
      owner.signal,
    ),
    false,
  );
  owner.abort();
  assert.equal(
    await director._executeInteraction({ type: 'focus' }, owner.signal),
    false,
  );
});
