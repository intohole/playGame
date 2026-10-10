import sys
from playwright.sync_api import sync_playwright

SPOTS = [(264, 264), (264, 168), (648, 360), (312, 264), (120, 264), (648, 168), (456, 456), (312, 456)]
KEYS = ['coffee', 'coffee', 'abacus', 'plant', 'frame', 'coffee', 'abacus', 'coffee']

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={'width': 1280, 'height': 800})
    errs = []
    page.on('pageerror', lambda e: errs.append(str(e)))
    page.goto('http://localhost:8899')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(400)

    page.evaluate("""([spots, keys]) => {
      Save.reset();
      G.start(1);
      G._spots = spots; G._keys = keys; G._si = 0;
      G._auto = () => {
        while (G._si < G._spots.length) {
          const [x, y] = G._spots[G._si];
          const gx = Math.floor(x / 48), gy = Math.floor(y / 48);
          const k = G._keys[G._si];
          if (G.gold < Tower.placeCost(k)) break;
          G.ui.placing = k;
          const before = G.towers.length;
          G.tryPlace(gx, gy);
          if (G.towers.length > before) G._si++; else break;
        }
        while (G.towers.length >= 4) {
          const up = G.towers.filter(t => t.lv < 3).sort((a, b2) => a.nextCost - b2.nextCost)[0];
          if (!up) break;
          G.ui.selectedId = up.id;
          const c = up.upgradeCostReal();
          if (G.gold < c + 60) break;
          G.upgradeSel();
        }
      };
      return 'sim ready';
    }""", [SPOTS, KEYS])

    max_lv = 0
    for wave in range(1, 9):
        info = page.evaluate('G._auto(); ({towers: G.towers.length, maxLv: Math.max(...G.towers.map(t=>t.lv+1))})')
        max_lv = max(max_lv, info['maxLv'])
        page.evaluate('G.startWave(); G.timeScale = 4')
        for wait in range(140):
            page.wait_for_timeout(500)
            st = page.evaluate('({state: G.ui.state})')
            if st['state'] == 'pick':
                page.evaluate('G.pickCard(0)')
                continue
            if st['state'] in ('build', 'over'):
                break
        st = page.evaluate('({state: G.ui.state, wave: G.waveIdx, lives: G.lives, kills: G.kills, gold: Math.floor(G.gold)})')
        print(f"波{wave}: {st}")
        if st['state'] == 'over':
            break

    result = page.evaluate('G.result')
    saved = page.evaluate('({stars: Save.getStars(1), gems: Save.load().gems})')
    print('结算:', result, '| 塔最高等级:', max_lv)
    print('存档:', saved)
    print('pageerrors:', errs[:5])
    page.screenshot(path='out/shots/06_playthrough_result.png')
    b.close()
