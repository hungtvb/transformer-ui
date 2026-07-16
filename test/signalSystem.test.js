import test from 'node:test';
import assert from 'node:assert/strict';

import { createGameEngine } from '../src/game/GameEngine.js';
import { SYSTEM_MODE } from '../src/game/GameState.js';
import {
  createSignalSystem,
  SIGNAL_COMMAND,
  SIGNAL_EVENT,
} from '../src/systems/SignalSystem.js';

function createSignalEngine() {
  return createGameEngine({
    seed: 'signal-test',
    clockOptions: { fixedStepMs: 20, maxFrameMs: 100, maxStepsPerAdvance: 5 },
    systems: [createSignalSystem()],
  });
}

test('SignalSystem calculates canonical frequency and lock quality', () => {
  const engine = createSignalEngine();
  engine.dispatch({ type: SIGNAL_COMMAND.SET_TUNING, value: 70, source: 'test' });
  engine.advance(20);

  const state = engine.snapshot();
  assert.equal(state.resources.signal, 90.4);
  assert.equal(state.systems.communication.tuning.position, 70);
  assert.ok(Math.abs(state.systems.communication.tuning.frequency - 214.6) < 1e-9);
  assert.equal(state.systems.communication.mode, SYSTEM_MODE.LOW);
});

test('SignalSystem clamps tuning input and emits presentation data', () => {
  const engine = createSignalEngine();
  engine.dispatch({ type: SIGNAL_COMMAND.SET_TUNING, value: 140, source: 'keyboard' });
  engine.advance(20);

  const [changed] = engine.drainEvents();
  assert.equal(changed.type, SIGNAL_EVENT.CHANGED);
  assert.equal(changed.payload.position, 100);
  assert.equal(changed.payload.source, 'keyboard');
  assert.ok(Math.abs(engine.snapshot().resources.signal - 13.6) < 1e-9);
});

test('SignalSystem locks once after the final value crosses the threshold', () => {
  const engine = createSignalEngine();
  engine.dispatch({ type: SIGNAL_COMMAND.SET_TUNING, value: 72.5 });
  engine.advance(20);
  engine.dispatch({ type: SIGNAL_COMMAND.SET_TUNING, value: 73 });
  engine.advance(20);
  engine.dispatch({ type: SIGNAL_COMMAND.SET_TUNING, value: 73.2 });
  engine.advance(20);

  const events = engine.drainEvents();
  assert.equal(events.filter(({ type }) => type === SIGNAL_EVENT.LOCKED).length, 1);
  assert.equal(engine.snapshot().flags.signalLocked, true);
  assert.equal(engine.snapshot().systems.communication.mode, SYSTEM_MODE.NOMINAL);
});

test('SignalSystem does not lock on a transient threshold crossing in one tick', () => {
  const engine = createSignalEngine();
  engine.dispatch({ type: SIGNAL_COMMAND.SET_TUNING, value: 73 });
  engine.dispatch({ type: SIGNAL_COMMAND.SET_TUNING, value: 60 });
  engine.advance(20);

  assert.equal(engine.snapshot().flags.signalLocked, undefined);
  assert.equal(
    engine.drainEvents().filter(({ type }) => type === SIGNAL_EVENT.LOCKED).length,
    0,
  );
});
