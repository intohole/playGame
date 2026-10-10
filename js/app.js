(function () {
  const { createApp, reactive, ref } = Vue;
  const US = reactive(Save.load());
  Save.useProxy(US);
  window.US = US;
  SFX.setEnabled(US.settings.sfx !== false);
  const RootApp = {
    template: `
    <div style="height:100%">
      <home-screen v-if="ui.screen === 'home'" @go="nav" />
      <levels-screen v-else-if="ui.screen === 'levels'" @go="nav" @play="play" />
      <tech-screen v-else-if="ui.screen === 'tech'" @go="nav" />
      <ach-screen v-else-if="ui.screen === 'ach'" @go="nav" />
      <daily-screen v-else-if="ui.screen === 'daily'" @go="nav" @play-daily="playDaily" />
      <game-screen v-else-if="ui.screen === 'game'" @play="play" @play-daily="playDaily" />
      <boss-screen />
      <div class="toast-wrap">
        <div class="toast" v-for="t in toasts" :key="t.id">{{ t.msg }}</div>
      </div>
      <transition name="fade">
        <div class="modal-mask" v-if="offline">
          <div class="card modal offline-box">
            <div class="cat-big">🐱</div>
            <h2>摸鱼猫替你打工回来了！</h2>
            <p>你离开了 {{ offline.hours }}，小猫帮你击退了 {{ offline.kills }} 只工作怪</p>
            <div class="amount">💎 +{{ offline.gems }}</div>
            <p v-if="offline.capped" style="color:var(--ink-dim); font-size:12px">（离线收益封顶 8 小时，常回来看看猫）</p>
            <div class="row">
              <button class="btn gem" @click="claim">收下，好猫 🐟</button>
            </div>
          </div>
        </div>
      </transition>
    </div>`,
    setup() {
      const ui = G.ui;
      const toasts = ref([]);
      const offline = ref(null);
      let tid = 1;
      window.toast = (msg) => {
        const id = tid++;
        toasts.value.push({ id, msg });
        setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id); }, 3000);
      };
      function nav(s) { SFX.click(); ui.screen = s; checkHomeAch(); }
      function play(id, diffKey) {
        SFX.unlock();
        G.start(id, [], false, diffKey);
      }
      function playDaily(seed) {
        SFX.unlock();
        const lvIdx = seed % 15;
        const rnd = U.mulberry32(seed ^ 0x9e37);
        const pool = DAILY_TAGS.slice();
        const tags = [];
        for (let i = 0; i < 2; i++) tags.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0].key);
        G.start(LEVELS[lvIdx].id, tags, true);
      }
      function checkHomeAch() {
        const s = Save.load();
        ACHIEVEMENTS.forEach(a => {
          if (!s.ach[a.id] && a.check(s)) {
            Save.unlockAch(a.id);
            window.toast('🏆 成就解锁: ' + a.name + ' （💎+2）');
          }
        });
      }
      const off = Save.checkOffline();
      if (off) {
        offline.value = {
          hours: off.seconds >= 3600 ? Math.floor(off.seconds / 3600) + ' 小时' : Math.floor(off.seconds / 60) + ' 分钟',
          gems: off.gems, capped: off.capped,
          kills: Math.floor(off.seconds / 90)
        };
        window._pendingOfflineGems = off.gems;
      }
      function claim() {
        if (window._pendingOfflineGems) {
          Save.addGems(window._pendingOfflineGems);
          Save.save();
          SFX.gem();
          window.toast('💎 摸鱼券 +' + window._pendingOfflineGems);
          window._pendingOfflineGems = 0;
        }
        offline.value = null;
      }
      return { ui, toasts, offline, nav, play, playDaily, claim };
    }
  };
  function loop(ts) {
    G.frame(ts);
    requestAnimationFrame(loop);
  }
  window.addEventListener('keydown', e => {
    if (BossKey.state.disguised) return;
    if (G.ui.screen !== 'game') return;
    if (e.key === ' ') {
      e.preventDefault();
      if (G.ui.state === 'pick') return;
      if (G.ui.state === 'build' && !G.ui.paused) G.startWave();
      else G.togglePause();
    }
    const hotmap = { '1': 'coffee', '2': 'plant', '3': 'abacus', '4': 'frame', '5': 'keyboard', '6': 'mouse' };
    if (hotmap[e.key] && !G.ui.paused && G.ui.state !== 'over') {
      const k = hotmap[e.key];
      const cost = Tower.placeCost(k);
      if (G.gold >= cost) { G.ui.placing = G.ui.placing === k ? null : k; G.ui.selectedId = 0; SFX.click(); }
      else SFX.err();
    }
    if ((e.key === 'r' || e.key === 'R') && !G.ui.paused) G.releaseRage();
  });
  Save.save();
  const app = createApp(RootApp);
  app.component('home-screen', SCREENS.HomeScreen);
  app.component('levels-screen', SCREENS.LevelsScreen);
  app.component('tech-screen', SCREENS.TechScreen);
  app.component('ach-screen', SCREENS.AchScreen);
  app.component('daily-screen', SCREENS.DailyScreen);
  app.component('game-screen', GAME_UI.GameScreen);
  app.component('boss-screen', BOSS_SCREEN.BossScreen);
  BossKey.bind();
  app.mount('#app');
  requestAnimationFrame(loop);
})();
