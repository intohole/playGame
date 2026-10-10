(function () {
  window.TOWER_DATA = {
    coffee: {
      key: 'coffee', name: '咖啡塔', emoji: '☕', color: '#f59e42',
      desc: '速溶出杯，高频点射。对单体物理伤害，性价比之王。',
      hotkey: '1',
      levels: [
        { cost: 70, range: 115, rate: 1.2, dmg: 13, projSpeed: 420 },
        { cost: 105, range: 125, rate: 1.45, dmg: 22, projSpeed: 440 },
        { cost: 155, range: 135, rate: 1.7, dmg: 36, projSpeed: 460 },
        { cost: 230, range: 152, rate: 2.15, dmg: 55, projSpeed: 500, crit: 0.18, critMul: 2 }
      ]
    },
    plant: {
      key: 'plant', name: '绿植塔', emoji: '🌵', color: '#4ade80',
      desc: '吸收负能量。范围减速并附加中毒，团队发动机。',
      hotkey: '2',
      levels: [
        { cost: 80, range: 105, rate: 0.85, dmg: 6, slow: 0.32, slowDur: 1.6, poison: 6, poisonDur: 3, projSpeed: 380 },
        { cost: 120, range: 115, rate: 0.95, dmg: 10, slow: 0.38, slowDur: 1.8, poison: 10, poisonDur: 3, projSpeed: 390 },
        { cost: 175, range: 125, rate: 1.05, dmg: 15, slow: 0.44, slowDur: 2.0, poison: 16, poisonDur: 3.5, projSpeed: 410 },
        { cost: 260, range: 140, rate: 1.2, dmg: 22, slow: 0.52, slowDur: 2.2, poison: 26, poisonDur: 4, projSpeed: 430 }
      ]
    },
    abacus: {
      key: 'abacus', name: '算盘塔', emoji: '🧮', color: '#67c5f0',
      desc: '噼里啪啦一通乱算，范围溅射。清群怪专业户。',
      hotkey: '3',
      levels: [
        { cost: 100, range: 118, rate: 0.55, dmg: 30, aoe: 55, projSpeed: 260 },
        { cost: 155, range: 128, rate: 0.6, dmg: 52, aoe: 62, projSpeed: 270 },
        { cost: 230, range: 138, rate: 0.66, dmg: 86, aoe: 70, projSpeed: 285 },
        { cost: 340, range: 152, rate: 0.75, dmg: 138, aoe: 84, projSpeed: 300, stunChance: 0.22, stunDur: 0.5 }
      ]
    },
    frame: {
      key: 'frame', name: '老板相框', emoji: '🖼️', color: '#c084fc',
      desc: '老板凝视，无视护甲的魔法伤害。击杀返现 8 金币。',
      hotkey: '4',
      levels: [
        { cost: 120, range: 140, rate: 0.6, dmg: 34, projSpeed: 520, killCash: 8 },
        { cost: 185, range: 152, rate: 0.65, dmg: 58, projSpeed: 540, killCash: 8 },
        { cost: 270, range: 165, rate: 0.72, dmg: 96, projSpeed: 560, killCash: 10 },
        { cost: 400, range: 182, rate: 0.82, dmg: 158, projSpeed: 600, killCash: 14 }
      ]
    },
    keyboard: {
      key: 'keyboard', name: '键盘塔', emoji: '⌨️', color: '#f87171',
      desc: '键帽连射，命中积攒怒气。连续命中同一目标「键温」叠伤，越敲越上头。',
      hotkey: '5',
      levels: [
        { cost: 85, range: 118, rate: 1.5, dmg: 12, projSpeed: 460 },
        { cost: 130, range: 126, rate: 1.7, dmg: 20, projSpeed: 480 },
        { cost: 190, range: 134, rate: 1.95, dmg: 33, projSpeed: 500 },
        { cost: 280, range: 148, rate: 2.25, dmg: 48, projSpeed: 540, stunChance: 0.15, stunDur: 0.3 }
      ]
    },
    mouse: {
      key: 'mouse', name: '鼠标塔', emoji: '🖱️', color: '#38bdf8',
      desc: '光标点杀必中（无视闪避），对残血目标「斩杀」伤害翻倍，补刀快感拉满。',
      hotkey: '6',
      levels: [
        { cost: 115, range: 150, rate: 0.5, dmg: 42, projSpeed: 560 },
        { cost: 175, range: 160, rate: 0.55, dmg: 70, projSpeed: 580 },
        { cost: 255, range: 172, rate: 0.62, dmg: 115, projSpeed: 620 },
        { cost: 380, range: 188, rate: 0.7, dmg: 185, projSpeed: 660, crit: 0.25, critMul: 2.5 }
      ]
    }
  };
  window.TOWER_ORDER = ['coffee', 'plant', 'abacus', 'frame', 'keyboard', 'mouse'];
  window.SELL_RATE = 0.7;
})();
