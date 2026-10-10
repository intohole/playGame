(function () {
  const W = 960, H = 576;
  function Lv(o) { return Object.assign({ W, H, chapter: 1, lives: 10, flyPath: null, paths: null, pool: ['intern'], bossWave: null, deskR: 46 }, o); }
  const p1 = [[-30, 140], [200, 140], [200, 430], [560, 430], [560, 170], [860, 170]];
  const p2 = [[300, -30], [300, 240], [90, 240], [90, 470], [520, 470], [520, 300], [850, 300]];
  const p3 = [[-30, 470], [700, 470], [700, 150], [430, 150], [430, 330], [150, 330]];
  const p4 = [[-30, 90], [860, 90], [860, 230], [110, 230], [110, 370], [800, 370], [800, 500]];
  const p5 = [[-30, 300], [240, 300], [240, 110], [540, 110], [540, 460], [840, 460]];
  const p6a = [[-30, 180], [300, 180], [300, 300], [620, 300], [620, 140], [880, 140]];
  const p6b = [[-30, 440], [300, 440], [300, 300], [620, 300], [620, 140], [880, 140]];
  const p7 = [[-30, 60], [880, 60], [880, 500], [160, 500], [160, 180], [700, 180], [700, 380], [360, 380]];
  const p8g = [[-30, 450], [300, 450], [300, 180], [640, 180], [640, 430], [880, 430]];
  const p8f = [[-30, 90], [880, 90], [880, 430]];
  const p9 = [[480, -30], [480, 130], [140, 130], [140, 290], [820, 290], [820, 450], [420, 450]];
  const p10a = [[-30, 150], [400, 150], [400, 300], [700, 300], [700, 130], [880, 130]];
  const p10b = [[-30, 450], [400, 450], [400, 300], [700, 300], [700, 130], [880, 130]];
  const p11 = [[-30, 120], [700, 120], [700, 260], [260, 260], [260, 420], [860, 420], [860, 540], [500, 540]];
  const p12 = [[-30, 500], [240, 500], [240, 320], [80, 320], [80, 140], [560, 140], [560, 320], [420, 320], [420, 460], [700, 460], [700, 220], [880, 220]];
  const p13 = [[-30, 300], [180, 300], [180, 110], [780, 110], [780, 490], [180, 490], [480, 490], [480, 300]];
  const p13f = [[480, -30], [480, 250]];
  const p14a = [[-30, 100], [820, 100], [820, 260], [480, 260], [480, 420], [160, 420], [160, 300]];
  const p14b = [[300, -30], [300, 100], [820, 100], [820, 260], [480, 260], [480, 420], [160, 420], [160, 300]];
  const p14f = [[-30, 560], [500, 560], [500, 480], [160, 480]];
  const p15 = [[-30, 80], [860, 80], [860, 500], [100, 500], [100, 260], [480, 260], [480, 300]];
  const p15f = [[-30, 300], [440, 300]];
  const hpMul = [1, 1.15, 1.3, 1.45, 1.6, 1.85, 2.1, 2.35, 2.6, 2.9, 3.2, 3.5, 3.85, 4.15, 4.5];
  const spdMul = [1, 1, 1.02, 1.04, 1.05, 1.06, 1.07, 1.08, 1.09, 1.1, 1.1, 1.11, 1.12, 1.12, 1.13];
  const gold = [240, 250, 270, 290, 310, 320, 340, 360, 380, 420, 440, 460, 480, 500, 560];
  const waves = [8, 9, 10, 11, 12, 12, 13, 14, 15, 16, 16, 17, 18, 19, 20];
  const gems = [2, 2, 2, 3, 4, 3, 3, 3, 4, 5, 4, 4, 4, 5, 8];
  const poolByCh = [
    ['intern'],
    ['intern', 'msg'],
    ['intern', 'msg', 'sheet'],
    ['intern', 'msg', 'sheet', 'robot'],
    ['intern', 'msg', 'sheet', 'robot'],
    ['intern', 'msg', 'sheet', 'robot', 'balloon'],
    ['intern', 'msg', 'sheet', 'robot', 'balloon', 'hr'],
    ['intern', 'msg', 'sheet', 'robot', 'balloon', 'hr', 'ghost'],
    ['intern', 'msg', 'sheet', 'robot', 'balloon', 'hr', 'ghost', 'blame'],
    ['intern', 'msg', 'sheet', 'robot', 'balloon', 'hr', 'ghost', 'blame'],
    ['msg', 'sheet', 'robot', 'balloon', 'hr', 'ghost', 'blame'],
    ['intern', 'msg', 'robot', 'balloon', 'hr', 'ghost', 'blame'],
    ['intern', 'sheet', 'robot', 'balloon', 'hr', 'ghost', 'blame'],
    ['msg', 'sheet', 'robot', 'balloon', 'hr', 'ghost', 'blame'],
    ['intern', 'msg', 'sheet', 'robot', 'balloon', 'hr', 'ghost', 'blame']
  ];
  const defs = [
    { name: '周一晨会', path: p1, desk: [860, 170], intro: '拖住这些实习小怪，别让他们偷走你的带薪时光。' },
    { name: '消息轰炸', path: p2, desk: [850, 300], pool: ['intern', 'msg'], intro: '消息弹窗出现了，它们跑得飞快。' },
    { name: '报表海啸', path: p3, desk: [150, 330], pool: ['intern', 'msg', 'sheet'], intro: '报表哥布林成群出没，试试算盘塔的溅射。' },
    { name: '加班铁皮', path: p4, desk: [800, 500], pool: ['intern', 'msg', 'sheet', 'robot'], intro: '加班机器人护甲 35%，快造一座老板相框。' },
    { name: '又是周会', path: p5, desk: [840, 460], pool: ['intern', 'msg', 'sheet', 'robot'], bossWave: { wave: 12, enemy: 'bossMeeting' }, intro: 'BOSS：周会巨兽本可以是一封邮件。' },
    { name: '两面夹击', path: p6a, paths: [p6a, p6b], desk: [880, 140], pool: ['intern', 'msg', 'sheet', 'robot', 'balloon'], intro: '两个入口！敌人会从两路杀来，白日梦气球走空中。' },
    { name: 'HR 巡查', path: p7, desk: [360, 380], pool: ['intern', 'msg', 'sheet', 'robot', 'balloon', 'hr'], intro: 'HR 盾姐物抗 62%，魔法与毒才是答案。' },
    { name: '画饼连环', path: p8g, flyPath: p8f, desk: [880, 430], pool: ['intern', 'msg', 'sheet', 'robot', 'balloon', 'hr', 'ghost'], intro: '画饼幽灵会闪避子弹，且气球直接空降。' },
    { name: '甩锅大战', path: p9, desk: [420, 450], pool: ['intern', 'msg', 'sheet', 'robot', 'balloon', 'hr', 'ghost', 'blame'], intro: '甩锅侠死后会甩出两个小锅，注意补刀。' },
    { name: '千页汇报', path: p10a, paths: [p10a, p10b], desk: [880, 130], bossWave: { wave: 16, enemy: 'bossPPT' }, intro: 'BOSS：PPT 千页兽，每掉两成血就撒一页报表。' },
    { name: '绩效风暴', path: p11, desk: [500, 540], pool: ['msg', 'sheet', 'robot', 'balloon', 'hr', 'ghost', 'blame'], intro: '年底了，一切都快了起来。' },
    { name: '述职迷宫', path: p12, desk: [880, 220], pool: ['intern', 'msg', 'robot', 'balloon', 'hr', 'ghost', 'blame'], intro: '这条述职之路又长又绕，守住每个弯道。' },
    { name: '环形监工', path: p13, flyPath: p13f, desk: [480, 300], pool: ['intern', 'sheet', 'robot', 'balloon', 'hr', 'ghost', 'blame'], intro: '工位被环形包围，气球从头顶直降！' },
    { name: '年终审计', path: p14a, paths: [p14a, p14b], flyPath: p14f, desk: [160, 300], pool: ['msg', 'sheet', 'robot', 'balloon', 'hr', 'ghost', 'blame'], intro: '三面来敌，审计季没有退路。' },
    { name: 'KPI 终魔', path: p15, flyPath: p15f, desk: [480, 300], bossWave: { wave: 20, enemy: 'bossKPI' }, lives: 8, intro: '最终 BOSS：KPI 终魔。低血狂暴，一切痛苦的根源。' }
  ];
  const list = defs.map((d, i) => Lv(Object.assign({
    id: i + 1, chapter: Math.floor(i / 5) + 1, name: d.name, intro: d.intro,
    waves: waves[i], hpMul: hpMul[i], spdMul: spdMul[i], startGold: gold[i],
    gems: gems[i], pool: poolByCh[i], bossWave: d.bossWave || null,
    path: d.path, paths: d.paths || [d.path], flyPath: d.flyPath || null, desk: d.desk
  })));
  const endless = Lv({
    id: 'endless', chapter: 4, name: '无尽加班', intro: '加班永无止境，看看你能撑到第几波。',
    waves: 999, hpMul: 1, spdMul: 1, startGold: 400, gems: 0, lives: 10,
    pool: ['intern', 'msg', 'sheet', 'robot', 'balloon', 'hr', 'ghost', 'blame'],
    path: p9, paths: [p9], desk: [420, 450], endless: true
  });
  window.LEVELS = list.concat([endless]);
  window.CANVAS_W = W; window.CANVAS_H = H;
})();
