import sys
from playwright.sync_api import sync_playwright

def auto_spots_and_run(page, level_id, waves_to_run, tag=''):
    page.evaluate("""(lv) => {
      const realLv = lv === -1 ? LEVELS[DAILY_SEED() % 15].id : lv;
      G.start(realLv, lv === -1 ? ['hp', 'gold'] : [], lv === -1);
      const perPath = G.paths.map(p => {
        const cands = [];
        for (let gx = 0; gx < 20; gx++) for (let gy = 0; gy < 12; gy++) {
          const x = gx * 48 + 24, y = gy * 48 + 24;
          if (!G.canPlace(gx, gy)) continue;
          const d = p.distToPath(x, y);
          if (d >= 42 && d <= 90) cands.push({ gx, gy, d, cover: 0 });
        }
        for (const c of cands) {
          for (let d = 0; d < p.total; d += 8) {
            const pt = p.at(d);
            if (Math.hypot(pt.x - (c.gx * 48 + 24), pt.y - (c.gy * 48 + 24)) <= 115) c.cover++;
          }
        }
        cands.sort((a, b) => b.cover - a.cover);
        return cands.slice(0, 10);
      });
      const spots = [];
      const maxLen = Math.max(...perPath.map(a => a.length));
      for (let i = 0; i < maxLen; i++) for (const arr of perPath) {
        if (arr[i]) spots.push([arr[i].gx * 48 + 24, arr[i].gy * 48 + 24]);
      }
      G._spots = spots.slice(0, 20);
      G._si = 0;
      return G._spots.length;
    }""", level_id)
    n_spots = page.evaluate('G._spots.length')
    if n_spots < 4:
        print(f'  {tag}: 合法格位不足({n_spots})，地图检查!')
        return None
    keys = ['frame', 'frame', 'plant', 'coffee', 'frame', 'frame', 'plant', 'abacus', 'frame', 'frame', 'plant', 'frame', 'abacus', 'frame', 'plant', 'frame', 'frame', 'plant', 'frame', 'frame']
    for w in range(1, waves_to_run + 1):
        page.evaluate("""(keys) => {
          while (G._si < G._spots.length) {
            const [x, y] = G._spots[G._si];
            const k = keys[G._si % keys.length];
            if (G.gold < Tower.placeCost(k)) break;
            G.ui.placing = k;
            const before = G.towers.length;
            G.tryPlace(Math.floor(x / 48), Math.floor(y / 48));
            if (G.towers.length > before) G._si++; else break;
          }
          while (true) {
            const up = G.towers.filter(t => t.lv < 3).sort((a, b2) => a.nextCost - b2.nextCost)[0];
            if (!up || G.gold < up.upgradeCostReal() + 80) break;
            G.ui.selectedId = up.id;
            G.upgradeSel();
          }
        }""", keys)
        page.evaluate('G.startWave(); G.timeScale = 6')
        ok = False
        for wait in range(220):
            page.wait_for_timeout(400)
            st = page.evaluate('G.ui.state')
            if st == 'pick':
                page.evaluate('G.pickCard(0)')
                continue
            if st in ('build', 'over'):
                ok = True
                break
        if not ok:
            print(f'  {tag} 波{w}: 超时卡死!')
            return None
        st = page.evaluate('({state: G.ui.state, wave: G.waveIdx, lives: G.lives, kills: G.kills})')
        if st['state'] == 'over' or w == waves_to_run:
            r = page.evaluate('G.result')
            print(f'  {tag} 结束于波{st["wave"]}/{waves_to_run} lives={st["lives"]} kills={st["kills"]} result={r}')
            return r
    return None

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1280, 'height': 800})
    errs = []
    page.on('pageerror', lambda e: errs.append(str(e)))
    page.goto('http://localhost:8899')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(400)
    page.evaluate('Save.reset(); Save.addGems(30); const t = Save.load().tech; t.hrq = 3; t.fin = 3; t.welfare = 3; t.coffee = 3; t.admin = 3; Save.save()')

    print('== L5 Boss关(周会巨兽) ==')
    auto_spots_and_run(page, 5, 12, 'L5')
    print('  L5 星:', page.evaluate('Save.getStars(5)'))

    print('== L10 Boss关(PPT千页兽) ==')
    auto_spots_and_run(page, 10, 16, 'L10')
    print('  L10 星:', page.evaluate('Save.getStars(10)'))

    print('== L15 最终关(KPI终魔) ==')
    auto_spots_and_run(page, 15, 20, 'L15')
    print('  L15 星:', page.evaluate('Save.getStars(15)'))

    print('== 无尽模式(跑到失败) ==')
    page.evaluate("G.start('endless')")
    w = 0
    while page.evaluate('G.ui.state') != 'over' and w < 30:
        w += 1
        page.evaluate("""() => {
          while (G._si < G._spots.length) {
            const [x, y] = G._spots[G._si];
            const ks = ['coffee','coffee','frame','plant','frame','abacus'];
            const k = ks[G._si % ks.length];
            if (G.gold < Tower.placeCost(k)) break;
            G.ui.placing = k;
            const before = G.towers.length;
            G.tryPlace(Math.floor(x / 48), Math.floor(y / 48));
            if (G.towers.length > before) G._si++; else break;
          }
          while (true) {
            const up = G.towers.filter(t => t.lv < 3).sort((a, b2) => a.nextCost - b2.nextCost)[0];
            if (!up || G.gold < up.upgradeCostReal() + 80) break;
            G.ui.selectedId = up.id;
            G.upgradeSel();
          }
          G.startWave(); G.timeScale = 8;
        }""")
        for wait in range(200):
            page.wait_for_timeout(350)
            if page.evaluate('G.ui.state') == 'pick':
                page.evaluate('G.pickCard(0)')
                continue
            if page.evaluate('G.ui.state') in ('build', 'over'):
                break
    print(f'  无尽: ', page.evaluate('({wave: G.waveIdx, lives: G.lives, state: G.ui.state, best: Save.load().endlessBest})'))

    print('== 每日挑战 ==')
    auto_spots_and_run(page, -1, 3, '每日')
    print('  每日完成:', page.evaluate('({daily: Save.load().daily, gems: Save.load().gems})'))

    print('pageerrors:', errs[:5])
    page.screenshot(path='out/shots/07_modes.png')
    b.close()
