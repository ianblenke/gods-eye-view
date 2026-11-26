import { t } from './i18n/index.js';
import { toRadians } from './geo/index.js';
import { cameraOf } from './render/rendererOf.js';

/**
 * The view the renderer starts from: the whole planet, looking straight
 * down, centred where Cesium's default view rectangle is.
 */
export const START_VIEW = Object.freeze({
  lon: -82.5,
  lat: 35,
  height: 23000000,
});

/**
 * Put the camera at a start view without a flight. A host may pass a city
 * (`{ lon, lat, height, heading?, pitch? }`, angles in degrees) instead of
 * the planet.
 */
export function applyStartView(viewer, view = START_VIEW) {
  const { lon, lat, height, heading = 0, pitch = -90 } = view;
  cameraOf(viewer).setView({
    destination: { lon, lat, height },
    orientation: {
      heading: toRadians(heading),
      pitch: toRadians(pitch),
      roll: 0,
    },
  });
}

/** The pose of the application start: a street view above Taiwan. */
export const TAIWAN_VIEW = Object.freeze({
  lon: 120.6485,
  lat: 24.18,
  height: 217,
  heading: 0,
  pitch: -35,
});

/** Start a camera flight above Taiwan and return its cancel function. */
export function flyToStartView(viewer) {
  const camera = cameraOf(viewer);
  const { lon, lat, height, heading, pitch } = TAIWAN_VIEW;
  applyStartView(viewer, { lon, lat, height: 25000 });

  const timer = setTimeout(() => {
    if (viewer.isDestroyed?.()) return;
    camera.flyTo(
      { lon, lat, height },
      {
        orientation: {
          heading: toRadians(heading),
          pitch: toRadians(pitch),
          roll: 0,
        },
        durationS: 4.0,
        easing: 'cubicInOut',
      },
    );
  }, 500);
  return () => {
    clearTimeout(timer);
    if (!viewer.isDestroyed?.()) camera.cancelFlight();
  };
}

/**
 * Set the start view and the loader text for the application. With share
 * state, set only the loader text. If not, and with `opening`, put the camera
 * at Taiwan at once. The opening (src/app/openingIntro.js) ends where the
 * camera stands, and a flight moves the camera during the opening.
 */
export function startApplicationView({
  viewer,
  hasShareState,
  loaderStatus,
  defer,
  opening = false,
}) {
  if (hasShareState) {
    loaderStatus.textContent = t('Restoring shared view...');
    return;
  }
  loaderStatus.textContent = t('Flying to Taiwan...');
  if (opening) applyStartView(viewer, TAIWAN_VIEW);
  else defer(flyToStartView(viewer));
}
