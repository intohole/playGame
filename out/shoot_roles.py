from playwright.sync_api import sync_playwright

BASE = 'http://localhost:8899'
OUT = 'out/shots'
SPOTS = [(264, 264), (264, 168), (648, 360), (312, 264), (120, 264), (648, 168), (456, 456), (312, 456)]
KEYS = ['coffee', 'coffee', 'abacus', 'plant', 'frame', 'coffee', 'abacus', 'coffee']

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    page.goto(BASE)
    page.wait_for_timeout(900)
    page.screenshot(path=f'{OUT}/role_01_home.png')

    page.evaluate("G.ui.screen = 'levels'")
    page.wait_for_timeout(300)
    page.locator('.level-card').first.click()
    page.wait_for_timeout(400)
    page.locator('.role-chip').nth(1).click()
    page.wait_for_timeout(250)
    page.screenshot(path=f'{OUT}/role_02_modal.png')

    page.locator('.diff-opt').nth(1).click()
    page.wait_for_timeout(600)
    for (sx, sy), k in zip(SPOTS[:5], KEYS[:5]):
        page.evaluate(f"G.ui.placing = '{k}'; G.tryPlace({sx // 48}, {sy // 48}); G.ui.placing = null")
    page.evaluate("G.startWave()")
    page.wait_for_timeout(1100)
    page.screenshot(path=f'{OUT}/role_03_banner.png')
    page.evaluate("G.timeScale = 6")
    page.wait_for_timeout(2200)

    page.evaluate("""
      (() => { G.enemies.forEach(e => e.takeDamage(e.maxHp * 0.55, 'rage', true)); })()
    """)
    page.wait_for_timeout(350)
    page.screenshot(path=f'{OUT}/role_04_battle.png')

    for w in range(2, 20):
        for t in range(120):
            page.wait_for_timeout(400)
            st = page.evaluate('({state: G.ui.state})')
            if st['state'] == 'pick':
                page.evaluate('G.pickCard(0)')
                continue
            if st['state'] in ('build', 'over'):
                break
        st = page.evaluate('({state: G.ui.state, wave: G.waveIdx, over: !!G.result})')
        if st['state'] == 'pick' or st['over']:
            break
        page.evaluate('G._auto && G._auto()')
        page.evaluate('G.startWave()')
        if w == 3:
            page.wait_for_timeout(700)
            page.screenshot(path=f'{OUT}/role_05_pick.png')
    page.wait_for_function('G.ui.state === "over"', timeout=180000)
    page.wait_for_timeout(1300)
    page.screenshot(path=f'{OUT}/role_06_result.png')
    st = page.evaluate('({state: G.ui.state, wave: G.waveIdx, win: G.result && G.result.win, stars: G.result && G.result.stars})')
    print('final:', st)
    browser.close()
print('shots done')
