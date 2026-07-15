export const TRACKING_CONFIG = Object.freeze({
  captureRadius: 14,
  minimumGainPerSecond: 48,
  maximumGainPerSecond: 90,
  decayPerSecond: 20,
});

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function getTrackingProximity(distance, config = TRACKING_CONFIG) {
  if (!Number.isFinite(distance)) return 0;
  return clamp(1 - distance / config.captureRadius, 0, 1);
}

export function advanceTrackingQuality(current, distance, delta, config = TRACKING_CONFIG) {
  const safeCurrent = clamp(Number.isFinite(current) ? current : 0, 0, 100);
  const safeDelta = Math.max(0, Number.isFinite(delta) ? delta : 0);
  const proximity = getTrackingProximity(distance, config);

  const rate = proximity > 0
    ? config.minimumGainPerSecond
      + (config.maximumGainPerSecond - config.minimumGainPerSecond) * proximity
    : -config.decayPerSecond;

  return clamp(safeCurrent + rate * safeDelta, 0, 100);
}
