(function () {
  window.TECH = [
    { key: 'coffee', name: '咖啡因耐受', emoji: '☕', desc: '咖啡塔攻速 +10%/级', tip: '特浓续命，指哪打哪。' },
    { key: 'welfare', name: '公司福利', emoji: '🎁', desc: '全部塔伤害 +8%/级', tip: '下午茶到位，全员输出提升。' },
    { key: 'admin', name: '行政预算', emoji: '🧾', desc: '每关初始金币 +60/级', tip: '办公用品随便申领。' },
    { key: 'hrq', name: '带薪心情', emoji: '💚', desc: '基地生命 +2/级', tip: '心情好，血条厚。' },
    { key: 'fin', name: '财务自由', emoji: '💰', desc: '击杀赏金 +10%/级', tip: '奖金翻倍不是梦。' },
    { key: 'rage', name: '键盘侠之魂', emoji: '💢', desc: '怒气获取 +20%/级，泄愤伤害 +25%/级', tip: '把 KPI 一个键一个键敲进键盘里。' }
  ];
  window.TECH_BASE_COST = 3;
  window.ACHIEVEMENTS = [
    { id: 'first_blood', name: '第一滴咖啡', emoji: '🩸', desc: '击杀第一只工作怪', check: s => s.totalKills >= 1 },
    { id: 'first_win', name: '下班有望', emoji: '🎉', desc: '首次通关任意关卡', check: s => s.wins >= 1 },
    { id: 'ch1', name: '新人转正', emoji: '📋', desc: '通关第 1 章全部关卡', check: s => [1, 2, 3, 4, 5].every(i => (s.stars[i] || 0) > 0) },
    { id: 'ch2', name: '部门之星', emoji: '⭐', desc: '通关第 2 章全部关卡', check: s => [6, 7, 8, 9, 10].every(i => (s.stars[i] || 0) > 0) },
    { id: 'ch3', name: '熬过年终', emoji: '🏆', desc: '通关第 3 章全部关卡', check: s => [11, 12, 13, 14, 15].every(i => (s.stars[i] || 0) > 0) },
    { id: 'all3', name: '完美主义', emoji: '✨', desc: '任意关卡拿到三星', check: s => Object.values(s.stars).some(v => v >= 3) },
    { id: 'stars15', name: '小有成就', emoji: '🌟', desc: '累计获得 15 颗星', check: () => Save.totalStars() >= 15 },
    { id: 'stars30', name: '摸鱼标兵', emoji: '💫', desc: '累计获得 30 颗星', check: () => Save.totalStars() >= 30 },
    { id: 'stars45', name: '全星 employees', emoji: '🌠', desc: '累计获得 45 颗星', check: () => Save.totalStars() >= 45 },
    { id: 'kill500', name: '裁员大户', emoji: '🪓', desc: '累计击杀 500 只工作怪', check: s => s.totalKills >= 500 },
    { id: 'endless20', name: '自愿加班', emoji: '🌙', desc: '无尽模式撑到第 20 波', check: s => s.endlessBest >= 20 },
    { id: 'endless40', name: '以司为家', emoji: '🏠', desc: '无尽模式撑到第 40 波', check: s => s.endlessBest >= 40 },
    { id: 'chest10', name: '开箱快乐', emoji: '🎁', desc: '累计开启 10 个惊喜宝箱', check: s => s.chests >= 10 },
    { id: 'daily1', name: '今日份摸鱼', emoji: '📅', desc: '完成一次每日挑战', check: s => s.daily.date !== '' && s.daily.stars > 0 },
    { id: 'tech3', name: '深度进修', emoji: '🎓', desc: '任意科技升到满级', check: s => Object.values(s.tech).some(v => v >= 3) },
    { id: 'vent100', name: '鼠标侠', emoji: '🖱️', desc: '手动怼怪 100 次', check: s => (s.ventCount || 0) >= 100 },
    { id: 'rage10', name: '键盘粉碎机', emoji: '⌨️', desc: '累计释放 10 次怒砸键盘', check: s => (s.rageCount || 0) >= 10 },
    { id: 'streak3', name: '连续摸鱼', emoji: '🔥', desc: '每日挑战连续 3 天', check: s => (s.daily.streak || 0) >= 3 },
    { id: 'streak7', name: '摸鱼生物钟', emoji: '⏰', desc: '每日挑战连续 7 天', check: s => (s.daily.streak || 0) >= 7 },
    { id: 'crisis1', name: '裁员幸存者', emoji: '🔥', desc: '任意关卡通过裁员危机难度', check: s => Object.values(s.crisisStars || {}).some(v => v > 0) },
    { id: 'crisis15', name: '毕业典礼', emoji: '🎓', desc: '裁员危机难度通关 KPI 终魔', check: s => (s.crisisStars[15] || 0) > 0 }
  ];
  window.TITLES = [
    { min: 0, name: '实习摸鱼员' },
    { min: 4, name: '摸鱼专员' },
    { min: 10, name: '资深摸鱼官' },
    { min: 16, name: '摸鱼经理' },
    { min: 22, name: '摸鱼总监' },
    { min: 28, name: '带薪传说' }
  ];
  window.DAILY_TAGS = [
    { key: 'hp', name: 'KPI 加压', desc: '敌人生命 +25%，金币 +40%' },
    { key: 'spd', name: ' deadline 逼近', desc: '敌人速度 +20%' },
    { key: 'gold', name: '项目奖金', desc: '初始金币 +120' },
    { key: 'rate', name: '咖啡续杯', desc: '全塔攻速 +15%' },
    { key: 'life', name: '高危预警', desc: '基地生命 -4，金币收益 +30%' },
    { key: 'cheap', name: '内部折扣', desc: '建塔费用 -25%' }
  ];
  window.currentTitle = function () {
    const achCount = Object.keys(Save.load().ach).length;
    let t = TITLES[0].name;
    TITLES.forEach(x => { if (achCount >= x.min) t = x.name; });
    return t;
  };
})();
