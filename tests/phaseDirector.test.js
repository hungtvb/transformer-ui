import test from 'node:test';
import assert from 'node:assert/strict';

import { PHASE } from '../src/experienceState.js';
import { createPhaseDirector } from '../src/phaseDirector.js';

function createClassList() {
  const values = new Set();
  return {
    add: (...items) => items.forEach((item) => values.add(item)),
    remove: (...items) => items.forEach((item) => values.delete(item)),
    toggle: (item, force) => force ? values.add(item) : values.delete(item),
    has: (item) => values.has(item),
  };
}

function createHarness() {
  const calls = [];
  const timeline = {
    to() { return timeline; },
    set() { return timeline; },
  };
  const ui = {
    phase: { textContent: '' }, status: { textContent: '' }, entity: { textContent: '' },
    missions: Array.from({ length: 5 }, () => ({ classList: createClassList() })),
    station: { setAttribute() {} }, calibration: { remove() {} },
    radar: { classList: createClassList() }, acknowledge: { disabled: false },
    responseLabel: { textContent: '' },
  };
  const director = createPhaseDirector({
    ui,
    audio: { tone: (...args) => calls.push(['tone', ...args]) },
    effects: {
      timeline: () => timeline,
      flash: () => calls.push(['flash']),
      delayedCall: (delay, callback) => calls.push(['delay', delay, callback]),
      to: (...args) => calls.push(['to', ...args]),
    },
    entity: { position: {} }, arm: { rotation: {} }, head: { rotation: {} }, eyeLight: {},
    body: { dataset: {}, classList: createClassList() },
    onAdvance: (phase, source) => calls.push(['advance', phase, source]),
  });
  return { director, ui, calls };
}

test('applies presentation before phase effects', () => {
  const { director, ui } = createHarness();
  director.enter({ current: PHASE.RADAR_TRACKING });
  assert.equal(ui.phase.textContent, '03 // TRACK CONTACT');
  assert.equal(ui.status.textContent, 'ALIGN RETICLE');
  assert.equal(ui.missions[2].classList.has('active'), true);
});

test('schedules automatic signal tuning transition', () => {
  const { director, calls } = createHarness();
  director.enter({ current: PHASE.POWER_RESTORED });
  const delayed = calls.find(([name]) => name === 'delay');
  assert.equal(delayed[1], 0.65);
  delayed[2]();
  assert.deepEqual(calls.at(-1), ['advance', PHASE.SIGNAL_TUNING, 'power-transition-complete']);
});

test('updates terminal response state', () => {
  const { director, ui } = createHarness();
  director.enter({ current: PHASE.CONTACT_ACKNOWLEDGED });
  assert.equal(ui.acknowledge.disabled, true);
  assert.equal(ui.responseLabel.textContent, 'THE RESPONSE WAS DELIBERATE');
});
