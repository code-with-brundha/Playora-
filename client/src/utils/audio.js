// Audio synthesizer using Web Audio API (Zero external assets needed)

let audioCtx = null;
let isMuted = false;

const getAudioContext = () => {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const toggleMute = () => {
  isMuted = !isMuted;
  localStorage.setItem('playora_sound_muted', isMuted ? 'true' : 'false');
  return isMuted;
};

export const getMuteState = () => {
  if (typeof window !== 'undefined') {
    isMuted = localStorage.getItem('playora_sound_muted') === 'true';
  }
  return isMuted;
};

export const playMoveSound = (symbol = 'X') => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const freq = symbol === 'X' ? 523.25 : 659.25; // C5 for X, E5 for O
  osc.type = symbol === 'X' ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
};

export const playClickSound = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.05);
};

export const playWinSound = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // C - E - G - C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const startTime = ctx.currentTime + idx * 0.1;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.25, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.4);
  });
};

export const playLoseSound = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [440, 392, 349.23, 293.66]; // Descending
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const startTime = ctx.currentTime + idx * 0.12;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.18, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.3);
  });
};

export const playJoinSound = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.18);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.2);
};

export const playTileClackSound = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Crisp ceramic/stone tile clack
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(900, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.06);

  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.06);
};

export const playBlockedSound = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Gentle low warning bump for locked tile
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(160, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.12);
};

export const playMatchSound = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Harmonious ascending pair chime
  const notes = [587.33, 880.0]; // D5 -> A5
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const t = ctx.currentTime + idx * 0.08;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  });
};

export const playRpsCountdownBeep = (isFinal = false) => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const freq = isFinal ? 880 : 440; // High pitch for final shoot
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isFinal ? 0.2 : 0.08));

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + (isFinal ? 0.2 : 0.08));
};

export const playRpsClashSound = () => {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  // Impact bass + metallic clash
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();

  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(240, ctx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.25);

  gain1.gain.setValueAtTime(0.25, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);

  osc1.start();
  osc1.stop(ctx.currentTime + 0.25);
};


