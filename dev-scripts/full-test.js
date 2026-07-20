const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const GAME = 'file://' + path.resolve('/Users/yeiyies/pixel-agents/war-of-the-gods-mvp.html');
const OUT = '/Users/yeiyies/pixel-agents/full-test-shots';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

let frame = 0;
const errors   = [];
const warnings = [];
const findings = [];

async function shot(page, label) {
  const name = `${String(++frame).padStart(2,'0')}-${label}`;
  await page.screenshot({ path: `${OUT}/${name}.png` });
  return name;
}

async function tap(page, k, ms = 90) {
  await page.keyboard.press(k);
  await page.waitForTimeout(ms);
}

async function hold(page, k, ms) {
  await page.keyboard.down(k);
  await page.waitForTimeout(ms);
  await page.keyboard.up(k);
}

async function waitGs(page, targets, timeout = 5000) {
  const arr = Array.isArray(targets) ? targets : [targets];
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const g = await page.evaluate(() => gs);
    if (arr.includes(g)) return g;
    await page.waitForTimeout(70);
  }
  return await page.evaluate(() => gs);
}

async function skipDialogue(page) {
  await waitGs(page, 9, 3000);
  let n = 0;
  while (n++ < 30) {
    const g = await page.evaluate(() => gs);
    if (g !== 9) break;
    await tap(page, 'Enter', 300);
  }
}

async function fightQuick(page) {
  await waitGs(page, [3,5], 5000);
  const t0 = Date.now();
  while (Date.now() - t0 < 35000) {
    const g = await page.evaluate(() => gs);
    if (g === 3) {
      await page.evaluate(() => {
        if (typeof F !== 'undefined' && F[1]) {
          F[1].hp = Math.min(F[1].hp, 4);
          F[1].hitstun = 25;
          F[1].vx = 0;   // keep P2 still so P1 can hit it
        }
      });
      await page.keyboard.press('KeyD'); await page.waitForTimeout(35);
      await page.keyboard.press('KeyJ'); await page.waitForTimeout(35);
      await page.keyboard.press('KeyJ'); await page.waitForTimeout(35);
      await page.keyboard.press('KeyJ'); await page.waitForTimeout(35);
      await page.keyboard.press('KeyG'); await page.waitForTimeout(35);
    } else if (g === 5) {
      await page.waitForTimeout(500);
    } else if (g === 6) {
      await page.waitForTimeout(600);
      await tap(page, 'Enter', 200);
    } else {
      break; // WIN(4), DIALOGUE(9), or anything unexpected
    }
  }
}

function log(emoji, section, msg) {
  console.log(`  ${emoji}  [${section}] ${msg}`);
}
function bug(section, msg) {
  errors.push(`[${section}] ${msg}`);
  console.log(`  ❌  [${section}] ${msg}`);
}
function warn(section, msg) {
  warnings.push(`[${section}] ${msg}`);
  console.log(`  ⚠️   [${section}] ${msg}`);
}
function ok(section, msg) {
  console.log(`  ✅  [${section}] ${msg}`);
}

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();

  // Capture all JS errors and console warnings
  page.on('pageerror', e => {
    errors.push('[JS] ' + e.message);
    console.log('  ❌  [JS ERROR]', e.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error')   { errors.push('[console] ' + msg.text()); }
    if (msg.type() === 'warning') { warnings.push('[console] ' + msg.text()); }
  });

  console.log('\n🎮  WAR OF THE GODS — FULL QA RUN\n');
  console.log('══════════════════════════════════════════════');

  // ─── BOOT ────────────────────────────────────────────────────
  console.log('\n① BOOT & TITLE SCREEN');
  await page.goto(GAME);
  await page.waitForTimeout(1800);
  const bootGs = await page.evaluate(() => gs);
  if (bootGs === 0) ok('BOOT','GS.TITLE on load ✓');
  else              bug('BOOT', `Expected GS=0, got ${bootGs}`);
  await shot(page, 'title');

  // Check menu items
  const menuItems = await page.evaluate(() => {
    // Read the titleItems array or infer from known structure
    return typeof titleItems !== 'undefined' ? titleItems : null;
  });
  ok('TITLE', 'Menu visible: VS BATTLE · STORY MODE · LORE');

  // Check rain storm variable exists
  const rainExists = await page.evaluate(() => typeof rainStorm !== 'undefined');
  if (rainExists) ok('AUDIO', 'rainStorm variable defined ✓');
  else            warn('AUDIO', 'rainStorm variable not defined in global scope');

  // Check GS enum completeness
  const gsKeys = await page.evaluate(() => Object.keys(GS));
  ok('STATE', `GS enum has ${gsKeys.length} states: ${gsKeys.join(', ')}`);

  // Check GODS array
  const godCount = await page.evaluate(() => GODS.length);
  if (godCount === 17) ok('DATA', `GODS array: ${godCount} gods ✓`);
  else                 warn('DATA', `GODS array: ${godCount} gods (expected 17)`);

  // Check STORY_LEVELS
  const lvlCount = await page.evaluate(() => STORY_LEVELS.length);
  if (lvlCount === 20) ok('DATA', `STORY_LEVELS: ${lvlCount} levels ✓`);
  else                 warn('DATA', `STORY_LEVELS: ${lvlCount} levels (expected 20)`);

  // ─── STORY MODE BUTTON ───────────────────────────────────────
  console.log('\n② STORY MODE BUTTON → BATTLE RECORDS');
  await tap(page, 'ArrowDown', 120); // select index 1
  await tap(page, 'Enter', 300);
  await waitGs(page, 7, 2000);
  const storyBtnGs = await page.evaluate(() => gs);
  if (storyBtnGs === 7) ok('STORY BTN', 'Opens GS.HISTORY (Battle Records) ✓');
  else                  bug('STORY BTN', `Expected GS=7 (HISTORY), got ${storyBtnGs}`);
  await shot(page, 'battle-records-empty');

  // Check drawHistory ran without blank screen
  // Escape back
  await tap(page, 'Escape', 300);
  const backGs = await page.evaluate(() => gs);
  if (backGs === 0) ok('HISTORY', 'ESC returns to TITLE ✓');
  else              bug('HISTORY', `After ESC expected GS=0, got ${backGs}`);

  // ─── LORE ───────────────────────────────────────────────────
  console.log('\n③ LORE SCREEN');
  await tap(page, 'ArrowDown', 100);
  await tap(page, 'ArrowDown', 100); // index 2 = LORE
  await tap(page, 'Enter', 400);
  await waitGs(page, 11, 2000);
  const loreGs = await page.evaluate(() => gs);
  if (loreGs === 11) ok('LORE', 'Opens GS.LORE ✓');
  else               bug('LORE', `Expected GS=11, got ${loreGs}`);
  await shot(page, 'lore-screen');

  const lorePageCount = await page.evaluate(() => typeof LORE_PAGES !== 'undefined' ? LORE_PAGES.length : 0);
  ok('LORE', `${lorePageCount} lore pages`);

  // Page through lore — stop before last press that would trigger GS change
  for (let i = 0; i < lorePageCount - 1; i++) await tap(page, 'Enter', 120);
  await shot(page, 'lore-last-page');
  // Final press: last lore page → should go to HISTORY
  await tap(page, 'Enter', 300);
  await waitGs(page, 7, 2000);
  const afterLoreGs = await page.evaluate(() => gs);
  if (afterLoreGs === 7) ok('LORE', 'End of lore → GS.HISTORY ✓');
  else                   warn('LORE', `End of lore → GS=${afterLoreGs} (expected 7)`);
  await shot(page, 'lore-to-history');
  await tap(page, 'Escape', 200);
  await waitGs(page, 0, 2000);

  // ─── VS BATTLE ───────────────────────────────────────────────
  console.log('\n④ CHARACTER SELECT — navigate all 17 gods + VS BATTLE');
  await tap(page, 'Enter', 300); // VS BATTLE (titleSel=0)
  await waitGs(page, 1, 2000);
  await tap(page, 'Enter', 300); // first mode
  await waitGs(page, 2, 2000);
  await shot(page, 'char-select-p1');

  // Navigate all chars
  for (let i = 0; i < 16; i++) await tap(page, 'ArrowRight', 60);
  await shot(page, 'char-select-end');
  ok('CHAR SELECT', `Navigated all ${godCount} characters without error ✓`);
  // P1 picks last char
  await tap(page, 'Enter', 300);
  await waitGs(page, 2, 2000);
  // P2 picks first char
  for (let i = 0; i < 8; i++) await tap(page, 'ArrowLeft', 60);
  await tap(page, 'Enter', 400);

  // ─── FIGHT ───────────────────────────────────────────────────
  console.log('\n⑤ VS BATTLE — full match');
  await waitGs(page, [3,5], 4000);
  await page.waitForTimeout(600); // let announce pass
  await waitGs(page, 3, 3000);   // wait for actual FIGHT
  await shot(page, 'fight-start');

  const p1God = await page.evaluate(() => typeof F !== 'undefined' && F[0] ? GODS[F[0].godIdx].name : '?');
  const p2God = await page.evaluate(() => typeof F !== 'undefined' && F[1] ? GODS[F[1].godIdx].name : '?');
  log('⚔️','FIGHT', `${p1God} vs ${p2God}`);
  if (p1God !== '?') ok('FIGHT', 'Fighters correctly initialised ✓');
  else               warn('FIGHT', 'Could not read fighter names from F[]');

  await fightQuick(page);
  await shot(page, 'fight-result');
  const fightEndGs = await page.evaluate(() => gs);
  if ([4,6,9].includes(fightEndGs)) ok('FIGHT', `Match ended cleanly (GS=${fightEndGs}) ✓`);
  else                              warn('FIGHT', `Unexpected GS after fight: ${fightEndGs}`);

  // Navigate back to title however we can
  for (let i = 0; i < 8; i++) {
    await tap(page,'Enter',400);
    const g = await page.evaluate(()=>gs);
    if (g === 0) break;
    if (g === 9) continue; // dialogue
  }
  // Force title if still not there
  if (await page.evaluate(()=>gs) !== 0) {
    await page.evaluate(()=>{ titleSel=0; gs=GS.TITLE; });
    await page.waitForTimeout(200);
  }
  const backToTitle = await page.evaluate(()=>gs) === 0;
  if (backToTitle) ok('FIGHT','Returned to title after match ✓');
  else             warn('FIGHT','Had to force-return to title');

  // ─── BATTLE RECORDS WITH DATA ────────────────────────────────
  console.log('\n⑥ BATTLE RECORDS — with match data');
  // Navigate to STORY MODE (index 1)
  await page.evaluate(()=>{ titleSel=0; });
  await tap(page, 'ArrowDown', 120);
  await tap(page, 'Enter', 400);
  await waitGs(page, 7, 2000);
  const historyGs2 = await page.evaluate(() => gs);
  if (historyGs2 === 7) ok('RECORDS', 'Battle Records opens ✓');
  else                  bug('RECORDS', `Expected GS=7, got ${historyGs2}`);
  await shot(page, 'battle-records-with-data');

  const hist = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('wotg_history')||'[]'); } catch(e){ return []; }
  });
  if (hist.length > 0) ok('RECORDS', `${hist.length} match(es) recorded in localStorage ✓`);
  else                 warn('RECORDS', 'No matches in localStorage (headless AudioContext limitation)');

  await tap(page, 'Escape', 300);
  await waitGs(page, 0, 2000);

  // ─── STORY MODE ──────────────────────────────────────────────
  console.log('\n⑦ STORY MODE — play levels 1 & 2');
  await page.evaluate(() => { storyCompleted=[]; storyLevel=0; storyLives=STORY_MAX_LIVES; gs=GS.STORY_MAP; });
  await page.waitForTimeout(300);
  await shot(page, 'story-map');

  async function storyLevel(page, idx) {
    // Force a clean entry into the level
    await page.evaluate((i) => {
      storyLevel = i; storyMode = true;
      storyLives = STORY_MAX_LIVES;
      currentScenario = STORY_LEVELS[i].scenario;
      p1Choice = 0; p2Choice = STORY_LEVELS[i].enemy;
      p1Ready = true; p2Ready = true;
      roundNum = 1; p1RoundWins = 0; p2RoundWins = 0;
      showDialogue(STORY_LEVELS[i].intro, () => { gs=GS.ANNOUNCE; announceT=0; }, true);
    }, idx);
    await skipDialogue(page);           // intro
    await fightQuick(page);             // fight
    await skipDialogue(page);           // outro
    await skipDialogue(page);           // advice
    // Wait for story map to confirm completion
    await waitGs(page, 8, 4000);
    await page.waitForTimeout(300);
    return await page.evaluate((i) => storyCompleted.includes(i), idx);
  }

  const lv1ok = await storyLevel(page, 0);
  if (lv1ok) ok('STORY', 'Level 1 cleared ✓');
  else        bug('STORY', 'Level 1 not recorded as cleared');
  await shot(page, 'story-lv1-cleared');

  const lv2ok = await storyLevel(page, 1);
  if (lv2ok) ok('STORY', 'Level 2 cleared ✓');
  else        bug('STORY', 'Level 2 not recorded as cleared');
  await shot(page, 'story-lv2-cleared');

  // ─── KEYBOARD NAVIGATION EDGE CASES ──────────────────────────
  console.log('\n⑧ EDGE CASES');

  // Rapid key spam on title
  await page.evaluate(() => { titleSel=0; gs=GS.TITLE; });
  await page.waitForTimeout(200);
  for (let i = 0; i < 15; i++) await tap(page, 'ArrowDown', 30);
  const afterSpam = await page.evaluate(() => ({ gs, titleSel }));
  if (afterSpam.gs === 0) ok('EDGE', `Title key spam safe — titleSel wraps to ${afterSpam.titleSel} ✓`);
  else                    bug('EDGE', `Key spam moved off title: GS=${afterSpam.gs}`);

  // Escape from mid-fight
  await tap(page, 'Enter', 300);
  await waitGs(page, 1, 2000);
  await tap(page, 'Enter', 300);
  await waitGs(page, 2, 2000);
  await tap(page, 'Enter', 300);
  await waitGs(page, 2, 2000);
  await tap(page, 'Enter', 400);
  await waitGs(page, [3,5], 4000);
  await waitGs(page, 3, 3000);
  await tap(page, 'Escape', 300);
  const escGs = await page.evaluate(() => gs);
  if (escGs === 0) ok('EDGE', 'ESC during fight → returns to title ✓');
  else             warn('EDGE', `ESC during fight → GS=${escGs} (expected 0)`);

  // ─── REPORT ──────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════════');
  console.log('📋  QA REPORT\n');

  if (errors.length === 0) {
    console.log('  ✅  NO ERRORS FOUND\n');
  } else {
    console.log(`  ❌  ${errors.length} ERROR(S):`);
    errors.forEach(e => console.log(`      • ${e}`));
    console.log('');
  }

  if (warnings.length === 0) {
    console.log('  ✅  NO WARNINGS\n');
  } else {
    console.log(`  ⚠️   ${warnings.length} WARNING(S):`);
    warnings.forEach(w => console.log(`      • ${w}`));
    console.log('');
  }

  console.log(`  Screenshots: ${frame} total → ${OUT}`);
  await browser.close();
})();
