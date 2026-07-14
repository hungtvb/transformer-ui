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
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.1 : 1.65));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000107);
scene.fog = new THREE.FogExp2(0x000107, .018);
const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, .1, 360);
camera.position.set(0, 3, 28);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), mobile ? .85 : 1.45, .8, .08);
composer.addPass(bloom);

const mat = {
  red:new THREE.MeshStandardMaterial({color:0x9c0b16,metalness:.94,roughness:.18}),
  red2:new THREE.MeshStandardMaterial({color:0x330408,metalness:.96,roughness:.26}),
  blue:new THREE.MeshStandardMaterial({color:0x103f9f,metalness:.95,roughness:.16}),
  dark:new THREE.MeshStandardMaterial({color:0x020306,metalness:.98,roughness:.22}),
  silver:new THREE.MeshStandardMaterial({color:0xbcc8d5,metalness:.98,roughness:.1}),
  glass:new THREE.MeshPhysicalMaterial({color:0x164a73,emissive:0x062e57,emissiveIntensity:2.8,metalness:.3,roughness:.04,transmission:.2,transparent:true,opacity:.94}),
  glow:new THREE.MeshBasicMaterial({color:0x91f5ff,toneMapped:false}),
  energy:new THREE.MeshBasicMaterial({color:0x6beaff,transparent:true,opacity:.9,blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false})
};
const box=(p,s,pos,m,r=[0,0,0])=>{const x=new THREE.Mesh(new THREE.BoxGeometry(...s),m);x.position.set(...pos);x.rotation.set(...r);p.add(x);return x};
const cyl=(p,a,b,h,pos,m,r=[0,0,0],seg=12)=>{const x=new THREE.Mesh(new THREE.CylinderGeometry(a,b,h,seg),m);x.position.set(...pos);x.rotation.set(...r);p.add(x);return x};

// Giant Prime silhouette
const prime = new THREE.Group();
prime.scale.setScalar(4.4); prime.position.set(3,-8,-38); prime.rotation.y=-.28; scene.add(prime);
const torso=new THREE.Group();prime.add(torso);box(torso,[2.6,1.8,1.2],[0,.72,0],mat.red);box(torso,[2.1,.5,1.38],[0,.08,.12],mat.silver);
const chestL=box(torso,[.98,.98,.14],[-.61,.86,.7],mat.glass,[0,.04,-.05]);const chestR=box(torso,[.98,.98,.14],[.61,.86,.7],mat.glass,[0,-.04,.05]);
const matrix=new THREE.Group();matrix.position.set(0,.56,.8);torso.add(matrix);const matrixCore=new THREE.Mesh(new THREE.OctahedronGeometry(.34),mat.glow);matrix.add(matrixCore);const matrixRing=new THREE.Mesh(new THREE.TorusGeometry(.58,.045,10,72),mat.energy);matrix.add(matrixRing);matrix.scale.setScalar(.001);
const head=new THREE.Group();head.position.set(0,2.12,.05);prime.add(head);box(head,[.98,.8,.86],[0,0,0],mat.blue);box(head,[.75,.52,.18],[0,-.1,.48],mat.silver);const optics=box(head,[.62,.15,.09],[0,.12,.49],mat.glow);box(head,[.15,.92,.2],[-.5,.3,0],mat.blue,[0,0,-.18]);box(head,[.15,.92,.2],[.5,.3,0],mat.blue,[0,0,.18]);box(head,[.68,.4,.19],[0,-.24,.5],mat.silver);
const armL=new THREE.Group(),armR=new THREE.Group();armL.position.set(-1.78,1.32,0);armR.position.set(1.78,1.32,0);prime.add(armL,armR);
for(const [arm,side] of [[armL,-1],[armR,1]]){box(arm,[1.05,.86,1.18],[0,0,0],mat.red,[0,0,side*-.08]);cyl(arm,.4,.45,1.42,[side*.05,-1.08,0],mat.silver,[0,0,side*.1]);box(arm,[.72,1.2,.82],[side*.12,-2.04,0],mat.red2);box(arm,[.6,.58,.65],[side*.14,-2.88,.04],mat.dark)}
const pelvis=new THREE.Group();prime.add(pelvis);box(pelvis,[1.72,.6,.95],[0,-.66,0],mat.silver);box(pelvis,[2,.46,1.06],[0,-1.02,0],mat.blue);
const legL=new THREE.Group(),legR=new THREE.Group();legL.position.set(-.66,-1.34,0);legR.position.set(.66,-1.34,0);prime.add(legL,legR);
for(const [leg,side] of [[legL,-1],[legR,1]]){box(leg,[.8,1.45,.94],[0,-.58,0],mat.silver);box(leg,[.94,.65,1.08],[0,-1.55,.06],mat.blue);box(leg,[.98,1.58,1.1],[0,-2.65,0],mat.blue);box(leg,[1.1,.52,1.68],[0,-3.5,.32],mat.silver);cyl(leg,.44,.44,.28,[side*.52,-2.68,-.62],mat.dark,[Math.PI/2,0,0],22)}

// Space bridge
const portal = new THREE.Group(); portal.position.set(0,11,-68); scene.add(portal);
const portalCore = new THREE.Mesh(new THREE.CircleGeometry(15,96), new THREE.ShaderMaterial({
  transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  uniforms:{uTime:{value:0}},
  vertexShader:'varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform float uTime; varying vec2 vUv; void main(){vec2 p=vUv-.5; float r=length(p); float a=atan(p.y,p.x); float spiral=sin(a*14.-r*42.+uTime*5.); float ring=smoothstep(.5,.46,r)*smoothstep(.12,.2,r); float pulse=.45+.55*sin(uTime*3.-r*28.); vec3 c=mix(vec3(.02,.15,.65),vec3(.25,1.,1.),spiral*.5+.5); float alpha=ring*(.45+.55*spiral)*pulse; gl_FragColor=vec4(c,alpha);}'
}));portal.add(portalCore);
for(let i=0;i<5;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(13+i*1.7,.12+i*.025,8,128),mat.energy.clone());ring.material.opacity=.28-i*.035;ring.rotation.set(.08*i,.12*i,0);portal.add(ring)}

// Lightning, debris, city scale
const lightning=[];for(let i=0;i<(mobile?5:11);i++){const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3(0,-10,0)]);const l=new THREE.Line(g,new THREE.LineBasicMaterial({color:0xa8f5ff,transparent:true,opacity:0}));scene.add(l);lightning.push(l)}
const debris=new THREE.Group();scene.add(debris);for(let i=0;i<(mobile?45:110);i++){const m=new THREE.Mesh(new THREE.TetrahedronGeometry(.15+Math.random()*.5),i%5===0?mat.energy:mat.dark);m.position.set(THREE.MathUtils.randFloatSpread(50),THREE.MathUtils.randFloat(-12,20),THREE.MathUtils.randFloat(-50,5));m.userData={s:.2+Math.random()*.8,p:Math.random()*9};debris.add(m)}
const skyline=new THREE.Group();scene.add(skyline);for(let i=0;i<40;i++){const h=2+Math.random()*10;box(skyline,[1+Math.random()*2,h,1+Math.random()*2],[THREE.MathUtils.randFloatSpread(70),-15+h/2,THREE.MathUtils.randFloat(-55,-18)],mat.dark)}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(180,180),new THREE.MeshStandardMaterial({color:0x010205,metalness:.25,roughness:.9}));ground.rotation.x=-Math.PI/2;ground.position.y=-15;scene.add(ground);
const shockwave=new THREE.Mesh(new THREE.RingGeometry(.1,.5,96),new THREE.MeshBasicMaterial({color:0x8df2ff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,depthWrite:false}));shockwave.rotation.x=-Math.PI/2;shockwave.position.set(3,-14.9,-8);scene.add(shockwave);

// Atmosphere
const stars=new THREE.BufferGeometry();const count=mobile?1100:3200;const pos=new Float32Array(count*3);for(let i=0;i<count;i++){pos[i*3]=THREE.MathUtils.randFloatSpread(130);pos[i*3+1]=THREE.MathUtils.randFloat(-12,55);pos[i*3+2]=THREE.MathUtils.randFloat(-130,10)}stars.setAttribute('position',new THREE.BufferAttribute(pos,3));const particles=new THREE.Points(stars,new THREE.PointsMaterial({color:0x7ad9ff,size:.06,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}));scene.add(particles);
scene.add(new THREE.HemisphereLight(0x4c78a8,0x010102,1));const key=new THREE.DirectionalLight(0xc8eaff,7);key.position.set(8,15,10);scene.add(key);const rimR=new THREE.DirectionalLight(0xff1738,8);rimR.position.set(-12,4,-8);scene.add(rimR);const rimB=new THREE.DirectionalLight(0x2776ff,10);rimB.position.set(12,3,-12);scene.add(rimB);const portalLight=new THREE.PointLight(0x61e6ff,85,140,2);portalLight.position.copy(portal.position);scene.add(portalLight);const matrixLight=new THREE.PointLight(0x8ff3ff,0,70,2);matrixLight.position.set(3,-2,-25);scene.add(matrixLight);

const ui={gate:document.querySelector('.gate'),exp:document.querySelector('.experience'),status:document.querySelector('.status'),chapter:document.querySelector('.chapter strong'),act:document.querySelector('.chapter small'),progress:document.querySelector('.progress'),matrix:document.querySelector('.matrix-trigger')};
const state={entered:false,scene:0,drag:false,lastX:0,lastY:0,orbitX:0,orbitY:0,matrix:false};
const chapters=[['ACT I','THE SKY OPENS'],['ACT II','THE COLOSSUS'],['ACT III','GROUND ZERO'],['ACT IV','THE MATRIX'],['ACT V','UNITY']];

// Procedural sound
let audio;
function ensureAudio(){if(audio)return;audio=new (window.AudioContext||window.webkitAudioContext)()}
function rumble(freq=45,duration=1.2,gain=.16){if(!audio)return;const o=audio.createOscillator(),g=audio.createGain();o.type='sawtooth';o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(18,freq*.45),audio.currentTime+duration);g.gain.setValueAtTime(gain,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}
function zap(){if(!audio)return;for(let i=0;i<3;i++){const o=audio.createOscillator(),g=audio.createGain();o.type='square';o.frequency.setValueAtTime(900+i*330,audio.currentTime);o.frequency.exponentialRampToValueAtTime(80,audio.currentTime+.24);g.gain.setValueAtTime(.035,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.25);o.connect(g).connect(audio.destination);o.start(audio.currentTime+i*.02);o.stop(audio.currentTime+.28)}}
const whiteout=(v=1)=>gsap.fromTo('.whiteout',{opacity:.75*v},{opacity:0,duration:.75});
const hit=(power=.5)=>{document.body.classList.remove('impact');void document.body.offsetWidth;document.body.classList.add('impact');gsap.fromTo(camera.position,{x:`+=${power}`,y:`+=${power*.35}`},{x:`-=${power*2}`,y:`-=${power*.7}`,duration:.055,repeat:9,yoyo:true,ease:'none'});rumble(34,1.4,.24);navigator.vibrate?.([40,30,80])};
function lightningStrike(){const l=lightning[Math.floor(Math.random()*lightning.length)];const pts=[];let x=THREE.MathUtils.randFloatSpread(28),y=34,z=-55;for(let i=0;i<10;i++){pts.push(new THREE.Vector3(x,y,z));x+=THREE.MathUtils.randFloatSpread(3);y-=4.5;z+=THREE.MathUtils.randFloatSpread(1.2)}l.geometry.setFromPoints(pts);gsap.fromTo(l.material,{opacity:1},{opacity:0,duration:.28});zap()}
function setScene(i){state.scene=THREE.MathUtils.clamp(i,0,4);document.querySelectorAll('.title-card').forEach((e,j)=>e.classList.toggle('active',j===state.scene));ui.act.textContent=chapters[i][0];ui.chapter.textContent=chapters[i][1];ui.progress.style.width=`${(i+1)*20}%`;document.querySelectorAll('.title-card.active>*').forEach((el,j)=>gsap.fromTo(el,{opacity:0,y:34,rotateX:8},{opacity:1,y:0,rotateX:0,delay:j*.08,duration:.65,ease:'power3.out'}));ui.matrix.classList.toggle('visible',i===3&&!state.matrix);
 if(i===0){ui.status.textContent='UNSTABLE';gsap.to(camera.position,{x:0,y:3,z:28,duration:1.5});gsap.to(prime.position,{x:3,y:-8,z:-38,duration:1.5});}
 if(i===1){ui.status.textContent='MASSIVE CONTACT';gsap.to(camera.position,{x:-9,y:2,z:34,duration:1.8,ease:'power3.inOut'});gsap.to(prime.position,{x:3,y:-8,z:-22,duration:2,ease:'power3.out'});for(let k=0;k<4;k++)setTimeout(lightningStrike,k*220);whiteout(.55);rumble(55,1.8,.18)}
 if(i===2){ui.status.textContent='IMPACT';gsap.timeline().to(prime.position,{y:-6.5,duration:.45,ease:'power2.in'}).to(prime.position,{y:-8,duration:.16,ease:'power4.out'}).add(()=>{shockwave.material.opacity=1;shockwave.scale.setScalar(.1);gsap.to(shockwave.scale,{x:70,y:70,z:70,duration:1.3,ease:'power2.out'});gsap.to(shockwave.material,{opacity:0,duration:1.2});whiteout(.85);hit(.65);for(let k=0;k<6;k++)setTimeout(lightningStrike,k*100)},.42);gsap.to(camera.position,{x:-5,y:-9,z:24,duration:1.2})}
 if(i===3){ui.status.textContent='AWAITING MATRIX';gsap.to(camera.position,{x:0,y:-1,z:14,duration:1.6,ease:'power3.inOut'})}
 if(i===4){ui.status.textContent='AUTOBOT COMMAND';gsap.to(camera.position,{x:18,y:8,z:34,duration:2,ease:'power3.inOut'});gsap.to(prime.rotation,{y:.4,duration:1.8});whiteout(.35)}
}
function awakenMatrix(){if(state.matrix)return;state.matrix=true;ui.matrix.textContent='MATRIX AWAKENED';document.body.classList.add('matrix-awake');gsap.timeline().to(chestL.position,{x:-1.12,duration:.65}).to(chestR.position,{x:1.12,duration:.65},0).to(matrix.scale,{x:1,y:1,z:1,duration:.55,ease:'back.out(2)'},.2).to(matrixLight,{intensity:150,duration:.5},.22).to(bloom,{strength:3.1,duration:.45},.22).add(()=>{whiteout(1);hit(.45);rumble(70,2,.22);for(let k=0;k<8;k++)setTimeout(lightningStrike,k*90)},.4).to(bloom,{strength:mobile?.85:1.45,duration:1.5},1)}
function enter(){if(state.entered)return;state.entered=true;ensureAudio();audio.resume();rumble(65,2,.12);gsap.timeline().to('.gate>*',{opacity:0,y:-28,stagger:.05,duration:.45}).to(ui.gate,{opacity:0,duration:.7,onComplete:()=>ui.gate.remove()},.25).set(ui.exp,{visibility:'visible'},.3).to(ui.exp,{opacity:1,duration:.8},.35).fromTo(portal.scale,{x:.05,y:.05,z:.05},{x:1,y:1,z:1,duration:1.8,ease:'expo.out'},.25).add(()=>{whiteout(.7);for(let k=0;k<5;k++)setTimeout(lightningStrike,k*160)},1.1).add(()=>setScene(0),1.2)}

document.querySelector('.start').addEventListener('click',enter);document.querySelector('.advance').addEventListener('click',()=>setScene((state.scene+1)%5));
let chargeTimer;ui.matrix.addEventListener('pointerdown',()=>{let v=0;ui.matrix.style.setProperty('--charge','0%');chargeTimer=setInterval(()=>{v+=4;ui.matrix.style.setProperty('--charge',`${v}%`);ui.matrix.textContent=`MATRIX CHARGE ${v}%`;if(v>=100){clearInterval(chargeTimer);awakenMatrix()}},45)});const cancel=()=>{if(!state.matrix){clearInterval(chargeTimer);ui.matrix.textContent='HOLD TO AWAKEN MATRIX';ui.matrix.style.setProperty('--charge','0%')}};ui.matrix.addEventListener('pointerup',cancel);ui.matrix.addEventListener('pointerleave',cancel);
let wheelLock=false;addEventListener('wheel',e=>{if(!state.entered||wheelLock)return;wheelLock=true;setScene(state.scene+(e.deltaY>0?1:-1));setTimeout(()=>wheelLock=false,850)},{passive:true});let touchY=0;addEventListener('touchstart',e=>touchY=e.touches[0].clientY,{passive:true});addEventListener('touchend',e=>{const y=e.changedTouches[0].clientY;if(Math.abs(touchY-y)>48)setScene(state.scene+(touchY>y?1:-1))},{passive:true});
canvas.addEventListener('pointerdown',e=>{state.drag=true;state.lastX=e.clientX;state.lastY=e.clientY});canvas.addEventListener('pointerup',()=>state.drag=false);canvas.addEventListener('pointermove',e=>{if(!state.drag)return;state.orbitY+=(e.clientX-state.lastX)*.0025;state.orbitX=THREE.MathUtils.clamp(state.orbitX+(e.clientY-state.lastY)*.0016,-.15,.15);state.lastX=e.clientX;state.lastY=e.clientY});

const clock=new THREE.Clock();function render(){const t=clock.getElapsedTime();portalCore.material.uniforms.uTime.value=t;portal.rotation.z=t*.04;portal.children.slice(1).forEach((r,i)=>{r.rotation.z=t*(.06+i*.015)*(i%2?-1:1);r.scale.setScalar(1+Math.sin(t*1.4+i)*.025)});prime.rotation.y+=((-.28+state.orbitY)-prime.rotation.y)*.035;prime.rotation.x+=(state.orbitX-prime.rotation.x)*.035;head.position.y=2.12+Math.sin(t*1.1)*.025;optics.scale.x=1+Math.sin(t*5)*.04;matrixCore.rotation.set(t*.8,t*1.2,t*.4);matrixRing.rotation.z=t*1.5;debris.children.forEach((d,i)=>{d.rotation.x+=.003*d.userData.s;d.rotation.y+=.004*d.userData.s;d.position.y+=Math.sin(t*d.userData.s+d.userData.p)*.0015});particles.rotation.y=t*.0015;composer.render();requestAnimationFrame(render)}render();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);composer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<760?1.1:1.65))});