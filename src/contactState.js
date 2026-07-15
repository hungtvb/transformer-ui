export function isContactReady({ phase, runtimeSynchronized, bodySynchronized }) {
  return phase === 'HAND_SYNC' && (runtimeSynchronized || bodySynchronized);
}

export function markContactSynchronized(state, body) {
  state.contactSynchronized = true;
  body.classList.add('synchronized');
  return state;
}
