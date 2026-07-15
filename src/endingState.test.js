import test from 'node:test';
import assert from 'node:assert/strict';
import { createExperienceStateMachine, PHASE } from './experienceState.js';
import { getPhasePresentation } from './phasePresentation.js';

test('contact acknowledgement advances through the cinematic ending sequence', () => {
  const transitions = [];
  const machine = createExperienceStateMachine({
    initial: PHASE.HAND_SYNC,
    onTransition: ({ current }) => transitions.push(current),
  });

  assert.equal(machine.transition(PHASE.CONTACT_ACKNOWLEDGED), true);
  assert.equal(machine.transition(PHASE.ENTITY_RETREAT), true);
  assert.equal(machine.transition(PHASE.SIGNAL_LOST), true);
  assert.equal(machine.transition(PHASE.TRANSMISSION_ARCHIVED), true);

  assert.deepEqual(transitions, [
    PHASE.CONTACT_ACKNOWLEDGED,
    PHASE.ENTITY_RETREAT,
    PHASE.SIGNAL_LOST,
    PHASE.TRANSMISSION_ARCHIVED,
  ]);
  assert.equal(machine.current, PHASE.TRANSMISSION_ARCHIVED);
});

test('ending phases expose distinct terminal presentation', () => {
  assert.deepEqual(getPhasePresentation(PHASE.ENTITY_RETREAT), {
    mission: 4,
    phase: '06 // WITHDRAWAL',
    status: 'ENTITY WITHDRAWING',
    entity: 'MOVING',
  });

  assert.deepEqual(getPhasePresentation(PHASE.SIGNAL_LOST), {
    mission: 4,
    phase: '07 // SIGNAL LOST',
    status: 'NO RETURN',
    entity: 'LOST',
  });

  assert.deepEqual(getPhasePresentation(PHASE.TRANSMISSION_ARCHIVED), {
    mission: 4,
    phase: '08 // ARCHIVED',
    status: 'TRANSMISSION SEALED',
    entity: 'UNKNOWN',
  });
});

test('archived transmission is terminal', () => {
  const machine = createExperienceStateMachine({ initial: PHASE.TRANSMISSION_ARCHIVED });
  assert.equal(machine.canTransition(PHASE.POWER_OFF), false);
  assert.equal(machine.transition(PHASE.POWER_OFF), false);
});
