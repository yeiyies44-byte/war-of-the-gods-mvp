# AI opponent — bounded-awareness memory window

## Context

`aiTick(ai, tgt)` (war-of-the-gods-mvp.html, ~L3297) drives every AI-controlled fighter's decisions (CHASE/ATTACK/RETREAT state, jump timing, special-move triggers). It is currently fully memoryless: every decision reads only the current frame's `dx` (distance to target), `tgt.hitstun`, and `ai.hp`/`ai.maxHp` — nothing about what happened even one frame earlier persists. `GOD_AI[]` (~L758) already gives each of the 17 gods a distinct personality (aggro/range/patience/jumpy/fearless) layered on top of this same memoryless state machine, and `DIFF_AI[difficulty]` scales the same values further.

This spec adds a short, hard-edged memory window to the AI: it can read a pattern in the player's recent behavior, but the instant that behavior scrolls past a fixed horizon, it's gone — not faded, not weighted down, just absent. This mirrors a discussion about how attention in a transformer works (weighted connections re-formed fresh each pass, bounded by a hard context-window edge, nothing existing outside it) applied as an actual gameplay mechanic rather than left as metaphor.

## Design

### 1. Data structure

Add one field to the object returned by `makeFighter()` (~L1210): `awareness: []`. This is only meaningful for `isAI` fighters but costs nothing to include on both (kept simple, no conditional field).

`AWARENESS_WINDOW = 90` (new top-level constant, ~90 frames ≈ 1.5s at 60fps) defines the hard cap.

Each entry pushed into `awareness` is `{dx, action}`:

- `dx`: `tgt.x - ai.x` that tick (already computed once per `aiTick` call, reused).
- `action`: one of `'attack' | 'special' | 'jump' | 'idle'`, read from existing `tgt` fields, no new state added to the target fighter:
  - `'special'` if `tgt.specTimer > 0`
  - else `'attack'` if `tgt.hitbox` is truthy or `tgt.atkTimer > 0`
  - else `'jump'` if `!tgt.onGround`
  - else `'idle'`

### 2. Population

Inside `aiTick`, after computing `dx`/`dist` (top of the function), push the new snapshot: `ai.awareness.push({dx, action})`. If `ai.awareness.length > AWARENESS_WINDOW`, `shift()` the oldest entry off. This is the hard boundary — an entry that ages out is deleted outright, not decayed.

### 3. Consumption

Inside the existing `if(ai.aiTimer<=0)` decision block (where `aCh` and `ai.aiState` are computed), derive two cheap aggregates by scanning `ai.awareness`:

- `atkFreq` = (count of entries where `action === 'attack' || action === 'special'`) / `ai.awareness.length`. Fraction of the recent window spent attacking.
- `distTrend` = `Math.abs(awareness[0].dx) - Math.abs(awareness[last].dx)`. Using absolute distance (not raw signed `dx`) sidesteps left/right polarity entirely: **positive** means distance has shrunk across the window (player closing in, from either side), **negative** means it's grown (player retreating, or AI itself pulled away).

Apply both as small additive nudges to `aCh` (aggression chance) only — the one value that already governs the `ATTACK`/`RETREAT` choice once `dist<closeThresh`:

- `-0.25 * atkFreq` — a player who's been attacking through most of the window makes the AI warier, biasing away from `ATTACK` and toward `RETREAT`.
- `-0.15 * Math.max(0, distTrend) / 100` (scaled small — `distTrend` is a raw pixel delta, not a 0–1 fraction like `atkFreq`) — a player who's been closing the gap across the window makes the AI slightly less eager to press `ATTACK` once in range, again only expressed through the existing `ATTACK`-vs-`RETREAT` roll.

Note: since both terms only feed `aCh`, and `aCh` is only consulted inside the existing `dist<closeThresh` branch, `distTrend` cannot cause `RETREAT` to trigger from farther away than today — it only shifts the odds once the AI is already close. This is a deliberate scope limit: reaching "retreat before the gap fully closes" would require changing the `closeThresh` branch condition itself, not just nudging `aCh`, which is out of scope for this pass (see Out of scope).

Both terms are small, additive nudges to a value that already exists (`aCh`) — no new state machine, no new states, no rewrite of the CHASE/ATTACK/RETREAT branch structure.

### 4. Edge cases

- `awareness` starts as `[]` on every `startFight()` (fresh `makeFighter()` call) — first ~90 frames of any match have `atkFreq = 0` (empty-array division guarded: skip the aggregate math and treat as 0 until `awareness.length > 0`) and `distTrend = 0`, i.e. fully neutral, identical to current behavior. No fight opens "already wary" from a previous match.
- Buffer is per-fighter, reset every `startFight()` — no cross-match leakage.
- No new global variables (project rule) — `AWARENESS_WINDOW` is a top-level `const`, which is the existing pattern for values like `PLAT`.

### Out of scope

- No visual/audio tell when the AI is reading a pattern (confirmed: invisible, behavior-only).
- No per-god variation in window size or aggregate weighting — this is a global `aiTick` change, not a god passive. Doesn't touch any of the 7 per-god switch/case blocks or the 5 parallel arrays.
- No difficulty-scaled window size — `AWARENESS_WINDOW` is fixed; difficulty continues to act only through existing `DIFF_AI` values.
- No modification to the `closeThresh`/`farThresh` branch conditions themselves — `distTrend` cannot trigger an early `RETREAT` from beyond `closeThresh`; it only nudges the `ATTACK`-vs-`RETREAT` odds once already within range (see Consumption note above). Making distance-trend cause an actual early retreat is a separate, larger change to the state machine and is left for a future pass if wanted.
- Approach C (running aggregates instead of live buffer scan) — not needed at this scale (~90 entries), left as a documented future upgrade path if profiling ever shows the live scan costing anything measurable.

## Testing

No automated test suite exists for this file (single HTML, playtest-verified per project convention). Manual verification:

1. Start a 1P vs CPU match (any god, any difficulty).
2. As P1, repeat-spam one attack type for ~2 seconds against the AI.
3. Confirm the AI trends toward `RETREAT` more than it did in the first ~1.5s of the same match (before the window fills).
4. Start a fresh match and confirm the AI does _not_ open already-wary — first ~1.5s should behave identically to current (pre-change) behavior.
5. Confirm no console errors, no frame-rate impact from the per-tick buffer scan.
