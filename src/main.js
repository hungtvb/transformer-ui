import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = innerWidth < 760;
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.2 : 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.shadowMap.enabled = !mobile;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020407);
scene.fog = new THREE.FogExp2(0x020407, 0.032);
const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 160);
camera.position.set(0, 1.4, 14);

const root = new THREE.Group();
scene.add(root);

const materials = {
  red: new THREE.MeshStandardMaterial({ color: 0x9b1018, metalness: .88, roughness: .22 }),
  redDark: new THREE.MeshStandardMaterial({ color: 0x3c080d, metalness: .92, roughness: .3 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x123f91, metalness: .9, roughness: .2 }),
  blueDark: new THREE.MeshStandardMaterial({ color: 0x07172f, metalness: .94, roughness: .28 }),
  silver: new THREE.MeshStandardMaterial({ color: 0xaab5c3, metalness: .96, roughness: .16 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x05070a, metalness: .95, roughness: .28 }),
  tire: new THREE.MeshStandardMaterial({ color: 0x050505, metalness: .15, roughness: .82 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x153f5f, emissive: 0x052c4d, emissiveIntensity: 1.4, metalness: .25, roughness: .1, transmission: .18, transparent: true, opacity: .9 }),
  eye: new THREE.MeshBasicMaterial({ color: 0x8ceeff, toneMapped: false }),
  energon: new THREE.MeshBasicMaterial({ color: 0x66dfff, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
  matrix: new THREE.MeshBasicMaterial({ color: 0xbef7ff, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
};

const box = (parent, size, pos, mat, rot = [0, 0, 0], name = '') => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  mesh.position.set(...pos); mesh.rotation.set(...rot); mesh.name = name; parent.add(mesh); return mesh;
};
const cyl = (parent, r1, r2, h, pos, mat, rot = [0, 0, 0], seg = 12, name = '') => {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat);
  mesh.position.set(...pos); mesh.rotation.set(...rot); mesh.name = name; parent.add(mesh); return mesh;
};
const wheel = (parent, pos, rot = [Math.PI / 2, 0, 0], scale = 1) => {
  const group = new THREE.Group(); group.position.set(...pos); group.rotation.set(...rot); parent.add(group);
  const tire = cyl(group, .43 * scale, .43 * scale, .24 * scale, [0, 0, 0], materials.tire, [0, 0, 0], 20);
  cyl(group, .23 * scale, .23 * scale, .26 * scale, [0, 0, 0], materials.silver, [0, 0, 0], 12);
  return group;
};

const prime = new THREE.Group();
prime.position.set(2.3, -1.05, 0);
prime.rotation.y = -.22;
root.add(prime);

const pelvis = new THREE.Group(); prime.add(pelvis);
const hipCore = box(pelvis, [1.5, .55, .9], [0, -.62, 0], materials.silver);
box(pelvis, [1.86, .42, 1.05], [0, -.95, 0], materials.blue);

const torso = new THREE.Group(); prime.add(torso);
const backBlock = box(torso, [2.25, 1.72, 1.15], [0, .65, -.08], materials.dark);
const chestFrame = box(torso, [2.45, 1.35, 1.05], [0, .82, .18], materials.red);
const chestL = new THREE.Group(); const chestR = new THREE.Group();
chestL.position.set(-.62, .88, .75); chestR.position.set(.62, .88, .75); torso.add(chestL, chestR);
const windshieldL = box(chestL, [.92, .88, .12], [0, 0, 0], materials.glass, [0, .04, -.04], 'WINDSHIELD');
const windshieldR = box(chestR, [.92, .88, .12], [0, 0, 0], materials.glass, [0, -.04, .04], 'WINDSHIELD');
const grille = box(torso, [1.38, .48, .16], [0, .14, .79], materials.silver, [0, 0, 0], 'GRILLE');
for (let i = -2; i <= 2; i++) box(grille, [.12, .32, .05], [i * .24, 0, .1], materials.dark);

const matrixChamber = new THREE.Group(); matrixChamber.position.set(0, .62, .7); torso.add(matrixChamber);
const matrixCore = new THREE.Mesh(new THREE.OctahedronGeometry(.28, 0), materials.matrix); matrixCore.name = 'MATRIX'; matrixChamber.add(matrixCore);
const matrixRing = new THREE.Mesh(new THREE.TorusGeometry(.47, .035, 8, 48), materials.energon); matrixChamber.add(matrixRing);
matrixChamber.scale.setScalar(.001);

const head = new THREE.Group(); head.position.set(0, 2.05, .04); prime.add(head);
box(head, [.9, .72, .76], [0, 0, 0], materials.blueDark);
box(head, [.72, .54, .12], [0, -.08, .45], materials.silver);
box(head, [.54, .13, .08], [0, .11, .45], materials.eye, [0, 0, 0], 'OPTICS');
box(head, [.13, .74, .16], [-.43, .27, 0], materials.blue, [0, 0, -.16]);
box(head, [.13, .74, .16], [.43, .27, 0], materials.blue, [0, 0, .16]);
box(head, [.18, .42, .16], [0, .55, 0], materials.silver);
const faceMask = box(head, [.62, .38, .16], [0, -.2, .46], materials.silver, [0, 0, 0], 'FACE MASK');

const armL = new THREE.Group(); const armR = new THREE.Group();
armL.position.set(-1.65, 1.25, 0); armR.position.set(1.65, 1.25, 0); prime.add(armL, armR);
const buildArm = (arm, side) => {
  const shoulder = box(arm, [.95, .82, 1.12], [0, 0, 0], materials.red, [0, 0, side * -.08], side < 0 ? 'LEFT SHOULDER' : 'RIGHT SHOULDER');
  wheel(arm, [side * .05, -.2, -.65], [Math.PI / 2, 0, 0], .85);
  const upper = cyl(arm, .34, .4, 1.32, [side * .06, -1.02, 0], materials.silver, [0, 0, side * .1], 12);
  const forearm = box(arm, [.66, 1.08, .75], [side * .12, -1.92, 0], materials.redDark, [0, 0, side * .06]);
  const fist = box(arm, [.52, .5, .58], [side * .15, -2.65, .04], materials.dark);
  return { shoulder, upper, forearm, fist };
};
const left = buildArm(armL, -1); const right = buildArm(armR, 1);

const blaster = new THREE.Group(); blaster.position.set(.28, -2.58, .15); armR.add(blaster);
const barrel = cyl(blaster, .19, .25, 1.75, [0, -.72, .25], materials.dark, [Math.PI / 2, 0, 0], 16, 'ION BLASTER');
cyl(blaster, .09, .11, 2.05, [0, -.72, .48], materials.energon, [Math.PI / 2, 0, 0], 12);
blaster.scale.setScalar(.001);

const legL = new THREE.Group(); const legR = new THREE.Group();
legL.position.set(-.62, -1.25, 0); legR.position.set(.62, -1.25, 0); prime.add(legL, legR);
const buildLeg = (leg, side) => {
  const thigh = box(leg, [.74, 1.35, .88], [0, -.55, 0], materials.silver, [0, 0, side * .035]);
  const knee = box(leg, [.86, .58, 1.02], [0, -1.43, .06], materials.blue);
  const shin = box(leg, [.9, 1.46, 1.02], [0, -2.42, 0], materials.blueDark);
  box(leg, [.16, 1.06, .12], [side * .3, -2.35, .55], materials.silver);
  const foot = box(leg, [1.0, .46, 1.58], [0, -3.3, .3], materials.silver);
  const rearWheel = wheel(leg, [side * .48, -2.42, -.58], [Math.PI / 2, 0, 0], .92);
  return { thigh, knee, shin, foot, rearWheel };
};
const lLeg = buildLeg(legL, -1); const rLeg = buildLeg(legR, 1);

const exhaustL = cyl(prime, .13, .17, 2.35, [-1.16, 1.2, -.72], materials.silver, [0, 0, 0], 12);
const exhaustR = cyl(prime, .13, .17, 2.35, [1.16, 1.2, -.72], materials.silver, [0, 0, 0], 12);

const truckGhost = new THREE.Group(); truckGhost.visible = false; root.add(truckGhost);
box(truckGhost, [3.3, 1.45, 2], [0, .2, 0], materials.red);
box(truckGhost, [2.6, .95, 2.02], [0, 1.28, 0], materials.redDark);
box(truckGhost, [1.1, .72, .08], [-.62, 1.33, 1.04], materials.glass);
box(truckGhost, [1.1, .72, .08], [.62, 1.33, 1.04], materials.glass);
box(truckGhost, [2.8, .52, .12], [0, .18, 1.05], materials.silver);
for (const x of [-1.25, 1.25]) for (const z of [-.82, .82]) wheel(truckGhost, [x, -.62, z], [Math.PI / 2, 0, 0], 1.1);
truckGhost.position.set(2.3, -1.8, 0);
truckGhost.rotation.y = -.22;

const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshStandardMaterial({ color: 0x030507, metalness: .18, roughness: .88 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -4.62; ground.receiveShadow = true; scene.add(ground);
const grid = new THREE.GridHelper(80, 80, 0x19344f, 0x08121d); grid.position.y = -4.6; grid.material.transparent = true; grid.material.opacity = .22; scene.add(grid);

const particleCount = mobile ? 650 : 1500;
const p = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) { p[i*3] = THREE.MathUtils.randFloatSpread(60); p[i*3+1] = THREE.MathUtils.randFloat(-4, 18); p[i*3+2] = THREE.MathUtils.randFloat(-32, 8); }
const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(p, 3));
const particles = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x79c8ff, size: .035, transparent: true, opacity: .4, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(particles);

scene.add(new THREE.HemisphereLight(0x547ca8, 0x030304, 1.2));
const key = new THREE.DirectionalLight(0xb5dcff, 4.8); key.position.set(5, 10, 8); key.castShadow = !mobile; scene.add(key);
const redRim = new THREE.DirectionalLight(0xff2438, 5); redRim.position.set(-7, 3, -5); scene.add(redRim);
const blueRim = new THREE.DirectionalLight(0x297bff, 6); blueRim.position.set(7, 1, -7); scene.add(blueRim);
const coreLight = new THREE.PointLight(0x5be3ff, 0, 15, 2); coreLight.position.set(2.3, -.3, 2); scene.add(coreLight);

const state = { entered: false, transforming: false, truck: false, matrixOpen: false, blasterOut: false, scene: 'arrival', orbitX: 0, orbitY: 0, drag: false, lastX: 0, lastY: 0, energy: 84 };
const ui = {
  experience: document.querySelector('.experience'), boot: document.querySelector('.boot'), label: document.querySelector('.target-label'), status: document.querySelector('.status-line'), energy: document.querySelector('.energy-track i'), energyValue: document.querySelector('.energy-value'), mode: document.querySelector('.mode-value'), weapon: document.querySelector('.weapon-value'), target: document.querySelector('.target-value')
};
const setStatus = (text) => { ui.status.textContent = text; };
const setEnergy = (delta) => { state.energy = THREE.MathUtils.clamp(state.energy + delta, 0, 100); ui.energy.style.width = `${state.energy}%`; ui.energyValue.textContent = `${Math.round(state.energy)}%`; };
const flash = (strength = 1) => gsap.fromTo('.impact-flash', { opacity: .75 * strength }, { opacity: 0, duration: .65 });

function enterExperience() {
  if (state.entered) return; state.entered = true;
  gsap.timeline()
    .to('.boot-title, .boot-subtitle, .boot-code, .enter-button, .boot small', { opacity: 0, y: -20, stagger: .04, duration: .45 })
    .to(ui.boot, { opacity: 0, duration: .65, onComplete: () => ui.boot.remove() }, .25)
    .set(ui.experience, { visibility: 'visible' }, .3)
    .to(ui.experience, { opacity: 1, duration: .8 }, .35)
    .fromTo(prime.position, { z: -30, y: -1.05 }, { z: 0, y: -1.05, duration: reduceMotion ? .1 : 2.8, ease: 'power4.out' }, .25)
    .fromTo(prime.rotation, { y: 1.25 }, { y: -.22, duration: 2.4, ease: 'power3.out' }, .25)
    .from('.scene-copy.active > *', { opacity: 0, y: 32, stagger: .1, duration: .75 }, 1.3)
    .add(() => { flash(.75); setStatus('PRIME ONLINE'); }, 2.5);
}
document.querySelector('.enter-button').addEventListener('click', enterExperience);

function transform() {
  if (state.transforming) return;
  state.transforming = true;
  if (!state.truck) {
    setStatus('CONVERSION SEQUENCE'); setEnergy(-14); ui.mode.textContent = 'TRANSFORMING';
    gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => { state.truck = true; state.transforming = false; ui.mode.textContent = 'VEHICLE'; setStatus('TRUCK MODE READY'); } })
      .to(head.position, { y: 1.05, z: -.45, duration: .45 }, 0)
      .to(head.scale, { x: .4, y: .4, z: .4, duration: .45 }, 0)
      .to(chestL.rotation, { y: -.9, z: -.35, duration: .55 }, .05)
      .to(chestR.rotation, { y: .9, z: .35, duration: .55 }, .05)
      .to(armL.rotation, { x: 1.2, z: -1.05, duration: .65 }, .15)
      .to(armR.rotation, { x: 1.2, z: 1.05, duration: .65 }, .15)
      .to(legL.rotation, { x: -1.45, z: .15, duration: .72 }, .3)
      .to(legR.rotation, { x: -1.45, z: -.15, duration: .72 }, .3)
      .to(torso.rotation, { x: -Math.PI / 2, duration: .75 }, .35)
      .to(pelvis.rotation, { x: -Math.PI / 2, duration: .75 }, .35)
      .to(prime.scale, { x: .95, y: .72, z: .95, duration: .7 }, .4)
      .to(prime.position, { y: -2.2, z: .2, duration: .7 }, .4)
      .to(prime, { visible: false, duration: .01 }, 1.02)
      .set(truckGhost, { visible: true }, 1.02)
      .fromTo(truckGhost.scale, { x: .7, y: .7, z: .7 }, { x: 1, y: 1, z: 1, duration: .42, ease: 'back.out(1.8)' }, 1.02)
      .to(camera.position, { x: -1.6, y: .8, z: 11, duration: .9 }, .15)
      .add(() => flash(1), .85);
  } else {
    setStatus('ROBOT CONVERSION'); setEnergy(-10); ui.mode.textContent = 'TRANSFORMING';
    gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => { state.truck = false; state.transforming = false; ui.mode.textContent = 'ROBOT'; setStatus('ROBOT MODE READY'); } })
      .to(truckGhost.scale, { x: .72, y: .72, z: .72, duration: .35 })
      .set(truckGhost, { visible: false })
      .set(prime, { visible: true })
      .to(prime.scale, { x: 1, y: 1, z: 1, duration: .75 })
      .to(prime.position, { y: -1.05, z: 0, duration: .75 }, 0)
      .to(torso.rotation, { x: 0, duration: .75 }, 0)
      .to(pelvis.rotation, { x: 0, duration: .75 }, 0)
      .to(legL.rotation, { x: 0, z: 0, duration: .7 }, .1)
      .to(legR.rotation, { x: 0, z: 0, duration: .7 }, .1)
      .to(armL.rotation, { x: 0, z: 0, duration: .65 }, .2)
      .to(armR.rotation, { x: 0, z: 0, duration: .65 }, .2)
      .to(chestL.rotation, { y: 0, z: 0, duration: .5 }, .35)
      .to(chestR.rotation, { y: 0, z: 0, duration: .5 }, .35)
      .to(head.position, { y: 2.05, z: .04, duration: .5 }, .42)
      .to(head.scale, { x: 1, y: 1, z: 1, duration: .5 }, .42)
      .to(camera.position, { x: 0, y: 1.4, z: 14, duration: .9 }, 0)
      .add(() => flash(.9), .65);
  }
}

function scan() {
  if (state.truck || state.transforming) return;
  setStatus('TACTICAL SCAN'); setEnergy(-3);
  gsap.timeline().to(head.rotation, { y: -.6, duration: .28 }).to(head.rotation, { y: .6, duration: .55 }).to(head.rotation, { y: 0, duration: .32 });
  gsap.fromTo('.vignette', { boxShadow: 'inset 0 0 0 2px rgba(89,225,255,.9)' }, { boxShadow: 'inset 0 0 160px 60px rgba(0,0,0,.92)', duration: 1.2 });
  setTimeout(() => setStatus('SCAN COMPLETE'), 1100);
}
function toggleBlaster() {
  if (state.truck || state.transforming) return;
  state.blasterOut = !state.blasterOut; setEnergy(-4);
  ui.weapon.textContent = state.blasterOut ? 'ION BLASTER' : 'STOWED';
  setStatus(state.blasterOut ? 'ION BLASTER DEPLOYED' : 'WEAPON STOWED');
  gsap.to(blaster.scale, { x: state.blasterOut ? 1 : .001, y: state.blasterOut ? 1 : .001, z: state.blasterOut ? 1 : .001, duration: .55, ease: 'back.out(1.8)' });
  gsap.to(armR.rotation, { x: state.blasterOut ? -.52 : 0, z: state.blasterOut ? .28 : 0, duration: .5 });
  if (state.blasterOut) flash(.45);
}
function toggleMatrix() {
  if (state.truck || state.transforming) return;
  state.matrixOpen = !state.matrixOpen; setEnergy(state.matrixOpen ? -8 : 4);
  setStatus(state.matrixOpen ? 'MATRIX AWAKENED' : 'MATRIX SEALED');
  gsap.timeline()
    .to(chestL.position, { x: state.matrixOpen ? -1.08 : -.62, duration: .55 })
    .to(chestR.position, { x: state.matrixOpen ? 1.08 : .62, duration: .55 }, 0)
    .to(chestL.rotation, { y: state.matrixOpen ? -.7 : 0, duration: .55 }, 0)
    .to(chestR.rotation, { y: state.matrixOpen ? .7 : 0, duration: .55 }, 0)
    .to(matrixChamber.scale, { x: state.matrixOpen ? 1 : .001, y: state.matrixOpen ? 1 : .001, z: state.matrixOpen ? 1 : .001, duration: .45, ease: 'back.out(2)' }, .18)
    .to(coreLight, { intensity: state.matrixOpen ? 55 : 0, duration: .5 }, .18)
    .add(() => flash(state.matrixOpen ? 1 : .35), .2);
}

const actions = { transform, scan, blaster: toggleBlaster, matrix: toggleMatrix };
document.querySelectorAll('[data-action]').forEach(btn => btn.addEventListener('click', () => actions[btn.dataset.action]?.()));
addEventListener('keydown', e => ({ t: transform, s: scan, f: toggleBlaster, m: toggleMatrix })[e.key.toLowerCase()]?.());

const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2();
const targets = [windshieldL, windshieldR, grille, matrixCore, barrel, faceMask];
function updatePointer(e) { pointer.x = e.clientX / innerWidth * 2 - 1; pointer.y = -(e.clientY / innerHeight) * 2 + 1; }
canvas.addEventListener('pointerdown', e => { if (!state.entered) return; state.drag = true; state.lastX = e.clientX; state.lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointerup', e => { state.drag = false; canvas.releasePointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', e => {
  if (!state.entered) return; updatePointer(e);
  if (state.drag) { state.orbitY += (e.clientX - state.lastX) * .006; state.orbitX = THREE.MathUtils.clamp(state.orbitX + (e.clientY - state.lastY) * .003, -.25, .28); state.lastX = e.clientX; state.lastY = e.clientY; ui.label.textContent = 'MANUAL ORBIT'; return; }
  raycaster.setFromCamera(pointer, camera); const hit = raycaster.intersectObjects(targets, false)[0];
  const label = hit?.object.name || 'DRAG TO ORBIT'; ui.label.textContent = label; ui.target.textContent = hit?.object.name || 'NONE'; canvas.style.cursor = hit ? 'crosshair' : 'grab';
});
canvas.addEventListener('click', e => {
  if (state.drag) return; updatePointer(e); raycaster.setFromCamera(pointer, camera); const hit = raycaster.intersectObjects(targets, false)[0];
  if (!hit) return;
  if (hit.object === grille) transform(); else if (hit.object === matrixCore) toggleMatrix(); else if (hit.object === barrel) toggleBlaster(); else scan();
});

let wheelProgress = 0;
addEventListener('wheel', e => { if (!state.entered) return; wheelProgress = THREE.MathUtils.clamp(wheelProgress + e.deltaY * .00045, 0, 1); updateSceneFromProgress(wheelProgress); }, { passive: true });
let touchY = 0;
addEventListener('touchstart', e => touchY = e.touches[0].clientY, { passive: true });
addEventListener('touchmove', e => { const y = e.touches[0].clientY; wheelProgress = THREE.MathUtils.clamp(wheelProgress + (touchY - y) * .0014, 0, 1); touchY = y; updateSceneFromProgress(wheelProgress); }, { passive: true });

function updateSceneFromProgress(progress) {
  const names = ['arrival', 'transformation', 'commander', 'matrix'];
  const index = Math.min(3, Math.floor(progress * 4)); const name = names[index];
  if (state.scene === name) return; state.scene = name;
  document.querySelectorAll('.scene-copy').forEach(el => el.classList.toggle('active', el.dataset.copy === name));
  document.querySelectorAll('.chapter-rail button').forEach(el => el.classList.toggle('active', el.dataset.scene === name));
  document.querySelectorAll('.scene-copy.active > *').forEach((el, i) => gsap.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, delay: i * .07, duration: .55 }));
  const cameraTargets = {
    arrival: [0, 1.4, 14], transformation: [-2.2, .5, 10.5], commander: [1.5, 2.4, 9.5], matrix: [0, .2, 7.4]
  };
  const [x, y, z] = cameraTargets[name]; gsap.to(camera.position, { x, y, z, duration: 1.1, ease: 'power3.inOut' });
  if (name === 'matrix' && !state.matrixOpen) toggleMatrix();
}
document.querySelectorAll('.chapter-rail button').forEach((btn, i) => btn.addEventListener('click', () => { wheelProgress = i / 3; updateSceneFromProgress(wheelProgress); }));

const clock = new THREE.Clock();
function render() {
  const t = clock.getElapsedTime();
  if (!state.truck) {
    prime.rotation.y += ((-.22 + state.orbitY) - prime.rotation.y) * .06;
    prime.rotation.x += (state.orbitX - prime.rotation.x) * .06;
    head.rotation.y += ((pointer.x || 0) * .12 - head.rotation.y) * .025;
    head.rotation.x += (-(pointer.y || 0) * .06 - head.rotation.x) * .025;
    head.position.y += ((2.05 + Math.sin(t * 1.15) * .018) - head.position.y) * .08;
  } else {
    truckGhost.rotation.y += ((-.22 + state.orbitY) - truckGhost.rotation.y) * .06;
    truckGhost.rotation.x += (state.orbitX * .3 - truckGhost.rotation.x) * .06;
  }
  matrixCore.rotation.set(t * .7, t * 1.05, t * .35); matrixRing.rotation.z = t * 1.3;
  materials.eye.color.setHSL(.53, .9, .72 + Math.sin(t * 4) * .05);
  particles.rotation.y = t * .003; particles.position.y = Math.sin(t * .15) * .15;
  grid.position.z = (t * .35) % 1;
  renderer.render(scene, camera); requestAnimationFrame(render);
}
render();

addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.2 : 1.8)); });