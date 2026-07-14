import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = innerWidth < 768;
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.2 : 1.7));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x05070d, 0.045);
const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.1, 150);
camera.position.set(0, 0.3, 10.5);

const world = new THREE.Group();
const prime = new THREE.Group();
const atmosphere = new THREE.Group();
scene.add(world, atmosphere);
world.add(prime);
prime.position.set(2.45, -0.5, 0);
prime.rotation.y = -0.3;

const mat = {
  red: new THREE.MeshStandardMaterial({ color: 0xb91f25, metalness: 0.9, roughness: 0.22 }),
  redBright: new THREE.MeshStandardMaterial({ color: 0xe53a33, metalness: 0.86, roughness: 0.18 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x174b9d, metalness: 0.92, roughness: 0.2 }),
  silver: new THREE.MeshStandardMaterial({ color: 0xaeb9c7, metalness: 0.95, roughness: 0.17 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x090d14, metalness: 0.9, roughness: 0.3 }),
  tire: new THREE.MeshStandardMaterial({ color: 0x06070a, metalness: 0.15, roughness: 0.78 }),
  glass: new THREE.MeshPhysicalMaterial({ color: 0x7acfff, emissive: 0x114f88, emissiveIntensity: 1.7, metalness: 0.1, roughness: 0.08, transparent: true, opacity: 0.74 }),
  glow: new THREE.MeshStandardMaterial({ color: 0xb8f3ff, emissive: 0x1a9cff, emissiveIntensity: 5, metalness: 0.18, roughness: 0.06 }),
  energy: new THREE.MeshBasicMaterial({ color: 0x8be9ff, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false }),
};

const interactive = [];
function register(mesh, label, action) {
  mesh.userData.interactive = true;
  mesh.userData.label = label;
  mesh.userData.action = action;
  interactive.push(mesh);
  return mesh;
}
function box(parent, size, pos, material, rot = [0, 0, 0]) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...pos); mesh.rotation.set(...rot); parent.add(mesh); return mesh;
}
function cyl(parent, rt, rb, h, pos, material, rot = [0, 0, 0], seg = 16) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material);
  mesh.position.set(...pos); mesh.rotation.set(...rot); parent.add(mesh); return mesh;
}
function wheel(parent, pos, scale = 1) {
  const group = new THREE.Group(); group.position.set(...pos); parent.add(group);
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(.36 * scale, .36 * scale, .22 * scale, 20), mat.tire);
  tire.rotation.z = Math.PI / 2; group.add(tire);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(.18 * scale, .18 * scale, .24 * scale, 12), mat.silver);
  hub.rotation.z = Math.PI / 2; group.add(hub);
  return group;
}

// Torso / truck cab
const torso = new THREE.Group(); prime.add(torso);
const torsoCore = box(torso, [2.25, 1.65, 1.12], [0, .72, 0], mat.red);
const chestLeft = register(box(torso, [.86, 1.02, .18], [-.52, .82, .66], mat.glass, [0, .06, -.05]), 'LEFT CAB WINDOW', 'scan');
const chestRight = register(box(torso, [.86, 1.02, .18], [.52, .82, .66], mat.glass, [0, -.06, .05]), 'RIGHT CAB WINDOW', 'scan');
const grille = register(box(torso, [1.35, .38, .17], [0, .12, .68], mat.silver), 'FRONT GRILLE', 'transform');
for (let i = -2; i <= 2; i++) box(grille, [.08, .25, .05], [i * .22, 0, .12], mat.dark);
const bumper = box(torso, [1.65, .18, .24], [0, -.12, .69], mat.silver);
const shoulderLine = box(torso, [2.75, .34, 1.28], [0, 1.48, 0], mat.redBright);

const matrixPivot = new THREE.Group(); matrixPivot.position.set(0, .55, .72); torso.add(matrixPivot);
const matrix = register(new THREE.Mesh(new THREE.OctahedronGeometry(.28, 0), mat.glow), 'MATRIX CHAMBER', 'matrix');
matrix.rotation.z = Math.PI / 4; matrixPivot.add(matrix);
const matrixRing = new THREE.Mesh(new THREE.TorusGeometry(.48, .028, 10, 52), mat.glow); matrixPivot.add(matrixRing);

// Head and faceplate
const head = new THREE.Group(); head.position.set(0, 2.08, .02); prime.add(head);
box(head, [.78, .66, .72], [0, 0, 0], mat.blue);
const helmet = box(head, [.92, .24, .78], [0, .26, 0], mat.blue);
const faceplate = register(box(head, [.5, .36, .12], [0, -.08, .43], mat.silver), 'FACEPLATE', 'scan');
const eyes = register(box(head, [.45, .08, .08], [0, .12, .44], mat.glow), 'OPTIC ARRAY', 'scan');
const earL = box(head, [.16, .48, .24], [-.5, .02, 0], mat.blue, [0, 0, -.1]);
const earR = box(head, [.16, .48, .24], [.5, .02, 0], mat.blue, [0, 0, .1]);
const crest = box(head, [.12, .56, .12], [0, .58, 0], mat.silver);

// Arms
const leftArm = new THREE.Group(); const rightArm = new THREE.Group();
leftArm.position.set(-1.58, 1.2, 0); rightArm.position.set(1.58, 1.2, 0); prime.add(leftArm, rightArm);
function buildArm(arm, side) {
  const shoulder = register(box(arm, [.86, .72, 1.02], [0, 0, 0], mat.redBright, [0, 0, side * -.08]), side < 0 ? 'LEFT SHOULDER' : 'RIGHT SHOULDER', side < 0 ? 'guard' : 'blaster');
  const upper = box(arm, [.52, 1.0, .62], [side * .04, -.8, 0], mat.silver, [0, 0, side * .08]);
  const fore = box(arm, [.62, 1.08, .72], [side * .1, -1.72, .03], mat.blue, [0, 0, side * -.05]);
  const fist = box(arm, [.55, .5, .66], [side * .12, -2.42, .05], mat.dark);
  const wheelPart = wheel(arm, [side * .4, -.72, -.48], .8);
  arm.userData = { shoulder, upper, fore, fist, wheel: wheelPart, side };
}
buildArm(leftArm, -1); buildArm(rightArm, 1);

// Ion blaster
const blaster = new THREE.Group(); blaster.position.set(.35, -1.75, .42); rightArm.add(blaster);
const barrel = register(cyl(blaster, .12, .15, 1.55, [0, -.35, 0], mat.dark, [0, 0, 0], 14), 'ION BLASTER', 'blaster');
const muzzle = cyl(blaster, .18, .18, .18, [0, -1.15, 0], mat.glow, [0, 0, 0], 16);

// Waist and legs
const waist = new THREE.Group(); waist.position.set(0, -.52, 0); prime.add(waist);
box(waist, [1.5, .48, .88], [0, 0, 0], mat.blue);
box(waist, [.58, .48, .98], [0, -.28, .02], mat.silver);
const legL = new THREE.Group(); const legR = new THREE.Group();
legL.position.set(-.58, -1.08, 0); legR.position.set(.58, -1.08, 0); prime.add(legL, legR);
function buildLeg(leg, side) {
  const thigh = box(leg, [.64, 1.25, .78], [0, -.5, 0], mat.silver, [0, 0, side * .03]);
  const knee = box(leg, [.75, .5, .86], [0, -1.35, .06], mat.blue);
  const shin = box(leg, [.82, 1.42, .9], [0, -2.28, 0], mat.blue);
  const shinPlate = box(leg, [.52, .9, .12], [0, -2.22, .5], mat.silver);
  const foot = box(leg, [.92, .4, 1.38], [0, -3.16, .24], mat.dark);
  const wheelPart = wheel(leg, [side * .5, -2.4, -.48], .9);
  leg.userData = { thigh, knee, shin, shinPlate, foot, wheel: wheelPart, side };
}
buildLeg(legL, -1); buildLeg(legR, 1);

// Exhaust stacks and rear armor
const exhaustL = cyl(prime, .1, .13, 2.15, [-1.12, .95, -.58], mat.silver, [0, 0, 0], 12);
const exhaustR = cyl(prime, .1, .13, 2.15, [1.12, .95, -.58], mat.silver, [0, 0, 0], 12);
const rearL = box(prime, [.26, 1.55, .48], [-1.28, .95, -.56], mat.blue, [.12, .05, -.18]);
const rearR = box(prime, [.26, 1.55, .48], [1.28, .95, -.56], mat.blue, [.12, -.05, .18]);

// Atmosphere
for (let i = 0; i < (mobile ? 26 : 58); i++) {
  const geo = i % 3 ? new THREE.BoxGeometry(THREE.MathUtils.randFloat(.04, .18), THREE.MathUtils.randFloat(.1, .46), THREE.MathUtils.randFloat(.04, .14)) : new THREE.OctahedronGeometry(THREE.MathUtils.randFloat(.04, .13), 0);
  const shard = new THREE.Mesh(geo, i % 6 === 0 ? mat.glow : mat.dark);
  const a = Math.random() * Math.PI * 2; const r = THREE.MathUtils.randFloat(3.4, 8.5);
  shard.position.set(Math.cos(a) * r + 1.2, THREE.MathUtils.randFloat(-4.8, 5), Math.sin(a) * r - 1.8);
  shard.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  shard.userData = { speed: THREE.MathUtils.randFloat(.14, .65), baseY: shard.position.y, phase: Math.random() * 8 };
  atmosphere.add(shard);
}
const pCount = mobile ? 520 : 1250;
const p = new Float32Array(pCount * 3);
for (let i = 0; i < pCount; i++) { p[i*3]=THREE.MathUtils.randFloatSpread(28); p[i*3+1]=THREE.MathUtils.randFloatSpread(18); p[i*3+2]=THREE.MathUtils.randFloat(-15,2); }
const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(p,3));
const particles = new THREE.Points(pg,new THREE.PointsMaterial({color:0x6edcff,size:.026,transparent:true,opacity:.6,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(particles);

scene.add(new THREE.HemisphereLight(0x9bdcff, 0x03050a, 1.1));
const key = new THREE.DirectionalLight(0xa8e5ff, 5.4); key.position.set(5,7,8); scene.add(key);
const redRim = new THREE.DirectionalLight(0xff3434, 5.2); redRim.position.set(-6,2,-4); scene.add(redRim);
const blueRim = new THREE.DirectionalLight(0x2e6fff, 6.5); blueRim.position.set(6,1,-5); scene.add(blueRim);
const coreLight = new THREE.PointLight(0x4bdcff, 30, 9, 2); coreLight.position.set(2.45,.1,2.1); scene.add(coreLight);

const pointer = new THREE.Vector2(); const raycaster = new THREE.Raycaster();
let dragging=false, dragX=0, dragY=0, userRotY=0, userRotX=0, hovered=null, truckMode=false, energy=48;
const statusText=document.querySelector('.status-text'); const targetLabel=document.querySelector('.target-label'); const meter=document.querySelector('.energy-meter span');
function setStatus(text){if(statusText)statusText.textContent=text}
function setEnergy(value){energy=Math.max(0,Math.min(100,value));if(meter)meter.style.width=`${energy}%`}
function flash(power=1){if(reduceMotion)return;gsap.fromTo('.energy-flash',{opacity:.75*power},{opacity:0,duration:.7});gsap.timeline().to(matrixPivot.scale,{x:1.5+.25*power,y:1.5+.25*power,z:1.5+.25*power,duration:.16}).to(matrixPivot.scale,{x:1,y:1,z:1,duration:.7,ease:'elastic.out(1,.35)'});setEnergy(energy+12*power)}

function transformPrime(force){
  const next=typeof force==='boolean'?force:!truckMode;truckMode=next;setStatus(next?'TRUCK MODE':'ROBOT MODE');
  const t=gsap.timeline({defaults:{duration:.72,ease:'power3.inOut'}});
  if(next){
    t.to(head.position,{y:.72,z:-.15},0).to(head.scale,{x:.68,y:.68,z:.68},0)
      .to(leftArm.rotation,{x:1.32,z:-1.15,y:.18},0).to(rightArm.rotation,{x:1.32,z:1.15,y:-.18},0)
      .to(leftArm.position,{x:-1.05,y:.9,z:.2},0).to(rightArm.position,{x:1.05,y:.9,z:.2},0)
      .to(legL.rotation,{x:-1.32,z:.08},.08).to(legR.rotation,{x:-1.32,z:-.08},.08)
      .to(legL.position,{x:-.48,y:-.05,z:-.45},.08).to(legR.position,{x:.48,y:-.05,z:-.45},.08)
      .to(waist.rotation,{x:-1.15},.08).to(waist.position,{y:-.15,z:-.6},.08)
      .to([chestLeft.rotation,chestRight.rotation],{y:0,z:0},.12)
      .to(prime.rotation,{x:-.12,y:.08,z:0},0).to(prime.position,{x:1.8,y:-.45,z:-.8},0)
      .to(camera.position,{z:9.2,y:.8},0).call(()=>flash(.8),null,.35);
  }else{
    t.to(head.position,{y:2.08,z:.02},0).to(head.scale,{x:1,y:1,z:1},0)
      .to([leftArm.rotation,rightArm.rotation,legL.rotation,legR.rotation],{x:0,y:0,z:0},0)
      .to(leftArm.position,{x:-1.58,y:1.2,z:0},0).to(rightArm.position,{x:1.58,y:1.2,z:0},0)
      .to(legL.position,{x:-.58,y:-1.08,z:0},0).to(legR.position,{x:.58,y:-1.08,z:0},0)
      .to(waist.rotation,{x:0},0).to(waist.position,{y:-.52,z:0},0)
      .to(prime.rotation,{x:0,y:-.3,z:0},0).to(prime.position,{x:2.45,y:-.5,z:0},0)
      .to(camera.position,{z:10.5,y:.3},0).call(()=>flash(.8),null,.35);
  }
}
function scan(){gsap.timeline().to(head.rotation,{y:-.52,duration:.22}).to(head.rotation,{y:.52,duration:.48}).to(head.rotation,{y:0,duration:.28});gsap.fromTo('.scan-sweep',{xPercent:-140,opacity:1},{xPercent:520,opacity:0,duration:1.15});setStatus('BATTLEFIELD SCAN');setEnergy(energy+5)}
function blasterShot(){gsap.timeline().to(rightArm.rotation,{x:-1.08,z:.78,duration:.2}).to(muzzle.scale,{x:2.4,y:2.4,z:2.4,duration:.08,yoyo:true,repeat:1},.16).to(rightArm.rotation,{x:0,z:0,duration:.55,ease:'back.out(2)'});flash(.45);setStatus('ION BLASTER FIRED');setEnergy(energy-12)}
function matrixPulse(){gsap.timeline().to(chestLeft.rotation,{y:-.72,z:-.28,duration:.35}).to(chestRight.rotation,{y:.72,z:.28,duration:.35},0).to(matrixRing.rotation,{z:Math.PI*5,duration:1,ease:'none'},0).to(chestLeft.rotation,{y:.06,z:-.05,duration:.55},.75).to(chestRight.rotation,{y:-.06,z:.05,duration:.55},.75);flash(1.5);setStatus('MATRIX AWAKENED')}
function guard(){gsap.timeline().to(leftArm.rotation,{x:.65,z:-1.0,duration:.22}).to(leftArm.rotation,{x:0,z:0,duration:.65});setStatus('DEFENSIVE STANCE')}
function action(name){({transform:()=>transformPrime(),scan,blaster:blasterShot,matrix:matrixPulse,guard}[name]||(()=>{}))()}

document.querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>action(el.dataset.action)));
function updatePointer(e){pointer.x=e.clientX/innerWidth*2-1;pointer.y=-(e.clientY/innerHeight)*2+1}
canvas.addEventListener('pointerdown',e=>{dragging=true;dragX=e.clientX;dragY=e.clientY;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointerup',e=>{dragging=false;canvas.releasePointerCapture(e.pointerId);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(interactive,false)[0];if(hit)action(hit.object.userData.action)});
canvas.addEventListener('pointermove',e=>{updatePointer(e);if(dragging){userRotY+=(e.clientX-dragX)*.006;userRotX=THREE.MathUtils.clamp(userRotX+(e.clientY-dragY)*.004,-.35,.35);dragX=e.clientX;dragY=e.clientY;return}raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(interactive,false)[0];if(hit?.object!==hovered){if(hovered)gsap.to(hovered.scale,{x:1,y:1,z:1,duration:.2});hovered=hit?.object||null;if(hovered){gsap.to(hovered.scale,{x:1.08,y:1.08,z:1.08,duration:.2});targetLabel.textContent=`TARGET // ${hovered.userData.label}`;canvas.style.cursor='pointer'}else{targetLabel.textContent='DRAG TO ROTATE // CLICK ARMOR';canvas.style.cursor='grab'}}});
canvas.addEventListener('pointerleave',()=>{dragging=false;if(hovered)gsap.to(hovered.scale,{x:1,y:1,z:1,duration:.2});hovered=null});

const log=document.querySelector('.command-log');const form=document.querySelector('.command-form');const input=document.querySelector('#command-input');
function addLog(role,text){const row=document.createElement('div');row.className=role==='YOU'?'user-message':'system-message';row.innerHTML=`<b>${role}</b><span>${text}</span>`;log.appendChild(row);log.scrollTop=log.scrollHeight}
form.addEventListener('submit',e=>{e.preventDefault();const value=input.value.trim();if(!value)return;addLog('YOU',value);input.value='';const q=value.toLowerCase();let reply='Command acknowledged.';if(q.includes('transform')||q.includes('truck')||q.includes('roll out')){transformPrime();reply=truckMode?'Truck configuration engaged. Autobots, roll out.':'Robot configuration restored.'}else if(q.includes('scan')){scan();reply='Scanning terrain and identifying threats.'}else if(q.includes('matrix')){matrixPulse();reply='The Matrix chamber is responding.'}else if(q.includes('blast')||q.includes('fire')){blasterShot();reply='Ion blaster discharged.'}else if(q.includes('guard')||q.includes('defend')){guard();reply='Defensive stance engaged.'}else if(q.includes('hello')||q.includes('prime')){flash(.5);reply='I am Optimus Prime. Your command channel is secure.'}setTimeout(()=>addLog('PRIME',reply),260)});

if(!reduceMotion){
  gsap.from('.hero-copy > *',{opacity:0,y:34,duration:1,stagger:.1,ease:'power3.out',delay:.2});
  gsap.from('.site-header',{y:-90,opacity:0,duration:1,ease:'power3.out'});
  gsap.utils.toArray('.reveal').forEach(el=>gsap.fromTo(el,{opacity:0,y:65,rotateX:7},{opacity:1,y:0,rotateX:0,duration:1.05,ease:'power4.out',scrollTrigger:{trigger:el,start:'top 87%',once:true}}));
  const scrollTl=gsap.timeline({scrollTrigger:{trigger:'main',start:'top top',end:'bottom bottom',scrub:1.15}});
  scrollTl.to(prime.rotation,{y:.45,x:-.06,duration:1},0).to(prime.position,{x:2.8,y:-.85,z:-1.35,duration:1},0)
    .to(chestLeft.rotation,{y:-.55,z:-.22,duration:.55},.18).to(chestRight.rotation,{y:.55,z:.22,duration:.55},.18)
    .to(head.rotation,{y:-.35,duration:.4},.22).to([rearL.rotation,rearR.rotation],{z:0,duration:.5},.22)
    .to(prime.rotation,{y:-.85,x:.08,duration:1.1},1).to(prime.position,{x:-2.55,y:-.25,z:-2.2,duration:1.1},1)
    .to(camera.position,{x:-.4,y:.7,z:7.8,duration:1.1},1).to(matrixRing.rotation,{z:Math.PI*6,duration:1.1,ease:'none'},1)
    .to(prime.rotation,{y:.1,x:0,duration:1.1},2.1).to(prime.position,{x:2.0,y:-1.55,z:-4,duration:1.1},2.1)
    .to(camera.position,{x:.1,y:.25,z:9.4,duration:1.1},2.1);
}

const clock=new THREE.Clock();let previousScroll=scrollY,scrollVelocity=0;
addEventListener('scroll',()=>{const now=scrollY;scrollVelocity+=(now-previousScroll)*.0025;previousScroll=now},{passive:true});
function render(){
  const t=clock.getElapsedTime();scrollVelocity*=.91;
  if(!reduceMotion){world.rotation.y+=((userRotY+scrollVelocity*.04)-world.rotation.y)*.06;world.rotation.x+=((userRotX)-world.rotation.x)*.06}
  camera.lookAt(0,0,0);matrix.rotation.set(t*.7,t*1.05,Math.PI/4);matrixRing.rotation.z+=.007+Math.abs(scrollVelocity)*.06;eyes.scale.x=1+Math.sin(t*5)*.035;coreLight.intensity=28+Math.sin(t*2.8)*7+Math.abs(scrollVelocity)*35;particles.rotation.y=t*.007;
  atmosphere.children.forEach((s,i)=>{s.rotation.x+=.002*s.userData.speed;s.rotation.y+=.003*s.userData.speed;s.position.y=s.userData.baseY+Math.sin(t*s.userData.speed+s.userData.phase)*.18;s.position.x+=Math.sin(t*.22+i)*.0008});
  renderer.render(scene,camera);requestAnimationFrame(render)
}
render();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<768?1.2:1.7));ScrollTrigger.refresh()});
