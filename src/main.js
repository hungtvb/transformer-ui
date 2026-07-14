import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05070d, 0.055);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.2, 9.5);

const world = new THREE.Group();
scene.add(world);

const metal = new THREE.MeshStandardMaterial({
  color: 0x1b2432,
  metalness: 0.92,
  roughness: 0.24,
});
const darkMetal = new THREE.MeshStandardMaterial({
  color: 0x070b12,
  metalness: 0.88,
  roughness: 0.34,
});
const glow = new THREE.MeshStandardMaterial({
  color: 0x57dcff,
  emissive: 0x008dff,
  emissiveIntensity: 4,
  metalness: 0.25,
  roughness: 0.12,
});
const blueMetal = new THREE.MeshStandardMaterial({
  color: 0x164fbf,
  metalness: 0.9,
  roughness: 0.2,
});

const mech = new THREE.Group();
world.add(mech);
mech.position.set(2.35, -0.4, 0);
mech.rotation.y = -0.28;

function addBox(parent, size, position, material, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
}

function addCylinder(parent, radiusTop, radiusBottom, height, position, material, rotation = [0, 0, 0], radialSegments = 8) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  parent.add(mesh);
  return mesh;
}

// Torso and armor silhouette
addBox(mech, [2.25, 1.75, 1.15], [0, 0.75, 0], metal, [0, 0, 0]);
addBox(mech, [2.6, 0.42, 1.38], [0, 1.43, 0], blueMetal, [0, 0, -0.02]);
addBox(mech, [1.75, 0.5, 1.32], [0, 0.2, 0.03], darkMetal);
addBox(mech, [0.7, 1.2, 0.28], [-0.55, 0.77, 0.72], blueMetal, [0.03, 0.05, -0.18]);
addBox(mech, [0.7, 1.2, 0.28], [0.55, 0.77, 0.72], blueMetal, [0.03, -0.05, 0.18]);

// Core
const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), glow);
core.position.set(0, 0.72, 0.72);
core.rotation.z = Math.PI / 4;
mech.add(core);
const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.035, 10, 48), glow);
coreRing.position.copy(core.position);
mech.add(coreRing);

// Head
const head = new THREE.Group();
head.position.set(0, 2.04, 0.02);
mech.add(head);
addBox(head, [0.92, 0.74, 0.8], [0, 0, 0], metal);
addBox(head, [1.02, 0.22, 0.84], [0, 0.2, 0.01], blueMetal);
addBox(head, [0.55, 0.12, 0.09], [0, 0.03, 0.43], glow);
addBox(head, [0.2, 0.48, 0.26], [-0.53, 0.02, 0], darkMetal, [0, 0, -0.18]);
addBox(head, [0.2, 0.48, 0.26], [0.53, 0.02, 0], darkMetal, [0, 0, 0.18]);
addBox(head, [0.13, 0.64, 0.14], [0, 0.54, 0], blueMetal);

// Shoulders and arms
const leftArm = new THREE.Group();
const rightArm = new THREE.Group();
leftArm.position.set(-1.65, 1.18, 0);
rightArm.position.set(1.65, 1.18, 0);
mech.add(leftArm, rightArm);

[leftArm, rightArm].forEach((arm, index) => {
  const side = index === 0 ? -1 : 1;
  addBox(arm, [0.9, 0.72, 1.05], [0, 0, 0], blueMetal, [0, 0, side * -0.08]);
  addCylinder(arm, 0.38, 0.38, 1.45, [side * 0.05, -1.02, 0], metal, [0, 0, side * 0.12], 10);
  addBox(arm, [0.58, 0.72, 0.64], [side * 0.12, -1.85, 0], darkMetal, [0, 0, side * 0.08]);
  addBox(arm, [0.18, 0.9, 0.22], [side * 0.44, -0.88, 0.4], glow, [0, 0, side * 0.1]);
});

// Waist and legs
addCylinder(mech, 0.7, 0.82, 0.55, [0, -0.38, 0], darkMetal, [0, 0, 0], 8);
addBox(mech, [1.5, 0.5, 0.9], [0, -0.76, 0], blueMetal);
const legL = new THREE.Group();
const legR = new THREE.Group();
legL.position.set(-0.62, -1.08, 0);
legR.position.set(0.62, -1.08, 0);
mech.add(legL, legR);
[legL, legR].forEach((leg, index) => {
  const side = index === 0 ? -1 : 1;
  addBox(leg, [0.72, 1.45, 0.88], [0, -0.55, 0], metal, [0, 0, side * 0.04]);
  addBox(leg, [0.84, 0.64, 1.02], [0, -1.5, 0.05], blueMetal, [0, 0, side * 0.03]);
  addBox(leg, [0.86, 1.35, 0.96], [0, -2.45, 0], darkMetal, [0, 0, side * -0.03]);
  addBox(leg, [0.95, 0.42, 1.5], [0, -3.2, 0.28], metal);
  addBox(leg, [0.12, 0.9, 0.18], [side * 0.3, -2.35, 0.51], glow);
});

// Back fins
addBox(mech, [0.25, 1.65, 0.5], [-1.18, 1.0, -0.54], darkMetal, [0.18, 0.05, -0.26]);
addBox(mech, [0.25, 1.65, 0.5], [1.18, 1.0, -0.54], darkMetal, [0.18, -0.05, 0.26]);

// Decorative floating machine parts
const shards = new THREE.Group();
world.add(shards);
for (let i = 0; i < 34; i += 1) {
  const geometry = i % 3 === 0
    ? new THREE.OctahedronGeometry(THREE.MathUtils.randFloat(0.04, 0.13), 0)
    : new THREE.BoxGeometry(
      THREE.MathUtils.randFloat(0.04, 0.18),
      THREE.MathUtils.randFloat(0.12, 0.45),
      THREE.MathUtils.randFloat(0.04, 0.14),
    );
  const mesh = new THREE.Mesh(geometry, i % 5 === 0 ? glow : metal);
  const angle = Math.random() * Math.PI * 2;
  const radius = THREE.MathUtils.randFloat(3.2, 7.2);
  mesh.position.set(Math.cos(angle) * radius + 1.3, THREE.MathUtils.randFloat(-4.5, 4.5), Math.sin(angle) * radius - 1.5);
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  mesh.userData.speed = THREE.MathUtils.randFloat(0.15, 0.55);
  shards.add(mesh);
}

// Star/data field
const particleCount = window.innerWidth < 700 ? 450 : 900;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i += 1) {
  positions[i * 3] = THREE.MathUtils.randFloatSpread(24);
  positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(16);
  positions[i * 3 + 2] = THREE.MathUtils.randFloat(-10, 2);
}
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({ color: 0x65dfff, size: 0.025, transparent: true, opacity: 0.58 }),
);
scene.add(particles);

// Lighting
scene.add(new THREE.HemisphereLight(0x8acfff, 0x06070b, 1.15));
const keyLight = new THREE.DirectionalLight(0x8acfff, 5.5);
keyLight.position.set(5, 7, 7);
scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0x286cff, 6);
rimLight.position.set(-7, 2, -4);
scene.add(rimLight);
const coreLight = new THREE.PointLight(0x42dfff, 28, 8, 2);
coreLight.position.set(2.35, 0.35, 2.2);
scene.add(coreLight);

// Mouse parallax
const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener('pointermove', (event) => {
  pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
  pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
});

// Scroll transformation sequence
const mechTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: 'main',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.1,
  },
});
mechTimeline
  .to(mech.rotation, { y: 0.55, x: -0.08, duration: 1 }, 0)
  .to(mech.position, { x: 2.8, y: -0.9, z: -1.4, duration: 1 }, 0)
  .to(leftArm.rotation, { z: -0.38, x: 0.26, duration: 1 }, 0.18)
  .to(rightArm.rotation, { z: 0.38, x: -0.2, duration: 1 }, 0.18)
  .to(head.rotation, { y: -0.42, duration: 0.8 }, 0.2)
  .to(mech.rotation, { y: -0.75, x: 0.1, duration: 1 }, 1)
  .to(mech.position, { x: -2.6, y: -0.15, z: -2.1, duration: 1 }, 1)
  .to(core.scale, { x: 1.55, y: 1.55, z: 1.55, duration: 0.5, yoyo: true, repeat: 1 }, 1.12)
  .to(coreRing.rotation, { z: Math.PI * 5, duration: 1 }, 1)
  .to(mech.rotation, { y: 0.18, x: 0, duration: 1 }, 2)
  .to(mech.position, { x: 2.2, y: -1.7, z: -4, duration: 1 }, 2)
  .to(leftArm.rotation, { z: 0.08, x: 0, duration: 1 }, 2)
  .to(rightArm.rotation, { z: -0.08, x: 0, duration: 1 }, 2)
  .to(head.rotation, { y: 0.18, duration: 1 }, 2);

// Reveal system
const revealElements = gsap.utils.toArray('.reveal');
revealElements.forEach((element) => {
  gsap.to(element, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 86%',
      once: true,
    },
  });
});

gsap.from('.hero-copy > *', {
  opacity: 0,
  y: 34,
  duration: 1,
  stagger: 0.1,
  ease: 'power3.out',
  delay: 0.25,
});
gsap.from('.site-header', { y: -90, opacity: 0, duration: 1, ease: 'power3.out' });

// Terminal typing effect
const terminalText = 'Understood. Reconfiguring ideas into systems, interfaces, and experiences built for what comes next.';
const typingTarget = document.querySelector('.typing-text');
let hasTyped = false;
const typingObserver = new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting || hasTyped) return;
  hasTyped = true;
  let index = 0;
  const typeNext = () => {
    typingTarget.textContent = terminalText.slice(0, index);
    index += 1;
    if (index <= terminalText.length) window.setTimeout(typeNext, 24);
  };
  typeNext();
}, { threshold: 0.45 });
typingObserver.observe(document.querySelector('.terminal'));

const clock = new THREE.Clock();
function render() {
  const elapsed = clock.getElapsedTime();
  pointer.x += (pointer.tx - pointer.x) * 0.045;
  pointer.y += (pointer.ty - pointer.y) * 0.045;

  world.rotation.y = pointer.x * 0.045;
  world.rotation.x = pointer.y * -0.025;
  camera.position.x = pointer.x * 0.12;
  camera.position.y = 0.2 - pointer.y * 0.08;
  camera.lookAt(0, 0, 0);

  core.rotation.y = elapsed * 1.1;
  core.rotation.x = elapsed * 0.72;
  coreRing.rotation.z += 0.004;
  coreLight.intensity = 25 + Math.sin(elapsed * 2.4) * 6;
  head.position.y = 2.04 + Math.sin(elapsed * 1.15) * 0.018;
  particles.rotation.y = elapsed * 0.006;

  shards.children.forEach((shard, index) => {
    shard.rotation.x += 0.002 * shard.userData.speed;
    shard.rotation.y += 0.003 * shard.userData.speed;
    shard.position.y += Math.sin(elapsed * shard.userData.speed + index) * 0.0008;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
});
