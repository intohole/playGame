(function () {
  Object.assign(Engine.prototype, {
    initMods() {
      this.mods = {
        bounty: 0, waveBonus: 0, rate: 0, dmg: 0, range: 0, rage: 0,
        ventDmg: 0, ventCd: 1, chestGold: 0, chestLuck: 0, comboBonus: 1,
        waveStartRate: 0, goldFlat: 0, execute: 0, costMul: 1, livesPlus: 0,
        instantGold: 0, rageBoom: 0, rageRefund: 0, rageBounty: 1, dividend: 0,
        enemySpd: 0, keyBoost: {}
      };
      this.goldLuck = 0;
      this.waveStartT = 0;
      this.waveBounty = 0;
      this.rerollComboGoal();
      this.ui.picking = null;
      this.ui.cardNo = 0;
    },
    rerollComboGoal() {
      this.comboGoal = (this.comboGoal || 0) + U.randInt(8, 14);
    },
    comboRainCheck() {
      if (this.combo < this.comboGoal) return;
      const g = U.randInt(20, 34) * (1 + this.mods.comboBonus * 0.5);
      this.addGold(Math.round(g));
      this.emitText('🤑 ' + this.combo + ' 连击 金币雨 +' + Math.round(g) + '!', CANVAS_W / 2, 110, '#fde047', 18);
      SFX.gem();
      for (let i = 0; i < 16; i++) this.emitHit(U.rand(60, CANVAS_W - 60), U.rand(40, 140), '#fde047', 2);
      this.comboRain = (this.comboRain || 0) + 1;
      this.rerollComboGoal();
    },
    rollRarity() {
      const g = CARD_RARE.g.weight + this.goldLuck;
      const b = CARD_RARE.b.weight;
      const r = Math.random() * (100 + this.goldLuck);
      if (r < g) { this.goldLuck = 0; return 'g'; }
      if (r < g + b) return 'b';
      this.goldLuck = Math.min(40, this.goldLuck + 8);
      return 'w';
    },
    openPicker() {
      if (this.ui.state === 'over') return;
      this.previewNext();
      const pool = { w: [], b: [], g: [] };
      CARDS.forEach(c => pool[c.rare].push(c));
      const picks = [];
      for (let i = 0; i < 3; i++) {
        let rare = this.rollRarity();
        if (!pool[rare].length) rare = 'w';
        let card = U.pick(pool[rare]);
        let guard = 0;
        while (picks.includes(card) && guard++ < 8) card = U.pick(pool[rare]);
        picks.push(card);
      }
      this.ui.picking = picks;
      this.ui.state = 'pick';
      this.autoWaveAfterPick = this.ui.autoWave && !this.result;
      SFX.levelup();
    },
    pickCard(i) {
      const card = this.ui.picking && this.ui.picking[i];
      if (!card || this.ui.state !== 'pick') return;
      this.ui.picking = null;
      this.ui.state = 'build';
      card.apply(this.mods);
      if (this.mods.instantGold) {
        this.addGold(this.mods.instantGold);
        this.mods.instantGold = 0;
      }
      if (this.mods.livesPlus) {
        this.maxLives += this.mods.livesPlus;
        this.lives += this.mods.livesPlus;
        this.ui.maxLives = this.maxLives;
        this.ui.lives = this.lives;
        this.mods.livesPlus = 0;
      }
      const color = CARD_RARE[card.rare].color;
      const extra = card.rare === 'b' && card.name === '今日限定' ? ' → ' + TOWER_DATA[this.mods.pickedKey].name : '';
      this.emitText(CARD_RARE[card.rare].name + '福利: ' + card.name + extra, CANVAS_W / 2, 170, color, 19);
      SFX.chest();
      this.ui.cardNo++;
      if (this.autoWaveAfterPick) {
        this.autoWaveAfterPick = false;
        setTimeout(() => { if (this.ui.state === 'build' && !this.ui.paused && !this.result) this.startWave(); }, 1600);
      }
    },
    tickPerm(dt) {
      if (this.waveStartT > 0) this.waveStartT -= dt;
    },
    grantRevengeCard() {
      const pool = CARDS.filter(c => c.rare === 'b');
      const card = U.pick(pool);
      this.revengeCardName = card.name;
      card.apply(this.mods);
      if (this.mods.instantGold) { this.addGold(this.mods.instantGold); this.mods.instantGold = 0; }
      if (this.mods.livesPlus) {
        this.maxLives += this.mods.livesPlus;
        this.lives += this.mods.livesPlus;
        this.ui.maxLives = this.maxLives;
        this.ui.lives = this.lives;
        this.mods.livesPlus = 0;
      }
      this.emitText('😤 复仇之怒: 白得「' + card.name + '」+ 金币 15%!', CANVAS_W / 2, 150, '#fb923c', 17);
    }
  });
})();
