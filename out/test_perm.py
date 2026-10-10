import sys
from playwright.sync_api import sync_playwright

BASE = 'http://localhost:8899'
results = []

def check(name, ok, detail=''):
    results.append({'name': name, 'ok': bool(ok), 'detail': str(detail)[:160]})
    print(('PASS' if ok else 'FAIL'), '-', name, ('| ' + str(detail)[:120] if detail else ''))

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    errors = []
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('pageerror', lambda e: errors.append(str(e)))

    page.goto(BASE)
    page.wait_for_load_state('networkidle')
    page.evaluate('Save.reset()')
    page.reload()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(600)
    check('页面加载无JS错误', len(errors) == 0, errors[:3])

    d = page.evaluate("(() => { G.start(1, [], false, 'trainee'); return { diff: G.diff.key, hpMul: G.level.hpMul, gold: G.gold }; })()")
    check('试用期难度生效(hpMul 0.85)', d['diff'] == 'trainee' and abs(d['hpMul'] - 0.85) < 1e-6, d)
    d = page.evaluate("(() => { const g0 = G.gold; G.start(1, [], false, 'crisis'); return { diff: G.diff.key, hpMul: G.level.hpMul, lives: G.maxLives, gold: G.gold, g0 }; })()")
    check('裁员危机 hp×1.45 + 生命减半', d['diff'] == 'crisis' and abs(d['hpMul'] - 1.45) < 1e-6 and d['lives'] == 5, d)
    check('裁员危机金币紧缩(低于正式工)', d['gold'] < d['g0'], f"{d['gold']} vs {d['g0']}")

    r = page.evaluate("(() => { Save.setStars(1, 3); return { can: diffUnlocked(1, 'crisis'), no: diffUnlocked(2, 'crisis') }; })()")
    check('裁员危机解锁条件(本关三星)', r['can'] and not r['no'], r)

    page.evaluate("G.start(1, [], false, 'staff')")
    page.wait_for_timeout(200)
    page.evaluate("G.addGold(500); Tower; G.ui.placing = 'coffee'; G.tryPlace(5, 5); G.ui.placing = 'coffee'; G.tryPlace(6, 5); G.ui.placing = null")
    page.evaluate('G.startWave()')
    page.evaluate('G.timeScale = 10')
    picked = page.evaluate("""(async () => {
      for (let i = 0; i < 600; i++) {
        if (G.ui.state === 'pick' && G.ui.picking && G.ui.picking.length === 3) return { ok: true, gold: G.gold, mods: G.mods.dmg + G.mods.rate + G.mods.bounty };
        await new Promise(r => setTimeout(r, 50));
      }
      return { ok: false, state: G.ui.state };
    })()""")
    check('波结束自动弹出三选一', picked['ok'], picked)
    page.screenshot(path='out/shots/perm_1_pick.png')

    mod_before = page.evaluate("[G.mods.dmg, G.mods.rate, G.mods.bounty, G.mods.waveBonus, G.mods.rage]")
    pick_res = page.evaluate("(() => { const n = G.ui.picking.map(c => c.name); G.pickCard(0); return { n, state: G.ui.state, gold: G.gold }; })()")
    mod_after = page.evaluate("[G.mods.dmg, G.mods.rate, G.mods.bounty, G.mods.waveBonus, G.mods.rage]")
    check('选卡后回到布阵态', pick_res['state'] == 'build', pick_res)
    check('选卡效果写入 mods 总线', mod_after != mod_before, f"{mod_before} -> {mod_after}")

    stack = page.evaluate("""(() => {
      const before = JSON.stringify(G.mods);
      for (let i = 0; i < 3; i++) { G.openPicker(); G.pickCard(0); }
      return before !== JSON.stringify(G.mods);
    })()""")
    check('福利卡可无限叠加', stack)
    check('选卡无JS错误', len(errors) == 0, errors[:3])

    affix = page.evaluate("""(() => {
      G.start(1, [], false, 'crisis');
      G.previewNext();
      const paths = [new TDPath([[-30, 140], [860, 140]])];
      const e1 = new Enemy('intern', paths, null, 1, 1, 1, 'fast+tough');
      const e2 = new Enemy('intern', paths, null, 1, 1, 1, 'rich');
      const base = ENEMY_DATA.intern;
      let hits = 0;
      for (let i = 0; i < 200; i++) if (WaveGen.rollAffix(G.level, 10, false)) hits++;
      return {
        hp: e1.maxHp === Math.round(base.hp * 1.45),
        spd: Math.abs(e1.baseSpeed - base.speed * 1.5) < 1e-6,
        keys: e1.affixKeys.join('+') === 'fast+tough',
        bounty: e2.bounty === Math.round(base.bounty * 2.5),
        prob: hits > 20 && hits < 90,
        hits
      };
    })()""")
    check('词缀: tough 血量×1.45', affix['hp'], affix)
    check('词缀: fast 速度×1.5', affix['spd'])
    check('词缀: 复合词缀解析', affix['keys'])
    check('词缀: rich 赏金×2.5', affix['bounty'])
    check('词缀: crisis 第10波词缀概率合理(11%-45%)', affix['prob'], f"{affix['hits']}/200")

    rain = page.evaluate("""(() => {
      G.initMods();
      G.combo = 4; G.comboGoal = 5;
      const g0 = G.gold;
      G.comboRainCheck();
      const notYet = G.gold === g0;
      G.combo = 5;
      G.comboRainCheck();
      return { notYet, rained: G.gold > g0, rerolled: G.comboGoal !== 5 };
    })()""")
    check('连击金币雨: 未达标不触发/达标触发+重掷目标', rain['notYet'] and rain['rained'] and rain['rerolled'], rain)

    rage90 = page.evaluate("""(() => {
      G.initRage();
      G.rage = 88;
      G.rageGain(1);
      return G.rage;
    })()""")
    check('怒气88%后充能加速(+1.6而非+1)', rage90 > 89.3, rage90)

    miss = page.evaluate("""(() => {
      G.start(1, [], false, 'staff');
      G.missed = 0;
      const e = { def: { dmg: 3, boss: false }, x: 0, y: 0 };
      G.onEnemyReached(e);
      G.onEnemyReached(e);
      G.finish(false);
      return { missed: G.result.missed, win: G.result.win, revengeBtn: true };
    })()""")
    check('近失统计: 漏怪数进结算', miss['missed'] == 2 and not miss['win'], miss)

    rev = page.evaluate("""(() => {
      G.start(1, [], false, 'staff', true);
      return { card: G.revengeCardName, gold: G.gold };
    })()""")
    check('复仇开局白得1张稀有卡', bool(rev['card']), rev)

    page.evaluate("G.start(1, [], false, 'crisis'); G.startWave(); G.timeScale = 4")
    page.wait_for_timeout(2500)
    page.screenshot(path='out/shots/perm_2_crisis.png')

    streak = page.evaluate("""(() => {
      Save.reset();
      const s = Save.load();
      s.daily = { date: '', stars: 0, streak: 0, best: 0, freeze: 0 };
      Save.save();
      const r1 = Save.setDaily(2);
      const dup = Save.setDaily(3);
      const d = Save.load();
      d.daily.date = U.todayStr(1);
      Save.save();
      const r2 = Save.setDaily(2);
      const broken = Save.load();
      broken.daily.date = '2026-01-01';
      broken.daily.streak = 4;
      broken.daily.freeze = 1;
      Save.save();
      const r3 = Save.setDaily(1);
      return { r1, dupGems: dup.streakGems, r2, freezeLeft: Save.load().daily.freeze, r3 };
    })()""")
    check('streak: 首日=1 且发 1 券', streak['r1']['streak'] == 1 and streak['r1']['streakGems'] == 1, streak['r1'])
    check('每日奖励一次性(重复完成不发券)', streak['dupGems'] == 0, streak['dupGems'])
    check('streak: 次日连签=2', streak['r2']['streak'] == 2, streak['r2'])
    check('streak: 断签券续上(4→5)且达5天里程碑补1张券', streak['r3']['streak'] == 5 and streak['freezeLeft'] == 1, { 'r3': streak['r3'], 'freeze': streak['freezeLeft'] })

    page.evaluate("G.ui.screen = 'levels'")
    page.wait_for_timeout(250)
    page.evaluate('Save.setStars(1, 3); US.stars[1] = 3; US.crisisStars[1] = 2')
    page.wait_for_timeout(250)
    page.locator('.level-card').first.click()
    page.wait_for_timeout(300)
    crisis_open = page.evaluate("document.querySelectorAll('.diff-opt')[2].disabled === false")
    check('满星后裁员危机可点', crisis_open)
    page.screenshot(path='out/shots/perm_3_diffsel.png')

    check('全程无JS错误', len(errors) == 0, errors[:5])

    failed = [r for r in results if not r['ok']]
    print(f"\n===== 汇总: {len(results) - len(failed)}/{len(results)} 通过 =====")
    browser.close()
    sys.exit(1 if failed else 0)
