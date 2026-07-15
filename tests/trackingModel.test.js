import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TRACKING_CONFIG,
  advanceTrackingQuality,
  getTrackingProximity,
} from '../src/trackingModel.js';

test('treats contacts inside the capture radius as trackable', () => {
  assert.equal(getTrackingProximity(0), 1);
  assert.ok(getTrackingProximity(TRACKING_CONFIG.captureRadius / 2) > 0);
  assert.equal(getTrackingProximity(TRACKING_CONFIG.captureRadius), 0);
  assert.equal(getTrackingProximity(TRACKING_CONFIG.captureRadius + 1), 0);
});

test('builds lock while the target remains inside the reticle', () => {
  let quality = 0;

  for (let frame = 0; frame < 120; frame += 1) {
    quality = advanceTrackingQuality(quality, 5, 1 / 60);
  }

  assert.equal(quality, 100);
});

test('brief tracking mistakes decay gradually instead of resetting progress', () => {
  const acquired = advanceTrackingQuality(60, 4, 0.5);
  const afterMiss = advanceTrackingQuality(acquired, 30, 0.5);

  assert.ok(acquired > 60);
  assert.ok(afterMiss < acquired);
  assert.ok(afterMiss > 40);
});

test('clamps malformed and extreme values safely', () => {
  assert.equal(advanceTrackingQuality(200, 0, 1), 100);
  assert.equal(advanceTrackingQuality(-20, 100, 1), 0);
  assert.equal(advanceTrackingQuality(Number.NaN, Number.NaN, Number.NaN), 0);
});
