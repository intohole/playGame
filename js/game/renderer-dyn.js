(function () {
  let time = 0;
  Object.assign(window.Renderer, {
    towers(ctx, G) {
      for (const t of G.towers) {
        const D = t.data;
        ctx.save();
        ctx.translate(t.x, t.y);
        if (G.ui.selectedId === t.id) {
          ctx.fillStyle = 'rgba(245,158,66,0.08)';
          ctx.strokeStyle = 'rgba(245,158,66,0.5)'; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(0, 0, t.range, 0, 7); ctx.fill(); ctx.stroke();
        }
        const bs = Sprites.get('b_' + t.key);
        ctx.drawImage(bs.cv, -24, -26, 48, 48);
        const rec = Math.max(0, t.recoil || 0) * 4;
        if (t.key === 'frame') {
          if ((t.flashT || 0) > 0) {
            const g = ctx.createRadialGradient(0, -6, 4, 0, -6, 30);
            g.addColorStop(0, 'rgba(192,132,252,0.5)'); g.addColorStop(1, 'rgba(192,132,252,0)');
            ctx.fillStyle = g; ctx.fillRect(-30, -36, 60, 60);
          }
          const fs = Sprites.get('t_frame');
          ctx.drawImage(fs.cv, -23, -28 + rec, 46, 48);
        } else {
          ctx.rotate(t.angle + Math.PI / 2);
          const ts = Sprites.get('t_' + t.key);
          ctx.drawImage(ts.cv, -ts.w / 2, -ts.h + 8 + rec, ts.w, ts.h);
        }
        ctx.restore();
        if (G.ui.selectedId === t.id) {
          ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(t.x, t.y, 25, 0, 7); ctx.stroke();
        }
        for (let i = 0; i <= t.lv; i++) {
          ctx.save();
          ctx.translate(t.x - 9 + i * 6, t.y + 22);
          ctx.rotate(Math.PI / 4);
          ctx.fillStyle = i === t.lv ? '#fff1c4' : '#fbbf24';
          ctx.strokeStyle = '#241408'; ctx.lineWidth = 1;
          ctx.fillRect(-2.6, -2.6, 5.2, 5.2); ctx.strokeRect(-2.6, -2.6, 5.2, 5.2);
          ctx.restore();
        }
      }
    },
    enemies(ctx, G) {
      for (const e of G.enemies) {
        if (!e.alive) continue;
        const sp = Sprites.get('e_' + e.key);
        const w = sp.w * e.sizeMul, h = sp.h * e.sizeMul;
        const fly = e.fly ? Math.sin(time * 3 + e.wob) * 3 - 12 : 0;
        ctx.save();
        E2(ctx, e.x, e.y + 2, e.def.size * 0.8 * e.sizeMul, e.def.size * 0.28 * e.sizeMul, 'rgba(0,0,0,0.35)');
        ctx.translate(e.x, e.y + fly);
        if (e.raged) {
          const g = ctx.createRadialGradient(0, -h / 2, 4, 0, -h / 2, h * 0.8);
          g.addColorStop(0, 'rgba(255,80,60,0.35)'); g.addColorStop(1, 'rgba(255,80,60,0)');
          ctx.fillStyle = g; ctx.fillRect(-h, -h * 1.6, h * 2, h * 2);
        }
        const sq = 1 + Math.sin(e.wob * 2) * (e.fly ? 0.03 : 0.055);
        ctx.scale(Math.cos(e.angle) < -0.05 ? -1 : 1, 1);
        ctx.transform(2 - sq, 0, 0, sq, 0, 0);
        ctx.drawImage(sp.cv, -w / 2, -h + 2, w, h);
        if (e.flash > 0) {
          ctx.globalAlpha = 0.85;
          ctx.drawImage(Sprites.white('e_' + e.key), -w / 2, -h + 2, w, h);
          ctx.globalAlpha = 1;
        }
        ctx.restore();
        const top = e.y + fly - h;
        this.hpBar(ctx, e, top);
      }
    },
    hpBar(ctx, e, top) {
      const w = Math.max(26, e.def.size * 2.1 * e.sizeMul), x0 = e.x - w / 2, y = top - 7;
      ctx.fillStyle = 'rgba(10,8,5,0.78)';
      ctx.beginPath(); ctx.roundRect(x0 - 1, y - 1, w + 2, 5.5, 2.7); ctx.fill();
      if (e.affixKeys && e.affixKeys.length) {
        ctx.strokeStyle = '#fbbf24'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.roundRect(x0 - 1, y - 1, w + 2, 5.5, 2.7); ctx.stroke();
      }
      const f = Math.max(0, e.hp / e.maxHp);
      if (f > 0) {
        const g = ctx.createLinearGradient(0, y, 0, y + 3.5);
        g.addColorStop(0, e.def.boss ? '#ff8a7a' : '#86e29b');
        g.addColorStop(1, e.def.boss ? '#d63b2f' : '#35a24e');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.roundRect(x0, y, w * f, 3.5, 1.7); ctx.fill();
      }
      let sx = x0 + w + 4;
      if (e.poisonT > 0) { ctx.fillStyle = '#4ade80'; ctx.beginPath(); ctx.arc(sx, y + 1.8, 2.2, 0, 7); ctx.fill(); sx += 6; }
      if (e.slowT > 0) { ctx.fillStyle = '#67c5f0'; ctx.beginPath(); ctx.arc(sx, y + 1.8, 2.2, 0, 7); ctx.fill(); sx += 6; }
      if (e.stunT > 0) { ctx.fillStyle = '#ffd23e'; ctx.beginPath(); ctx.arc(sx, y + 1.8, 2.2, 0, 7); ctx.fill(); }
      if (e.affixKeys && e.affixKeys.length) {
        ctx.font = '900 10px ui-sans-serif, sans-serif';
        ctx.textAlign = 'left';
        e.affixKeys.forEach((ak, i) => {
          const af = AFFIXES.find(a => a.key === ak);
          if (af) ctx.fillText(af.icon, x0 + i * 11, y - 3);
        });
      }
    },
    projs(ctx, G) {
      for (const p of G.projs) {
        if (p.kind === 'lob') {
          const gy = U.lerp(p.sy, p.ty, p.t);
          E2(ctx, U.lerp(p.sx, p.tx, p.t), gy + 40 * (1 - p.t), 5, 2.2, 'rgba(0,0,0,0.3)');
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.t * 14);
          ctx.fillStyle = '#d9482f';
          ctx.beginPath(); ctx.arc(0, 0, 5, 0, 7); ctx.fill();
          ctx.fillStyle = '#f2b84c';
          ctx.beginPath(); ctx.arc(-1.5, -1.5, 1.8, 0, 7); ctx.fill();
          ctx.strokeStyle = '#7a2416'; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.arc(0, 0, 5, 0.4, 2.2); ctx.stroke();
          ctx.restore();
        } else {
          const dx = p.lastX - p.x, dy = p.lastY - p.y;
          const dd = Math.hypot(dx, dy) || 1;
          const ux = dx / dd, uy = dy / dd;
          const col = p.tower.data.color;
          for (let i = 1; i <= 3; i++) {
            ctx.globalAlpha = 0.28 / i;
            ctx.fillStyle = col;
            ctx.beginPath(); ctx.arc(p.x - ux * i * 6, p.y - uy * i * 6, (p.tower.key === 'frame' ? 4 : 3.2) * (1 - i * 0.2), 0, 7); ctx.fill();
          }
          ctx.globalAlpha = 1;
          ctx.save();
          ctx.translate(p.x, p.y);
          if (p.tower.key === 'keyboard') { ctx.restore(); RageFX.drawKeyProj(ctx, p); continue; }
          if (p.tower.key === 'mouse') { ctx.restore(); RageFX.drawMouseProj(ctx, p); continue; }
          if (p.tower.key === 'frame') {
            const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 8);
            g.addColorStop(0, 'rgba(230,190,255,0.95)'); g.addColorStop(0.45, col); g.addColorStop(1, 'rgba(192,132,252,0)');
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(0, 0, 8, 0, 7); ctx.fill();
          } else if (p.tower.key === 'plant') {
            ctx.rotate(Math.atan2(dy, dx));
            ctx.fillStyle = '#6fd05f'; ctx.strokeStyle = '#2c6b2c'; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.ellipse(0, 0, 5.5, 2.6, 0, 0, 7); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-5.5, 0); ctx.lineTo(5.5, 0); ctx.stroke();
          } else {
            ctx.fillStyle = '#7a4218';
            ctx.beginPath(); ctx.arc(0, 0, 4.2, 0, 7); ctx.fill();
            ctx.fillStyle = '#ffb75e';
            ctx.beginPath(); ctx.arc(0, 0, 2.6, 0, 7); ctx.fill();
            ctx.fillStyle = '#fff3d8';
            ctx.beginPath(); ctx.arc(-0.8, -0.8, 1.1, 0, 7); ctx.fill();
          }
          ctx.restore();
        }
      }
    },
    particles(ctx, G) {
      for (const p of G.particles) {
        const a = Math.max(0, p.life / p.max);
        ctx.globalAlpha = a;
        if (p.shape === 'key' || p.shape === 'paper') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot || 0);
          ctx.fillStyle = p.shape === 'paper' ? '#f4f2ea' : p.color;
          ctx.strokeStyle = 'rgba(36,20,8,0.8)';
          ctx.lineWidth = 1;
          const s = p.size * (0.6 + a * 0.6);
          if (p.shape === 'key') {
            ctx.beginPath(); ctx.roundRect(-s, -s, s * 2, s * 2, s * 0.5); ctx.fill(); ctx.stroke();
          } else {
            ctx.beginPath(); ctx.rect(-s * 1.3, -s * 0.9, s * 2.6, s * 1.8); ctx.fill(); ctx.stroke();
          }
          ctx.restore();
          continue;
        }
        ctx.fillStyle = p.color;
        if (p.vx === 0 && p.vy === 0 && p.grav === 0 && p.size > 20) {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (1.4 - a), 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * a + 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    },
    texts(ctx, G) {
      ctx.textAlign = 'center';
      for (const t of G.texts) {
        ctx.globalAlpha = Math.min(1, t.life * 2);
        ctx.font = '900 ' + t.size + 'px ui-sans-serif, sans-serif';
        ctx.strokeStyle = 'rgba(10,7,3,0.85)';
        ctx.lineWidth = 3;
        ctx.strokeText(t.text, t.x, t.y);
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, t.x, t.y);
      }
      ctx.globalAlpha = 1;
    },
    chests(ctx, G) {
      for (const c of G.chests) {
        const pulse = 1 + Math.sin(time * 6) * 0.12;
        ctx.save();
        ctx.translate(c.x, c.y + Math.sin(time * 4) * 2);
        const g = ctx.createRadialGradient(0, -4, 2, 0, -4, 30);
        g.addColorStop(0, 'rgba(251,191,36,0.30)'); g.addColorStop(1, 'rgba(251,191,36,0)');
        ctx.fillStyle = g; ctx.fillRect(-30, -34, 60, 60);
        ctx.strokeStyle = 'rgba(251,191,36,0.55)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(0, -4, 19 * pulse, 0, 7); ctx.stroke();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(0, -4, 16, -Math.PI / 2, -Math.PI / 2 + (c.t / 12) * Math.PI * 2); ctx.stroke();
        const sp = Sprites.get('chest');
        ctx.drawImage(sp.cv, -16, -20, 32, 28);
        ctx.restore();
      }
    },
    placeHint(ctx, G) {
      if (!G.ui.placing) return;
      ctx.fillStyle = 'rgba(122,220,150,0.075)';
      for (let gx = 0; gx < 20; gx++) for (let gy = 0; gy < 12; gy++)
        if (G.canPlace(gx, gy)) {
          ctx.beginPath(); ctx.roundRect(gx * 48 + 5, gy * 48 + 5, 38, 38, 7); ctx.fill();
        }
    },
    ghost(ctx, G) {
      if (!G.ui.placing || G.hover === null) return;
      const gx = Math.floor(G.hover.x / 48), gy = Math.floor(G.hover.y / 48);
      const ok = G.canPlace(gx, gy);
      const x = gx * 48 + 24, y = gy * 48 + 24;
      const data = TOWER_DATA[G.ui.placing];
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = ok ? '#4ade80' : '#ef4444';
      ctx.beginPath(); ctx.arc(x, y, data.levels[0].range, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = ok ? '#4ade80' : '#ef4444';
      ctx.lineWidth = 2; ctx.setLineDash([7, 7]);
      ctx.beginPath(); ctx.arc(x, y, data.levels[0].range, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = ok ? '#4ade80' : '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.stroke();
      const bs = Sprites.get('b_' + G.ui.placing), ts = Sprites.get('t_' + G.ui.placing);
      ctx.globalAlpha = 0.6;
      ctx.drawImage(bs.cv, x - 24, y - 26, 48, 48);
      ctx.globalAlpha = 0.75;
      if (G.ui.placing === 'frame') ctx.drawImage(ts.cv, x - 23, y - 28, 46, 48);
      else ctx.drawImage(ts.cv, x - ts.w / 2, y - ts.h + 8, ts.w, ts.h);
      ctx.restore();
    },
    bossBar(ctx, G) {
      const boss = G.enemies.find(e => e.alive && e.def.boss);
      if (!boss) return;
      const bw = 420, x0 = CANVAS_W / 2 - bw / 2, y0 = 12, h = 26;
      ctx.save();
      ctx.fillStyle = 'rgba(12,8,5,0.85)';
      ctx.beginPath(); ctx.roundRect(x0 - 4, y0 - 4, bw + 8, h + 8, 8); ctx.fill();
      ctx.strokeStyle = 'rgba(239,110,90,0.8)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.roundRect(x0 - 4, y0 - 4, bw + 8, h + 8, 8); ctx.stroke();
      const sp = Sprites.get('e_' + boss.key);
      ctx.drawImage(sp.cv, x0 + 2, y0 + h - sp.h + 4, sp.h * 0.75, sp.h * 0.75);
      ctx.fillStyle = '#3d1515';
      ctx.beginPath(); ctx.roundRect(x0 + 28, y0 + 7, bw - 36, 12, 6); ctx.fill();
      const f = Math.max(0, boss.hp / boss.maxHp);
      if (f > 0) {
        const g = ctx.createLinearGradient(0, y0, 0, y0 + 19);
        g.addColorStop(0, '#ff9a8a'); g.addColorStop(1, '#d63b2f');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.roundRect(x0 + 28, y0 + 7, (bw - 36) * f, 12, 6); ctx.fill();
      }
      ctx.fillStyle = '#ffd7d7';
      ctx.font = '900 11px ui-sans-serif, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(boss.dispName + '  ' + U.fmt(boss.hp) + ' / ' + U.fmt(boss.maxHp), CANVAS_W / 2 + 8, y0 + 17);
      ctx.restore();
    }
  });
  function E2(ctx, px, py, rx, ry, f) { ctx.fillStyle = f; ctx.beginPath(); ctx.ellipse(px, py, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); }
})();
