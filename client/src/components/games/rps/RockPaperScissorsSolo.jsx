import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  RotateCcw,
  Sparkles,
  Info,
  History,
  X,
  Bot,
  Zap,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { RpsArenaView } from './RpsArenaView';
import { getComputerMove, determineRpsWinner } from './rpsAi';
import { useAuth } from '../../../context/AuthContext';
import {
  playClickSound,
  playWinSound,
  playLoseSound,
  playRpsCountdownBeep,
  playRpsClashSound
} from '../../../utils/audio';

export const RockPaperScissorsSolo = () => {
  const { user, recordRpsStats } = useAuth();

  // Difficulty: 'easy' | 'tactical' | 'master'
  const [difficulty, setDifficulty] = useState('tactical');

  // Match State (First to 3 wins match)
  const targetScore = 3;
  const [round, setRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [streak, setStreak] = useState(user?.rpsStats?.currentStreak || 0);

  // Active Round State
  const [playerMove, setPlayerMove] = useState(null);
  const [aiMove, setAiMove] = useState(null);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [roundResult, setRoundResult] = useState(null); // 'win' | 'loss' | 'draw'

  // Match Complete State
  const [isMatchOver, setIsMatchOver] = useState(false);
  const [matchWinner, setMatchWinner] = useState(null); // 'player' | 'ai'

  // History & Modals
  const [history, setHistory] = useState([]);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Handle player move selection
  const handleSelectMove = (move) => {
    if (isCountingDown || isRevealing || isMatchOver) return;

    playClickSound();
    setPlayerMove(move);
    setIsCountingDown(true);
    setCountdownNumber(3);
    playRpsCountdownBeep(false);

    // 3... 2... 1... SHOOT countdown
    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdownNumber(count);
        playRpsCountdownBeep(false);
      } else {
        clearInterval(interval);
        setCountdownNumber('CLASH!');
        playRpsCountdownBeep(true);
        executeRoundResolution(move);
      }
    }, 600);
  };

  // Resolve round after countdown
  const executeRoundResolution = (selectedPlayerMove) => {
    // Generate AI response
    const computerMove = getComputerMove(difficulty, history);
    setAiMove(computerMove);

    setIsCountingDown(false);
    setIsRevealing(true);
    playRpsClashSound();

    const outcome = determineRpsWinner(selectedPlayerMove, computerMove);
    setRoundResult(outcome);

    let nextPlayerScore = playerScore;
    let nextAiScore = aiScore;
    let nextStreak = streak;

    if (outcome === 'win') {
      nextPlayerScore += 1;
      nextStreak += 1;
      setPlayerScore(nextPlayerScore);
      setStreak(nextStreak);
      playWinSound();
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } else if (outcome === 'loss') {
      nextAiScore += 1;
      nextStreak = 0;
      setAiScore(nextAiScore);
      setStreak(0);
      playLoseSound();
    } else {
      // Draw
      playClickSound();
    }

    // Record round in local history
    const roundRecord = {
      round,
      playerMove: selectedPlayerMove,
      aiMove: computerMove,
      result: outcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setHistory((prev) => [...prev, roundRecord]);

    // Send to backend user stats
    if (recordRpsStats) {
      recordRpsStats({ result: outcome });
    }

    // Check if match won
    if (nextPlayerScore >= targetScore || nextAiScore >= targetScore) {
      setTimeout(() => {
        setIsMatchOver(true);
        setMatchWinner(nextPlayerScore >= targetScore ? 'player' : 'ai');
        if (nextPlayerScore >= targetScore) {
          playWinSound();
          try {
            confetti({
              particleCount: 160,
              spread: 120,
              origin: { y: 0.5 }
            });
          } catch (e) {}
        }
      }, 2400);
    } else {
      // Auto-advance to next round after 3 seconds
      setTimeout(() => {
        setIsRevealing(false);
        setRoundResult(null);
        setPlayerMove(null);
        setAiMove(null);
        setRound((prev) => prev + 1);
      }, 3000);
    }
  };

  const handleResetMatch = () => {
    playClickSound();
    setRound(1);
    setPlayerScore(0);
    setAiScore(0);
    setPlayerMove(null);
    setAiMove(null);
    setIsCountingDown(false);
    setIsRevealing(false);
    setRoundResult(null);
    setIsMatchOver(false);
    setMatchWinner(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header / Arena HUD */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Modals & Rules */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClickSound();
              setShowHelpModal(true);
            }}
            className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-white/10"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            <span>How to Play</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setShowHistoryModal(true);
            }}
            className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-white/10"
          >
            <History className="w-4 h-4 text-purple-400" />
            <span>History ({history.length})</span>
          </button>
        </div>

        {/* Center: Live Scoreboard */}
        <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800/90 px-6 py-2 rounded-2xl border border-slate-200 dark:border-white/10">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400">Cyber Bot</span>
            <div className="text-xl font-black font-mono text-cyan-400">{aiScore}</div>
          </div>
          <div className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-400 font-mono font-bold text-xs">
            Round {round} / First to {targetScore}
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase text-slate-400">You</span>
            <div className="text-xl font-black font-mono text-pink-400">{playerScore}</div>
          </div>
        </div>

        {/* Right: Streak & Difficulty Selector */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center gap-1.5 text-xs font-bold">
            <Flame className="w-4 h-4 fill-amber-500 animate-bounce" />
            <span>Streak: {streak}</span>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-white/10">
            {['easy', 'tactical', 'master'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  playClickSound();
                  setDifficulty(lvl);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold capitalize transition-all ${
                  difficulty === lvl
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 3D Arena Stage (Robot vs Human) */}
      <RpsArenaView
        playerMove={playerMove}
        opponentMove={aiMove}
        isCountingDown={isCountingDown}
        countdownNumber={countdownNumber}
        timerSeconds={25}
        roundResult={roundResult}
        isRevealing={isRevealing}
        playerLabel={user?.username || 'You'}
        opponentLabel={`Bot (${difficulty})`}
        opponentIsRobot={true}
      />

      {/* Bottom Move Selection Bar (3 Glowing Cyber Buttons) */}
      <div className="p-4 sm:p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl flex flex-col items-center gap-4">
        <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          Choose Your Move
        </span>

        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl">
          {/* Rock Button */}
          <button
            onClick={() => handleSelectMove('rock')}
            disabled={isCountingDown || isRevealing || isMatchOver}
            className={`group p-4 sm:p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 select-none ${
              playerMove === 'rock'
                ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_20px_rgba(0,245,255,0.7)] scale-105'
                : 'border-cyan-500/30 bg-slate-900/80 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-glow-cyan hover:-translate-y-1'
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_10px_#00f5ff]">
              ✊
            </span>
            <div className="text-center">
              <span className="text-xs sm:text-sm font-black font-display tracking-wider text-cyan-400 block">
                ROCK
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">Crushes Scissors</span>
            </div>
          </button>

          {/* Scissors Button */}
          <button
            onClick={() => handleSelectMove('scissors')}
            disabled={isCountingDown || isRevealing || isMatchOver}
            className={`group p-4 sm:p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 select-none ${
              playerMove === 'scissors'
                ? 'border-pink-400 bg-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.7)] scale-105'
                : 'border-pink-500/30 bg-slate-900/80 hover:border-pink-400 hover:bg-pink-500/10 hover:shadow-glow-pink hover:-translate-y-1'
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_10px_#ec4899]">
              ✌️
            </span>
            <div className="text-center">
              <span className="text-xs sm:text-sm font-black font-display tracking-wider text-pink-400 block">
                SCISSORS
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">Cuts Paper</span>
            </div>
          </button>

          {/* Paper Button */}
          <button
            onClick={() => handleSelectMove('paper')}
            disabled={isCountingDown || isRevealing || isMatchOver}
            className={`group p-4 sm:p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 select-none ${
              playerMove === 'paper'
                ? 'border-purple-400 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.7)] scale-105'
                : 'border-purple-500/30 bg-slate-900/80 hover:border-purple-400 hover:bg-purple-500/10 hover:shadow-[0_0_15px_#a855f7] hover:-translate-y-1'
            } disabled:opacity-50 disabled:pointer-events-none`}
          >
            <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_10px_#a855f7]">
              ✋
            </span>
            <div className="text-center">
              <span className="text-xs sm:text-sm font-black font-display tracking-wider text-purple-400 block">
                PAPER
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">Covers Rock</span>
            </div>
          </button>
        </div>
      </div>

      {/* Match Victory / Defeat Modal */}
      {isMatchOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in zoom-in-95">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border border-cyan-500/40 shadow-2xl space-y-6">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                matchWinner === 'player'
                  ? 'bg-amber-400/20 text-amber-400 shadow-glow-yellow'
                  : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Match Finished
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white mt-1">
                {matchWinner === 'player' ? 'Duel Victory!' : 'Cyborg Victorious!'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {matchWinner === 'player'
                  ? 'You outsmarted the neural network in the Cyber Clash arena!'
                  : 'The AI predicted your moves. Adapt your strategy and strike back!'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Final Score</span>
                <div className="text-xl font-black font-mono text-cyan-400">
                  {playerScore} - {aiScore}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">XP Gained</span>
                <div className="text-xl font-black font-mono text-amber-400">
                  {matchWinner === 'player' ? '+120 XP' : '+30 XP'}
                </div>
              </div>
            </div>

            <button
              onClick={handleResetMatch}
              className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm shadow-glow-cyan transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rematch Clash</span>
            </button>
          </div>
        </div>
      )}

      {/* How to Play Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  Rock-Paper-Scissors Cyber Rules
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
                  Classic Rules
                </div>
                <p>
                  • <strong>Rock (✊)</strong> smashes <strong>Scissors (✌️)</strong>
                  <br />• <strong>Scissors (✌️)</strong> cuts <strong>Paper (✋)</strong>
                  <br />• <strong>Paper (✋)</strong> covers <strong>Rock (✊)</strong>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  AI Strategies
                </div>
                <p>
                  • <strong>Easy:</strong> Completely random choices.
                  <br />• <strong>Tactical:</strong> Exploits human psychological tendencies (win-stay/lose-shift).
                  <br />• <strong>Master:</strong> Quantum Markov frequency predictor that adapts to your sequence habits!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-400" />
                  Match Victory
                </div>
                <p>
                  The first duelist to reach 3 points wins the match and claims arena XP and rank points!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs transition-colors"
            >
              Enter Arena
            </button>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full border border-slate-200 dark:border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                  Match History
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
              {history.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">
                  No rounds played yet. Make your first move!
                </p>
              ) : (
                history.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">
                        Round {h.round}:{' '}
                      </span>
                      <span className="capitalize text-slate-400">
                        {h.playerMove} vs {h.aiMove}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${
                        h.result === 'win'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : h.result === 'loss'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {h.result}
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowHistoryModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
