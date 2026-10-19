import React from 'react';
import { SUIT_TYPES } from './mahjongData';
import { Lock } from 'lucide-react';

/**
 * Visual rendering for a single Mahjong Solitaire Tile
 * Includes authentic Chinese calligraphy, bamboo stalks, circle rosettes,
 * 3D beveled thickness, and unmistakable selection feedback (vibrant green).
 */
export const MahjongTile = ({
  tile,
  isFree,
  isSelected,
  isHinted,
  isMatchingSelected,
  isShaking,
  theme,
  zoom = 1.0,
  dimBlocked = true,
  onClick
}) => {
  // Tile dimensions scaled by zoom
  const baseW = 58;
  const baseH = 76;
  const tileW = Math.round(baseW * zoom);
  const tileH = Math.round(baseH * zoom);

  // Position on board
  const posX = Math.round((tile.x * 29 + tile.z * 4) * zoom);
  const posY = Math.round((tile.y * 38 - tile.z * 4) * zoom);
  const zElevation = tile.z * 10;

  // 3D Bevel and Layer Shadows
  const sideColor = theme?.tileSide || '#8c5826';
  const shadowDepth = Math.max(3, tile.z * 3 + 4);

  // Determine face background & border
  let faceClasses = '';
  let customStyle = {};

  if (isSelected) {
    // Vibrant lime green face matching reference image!
    faceClasses = 'bg-gradient-to-b from-[#8ce358] to-[#6ecb42] text-slate-950 border-2 border-[#3ea318] ring-4 ring-green-400 ring-offset-2 ring-offset-slate-900 shadow-[0_0_20px_rgba(110,203,66,0.8)] -translate-y-2 scale-105 z-40';
  } else if (isHinted) {
    faceClasses = 'bg-gradient-to-b from-amber-100 to-amber-200 text-slate-950 border-2 border-amber-500 ring-4 ring-amber-400 shadow-glow-yellow animate-bounce z-30';
  } else if (isMatchingSelected && isFree) {
    faceClasses = `${theme.tileFace} ring-4 ring-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.7)] animate-match-glow z-20`;
  } else if (isFree) {
    faceClasses = `${theme.tileFace} ${theme.tileHover} hover:-translate-y-1 hover:brightness-105 cursor-pointer`;
  } else {
    // Blocked tile
    faceClasses = `${theme.tileFace} ${
      dimBlocked ? 'opacity-65 filter contrast-90 cursor-not-allowed' : 'cursor-not-allowed'
    }`;
  }

  // Render tile artwork based on category
  const renderTileContent = () => {
    switch (tile.category) {
      case SUIT_TYPES.WAN: {
        // Characters (Wan 1-9): Chinese numeral on top, 萬 on bottom
        const chineseNums = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        const numChar = chineseNums[tile.value] || tile.value;
        return (
          <div className="flex flex-col items-center justify-center leading-none select-none my-auto">
            <span
              className={`text-lg sm:text-xl font-black font-display tracking-tight ${
                isSelected ? 'text-slate-950' : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {numChar}
            </span>
            <span
              className={`text-base sm:text-lg font-black font-display -mt-0.5 ${
                isSelected ? 'text-red-900' : 'text-red-600 dark:text-red-500'
              }`}
            >
              萬
            </span>
          </div>
        );
      }

      case SUIT_TYPES.BAMBOO: {
        // 1 Bamboo: Sparrow bird
        if (tile.value === 1) {
          return (
            <div className="flex flex-col items-center justify-center select-none my-auto">
              <span className="text-2xl sm:text-3xl leading-none">🀐</span>
              <span
                className={`text-[9px] font-bold uppercase tracking-wider ${
                  isSelected ? 'text-slate-900' : 'text-emerald-700 dark:text-emerald-400'
                }`}
              >
                Bird
              </span>
            </div>
          );
        }
        // 2-9 Bamboo: Stalks representation
        return (
          <div className="flex flex-col items-center justify-center select-none my-auto">
            <span
              className={`text-2xl sm:text-3xl leading-none font-bold ${
                isSelected ? 'text-slate-950' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {tile.symbol}
            </span>
            <span
              className={`text-[9px] font-bold -mt-0.5 ${
                isSelected ? 'text-slate-900' : 'text-emerald-700 dark:text-emerald-400'
              }`}
            >
              {tile.value} Bam
            </span>
          </div>
        );
      }

      case SUIT_TYPES.DOT: {
        // Dots / Circles: Large circle or pattern
        return (
          <div className="flex flex-col items-center justify-center select-none my-auto">
            <span
              className={`text-2xl sm:text-3xl leading-none ${
                isSelected ? 'text-slate-950' : 'text-sky-600 dark:text-sky-400'
              }`}
            >
              {tile.symbol}
            </span>
            <span
              className={`text-[9px] font-bold -mt-0.5 ${
                isSelected ? 'text-slate-900' : 'text-sky-700 dark:text-sky-400'
              }`}
            >
              {tile.value} Dot
            </span>
          </div>
        );
      }

      case SUIT_TYPES.WIND: {
        // Winds: 東 南 西 北
        const windNames = { E: 'East', S: 'South', W: 'West', N: 'North' };
        return (
          <div className="flex flex-col items-center justify-center select-none my-auto">
            <span
              className={`text-2xl sm:text-3xl font-black font-display leading-tight ${
                isSelected ? 'text-slate-950' : 'text-blue-600 dark:text-blue-400'
              }`}
            >
              {tile.symbol}
            </span>
            <span
              className={`text-[9px] font-bold ${
                isSelected ? 'text-slate-900' : 'text-blue-700 dark:text-blue-400'
              }`}
            >
              {windNames[tile.value] || tile.value}
            </span>
          </div>
        );
      }

      case SUIT_TYPES.DRAGON: {
        // Dragons: Red 中, Green 發, White 白
        return (
          <div className="flex flex-col items-center justify-center select-none my-auto">
            <span
              className="text-2xl sm:text-3xl font-black font-display leading-tight"
              style={{ color: isSelected ? '#000000' : tile.color }}
            >
              {tile.symbol}
            </span>
            <span
              className="text-[9px] font-bold"
              style={{ color: isSelected ? '#1e293b' : tile.color }}
            >
              {tile.value === 'red' ? 'Red' : tile.value === 'green' ? 'Green' : 'White'}
            </span>
          </div>
        );
      }

      case SUIT_TYPES.SEASON:
      case SUIT_TYPES.FLOWER: {
        // Seasons & Flowers: Colorful icon and character
        return (
          <div className="flex flex-col items-center justify-center select-none my-auto">
            <span className="text-2xl sm:text-3xl leading-none filter drop-shadow-sm">
              {tile.symbol}
            </span>
            <span
              className={`text-[10px] font-black font-display mt-0.5 ${
                isSelected ? 'text-slate-950' : 'text-pink-600 dark:text-pink-400'
              }`}
            >
              {tile.label}
            </span>
          </div>
        );
      }

      default:
        return (
          <span className="text-xl font-bold">{tile.symbol}</span>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`absolute rounded-xl flex flex-col justify-between p-1 select-none transition-all duration-150 ${faceClasses} ${
        isShaking ? 'animate-tile-shake' : ''
      }`}
      style={{
        width: `${tileW}px`,
        height: `${tileH}px`,
        left: `${posX}px`,
        top: `${posY}px`,
        zIndex: isSelected ? 100 : tile.z * 10 + tile.y,
        boxShadow: isSelected
          ? `0 0 25px rgba(74, 222, 128, 0.9), 0 8px 16px rgba(0,0,0,0.4)`
          : `
              1px 1px 0px ${sideColor},
              2px 2px 0px ${sideColor},
              3px 3px 0px ${sideColor},
              3px ${shadowDepth}px 8px rgba(0,0,0,${0.3 + tile.z * 0.08}),
              inset 0 1px 1px rgba(255,255,255,0.7),
              inset 0 -1px 1px rgba(0,0,0,0.1)
            `,
        ...customStyle
      }}
      title={`${tile.label} (${isFree ? 'Playable / Free' : 'Locked / Blocked'})`}
    >
      {/* Top Header: Corner Index & Status */}
      <div className="flex items-center justify-between w-full px-1">
        <span
          className={`text-[11px] font-black font-mono leading-none ${
            isSelected
              ? 'text-slate-950 font-black'
              : tile.category === SUIT_TYPES.WAN
              ? 'text-red-600 dark:text-red-400'
              : tile.category === SUIT_TYPES.BAMBOO
              ? 'text-emerald-600 dark:text-emerald-400'
              : tile.category === SUIT_TYPES.DOT
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-purple-600 dark:text-purple-400'
          }`}
        >
          {tile.cornerLabel || tile.value}
        </span>

        {/* Small lock indicator for blocked tiles when enabled */}
        {!isFree && dimBlocked && (
          <Lock className="w-2.5 h-2.5 text-slate-400/80 dark:text-slate-500" />
        )}
      </div>

      {/* Main Tile Center Content */}
      {renderTileContent()}

      {/* Bottom Subtitle / Category Label */}
      <div className="w-full text-center px-0.5">
        <span
          className={`text-[8px] font-bold tracking-tight uppercase truncate block ${
            isSelected
              ? 'text-slate-900 font-extrabold'
              : 'text-slate-500/90 dark:text-slate-400'
          }`}
        >
          {tile.label}
        </span>
      </div>
    </div>
  );
};
