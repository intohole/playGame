(function () {
  let time = 0;
  const R = {
    staticCv: null, staticKey: null, portals: [],
    render(G) {
      const cv = document.getElementById('gameCanvas');
      if (!cv) return;
      const ctx = cv.getContext('2d');
      time += 1 / 60;
      ctx.save();
      const sh = U.getShake();
      if (sh) ctx.translate(U.rand(-sh, sh), U.rand(-sh, sh));
      this.buildStatic(G);
      ctx.drawImage(this.staticCv, 0, 0, CANVAS_W, CANVAS_H);
      this.portalsAnim(ctx, G);
      this.deskTop(ctx, G);
      this.chests(ctx, G);
      this.towers(ctx, G);
      this.enemies(ctx, G);
      this.projs(ctx, G);
      this.particles(ctx, G);
      this.texts(ctx, G);
      this.placeHint(ctx, G);
      this.ghost(ctx, G);
      this.bossBar(ctx, G);
      RageFX.overlay(ctx, G);
      ctx.restore();
    },
    buildStatic(G) {
      if (!G.level) return;
      const key = G.level.id + (G.isDaily ? 'D' : '');
      if (this.staticKey === key) return;
      this.staticKey = key;
      const c = document.createElement('canvas');
      c.width = CANVAS_W * 2; c.height = CANVAS_H * 2;
      const x = c.getContext('2d');
      x.scale(2, 2); x.lineJoin = 'round'; x.lineCap = 'round';
      this.floor(x);
      this.runner(x, G);
      this.decor(x, G);
      this.deskBase(x, G);
      this.vignette(x);
      this.staticCv = c;
      this.portals = G.paths.map(p => {
        for (let d = 0; d < p.total; d += 8) {
          const pt = p.at(d);
          if (pt.x > 26 && pt.x < CANVAS_W - 26 && pt.y > 26 && pt.y < CANVAS_H - 26) return { x: pt.x, y: pt.y };
        }
        return null;
      }).filter(Boolean);
    },
    floor(x) {
      x.fillStyle = '#3b3f47';
      x.fillRect(0, 0, CANVAS_W, CANVAS_H);
      for (let gx = 0; gx < 20; gx++) for (let gy = 0; gy < 12; gy++)
        if ((gx + gy) % 2) { x.fillStyle = 'rgba(255,255,255,0.018)'; x.fillRect(gx * 48, gy * 48, 48, 48); }
      x.fillStyle = 'rgba(0,0,0,0.05)';
      for (let gx = 0; gx <= 20; gx++) for (let gy = 0; gy <= 12; gy++) {
        x.beginPath(); x.arc(gx * 48, gy * 48, 1.4, 0, 7); x.fill();
      }
      const pools = [[180, 130, 150], [740, 110, 160], [240, 470, 140], [700, 460, 150], [480, 280, 180]];
      pools.forEach(([px, py, r]) => {
        const g = x.createRadialGradient(px, py, 10, px, py, r);
        g.addColorStop(0, 'rgba(255,216,150,0.06)');
        g.addColorStop(1, 'rgba(255,216,150,0)');
        x.fillStyle = g;
        x.fillRect(px - r, py - r, r * 2, r * 2);
      });
      x.fillStyle = 'rgba(255,214,140,0.035)';
      [[120, 60, -0.5], [560, 100, 0.6]].forEach(([px, py, a]) => {
        x.save(); x.translate(px, py); x.rotate(a);
        x.beginPath(); x.roundRect(0, 0, 260, 90, 20); x.fill();
        x.restore();
      });
    },
    runner(x, G) {
      const draw = (p) => {
        x.strokeStyle = '#191510'; x.lineWidth = 46;
        this.trace(x, p);
        x.strokeStyle = '#4a3a26'; x.lineWidth = 38;
        this.trace(x, p);
        x.strokeStyle = '#40311f'; x.lineWidth = 28;
        this.trace(x, p);
        x.strokeStyle = 'rgba(0,0,0,0.14)'; x.lineWidth = 1.2;
        for (let d = 24; d < p.total; d += 48) {
          const pt = p.at(d);
          x.save(); x.translate(pt.x, pt.y); x.rotate(pt.angle + Math.PI / 2);
          x.beginPath(); x.moveTo(-14, 0); x.lineTo(14, 0); x.stroke();
          x.restore();
        }
      };
      G.paths.forEach(draw);
      if (G.flyPath) {
        x.strokeStyle = 'rgba(103,197,240,0.30)';
        x.lineWidth = 2.5; x.setLineDash([5, 13]);
        this.trace(x, G.flyPath);
        x.setLineDash([]);
        for (let d = 40; d < G.flyPath.total; d += 120) {
          const pt = G.flyPath.at(d);
          x.fillStyle = 'rgba(160,215,240,0.22)';
          x.beginPath(); x.ellipse(pt.x, pt.y, 9, 4, 0, 0, 7); x.fill();
          x.beginPath(); x.ellipse(pt.x + 7, pt.y - 2, 6, 3, 0, 0, 7); x.fill();
        }
      }
    },
    trace(x, p) {
      x.beginPath();
      p.pts.forEach((pt, i) => i ? x.lineTo(pt.x, pt.y) : x.moveTo(pt.x, pt.y));
      x.stroke();
    },
    decor(x, G) {
      const rng = U.mulberry32(typeof G.level.id === 'number' ? G.level.id * 977 + 13 : 4242);
      const items = ['p_fern', 'p_cooler', 'p_copy', 'p_cab', 'p_box', 'p_shred'];
      const cand = [];
      for (let gx = 0; gx < 20; gx++) for (let gy = 0; gy < 12; gy++) {
        const cx = gx * 48 + 24, cy = gy * 48 + 24;
        if (!G.canPlace(gx, gy)) continue;
        let far = U.dist(cx, cy, G.level.desk[0], G.level.desk[1]) > 92;
        for (const p of G.paths) if (p.distToPath(cx, cy) < 76) far = false;
        if (!far) continue;
        cand.push({ cx, cy, edge: Math.min(gx, 19 - gx, gy, 11 - gy) });
      }
      cand.sort((a, b) => b.edge - a.edge || rng() - 0.5);
      const used = [];
      let n = 0;
      for (const cd of cand) {
        if (n >= 9) break;
        if (used.some(u => U.dist(u.cx, u.cy, cd.cx, cd.cy) < 95)) continue;
        const key = items[Math.floor(rng() * items.length)];
        const sp = Sprites.get(key);
        x.save();
        x.translate(cd.cx + (rng() - 0.5) * 10, cd.cy + 14);
        if (rng() < 0.5) { x.scale(-1, 1); }
        x.drawImage(sp.cv, -sp.w / 2, -sp.h + 3, sp.w, sp.h);
        x.restore();
        used.push(cd); n++;
      }
    },
    deskBase(x, G) {
      const [dx, dy] = G.level.desk;
      E2(x, dx, dy + 34, 40, 12, 'rgba(0,0,0,0.3)');
      const sp = Sprites.get('desk');
      x.drawImage(sp.cv, dx - 46, dy - 54, 92, 84);
      x.strokeStyle = 'rgba(245,158,66,0.4)';
      x.lineWidth = 2; x.setLineDash([6, 8]);
      x.beginPath(); x.arc(dx, dy + 8, G.level.deskR + 4, 0, 7); x.stroke();
      x.setLineDash([]);
    },
    vignette(x) {
      const g = x.createRadialGradient(CANVAS_W / 2, CANVAS_H / 2, 220, CANVAS_W / 2, CANVAS_H / 2, 620);
      g.addColorStop(0, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(8,5,2,0.42)');
      x.fillStyle = g;
      x.fillRect(0, 0, CANVAS_W, CANVAS_H);
    },
    portalsAnim(ctx, G) {
      for (const p of this.portals) {
        ctx.save(); ctx.translate(p.x, p.y);
        const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 30);
        g.addColorStop(0, 'rgba(245,158,66,0.28)');
        g.addColorStop(1, 'rgba(245,158,66,0)');
        ctx.fillStyle = g; ctx.fillRect(-30, -30, 60, 60);
        ctx.globalCompositeOperation = 'destination-over';
        ctx.globalCompositeOperation = 'source-over';
        E2(ctx, 0, 6, 16, 5, 'rgba(0,0,0,0.35)');
        ctx.fillStyle = '#14100a';
        ctx.beginPath(); ctx.ellipse(0, -4, 14, 9, 0, 0, 7); ctx.fill();
        for (let i = 0; i < 3; i++) {
          ctx.strokeStyle = ['rgba(245,158,66,0.85)', 'rgba(255,196,110,0.6)', 'rgba(255,235,190,0.4)'][i];
          ctx.lineWidth = 2.5 - i * 0.5;
          ctx.beginPath();
          ctx.ellipse(0, -4, 14 - i * 3.5, 9 - i * 2.2, 0, time * (2.2 + i) + i * 2, time * (2.2 + i) + i * 2 + 4);
          ctx.stroke();
        }
        ctx.restore();
      }
    },
    deskTop(ctx, G) {
      const [dx, dy] = G.level.desk;
      ctx.save();
      ctx.beginPath(); ctx.rect(dx - 15, dy - 30, 30, 9); ctx.clip();
      ctx.fillStyle = 'rgba(80,220,110,0.16)';
      for (let i = 0; i < 3; i++) {
        const yy = dy - 28 + ((time * 26 + i * 5) % 8);
        ctx.fillRect(dx - 13, yy, U.rand(8, 26), 1.5);
      }
      ctx.restore();
      const hp = G.lives / G.maxLives;
      ctx.fillStyle = 'rgba(10,8,5,0.75)';
      ctx.beginPath(); ctx.roundRect(dx - 22, dy + 38, 44, 6, 3); ctx.fill();
      ctx.fillStyle = hp > 0.6 ? '#4ade80' : hp > 0.3 ? '#fbbf24' : '#ef4444';
      ctx.beginPath(); ctx.roundRect(dx - 21, dy + 39, 42 * Math.max(0, hp), 4, 2); ctx.fill();
    }
  };
  function E2(ctx, px, py, rx, ry, f) { ctx.fillStyle = f; ctx.beginPath(); ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
  window.Renderer = R;
})();
