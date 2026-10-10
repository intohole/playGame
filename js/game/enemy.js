(function () {
  let uid = 1;
  class Enemy {
    constructor(typeKey, paths, flyPath, hpMul, spdMul, bountyMul, affix) {
      const def = ENEMY_DATA[typeKey];
      this.id = uid++;
      this.def = def;
      this.key = typeKey;
      this.affixKeys = affix ? affix.split('+') : [];
      const k = this.affixKeys;
      let hpFactor = 1;
      if (k.includes('tough')) hpFactor *= 1.45;
      if (k.includes('giant')) hpFactor *= 1.15;
      this.maxHp = Math.round(def.hp * hpMul * hpFactor);
      this.hp = this.maxHp;
      this.baseSpeed = def.speed * spdMul * (k.includes('fast') ? 1.5 : 1);
      this.sizeMul = k.includes('giant') ? 1.3 : 1;
      this.armorBonus = k.includes('armored') ? 0.2 : 0;
      this.regenOn = k.includes('regen');
      this.furious = k.includes('furious');
      this.fly = !!def.fly;
      this.path = this.fly && flyPath ? flyPath : paths[this.id % paths.length];
      this.d = 0;
      this.x = this.path.at(0).x;
      this.y = this.path.at(0).y;
      this.angle = 0;
      this.slowF = 0; this.slowT = 0;
      this.poisonDps = 0; this.poisonT = 0;
      this.stunT = 0;
      this.alive = true;
      this.reached = false;
      this.bounty = Math.max(1, Math.round(def.bounty * bountyMul));
      if (k.includes('rich')) this.bounty = Math.round(this.bounty * 2.5);
      this.raged = false;
      this.summonedAt = 1;
      this.flash = 0;
      this.wob = Math.random() * Math.PI * 2;
    }
    get speed() {
      let s = this.baseSpeed;
      if (this.slowT > 0 && !this.fly) s *= (1 - this.slowF);
      if (this.raged) s *= 2;
      return s;
    }
    get progress() { return this.d / this.path.total; }
    update(dt) {
      if (!this.alive) return;
      this.wob += dt * 6;
      if (this.flash > 0) this.flash -= dt;
      if (this.stunT > 0) { this.stunT -= dt; return; }
      if (this.poisonT > 0) {
        this.poisonT -= dt;
        this.takeDamage(this.poisonDps * dt, 'poison', true);
        if (!this.alive) return;
      }
      if (this.slowT > 0) this.slowT -= dt;
      if (this.regenOn && this.hp < this.maxHp) this.hp = Math.min(this.maxHp, this.hp + this.maxHp * 0.007 * dt);
      if (this.affixKeys.includes('fast') && Math.random() < dt * 14) {
        G.particles.push(new Particle(this.x + U.rand(-6, 6), this.y + 4, U.rand(-14, 14), U.rand(-28, -8), '#ff8a5c', 0.38, 2.4, 50));
      }
      this.d += this.speed * dt;
      if (this.d >= this.path.total) { this.reached = true; this.alive = false; return; }
      const p = this.path.at(this.d);
      this.x = p.x; this.y = p.y; this.angle = p.angle;
      if ((this.def.rage || this.furious) && !this.raged && this.hp < this.maxHp * 0.4) {
        this.raged = true;
        U.shake(7);
        G.emitText('狂暴!', this.x, this.y - 24, '#ef4444', 16);
      }
      if (this.def.summon && this.hp > 0) {
        const stage = Math.floor((1 - this.hp / this.maxHp) / 0.2) + 1;
        if (stage >= this.summonedAt && this.summonedAt <= 4) {
          this.summonedAt++;
          for (let i = 0; i < 2; i++) G.spawnMinion('sheet', this.x, this.y, this.path);
          G.emitText('撒报表!', this.x, this.y - 24, '#67c5f0', 14);
        }
      }
    }
    takeDamage(amount, type, silent, noDodge) {
      if (!this.alive) return 0;
      if (type === 'phys' && this.def.dodge && !silent && !noDodge) {
        if (Math.random() < this.def.dodge) {
          G.emitText('闪避', this.x, this.y - 18, '#a89a80', 11);
          return 0;
        }
      }
      let dmg = amount;
      if (type === 'phys') dmg *= 1 - Math.min(0.85, (this.def.armor || 0) + this.armorBonus);
      else if (type === 'magic') dmg *= (1 - (this.def.mr || 0) * 0.5);
      if (G.mods && G.mods.execute && this.hp < this.maxHp * 0.25 && type !== 'rage') dmg *= 1 + G.mods.execute;
      this.hp -= dmg;
      if (!silent) this.flash = 0.08;
      if (this.hp <= 0) this.die();
      return dmg;
    }
    die() {
      this.alive = false;
      G.onEnemyKilled(this);
    }
    applySlow(f, dur) {
      if (this.fly) return;
      if (f >= this.slowF) { this.slowF = f; this.slowT = Math.max(this.slowT, dur); }
    }
    applyPoison(dps, dur) {
      if (dps >= this.poisonDps) { this.poisonDps = dps; this.poisonT = Math.max(this.poisonT, dur); }
    }
    stun(dur) { this.stunT = Math.max(this.stunT, this.def.boss ? dur * 0.4 : dur); }
  }
  window.Enemy = Enemy;
})();
