import { createApplicationControls } from '../app/controls.js';
import { getStandaloneCatalog } from './catalog.js';
import { StyleManager } from '../ui/composition.js';
export function createStandaloneControls(options) {
  return createApplicationControls({
    catalog: options?.catalog ?? getStandaloneCatalog(),
    Controls: StyleManager,
    ...options,
  });
}
