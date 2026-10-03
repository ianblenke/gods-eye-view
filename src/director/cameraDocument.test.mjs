import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSceneCameras } from './cameraDocument.js';
const pose = () => ({ lat: 1, lon: 2, alt: 3, altitudeReference: 'ellipsoid' });
const scene = () => ({ shots: [{ camera: pose() }] });
const moving = () => ({
  shots: [
    {
      camera: pose(),
      move: { from: pose(), easing: 'linear' },
      durationSec: 1,
      holdSec: 0,
    },
  ],
});
const anchor = () => ({
  id: 'a',
  lat: 1,
  lon: 2,
  alt: 3,
  altitudeReference: 'ellipsoid',
});
const validate = (s, v = 4) => validateSceneCameras(s, 'scene', v);

test('[director-049] The ordinary pose rejects invalid lat', () => {
  const s = scene();
  s.shots[0].camera.lat = 91;
  assert.throws(() => validate(s), /camera\.lat/);
});

test('[director-053] The explicit start needs lat', () => {
  const s = moving();
  delete s.shots[0].move.from.lat;
  assert.throws(() => validate(s), /move\.from\.lat/);
});

test('[director-053] The explicit destination needs lat', () => {
  const s = moving();
  delete s.shots[0].camera.lat;
  assert.throws(() => validate(s), /camera\.lat/);
});

test('[director-049] The ordinary pose rejects invalid lon', () => {
  const s = scene();
  s.shots[0].camera.lon = 181;
  assert.throws(() => validate(s), /camera\.lon/);
});

test('[director-053] The explicit start needs lon', () => {
  const s = moving();
  delete s.shots[0].move.from.lon;
  assert.throws(() => validate(s), /move\.from\.lon/);
});

test('[director-053] The explicit destination needs lon', () => {
  const s = moving();
  delete s.shots[0].camera.lon;
  assert.throws(() => validate(s), /camera\.lon/);
});

test('[director-049] The ordinary pose rejects invalid alt', () => {
  const s = scene();
  s.shots[0].camera.alt = -12001;
  assert.throws(() => validate(s), /camera\.alt/);
});

test('[director-053] The explicit start needs alt', () => {
  const s = moving();
  delete s.shots[0].move.from.alt;
  assert.throws(() => validate(s), /move\.from\.alt/);
});

test('[director-053] The explicit destination needs alt', () => {
  const s = moving();
  delete s.shots[0].camera.alt;
  assert.throws(() => validate(s), /camera\.alt/);
});

test('[director-050] The pose rejects invalid heading', () => {
  const s = scene();
  s.shots[0].camera.heading = 361;
  assert.throws(() => validate(s), /camera\.heading/);
});

test('[director-050] The pose rejects invalid pitch', () => {
  const s = scene();
  s.shots[0].camera.pitch = 91;
  assert.throws(() => validate(s), /camera\.pitch/);
});

test('[director-050] The pose rejects invalid roll', () => {
  const s = scene();
  s.shots[0].camera.roll = 361;
  assert.throws(() => validate(s), /camera\.roll/);
});

test('[director-050] The pose accepts absent orientation', () => {
  assert.doesNotThrow(() => validate(scene()));
});

test('[director-049] The ordinary pose accepts absent coordinates', () => {
  assert.doesNotThrow(() => validate({ shots: [{ camera: {} }] }));
});

test('[director-053] The explicit start needs all coordinates', () => {
  const s = moving();
  delete s.shots[0].move.from.lat;
  assert.throws(() => validate(s), /move\.from\.lat/);
});

test('[director-050] The own orientation field decides the check', () => {
  const s = scene();
  s.shots[0].camera.pitch = 91;
  assert.throws(() => validate(s), /camera\.pitch/);
});

test('[director-051] The legacy pose accepts text heading', () => {
  const s = scene();
  delete s.shots[0].camera.altitudeReference;
  s.shots[0].camera.heading = '1';
  assert.doesNotThrow(() => validate(s, 2));
});

test('[director-051] The modern pose rejects text heading', () => {
  const s = scene();
  delete s.shots[0].camera.altitudeReference;
  s.shots[0].camera.heading = '1';
  assert.throws(() => validate(s, 3), /camera\.heading/);
});

test('[director-051] The legacy pose accepts text pitch', () => {
  const s = scene();
  delete s.shots[0].camera.altitudeReference;
  s.shots[0].camera.pitch = '1';
  assert.doesNotThrow(() => validate(s, 2));
});

test('[director-051] The modern pose rejects text pitch', () => {
  const s = scene();
  delete s.shots[0].camera.altitudeReference;
  s.shots[0].camera.pitch = '1';
  assert.throws(() => validate(s, 3), /camera\.pitch/);
});

test('[director-051] The legacy pose accepts text roll', () => {
  const s = scene();
  delete s.shots[0].camera.altitudeReference;
  s.shots[0].camera.roll = '1';
  assert.doesNotThrow(() => validate(s, 2));
});

test('[director-051] The modern pose rejects text roll', () => {
  const s = scene();
  delete s.shots[0].camera.altitudeReference;
  s.shots[0].camera.roll = '1';
  assert.throws(() => validate(s, 3), /camera\.roll/);
});

test('[director-051] The legacy pose accepts text lat', () => {
  const s = scene();
  delete s.shots[0].camera.altitudeReference;
  s.shots[0].camera.lat = '1';
  assert.doesNotThrow(() => validate(s, 2));
});

test('[director-051] The modern pose rejects text lat', () => {
  const s = scene();
  delete s.shots[0].camera.altitudeReference;
  s.shots[0].camera.lat = '1';
  assert.throws(() => validate(s, 3), /camera\.lat/);
});

test('[director-051] The legacy pose accepts text lon', () => {
  const s = scene();
  delete s.shots[0].camera.altitudeReference;
  s.shots[0].camera.lon = '1';
  assert.doesNotThrow(() => validate(s, 2));
});

test('[director-051] The modern pose rejects text lon', () => {
  const s = scene();
  delete s.shots[0].camera.altitudeReference;
  s.shots[0].camera.lon = '1';
  assert.throws(() => validate(s, 3), /camera\.lon/);
});

test('[director-051] The legacy pose accepts text alt', () => {
  const s = scene();
  delete s.shots[0].camera.altitudeReference;
  s.shots[0].camera.alt = '1';
  assert.doesNotThrow(() => validate(s, 2));
});

test('[director-051] The modern pose rejects text alt', () => {
  const s = scene();
  delete s.shots[0].camera.altitudeReference;
  s.shots[0].camera.alt = '1';
  assert.throws(() => validate(s, 3), /camera\.alt/);
});

test('[director-051] The early version rejects an anchor reference', () => {
  assert.throws(
    () =>
      validate(
        { anchors: [anchor()], shots: [{ camera: { anchorId: 'a' } }] },
        3,
      ),
    /anchorId/,
  );
});

test('[director-051] The modern version accepts an anchor reference', () => {
  assert.doesNotThrow(() =>
    validate(
      { anchors: [anchor()], shots: [{ camera: { anchorId: 'a' } }] },
      4,
    ),
  );
});

test('[director-055] The modern inline pose accepts its reference', () => {
  assert.doesNotThrow(() => validate(scene(), 4));
});

test('[director-051] The early version rejects the height field', () => {
  assert.throws(() => validate(scene(), 3), /altitudeReference/);
});

test('[director-055] The own height reference decides the check', () => {
  const s = scene();
  s.shots[0].camera.altitudeReference = 'terrain';
  assert.throws(() => validate(s), /altitudeReference/);
});

test('[director-055] The explicit endpoint needs a height reference', () => {
  const s = moving();
  delete s.shots[0].move.from.altitudeReference;
  assert.throws(() => validate(s), /move\.from\.altitudeReference/);
});

test('[director-055] The ellipsoid reference accepts the pose', () => {
  assert.doesNotThrow(() => validate(scene()));
});

test('[director-052] The anchor ID must name a scene anchor', () => {
  assert.throws(
    () => validate({ shots: [{ camera: { anchorId: 'unknown' } }] }),
    /unknown scene anchor/,
  );
});

test('[director-052] The anchor rejects invalid lat', () => {
  const a = anchor();
  a.lat = 91;
  assert.throws(
    () => validate({ anchors: [a], shots: [] }),
    /anchors\[0\]\.lat/,
  );
});

test('[director-052] The anchor rejects invalid lon', () => {
  const a = anchor();
  a.lon = 181;
  assert.throws(
    () => validate({ anchors: [a], shots: [] }),
    /anchors\[0\]\.lon/,
  );
});

test('[director-052] The anchor rejects invalid alt', () => {
  const a = anchor();
  a.alt = -12001;
  assert.throws(
    () => validate({ anchors: [a], shots: [] }),
    /anchors\[0\]\.alt/,
  );
});

test('[director-052] The anchor rejects invalid id', () => {
  const a = anchor();
  a.id = 0;
  assert.throws(() => validate({ anchors: [a], shots: [] }));
});

test('[director-052] The anchor rejects invalid title', () => {
  const a = anchor();
  a.title = 0;
  assert.throws(() => validate({ anchors: [a], shots: [] }));
});

test('[director-052] The anchor rejects invalid altitudeReference', () => {
  const a = anchor();
  a.altitudeReference = 'terrain';
  assert.throws(() => validate({ anchors: [a], shots: [] }));
});

test('[director-052] The scene rejects duplicate anchor IDs', () => {
  assert.throws(
    () => validate({ anchors: [anchor(), anchor()], shots: [] }),
    /duplicate ID/,
  );
});

test('[director-052] The scene rejects excess anchors', () => {
  assert.throws(
    () =>
      validate({
        anchors: Array.from({ length: 1025 }, (_, i) => ({
          ...anchor(),
          id: String(i),
        })),
        shots: [],
      }),
    /at most 1024/,
  );
});

test('[director-054] The move rejects an unsupported curve', () => {
  const s = moving();
  s.shots[0].move.easing = 'bounce';
  assert.throws(() => validate(s), /easing/);
});

test('[director-054] The move accepts the linear curve', () => {
  const s = moving();
  s.shots[0].move.easing = 'linear';
  assert.doesNotThrow(() => validate(s));
});

test('[director-054] The move accepts the cubic-in-out curve', () => {
  const s = moving();
  s.shots[0].move.easing = 'cubic-in-out';
  assert.doesNotThrow(() => validate(s));
});

test('[director-054] The move rejects durationSec lower excess', () => {
  const s = moving();
  s.shots[0].durationSec = -0.8;
  assert.throws(() => validate(s), /durationSec/);
});

test('[director-054] The move rejects durationSec upper excess', () => {
  const s = moving();
  s.shots[0].durationSec = 86401;
  assert.throws(() => validate(s), /durationSec/);
});

test('[director-054] The move rejects durationSec text', () => {
  const s = moving();
  s.shots[0].durationSec = '1';
  assert.throws(() => validate(s), /durationSec/);
});

test('[director-054] The move rejects durationSec absent value', () => {
  const s = moving();
  s.shots[0].durationSec = undefined;
  assert.throws(() => validate(s), /durationSec/);
});

test('[director-054] The move accepts both durationSec bounds', () => {
  const s = moving();
  s.shots[0].durationSec = 0.2;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].durationSec = 86400;
  assert.doesNotThrow(() => validate(s));
});

test('[director-054] The move rejects holdSec lower excess', () => {
  const s = moving();
  s.shots[0].holdSec = -1;
  assert.throws(() => validate(s), /holdSec/);
});

test('[director-054] The move rejects holdSec upper excess', () => {
  const s = moving();
  s.shots[0].holdSec = 86401;
  assert.throws(() => validate(s), /holdSec/);
});

test('[director-054] The move rejects holdSec text', () => {
  const s = moving();
  s.shots[0].holdSec = '1';
  assert.throws(() => validate(s), /holdSec/);
});

test('[director-054] The move rejects holdSec absent value', () => {
  const s = moving();
  s.shots[0].holdSec = undefined;
  assert.throws(() => validate(s), /holdSec/);
});

test('[director-054] The move accepts both holdSec bounds', () => {
  const s = moving();
  s.shots[0].holdSec = 0;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].holdSec = 86400;
  assert.doesNotThrow(() => validate(s));
});

test('[director-049] The null pose gives a document error', () => {
  assert.throws(() => validate({ shots: [{ camera: null }] }), {
    name: 'SceneDocumentError',
    path: 'scene.shots[0].camera',
  });
});

test('[director-052] The anchor check rejects a changed ID', () => {
  const a = anchor();
  let reads = 0;
  Object.defineProperty(a, 'id', {
    enumerable: true,
    get: () => (++reads === 1 ? 'a' : 0),
  });
  assert.throws(() => validate({ anchors: [a], shots: [] }), {
    name: 'SceneDocumentError',
  });
});

test('[director-049] The inline schema accepts its lat field', () => {
  const s = scene();
  s.shots[0].camera.lat = 1;
  assert.doesNotThrow(() => validate(s));
});

test('[director-049] The inline schema accepts its lon field', () => {
  const s = scene();
  s.shots[0].camera.lon = 2;
  assert.doesNotThrow(() => validate(s));
});

test('[director-049] The inline schema accepts its alt field', () => {
  const s = scene();
  s.shots[0].camera.alt = 3;
  assert.doesNotThrow(() => validate(s));
});

test('[director-050] The inline schema accepts its heading field', () => {
  const s = scene();
  s.shots[0].camera.heading = 0;
  assert.doesNotThrow(() => validate(s));
});

test('[director-050] The inline schema accepts its pitch field', () => {
  const s = scene();
  s.shots[0].camera.pitch = 0;
  assert.doesNotThrow(() => validate(s));
});

test('[director-050] The inline schema accepts its roll field', () => {
  const s = scene();
  s.shots[0].camera.roll = 0;
  assert.doesNotThrow(() => validate(s));
});

test('[director-051] The anchor shape uses its own reference field', () => {
  assert.doesNotThrow(() =>
    validate({ anchors: [anchor()], shots: [{ camera: { anchorId: 'a' } }] }),
  );
});

test('[director-055] The inline shape keeps its coordinate fields', () => {
  assert.doesNotThrow(() => validate(scene()));
});

test('[director-051] The inline pose decides its own shape', () => {
  assert.doesNotThrow(() => validate(scene()));
});

test('[director-052] The anchor reference checks its ID', () => {
  assert.doesNotThrow(() =>
    validate({ anchors: [anchor()], shots: [{ camera: { anchorId: 'a' } }] }),
  );
  assert.throws(
    () =>
      validate({
        anchors: [anchor()],
        shots: [{ camera: { anchorId: 'other' } }],
      }),
    /unknown scene anchor/,
  );
});

test('[director-049] The pose checks both lat bounds', () => {
  const s = scene();
  s.shots[0].camera.lat = -90;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].camera.lat = 90;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].camera.lat = -91;
  assert.throws(() => validate(s), /lat/);
  s.shots[0].camera.lat = 91;
  assert.throws(() => validate(s), /lat/);
});

test('[director-049] The pose checks both lon bounds', () => {
  const s = scene();
  s.shots[0].camera.lon = -180;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].camera.lon = 180;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].camera.lon = -181;
  assert.throws(() => validate(s), /lon/);
  s.shots[0].camera.lon = 181;
  assert.throws(() => validate(s), /lon/);
});

test('[director-049] The pose checks both alt bounds', () => {
  const s = scene();
  s.shots[0].camera.alt = -12000;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].camera.alt = 1000000000;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].camera.alt = -12001;
  assert.throws(() => validate(s), /alt/);
  s.shots[0].camera.alt = 1000000001;
  assert.throws(() => validate(s), /alt/);
});

test('[director-050] The pose checks both heading bounds', () => {
  const s = scene();
  s.shots[0].camera.heading = -360;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].camera.heading = 360;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].camera.heading = -361;
  assert.throws(() => validate(s), /heading/);
  s.shots[0].camera.heading = 361;
  assert.throws(() => validate(s), /heading/);
});

test('[director-050] The pose checks both pitch bounds', () => {
  const s = scene();
  s.shots[0].camera.pitch = -90;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].camera.pitch = 90;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].camera.pitch = -91;
  assert.throws(() => validate(s), /pitch/);
  s.shots[0].camera.pitch = 91;
  assert.throws(() => validate(s), /pitch/);
});

test('[director-050] The pose checks both roll bounds', () => {
  const s = scene();
  s.shots[0].camera.roll = -360;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].camera.roll = 360;
  assert.doesNotThrow(() => validate(s));
  s.shots[0].camera.roll = -361;
  assert.throws(() => validate(s), /roll/);
  s.shots[0].camera.roll = 361;
  assert.throws(() => validate(s), /roll/);
});

test('[director-052] The scene accepts the exact anchor limit', () => {
  assert.doesNotThrow(() =>
    validate({
      anchors: Array.from({ length: 1024 }, (_, i) => ({
        ...anchor(),
        id: String(i),
      })),
      shots: [],
    }),
  );
});

test('[director-052] The anchor rejects an absent ID', () => {
  const a = anchor();
  delete a.id;
  assert.throws(
    () => validate({ anchors: [a], shots: [] }),
    /expected nonempty text/,
  );
});

test('[director-052] The anchor needs its lat coordinate', () => {
  const a = anchor();
  delete a.lat;
  assert.throws(
    () => validate({ anchors: [a], shots: [] }),
    /anchors\[0\]\.lat/,
  );
});

test('[director-052] The anchor needs its lon coordinate', () => {
  const a = anchor();
  delete a.lon;
  assert.throws(
    () => validate({ anchors: [a], shots: [] }),
    /anchors\[0\]\.lon/,
  );
});

test('[director-052] The anchor needs its alt coordinate', () => {
  const a = anchor();
  delete a.alt;
  assert.throws(
    () => validate({ anchors: [a], shots: [] }),
    /anchors\[0\]\.alt/,
  );
});

test('[director-052] The anchor needs its height reference', () => {
  const a = anchor();
  delete a.altitudeReference;
  assert.throws(
    () => validate({ anchors: [a], shots: [] }),
    /altitudeReference/,
  );
});

test('[director-055] The destination needs its height reference', () => {
  const s = moving();
  delete s.shots[0].camera.altitudeReference;
  assert.throws(() => validate(s), /camera\.altitudeReference/);
});

test('[director-075] The anchor pose rejects its inline lat field', () => {
  const s = scene();
  s.anchors = [anchor()];
  s.shots[0].camera = { anchorId: 'a', lat: 1 };
  assert.throws(() => validate(s), /camera\.lat/);
});

test('[director-075] The anchor pose rejects its inline lon field', () => {
  const s = scene();
  s.anchors = [anchor()];
  s.shots[0].camera = { anchorId: 'a', lon: 2 };
  assert.throws(() => validate(s), /camera\.lon/);
});

test('[director-075] The anchor pose rejects its inline alt field', () => {
  const s = scene();
  s.anchors = [anchor()];
  s.shots[0].camera = { anchorId: 'a', alt: 3 };
  assert.throws(() => validate(s), /camera\.alt/);
});

test('[director-075] The anchor pose rejects its inline altitudeReference field', () => {
  const s = scene();
  s.anchors = [anchor()];
  s.shots[0].camera = { anchorId: 'a', altitudeReference: 'ellipsoid' };
  assert.throws(() => validate(s), /camera\.altitudeReference/);
});
