# Title Screen Serpent Border Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Xochicalco-style greca step-groove texture to both serpent bodies and replace the sun disc's generic ray system with the Piedra del Sol 4-Ollin glyph silhouette, in the title screen's `drawSerpentBorder(t)` function.

**Architecture:** Two isolated, additive edits inside one existing canvas-drawing function in a single-file HTML5 game. No new state, no new functions, no build step — this is a static file served directly by a browser. Verification is manual/visual (screenshot the title screen), since this codebase has no automated test suite — consistent with how the rest of War of the Gods is verified.

**Tech Stack:** Vanilla JS, HTML5 Canvas 2D context (`cx`), no frameworks, no bundler.

## Global Constraints

- Single file only: all edits go directly into `/Users/yeiyies/pixel-agents/war-of-the-gods-mvp.html`. No worktrees, no copies (project convention).
- `Math.round()` discipline on all pixel-art coordinates — no anti-aliased/fractional positions (project-wide rule). All coordinates in this plan are already integers.
- Do not modify the Pyramid of the Sun block, the offering hands block, the fire/corn body color bands, the flame/kernel/plume details, or any other screen — scope is limited to (1) the per-segment greca groove and (2) the sun disc ray system, per `docs/superpowers/specs/2026-07-12-title-serpent-border-design.md`.
- Dev server: `python3 -m http.server 8765 --directory /Users/yeiyies/pixel-agents`. Title screen loads by default; `?autoplay=1` is not needed since title is the first screen.

---

### Task 1: Greca step-groove on both serpent bodies

**Files:**

- Modify: `/Users/yeiyies/pixel-agents/war-of-the-gods-mvp.html:6245-6260` (left/fire serpent loop), `:6265-6282` (right/corn serpent loop)

**Interfaces:**

- Consumes: existing loop variables `i` (segment index, 0-25), `y` (segment top, `46 + i*14`), `rx` (right serpent x-origin, `W-28`), the canvas context `cx`. No new variables needed.
- Produces: no new symbols — this task only adds `cx.fillRect` calls inside the two existing `for` loops. Task 2 does not depend on this task's output.

- [ ] **Step 1: Add the greca groove to the left (fire) serpent loop**

Open `war-of-the-gods-mvp.html` and find the left-serpent loop (currently lines 6245-6260):

```js
for (let i = 0; i < 26; i++) {
  const y = 46 + i * 14;
  const fl = Math.round(Math.sin(ph * 3 + i * 0.8) * 1.5);
  cx.fillStyle = '#a82e06';
  cx.fillRect(6, y, 22, 13);
  cx.fillStyle = '#d84a0c';
  cx.fillRect(7, y + 1, 18, 9);
  cx.fillStyle = '#f07820';
  cx.fillRect(8, y + 2, 12, 6);
  cx.fillStyle = '#ffc030';
  cx.fillRect(9 + fl, y + 3, 7, 3);
  cx.fillStyle = '#fff068';
  cx.fillRect(11 + fl, y + 3, 3, 2);
  // quetzal plume — feathered serpent
  cx.fillStyle = '#0a7858';
  cx.fillRect(26, y + 1, 2, 11);
  cx.fillStyle = '#10c090';
  cx.fillRect(28, y + 2, 9, 8);
  cx.fillStyle = '#40e0b8';
  cx.fillRect(29, y + 3, 6, 5);
  cx.fillStyle = '#a0fff0';
  cx.fillRect(30, y + 4, 3, 2);
  cx.fillStyle = '#006848';
  cx.fillRect(36, y + 2, 2, 7);
  cx.fillStyle = '#200802';
  cx.fillRect(6, y + 13, 22, 1);
}
```

Add a new block right after the `#fff068` highlight fill and before the `// quetzal plume` comment:

```js
cx.fillStyle = '#fff068';
cx.fillRect(11 + fl, y + 3, 3, 2);
// xicalcoliuhqui step-groove (greca, Xochicalco relief reference)
cx.fillStyle = '#200802';
if (i % 2 === 0) {
  cx.fillRect(8, y + 4, 10, 2);
  cx.fillRect(16, y + 4, 2, 8);
} else {
  cx.fillRect(14, y + 8, 10, 2);
  cx.fillRect(14, y + 1, 2, 8);
}
// quetzal plume — feathered serpent
```

The result: each 13px-tall body segment gets a 2px-wide dark "L" groove, and because it flips orientation every other segment (`i % 2`), consecutive grooves chain into a continuous zigzag running the length of the serpent.

- [ ] **Step 2: Add the mirrored greca groove to the right (corn) serpent loop**

Find the right-serpent loop (currently lines 6265-6282):

```js
for (let i = 0; i < 26; i++) {
  const y = 46 + i * 14;
  const wv = Math.round(Math.sin(ph * 2.2 + i * 0.9) * 1);
  cx.fillStyle = '#0e4006';
  cx.fillRect(rx, y, 22, 13);
  cx.fillStyle = '#1c6c0a';
  cx.fillRect(rx + 2, y + 1, 18, 9);
  cx.fillStyle = '#88b01e';
  cx.fillRect(rx + 2 + wv, y + 2, 6, 4);
  cx.fillStyle = '#88b01e';
  cx.fillRect(rx + 11 + wv, y + 2, 6, 4);
  cx.fillStyle = '#dce02a';
  cx.fillRect(rx + 3 + wv, y + 2, 4, 2);
  cx.fillStyle = '#dce02a';
  cx.fillRect(rx + 12 + wv, y + 2, 4, 2);
  cx.fillStyle = '#2a5c0a';
  cx.fillRect(rx + 9 + wv, y + 1, 2, 11);
  // quetzal plume — feathered serpent
  cx.fillStyle = '#0a6030';
  cx.fillRect(rx - 2, y + 1, 2, 11);
  cx.fillStyle = '#18a858';
  cx.fillRect(rx - 11, y + 2, 9, 8);
  cx.fillStyle = '#40d878';
  cx.fillRect(rx - 10, y + 3, 6, 5);
  cx.fillStyle = '#90ffb8';
  cx.fillRect(rx - 9, y + 4, 3, 2);
  cx.fillStyle = '#085028';
  cx.fillRect(rx - 11, y + 2, 2, 7);
  cx.fillStyle = '#081802';
  cx.fillRect(rx, y + 13, 22, 1);
}
```

Add a new block right after the `#2a5c0a` rib fill and before the `// quetzal plume` comment:

```js
cx.fillStyle = '#2a5c0a';
cx.fillRect(rx + 9 + wv, y + 1, 2, 11);
// xicalcoliuhqui step-groove (greca, Xochicalco relief reference — mirrored)
cx.fillStyle = '#081802';
if (i % 2 === 0) {
  cx.fillRect(rx + 4, y + 4, 10, 2);
  cx.fillRect(rx + 4, y + 4, 2, 8);
} else {
  cx.fillRect(rx, y + 8, 10, 2);
  cx.fillRect(rx + 8, y + 1, 2, 8);
}
// quetzal plume — feathered serpent
```

- [ ] **Step 3: Visual verification**

Run: `python3 -m http.server 8765 --directory /Users/yeiyies/pixel-agents` (skip if already running), then load `http://localhost:8765/war-of-the-gods-mvp.html` in a browser and screenshot the title screen.

Expected: both serpent bodies (left border red/orange, right border green/yellow) show a continuous dark zigzag groove running their full length, without covering the flame flicker, corn kernels, or quetzal plume details. No console errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/yeiyies/pixel-agents
git add war-of-the-gods-mvp.html
git commit -m "feat(title): add Xochicalco greca groove to serpent border segments"
```

---

### Task 2: Sun disc → Piedra del Sol 4-Ollin glyph

**Files:**

- Modify: `/Users/yeiyies/pixel-agents/war-of-the-gods-mvp.html:6446-6449` (the two `.forEach` ray/corner blocks at the end of the `// centre sun disc` section)

**Interfaces:**

- Consumes: existing `mx` (screen mid-x), `sy` (disc center-y, `bt + 20`), `cx`. No new variables.
- Produces: nothing consumed by later tasks. Independent of Task 1.

- [ ] **Step 1: Replace the cross-arm rays and corner squares**

Find this block (currently lines 6446-6449, immediately after the four concentric `arc()` fills for the disc core):

```js
cx.fillStyle = '#c87810';
[
  [0, -22, 4, 6],
  [0, 16, 4, 6],
  [-22, 0, 6, 4],
  [16, 0, 6, 4],
].forEach(([dx, dy, sw, sh]) => cx.fillRect(mx + dx - 2, sy + dy - 2, sw, sh));
cx.fillStyle = '#a86010';
[
  [-14, -14],
  [14, -14],
  [14, 14],
  [-14, 14],
].forEach(([dx, dy]) => cx.fillRect(mx + dx - 3, sy + dy - 3, 6, 6));
```

Replace it with:

```js
// glifo 4-Ollin — four stepped petals (Piedra del Sol reference)
cx.fillStyle = '#c87810';
// top petal
cx.fillRect(mx - 3, sy - 24, 6, 6);
cx.fillRect(mx - 4, sy - 18, 8, 5);
cx.fillRect(mx - 5, sy - 13, 10, 4);
// bottom petal
cx.fillRect(mx - 3, sy + 18, 6, 6);
cx.fillRect(mx - 4, sy + 13, 8, 5);
cx.fillRect(mx - 5, sy + 9, 10, 4);
// left petal
cx.fillRect(mx - 24, sy - 3, 6, 6);
cx.fillRect(mx - 18, sy - 4, 5, 8);
cx.fillRect(mx - 13, sy - 5, 4, 10);
// right petal
cx.fillRect(mx + 18, sy - 3, 6, 6);
cx.fillRect(mx + 13, sy - 4, 5, 8);
cx.fillRect(mx + 9, sy - 5, 4, 10);
// tecpatl (flint-tooth) accents in the diagonal gaps
cx.fillStyle = '#a86010';
cx.fillRect(mx + 10, sy - 16, 3, 2);
cx.fillRect(mx + 12, sy - 14, 3, 2);
cx.fillRect(mx + 14, sy - 12, 3, 2); // NE
cx.fillRect(mx - 13, sy - 16, 3, 2);
cx.fillRect(mx - 15, sy - 14, 3, 2);
cx.fillRect(mx - 17, sy - 12, 3, 2); // NW
cx.fillRect(mx + 10, sy + 14, 3, 2);
cx.fillRect(mx + 12, sy + 12, 3, 2);
cx.fillRect(mx + 14, sy + 10, 3, 2); // SE
cx.fillRect(mx - 13, sy + 14, 3, 2);
cx.fillRect(mx - 15, sy + 12, 3, 2);
cx.fillRect(mx - 17, sy + 10, 3, 2); // SW
```

- [ ] **Step 2: Visual verification**

Reload `http://localhost:8765/war-of-the-gods-mvp.html`, screenshot the title screen's bottom-center sun disc.

Expected: the disc now shows four stepped/tapered petals radiating up/down/left/right (each built from 3 shrinking rects, widest near the disc, narrowest at the tip) with a small staircase "tooth" in each of the four diagonal gaps between petals — reading as the 4-Ollin glyph silhouette rather than a plain 4-point starburst. The concentric circle core underneath is unchanged. No console errors, no overlap with the offering hands (hands are at `sy - 12` to `sy + 12` roughly, horizontally offset from `mx` by 23px+, so they don't intersect the petals).

- [ ] **Step 3: Commit**

```bash
cd /Users/yeiyies/pixel-agents
git add war-of-the-gods-mvp.html
git commit -m "feat(title): redesign sun disc as Piedra del Sol 4-Ollin glyph"
```

---

## Post-implementation

Both tasks are independent and order-agnostic (Task 2 can run before Task 1 with no conflict). After both are committed, the title screen border upgrade (Approach A from the design spec) is complete. The deferred "chicomecoatl" naming question and any other screen (mode/pick/fight/win) remain out of scope, per the spec.
