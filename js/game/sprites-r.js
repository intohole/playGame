(function () {
  const { mk, C, E, RR, P, LN, grad, shine, eyes, OUT } = window.SPR;
  window.SPR.basePad('keyboard', '#f87171');
  window.SPR.basePad('mouse', '#38bdf8');
  mk('t_keyboard', 50, 46, (x, cx) => {
    RR(x, cx - 18, 16, 36, 24, 5, grad(x, 16, 40, '#3a3e48', '#20242c'), OUT, 2.2);
    RR(x, cx - 15.5, 18.5, 31, 14, 2.5, '#171a20');
    for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) {
      const kx = cx - 13 + i * 5.2, ky = 20.5 + r * 4.4;
      RR(x, kx, ky, 3.6, 3.2, 0.8, r === 1 && i === 2 ? '#ff6b52' : '#e8e6df', OUT, 1);
    }
    RR(x, cx - 9, 33.5, 18, 3.6, 1.2, '#e8e6df', OUT, 1.2);
    const g = x.createLinearGradient(cx - 18, 0, cx + 18, 0);
    ['#ff4d4d', '#ff9a3c', '#ffd23e', '#4ade80', '#38bdf8'].forEach((c, i) => g.addColorStop(i / 4, c));
    RR(x, cx - 17, 38.5, 34, 2.6, 1.3, g);
    x.save();
    x.translate(cx + 14, 8); x.rotate(0.5);
    RR(x, -4, -4, 8, 8, 1.6, '#ff6b52', OUT, 1.4);
    x.fillStyle = '#7a2416'; x.font = 'bold 6px sans-serif'; x.textAlign = 'center';
    x.fillText('!', 0, 2.4);
    x.restore();
    x.save();
    x.translate(cx - 14, 6); x.rotate(-0.7);
    RR(x, -3.2, -3.2, 6.4, 6.4, 1.4, '#e8e6df', OUT, 1.3);
    x.restore();
    RR(x, cx - 4, 40.5, 8, 4, 1.5, '#1d2127', OUT, 1.2);
    C(x, cx, 42.5, 1, '#ff4d4d');
  });
  mk('t_mouse', 42, 48, (x, cx) => {
    x.save();
    x.translate(cx, 26); x.rotate(-0.18);
    E(x, 0, 2, 12.5, 16, grad(x, -14, 18, '#4a4f5c', '#23262e'), OUT, 2.2);
    P(x, [[0, -14], [0, 6]], null, '#171a20', 1.6);
    RR(x, -2.2, -12, 4.4, 9, 2, '#3a3e48', OUT, 1.4);
    RR(x, -1.2, -9.5, 2.4, 5.5, 1.1, '#38bdf8');
    E(x, 0, 8, 8.5, 7, '#2c303a');
    const g = x.createLinearGradient(-12, 0, 12, 0);
    ['#38bdf8', '#8b5cf6', '#f472b6'].forEach((c, i) => g.addColorStop(i / 2, c));
    x.globalAlpha = 0.85;
    RR(x, -8.5, 12.5, 17, 2.4, 1.2, g);
    x.globalAlpha = 1;
    C(x, -6, 4, 1.5, '#4a5568', OUT, 1);
    C(x, 6, 4, 1.5, '#4a5568', OUT, 1);
    shine(x, -4, -8, 3, 4.5, 0.35);
    x.restore();
    P(x, [[cx + 12, 2], [cx + 12, 14], [cx + 15.5, 10.5], [cx + 18, 15.5], [cx + 20, 14], [cx + 17.5, 9.5], [cx + 22, 9.5]], '#fff', OUT, 1.6);
    x.strokeStyle = 'rgba(56,189,248,0.7)'; x.lineWidth = 1.4;
    x.beginPath(); x.arc(cx + 15, 8, 9, -0.9, -0.1); x.stroke();
  });
  mk('worker', 58, 60, (x, cx) => {
    RR(x, cx - 20, 12, 40, 9, 4, '#2a2d35', OUT, 2);
    for (let i = 0; i < 7; i++) RR(x, cx - 17 + i * 5, 14, 3.4, 3.4, 0.8, '#e8e6df', OUT, 0.9);
    E(x, cx - 13, 24, 3.4, 7, '#ffd9a8', OUT, 1.8);
    E(x, cx + 13, 24, 3.4, 7, '#ffd9a8', OUT, 1.8);
    C(x, cx, 34, 12.5, '#fdfdf8', OUT, 2.2);
    P(x, [[cx - 3, 40], [cx + 3, 40], [cx, 52]], '#e05a4e', OUT, 1.4);
    LN(x, [[cx - 4, 42], [cx + 4, 50]], 'rgba(224,90,78,0.55)', 3);
    RR(x, cx - 10, 50, 20, 8, 3, '#39424e', OUT, 1.8);
    E(x, cx - 8, 58.5, 4, 2.4, '#241408', OUT, 1.2);
    E(x, cx + 8, 58.5, 4, 2.4, '#241408', OUT, 1.2);
    C(x, cx, 20, 10.5, '#ffd9a8', OUT, 2.2);
    RR(x, cx - 10.5, 8, 21, 6, 2.5, '#241a12', OUT, 1.5);
    [-1, 1].forEach(s => {
      LN(x, [[cx + s * 3, 12.5], [cx + s * 8, 10.5]], OUT, 2.2);
      C(x, cx + s * 4.5, 21, 2.4, '#fff', OUT, 1.2);
      C(x, cx + s * 4.5, 21.4, 1.15, OUT);
    });
    P(x, [[cx - 4.5, 25], [cx + 4.5, 25], [cx + 3, 29.5], [cx, 28], [cx - 3, 29.5]], OUT);
    P(x, [[cx - 8, 16], [cx - 12.5, 13.5], [cx - 9.5, 18]], '#ff5a3c');
    P(x, [[cx + 8, 16], [cx + 12.5, 13.5], [cx + 9.5, 18]], '#ff5a3c');
    E(x, cx - 6.5, 23.5, 1.7, 1, 'rgba(240,110,90,0.55)');
    E(x, cx + 6.5, 23.5, 1.7, 1, 'rgba(240,110,90,0.55)');
  });
})();
