const DEFAULT_FIXED_STEP_MS = 1000 / 30;

export class GameClock {
  #accumulatorMs = 0;
  #elapsedMs = 0;
  #paused = false;

  constructor({
    fixedStepMs = DEFAULT_FIXED_STEP_MS,
    maxFrameMs = 250,
    maxStepsPerAdvance = 8,
  } = {}) {
    if (!Number.isFinite(fixedStepMs) || fixedStepMs <= 0) {
      throw new RangeError('GameClock.fixedStepMs must be greater than zero.');
    }
    if (!Number.isFinite(maxFrameMs) || maxFrameMs < fixedStepMs) {
      throw new RangeError('GameClock.maxFrameMs must be at least one fixed step.');
    }
    if (!Number.isInteger(maxStepsPerAdvance) || maxStepsPerAdvance < 1) {
      throw new RangeError('GameClock.maxStepsPerAdvance must be a positive integer.');
    }
    this.fixedStepMs = fixedStepMs;
    this.maxFrameMs = maxFrameMs;
    this.maxStepsPerAdvance = maxStepsPerAdvance;
  }

  advance(deltaMs, onStep) {
    if (!Number.isFinite(deltaMs) || deltaMs < 0) {
      throw new RangeError('GameClock.advance requires a non-negative delta.');
    }
    if (typeof onStep !== 'function') {
      throw new TypeError('GameClock.advance requires an onStep callback.');
    }
    if (this.#paused) {
      return { steps: 0, alpha: this.#accumulatorMs / this.fixedStepMs, droppedMs: 0 };
    }

    const acceptedDeltaMs = Math.min(deltaMs, this.maxFrameMs);
    let droppedMs = Math.max(0, deltaMs - acceptedDeltaMs);
    this.#accumulatorMs += acceptedDeltaMs;
    let steps = 0;

    while (this.#accumulatorMs >= this.fixedStepMs && steps < this.maxStepsPerAdvance) {
      onStep(this.fixedStepMs);
      this.#accumulatorMs -= this.fixedStepMs;
      this.#elapsedMs += this.fixedStepMs;
      steps += 1;
    }

    if (this.#accumulatorMs >= this.fixedStepMs) {
      const overflow = this.#accumulatorMs - (this.#accumulatorMs % this.fixedStepMs);
      this.#accumulatorMs -= overflow;
      droppedMs += overflow;
    }

    return {
      steps,
      alpha: this.#accumulatorMs / this.fixedStepMs,
      droppedMs,
    };
  }

  pause() {
    this.#paused = true;
  }

  resume() {
    this.#paused = false;
  }

  reset() {
    this.#accumulatorMs = 0;
    this.#elapsedMs = 0;
    this.#paused = false;
  }

  snapshot() {
    return {
      fixedStepMs: this.fixedStepMs,
      elapsedMs: this.#elapsedMs,
      accumulatorMs: this.#accumulatorMs,
      paused: this.#paused,
    };
  }
}
