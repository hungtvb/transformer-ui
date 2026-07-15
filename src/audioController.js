export function createAudioController() {
  let context = null;

  const ensureContext = () => {
    if (!context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      context = new AudioContextClass();
    }
    return context;
  };

  return Object.freeze({
    async resume() {
      const audioContext = ensureContext();
      if (!audioContext) return false;
      if (audioContext.state !== 'running') await audioContext.resume();
      return audioContext.state === 'running';
    },

    async suspend() {
      if (context?.state === 'running') await context.suspend();
    },

    tone(frequency = 70, duration = 0.4, gain = 0.04, type = 'sine') {
      if (!context || context.state !== 'running') return false;

      const oscillator = context.createOscillator();
      const volume = context.createGain();
      const now = context.currentTime;

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      volume.gain.setValueAtTime(gain, now);
      volume.gain.exponentialRampToValueAtTime(0.001, now + duration);
      oscillator.connect(volume).connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);
      return true;
    },

    get state() {
      return context?.state ?? 'uninitialized';
    },
  });
}
