import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveCameraPose,
  resolveCameraMove,
  sampleCameraMove,
} from './camera.js';
const from = () => ({
  lat: 10,
  lon: 179,
  alt: 400,
  heading: 350,
  pitch: -40,
  roll: 350,
});
const to = () => ({
  lat: 12,
  lon: -179,
  alt: 800,
  heading: 10,
  pitch: 0,
  roll: 10,
});
const move = (easing = 'linear') => ({ from: from(), to: to(), easing });

test('[director-041] The absent camera returns null', () => {
  assert.equal(resolveCameraPose({}, null), null);
});

test('[director-041] The absent move returns null', () => {
  assert.equal(resolveCameraMove({}, {}), null);
  assert.equal(resolveCameraMove({}, null), null);
});

test('[director-042] The inline pose copies each field', () => {
  const p = from();
  assert.deepEqual(resolveCameraPose({}, p), {
    lat: 10,
    lon: 179,
    alt: 400,
    heading: 350,
    pitch: -40,
    roll: 350,
  });
  assert.notEqual(resolveCameraPose({}, p), p);
});

test('[director-043] The anchor supplies the position', () => {
  assert.deepEqual(
    resolveCameraPose(
      {
        anchors: [
          { id: 'other', lat: 99 },
          { id: 'a', lat: 1, lon: 2, alt: 3 },
        ],
      },
      { anchorId: 'a', heading: 15, pitch: 0, roll: 7 },
    ),
    { lat: 1, lon: 2, alt: 3, heading: 15, pitch: 0, roll: 7 },
  );
});

test('[director-043] The unknown anchor rejects the pose', () => {
  assert.throws(
    () => resolveCameraPose({ anchors: [] }, { anchorId: 'a' }),
    /Camera anchor is unavailable/,
  );
});

test('[director-043] The pose rejects an absent scene', () => {
  assert.throws(
    () => resolveCameraPose(null, { anchorId: 'a' }),
    /Camera anchor is unavailable/,
  );
});

test('[director-043] The pose rejects an absent anchor list', () => {
  assert.throws(
    () => resolveCameraPose({}, { anchorId: 'a' }),
    /Camera anchor is unavailable/,
  );
});

test('[director-044] The absent heading uses its default', () => {
  assert.equal(resolveCameraPose({}, { lat: 1, lon: 2, alt: 3 }).heading, 0);
});

test('[director-044] The inline heading keeps zero', () => {
  assert.equal(resolveCameraPose({}, { heading: 0 }).heading, 0);
});

test('[director-044] The absent pitch uses its default', () => {
  assert.equal(resolveCameraPose({}, { lat: 1, lon: 2, alt: 3 }).pitch, -35);
});

test('[director-044] The inline pitch keeps zero', () => {
  assert.equal(resolveCameraPose({}, { pitch: 0 }).pitch, 0);
});

test('[director-044] The absent roll uses its default', () => {
  assert.equal(resolveCameraPose({}, { lat: 1, lon: 2, alt: 3 }).roll, 0);
});

test('[director-044] The inline roll keeps zero', () => {
  assert.equal(resolveCameraPose({}, { roll: 0 }).roll, 0);
});

test('[director-045] The move keeps both poses and time', () => {
  assert.deepEqual(
    resolveCameraMove(
      {},
      {
        move: { from: from(), easing: 'linear' },
        camera: to(),
        durationSec: 4,
      },
    ),
    {
      from: {
        lat: 10,
        lon: 179,
        alt: 400,
        heading: 350,
        pitch: -40,
        roll: 350,
      },
      to: { lat: 12, lon: -179, alt: 800, heading: 10, pitch: 0, roll: 10 },
      easing: 'linear',
      durationSec: 4,
    },
  );
});

test('[director-046] The progress accepts the lower bound', () => {
  const m = move();
  const sampled = sampleCameraMove(m, -1);
  assert.deepEqual(sampled, {
    lat: 10,
    lon: 179,
    alt: 400,
    heading: 350,
    pitch: -40,
    roll: 350,
  });
  assert.notEqual(sampled, m.from);
});

test('[director-046] The progress accepts the upper bound', () => {
  const m = move();
  const sampled = sampleCameraMove(m, 2);
  assert.deepEqual(sampled, {
    lat: 12,
    lon: -179,
    alt: 800,
    heading: 10,
    pitch: 0,
    roll: 10,
  });
  assert.notEqual(sampled, m.to);
});

test('[director-046] The progress accepts the invalid text', () => {
  assert.equal(sampleCameraMove(move(), 'bad').lat, 10);
});

test('[director-046] The progress accepts the numeric text', () => {
  assert.equal(sampleCameraMove(move(), '0.5').lat, 11);
});

test('[director-046] The endpoint 0 returns an exact copy', () => {
  const m = move();
  const result = sampleCameraMove(m, 0);
  assert.deepEqual(result, {
    lat: 10,
    lon: 179,
    alt: 400,
    heading: 350,
    pitch: -40,
    roll: 350,
  });
  assert.notEqual(result, m.from);
});

test('[director-046] The endpoint 1 returns an exact copy', () => {
  const m = move();
  const result = sampleCameraMove(m, 1);
  assert.deepEqual(result, {
    lat: 12,
    lon: -179,
    alt: 800,
    heading: 10,
    pitch: 0,
    roll: 10,
  });
  assert.notEqual(result, m.to);
});

test('[director-047] The linear sample sets lat', () => {
  assert.equal(sampleCameraMove(move(), 0.5).lat, 11);
});

test('[director-047] The linear sample sets lon', () => {
  assert.equal(sampleCameraMove(move(), 0.5).lon, -180);
});

test('[director-047] The linear sample sets alt', () => {
  assert.equal(sampleCameraMove(move(), 0.5).alt, 600);
});

test('[director-047] The linear sample sets heading', () => {
  assert.equal(sampleCameraMove(move(), 0.5).heading, 360);
});

test('[director-047] The linear sample sets pitch', () => {
  assert.equal(sampleCameraMove(move(), 0.5).pitch, -20);
});

test('[director-047] The linear sample sets roll', () => {
  assert.equal(sampleCameraMove(move(), 0.5).roll, 360);
});

test('[director-047] The angle tie takes the negative arc', () => {
  const m = move();
  m.from.heading = 0;
  m.to.heading = 180;
  assert.equal(sampleCameraMove(m, 0.5).heading, -90);
});

test('[director-048] The cubic sample uses the first half', () => {
  assert.deepEqual(sampleCameraMove(move('cubic-in-out'), 0.25), {
    lat: 10.125,
    lon: 179.125,
    alt: 425,
    heading: 351.25,
    pitch: -37.5,
    roll: 351.25,
  });
});

test('[director-048] The cubic sample uses the second half', () => {
  assert.deepEqual(sampleCameraMove(move('cubic-in-out'), 0.75), {
    lat: 11.875,
    lon: -179.125,
    alt: 775,
    heading: 368.75,
    pitch: -2.5,
    roll: 368.75,
  });
});

test('[director-047] The linear curve uses its supplied fraction', () => {
  assert.equal(sampleCameraMove(move(), 0.25).lat, 10.5);
});

test('[director-048] The cubic sample uses progress 0.45', () => {
  assert.equal(sampleCameraMove(move('cubic-in-out'), 0.45).lat, 10.729);
});

test('[director-047] The westward sample crosses the date line', () => {
  const m = {
    from: { lat: 0, lon: -179, alt: 0, heading: 350, pitch: 0, roll: 350 },
    to: { lat: 0, lon: 179, alt: 0, heading: -350, pitch: 0, roll: -350 },
    easing: 'linear',
  };
  assert.deepEqual(sampleCameraMove(m, 0.75), {
    lat: 0,
    lon: 179.5,
    alt: 0,
    heading: 365,
    pitch: 0,
    roll: 365,
  });
});

test('[director-044] The heading keeps negative zero from a getter', () => {
  let reads = 0;
  const camera = {
    get heading() {
      reads++;
      return -0;
    },
  };
  assert.equal(Object.is(resolveCameraPose({}, camera).heading, -0), true);
  assert.equal(reads, 1);
});

test('[director-044] The roll keeps negative zero from a getter', () => {
  let reads = 0;
  const camera = {
    get roll() {
      reads++;
      return -0;
    },
  };
  assert.equal(Object.is(resolveCameraPose({}, camera).roll, -0), true);
  assert.equal(reads, 1);
});

test('[director-048] The cubic sample uses progress 0.55', () => {
  assert.equal(sampleCameraMove(move('cubic-in-out'), 0.55).lat, 11.271);
});
