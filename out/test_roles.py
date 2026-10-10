import re
from playwright.sync_api import sync_playwright

BASE = 'http://localhost:8899'
results = []


def check(name, ok, detail=''):
    results.append((name, bool(ok), detail))
    print(('PASS ' if ok else 'FAIL ') + name + (' | ' + str(detail) if detail else ''))


def evaljs(page, code):
    return page.evaluate(code)


def wait_state(page, state, timeout=30000):
    page.wait_for_function(f"G.ui.state === '{state}'", timeout=timeout)


with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1280, 'height': 800})
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(BASE)
    page.wait_for_timeout(600)

    check('角色数据完整性', evaljs(page, """
      ROLE_ORDER.length === 6 && Object.keys(ROLES).length === 6
      && ROLE_ORDER.every(k => { const r = ROLES[k]; return r.name && r.emoji && r.tagline && r.perk
        && r.skins && Object.keys(r.skins).length === ENEMY_ORDER.length; })
    """))
    check('皮肤含名+发泄短句', evaljs(page, """
      ENEMY_ORDER.every(k => ROLE_ORDER.every(rk => {
        const sk = ROLES[rk].skins[k]; return Array.isArray(sk) && sk.length === 2 && sk[0] && sk[1];
      }))
    """))
    check('发泄文案池', evaljs(page, """
      VENTS.taunts.length >= 8 && VENTS.pokes.length >= 5 && VENTS.wins.length >= 3
      && VENTS.loses.length >= 3 && VENTS.marquee.length >= 10
    """))
    check('默认岗位 dev', evaljs(page, "US.role === 'dev' && currentRole().name === '程序员'"))

    page.evaluate("G.ui.screen = 'levels'")
    page.wait_for_timeout(250)
    page.locator('.level-card').first.click()
    page.wait_for_timeout(300)
    check('岗位选择器6个', page.locator('.role-chip').count() == 6, page.locator('.role-chip').count())
    check('岗位选中态', evaljs(page, "document.querySelector('.role-chip.on') && document.querySelector('.role-chip.on').textContent.includes('程序员')"))
    page.locator('.role-chip').nth(1).click()
    page.wait_for_timeout(150)
    check('切换到产品经理', evaljs(page, "US.role === 'pm' && currentRole().name === '产品经理'"))
    check('岗位perk文案显示', evaljs(page, "document.querySelector('.role-perk').textContent.includes('开局金币')"))
    page.locator('.role-chip').nth(4).click()
    page.wait_for_timeout(150)
    check('切换到运营', evaljs(page, "US.role === 'ops'"))
    page.locator('.diff-opt').nth(1).click()
    page.wait_for_timeout(500)
    check('进游戏带岗位', evaljs(page, "G.ui.screen === 'game' && G.roleKey === 'ops' && G.roleDef.name === '运营'"))
    check('HUD岗位章渲染', page.locator('.hud-role').is_visible() and '运营' in page.locator('.hud-role').inner_text())
    check('岗位存档持久化', evaljs(page, "JSON.parse(localStorage.getItem('salary-td-save-v1')).role === 'ops'"))

    g0 = evaljs(page, 'G.gold')
    check('运营赏金加成生效', abs(evaljs(page, 'G.mods.bounty') - 0.12) < 1e-9 and abs(evaljs(page, 'G.mods.waveBonus') - 0.15) < 1e-9, f'bounty={g0}')

    page.locator('.tower-card').first.click()
    box = page.locator('#gameCanvas').bounding_box()
    sx = box['width'] / 960
    page.mouse.click(box['x'] + 264 * sx, box['y'] + 264 * sx)
    check('预告显示岗位皮肤名', evaljs(page, """
      (() => { const el = document.querySelector('.next-wave-hint .pv-name'); return el && el.textContent.length > 0; })()
    """))
    page.locator('.start-wave-btn').click(force=True)
    page.wait_for_timeout(400)
    check('波次横幅出现', page.locator('.wave-banner').count() == 1)
    check('横幅含皮肤名或波次', evaljs(page, """
      (() => { const b = document.querySelector('.wave-banner'); return b && (b.textContent.includes('波') || b.textContent.includes('BOSS')); })()
    """))

    kills0 = evaljs(page, 'G.kills')
    page.wait_for_function(f'G.kills > {kills0}', timeout=30000)
    page.wait_for_timeout(500)
    check('敌人皮肤名生效', evaljs(page, "G.enemies.some(e => e.dispName && e.dispName !== e.def.name) || G.kills > kills0"))

    page.evaluate("G.start(1, [], false, 'staff', false, 'hr')")
    page.wait_for_timeout(300)
    check('HR生命+3', evaljs(page, 'G.maxLives === 13 && G.lives === 13'), evaljs(page, 'G.maxLives'))
    check('HR开局怒气25', evaljs(page, 'G.rage === 25'), evaljs(page, 'G.rage'))
    page.evaluate("G.start(1, [], false, 'staff', false, 'pm')")
    page.wait_for_timeout(300)
    gold_pm = evaljs(page, 'G.gold')
    page.evaluate("G.start(1, [], false, 'staff', false, 'dev')")
    page.wait_for_timeout(300)
    gold_dev = evaljs(page, 'G.gold')
    check('PM开局金币+80', abs(gold_pm - gold_dev - 80) < 1, f'pm={gold_pm} dev={gold_dev}')
    check('dev键盘塔攻速加成', evaljs(page, """
      (() => { const t = new Tower('keyboard', 4, 4); const withKb = t.rate;
        G.mods.kbRate = 0; const without = t.rate; G.mods.kbRate = 0.15;
        return withKb > without * 1.14; })()
    """))
    check('Boss血条皮肤名可读', evaljs(page, """
      (() => { const e = new Enemy('bossKPI', G.paths, G.flyPath, 1, 1, 1);
        return e.dispName === G.roleDef.skins.bossKPI[0]; })()
    """))
    page.evaluate("G.start(1, [], false, 'staff', false, 'dev')")
    page.wait_for_timeout(300)
    check('重开默认岗位', evaljs(page, "G.roleKey === 'dev' && G.roleDef.skins.sheet[0] === 'PRD修改兽'"))

    check('无JS报错', not errors, errors[:3])
    page.screenshot(path='out/shots/role_home.png')
    page.goto(BASE)
    page.wait_for_timeout(500)
    page.screenshot(path='out/shots/role_home2.png')

    browser.close()

fails = [r for r in results if not r[1]]
print(f"\n=== {len(results) - len(fails)}/{len(results)} passed ===")
exit(1 if fails else 0)
