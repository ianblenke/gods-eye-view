import * as Cesium from 'cesium';
import { t } from './i18n/index.js';

export const START_VIEW = {
  longitude: 120.6485,
  latitude: 24.18,
  heightM: 217,
  headingDeg: 0,
  pitchDeg: -35,
  rollDeg: 0,
};

/**
 * Set camera to Austin on load with a cinematic fly-in.
 * @returns {Function} Cancels the pending or active startup flight.
 */
export function flyToAustin(viewer) {
  // Start from a high altitude, then fly down
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-97.7431, 30.2672, 25000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0.0,
    },
  });

  // Cinematic fly-in after a brief pause
  const timer = setTimeout(() => {
    if (viewer.isDestroyed()) return;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-97.7431, 30.2672, 600),
      orientation: {
        heading: Cesium.Math.toRadians(15),
        pitch: Cesium.Math.toRadians(-30),
        roll: 0.0,
      },
      duration: 4.0,
      easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
    });
  }, 500);
  return () => {
    clearTimeout(timer);
    if (!viewer.isDestroyed()) viewer.camera.cancelFlight();
  };
}

/** Start a camera flight above Taiwan and return its cancel function. */
export function flyToStartView(viewer) {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      START_VIEW.longitude,
      START_VIEW.latitude,
      25000,
    ),
    orientation: {
      heading: Cesium.Math.toRadians(START_VIEW.headingDeg),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(START_VIEW.rollDeg),
    },
  });

  const timer = setTimeout(() => {
    if (viewer.isDestroyed()) return;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        START_VIEW.longitude,
        START_VIEW.latitude,
        START_VIEW.heightM,
      ),
      orientation: {
        heading: Cesium.Math.toRadians(START_VIEW.headingDeg),
        pitch: Cesium.Math.toRadians(START_VIEW.pitchDeg),
        roll: Cesium.Math.toRadians(START_VIEW.rollDeg),
      },
      duration: 4.0,
      easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
    });
  }, 500);
  return () => {
    clearTimeout(timer);
    if (!viewer.isDestroyed()) viewer.camera.cancelFlight();
  };
}

/** Set the start view and loader text for the application. */
export function startApplicationView({
  viewer,
  hasShareState,
  loaderStatus,
  defer,
}) {
  if (!hasShareState) {
    loaderStatus.textContent = t('Flying to Taiwan...');
    defer(flyToStartView(viewer));
  } else {
    loaderStatus.textContent = t('Restoring shared view...');
  }
}
