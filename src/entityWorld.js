const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function sampleEntityPatrol(time) {
  const orbit = time * 0.34;
  const secondary = time * 0.17;
  return Object.freeze({
    x: Math.sin(orbit) * 5.4 + Math.sin(secondary) * 1.1,
    y: -1.3 + Math.sin(time * 0.72) * 0.05,
    z: -24.5 + Math.cos(orbit) * 5.2,
    heading: Math.atan2(Math.cos(orbit), -Math.sin(orbit)),
  });
}

export function projectEntityToRadar({ x, z }) {
  return Object.freeze({
    x: clamp(50 + x * 5.4, 8, 92),
    y: clamp(50 + (z + 24.5) * 4.9, 8, 92),
  });
}

export function getEntityLookTarget({ pointerX, pointerY }) {
  return Object.freeze({
    yaw: clamp(pointerX * 0.24, -0.22, 0.22),
    pitch: clamp(-pointerY * 0.12, -0.1, 0.1),
  });
}

export function damp(current, target, speed, delta) {
  return current + (target - current) * (1 - Math.exp(-speed * delta));
}
