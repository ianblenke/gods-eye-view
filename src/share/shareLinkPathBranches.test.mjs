import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSharePath } from './shareLinkPath.js';

test('[share-codec-045] a share path with a bad percent escape keeps the code as it is written', () => {
  assert.deepEqual(parseSharePath('/share/AQ%E0%A4%A'), { code: 'AQ%E0%A4%A', basePath: '/' });
  assert.deepEqual(parseSharePath('/share/AQ%41'), { code: 'AQA', basePath: '/' });
});
