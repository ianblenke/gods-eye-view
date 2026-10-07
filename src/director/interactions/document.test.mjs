import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSceneInteractions } from './document.js';
const item = (action = { type: 'card', text: 'Text' }) => ({
  id: 'a',
  label: 'Read',
  target: { packId: 'p', featureId: 'f' },
  action,
});
const scene = (action) => ({
  dataPacks: [{ id: 'p', format: 'geojson' }],
  anchors: [{ id: 'a' }],
  shots: [
    {
      id: 'one',
      dataPackIds: ['p'],
      layers: { traffic: false },
      interactions: [item(action)],
    },
    { id: 'two', layers: { traffic: false } },
  ],
});
const validate = (s) => validateSceneInteractions(s, 'scene');

test('[director-056] The target rejects a different pack format', () => {
  const s = scene();
  s.dataPacks[0].format = 'png';
  assert.throws(() => validate(s), /selected GeoJSON/);
});

test('[director-056] The target rejects an unselected pack', () => {
  const s = scene();
  s.shots[0].dataPackIds = [];
  assert.throws(() => validate(s), /selected GeoJSON/);
});

test('[director-056] The target rejects absent selected packs', () => {
  const s = scene();
  delete s.shots[0].dataPackIds;
  assert.throws(() => validate(s), /selected GeoJSON/);
});

test('[director-056] The target rejects absent scene packs', () => {
  const s = scene();
  delete s.dataPacks;
  assert.throws(() => validate(s), /selected GeoJSON/);
});

test('[director-056] The target accepts a selected GeoJSON pack', () => {
  assert.doesNotThrow(() => validate(scene()));
});

test('[director-059] The focus rejects absent scene anchors', () => {
  const s = scene({ type: 'focus', anchorId: 'a' });
  delete s.anchors;
  assert.throws(() => validate(s), /unknown anchor/);
});

test('[director-059] The focus accepts a scene anchor', () => {
  assert.doesNotThrow(() => validate(scene({ type: 'focus', anchorId: 'a' })));
});

test('[director-059] The focus rejects an unknown anchor', () => {
  assert.throws(
    () => validate(scene({ type: 'focus', anchorId: 'other' })),
    /unknown anchor/,
  );
});

test('[director-057] The action field rejects an absent object', () => {
  assert.throws(() => validate(scene(null)), /unsupported action/);
});

test('[director-057] The action field rejects an unknown type', () => {
  assert.throws(() => validate(scene({ type: 'code' })), /unsupported action/);
});

test('[director-057] The card action field accepts its text field', () => {
  assert.doesNotThrow(() =>
    validate(
      scene({ type: 'card', text: 'Text', url: 'https://example.org/source' }),
    ),
  );
});

test('[director-057] The card action field accepts its url field', () => {
  assert.doesNotThrow(() =>
    validate(
      scene({ type: 'card', text: 'Text', url: 'https://example.org/source' }),
    ),
  );
});

test('[director-057] The focus action field accepts its anchorId field', () => {
  assert.doesNotThrow(() => validate(scene({ type: 'focus', anchorId: 'a' })));
});

test('[director-057] The shot action field accepts its shotId field', () => {
  assert.doesNotThrow(() => validate(scene({ type: 'shot', shotId: 'two' })));
});

test('[director-057] The layer action field accepts its layerId field', () => {
  assert.doesNotThrow(() =>
    validate(scene({ type: 'layer', layerId: 'traffic', enabled: true })),
  );
});

test('[director-057] The layer action field accepts its enabled field', () => {
  assert.doesNotThrow(() =>
    validate(scene({ type: 'layer', layerId: 'traffic', enabled: true })),
  );
});

test('[director-057] The action field rejects an unsupported field', () => {
  const s = scene();
  s.shots[0].interactions[0].action.code = 'alert(1)';
  assert.throws(() => validate(s), /unsupported field/);
});

test('[director-058] The card rejects a source protocol', () => {
  assert.throws(
    () =>
      validate(
        scene({ type: 'card', text: 'Text', url: 'http://example.org/' }),
      ),
    /expected HTTPS source URL/,
  );
});

test('[director-058] The card rejects a source user name', () => {
  assert.throws(
    () =>
      validate(
        scene({ type: 'card', text: 'Text', url: 'https://user@example.org/' }),
      ),
    /expected HTTPS source URL/,
  );
});

test('[director-058] The card rejects a source password', () => {
  assert.throws(
    () =>
      validate(
        scene({
          type: 'card',
          text: 'Text',
          url: 'https://:pass@example.org/',
        }),
      ),
    /expected HTTPS source URL/,
  );
});

test('[director-058] The card rejects a source query', () => {
  assert.throws(
    () =>
      validate(
        scene({ type: 'card', text: 'Text', url: 'https://example.org/?q=x' }),
      ),
    /expected HTTPS source URL/,
  );
});

test('[director-058] The card rejects a source fragment', () => {
  assert.throws(
    () =>
      validate(
        scene({ type: 'card', text: 'Text', url: 'https://example.org/#x' }),
      ),
    /expected HTTPS source URL/,
  );
});

test('[director-058] The card rejects an invalid URL', () => {
  assert.throws(
    () => validate(scene({ type: 'card', text: 'Text', url: 'invalid' })),
    /expected HTTPS source URL/,
  );
});

test('[director-058] The card accepts a plain HTTPS source', () => {
  assert.doesNotThrow(() =>
    validate(
      scene({ type: 'card', text: 'Text', url: 'https://example.org/source' }),
    ),
  );
});

test('[director-057] The action field rejects nontext anchorId', () => {
  assert.throws(
    () => validate(scene({ type: 'focus', anchorId: ['a'] })),
    /expected nonempty text/,
  );
});

test('[director-057] The action field rejects nontext shotId', () => {
  assert.throws(
    () => validate(scene({ type: 'shot', shotId: ['two'] })),
    /expected nonempty text/,
  );
});

test('[director-057] The action field rejects nontext layerId', () => {
  assert.throws(
    () =>
      validate(scene({ type: 'layer', layerId: ['traffic'], enabled: true })),
    /expected nonempty text/,
  );
});

test('[director-060] The shot action field rejects an unknown shot', () => {
  assert.throws(
    () => validate(scene({ type: 'shot', shotId: 'other' })),
    /unknown shot/,
  );
});

test('[director-060] The target shot needs each layer baseline', () => {
  const s = scene({ type: 'shot', shotId: 'two' });
  s.shots[0].interactions.push({
    ...item({ type: 'layer', layerId: 'traffic', enabled: true }),
    id: 'b',
  });
  s.shots[1].layers = {};
  assert.throws(() => validate(s), /target shot must declare/);
});

test('[director-060] The target shot check skips a card action field', () => {
  const s = scene({ type: 'shot', shotId: 'two' });
  s.shots[0].interactions.push({ ...item(), id: 'b' });
  s.shots[1].layers = {};
  assert.doesNotThrow(() => validate(s));
});

test('[director-060] The target shot needs an own layer baseline', () => {
  const s = scene({ type: 'shot', shotId: 'two' });
  s.shots[0].interactions.push({
    ...item({ type: 'layer', layerId: 'traffic', enabled: true }),
    id: 'b',
  });
  s.shots[1].layers = Object.create({ traffic: false });
  assert.throws(() => validate(s), /target shot must declare/);
});

test('[director-060] The absent target shot layers use an empty baseline', () => {
  const s = scene({ type: 'shot', shotId: 'two' });
  s.shots[0].interactions.push({
    ...item({ type: 'layer', layerId: 'traffic', enabled: true }),
    id: 'b',
  });
  delete s.shots[1].layers;
  assert.throws(() => validate(s), /target shot must declare/);
});

test('[director-060] The target shot accepts every declared layer', () => {
  const s = scene({ type: 'shot', shotId: 'two' });
  s.shots[0].interactions.push({
    ...item({ type: 'layer', layerId: 'traffic', enabled: true }),
    id: 'b',
  });
  assert.doesNotThrow(() => validate(s));
});

test('[director-061] The layer needs a direct shot baseline', () => {
  const s = scene({ type: 'layer', layerId: 'traffic', enabled: true });
  s.shots[0].layers = Object.create({ traffic: false });
  assert.throws(() => validate(s), /explicit shot baseline/);
});

test('[director-061] The absent shot layers use an empty baseline', () => {
  const s = scene({ type: 'layer', layerId: 'traffic', enabled: true });
  delete s.shots[0].layers;
  assert.throws(() => validate(s), /explicit shot baseline/);
});

test('[director-061] The layer accepts a direct shot baseline', () => {
  assert.doesNotThrow(() =>
    validate(scene({ type: 'layer', layerId: 'traffic', enabled: true })),
  );
});

test('[director-061] The layer rejects a nonboolean state', () => {
  assert.throws(
    () =>
      validate(scene({ type: 'layer', layerId: 'traffic', enabled: 'yes' })),
    /expected enabled boolean/,
  );
});

test('[director-062] The interaction rejects invalid id', () => {
  const s = scene();
  s.shots[0].interactions[0].id = 0;
  assert.throws(() => validate(s), {
    name: 'SceneDocumentError',
    path: 'scene.shots[0].interactions[0]',
  });
});

test('[director-062] The interaction rejects invalid label', () => {
  const s = scene();
  s.shots[0].interactions[0].label = 0;
  assert.throws(() => validate(s), /expected nonempty text/);
});

test('[director-062] The interaction rejects invalid packId', () => {
  const s = scene();
  s.shots[0].interactions[0].target.packId = ['p'];
  assert.throws(() => validate(s), /expected nonempty text/);
});

test('[director-062] The interaction rejects invalid featureId', () => {
  const s = scene();
  s.shots[0].interactions[0].target.featureId = 0;
  assert.throws(() => validate(s), /expected nonempty text/);
});

test('[director-062] The interaction rejects duplicate IDs', () => {
  const s = scene();
  s.shots[0].interactions.push(item());
  assert.throws(() => validate(s), /duplicate ID/);
});

test('[director-062] The shot rejects excess interactions', () => {
  const s = scene();
  s.shots[0].interactions = Array.from({ length: 65 }, (_, i) => ({
    ...item(),
    id: String(i),
  }));
  assert.throws(() => validate(s), /at most 64/);
});

test('[director-062] The card rejects excess text', () => {
  assert.throws(
    () => validate(scene({ type: 'card', text: 'x'.repeat(4097) })),
    /at most 4096/,
  );
});

test('[director-062] The card rejects excess URL text', () => {
  assert.throws(
    () =>
      validate(
        scene({
          type: 'card',
          text: 'Text',
          url: 'https://example.org/' + 'x'.repeat(2048),
        }),
      ),
    /at most 2048/,
  );
});

test('[director-060] The shot loop skips an absent entry', () => {
  const s = scene({ type: 'shot', shotId: 'two' });
  s.shots[0].interactions.push(null);
  assert.throws(() => validate(s), {
    name: 'SceneDocumentError',
    path: 'scene.shots[0].interactions[1]',
  });
});

test('[director-060] The shot loop skips an absent action field', () => {
  const s = scene({ type: 'shot', shotId: 'two' });
  const next = { ...item(), id: 'b' };
  delete next.action;
  s.shots[0].interactions.push(next);
  assert.throws(() => validate(s), /unsupported action/);
});

test('[director-061] The layer ignores an unrelated anchor ID', () => {
  assert.doesNotThrow(() =>
    validate(scene({ type: 'layer', layerId: 'traffic', enabled: true })),
  );
});

test('[director-057] The card type controls its text check', () => {
  assert.throws(
    () => validate(scene({ type: 'card', text: 0 })),
    /expected nonempty text/,
  );
});

test('[director-060] The shot type controls its reference check', () => {
  assert.throws(
    () => validate(scene({ type: 'shot', shotId: 'unknown' })),
    /unknown shot/,
  );
});

test('[director-061] The layer type controls its state check', () => {
  assert.throws(
    () => validate(scene({ type: 'layer', layerId: 'traffic', enabled: 0 })),
    /expected enabled boolean/,
  );
});

test('[director-060] The target shot loop checks the traffic entry', () => {
  const s = scene({ type: 'shot', shotId: 'two' });
  s.shots[0].layers = { traffic: false, ships: false };
  s.shots[1].layers = { ships: false };
  s.shots[0].interactions.push(
    { ...item({ type: 'layer', layerId: 'traffic', enabled: true }), id: 'b' },
    { ...item({ type: 'layer', layerId: 'ships', enabled: true }), id: 'c' },
  );
  assert.throws(() => validate(s), /target shot must declare/);
});

test('[director-060] The target shot loop checks the ships entry', () => {
  const s = scene({ type: 'shot', shotId: 'two' });
  s.shots[0].layers = { traffic: false, ships: false };
  s.shots[1].layers = { traffic: false };
  s.shots[0].interactions.push(
    { ...item({ type: 'layer', layerId: 'traffic', enabled: true }), id: 'b' },
    { ...item({ type: 'layer', layerId: 'ships', enabled: true }), id: 'c' },
  );
  assert.throws(() => validate(s), /target shot must declare/);
});

test('[director-062] The shot accepts the exact interaction limit', () => {
  const s = scene();
  s.shots[0].interactions = Array.from({ length: 64 }, (_, i) => ({
    ...item(),
    id: String(i),
  }));
  assert.doesNotThrow(() => validate(s));
});

test('[director-062] The card accepts the exact text limit', () => {
  assert.doesNotThrow(() =>
    validate(scene({ type: 'card', text: 'x'.repeat(4096) })),
  );
});

test('[director-062] The card accepts the exact source limit', () => {
  const url = 'https://example.org/' + 'x'.repeat(2028);
  assert.doesNotThrow(() =>
    validate(scene({ type: 'card', text: 'Text', url })),
  );
});

test('[director-057] The action field rejects an array type', () => {
  assert.throws(
    () => validate(scene({ type: ['card'], text: 'Text' })),
    /expected nonempty text/,
  );
});

test('[director-061] The layer accepts a false state', () => {
  assert.doesNotThrow(() =>
    validate(scene({ type: 'layer', layerId: 'traffic', enabled: false })),
  );
});

test('[director-062] The card accepts 2048 URL characters', () => {
  const s = scene({
    type: 'card',
    text: 'Text',
    url: 'https://example.org/' + 'x'.repeat(2028),
  });
  assert.doesNotThrow(() => validate(s));
});

test('[director-062] The card rejects 2049 URL characters', () => {
  const s = scene({
    type: 'card',
    text: 'Text',
    url: 'https://example.org/' + 'x'.repeat(2029),
  });
  assert.throws(() => validate(s), /at most 2048 characters/);
});

test('[director-057] The card rejects an extra field', () => {
  const s = scene({ type: 'card', text: 'Text' });
  s.shots[0].interactions[0].action.extra = true;
  assert.throws(() => validate(s), /action.extra: unsupported field/);
});

test('[director-057] The focus rejects an extra field', () => {
  const s = scene({ type: 'focus', anchorId: 'a' });
  s.shots[0].interactions[0].action.extra = true;
  assert.throws(() => validate(s), /action.extra: unsupported field/);
});

test('[director-057] The shot rejects an extra field', () => {
  const s = scene({ type: 'shot', shotId: 'two' });
  s.shots[0].interactions[0].action.extra = true;
  assert.throws(() => validate(s), /action.extra: unsupported field/);
});

test('[director-057] The layer rejects an extra field', () => {
  const s = scene({ type: 'layer', layerId: 'traffic', enabled: true });
  s.shots[0].interactions[0].action.extra = true;
  assert.throws(() => validate(s), /action.extra: unsupported field/);
});

test('[director-057] The interaction rejects an extra field', () => {
  const s = scene();
  s.shots[0].interactions[0].extra = true;
  assert.throws(() => validate(s), /extra: unsupported field/);
});

test('[director-057] The target rejects an extra field', () => {
  const s = scene();
  s.shots[0].interactions[0].target.extra = true;
  assert.throws(() => validate(s), /extra: unsupported field/);
});

test('[director-062] The label accepts 256 characters', () => {
  const s = scene();
  s.shots[0].interactions[0].label = 'x'.repeat(256);
  assert.doesNotThrow(() => validate(s));
});

test('[director-062] The label rejects 257 characters', () => {
  const s = scene();
  s.shots[0].interactions[0].label = 'x'.repeat(257);
  assert.throws(() => validate(s), /at most 256 characters/);
});
