from playwright.sync_api import sync_playwright

BASE = 'http://localhost:8899'
OUT = 'out/shots'
SPOTS = [(264, 264), (264, 168), (648, 360), (312, 264), (120, 264), (648, 168), (456, 456), (312, 456)]
KEYS = ['coffee', 'coffee', 'abacus', 'plant', 'frame', 'coffee', 'abacus', 'coffee']

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto(BASE)
    page.wait_for_timeout(800)
    page.evaluate("G.ui.screen = 'levels'")
    page.wait_for_timeout(250)
    page.locator('.level-card').first.click()
    page.wait_for_timeout(350)
    page.locator('.diff-opt').nth(1).click()
    page.wait_for_timeout(700)
    page.screenshot(path=f'{OUT}/role_04b_preview.png')

    page.evaluate("""([spots, keys]) => {
      G._si = 0; G._spots = spots; G._keys = keys;
      G._auto = () => {
        while (G._si < G._spots.length) {
          const [x, y] = G._spots[G._si];
          const k = G._keys[G._si];
          if (G.gold < Tower.placeCost(k)) break;
          G.ui.placing = k;
          const before = G.towers.length;
          G.tryPlace(Math.floor(x / 48), Math.floor(y / 48));
          if (G.towers.length > before) G._si++; else break;
        }
        while (G.towers.length >= 4) {
          const up = G.towers.filter(t => t.lv < 3).sort((a, b) => a.nextCost - b.nextCost)[0];
          if (!up) break;
          G.ui.selectedId = up.id;
          if (G.gold < up.upgradeCostReal() + 60) break;
          G.upgradeSel();
        }
      };
    }""", [SPOTS, KEYS])
    for w in range(1, 12):
        page.evaluate('G._auto()')
        page.evaluate('G.startWave(); G.timeScale = 8')
        for t in range(150):
            page.wait_for_timeout(350)
            st = page.evaluate('({state: G.ui.state})')
            if st['state'] == 'pick':
                page.evaluate('G.pickCard(0)')
                continue
            if st['state'] in ('build', 'over'):
                break
        st = page.evaluate('({state: G.ui.state, wave: G.waveIdx, lives: G.lives})')
        if st['state'] == 'over':
            break
    page.wait_for_timeout(1300)
    page.screenshot(path=f'{OUT}/role_06b_win.png')
    st = page.evaluate('({state: G.ui.state, win: G.result && G.result.win, stars: G.result && G.result.stars, wave: G.waveIdx})')
    print('final:', st)
    browser.close()
print('done')
