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

  const resetHold = () => {
    clearInterval(timer);
    timer = null;
    if (synchronized) return;
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
  };

  const startHold = (event) => {
    if (body.dataset.phase !== 'HAND_SYNC' || synchronized || timer) return;
    event.preventDefault();
    progress = 0;
    pad.setPointerCapture?.(event.pointerId);
    timer = window.setInterval(() => {
      progress = Math.min(100, progress + 5);
      document.documentElement.style.setProperty('--contact', String(progress));
      pad.querySelector('span').textContent = `SYNCHRONIZING ${progress}%`;
      if (progress >= 100) completeContact();
    }, 45);
  };

  pad.addEventListener('pointerdown', startHold, { capture: true });
  pad.addEventListener('touchstart', startHold, { capture: true, passive: false });
  pad.addEventListener('pointerup', resetHold, { capture: true });
  pad.addEventListener('pointercancel', resetHold, { capture: true });
  pad.addEventListener('touchend', resetHold, { capture: true });

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

  acknowledge.addEventListener('click', () => {
    if (!synchronized) return;
    acknowledge.disabled = true;
    body.classList.add('contact-acknowledged');
    status.textContent = 'IT ACKNOWLEDGED YOU';
    responseLabel.textContent = 'THE RESPONSE WAS DELIBERATE';
  }, { capture: true });
}
