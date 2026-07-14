import { gsap } from 'gsap';

const root = document.createElement('div');
root.className = 'spectacle';
root.innerHTML = `
  <canvas class="fx-canvas"></canvas>
  <div class="cinema-bars"></div>
  <div class="shockwave"></div>
  <div class="glitch-flash"></div>
  <div class="lightning"></div>
  <div class="matrix-charge">
    <div class="matrix-charge-label"><span>HOLD TO AWAKEN MATRIX</span><b>0%</b></div>
    <div class="matrix-charge-track"><div class="matrix-charge-fill"></div></div>
  </div>
  <div class="cinematic-toast"></div>
  <div class="mobile-swipe-cue">SWIPE TO ORBIT // TAP SYSTEMS</div>
`;
document.body.appendChild(root);

const canvas = root.querySelector('.fx-canvas');
const ctx = canvas.getContext('2d');
const shockwave = root.querySelector('.shockwave');
const glitch = root.querySelector('.glitch-flash');
const lightning = root.querySelector('.lightning');
const toast = root.querySelector('.cinematic-toast');
const chargeWrap = root.querySelector('.matrix-charge');
const chargeFill = root.querySelector('.matrix-charge-fill');
const chargeValue = root.querySelector('.matrix-charge-label b');

let sparks = [];
let pointerX = innerWidth * .5;
let pointerY = innerHeight * .5;
let lastX = pointerX;
let lastY = pointerY;
let charging = false;
let charge = 0;
let chargeRaf = 0;

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 1.5);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
addEventListener('resize', resize);

function retrigger(el, className) {
  el.classList.remove(className);
  void el.offsetWidth;
  el.classList.add(className);
}

function heroToast(text) {
  toast.textContent = text;
  retrigger(toast, 'show');
}

function impact(kind = 'impact') {
  retrigger(shockwave, 'fire');
  retrigger(glitch, 'fire');
  if (kind === 'matrix' || kind === 'transform') retrigger(lightning, 'fire');
  root.classList.add('cinematic');
  setTimeout(() => root.classList.remove('cinematic'), kind === 'transform' ? 1250 : 700);
}

function spawnSparks(x, y, power = 1) {
  const count = Math.min(22, 4 + Math.floor(power * 12));
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.2 + Math.random() * 4.5 * power;
    sparks.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: .018 + Math.random() * .035,
      size: .7 + Math.random() * 2.2,
    });
  }
}

addEventListener('pointermove', (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  const velocity = Math.hypot(pointerX - lastX, pointerY - lastY);
  if (velocity > 8) spawnSparks(pointerX, pointerY, Math.min(1.6, velocity / 30));
  lastX = pointerX;
  lastY = pointerY;
}, { passive: true });

function animateFx() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  ctx.globalCompositeOperation = 'lighter';
  sparks = sparks.filter((spark) => spark.life > 0);
  sparks.forEach((spark) => {
    spark.x += spark.vx;
    spark.y += spark.vy;
    spark.vx *= .97;
    spark.vy = spark.vy * .97 + .025;
    spark.life -= spark.decay;
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, spark.size * spark.life, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(120,225,255,${spark.life})`;
    ctx.fill();
  });
  requestAnimationFrame(animateFx);
}
animateFx();

function stopCharge(cancelled = false) {
  if (!charging) return;
  charging = false;
  cancelAnimationFrame(chargeRaf);
  if (charge >= 100 && !cancelled) {
    impact('matrix');
    heroToast('LIGHT OUR\nDARKEST HOUR');
    spawnSparks(innerWidth * .5, innerHeight * .5, 2.4);
  }
  gsap.to(chargeWrap, { opacity: 0, duration: .25, onComplete: () => chargeWrap.classList.remove('visible') });
  charge = 0;
  chargeFill.style.width = '0%';
  chargeValue.textContent = '0%';
}

function chargeTick() {
  if (!charging) return;
  charge = Math.min(100, charge + 1.7);
  chargeFill.style.width = `${charge}%`;
  chargeValue.textContent = `${Math.round(charge)}%`;
  if (charge >= 100) {
    const matrixButton = document.querySelector('[data-action="matrix"]');
    matrixButton?.click();
    stopCharge(false);
    return;
  }
  chargeRaf = requestAnimationFrame(chargeTick);
}

const matrixButton = document.querySelector('[data-action="matrix"]');
if (matrixButton) {
  matrixButton.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    charging = true;
    charge = 0;
    chargeWrap.classList.add('visible');
    gsap.to(chargeWrap, { opacity: 1, duration: .2 });
    chargeTick();
  });
  matrixButton.addEventListener('pointerup', () => stopCharge(charge < 100));
  matrixButton.addEventListener('pointercancel', () => stopCharge(true));
  matrixButton.addEventListener('pointerleave', () => charging && stopCharge(true));
}

const spectacleMap = {
  transform: ['TRANSFORM', 'transform'],
  scan: ['TARGET ACQUIRED', 'scan'],
  blaster: ['ION SYSTEM ARMED', 'blaster'],
};

document.querySelectorAll('[data-action]').forEach((button) => {
  const action = button.dataset.action;
  if (action === 'matrix') return;
  button.addEventListener('click', () => {
    const [label, kind] = spectacleMap[action] || ['SYSTEM ONLINE', 'impact'];
    impact(kind);
    heroToast(label);
    spawnSparks(innerWidth * .5, innerHeight * .55, kind === 'transform' ? 2 : 1.2);
  });
});

const enter = document.querySelector('.enter-button');
enter?.addEventListener('click', () => {
  setTimeout(() => {
    impact('transform');
    heroToast('AUTOBOT\nSIGNAL LOCKED');
  }, 1450);
});

addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 't') { impact('transform'); heroToast('TRANSFORM'); }
  if (key === 'f') { impact('blaster'); heroToast('ION SYSTEM ARMED'); }
  if (key === 's') { impact('scan'); heroToast('TARGET ACQUIRED'); }
});
