(function () {
  const COST = { intern: 1, msg: 1.1, sheet: 0.7, robot: 3, balloon: 1.6, hr: 2.6, ghost: 2, blame: 1.8, minion: 0.5 };
  function waveHpMul(level, w) {
    let m = level.hpMul * (1 + 0.25 * (w - 1) + 0.013 * (w - 1) * (w - 1));
    if (level.endless) m *= Math.pow(1.085, w);
    return m;
  }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const AFFIX_KEYS = ['fast', 'tough', 'regen', 'split', 'rich', 'armored', 'furious', 'giant'];
  function affixAllowed(level, w) {
    if (level.diff === 'crisis') return true;
    if (level.endless && w >= 12) return true;
    return false;
  }
  function rollAffix(level, w, boss) {
    if (boss || !affixAllowed(level, w)) return null;
    const rate = level.diff === 'crisis' ? (w >= 10 ? 0.3 : 0.22) : w >= 20 ? 0.25 : 0.15;
    if (Math.random() > rate) return null;
    const a = U.pick(AFFIX_KEYS);
    if (level.diff === 'crisis' && w >= 8 && Math.random() < 0.18) return a + '+rich';
    return a;
  }
  function buildWave(level, w) {
    const spawns = [];
    let t = 0;
    const isBoss = !level.endless && level.bossWave && level.bossWave.wave === w;
    const endlessBoss = level.endless && w % 5 === 0;
    if (isBoss || endlessBoss) {
      const type = isBoss ? level.bossWave.enemy : (w % 10 === 0 ? 'bossKPI' : (w % 4 === 0 ? 'bossPPT' : 'bossMeeting'));
      spawns.push({ type, delay: 0.5, fly: false });
      if (w >= 8) {
        for (let i = 0; i < 6; i++) spawns.push({ type: 'sheet', delay: 2 + i * 0.6, fly: false, affix: rollAffix(level, w, false) });
      }
      if (w >= 15) {
        for (let i = 0; i < 3; i++) spawns.push({ type: 'balloon', delay: 4 + i * 1.2, fly: true, affix: rollAffix(level, w, false) });
      }
      return { spawns, count: spawns.length, isBoss: true };
    }
    const pool = level.pool;
    const budget = 5.8 + w * 2.45;
    const avail = pool.filter((k, i) => w >= (i + 1) * 1.5);
    const kinds = shuffle(avail.length ? avail : [pool[0]]).slice(0, w < 3 ? 1 : w < 6 ? 2 : 3);
    const gap = Math.max(0.45, 0.9 - w * 0.013);
    let pi = Math.floor(Math.random() * (level.paths ? level.paths.length : 1));
    kinds.forEach((k, ki) => {
      const cost = COST[k] || 1;
      let n = Math.max(1, Math.round((budget / kinds.length) / cost));
      n = Math.min(n, 14);
      for (let i = 0; i < n; i++) {
        spawns.push({ type: k, delay: t + i * gap, fly: !!ENEMY_DATA[k].fly, pathIdx: pi, affix: rollAffix(level, w, false) });
      }
      t += n * gap + 1.6;
      pi = level.paths && level.paths.length > 1 ? (pi + 1) % level.paths.length : pi;
    });
    spawns.sort((a, b) => a.delay - b.delay);
    return { spawns, count: spawns.length, isBoss: false };
  }
  window.WaveGen = { waveHpMul, buildWave, rollAffix, affixAllowed };
})();
