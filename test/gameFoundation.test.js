import test from 'node:test';
import assert from 'node:assert/strict';

import { GameClock } from '../src/game/GameClock.js';
import { createGameEngine } from '../src/game/GameEngine.js';
import { createInitialGameState, validateGameState } from '../src/game/GameState.js';
import { createSeededRng } from '../src/game/Rng.js';

test('initial GameState is isolated, valid, and JSON-serializable', () => {
  const first = createInitialGameState({ seed: 'alpha' });
  const second = createInitialGameState({ seed: 'alpha' });

  first.resources.hull = 42;
  first.systems.radar.faultIds.push('fault-1');

  assert.equal(second.resources.hull, 100);
  assert.deepEqual(second.systems.radar.faultIds, []);
  assert.doesNotThrow(() => validateGameState(second));
  assert.deepEqual(JSON.parse(JSON.stringify(second)), second);
});

test('seeded RNG produces repeatable sequences without Math.random', () => {
  const first = createSeededRng('relay-07');
  const second = createSeededRng('relay-07');
  const sequence = (rng) => Array.from({ length: 8 }, () => rng.int(3, 9));

  assert.deepEqual(sequence(first), sequence(second));
  assert.ok(sequence(createSeededRng('range-check')).every((value) => value >= 3 && value <= 9));
});

test('GameClock advances fixed steps, pauses, and drops runaway frame time', () => {
  const clock = new GameClock({ fixedStepMs: 20, maxFrameMs: 100, maxStepsPerAdvance: 3 });
  const steps = [];

  assert.deepEqual(clock.advance(55, (step) => steps.push(step)), {
    steps: 2,
    alpha: 0.75,
    droppedMs: 0,
  });
  clock.pause();
  assert.equal(clock.advance(100, (step) => steps.push(step)).steps, 0);
  clock.resume();

  const result = clock.advance(200, (step) => steps.push(step));
  assert.equal(result.steps, 3);
  assert.equal(result.droppedMs, 140);
  assert.deepEqual(steps, [20, 20, 20, 20, 20]);
});

test('headless GameEngine processes commands deterministically and emits events', () => {
  const powerSystem = {
    id: 'power',
    reduce(state, command, { emit }) {
      if (command.type !== 'ALLOCATE_POWER') return state;
      const next = structuredClone(state);
      next.resources.power = Math.max(0, Math.min(100, command.value));
      emit('POWER_CHANGED', { value: next.resources.power });
      return next;
    },
  };
  const options = {
    seed: 'same-run',
    clockOptions: { fixedStepMs: 20, maxFrameMs: 100, maxStepsPerAdvance: 5 },
    systems: [powerSystem],
  };
  const first = createGameEngine(options);
  const second = createGameEngine(options);

  for (const engine of [first, second]) {
    engine.dispatch({ type: 'ALLOCATE_POWER', value: 72 });
    engine.advance(20);
  }

  assert.deepEqual(first.snapshot(), second.snapshot());
  assert.deepEqual(first.drainEvents(), second.drainEvents());
  assert.equal(first.snapshot().resources.power, 72);
});

test('engine snapshots cannot mutate canonical state', () => {
  const engine = createGameEngine({ seed: 7 });
  const snapshot = engine.snapshot();
  snapshot.resources.hull = 0;
  snapshot.faults.push({ id: 'fake' });

  assert.equal(engine.snapshot().resources.hull, 100);
  assert.deepEqual(engine.snapshot().faults, []);
});
