(function () {
  const S = (name, vent) => [name, vent];
  window.ROLES = {
    dev: {
      key: 'dev', name: '程序员', emoji: '👨‍💻', tagline: '需求再改，先问过这块键盘',
      perk: '键盘塔攻速 +15% · 怒气获取 +10%',
      mods: { rage: 0.1, kbRate: 0.15 },
      skins: {
        intern: S('转正卷王', '答辩见'),
        msg: S('钉钉轰炸机', '已读不回?'),
        sheet: S('PRD修改兽', '需求又变了'),
        robot: S('996铁人', '你是机器人?'),
        balloon: S('上线许愿球', '今晚必不上线'),
        hr: S('HR盾姐', 'N+1了解一下'),
        ghost: S('画饼幽灵', '明年就上市'),
        blame: S('甩锅测试', '我电脑是好的'),
        minion: S('小Bug', '又炸一个'),
        bossMeeting: S('需求评审会', '本可以发邮件'),
        bossPPT: S('千页PRD兽', '第38版了'),
        bossKPI: S('35岁危机', '优化的就是你')
      }
    },
    pm: {
      key: 'pm', name: '产品经理', emoji: '📋', tagline: '这个需求很简单，我就说两点',
      perk: '开局金币 +80 · 手动怼击伤害 +50%',
      mods: { ventDmg: 0.5 },
      gold: 80,
      skins: {
        intern: S('产品新人', '竞品都做了'),
        msg: S('甲方来电', '五彩斑斓的黑'),
        sheet: S('排期表怪', '排期再压压'),
        robot: S('杠精程序员', '这实现不了'),
        balloon: S('愿景气球', '对标抖音'),
        hr: S('HRBP姐', '价值观复盘'),
        ghost: S('老板画饼魂', '下轮融资'),
        blame: S('技术甩锅侠', '需求没写清'),
        minion: S('甩来的锅', '接住了'),
        bossMeeting: S('老板汇报会', '明天有空吗'),
        bossPPT: S('路演PPT兽', '投资人要看'),
        bossKPI: S('OKR终魔', '对齐了再走')
      }
    },
    des: {
      key: 'des', name: '设计师', emoji: '🎨', tagline: '改可以，加钱',
      perk: '全塔射程 +10% · 全塔攻速 +5%',
      mods: { range: 0.1, rate: 0.05 },
      skins: {
        intern: S('实习美工', '会PS就行'),
        msg: S('改稿弹窗', '就改一版'),
        sheet: S('素材哥布林', '版权自理'),
        robot: S('需求机器人', 'logo放大'),
        balloon: S('灵感气球', '性冷淡风'),
        hr: S('HR盾姐', '加班算调休'),
        ghost: S('愿景幽灵', '高端大气'),
        blame: S('甩锅产品', '评审过了呀'),
        minion: S('小改一笔', '第五稿了'),
        bossMeeting: S('比稿巨兽', '三家比稿'),
        bossPPT: S('提案千页兽', '字号调大'),
        bossKPI: S('甲方终魔', '我不要你觉得')
      }
    },
    qa: {
      key: 'qa', name: '测试', emoji: '🐞', tagline: '在我这过不了，就是过不了',
      perk: '怒砸键盘伤害 +25% · 怼击冷却 -30%',
      mods: { rageBoom: 0.25, ventCd: 0.7 },
      skins: {
        intern: S('实习测试', '点一下就崩'),
        msg: S('缺陷弹窗', '又被反驳'),
        sheet: S('用例哥布林', '覆盖率不够'),
        robot: S('杠精开发', '环境没问题'),
        balloon: S('回归气球', '改出新bug'),
        hr: S('HR盾姐', '别加班了'),
        ghost: S('需求幽灵', '文档没这条'),
        blame: S('甩锅开发', '无法复现'),
        minion: S('小缺陷', '低优先级'),
        bossMeeting: S('评审巨兽', '这期不上'),
        bossPPT: S('口头需求兽', '开会说的'),
        bossKPI: S('线上事故', '年底背锅')
      }
    },
    ops: {
      key: 'ops', name: '运营', emoji: '📣', tagline: '今天你裂开了吗',
      perk: '击杀赏金 +12% · 波次奖金 +15%',
      mods: { bounty: 0.12, waveBonus: 0.15 },
      skins: {
        intern: S('实习运营', ' Dou不推'),
        msg: S('差评弹幕', '一星差评'),
        sheet: S('数据表怪', '转化又跌'),
        robot: S('算法机器人', '限流了'),
        balloon: S('热点气球', '蹭不上了'),
        hr: S('HR盾姐', '绩效别躺'),
        ghost: S('画饼幽灵', '涨粉百万'),
        blame: S('甩锅产品', '活动没配'),
        minion: S('小水军', '刷量嫌疑'),
        bossMeeting: S('复盘巨兽', '数据呢'),
        bossPPT: S('汇报千页兽', '老板要看的'),
        bossKPI: S('GMV终魔', '增长见顶')
      }
    },
    hr: {
      key: 'hr', name: 'HR', emoji: '💼', tagline: '六点半了，大家怎么还不走',
      perk: '生命上限 +3 · 开局怒气 +25',
      mods: {},
      lives: 3, startRage: 25,
      skins: {
        intern: S('简历海王', '期望薪资?'),
        msg: S('离职威胁弹', '挽留话术'),
        sheet: S('考勤表怪', '全勤没了'),
        robot: S('加班铁人', '又提离职'),
        balloon: S('画饼回旋球', '饼飞回来了'),
        hr: S('猎头对手', '挖你的人'),
        ghost: S('老板画饼魂', '编制冻结'),
        blame: S('甩锅业务', 'HC被砍'),
        minion: S('小投诉', '已安抚'),
        bossMeeting: S('经营巨兽', '降本增效'),
        bossPPT: S('组织架构兽', '又调整了'),
        bossKPI: S('裁员名单', 'N+1都没有')
      }
    }
  };
  window.ROLE_ORDER = ['dev', 'pm', 'des', 'qa', 'ops', 'hr'];
  window.VENTS = {
    taunts: ['这个需求很简单', '对齐一下颗粒度', '形成闭环，赋能抓手', '老板说就这么定', '今晚全员加班', '周报写了没', '这个bug很小', '明天必须上线', '对标一下竞品', '就改最后一个版本', '痛点要拉通', '数据很好看的'],
    pokes: ['怼!', '讲点武德', '反弹!', '有意见?', '加个班?', '锅还你', '已读乱回'],
    wins: ['下班！都给我下班！', '今天的班就上到这', '周会取消，全组摸鱼', '工资到账，怒气清零'],
    loses: ['工位没了，但怒气值满了', 'HR 请你去喝茶了', '需求池淹死了你', '明天带薪复仇'],
    marquee: ['对齐颗粒度', '抓手闭环', '赋能业务', '沉淀方法论', '组合拳打法', '底层逻辑', '顶层设计', '降本增效', '向上管理', '破圈拉齐', '结果导向', '拥抱变化', '主动背锅', '弹性工作制', '福利下午茶', '扁平化管理', '赛马机制', '小步快跑']
  };
  window.roleSkin = function (roleKey, enemyKey) {
    const r = ROLES[roleKey];
    return r && r.skins[enemyKey] ? r.skins[enemyKey] : null;
  };
  window.currentRole = function () {
    return ROLES[Save.load().role] || ROLES.dev;
  };
})();
