(function () {
  Object.assign(Engine.prototype, {
    tryPlace(gx, gy) {
      const key = this.ui.placing;
      if (!key) return;
      if (!this.canPlace(gx, gy)) { SFX.err(); return; }
      const cost = Tower.placeCost(key);
      if (this.gold < cost) { SFX.err(); this.emitText('金币不足', gx * 48 + 24, gy * 48, '#ef4444', 13); return; }
      const t = new Tower(key, gx, gy);
      t.invested = cost;
      this.towers.push(t);
      this.addGold(-cost);
      this.ui.placing = null;
      SFX.place();
      this.emitRing(t.x, t.y, TOWER_DATA[key].color);
    },
    upgradeSel() {
      const t = this.towers.find(x => x.id === this.ui.selectedId);
      if (!t || t.lv >= 3) return;
      const c = t.upgradeCostReal();
      if (this.gold < c) { SFX.err(); return; }
      this.addGold(-c);
      t.lv++;
      t.invested += c;
      SFX.upgrade();
      this.emitRing(t.x, t.y, '#4ade80');
      this.emitText('LV' + (t.lv + 1) + '!', t.x, t.y - 30, '#4ade80', 16);
    },
    sellSel() {
      const t = this.towers.find(x => x.id === this.ui.selectedId);
      if (!t) return;
      this.addGold(t.sellValue);
      this.towers = this.towers.filter(x => x !== t);
      this.ui.selectedId = 0;
      SFX.sell();
    },
    selectAt(x, y) {
      for (const t of this.towers) {
        if (U.dist(x, y, t.x, t.y) < 26) { this.ui.selectedId = t.id; SFX.click(); return true; }
      }
      return false;
    },
    onCanvasClick(x, y) {
      if (this.ui.state === 'over' || this.ui.paused || this.ui.state === 'pick') return;
      if (this.rageBarClick(x, y)) return;
      if (this.ui.placing) { this.tryPlace(Math.floor(x / 48), Math.floor(y / 48)); return; }
      if (this.tryVent(x, y)) return;
      if (this.selectAt(x, y)) return;
      for (const c of this.chests) {
        if (U.dist(x, y, c.x, c.y) < 30) { this.openChest(c); return; }
      }
      this.ui.selectedId = 0;
    },
    togglePause() {
      if (this.ui.state === 'over') return;
      this.ui.paused = !this.ui.paused;
      SFX.click();
    },
    toggleSpeed() {
      this.timeScale = this.timeScale === 1 ? 2 : 1;
      this.ui.speed = this.timeScale;
      SFX.click();
    },
    toggleAuto() {
      this.ui.autoWave = !this.ui.autoWave;
      Save.load().settings.autoWave = this.ui.autoWave; Save.save();
      SFX.click();
    },
    backHome() { this.ui.screen = 'levels'; this.ui.state = 'idle'; this.result = null; Save.save(); },
    syncPanel() {
      const t = this.towers.find(x => x.id === this.ui.selectedId);
      if (!t) { this.ui.selPanel = null; return; }
      const b = t.base;
      this.ui.selPanel = {
        x: t.x, y: t.y, key: t.key, emoji: t.data.emoji, name: t.data.name, desc: t.data.desc,
        lv: t.lv, dmg: b.aoe ? b.dmg + ' (AOE)' : b.dmg, rate: t.rate, range: t.range,
        kills: t.kills, upCost: t.lv < 3 ? t.upgradeCostReal() : 0, sell: t.sellValue
      };
    }
  });
})();
