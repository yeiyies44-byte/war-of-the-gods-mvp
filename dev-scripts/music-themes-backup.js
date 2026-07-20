// ── War of the Gods — Music Themes Backup ──────────────────
// Estado original antes de integrar audio de ElevenLabs.
// Si el nuevo audio no funciona, restaura este bloque en war-of-the-gods-mvp.html
// (líneas 1496–1546, reemplaza todo el bloque const THEMES = { ... })

// ── Themes – Mexica ceremonial chiptune ────────────────────
const THEMES = {
  // "Temple at Dawn" – solemn, slow descent
  title: {
    bpm: 58,
    mel: ['D4','_','_','_', 'C4','_','_','_', 'A3','_','G3','_', 'F3','_','D3','_'],
    bas: ['D3','_','_','_', '_', '_','_','_',  'A2','_','_','_', 'D3','_','_','_'],
    drm: [1,0,0,0,           0,0,0,0,           1,0,0,0,          0,0,0,0],
    tep: [0,0,1,0,           0,1,0,0,           0,0,1,0,          0,1,0,0],
    shk: [0,0,0,1,           0,0,1,0,           0,0,0,1,          0,0,1,0],
    con: [1,0,0,0,           0,0,0,0,           0,0,0,0,          0,0,0,0],
  },
  // "Choosing Your Deity" – contemplative, flowing pentatonic
  select: {
    bpm: 90,
    mel: ['D4','_','F4','_', 'G4','_','A4','_', 'G4','F4','D4','_', 'C4','A3','_','_'],
    bas: ['D3','_','_','_',  'A2','_','_','_',   'G2','_','_','_',   'A2','_','_','_'],
    drm: [1,0,0,0,           1,0,0,0,            1,0,0,0,            1,0,0,0],
    tep: [0,0,1,0,           0,0,1,0,            0,1,0,1,            0,0,1,0],
    shk: [1,0,1,0,           1,0,1,0,            1,0,1,0,            1,0,1,0],
    con: [1,0,0,0,           0,0,0,0,            1,0,0,0,            0,0,0,0],
  },
  // "Smoke and Obsidian" – Humoformic Mysticism: ancestral + digital fusion
  // BPM 105 — ceremonial pulse, breath between notes, glitch artifacts
  fight: {
    bpm: 105,
    echo:  true,   // ghost echo trail on melody
    glitch:true,   // subtle digital artifact layer
    mel: ['D4','_','_','F4', '_','_','A4','_', 'G4','_','_','_', 'F4','_','D4','_'],
    bas: ['D3','_','_','_',  'A2','_','_','_', 'G2','_','_','A2','D3','_','_','_'],
    drm: [1,0,0,0,           0,1,0,0,          1,0,0,0,           0,0,1,0],
    tep: [0,0,1,0,           0,0,0,1,          0,1,0,0,           0,0,0,1],
    shk: [1,0,1,0,           1,0,1,0,          1,0,1,0,           1,0,1,0],
    con: [1,0,0,0,           0,0,0,0,          0,0,1,0,           0,0,0,0],
  },
  // "Legend Written" — credits: slow triumphal ascent, deep reverb
  credits: {
    bpm: 52,
    echo: true,
    glitch: false,
    mel: ['D4','_','_','_', 'F4','_','_','_', 'A4','_','_','_', 'G4','_','F4','_',
          'D5','_','_','_', 'A4','_','_','_', 'G4','_','D4','_', '_','_','_','_'],
    bas: ['D3','_','_','_', 'A2','_','_','_', 'D3','_','_','_', 'G2','_','_','_',
          'D3','_','_','_', 'A2','_','_','_', 'G2','_','D3','_', '_','_','_','_'],
    drm: [1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    tep: [0,0,1,0, 0,1,0,0, 0,0,1,0, 0,1,0,0, 0,0,1,0, 0,1,0,0, 0,0,0,1, 0,0,1,0],
    shk: [1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0, 1,0,0,1, 0,0,1,0],
    con: [1,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
  },
};
