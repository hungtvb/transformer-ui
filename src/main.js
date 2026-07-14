import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

const mobile = innerWidth < 760;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.1 : 1.65));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020207);
scene.fog = new THREE.FogExp2(0x020207, 0.024);

const camera = new THREE.PerspectiveCamera(44, innerWidth / innerHeight, 0.1, 260);
camera.position.set(0, 0, 14);
const cameraRig = new THREE.Group();
cameraRig.add(camera);
scene.add(cameraRig);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), mobile ? 0.75 : 1.25, 0.72, 0.08);
composer.addPass(bloom);

const materials = {
  dark: new THREE.MeshStandardMaterial({ color: 0x030509, metalness: 0.96, roughness: 0.22 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x303c49, metalness: 0.96, roughness: 0.18 }),
  silver: new THREE.MeshStandardMaterial({ color: 0xb8c5d3, metalness: 0.98, roughness: 0.1 }),
  red: new THREE.MeshStandardMaterial({ color: 0x7c0a17, metalness: 0.94, roughness: 0.18 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x103c8d, metalness: 0.95, roughness: 0.16 }),
  glow: new THREE.MeshBasicMaterial({ color: 0x92f6ff, toneMapped: false }),
  energy: new THREE.MeshBasicMaterial({ color: 0x69e9ff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
};

const box = (parent, size, position, material, rotation = [0, 0, 0]) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
};
const cylinder = (parent, radiusTop, radiusBottom, height, position, material, rotation = [0, 0, 0], segments = 12) => {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
};

// The entity exists behind the screen rather than inside the page.
const entity = new THREE.Group();
entity.position.set(0, -1.2, -24);
entity.scale.setScalar(4.1);
scene.add(entity);

const torso = new THREE.Group();
entity.add(torso);
box(torso, [2.7, 1.85, 1.25], [0, 0.65, 0], materials.dark);
box(torso, [2.35, 0.5, 1.42], [0, 0.05, 0.16], materials.silver);
box(torso, [1.02, 1.04, 0.15], [-0.63, 0.82, 0.73], materials.red, [0, 0.04, -0.06]);
box(torso, [1.02, 1.04, 0.15], [0.63, 0.82, 0.73], materials.red, [0, -0.04, 0.06]);

const head = new THREE.Group();
head.position.set(0, 2.15, 0.08);
entity.add(head);
box(head, [1.02, 0.84, 0.9], [0, 0, 0], materials.blue);
box(head, [0.78, 0.56, 0.18], [0, -0.1, 0.5], materials.silver);
const optic = box(head, [0.66, 0.16, 0.1], [0, 0.13, 0.51], materials.glow);
box(head, [0.16, 0.98, 0.2], [-0.52, 0.31, 0], materials.blue, [0, 0, -0.18]);
box(head, [0.16, 0.98, 0.2], [0.52, 0.31, 0], materials.blue, [0, 0, 0.18]);
box(head, [0.7, 0.42, 0.2], [0, -0.26, 0.52], materials.silver);

const armL = new THREE.Group();
const armR = new THREE.Group();
armL.position.set(-1.82, 1.28, 0);
armR.position.set(1.82, 1.28, 0);
entity.add(armL, armR);
for (const [arm, side] of [[armL, -1], [armR, 1]]) {
  box(arm, [1.08, 0.9, 1.2], [0, 0, 0], materials.red, [0, 0, side * -0.08]);
  cylinder(arm, 0.42, 0.46, 1.48, [side * 0.06, -1.1, 0], materials.silver, [0, 0, side * 0.1]);
  box(arm, [0.76, 1.28, 0.86], [side * 0.12, -2.08, 0], materials.dark);
  box(arm, [0.64, 0.62, 0.7], [side * 0.15, -2.96, 0.04], materials.metal);
}

const hand = new THREE.Group();
hand.position.set(0, -0.5, 2.4);
hand.scale.setScalar(0.001);
armR.add(hand);
const palm = box(hand, [0.9, 1.15, 0.5], [0, 0, 0], materials.metal, [0.1, 0, -0.12]);
for (let i = 0; i < 4; i += 1) {
  const finger = box(hand, [0.15, 0.86, 0.18], [-0.3 + i * 0.2, -0.85, 0.04], materials.silver, [0.1, 0, -0.12]);
  finger.userData.baseY = finger.position.y;
}

const legL = new THREE.Group();
const legR = new THREE.Group();
legL.position.set(-0.68, -1.35, 0);
legR.position.set(0.68, -1.35, 0);
entity.add(legL, legR);
for (const [leg] of [[legL], [legR]]) {
  box(leg, [0.82, 1.48, 0.96], [0, -0.58, 0], materials.silver);
  box(leg, [0.98, 0.68, 1.1], [0, -1.58, 0.06], materials.blue);
  box(leg, [1.02, 1.62, 1.14], [0, -2.72, 0], materials.blue);
  box(leg, [1.14, 0.54, 1.72], [0, -3.6, 0.34], materials.silver);
}

const eyeHalo = new THREE.Mesh(new THREE.RingGeometry(0.2, 1.3, 64), materials.energy.clone());
eyeHalo.material.opacity = 0;
eyeHalo.position.set(0, 2.3, 2.2);
entity.add(eyeHalo);

// Physical fragments that visually bridge DOM and WebGL.
const fragments = new THREE.Group();
scene.add(fragments);
for (let i = 0; i < (mobile ? 50 : 130); i += 1) {
  const shard = new THREE.Mesh(
    new THREE.TetrahedronGeometry(0.06 + Math.random() * 0.22),
    i % 7 === 0 ? materials.energy.clone() : materials.metal,
  );
  shard.position.set(THREE.MathUtils.randFloatSpread(20), THREE.MathUtils.randFloatSpread(12), THREE.MathUtils.randFloat(-5, 3));
  shard.visible = false;
  shard.userData.velocity = new THREE.Vector3();
  fragments.add(shard);
}

const dustGeometry = new THREE.BufferGeometry();
const dustCount = mobile ? 900 : 2400;
const dustPositions = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i += 1) {
  dustPositions[i * 3] = THREE.MathUtils.randFloatSpread(50);
  dustPositions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(30);
  dustPositions[i * 3 + 2] = THREE.MathUtils.randFloat(-55, 5);
}
dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0x74dfff, size: 0.04, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
scene.add(dust);

scene.add(new THREE.HemisphereLight(0x496d91, 0x010102, 1));
const key = new THREE.DirectionalLight(0xbde8ff, 6);
key.position.set(7, 12, 9);
scene.add(key);
const redRim = new THREE.DirectionalLight(0xff2448, 7);
redRim.position.set(-9, 2, -7);
scene.add(redRim);
const blueRim = new THREE.DirectionalLight(0x2c72ff, 9);
blueRim.position.set(10, 2, -9);
scene.add(blueRim);
const breachLight = new THREE.PointLight(0x7eeeff, 0, 70, 2);
breachLight.position.set(0, 2, 2);
scene.add(breachLight);

const state = {
  progress: 0,
  pointerX: 0,
  pointerY: 0,
  targetPointerX: 0,
  targetPointerY: 0,
  shattered: false,
  cursorStolen: false,
  choiceMade: false,
};

const ui = {
  captionNumber: document.querySelector('.chapter-caption span'),
  captionTitle: document.querySelector('.chapter-caption b'),
  progressItems: [...document.querySelectorAll('.progress-rail li')],
  decoy: document.querySelector('.cursor-decoy'),
};
const chapterTitles = ['SILENCE', 'PRESSURE', 'CRACK', 'EYE CONTACT', 'BREACH', 'OUTSIDE', 'CHOICE'];

let audioContext;
const ensureAudio = () => {
  if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (audioContext.state === 'suspended') audioContext.resume();
};
const thump = (frequency = 34, duration = 0.8, gain = 0.13) => {
  if (!audioContext) return;
  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(17, audioContext.currentTime + duration);
  volume.gain.setValueAtTime(gain, audioContext.currentTime);
  volume.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  oscillator.connect(volume).connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
};

const flash = (strength = 1) => gsap.fromTo('.flash', { opacity: 0.72 * strength }, { opacity: 0, duration: 0.7 });
const shake = (power = 0.25) => {
  gsap.fromTo(cameraRig.position, { x: power, y: power * 0.35 }, { x: -power, y: -power * 0.35, duration: 0.055, repeat: 8, yoyo: true, ease: 'none', onComplete: () => cameraRig.position.set(0, 0, 0) });
  navigator.vibrate?.([35, 20, 70]);
};
const explodeFragments = () => {
  if (state.shattered) return;
  state.shattered = true;
  document.body.classList.add('breach', 'dom-broken');
  flash(1);
  shake(0.48);
  thump(28, 1.5, 0.2);
  fragments.children.forEach((shard, index) => {
    shard.visible = true;
    shard.position.set(THREE.MathUtils.randFloatSpread(3), THREE.MathUtils.randFloatSpread(2), 2.5 + Math.random());
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 7;
    gsap.to(shard.position, {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
      z: 4 + Math.random() * 6,
      duration: 0.8 + Math.random() * 1.2,
      ease: 'power2.out',
    });
    gsap.to(shard.rotation, { x: Math.random() * 8, y: Math.random() * 8, duration: 1.5, ease: 'none' });
    gsap.to(shard.scale, { x: 0.05, y: 0.05, z: 0.05, delay: 0.7 + index * 0.001, duration: 0.7 });
  });
  document.querySelectorAll('[data-prop]').forEach((element, index) => {
    const direction = index % 2 ? 1 : -1;
    gsap.to(element, { x: direction * (40 + Math.random() * 120), y: -20 + Math.random() * 90, rotation: direction * (3 + Math.random() * 12), opacity: 0.18, duration: 1.2, ease: 'power3.out' });
  });
};

const stealCursor = () => {
  if (state.cursorStolen || mobile) return;
  state.cursorStolen = true;
  document.body.classList.add('cursor-stolen');
  ui.decoy.style.left = `${state.targetPointerX}px`;
  ui.decoy.style.top = `${state.targetPointerY}px`;
  gsap.to(ui.decoy, { opacity: 1, duration: 0.15 });
  gsap.to(ui.decoy, { left: `${innerWidth * 0.72}px`, top: `${innerHeight * 0.42}px`, duration: 0.7, ease: 'power3.inOut' });
  gsap.to(ui.decoy, { left: `${innerWidth + 80}px`, top: `${innerHeight * 0.18}px`, rotation: 420, duration: 0.65, delay: 0.72, ease: 'power4.in', onComplete: () => gsap.set(ui.decoy, { opacity: 0 }) });
};

const updateChapter = (index) => {
  const safeIndex = THREE.MathUtils.clamp(index, 0, chapterTitles.length - 1);
  ui.captionNumber.textContent = String(safeIndex + 1).padStart(2, '0');
  ui.captionTitle.textContent = chapterTitles[safeIndex];
  ui.progressItems.forEach((item, itemIndex) => item.classList.toggle('active', itemIndex === safeIndex));
};

const scrollTimeline = gsap.timeline({
  defaults: { ease: 'none' },
  scrollTrigger: {
    trigger: '.story',
    start: 'top top',
    end: 'bottom bottom',
    scrub: reduceMotion ? 0.01 : 1.2,
    onUpdate: (self) => {
      state.progress = self.progress;
      document.documentElement.style.setProperty('--progress', self.progress.toFixed(4));
      updateChapter(Math.min(6, Math.floor(self.progress * 7)));
      if (self.progress > 0.57) explodeFragments();
      if (self.progress > 0.78) stealCursor();
    },
  },
});

// Silence -> pressure: the monitor itself appears to bulge.
scrollTimeline
  .to('.chapter-silence .copy', { opacity: 1, y: 0, duration: 0.06 }, 0)
  .to('.chapter-silence .copy', { opacity: 0, y: -70, duration: 0.07 }, 0.09)
  .to('.impact-dent', { opacity: 0.7, scale: 1, duration: 0.12 }, 0.11)
  .to('.screen-surface', { scale: 1.018, duration: 0.08 }, 0.12)
  .to(entity.position, { z: -17, duration: 0.14 }, 0.1)
  .to('.chapter-pressure .copy', { opacity: 1, y: 0, duration: 0.07 }, 0.15)
  .to('.screen-glow', { opacity: 0.5, duration: 0.1 }, 0.2)
  .to('.chapter-pressure .copy', { opacity: 0, y: -70, duration: 0.06 }, 0.25)

  // Crack and eye contact.
  .to('.glass-cracks', { opacity: 1, scale: 1, duration: 0.12 }, 0.27)
  .to('.chapter-crack .copy', { opacity: 1, y: 0, duration: 0.07 }, 0.29)
  .to(entity.position, { z: -9.5, y: -1.5, duration: 0.13 }, 0.3)
  .to(camera.position, { z: 10.5, duration: 0.1 }, 0.31)
  .to('.chapter-crack .copy', { opacity: 0, y: -65, duration: 0.06 }, 0.38)
  .to('.chapter-eye .copy', { opacity: 1, y: 0, duration: 0.07 }, 0.4)
  .to(head.scale, { x: 1.35, y: 1.35, z: 1.35, duration: 0.1 }, 0.4)
  .to(eyeHalo.material, { opacity: 0.7, duration: 0.08 }, 0.41)
  .to(bloom, { strength: mobile ? 1.05 : 1.8, duration: 0.08 }, 0.42)
  .to('.chapter-eye .copy', { opacity: 0, y: -70, duration: 0.06 }, 0.49)

  // The breach: body and hand push through the glass.
  .to(entity.position, { z: -2.8, y: -2.1, duration: 0.13 }, 0.5)
  .to(entity.scale, { x: 5.2, y: 5.2, z: 5.2, duration: 0.12 }, 0.5)
  .to(hand.scale, { x: 1.8, y: 1.8, z: 1.8, duration: 0.09, ease: 'back.out(1.6)' }, 0.53)
  .to(hand.position, { z: 4.7, x: -0.35, duration: 0.11 }, 0.53)
  .to('.chapter-breach .copy', { opacity: 1, y: 0, duration: 0.06 }, 0.56)
  .to(breachLight, { intensity: 95, duration: 0.08 }, 0.57)
  .to('.chapter-breach .copy', { opacity: 0, y: -80, duration: 0.06 }, 0.65)

  // Outside: deliberately crop most of the entity to sell impossible scale.
  .to(entity.position, { x: 6.5, y: -7.5, z: 1.4, duration: 0.14 }, 0.66)
  .to(camera.position, { x: -2.4, y: 2.2, z: 9.5, duration: 0.14 }, 0.66)
  .to('.chapter-outside .copy', { opacity: 1, y: 0, duration: 0.07 }, 0.68)
  .to('.screen-surface', { scale: 1.055, rotation: -0.3, duration: 0.12 }, 0.69)
  .to('.chapter-outside .copy', { opacity: 0, y: -70, duration: 0.06 }, 0.78)

  // Choice.
  .to(entity.position, { x: 2.8, y: -5.7, z: -1.2, duration: 0.14 }, 0.8)
  .to(head.rotation, { y: -0.2, duration: 0.1 }, 0.8)
  .to(hand.position, { x: -0.1, y: -0.2, z: 5.8, duration: 0.12 }, 0.82)
  .to(hand.rotation, { x: -0.8, z: 0.2, duration: 0.12 }, 0.82)
  .to('.chapter-choice .choice-panel', { opacity: 1, y: 0, duration: 0.08 }, 0.87)
  .to(bloom, { strength: mobile ? 0.9 : 1.45, duration: 0.08 }, 0.88);

let lastThumpBand = -1;
ScrollTrigger.create({
  trigger: '.story',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    const band = self.progress < 0.28 ? Math.floor(self.progress * 28) : -1;
    if (band >= 1 && band !== lastThumpBand && band % 3 === 0) {
      ensureAudio();
      thump(42 - band, 0.75, 0.1 + band * 0.003);
      shake(0.08 + band * 0.006);
      lastThumpBand = band;
    }
  },
});

addEventListener('pointermove', (event) => {
  state.targetPointerX = event.clientX;
  state.targetPointerY = event.clientY;
  state.pointerX = event.clientX / innerWidth * 2 - 1;
  state.pointerY = -(event.clientY / innerHeight) * 2 + 1;
});
addEventListener('pointerdown', ensureAudio, { once: true });
addEventListener('wheel', ensureAudio, { once: true, passive: true });

const choose = (choice) => {
  if (state.choiceMade) return;
  state.choiceMade = true;
  ensureAudio();
  if (choice === 'trust') {
    document.body.classList.add('choice-trust');
    thump(58, 2.2, 0.22);
    flash(1);
    gsap.to(entity.position, { z: 8, duration: 1.2, ease: 'power4.in' });
    gsap.to(entity.scale, { x: 8, y: 8, z: 8, duration: 1.2, ease: 'power4.in' });
    gsap.to('.choice-panel', { opacity: 0, scale: 1.3, duration: 0.6 });
    gsap.to('.flash', { opacity: 1, duration: 0.8, delay: 0.4 });
  } else {
    document.body.classList.add('choice-leave');
    thump(26, 2.5, 0.08);
    gsap.to(entity.position, { z: -36, y: -2, duration: 2.6, ease: 'power2.inOut' });
    gsap.to(entity.rotation, { y: Math.PI * 0.75, duration: 1.8, ease: 'power2.inOut' });
    gsap.to('.choice-panel', { opacity: 0, duration: 0.7 });
  }
};
document.querySelectorAll('[data-choice]').forEach((button) => button.addEventListener('click', () => choose(button.dataset.choice)));

const clock = new THREE.Clock();
function render() {
  const time = clock.getElapsedTime();
  const eyeInfluence = THREE.MathUtils.smoothstep(state.progress, 0.36, 0.72);
  head.rotation.y += ((state.pointerX * 0.16 * eyeInfluence) - head.rotation.y) * 0.035;
  head.rotation.x += ((-state.pointerY * 0.08 * eyeInfluence) - head.rotation.x) * 0.035;
  optic.scale.x = 1 + Math.sin(time * 5.2) * 0.04;
  optic.material.color.setHSL(0.53, 0.9, 0.72 + Math.sin(time * 3.8) * 0.04);
  eyeHalo.rotation.z = time * 0.28;
  eyeHalo.scale.setScalar(1 + Math.sin(time * 2) * 0.06);
  entity.rotation.y += ((-0.18 + state.pointerX * 0.025 * eyeInfluence) - entity.rotation.y) * 0.018;
  entity.rotation.x += ((state.pointerY * -0.012) - entity.rotation.x) * 0.018;
  dust.rotation.y = time * 0.0015;
  dust.position.y = Math.sin(time * 0.18) * 0.25;
  camera.position.y += ((Math.sin(time * 0.72) * 0.035) - camera.position.y * 0.0005) * 0.025;
  composer.render();
  requestAnimationFrame(render);
}
render();

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.1 : 1.65));
  ScrollTrigger.refresh();
});
