import test from 'node:test';
import assert from 'node:assert/strict';

import { PHASE, createExperienceStateMachine } from '../src/experienceState.js';

const EXPECTED_FLOW = [
  PHASE.CALIBRATION,
  PHASE.POWER_OFF,
  PHASE.POWER_RESTORED,
  PHASE.SIGNAL_TUNING,
  PHASE.SIGNAL_LOCKED,
  PHASE.RADAR_TRACKING,
  PHASE.VISUAL_CONTACT,
  PHASE.HAND_SYNC,
  PHASE.CONTACT_ACKNOWLEDGED,
];

test('starts in calibration by default', () => {
  const machine = createExperienceStateMachine();

  assert.equal(machine.current, PHASE.CALIBRATION);
  assert.deepEqual(machine.history, [PHASE.CALIBRATION]);
});

test('completes the canonical experience flow in order', () => {
  const transitions = [];
  const machine = createExperienceStateMachine({
    onTransition: (event) => transitions.push(event),
  });

  for (const next of EXPECTED_FLOW.slice(1)) {
    assert.equal(machine.canTransition(next), true);
    assert.equal(machine.transition(next, { source: 'test' }), true);
  }

  assert.equal(machine.current, PHASE.CONTACT_ACKNOWLEDGED);
  assert.deepEqual(machine.history, EXPECTED_FLOW);
  assert.equal(transitions.length, EXPECTED_FLOW.length - 1);
  assert.deepEqual(transitions.at(-1), {
    previous: PHASE.HAND_SYNC,
    current: PHASE.CONTACT_ACKNOWLEDGED,
    metadata: { source: 'test' },
    history: EXPECTED_FLOW,
  });
});

test('rejects skipped, reversed, and duplicate transitions without mutating history', () => {
  const machine = createExperienceStateMachine();
  const originalWarn = console.warn;
  console.warn = () => {};

  try {
    assert.equal(machine.transition(PHASE.SIGNAL_TUNING), false);
    assert.equal(machine.transition(PHASE.CALIBRATION), false);
    assert.equal(machine.current, PHASE.CALIBRATION);
    assert.deepEqual(machine.history, [PHASE.CALIBRATION]);

    assert.equal(machine.transition(PHASE.POWER_OFF), true);
    assert.equal(machine.transition(PHASE.POWER_OFF), false);
    assert.equal(machine.transition(PHASE.CALIBRATION), false);
    assert.deepEqual(machine.history, [PHASE.CALIBRATION, PHASE.POWER_OFF]);
  } finally {
    console.warn = originalWarn;
  }
});

test('returns defensive history copies', () => {
  const machine = createExperienceStateMachine();
  const history = machine.history;

  history.push('CORRUPTED');

  assert.deepEqual(machine.history, [PHASE.CALIBRATION]);
});

test('supports a valid explicit initial phase', () => {
  const machine = createExperienceStateMachine({ initial: PHASE.RADAR_TRACKING });

  assert.equal(machine.current, PHASE.RADAR_TRACKING);
  assert.equal(machine.canTransition(PHASE.VISUAL_CONTACT), true);
});

test('throws for an unknown initial phase', () => {
  assert.throws(
    () => createExperienceStateMachine({ initial: 'UNKNOWN' }),
    /Unknown initial experience phase/,
  );
});

test('terminal phase cannot transition further', () => {
  const machine = createExperienceStateMachine({ initial: PHASE.CONTACT_ACKNOWLEDGED });
  const originalWarn = console.warn;
  console.warn = () => {};

  try {
    assert.equal(machine.canTransition(PHASE.CALIBRATION), false);
    assert.equal(machine.transition(PHASE.CALIBRATION), false);
    assert.deepEqual(machine.history, [PHASE.CONTACT_ACKNOWLEDGED]);
  } finally {
    console.warn = originalWarn;
  }
});
