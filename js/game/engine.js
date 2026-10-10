(function () {
  class Engine {
    constructor() {
      this.ui = Vue.reactive({
        screen: 'home', state: 'idle', gold: 0, lives: 10, maxLives: 10,
        waveIdx: 0, waveTotal: 10, combo: 0, speed: 1, paused: false,
        placing: null, selectedId: 0, selPanel: null, buffs: [], nextPreview: [], autoWave: false,
        isEndless: false, chestsOpen: 0, bossAlive: false, levelName: '', waveInProg: false, rage: 0,
        picking: null, cardNo: 0, diffName: ''
      });
      this.enemies = []; this.towers = []; this.projs = [];
      this.particles = []; this.texts = []; this.chests = [];
      this.dailyTags = []; this.paths = []; this.flyPath = null;
      this.wave = null; this.waveT = 0; this.waveIdx = 0;
      this.level = null; this.kills = 0; this.combo = 0; this.buffT = 0;
      this.hover = null; this.result = null; this.timeScale = 1;
      this.chestCount = 0; this.guaranteeChest = true;
    }
    start(levelId, tags, isDaily, diffKey, revenge) {
      tags = tags || [];
      const base = LEVELS.find(l => l.id === levelId);
      const diff = DIFFS.find(d => d.key === diffKey) || DIFFS[1];
      const lv = Object.assign({}, base, {
        baseId: base.id, diff: diff.key,
        hpMul: base.hpMul * diff.hpMul,
        lives: Math.max(3, Math.round(base.lives * diff.livesMul))
      });
      this.level = lv;
      this.diff = diff;
      this.isDaily = !!isDaily;
      this.dailyTags = tags || [];
      this.paths = lv.paths.map(p => new TDPath(p));
      this.flyPath = lv.flyPath ? new TDPath(lv.flyPath) : null;
      const tech = Save.load().tech;
      this.maxLives = lv.lives + 2 * (tech.hrq || 0) + (tags.includes('life') ? -4 : 0);
      this.lives = this.maxLives;
      this.gold = Math.round(base.startGold * (0.5 + base.hpMul * 0.5) * diff.goldMul) + 60 * (tech.admin || 0) + (tags.includes('gold') ? 120 : 0);
      if (revenge) this.gold = Math.round(this.gold * 1.15);
      this.missed = 0;
      this.enemies = []; this.towers = []; this.projs = [];
      this.particles = []; this.texts = []; this.chests = [];
      this.waveIdx = 0; this.wave = null; this.kills = 0; this.combo = 0;
      this.result = null; this.chestCount = 0; this.guaranteeChest = true;
      this.timeScale = 1;
      this.initMods();
      this.initRage();
      if (revenge) this.grantRevengeCard();
      Object.assign(this.ui, {
        screen: 'game', state: 'build', gold: this.gold, lives: this.lives, maxLives: this.maxLives,
        waveIdx: 0, waveTotal: lv.endless ? 0 : lv.waves, combo: 0, speed: 1, paused: false,
        placing: null, selectedId: 0, selPanel: null, buffs: [], isEndless: !!lv.endless, levelName: lv.name, waveInProg: false,
        diffName: diff.name
      });
      this.previewNext();
    }
    previewNext() {
      const nw = this.waveIdx + 1;
      if (!this.level) return;
      if (!this.level.endless && nw > this.level.waves) { this.ui.nextPreview = []; return; }
      const w = WaveGen.buildWave(this.level, nw);
      const seen = [];
      w.spawns.forEach(s => { if (!seen.includes(s.type)) seen.push(s.type); });
      this.ui.nextPreview = seen.slice(0, 5);
    }
    bountyMul() {
      let m = (this.level.endless ? Math.pow(1.085, this.waveIdx || 1) : this.level.hpMul) * 1.25;
      m *= this.diff.goldMul;
      m *= 1 + this.mods.bounty;
      m *= 1 + 0.1 * (Save.load().tech.fin || 0);
      if (this.dailyTags.includes('hp')) m *= 1.4;
      if (this.dailyTags.includes('life')) m *= 1.3;
      return m;
    }
    rateBuff() { return this.buffT > 0 ? 0.3 : 0; }
    addGold(n) { this.gold += n; this.ui.gold = Math.floor(this.gold); }
    startWave() {
      if (this.ui.state !== 'build') return;
      this.waveStartT = 3;
      if (this.mods.goldFlat) {
        this.addGold(this.mods.goldFlat);
        this.emitText('🏦 利息 +' + this.mods.goldFlat, CANVAS_W / 2, 100, '#93c5fd', 14);
      }
      this.waveBounty = 0;
      this.waveIdx++;
      this.ui.waveIdx = this.waveIdx;
      this.wave = WaveGen.buildWave(this.level, this.waveIdx);
      this.waveT = 0;
      this.ui.state = 'wave';
      this.ui.waveInProg = true;
      SFX.waveStart();
      if (this.wave.isBoss) { SFX.bossRoar(); U.shake(6); this.ui.bossAlive = true; }
      this.pending = this.wave.spawns.slice();
    }
    endWave() {
      this.ui.state = 'build';
      this.ui.waveInProg = false;
      this.ui.bossAlive = false;
      if (!this.level.endless && this.waveIdx >= this.level.waves) {
        this.addGold(Math.round((20 + this.waveIdx * 3) * this.level.hpMul * 0.8));
        this.finish(true);
        return;
      }
      const reward = Math.round((20 + this.waveIdx * 3) * this.level.hpMul * 0.8 * (this.dailyTags.includes('hp') ? 1.4 : 1) * (1 + this.mods.waveBonus));
      this.addGold(reward);
      this.emitText('+' + reward + ' 波次奖金', CANVAS_W / 2, 60, '#fbbf24', 16);
      if (this.mods.dividend) {
        const dv = Math.round(this.waveBounty * this.mods.dividend);
        if (dv > 0) { this.addGold(dv); this.emitText('📈 分红 +' + dv, CANVAS_W / 2, 84, '#86efac', 14); }
      }
      this.rollChest();
      if (this.ui.autoWave && !this.result && (this.level.endless || this.waveIdx < this.level.waves)) {
        this.openPicker();
      } else {
        this.openPicker();
      }
    }
    rollChest() {
      if (this.waveIdx < 2 && this.guaranteeChest) { this.spawnChest(); this.guaranteeChest = false; return; }
      if (this.chests.length < 2 && Math.random() < 0.32 + this.mods.chestLuck) this.spawnChest();
    }
    spawnPending(dt) {
      this.waveT += dt;
      while (this.pending && this.pending.length && this.pending[0].delay <= this.waveT) {
        const s = this.pending.shift();
        this.spawnEnemy(s);
      }
      if (this.pending && !this.pending.length && !this.enemies.some(e => e.alive)) this.endWave();
    }
    spawnEnemy(s) {
      const raw = WaveGen.waveHpMul(this.level, this.waveIdx);
      const hpMul = ENEMY_DATA[s.type].boss ? this.level.hpMul * (1 + 0.06 * this.waveIdx) : raw;
      const spd = this.level.spdMul * (this.dailyTags.includes('spd') ? 1.2 : 1) * (1 + this.mods.enemySpd);
      const e = new Enemy(s.type, this.paths, this.flyPath, hpMul, spd, this.bountyMul(), s.affix);
      if (s.pathIdx !== undefined && !e.fly) e.path = this.paths[s.pathIdx % this.paths.length];
      this.enemies.push(e);
    }
    spawnMinion(type, x, y, path) {
      const e = new Enemy(type, this.paths, this.flyPath, WaveGen.waveHpMul(this.level, this.waveIdx) * 0.6, this.level.spdMul, this.bountyMul());
      e.path = path;
      e.d = this.nearestDistOnPath(path, x, y);
      const p = path.at(e.d);
      e.x = p.x; e.y = p.y;
      this.enemies.push(e);
    }
    onEnemyKilled(e) {
      this.kills++;
      this.combo++;
      this.comboPeak = Math.max(this.comboPeak || 0, this.combo);
      this.ui.combo = this.combo;
      this.waveBounty += e.bounty;
      let bounty = e.bounty;
      if (this.rageFx > 0 && this.mods.rageBounty > 1) {
        bounty *= this.mods.rageBounty;
        this.emitText('♻️ ×' + this.mods.rageBounty, e.x, e.y - 30, '#fde047', 14);
      }
      this.addGold(bounty);
      this.emitText('+' + Math.round(bounty), e.x, e.y - 14, '#fbbf24', 12);
      this.emitHit(e.x, e.y, '#fbbf24', e.def.boss ? 26 : 8);
      this.emitShatter(e);
      this.rageGain(e.def.boss ? 40 : 3);
      if (e.def.boss) {
        SFX.bossDie();
        U.shake(10);
        this.slowT = 0.7;
        this.flashT = 0.35;
        this.ui.bossAlive = false;
        this.emitText(e.def.name + ' 被击败!', CANVAS_W / 2, 80, '#4ade80', 20);
      } else SFX.coin(this.combo % 5);
      this.comboRainCheck();
      if (e.def.split) {
        for (let i = 0; i < 2; i++) this.spawnMinion(e.def.split, e.x + U.rand(-10, 10), e.y + U.rand(-10, 10), e.path);
      }
      if (e.affixKeys && e.affixKeys.includes('split')) {
        for (let i = 0; i < 2; i++) this.spawnMinion('minion', e.x + U.rand(-10, 10), e.y + U.rand(-10, 10), e.path);
      }
    }
    onEnemyReached(e) {
      this.missed++;
      this.lives -= e.def.dmg;
      this.combo = 0;
      this.ui.combo = 0;
      this.ui.lives = Math.max(0, this.lives);
      SFX.leak();
      U.shake(e.def.boss ? 9 : 4);
      this.emitText('-' + e.def.dmg + ' ❤️', e.x, e.y - 20, '#ef4444', 15);
      if (this.lives <= 0) this.finish(false);
    }
    finish(win) {
      if (this.result) return;
      const lv = this.level;
      let stars = 0, gems = 0;
      if (win) {
        stars = 1 + (this.lives >= Math.ceil(this.maxLives * 0.7) ? 1 : 0) + (this.lives >= this.maxLives ? 1 : 0);
        if (this.isDaily) {
          const first = !Save.dailyDone();
          gems = first ? 3 + stars : 1;
          const dr = Save.setDaily(stars);
          this.dailyResult = dr;
          gems += dr.streakGems;
        } else {
          const prev = Save.getStars(lv.id);
          const improved = stars > prev;
          Save.setStars(lv.id, stars);
          gems = improved ? lv.gems : 1;
          if (this.diff.key === 'crisis') {
            const cPrev = Save.getCrisisStars(lv.id);
            Save.setCrisisStars(lv.id, stars);
            gems += stars > cPrev ? (this.diff.bonusGem || 3) : 1;
          }
          if (lv.id === 5) Save.unlockAch('ch1');
          if (lv.id === 10) Save.unlockAch('ch2');
          if (lv.id === 15) Save.unlockAch('ch3');
        }
      } else if (lv.endless) {
        gems = Math.floor(this.waveIdx / 5);
        if (this.waveIdx > Save.load().endlessBest) {
          Save.load().endlessBest = this.waveIdx;
          Save.save();
        }
      } else if (this.waveIdx >= 3) {
        gems = 1;
      }
      if (gems > 0) Save.addGems(gems);
      Save.recordGame(win, this.kills);
      this.saveRageStats();
      this.checkAch();
      this.result = {
        win, stars, gems, kills: this.kills, waves: this.waveIdx,
        missed: this.missed, bestCombo: this.comboPeak || 0, diff: this.diff.key,
        streak: this.dailyResult ? this.dailyResult.streak : 0,
        isDaily: this.isDaily, dailyDate: U.todayStr()
      };
      this.ui.state = 'over';
      if (win) SFX.win(); else SFX.lose();
    }
    checkAch() {
      const s = Save.load();
      ACHIEVEMENTS.forEach(a => {
        if (!s.ach[a.id] && a.check(s)) {
          Save.unlockAch(a.id);
          this.emitText('🏆 成就: ' + a.name, CANVAS_W / 2, 140, '#c084fc', 16);
          SFX.levelup();
        }
      });
    }
    canPlace(gx, gy) {
      const x = gx * 48 + 24, y = gy * 48 + 24;
      if (gx < 0 || gx > 19 || gy < 0 || gy > 11) return false;
      if (U.dist(x, y, this.level.desk[0], this.level.desk[1]) < this.level.deskR + 18) return false;
      for (const p of this.paths) if (p.distToPath(x, y) < 42) return false;
      if (this.flyPath && this.flyPath.distToPath(x, y) < 30 && false) return false;
      for (const t of this.towers) if (U.dist(x, y, t.x, t.y) < 42) return false;
      return true;
    }
    frame(ts) {
      if (!this._last) this._last = ts;
      let dt = Math.min(0.05, (ts - this._last) / 1000);
      this._last = ts;
      if (this.ui.screen === 'game' && !this.ui.paused && this.ui.state !== 'over') {
        const step = dt * this.timeScale * (this.slowT > 0 ? 0.3 : 1);
        this.tick(step);
        this.tickRage(dt);
      }
      if (this.ui.screen === 'game') {
        this.syncPanel();
        Renderer.render(this);
      }
    }
    tick(dt) {
      if (this.buffT > 0) {
        this.buffT -= dt;
        this.ui.buffs = this.buffT > 0 ? [{ name: '全员咖啡', t: Math.ceil(this.buffT) }] : [];
      }
      if (this.ui.state === 'wave') this.spawnPending(dt);
      this.tickPerm(dt);
      this.enemies.forEach(e => e.update(dt));
      this.enemies = this.enemies.filter(e => {
        if (e.reached) { this.onEnemyReached(e); return false; }
        return e.alive;
      });
      this.towers.forEach(t => t.update(dt, this.enemies));
      this.projs.forEach(p => p.update(dt, this.enemies));
      this.projs = this.projs.filter(p => !p.dead);
      this.particles.forEach(p => p.update(dt));
      this.particles = this.particles.filter(p => !p.dead);
      this.texts.forEach(t => t.update(dt));
      this.texts = this.texts.filter(t => !t.dead);
      this.chests.forEach(c => { c.t -= dt; });
      this.chests = this.chests.filter(c => {
        if (c.t <= 0) { this.openChest(c); return false; }
        return true;
      });
    }
  }
  window.Engine = Engine;
  window.G = new Engine();
})();
