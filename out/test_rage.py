import os
from playwright.sync_api import sync_playwright

OUT = os.path.join(os.path.dirname(__file__), 'shots')
os.makedirs(OUT, exist_ok=True)
results = []

def check(name, ok, detail=''):
    results.append((name, ok, detail))
    print(('PASS' if ok else 'FAIL') + ' - ' + name + (' | ' + str(detail) if detail else ''))

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1280, 'height': 800})
    errs = []
    page.on('pageerror', lambda e: errs.append(str(e)))
    page.goto('http://localhost:8899')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(400)
    page.evaluate('Save.reset()')
    page.reload()
    page.wait_for_timeout(400)

    page.evaluate("G.start(1)")
    page.wait_for_timeout(400)
    check('6张塔卡渲染', page.locator('.tower-card').count() == 6, page.locator('.tower-card').count())
    check('新塔在塔栏', page.evaluate("TOWER_ORDER.join(',')") == 'coffee,plant,abacus,frame,keyboard,mouse')
    page.evaluate("G.addGold(2000)")
    placed = page.evaluate("""() => {
      let n = 0;
      for (let gx = 1; gx < 19 && n < 4; gx++) for (let gy = 1; gy < 11 && n < 4; gy++) {
        if (!G.canPlace(gx, gy)) continue;
        const k = n < 2 ? 'keyboard' : 'mouse';
        if (G.gold < Tower.placeCost(k)) continue;
        G.ui.placing = k;
        const before = G.towers.length;
        G.tryPlace(gx, gy);
        if (G.towers.length > before) n++;
      }
      return { placed: n, keys: G.towers.map(t => t.key) };
    }""")
    check('键盘塔+鼠标塔可建造', placed['placed'] == 4 and set(placed['keys']) == {'keyboard', 'mouse'}, placed)
    st = page.evaluate("""() => {
      const kb = G.towers.find(t => t.key === 'keyboard');
      const ms = G.towers.find(t => t.key === 'mouse');
      return { kbRange: kb.range, msRange: ms.range, msRate: ms.rate, barBtn: !!document.querySelector('.icon-btn.rage') };
    }""")
    check('新塔属性正确(鼠标长射程低频)', st['msRange'] > st['kbRange'] and st['msRate'] < 1 and st['barBtn'], st)
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(OUT, 'rage_1_newtowers.png'))

    vent = page.evaluate("""() => {
      G.startWave();
      G.spawnEnemy({ type: 'intern' });
      const e = G.enemies[G.enemies.length - 1];
      e.d = 300; e.x = e.path.at(e.d).x; e.y = e.path.at(e.d).y;
      const hp0 = e.hp, r0 = G.ui.rage, d0 = e.d;
      const hit = G.tryVent(e.x, e.y);
      return { ok: hit, dmg: +(hp0 - e.hp).toFixed(1), rageGain: +(G.ui.rage - r0).toFixed(1), pushed: +(d0 - e.d).toFixed(1), cd: G.ventCd > 0, count: G.ventCount };
    }""")
    check('手动怼击: 伤害+击退+攒怒气+冷却', vent['ok'] and vent['dmg'] > 0 and vent['rageGain'] > 0 and vent['pushed'] > 0 and vent['cd'], vent)
    vent2 = page.evaluate("() => { const e = G.enemies.find(x => x.alive); return e ? G.tryVent(e.x, e.y) : 'noenemy'; }")
    check('怼击冷却期内被拦', vent2 is False, vent2)

    kb_rage = page.evaluate("""() => {
      G.rage = 0; G.ui.rage = 0;
      G.spawnEnemy({ type: 'intern' });
      const e = G.enemies[G.enemies.length - 1];
      const kb = G.towers.find(t => t.key === 'keyboard');
      const hp0 = e.hp;
      kb.onHit(e, { dmg: kb.dmg });
      const hp1 = e.hp;
      kb.onHit(e, { dmg: kb.dmg });
      return { rageGain: +G.ui.rage.toFixed(1), heat: kb.heat, ramp: +(hp0 - e.hp > 2 * kb.dmg * 0.99) };
    }""")
    check('键盘塔: 命中攒怒气+键温叠伤', kb_rage['rageGain'] > 1.5 and kb_rage['heat'] == 2 and kb_rage['ramp'], kb_rage)

    exe = page.evaluate("""() => {
      G.spawnEnemy({ type: 'intern' });
      const e = G.enemies[G.enemies.length - 1];
      e.hp = e.maxHp * 0.2;
      const ms = G.towers.find(t => t.key === 'mouse');
      const hp0 = e.hp;
      ms.onHit(e, { dmg: ms.dmg });
      return { killed: !e.alive, hp0: +hp0.toFixed(1), burst: +(ms.dmg * 2).toFixed(1) };
    }""")
    check('鼠标塔残血斩杀翻倍', exe['killed'] and exe['burst'] > exe['hp0'], exe)

    page.evaluate("""() => { for (let i = 0; i < 8; i++) G.spawnEnemy({ type: 'robot' }); }""")
    page.evaluate("G.rage = 100; G.ui.rage = 100")
    page.wait_for_timeout(400)
    page.screenshot(path=os.path.join(OUT, 'rage_2_fullbar.png'))
    released = page.evaluate("""() => {
      const n0 = G.enemies.filter(e => e.alive).length;
      const hits = G.releaseRage();
      return { hits, n0, stunned: G.enemies.filter(e => e.alive && e.stunT > 0).length, slow: G.slowT > 0, fx: G.rageFx > 0, rageCleared: G.ui.rage < 50, cast: G.rageCast };
    }""")
    page.wait_for_timeout(260)
    page.screenshot(path=os.path.join(OUT, 'rage_3_slam.png'))
    page.wait_for_timeout(400)
    page.screenshot(path=os.path.join(OUT, 'rage_4_keyrain.png'))
    check('怒砸键盘: 全屏命中+晕眩+慢动作+怒气清空', released['hits'] == released['n0'] and released['n0'] >= 8 and released['stunned'] >= 6 and released['slow'] and released['fx'] and released['rageCleared'], released)

    page.evaluate("G.combo = 15; G.ui.combo = 15")
    page.wait_for_timeout(300)
    page.screenshot(path=os.path.join(OUT, 'rage_5_combo.png'))

    stats = page.evaluate("""() => {
      G.finish(true);
      const s = Save.load();
      return { vent: s.ventCount, rage: s.rageCount };
    }""")
    check('怼击/大招次数写入存档', stats['vent'] >= 1 and stats['rage'] >= 1, stats)
    check('成就扩到21个', page.evaluate("ACHIEVEMENTS.length") == 21)
    check('科技扩到6条', page.evaluate("TECH.length") == 6)

    page.reload()
    page.wait_for_timeout(500)
    persisted = page.evaluate("() => { const s = Save.load(); return { vent: s.ventCount, rage: s.rageCount }; }")
    check('刷新后泄愤数据保留', persisted['vent'] >= 1 and persisted['rage'] >= 1, persisted)

    b.close()

fails = [r for r in results if not r[1]]
print()
print('===== 泄愤系统专项: ' + str(len(results) - len(fails)) + '/' + str(len(results)) + ' 通过 =====')
print('pageerrors:', errs if errs else '无')
