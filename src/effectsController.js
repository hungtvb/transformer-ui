import { gsap } from 'gsap';

export function createEffectsController({ bloom, mobile }) {
  const baseBloom = mobile ? 0.35 : 0.55;

  return Object.freeze({
    flash() {
      return gsap.fromTo('.flash', { opacity: 0.7 }, { opacity: 0, duration: 0.6 });
    },

    setBloom(value) {
      bloom.strength = value;
    },

    setSignalBloom(signalLock) {
      bloom.strength = baseBloom + signalLock * 0.003;
    },

    setContactBloom(progress) {
      bloom.strength = baseBloom + progress * 0.009;
    },

    resetBloom() {
      bloom.strength = baseBloom;
    },

    delayedCall(delay, callback) {
      return gsap.delayedCall(delay, callback);
    },

    timeline(options) {
      return gsap.timeline(options);
    },

    to(target, vars) {
      return gsap.to(target, vars);
    },
  });
}
