(function () {
  class Projectile {
    constructor(o) {
      Object.assign(this, o);
      this.dead = false;
      this.t = 0;
      const d = U.dist(this.x, this.y, this.tx || this.x, this.ty || this.y);
      this.dur = this.kind === 'lob' ? Math.max(0.3, d / this.speed) : 0;
      this.sx = this.x; this.sy = this.y;
      this.lastX = this.tx; this.lastY = this.ty;
      this.trail = 0;
    }
    update(dt, enemies) {
      if (this.kind === 'seek') {
        const tgt = this.target;
        if (tgt && tgt.alive) { this.lastX = tgt.x; this.lastY = tgt.y; }
        const d = U.dist(this.x, this.y, this.lastX, this.lastY);
        const step = this.speed * dt;
        this.trail += dt;
        if (d <= step + 6) {
          if (tgt && tgt.alive) this.tower.onHit(tgt, this);
          this.dead = true;
          G.emitHit(this.lastX, this.lastY, this.tower.data.color);
          return;
        }
        this.x += (this.lastX - this.x) / d * step;
        this.y += (this.lastY - this.y) / d * step;
        if (this.trail > 2.2) this.dead = true;
      } else {
        this.t += dt / this.dur;
        if (this.t >= 1) {
          this.dead = true;
          G.emitBoom(this.tx, this.ty, this.aoe);
          SFX.boom();
          for (const e of enemies) {
            if (!e.alive) continue;
            if (U.dist(this.tx, this.ty, e.x, e.y) <= this.aoe + e.def.size * 0.4) {
              const proj = { dmg: this.dmg };
              this.tower.onHit(e, proj);
              if (this.tower.base.stunChance && Math.random() < 0.5) e.stun(this.tower.base.stunDur);
            }
          }
          return;
        }
        this.x = U.lerp(this.sx, this.tx, this.t);
        this.y = U.lerp(this.sy, this.ty, this.t) - Math.sin(this.t * Math.PI) * 46;
      }
    }
  }
  class Particle {
    constructor(x, y, vx, vy, color, life, size, grav, shape) {
      this.x = x; this.y = y; this.vx = vx; this.vy = vy;
      this.color = color; this.life = life; this.max = life;
      this.size = size; this.grav = grav || 0;
      this.rot = U.rand(0, 6.28); this.vr = U.rand(-7, 7);
      this.shape = shape || 'dot';
      this.dead = false;
    }
    update(dt) {
      this.life -= dt;
      if (this.life <= 0) { this.dead = true; return; }
      this.x += this.vx * dt; this.y += this.vy * dt;
      this.vy += this.grav * dt;
      this.rot += this.vr * dt;
    }
  }
  class FloatText {
    constructor(x, y, text, color, size) {
      this.x = x; this.y = y; this.text = text;
      this.color = color; this.size = size || 13;
      this.life = 0.9; this.dead = false;
    }
    update(dt) {
      this.life -= dt;
      this.y -= 32 * dt;
      if (this.life <= 0) this.dead = true;
    }
  }
  window.Projectile = Projectile;
  window.Particle = Particle;
  window.FloatText = FloatText;
})();
