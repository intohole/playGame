(function () {
  const { mk, C, E, RR, P, LN, grad, shine, eyes, OUT } = window.SPR;
  function feet(x, cx, py, col) { E(x, cx - 5.5, py, 4.2, 2.8, col, OUT, 1.5); E(x, cx + 5.5, py, 4.2, 2.8, col, OUT, 1.5); }
  function sweat(x, px, py) { E(x, px, py, 2, 3, '#9adcf0', 'rgba(40,90,120,0.6)', 1); }
  mk('e_intern', 44, 50, (x, cx) => {
    feet(x, cx, 46, '#3d4652');
    RR(x, cx - 11, 27, 22, 18, 6, grad(x, 27, 45, '#fdfdf8', '#d8d5c8'), OUT, 2);
    LN(x, [[cx - 4, 28], [cx + 4, 44]], '#4a90d9', 2.5);
    RR(x, cx + 1, 39, 8, 6, 1, '#fff', OUT, 1.3);
    LN(x, [[cx + 2.5, 41.5], [cx + 7.5, 41.5]], '#7ba7d9', 1);
    E(x, cx - 12, 33, 3, 6.5, '#fdfdf8', OUT, 1.6);
    E(x, cx + 12, 33, 3, 6.5, '#fdfdf8', OUT, 1.6);
    C(x, cx, 16, 11.5, '#ffd9a8', OUT, 2);
    P(x, [[cx - 12, 14], [cx - 7, 5.5], [cx - 2, 10], [cx + 3, 4.5], [cx + 8, 10], [cx + 12, 14], [cx + 12, 9], [cx - 12, 9]], '#3a2c1e');
    LN(x, [[cx - 1, 5], [cx + 2, 1]], '#3a2c1e', 2.2);
    eyes(x, cx, 17, 4.5, 2.6, 0.2);
    E(x, cx - 7.5, 21, 2, 1.2, 'rgba(240,130,120,0.5)');
    E(x, cx + 7.5, 21, 2, 1.2, 'rgba(240,130,120,0.5)');
    LN(x, [[cx - 2, 23.5], [cx + 2, 23.5]], OUT, 1.4);
    sweat(x, cx + 11, 12);
  });
  mk('e_msg', 42, 46, (x, cx) => {
    P(x, [[cx - 20, 12], [cx - 30, 8], [cx - 21, 20]], '#69b8f2', OUT, 1.8);
    P(x, [[cx + 20, 12], [cx + 30, 8], [cx + 21, 20]], '#69b8f2', OUT, 1.8);
    E(x, cx - 19, 22, 7, 4, '#8fd0f8', OUT, 1.6);
    E(x, cx + 19, 22, 7, 4, '#8fd0f8', OUT, 1.6);
    RR(x, cx - 17, 4, 34, 34, 9, grad(x, 4, 38, '#8fd0f8', '#4a94d4'), OUT, 2.2);
    P(x, [[cx - 8, 37], [cx - 2, 44], [cx + 5, 37]], '#4a94d4', OUT, 1.8);
    [-1, 1].forEach(s => {
      LN(x, [[cx + s * 9.5, 13.5], [cx + s * 3.5, 16.5]], OUT, 2.2);
      C(x, cx + s * 6, 19.5, 3.4, '#fff', OUT, 1.3);
      C(x, cx + s * 6, 20.2, 1.6, OUT);
    });
    LN(x, [[cx - 4, 28.5], [cx + 4, 28.5]], OUT, 2);
    C(x, cx, 26.5, 4.2, 'rgba(255,255,255,0.25)');
  });
  mk('e_sheet', 42, 44, (x, cx) => {
    feet(x, cx, 42, '#2e5c2a');
    RR(x, cx - 9, 28, 18, 13, 5, '#4c9a44', OUT, 2);
    E(x, cx - 13, 20, 6, 3.5, '#5cb84f', OUT, 1.6);
    E(x, cx + 13, 20, 6, 3.5, '#5cb84f', OUT, 1.6);
    C(x, cx, 16, 11, grad(x, 5, 27, '#7ed957', '#3d9c39'), OUT, 2);
    C(x, cx - 4.5, 16.5, 4.2, '#e8f4ff', OUT, 1.6);
    C(x, cx + 4.5, 16.5, 4.2, '#e8f4ff', OUT, 1.6);
    C(x, cx - 4.5, 17, 1.7, OUT); C(x, cx + 4.5, 17, 1.7, OUT);
    LN(x, [[cx - 1, 16.5], [cx + 1, 16.5]], OUT, 1.5);
    LN(x, [[cx - 3, 23.5], [cx + 3, 23.5]], OUT, 1.5);
    RR(x, cx - 8, 32, 16, 11, 1.5, '#fdfdf6', OUT, 1.6);
    for (let i = 0; i < 3; i++) LN(x, [[cx - 6, 35 + i * 3], [cx + 6, 35 + i * 3]], '#7ec97a', 1.2);
    LN(x, [[cx - 6, 35], [cx - 6, 41]], '#7ec97a', 1.2);
  });
  mk('e_robot', 56, 60, (x, cx) => {
    RR(x, cx - 15, 50, 30, 8, 4, '#39424e', OUT, 2);
    C(x, cx - 8, 54, 2, '#20262e'); C(x, cx + 8, 54, 2, '#20262e');
    RR(x, cx - 14, 26, 28, 26, 8, grad(x, 26, 52, '#9aa8b8', '#5d6b7c'), OUT, 2.2);
    RR(x, cx - 9, 34, 18, 10, 3, '#2c333c', OUT, 1.6);
    x.fillStyle = '#4cd964'; x.fillRect(cx - 7, 36, 11, 3);
    x.fillStyle = '#f5a623'; x.fillRect(cx + 5, 36, 3, 3);
    RR(x, cx - 4, 45, 8, 4, 1.5, '#454d58', OUT, 1.2);
    E(x, cx - 17, 36, 4.5, 8, '#7c8a9a', OUT, 1.8);
    E(x, cx + 17, 36, 4.5, 8, '#7c8a9a', OUT, 1.8);
    LN(x, [[cx, 10], [cx, 4]], OUT, 2);
    C(x, cx, 3, 2.4, '#e04b3a', OUT, 1.4);
    RR(x, cx - 12, 8, 24, 20, 6, grad(x, 8, 28, '#b4c2d2', '#78889a'), OUT, 2.2);
    RR(x, cx - 9, 12, 18, 9, 4, '#161b22');
    C(x, cx - 4, 16.5, 2.2, '#ff5a4e');
    C(x, cx + 4, 16.5, 2.2, '#ff5a4e');
    C(x, cx - 4, 16.5, 0.9, '#ffd0cc');
    RR(x, cx - 6, 24, 12, 2.5, 1, '#454d58');
  });
  mk('e_balloon', 46, 62, (x, cx) => {
    C(x, cx - 7, 55, 2.4, '#ffd76b'); C(x, cx + 8, 50, 1.8, '#ffd76b');
    LN(x, [[cx, 34], [cx - 1, 44], [cx + 1, 54]], 'rgba(255,255,255,0.75)', 1.5);
    C(x, cx, 18, 15.5, grad(x, 2, 34, '#ff9db8', '#e05a80'), OUT, 2.2);
    P(x, [[cx - 3.5, 33], [cx + 3.5, 33], [cx, 38]], '#e05a80', OUT, 1.6);
    x.globalAlpha = 0.55; E(x, cx - 6, 11, 4.5, 6.5, '#fff', null, 0); x.globalAlpha = 1;
    [-1, 1].forEach(s => {
      LN(x, [[cx + s * 3, 16], [cx + s * 6.5, 17.5]], OUT, 1.8);
      C(x, cx + s * 5.5, 20, 2.8, '#fff', OUT, 1.3);
      x.beginPath(); x.arc(cx + s * 5.5, 21, 1.6, 0.15 * Math.PI, 0.85 * Math.PI); x.strokeStyle = OUT; x.lineWidth = 1.4; x.stroke();
    });
    x.beginPath(); x.arc(cx, 26, 3, 0.15 * Math.PI, 0.85 * Math.PI); x.strokeStyle = OUT; x.lineWidth = 1.6; x.stroke();
    E(x, cx - 9, 24, 1.8, 1.1, 'rgba(240,130,120,0.45)');
    E(x, cx + 9, 24, 1.8, 1.1, 'rgba(240,130,120,0.45)');
  });
  mk('e_hr', 52, 54, (x, cx) => {
    feet(x, cx, 51, '#241a2e');
    RR(x, cx - 11, 29, 22, 20, 6, grad(x, 29, 49, '#3d4668', '#2a3050'), OUT, 2);
    P(x, [[cx - 4, 29], [cx + 4, 29], [cx, 36]], '#fdfdf8', OUT, 1.3);
    C(x, cx, 37, 1.2, '#c0392b');
    E(x, cx - 13, 35, 3.2, 7, '#3d4668', OUT, 1.6);
    C(x, cx, 15, 11.5, '#ffd9a8', OUT, 2);
    P(x, [[cx - 12.5, 12], [cx - 8, 3.5], [cx + 8, 3.5], [cx + 12.5, 12], [cx + 12.5, 20], [cx + 9, 15], [cx + 4, 8], [cx - 4, 8], [cx - 9, 15], [cx - 12.5, 20]], '#2c1e14');
    RR(x, cx - 7.5, 13.5, 15, 5.5, 2.5, '#1d2127', OUT, 1.3);
    C(x, cx - 4, 16.2, 1.7, '#fff', OUT, 1); C(x, cx + 4, 16.2, 1.7, '#fff', OUT, 1);
    LN(x, [[cx - 2, 24.5], [cx + 2, 24.5]], OUT, 1.6);
    RR(x, cx + 8, 30, 17, 21, 5, grad(x, 30, 51, '#cfd6de', '#8d99a8'), OUT, 2.2);
    RR(x, cx + 10.5, 33, 12, 15, 3, null, '#5d6b7c', 1.5);
    x.fillStyle = '#3d4668'; x.font = 'bold 8px sans-serif'; x.textAlign = 'center';
    x.fillText('HR', cx + 16.5, 43);
    C(x, cx + 16.5, 37, 1, '#c0392b');
  });
  mk('e_ghost', 48, 52, (x, cx) => {
    C(x, cx - 17, 34, 2, 'rgba(255,255,255,0.5)'); C(x, cx + 18, 30, 1.6, 'rgba(255,255,255,0.5)');
    x.beginPath();
    x.moveTo(cx - 14, 24);
    x.arc(cx, 24, 14, Math.PI, 0);
    x.lineTo(cx + 14, 38);
    x.quadraticCurveTo(cx + 10, 34, cx + 7, 39);
    x.quadraticCurveTo(cx + 3, 44, cx, 39);
    x.quadraticCurveTo(cx - 3, 34, cx - 7, 40);
    x.quadraticCurveTo(cx - 11, 45, cx - 14, 38);
    x.closePath();
    x.fillStyle = grad(x, 10, 45, '#ffffff', '#cfd8e8'); x.fill();
    x.strokeStyle = OUT; x.lineWidth = 2; x.stroke();
    [-1, 1].forEach(s => {
      E(x, cx + s * 5, 21, 3, 3.6, '#fff', OUT, 1.4);
      C(x, cx + s * 5, 21.5, 1.6, OUT);
      LN(x, [[cx + s * 2, 16.5], [cx + s * 8, 18]], OUT, 1.8);
    });
    P(x, [[cx - 3, 28.5], [cx + 4, 27.5], [cx + 3, 31]], OUT);
    C(x, cx - 8, 26, 1.8, 1.2, 'rgba(240,130,120,0.5)');
    C(x, cx + 19, 38, 7.5, grad(x, 31, 45, '#f2d38c', '#d9a852'), OUT, 1.8);
    C(x, cx + 17, 36, 0.9, '#8a5c28'); C(x, cx + 21.5, 39.5, 0.9, '#8a5c28'); C(x, cx + 19, 42, 0.9, '#8a5c28');
    LN(x, [[cx + 12, 40], [cx + 15, 42]], 'rgba(255,255,255,0.8)', 2);
  });
  mk('e_blame', 48, 52, (x, cx) => {
    E(x, cx + 15, 30, 8, 3, '#2c2c34', OUT, 1.8);
    RR(x, cx + 20, 25, 8, 2.5, 1.2, '#3c3c46', OUT, 1.3);
    feet(x, cx, 49, '#2c2c34');
    RR(x, cx - 11, 28, 22, 19, 7, grad(x, 28, 47, '#8a5cc0', '#5d3a8c'), OUT, 2);
    E(x, cx - 13, 34, 3.2, 6.5, '#6d44a0', OUT, 1.5);
    P(x, [[cx - 8, 28], [cx - 3, 24], [cx + 3, 24], [cx + 8, 28], [cx + 8, 22], [cx - 8, 22]], '#7a4cb4', OUT, 1.6);
    C(x, cx, 15, 11, '#ffd9a8', OUT, 2);
    RR(x, cx - 8.5, 12.5, 17, 6, 2.5, '#17181d', OUT, 1.4);
    LN(x, [[cx - 8.5, 12.5], [cx + 8.5, 12.5]], '#3d3f4a', 1.5);
    x.globalAlpha = 0.3; LN(x, [[cx - 6, 14], [cx - 2, 14]], '#fff', 1.5); x.globalAlpha = 1;
    P(x, [[cx - 3.5, 23.5], [cx + 3.5, 23.5], [cx, 26.5]], OUT);
    C(x, cx - 15, 22, 3, '#ffd9a8', OUT, 1.4);
  });
  mk('e_minion', 36, 36, (x, cx) => {
    RR(x, cx + 12, 13.5, 10, 3.5, 1.5, '#3c3c46', OUT, 1.4);
    C(x, cx + 21, 15, 1.2, '#17181d');
    E(x, cx - 2, 18, 13, 12, grad(x, 6, 30, '#4a4a56', '#26262e'), OUT, 2.2);
    E(x, cx - 2, 18, 9, 8.2, '#2e2e38');
    E(x, cx - 2, 18, 9, 8.2, null, 'rgba(255,255,255,0.14)', 1.5);
    [-1, 1].forEach(s => {
      LN(x, [[cx - 2 + s * 5.5, 12.5], [cx - 2 + s * 2.5, 14.5]], OUT, 2);
      C(x, cx - 2 + s * 4, 17.5, 2.6, '#fff', OUT, 1.2);
      C(x, cx - 2 + s * 4, 18, 1.2, OUT);
    });
    P(x, [[cx - 5, 23], [cx + 1, 23], [cx - 2, 25.5]], OUT);
    shine(x, cx - 6, 13, 2.5, 1.2, 0.25);
  });
  mk('e_bossMeeting', 88, 92, (x, cx) => {
    feet(x, cx, 88, '#2e6b34');
    feet(x, cx - 17, 86, '#2e6b34'); feet(x, cx + 17, 86, '#2e6b34');
    E(x, cx - 14, 20, 5, 9, '#4c9a44', OUT, 2);
    E(x, cx + 14, 20, 5, 9, '#4c9a44', OUT, 2);
    E(x, cx, 52, 24, 26, grad(x, 26, 78, '#6dbb5f', '#3d8a3a'), OUT, 2.4);
    E(x, cx, 58, 15, 17, '#b8e0a8');
    P(x, [[cx - 3.5, 42], [cx + 3.5, 42], [cx, 50], [cx + 8, 60], [cx, 74], [cx - 8, 60]], '#c0392b', OUT, 1.8);
    P(x, [[cx - 3.5, 42], [cx + 3.5, 42], [cx, 48]], '#e05a4e', OUT, 1.3);
    [-2, -1, 0, 1, 2].forEach(i => {
      x.save(); x.translate(cx + i * 9, i % 2 ? 30 : 25); x.rotate(i * 0.3);
      P(x, [[-3, 0], [0, -6], [3, 0]], '#3d8a3a', OUT, 1.3);
      x.restore();
    });
    C(x, cx, 20, 16, grad(x, 4, 36, '#7ed957', '#4c9a44'), OUT, 2.4);
    E(x, cx, 27, 10, 7, '#8fca6f', OUT, 1.8);
    [-1, 1].forEach(s => {
      C(x, cx + s * 7, 15, 4, '#fff', OUT, 1.5);
      C(x, cx + s * 7, 15.8, 2, OUT);
      C(x, cx + s * 7, 14.6, 0.8, '#fff');
      LN(x, [[cx + s * 11, 9.5], [cx + s * 4, 11.5]], OUT, 2.4);
    });
    LN(x, [[cx - 5, 28], [cx - 2, 30]], OUT, 1.6);
    LN(x, [[cx + 5, 28], [cx + 2, 30]], OUT, 1.6);
    P(x, [[cx - 8, 29.5], [cx, 31.5], [cx + 8, 29.5], [cx + 6, 34], [cx, 32.5], [cx - 6, 34]], '#fdfdf8', OUT, 1.5);
  });
  mk('e_bossPPT', 90, 94, (x, cx) => {
    [-40, -25, 25, 40].forEach((s, i) => {
      x.save(); x.translate(cx + s, 20); x.rotate(s * 0.012);
      RR(x, -8, -12, 16, 22, 2, '#fdfdf6', OUT, 1.5);
      LN(x, [[-5, -5], [5, -5]], '#9aa8c0', 1.2);
      LN(x, [[-5, -1], [5, -1]], '#9aa8c0', 1.2);
      if (i === 1) { C(x, 0, 4, 3.5, '#f2b84c', null, 0); P(x, [[0, 4], [0, 0.5], [3.5, 4]], '#d9482f', null, 0); }
      if (i === 2) LN(x, [[-5, 3], [5, 7]], '#7ec97a', 1.5);
      x.restore();
    });
    RR(x, cx - 26, 22, 52, 58, 6, grad(x, 22, 80, '#d9482f', '#a03222'), OUT, 2.4);
    RR(x, cx - 26, 22, 8, 58, 5, '#8a2a1c');
    RR(x, cx - 20, 28, 40, 46, 4, 'rgba(255,255,255,0.1)');
    [-1, 1].forEach(s => {
      C(x, cx + s * 9, 44, 6.5, '#fff', OUT, 1.8);
      C(x, cx + s * 9, 45.5, 3.2, OUT);
      C(x, cx + s * 9, 42.8, 1.3, '#fff');
      LN(x, [[cx + s * 17, 35], [cx + s * 3, 38.5]], OUT, 3);
    });
    P(x, [[cx - 10, 60], [cx + 10, 60], [cx + 6, 66], [cx - 6, 66]], '#3c1210', OUT, 1.6);
    [-5, 0, 5].forEach(i => P(x, [[cx + i - 2.5, 60.5], [cx + i + 2.5, 60.5], [cx + i, 65]], '#fdfdf8', null, 0));
    RR(x, cx - 13, 71, 26, 6, 2, '#f2d38c', OUT, 1.4);
  });
  mk('e_bossKPI', 96, 100, (x, cx) => {
    E(x, cx - 30, 88, 7, 4, '#3c2050', OUT, 2);
    E(x, cx + 30, 88, 7, 4, '#3c2050', OUT, 2);
    E(x, cx - 24, 40, 6, 11, '#5a3a80', OUT, 2);
    E(x, cx + 24, 40, 6, 11, '#5a3a80', OUT, 2);
    E(x, cx, 60, 27, 27, grad(x, 33, 87, '#6d4494', '#3c2050'), OUT, 2.4);
    RR(x, cx - 15, 56, 30, 22, 5, '#241333', OUT, 1.8);
    x.fillStyle = '#ff5a8c'; x.font = 'bold 13px sans-serif'; x.textAlign = 'center';
    x.fillText('KPI', cx, 72);
    LN(x, [[cx - 15, 60], [cx + 15, 60]], 'rgba(255,90,140,0.5)', 1.5);
    [-18, -6, 6, 18].forEach((s, i) => {
      x.save(); x.translate(cx + s, 36); x.rotate(i % 2 ? 0.2 : -0.2);
      P(x, [[-4, 2], [0, -8], [4, 2]], '#2c1838', OUT, 1.5);
      x.restore();
    });
    C(x, cx, 26, 19, grad(x, 7, 45, '#8a5cb4', '#4c2a6b'), OUT, 2.4);
    [-1, 1].forEach(s => {
      E(x, cx + s * 8, 22, 5, 6, '#ffd23e', OUT, 1.6);
      E(x, cx + s * 8, 22, 2, 2.8, '#e05a2c');
      LN(x, [[cx + s * 14.5, 13], [cx + s * 4, 16]], OUT, 2.6);
    });
    P(x, [[cx - 9, 32], [cx + 9, 32], [cx + 6, 38], [cx, 35.5], [cx - 6, 38]], '#17101f', OUT, 1.6);
    [-5, 0, 5].forEach(i => P(x, [[cx + i - 2.5, 32.5], [cx + i + 2.5, 32.5], [cx + i, 37]], '#fdfdf8', null, 0));
    P(x, [[cx - 1.5, 33], [cx + 1.5, 33], [cx, 36]], '#e05a2c', null, 0);
  });
})();
