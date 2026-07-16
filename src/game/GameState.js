import { normalizeSeed } from './Rng.js';

export const GAME_STATE_SCHEMA_VERSION = 1;

export const GAME_STATUS = Object.freeze({
  BOOT: 'BOOT',
  CALIBRATION: 'CALIBRATION',
  RUNNING: 'RUNNING',
  PAUSED: 'PAUSED',
  FINAL_CHOICE: 'FINAL_CHOICE',
  ENDING: 'ENDING',
  GAME_OVER: 'GAME_OVER',
});

export const GAME_ACT = Object.freeze({
  PROLOGUE: 'PROLOGUE',
  AWAKENING: 'ACT_1_AWAKENING',
  HUNT: 'ACT_2_HUNT',
  SIEGE: 'ACT_3_SIEGE',
  FINALE: 'FINALE',
});

export const SYSTEM_MODE = Object.freeze({
  OFF: 'OFF',
  LOW: 'LOW',
  NOMINAL: 'NOMINAL',
  BOOST: 'BOOST',
});

function createSystemState(mode = SYSTEM_MODE.OFF) {
  return {
    mode,
    health: 100,
    allocation: 0,
    faultIds: [],
  };
}

export function cloneGameState(state) {
  return JSON.parse(JSON.stringify(state));
}

export function createInitialGameState({ seed = 1, runId } = {}) {
  const normalizedSeed = normalizeSeed(seed);
  return {
    schemaVersion: GAME_STATE_SCHEMA_VERSION,
    runId: runId ?? `run-${normalizedSeed.toString(16).padStart(8, '0')}`,
    seed: normalizedSeed,
    status: GAME_STATUS.BOOT,
    previousStatus: null,
    act: GAME_ACT.PROLOGUE,
    elapsedMs: 0,
    resources: {
      power: 0,
      hull: 100,
      signal: 0,
      trust: 0,
      threat: 0,
    },
    systems: {
      generator: createSystemState(SYSTEM_MODE.LOW),
      lifeSupport: createSystemState(SYSTEM_MODE.LOW),
      radar: createSystemState(),
      communication: createSystemState(),
      shield: createSystemState(),
      repair: createSystemState(),
    },
    mission: {
      id: 'first-contact',
      objectiveIds: [],
      activeEncounterId: null,
    },
    contacts: {},
    faults: [],
    flags: {},
    history: [],
  };
}

export function validateGameState(state) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) {
    throw new TypeError('GameState must be an object.');
  }
  if (state.schemaVersion !== GAME_STATE_SCHEMA_VERSION) {
    throw new RangeError(`Unsupported GameState schema version: ${state.schemaVersion}`);
  }
  if (!Object.values(GAME_STATUS).includes(state.status)) {
    throw new RangeError(`Invalid game status: ${state.status}`);
  }
  if (!Object.values(GAME_ACT).includes(state.act)) {
    throw new RangeError(`Invalid game act: ${state.act}`);
  }
  if (!Number.isFinite(state.elapsedMs) || state.elapsedMs < 0) {
    throw new RangeError('GameState.elapsedMs must be a non-negative number.');
  }

  const ranges = {
    power: [0, 100],
    hull: [0, 100],
    signal: [0, 100],
    trust: [-100, 100],
    threat: [0, 100],
  };
  for (const [resource, [min, max]] of Object.entries(ranges)) {
    const value = state.resources?.[resource];
    if (!Number.isFinite(value) || value < min || value > max) {
      throw new RangeError(`GameState.resources.${resource} must be between ${min} and ${max}.`);
    }
  }

  try {
    JSON.stringify(state);
  } catch (error) {
    throw new TypeError(`GameState must be JSON-serializable: ${error.message}`);
  }
  return state;
}
