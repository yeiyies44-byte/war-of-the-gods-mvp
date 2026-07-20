const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const GAME = 'file://' + path.resolve('/Users/yeiyies/pixel-agents/war-of-the-gods-mvp.html');
const OUT = '/Users/yeiyies/pixel-agents/story-run';
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

let frame = 0;
async function shot(page, label) {
  const name = `${String(++frame).padStart(2,'0')}-${label}`;
  await page.screenshot({ path: `${OUT}/${name}.png` });
  return name;
}

async function tap(page, k, ms = 90) {
  await page.keyboard.press(k);
  await page.waitForTimeout(ms);
}

async function waitGs(page, targets, timeout = 6000) {
  const arr = Array.isArray(targets) ? targets : [targets];
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const g = await page.evaluate(() => gs);
    if (arr.includes(g)) return g;
    await page.waitForTimeout(70);
  }
  return await page.evaluate(() => gs);
}

// Advance one dialogue line at a time, printing each
async function readAndAdvanceDialogue(page) {
  await waitGs(page, 9, 3000);
  let count = 0;
  while (count++ < 30) {
    const g = await page.evaluate(() => gs);
    if (g !== 9) break;
    const line = await page.evaluate(() => {
      const l = dialogueQueue[dialogueIdx];
      return l ? { speaker: l.speaker, text: l.text } : null;
    });
    if (line) console.log(`       [${line.speaker}] "${line.text}"`);
    await tap(page, 'Enter', 280);
  }
}

// Fight as P1 — drain P2 HP each tick so we win cleanly
async function fight(page, levelName) {
  await waitGs(page, [3, 5], 5000);
  let roundN = 0;
  const t0 = Date.now();
  while (Date.now() - t0 < 35000) {
    const g = await page.evaluate(() => gs);
    if (g === 5) { await page.waitForTimeout(400); continue; }
    if (g === 3) {
      await page.evaluate(() => {
        if (typeof F !== 'undefined' && F[1]) {
          F[1].hp = Math.min(F[1].hp, 6);
          F[1].hitstun = 18;
        }
      });
      await page.keyboard.press('KeyD');  await page.waitForTimeout(35);
      await page.keyboard.press('KeyJ');  await page.waitForTimeout(35);
      await page.keyboard.press('KeyJ');  await page.waitForTimeout(35);
      await page.keyboard.press('KeyG');  await page.waitForTimeout(35);
      await page.keyboard.press('KeyW');  await page.waitForTimeout(35);
      await page.keyboard.press('KeyJ');  await page.waitForTimeout(35);
      continue;
    }
    if (g === 6) {
      roundN++;
      const hp = await page.evaluate(() =>
        typeof F !== 'undefined' && F[0] ? { p1: Math.round(F[0].hp), p2: Math.round(F[1]?.hp||0) } : null
      );
      const r = hp?.p1 > hp?.p2 ? '✅' : '❌';
      console.log(`       ${r} Round ${roundN} — P1:${hp?.p1??'?'} P2:${hp?.p2??'?'}`);
      await page.waitForTimeout(500);
      await tap(page, 'Enter', 200);
      continue;
    }
    if (g === 4 || g === 9) break; // WIN or DIALOGUE (story win → outro)
    await page.waitForTimeout(80);
  }
}

async function playLevel(page, idx, levels, godNames) {
  const lvl = levels[idx];
  const enemyName = godNames[lvl.enemy];
  console.log(`\n  ╔══════════════════════════════════════════╗`);
  console.log(`  ║  LVL ${idx+1}: ${lvl.name.padEnd(34)}║`);
  console.log(`  ║  TEZCATLIPOCA  vs  ${enemyName.padEnd(22)}║`);
  console.log(`  ╚══════════════════════════════════════════╝`);

  await page.evaluate((i) => startStoryLevel(i), idx);
  await page.waitForTimeout(200);
  await shot(page, `lv${idx+1}-${lvl.name.replace(/[^a-z0-9]/gi,'-').toLowerCase()}-intro`);
  console.log('\n  — INTRO —');
  await readAndAdvanceDialogue(page);

  await page.waitForTimeout(200);
  await shot(page, `lv${idx+1}-announce`);
  console.log('\n  — FIGHT —');
  await fight(page, lvl.name);
  await shot(page, `lv${idx+1}-win`);

  console.log('\n  — OUTRO —');
  await readAndAdvanceDialogue(page);
  await shot(page, `lv${idx+1}-outro`);

  console.log('\n  — ADVICE —');
  await readAndAdvanceDialogue(page);
  await shot(page, `lv${idx+1}-advice`);

  // Extra skip in case of lingering dialogue
  await readAndAdvanceDialogue(page);
  await page.waitForTimeout(400);

  const done = await page.evaluate(() => storyCompleted);
  const cleared = done.includes(idx);
  console.log(`\n  ${cleared ? '✅ CLEARED' : '❌ NOT CLEARED'} — completed: [${done}]`);
  if (cleared) await shot(page, `lv${idx+1}-map-cleared`);
  return cleared;
}

(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => console.error('JS ERROR:', e.message));

  console.log('');
  console.log('  ██╗    ██╗ █████╗ ██████╗      ██████╗ ███████╗');
  console.log('  ██║    ██║██╔══██╗██╔══██╗     ██╔═══██╗██╔════╝');
  console.log('  ██║ █╗ ██║███████║██████╔╝     ██║   ██║█████╗');
  console.log('  ██║███╗██║██╔══██║██╔══██╗     ██║   ██║██╔══╝');
  console.log('  ╚███╔███╔╝██║  ██║██║  ██║     ╚██████╔╝██║');
  console.log('   ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═╝      ╚═════╝ ╚═╝');
  console.log('  THE GODS  ·  STORY MODE  ·  TEZCATLIPOCA\'S LEGEND');
  console.log('');

  await page.goto(GAME);
  await page.waitForTimeout(1500);
  await shot(page, 'title');
  console.log('  Game loaded ✓\n');

  const levels  = await page.evaluate(() => STORY_LEVELS.map(l => ({ name: l.name, enemy: l.enemy })));
  const gods    = await page.evaluate(() => GODS.map(g => g.name));

  // Reset and open story map fresh
  await page.evaluate(() => {
    storyCompleted = [];
    storyLevel = 0;
    storyLives = STORY_MAX_LIVES;
    gs = GS.STORY_MAP;
  });
  await page.waitForTimeout(300);
  await shot(page, 'story-map-fresh');
  console.log(`  📜 ${levels.length} levels across 4 acts`);
  console.log(`  ❤️  Lives: 3\n`);

  // ── ACT I: THE FIVE SUNS ──
  console.log('┌─────────────────────────────────────────────────┐');
  console.log('│            ACT I: THE FIVE SUNS                │');
  console.log('└─────────────────────────────────────────────────┘');

  for (let i = 0; i < 5; i++) {
    await playLevel(page, i, levels, gods);
    // Make sure we're on the story map before next level
    const g = await page.evaluate(() => gs);
    if (g !== 8) {
      await page.evaluate(() => { gs = GS.STORY_MAP; });
      await page.waitForTimeout(200);
    }
  }

  // Final map after ACT I
  await page.evaluate(() => { gs = GS.STORY_MAP; storyLevel = 5; });
  await page.waitForTimeout(300);
  await shot(page, 'act1-complete-map');

  const completed = await page.evaluate(() => storyCompleted);
  const lives     = await page.evaluate(() => storyLives);
  const pct       = Math.round(completed.length / levels.length * 100);

  console.log('\n');
  console.log('┌─────────────────────────────────────────────────┐');
  console.log('│               ACT I COMPLETE                   │');
  console.log('└─────────────────────────────────────────────────┘');
  console.log(`  Levels cleared : ${completed.length}/5`);
  console.log(`  Lives remaining: ${lives}/3`);
  console.log(`  Total progress : ${pct}% (${completed.length}/20)`);
  console.log(`  Next up        : ${levels[5]?.name}`);
  console.log('');

  await browser.close();
  console.log(`  Screenshots → ${OUT}`);
})();
