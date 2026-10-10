(function () {
  Object.assign(Engine.prototype, {
    applyRole(roleKey) {
      const rk = ROLES[roleKey] ? roleKey : (Save.load().role || 'dev');
      this.roleKey = rk;
      this.roleDef = ROLES[rk];
      Object.assign(this.mods, this.roleDef.mods || {});
      const r = this.roleDef;
      if (r.gold) this.addGold(r.gold);
      if (r.lives) { this.maxLives += r.lives; this.lives += r.lives; }
      if (r.startRage) this.rage = Math.min(100, this.rage + r.startRage);
      Save.load().role = rk;
      Object.assign(this.ui, {
        roleName: r.name, roleEmoji: r.emoji,
        lives: this.lives, maxLives: this.maxLives, rage: this.rage, gold: Math.floor(this.gold)
      });
    },
    ventKill(e) {
      const sk = this.roleDef && this.roleDef.skins[e.key];
      if (!sk || (!e.def.boss && Math.random() > 0.3)) return;
      this.emitText(sk[1], e.x, e.y - (e.def.boss ? 48 : 30), '#ffc37a', e.def.boss ? 20 : 13);
    }
  });
})();
