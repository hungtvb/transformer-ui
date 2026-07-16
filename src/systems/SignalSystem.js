import { cloneGameState, SYSTEM_MODE } from '../game/GameState.js';

export const SIGNAL_COMMAND = Object.freeze({
  SET_TUNING: 'SET_SIGNAL_TUNING',
});

export const SIGNAL_EVENT = Object.freeze({
  CHANGED: 'SIGNAL_CHANGED',
  LOCKED: 'SIGNAL_LOCKED',
});

export const SIGNAL_DEFAULTS = Object.freeze({
  target: 73,
  baseFrequency: 118.7,
  frequencyStep: 1.37,
  lockFalloff: 3.2,
  lockThreshold: 97,
});

function clampTuning(value) {
  if (!Number.isFinite(value)) {
    throw new TypeError('Signal tuning must be a finite number.');
  }
  return Math.max(0, Math.min(100, value));
}

function calculateSignal(position, config) {
  const distance = Math.abs(position - config.target);
  return {
    frequency: config.baseFrequency + position * config.frequencyStep,
    quality: Math.max(0, Math.min(100, 100 - distance * config.lockFalloff)),
  };
}

export function createSignalSystem(options = {}) {
  const config = Object.freeze({ ...SIGNAL_DEFAULTS, ...options });
  if (config.lockThreshold < 0 || config.lockThreshold > 100) {
    throw new RangeError('Signal lock threshold must be between 0 and 100.');
  }

  return Object.freeze({
    id: 'signal',

    reduce(state, command, { emit }) {
      if (command.type !== SIGNAL_COMMAND.SET_TUNING) return state;

      const position = clampTuning(command.value);
      const previousPosition = state.systems.communication.tuning?.position;
      if (position === previousPosition) return state;

      const { frequency, quality } = calculateSignal(position, config);
      const next = cloneGameState(state);
      next.resources.signal = quality;
      next.systems.communication.mode = state.flags.signalLocked || quality > config.lockThreshold
        ? SYSTEM_MODE.NOMINAL
        : quality > 0
          ? SYSTEM_MODE.LOW
          : SYSTEM_MODE.OFF;
      next.systems.communication.tuning = {
        position,
        target: config.target,
        frequency,
        quality,
      };

      emit(SIGNAL_EVENT.CHANGED, {
        position,
        frequency,
        quality,
        source: command.source ?? 'unknown',
      });
      return next;
    },

    update(state, _stepMs, { emit }) {
      if (state.flags.signalLocked || state.resources.signal <= config.lockThreshold) {
        return state;
      }

      const next = cloneGameState(state);
      next.flags.signalLocked = true;
      next.systems.communication.mode = SYSTEM_MODE.NOMINAL;
      emit(SIGNAL_EVENT.LOCKED, {
        quality: state.resources.signal,
        frequency: state.systems.communication.tuning?.frequency ?? null,
      });
      return next;
    },
  });
}
