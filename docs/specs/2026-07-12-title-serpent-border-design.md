# Title screen — serpent border upgrade

## Context

`drawSerpentBorder(t)` (war-of-the-gods-mvp.html, ~L6239-6466) draws the title screen's frame: two serpents meeting snout-to-snout at top (a Pyramid of the Sun between their heads) and tail-to-tail at bottom (curling tails flanking a sun disc, with a red hand and a green hand offering toward it).

- **Left serpent — Xiuhcóatl** (fire serpent): correctly named, INAH-consistent. Red/orange/gold gradient body, flame crest, quetzal-plume trim.
- **Right serpent — labeled "chicomecoatl"** (corn serpent): green/yellow gradient body, corn-kernel details, quetzal-plume trim. Naming note: Chicomecóatl (the maize goddess) is not depicted as a serpent in real Mexica iconography — she appears as a young woman with a paper/maize headdress. This is an invented elemental pairing (fire vs. earth/maize), not an INAH-verified attribution. Out of scope for this pass (see "Out of scope" below) — flagged for a future naming decision, not resolved here.

This spec covers **Approach A** from brainstorming: a surgical texture upgrade that keeps the existing composition, palette, and hand-crafted details (flames, kernels, plumes, pyramid, offering hands) fully intact, and layers in two new elements drawn from Yei's saved Instagram references:

1. Xochicalco relief pin (serpent ouroboros built from rectangular greca-block segments) → body segment texture.
2. Piedra del Sol / glifo 4-Ollin → center sun disc redesign.

## Design

### 1. Serpent body segment texture — greca escalonada

Each serpent body loops over 26 segments (`for (let i = 0; i < 26; i++)`, 14px tall each). After the existing color-band fills for a segment, add a 2px-wide dark step-line ("L" shape: one horizontal tick + one vertical tick) tracing along the segment, alternating direction (↳ / ↰) every other segment so consecutive segments chain into a continuous zigzag running the length of the body — the step-and-key (xicalcoliuhqui) motif from the Xochicalco relief, rendered as incised linework rather than a new fill color.

- Color: the darkest shade already used by that serpent (`#200802` fire / `#081802` corn) — reads as an engraved groove, doesn't compete with the flame-flicker or corn-kernel highlights already drawn per segment.
- Placement: along the segment's existing 1px divider line region, so it uses visual space that's currently flat/empty rather than overlapping the flame or kernel detail.
- Applies to both serpents symmetrically (mirrored for left/right as the rest of the function already does).

### 2. Sun disc — glifo 4-Ollin (Piedra del Sol)

Replace the current sun disc's ray system — 4 straight cross-arm rects (`[[0,-22,4,6],[0,16,4,6],[-22,0,6,4],[16,0,6,4]]`) + 4 corner squares (`[[-14,-14],[14,-14],[14,14],[-14,14]]`) — with the Ollin (movement) glyph silhouette:

- Four notched/stepped trapezoidal "petals" radiating from the center at 90° (replacing the straight cross-arms), each petal's outer edge stepped/wavy rather than a flat rectangle end.
- Four small triangular "flint-tooth" (tecpatl) accents filling the diagonal gaps between petals (replacing the corner squares).
- The concentric-circle base (`#7a4804` outer → `#c87810` → `#f0b020` → `#ffe058` core) is unchanged — it already reads correctly as a sun disc and doesn't need touching.

### Out of scope

- The "chicomecoatl" naming/attribution question (raised during brainstorming, not part of Approach A).
- Pyramid of the Sun (top, between the heads) — untouched.
- Offering hands (bottom, flanking the sun disc) — untouched.
- Any other screen (mode select, god pick, fight, win) — this spec is title-screen-border only.

## Testing

Visual-only canvas change, no new state or logic branches. Verification is manual: load the title screen (`python3 -m http.server 8765 --directory /Users/yeiyies/pixel-agents`, or `?autoplay=1` if a quicker path to title is wanted) and confirm:

- Both serpent bodies show a continuous zigzag groove running their length, without obscuring existing flame/kernel/plume detail.
- The sun disc reads clearly as the 4-Ollin motif (four stepped petals + four corner teeth) at the game's native 800×480 pixel-art scale, not just as a blur of extra pixels.
- `Math.round()` discipline maintained on all new coordinates (project-wide pixel-art rule).
