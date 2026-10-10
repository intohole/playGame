(function () {
  const KEY_COLS = ['#e8e6df', '#ffd7c2', '#ffb08a', '#ff8a5c', '#ff6b4a'];
  function barRect() {
    return { x0: CANVAS_W / 2 - 130, y0: CANVAS_H - 30, w: 260, h: 17 };
  }
  function drawKeyProj(ctx, p) {
    const t = Math.min(1, (p.heat || 0) / 10);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.t === undefined ? 0 : Math.sin((p.trail || 0) * 18) * 0.5);
    ctx.fillStyle = KEY_COLS[Math.min(4, Math.floor(t * 4.99))];
    ctx.strokeStyle = '#241408';
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.roundRect(-5, -5, 10, 10, 2.2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = t > 0.6 ? '#fff' : '#5a554a';
    ctx.font = 'bold 7px ui-sans-serif, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(p.letter || 'W', 0, 2.6);
    ctx.restore();
  }
  function drawMouseProj(ctx, p) {
    const dx = p.lastX - p.x, dy = p.lastY - p.y;
    const ang = Math.atan2(dy, dx);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(ang + Math.PI / 4);
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#241408';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, -8); ctx.lineTo(5.5, 5); ctx.lineTo(1, 3.2); ctx.lineTo(-1.5, 7.5); ctx.lineTo(-3.5, 6); ctx.lineTo(-1, 2.2); ctx.lineTo(-5.5, 3.5);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.strokeStyle = 'rgba(56,189,248,' + (0.5 - (p.trail || 0) * 0.2) + ')';
    ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(p.x, p.y, 7 + (p.trail || 0) * 9, 0, 7); ctx.stroke();
  }
  function keyRain(G) {
    const x = U.rand(0, CANVAS_W);
    G.particles.push(new Particle(x, U.rand(-40, -10), U.rand(-20, 20), U.rand(140, 320), U.pick(KEY_COLS.concat(['#38bdf8', '#4ade80'])), U.rand(0.7, 1.2), U.rand(3.5, 5.5), 260, 'key'));
  }
  function nightFilter(ctx, G) {
    if (!G.level || !G.diff || G.diff.key !== 'crisis') return;
    ctx.save();
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(158,180,232,0.92)';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.globalCompositeOperation = 'source-over';
    if (!nightFilter.pat) {
      const pc = document.createElement('canvas');
      pc.width = 4; pc.height = 4;
      const px = pc.getContext('2d');
      px.fillStyle = 'rgba(5,8,20,0.10)';
      px.fillRect(0, 2, 4, 1);
      nightFilter.pat = ctx.createPattern(pc, 'repeat');
    }
    ctx.fillStyle = nightFilter.pat;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  }
  function overlay(ctx, G) {
    nightFilter(ctx, G);
    const combo = G.combo || 0;
    if (combo >= 12 && G.ui.state === 'wave') {
      const a = Math.min(0.22, (combo - 12) * 0.012);
      const g = ctx.createRadialGradient(CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.36, CANVAS_W / 2, CANVAS_H / 2, CANVAS_H * 0.78);
      g.addColorStop(0, 'rgba(255,60,30,0)');
      g.addColorStop(1, 'rgba(255,60,30,' + a + ')');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
    this.rageBar(ctx, G);
    RageFX.workerSlam(ctx, G);
    if (G.flashT > 0) {
      ctx.fillStyle = 'rgba(255,248,238,' + Math.min(0.8, G.flashT * 2.2) + ')';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
  }
  function rageBar(ctx, G) {
    if (!G.level) return;
    const r = barRect();
    const f = G.ui.rage / 100;
    const full = f >= 1;
    ctx.save();
    ctx.fillStyle = 'rgba(12,8,5,0.82)';
    ctx.strokeStyle = full ? '#ff6b4a' : 'rgba(255,138,92,0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.roundRect(r.x0 - 3, r.y0 - 3, r.w + 6, r.h + 6, 9); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2a1a12';
    ctx.beginPath(); ctx.roundRect(r.x0, r.y0, r.w, r.h, 6); ctx.fill();
    if (f > 0) {
      const g = ctx.createLinearGradient(r.x0, 0, r.x0 + r.w, 0);
      g.addColorStop(0, '#f59e42');
      g.addColorStop(1, full ? '#ff3b2a' : '#ff6b4a');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.roundRect(r.x0, r.y0, r.w * f, r.h, 6); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.beginPath(); ctx.roundRect(r.x0 + 2, r.y0 + 2, Math.max(0, r.w * f - 4), 4, 2); ctx.fill();
    }
    ctx.fillStyle = full ? '#fff' : '#c9a98a';
    ctx.font = '900 10px ui-sans-serif, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('💢', r.x0 + 5, r.y0 + 12.5);
    ctx.textAlign = 'right';
    ctx.fillText(Math.floor(G.ui.rage) + '%', r.x0 + r.w - 5, r.y0 + 12.5);
    if (full) {
      const pulse = 1 + Math.sin(performance.now() / 120) * 0.06;
      ctx.translate(CANVAS_W / 2, r.y0);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = '#ff6b4a';
      ctx.font = '900 13px ui-sans-serif, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('怒气已满! 按 R 或点这里 → 怒砸键盘!', 0, -8);
    }
    ctx.restore();
  }
  function workerSlam(ctx, G) {
    if (G.rageFx <= 0) return;
    const t = 1 - G.rageFx / 0.95;
    const sp = Sprites.get('worker');
    if (!sp) return;
    ctx.save();
    let sc, wy, rot = 0;
    if (t < 0.35) {
      const k = t / 0.35;
      sc = 0.6 + k * 1.5;
      wy = CANVAS_H + 60 - k * (CANVAS_H + 60 - (CANVAS_H / 2 - 10));
    } else if (t < 0.55) {
      const k = (t - 0.35) / 0.2;
      sc = 2.1;
      wy = CANVAS_H / 2 - 10 + Math.sin(k * Math.PI) * 14;
      rot = Math.sin(k * 26) * 0.06;
    } else {
      const k = (t - 0.55) / 0.45;
      sc = 2.1 * (1 - k * 0.35);
      wy = CANVAS_H / 2 + 4;
      ctx.globalAlpha = 1 - k;
      rot = Math.sin(t * 30) * 0.03;
    }
    const cx = CANVAS_W / 2;
    ctx.translate(cx, wy);
    ctx.rotate(rot);
    if (t >= 0.35 && t < 0.55) {
      const g = ctx.createRadialGradient(0, 40, 10, 0, 40, 200);
      g.addColorStop(0, 'rgba(255,107,74,0.4)');
      g.addColorStop(1, 'rgba(255,107,74,0)');
      ctx.fillStyle = g;
      ctx.fillRect(-220, -160, 440, 400);
    }
    ctx.drawImage(sp.cv, -sp.w * sc / 2, -sp.h * sc + 20, sp.w * sc, sp.h * sc);
    ctx.restore();
  }
  window.RageFX = { barRect, drawKeyProj, drawMouseProj, keyRain, overlay, rageBar, workerSlam };
})();
