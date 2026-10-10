(function () {
  const { computed } = Vue;
  const HomeScreen = {
    template: `
    <div class="screen">
      <div class="screen-inner">
        <div class="home-hero">
          <div class="shine-title">带薪守塔</div>
          <div class="sub">💢 怒砸键盘，硬刚工作怪 —— 上班摸鱼，带薪守塔</div>
          <div style="margin-top:16px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
            <span class="badge">🎖️ {{ title }}</span>
            <span class="badge">⭐ {{ Save.totalStars() }} / 45</span>
            <span class="badge" v-if="US.daily.streak" style="color:var(--amber)">🔥 连续摸鱼 {{ US.daily.streak }} 天</span>
            <span class="badge gem-text">💎 {{ US.gems }}</span>
            <span class="badge" v-if="US.endlessBest">🌙 无尽最佳 {{ US.endlessBest }} 波</span>
          </div>
        </div>
        <div class="home-grid">
          <div class="card home-card" @click="$emit('go','levels')">
            <div class="ico">🗺️</div><h3>战役关卡</h3>
            <p>3 大章节 × 15 关 + 无尽模式，从周一晨会一路打到 KPI 终魔。</p>
            <div class="tag"><span class="badge" style="color:var(--amber)">继续战斗 →</span></div>
          </div>
          <div class="card home-card" @click="$emit('go','daily')">
            <div class="ico">📅</div><h3>每日挑战</h3>
            <p>每天 00:00 刷新随机词条关卡，完成必得摸鱼券 💎。🔥 已连签 {{ US.daily.streak || 0 }} 天。</p>
            <div class="tag"><span class="badge" :style="done? '':'color:var(--mint)'">{{ done ? '今日已完成 ✓' : (US.daily.streak ? '🔥 streak 要断了！' : '今日未完成 →') }}</span></div>
          </div>
          <div class="card home-card" @click="$emit('go','tech')">
            <div class="ico">🔬</div><h3>摸鱼科技</h3>
            <p>用摸鱼券 💎 研究永久强化，越摸越强。</p>
            <div class="tag"><span class="badge gem-text">💎 {{ US.gems }} 可用</span></div>
          </div>
          <div class="card home-card" @click="$emit('go','ach')">
            <div class="ico">🏆</div><h3>成就墙</h3>
            <p>{{ achCount }} / {{ ACHIEVEMENTS.length }} 个成就，解锁专属摸鱼称谓。</p>
            <div class="tag"><span class="badge">查看 →</span></div>
          </div>
        </div>
        <div class="cat-title">摸鱼工具箱</div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <button class="btn ghost sm" @click="toggleSfx">{{ US.settings.sfx ? '🔊 音效开' : '🔇 音效关' }}</button>
          <button class="btn ghost sm" @click="toggleDis">{{ US.settings.disguise ? '🕶️ 失焦自动伪装: 开' : '失焦自动伪装: 关' }}</button>
          <span class="badge">⌨️ 快捷键 1-6 造塔 · R 泄愤 · 空格 开波/暂停 · Esc 老板键</span>
          <button class="btn ghost sm" style="margin-left:auto; color:var(--red)" @click="resetAll">重置存档</button>
        </div>
      </div>
    </div>`,
    setup() {
      const title = computed(() => currentTitle());
      const done = computed(() => Save.dailyDone());
      const achCount = computed(() => Object.keys(US.ach).length);
      function toggleSfx() { US.settings.sfx = !US.settings.sfx; SFX.setEnabled(US.settings.sfx); Save.save(); }
      function toggleDis() { US.settings.disguise = !US.settings.disguise; Save.save(); }
      function resetAll() {
        if (confirm('确定清空全部进度？摸鱼需谨慎，重置无法恢复。')) { Save.reset(); location.reload(); }
      }
      return { US, Save, ACHIEVEMENTS, title, done, achCount, toggleSfx, toggleDis, resetAll };
    }
  };
  const LevelsScreen = {
    template: `
    <div class="screen">
      <div class="screen-inner">
        <div class="top-bar">
          <button class="btn ghost sm" @click="$emit('go','home')">← 基地</button>
          <div style="font-weight:800">🗺️ 战役关卡</div>
          <span class="badge gem-text">💎 {{ US.gems }}</span>
        </div>
        <template v-for="(ch, ci) in chapters" :key="ci">
          <div class="chapter-band">
            <h3>{{ ['第 1 章 · 新人入职','第 2 章 · 部门风暴','第 3 章 · 年终决战'][ci] }}</h3>
            <span>{{ ['基础塔防教学，认识你的同事们','新敌人乱入：飞行、双抗、闪避、分裂','最终决战，三面受敌'][ci] }}</span>
          </div>
          <div class="levels-grid">
            <div v-for="lv in ch" :key="lv.id" class="card level-card" :class="{locked: !unlocked(lv)}"
                 @click="unlocked(lv) && (pickLv = lv)">
              <div v-if="!unlocked(lv)" class="lock">🔒</div>
              <div class="num">LEVEL {{ String(lv.id).padStart(2,'0') }}</div>
              <h4>{{ lv.name }}</h4>
              <div class="stars">{{ '⭐'.repeat(US.stars[lv.id]||0) }}<span v-if="!(US.stars[lv.id])" style="opacity:.3">☆☆☆</span>
                <span v-if="US.crisisStars[lv.id]" style="font-size:12px; color:var(--red)"> 🔥×{{ US.crisisStars[lv.id] }}</span>
              </div>
              <div class="info">{{ lv.waves }} 波 · 首通 💎{{ lv.gems }}</div>
            </div>
          </div>
        </template>
        <div class="modal-mask" v-if="pickLv">
          <div class="card modal" style="max-width:560px">
            <h2 style="text-align:center">LEVEL {{ pickLv.id }} · {{ pickLv.name }}</h2>
            <p style="text-align:center; color:var(--ink-dim); font-size:12.5px">选择入职难度（波间福利三选一在所有难度生效）</p>
            <div style="display:flex; flex-direction:column; gap:10px; margin:16px 0">
              <button v-for="df in DIFFS" :key="df.key" class="diff-opt"
                      :class="{dim: !canPlay(df)}" :disabled="!canPlay(df)"
                      :style="canPlay(df) ? '' : 'opacity:.45'" @click="start(df)">
                <span class="ic">{{ df.icon }}</span>
                <span class="bd"><b :style="{color: df.key === 'crisis' ? 'var(--red)' : ''}">{{ df.name }}</b>
                  <small>{{ df.desc }}</small></span>
                <span class="right" v-if="df.key === 'crisis'">{{ canPlay(df) ? (US.crisisStars[pickLv.id] ? '🔥' + US.crisisStars[pickLv.id] : 'NEW') : '🔒 需本关三星' }}</span>
              </button>
            </div>
            <div style="text-align:center">
              <button class="btn ghost sm" @click="pickLv = null">取消</button>
            </div>
          </div>
        </div>
        <div class="chapter-band"><h3>🌙 无尽模式</h3><span>通关第 15 关解锁 · 加班永无止境</span></div>
        <div class="levels-grid">
          <div class="card level-card" :class="{locked: !unlocked(endless)}" @click="unlocked(endless) && $emit('play', 'endless')">
            <div v-if="!unlocked(endless)" class="lock">🔒</div>
            <div class="num">ENDLESS</div>
            <h4>无尽加班</h4>
            <div class="stars" style="font-size:14px; color:var(--ink-dim)">最佳纪录: {{ US.endlessBest || 0 }} 波</div>
            <div class="info">每 5 波来一个 Boss</div>
          </div>
        </div>
      </div>
    </div>`,
    setup(props, { emit }) {
      const chapters = [LEVELS.slice(0, 5), LEVELS.slice(5, 10), LEVELS.slice(10, 15)];
      const endless = LEVELS[15];
      const pickLv = Vue.ref(null);
      function unlocked(lv) {
        if (lv.id === 1) return true;
        if (lv.endless) return (US.stars[15] || 0) > 0;
        return (US.stars[lv.id - 1] || 0) > 0;
      }
      function canPlay(df) {
        if (!pickLv.value) return false;
        if (df.key !== 'crisis') return true;
        return (US.stars[pickLv.value.id] || 0) >= 3;
      }
      function start(df) {
        const id = pickLv.value.id;
        pickLv.value = null;
        SFX.click();
        emit('play', id, df.key);
      }
      return { US, chapters, endless, unlocked, pickLv, DIFFS, canPlay, start };
    }
  };
  const TechScreen = {
    template: `
    <div class="screen">
      <div class="screen-inner">
        <div class="top-bar">
          <button class="btn ghost sm" @click="$emit('go','home')">← 基地</button>
          <div style="font-weight:800">🔬 摸鱼科技研究所</div>
          <span class="badge gem-text">💎 {{ US.gems }}</span>
        </div>
        <p style="color:var(--ink-dim); font-size:13px; margin-bottom:16px">科技永久生效，作用于所有关卡（含每日挑战与无尽）。升级费用：💎3 → 💎6 → 💎9。</p>
        <div class="tech-grid">
          <div v-for="t in TECH" :key="t.key" class="card tech-line">
            <div class="ico">{{ t.emoji }}</div>
            <div class="body">
              <h4>{{ t.name }}</h4>
              <div class="desc">{{ t.desc }}<br><span style="opacity:.7">{{ t.tip }}</span></div>
              <div class="lv-dots">
                <div v-for="i in 3" :key="i" class="dot" :class="{on: i <= (US.tech[t.key]||0)}"></div>
              </div>
            </div>
            <button class="btn sm" :class="canBuy(t) ? 'gem' : 'ghost'" :disabled="!canBuy(t)" @click="buy(t)">
              {{ (US.tech[t.key]||0) >= 3 ? '已满级' : '💎 ' + Save.techCost(3, US.tech[t.key]||0) }}
            </button>
          </div>
        </div>
      </div>
    </div>`,
    setup() {
      function canBuy(t) { return (US.tech[t.key] || 0) < 3 && US.gems >= Save.techCost(3, US.tech[t.key] || 0); }
      function buy(t) {
        if (Save.buyTech(t.key)) { SFX.levelup(); } else SFX.err();
      }
      return { US, Save, TECH, canBuy, buy };
    }
  };
  const AchScreen = {
    template: `
    <div class="screen">
      <div class="screen-inner">
        <div class="top-bar">
          <button class="btn ghost sm" @click="$emit('go','home')">← 基地</button>
          <div style="font-weight:800">🏆 成就墙</div>
          <span class="badge">🎖️ {{ currentTitle() }}</span>
        </div>
        <div class="title-plate card">
          <div class="big">{{ currentTitle() }}</div>
          <p style="color:var(--ink-dim); font-size:13px; margin-top:6px">再解锁 {{ nextTitleNeed }} 个成就晋升为「{{ nextTitle }}」</p>
        </div>
        <div class="ach-grid">
          <div v-for="a in ACHIEVEMENTS" :key="a.id" class="card ach-card" :class="{done: US.ach[a.id]}">
            <div class="ico">{{ a.emoji }}</div>
            <div><h5>{{ a.name }}</h5><p>{{ a.desc }}</p></div>
            <div style="margin-left:auto" class="badge">{{ US.ach[a.id] ? '✓' : '💎2' }}</div>
          </div>
        </div>
      </div>
    </div>`,
    setup() {
      const achCount = Object.keys(US.ach).length;
      const nextIdx = TITLES.findIndex(t => achCount < t.min);
      const nextTitle = nextIdx === -1 ? '已是最高称谓' : TITLES[nextIdx].name;
      const nextTitleNeed = nextIdx === -1 ? 0 : TITLES[nextIdx].min - achCount;
      return { US, ACHIEVEMENTS, currentTitle, nextTitle, nextTitleNeed };
    }
  };
  const DailyScreen = {
    template: `
    <div class="screen">
      <div class="screen-inner" style="max-width:640px">
        <div class="top-bar">
          <button class="btn ghost sm" @click="$emit('go','home')">← 基地</button>
          <div style="font-weight:800">📅 每日挑战</div>
          <span class="badge">{{ today }}</span>
        </div>
        <div class="card" style="padding:28px; text-align:center">
          <div style="font-size:44px">🎲</div>
          <h2 style="margin:10px 0 4px">今日限定关卡</h2>
          <p style="color:var(--ink-dim); font-size:13px">关卡由今日日期随机生成，全世界摸鱼人面对同一张卷子。<br>每天只有一次机会，失败不能重打（断签券可保 streak）。</p>
          <div style="margin:18px 0 8px">
            <span class="daily-tag" v-for="tg in tags" :key="tg.key"><b>{{ tg.name }}</b>：{{ tg.desc }}</span>
          </div>
          <div style="display:flex; gap:14px; justify-content:center; margin:14px 0; font-size:13px">
            <span class="badge" style="color:var(--amber)">🔥 连续 {{ US.daily.streak || 0 }} 天</span>
            <span class="badge">🏅 最佳 {{ US.daily.best || 0 }} 天</span>
            <span class="badge" title="断签时自动消耗，保住连续纪录">🧊 断签保护 ×{{ US.daily.freeze || 0 }}</span>
          </div>
          <p v-if="streakAtRisk" style="color:var(--red); font-size:13px; font-weight:700">⚠️ 今天再不完成，{{ US.daily.streak }} 天连续纪录就断了！</p>
          <div style="margin-top:16px; display:flex; gap:10px; justify-content:center">
            <button class="btn mint" :disabled="done" @click="$emit('playDaily', seed)">{{ done ? '今日已完成 ✓' : '开始挑战 →' }}</button>
          </div>
          <p v-if="done" style="color:var(--mint); font-size:13px; margin-top:12px">今日星级：{{ US.daily.stars }} ⭐ · 明天再来</p>
        </div>
      </div>
    </div>`,
    setup(props, { emit }) {
      const seed = dailySeed();
      const today = U.todayStr();
      const rnd = U.mulberry32(seed);
      const picks = [];
      const pool = DAILY_TAGS.slice();
      for (let i = 0; i < 2; i++) picks.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
      const done = computed(() => Save.dailyDone());
      const streakAtRisk = computed(() => !done.value && (US.daily.streak || 0) > 0 && US.daily.date === U.todayStr(1));
      return { US, tags: picks, seed, today, done, streakAtRisk };
    }
  };
  function dailySeed() {
    const d = U.todayStr();
    let h = 0;
    for (let i = 0; i < d.length; i++) h = (h * 31 + d.charCodeAt(i)) >>> 0;
    return h;
  }
  window.DAILY_SEED = dailySeed;
  window.SCREENS = { HomeScreen, LevelsScreen, TechScreen, AchScreen, DailyScreen };
})();
