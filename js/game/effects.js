(function () {
  Object.assign(Engine.prototype, {
    spawnChest() {
      for (let tries = 0; tries < 40; tries++) {
        const gx = U.randInt(0, 19), gy = U.randInt(0, 11);
        if (this.canPlace(gx, gy)) {
          this.chests.push({ x: gx * 48 + 24, y: gy * 48 + 24, t: 12 });
          return;
        }
      }
    },
    openChest(c) {
      this.chests = this.chests.filter(x => x !== c);
      this.chestCount++;
      Save.load().chests = this.chestCount; Save.save();
      SFX.chest();
      const r = Math.random();
      if (r < 0.5) {
        const g = Math.round((60 + this.waveIdx * 4 + U.randInt(0, 40)) * (1 + this.mods.chestGold));
        this.addGold(g);
        this.emitText('宝箱 +' + g + ' 金币!', c.x, c.y - 20, '#fbbf24', 17);
      } else if (r < 0.78) {
        this.buffT = 20;
        this.ui.buffs = [{ name: '全员咖啡', t: 20 }];
        this.emitText('全员咖啡! 攻速+30%', c.x, c.y - 20, '#4ade80', 16);
      } else {
        Save.addGems(1);
        this.emitText('💎 摸鱼券 +1', c.x, c.y - 20, '#c084fc', 17);
        SFX.gem();
      }
      this.emitBoom(c.x, c.y, 40);
    },
    spawnProjectile(o) { this.projs.push(new Projectile(o)); },
    nearestDistOnPath(path, x, y) {
      let best = 0, bd = Infinity;
      for (let d = 0; d < path.total; d += 24) {
        const p = path.at(d);
        const dd = U.dist(x, y, p.x, p.y);
        if (dd < bd) { bd = dd; best = d; }
      }
      return best;
    },
    emitText(text, x, y, color, size) { this.texts.push(new FloatText(x, y, text, color, size)); },
    emitHit(x, y, color, n) {
      for (let i = 0; i < (n || 8); i++) {
        const a = U.rand(0, Math.PI * 2), s = U.rand(40, 140);
        this.particles.push(new Particle(x, y, Math.cos(a) * s, Math.sin(a) * s, color, U.rand(0.25, 0.5), U.rand(2, 4), 160));
      }
    },
    emitBoom(x, y, r) {
      for (let i = 0; i < 18; i++) {
        const a = U.rand(0, Math.PI * 2), s = U.rand(60, 200);
        this.particles.push(new Particle(x, y, Math.cos(a) * s, Math.sin(a) * s, U.pick(['#fbbf24', '#f59e42', '#ef8f42']), U.rand(0.3, 0.6), U.rand(2, 5), 120));
      }
      this.particles.push(new Particle(x, y, 0, 0, '#fff7e0', 0.22, r * 0.8, 0));
    },
    emitMuzzle(t) {
      const mx = t.x + Math.cos(t.angle) * 16, my = t.y + Math.sin(t.angle) * 16;
      this.particles.push(new Particle(mx, my, 0, 0, '#fff2c8', 0.08, 7, 0));
    },
    emitRing(x, y, color) {
      this.particles.push(new Particle(x, y, 0, 0, color, 0.4, 34, 0));
    },
    emitShatter(e) {
      const boss = !!e.def.boss;
      const cols = boss ? ['#ff8a5c', '#ffd76b', '#fff', e.def.boss ? '#ff5a3c' : '#fff'] : ['#f2ead8', '#e8e6df', '#ffd76b', '#c9c2b0'];
      const n = boss ? 26 : 7;
      for (let i = 0; i < n; i++) {
        const a = U.rand(0, Math.PI * 2), s = U.rand(60, boss ? 260 : 170);
        const r = Math.random();
        const shape = r < 0.35 ? 'key' : r < 0.6 ? 'paper' : 'dot';
        this.particles.push(new Particle(e.x, e.y, Math.cos(a) * s, Math.sin(a) * s - 70, U.pick(cols), U.rand(0.4, 0.85), U.rand(2.5, 4.5), 330, shape));
      }
    }
  });
})();
