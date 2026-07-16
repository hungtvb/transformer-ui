import { cloneGameState, SYSTEM_MODE } from '../game/GameState.js';

export const POWER_COMMAND = Object.freeze({
  SET_OUTPUT: 'SET_POWER_OUTPUT',
});

export const POWER_EVENT = Object.freeze({
  CHANGED: 'POWER_CHANGED',
  RESTORED: 'POWER_RESTORED',
});

export const POWER_RESTORED_THRESHOLD = 96;

function clampPower(value) {
  if (!Number.isFinite(value)) {
    throw new TypeError('Power output must be a finite number.');
  }
  return Math.max(0, Math.min(100, value));
}

function getGeneratorMode(power) {
  if (power >= POWER_RESTORED_THRESHOLD) return SYSTEM_MODE.NOMINAL;
  if (power > 0) return SYSTEM_MODE.LOW;
  return SYSTEM_MODE.OFF;
}

export function createPowerSystem() {
  return Object.freeze({
    id: 'power',

    reduce(state, command, { emit }) {
      if (command.type !== POWER_COMMAND.SET_OUTPUT) return state;

      const previousPower = state.resources.power;
      const power = clampPower(command.value);
      if (power === previousPower) return state;

      const next = cloneGameState(state);
      next.resources.power = power;
      next.systems.generator.allocation = power;
      next.systems.generator.mode = getGeneratorMode(power);

      emit(POWER_EVENT.CHANGED, {
        previous: previousPower,
        value: power,
        source: command.source ?? 'unknown',
      });

      return next;
    },

    update(state, _stepMs, { emit }) {
      if (state.flags.powerRestored || state.resources.power < POWER_RESTORED_THRESHOLD) {
        return state;
      }

      const next = cloneGameState(state);
      next.flags.powerRestored = true;
      emit(POWER_EVENT.RESTORED, { value: state.resources.power });
      return next;
    },
  });
}
