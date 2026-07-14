import './style.css';
import './interactions.css';
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
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 120);
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

const interactiveMeshes = [];
function register(mesh, label, action) {
  mesh.userData.interactive = true;
  mesh.userData.label = label;
  mesh.userData.action = action;
  interactiveMeshes.push(mesh);
  return mesh;
}
function box(parent, size, position, material, rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position); mesh.rotation.set(...rotation); parent.add(mesh); return mesh;
}
function cylinder(parent, rt, rb, h, position, material, rotation = [0, 0, 0], segments = 10) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, segments), material);
  mesh.position.set(...position); mesh.rotation.set(...rotation); parent.add(mesh); return mesh;
}

const torso = new THREE.Group(); mech.add(torso);
box(torso, [2.25, 1.75, 1.15], [0, 0.75, 0], metal);
const shoulderBar = box(torso, [2.65, 0.42, 1.4], [0, 1.43, 0], blueMetal);
box(torso, [1.75, 0.5, 1.32], [0, 0.2, 0.03], darkMetal);
const chestL = box(torso, [0.72, 1.2, 0.28], [-0.56, 0.77, 0.72], blueMetal, [0.03, 0.05, -0.18]);
const chestR = box(torso, [0.72, 1.2, 0.28], [0.56, 0.77, 0.72], blueMetal, [0.03, -0.05, 0.18]);

const corePivot = new THREE.Group(); corePivot.position.set(0, 0.72, 0.72); torso.add(corePivot);
const core = register(new THREE.Mesh(new THREE.OctahedronGeometry(0.38, 0), glow), 'NEURAL CORE', 'charge');
core.rotation.z = Math.PI / 4; corePivot.add(core);
const coreRing = new THREE.Mesh(new THREE.TorusGeometry(0.59, 0.035, 10, 56), glow); corePivot.add(coreRing);
const coreHalo = new THREE.Mesh(new THREE.RingGeometry(0.72, 0.9, 64), hotGlow); coreHalo.position.z = -0.06; corePivot.add(coreHalo);

const head = new THREE.Group(); head.position.set(0, 2.04, 0.02); mech.add(head);
box(head, [0.92, 0.74, 0.8], [0, 0, 0], metal);
box(head, [1.02, 0.22, 0.84], [0, 0.2, 0.01], blueMetal);
const visor = register(box(head, [0.55, 0.12, 0.09], [0, 0.03, 0.43], glow), 'VISION ARRAY', 'scan');
box(head, [0.2, 0.48, 0.26], [-0.53, 0.02, 0], darkMetal, [0, 0, -0.18]);
box(head, [0.2, 0.48, 0.26], [0.53, 0.02, 0], darkMetal, [0, 0, 0.18]);
const antenna = box(head, [0.13, 0.64, 0.14], [0, 0.54, 0], blueMetal);

const leftArm = new THREE.Group(); const rightArm = new THREE.Group();
leftArm.position.set(-1.65, 1.18, 0); rightArm.position.set(1.65, 1.18, 0); mech.add(leftArm, rightArm);
[leftArm, rightArm].forEach((arm, i) => {
  const side = i === 0 ? -1 : 1;
  register(box(arm, [0.9, 0.72, 1.05], [0, 0, 0], blueMetal, [0, 0, side * -0.08]), side < 0 ? 'LEFT ARM' : 'RIGHT ARM', side < 0 ? 'guard' : 'strike');
  cylinder(arm, 0.38, 0.38, 1.45, [side * 0.05, -1.02, 0], metal, [0, 0, side * 0.12]);
  box(arm, [0.58, 0.72, 0.64], [side * 0.12, -1.85, 0], darkMetal, [0, 0, side * 0.08]);
  box(arm, [0.18, 0.9, 0.22], [side * 0.44, -0.88, 0.4], glow, [0, 0, side * 0.1]);
});

cylinder(mech, 0.7, 0.82, 0.55, [0, -0.38, 0], darkMetal, [0, 0, 0], 8);
const hip = box(mech, [1.5, 0.5, 0.9], [0, -0.76, 0], blueMetal);
const legL = new THREE.Group(); const legR = new THREE.Group();
legL.position.set(-0.62, -1.08, 0); legR.position.set(0.62, -1.08, 0); mech.add(legL, legR);
[legL, legR].forEach((leg, i) => {
  const side = i === 0 ? -1 : 1;
  box(leg, [0.72, 1.45, 0.88], [0, -0.55, 0], metal, [0, 0, side * 0.04]);
  box(leg, [0.84, 0.64, 1.02], [0, -1.5, 0.05], blueMetal, [0, 0, side * 0.03]);
  box(leg, [0.86, 1.35, 0.96], [0, -2.45, 0], darkMetal, [0, 0, side * -0.03]);
  box(leg, [0.95, 0.42, 1.5], [0, -3.2, 0.28], metal);
  box(leg, [0.12, 0.9, 0.18], [side * 0.3, -2.35, 0.51], glow);
});
const finL = box(mech, [0.25, 1.65, 0.5], [-1.18, 1.0, -0.54], darkMetal, [0.18, 0.05, -0.26]);
const finR = box(mech, [0.25, 1.65, 0.5], [1.18, 1.0, -0.54], darkMetal, [0.18, -0.05, 0.26]);

for (let i = 0; i < (isMobile ? 24 : 52); i++) {
  const geometry = i % 3 === 0 ? new THREE.OctahedronGeometry(THREE.MathUtils.randFloat(0.04, 0.14), 0) : new THREE.BoxGeometry(THREE.MathUtils.randFloat(0.04, 0.2), THREE.MathUtils.randFloat(0.12, 0.5), THREE.MathUtils.randFloat(0.04, 0.15));
  const shard = new THREE.Mesh(geometry, i % 6 === 0 ? glow : metal);
  const angle = Math.random() * Math.PI * 2; const radius = THREE.MathUtils.randFloat(3, 8);
  shard.position.set(Math.cos(angle) * radius + 1.2, THREE.MathUtils.randFloat(-4.8, 4.8), Math.sin(angle) * radius - 1.8);
  shard.userData = { speed: THREE.MathUtils.randFloat(0.15, 0.7), baseY: shard.position.y, phase: Math.random() * 10 };
  shards.add(shard);
}
const particleCount = isMobile ? 550 : 1200;
const positions = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) { positions[i*3]=THREE.MathUtils.randFloatSpread(28); positions[i*3+1]=THREE.MathUtils.randFloatSpread(18); positions[i*3+2]=THREE.MathUtils.randFloat(-14,2); }
const particleGeometry = new THREE.BufferGeometry(); particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(particleGeometry, new THREE.PointsMaterial({ color: 0x62ddff, size: 0.027, transparent: true, opacity: 0.62, blending: THREE.AdditiveBlending, depthWrite: false })); scene.add(particles);
for (let i = 0; i < (isMobile ? 2 : 5); i++) { const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2+i*.55,.012,6,90), hotGlow.clone()); ring.material.opacity=.11-i*.012; ring.rotation.set(Math.PI/2+i*.17,i*.34,0); ring.position.set(2.2,-.2,-1.5-i*.4); ring.userData.speed=.18+i*.05; energySystem.add(ring); }

scene.add(new THREE.HemisphereLight(0x8ed8ff, 0x03050a, 1.15));
const keyLight = new THREE.DirectionalLight(0x9eeaff, 5.6); keyLight.position.set(5,7,7); scene.add(keyLight);
const rimLight = new THREE.DirectionalLight(0x245cff, 7); rimLight.position.set(-7,2,-4); scene.add(rimLight);
const coreLight = new THREE.PointLight(0x43ddff, 32, 9, 2); coreLight.position.set(2.35,.35,2.2); scene.add(coreLight);

const pointer = new THREE.Vector2(); const raycaster = new THREE.Raycaster();
let hovered = null; let dragging = false; let dragX = 0; let dragY = 0; let userRotationY = 0; let userRotationX = 0; let charge = 34;
const hint = document.querySelector('.interaction-hint');
const status = document.querySelector('.live-status');
const meter = document.querySelector('.charge-fill');
function setStatus(text) { if (status) status.textContent = text; }
function updateCharge(amount) { charge = Math.max(0, Math.min(100, charge + amount)); if (meter) meter.style.width = `${charge}%`; document.documentElement.style.setProperty('--charge', charge/100); }
function pulseCore(power = 1) { if (reduceMotion) return; updateCharge(10*power); gsap.timeline().to(corePivot.scale,{x:1.5+.3*power,y:1.5+.3*power,z:1.5+.3*power,duration:.16}).to(corePivot.scale,{x:1,y:1,z:1,duration:.65,ease:'elastic.out(1,.35)'}); gsap.fromTo('.reactor-flash',{opacity:.8},{opacity:0,duration:.55}); }
function executeAction(action) {
  const actions = {
    charge: () => { pulseCore(1.4); setStatus('CORE OVERCHARGE'); },
    scan: () => { gsap.timeline().to(head.rotation,{y:-.55,duration:.25}).to(head.rotation,{y:.55,duration:.5}).to(head.rotation,{y:0,duration:.3}); gsap.fromTo('.scan-sweep',{xPercent:-120,opacity:1},{xPercent:120,opacity:0,duration:1.1}); setStatus('AREA SCAN COMPLETE'); },
    strike: () => { gsap.timeline().to(rightArm.rotation,{x:-1.15,z:.85,duration:.18}).to(rightArm.rotation,{x:0,z:0,duration:.55,ease:'back.out(2)'}); pulseCore(.5); setStatus('KINETIC STRIKE'); },
    guard: () => { gsap.timeline().to(leftArm.rotation,{x:.7,z:-1.05,duration:.22}).to(leftArm.rotation,{x:0,z:0,duration:.7,ease:'power3.out'}); setStatus('DEFENSE MATRIX'); },
  }; actions[action]?.();
}
function updatePointer(e) { pointer.x = e.clientX/innerWidth*2-1; pointer.y = -(e.clientY/innerHeight)*2+1; }
canvas.style.pointerEvents = 'auto';
canvas.addEventListener('pointermove', e => {
  updatePointer(e);
  if (dragging) { userRotationY += (e.clientX-dragX)*.006; userRotationX = THREE.MathUtils.clamp(userRotationX+(e.clientY-dragY)*.004,-.35,.35); dragX=e.clientX; dragY=e.clientY; return; }
  raycaster.setFromCamera(pointer,camera); const hit = raycaster.intersectObjects(interactiveMeshes,false)[0]?.object || null;
  if (hit !== hovered) { if (hovered) gsap.to(hovered.scale,{x:1,y:1,z:1,duration:.2}); hovered=hit; canvas.classList.toggle('is-targeting',!!hit); if (hit) { gsap.to(hit.scale,{x:1.15,y:1.15,z:1.15,duration:.2}); hint.textContent=`CLICK // ${hit.userData.label}`; } else hint.textContent='DRAG TO ROTATE // CLICK COMPONENTS'; }
});
canvas.addEventListener('pointerdown', e => { dragging=true; dragX=e.clientX; dragY=e.clientY; canvas.setPointerCapture(e.pointerId); canvas.classList.add('is-dragging'); });
canvas.addEventListener('pointerup', e => { dragging=false; canvas.releasePointerCapture(e.pointerId); canvas.classList.remove('is-dragging'); if (hovered) executeAction(hovered.userData.action); });

const modeButtons = document.querySelectorAll('[data-mode]');
modeButtons.forEach(btn => btn.addEventListener('click', () => {
  modeButtons.forEach(b=>b.classList.remove('active')); btn.classList.add('active'); const mode=btn.dataset.mode;
  if(mode==='combat'){ glow.emissive.setHex(0xff3b70); coreLight.color.setHex(0xff1f5a); gsap.to([finL.rotation,finR.rotation],{z:(i)=>i?1:-1,duration:.45}); setStatus('COMBAT MODE'); }
  else if(mode==='analysis'){ glow.emissive.setHex(0x00c8ff); coreLight.color.setHex(0x43ddff); gsap.to([finL.rotation,finR.rotation],{z:(i)=>i?.78:-.78,duration:.45}); setStatus('ANALYSIS MODE'); }
  else { glow.emissive.setHex(0x7d4dff); coreLight.color.setHex(0x9b6cff); gsap.to(mech.rotation,{z:.08,duration:.45,yoyo:true,repeat:1}); setStatus('CREATIVE MODE'); }
  pulseCore(.8);
}));

document.querySelector('.charge-button')?.addEventListener('click',()=>pulseCore(1.7));
const form=document.querySelector('.command-form'); const input=document.querySelector('.command-input'); const log=document.querySelector('.command-log');
const responses={scan:'Scanning environment. No hostile intent detected.',transform:'Transformation protocol synchronized.',create:'Creative forge online. Describe what should be built.',hello:'Neural link established. Hello, operator.'};
form?.addEventListener('submit',e=>{ e.preventDefault(); const value=input.value.trim(); if(!value)return; const key=Object.keys(responses).find(k=>value.toLowerCase().includes(k)); const response=responses[key]||`Command received: “${value}”. Reconfiguring systems now.`; log.innerHTML+=`<div><b>YOU</b><span>${value.replace(/[<>]/g,'')}</span></div><div class="ai"><b>GPT</b><span>${response}</span></div>`; log.scrollTop=log.scrollHeight; input.value=''; pulseCore(.9); setStatus('COMMAND EXECUTED'); if(key==='transform') gsap.to(mech.rotation,{y:mech.rotation.y+Math.PI*2,duration:1.4,ease:'power3.inOut'}); if(key==='scan') executeAction('scan'); });

if (!reduceMotion) {
  const tl=gsap.timeline({scrollTrigger:{trigger:'main',start:'top top',end:'bottom bottom',scrub:1.1}});
  tl.to(mech.position,{x:2.9,y:-.9,z:-1.5,duration:1},0).to(chestL.rotation,{y:-.72,z:-.4,duration:.5},.2).to(chestR.rotation,{y:.72,z:.4,duration:.5},.2).to(finL.rotation,{z:-.78,y:-.3,duration:.55},.25).to(finR.rotation,{z:.78,y:.3,duration:.55},.25).to(mech.position,{x:-2.6,y:-.2,z:-2.4,duration:1},1).to(hip.rotation,{y:Math.PI*.45,duration:.6},1).to(coreRing.rotation,{z:Math.PI*7,duration:1},1).to(mech.position,{x:2.15,y:-1.65,z:-4,duration:1},2).to(chestL.rotation,{y:.05,z:-.18,duration:.8},2).to(chestR.rotation,{y:-.05,z:.18,duration:.8},2);
}
gsap.utils.toArray('.reveal').forEach(el=>gsap.fromTo(el,{opacity:0,y:60},{opacity:1,y:0,duration:reduceMotion?.01:1,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 87%',once:true}}));
gsap.from('.hero-copy > *',{opacity:0,y:34,duration:1,stagger:.1,ease:'power3.out',delay:.25});

const clock=new THREE.Clock(); let previousScroll=scrollY; let scrollVelocity=0;
addEventListener('scroll',()=>{const current=scrollY;scrollVelocity+=(current-previousScroll)*.0025;previousScroll=current;},{passive:true});
function render(){
  const t=clock.getElapsedTime(); scrollVelocity*=.91;
  world.rotation.y += (userRotationY-world.rotation.y)*.08; world.rotation.x += (userRotationX-world.rotation.x)*.08;
  camera.lookAt(0,0,0); core.rotation.set(t*.72,t*1.1,Math.PI/4); coreRing.rotation.z+=.008+Math.abs(scrollVelocity)*.08; coreHalo.rotation.z-=.002;
  coreLight.intensity=30+Math.sin(t*2.7)*8+charge*.2; glow.emissiveIntensity=4.6+Math.sin(t*3.1)*.8+charge*.015; head.position.y=2.04+Math.sin(t*1.2)*.022;
  particles.rotation.y=t*.008; particles.position.x += ((pointer.x*.25)-particles.position.x)*.02; particles.position.y += ((pointer.y*.18)-particles.position.y)*.02;
  shards.children.forEach((s,i)=>{s.rotation.x+=.002*s.userData.speed;s.rotation.y+=.0035*s.userData.speed;s.position.y=s.userData.baseY+Math.sin(t*s.userData.speed+s.userData.phase)*.18;s.position.x+=Math.sin(t*.25+i)*.0009;});
  energySystem.children.forEach((r,i)=>{r.rotation.z=t*r.userData.speed*(i%2?-1:1);r.scale.setScalar(1+Math.sin(t*.9+i)*.04);});
  renderer.render(scene,camera); requestAnimationFrame(render);
}
render();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<768?1.25:1.75));ScrollTrigger.refresh();});