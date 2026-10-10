(function () {
  const OUT = '#241408';
  const REG = {};
  function mk(key, w, h, fn) {
    const c = document.createElement('canvas');
    c.width = w * 2; c.height = h * 2;
    const x = c.getContext('2d');
    x.scale(2, 2); x.lineJoin = 'round'; x.lineCap = 'round';
    fn(x, w / 2, h / 2);
    REG[key] = { cv: c, w, h };
  }
  function E(x, px, py, rx, ry, f, s, lw) { x.beginPath(); x.ellipse(px, py, rx, ry, 0, 0, 7); if (f) { x.fillStyle = f; x.fill(); } if (s) { x.strokeStyle = s; x.lineWidth = lw || 2; x.stroke(); } }
  function C(x, px, py, r, f, s, lw) { E(x, px, py, r, r, f, s, lw); }
  function RR(x, px, py, w, h, r, f, s, lw) { x.beginPath(); x.roundRect(px, py, w, h, r); if (f) { x.fillStyle = f; x.fill(); } if (s) { x.strokeStyle = s; x.lineWidth = lw || 2; x.stroke(); } }
  function P(x, pts, f, s, lw) { x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); if (f) { x.fillStyle = f; x.fill(); } if (s) { x.strokeStyle = s; x.lineWidth = lw || 2; x.stroke(); } }
  function LN(x, pts, s, lw) { x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.strokeStyle = s; x.lineWidth = lw || 2; x.stroke(); }
  function grad(x, y0, y1, c0, c1) { const g = x.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, c0); g.addColorStop(1, c1); return g; }
  function shine(x, px, py, rx, ry, a) { x.globalAlpha = a || 0.3; x.fillStyle = '#fff'; x.beginPath(); x.ellipse(px, py, rx, ry, -0.7, 0, 7); x.fill(); x.globalAlpha = 1; }
  function eyes(x, px, py, dx, r, look) {
    [-1, 1].forEach(s => {
      C(x, px + s * dx, py, r, '#fff', OUT, 1.3);
      C(x, px + s * dx + (look || 0) * r * 0.45, py + r * 0.25, r * 0.46, OUT);
    });
  }
  function basePad(key, col) {
    mk('b_' + key, 48, 48, (x, cx) => {
      E(x, cx, 27, 19, 15, 'rgba(0,0,0,0.4)');
      C(x, cx, 24, 18.5, grad(x, 6, 42, '#463822', '#291e10'), OUT, 2.4);
      C(x, cx, 24, 13.5, col + '2e');
      C(x, cx, 24, 13.5, null, col + '99', 1.4);
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.4; C(x, cx + Math.cos(a) * 16, 24 + Math.sin(a) * 16, 1.3, col); }
    });
  }
  basePad('coffee', '#f59e42');
  basePad('plant', '#4ade80');
  basePad('abacus', '#67c5f0');
  basePad('frame', '#c084fc');
  mk('t_coffee', 40, 44, (x, cx) => {
    x.beginPath(); x.arc(cx + 12, 20, 5.5, -1.1, 1.1); x.strokeStyle = OUT; x.lineWidth = 5; x.stroke();
    x.beginPath(); x.arc(cx + 12, 20, 5.5, -1.1, 1.1); x.strokeStyle = '#f2ead8'; x.lineWidth = 2.4; x.stroke();
    RR(x, cx - 4, 2, 8, 10, 2.5, '#f2ead8', OUT, 2);
    C(x, cx, 20, 13.5, grad(x, 6, 34, '#fffdf4', '#d9cdb4'), OUT, 2.2);
    C(x, cx, 20, 9, '#7a4a24', OUT, 1.5);
    C(x, cx, 20, 5, '#552f12');
    C(x, cx, 18, 1.6, 'rgba(255,255,255,0.35)');
    RR(x, cx - 12.5, 9.5, 5.5, 5.5, 1.2, '#f7e9c4', OUT, 1.2);
    RR(x, cx + 6.5, 25.5, 5.5, 5.5, 1.2, '#f7e9c4', OUT, 1.2);
  });
  mk('t_plant', 42, 46, (x, cx) => {
    C(x, cx, 30, 12.5, grad(x, 17, 43, '#cd7a52', '#9a4a2c'), OUT, 2.2);
    C(x, cx, 29, 8.5, '#4c3118');
    E(x, cx - 8, 26, 6.5, 5, '#5cb84f', OUT, 1.8);
    E(x, cx + 8, 26, 6.5, 5, '#5cb84f', OUT, 1.8);
    E(x, cx, 18, 6, 11, grad(x, 7, 29, '#7ed957', '#3d9c39'), OUT, 2);
    [-1, 1].forEach(s => {
      LN(x, [[cx + s * 3, 12], [cx + s * 3, 24]], 'rgba(255,255,255,0.5)', 1);
      C(x, cx + s * 4.5, 17, 0.9, '#eaffdd'); C(x, cx + s * 4.5, 21, 0.9, '#eaffdd');
    });
    C(x, cx, 7.5, 2.6, '#ff8fb3', OUT, 1.3);
    C(x, cx, 7.5, 1, '#ffd23e');
  });
  mk('t_abacus', 44, 48, (x, cx) => {
    RR(x, cx - 14, 7, 28, 34, 4.5, grad(x, 7, 41, '#b0762f', '#7c4a1e'), OUT, 2.2);
    RR(x, cx - 10.5, 10.5, 21, 27, 2.5, '#ecd9ae');
    x.fillStyle = '#7c4a1e'; x.fillRect(cx - 10.5, 22.5, 21, 3);
    for (let i = 0; i < 3; i++) {
      const bx = cx - 6.5 + i * 6.5;
      LN(x, [[bx, 10.5], [bx, 37.5]], 'rgba(90,55,20,0.55)', 1);
      C(x, bx, 15.5, 2.7, '#d9482f', OUT, 1.2);
      C(x, bx, 20.5, 2.7, '#d9482f', OUT, 1.2);
      C(x, bx, 29.5, 2.7, '#2e6da4', OUT, 1.2);
      C(x, bx, 34.5, 2.7, '#2e6da4', OUT, 1.2);
    }
    shine(x, cx - 8, 12.5, 3, 1.6, 0.5);
  });
  mk('t_frame', 46, 48, (x, cx) => {
    RR(x, cx - 17, 3, 34, 38, 3.5, grad(x, 3, 41, '#eec25a', '#a9741f'), OUT, 2.2);
    RR(x, cx - 12, 8, 24, 28, 2, '#221238');
    C(x, cx - 5.5, 22, 3, '#ffd76b');
    C(x, cx + 5.5, 22, 3, '#ffd76b');
    C(x, cx - 5.5, 22, 1.3, '#7a3d00');
    C(x, cx + 5.5, 22, 1.3, '#7a3d00');
    LN(x, [[cx - 9.5, 16.5], [cx - 2, 18.5]], '#ffd76b', 2.2);
    LN(x, [[cx + 9.5, 16.5], [cx + 2, 18.5]], '#ffd76b', 2.2);
    LN(x, [[cx - 4, 30], [cx + 4, 30]], 'rgba(255,215,107,0.6)', 2);
    P(x, [[cx + 5, 8], [cx + 12, 8], [cx - 7, 36], [cx - 14, 36]], 'rgba(255,255,255,0.09)');
    RR(x, cx - 8, 41.5, 16, 5.5, 1.8, '#3a2a12', OUT, 1.3);
    C(x, cx, 44.2, 1.1, '#ffd76b');
  });
  mk('desk', 92, 84, (x, cx) => {
    E(x, cx, 58, 34, 10, 'rgba(0,0,0,0.35)');
    E(x, cx, 70, 16, 7, '#39424e', OUT, 2);
    E(x, cx, 70, 8, 3.5, '#2a313a');
    RR(x, cx - 38, 14, 76, 52, 7, grad(x, 14, 66, '#8a5c30', '#6b421f'), OUT, 2.4);
    RR(x, cx - 33, 19, 66, 42, 4.5, '#a06c38');
    RR(x, cx - 33, 19, 66, 5, 3, 'rgba(255,255,255,0.14)');
    RR(x, cx - 17, 22, 34, 13, 2.5, '#1d2127', OUT, 1.8);
    RR(x, cx - 15, 24, 30, 9, 1.5, '#10151b');
    x.fillStyle = '#37c24a';
    for (let i = 0; i < 3; i++) x.fillRect(cx - 13 + i * 9, 26 + (i % 2) * 2, 6, 1.6);
    RR(x, cx - 4, 35, 8, 4, 1.2, '#2c333c', OUT, 1.2);
    RR(x, cx - 13, 41, 26, 8, 2, '#e8e2d2', OUT, 1.5);
    for (let i = 0; i < 4; i++) LN(x, [[cx - 9 + i * 6, 41], [cx - 9 + i * 6, 49]], 'rgba(120,100,70,0.4)', 1);
    E(x, cx + 20, 45, 3.2, 4, '#efefe8', OUT, 1.3);
    C(x, cx + 24, 25, 4.2, '#fff', OUT, 1.5);
    x.beginPath(); x.arc(cx + 30, 25, 3, -1.2, 1.2); x.strokeStyle = OUT; x.lineWidth = 2.2; x.stroke();
    E(x, cx + 24, 25, 1.7, 2.1, '#6b4023');
    RR(x, cx - 31, 40, 10, 12, 1.5, '#f6f1e2', OUT, 1.3);
    LN(x, [[cx - 29, 44], [cx - 23, 44]], 'rgba(120,120,140,0.6)', 1);
    LN(x, [[cx - 29, 47], [cx - 23, 47]], 'rgba(120,120,140,0.6)', 1);
    C(x, cx - 26, 24, 5.5, '#4c8a3f', OUT, 1.6);
    C(x, cx - 26, 21.5, 3.5, '#5fae4f', OUT, 1.4);
    RR(x, cx - 29, 27, 6, 4, 1, '#c96f4a', OUT, 1.3);
    C(x, cx, 70, 8.5, null, 'rgba(245,158,66,0.25)', 2);
  });
  mk('chest', 32, 28, (x, cx) => {
    E(x, cx, 25, 13, 3, 'rgba(0,0,0,0.35)');
    RR(x, cx - 12, 12, 24, 13, 3, grad(x, 12, 25, '#a06a2c', '#7a4a1a'), OUT, 2);
    P(x, [[cx - 12, 13], [cx, 3], [cx + 12, 13]], grad(x, 3, 13, '#c98d3e', '#9a6224'), OUT, 2);
    LN(x, [[cx - 12, 13.5], [cx + 12, 13.5]], OUT, 1.6);
    LN(x, [[cx, 5], [cx, 13]], '#ffd76b', 2.5);
    RR(x, cx - 2.8, 11.5, 5.6, 6.5, 1.4, '#ffd76b', OUT, 1.5);
    C(x, cx, 15, 1, '#7a4a1a');
    LN(x, [[cx - 8, 5.5], [cx - 10.5, 10]], '#ffd76b', 1.6);
    LN(x, [[cx + 8, 5.5], [cx + 10.5, 10]], '#ffd76b', 1.6);
  });
  mk('p_fern', 34, 42, (x, cx) => {
    E(x, cx, 39, 12, 3, 'rgba(0,0,0,0.3)');
    P(x, [[cx - 10, 26], [cx + 10, 26], [cx + 7, 39], [cx - 7, 39]], grad(x, 26, 39, '#c96f4a', '#96482c'), OUT, 2);
    [-30, -12, 8, 26].forEach((a, i) => {
      x.save(); x.translate(cx, 26); x.rotate(a * Math.PI / 180);
      E(x, 0, -11 - (i % 2) * 3, 3.6, 9, i % 2 ? '#4c9a44' : '#5fae4f', OUT, 1.5);
      x.restore();
    });
  });
  mk('p_cooler', 28, 40, (x, cx) => {
    E(x, cx, 37, 10, 2.5, 'rgba(0,0,0,0.3)');
    RR(x, cx - 9, 16, 18, 21, 3, grad(x, 16, 37, '#e8e6df', '#b9b6ac'), OUT, 2);
    C(x, cx, 25, 1.2, '#8898a8'); C(x, cx + 5, 25, 1.2, '#c0392b');
    RR(x, cx - 11, 12, 22, 6, 2, grad(x, 12, 18, '#3d6f9e', '#2c527a'), OUT, 2);
    shine(x, cx - 5, 14, 2.5, 1.3, 0.5);
    RR(x, cx - 6, 31, 12, 3, 1.2, '#cfd4d8', OUT, 1);
  });
  mk('p_copy', 38, 28, (x, cx) => {
    E(x, cx, 25, 16, 3, 'rgba(0,0,0,0.3)');
    RR(x, cx - 16, 8, 32, 17, 3, grad(x, 8, 25, '#d8d5cc', '#a8a49a'), OUT, 2);
    RR(x, cx - 11, 4, 22, 7, 2, '#c2beb4', OUT, 1.5);
    RR(x, cx - 7, 6, 14, 3, 1, '#f4f2ea');
    RR(x, cx + 8, 12, 6, 4, 1, '#3a3f47', OUT, 1);
    C(x, cx - 10, 15, 1.4, '#4cd964'); C(x, cx - 5, 15, 1.4, '#f5a623');
    LN(x, [[cx - 14, 20], [cx + 2, 20]], 'rgba(80,80,90,0.4)', 1.5);
  });
  mk('p_cab', 28, 34, (x, cx) => {
    E(x, cx, 31, 11, 2.5, 'rgba(0,0,0,0.3)');
    RR(x, cx - 10, 4, 20, 27, 2.5, grad(x, 4, 31, '#8a6a42', '#6b4e2c'), OUT, 2);
    LN(x, [[cx - 10, 13], [cx + 10, 13]], OUT, 1.5);
    LN(x, [[cx - 10, 22], [cx + 10, 22]], OUT, 1.5);
    [8.5, 17.5, 26.5].forEach(py => { C(x, cx, py, 1, '#e8d5ae'); });
    C(x, cx - 5, 2, 2, '#f4f2ea', OUT, 1);
    C(x, cx + 4, 1.5, 1.6, '#e8e2d2', OUT, 1);
  });
  mk('p_box', 32, 26, (x, cx) => {
    E(x, cx, 23, 14, 3, 'rgba(0,0,0,0.3)');
    RR(x, cx - 13, 10, 26, 13, 1.5, grad(x, 10, 23, '#c99b56', '#a67a3c'), OUT, 2);
    LN(x, [[cx, 10], [cx, 23]], 'rgba(122,80,30,0.7)', 2);
    RR(x, cx - 8, 2, 16, 9, 1.5, grad(x, 2, 11, '#d3a860', '#b5874a'), OUT, 2);
    LN(x, [[cx, 2], [cx, 11]], 'rgba(122,80,30,0.7)', 1.8);
    LN(x, [[cx - 4, 6.5], [cx + 4, 6.5]], 'rgba(122,80,30,0.45)', 1.2);
  });
  mk('p_shred', 26, 30, (x, cx) => {
    E(x, cx, 27, 9, 2.5, 'rgba(0,0,0,0.3)');
    RR(x, cx - 8, 12, 16, 15, 2.5, grad(x, 12, 27, '#5a636e', '#3d444e'), OUT, 2);
    RR(x, cx - 10, 8, 20, 6, 2, '#454d58', OUT, 1.8);
    LN(x, [[cx - 5, 9], [cx - 5, 5], [cx + 5, 5], [cx + 5, 9]], '#454d58', 1.8);
    RR(x, cx - 6, 19, 12, 5, 1, '#2c3138');
    for (let i = 0; i < 3; i++) LN(x, [[cx - 4 + i * 4, 19], [cx - 4 + i * 4, 24]], '#171b20', 1.2);
  });
  window.SPR = { REG, mk, C, E, RR, P, LN, grad, shine, eyes, basePad, OUT };
  const WHITE = {};
  window.Sprites = {
    get(k) { return REG[k]; },
    white(k) {
      if (WHITE[k]) return WHITE[k];
      const s = REG[k]; if (!s) return null;
      const c = document.createElement('canvas');
      c.width = s.cv.width; c.height = s.cv.height;
      const x = c.getContext('2d');
      x.drawImage(s.cv, 0, 0);
      x.globalCompositeOperation = 'source-in';
      x.fillStyle = '#fff';
      x.fillRect(0, 0, c.width, c.height);
      WHITE[k] = c;
      return c;
    },
    stamp(cv, key) {
      const s = REG[key]; if (!s || !cv) return;
      const x = cv.getContext('2d');
      const w = cv.width, h = cv.height;
      x.clearRect(0, 0, w, h);
      const sc = Math.min(w / s.w, h / s.h) * 0.92;
      x.drawImage(s.cv, (w - s.w * sc) / 2, (h - s.h * sc) / 2, s.w * sc, s.h * sc);
    }
  };
})();
