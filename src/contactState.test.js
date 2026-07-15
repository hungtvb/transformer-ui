import test from 'node:test';
import assert from 'node:assert/strict';
import { isContactReady, markContactSynchronized } from './contactState.js';

test('acknowledgement is allowed when fallback synchronized the contact', () => {
  assert.equal(isContactReady({
    phase: 'HAND_SYNC',
    runtimeSynchronized: false,
    bodySynchronized: true,
  }), true);
});

test('acknowledgement remains blocked before hand sync', () => {
  assert.equal(isContactReady({
    phase: 'VISUAL_CONTACT',
    runtimeSynchronized: true,
    bodySynchronized: true,
  }), false);
});

test('markContactSynchronized updates runtime and DOM state together', () => {
  const state = { contactSynchronized: false };
  const classes = new Set();
  const body = { classList: { add: (name) => classes.add(name) } };

  markContactSynchronized(state, body);

  assert.equal(state.contactSynchronized, true);
  assert.equal(classes.has('synchronized'), true);
});
