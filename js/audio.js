(function () {
  let ctx = null, master = null, enabled = true;
  function ensure() {
    if (ctx) return true;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.32;
      master.connect(ctx.destination);
      return true;
    } catch (e) { return false; }
  }
  function tone(freq, dur, type, vol, slide, delay) {
    if (!enabled || !ensure()) return;
    if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime + (delay || 0);
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, slide), t0 + dur);
    g.gain.setValueAtTime(vol || 0.15, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function noise(dur, vol, delay) {
    if (!enabled || !ensure()) return;
    if (ctx.state === 'suspended') ctx.resume();
    const t0 = ctx.currentTime + (delay || 0);
    const len = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain(); g.gain.value = vol || 0.12;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0);
  }
  const SFX = {
    setEnabled(v) { enabled = v; },
    get enabled() { return enabled; },
    unlock() { ensure(); if (ctx && ctx.state === 'suspended') ctx.resume(); },
    shoot() { tone(U.rand(700, 820), 0.05, 'square', 0.05, 300); },
    sniper() { tone(190, 0.1, 'sawtooth', 0.09, 60); },
    boom() { noise(0.28, 0.22); tone(90, 0.25, 'triangle', 0.16, 40); },
    coin(i) { tone(1150 + (i || 0) * 90, 0.07, 'square', 0.07); tone(1720 + (i || 0) * 120, 0.09, 'square', 0.055, 0, 0.05); },
    place() { tone(240, 0.09, 'triangle', 0.14, 160); noise(0.06, 0.07); },
    sell() { tone(500, 0.08, 'triangle', 0.1, 300); tone(340, 0.1, 'triangle', 0.09, 200, 0.07); },
    upgrade() { [440, 554, 659, 880].forEach((f, i) => tone(f, 0.1, 'square', 0.08, 0, i * 0.06)); },
    leak() { tone(160, 0.35, 'sawtooth', 0.2, 55); noise(0.2, 0.12); },
    waveStart() { tone(330, 0.12, 'square', 0.1); tone(330, 0.12, 'square', 0.1, 0, 0.14); tone(494, 0.22, 'square', 0.12, 0, 0.28); },
    bossRoar() { tone(70, 0.7, 'sawtooth', 0.24, 45); noise(0.5, 0.18); },
    bossDie() { noise(0.6, 0.3); tone(60, 0.6, 'triangle', 0.25, 30); [220, 330, 440, 660, 880].forEach((f, i) => tone(f, 0.14, 'square', 0.08, 0, 0.35 + i * 0.08)); },
    win() { [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, 0.22, 'triangle', 0.13, 0, i * 0.12)); },
    lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.3, 'sawtooth', 0.12, 0, i * 0.18)); },
    chest() { [660, 880].forEach((f, i) => tone(f, 0.1, 'square', 0.09, 0, i * 0.08)); tone(1320, 0.18, 'square', 0.1, 0, 0.17); },
    gem() { [1046, 1318, 1568].forEach((f, i) => tone(f, 0.16, 'sine', 0.12, 0, i * 0.07)); },
    click() { tone(600, 0.04, 'square', 0.05); },
    err() { tone(180, 0.12, 'square', 0.09, 120); },
    levelup() { [523, 659, 784].forEach((f, i) => tone(f, 0.13, 'square', 0.1, 0, i * 0.09)); },
    mouseShot() { tone(1500, 0.05, 'sine', 0.08, 480); tone(520, 0.04, 'square', 0.045, 0, 0.035); },
    vent() { tone(340, 0.05, 'square', 0.11, 170); noise(0.05, 0.09); },
    rageReady() { [392, 494, 587, 784].forEach((f, i) => tone(f, 0.09, 'square', 0.09, 0, i * 0.07)); },
    rageRelease() {
      noise(0.5, 0.3);
      tone(120, 0.42, 'sawtooth', 0.22, 38);
      tone(85, 0.35, 'triangle', 0.2, 40, 0.02);
      [220, 220, 330, 440, 660].forEach((f, i) => tone(f, 0.12, 'square', 0.1, 0, 0.12 + i * 0.09));
    }
  };
  window.SFX = SFX;
})();
