import { PHASE } from './experienceState.js';
import { applyPhasePresentation } from './phasePresentation.js';

export function createPhaseDirector({
  ui,
  audio,
  effects,
  entity,
  arm,
  head,
  eyeLight,
  body = document.body,
  onAdvance,
}) {
  if (typeof onAdvance !== 'function') throw new TypeError('Phase director requires onAdvance');

  const enter = ({ current }) => {
    body.dataset.phase = current;
    applyPhasePresentation({ phase: current, ui });

    switch (current) {
      case PHASE.POWER_OFF:
        ui.station.setAttribute('aria-hidden', 'false');
        effects.timeline()
          .to('.calibration>*', { opacity: 0, y: -20, stagger: 0.04, duration: 0.35 })
          .to(ui.calibration, { opacity: 0, duration: 0.55, onComplete: () => ui.calibration.remove() }, 0.15)
          .set(ui.station, { visibility: 'visible' }, 0.2)
          .to(ui.station, { opacity: 1, duration: 0.65 }, 0.25);
        audio.tone(42, 1.2, 0.08, 'sawtooth');
        break;
      case PHASE.POWER_RESTORED:
        body.classList.add('powered');
        audio.tone(95, 0.9, 0.1, 'sawtooth');
        effects.flash();
        effects.delayedCall(0.65, () => onAdvance(PHASE.SIGNAL_TUNING, 'power-transition-complete'));
        break;
      case PHASE.SIGNAL_LOCKED:
        body.classList.add('locked');
        audio.tone(46, 1.8, 0.12, 'sawtooth');
        effects.flash();
        effects.delayedCall(0.75, () => onAdvance(PHASE.RADAR_TRACKING, 'signal-transition-complete'));
        break;
      case PHASE.VISUAL_CONTACT: {
        let revealFinished = false;
        const finishReveal = () => {
          if (revealFinished) return;
          revealFinished = true;
          body.classList.remove('contact-reveal');
          body.classList.add('contact-present');
          onAdvance(PHASE.HAND_SYNC, 'entity-approach-complete');
        };

        ui.radar.classList.remove('acquiring');
        ui.contactPad.disabled = true;
        body.classList.add('tracked', 'contact', 'contact-reveal');
        audio.tone(38, 2.4, 0.14, 'sawtooth');
        effects.flash();
        effects.delayedCall(3.5, finishReveal);
        effects.timeline({ onComplete: finishReveal })
          .to(eyeLight, { intensity: 0, duration: 0.12 }, 0)
          .to(entity.position, { x: 2.7, z: -18.5, duration: 1.15, ease: 'power2.in' }, 0)
          .to(entity.rotation, { y: -0.08, duration: 1.15, ease: 'power2.in' }, 0)
          .to(eyeLight, { intensity: 18, duration: 0.08 }, 0.72)
          .to(eyeLight, { intensity: 2, duration: 0.09 }, 0.84)
          .to(eyeLight, { intensity: 26, duration: 0.12 }, 0.96)
          .to(entity.position, { x: 1.6, z: -13.8, duration: 1.55, ease: 'power3.out' }, 1.08)
          .to(entity.rotation, { y: 0, duration: 1.4, ease: 'power2.out' }, 1.08)
          .to(head.rotation, { x: 0.09, y: -0.14, duration: 0.75, ease: 'power2.inOut' }, 1.3)
          .to(head.rotation, { x: 0, y: 0, duration: 1.1, ease: 'power2.out' }, 2.05)
          .to(arm.rotation, { z: -0.1, x: -0.32, duration: 2.1, ease: 'power3.inOut' }, 1.02);
        break;
      }
      case PHASE.HAND_SYNC:
        ui.contactPad.disabled = false;
        body.classList.add('contact-ready');
        effects.to(eyeLight, { intensity: 13, duration: 0.8, ease: 'power2.out' });
        audio.tone(112, 0.45, 0.035, 'sine');
        break;
      case PHASE.CONTACT_ACKNOWLEDGED:
        ui.acknowledge.disabled = true;
        body.classList.add('contact-acknowledged');
        audio.tone(82, 1.5, 0.09, 'sine');
        effects.timeline()
          .to(head.rotation, { y: -0.2, x: 0.06, duration: 0.55 })
          .to(head.rotation, { y: 0, x: 0, duration: 0.8, ease: 'power2.out' });
        effects.to(eyeLight, { intensity: 32, duration: 0.35, yoyo: true, repeat: 1 });
        ui.responseLabel.textContent = 'THE RESPONSE WAS DELIBERATE';
        break;
      default:
        break;
    }
  };

  return Object.freeze({ enter });
}
