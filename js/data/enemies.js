(function () {
  window.ENEMY_DATA = {
    intern: {
      key: 'intern', name: '实习小怪', emoji: '🧑‍💻', hp: 30, speed: 56,
      armor: 0, mr: 0, bounty: 6, dmg: 1, size: 14, tip: '最普通的打工仔，人人可欺。'
    },
    msg: {
      key: 'msg', name: '消息弹窗', emoji: '💬', hp: 28, speed: 96,
      armor: 0, mr: 0, bounty: 5, dmg: 1, size: 12, tip: '叮咚叮咚，跑得飞快，需要减速或速攻拦截。'
    },
    sheet: {
      key: 'sheet', name: '报表哥布林', emoji: '📊', hp: 22, speed: 64,
      armor: 0, mr: 0, bounty: 3, dmg: 1, size: 11, tip: '成群结队出没，算盘塔的天敌……的反面。'
    },
    robot: {
      key: 'robot', name: '加班机器人', emoji: '🦾', hp: 190, speed: 34,
      armor: 0.35, mr: 0.1, bounty: 16, dmg: 2, size: 17, tip: '铁皮很厚但怕魔法，老板相框的凝视最致命。'
    },
    balloon: {
      key: 'balloon', name: '白日梦气球', emoji: '🎈', hp: 70, speed: 78,
      armor: 0.15, mr: 0.15, bounty: 8, dmg: 1, size: 14, fly: true, tip: '飞行单位，走空中捷径，地面减速无效。'
    },
    hr: {
      key: 'hr', name: 'HR 盾姐', emoji: '🛡️', hp: 140, speed: 42,
      armor: 0.62, mr: 0.05, bounty: 14, dmg: 2, size: 16, tip: '物理减免 62%！请用魔法（老板相框）或毒伤解决。'
    },
    ghost: {
      key: 'ghost', name: '画饼幽灵', emoji: '👻', hp: 90, speed: 66,
      armor: 0, mr: 0, bounty: 12, dmg: 2, size: 15, dodge: 0.4, tip: '35% 概率闪避物理弹道，魔法攻击必中。'
    },
    blame: {
      key: 'blame', name: '甩锅侠', emoji: '🤝', hp: 90, speed: 58,
      armor: 0.1, mr: 0.1, bounty: 9, dmg: 1, size: 15, split: 'minion', tip: '死亡时甩出 2 个小锅，务必补刀。'
    },
    minion: {
      key: 'minion', name: '小锅', emoji: '🍳', hp: 32, speed: 86,
      armor: 0, mr: 0, bounty: 4, dmg: 1, size: 11, tip: '被甩出来的锅，又快又小。'
    },
    bossMeeting: {
      key: 'bossMeeting', name: '周会巨兽', emoji: '🦕', hp: 2600, speed: 26,
      armor: 0.3, mr: 0.3, bounty: 130, dmg: 5, size: 26, boss: true, tip: '本可以是一封邮件。血厚双抗，死前会咆哮震屏。'
    },
    bossPPT: {
      key: 'bossPPT', name: 'PPT 千页兽', emoji: '📚', hp: 4200, speed: 24,
      armor: 0.25, mr: 0.25, bounty: 200, dmg: 5, size: 28, boss: true, summon: 'sheet', tip: '每损失 20% 血量就撒出一页报表哥布林。'
    },
    bossKPI: {
      key: 'bossKPI', name: 'KPI 终魔', emoji: '😈', hp: 6500, speed: 30,
      armor: 0.35, mr: 0.35, bounty: 350, dmg: 10, size: 30, boss: true, rage: true, tip: '一切痛苦的根源。血量低于 40% 进入狂暴，速度翻倍。'
    }
  };
  window.ENEMY_ORDER = ['intern', 'msg', 'sheet', 'robot', 'balloon', 'hr', 'ghost', 'blame', 'minion', 'bossMeeting', 'bossPPT', 'bossKPI'];
})();
