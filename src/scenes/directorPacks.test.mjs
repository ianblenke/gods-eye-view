import assert from 'node:assert/strict';
import test from 'node:test';
import { SceneDirector } from './director.js';
import { SCENE_APPEND_RECIPES } from './recipes.js';
import { recipeToScene, normalizeProject } from './project.js';

const PACK = 'bhote-koshi-nepal-evidence-pack';
const recipe = SCENE_APPEND_RECIPES[0];
const BEATS = [
  'immediate-collapse-viewpoint', 'debris-dammed-lake', 'second-landslide',
  'gyirong-border-gate', 'timure-cluster', 'syabru-besi', 'dhunche',
  'mailung-upper-trishuli', 'mailung-bazzar', 'dandagaun', 'dandagaun-viewpoint',
  'betrawati-bazaar', 'bhainse', 'bidur-trishuli-bridge',
  'devighat-taadi-khola-bridge', 'charaudi', 'final-view',
];
function shot(id = 'a', title = 'A', beat) {
  return {
    id, title, durationSec: 4, holdSec: 3,
    camera: { lat: 10, lon: 20, alt: 500000, heading: 12, pitch: -40, roll: 0 },
    visual: { style: 'normal', mapStack: 'osm' },
    layers: beat ? { evidence: { enabled: true, params: { beatId: beat } } } : {},
  };
}
function project(shots = [shot()]) {
  return { version: 6, scenes: [{ id: 's', title: 'Fixture', shots, appliedShotPacks: [], releaseLayerIds: [] }] };
}
function nepal() {
  const scene = recipeToScene({ ...recipe, id: null, cameraPath: recipe.legacySceneBootstrap.cameraPath });
  scene.id = 's';
  scene.shots.forEach((s, i) => { s.id = `base-${i}`; s.camera.heading = 100 + i; });
  return normalizeProject({ version: 6, scenes: [scene] });
}
function fullNepal() {
  const p = nepal();
  p.scenes[0].shots.push(...recipeToScene(recipe).shots);
  p.scenes[0].appliedShotPacks = [{ id: PACK, version: 17,
    shotBindings: Object.fromEntries(p.scenes[0].shots.map(s => [s.title, s.id])) }];
  return p;
}
function setup(t, p = project(), r) {
  const storage = globalThis.localStorage;
  const recipes = SCENE_APPEND_RECIPES.slice();
  if (r) SCENE_APPEND_RECIPES.splice(0, SCENE_APPEND_RECIPES.length, r);
  const writes = [], events = [];
  globalThis.localStorage = { setItem: (key, value) => writes.push([key, JSON.parse(value)]) };
  const d = Object.create(SceneDirector.prototype);
  Object.assign(d, {
    _project: p, _selectedSceneId: 'other', _selectedShotId: 'old',
    _saveProject: () => events.push('save'),
    _renderSceneSelect: () => events.push('scenes'),
    _renderShotList: () => events.push('shots'),
    _updateStatus: (value) => events.push(value),
    _toastStorageError: () => events.push('storage-error'),
  });
  t.after(() => {
    globalThis.localStorage = storage;
    SCENE_APPEND_RECIPES.splice(0, SCENE_APPEND_RECIPES.length, ...recipes);
  });
  return { d, writes, events, scene: p.scenes[0] };
}
function custom(fields = {}) {
  return { id: 'p', title: 'Pack', version: 2, cameraPath: [], ...fields };
}
function append(d, options) { return d.appendShotPack('s', 'p', options); }
function installed(t, version = 12) {
  const h = setup(t, nepal());
  h.d.appendShotPack('s', PACK);
  h.scene.shots = h.scene.shots.filter(s => !s.sourcePackId || (version === 12
    ? ['immediate-collapse-viewpoint', 'debris-dammed-lake', 'gyirong-border-gate', 'timure-cluster', 'syabru-besi', 'bidur-trishuli-bridge']
    : BEATS.slice(0, -1)).includes(s.layers['bhote-koshi-2026'].params.beatId));
  const ids = new Set(h.scene.shots.map(s => s.id));
  h.scene.appliedShotPacks[0].version = version;
  h.scene.appliedShotPacks[0].shotBindings = Object.fromEntries(Object.entries(h.scene.appliedShotPacks[0].shotBindings).filter(([, id]) => ids.has(id)));
  h.writes.length = 0; h.events.length = 0;
  return h;
}
function expansion(fields = {}) {
  return custom({ version: 3, expansionFromVersion: 2,
    requiredSourcePackBeatIds: ['one', 'two'], requiredSourcePackLayerId: 'evidence',
    previousRequiredSourcePackBeatIds: ['one'],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: 'Two', layers: { evidence: { enabled: true, params: { beatId: 'two' } } } }], ...fields });
}
function oldScene() {
  const p = project([shot('a', 'One', 'one')]);
  p.scenes[0].shots[0].sourcePackId = 'p';
  p.scenes[0].appliedShotPacks = [{ id: 'p', version: 1 }];
  return p;
}

test('[director-151] The legacy sequence keeps three shot IDs and cameras', t => {
  const p = project([shot('a', 'Shot 1'), shot('b', 'Shot 2'), shot('c', 'Shot 3')]);
  p.scenes[0].title = 'Nepal Flood Incident';
  const { d, scene, writes } = setup(t, p);
  d._bootstrapLegacyShotPacks();
  assert.equal(scene.shots.length, 25);
  assert.deepEqual(scene.shots.slice(0, 3).map(s => s.id), ['a', 'b', 'c']);
  assert.deepEqual(scene.shots.slice(0, 3).map(s => s.camera.heading), [12, 12, 12]);
  assert.equal(writes[0][0], 'godsEyeView.sceneProject.checkpoint.v1');
  assert.equal(writes[0][1].version, 6);
  assert.deepEqual(writes[0][1].scenes[0].shots.map(s => s.title), ['Shot 1', 'Shot 2', 'Shot 3']);
});
for (const [field, change] of [
  ['scene title', p => { p.scenes[0].title = 'Authored'; }],
  ['shot total', p => { p.scenes[0].shots.pop(); }],
  ['first title', p => { p.scenes[0].shots[0].title = 'Authored'; }],
  ['second title', p => { p.scenes[0].shots[1].title = 'Authored'; }],
  ['third title', p => { p.scenes[0].shots[2].title = 'Authored'; }],
]) test(`[director-152] The legacy ${field} protects authored shots`, t => {
  const p = project([shot('a', 'Shot 1'), shot('b', 'Shot 2'), shot('c', 'Shot 3')]);
  p.scenes[0].title = 'Nepal Flood Incident'; change(p);
  const before = structuredClone(p);
  const { d, writes } = setup(t, p); d._bootstrapLegacyShotPacks();
  assert.deepEqual(d._project, before); assert.equal(writes.length, 0);
});
test('[director-153] The legacy checkpoint error protects the scene', t => {
  const p = project([shot('a', 'Shot 1'), shot('b', 'Shot 2'), shot('c', 'Shot 3')]);
  p.scenes[0].title = 'Nepal Flood Incident';
  const before = structuredClone(p); const { d, events } = setup(t, p);
  localStorage.setItem = () => { throw Error('quota'); };
  d._bootstrapLegacyShotPacks();
  assert.deepEqual(d._project, before); assert.deepEqual(events, ['storage-error']);
});
test('[director-154] The legacy pack refusal restores the project', t => {
  const p = project([shot('a', 'Shot 1'), shot('b', 'Shot 2'), shot('c', 'Shot 3')]);
  p.scenes[0].title = 'Nepal Flood Incident'; const before = structuredClone(p);
  const { d } = setup(t, p); d.appendShotPack = () => ({ appended: false });
  d._bootstrapLegacyShotPacks(); assert.deepEqual(d._project, before);
});
test('[director-155] The legacy selection uses its first shot', t => {
  const p = project([shot('a', 'Shot 1'), shot('b', 'Shot 2'), shot('c', 'Shot 3')]);
  p.scenes[0].title = 'Nepal Flood Incident'; const { d } = setup(t, p);
  d._bootstrapLegacyShotPacks();
  assert.equal(d._selectedSceneId, 's'); assert.equal(d._selectedShotId, 'a');
});
test('[director-156] The absent scene rejects the pack', t => {
  const { d } = setup(t); assert.deepEqual(d.appendShotPack('absent', PACK), { appended: false, reason: 'scene-not-found' });
});
test('[director-157] The absent pack rejects the request', t => {
  const { d } = setup(t); assert.deepEqual(d.appendShotPack('s', 'absent'), { appended: false, reason: 'pack-not-found' });
});
for (const version of [18, 19]) test(`[director-158] The version ${version} marker prevents another pack`, t => {
  const p = nepal(); p.scenes[0].appliedShotPacks = [{ id: PACK, version }];
  const before = structuredClone(p); const { d, writes } = setup(t, p);
  assert.deepEqual(d.appendShotPack('s', PACK), { appended: false, reason: 'already-appended' });
  assert.deepEqual(d._project, before); assert.equal(writes.length, 0);
});
test('[director-159] The first Nepal pack adds its current sequence', t => {
  const { d, scene } = setup(t, nepal());
  const result = d.appendShotPack('s', PACK);
  assert.equal(result.appended, true); assert.equal(result.shotCount, 17);
  assert.equal(result.patchedShotCount, 14); assert.equal(scene.shots.length, 25);
  assert.equal(scene.appliedShotPacks[0].version, 18); assert.equal(scene.appliedShotPacks[0].id, 'bhote-koshi-nepal-evidence-pack');
  assert.deepEqual(scene.shots.filter(s => s.sourcePackId === PACK).map(s => s.layers['bhote-koshi-2026'].params.beatId), BEATS);
});
for (const version of [12, 17]) test(`[director-160] The version ${version} pack keeps authored cameras and titles`, t => {
  const { d, scene } = installed(t, version);
  scene.shots[8].title = 'My camera'; scene.shots[8].camera.heading = 149;
  const before = structuredClone(scene.shots);
  const result = d.appendShotPack('s', PACK);
  assert.equal(result.appended, true); assert.equal(scene.shots.length, 25);
  for (const old of before) {
    const current = scene.shots.find(s => s.id === old.id);
    assert.ok(current); assert.deepEqual(current.camera, old.camera); assert.equal(current.title, old.title);
  }
  assert.equal(scene.appliedShotPacks[0].version, 18);
});
for (const kind of ['partial', 'order']) test(`[director-161] The ${kind} older beats reject expansion`, t => {
  const { d, scene } = installed(t);
  if (kind === 'partial') scene.shots.pop(); else [scene.shots[8], scene.shots[9]] = [scene.shots[9], scene.shots[8]];
  const before = structuredClone(scene);
  assert.equal(d.appendShotPack('s', PACK).reason, 'source-pack-mismatch'); assert.deepEqual(scene, before);
});
test('[director-162] The authored final view supplies its ID and camera', t => {
  const { d, scene } = installed(t, 17);
  scene.shots.push(shot('authored-final', 'Final view')); const result = d.appendShotPack('s', PACK);
  const final = scene.shots.find(s => s.id === 'authored-final');
  assert.equal(result.shotCount, 0); assert.equal(final.sourcePackId, PACK);
  assert.equal(final.sourcePackVersion, 18); assert.equal(final.camera.heading, 12);
  assert.equal(final.layers['bhote-koshi-2026'].params.beatId, 'final-view');
});
for (const kind of ['absent', 'duplicate', 'other pack']) test(`[director-163] The ${kind} final view does not supply a shot`, t => {
  const p = oldScene(); const r = expansion({ adoptExistingShotTitles: ['Two'] });
  if (kind !== 'absent') p.scenes[0].shots.push(shot('b', 'Two'));
  if (kind === 'duplicate') p.scenes[0].shots.push(shot('c', 'Two'));
  if (kind === 'other pack') p.scenes[0].shots[1].sourcePackId = 'other';
  const { d, scene } = setup(t, p, r); const result = append(d);
  assert.equal(result.shotCount, 1); assert.equal(scene.shots.filter(s => s.sourcePackId === 'p').length, 2);
  if (kind !== 'absent') assert.notEqual(scene.shots.find(s => s.id === 'b').sourcePackId, 'p');
});
test('[director-164] The stored final beat prevents another adoption', t => {
  const p = oldScene(); const r = expansion({ requiredSourcePackBeatIds: ['one', 'two', 'three'], adoptExistingShotTitles: ['Two'] });
  p.scenes[0].shots.push({ ...shot('b', 'Two', 'two'), sourcePackId: 'p' }, shot('c', 'Two'));
  r.previousRequiredSourcePackBeatIds = ['one', 'two'];
  r.cameraPath.push({ title: 'Three', layers: { evidence: { enabled: true, params: { beatId: 'three' } } } });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 1);
  assert.equal(scene.shots.find(s => s.id === 'c').sourcePackId, undefined);
});
test('[director-165] The older additions follow recipe order', t => {
  const { d, scene } = installed(t); d.appendShotPack('s', PACK);
  assert.deepEqual(scene.shots.filter(s => s.sourcePackId === PACK).map(s => s.layers['bhote-koshi-2026'].params.beatId), BEATS);
});
for (const kind of ['length', 'title']) test(`[director-166] The incorrect initial ${kind} rejects the pack`, t => {
  const p = nepal(); if (kind === 'length') p.scenes[0].shots.pop(); else p.scenes[0].shots[3].title = 'Authored';
  const before = structuredClone(p.scenes[0]); const { d, scene } = setup(t, p);
  assert.equal(d.appendShotPack('s', PACK).reason, 'shot-inventory-mismatch'); assert.deepEqual(scene, before);
});
test('[director-167] The renamed bound shot receives its patch', t => {
  const p = project([shot('a', 'Authored')]);
  p.scenes[0].appliedShotPacks = [{ id: 'p', version: 1, shotBindings: { A: 'a' } }];
  const { d, scene } = setup(t, p, custom({ requiredShotTitles: ['A'], shotPatches: [{ title: 'A', holdSec: 7 }] }));
  assert.equal(append(d).updated, true); assert.equal(scene.shots[0].title, 'Authored'); assert.equal(scene.shots[0].holdSec, 7); assert.deepEqual(scene.appliedShotPacks[0].shotBindings, { A: 'a' });
});
test('[director-168] The absent bound shot rejects the inventory', t => {
  const p = project(); p.scenes[0].appliedShotPacks = [{ id: 'p', version: 1, shotBindings: { A: 'absent' } }];
  const { d } = setup(t, p, custom({ requiredShotTitles: ['A'] })); assert.equal(append(d).reason, 'shot-inventory-mismatch');
});
test('[director-169] The repeated bound shot rejects the inventory', t => {
  const p = project(); p.scenes[0].appliedShotPacks = [{ id: 'p', version: 1, shotBindings: { A: 'a', B: 'a' } }];
  const { d } = setup(t, p, custom({ requiredShotTitles: ['A', 'B'] })); assert.equal(append(d).reason, 'shot-inventory-mismatch');
});
for (const kind of ['length', 'order', 'absent layers', 'absent parameters']) test(`[director-170] The ${kind.startsWith('absent') ? kind.replace('absent ', 'absent source ') : 'source ' + kind} rejects the pack`, t => {
  const p = project([{ ...shot('a', 'A', 'one'), sourcePackId: 'p' }]);
  const r = custom({ requiredSourcePackBeatIds: ['one'], requiredSourcePackLayerId: 'evidence' });
  if (kind === 'length') r.requiredSourcePackBeatIds.push('two');
  if (kind === 'order') p.scenes[0].shots[0].layers.evidence.params.beatId = 'two';
  if (kind === 'absent layers') delete p.scenes[0].shots[0].layers;
  if (kind === 'absent parameters') delete p.scenes[0].shots[0].layers.evidence.params;
  const { d } = setup(t, p, r); assert.equal(append(d).reason, 'source-pack-mismatch');
});
test('[director-171] The absent patch reference rejects the pack', t => {
  const p = project(); p.scenes[0].appliedShotPacks = [{ id: 'p', version: 1, shotBindings: { A: 'absent' } }];
  const { d } = setup(t, p, custom({ shotPatches: [{ title: 'A', holdSec: 7 }] })); assert.equal(append(d).reason, 'shot-bindings-incomplete');
});
for (const kind of ['absent', 'duplicate']) test(`[director-172] The ${kind} patch title rejects the pack`, t => {
  const p = project(kind === 'absent' ? [] : [shot('a'), shot('b')]);
  const { d } = setup(t, p, custom({ shotPatches: [{ title: 'A', holdSec: 7 }] })); assert.equal(append(d).reason, 'shot-bindings-incomplete');
});
test('[director-173] The camera patch sets its normalized pose', t => {
  const { d, scene } = setup(t, project(), custom({ shotPatches: [{ title: 'A', camera: { lat: 30, lon: 40, alt: 5000, heading: 123, pitch: -50, roll: 3 } }] }));
  append(d); assert.deepEqual(scene.shots[0].camera, { lat: 30, lon: 40, alt: 5000, heading: 123, pitch: -50, roll: 3 });
});
for (const [hold, expected] of [[7, 7], [-2, 0], ['8', 8], ['invalid', 3]]) test(`[director-174] The hold value ${hold} gives ${expected} seconds`, t => {
  const { d, scene } = setup(t, project(), custom({ shotPatches: [{ title: 'A', holdSec: hold }] })); append(d); assert.equal(scene.shots[0].holdSec, expected); assert.equal(scene.shots[0].camera.heading, 12);
});
test('[director-175] The visual patch keeps other visual fields', t => {
  const p = project(); p.scenes[0].shots[0].visual.style = 'retro';
  const { d, scene } = setup(t, p, custom({ shotPatches: [{ title: 'A', visual: { mapStack: 'photoreal' } }] }));
  append(d); assert.equal(scene.shots[0].visual.mapStack, 'photoreal'); assert.equal(scene.shots[0].visual.style, 'retro');
});
for (const key of ['first', 'second']) test(`[director-176] The layer patch sets ${key}`, t => {
  const p = project(); p.scenes[0].shots[0].layers.other = { enabled: true };
  const { d, scene } = setup(t, p, custom({ shotPatches: [{ title: 'A', layers: { [key]: true } }] }));
  append(d); assert.deepEqual(scene.shots[0].layers[key], { enabled: true }); assert.deepEqual(scene.shots[0].layers.other, { enabled: true });
});
test('[director-176] The layer patch accepts absent shot layers', t => {
  const p = project(); delete p.scenes[0].shots[0].layers;
  const { d, scene } = setup(t, p, custom({ shotPatches: [{ title: 'A', layers: { first: true } }] }));
  append(d); assert.deepEqual(scene.shots[0].layers.first, { enabled: true });
});
test('[director-177] The layer list combines scene and pack IDs', t => {
  const p = project(); p.scenes[0].releaseLayerIds = ['first', 'shared'];
  const { d, scene } = setup(t, p, custom({ releaseLayerIds: ['shared', 'second'] })); append(d);
  assert.deepEqual(scene.releaseLayerIds, ['first', 'shared', 'second']);
});
test('[director-178] The pack checkpoint error protects shots', t => {
  const { d, scene, events } = setup(t, project(), custom({ shotPatches: [{ title: 'A', holdSec: 7 }] }));
  const before = structuredClone(scene.shots); localStorage.setItem = () => { throw Error('quota'); };
  assert.deepEqual(append(d), { appended: false, reason: 'checkpoint-failed' }); assert.deepEqual(scene.shots, before); assert.deepEqual(events, ['storage-error']);
});
for (const addition of [true, false]) test(`[director-179] The pack selection uses ${addition ? 'the addition' : 'the saved shot'}`, t => {
  const r = custom({ cameraPath: addition ? [{ title: 'New' }] : [] });
  if (addition) r.cameraPath.map = () => [shot('new-id', 'New')];
  const { d, scene } = setup(t, project(), r); append(d);
  assert.equal(d._selectedSceneId, 's'); assert.equal(d._selectedShotId, addition ? 'new-id' : 'old');
});
test('[director-180] The pack saves before both control updates', t => {
  const { d, events, writes } = setup(t, project(), custom()); append(d);
  assert.deepEqual(events.slice(0, 3), ['save', 'scenes', 'shots']); assert.equal(writes.length, 1);
});
for (const total of [1, 2]) test(`[director-181] The notice reports ${total} patched ${total === 1 ? 'shot' : 'shots'}`, t => {
  const p = project(total === 1 ? [shot()] : [shot(), shot('b', 'B')]); p.scenes[0].appliedShotPacks = [{ id: 'p', version: 1 }];
  const { d, events } = setup(t, p, custom({ shotPatches: total === 1 ? [{ title: 'A' }] : [{ title: 'A' }, { title: 'B' }] })); append(d);
  assert.equal(events.at(-1), total === 1 ? 'Updated 1 shot: Pack' : 'Updated 2 shots: Pack');
});
test('[director-181] The notice reports new shots', t => {
  const { d, events } = setup(t, project(), custom({ cameraPath: [{ title: 'New A' }, { title: 'New B' }] })); append(d); assert.equal(events.at(-1), 'Appended 2 shots: Pack');
});
test('[director-182] The marker replacement keeps another pack marker', t => {
  const p = project(); p.scenes[0].appliedShotPacks = [{ id: 'other', version: 9 }, { id: 'p', version: 1 }];
  const { d, scene } = setup(t, p, custom()); append(d);
  assert.deepEqual(scene.appliedShotPacks, [{ id: 'other', version: 9 }, { id: 'p', version: 2 }]);
});
for (const field of ['version', 'requiredShotTitles', 'requiredSourcePackBeatIds', 'requiredSourcePackLayerId', 'adoptExistingShotTitles', 'previousRequiredSourcePackBeatIdVariants', 'shotPatches', 'releaseLayerIds']) test(`[director-183] The recipe accepts absent ${field}`, t => {
  const r = custom(); delete r[field]; const p = project(); delete p.scenes[0].appliedShotPacks; delete p.scenes[0].releaseLayerIds;
  const { d, scene } = setup(t, p, r); assert.equal(append(d).reason, undefined); assert.equal(scene.appliedShotPacks[0].version, field === 'version' ? 1 : 2);
  assert.deepEqual(scene.releaseLayerIds, []);
});
test('[director-184] The title match supplies a shot reference', t => {
  const { d, scene } = setup(t, project(), custom({ requiredShotTitles: ['A'] })); append(d);
  assert.deepEqual(scene.appliedShotPacks[0].shotBindings, { A: 'a' });
});
test('[director-185] The silent options save without optional actions', t => {
  const { d, events, writes } = setup(t, project(), custom()); append(d, { writeCheckpoint: false, render: false, announce: false });
  assert.deepEqual(events, ['save']); assert.equal(writes.length, 0);
});

for (const kind of ['absent bootstrap', 'absent path', 'absent titles']) test(`[${kind === 'absent titles' ? 'director-183 director-155' : 'director-183'}] The recipe accepts ${kind}`, t => {
  const r = custom({ legacySceneBootstrap: { targetSceneTitle: 'Fixture', cameraPath: [] } });
  if (kind === 'absent bootstrap') delete r.legacySceneBootstrap;
  if (kind === 'absent path') delete r.legacySceneBootstrap.cameraPath;
  const { d, writes } = setup(t, project([]), r);
  d.appendShotPack = () => ({ appended: true });
  d._bootstrapLegacyShotPacks();
  assert.equal(writes.length, kind === 'absent titles' ? 1 : 0);
  if (kind === 'absent titles') assert.equal(d._selectedShotId, null);
});
test('[director-183] The recipe accepts an absent adopted layer object', t => {
  const p = oldScene(); const adopted = shot('b', 'Two'); delete adopted.layers; p.scenes[0].shots.push(adopted);
  const { d, scene } = setup(t, p, expansion({ adoptExistingShotTitles: ['Two'] }));
  assert.equal(append(d).reason, undefined); assert.deepEqual(scene.shots.find(s => s.id === 'b').layers, { evidence: { enabled: true, params: { beatId: 'two' } } });
});
for (const side of ['stored shot', 'pack shot']) test(`[director-170] The absent ${side} rejects adopted source beats`, t => {
  const p = oldScene(); const adopted = shot('b', 'Two'); p.scenes[0].shots.push(adopted);
  const r = expansion({ adoptExistingShotTitles: ['Two'] }); let accesses = 0;
  if (side === 'stored shot') Object.defineProperty(adopted, 'id', { enumerable: true, get: () => ++accesses === 1 ? 'b' : 'changed' });
  else {
    const path = r.cameraPath;
    path.map = fn => {
      const result = Array.prototype.map.call(path, fn);
            result.find = function() { accesses++; return undefined; };
      return result;
    };
  }
  const { d } = setup(t, p, r); assert.equal(append(d).reason, 'source-pack-mismatch'); assert.ok(accesses > 0);
});
for (const [field, value] of [['requiredShotTitles', { length: 1 }], ['requiredSourcePackBeatIds', { length: 1 }], ['requiredSourcePackLayerId', 3], ['adoptExistingShotTitles', {}]]) test(`[director-183] The recipe accepts ${field === 'requiredSourcePackLayerId' ? 'a nontext source layer name' : 'a nonlist ' + field}`, t => {
  const r = custom({ [field]: value });
  if (field === 'requiredSourcePackLayerId') r.requiredSourcePackBeatIds = ['one'];
  if (field === 'requiredSourcePackBeatIds') r.requiredSourcePackLayerId = 'evidence';
  const { d, scene } = setup(t, project(), r);
  assert.equal(append(d).reason, undefined); assert.equal(scene.appliedShotPacks[0].version, 2);
});
for (const [kind, change] of [
  ['absent expansion version', r => { delete r.expansionFromVersion; }],
  ['zero marker version', (_r, p) => { p.scenes[0].appliedShotPacks[0].version = 0; }],
  ['higher marker version', (_r, p) => { p.scenes[0].appliedShotPacks[0].version = 2.5; }],
  ['complete beat total', (r, p) => { p.scenes[0].shots.push({ ...shot('b', 'Two', 'incorrect'), sourcePackId: 'p' }); }],
]) test(`[director-170] The ${kind} uses the source inventory check`, t => {
  const r = expansion(); const p = oldScene(); change(r, p);
  let accesses = 0;
  if (kind === 'absent expansion version') Object.defineProperty(p.scenes[0].appliedShotPacks[0], 'version', { enumerable: true, get: () => { accesses++; return 1; } });
  const { d, events } = setup(t, p, r);
  assert.equal(append(d).reason, 'source-pack-mismatch');
  assert.deepEqual(events, ['Cannot update Pack: evidence beats changed']);
  if (kind === 'absent expansion version') assert.equal(accesses, 1);
});
test('[director-173] The expansion does not replace a patched camera', t => {
  const { d, scene } = setup(t, oldScene(), expansion({ shotPatches: [{ title: 'One', camera: { heading: 150 } }] }));
  assert.equal(append(d).reason, undefined); assert.equal(scene.shots[0].camera.heading, 12);
});
test('[director-183] The empty adoption list accepts expansion', t => {
  const { d, scene } = setup(t, oldScene(), expansion()); assert.equal(append(d).shotCount, 1); assert.equal(scene.shots.length, 2);
});
test('[director-183] The absent source layer name does not check beats', t => {
  const { d } = setup(t, project(), custom({ requiredSourcePackBeatIds: ['one'] })); assert.equal(append(d).reason, undefined);
});
test('[director-183] The empty source beat list does not check its layer', t => {
  const p = project([{ ...shot('a', 'A', 'one'), sourcePackId: 'p' }]);
  const { d } = setup(t, p, custom({ requiredSourcePackBeatIds: [], requiredSourcePackLayerId: 'evidence' })); assert.equal(append(d).reason, undefined);
});

test('[director-176] The Nepal patch sets target 1', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Global Incident Context"); target.layers['bhote-koshi-2026'] = { ...target.layers['bhote-koshi-2026'], enabled: false };
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.layers['bhote-koshi-2026'].enabled, true);
});

test('[director-176] The Nepal patch sets target 2', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Nepal-Focused Globe Rotation"); target.layers['bhote-koshi-2026'] = { ...target.layers['bhote-koshi-2026'], enabled: false };
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.layers['bhote-koshi-2026'].enabled, true);
});

test('[director-176] The Nepal patch sets target 3', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Bhote Koshi Regional Approach"); target.layers['bhote-koshi-2026'] = { ...target.layers['bhote-koshi-2026'], enabled: false };
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.layers['bhote-koshi-2026'].enabled, true);
});

test('[director-176] The Nepal patch sets target 4', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Bhote Koshi Nearby Cities"); target.layers['bhote-koshi-2026'] = { ...target.layers['bhote-koshi-2026'], enabled: false };
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.layers['bhote-koshi-2026'].enabled, true);
});

test('[director-176] The Nepal patch sets target 5', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Bhote Koshi Incident Corridor"); target.layers['bhote-koshi-2026'] = { ...target.layers['bhote-koshi-2026'], enabled: false };
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.layers['bhote-koshi-2026'].enabled, true);
});

test('[director-176] The Nepal patch sets target 6', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Bhote Koshi Flood Path"); target.layers['bhote-koshi-2026'] = { ...target.layers['bhote-koshi-2026'], enabled: false };
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.layers['bhote-koshi-2026'].enabled, true);
});

test('[director-176] The Nepal patch sets target 7', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Bhote Koshi Corridor Overview"); target.layers['bhote-koshi-2026'] = { ...target.layers['bhote-koshi-2026'], enabled: false };
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.layers['bhote-koshi-2026'].enabled, true);
});

test('[director-176] The Nepal patch sets target 8', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Bhote Koshi Upper Valley"); target.layers['bhote-koshi-2026'] = { ...target.layers['bhote-koshi-2026'], enabled: false };
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.layers['bhote-koshi-2026'].enabled, true);
});

test('[director-176] The Nepal patch sets target 9', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Upper Valley Collapse"); target.layers['bhote-koshi-2026'] = { ...target.layers['bhote-koshi-2026'], enabled: false };
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.layers['bhote-koshi-2026'].enabled, true);
});

test('[director-175] The Nepal patch sets target 10', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Nepal-China Border Gate"); target.visual.mapStack = 'osm';
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.visual.mapStack, 'photoreal');
});

test('[director-175] The Nepal patch sets target 11', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Timure Evidence Cluster"); target.visual.mapStack = 'osm';
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.visual.mapStack, 'photoreal');
});

test('[director-175] The Nepal patch sets target 12', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Syabru Besi Passage"); target.visual.mapStack = 'osm';
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.visual.mapStack, 'photoreal');
});

test('[director-175] The Nepal patch sets target 13', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Bidur / Trishuli Consequence"); target.visual.mapStack = 'osm';
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.visual.mapStack, 'photoreal');
});

test('[director-176] The Nepal patch sets target 14', t => {
  const { d, scene } = setup(t, fullNepal());
  let target = scene.shots.find(s => s.title === "Final view"); target.layers['bhote-koshi-2026'] = { ...target.layers['bhote-koshi-2026'], enabled: false };
  d.appendShotPack('s', PACK);
  const updated = scene.shots.find(s => s.id === target.id); target = updated;
  assert.equal(target.layers['bhote-koshi-2026'].enabled, true);
});

test('[director-162] The adoption uses immediate-collapse-viewpoint', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Upper Valley Collapse"));
  const r = expansion({ adoptExistingShotTitles: ["Upper Valley Collapse"],
    requiredSourcePackBeatIds: ['one', "immediate-collapse-viewpoint"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Upper Valley Collapse", layers: { evidence: { enabled: true, params: { beatId: "immediate-collapse-viewpoint" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "immediate-collapse-viewpoint");
});

test('[director-162] The adoption uses debris-dammed-lake', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Debris-Dammed Lake"));
  const r = expansion({ adoptExistingShotTitles: ["Debris-Dammed Lake"],
    requiredSourcePackBeatIds: ['one', "debris-dammed-lake"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Debris-Dammed Lake", layers: { evidence: { enabled: true, params: { beatId: "debris-dammed-lake" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "debris-dammed-lake");
});

test('[director-162] The adoption uses second-landslide', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Second landslide"));
  const r = expansion({ adoptExistingShotTitles: ["Second landslide"],
    requiredSourcePackBeatIds: ['one', "second-landslide"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Second landslide", layers: { evidence: { enabled: true, params: { beatId: "second-landslide" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "second-landslide");
});

test('[director-162] The adoption uses gyirong-border-gate', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Nepal-China Border Gate"));
  const r = expansion({ adoptExistingShotTitles: ["Nepal-China Border Gate"],
    requiredSourcePackBeatIds: ['one', "gyirong-border-gate"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Nepal-China Border Gate", layers: { evidence: { enabled: true, params: { beatId: "gyirong-border-gate" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "gyirong-border-gate");
});

test('[director-162] The adoption uses timure-cluster', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Timure Evidence Cluster"));
  const r = expansion({ adoptExistingShotTitles: ["Timure Evidence Cluster"],
    requiredSourcePackBeatIds: ['one', "timure-cluster"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Timure Evidence Cluster", layers: { evidence: { enabled: true, params: { beatId: "timure-cluster" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "timure-cluster");
});

test('[director-162] The adoption uses syabru-besi', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Syabru Besi Passage"));
  const r = expansion({ adoptExistingShotTitles: ["Syabru Besi Passage"],
    requiredSourcePackBeatIds: ['one', "syabru-besi"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Syabru Besi Passage", layers: { evidence: { enabled: true, params: { beatId: "syabru-besi" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "syabru-besi");
});

test('[director-162] The adoption uses dhunche', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Dhunche"));
  const r = expansion({ adoptExistingShotTitles: ["Dhunche"],
    requiredSourcePackBeatIds: ['one', "dhunche"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Dhunche", layers: { evidence: { enabled: true, params: { beatId: "dhunche" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "dhunche");
});

test('[director-162] The adoption uses mailung-upper-trishuli', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Mailung / Upper Trishuli bridge"));
  const r = expansion({ adoptExistingShotTitles: ["Mailung / Upper Trishuli bridge"],
    requiredSourcePackBeatIds: ['one', "mailung-upper-trishuli"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Mailung / Upper Trishuli bridge", layers: { evidence: { enabled: true, params: { beatId: "mailung-upper-trishuli" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "mailung-upper-trishuli");
});

test('[director-162] The adoption uses mailung-bazzar', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Mailung Bazzar, Dandaguan"));
  const r = expansion({ adoptExistingShotTitles: ["Mailung Bazzar, Dandaguan"],
    requiredSourcePackBeatIds: ['one', "mailung-bazzar"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Mailung Bazzar, Dandaguan", layers: { evidence: { enabled: true, params: { beatId: "mailung-bazzar" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "mailung-bazzar");
});

test('[director-162] The adoption uses dandagaun', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Dandagaun, Rasuwa"));
  const r = expansion({ adoptExistingShotTitles: ["Dandagaun, Rasuwa"],
    requiredSourcePackBeatIds: ['one', "dandagaun"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Dandagaun, Rasuwa", layers: { evidence: { enabled: true, params: { beatId: "dandagaun" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "dandagaun");
});

test('[director-162] The adoption uses dandagaun-viewpoint', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Dandagaun viewpoint restaurant"));
  const r = expansion({ adoptExistingShotTitles: ["Dandagaun viewpoint restaurant"],
    requiredSourcePackBeatIds: ['one', "dandagaun-viewpoint"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Dandagaun viewpoint restaurant", layers: { evidence: { enabled: true, params: { beatId: "dandagaun-viewpoint" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "dandagaun-viewpoint");
});

test('[director-162] The adoption uses betrawati-bazaar', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Betrawati Bazaar"));
  const r = expansion({ adoptExistingShotTitles: ["Betrawati Bazaar"],
    requiredSourcePackBeatIds: ['one', "betrawati-bazaar"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Betrawati Bazaar", layers: { evidence: { enabled: true, params: { beatId: "betrawati-bazaar" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "betrawati-bazaar");
});

test('[director-162] The adoption uses bhainse', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Bhainse"));
  const r = expansion({ adoptExistingShotTitles: ["Bhainse"],
    requiredSourcePackBeatIds: ['one', "bhainse"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Bhainse", layers: { evidence: { enabled: true, params: { beatId: "bhainse" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "bhainse");
});

test('[director-162] The adoption uses bidur-trishuli-bridge', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Bidur / Trishuli Consequence"));
  const r = expansion({ adoptExistingShotTitles: ["Bidur / Trishuli Consequence"],
    requiredSourcePackBeatIds: ['one', "bidur-trishuli-bridge"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Bidur / Trishuli Consequence", layers: { evidence: { enabled: true, params: { beatId: "bidur-trishuli-bridge" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "bidur-trishuli-bridge");
});

test('[director-162] The adoption uses devighat-taadi-khola-bridge', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Devighat / Taadi Khola Bridge"));
  const r = expansion({ adoptExistingShotTitles: ["Devighat / Taadi Khola Bridge"],
    requiredSourcePackBeatIds: ['one', "devighat-taadi-khola-bridge"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Devighat / Taadi Khola Bridge", layers: { evidence: { enabled: true, params: { beatId: "devighat-taadi-khola-bridge" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "devighat-taadi-khola-bridge");
});

test('[director-162] The adoption uses charaudi', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Charaudi"));
  const r = expansion({ adoptExistingShotTitles: ["Charaudi"],
    requiredSourcePackBeatIds: ['one', "charaudi"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Charaudi", layers: { evidence: { enabled: true, params: { beatId: "charaudi" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "charaudi");
});

test('[director-162] The adoption uses final-view', t => {
  const p = oldScene(); p.scenes[0].shots.push(shot('adopted', "Final view"));
  const r = expansion({ adoptExistingShotTitles: ["Final view"],
    requiredSourcePackBeatIds: ['one', "final-view"],
    cameraPath: [{ title: 'One', layers: { evidence: { enabled: true, params: { beatId: 'one' } } } },
      { title: "Final view", layers: { evidence: { enabled: true, params: { beatId: "final-view" } } } }] });
  const { d, scene } = setup(t, p, r); assert.equal(append(d).shotCount, 0);
  const target = scene.shots.find(s => s.id === 'adopted');
  assert.equal(target.sourcePackId, 'p'); assert.equal(target.camera.heading, 12);
  assert.equal(target.layers.evidence.params.beatId, "final-view");
});

test('[director-183] The pack layer array comes from the recipe normalizer', t => {
  let accesses = 0;
  const r = new Proxy(custom(), { get(target, key) { if (key === 'releaseLayerIds') { accesses++; return undefined; } return Reflect.get(target, key); } });
  const p = project(); delete p.scenes[0].releaseLayerIds;
  const { d, scene } = setup(t, p, r);
  append(d); assert.equal(accesses, 1); assert.equal(Object.hasOwn(scene, 'releaseLayerIds'), true); assert.deepEqual(scene.releaseLayerIds, []);
});

test('[director-163] The first pack does not adopt an authored shot', t => {
  const p = project([shot('a', 'Two')]);
  const r = expansion({ adoptExistingShotTitles: ['Two'], requiredSourcePackBeatIds: ['one', 'two'] });
  const { d, scene } = setup(t, p, r);
  assert.equal(append(d).shotCount, 2); assert.equal(scene.shots[0].sourcePackId, undefined);
});
test('[director-162] The adoption keeps other authored layers', t => {
  const p = oldScene(); const adopted = shot('b', 'Two'); adopted.layers.other = { enabled: true }; p.scenes[0].shots.push(adopted);
  const { d, scene } = setup(t, p, expansion({ adoptExistingShotTitles: ['Two'] }));
  append(d); assert.deepEqual(scene.shots.find(s => s.id === 'b').layers.other, { enabled: true });
});
for (const title of ['Bhote Koshi Upper Valley', 'Final view']) test(`[director-176] The Nepal locator patch sets ${title}`, t => {
  const { d, scene } = setup(t, fullNepal());
  const target = scene.shots.find(s => s.title === title); target.layers['bhote-koshi-locator'].enabled = false;
  d.appendShotPack('s', PACK); assert.equal(scene.shots.find(s => s.id === target.id).layers['bhote-koshi-locator'].enabled, true);
});

test('[director-182] The older marker does not add shots without expansion', t => {
  const p = project(); p.scenes[0].appliedShotPacks = [{ id: 'p', version: 1 }];
  const { d, scene } = setup(t, p, custom({ cameraPath: [{ title: 'New' }] }));
  assert.equal(append(d).shotCount, 0); assert.equal(scene.shots.length, 1); assert.equal(scene.appliedShotPacks[0].version, 2);
});
for (const key of ['writeCheckpoint', 'render', 'announce']) test(`[director-151] The legacy options disable ${key}`, t => {
  const p = project([shot('a', 'Shot 1'), shot('b', 'Shot 2'), shot('c', 'Shot 3')]); p.scenes[0].title = 'Nepal Flood Incident';
  const { d } = setup(t, p); const original = d.appendShotPack;
  let received;
  d.appendShotPack = function(sceneId, packId, options) { received = options; return original.call(this, sceneId, packId, options); };
  d._bootstrapLegacyShotPacks(); assert.equal(Object.hasOwn(received, key), true); assert.equal(received[key], false);
});

test('[director-165] The last addition follows an authored tail', t => {
  const { d, scene } = installed(t, 17); scene.shots.push(shot('tail', 'Authored tail'));
  d.appendShotPack('s', PACK);
  assert.deepEqual(scene.shots.slice(-2).map(s => s.title), ['Authored tail', 'Final view']);
});

test('[director-166] The short title prefix rejects the pack', t => {
  const { d } = setup(t, project(), custom({ requiredShotTitles: ['A', 'B'] }));
  assert.equal(append(d).reason, 'shot-inventory-mismatch');
});
test('[director-173] The camera patch converts text numbers', t => {
  const { d, scene } = setup(t, project(), custom({ shotPatches: [{ title: 'A', camera: { lat: '30', lon: '40', alt: '5000', heading: '123', pitch: '-50', roll: '3' } }] }));
  append(d); assert.deepEqual(scene.shots[0].camera, { lat: 30, lon: 40, alt: 5000, heading: 123, pitch: -50, roll: 3 });
});

test('[director-177] The pack layer array accepts a custom list getter', t => {
  let accesses = 0;
  const r = new Proxy(custom(), { get(target, key) { if (key === 'releaseLayerIds') { accesses++; return ['second']; } return Reflect.get(target, key); } });
  const p = project(); p.scenes[0].releaseLayerIds = ['first'];
  const { d, scene } = setup(t, p, r); append(d);
  assert.equal(accesses, 2); assert.equal(Object.hasOwn(scene, 'releaseLayerIds'), true); assert.deepEqual(scene.releaseLayerIds, ['first', 'second']);
});

test('[director-155] The constructor selects the legacy scene after a custom pack', async t => {
  const p = project([shot('a', 'Shot 1'), shot('b', 'Shot 2'), shot('c', 'Shot 3')]); p.scenes[0].title = 'Nepal Flood Incident';
  p.scenes.unshift({ id: 'other', title: 'Authored', shots: [shot('other-shot', 'Other')], appliedShotPacks: [], releaseLayerIds: [] });
  const originalDocument = globalThis.document, originalStorage = globalThis.localStorage;
  const originalAppend = SceneDirector.prototype.appendShotPack;
  const classList = { add() {}, remove() {}, toggle() {}, contains: () => false };
  globalThis.document = { getElementById: () => null, addEventListener() {}, removeEventListener() {},
    createElement: () => ({ classList, style: {}, appendChild() {}, remove() {} }), body: { classList, appendChild() {} } };
  globalThis.localStorage = { getItem: key => key === 'godsEyeView.sceneProject.v2' ? JSON.stringify(p) : null, setItem() {} };
  SceneDirector.prototype.appendShotPack = function(sceneId) {
    this._project.scenes.find(s => s.id === sceneId).shots.push(shot('extra', 'Extra'));
    return { appended: true };
  };
  let d;
  t.after(async () => {
    try { await d?.destroy(); } finally { globalThis.document = originalDocument; globalThis.localStorage = originalStorage; SceneDirector.prototype.appendShotPack = originalAppend; }
  });
  const viewer = { scene: { canvas: { addEventListener() {}, removeEventListener() {} } }, camera: { cancelFlight() {}, setView() {} } };
  const style = { getCameraState: () => ({}), getVisualState: () => ({}), runImmediateNavigation: (_name, fn) => fn(), setRecordingMode() {} };
  const data = { getAll: () => [], getLayerParams: () => null, subscribeVisibilityRequests: () => undefined };
  d = new SceneDirector(viewer, style, data);
  assert.equal(d._selectedSceneId, 's'); assert.equal(d._selectedShotId, 'a');
});
