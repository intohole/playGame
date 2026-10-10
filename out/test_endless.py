from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1280, 'height': 800})
    errs = []
    page.on('pageerror', lambda e: errs.append(str(e)))
    page.goto('http://localhost:8899')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(400)
    page.evaluate('Save.reset(); Save.addGems(30); const t = Save.load().tech; t.hrq=3; t.fin=3; t.welfare=3; t.coffee=3; t.admin=3; Save.save()')
    page.evaluate("""() => {
      G.start('endless');
      const cands = [];
      for (let gx = 0; gx < 20; gx++) for (let gy = 0; gy < 12; gy++) {
        const x = gx * 48 + 24, y = gy * 48 + 24;
        if (!G.canPlace(gx, gy)) continue;
        const d = G.paths[0].distToPath(x, y);
        if (d >= 42 && d <= 90) cands.push({ gx, gy, cover: 0 });
      }
      for (const c of cands) for (let d = 0; d < G.paths[0].total; d += 8) {
        const pt = G.paths[0].at(d);
        if (Math.hypot(pt.x - (c.gx * 48 + 24), pt.y - (c.gy * 48 + 24)) <= 115) c.cover++;
      }
      cands.sort((a, b) => b.cover - a.cover);
      G._spots = cands.slice(0, 16).map(c => [c.gx * 48 + 24, c.gy * 48 + 24]);
      G._si = 0;
    }""")
    w = 0
    while page.evaluate('G.ui.state') != 'over' and w < 30:
        w += 1
        page.evaluate("""() => {
          while (G._si < G._spots.length) {
            const [x, y] = G._spots[G._si];
            const ks = ['frame', 'plant', 'coffee', 'frame', 'abacus', 'frame'];
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
        for wait in range(220):
            page.wait_for_timeout(350)
            if page.evaluate('G.ui.state') == 'pick':
                page.evaluate('G.pickCard(0)')
                continue
            if page.evaluate('G.ui.state') in ('build', 'over'):
                break
    print('无尽:', page.evaluate('({wave: G.waveIdx, lives: G.lives, state: G.ui.state, best: Save.load().endlessBest, kills: G.kills})'))
    print('errors:', errs[:3])
    b.close()
