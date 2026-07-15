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
const box = (p,s,pos,m,r=[0,0,0]) => { const x=new THREE.Mesh(new THREE.BoxGeometry(...s),m); x.position.set(...pos); x.rotation.set(...r); p.add(x); return x; };

// Industrial control room framing a giant exterior window.
const room = new THREE.Group(); scene.add(room);
box(room,[18,.45,6],[0,5,-1],mat.wall);
box(room,[18,.45,6],[0,-5,-1],mat.wall);
box(room,[.55,10,5],[-8.5,0,-1],mat.wall);
box(room,[.55,10,5],[8.5,0,-1],mat.wall);
for (const x of [-6.4,-3.2,3.2,6.4]) box(room,[.28,10,.5],[x,0,-2.4],mat.metal);
const desk = box(room,[12,1.2,2.4],[0,-3.9,1.2],mat.dark,[-.15,0,0]);
for(let i=0;i<5;i++) box(room,[1.8,.75,.08],[-4.2+i*2.1,-3.45,2.38],mat.screen,[-.15,0,0]);

const warningLights=[];
for(const x of [-6.8,-4.5,4.5,6.8]){const l=new THREE.PointLight(0xe7b15c,0,7,2);l.position.set(x,3.6,1);scene.add(l);warningLights.push(l);box(room,[.26,.12,.08],[x,3.8,2.35],mat.amber)}
const roomLight=new THREE.HemisphereLight(0x8ea492,0x020302,.12);scene.add(roomLight);
const deskLight=new THREE.PointLight(0xb4d0bb,0,12,2);deskLight.position.set(0,-2.5,3);scene.add(deskLight);

// The entity remains mostly hidden outside the glass.
const entity = new THREE.Group();
entity.position.set(4,-1.3,-27); entity.scale.setScalar(5.3); scene.add(entity);
const head = new THREE.Group(); head.position.set(0,2.1,0); entity.add(head);
box(head,[1.1,.9,.95],[0,0,0],mat.dark);
box(head,[.82,.58,.18],[0,-.12,.52],mat.metal);
const eyeL=box(head,[.24,.11,.06],[-.18,.12,.54],mat.cyan);
const eyeR=box(head,[.24,.11,.06],[.18,.12,.54],mat.cyan);
box(head,[.72,.4,.18],[0,-.3,.55],mat.metal);
const shoulder=box(entity,[4.4,1.4,1.8],[0,.4,-.1],mat.dark);
const eyeLight=new THREE.PointLight(0x9defff,0,24,2);eyeLight.position.set(4,8,-20);scene.add(eyeLight);

const dustGeo=new THREE.BufferGeometry();const count=mobile?500:1200;const p=new Float32Array(count*3);for(let i=0;i<count;i++){p[i*3]=THREE.MathUtils.randFloatSpread(22);p[i*3+1]=THREE.MathUtils.randFloatSpread(13);p[i*3+2]=THREE.MathUtils.randFloat(-10,4)}dustGeo.setAttribute('position',new THREE.BufferAttribute(p,3));const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0x83978b,size:.035,transparent:true,opacity:.22,depthWrite:false}));scene.add(dust);

const ui={
  calibration:document.querySelector('.calibration'),station:document.querySelector('.station'),begin:document.querySelector('.begin'),
  gpu:document.querySelector('.gpu-check'),input:document.querySelector('.input-check'),audio:document.querySelector('.audio-check'),
  lever:document.querySelector('.lever'),handle:document.querySelector('.lever-handle'),power:document.querySelector('.power-value'),
  tuner:document.querySelector('.tuner'),frequency:document.querySelector('.frequency'),signal:document.querySelector('.signal-value'),
  phase:document.querySelector('.phase'),status:document.querySelector('.status'),entity:document.querySelector('.entity-value'),
  missions:[...document.querySelectorAll('.mission')]
};
const state={entered:false,power:0,lock:0,dragging:false,pointerX:0,pointerY:0,audio:null,contact:false};

const initAudio=()=>{if(!state.audio)state.audio=new(window.AudioContext||window.webkitAudioContext)();state.audio.resume()};
const tone=(f=70,d=.4,g=.04,type='sine')=>{if(!state.audio)return;const o=state.audio.createOscillator(),v=state.audio.createGain();o.type=type;o.frequency.setValueAtTime(f,state.audio.currentTime);v.gain.setValueAtTime(g,state.audio.currentTime);v.gain.exponentialRampToValueAtTime(.001,state.audio.currentTime+d);o.connect(v).connect(state.audio.destination);o.start();o.stop(state.audio.currentTime+d)};
const flash=()=>gsap.fromTo('.flash',{opacity:.7},{opacity:0,duration:.6});
const setMission=i=>ui.missions.forEach((m,j)=>m.classList.toggle('active',i===j));

setTimeout(()=>{ui.gpu.textContent=renderer.capabilities.isWebGL2?'WEBGL2 READY':'COMPATIBLE';ui.input.textContent=('ontouchstart'in window)?'TOUCH READY':'POINTER READY';ui.audio.textContent='USER GESTURE';ui.begin.classList.add('ready')},900);
ui.begin.addEventListener('click',()=>{initAudio();state.entered=true;gsap.timeline().to('.calibration>*',{opacity:0,y:-20,stagger:.04,duration:.35}).to(ui.calibration,{opacity:0,duration:.55,onComplete:()=>ui.calibration.remove()},.15).set(ui.station,{visibility:'visible'},.2).to(ui.station,{opacity:1,duration:.65},.25);tone(42,1.2,.08,'sawtooth')});

const updatePower=value=>{
  state.power=THREE.MathUtils.clamp(value,0,100);document.documentElement.style.setProperty('--power',state.power.toFixed(0));ui.power.textContent=`${Math.round(state.power)}%`;ui.handle.setAttribute('aria-valuenow',Math.round(state.power));
  roomLight.intensity=.12+state.power*.012;deskLight.intensity=state.power*.06;warningLights.forEach((l,i)=>l.intensity=state.power>20?(1.2+Math.sin(performance.now()*.006+i)*.4)*state.power*.035:0);renderer.toneMappingExposure=.72+state.power*.006;
  if(state.power>=96&&!document.body.classList.contains('powered')){document.body.classList.add('powered');ui.phase.textContent='02 // TUNE SIGNAL';ui.status.textContent='CARRIER DETECTED';tone(95,.9,.1,'sawtooth');flash();setTimeout(()=>setMission(1),650)}
};
const leverMove=e=>{if(!state.dragging)return;const r=ui.lever.getBoundingClientRect();updatePower(((e.clientY-r.top)/r.height)*100)};
ui.handle.addEventListener('pointerdown',e=>{state.dragging=true;ui.handle.setPointerCapture(e.pointerId);initAudio();tone(55,.25,.04,'square')});
ui.handle.addEventListener('pointermove',leverMove);ui.handle.addEventListener('pointerup',e=>{state.dragging=false;ui.handle.releasePointerCapture(e.pointerId)});

ui.tuner.addEventListener('input',e=>{
  const value=+e.target.value;const target=73;const distance=Math.abs(value-target);state.lock=Math.max(0,100-distance*3.2);document.documentElement.style.setProperty('--lock',state.lock.toFixed(0));ui.frequency.textContent=`${(118.7+value*1.37).toFixed(1)}`;ui.signal.textContent=`${Math.round(state.lock)}%`;
  tone(180+value*6,.06,.012,state.lock>80?'sine':'square');
  entity.position.z=-27+state.lock*.11;eyeLight.intensity=state.lock*.16;bloom.strength=(mobile?.35:.55)+state.lock*.008;
  if(state.lock>97&&!state.contact){state.contact=true;document.body.classList.add('locked','contact');ui.phase.textContent='03 // FIRST CONTACT';ui.status.textContent='VISUAL LOCK';ui.entity.textContent='LIVING';tone(46,1.8,.12,'sawtooth');flash();gsap.to(entity.position,{x:1.8,z:-14,duration:2.2,ease:'power3.out'});setTimeout(()=>setMission(2),1300)}
});

document.querySelector('.acknowledge').addEventListener('click',()=>{tone(82,1.5,.09,'sine');ui.status.textContent='CONTACT ACKNOWLEDGED';gsap.to(head.rotation,{y:-.12,duration:.5,yoyo:true,repeat:1});gsap.to(eyeLight,{intensity:28,duration:.4,yoyo:true,repeat:1});document.querySelector('.contact-mission p').textContent='IT ACKNOWLEDGED YOU BACK'});

addEventListener('pointermove',e=>{state.pointerX=e.clientX/innerWidth*2-1;state.pointerY=-(e.clientY/innerHeight)*2+1});
const clock=new THREE.Clock();function render(){const t=clock.getElapsedTime();dust.rotation.y=t*.002;dust.position.y=Math.sin(t*.2)*.08;if(state.contact){head.rotation.y+=((state.pointerX*.16)-head.rotation.y)*.035;head.rotation.x+=((-state.pointerY*.08)-head.rotation.x)*.035;entity.position.y=-1.3+Math.sin(t*.7)*.03;eyeL.scale.x=eyeR.scale.x=1+Math.sin(t*3.5)*.04}desk.children?.forEach?.(()=>{});composer.render();requestAnimationFrame(render)}render();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.1:1.6))});