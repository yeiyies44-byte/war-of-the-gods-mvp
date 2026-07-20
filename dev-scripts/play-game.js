const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const GAME = 'file://' + path.resolve('/Users/yeiyies/pixel-agents/war-of-the-gods-mvp.html');
const OUT = '/Users/yeiyies/pixel-agents/gameplay-screenshots';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

let frame = 0;
async function shot(page, label) {
  frame++;
  const name = `${String(frame).padStart(2,'0')}-${label}`;
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`📸 ${name}`);
  return name;
}

async function tap(page, k, ms = 80) {
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
    await page.waitForTimeout(80);
  }
  return await page.evaluate(() => gs);
}

// Pick a character by navigating to a specific index
async function pickChar(page, targetIdx, label) {
  // Arrow keys move the cursor
  for (let i = 0; i < targetIdx; i++) {
    await tap(page, 'ArrowRight', 60);
  }
  await shot(page, label);
  await tap(page, 'Enter', 200);
}

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();

  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  // ── BOOT ──
  console.log('🎮 Booting War of the Gods...\n');
  await page.goto(GAME);
  await page.waitForTimeout(1500);
  await shot(page, 'title-screen');

  // ── MENU ──
  console.log('→ Selecting VS BATTLE');
  await tap(page, 'Enter', 300);     // VS BATTLE is index 0, already highlighted
  await waitGs(page, 1);
  await shot(page, 'mode-select');

  // ── MODE SELECT (VS / CPU / etc) ──
  await tap(page, 'Enter', 300);
  await waitGs(page, 2);
  await shot(page, 'character-select-start');

  // ── PICK P1: navigate to TEZCATLIPOCA (index 0) ──
  console.log('→ P1 picks TEZCATLIPOCA (index 0)');
  await pickChar(page, 0, 'p1-picks-tezcatlipoca');
  await waitGs(page, 2, 2000);

  // ── PICK P2: navigate to HUITZILOPOCHTLI (index 2) ──
  console.log('→ P2 picks HUITZILOPOCHTLI (index 2)');
  await tap(page, 'ArrowRight', 60);
  await tap(page, 'ArrowRight', 60);
  await shot(page, 'p2-picks-huitzilopochtli');
  await tap(page, 'Enter', 300);

  // Wait for announce
  await waitGs(page, [3, 5], 3000);
  await shot(page, 'matchup-announce');
  console.log('\n⚔️  FIGHT STARTS: TEZCATLIPOCA vs HUITZILOPOCHTLI\n');

  // Wait through announce to actual fight
  await waitGs(page, 3, 4000);
  await shot(page, 'round1-start');

  // ── FIGHT LOOP ──
  let roundNum = 0;
  let matchDone = false;
  const matchStart = Date.now();

  while (!matchDone && Date.now() - matchStart < 35000) {
    const g = await page.evaluate(() => gs);

    if (g === 3) { // FIGHT
      // P1 strategy: advance, combo, jump away, repeat
      // Phase 1: dash in
      await hold(page, 'KeyD', 180);    // run right
      await tap(page, 'KeyJ', 50);       // jab
      await tap(page, 'KeyJ', 50);
      await tap(page, 'KeyJ', 50);
      await tap(page, 'KeyG', 80);       // special
      // Jump
      await tap(page, 'KeyW', 60);
      await tap(page, 'KeyJ', 60);       // air attack
      // Retreat
      await hold(page, 'KeyA', 100);
      await tap(page, 'KeyJ', 50);
      await tap(page, 'KeyJ', 50);
      // Dash in again
      await hold(page, 'KeyD', 200);
      await tap(page, 'KeyJ', 50);
      await tap(page, 'KeyG', 80);
    }
    else if (g === 5) { // ANNOUNCE
      await page.waitForTimeout(600);
    }
    else if (g === 6) { // ROUND_END
      roundNum++;
      const hp = await page.evaluate(() => {
        if (typeof fighters !== 'undefined' && fighters.length >= 2) {
          return { p1: Math.round(fighters[0].hp), p2: Math.round(fighters[1].hp) };
        }
        return null;
      });
      console.log(`  Round ${roundNum} over${hp ? ` | P1 HP: ${hp.p1}  P2 HP: ${hp.p2}` : ''}`);
      await shot(page, `round${roundNum}-end`);
      await page.waitForTimeout(500);
      await tap(page, 'Enter', 200);
    }
    else if (g === 4) { // WIN
      matchDone = true;
      const winner = await page.evaluate(() => {
        // Check the win screen text on canvas if possible
        return typeof lastWinner !== 'undefined' ? lastWinner : null;
      });
      console.log('\n🏆 MATCH OVER!', winner ? `Winner: ${winner}` : '');
      await shot(page, 'match-win-screen');
    }
    else {
      // Unexpected state — break out
      console.log('  GS:', g, '— unexpected, waiting...');
      await page.waitForTimeout(300);
      if (Date.now() - matchStart > 30000) break;
    }
  }

  // Navigate back to title
  for (let i = 0; i < 6; i++) {
    await tap(page, 'Enter', 600);
    const g = await page.evaluate(() => gs);
    if (g === 0) break;
  }
  await shot(page, 'back-at-title');

  // ── OPEN STORY MODE → HISTORY ──
  console.log('\n📜 Opening Story Mode → Battle Records...');
  await tap(page, 'ArrowDown', 100);  // highlight STORY MODE
  await tap(page, 'Enter', 400);
  await waitGs(page, 7, 3000);
  await shot(page, 'battle-records');

  // Grab the history
  const history = await page.evaluate(() => {
    try { return JSON.parse(localStorage.getItem('wotg_history') || '[]'); } catch(e) { return []; }
  });
  const godNames = await page.evaluate(() => typeof GODS !== 'undefined' ? GODS.map(g => g.name) : []);
  console.log(`\n📊 Battle History (${history.length} records):`);
  history.forEach((r, i) => {
    const p1 = godNames[r.p1] || `god#${r.p1}`;
    const p2 = godNames[r.p2] || `god#${r.p2}`;
    const win = r.p1win ? p1 : p2;
    console.log(`  [${i+1}] ${p1} vs ${p2} → ${win} wins (${r.rounds} rounds, ${r.date})`);
  });

  if (errors.length) {
    console.log('\n❌ JS Errors:');
    errors.forEach(e => console.log(' ', e));
  } else {
    console.log('\n✅ No JS errors');
  }

  await browser.close();
  console.log(`\n🎮 Done! All screenshots in: ${OUT}`);
})();
