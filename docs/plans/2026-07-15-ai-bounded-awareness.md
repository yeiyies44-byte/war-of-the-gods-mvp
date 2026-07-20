# AI Bounded-Awareness Memory Window Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the AI opponent in `war-of-the-gods-mvp.html` a short, hard-edged memory of the player's recent behavior (attack frequency, distance trend) that nudges its `ATTACK`-vs-`RETREAT` odds — entries older than ~1.5s are deleted outright, never decayed.

**Architecture:** A fixed-length ring buffer (`awareness: []`, capped at `AWARENESS_WINDOW = 90` entries) added to each fighter object, populated every tick inside `aiTick()`, and scanned during the AI's existing periodic decision cycle to compute two aggregates (`atkFreq`, `distTrend`) that feed small additive terms into the existing `aCh` (aggression chance) calculation.

**Tech Stack:** Vanilla JS, single HTML file, HTML5 Canvas, no build step, no automated test framework — this project is playtest-verified via a local static server and the browser console.

## Global Constraints

- **Single file only** — all changes go into `/Users/yeiyies/pixel-agents/war-of-the-gods-mvp.html`. No new files, no worktrees, no splits.
- **No new global variables outside the existing pattern** — `AWARENESS_WINDOW` is declared as a top-level `const`, matching how `PLAT` and `DIFF_AI` are already declared.
- **`Math.round()` for pixel positions** — not applicable to this change; no rendering/coordinate math is touched.
- **INAH verification** — not applicable; no cosmology, naming, or visual content is touched.
- **Ownership tags (`// [SECTION]`)** — `aiTick()` does not currently carry one of the 8 valid section tags (`[GODS]`, `[RENDER]`, `[CAMERA]`, `[COLLISION]`, `[I18N]`, `[INPUT]`, `[AUDIO]`, `[GOD_NAME]`); AI opponent logic doesn't fit any of them. Follow the local convention already used inside this function area instead: a `// ── description ──` banner comment, not a bracketed tag.
- **Known risk (from the file's own tombstone):** a second agent may be actively committing to this same file's title screen in parallel, with no worktree isolation. Check `git log --oneline -5` before starting each task and commit immediately after each task completes — committed work survives a clobber, uncommitted work does not.
- **Spec source of truth:** `docs/superpowers/specs/2026-07-15-ai-bounded-awareness-design.md` (as committed at `6a65d18`). If anything here appears to contradict that spec, the spec wins and this plan has a bug.
- **Source file style:** `war-of-the-gods-mvp.html` is hand-written in a dense, compact style (no spaces after `:`/`,` inside object literals, single-line statements kept single-line). It is **not** run through prettier. Every "find"/"replace" code block below is written in that exact style and fenced as ` ```text ` (not ` ```js `) specifically so this repo's `prettier --write` pre-commit hook — which reformats every `.md` file, including embedded ` ```js ` fences — cannot silently reformat these blocks out of sync with the real file. Copy these blocks verbatim; do not "clean them up."

---

## File Structure

Only one file is touched:

- **Modify:** `war-of-the-gods-mvp.html`
  - `~L778` — add `AWARENESS_WINDOW` constant next to `PLAT`.
  - `~L1210-1222` — `makeFighter()`: add `awareness:[]` field.
  - `~L3297-3312` — `aiTick()`: add buffer population (start of function) and buffer consumption (inside the existing decision block).

No new files. No test files — this project has no automated test suite; verification is manual via `python3 -m http.server 8765 --directory /Users/yeiyies/pixel-agents` and the browser devtools console, per the project's existing convention (confirmed in the spec's Testing section and in this file's own session-tombstone history).

---

## Task 1: Add the memory buffer's constant and per-fighter field

**Files:**

- Modify: `war-of-the-gods-mvp.html:778` (add constant after `PLAT`)
- Modify: `war-of-the-gods-mvp.html:1219` (add field to `makeFighter()`'s return object)

**Interfaces:**

- Consumes: nothing new.
- Produces: `AWARENESS_WINDOW` (top-level `const`, value `90`) and `awareness` (array field present on every fighter object returned by `makeFighter()`, initially `[]`). Task 2 pushes into `awareness` and reads `AWARENESS_WINDOW` as the cap.

- [ ] **Step 1: Pre-flight — confirm no uncommitted conflicting work**

Run:

```bash
cd /Users/yeiyies/pixel-agents
git log --oneline -5 -- war-of-the-gods-mvp.html
git status --short war-of-the-gods-mvp.html
```

Expected: `git status` shows no pending changes to `war-of-the-gods-mvp.html` (untracked PNGs/other files from parallel work are fine and unrelated — ignore those). If the file itself has uncommitted changes, stop and check with Yei before proceeding — do not overwrite unknown in-progress work.

- [ ] **Step 2: Baseline check — confirm the field doesn't exist yet**

Run:

```bash
python3 -m http.server 8765 --directory /Users/yeiyies/pixel-agents
```

Open `http://localhost:8765/war-of-the-gods-mvp.html?autoplay=1` in a browser, open devtools console, and once the fight screen loads, type:

```text
F[1].awareness
```

Expected: `undefined` (the field doesn't exist yet — this confirms the starting state before the change).

- [ ] **Step 3: Add the `AWARENESS_WINDOW` constant**

In `war-of-the-gods-mvp.html`, find:

```text
const PLAT = { x:180, y:352, w:440, h:28 };
```

Replace with:

```text
const PLAT = { x:180, y:352, w:440, h:28 };
// ── AI bounded-awareness memory: a hard-edged ring buffer of recent opponent behavior. ──
// Entries older than AWARENESS_WINDOW frames are deleted outright when the buffer is
// scanned — never decayed, never weighted down. See aiTick() for population/consumption.
const AWARENESS_WINDOW = 90; // ~1.5s at 60fps
```

- [ ] **Step 4: Add the `awareness` field to `makeFighter()`**

In `war-of-the-gods-mvp.html`, find:

```text
    aiState:'CHASE', aiTimer:0, aiJumpCD:0,
```

Replace with:

```text
    aiState:'CHASE', aiTimer:0, aiJumpCD:0, awareness:[],
```

- [ ] **Step 5: Verify the field now exists**

Reload `http://localhost:8765/war-of-the-gods-mvp.html?autoplay=1`, open console, once the fight screen loads type:

```text
F[1].awareness
```

Expected: `[]` (empty array — the field now exists and starts empty, matching the spec's edge-case requirement that a fresh match never opens already-wary).

- [ ] **Step 6: Commit**

```bash
git add war-of-the-gods-mvp.html
git commit -m "feat(ai): add bounded-awareness memory buffer field and constant

Adds AWARENESS_WINDOW (90-frame hard cap, ~1.5s) and an empty
awareness[] ring buffer on every fighter object. No behavior change
yet — the buffer is declared but nothing populates or reads it until
the next commits."
```

---

## Task 2: Populate the buffer every tick

**Files:**

- Modify: `war-of-the-gods-mvp.html:3297-3302` (top of `aiTick()`)

**Interfaces:**

- Consumes: `AWARENESS_WINDOW` and `ai.awareness` from Task 1. Reads `tgt.specTimer`, `tgt.hitbox`, `tgt.atkTimer`, `tgt.onGround` — all pre-existing fields on the target fighter, no new state added to it.
- Produces: `ai.awareness` populated with `{dx, action}` entries every tick, capped at `AWARENESS_WINDOW` length via `shift()`. Task 3 scans this array.

- [ ] **Step 1: Pre-flight — confirm Task 1's commit is present**

Run: `git log --oneline -3 -- war-of-the-gods-mvp.html`
Expected: the Task 1 commit (`feat(ai): add bounded-awareness memory buffer...`) is the most recent entry touching this file.

- [ ] **Step 2: Add buffer population at the top of `aiTick()`**

In `war-of-the-gods-mvp.html`, find:

```text
function aiTick(ai, tgt) {
  let il=false,ir=false,ij=false,ia=false,is=false;
  const d=DIFF_AI[difficulty];
  const gAI=GOD_AI[ai.godIdx]||GOD_AI[12];
  const dx=tgt.x-ai.x, dist=Math.abs(dx);
  ai.aiTimer--;
```

Replace with:

```text
function aiTick(ai, tgt) {
  let il=false,ir=false,ij=false,ia=false,is=false;
  const d=DIFF_AI[difficulty];
  const gAI=GOD_AI[ai.godIdx]||GOD_AI[12];
  const dx=tgt.x-ai.x, dist=Math.abs(dx);
  // ── Bounded-awareness: record this tick's read of the target, then hard-cap the window ──
  const tgtAction = tgt.specTimer>0 ? 'special'
    : (tgt.hitbox || tgt.atkTimer>0) ? 'attack'
    : !tgt.onGround ? 'jump'
    : 'idle';
  ai.awareness.push({dx, action:tgtAction});
  if(ai.awareness.length>AWARENESS_WINDOW) ai.awareness.shift();
  ai.aiTimer--;
```

- [ ] **Step 3: Verify the buffer fills and caps**

Reload `http://localhost:8765/war-of-the-gods-mvp.html?autoplay=1`, open console. Immediately after the fight starts, type:

```text
F[1].awareness.length
```

Expected: a small number (buffer just started filling, likely under 90 if checked quickly).

Wait ~3 seconds (let the fight run), then type again:

```text
F[1].awareness.length
```

Expected: exactly `90` — confirms the `shift()` cap is working and the buffer isn't growing unbounded.

Then type:

```text
F[1].awareness[0]
```

Expected: an object shaped like `{dx: <number>, action: "idle"|"attack"|"special"|"jump"}`.

- [ ] **Step 4: Commit**

```bash
git add war-of-the-gods-mvp.html
git commit -m "feat(ai): populate bounded-awareness buffer every aiTick

Each tick records the target's relative distance and current action
(attack/special/jump/idle) into ai.awareness, capped at
AWARENESS_WINDOW entries via shift() — entries that age out are
deleted outright, not decayed. Buffer is populated but not yet read
anywhere; no behavior change yet."
```

---

## Task 3: Consume the buffer — nudge aggression based on recent pattern

**Files:**

- Modify: `war-of-the-gods-mvp.html` — the decision block inside `aiTick()` (the `if(ai.aiTimer<=0){...}` block that computes `aCh` and `ai.aiState`).

**Interfaces:**

- Consumes: `ai.awareness` populated by Task 2.
- Produces: no new externally-visible interface — this task changes the _value_ of the existing local `aCh` variable inside `aiTick()`, which already drives `ai.aiState` selection. Nothing outside `aiTick()` needs to know this happened.

- [ ] **Step 1: Pre-flight — confirm Task 2's commit is present**

Run: `git log --oneline -3 -- war-of-the-gods-mvp.html`
Expected: the Task 2 commit (`feat(ai): populate bounded-awareness buffer...`) is the most recent entry touching this file.

- [ ] **Step 2: Add temporary instrumentation to observe current (pre-change) `aCh` values**

In `war-of-the-gods-mvp.html`, find:

```text
    const aCh=Math.max(0,Math.min(1,d.aCh*gAI.aggro+(pressAdv?0.35:0)+(ai.rage>0?0.2:0)-(rattled?0.3:0)));
    const farThresh=180*gAI.range, closeThresh=70*gAI.range;
```

Temporarily replace with:

```text
    const aCh=Math.max(0,Math.min(1,d.aCh*gAI.aggro+(pressAdv?0.35:0)+(ai.rage>0?0.2:0)-(rattled?0.3:0)));
    if(ai===F[1]) console.log('[awareness-debug pre-change] aCh',aCh.toFixed(3));
    const farThresh=180*gAI.range, closeThresh=70*gAI.range;
```

- [ ] **Step 3: Confirm baseline — `aCh` does not vary with attack pattern yet**

Reload `http://localhost:8765/war-of-the-gods-mvp.html?autoplay=1`, open console. Get close to the AI as P1 (move with `A`/`D`) and repeat-press `J` (attack) for a few seconds. Watch the `[awareness-debug pre-change] aCh` log lines.

Expected: the logged `aCh` values fluctuate only due to `pressAdv`/`rattled`/`rage` (existing factors) — they do **not** trend downward purely from repeated attacking, confirming the buffer isn't influencing anything yet.

- [ ] **Step 4: Replace the instrumentation with the real aggregate computation and `aCh` nudge**

In `war-of-the-gods-mvp.html`, find (the temporary version from Step 2):

```text
    const aCh=Math.max(0,Math.min(1,d.aCh*gAI.aggro+(pressAdv?0.35:0)+(ai.rage>0?0.2:0)-(rattled?0.3:0)));
    if(ai===F[1]) console.log('[awareness-debug pre-change] aCh',aCh.toFixed(3));
    const farThresh=180*gAI.range, closeThresh=70*gAI.range;
```

Replace with:

```text
    // ── Bounded-awareness read: fraction of the window spent attacking, and whether ──
    // ── distance has been closing. Both are 0 until the buffer has at least one entry. ──
    let atkFreq=0, distTrend=0;
    if(ai.awareness.length>0){
      let atkCount=0;
      for(const e of ai.awareness) if(e.action==='attack'||e.action==='special') atkCount++;
      atkFreq=atkCount/ai.awareness.length;
      distTrend=Math.abs(ai.awareness[0].dx)-Math.abs(ai.awareness[ai.awareness.length-1].dx);
    }
    const aCh=Math.max(0,Math.min(1,d.aCh*gAI.aggro+(pressAdv?0.35:0)+(ai.rage>0?0.2:0)-(rattled?0.3:0)-0.25*atkFreq-0.15*Math.max(0,distTrend)/100));
    const farThresh=180*gAI.range, closeThresh=70*gAI.range;
```

Note: `distTrend` only ever nudges `aCh` — since `aCh` is only consulted inside the existing `dist<closeThresh` branch below, this cannot cause `RETREAT` to trigger from farther away than today. That's a deliberate, spec-documented scope limit (see spec's Consumption section), not a bug.

- [ ] **Step 5: Add temporary instrumentation to verify the new nudge is live**

In `war-of-the-gods-mvp.html`, find:

```text
    const aCh=Math.max(0,Math.min(1,d.aCh*gAI.aggro+(pressAdv?0.35:0)+(ai.rage>0?0.2:0)-(rattled?0.3:0)-0.25*atkFreq-0.15*Math.max(0,distTrend)/100));
    const farThresh=180*gAI.range, closeThresh=70*gAI.range;
```

Temporarily replace with:

```text
    const aCh=Math.max(0,Math.min(1,d.aCh*gAI.aggro+(pressAdv?0.35:0)+(ai.rage>0?0.2:0)-(rattled?0.3:0)-0.25*atkFreq-0.15*Math.max(0,distTrend)/100));
    if(ai===F[1]) console.log('[awareness-debug post-change] aCh',aCh.toFixed(3),'atkFreq',atkFreq.toFixed(2),'distTrend',distTrend.toFixed(1));
    const farThresh=180*gAI.range, closeThresh=70*gAI.range;
```

- [ ] **Step 6: Verify the nudge responds to repeated attacking**

Reload `http://localhost:8765/war-of-the-gods-mvp.html?autoplay=1`, open console. Get close to the AI as P1 and repeat-press `J` (attack) continuously for 2+ seconds. Watch the `[awareness-debug post-change]` log lines.

Expected:

- In the first ~1.5s of the match (before `atkFreq`/`distTrend` logs even start appearing, or while `atkFreq` is still low), `aCh` values are close to the Step 3 baseline.
- As `atkFreq` climbs toward higher values from sustained attacking, `aCh` visibly decreases relative to the Step 3 baseline for the same difficulty/god — confirming the wariness nudge is live.

- [ ] **Step 7: Remove the temporary instrumentation**

In `war-of-the-gods-mvp.html`, find:

```text
    const aCh=Math.max(0,Math.min(1,d.aCh*gAI.aggro+(pressAdv?0.35:0)+(ai.rage>0?0.2:0)-(rattled?0.3:0)-0.25*atkFreq-0.15*Math.max(0,distTrend)/100));
    if(ai===F[1]) console.log('[awareness-debug post-change] aCh',aCh.toFixed(3),'atkFreq',atkFreq.toFixed(2),'distTrend',distTrend.toFixed(1));
    const farThresh=180*gAI.range, closeThresh=70*gAI.range;
```

Replace with:

```text
    const aCh=Math.max(0,Math.min(1,d.aCh*gAI.aggro+(pressAdv?0.35:0)+(ai.rage>0?0.2:0)-(rattled?0.3:0)-0.25*atkFreq-0.15*Math.max(0,distTrend)/100));
    const farThresh=180*gAI.range, closeThresh=70*gAI.range;
```

- [ ] **Step 8: Final sanity check — no console errors, no leftover debug logs**

Reload `http://localhost:8765/war-of-the-gods-mvp.html?autoplay=1`, play a full match to completion (either side winning). Confirm:

- No errors in the console at any point.
- No `[awareness-debug` lines appear (confirms Step 7 fully removed both instrumentation blocks).

- [ ] **Step 9: Commit**

```bash
git add war-of-the-gods-mvp.html
git commit -m "feat(ai): nudge aggression based on bounded-awareness pattern read

atkFreq (fraction of the recent window spent attacking) and
distTrend (whether distance has been closing) now feed small
additive terms into aCh, the existing aggression-chance value.
A player who's been attacking heavily makes the AI warier and more
retreat-prone once already close — reacting to a recent pattern
instead of only the current frame's distance/HP snapshot. Both
terms are 0 until the buffer has at least one entry, so a fresh
match never opens already-wary."
```

---

## Task 4: Full regression playtest and session tombstone update

**Files:**

- Modify: `war-of-the-gods-mvp.html:1-11` (session tombstone comment block at the top of the file)

**Interfaces:**

- Consumes: the complete feature from Tasks 1-3.
- Produces: nothing new — this task is verification plus the project's own documentation convention (updating the `LAST SESSION` tombstone), not new code.

- [ ] **Step 1: Confirm a fresh match doesn't open already-wary**

Reload `http://localhost:8765/war-of-the-gods-mvp.html?autoplay=1`. Immediately at fight start, play defensively (don't spam attacks) for the first 2 seconds and observe the AI's behavior.

Expected: AI behavior in the opening 1.5s reads the same as it did before this feature (Task 1 Step 2's baseline) — no unexpected extra wariness from a previous match or from an empty buffer.

- [ ] **Step 2: Confirm the wariness effect across difficulties**

Repeat the Task 3 Step 6 test (repeat-press `J` for 2+ seconds while close to the AI) on all three difficulties (easy/MACEHUAL, medium/CUAUHTLI, hard/TLATOANI — selectable from the mode-select screen before a 1P match starts).

Expected: on all three, sustained attacking visibly increases how often the AI chooses `RETREAT` over `ATTACK` once in range, compared to a match where P1 attacks only occasionally. The magnitude may differ by difficulty (since `aCh`'s other terms already scale with `d.aCh`/`gAI.aggro`), but the directional effect should be present on all three.

- [ ] **Step 3: Confirm no regressions to existing AI behavior**

Play at least one full match on each difficulty to completion (win or lose). Confirm:

- AI still chases when far away (`CHASE` state still reachable/behaves as before).
- AI still uses specials at roughly the expected rate (unaffected by this change — `specialCD` logic wasn't touched).
- No console errors at any point.
- Framerate feels unaffected (the buffer scan is ~90 simple comparisons, done only once per AI decision cycle, not every frame — should be imperceptible, but confirm visually there's no stutter).

- [ ] **Step 4: Update the session tombstone**

In `war-of-the-gods-mvp.html`, find the tombstone comment block at the top of the file (between `LAST SESSION:` and the closing `-->`). Read its current full contents first (it may have been updated by the parallel agent since this plan was written — re-run `git log --oneline -5 -- war-of-the-gods-mvp.html` and `head -12 war-of-the-gods-mvp.html` to get the latest version before editing).

Replace the tombstone with an updated version that:

- Sets `LAST SESSION:` to today's date.
- Adds an `ALIVE:` line describing the bounded-awareness feature: what it does, that it's `aiTick`-only (not per-god), the `AWARENESS_WINDOW=90` constant, and that it's invisible/behavioral-only per design (no UI tell).
- Preserves any `IMPORTANT`/`DEAD`/`NEXT`/`BROKE` content from the current tombstone that's still relevant (e.g. the parallel-agent warning, if still applicable — check whether it's still true by looking at recent git log authorship/timing patterns).
- Updates `NEXT:` to reflect this feature is done and playtested; note any open follow-up (e.g. "Approach C — running aggregates instead of live buffer scan — documented as a future upgrade in the spec if profiling ever shows the live scan costing anything measurable").

- [ ] **Step 5: Final commit**

```bash
git add war-of-the-gods-mvp.html
git commit -m "docs: update session tombstone for AI bounded-awareness feature

Feature is complete and playtested across all three difficulties:
sustained attacking now measurably increases AI RETREAT likelihood
once in range, via a 90-frame hard-edged memory window. No visual/
audio tell (by design), no per-god variation, no difficulty-scaled
window size."
```

---

## Self-Review Notes

**Spec coverage:**

- §1 Data structure → Task 1.
- §2 Population → Task 2.
- §3 Consumption (both `atkFreq` and `distTrend`, and the explicit note that `distTrend` cannot trigger early `RETREAT`) → Task 3 Step 4.
- §4 Edge cases (empty-buffer guard, per-fighter/per-match reset, no new globals) → Task 1 (field lives on `makeFighter()`'s return, so it's naturally reset every `startFight()`) and Task 3 Step 4's `if(ai.awareness.length>0)` guard.
- Out of scope items (no visual tell, no per-god variation, no difficulty-scaled window, no `closeThresh` branch modification, Approach C deferred) → nothing in this plan touches any of those; explicitly called out in Task 3 Step 4's note and Task 4 Step 4's tombstone update.
- Testing section → Tasks 3-4's manual verification steps cover all 5 of the spec's listed checks (repeat-spam → more `RETREAT`; fresh match not already-wary; no console errors; no frame-rate impact — folded into Task 4 Step 3).

**Placeholder scan:** No TBD/TODO markers; every step has literal code or literal console commands with stated expected output.

**Type consistency:** `awareness` (Task 1) → pushed-to in Task 2 with `{dx, action}` shape → read in Task 3 with the same `.dx`/`.action` property names throughout. `AWARENESS_WINDOW` name and value (90) consistent across Tasks 1-2. No naming drift.

**Formatting integrity (added on review):** all "find"/"replace" blocks targeting `war-of-the-gods-mvp.html` content are fenced as ` ```text ` rather than ` ```js ` — verified this repo's `lint-staged` config runs `prettier --write` on every staged `.md` file, which reformats embedded ` ```js ` fences (adds spaces, rewraps multi-line expressions at `printWidth:100`) and would otherwise silently desync these blocks from the real file's compact, unformatted style. Confirmed by inspecting this plan's own first commit (`baef421`): the original ` ```js ` fences came back from the hook with `{x:180,...}` reformatted to `{ x: 180, ... }` and the `aCh` one-liner exploded into 7 lines — neither matches the real source. Content in every block below was re-verified character-for-character against the live file (`war-of-the-gods-mvp.html` at commit `6a65d18`'s HEAD) before being re-entered.
