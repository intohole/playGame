(function () {
  Object.assign(Engine.prototype, {
    initRage() {
      this.rage = 0;
      this.rageFx = 0;
      this.slowT = 0;
      this.flashT = 0;
      this.ventCd = 0;
      this.ventCount = 0;
      this.rageCast = 0;
      this._rageCue = false;
      this.ui.rage = 0;
    },
    rageGain(n) {
      if (this.ui.state === 'over' || this.rage >= 100) return;
      let m = (1 + 0.2 * (Save.load().tech.rage || 0)) * (1 + (this.mods ? this.mods.rage : 0));
      if (this.rage >= 88) m *= 1.6;
      this.rage = Math.min(100, this.rage + n * m);
      this.ui.rage = this.rage;
      if (this.rage >= 100 && !this._rageCue) {
        this._rageCue = true;
        SFX.rageReady();
        this.emitText('💢 怒气已满! 按 R 泄愤!', CANVAS_W / 2, 150, '#ff6b4a', 19);
      }
    },
    rageReady() { return this.ui.rage >= 100 && this.ui.state !== 'over'; },
    releaseRage() {
      if (!this.rageReady() || this.rageFx > 0) return;
      this.rage = 0;
      this.ui.rage = 0;
      this._rageCue = false;
      this.rageCast++;
      this.rageFx = 0.95;
      this.slowT = 0.5;
      this.flashT = 0.4;
      U.shake(12);
      SFX.rageRelease();
      const dmgMul = (0.18 + 0.025 * (Save.load().tech.rage || 0)) * (1 + this.mods.rageBoom);
      let hits = 0, killed = 0;
      const before = this.enemies.filter(e => e.alive).length;
      this.enemies.forEach(e => {
        if (!e.alive) return;
        e.takeDamage(Math.max(e.maxHp * dmgMul, 30), 'rage', true);
        if (!e.alive) killed++;
        e.stun(1.2);
        if (e.alive) this.emitHit(e.x, e.y, '#ff8a5c', 6);
        hits++;
      });
      if (killed && this.mods.rageRefund) {
        this.rageGain(Math.min(100 - this.rage, killed * 20 * this.mods.rageRefund));
        this.emitText('♻️ 泄愤循环 +' + Math.round(killed * 20 * this.mods.rageRefund) + ' 怒气', CANVAS_W / 2, CANVAS_H / 2 - 30, '#fde047', 15);
      }
      this.emitText('怒!砸!键!盘!', CANVAS_W / 2, CANVAS_H / 2 - 70, '#ff5a3c', 32);
      for (let i = 0; i < 42; i++) RageFX.keyRain(this);
      this.emitRing(CANVAS_W / 2, CANVAS_H / 2 + 40, '#ff6b4a');
      return hits;
    },
    tryVent(x, y) {
      if (this.ui.placing || this.ui.paused || this.ui.state === 'over') return false;
      if (this.ventCd > 0) return false;
      let hit = null;
      for (const e of this.enemies) {
        if (!e.alive) continue;
        if (U.dist(x, y, e.x, e.y) < e.def.size + 10) { hit = e; break; }
      }
      if (!hit) return false;
      this.ventCd = 0.75 * this.mods.ventCd;
      const m = (1 + 0.25 * (Save.load().tech.rage || 0)) * (1 + this.mods.ventDmg);
      const dmg = Math.max(10, hit.maxHp * (hit.def.boss ? 0.02 : 0.06)) * m;
      hit.takeDamage(dmg, 'rage', true);
      hit.flash = 0.14;
      if (hit.alive && !hit.def.boss && !hit.fly) hit.d = Math.max(0, hit.d - 9);
      U.shake(hit.def.boss ? 2 : 3.5);
      SFX.vent();
      this.emitText(U.pick(VENTS.pokes), hit.x, hit.y - 22, '#ff8a5c', 17);
      this.emitHit(hit.x, hit.y, '#ff8a5c', 5);
      this.ventCount++;
      this.rageGain(6);
      return true;
    },
    rageBarClick(x, y) {
      if (!this.rageReady()) return false;
      const r = RageFX.barRect();
      if (x > r.x0 && x < r.x0 + r.w && y > r.y0 && y < r.y0 + r.h) {
        this.releaseRage();
        return true;
      }
      return false;
    },
    tickRage(dt) {
      if (this.ventCd > 0) this.ventCd -= dt;
      if (this.slowT > 0) this.slowT -= dt;
      if (this.flashT > 0) this.flashT -= dt;
      if (this.rageFx > 0) this.rageFx -= dt;
    },
    saveRageStats() {
      if (!this.ventCount && !this.rageCast) return;
      const s = Save.load();
      s.ventCount = (s.ventCount || 0) + this.ventCount;
      s.rageCount = (s.rageCount || 0) + this.rageCast;
      Save.save();
    }
  });
})();
