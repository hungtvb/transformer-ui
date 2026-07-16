import { GameClock } from './GameClock.js';
import { cloneGameState, createInitialGameState, validateGameState } from './GameState.js';
import { createSeededRng } from './Rng.js';

function validateCommand(command) {
  if (!command || typeof command !== 'object' || Array.isArray(command)) {
    throw new TypeError('A game command must be an object.');
  }
  if (typeof command.type !== 'string' || command.type.length === 0) {
    throw new TypeError('A game command requires a non-empty type.');
  }
}

function validateSystem(system) {
  if (!system || typeof system.id !== 'string' || system.id.length === 0) {
    throw new TypeError('A game system requires a non-empty id.');
  }
  if (system.reduce !== undefined && typeof system.reduce !== 'function') {
    throw new TypeError(`Game system ${system.id}.reduce must be a function.`);
  }
  if (system.update !== undefined && typeof system.update !== 'function') {
    throw new TypeError(`Game system ${system.id}.update must be a function.`);
  }
}

export class GameEngine {
  #clock;
  #commandQueue = [];
  #eventSequence = 0;
  #events = [];
  #listeners = new Set();
  #rng;
  #state;
  #systems = [];

  constructor({ initialState, seed = 1, clockOptions, systems = [] } = {}) {
    this.#state = cloneGameState(initialState ?? createInitialGameState({ seed }));
    validateGameState(this.#state);
    this.#rng = createSeededRng(this.#state.seed);
    this.#clock = new GameClock(clockOptions);
    systems.forEach((system) => this.registerSystem(system));
  }

  registerSystem(system) {
    validateSystem(system);
    if (this.#systems.some((candidate) => candidate.id === system.id)) {
      throw new Error(`Game system already registered: ${system.id}`);
    }
    this.#systems.push(system);
    return () => {
      this.#systems = this.#systems.filter((candidate) => candidate !== system);
    };
  }

  dispatch(command) {
    validateCommand(command);
    this.#commandQueue.push(Object.freeze({ ...command }));
  }

  advance(deltaMs) {
    return this.#clock.advance(deltaMs, (stepMs) => this.#step(stepMs));
  }

  #step(stepMs) {
    const context = this.#createContext();
    const commands = this.#commandQueue.splice(0);

    for (const command of commands) {
      for (const system of this.#systems) {
        if (!system.reduce) continue;
        const nextState = system.reduce(this.#state, command, context);
        if (nextState !== undefined) this.#state = nextState;
      }
    }

    for (const system of this.#systems) {
      if (!system.update) continue;
      const nextState = system.update(this.#state, stepMs, context);
      if (nextState !== undefined) this.#state = nextState;
    }

    this.#state.elapsedMs += stepMs;
    validateGameState(this.#state);
  }

  #createContext() {
    return Object.freeze({
      emit: (type, payload = {}) => this.#emit(type, payload),
      rng: this.#rng,
    });
  }

  #emit(type, payload) {
    if (typeof type !== 'string' || type.length === 0) {
      throw new TypeError('A domain event requires a non-empty type.');
    }
    const event = Object.freeze({
      id: `${this.#state.runId}:${++this.#eventSequence}`,
      type,
      atMs: this.#state.elapsedMs,
      payload: cloneGameState(payload),
    });
    this.#events.push(event);
    this.#listeners.forEach((listener) => listener(event));
    return event;
  }

  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('GameEngine.subscribe requires a listener function.');
    }
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  drainEvents() {
    return this.#events.splice(0);
  }

  pause() {
    this.#clock.pause();
  }

  resume() {
    this.#clock.resume();
  }

  snapshot() {
    return cloneGameState(this.#state);
  }

  diagnostics() {
    return {
      clock: this.#clock.snapshot(),
      queuedCommands: this.#commandQueue.length,
      rngState: this.#rng.snapshot(),
      systems: this.#systems.map(({ id }) => id),
    };
  }
}

export function createGameEngine(options) {
  return new GameEngine(options);
}
