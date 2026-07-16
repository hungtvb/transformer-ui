const UINT32_RANGE = 0x1_0000_0000;

function hashString(value) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function normalizeSeed(seed) {
  const normalized = typeof seed === 'number'
    ? seed >>> 0
    : hashString(String(seed));

  // Xorshift32 cannot use zero as its internal state.
  return normalized === 0 ? 0x6d2b79f5 : normalized;
}

export class SeededRng {
  #state;

  constructor(seed = 1) {
    this.#state = normalizeSeed(seed);
  }

  nextUint32() {
    let value = this.#state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.#state = value >>> 0;
    return this.#state;
  }

  next() {
    return this.nextUint32() / UINT32_RANGE;
  }

  int(min, max) {
    if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
      throw new RangeError('SeededRng.int requires integer bounds with max >= min.');
    }
    return min + Math.floor(this.next() * (max - min + 1));
  }

  chance(probability) {
    if (!Number.isFinite(probability) || probability < 0 || probability > 1) {
      throw new RangeError('SeededRng.chance requires a probability between 0 and 1.');
    }
    return this.next() < probability;
  }

  pick(items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new RangeError('SeededRng.pick requires a non-empty array.');
    }
    return items[this.int(0, items.length - 1)];
  }

  snapshot() {
    return this.#state;
  }

  restore(state) {
    this.#state = normalizeSeed(state);
  }
}

export function createSeededRng(seed) {
  return new SeededRng(seed);
}
