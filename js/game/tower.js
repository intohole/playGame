(function () {
  let uid = 1;
  class Tower {
    constructor(key, gx, gy) {
      this.id = uid++;
      this.key = key;
      this.data = TOWER_DATA[key];
      this.lv = 0;
      this.gx = gx; this.gy = gy;
      this.x = gx * 48 + 24; this.y = gy * 48 + 24;
      this.cd = 0;
      this.angle = -Math.PI / 2;
      this.kills = 0;
      this.heat = 0; this.heatTgt = null; this.heatClock = 0;
      this.invested = this.data.levels[0].cost;
    }
    get base() { return this.data.levels[this.lv]; }
    get rate() {
      let r = this.base.rate;
      if (this.key === 'coffee') r *= 1 + 0.10 * (Save.load().tech.coffee || 0);
      r *= 1 + G.mods.rate;
      if (G.waveStartT > 0) r *= 1 + G.mods.waveStartRate;
      r *= 1 + G.rateBuff();
      if (G.dailyTags.includes('rate')) r *= 1.15;
      return r;
    }
    get dmg() {
      let d = this.base.dmg;
      d *= 1 + 0.08 * (Save.load().tech.welfare || 0);
      d *= (1 + G.mods.dmg) * (1 + (G.mods.keyBoost[this.key] || 0));
      return d;
    }
    get range() { return this.base.range * (1 + G.mods.range); }
    get nextCost() { return this.lv < 3 ? this.data.levels[this.lv + 1].cost : 0; }
    get sellValue() { return Math.floor(this.invested * SELL_RATE); }
    upgradeCostReal() {
      let c = this.nextCost;
      if (G.dailyTags.includes('cheap')) c = Math.ceil(c * 0.75);
      return Math.ceil(c * G.mods.costMul);
    }
    static placeCost(key) {
      let c = TOWER_DATA[key].levels[0].cost;
      if (G.dailyTags.includes('cheap')) c = Math.ceil(c * 0.75);
      return Math.ceil(c * (G.mods ? G.mods.costMul : 1));
    }
    update(dt, enemies) {
      if (this.cd > 0) this.cd -= dt;
      if (this.recoil > 0) this.recoil = Math.max(0, this.recoil - dt * 7);
      if (this.flashT > 0) this.flashT -= dt;
      if (this.heatClock > 0) {
        this.heatClock -= dt;
        if (this.heatClock <= 0) { this.heat = 0; this.heatTgt = null; }
      }
      const target = this.findTarget(enemies);
      if (!target) return;
      this.angle = U.angleTo(this.x, this.y, target.x, target.y);
      if (this.cd <= 0) {
        this.cd = 1 / this.rate;
        this.fire(target);
      }
    }
    findTarget(enemies) {
      let best = null, bestProg = -1;
      for (const e of enemies) {
        if (!e.alive) continue;
        if (U.dist(this.x, this.y, e.x, e.y) > this.range + e.def.size * 0.5) continue;
        if (e.progress > bestProg) { bestProg = e.progress; best = e; }
      }
      return best;
    }
    fire(target) {
      this.recoil = 1;
      this.flashT = 0.12;
      G.emitMuzzle(this);
      const b = this.base;
      if (this.key === 'abacus') {
        const lead = U.clamp(target.speed * (U.dist(this.x, this.y, target.x, target.y) / b.projSpeed), 0, 40);
        const px = U.clamp(target.x + Math.cos(target.angle) * lead, 0, CANVAS_W);
        const py = U.clamp(target.y + Math.sin(target.angle) * lead, 0, CANVAS_H);
        G.spawnProjectile({ kind: 'lob', x: this.x, y: this.y, tx: px, ty: py, speed: b.projSpeed, dmg: this.dmg, aoe: b.aoe, tower: this });
      } else {
        G.spawnProjectile({ kind: 'seek', x: this.x, y: this.y - 10, target, speed: b.projSpeed, dmg: this.dmg, tower: this, letter: U.pick(['W', 'A', 'S', 'D', 'F', 'J', 'K', 'ESC']), heat: this.heat });
        if (this.key === 'frame') SFX.sniper();
        else if (this.key === 'mouse') SFX.mouseShot();
        else SFX.shoot();
      }
    }
    onHit(target, proj) {
      const b = this.base;
      let dmg = proj.dmg;
      if (this.key === 'keyboard') {
        if (this.heatTgt !== target || this.heatClock <= 0) { this.heatTgt = target; this.heat = 0; }
        this.heat = Math.min(10, this.heat + 1);
        this.heatClock = 2;
        dmg *= 1 + 0.08 * this.heat;
        G.rageGain(0.8);
      }
      if (this.key === 'mouse' && target.alive && target.hp < target.maxHp * 0.35) {
        dmg *= 2;
        G.emitText('斩杀!', target.x, target.y - 30, '#38bdf8', 15);
      }
      let crit = false;
      if (b.crit && Math.random() < b.crit) { dmg *= b.critMul; crit = true; }
      const type = this.key === 'frame' ? 'magic' : 'phys';
      const dealt = target.takeDamage(dmg, type, false, this.key === 'mouse');
      if (crit && dealt > 0) G.emitText('暴击 ' + Math.round(dealt), target.x, target.y - 26, '#ff5a3c', 18);
      if (this.key === 'plant' && target.alive) {
        target.applySlow(b.slow, b.slowDur);
        target.applyPoison(this.dmg * 0 + b.poison, b.poisonDur);
      }
      if (b.stunChance && target.alive && Math.random() < b.stunChance) {
        target.stun(b.stunDur);
        G.emitText('晕', target.x, target.y - 18, '#67c5f0', 12);
      }
      if (target.alive === false && this.key === 'frame' && b.killCash) {
        G.addGold(b.killCash);
        G.emitText('+' + b.killCash, target.x, target.y - 30, '#fbbf24', 12);
      }
    }
  }
  window.Tower = Tower;
})();
