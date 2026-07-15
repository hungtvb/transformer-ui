import { PHASE } from './experienceState.js';

const PRESENTATION = Object.freeze({
  [PHASE.CALIBRATION]: Object.freeze({ mission: null, phase: null, status: null, entity: null }),
  [PHASE.POWER_OFF]: Object.freeze({ mission: 0, phase: '01 // RESTORE POWER', status: 'NO POWER', entity: 'UNKNOWN' }),
  [PHASE.POWER_RESTORED]: Object.freeze({ mission: 0, phase: '02 // TUNE SIGNAL', status: 'CARRIER DETECTED', entity: 'UNKNOWN' }),
  [PHASE.SIGNAL_TUNING]: Object.freeze({ mission: 1, phase: '02 // TUNE SIGNAL', status: 'CARRIER DETECTED', entity: 'UNKNOWN' }),
  [PHASE.SIGNAL_LOCKED]: Object.freeze({ mission: 1, phase: '03 // TRACK CONTACT', status: 'OBJECT MOVING', entity: 'UNRESOLVED' }),
  [PHASE.RADAR_TRACKING]: Object.freeze({ mission: 2, phase: '03 // TRACK CONTACT', status: 'ALIGN RETICLE', entity: 'UNRESOLVED' }),
  [PHASE.VISUAL_CONTACT]: Object.freeze({ mission: 3, phase: '04 // FIRST CONTACT', status: 'APPROACHING GLASS', entity: 'LIVING' }),
  [PHASE.HAND_SYNC]: Object.freeze({ mission: 3, phase: '04 // FIRST CONTACT', status: 'PLACE HAND ON INTERFACE', entity: 'LIVING' }),
  [PHASE.CONTACT_ACKNOWLEDGED]: Object.freeze({ mission: 4, phase: '05 // CONTACT', status: 'IT ACKNOWLEDGED YOU', entity: 'LIVING' }),
});

export function getPhasePresentation(phase) {
  const presentation = PRESENTATION[phase];
  if (!presentation) throw new Error(`Unknown phase presentation: ${phase}`);
  return presentation;
}

export function applyPhasePresentation({ phase, ui }) {
  const presentation = getPhasePresentation(phase);

  if (presentation.phase != null) ui.phase.textContent = presentation.phase;
  if (presentation.status != null) ui.status.textContent = presentation.status;
  if (presentation.entity != null) ui.entity.textContent = presentation.entity;

  if (presentation.mission != null) {
    ui.missions.forEach((mission, index) => mission.classList.toggle('active', index === presentation.mission));
  }

  return presentation;
}
