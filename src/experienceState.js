export const PHASE = Object.freeze({
  CALIBRATION: 'CALIBRATION',
  POWER_OFF: 'POWER_OFF',
  POWER_RESTORED: 'POWER_RESTORED',
  SIGNAL_TUNING: 'SIGNAL_TUNING',
  SIGNAL_LOCKED: 'SIGNAL_LOCKED',
  RADAR_TRACKING: 'RADAR_TRACKING',
  VISUAL_CONTACT: 'VISUAL_CONTACT',
  HAND_SYNC: 'HAND_SYNC',
  CONTACT_ACKNOWLEDGED: 'CONTACT_ACKNOWLEDGED',
});

const ALLOWED_TRANSITIONS = Object.freeze({
  [PHASE.CALIBRATION]: [PHASE.POWER_OFF],
  [PHASE.POWER_OFF]: [PHASE.POWER_RESTORED],
  [PHASE.POWER_RESTORED]: [PHASE.SIGNAL_TUNING],
  [PHASE.SIGNAL_TUNING]: [PHASE.SIGNAL_LOCKED],
  [PHASE.SIGNAL_LOCKED]: [PHASE.RADAR_TRACKING],
  [PHASE.RADAR_TRACKING]: [PHASE.VISUAL_CONTACT],
  [PHASE.VISUAL_CONTACT]: [PHASE.HAND_SYNC],
  [PHASE.HAND_SYNC]: [PHASE.CONTACT_ACKNOWLEDGED],
  [PHASE.CONTACT_ACKNOWLEDGED]: [],
});

export function createExperienceStateMachine({ initial = PHASE.CALIBRATION, onTransition } = {}) {
  if (!Object.values(PHASE).includes(initial)) {
    throw new Error(`Unknown initial experience phase: ${initial}`);
  }

  let current = initial;
  const history = [initial];

  return Object.freeze({
    get current() {
      return current;
    },

    get history() {
      return [...history];
    },

    is(...phases) {
      return phases.includes(current);
    },

    canTransition(next) {
      return ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;
    },

    transition(next, metadata = {}) {
      if (next === current) return false;
      if (!this.canTransition(next)) {
        console.warn(`[PROJECT TITAN] Rejected transition ${current} -> ${next}`, metadata);
        return false;
      }

      const previous = current;
      current = next;
      history.push(next);
      onTransition?.({ previous, current, metadata, history: [...history] });
      return true;
    },
  });
}
