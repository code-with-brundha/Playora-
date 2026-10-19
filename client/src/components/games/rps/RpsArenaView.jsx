import React from 'react';
import { Sparkles, Zap, Shield, Swords } from 'lucide-react';

/**
 * 3D Cyber Arena View for Rock-Paper-Scissors
 * Matches the user-provided reference image:
 * Features the central neon battle pedestal with the Cyborg Robot arm (left)
 * facing off against the Human Cyber arm (right).
 */
export const RpsArenaView = ({
  playerMove,
  opponentMove,
  isCountingDown,
  countdownNumber,
  timerSeconds = 25,
  roundResult, // 'win' | 'loss' | 'draw' | null
  isRevealing,
  playerLabel = 'You',
  opponentLabel = 'Cyber Bot',
  opponentIsRobot = true
}) => {
  // Move labels & emojis
  const moveIcons = {
    rock: { emoji: '✊', label: 'ROCK', color: '#00f5ff' },
    scissors: { emoji: '✌️', label: 'SCISSORS', color: '#ff007f' },
    paper: { emoji: '✋', label: 'PAPER', color: '#b026ff' }
  };

  // Render Left (Opponent / Robot) Hand
  const renderRobotHand = () => {
    const activeMove = isRevealing ? opponentMove : isCountingDown ? 'rock' : 'rock';

    return (
      <div
        className={`relative flex items-center justify-end transition-all duration-300 ${
          isCountingDown
            ? 'animate-bounce'
            : isRevealing
            ? 'scale-110 translate-x-3'
            : 'hover:scale-105'
        }`}
      >
        {/* Robotic Forearm */}
        <div className="hidden sm:block w-28 md:w-44 h-12 md:h-16 rounded-l-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 border-y-2 border-l-2 border-cyan-400/60 shadow-[0_0_15px_rgba(0,245,255,0.4)] relative overflow-hidden">
          {/* Cyber glowing circuit lines */}
          <div className="absolute inset-y-0 right-4 w-2 bg-purple-500 shadow-[0_0_10px_#a855f7]" />
          <div className="absolute top-2 left-3 right-8 h-1 bg-cyan-400/40 rounded-full" />
          <div className="absolute bottom-2 left-6 right-10 h-1 bg-cyan-400/40 rounded-full" />
          {/* Metallic joint rings */}
          <div className="absolute right-0 inset-y-0 w-3 bg-gradient-to-b from-cyan-300 via-slate-600 to-cyan-500 border-l border-cyan-400" />
        </div>

        {/* Robotic Hand / Palm Housing */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border-2 border-cyan-400/80 p-2 flex items-center justify-center shadow-[0_0_25px_rgba(0,245,255,0.5)] transform -rotate-6">
          {/* Glowing joints */}
          <div className="absolute -top-1 left-4 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f5ff]" />
          <div className="absolute -bottom-1 right-4 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />

          {/* Active Hand Pose */}
          <div className="text-5xl sm:text-6xl md:text-7xl select-none filter drop-shadow-[0_0_12px_rgba(0,245,255,0.6)] transform scale-x-[-1]">
            {isRevealing && opponentMove ? (
              moveIcons[opponentMove]?.emoji
            ) : isCountingDown ? (
              '✊'
            ) : (
              '✌️'
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render Right (Player / Human) Hand
  const renderHumanHand = () => {
    return (
      <div
        className={`relative flex items-center justify-start transition-all duration-300 ${
          isCountingDown
            ? 'animate-bounce'
            : isRevealing
            ? 'scale-110 -translate-x-3'
            : 'hover:scale-105'
        }`}
      >
        {/* Human Hand / Cyber Glove */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-to-bl from-amber-900/40 via-slate-900 to-slate-950 border-2 border-purple-500/80 p-2 flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.5)] transform rotate-6">
          {/* Glowing neon wristband cuff */}
          <div className="absolute -top-1 right-4 w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_#f472b6]" />
          <div className="absolute -bottom-1 left-4 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />

          {/* Active Hand Pose */}
          <div className="text-5xl sm:text-6xl md:text-7xl select-none filter drop-shadow-[0_0_12px_rgba(236,72,153,0.6)]">
            {isRevealing && playerMove ? (
              moveIcons[playerMove]?.emoji
            ) : isCountingDown ? (
              '✊'
            ) : (
              '✊'
            )}
          </div>
        </div>

        {/* Cyber Arm with wrist cuff */}
        <div className="hidden sm:block w-28 md:w-44 h-12 md:h-16 rounded-r-2xl bg-gradient-to-l from-slate-900 via-slate-800 to-slate-700 border-y-2 border-r-2 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.4)] relative overflow-hidden">
          {/* Glowing neon cuff light */}
          <div className="absolute inset-y-0 left-4 w-2 bg-pink-500 shadow-[0_0_10px_#ec4899]" />
          <div className="absolute top-2 right-3 left-8 h-1 bg-purple-400/40 rounded-full" />
          <div className="absolute bottom-2 right-6 left-10 h-1 bg-purple-400/40 rounded-full" />
          <div className="absolute left-0 inset-y-0 w-3 bg-gradient-to-b from-purple-300 via-slate-600 to-pink-500 border-r border-purple-400" />
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#060a14] shadow-2xl p-4 sm:p-8 min-h-[440px] sm:min-h-[520px] flex flex-col justify-between select-none">
      {/* Background Ambient Lighting & Stars */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.15)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,245,255,0.12)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Top Center: Round Countdown / Dynamic Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        {isCountingDown ? (
          <div className="animate-pulse">
            <span className="text-4xl sm:text-6xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400 tracking-wider filter drop-shadow-[0_0_15px_rgba(0,245,255,0.8)]">
              {countdownNumber !== null ? countdownNumber : 'SHOOT!'}
            </span>
            <div className="text-[11px] font-bold uppercase tracking-widest text-cyan-400 mt-1">
              Clashing in progress...
            </div>
          </div>
        ) : isRevealing ? (
          <div className="animate-in zoom-in-95 duration-200">
            <div
              className={`px-5 py-2 rounded-2xl font-black font-display text-base sm:text-xl uppercase tracking-wider shadow-lg border ${
                roundResult === 'win'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_20px_rgba(52,211,153,0.5)]'
                  : roundResult === 'loss'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
              }`}
            >
              {roundResult === 'win'
                ? 'VICTORY! Round Won'
                : roundResult === 'loss'
                ? 'DEFEAT! Round Lost'
                : 'DRAW! Stalemate'}
            </div>
            <p className="text-xs text-slate-400 mt-1.5 font-medium">
              {playerMove && opponentMove
                ? `${playerMove.toUpperCase()} vs ${opponentMove.toUpperCase()}`
                : 'Round Resolved'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-mono font-black text-2xl text-cyan-400 shadow-glow-cyan">
              {timerSeconds}
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mt-1">
              Seconds to choose
            </span>
          </div>
        )}
      </div>

      {/* Main Duel Stage: Cyborg Arm (Left) vs Human Cyber Arm (Right) */}
      <div className="relative z-10 my-auto py-6 sm:py-8 flex items-center justify-between px-2 sm:px-12">
        {/* Left Side: Robot / Opponent */}
        <div className="flex flex-col items-center">
          {renderRobotHand()}
          <div className="mt-3 text-center">
            <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {opponentLabel}
            </span>
            {isRevealing && opponentMove && (
              <span className="text-[11px] font-bold text-slate-300 capitalize block mt-0.5">
                {opponentMove}
              </span>
            )}
          </div>
        </div>

        {/* Center Clash Pedestal */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-12 sm:bottom-16 w-48 sm:w-80 md:w-96 flex flex-col items-center pointer-events-none">
          {/* Energy beam connection */}
          <div className="w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full shadow-[0_0_15px_#00f5ff]" />

          {/* Glowing Cyber Platform (matches reference image pedestal) */}
          <div className="w-full h-7 sm:h-9 bg-gradient-to-b from-[#131b31] to-[#0a0f1d] rounded-xl border-t-2 border-purple-500/80 shadow-[0_0_30px_rgba(168,85,247,0.5)] flex items-center justify-between px-4">
            <div className="w-12 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f5ff]" />
            <div className="w-16 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7]" />
            <div className="w-12 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />
          </div>
        </div>

        {/* Right Side: Player / Human */}
        <div className="flex flex-col items-center">
          {renderHumanHand()}
          <div className="mt-3 text-center">
            <span className="text-xs font-black uppercase tracking-wider text-pink-400 flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              {playerLabel}
            </span>
            {isRevealing && playerMove && (
              <span className="text-[11px] font-bold text-slate-300 capitalize block mt-0.5">
                {playerMove}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Ticker */}
      <div className="relative z-10 text-center">
        {!isRevealing && !isCountingDown && (
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 animate-pulse">
            Select your weapon below to engage!
          </span>
        )}
      </div>
    </div>
  );
};
