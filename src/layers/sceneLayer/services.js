/** The values of the two services that the scene layers show. Nothing in this file sends a request. */

const SKYFI_NAMES = Object.freeze({
  VANTOR: 'Vantor',
  SENTINEL1_CREODIAS: 'Sentinel-1',
  SENTINEL2_CREODIAS: 'Sentinel-2',
  PLANET: 'Planet',
});

export const SERVICES = Object.freeze({
  planet: Object.freeze({
    layer: 'planet-scenes',
    name: 'Planet Scenes',
    icon: '🪐',
    // i18n-ignore: product name
    label: 'Planet',
    list: 'Planet scenes',
    key: 'PLANET_API_KEY',
    thumbs: 'PLANET_THUMBNAILS',
    route: '/api/planet',
    names: Object.freeze({}),
    spaces: false,
  }),
  skyfi: Object.freeze({
    layer: 'skyfi-scenes',
    name: 'SkyFi Scenes',
    icon: '🛰',
    // i18n-ignore: product name
    label: 'SkyFi',
    list: 'SkyFi scenes',
    key: 'SKYFI_API_KEY',
    thumbs: 'SKYFI_THUMBNAILS',
    route: '/api/skyfi',
    names: SKYFI_NAMES,
    spaces: true,
  }),
});

/** The values of a service, or a TypeError for a name that is not "planet" or "skyfi". */
export function serviceOf(service) {
  if (!Object.hasOwn(SERVICES, service)) {
    throw new TypeError('The service must be "planet" or "skyfi"');
  }
  return SERVICES[service];
}
