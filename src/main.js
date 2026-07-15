import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

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

// Industrial control room and exterior observation window.
const room = new THREE.Group(); scene.add(room);
box(room, [18, .45, 6], [0, 5, -1], mat.wall);
box(room, [18, .45, 6], [0, -5, -1], mat.wall);
box(room, [.55, 10, 5], [-8.5, 0, -1], mat.wall);
box(room, [.55, 10, 5], [8.5, 0, -1], mat.wall);
for (const x of [-6.4, -3.2, 3.2, 6.4]) box(room, [.28, 10, .5], [x, 0, -2.4], mat.metal);
const desk = box(room, [12, 1.2, 2.4], [0, -3.9, 1.2], mat.dark, [-.15, 0, 0]);
for (let i = 0; i < 5; i++) box(room, [1.8, .75, .08], [-4.2 + i * 2.1, -3.45, 2.38], mat.screen, [-.15, 0, 0]);

const warningLights = [];
for (const x of [-6.8, -4.5, 4.5, 6.8]) {
  const light = new THREE.PointLight(0xe7b15c, 0, 7, 2);
  light.position.set(x, 3.6, 1); scene.add(light); warningLights.push(light);
  box(room, [.26, .12, .08], [x, 3.8, 2.35], mat.amber);
}
const roomLight = new THREE.HemisphereLight(0x8ea492, 0x020302, .12); scene.add(roomLight);
const deskLight = new THREE.PointLight(0xb4d0bb, 0, 12, 2); deskLight.position.set(0, -2.5, 3); scene.add(deskLight);

// Living entity outside the station.
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
  contactPad: document.querySelector('.contact-pad'), missions: [...document.querySelectorAll('.mission')],
};
const state = {
  entered: false, power: 0, signalLock: 0, leverDragging: false, radarDragging: false,
  pointerX: 0, pointerY: 0, audio: null, tracking: false, tracked: false, contact: false,
  targetX: 72, targetY: 34, reticleX: 30, reticleY: 68, trackQuality: 0, hold: 0,
};

const initAudio = () => {
  if (!state.audio) state.audio = new (window.AudioContext || window.webkitAudioContext)();
  state.audio.resume();
};
const tone = (frequency = 70, duration = .4, gain = .04, type = 'sine') => {
  if (!state.audio) return;
  const oscillator = state.audio.createOscillator(); const volume = state.audio.createGain();
  oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, state.audio.currentTime);
  volume.gain.setValueAtTime(gain, state.audio.currentTime); volume.gain.exponentialRampToValueAtTime(.001, state.audio.currentTime + duration);
  oscillator.connect(volume).connect(state.audio.destination); oscillator.start(); oscillator.stop(state.audio.currentTime + duration);
};
const flash = () => gsap.fromTo('.flash', { opacity: .7 }, { opacity: 0, duration: .6 });
const setMission = (index) => ui.missions.forEach((mission, missionIndex) => mission.classList.toggle('active', index === missionIndex));

setTimeout(() => {
  ui.gpu.textContent = renderer.capabilities.isWebGL2 ? 'WEBGL2 READY' : 'COMPATIBLE';
  ui.input.textContent = ('ontouchstart' in window) ? 'TOUCH READY' : 'POINTER READY';
  ui.audio.textContent = 'USER GESTURE'; ui.begin.classList.add('ready');
}, 900);

ui.begin.addEventListener('click', () => {
  initAudio(); state.entered = true;
  gsap.timeline().to('.calibration>*', { opacity: 0, y: -20, stagger: .04, duration: .35 })
    .to(ui.calibration, { opacity: 0, duration: .55, onComplete: () => ui.calibration.remove() }, .15)
    .set(ui.station, { visibility: 'visible' }, .2).to(ui.station, { opacity: 1, duration: .65 }, .25);
  tone(42, 1.2, .08, 'sawtooth');
});

const updatePower = (value) => {
  state.power = THREE.MathUtils.clamp(value, 0, 100);
  document.documentElement.style.setProperty('--power', state.power.toFixed(0));
  ui.power.textContent = `${Math.round(state.power)}%`; ui.handle.setAttribute('aria-valuenow', Math.round(state.power));
  roomLight.intensity = .12 + state.power * .012; deskLight.intensity = state.power * .06;
  warningLights.forEach((light, index) => light.intensity = state.power > 20 ? (1.2 + Math.sin(performance.now() * .006 + index) * .4) * state.power * .035 : 0);
  renderer.toneMappingExposure = .72 + state.power * .006;
  if (state.power >= 96 && !document.body.classList.contains('powered')) {
    document.body.classList.add('powered'); ui.phase.textContent = '02 // TUNE SIGNAL'; ui.status.textContent = 'CARRIER DETECTED';
    tone(95, .9, .1, 'sawtooth'); flash(); setTimeout(() => setMission(1), 650);
  }
};
const leverMove = (event) => {
  if (!state.leverDragging) return;
  const rect = ui.lever.getBoundingClientRect(); updatePower(((event.clientY - rect.top) / rect.height) * 100);
};
ui.handle.addEventListener('pointerdown', (event) => {
  state.leverDragging = true; ui.handle.setPointerCapture(event.pointerId); initAudio(); tone(55, .25, .04, 'square');
});
ui.handle.addEventListener('pointermove', leverMove);
ui.handle.addEventListener('pointerup', (event) => { state.leverDragging = false; ui.handle.releasePointerCapture(event.pointerId); });

ui.tuner.addEventListener('input', (event) => {
  const value = +event.target.value; const target = 73; const distance = Math.abs(value - target);
  state.signalLock = Math.max(0, 100 - distance * 3.2);
  document.documentElement.style.setProperty('--lock', state.signalLock.toFixed(0));
  ui.frequency.textContent = `${(118.7 + value * 1.37).toFixed(1)}`; ui.signal.textContent = `${Math.round(state.signalLock)}%`;
  tone(180 + value * 6, .06, .012, state.signalLock > 80 ? 'sine' : 'square');
  entity.position.z = -31 + state.signalLock * .05; eyeLight.intensity = state.signalLock * .05;
  bloom.strength = (mobile ? .35 : .55) + state.signalLock * .003;
  if (state.signalLock > 97 && !state.tracking) {
    state.tracking = true; document.body.classList.add('locked');
    ui.phase.textContent = '03 // TRACK CONTACT'; ui.status.textContent = 'OBJECT MOVING'; ui.entity.textContent = 'UNRESOLVED';
    tone(46, 1.8, .12, 'sawtooth'); flash(); setTimeout(() => setMission(2), 750);
  }
});

const updateRadarReticle = (event) => {
  if (!state.radarDragging || state.tracked) return;
  const rect = ui.radar.getBoundingClientRect();
  state.reticleX = THREE.MathUtils.clamp(((event.clientX - rect.left) / rect.width) * 100, 4, 96);
  state.reticleY = THREE.MathUtils.clamp(((event.clientY - rect.top) / rect.height) * 100, 4, 96);
  ui.radarLock.style.left = `${state.reticleX}%`; ui.radarLock.style.top = `${state.reticleY}%`;
};
ui.radarLock.addEventListener('pointerdown', (event) => {
  state.radarDragging = true; ui.radarLock.setPointerCapture(event.pointerId); initAudio();
});
ui.radarLock.addEventListener('pointermove', updateRadarReticle);
ui.radarLock.addEventListener('pointerup', (event) => { state.radarDragging = false; ui.radarLock.releasePointerCapture(event.pointerId); });

const completeTracking = () => {
  if (state.tracked) return;
  state.tracked = true; document.body.classList.add('tracked', 'contact');
  ui.phase.textContent = '04 // FIRST CONTACT'; ui.status.textContent = 'VISUAL LOCK'; ui.entity.textContent = 'LIVING';
  tone(38, 2, .14, 'sawtooth'); flash();
  gsap.to(entity.position, { x: 1.6, z: -13.8, duration: 2.5, ease: 'power3.out' });
  gsap.to(arm.rotation, { z: -.1, x: -.32, duration: 2.2, ease: 'power3.inOut' });
  setTimeout(() => setMission(3), 1500);
};

let contactTimer;
const cancelContactHold = () => {
  clearInterval(contactTimer);
  if (!state.contact) {
    state.hold = 0; document.documentElement.style.setProperty('--contact', '0');
    ui.contactPad.querySelector('span').textContent = 'PLACE HAND HERE';
  }
};
ui.contactPad.addEventListener('pointerdown', () => {
  if (state.contact) return;
  initAudio(); state.hold = 0; ui.contactPad.setPointerCapture?.(1);
  contactTimer = setInterval(() => {
    state.hold = Math.min(100, state.hold + 4);
    document.documentElement.style.setProperty('--contact', state.hold.toFixed(0));
    ui.contactPad.querySelector('span').textContent = `SYNCHRONIZING ${state.hold}%`;
    handLight.intensity = state.hold * .18; bloom.strength = (mobile ? .35 : .55) + state.hold * .009;
    if (state.hold >= 100) {
      clearInterval(contactTimer); state.contact = true; document.body.classList.add('synchronized');
      ui.phase.textContent = '05 // CONTACT'; ui.status.textContent = 'SYNCHRONIZED'; ui.contactPad.querySelector('span').textContent = 'CONTACT ESTABLISHED';
      tone(76, 1.8, .11, 'sine'); flash();
      gsap.to(arm.position, { x: .5, y: .15, z: 1.4, duration: 1.2, ease: 'power3.out' });
      gsap.to(head.rotation, { y: -.12, duration: .55, yoyo: true, repeat: 1 });
      setTimeout(() => setMission(4), 1100);
    }
  }, 45);
});
ui.contactPad.addEventListener('pointerup', cancelContactHold);
ui.contactPad.addEventListener('pointerleave', cancelContactHold);

const acknowledge = document.querySelector('.acknowledge');
acknowledge.addEventListener('click', () => {
  tone(82, 1.5, .09, 'sine'); ui.status.textContent = 'IT ACKNOWLEDGED YOU';
  gsap.timeline().to(head.rotation, { y: -.2, x: .06, duration: .55 }).to(head.rotation, { y: 0, x: 0, duration: .8, ease: 'power2.out' });
  gsap.to(eyeLight, { intensity: 32, duration: .35, yoyo: true, repeat: 1 });
  document.querySelector('.response-mission p').textContent = 'THE RESPONSE WAS DELIBERATE';
});

addEventListener('pointermove', (event) => {
  state.pointerX = event.clientX / innerWidth * 2 - 1;
  state.pointerY = -(event.clientY / innerHeight) * 2 + 1;
});

const clock = new THREE.Clock();
function render() {
  const time = clock.getElapsedTime();
  dust.rotation.y = time * .002; dust.position.y = Math.sin(time * .2) * .08;
  if (state.tracking && !state.tracked) {
    state.targetX = 50 + Math.sin(time * .73) * 30;
    state.targetY = 50 + Math.cos(time * .91) * 27;
    ui.radarTarget.style.left = `${state.targetX}%`; ui.radarTarget.style.top = `${state.targetY}%`;
    const distance = Math.hypot(state.targetX - state.reticleX, state.targetY - state.reticleY);
    const quality = Math.max(0, 100 - distance * 4.2);
    state.trackQuality += (quality - state.trackQuality) * .12;
    if (state.trackQuality > 78) state.trackQuality = Math.min(100, state.trackQuality + .42);
    else state.trackQuality = Math.max(0, state.trackQuality - .16);
    ui.trackValue.textContent = `${Math.round(state.trackQuality)}%`; ui.trackConsole.textContent = `${Math.round(state.trackQuality)}%`;
    document.documentElement.style.setProperty('--track', state.trackQuality.toFixed(0));
    if (state.trackQuality >= 99.5) completeTracking();
  }
  if (state.tracked) {
    head.rotation.y += ((state.pointerX * .16) - head.rotation.y) * .035;
    head.rotation.x += ((-state.pointerY * .08) - head.rotation.x) * .035;
    entity.position.y = -1.3 + Math.sin(time * .7) * .03;
    eyeL.scale.x = eyeR.scale.x = 1 + Math.sin(time * 3.5) * .04;
  }
  composer.render(); requestAnimationFrame(render);
}
render();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight); composer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.1 : 1.6));
});