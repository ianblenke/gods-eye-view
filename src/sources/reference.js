import { createUsgsEarthquakeSource } from '../layers/earthquakes/source.js';
import { createReticulumSource } from '../layers/reticulum/source.js';
import { createBeemapsSource } from '../layers/beemaps/source.js';
import { createBeemapsBurstSource } from '../layers/beemapsBursts/source.js';
import { createEcccAirQualitySource } from '../layers/airQuality/source.js';
import { createWfigsPerimeterSource } from '../layers/perimeters/source.js';
import { createDroneAirspaceSource } from '../layers/droneAirspace/source.js';
import { createBundledCableSource } from '../layers/submarineCables/bundledSource.js';
import { createAdsbGnssSource } from '../layers/gnss/source.js';
import { createGdacsSource } from '../layers/gdacs/source.js';
import { createSkywatchSource } from '../layers/skywatchScenes/source.js';
import { createUp42Source } from '../layers/up42Scenes/source.js';
import { createSceneSource } from '../layers/sceneLayer/source.js';
import { createWildlifeSightingsSource } from '../layers/wildlifeSightings/source.js';

/** Construct the existing reference feeds independently of application setup. */
export function createReferenceSources() {
  return {
    earthquakes: createUsgsEarthquakeSource(),
    'air-quality': createEcccAirQualitySource(),
    'fire-perimeters': createWfigsPerimeterSource(),
    'drone-airspace': createDroneAirspaceSource(),
    'wildlife-sightings': createWildlifeSightingsSource(),
    cables: createBundledCableSource(),
    reticulum: createReticulumSource(),
    beemaps: createBeemapsSource(),
    'beemaps-bursts': createBeemapsBurstSource(),
    'gnss-integrity': createAdsbGnssSource(),
    gdacs: createGdacsSource(),
    'skywatch-scenes': createSkywatchSource(),
    'planet-scenes': createSceneSource('planet'),
    'skyfi-scenes': createSceneSource('skyfi'),
    'up42-scenes': createUp42Source(),
  };
}
