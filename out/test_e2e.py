import json, sys
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
    page.wait_for_timeout(800)

    check('页面加载无JS错误', len(errors) == 0, errors[:3])
    mounted = page.evaluate("!!document.querySelector('.shine-title')")
    check('Vue挂载+主页渲染', mounted)
    title = page.title()
    check('伪装标题', '经营数据' in title, title)

    page.screenshot(path='out/shots/01_home.png')

    for scr, sel in [('levels', '.level-card'), ('tech', '.tech-line'), ('ach', '.ach-card'), ('daily', '.daily-tag')]:
        page.evaluate(f"G.ui.screen = '{scr}'")
        page.wait_for_timeout(250)
        ok = page.locator(sel).count() > 0
        check(f'界面-{scr}', ok)
    page.screenshot(path='out/shots/02_levels.png')

    page.evaluate("G.ui.screen = 'levels'")
    page.wait_for_timeout(200)
    page.locator('.level-card').first.click()
    page.wait_for_timeout(350)
    check('难度选择弹窗', page.locator('.diff-opt').count() == 3, page.locator('.diff-opt').count())
    crisis_locked = page.locator('.diff-opt').nth(2).is_disabled()
    check('裁员危机未三星时锁定', crisis_locked)
    page.locator('.diff-opt').nth(1).click()
    page.wait_for_timeout(400)
    in_game = page.evaluate("G.ui.screen === 'game' && G.ui.state === 'build'")
    check('进入第1关(正式工)', in_game)
    check('难度标记', page.evaluate("G.diff.key === 'staff'"), page.evaluate('G.diff.key'))
    canvas_visible = page.locator('#gameCanvas').is_visible()
    check('Canvas渲染', canvas_visible)

    gold0 = page.evaluate('G.gold')
    page.locator('.tower-card').first.click()
    page.wait_for_timeout(150)
    placing = page.evaluate('G.ui.placing')
    check('选中咖啡塔进入放置', placing == 'coffee', placing)
    box = page.locator('#gameCanvas').bounding_box()
    sx = box['width'] / 960
    def canvas_click(cx, cy):
        page.mouse.click(box['x'] + cx * sx, box['y'] + cy * sx)
    canvas_click(264, 264)
    page.wait_for_timeout(200)
    towers = page.evaluate('G.towers.length')
    gold1 = page.evaluate('G.gold')
    check('造塔成功+扣款', towers == 1 and gold1 == gold0 - 70, f'towers={towers} gold {gold0}->{gold1}')

    page.locator('.tower-card').first.click()
    canvas_click(264, 168)
    page.wait_for_timeout(150)
    page.evaluate('G.addGold(300)')
    page.locator('.tower-card').nth(2).click()
    canvas_click(648, 360)
    page.wait_for_timeout(150)
    check('再造2塔(咖啡/算盘)', page.evaluate('G.towers.length') == 3, page.evaluate('G.towers.length'))

    canvas_click(264, 264)
    page.wait_for_timeout(150)
    sel = page.evaluate('G.ui.selectedId')
    check('点击选中场上塔', sel > 0, sel)
    panel = page.locator('.tower-panel').is_visible()
    check('塔面板显示', panel)
    page.screenshot(path='out/shots/03_tower_selected.png')

    g0 = page.evaluate('G.gold')
    page.locator('.tower-panel .btn.mint').click()
    page.wait_for_timeout(150)
    lv = page.evaluate('G.towers[0].lv')
    check('升级成功', lv == 1, f'lv={lv} gold {g0}->{page.evaluate("G.gold")}')
    page.locator('.tower-panel .btn.red').click()
    page.wait_for_timeout(150)
    check('出售成功', page.evaluate('G.towers.length') == 2)

    page.evaluate("G.addGold(500)")
    page.locator('.start-wave-btn').click(force=True)
    page.wait_for_timeout(600)
    wave_state = page.evaluate("G.ui.state")
    n_enemies = page.evaluate('G.enemies.length')
    check('开波+敌人生成', wave_state == 'wave' and n_enemies >= 0, f'state={wave_state} enemies={n_enemies}')

    page.evaluate('G.toggleSpeed()')
    page.wait_for_timeout(4000)
    kills = page.evaluate('G.kills')
    check('塔自动攻击并击杀', kills > 0, f'kills={kills}')
    page.screenshot(path='out/shots/04_battle.png')

    page.keyboard.press('Escape')
    page.wait_for_timeout(300)
    disguised = page.evaluate('BossKey.state.disguised')
    paused = page.evaluate('G.ui.paused')
    check('老板键触发伪装屏', disguised and paused)
    page.screenshot(path='out/shots/05_bosskey.png')
    page.keyboard.press('Escape')
    page.wait_for_timeout(200)
    check('再按Esc返回(保持暂停)', page.evaluate('!BossKey.state.disguised && G.ui.paused'))

    page.evaluate('G.ui.paused = false')
    page.keyboard.press(' ')
    page.wait_for_timeout(150)
    check('空格暂停/恢复', page.evaluate('G.ui.paused'))

    page.evaluate('G.ui.paused = false')
    page.evaluate('G.toggleAuto()')
    auto = page.evaluate('G.ui.autoWave')
    check('自动开波开关', auto)

    n_lives = page.evaluate('G.lives')
    page.evaluate('G.onEnemyReached({def:{dmg:1, boss:false}, x:400, y:300})')
    check('漏怪扣生命', page.evaluate('G.lives') == n_lives - 1)

    save_raw = page.evaluate("localStorage.getItem('salary-td-save-v1')")
    save = json.loads(save_raw) if save_raw else {}
    check('存档写入localStorage', save_raw is not None and 'gems' in save, f'gems={save.get("gems")}')

    page.reload()
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(600)
    stars_kept = page.evaluate('Save.load().gems')
    check('刷新后存档保留', stars_kept is not None)

    page.evaluate("Save.reset()")
    browser.close()

fails = [r for r in results if not r['ok']]
print('\n===== 汇总: %d/%d 通过 =====' % (len(results) - len(fails), len(results)))
if errors:
    print('console errors:', errors[:5])
sys.exit(1 if fails else 0)
