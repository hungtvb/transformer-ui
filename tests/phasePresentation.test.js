import test from 'node:test';
import assert from 'node:assert/strict';

import { PHASE } from '../src/experienceState.js';
import { getPhasePresentation } from '../src/phasePresentation.js';

test('every experience phase has a presentation contract', () => {
  for (const phase of Object.values(PHASE)) {
    const presentation = getPhasePresentation(phase);
    assert.ok(Object.hasOwn(presentation, 'mission'));
    assert.ok(Object.hasOwn(presentation, 'phase'));
    assert.ok(Object.hasOwn(presentation, 'status'));
    assert.ok(Object.hasOwn(presentation, 'entity'));
  }
});

test('interactive phases point at the expected mission panels', () => {
  assert.equal(getPhasePresentation(PHASE.POWER_OFF).mission, 0);
  assert.equal(getPhasePresentation(PHASE.SIGNAL_TUNING).mission, 1);
  assert.equal(getPhasePresentation(PHASE.RADAR_TRACKING).mission, 2);
  assert.equal(getPhasePresentation(PHASE.HAND_SYNC).mission, 3);
  assert.equal(getPhasePresentation(PHASE.CONTACT_ACKNOWLEDGED).mission, 4);
});

test('tracking presentation communicates the actionable instruction', () => {
  assert.deepEqual(getPhasePresentation(PHASE.RADAR_TRACKING), {
    mission: 2,
    phase: '03 // TRACK CONTACT',
    status: 'ALIGN RETICLE',
    entity: 'UNRESOLVED',
  });
});

test('unknown phases are rejected', () => {
  assert.throws(() => getPhasePresentation('UNKNOWN'), /Unknown phase presentation/);
});
