(function () {
  const GameScreen = {
    template: `
    <div class="game-screen">
      <div class="hud-top">
        <div class="stat" :style="{color: ui.lives <= 3 ? 'var(--red)' : ''}"><span class="ico">❤️</span>{{ ui.lives }}<span style="color:var(--ink-dim); font-size:12px">/{{ ui.maxLives }}</span></div>
        <div class="stat" style="color:var(--gold)"><span class="ico">🪙</span>{{ ui.gold }}</div>
        <div class="stat"><span class="ico">🌊</span>{{ ui.waveIdx }}<span style="color:var(--ink-dim); font-size:12px">/{{ ui.isEndless ? '∞' : ui.waveTotal }}</span></div>
        <div class="stat" v-if="ui.combo >= 5" style="color:var(--amber)">🔥×{{ ui.combo }}</div>
        <div class="spacer"></div>
        <span class="hud-role" v-if="ui.roleName" :title="G.roleDef ? G.roleDef.perk : ''">{{ ui.roleEmoji }} {{ ui.roleName }}</span>
        <div class="wave-label">{{ ui.levelName }}<span v-if="ui.diffName !== '正式工'" style="margin-left:6px; color:var(--amber)">{{ ui.diffName }}</span></div>
        <button class="icon-btn rage" :class="{ready: G.rageReady()}" @click="G.releaseRage()" title="怒砸键盘 (R)" aria-label="怒砸键盘">💢</button>
        <button class="icon-btn" :class="{active: ui.speed === 2}" @click="G.toggleSpeed()" title="加速" aria-label="二倍速">⏩</button>
        <button class="icon-btn" :class="{active: ui.autoWave}" @click="G.toggleAuto()" title="自动开波" aria-label="自动开波">🔁</button>
        <button class="icon-btn" :class="{active: US.settings.sfx}" @click="toggleSfx" title="音效" :aria-label="US.settings.sfx ? '关闭音效' : '开启音效'">{{ US.settings.sfx ? '🔊' : '🔇' }}</button>
        <button class="icon-btn bosskey" @click="boss()" title="老板键 (Esc)" aria-label="老板键伪装">🕶️</button>
        <button class="icon-btn" @click="G.togglePause()" title="暂停 (空格)" :aria-label="ui.paused ? '继续' : '暂停'">{{ ui.paused ? '▶️' : '⏸' }}</button>
        <button class="icon-btn" @click="quit()" title="撤退" aria-label="撤退选关">🚪</button>
      </div>
      <div class="stage-wrap" ref="stage">
        <canvas id="gameCanvas" width="960" height="576" class="game-canvas"
          @click="onClick" @mousemove="onMove" @mouseleave="G.hover = null"></canvas>
        <transition name="banner">
          <div class="wave-banner" v-if="banner" :key="banner.id" aria-live="polite">
            <div class="wb-k">{{ banner.kicker }}</div>
            <div class="wb-t">{{ banner.title }}</div>
            <div class="wb-s">{{ banner.sub }}</div>
          </div>
        </transition>
        <div class="speed-chip" style="position:absolute" v-if="ui.speed === 2">⏩ 2倍速中</div>
        <div class="speed-chip" style="position:absolute; top:44px" v-if="ui.buffs.length" >☕ {{ ui.buffs[0].name }} {{ ui.buffs[0].t }}s</div>
        <div class="next-wave-hint" v-if="ui.state === 'build' && ui.nextPreview.length">
          <b style="color:var(--ink)">下一波敌人</b>
          <div class="icons">
            <span class="pv-col" v-for="k in ui.nextPreview" :key="k">
              <span class="pv"><canvas width="38" height="38" :data-k="'e_' + k"></canvas></span>
              <span class="pv-name">{{ skinName(k) }}</span>
            </span>
          </div>
        </div>
        <button v-if="ui.state === 'build' && !ui.paused" class="start-wave-btn" @click="G.startWave()">
          {{ isLastWave ? '最终波' : '开波' }}
        </button>
        <div class="tower-panel" v-if="sp" :style="panelPos">
          <h4><canvas class="pico" width="30" height="30" :data-k="'t_' + sp.key"></canvas> {{ sp.name }} <span class="lvl">LV{{ sp.lv + 1 }}/4</span></h4>
          <div class="stats">
            <div><span>伤害</span> <b>{{ sp.dmg }}</b></div>
            <div><span>攻速</span> <b>{{ sp.rate.toFixed(2) }}/s</b></div>
            <div><span>射程</span> <b>{{ sp.range }}</b></div>
            <div><span>击杀数</span> <b>{{ sp.kills }}</b></div>
          </div>
          <div style="font-size:11.5px; color:var(--ink-dim); margin-bottom:10px">{{ sp.desc }}</div>
          <div class="row2">
            <button v-if="sp.lv < 3" class="btn mint" :disabled="ui.gold < sp.upCost" @click="G.upgradeSel()">
              升级 🪙{{ sp.upCost }}
            </button>
            <button v-else class="btn ghost" disabled>已满级</button>
            <button class="btn red" @click="G.sellSel()">卖 🪙{{ sp.sell }}</button>
          </div>
        </div>
        <div class="pause-veil" v-if="ui.paused && ui.state !== 'over'">
          <h2>⏸ 已暂停</h2>
          <p style="color:var(--ink-dim)">老板走了吗？走按空格继续</p>
          <div style="display:flex; gap:12px">
            <button class="btn mint" @click="G.togglePause()">继续摸鱼</button>
            <button class="btn ghost" @click="boss()">🕶️ 老板键</button>
            <button class="btn red" @click="quit()">撤退</button>
          </div>
        </div>
        <div class="modal-mask" v-if="ui.picking">
          <div class="card modal" style="text-align:center; max-width:620px">
            <h2>🎁 波间福利 · 三选一</h2>
            <p style="color:var(--ink-dim); font-size:12.5px">选一张福利卡强化本局战线，效果可无限叠加</p>
            <div style="display:flex; gap:12px; justify-content:center; margin:18px 0 10px; flex-wrap:wrap">
              <div v-for="(c, i) in ui.picking" :key="i" class="perm-card"
                   :style="{ borderColor: CARD_RARE[c.rare].color }" @click="G.pickCard(i)">
                <div class="rare" :style="{ color: CARD_RARE[c.rare].color }">{{ CARD_RARE[c.rare].name }}</div>
                <div class="ico">{{ c.emoji }}</div>
                <h4>{{ c.name }}</h4>
                <p>{{ c.desc }}</p>
              </div>
            </div>
            <p style="font-size:11px; color:var(--ink-dim)">连续没抽到传说卡会累积幸运值，金卡迟早到来</p>
          </div>
        </div>
        <div class="modal-mask" v-if="ui.state === 'over' && G.result">
          <div class="card modal">
            <template v-if="G.result.win">
              <h2>🎉 守住了！</h2>
              <div class="result-stars">
                <span v-for="i in 3" :key="i" class="s" :style="{opacity: i <= G.result.stars ? 1 : .18}">⭐</span>
              </div>
              <p>{{ starTip }}</p>
              <p class="result-vent">「{{ resultVent }}」</p>
            </template>
            <template v-else>
              <h2>💀 摸鱼时间被偷走了</h2>
              <p>坚持到第 {{ G.result.waves }} 波，击杀 {{ G.result.kills }} 只工作怪。<br>复仇再战：白得 1 张随机稀有福利卡 + 15% 金币！</p>
              <p class="result-vent">「{{ resultVent }}」</p>
            </template>
            <div class="stat-table">
              <div class="tr"><span>击杀数</span><b>{{ G.result.kills }}</b></div>
              <div class="tr"><span>坚持波数</span><b>{{ G.result.waves }}</b></div>
              <div class="tr" v-if="G.result.bestCombo"><span>最高连击</span><b>🔥 ×{{ G.result.bestCombo }}</b></div>
              <div class="tr" v-if="G.result.streak && G.result.isDaily"><span>连续摸鱼</span><b>🔥 {{ G.result.streak }} 天</b></div>
              <div class="tr" v-if="G.result.gems"><span>摸鱼券奖励</span><b class="gem-text">💎 +{{ G.result.gems }}</b></div>
            </div>
            <div class="row">
              <button class="btn ghost" @click="quit()">选关</button>
              <button v-if="!G.result.win" class="btn" style="background:linear-gradient(135deg,#fb923c,#f87171); color:#fff" @click="retry(true)">😤 带着强化复仇</button>
              <button v-else class="btn" @click="retry(false)">再来一局</button>
              <button v-if="G.result.win && G.result.isDaily" class="btn ghost" @click="shareResult()">{{ shareOk ? '✓ 已复制' : '📋 复制战绩' }}</button>
              <button v-if="G.result.win && nextId" class="btn mint" @click="$emit('play', nextId)">下一关 →</button>
            </div>
          </div>
        </div>
      </div>
      <div class="tower-bar">
        <div v-for="k in TOWER_ORDER" :key="k" class="tower-card"
          :class="{off: ui.gold < towerCost(k), sel: ui.placing === k}" @click="pick(k)">
          <span class="hotkey">{{ TOWER_DATA[k].hotkey }}</span>
          <canvas class="ticon" width="56" height="52" :data-k="'t_' + k"></canvas>
          <div class="nm">{{ TOWER_DATA[k].name }}</div>
          <div class="pr">🪙 {{ towerCost(k) }}</div>
        </div>
        <div style="align-self:center; font-size:12px; color:var(--ink-dim); max-width:240px; line-height:1.5; padding-left:8px">
          点塔 → 点地图建造<br>战斗中<b style="color:#ff8a5c">点击敌人「怼一下」</b>泄愤攒怒气<br>💢 怒气满按 <b>R</b> 怒砸键盘！
        </div>
      </div>
    </div>`,
    setup(props, { emit }) {
      const ui = G.ui;
      const stage = Vue.ref(null);
      const sp = Vue.computed(() => ui.selPanel);
      const isLastWave = Vue.computed(() => !ui.isEndless && ui.waveIdx + 1 >= ui.waveTotal);
      const panelPos = Vue.computed(() => {
        const t = ui.selPanel;
        if (!t || !stage.value) return {};
        const cv = stage.value.querySelector('canvas');
        const scale = cv ? cv.clientWidth / CANVAS_W : 1;
        const left = cv.offsetLeft + t.x * scale + 30;
        const top = cv.offsetTop + t.y * scale - 60;
        return {
          left: Math.min(left, (stage.value.clientWidth || 960) - 240) + 'px',
          top: U.clamp(top, 8, 999) + 'px'
        };
      });
      const nextId = Vue.computed(() => {
        if (!G.result || !G.result.win) return 0;
        const id = G.level.id;
        return typeof id === 'number' && id < 15 && !G.isDaily ? id + 1 : 0;
      });
      const starTip = Vue.computed(() => {
        const r = G.result;
        if (!r) return '';
        if (r.stars === 3) return '满血通关！完美打工人（反义词）';
        if (r.stars === 2) return '只漏了 ' + r.missed + ' 只——满血收官就是三星，这波必须完美！';
        return '守住了，但漏了 ' + r.missed + ' 只。三星？再来一把的事';
      });
      const shareOk = Vue.ref(false);
      const banner = Vue.ref(null);
      let bannerId = 0;
      const roleDef = Vue.computed(() => G.roleDef || ROLES[US.role]);
      function skinName(k) {
        const sk = roleDef.value && roleDef.value.skins[k];
        return sk ? sk[0] : (ENEMY_DATA[k] ? ENEMY_DATA[k].name : k);
      }
      function showBanner(kicker, title, sub) {
        bannerId++;
        const my = bannerId;
        banner.value = { id: my, kicker, title, sub };
        setTimeout(() => { if (bannerId === my) banner.value = null; }, 2600);
      }
      function bossWaveType(n) {
        const lv = G.level;
        if (!lv) return null;
        if (!lv.endless && lv.bossWave && lv.bossWave.wave === n) return lv.bossWave.enemy;
        if (lv.endless && n % 5 === 0) return n % 10 === 0 ? 'bossKPI' : (n % 4 === 0 ? 'bossPPT' : 'bossMeeting');
        return null;
      }
      Vue.watch(() => ui.waveIdx, n => {
        if (n <= 0) return;
        const bt = bossWaveType(n);
        if (bt) {
          const sk = roleDef.value && roleDef.value.skins[bt];
          showBanner('⚠ BOSS 来袭', sk ? sk[0] : ENEMY_DATA[bt].name, sk ? '「' + sk[1] + '」' : '');
        } else {
          const names = ui.nextPreview.slice(0, 2).map(skinName).join('、') + (ui.nextPreview.length > 2 ? '…' : '');
          showBanner('WAVE ' + String(n).padStart(2, '0'), '第 ' + n + ' 波 · ' + names, '「' + U.pick(VENTS.taunts) + '」');
        }
      });
      const resultVent = Vue.computed(() => {
        if (!G.result) return '';
        return U.pick(G.result.win ? VENTS.wins : VENTS.loses);
      });
      function paint() {
        Vue.nextTick(() => {
          document.querySelectorAll('canvas[data-k]').forEach(cv => Sprites.stamp(cv, cv.dataset.k));
        });
      }
      Vue.onMounted(paint);
      Vue.watch(() => ui.nextPreview.slice(), paint);
      Vue.watch(() => ui.selPanel && ui.selPanel.key, paint);
      function towerCost(k) { return Tower.placeCost(k); }
      function pick(k) {
        if (ui.gold < towerCost(k)) { SFX.err(); return; }
        ui.placing = ui.placing === k ? null : k;
        ui.selectedId = 0;
        SFX.click();
      }
      function toCanvas(e) {
        const cv = e.target;
        const r = cv.getBoundingClientRect();
        return { x: (e.clientX - r.left) * CANVAS_W / r.width, y: (e.clientY - r.top) * CANVAS_H / r.height };
      }
      function onClick(e) {
        const p = toCanvas(e);
        SFX.unlock();
        G.onCanvasClick(p.x, p.y);
        if (!G.ui.placing) return;
        if (!G.canPlace(Math.floor(p.x / 48), Math.floor(p.y / 48))) return;
        if (G.gold < towerCost(G.ui.placing)) { G.ui.placing = null; return; }
      }
      function onMove(e) { const p = toCanvas(e); G.hover = p; }
      function toggleSfx() { US.settings.sfx = !US.settings.sfx; SFX.setEnabled(US.settings.sfx); Save.save(); }
      function boss() { window.BossKey.trigger(); }
      function quit() { G.backHome(); }
      function retry(revenge) {
        G.start(G.level.id, G.dailyTags, G.isDaily, G.diff.key, !!revenge, G.roleKey);
      }
      function shareResult() {
        const r = G.result;
        const txt = '带薪守塔 #' + r.dailyDate.replaceAll('-', '') + ' ' + '⭐'.repeat(r.stars) + '☆'.repeat(3 - r.stars)
          + ' 连击×' + r.bestCombo + ' 击杀' + r.kills + ' 🔥连续摸鱼' + r.streak + '天';
        navigator.clipboard.writeText(txt).then(() => {
          shareOk.value = true;
          setTimeout(() => { shareOk.value = false; }, 1600);
        });
      }
      return { ui, US, G, stage, sp, isLastWave, panelPos, nextId, starTip, shareOk, banner, skinName, resultVent, towerCost, pick, onClick, onMove, toggleSfx, boss, quit, retry, shareResult, CARD_RARE, TOWER_ORDER, TOWER_DATA };
    }
  };
  window.GAME_UI = { GameScreen };
})();
