import test from 'node:test';
import assert from 'node:assert/strict';
import { damp, getEntityLookTarget, projectEntityToRadar, sampleEntityPatrol } from './entityWorld.js';

test('patrol produces a bounded moving world position', () => {
  const start = sampleEntityPatrol(0);
  const later = sampleEntityPatrol(4);
  assert.notDeepEqual(start, later);
  assert.ok(Math.abs(later.x) <= 6.5);
  assert.ok(later.z >= -30 && later.z <= -19);
});

test('radar projection stays inside the usable radar area', () => {
  assert.deepEqual(projectEntityToRadar({ x: -99, z: -99 }), { x: 8, y: 8 });
  assert.deepEqual(projectEntityToRadar({ x: 99, z: 99 }), { x: 92, y: 92 });
});

test('look target clamps extreme pointer input', () => {
  assert.deepEqual(getEntityLookTarget({ pointerX: 5, pointerY: -5 }), { yaw: 0.22, pitch: 0.1 });
});

test('damp approaches the target without overshooting', () => {
  const value = damp(0, 10, 3, 0.1);
  assert.ok(value > 0 && value < 10);
});
