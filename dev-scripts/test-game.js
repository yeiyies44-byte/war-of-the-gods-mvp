const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const GAME = 'file://' + path.resolve('/Users/yeiyies/pixel-agents/war-of-the-gods-mvp.html');
const OUT = '/Users/yeiyies/pixel-agents/test-screenshots';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log('📸', name);
}

async function key(page, k, delay = 120) {
  await page.keyboard.press(k);
  await page.waitForTimeout(delay);
}

async function waitForGs(page, target, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const g = await page.evaluate(() => gs);
    if (Array.isArray(target) ? target.includes(g) : g === target) return g;
    await page.waitForTimeout(100);
  }
  return await page.evaluate(() => gs);
}

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', e => errors.push(e.message));

  // GS enum: TITLE=0, MODE=1, PICK=2, FIGHT=3, WIN=4, ANNOUNCE=5, ROUND_END=6,
  //          HISTORY=7, STORY_MAP=8, DIALOGUE=9, CINEMATIC=10, LORE=11

  console.log('Loading game…');
  await page.goto(GAME);
  await page.waitForTimeout(1500);
  await shot(page, '01-title-screen');
  console.log('GS:', await page.evaluate(() => gs), '(expected TITLE=0)');

  // ── STORY MODE → HISTORY SCREEN ──
  console.log('\n--- STORY MODE → History Screen ---');
  await key(page, 'ArrowDown');       // select STORY MODE (index 1)
  await page.waitForTimeout(80);
  await key(page, 'Enter');
  await waitForGs(page, 7, 2000);    // wait for HISTORY=7
  await shot(page, '02-history-empty');
  console.log('GS:', await page.evaluate(() => gs), '(expected HISTORY=7)');

  // Back to title
  await key(page, 'Escape');
  await waitForGs(page, 0, 2000);
  await shot(page, '03-back-to-title');

  // ── VS BATTLE ──
  console.log('\n--- VS Battle ---');
  await key(page, 'Enter');          // VS BATTLE (index 0 already selected)
  await waitForGs(page, 1, 2000);   // MODE=1
  await shot(page, '04-mode-select');

  await key(page, 'Enter');          // first mode option
  await waitForGs(page, 2, 2000);   // PICK=2
  await shot(page, '05-char-pick-p1');

  await key(page, 'Enter');          // pick first character
  await waitForGs(page, 2, 2000);   // PICK=2 for P2
  await shot(page, '06-char-pick-p2');

  await key(page, 'Enter');          // pick first character for P2
  await waitForGs(page, [3, 5], 3000); // FIGHT=3 or ANNOUNCE=5
  await shot(page, '07-announce-or-fight');
  console.log('GS after pick:', await page.evaluate(() => gs));

  // Wait through ANNOUNCE if needed
  await waitForGs(page, 3, 4000);   // wait for FIGHT=3
  await shot(page, '08-fight-in-progress');
  console.log('GS in fight:', await page.evaluate(() => gs));

  // Fight actively as P1 (WASD/arrows + J/Z attack)
  // P1: WASD move, J attack, G spec
  // P2: arrow move, L attack, ;(spec)
  console.log('Fighting…');
  let roundsCompleted = 0;
  const fightStart = Date.now();

  while (Date.now() - fightStart < 25000) {
    const g = await page.evaluate(() => gs);
    if (g === 3) { // FIGHT
      // Aggressive P1 attack
      await page.keyboard.press('KeyD');    // move right
      await page.waitForTimeout(40);
      await page.keyboard.press('KeyJ');    // attack
      await page.waitForTimeout(40);
      await page.keyboard.press('KeyJ');
      await page.waitForTimeout(40);
      await page.keyboard.press('KeyJ');
      await page.waitForTimeout(40);
      await page.keyboard.press('KeyG');    // special
      await page.waitForTimeout(40);
    } else if (g === 6) { // ROUND_END
      roundsCompleted++;
      console.log('Round ended! Round #', roundsCompleted);
      await page.waitForTimeout(600);
      await key(page, 'Enter', 200);
    } else if (g === 5) { // ANNOUNCE
      await page.waitForTimeout(500);
      await key(page, 'Enter', 200);
    } else if (g === 4) { // WIN
      console.log('MATCH WON!');
      await shot(page, '09-win-screen');
      break;
    } else {
      console.log('Unexpected GS:', g);
      break;
    }
  }

  await page.waitForTimeout(500);
  await shot(page, '10-post-fight');
  console.log('GS post-fight:', await page.evaluate(() => gs));

  // Navigate through win screen back to title
  for (let i = 0; i < 6; i++) {
    await key(page, 'Enter', 500);
    const g = await page.evaluate(() => gs);
    if (g === 0) break;
  }
  await shot(page, '11-return-to-title');
  console.log('GS after return:', await page.evaluate(() => gs));

  // ── HISTORY WITH DATA ──
  console.log('\n--- Story Mode with battle data ---');
  const historyBefore = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('wotg_history') || '[]'); } catch(e) { return []; }
  });
  console.log('Battle history records:', historyBefore.length);

  await key(page, 'ArrowDown');
  await page.waitForTimeout(80);
  await key(page, 'Enter');
  await waitForGs(page, 7, 2000);
  await shot(page, '12-history-with-data');
  console.log('History GS:', await page.evaluate(() => gs), '(expected 7)');

  if (historyBefore.length > 0) {
    console.log('Latest record:', JSON.stringify(historyBefore[historyBefore.length - 1]));
  }

  // ── ERRORS ──
  console.log('\n--- Console errors ---');
  if (errors.length === 0) console.log('✅ No JS errors');
  else errors.forEach(e => console.log('❌', e));

  await browser.close();
  console.log(`\nDone! Screenshots in: ${OUT}`);
})();
