import { isContactReady } from './contactState.js';

const body = document.body;
const pad = document.querySelector('.contact-pad');
const acknowledge = document.querySelector('.acknowledge');
const missions = [...document.querySelectorAll('.mission')];
const status = document.querySelector('.status');
const phaseLabel = document.querySelector('.phase');
const responseLabel = document.querySelector('.response-mission p');

if (pad && acknowledge) {
  let timer = null;
  let progress = 0;
  let synchronized = false;

  const setMission = (index) => {
    missions.forEach((mission, missionIndex) => mission.classList.toggle('active', missionIndex === index));
  };

  const hasSynchronized = () => synchronized || body.classList.contains('synchronized');

  const resetHold = () => {
    clearInterval(timer);
    timer = null;
    if (hasSynchronized()) return;
    progress = 0;
    document.documentElement.style.setProperty('--contact', '0');
    pad.querySelector('span').textContent = 'PLACE HAND HERE';
  };

  const completeContact = () => {
    clearInterval(timer);
    timer = null;
    synchronized = true;
    progress = 100;
    document.documentElement.style.setProperty('--contact', '100');
    body.classList.add('synchronized');
    phaseLabel.textContent = '05 // CONTACT';
    status.textContent = 'SYNCHRONIZED';
    pad.querySelector('span').textContent = 'CONTACT ESTABLISHED';
    setMission(4);
    document.dispatchEvent(new CustomEvent('project-titan:contact-synchronized', {
      detail: { source: 'fallback' },
    }));
  };

  const startHold = (event) => {
    if (body.dataset.phase !== 'HAND_SYNC' || hasSynchronized() || timer) return;
    event.preventDefault();
    progress = 0;
    timer = window.setInterval(() => {
      progress = Math.min(100, progress + 5);
      document.documentElement.style.setProperty('--contact', String(progress));
      pad.querySelector('span').textContent = `SYNCHRONIZING ${progress}%`;
      if (progress >= 100) completeContact();
    }, 45);
  };

  if ('PointerEvent' in window) {
    pad.addEventListener('pointerdown', startHold, { capture: true });
    pad.addEventListener('pointerup', resetHold, { capture: true });
    pad.addEventListener('pointercancel', resetHold, { capture: true });
  } else {
    pad.addEventListener('touchstart', startHold, { capture: true, passive: false });
    pad.addEventListener('touchend', resetHold, { capture: true });
    pad.addEventListener('touchcancel', resetHold, { capture: true });
  }

  const syncPhaseUi = () => {
    if (body.dataset.phase === 'VISUAL_CONTACT') {
      setMission(3);
      pad.disabled = true;
      status.textContent = 'APPROACHING GLASS';
    }
    if (body.dataset.phase === 'HAND_SYNC') {
      setMission(3);
      pad.disabled = false;
      status.textContent = 'PLACE HAND ON INTERFACE';
    }
  };

  new MutationObserver(syncPhaseUi).observe(body, {
    attributes: true,
    attributeFilter: ['data-phase'],
  });
  syncPhaseUi();

  acknowledge.addEventListener('click', (event) => {
    const ready = isContactReady({
      phase: body.dataset.phase,
      runtimeSynchronized: synchronized,
      bodySynchronized: body.classList.contains('synchronized'),
    });
    if (!ready) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    synchronized = true;
    acknowledge.disabled = true;
    acknowledge.textContent = 'CONTACT ACKNOWLEDGED';
    body.dataset.phase = 'CONTACT_ACKNOWLEDGED';
    body.classList.add('contact-acknowledged');
    phaseLabel.textContent = '05 // CONTACT';
    status.textContent = 'IT ACKNOWLEDGED YOU';
    responseLabel.textContent = 'THE RESPONSE WAS DELIBERATE';
    setMission(4);
    document.dispatchEvent(new CustomEvent('project-titan:contact-acknowledged', {
      detail: { source: 'fallback-bridge' },
    }));
  }, { capture: true });
}
