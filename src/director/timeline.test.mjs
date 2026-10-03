import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sceneTimingForShot,
  sceneSeekState,
  cameraAtProgress,
} from './timeline.js';
const camera = (lon, heading) => ({
  lat: 10,
  lon,
  alt: 1000,
  heading,
  pitch: -40,
  roll: 0,
});
const scene = {
  shots: [
    { id: 'a', durationSec: 2, holdSec: 1, camera: camera(20, 350) },
    { id: 'b', durationSec: 4, holdSec: 3, camera: camera(24, 10) },
  ],
};
const duration = (_, shot) => shot.durationSec + shot.holdSec;
const hold = (_, shot) => shot.holdSec;

test('[director-031 director-034] scene time accounts for flight and hold; exact boundaries select the next shot', () => {
  const time = sceneTimingForShot(scene, scene.shots[1], duration);
  assert.equal(time.startElapsedSec, 3);
  assert.equal(time.endElapsedSec, 10);
  const seek = (progress) => sceneSeekState(scene, progress, duration, hold);
  assert.equal(seek(-1).shot.id, 'a');
  assert.equal(seek(0.3).shot.id, 'b');
  assert.equal(seek(0.3).cameraProgress, 0);
  assert.equal(seek(0.5).cameraProgress, 0.5);
  assert.equal(seek(0.5).camera.lon, 22);
  assert.equal(seek(0.8).holdElapsedSec, 1);
  assert.equal(seek(2).holdProgress, 1);
  assert.equal(seek(0).sceneElapsedSec, 0);
  assert.equal(sceneSeekState({ shots: [] }, 1, duration, hold), null);
});

test('[director-033] camera seeking preserves cubic easing and shortest-angle orientation', () => {
  assert.equal(
    cameraAtProgress(camera(20, 350), camera(24, 10), 0.5).heading,
    360,
  );
  assert.equal(
    cameraAtProgress(camera(20, 350), camera(24, 10), 0.25).lon,
    20.25,
  );
  assert.deepEqual(cameraAtProgress(null, camera(20, 350), 0), {
    lat: 10,
    lon: 20,
    alt: 1000,
    heading: 350,
    pitch: -40,
    roll: 0,
  });
});

test('[director-031] The shot boundaries use cumulative durations', () => {
  assert.deepEqual(sceneTimingForShot(scene, scene.shots[1], duration), {
    shotIndex: 1,
    totalSec: 10,
    durationSec: 7,
    startElapsedSec: 3,
    endElapsedSec: 10,
    startProgress: 0.3,
    endProgress: 1,
    durationProgress: 0.7,
  });
});

test('[director-032] The absent scene gives empty time', () => {
  assert.deepEqual(sceneTimingForShot(null, null, duration), {
    shotIndex: -1,
    totalSec: 0,
    durationSec: 0,
    startElapsedSec: 0,
    endElapsedSec: 0,
    startProgress: 0,
    endProgress: 1,
    durationProgress: 0,
  });
});

test('[director-032] The absent shot index gives empty time', () => {
  assert.equal(sceneTimingForShot({}, null, duration).shotIndex, -1);
  assert.equal(sceneTimingForShot(scene, { id: 'x' }, duration).durationSec, 0);
});

test('[director-032] The zero duration gives finite progress', () => {
  const s = { shots: [{ id: 'z' }] };
  assert.deepEqual(
    sceneTimingForShot(s, s.shots[0], () => 0),
    {
      shotIndex: 0,
      totalSec: 0,
      durationSec: 0,
      startElapsedSec: 0,
      endElapsedSec: 0,
      startProgress: 0,
      endProgress: 1,
      durationProgress: 0,
    },
  );
});

test('[director-032] The zero total bounds endProgress', () => {
  const s = { shots: [{ id: 'z' }] };
  assert.equal(sceneTimingForShot(s, s.shots[0], () => 0).endProgress, 1);
});

test('[director-032] The zero total bounds durationProgress', () => {
  const s = { shots: [{ id: 'z' }] };
  assert.equal(sceneTimingForShot(s, s.shots[0], () => 0).durationProgress, 0);
});

test('[director-033] The camera uses its sole source', () => {
  const pose = { ...camera(20, 350), lat: '10' };
  assert.equal(cameraAtProgress(pose, null, 0.5).lat, 10);
});

test('[director-033] The camera uses its sole target', () => {
  const pose = { ...camera(24, 10), lat: '10' };
  assert.equal(cameraAtProgress(null, pose, 0.5).lat, 10);
});

test('[director-033] The camera returns null without endpoints', () => {
  assert.equal(cameraAtProgress(null, null, 0.5), null);
  assert.equal(cameraAtProgress(undefined, undefined, 0), null);
});

test('[director-033] The camera bounds numeric progress', () => {
  assert.equal(cameraAtProgress(camera(20, 0), camera(24, 0), 'bad').lon, 20);
  assert.equal(cameraAtProgress(camera(20, 0), camera(24, 0), -1).lon, 20);
  assert.equal(cameraAtProgress(camera(20, 0), camera(24, 0), 2).lon, 24);
});

test('[director-033] The camera uses both cubic halves', () => {
  assert.equal(
    cameraAtProgress(camera(20, 350), camera(24, 10), 0.25).lon,
    20.25,
  );
  assert.equal(
    cameraAtProgress(camera(20, 350), camera(24, 10), 0.75).lon,
    23.75,
  );
});

test('[director-033] The camera gives a zero start angle for invalid text', () => {
  const a = camera(20, 0);
  a.heading = 'bad';
  a.roll = 'bad';
  assert.equal(cameraAtProgress(a, camera(24, 10), 0.5).heading, 5);
  assert.equal(cameraAtProgress(a, camera(24, 10), 0.5).roll, 0);
});

test('[director-034] The seek uses only the first time boundary', () => {
  const s = {
    shots: [
      { id: 'a', durationSec: 2, camera: camera(0, 0) },
      { id: 'b', durationSec: 2, camera: camera(4, 0) },
    ],
  };
  assert.equal(
    sceneSeekState(
      s,
      0.25,
      () => 2,
      () => 0,
    ).shotIndex,
    0,
  );
});

test('[director-034] The seek chooses the final shot at the end', () => {
  assert.equal(sceneSeekState(scene, 1, duration, hold).shotIndex, 1);
  assert.equal(sceneSeekState(scene, 1, duration, hold).shotElapsedSec, 7);
});

test('[director-034] The seek defaults an absent flight time', () => {
  const s = { shots: [{ id: 'a', camera: camera(0, 0) }] };
  assert.equal(
    sceneSeekState(
      s,
      0.5,
      () => 4,
      () => 0,
    ).flightDurationSec,
    4,
  );
});

test('[director-034] The seek uses authored flight time', () => {
  assert.equal(sceneSeekState(scene, 0, duration, hold).flightDurationSec, 2);
});

test('[director-032] The seek gives null without shots', () => {
  assert.equal(sceneSeekState(null, 0, duration, hold), null);
  assert.equal(sceneSeekState({}, 0, duration, hold), null);
  assert.equal(sceneSeekState({ shots: [] }, 0, duration, hold), null);
});

test('[director-032] The seek bounds zero scene time', () => {
  const s = { shots: [{ id: 'a', durationSec: 2, camera: camera(0, 0) }] };
  assert.equal(
    sceneSeekState(
      s,
      1,
      () => 0,
      () => 0,
    ).sceneProgress,
    0,
  );
  assert.equal(
    sceneSeekState(
      s,
      1,
      () => 0,
      () => 0,
    ).holdProgress,
    1,
  );
});

test('[director-034] The seek converts invalid progress to zero', () => {
  assert.equal(sceneSeekState(scene, 'bad', duration, hold).sceneElapsedSec, 0);
});

test('[director-034] The seek bounds the hold fraction', () => {
  assert.equal(sceneSeekState(scene, 0.8, duration, hold).holdProgress, 1 / 3);
  const s = { shots: [{ id: 'a', durationSec: 2, camera: camera(0, 0) }] };
  assert.equal(
    sceneSeekState(
      s,
      0.5,
      () => 2,
      () => 0,
    ).holdProgress,
    1,
  );
});

test('[director-035] The seek uses the previous ordinary camera', () => {
  assert.equal(sceneSeekState(scene, 0.5, duration, hold).camera.lon, 22);
});

test('[director-035] The seek uses the first ordinary camera', () => {
  let reads = 0;
  const s = {
    shots: [
      {
        id: 'a',
        durationSec: 4,
        get camera() {
          return camera(++reads === 1 ? 20 : 24, 0);
        },
      },
    ],
  };
  assert.equal(
    sceneSeekState(
      s,
      0.25,
      () => 4,
      () => 0,
    ).camera.lon,
    23.75,
  );
});

test('[director-035] The seek samples an explicit move', () => {
  const s = {
    shots: [
      {
        id: 'm',
        durationSec: 4,
        camera: {
          lat: 0,
          lon: 20,
          alt: 100,
          heading: 0,
          pitch: 0,
          roll: 0,
          altitudeReference: 'ellipsoid',
        },
        move: {
          from: {
            lat: 0,
            lon: 0,
            alt: 100,
            heading: 0,
            pitch: 0,
            roll: 0,
            altitudeReference: 'ellipsoid',
          },
          easing: 'linear',
        },
      },
    ],
  };
  assert.equal(
    sceneSeekState(
      s,
      0.25,
      () => 4,
      () => 0,
    ).camera.lon,
    5,
  );
});

test('[director-033] The camera guard handles a falsy endpoint', () => {
  assert.equal(cameraAtProgress(0, null, 0), null);
});

test('[director-033] The camera guard returns null for falsy endpoints', () => {
  for (const a of [null, undefined, 0, false, '', NaN])
    for (const b of [null, undefined, 0, false, '', NaN])
      assert.equal(cameraAtProgress(a, b, 0), null);
});
