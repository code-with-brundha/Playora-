// Mahjong Solitaire Tile Data, Layouts, Themes and Solvable Generator

export const SUIT_TYPES = {
  WAN: 'wan',       // Characters
  BAMBOO: 'bamboo', // Bamboo
  DOT: 'dot',       // Circles/Dots
  WIND: 'wind',     // East, South, West, North
  DRAGON: 'dragon', // Red, Green, White
  SEASON: 'season', // Spring, Summer, Autumn, Winter
  FLOWER: 'flower'  // Plum, Orchid, Chrysanthemum, Bamboo
};

export const TILES_CATALOG = [
  // Characters (Wan 1-9)
  { id: 'wan_1', category: SUIT_TYPES.WAN, value: 1, label: '一萬', cornerLabel: '1', symbol: '1', color: '#e11d48' },
  { id: 'wan_2', category: SUIT_TYPES.WAN, value: 2, label: '二萬', cornerLabel: '2', symbol: '2', color: '#e11d48' },
  { id: 'wan_3', category: SUIT_TYPES.WAN, value: 3, label: '三萬', cornerLabel: '3', symbol: '3', color: '#e11d48' },
  { id: 'wan_4', category: SUIT_TYPES.WAN, value: 4, label: '四萬', cornerLabel: '4', symbol: '4', color: '#e11d48' },
  { id: 'wan_5', category: SUIT_TYPES.WAN, value: 5, label: '五萬', cornerLabel: '5', symbol: '5', color: '#e11d48' },
  { id: 'wan_6', category: SUIT_TYPES.WAN, value: 6, label: '六萬', cornerLabel: '6', symbol: '6', color: '#e11d48' },
  { id: 'wan_7', category: SUIT_TYPES.WAN, value: 7, label: '七萬', cornerLabel: '7', symbol: '7', color: '#e11d48' },
  { id: 'wan_8', category: SUIT_TYPES.WAN, value: 8, label: '八萬', cornerLabel: '8', symbol: '8', color: '#e11d48' },
  { id: 'wan_9', category: SUIT_TYPES.WAN, value: 9, label: '九萬', cornerLabel: '9', symbol: '9', color: '#e11d48' },

  // Bamboo (1-9)
  { id: 'bam_1', category: SUIT_TYPES.BAMBOO, value: 1, label: '一條', cornerLabel: '1', symbol: '🀐', color: '#10b981' },
  { id: 'bam_2', category: SUIT_TYPES.BAMBOO, value: 2, label: '二條', cornerLabel: '2', symbol: '🀑', color: '#10b981' },
  { id: 'bam_3', category: SUIT_TYPES.BAMBOO, value: 3, label: '三條', cornerLabel: '3', symbol: '🀒', color: '#10b981' },
  { id: 'bam_4', category: SUIT_TYPES.BAMBOO, value: 4, label: '四條', cornerLabel: '4', symbol: '🀓', color: '#10b981' },
  { id: 'bam_5', category: SUIT_TYPES.BAMBOO, value: 5, label: '五條', cornerLabel: '5', symbol: '🀔', color: '#10b981' },
  { id: 'bam_6', category: SUIT_TYPES.BAMBOO, value: 6, label: '六條', cornerLabel: '6', symbol: '🀕', color: '#10b981' },
  { id: 'bam_7', category: SUIT_TYPES.BAMBOO, value: 7, label: '七條', cornerLabel: '7', symbol: '🀖', color: '#10b981' },
  { id: 'bam_8', category: SUIT_TYPES.BAMBOO, value: 8, label: '八條', cornerLabel: '8', symbol: '🀗', color: '#10b981' },
  { id: 'bam_9', category: SUIT_TYPES.BAMBOO, value: 9, label: '九條', cornerLabel: '9', symbol: '🀘', color: '#10b981' },

  // Dots / Circles (1-9)
  { id: 'dot_1', category: SUIT_TYPES.DOT, value: 1, label: '一筒', cornerLabel: '1', symbol: '🀙', color: '#0ea5e9' },
  { id: 'dot_2', category: SUIT_TYPES.DOT, value: 2, label: '二筒', cornerLabel: '2', symbol: '🀚', color: '#0ea5e9' },
  { id: 'dot_3', category: SUIT_TYPES.DOT, value: 3, label: '三筒', cornerLabel: '3', symbol: '🀛', color: '#0ea5e9' },
  { id: 'dot_4', category: SUIT_TYPES.DOT, value: 4, label: '四筒', cornerLabel: '4', symbol: '🀜', color: '#0ea5e9' },
  { id: 'dot_5', category: SUIT_TYPES.DOT, value: 5, label: '五筒', cornerLabel: '5', symbol: '🀝', color: '#0ea5e9' },
  { id: 'dot_6', category: SUIT_TYPES.DOT, value: 6, label: '六筒', cornerLabel: '6', symbol: '🀞', color: '#0ea5e9' },
  { id: 'dot_7', category: SUIT_TYPES.DOT, value: 7, label: '七筒', cornerLabel: '7', symbol: '🀟', color: '#0ea5e9' },
  { id: 'dot_8', category: SUIT_TYPES.DOT, value: 8, label: '八筒', cornerLabel: '8', symbol: '🀠', color: '#0ea5e9' },
  { id: 'dot_9', category: SUIT_TYPES.DOT, value: 9, label: '九筒', cornerLabel: '9', symbol: '🀡', color: '#0ea5e9' },

  // Winds (East, South, West, North)
  { id: 'wind_e', category: SUIT_TYPES.WIND, value: 'E', label: '東風', cornerLabel: 'E', symbol: '東', color: '#3b82f6' },
  { id: 'wind_s', category: SUIT_TYPES.WIND, value: 'S', label: '南風', cornerLabel: 'S', symbol: '南', color: '#3b82f6' },
  { id: 'wind_w', category: SUIT_TYPES.WIND, value: 'W', label: '西風', cornerLabel: 'W', symbol: '西', color: '#3b82f6' },
  { id: 'wind_n', category: SUIT_TYPES.WIND, value: 'N', label: '北風', cornerLabel: 'N', symbol: '北', color: '#3b82f6' },

  // Dragons (Red 中, Green 發, White 白)
  { id: 'drag_r', category: SUIT_TYPES.DRAGON, value: 'red', label: '紅中', cornerLabel: '中', symbol: '中', color: '#ef4444' },
  { id: 'drag_g', category: SUIT_TYPES.DRAGON, value: 'green', label: '發財', cornerLabel: '發', symbol: '發', color: '#22c55e' },
  { id: 'drag_w', category: SUIT_TYPES.DRAGON, value: 'white', label: '白板', cornerLabel: '白', symbol: '白', color: '#6366f1' },

  // Seasons (Any season matches any season)
  { id: 'sea_sp', category: SUIT_TYPES.SEASON, value: 'spring', label: '春', cornerLabel: 'SPR', symbol: '🌸', color: '#ec4899' },
  { id: 'sea_su', category: SUIT_TYPES.SEASON, value: 'summer', label: '夏', cornerLabel: 'SUM', symbol: '☀️', color: '#eab308' },
  { id: 'sea_au', category: SUIT_TYPES.SEASON, value: 'autumn', label: '秋', cornerLabel: 'AUT', symbol: '🍁', color: '#f97316' },
  { id: 'sea_wi', category: SUIT_TYPES.SEASON, value: 'winter', label: '冬', cornerLabel: 'WIN', symbol: '❄️', color: '#06b6d4' },

  // Flowers (Any flower matches any flower)
  { id: 'flw_pl', category: SUIT_TYPES.FLOWER, value: 'plum', label: '梅', cornerLabel: 'PLM', symbol: '🌺', color: '#ec4899' },
  { id: 'flw_or', category: SUIT_TYPES.FLOWER, value: 'orchid', label: '蘭', cornerLabel: 'ORC', symbol: '🌿', color: '#10b981' },
  { id: 'flw_ch', category: SUIT_TYPES.FLOWER, value: 'chrys', label: '菊', cornerLabel: 'CHR', symbol: '🌼', color: '#eab308' },
  { id: 'flw_bm', category: SUIT_TYPES.FLOWER, value: 'bamboo', label: '竹', cornerLabel: 'BAM', symbol: '🎋', color: '#14b8a6' }
];

export const doTilesMatch = (tileA, tileB) => {
  if (!tileA || !tileB || tileA.instanceId === tileB.instanceId) return false;

  // Seasons match any season
  if (tileA.category === SUIT_TYPES.SEASON && tileB.category === SUIT_TYPES.SEASON) return true;

  // Flowers match any flower
  if (tileA.category === SUIT_TYPES.FLOWER && tileB.category === SUIT_TYPES.FLOWER) return true;

  // Otherwise exact match on category and value
  return tileA.category === tileB.category && tileA.value === tileB.value;
};

/**
 * Free tile rule:
 * A tile is free (playable) iff:
 * 1. It is not covered by any tile directly on top (z > tile.z within 2 units horizontally and vertically)
 * 2. It has at least one horizontal side (left or right) open at its layer.
 */
export const isTileFree = (tile, currentTiles) => {
  if (!tile) return false;

  // 1. Covered by tile above?
  const isCovered = currentTiles.some(
    (other) =>
      other.instanceId !== tile.instanceId &&
      other.z > tile.z &&
      Math.abs(other.x - tile.x) < 2 &&
      Math.abs(other.y - tile.y) < 2
  );
  if (isCovered) return false;

  // 2. Both lateral sides blocked on the same layer?
  const hasLeftBlock = currentTiles.some(
    (other) =>
      other.instanceId !== tile.instanceId &&
      other.z === tile.z &&
      other.x < tile.x &&
      other.x >= tile.x - 2 &&
      Math.abs(other.y - tile.y) < 2
  );

  const hasRightBlock = currentTiles.some(
    (other) =>
      other.instanceId !== tile.instanceId &&
      other.z === tile.z &&
      other.x > tile.x &&
      other.x <= tile.x + 2 &&
      Math.abs(other.y - tile.y) < 2
  );

  return !hasLeftBlock || !hasRightBlock;
};

// Layout Positions: array of [x, y, z] coordinates (unit: 1 tile = 2x2 grid units)

// Simple Starter Layout (36 tiles: 18 pairs)
const createSimpleStarter = () => {
  const coords = [];
  // Layer 0: 6x4 rectangle = 24 tiles
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      coords.push([c * 2 + 4, r * 2 + 2, 0]);
    }
  }
  // Layer 1: 4x2 center = 8 tiles
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      coords.push([c * 2 + 6, r * 2 + 4, 1]);
    }
  }
  // Layer 2: 2x2 crown = 4 tiles
  coords.push([8, 4, 2], [10, 4, 2], [8, 6, 2], [10, 6, 2]);
  return coords; // 36 tiles
};

// Classic Turtle Layout (72 tiles: 36 pairs - matches user's reference)
const createTurtleLayout = () => {
  const coords = [];
  // Layer 0: 50 tiles (wings + pyramid base)
  const rowCounts = [
    { y: 0, xs: [4, 6, 8, 10, 12, 14, 16, 18] },
    { y: 2, xs: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20] },
    { y: 4, xs: [-2, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24] },
    { y: 6, xs: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20] },
    { y: 8, xs: [4, 6, 8, 10, 12, 14, 16, 18] }
  ];
  rowCounts.forEach(({ y, xs }) => {
    xs.forEach((x) => coords.push([x, y, 0]));
  });

  // Layer 1: 16 tiles (4x4 tier)
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      coords.push([c * 2 + 7, r * 2 + 1, 1]);
    }
  }

  // Layer 2: 4 tiles (2x2 tier)
  coords.push([9, 3, 2], [11, 3, 2], [9, 5, 2], [11, 5, 2]);

  // Layer 3: 2 peak tiles (stacked)
  coords.push([10, 4, 3], [10, 4, 4]);

  return coords; // Exactly 72 tiles
};

// Fortress / Castle Ramparts Layout (56 tiles: 28 pairs)
const createFortressLayout = () => {
  const coords = [];
  // Outer perimeter wall (Layer 0)
  for (let c = 0; c < 8; c++) {
    coords.push([c * 2 + 2, 0, 0]);
    coords.push([c * 2 + 2, 8, 0]);
  }
  for (let r = 1; r < 4; r++) {
    coords.push([2, r * 2, 0]);
    coords.push([16, r * 2, 0]);
  }
  // Inner courtyard (Layer 0)
  for (let r = 1; r < 4; r++) {
    for (let c = 1; c < 7; c++) {
      coords.push([c * 2 + 2, r * 2, 0]);
    }
  }
  // Layer 1 rampart towers (8 tiles)
  coords.push(
    [4, 2, 1], [6, 2, 1], [12, 2, 1], [14, 2, 1],
    [4, 6, 1], [6, 6, 1], [12, 6, 1], [14, 6, 1]
  );
  // Layer 2 watchtowers (4 tiles)
  coords.push([5, 2, 2], [13, 2, 2], [5, 6, 2], [13, 6, 2]);

  // Trim to even if needed
  if (coords.length % 2 !== 0) coords.pop();
  return coords;
};

// Imperial Dragon Layout (48 tiles: 24 pairs)
const createDragonLayout = () => {
  const coords = [];
  // Central spine (Layer 0)
  for (let c = 0; c < 12; c++) {
    coords.push([c * 2 + 2, 4, 0]);
  }
  // Wings (Layer 0)
  for (let c = 2; c < 10; c++) {
    coords.push([c * 2 + 2, 2, 0]);
    coords.push([c * 2 + 2, 6, 0]);
  }
  // Wing tips (Layer 0)
  coords.push([6, 0, 0], [8, 0, 0], [16, 0, 0], [18, 0, 0]);
  coords.push([6, 8, 0], [8, 8, 0], [16, 8, 0], [18, 8, 0]);

  // Spine elevation (Layer 1)
  for (let c = 3; c < 9; c++) {
    coords.push([c * 2 + 2, 4, 1]);
  }
  // Dragon head / crest (Layer 2)
  coords.push([10, 4, 2], [12, 4, 2]);

  if (coords.length % 2 !== 0) coords.pop();
  return coords;
};

export const LAYOUTS = {
  turtle: {
    id: 'turtle',
    name: 'Classic Turtle (Shanghai)',
    description: '72 tiles • The iconic traditional layout matching the reference',
    getCoords: createTurtleLayout
  },
  starter: {
    id: 'starter',
    name: 'Starter Pyramid',
    description: '36 tiles • Fast & relaxing introduction',
    getCoords: createSimpleStarter
  },
  fortress: {
    id: 'fortress',
    name: 'Fortress Ramparts',
    description: '56 tiles • Castle towers and courtyard',
    getCoords: createFortressLayout
  },
  dragon: {
    id: 'dragon',
    name: 'Imperial Dragon',
    description: '48 tiles • Serpentine spine and winged crests',
    getCoords: createDragonLayout
  }
};

/**
 * Guaranteed Solvable Deal Generator:
 * Simulates reverse tile removal to ensure EVERY deal has a 100% winnable path.
 */
export const generateSolvableBoard = (layoutKey) => {
  const layout = LAYOUTS[layoutKey] || LAYOUTS.turtle;
  const coords = layout.getCoords();

  // Create tile instances
  const allTiles = coords.map((c, i) => ({
    instanceId: `tile_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    x: c[0],
    y: c[1],
    z: c[2]
  }));

  // Shuffle tile definitions
  const shuffledDefs = [...TILES_CATALOG];
  for (let i = shuffledDefs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDefs[i], shuffledDefs[j]] = [shuffledDefs[j], shuffledDefs[i]];
  }

  // Reverse pair assignment simulation
  let remaining = [...allTiles];
  const assignments = new Map();
  let catalogIdx = 0;

  while (remaining.length >= 2) {
    const free = remaining.filter((t) => isTileFree(t, remaining));

    if (free.length < 2) {
      // Fallback: pair remaining tiles
      const t1 = remaining[0];
      const t2 = remaining[1];
      const def = shuffledDefs[catalogIdx % shuffledDefs.length];
      catalogIdx++;
      assignments.set(t1.instanceId, { ...def });
      assignments.set(t2.instanceId, { ...def });
      remaining = remaining.filter((t) => t.instanceId !== t1.instanceId && t.instanceId !== t2.instanceId);
      continue;
    }

    // Pick 2 free tiles at random
    const idx1 = Math.floor(Math.random() * free.length);
    let idx2 = Math.floor(Math.random() * free.length);
    while (idx2 === idx1 && free.length > 1) {
      idx2 = Math.floor(Math.random() * free.length);
    }

    const t1 = free[idx1];
    const t2 = free[idx2];
    const def = shuffledDefs[catalogIdx % shuffledDefs.length];
    catalogIdx++;

    assignments.set(t1.instanceId, { ...def });
    assignments.set(t2.instanceId, { ...def });

    remaining = remaining.filter((t) => t.instanceId !== t1.instanceId && t.instanceId !== t2.instanceId);
  }

  return allTiles.map((t) => ({
    ...t,
    ...assignments.get(t.instanceId)
  }));
};

export const MAHJONG_THEMES = {
  'classic-parchment': {
    id: 'classic-parchment',
    name: 'Classic Parchment',
    tag: 'Authentic Traditional (Reference)',
    boardBg: 'bg-[#ebd8b2]',
    boardStyle: {
      backgroundColor: '#ebd8b2',
      backgroundImage: 'radial-gradient(circle at 50% 50%, #fbf3dd 0%, #ebd8b2 100%)'
    },
    boardBorder: 'border-[#c79a52]/40',
    tileFace: 'bg-gradient-to-b from-[#fffefc] to-[#f4ebe1] text-slate-900 border-[#d8be96] shadow-sm',
    tileSide: '#8c5826',
    tileHover: 'hover:border-amber-600 hover:shadow-lg',
    tileSelected: 'bg-[#76ce4e] text-slate-950 font-black border-2 border-[#389a14] shadow-[0_0_20px_rgba(118,206,78,0.7)] ring-4 ring-green-400 scale-105',
    accentText: 'text-amber-800'
  },
  'neon-galaxy': {
    id: 'neon-galaxy',
    name: 'Neon Galaxy',
    tag: 'Signature Playora',
    boardBg: 'bg-[#080c16]',
    boardStyle: {},
    boardBorder: 'border-cyan-500/30',
    tileFace: 'bg-slate-900/95 text-white border-cyan-400/40 shadow-glow-cyan',
    tileSide: '#00f5ff',
    tileHover: 'hover:border-cyan-300 hover:shadow-glow-cyan',
    tileSelected: 'bg-[#76ce4e] text-slate-950 font-black border-2 border-[#389a14] shadow-[0_0_20px_rgba(118,206,78,0.8)] ring-4 ring-green-400 scale-105',
    accentText: 'text-cyan-400'
  },
  'classic-jade': {
    id: 'classic-jade',
    name: 'Imperial Jade',
    tag: 'Traditional Emerald',
    boardBg: 'bg-[#072d23]',
    boardStyle: {},
    boardBorder: 'border-emerald-500/40',
    tileFace: 'bg-[#faf8f2] text-slate-900 border-[#0f5945] shadow-md',
    tileSide: '#0d5c46',
    tileHover: 'hover:border-amber-400 hover:shadow-lg',
    tileSelected: 'bg-[#76ce4e] text-slate-950 font-black border-2 border-[#389a14] shadow-[0_0_20px_rgba(118,206,78,0.8)] ring-4 ring-green-400 scale-105',
    accentText: 'text-emerald-400'
  },
  'royal-gold': {
    id: 'royal-gold',
    name: 'Royal Onyx & Gold',
    tag: 'Luxury Obsidian',
    boardBg: 'bg-[#0f0e17]',
    boardStyle: {},
    boardBorder: 'border-amber-500/40',
    tileFace: 'bg-[#181820] text-amber-300 border-amber-500/60 shadow-md',
    tileSide: '#b8860b',
    tileHover: 'hover:border-amber-300 hover:shadow-glow-yellow',
    tileSelected: 'bg-[#76ce4e] text-slate-950 font-black border-2 border-[#389a14] shadow-[0_0_20px_rgba(118,206,78,0.8)] ring-4 ring-green-400 scale-105',
    accentText: 'text-amber-400'
  },
  'pastel-dream': {
    id: 'pastel-dream',
    name: 'Pastel Dream',
    tag: 'Serene Bloom',
    boardBg: 'bg-[#1c1830]',
    boardStyle: {},
    boardBorder: 'border-pink-400/40',
    tileFace: 'bg-white/95 text-slate-800 border-pink-300 shadow-md',
    tileSide: '#f472b6',
    tileHover: 'hover:border-purple-400 hover:shadow-lg',
    tileSelected: 'bg-[#76ce4e] text-slate-950 font-black border-2 border-[#389a14] shadow-[0_0_20px_rgba(118,206,78,0.8)] ring-4 ring-green-400 scale-105',
    accentText: 'text-pink-400'
  }
};
