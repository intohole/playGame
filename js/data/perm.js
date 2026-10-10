(function () {
  window.DIFFS = [
    { key: 'trainee', name: '试用期', icon: '🌱', hpMul: 0.85, goldMul: 1, livesMul: 1, desc: 'HR 手下留情，敌人生命 -15%，适合熟悉职场' },
    { key: 'staff', name: '正式工', icon: '💼', hpMul: 1, goldMul: 1, livesMul: 1, desc: '标准职场强度，原汁原味' },
    { key: 'crisis', name: '裁员危机', icon: '🔥', hpMul: 1.45, goldMul: 0.85, livesMul: 0.5, affix: true, bonusGem: 3, desc: '深夜加班：敌命 +45%、金币 -15%、生命减半、怪带精英词缀，通关 +3💎' }
  ];
  window.AFFIXES = [
    { key: 'fast', name: ' acceleration', icon: '⚡', tag: '加速', desc: '移速 +50%' },
    { key: 'tough', name: 'hardened', icon: '🛡', tag: '顽固', desc: '生命 +45%' },
    { key: 'regen', name: 'selfheal', icon: '💚', tag: '自愈', desc: '每秒回复 0.7% 生命' },
    { key: 'split', name: 'multiply', icon: '🧬', tag: '分裂', desc: '死亡分裂 2 个小锅' },
    { key: 'rich', name: 'golden', icon: '💰', tag: '高薪', desc: '赏金 ×2.5' },
    { key: 'armored', name: 'armored', icon: '🔨', tag: '硬化', desc: '物抗 +20%' },
    { key: 'furious', name: 'enraged', icon: '😤', tag: '狂暴', desc: '半血后移速翻倍' },
    { key: 'giant', name: 'giant', icon: '🔵', tag: '巨型', desc: '体型 +30%，生命 +15%' }
  ];
  const randKey = () => TOWER_ORDER[Math.floor(Math.random() * TOWER_ORDER.length)];
  const C = (rare, name, emoji, desc, apply, instant) => ({ rare, name, emoji, desc, apply, instant });
  window.CARDS = [
    C('w', '加班费', '💼', '击杀赏金 +12%', m => { m.bounty += 0.12; }),
    C('w', '报销单', '🧾', '波次奖金 +25%', m => { m.waveBonus += 0.25; }),
    C('w', '手速训练', '⌨️', '全塔攻速 +8%', m => { m.rate += 0.08; }),
    C('w', '团队协作', '🤝', '全塔伤害 +8%', m => { m.dmg += 0.08; }),
    C('w', '情绪劳动', '😤', '怒气获取 +15%', m => { m.rage += 0.15; }),
    C('w', '摸鱼哲学', '🐟', '连击奖励金币翻倍', m => { m.comboBonus += 1; }),
    C('w', '咖啡因过剩', '☕', '开波前 3 秒全塔攻速 +40%', m => { m.waveStartRate = 0.4; }),
    C('w', '团建活动', '🍰', '立即获得 80 金币', m => { m.instantGold += 80; }, true),
    C('b', '银行利息', '🏦', '每波开始 +40 金币', m => { m.goldFlat += 40; }),
    C('b', '灰色收入', '🕶️', '宝箱金币 +100%，出现率 +10%', m => { m.chestGold += 1; m.chestLuck += 0.1; }),
    C('b', '望远镜', '🔭', '全塔射程 +12%', m => { m.range += 0.12; }),
    C('b', '今日限定', '🎁', '随机一系塔伤害 +30%', m => { const k = randKey(); m.keyBoost[k] = (m.keyBoost[k] || 0) + 0.3; m.pickedKey = k; }),
    C('b', '怨气冲天', '💢', '手动怼击伤害 +60%，冷却 -20%', m => { m.ventDmg += 0.6; m.ventCd *= 0.8; }),
    C('b', '斩杀协议', '⚔️', '敌人生命低于 25% 时受伤 +30%', m => { m.execute = 0.3; }),
    C('b', '防线合约', '🏗️', '基地生命上限 +3 并立即回复 3', m => { m.livesPlus += 3; }, true),
    C('b', '降本增效', '📉', '建塔与升级费用 -12%', m => { m.costMul *= 0.88; }),
    C('b', '小道消息', '🗣️', '波间宝箱出现率 +15%', m => { m.chestLuck += 0.15; }),
    C('b', '年终奖池', '🧧', '立即 +120 金币，波次奖金 +10%', m => { m.instantGold += 120; m.waveBonus += 0.1; }, true),
    C('g', '财务自由', '💎', '击杀赏金 +30%，波次奖金 +30%', m => { m.bounty += 0.3; m.waveBonus += 0.3; }),
    C('g', '办公室之王', '👑', '全塔伤害 +18%，攻速 +10%', m => { m.dmg += 0.18; m.rate += 0.1; }),
    C('g', '键盘侠之魂', '⌨️', '怒砸键盘伤害 +60%，大招击杀返还 40% 怒气', m => { m.rageBoom += 0.6; m.rageRefund += 0.4; }),
    C('g', '泄愤循环', '♻️', '大招期间击杀的敌人赏金 ×3', m => { m.rageBounty = 3; }),
    C('g', '全员持股', '📈', '每波结束额外获得本波赏金 10% 分红', m => { m.dividend += 0.1; }),
    C('g', '通宵狂热', '🌙', '全塔攻速 +12%，但敌人移速 +8%', m => { m.rate += 0.12; m.enemySpd += 0.08; })
  ];
  window.CARD_RARE = {
    w: { name: '普通', color: '#9aa5b1', weight: 60 },
    b: { name: '稀有', color: '#38bdf8', weight: 30 },
    g: { name: '传说', color: '#fbbf24', weight: 10 }
  };
  window.diffUnlocked = function (lvId, diffKey) {
    if (diffKey !== 'crisis') return true;
    return (Save.getStars(lvId) || 0) >= 3;
  };
})();
