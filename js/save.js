(function () {
  const KEY = 'salary-td-save-v1';
  const DEFAULTS = {
    ver: 1, gems: 3, stars: {}, crisisStars: {}, tech: { coffee: 0, admin: 0, hrq: 0, fin: 0, rage: 0 },
    ach: {}, endlessBest: 0, totalKills: 0, playCount: 0, wins: 0, role: 'dev',
    ventCount: 0, rageCount: 0,
    lastSeen: Date.now(), daily: { date: '', stars: 0, streak: 0, best: 0, freeze: 0 }, chests: 0,
    settings: { sfx: true, autoWave: false, disguise: true }
  };
  let cache = null;
  function load() {
    if (cache) return cache;
    try {
      const raw = localStorage.getItem(KEY);
      cache = raw ? Object.assign(JSON.parse(JSON.stringify(DEFAULTS)), JSON.parse(raw)) : JSON.parse(JSON.stringify(DEFAULTS));
    } catch (e) { cache = JSON.parse(JSON.stringify(DEFAULTS)); }
    return cache;
  }
  function save() {
    const d = load();
    d.lastSeen = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {}
  }
  function totalStars() {
    const d = load();
    return Object.values(d.stars).reduce((a, b) => a + b, 0);
  }
  function getStars(lvId) { return load().stars[lvId] || 0; }
  function setStars(lvId, s) {
    const d = load();
    if ((d.stars[lvId] || 0) < s) { d.stars[lvId] = s; save(); return true; }
    return false;
  }
  function getCrisisStars(lvId) { return load().crisisStars[lvId] || 0; }
  function setCrisisStars(lvId, s) {
    const d = load();
    if ((d.crisisStars[lvId] || 0) < s) { d.crisisStars[lvId] = s; save(); return true; }
    return false;
  }
  function addGems(n) { const d = load(); d.gems += n; save(); }
  function spendGems(n) {
    const d = load();
    if (d.gems < n) return false;
    d.gems -= n; save(); return true;
  }
  function unlockAch(id) {
    const d = load();
    if (d.ach[id]) return false;
    d.ach[id] = true; d.gems += 2; save(); return true;
  }
  function techCost(base, lv) { return base + lv * base; }
  function buyTech(key) {
    const d = load();
    const lv = d.tech[key] || 0;
    if (lv >= 3) return false;
    const cost = techCost(3, lv);
    if (d.gems < cost) return false;
    d.gems -= cost; d.tech[key] = lv + 1; save(); return true;
  }
  function checkOffline() {
    const d = load();
    const sec = U.clamp((Date.now() - d.lastSeen) / 1000, 0, 8 * 3600);
    if (sec < 180) return null;
    const gems = Math.min(4, Math.floor(sec / 3600) + 1);
    return { seconds: Math.floor(sec), gems, capped: sec >= 8 * 3600 - 5 };
  }
  function claimOffline() {
    const off = checkOffline();
    if (!off) return null;
    save();
    return off;
  }
  function recordGame(win, kills) {
    const d = load();
    d.playCount++;
    d.totalKills += kills;
    if (win) d.wins++;
    save();
  }
  function setDaily(stars) {
    const d = load();
    const today = U.todayStr();
    if (d.daily.date === today) {
      d.daily.stars = Math.max(d.daily.stars || 0, stars);
      save();
      return { streak: d.daily.streak || 0, streakGems: 0 };
    }
    let streak = 1;
    if (d.daily.date === U.todayStr(1)) streak = (d.daily.streak || 0) + 1;
    else if ((d.daily.streak || 0) > 0 && (d.daily.freeze || 0) > 0) { streak = d.daily.streak + 1; d.daily.freeze--; }
    const streakGems = streak >= 7 ? 5 : streak >= 5 ? 3 : streak >= 3 ? 2 : 1;
    let freeze = d.daily.freeze || 0;
    if (streak === 3 || streak === 5 || streak === 7) freeze = Math.min(2, freeze + 1);
    d.daily = { date: today, stars, streak, best: Math.max(d.daily.best || 0, streak), freeze };
    save();
    return { streak, streakGems };
  }
  function dailyDone() {
    const d = load();
    return d.daily.date === U.todayStr();
  }
  window.Save = {
    load, save, totalStars, getStars, setStars, getCrisisStars, setCrisisStars,
    addGems, spendGems, unlockAch, techCost, buyTech, checkOffline, claimOffline,
    recordGame, setDaily, dailyDone,
    useProxy(p) { cache = p; },
    reset() { localStorage.removeItem(KEY); cache = null; }
  };
})();
