import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  HelpCircle,
  Shuffle,
  Trophy,
  Sparkles,
  Palette,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  Unlock,
  AlertCircle,
  X,
  CheckCircle2,
  Info,
  Sliders
} from 'lucide-react';
import {
  LAYOUTS,
  MAHJONG_THEMES,
  doTilesMatch,
  isTileFree,
  generateSolvableBoard
} from './mahjongData';
import { MahjongTile } from './MahjongTile';
import { useAuth } from '../../../context/AuthContext';
import {
  playClickSound,
  playWinSound,
  playTileClackSound,
  playBlockedSound,
  playMatchSound
} from '../../../utils/audio';

export const MahjongSolitaire = () => {
  const { user, recordMahjongStats, updateSettings } = useAuth();

  // Selected layout & visual theme
  const [selectedLayoutKey, setSelectedLayoutKey] = useState('turtle');
  const [selectedThemeKey, setSelectedThemeKey] = useState(
    user?.settings?.mahjongTheme || 'classic-parchment'
  );

  // Active game state
  const [tiles, setTiles] = useState([]);
  const [selectedTile, setSelectedTile] = useState(null);
  const [hintTiles, setHintTiles] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [shakingTileId, setShakingTileId] = useState(null);
  const [blockedNotice, setBlockedNotice] = useState(null);

  // Stats and counters
  const [movesCount, setMovesCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [shufflesUsed, setShufflesUsed] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // User preferences & visual settings
  const [zoom, setZoom] = useState(1.0); // 0.8 to 1.35
  const [dimBlocked, setDimBlocked] = useState(true);
  const [highlightMatches, setHighlightMatches] = useState(true);
  const [viewPerspective, setViewPerspective] = useState('classic'); // 'classic' | 'angled'

  // Modals & alerts
  const [noMovesNotice, setNoMovesNotice] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Initialize or restart board
  useEffect(() => {
    initNewGame(selectedLayoutKey);
  }, [selectedLayoutKey]);

  // Timer interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && !isGameOver) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isGameOver]);

  const initNewGame = (layoutKey) => {
    const solvableTiles = generateSolvableBoard(layoutKey);
    setTiles(solvableTiles);
    setSelectedTile(null);
    setHintTiles([]);
    setUndoStack([]);
    setMovesCount(0);
    setHintsUsed(0);
    setShufflesUsed(0);
    setSecondsElapsed(0);
    setIsGameOver(false);
    setIsTimerRunning(true);
    setNoMovesNotice(false);
    setBlockedNotice(null);
  };

  // Find all available matching pairs of free tiles
  const findAvailablePairs = (currentTiles) => {
    const free = currentTiles.filter((t) => isTileFree(t, currentTiles));
    const pairs = [];
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        if (doTilesMatch(free[i], free[j])) {
          pairs.push([free[i], free[j]]);
        }
      }
    }
    return pairs;
  };

  // User clicked a tile
  const handleTileClick = (tile) => {
    if (isGameOver) return;

    const free = isTileFree(tile, tiles);

    // CASE 1: Tile is blocked / locked
    if (!free) {
      playBlockedSound();
      setShakingTileId(tile.instanceId);
      setTimeout(() => setShakingTileId(null), 350);

      if (selectedTile && doTilesMatch(selectedTile, tile)) {
        setBlockedNotice(
          `⚠️ "${tile.label}" matches your selected tile, but it's LOCKED! Clear the tiles blocking its left/right side or resting above it first.`
        );
      } else {
        setBlockedNotice(
          `🔒 "${tile.label}" is LOCKED! A tile is playable only when its left or right side is open and no tile covers it from above.`
        );
      }

      // Auto-dismiss notice after 4 seconds
      setTimeout(() => setBlockedNotice(null), 4000);
      return;
    }

    // CASE 2: Tile is free & playable!
    setBlockedNotice(null);
    setHintTiles([]);

    // First tile clicked
    if (!selectedTile) {
      playTileClackSound();
      setSelectedTile(tile);
      return;
    }

    // Deselect if clicking the same tile again
    if (selectedTile.instanceId === tile.instanceId) {
      playTileClackSound();
      setSelectedTile(null);
      return;
    }

    // Check if second clicked tile matches selected tile
    if (doTilesMatch(selectedTile, tile)) {
      playMatchSound();
      const tile1 = selectedTile;
      const tile2 = tile;

      const remainingTiles = tiles.filter(
        (t) => t.instanceId !== tile1.instanceId && t.instanceId !== tile2.instanceId
      );

      setUndoStack((prev) => [...prev, [tile1, tile2]]);
      setTiles(remainingTiles);
      setSelectedTile(null);
      setMovesCount((prev) => prev + 1);

      // Win detection
      if (remainingTiles.length === 0) {
        handleWin();
        return;
      }

      // Check if moves remain
      const nextPairs = findAvailablePairs(remainingTiles);
      if (nextPairs.length === 0) {
        setNoMovesNotice(true);
      } else {
        setNoMovesNotice(false);
      }
    } else {
      // Different free tile clicked: smoothly switch selection
      playTileClackSound();
      setSelectedTile(tile);
    }
  };

  const handleWin = () => {
    setIsGameOver(true);
    setIsTimerRunning(false);
    playWinSound();

    try {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const baseScore = 2500;
    const timeBonus = Math.max(0, 1500 - secondsElapsed * 3);
    const hintPenalty = hintsUsed * 50;
    const shufflePenalty = shufflesUsed * 100;
    const total = Math.max(200, baseScore + timeBonus - hintPenalty - shufflePenalty);
    setFinalScore(total);

    // Save to database
    recordMahjongStats({
      won: true,
      timeSpent: secondsElapsed,
      score: total,
      moves: movesCount
    });
  };

  const handleHint = () => {
    playClickSound();
    const pairs = findAvailablePairs(tiles);
    if (pairs.length > 0) {
      const [first, second] = pairs[0];
      setHintTiles([first.instanceId, second.instanceId]);
      setHintsUsed((prev) => prev + 1);
    }
  };

  const handleShuffle = () => {
    playClickSound();
    if (tiles.length <= 1) return;

    // Shuffle active tile definitions
    const activeValues = tiles.map((t) => ({
      category: t.category,
      value: t.value,
      label: t.label,
      cornerLabel: t.cornerLabel,
      symbol: t.symbol,
      color: t.color
    }));

    for (let i = activeValues.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [activeValues[i], activeValues[j]] = [activeValues[j], activeValues[i]];
    }

    const shuffled = tiles.map((t, idx) => ({
      ...t,
      ...activeValues[idx]
    }));

    setTiles(shuffled);
    setSelectedTile(null);
    setHintTiles([]);
    setShufflesUsed((prev) => prev + 1);
    setNoMovesNotice(false);
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    playClickSound();

    const lastPair = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    setTiles((prev) => [...prev, ...lastPair]);
    setSelectedTile(null);
    setHintTiles([]);
    setNoMovesNotice(false);
  };

  // Zoom controls
  const handleZoomIn = () => setZoom((prev) => Math.min(1.35, +(prev + 0.1).toFixed(2)));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.75, +(prev - 0.1).toFixed(2)));
  const handleZoomReset = () => setZoom(1.0);

  // Compute bounding box for centering the board
  const boardBounds = useMemo(() => {
    if (tiles.length === 0) return { width: 800, height: 500, minX: 0, minY: 0 };
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    tiles.forEach((t) => {
      const px = t.x * 29 + t.z * 4;
      const py = t.y * 38 - t.z * 4;
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
    });

    const w = (maxX - minX + 80) * zoom;
    const h = (maxY - minY + 100) * zoom;
    return { width: Math.max(780, w), height: Math.max(480, h), minX, minY };
  }, [tiles, zoom]);

  // Current visual theme
  const currentTheme =
    MAHJONG_THEMES[selectedThemeKey] || MAHJONG_THEMES['classic-parchment'];

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Available pairs count
  const availablePairsCount = useMemo(() => {
    return findAvailablePairs(tiles).length;
  }, [tiles]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
      {/* Top Banner: Stats & Primary Controls */}
      <div className="rounded-3xl glass-panel p-4 sm:p-6 border border-slate-200 dark:border-white/10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Mahjong Solitaire 3D
            </span>
            <span className="text-xs text-slate-500 font-medium">
              • {LAYOUTS[selectedLayoutKey]?.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
            Ancient Tile Pyramid
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Match free identical pairs. Click any green highlighted tile to pair and clear!
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
          <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-center min-w-[85px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Time
            </span>
            <div className="text-lg font-black font-mono text-cyan-500 dark:text-cyan-400">
              {formatTime(secondsElapsed)}
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-center min-w-[85px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Tiles Left
            </span>
            <div className="text-lg font-black font-mono text-slate-900 dark:text-white">
              {tiles.length}
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-center min-w-[85px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Available Pairs
            </span>
            <div className="text-lg font-black font-mono text-emerald-500 dark:text-emerald-400">
              {availablePairsCount}
            </div>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-center min-w-[85px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Cleared
            </span>
            <div className="text-lg font-black font-mono text-purple-500 dark:text-purple-400">
              {movesCount}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClickSound();
              setShowHelpModal(true);
            }}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
            title="How to Play"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Rules</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setShowThemeModal(true);
            }}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Change Theme"
          >
            <Palette className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Theme</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              initNewGame(selectedLayoutKey);
            }}
            className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-glow-cyan transition-all flex items-center gap-1.5"
            title="New Game / Restart"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Game</span>
          </button>
        </div>
      </div>

      {/* Control Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-slate-200 dark:border-white/10">
        {/* Layout Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 max-w-full">
          {Object.values(LAYOUTS).map((lay) => (
            <button
              key={lay.id}
              onClick={() => {
                playClickSound();
                setSelectedLayoutKey(lay.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedLayoutKey === lay.id
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lay.name}
            </button>
          ))}
        </div>

        {/* Game Helpers & Zoom Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Zoom controls for BIG tiles */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-white/10">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
              title="Zoom Out (Smaller tiles)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomReset}
              className="px-2 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300"
              title="Reset Tile Size"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
              title="Zoom In (Make tiles BIGGER)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dim blocked tiles toggle */}
          <button
            onClick={() => {
              playClickSound();
              setDimBlocked(!dimBlocked);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              dimBlocked
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
            title="Toggle dimming on locked tiles"
          >
            {dimBlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">Dim Locked</span>
          </button>

          {/* View angle toggle */}
          <button
            onClick={() => {
              playClickSound();
              setViewPerspective(viewPerspective === 'classic' ? 'angled' : 'classic');
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            title="Toggle 2.5D Classic Flat vs 3D Perspective"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {viewPerspective === 'classic' ? '2.5D Flat' : '3D Angled'}
            </span>
          </button>

          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo ({undoStack.length})</span>
          </button>

          {/* Hint */}
          <button
            onClick={handleHint}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-bold transition-all flex items-center gap-1 border border-amber-500/30"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>

          {/* Shuffle */}
          <button
            onClick={handleShuffle}
            className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400 hover:bg-purple-500/20 text-xs font-bold transition-all flex items-center gap-1 border border-purple-500/30"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>
      </div>

      {/* Locked / Blocked Notification Alert */}
      {blockedNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-500 dark:text-amber-400 flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span>{blockedNotice}</span>
          </div>
          <button
            onClick={() => setBlockedNotice(null)}
            className="text-amber-500 hover:text-amber-400 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* No Moves Alert */}
      {noMovesNotice && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-2.5 text-rose-500 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold">
              No matching free tiles remain on the current board!
            </span>
          </div>
          <button
            onClick={handleShuffle}
            className="px-4 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs shadow-md hover:bg-rose-600 transition-all flex items-center gap-1.5"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Remaining Tiles</span>
          </button>
        </div>
      )}

      {/* Mahjong Game Arena / Table */}
      <div
        className={`relative w-full min-h-[580px] rounded-3xl p-4 sm:p-8 border shadow-2xl overflow-auto flex items-center justify-center transition-all ${currentTheme.boardBg} ${currentTheme.boardBorder}`}
        style={currentTheme.boardStyle || {}}
      >
        {/* Subtle decorative grid/mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        {/* Board Container with calculated bounding box and perspective toggle */}
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            width: `${boardBounds.width}px`,
            height: `${boardBounds.height}px`,
            transform:
              viewPerspective === 'angled'
                ? 'perspective(1200px) rotateX(16deg) scale(0.96)'
                : 'none',
            transformStyle: 'preserve-3d'
          }}
        >
          {tiles.map((tile) => {
            const isFree = isTileFree(tile, tiles);
            const isSelected = selectedTile?.instanceId === tile.instanceId;
            const isHinted = hintTiles.includes(tile.instanceId);
            const isMatchingSelected =
              highlightMatches && selectedTile && doTilesMatch(selectedTile, tile);
            const isShaking = shakingTileId === tile.instanceId;

            return (
              <MahjongTile
                key={tile.instanceId}
                tile={tile}
                isFree={isFree}
                isSelected={isSelected}
                isHinted={isHinted}
                isMatchingSelected={isMatchingSelected}
                isShaking={isShaking}
                theme={currentTheme}
                zoom={zoom}
                dimBlocked={dimBlocked}
                onClick={() => handleTileClick(tile)}
              />
            );
          })}
        </div>
      </div>

      {/* Win Modal Dialog */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in zoom-in-95">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border border-cyan-500/40 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-400 mx-auto flex items-center justify-center">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Pyramid Cleared!
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white mt-1">
                Victory Achieved!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Every tile was paired and cleared from the ancient layout.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Time Taken</span>
                <div className="text-xl font-black font-mono text-cyan-400">
                  {formatTime(secondsElapsed)}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Score</span>
                <div className="text-xl font-black font-mono text-amber-400">
                  {finalScore} PTS
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playClickSound();
                initNewGame(selectedLayoutKey);
              }}
              className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm shadow-glow-cyan transition-all"
            >
              Play Another Game
            </button>
          </div>
        </div>
      )}

      {/* Rules / How to Play Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  How to Play Mahjong Solitaire
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  1. The Goal
                </div>
                <p>
                  Clear the entire board by finding and clicking matching pairs of identical free tiles.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Unlock className="w-4 h-4 text-cyan-400" />
                  2. What is a "Free" Tile?
                </div>
                <p>
                  A tile is free (playable) if:
                  <br />• Its <strong>left or right side</strong> is completely open (not sandwiched between other tiles).
                  <br />• <strong>No tile is resting on top</strong> of it.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  3. Special Matches
                </div>
                <p>
                  • <strong>Seasons (春, 夏, 秋, 冬):</strong> Any season matches any other season!
                  <br />• <strong>Flowers (梅, 蘭, 菊, 竹):</strong> Any flower matches any other flower!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  4. Helper Tools
                </div>
                <p>
                  • <strong>Zoom (+ / -):</strong> Make the tiles as big as you want!
                  <br />• <strong>Hint:</strong> Highlights an available matching pair.
                  <br />• <strong>Shuffle:</strong> Re-orders remaining tiles if you are stuck.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs transition-colors"
            >
              Got it, Let's Play!
            </button>
          </div>
        </div>
      )}

      {/* Theme Picker Modal */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel p-6 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl">
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white mb-4">
              Select Mahjong Visual Theme
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {Object.values(MAHJONG_THEMES).map((thm) => {
                const isSelected = selectedThemeKey === thm.id;
                return (
                  <button
                    key={thm.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedThemeKey(thm.id);
                      updateSettings({ mahjongTheme: thm.id });
                    }}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                      isSelected
                        ? 'border-cyan-400 ring-2 ring-cyan-400 shadow-glow-cyan bg-cyan-500/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-slate-100/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {thm.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{thm.tag}</div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-cyan-400 self-end">
                        Active
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowThemeModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
