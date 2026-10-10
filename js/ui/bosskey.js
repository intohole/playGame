(function () {
  const DEPTS = ['华东大区', '华南大区', '华北大区', '西南大区', '产品线A', '产品线B', '创新业务部', '海外事业部', '渠道拓展部', '客户成功部', '中台研发部', '职能支持部'];
  const state = Vue.reactive({ disguised: false, rows: [], ts: '' });
  function genRows() {
    state.rows = DEPTS.map(d => {
      const target = U.randInt(800, 4200);
      const done = Math.round(target * U.rand(0.52, 1.32));
      return {
        d,
        target,
        done,
        yoy: (U.rand(-18, 32)).toFixed(1),
        kpi: (U.rand(72, 128)).toFixed(1),
        owner: U.pick(['王总', '李总', '张总', '刘经理', '陈经理', '赵主管', '孙主管', '周专员'])
      };
    });
    state.ts = new Date().toLocaleString('zh-CN', { hour12: false });
  }
  function tweak() {
    if (!state.disguised) return;
    state.rows.forEach(r => { if (Math.random() < 0.4) r.kpi = (parseFloat(r.kpi) + U.rand(-1.5, 1.5)).toFixed(1); });
  }
  const BossScreen = {
    template: `
    <div class="boss-screen" v-if="st.disguised">
      <div class="boss-menubar">
        <span class="logo">▦ 星云 ERP · 内部数据平台</span>
        <span>工作台</span><span>报表中心</span><span>审批</span><span>邮件(3)</span>
        <span style="margin-left:auto">{{ st.ts }}</span>
        <span>👤 zhang.san</span>
      </div>
      <div class="boss-body">
        <div class="boss-side">
          <div class="on">📊 数据看板</div><div>📈 销售报表</div><div>💰 财务对账</div>
          <div>🧮 预算执行</div><div>👥 人效分析</div><div>📮 周报中心</div><div>⚙️ 系统设置</div>
        </div>
        <div class="boss-main">
          <h3>2026 Q4 经营数据核对表</h3>
          <div class="crumb">数据看板 / 季度经营数据 · 数据截至 {{ st.ts }} · 仅限内部使用</div>
          <div class="boss-cards">
            <div class="boss-kpi"><div class="k">季度营收（万元）</div><div class="v">12,847.6</div><div class="d up">↑ 8.3% 环比</div></div>
            <div class="boss-kpi"><div class="k">年度目标完成率</div><div class="v">86.4%</div><div class="d up">↑ 2.1% 较上月</div></div>
            <div class="boss-kpi"><div class="k">经营费用率</div><div class="v">18.7%</div><div class="d down">↓ 0.8% 优化</div></div>
            <div class="boss-kpi"><div class="k">风险预警项</div><div class="v">3 项</div><div class="d">2 项已闭环</div></div>
          </div>
          <table class="boss-table">
            <thead><tr><th>部门</th><th>目标(万)</th><th>完成(万)</th><th>达成率</th><th>同比</th><th>环比</th><th>负责人</th></tr></thead>
            <tbody>
              <tr v-for="r in st.rows" :key="r.d">
                <td>{{ r.d }}</td><td>{{ r.target.toLocaleString() }}</td><td>{{ r.done.toLocaleString() }}</td>
                <td :style="{color: r.done >= r.target ? '#23a55a' : '#d64545'}">{{ (r.done / r.target * 100).toFixed(1) }}%</td>
                <td :style="{color: r.yoy >= 0 ? '#23a55a' : '#d64545'}">{{ r.yoy > 0 ? '+' : '' }}{{ r.yoy }}%</td>
                <td>{{ r.kpi }}%</td><td>{{ r.owner }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <button class="boss-return" @click="hide()" title="">·</button>
    </div>`,
    setup() {
      return { st: state, hide: () => BossKey.hide() };
    }
  };
  const BossKey = {
    state,
    trigger() {
      G.ui.paused = true;
      genRows();
      state.disguised = true;
      if (document.title !== '2026 Q4 经营数据核对表') document.title = '2026 Q4 经营数据核对表';
    },
    hide() {
      state.disguised = false;
    },
    bind() {
      window.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          if (state.disguised) { state.disguised = false; e.preventDefault(); }
          else if (G.ui.screen === 'game') { BossKey.trigger(); e.preventDefault(); }
        }
      });
      window.addEventListener('blur', () => {
        if (G.ui.screen === 'game' && G.ui.state !== 'over') {
          G.ui.paused = true;
          if (Save.load().settings.disguise) BossKey.trigger();
        }
      });
      setInterval(tweak, 8000);
    }
  };
  window.BossKey = BossKey;
  window.BOSS_SCREEN = { BossScreen };
})();
