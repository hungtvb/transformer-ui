import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.innerWidth < 768;
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x03050a, 0.048);
const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 0.25, 10);

const world = new THREE.Group();
const mech = new THREE.Group();
const shards = new THREE.Group();
const energySystem = new THREE.Group();
scene.add(world, shards, energySystem);
world.add(mech);
mech.position.set(2.35, -0.45, 0);
mech.rotation.y = -0.3;

const metal = new THREE.MeshStandardMaterial({ color: 0x192334, metalness: 0.94, roughness: 0.22 });
const darkMetal = new THREE.MeshStandardMaterial({ color: 0x050911, metalness: 0.9, roughness: 0.34 });
const blueMetal = new THREE.MeshStandardMaterial({ color: 0x124cc0, metalness: 0.92, roughness: 0.18 });
const glow = new THREE.MeshStandardMaterial({ color: 0x8bf2ff, emissive: 0x008dff, emissiveIntensity: 5, metalness: 0.2, roughness: 0.08 });
const hotGlow = new THREE.MeshBasicMaterial({ color: 0xbff8ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });

function box(parent, size, position, material, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
}
function cylinder(parent, rt, rb, height, position, material, rotation = [0, 0, 0], segments = 10) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, height, segments), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
}

const torso = new THREE.Group();
mech.add(torso);
box(torso, [2.25, 1.75, 1.15], [0, 0.75, 0], metal);
const shoulderBar = box(torso, [2.65, 0.42, 1.4], [0, 1.43, 0], blueMetal);
box(torso, [1.75, 0.5, 1.32], [0, 0.2, 0.03], darkMetal);
const chestL = box(torso, [0.72, 1.2, 0.28], [-0.56, 0.77, 0.72], blueMetal, [0.03, 0.05, -0.18]);
const chestR = box(torso, [0.72, 1.2, 0.28], [0.56, 0.77, 0.72], blueMetal, [0.03, -0.05, 0.18]);

const corePivot = new THREE.Group();
corePivot.position.set(0, 0.72, 0.72);
torso.add(corePivot);
const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), glow);
core.rotation.z = Math.PI / 4;
corePivot.add(core);
const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.59, 0.035, 10, 56), glow);
corePivot.add(coreRing);
const coreHalo = new THREE.Mesh(new THREE.RingGeometry(0.72, 0.9, 64), hotGlow);
coreHalo.position.z = -0.06;
corePivot.add(coreHalo);

const head = new THREE.Group();
head.position.set(0, 2.04, 0.02);
mech.add(head);
box(head, [0.92, 0.74, 0.8], [0, 0, 0], metal);
const crown = box(head, [1.02, 0.22, 0.84], [0, 0.2, 0.01], blueMetal);
const visor = box(head, [0.55, 0.12, 0.09], [0, 0.03, 0.43], glow);
box(head, [0.2, 0.48, 0.26], [-0.53, 0.02, 0], darkMetal, [0, 0, -0.18]);
box(head, [0.2, 0.48, 0.26], [0.53, 0.02, 0], darkMetal, [0, 0, 0.18]);
const antenna = box(head, [0.13, 0.64, 0.14], [0, 0.54, 0], blueMetal);

const leftArm = new THREE.Group();
const rightArm = new THREE.Group();
leftArm.position.set(-1.65, 1.18, 0);
rightArm.position.set(1.65, 1.18, 0);
mech.add(leftArm, rightArm);
[leftArm, rightArm].forEach((arm, index) => {
  const side = index === 0 ? -1 : 1;
  arm.userData.side = side;
  arm.userData.shoulder = box(arm, [0.9, 0.72, 1.05], [0, 0, 0], blueMetal, [0, 0, side * -0.08]);
  arm.userData.forearm = cylinder(arm, 0.38, 0.38, 1.45, [side * 0.05, -1.02, 0], metal, [0, 0, side * 0.12]);
  arm.userData.fist = box(arm, [0.58, 0.72, 0.64], [side * 0.12, -1.85, 0], darkMetal, [0, 0, side * 0.08]);
  arm.userData.blade = box(arm, [0.18, 0.9, 0.22], [side * 0.44, -0.88, 0.4], glow, [0, 0, side * 0.1]);
});

cylinder(mech, 0.7, 0.82, 0.55, [0, -0.38, 0], darkMetal, [0, 0, 0], 8);
const hip = box(mech, [1.5, 0.5, 0.9], [0, -0.76, 0], blueMetal);
const legL = new THREE.Group();
const legR = new THREE.Group();
legL.position.set(-0.62, -1.08, 0);
legR.position.set(0.62, -1.08, 0);
mech.add(legL, legR);
[legL, legR].forEach((leg, index) => {
  const side = index === 0 ? -1 : 1;
  leg.userData.side = side;
  leg.userData.thigh = box(leg, [0.72, 1.45, 0.88], [0, -0.55, 0], metal, [0, 0, side * 0.04]);
  leg.userData.knee = box(leg, [0.84, 0.64, 1.02], [0, -1.5, 0.05], blueMetal, [0, 0, side * 0.03]);
  leg.userData.shin = box(leg, [0.86, 1.35, 0.96], [0, -2.45, 0], darkMetal, [0, 0, side * -0.03]);
  leg.userData.foot = box(leg, [0.95, 0.42, 1.5], [0, -3.2, 0.28], metal);
  leg.userData.strip = box(leg, [0.12, 0.9, 0.18], [side * 0.3, -2.35, 0.51], glow);
});

const finL = box(mech, [0.25, 1.65, 0.5], [-1.18, 1.0, -0.54], darkMetal, [0.18, 0.05, -0.26]);
const finR = box(mech, [0.25, 1.65, 0.5], [1.18, 1.0, -0.54], darkMetal, [0.18, -0.05, 0.26]);

for (let i = 0; i < (isMobile ? 24 : 52); i += 1) {
  const geometry = i % 3 === 0 ? new THREE.OctahedronGeometry(THREE.MathUtils.randFloat(0.04, 0.14), 0) : new THREE.BoxGeometry(THREE.MathUtils.randFloat(0.04, 0.2), THREE.MathUtils.randFloat(0.12, 0.5), THREE.MathUtils.randFloat(0.04, 0.15));
  const shard = new THREE.Mesh(geometry, i % 6 === 0 ? glow : metal);
  const angle = Math.random() * Math.PI * 2;
  const radius = THREE.MathUtils.randFloat(3, 8);
  shard.position.set(Math.cos(angle) * radius + 1.2, THREE.MathUtils.randFloat(-4.8, 4.8), Math.sin(angle) * radius - 1.8);
  shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  shard.userData = { speed: THREE.MathUtils.randFloat(0.15, 0.7), baseY: shard.position.y, phase: Math.random() * 10 };
  shards.add(shard);
}

const particleCount = isMobile ? 550 : 1200;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  positions[i * 3] = THREE.MathUtils.randFloatSpread(28);
  positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(18);
  positions[i * 3 + 2] = THREE.MathUtils.randFloat(-14, 2);
}
const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({ color: 0x62ddff, size: 0.027, transparent: true, opacity: 0.62, blending: THREE.AdditiveBlending, depthWrite: false }));
scene.add(particles);

for (let i = 0; i < (isMobile ? 2 : 5); i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2 + i * 0.55, 0.012, 6, 90), hotGlow.clone());
  ring.material.opacity = 0.11 - i * 0.012;
  ring.rotation.set(Math.PI / 2 + i * 0.17, i * 0.34, 0);
  ring.position.set(2.2, -0.2, -1.5 - i * 0.4);
  ring.userData.speed = 0.18 + i * 0.05;
  energySystem.add(ring);
}

scene.add(new THREE.HemisphereLight(0x8ed8ff, 0x03050a, 1.15));
const keyLight = new THREE.DirectionalLight(0x9eeaff, 5.6); keyLight.position.set(5, 7, 7); scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0x245cff, 7); rimLight.position.set(-7, 2, -4); scene.add(rimLight);
const coreLight = new THREE.PointLight(0x43ddff, 32, 9, 2); coreLight.position.set(2.35, 0.35, 2.2); scene.add(coreLight);

const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener('pointermove', (e) => {
  pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
  pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
});

function pulseCore() {
  if (reduceMotion) return;
  gsap.timeline()
    .to(corePivot.scale, { x: 1.75, y: 1.75, z: 1.75, duration: 0.18, ease: 'power3.out' })
    .to(corePivot.scale, { x: 1, y: 1, z: 1, duration: 0.7, ease: 'elastic.out(1, .35)' })
    .fromTo('.scanlines', { opacity: 0.22 }, { opacity: 0.04, duration: 0.55 }, 0);
}
document.querySelectorAll('.button-primary, .brand-mark').forEach((el) => el.addEventListener('pointerenter', pulseCore));

if (!reduceMotion) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: 'main', start: 'top top', end: 'bottom bottom', scrub: 1.15 },
  });
  tl
    .to(mech.rotation, { y: 0.48, x: -0.08, duration: 1 }, 0)
    .to(mech.position, { x: 2.9, y: -0.9, z: -1.5, duration: 1 }, 0)
    .to(camera.position, { z: 8.2, x: 0.35, duration: 1 }, 0)
    .to(leftArm.rotation, { z: -0.58, x: 0.42, y: -0.18, duration: 0.7 }, 0.08)
    .to(rightArm.rotation, { z: 0.58, x: -0.35, y: 0.18, duration: 0.7 }, 0.08)
    .to(chestL.rotation, { y: -0.75, z: -0.42, duration: 0.5 }, 0.18)
    .to(chestR.rotation, { y: 0.75, z: 0.42, duration: 0.5 }, 0.18)
    .to(finL.rotation, { z: -0.78, y: -0.3, duration: 0.55 }, 0.24)
    .to(finR.rotation, { z: 0.78, y: 0.3, duration: 0.55 }, 0.24)
    .to(head.rotation, { y: -0.52, x: 0.1, duration: 0.45 }, 0.3)
    .to(antenna.scale, { y: 1.45, duration: 0.35 }, 0.34)
    .to(coreHalo.scale, { x: 1.8, y: 1.8, duration: 0.5 }, 0.34)
    .to(coreHalo.material, { opacity: 0.18, duration: 0.5 }, 0.34)

    .to(mech.rotation, { y: -0.95, x: 0.12, z: -0.03, duration: 1.15 }, 1)
    .to(mech.position, { x: -2.7, y: -0.18, z: -2.4, duration: 1.15 }, 1)
    .to(camera.position, { x: -0.5, y: 0.65, z: 7.3, duration: 1.15 }, 1)
    .to(shoulderBar.scale, { x: 1.24, duration: 0.5 }, 1.08)
    .to(hip.rotation, { y: Math.PI * 0.45, duration: 0.6 }, 1.05)
    .to(legL.rotation, { z: 0.2, x: -0.18, duration: 0.65 }, 1.12)
    .to(legR.rotation, { z: -0.2, x: 0.14, duration: 0.65 }, 1.12)
    .to(legL.userData.knee.position, { z: 0.42, duration: 0.45 }, 1.2)
    .to(legR.userData.knee.position, { z: 0.42, duration: 0.45 }, 1.2)
    .to(coreRing.rotation, { z: Math.PI * 7, duration: 1.1, ease: 'none' }, 1)
    .to(core.scale, { x: 1.8, y: 1.8, z: 1.8, duration: 0.25, yoyo: true, repeat: 1 }, 1.45)

    .to(mech.rotation, { y: 0.18, x: 0, z: 0, duration: 1.15 }, 2.1)
    .to(mech.position, { x: 2.15, y: -1.65, z: -4.1, duration: 1.15 }, 2.1)
    .to(camera.position, { x: 0.15, y: 0.15, z: 9.2, duration: 1.15 }, 2.1)
    .to([leftArm.rotation, rightArm.rotation, legL.rotation, legR.rotation], { x: 0, y: 0, z: 0, duration: 0.9 }, 2.1)
    .to(chestL.rotation, { y: 0.05, z: -0.18, duration: 0.8 }, 2.1)
    .to(chestR.rotation, { y: -0.05, z: 0.18, duration: 0.8 }, 2.1)
    .to(coreHalo.scale, { x: 3.2, y: 3.2, duration: 0.8 }, 2.35)
    .to(coreHalo.material, { opacity: 0, duration: 0.8 }, 2.35);
}

const revealElements = gsap.utils.toArray('.reveal');
revealElements.forEach((element) => {
  gsap.fromTo(element, { opacity: 0, y: 70, rotateX: 8 }, {
    opacity: 1, y: 0, rotateX: 0, duration: reduceMotion ? 0.01 : 1.05, ease: 'power4.out',
    scrollTrigger: { trigger: element, start: 'top 87%', once: true },
  });
});

gsap.from('.hero-copy > *', { opacity: 0, y: 34, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.25 });
gsap.from('.site-header', { y: -90, opacity: 0, duration: 1, ease: 'power3.out' });

document.querySelectorAll('.system-card').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    if (reduceMotion || isMobile) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(card, { rotateY: x * 8, rotateX: y * -8, transformPerspective: 900, duration: 0.35, ease: 'power2.out' });
  });
  card.addEventListener('pointerleave', () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' }));
});

const terminalText = 'Understood. Reconfiguring ideas into systems, interfaces, and experiences built for what comes next.';
const typingTarget = document.querySelector('.typing-text');
let hasTyped = false;
new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting || hasTyped) return;
  hasTyped = true;
  let i = 0;
  const tick = () => {
    typingTarget.textContent = terminalText.slice(0, i++);
    if (i <= terminalText.length) setTimeout(tick, reduceMotion ? 2 : 22);
  };
  tick();
}, { threshold: 0.45 }).observe(document.querySelector('.terminal'));

const clock = new THREE.Clock();
let previousScroll = window.scrollY;
let scrollVelocity = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  scrollVelocity += (current - previousScroll) * 0.0025;
  previousScroll = current;
}, { passive: true });

function render() {
  const t = clock.getElapsedTime();
  pointer.x += (pointer.tx - pointer.x) * 0.045;
  pointer.y += (pointer.ty - pointer.y) * 0.045;
  scrollVelocity *= 0.91;

  if (!reduceMotion) {
    world.rotation.y += ((pointer.x * 0.05 + scrollVelocity * 0.06) - world.rotation.y) * 0.05;
    world.rotation.x += ((pointer.y * -0.028) - world.rotation.x) * 0.05;
    camera.position.x += ((pointer.x * 0.16) - camera.position.x) * 0.025;
    camera.position.y += ((0.22 - pointer.y * 0.1) - camera.position.y) * 0.025;
  }
  camera.lookAt(0, 0, 0);

  core.rotation.set(t * 0.72, t * 1.1, Math.PI / 4);
  coreRing.rotation.z += 0.008 + Math.abs(scrollVelocity) * 0.08;
  coreHalo.rotation.z -= 0.002;
  coreLight.intensity = 30 + Math.sin(t * 2.7) * 8 + Math.abs(scrollVelocity) * 42;
  glow.emissiveIntensity = 4.6 + Math.sin(t * 3.1) * 0.8;
  head.position.y = 2.04 + Math.sin(t * 1.2) * 0.022;
  visor.scale.x = 1 + Math.sin(t * 5.5) * 0.035;
  particles.rotation.y = t * 0.008;
  particles.position.z = Math.sin(t * 0.22) * 0.4;

  shards.children.forEach((shard, i) => {
    shard.rotation.x += 0.002 * shard.userData.speed;
    shard.rotation.y += 0.0035 * shard.userData.speed;
    shard.position.y = shard.userData.baseY + Math.sin(t * shard.userData.speed + shard.userData.phase) * 0.18;
    shard.position.x += Math.sin(t * 0.25 + i) * 0.0009;
  });
  energySystem.children.forEach((ring, i) => {
    ring.rotation.z = t * ring.userData.speed * (i % 2 ? -1 : 1);
    ring.scale.setScalar(1 + Math.sin(t * 0.9 + i) * 0.04);
  });

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.75));
  ScrollTrigger.refresh();
});
