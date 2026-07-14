import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

const mobile = innerWidth < 760;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.15 : 1.7));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x010205);
scene.fog = new THREE.FogExp2(0x010205, .026);
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 240);
camera.position.set(0, 2.8, 5.2);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), mobile ? .7 : 1.15, .7, .12);
composer.addPass(bloom);

const root = new THREE.Group(); scene.add(root);
const mat = {
  red:new THREE.MeshStandardMaterial({color:0x9b0c17,metalness:.92,roughness:.2}),
  red2:new THREE.MeshStandardMaterial({color:0x3b0509,metalness:.95,roughness:.28}),
  blue:new THREE.MeshStandardMaterial({color:0x103f99,metalness:.94,roughness:.18}),
  dark:new THREE.MeshStandardMaterial({color:0x030507,metalness:.96,roughness:.24}),
  silver:new THREE.MeshStandardMaterial({color:0xb6c2d0,metalness:.98,roughness:.12}),
  glass:new THREE.MeshPhysicalMaterial({color:0x174b70,emissive:0x06365e,emissiveIntensity:2.2,metalness:.35,roughness:.06,transmission:.16,transparent:true,opacity:.92}),
  glow:new THREE.MeshBasicMaterial({color:0x8cf1ff,toneMapped:false}),
  energy:new THREE.MeshBasicMaterial({color:0x77e9ff,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false})
};
const box=(p,s,pos,m,r=[0,0,0])=>{const x=new THREE.Mesh(new THREE.BoxGeometry(...s),m);x.position.set(...pos);x.rotation.set(...r);p.add(x);return x};
const cyl=(p,a,b,h,pos,m,r=[0,0,0],seg=12)=>{const x=new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,seg),m);x.position.set(...pos);x.rotation.set(...r);p.add(x);return x};

const prime = new THREE.Group(); prime.scale.setScalar(2.9); prime.position.set(1.8,-4.8,-7); root.add(prime);
const torso=new THREE.Group();prime.add(torso);box(torso,[2.5,1.7,1.15],[0,.7,0],mat.red);box(torso,[2.05,.48,1.35],[0,.08,.12],mat.silver);
const chestL=box(torso,[.94,.95,.13],[-.58,.84,.66],mat.glass,[0,.04,-.05]);const chestR=box(torso,[.94,.95,.13],[.58,.84,.66],mat.glass,[0,-.04,.05]);
const matrix=new THREE.Group();matrix.position.set(0,.55,.76);torso.add(matrix);const matrixCore=new THREE.Mesh(new THREE.OctahedronGeometry(.3),mat.glow);matrix.add(matrixCore);const ring=new THREE.Mesh(new THREE.TorusGeometry(.52,.04,8,64),mat.energy);matrix.add(ring);matrix.scale.setScalar(.001);
const head=new THREE.Group();head.position.set(0,2.04,.04);prime.add(head);box(head,[.94,.76,.82],[0,0,0],mat.blue);box(head,[.72,.5,.16],[0,-.09,.45],mat.silver);box(head,[.58,.14,.08],[0,.11,.46],mat.glow);box(head,[.14,.88,.18],[-.48,.28,0],mat.blue,[0,0,-.18]);box(head,[.14,.88,.18],[.48,.28,0],mat.blue,[0,0,.18]);box(head,[.64,.38,.18],[0,-.22,.48],mat.silver);
const armL=new THREE.Group(),armR=new THREE.Group();armL.position.set(-1.72,1.28,0);armR.position.set(1.72,1.28,0);prime.add(armL,armR);
for(const [arm,side] of [[armL,-1],[armR,1]]){box(arm,[1,.82,1.12],[0,0,0],mat.red,[0,0,side*-.08]);cyl(arm,.38,.42,1.35,[side*.05,-1.03,0],mat.silver,[0,0,side*.1]);box(arm,[.68,1.15,.78],[side*.12,-1.96,0],mat.red2);box(arm,[.56,.55,.62],[side*.14,-2.78,.03],mat.dark)}
const pelvis=new THREE.Group();prime.add(pelvis);box(pelvis,[1.65,.58,.92],[0,-.62,0],mat.silver);box(pelvis,[1.92,.44,1.02],[0,-.98,0],mat.blue);
const legL=new THREE.Group(),legR=new THREE.Group();legL.position.set(-.64,-1.28,0);legR.position.set(.64,-1.28,0);prime.add(legL,legR);
for(const [leg,side] of [[legL,-1],[legR,1]]){box(leg,[.76,1.38,.9],[0,-.55,0],mat.silver);box(leg,[.9,.62,1.04],[0,-1.48,.05],mat.blue);box(leg,[.94,1.52,1.05],[0,-2.52,0],mat.blue);box(leg,[1.05,.5,1.62],[0,-3.34,.3],mat.silver);cyl(leg,.42,.42,.26,[side*.5,-2.55,-.58],mat.dark,[Math.PI/2,0,0],20)}
const blaster=new THREE.Group();blaster.position.set(.32,-2.7,.12);armR.add(blaster);cyl(blaster,.2,.26,2.2,[0,-.9,.35],mat.dark,[Math.PI/2,0,0],16);const muzzle=new THREE.Mesh(new THREE.RingGeometry(.12,.32,32),mat.energy);muzzle.position.set(0,-.9,1.5);blaster.add(muzzle);blaster.scale.setScalar(.001);

const ground=new THREE.Mesh(new THREE.PlaneGeometry(140,140),new THREE.MeshStandardMaterial({color:0x020305,metalness:.3,roughness:.85}));ground.rotation.x=-Math.PI/2;ground.position.y=-14;scene.add(ground);
const grid=new THREE.GridHelper(120,80,0x164a6d,0x071421);grid.position.y=-13.95;grid.material.transparent=true;grid.material.opacity=.2;scene.add(grid);

const stars=new THREE.BufferGeometry();const count=mobile?900:2200;const p=new Float32Array(count*3);for(let i=0;i<count;i++){p[i*3]=THREE.MathUtils.randFloatSpread(90);p[i*3+1]=THREE.MathUtils.randFloat(-12,40);p[i*3+2]=THREE.MathUtils.randFloat(-80,10)}stars.setAttribute('position',new THREE.BufferAttribute(p,3));const particles=new THREE.Points(stars,new THREE.PointsMaterial({color:0x74cfff,size:.05,transparent:true,opacity:.5,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(particles);

const sparks=[];for(let i=0;i<(mobile?60:140);i++){const s=new THREE.Mesh(new THREE.SphereGeometry(.025,5,5),mat.energy);s.visible=false;scene.add(s);sparks.push(s)}
function burst(origin=new THREE.Vector3(0,-8,0),n=70){sparks.slice(0,n).forEach((s,i)=>{s.visible=true;s.position.copy(origin);const a=Math.random()*Math.PI*2,v=2+Math.random()*7;gsap.fromTo(s.position,{x:origin.x,y:origin.y,z:origin.z},{x:origin.x+Math.cos(a)*v,y:origin.y+Math.random()*7,z:origin.z+Math.sin(a)*v,duration:.65+Math.random()*.9,ease:'power2.out',onComplete:()=>s.visible=false});gsap.fromTo(s.material,{opacity:1},{opacity:0,duration:.8})})}

scene.add(new THREE.HemisphereLight(0x527da9,0x020203,1.2));const key=new THREE.DirectionalLight(0xc1e6ff,6);key.position.set(6,12,8);scene.add(key);const red=new THREE.DirectionalLight(0xff1735,7);red.position.set(-8,2,-6);scene.add(red);const blue=new THREE.DirectionalLight(0x236fff,8);blue.position.set(8,1,-8);scene.add(blue);const coreLight=new THREE.PointLight(0x6feaff,0,35,2);coreLight.position.set(1.8,-1,-2);scene.add(coreLight);

const state={entered:false,scene:0,drag:false,lastX:0,lastY:0,orbitX:0,orbitY:0,matrix:false,charging:false};
const names=['eye','rise','step','matrix','final'];const chapters=['01 // AWAKENING','02 // REVEAL','03 // IMPACT','04 // MATRIX','05 // UNITY'];
const ui={gate:document.querySelector('.gate'),exp:document.querySelector('.experience'),chapter:document.querySelector('.chapter')};
const flash=(v=1)=>gsap.fromTo('.flash',{opacity:.8*v},{opacity:0,duration:.7});
const shake=(power=.25)=>gsap.fromTo(camera.position,{x:`+=${power}`},{x:`-=${power*2}`,duration:.06,repeat:7,yoyo:true,ease:'none'});
function showScene(i){state.scene=THREE.MathUtils.clamp(i,0,4);document.querySelectorAll('.copy').forEach((e,j)=>e.classList.toggle('active',j===state.scene));document.querySelectorAll('.sequence button').forEach((e,j)=>e.classList.toggle('active',j===state.scene));ui.chapter.textContent=chapters[state.scene];document.querySelectorAll('.copy.active>*').forEach((el,j)=>gsap.fromTo(el,{opacity:0,y:28},{opacity:1,y:0,delay:j*.07,duration:.55}));
 const cams=[[0,2.85,5.1],[0,2.2,22],[-5,-6,18],[0,-1,13],[11,5,24]][state.scene];gsap.to(camera.position,{x:cams[0],y:cams[1],z:cams[2],duration:1.5,ease:'power3.inOut'});
 if(state.scene===1){gsap.to(prime.position,{x:1.8,y:-4.8,z:-7,duration:1.4});}
 if(state.scene===2){gsap.timeline().to(prime.position,{y:-4.2,duration:.45,ease:'power2.in'}).to(prime.position,{y:-4.8,duration:.18,ease:'power4.out'}).add(()=>{burst(new THREE.Vector3(1.8,-13.8,-4),mobile?45:100);flash(.8);shake(.38)},.42)}
 if(state.scene===3&&!state.matrix) activateMatrix();
 if(state.scene===4){gsap.to(prime.rotation,{y:.42,duration:1.4});}
}
function enter(){if(state.entered)return;state.entered=true;gsap.timeline().to('.gate>*',{opacity:0,y:-22,stagger:.05,duration:.45}).to(ui.gate,{opacity:0,duration:.6,onComplete:()=>ui.gate.remove()},.2).set(ui.exp,{visibility:'visible'},.25).to(ui.exp,{opacity:1,duration:.7},.3).fromTo(head.scale,{x:.2,y:.2,z:.2},{x:1,y:1,z:1,duration:1.1,ease:'back.out(1.8)'},.35).add(()=>{flash(.65);showScene(0)},.7)}
function activateMatrix(){if(state.matrix)return;state.matrix=true;gsap.timeline().to(chestL.position,{x:-1.05,duration:.55}).to(chestR.position,{x:1.05,duration:.55},0).to(matrix.scale,{x:1,y:1,z:1,duration:.5,ease:'back.out(2)'},.18).to(coreLight,{intensity:80,duration:.45},.2).to(bloom,{strength:2.1,duration:.45},.2).add(()=>{flash(1);shake(.32);burst(new THREE.Vector3(1.8,-1,-4),mobile?45:100)},.35).to(bloom,{strength:mobile?.7:1.15,duration:1.2},.7)}
function slash(){blaster.scale.setScalar(1);gsap.timeline().to(armR.rotation,{x:-.8,z:.45,duration:.35}).add(()=>{document.querySelector('.slash').style.opacity=1;gsap.fromTo('.slash',{xPercent:-120,opacity:1},{xPercent:120,opacity:0,duration:.5,ease:'power4.in'});flash(.65);shake(.28);burst(new THREE.Vector3(4,-4,-2),mobile?35:80)},.28).to(armR.rotation,{x:0,z:0,duration:.7,ease:'back.out(1.7)'},.5)}

document.querySelector('.start').addEventListener('click',enter);document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>showScene(+b.dataset.jump)));document.querySelector('[data-action="advance"]').addEventListener('click',()=>showScene((state.scene+1)%5));document.querySelector('[data-action="slash"]').addEventListener('click',slash);
const matrixBtn=document.querySelector('[data-action="matrix"]');let holdTimer;matrixBtn.addEventListener('pointerdown',()=>{state.charging=true;matrixBtn.textContent='CHARGING 0%';let v=0;holdTimer=setInterval(()=>{v+=5;matrixBtn.textContent=`CHARGING ${v}%`;if(v>=100){clearInterval(holdTimer);matrixBtn.textContent='MATRIX ACTIVE';activateMatrix()}},40)});const cancel=()=>{if(state.charging&&!state.matrix){clearInterval(holdTimer);matrixBtn.textContent='HOLD MATRIX'}state.charging=false};matrixBtn.addEventListener('pointerup',cancel);matrixBtn.addEventListener('pointerleave',cancel);

let wheelLock=false;addEventListener('wheel',e=>{if(!state.entered||wheelLock)return;wheelLock=true;showScene(state.scene+(e.deltaY>0?1:-1));setTimeout(()=>wheelLock=false,800)},{passive:true});let touchY=0;addEventListener('touchstart',e=>touchY=e.touches[0].clientY,{passive:true});addEventListener('touchend',e=>{const y=e.changedTouches[0].clientY;if(Math.abs(touchY-y)>45)showScene(state.scene+(touchY>y?1:-1))},{passive:true});
canvas.addEventListener('pointerdown',e=>{state.drag=true;state.lastX=e.clientX;state.lastY=e.clientY});canvas.addEventListener('pointerup',()=>state.drag=false);canvas.addEventListener('pointermove',e=>{if(!state.drag)return;state.orbitY+=(e.clientX-state.lastX)*.003;state.orbitX=THREE.MathUtils.clamp(state.orbitX+(e.clientY-state.lastY)*.002,-.18,.18);state.lastX=e.clientX;state.lastY=e.clientY});

const clock=new THREE.Clock();function render(){const t=clock.getElapsedTime();prime.rotation.y+=((-.22+state.orbitY)-prime.rotation.y)*.035;prime.rotation.x+=(state.orbitX-prime.rotation.x)*.035;head.position.y=2.04+Math.sin(t*1.2)*.025;matrixCore.rotation.set(t*.8,t*1.2,t*.4);ring.rotation.z=t*1.4;muzzle.rotation.z=t*3;particles.rotation.y=t*.002;grid.position.z=(t*.45)%1;composer.render();requestAnimationFrame(render)}render();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.15:1.7))});