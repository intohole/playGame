(function () {
  const U = {
    clamp(v, a, b) { return v < a ? a : v > b ? b : v; },
    dist(ax, ay, bx, by) { const dx = bx - ax, dy = by - ay; return Math.hypot(dx, dy); },
    lerp(a, b, t) { return a + (b - a) * t; },
    rand(a, b) { return a + Math.random() * (b - a); },
    randInt(a, b) { return Math.floor(a + Math.random() * (b - a + 1)); },
    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    fmt(n) {
      n = Math.floor(n);
      if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
      if (n >= 1e4) return (n / 1e3).toFixed(1) + 'K';
      return String(n);
    },
    pad(n) { return n < 10 ? '0' + n : String(n); },
    mulberry32(seed) {
      let a = seed >>> 0;
      return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    },
    todayStr(offset) {
      const d = new Date(Date.now() - (offset || 0) * 86400000);
      return d.getFullYear() + '-' + U.pad(d.getMonth() + 1) + '-' + U.pad(d.getDate());
    },
    ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; },
    angleTo(ax, ay, bx, by) { return Math.atan2(by - ay, bx - ax); },
    shake(mag) { U._shake = Math.max(U._shake || 0, mag); },
    getShake() { const s = U._shake || 0; U._shake *= 0.88; if (s < 0.3) U._shake = 0; return s; }
  };
  window.U = U;
})();
