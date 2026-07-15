import './style.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { createAudioController } from './audioController.js';
import { createEffectsController } from './effectsController.js';
import { createExperienceStateMachine, PHASE } from './experienceState.js';
import { createInputController } from './inputController.js';

const mobile = innerWidth < 760;
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.1 : 1.6));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .72;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050605);
scene.fog = new THREE.FogExp2(0x050605, .055);
const camera = new THREE.PerspectiveCamera(46, innerWidth / innerHeight, .1, 120);
camera.position.set(0, 1.2, 11);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), mobile ? .35 : .55, .7, .2);
composer.addPass(bloom);

const audio = createAudioController();
const effects = createEffectsController({ bloom, mobile });
const input = createInputController();

const mat = {
  wall: new THREE.MeshStandardMaterial({ color: 0x101410, metalness: .78, roughness: .62 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x303a33, metalness: .92, roughness: .32 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x040604, metalness: .88, roughness: .5 }),
  screen: new THREE.MeshBasicMaterial({ color: 0x0c1b12, toneMapped: false }),
  amber: new THREE.MeshBasicMaterial({ color: 0xe7b15c, toneMapped: false }),
  cyan: new THREE.MeshBasicMaterial({ color: 0x9defff, toneMapped: false }),
};
const box = (parent, size, position, material, rotation = [0, 0, 0]) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position); mesh.rotation.set(...rotation); parent.add(mesh); return mesh;
};

const room = new THREE.Group(); scene.add(room);
box(room, [18, .45, 6], [0, 5, -1], mat.wall);
box(room, [18, .45, 6], [0, -5, -1], mat.wall);
box(room, [.55, 10, 5], [-8.5, 0, -1], mat.wall);
box(room, [.55, 10, 5], [8.5, 0, -1], mat.wall);
for (const x of [-6.4, -3.2, 3.2, 6.4]) box(room, [.28, 10, .5], [x, 0, -2.4], mat.metal);
box(room, [12, 1.2, 2.4], [0, -3.9, 1.2], mat.dark, [-.15, 0, 0]);
for (let i = 0; i < 5; i++) box(room, [1.8, .75, .08], [-4.2 + i * 2.1, -3.45, 2.38], mat.screen, [-.15, 0, 0]);

const warningLights = [];
for (const x of [-6.8, -4.5, 4.5, 6.8]) {
  const light = new THREE.PointLight(0xe7b15c, 0, 7, 2);
  light.position.set(x, 3.6, 1); scene.add(light); warningLights.push(light);
  box(room, [.26, .12, .08], [x, 3.8, 2.35], mat.amber);
}
const roomLight = new THREE.HemisphereLight(0x8ea492, 0x020302, .12); scene.add(roomLight);
const deskLight = new THREE.PointLight(0xb4d0bb, 0, 12, 2); deskLight.position.set(0, -2.5, 3); scene.add(deskLight);

const entity = new THREE.Group();
entity.position.set(4, -1.3, -31); entity.scale.setScalar(5.3); scene.add(entity);
const head = new THREE.Group(); head.position.set(0, 2.1, 0); entity.add(head);
box(head, [1.1, .9, .95], [0, 0, 0], mat.dark);
box(head, [.82, .58, .18], [0, -.12, .52], mat.metal);
const eyeL = box(head, [.24, .11, .06], [-.18, .12, .54], mat.cyan);
const eyeR = box(head, [.24, .11, .06], [.18, .12, .54], mat.cyan);
box(head, [.72, .4, .18], [0, -.3, .55], mat.metal);
box(entity, [4.4, 1.4, 1.8], [0, .4, -.1], mat.dark);

const arm = new THREE.Group(); arm.position.set(-2.2, .7, .2); entity.add(arm);
box(arm, [1.2, 1.1, 1.5], [0, 0, 0], mat.dark);
box(arm, [.8, 2.1, .9], [0, -1.45, .35], mat.metal, [.08, 0, -.12]);
const hand = new THREE.Group(); hand.position.set(0, -3.15, .72); arm.add(hand);
box(hand, [1.05, 1.25, .5], [0, 0, 0], mat.metal, [.08, 0, -.08]);
for (let i = 0; i < 4; i++) box(hand, [.17, .95, .2], [-.33 + i * .22, -.96, .04], mat.metal, [.05, 0, -.08]);
arm.rotation.z = -.65;

const eyeLight = new THREE.PointLight(0x9defff, 0, 24, 2); eyeLight.position.set(4, 8, -20); scene.add(eyeLight);
const handLight = new THREE.PointLight(0x9defff, 0, 10, 2); handLight.position.set(-2, -1, 2); scene.add(handLight);

const dustGeo = new THREE.BufferGeometry();
const count = mobile ? 500 : 1200;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  positions[i * 3] = THREE.MathUtils.randFloatSpread(22);
  positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(13);
  positions[i * 3 + 2] = THREE.MathUtils.randFloat(-10, 4);
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x83978b, size: .035, transparent: true, opacity: .22, depthWrite: false }));
scene.add(dust);

const ui = {
  calibration: document.querySelector('.calibration'), station: document.querySelector('.station'), begin: document.querySelector('.begin'),
  gpu: document.querySelector('.gpu-check'), input: document.querySelector('.input-check'), audio: document.querySelector('.audio-check'),
  lever: document.querySelector('.lever'), handle: document.querySelector('.lever-handle'), power: document.querySelector('.power-value'),
  tuner: document.querySelector('.tuner'), frequency: document.querySelector('.frequency'), signal: document.querySelector('.signal-value'),
  phase: document.querySelector('.phase'), status: document.querySelector('.status'), entity: document.querySelector('.entity-value'),
  radar: document.querySelector('.radar'), radarLock: document.querySelector('.radar-lock'), radarTarget: document.querySelector('.radar-target'),
  trackValue: document.querySelector('.track-value'), trackConsole: document.querySelector('.track-console'),
  contactPad: document.querySelector('.contact-pad'), acknowledge: document.querySelector('.acknowledge'),
  missions: [...document.querySelectorAll('.mission')],
};

const state = {
  power: 0, signalLock: 0, leverDragging: false, radarDragging: false, contactHolding: false,
  pointerX: 0, pointerY: 0, targetX: 72, targetY: 34, reticleX: 30, reticleY: 68,
  trackQuality: 0, hold: 0, contactSynchronized: false, paused: false,
};

const setMission = (index) => ui.missions.forEach((mission, missionIndex) => mission.classList.toggle('active', index === missionIndex));

let phaseMachine;
const enterPhase = ({ current }) => {
  document.body.dataset.phase = current;

  switch (current) {
    case PHASE.POWER_OFF:
      ui.station.setAttribute('aria-hidden', 'false');
      effects.timeline().to('.calibration>*', { opacity: 0, y: -20, stagger: .04, duration: .35 })
        .to(ui.calibration, { opacity: 0, duration: .55, onComplete: () => ui.calibration.remove() }, .15)
        .set(ui.station, { visibility: 'visible' }, .2).to(ui.station, { opacity: 1, duration: .65 }, .25);
      audio.tone(42, 1.2, .08, 'sawtooth');
      break;
    case PHASE.POWER_RESTORED:
      document.body.classList.add('powered');
      ui.phase.textContent = '02 // TUNE SIGNAL'; ui.status.textContent = 'CARRIER DETECTED';
      audio.tone(95, .9, .1, 'sawtooth'); effects.flash();
      effects.delayedCall(.65, () => phaseMachine.transition(PHASE.SIGNAL_TUNING, { source: 'power-transition-complete' }));
      break;
    case PHASE.SIGNAL_TUNING:
      setMission(1);
      break;
    case PHASE.SIGNAL_LOCKED:
      document.body.classList.add('locked');
      ui.phase.textContent = '03 // TRACK CONTACT'; ui.status.textContent = 'OBJECT MOVING'; ui.entity.textContent = 'UNRESOLVED';
      audio.tone(46, 1.8, .12, 'sawtooth'); effects.flash();
      effects.delayedCall(.75, () => phaseMachine.transition(PHASE.RADAR_TRACKING, { source: 'signal-transition-complete' }));
      break;
    case PHASE.RADAR_TRACKING:
      setMission(2);
      break;
    case PHASE.VISUAL_CONTACT:
      document.body.classList.add('tracked', 'contact');
      ui.phase.textContent = '04 // FIRST CONTACT'; ui.status.textContent = 'VISUAL LOCK'; ui.entity.textContent = 'LIVING';
      audio.tone(38, 2, .14, 'sawtooth'); effects.flash();
      effects.timeline({ onComplete: () => phaseMachine.transition(PHASE.HAND_SYNC, { source: 'entity-approach-complete' }) })
        .to(entity.position, { x: 1.6, z: -13.8, duration: 2.5, ease: 'power3.out' })
        .to(arm.rotation, { z: -.1, x: -.32, duration: 2.2, ease: 'power3.inOut' }, 0);
      break;
    case PHASE.HAND_SYNC:
      setMission(3);
      break;
    case PHASE.CONTACT_ACKNOWLEDGED:
      ui.acknowledge.disabled = true;
      audio.tone(82, 1.5, .09, 'sine'); ui.status.textContent = 'IT ACKNOWLEDGED YOU';
      effects.timeline().to(head.rotation, { y: -.2, x: .06, duration: .55 }).to(head.rotation, { y: 0, x: 0, duration: .8, ease: 'power2.out' });
      effects.to(eyeLight, { intensity: 32, duration: .35, yoyo: true, repeat: 1 });
      document.querySelector('.response-mission p').textContent = 'THE RESPONSE WAS DELIBERATE';
      break;
    default:
      break;
  }
};

phaseMachine = createExperienceStateMachine({ onTransition: enterPhase });

setTimeout(() => {
  ui.gpu.textContent = renderer.capabilities.isWebGL2 ? 'WEBGL2 READY' : 'COMPATIBLE';
  ui.input.textContent = ('ontouchstart' in window) ? 'TOUCH READY' : 'POINTER READY';
  ui.audio.textContent = 'USER GESTURE'; ui.begin.classList.add('ready');
}, 900);

input.listen(ui.begin, 'click', async () => {
  if (!phaseMachine.is(PHASE.CALIBRATION)) return;
  await audio.resume();
  phaseMachine.transition(PHASE.POWER_OFF, { source: 'begin-button' });
});

const updatePower = (value) => {
  if (!phaseMachine.is(PHASE.POWER_OFF)) return;
  state.power = THREE.MathUtils.clamp(value, 0, 100);
  document.documentElement.style.setProperty('--power', state.power.toFixed(0));
  ui.power.textContent = `${Math.round(state.power)}%`; ui.handle.setAttribute('aria-valuenow', Math.round(state.power));
  roomLight.intensity = .12 + state.power * .012; deskLight.intensity = state.power * .06;
  warningLights.forEach((light, index) => light.intensity = state.power > 20 ? (1.2 + Math.sin(performance.now() * .006 + index) * .4) * state.power * .035 : 0);
  renderer.toneMappingExposure = .72 + state.power * .006;
  if (state.power >= 96) phaseMachine.transition(PHASE.POWER_RESTORED, { source: 'power-threshold', value: state.power });
};
const stopLeverDrag = (event) => {
  state.leverDragging = false;
  input.releasePointer(ui.handle, event);
};
input.listen(ui.handle, 'pointerdown', async (event) => {
  if (!phaseMachine.is(PHASE.POWER_OFF)) return;
  state.leverDragging = true; input.capturePointer(ui.handle, event); await audio.resume(); audio.tone(55, .25, .04, 'square');
});
input.listen(ui.handle, 'pointermove', (event) => {
  if (!state.leverDragging) return;
  const rect = ui.lever.getBoundingClientRect(); updatePower(((event.clientY - rect.top) / rect.height) * 100);
});
input.listen(ui.handle, 'pointerup', stopLeverDrag);
input.listen(ui.handle, 'pointercancel', stopLeverDrag);
input.listen(ui.handle, 'lostpointercapture', () => { state.leverDragging = false; });
input.listen(ui.handle, 'keydown', (event) => {
  if (!phaseMachine.is(PHASE.POWER_OFF)) return;
  const step = event.shiftKey ? 10 : 5;
  const keys = { ArrowDown: step, ArrowRight: step, ArrowUp: -step, ArrowLeft: -step, Home: -state.power, End: 100 - state.power };
  if (!(event.key in keys)) return;
  event.preventDefault(); updatePower(state.power + keys[event.key]);
});

input.listen(ui.tuner, 'input', (event) => {
  if (!phaseMachine.is(PHASE.SIGNAL_TUNING)) return;
  const value = +event.target.value; const target = 73; const distance = Math.abs(value - target);
  state.signalLock = Math.max(0, 100 - distance * 3.2);
  document.documentElement.style.setProperty('--lock', state.signalLock.toFixed(0));
  ui.frequency.textContent = `${(118.7 + value * 1.37).toFixed(1)}`; ui.signal.textContent = `${Math.round(state.signalLock)}%`;
  audio.tone(180 + value * 6, .06, .012, state.signalLock > 80 ? 'sine' : 'square');
  entity.position.z = -31 + state.signalLock * .05; eyeLight.intensity = state.signalLock * .05;
  effects.setSignalBloom(state.signalLock);
  if (state.signalLock > 97) phaseMachine.transition(PHASE.SIGNAL_LOCKED, { source: 'signal-threshold', value: state.signalLock });
});

const updateRadarReticle = (event) => {
  if (!state.radarDragging || !phaseMachine.is(PHASE.RADAR_TRACKING)) return;
  const rect = ui.radar.getBoundingClientRect();
  state.reticleX = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 100, 4, 96);
  state.reticleY = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height) * 100, 4, 96);
  ui.radarLock.style.left = `${state.reticleX}%`; ui.radarLock.style.top = `${state.reticleY}%`;
};
const stopRadarDrag = (event) => {
  state.radarDragging = false;
  input.releasePointer(ui.radarLock, event);
};
input.listen(ui.radarLock, 'pointerdown', async (event) => {
  if (!phaseMachine.is(PHASE.RADAR_TRACKING)) return;
  state.radarDragging = true; input.capturePointer(ui.radarLock, event); await audio.resume();
});
input.listen(ui.radarLock, 'pointermove', updateRadarReticle);
input.listen(ui.radarLock, 'pointerup', stopRadarDrag);
input.listen(ui.radarLock, 'pointercancel', stopRadarDrag);
input.listen(ui.radarLock, 'lostpointercapture', () => { state.radarDragging = false; });

let contactTimer;
const cancelContactHold = (event) => {
  clearInterval(contactTimer); state.contactHolding = false;
  input.releasePointer(ui.contactPad, event);
  if (!state.contactSynchronized) {
    state.hold = 0; document.documentElement.style.setProperty('--contact', '0');
    ui.contactPad.querySelector('span').textContent = 'PLACE HAND HERE';
    handLight.intensity = 0; effects.resetBloom();
  }
};
input.listen(ui.contactPad, 'pointerdown', async (event) => {
  if (!phaseMachine.is(PHASE.HAND_SYNC) || state.contactSynchronized || state.contactHolding) return;
  await audio.resume(); clearInterval(contactTimer); state.contactHolding = true; state.hold = 0;
  input.capturePointer(ui.contactPad, event);
  contactTimer = setInterval(() => {
    state.hold = Math.min(100, state.hold + 4);
    document.documentElement.style.setProperty('--contact', state.hold.toFixed(0));
    ui.contactPad.querySelector('span').textContent = `SYNCHRONIZING ${state.hold}%`;
    handLight.intensity = state.hold * .18; effects.setContactBloom(state.hold);
    if (state.hold >= 100) {
      clearInterval(contactTimer); state.contactHolding = false; state.contactSynchronized = true; document.body.classList.add('synchronized');
      ui.phase.textContent = '05 // CONTACT'; ui.status.textContent = 'SYNCHRONIZED'; ui.contactPad.querySelector('span').textContent = 'CONTACT ESTABLISHED';
      audio.tone(76, 1.8, .11, 'sine'); effects.flash();
      effects.timeline({ onComplete: () => setMission(4) })
        .to(arm.position, { x: .5, y: .15, z: 1.4, duration: 1.2, ease: 'power3.out' })
        .to(head.rotation, { y: -.12, duration: .55, yoyo: true, repeat: 1 }, 0);
    }
  }, 45);
});
input.listen(ui.contactPad, 'pointerup', cancelContactHold);
input.listen(ui.contactPad, 'pointercancel', cancelContactHold);
input.listen(ui.contactPad, 'lostpointercapture', () => cancelContactHold());

input.listen(ui.acknowledge, 'click', () => {
  if (!phaseMachine.is(PHASE.HAND_SYNC) || !state.contactSynchronized) return;
  phaseMachine.transition(PHASE.CONTACT_ACKNOWLEDGED, { source: 'acknowledge-button' });
});

input.bindPointerPosition(({ x, y }) => {
  state.pointerX = x;
  state.pointerY = y;
});

const clock = new THREE.Clock();
input.bindVisibility(async (hidden) => {
  state.paused = hidden;
  if (hidden) await audio.suspend(); else { await audio.resume(); clock.getDelta(); }
});

function render() {
  const delta = Math.min(clock.getDelta(), .05);
  const time = clock.elapsedTime;
  if (!state.paused) {
    dust.rotation.y = time * .002; dust.position.y = Math.sin(time * .2) * .08;
    if (phaseMachine.is(PHASE.RADAR_TRACKING)) {
      state.targetX = 50 + Math.sin(time * .73) * 30;
      state.targetY = 50 + Math.cos(time * .91) * 27;
      ui.radarTarget.style.left = `${state.targetX}%`; ui.radarTarget.style.top = `${state.targetY}%`;
      const distance = Math.hypot(state.targetX - state.reticleX, state.targetY - state.reticleY);
      const quality = Math.max(0, 100 - distance * 4.2);
      const smoothing = 1 - Math.exp(-8 * delta);
      state.trackQuality += (quality - state.trackQuality) * smoothing;
      state.trackQuality += (state.trackQuality > 78 ? 25 : -10) * delta;
      state.trackQuality = THREE.MathUtils.clamp(state.trackQuality, 0, 100);
      ui.trackValue.textContent = `${Math.round(state.trackQuality)}%`; ui.trackConsole.textContent = `${Math.round(state.trackQuality)}%`;
      document.documentElement.style.setProperty('--track', state.trackQuality.toFixed(0));
      if (state.trackQuality >= 99.5) phaseMachine.transition(PHASE.VISUAL_CONTACT, { source: 'tracking-threshold', value: state.trackQuality });
    }
    if (phaseMachine.is(PHASE.VISUAL_CONTACT, PHASE.HAND_SYNC, PHASE.CONTACT_ACKNOWLEDGED)) {
      head.rotation.y += ((state.pointerX * .16) - head.rotation.y) * (1 - Math.exp(-2.2 * delta));
      head.rotation.x += ((-state.pointerY * .08) - head.rotation.x) * (1 - Math.exp(-2.2 * delta));
      entity.position.y = -1.3 + Math.sin(time * .7) * .03;
      eyeL.scale.x = eyeR.scale.x = 1 + Math.sin(time * 3.5) * .04;
    }
    composer.render();
  }
  requestAnimationFrame(render);
}
render();

input.listen(window, 'resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.1 : 1.6));
});
