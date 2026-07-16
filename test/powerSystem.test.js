import test from 'node:test';
import assert from 'node:assert/strict';

import { createGameEngine } from '../src/game/GameEngine.js';
import { SYSTEM_MODE } from '../src/game/GameState.js';
import {
  createPowerSystem,
  POWER_COMMAND,
  POWER_EVENT,
} from '../src/systems/PowerSystem.js';

function createPowerEngine() {
  return createGameEngine({
    seed: 'power-test',
    clockOptions: { fixedStepMs: 20, maxFrameMs: 100, maxStepsPerAdvance: 5 },
    systems: [createPowerSystem()],
  });
}

test('PowerSystem owns and clamps canonical power state', () => {
  const engine = createPowerEngine();
  engine.dispatch({ type: POWER_COMMAND.SET_OUTPUT, value: 140, source: 'test' });
  engine.advance(20);

  const state = engine.snapshot();
  assert.equal(state.resources.power, 100);
  assert.equal(state.systems.generator.allocation, 100);
  assert.equal(state.systems.generator.mode, SYSTEM_MODE.NOMINAL);
});

test('PowerSystem emits changed and restored once when crossing the threshold', () => {
  const engine = createPowerEngine();

  engine.dispatch({ type: POWER_COMMAND.SET_OUTPUT, value: 95 });
  engine.advance(20);
  engine.dispatch({ type: POWER_COMMAND.SET_OUTPUT, value: 96 });
  engine.advance(20);
  engine.dispatch({ type: POWER_COMMAND.SET_OUTPUT, value: 100 });
  engine.advance(20);

  const events = engine.drainEvents();
  assert.equal(events.filter(({ type }) => type === POWER_EVENT.CHANGED).length, 3);
  assert.equal(events.filter(({ type }) => type === POWER_EVENT.RESTORED).length, 1);
});

test('PowerSystem ignores unrelated commands and repeated values', () => {
  const engine = createPowerEngine();
  engine.dispatch({ type: 'UNRELATED' });
  engine.dispatch({ type: POWER_COMMAND.SET_OUTPUT, value: 0 });
  engine.advance(20);

  assert.equal(engine.snapshot().resources.power, 0);
  assert.deepEqual(engine.drainEvents(), []);
});

test('PowerSystem evaluates restoration from the final value of a simulation tick', () => {
  const engine = createPowerEngine();
  engine.dispatch({ type: POWER_COMMAND.SET_OUTPUT, value: 97 });
  engine.dispatch({ type: POWER_COMMAND.SET_OUTPUT, value: 40 });
  engine.advance(20);

  assert.equal(engine.snapshot().resources.power, 40);
  assert.equal(engine.snapshot().flags.powerRestored, undefined);
  assert.equal(
    engine.drainEvents().filter(({ type }) => type === POWER_EVENT.RESTORED).length,
    0,
  );
});
