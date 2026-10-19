import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Sparkles, Lock, Shield, Zap } from 'lucide-react';
import { RpsArenaView } from './RpsArenaView';
import { determineRpsWinner } from './rpsAi';
import {
  playClickSound,
  playWinSound,
  playRpsCountdownBeep,
  playRpsClashSound
} from '../../../utils/audio';

export const RockPaperScissorsLocal = () => {
  const targetScore = 3;
  const [round, setRound] = useState(1);
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);

  const [p1Move, setP1Move] = useState(null);
  const [p2Move, setP2Move] = useState(null);

  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [roundResult, setRoundResult] = useState(null);

  const [isMatchOver, setIsMatchOver] = useState(false);
  const [matchWinner, setMatchWinner] = useState(null);

  // Keyboard shortcut listener for simultaneous arcade input!
  // Player 1: A (Rock), S (Scissors), D (Paper)
  // Player 2: J (Rock), K (Scissors), L (Paper)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCountingDown || isRevealing || isMatchOver) return;

      const key = e.key.toLowerCase();
      // Player 1
      if (key === 'a') {
        playClickSound();
        setP1Move('rock');
      } else if (key === 's') {
        playClickSound();
        setP1Move('scissors');
      } else if (key === 'd') {
        playClickSound();
        setP1Move('paper');
      }

      // Player 2
      if (key === 'j') {
        playClickSound();
        setP2Move('rock');
      } else if (key === 'k') {
        playClickSound();
        setP2Move('scissors');
      } else if (key === 'l') {
        playClickSound();
        setP2Move('paper');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCountingDown, isRevealing, isMatchOver]);

  // When both players have picked a move, trigger countdown and reveal
  useEffect(() => {
    if (p1Move && p2Move && !isCountingDown && !isRevealing && !isMatchOver) {
      triggerSimultaneousClash();
    }
  }, [p1Move, p2Move]);

  const triggerSimultaneousClash = () => {
    setIsCountingDown(true);
    setCountdownNumber(3);
    playRpsCountdownBeep(false);

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
        playRpsClashSound();

        setIsCountingDown(false);
        setIsRevealing(true);

        const outcome = determineRpsWinner(p1Move, p2Move);
        setRoundResult(outcome);

        let nextP1Score = p1Score;
        let nextP2Score = p2Score;

        if (outcome === 'win') {
          nextP1Score += 1;
          setP1Score(nextP1Score);
          playWinSound();
        } else if (outcome === 'loss') {
          nextP2Score += 1;
          setP2Score(nextP2Score);
          playWinSound();
        }

        if (nextP1Score >= targetScore || nextP2Score >= targetScore) {
          setTimeout(() => {
            setIsMatchOver(true);
            setMatchWinner(nextP1Score >= targetScore ? 'Player 1' : 'Player 2');
            try {
              confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
            } catch (e) {}
          }, 2200);
        } else {
          // Advance to next round
          setTimeout(() => {
            setIsRevealing(false);
            setRoundResult(null);
            setP1Move(null);
            setP2Move(null);
            setRound((prev) => prev + 1);
          }, 3000);
        }
      }
    }, 550);
  };

  const handleReset = () => {
    playClickSound();
    setRound(1);
    setP1Score(0);
    setP2Score(0);
    setP1Move(null);
    setP2Move(null);
    setIsCountingDown(false);
    setIsRevealing(false);
    setRoundResult(null);
    setIsMatchOver(false);
    setMatchWinner(null);
  };

  return (
    <div className="space-y-6">
      {/* Header HUD */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Local 2-Player Pass & Play
          </span>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white mt-1">
            Same-Device Cyber Clash
          </h2>
        </div>

        {/* Live Scoreboard */}
        <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800/90 px-6 py-2 rounded-2xl border border-slate-200 dark:border-white/10">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400">Player 1</span>
            <div className="text-xl font-black font-mono text-cyan-400">{p1Score}</div>
          </div>
          <div className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-400 font-mono font-bold text-xs">
            Round {round} / First to 3
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase text-slate-400">Player 2</span>
            <div className="text-xl font-black font-mono text-pink-400">{p2Score}</div>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-bold transition-all flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Match</span>
        </button>
      </div>

      {/* Duel Arena */}
      <RpsArenaView
        playerMove={p2Move}
        opponentMove={p1Move}
        isCountingDown={isCountingDown}
        countdownNumber={countdownNumber}
        timerSeconds={25}
        roundResult={roundResult === 'draw' ? 'draw' : roundResult === 'win' ? 'loss' : 'win'}
        isRevealing={isRevealing}
        playerLabel="Player 2"
        opponentLabel="Player 1"
        opponentIsRobot={false}
      />

      {/* Dual Control Panels (Player 1 on Left, Player 2 on Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player 1 Controls */}
        <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-cyan-500/30 flex flex-col items-center gap-3">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase text-cyan-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Player 1 (Keyboard: A, S, D)
            </span>
            {p1Move && !isRevealing && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 w-full">
            {[
              { id: 'rock', icon: '✊', label: 'Rock (A)' },
              { id: 'scissors', icon: '✌️', label: 'Scissors (S)' },
              { id: 'paper', icon: '✋', label: 'Paper (D)' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  playClickSound();
                  setP1Move(m.id);
                }}
                disabled={isCountingDown || isRevealing || isMatchOver}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  p1Move === m.id
                    ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-glow-cyan'
                    : 'border-slate-800 bg-slate-900/80 hover:border-cyan-500/50 hover:bg-cyan-500/10'
                } disabled:opacity-40`}
              >
                <div className="text-2xl">{m.icon}</div>
                <div className="text-[10px] font-bold mt-1">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Player 2 Controls */}
        <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-pink-500/30 flex flex-col items-center gap-3">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-black uppercase text-pink-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" /> Player 2 (Keyboard: J, K, L)
            </span>
            {p2Move && !isRevealing && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Locked
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 w-full">
            {[
              { id: 'rock', icon: '✊', label: 'Rock (J)' },
              { id: 'scissors', icon: '✌️', label: 'Scissors (K)' },
              { id: 'paper', icon: '✋', label: 'Paper (L)' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  playClickSound();
                  setP2Move(m.id);
                }}
                disabled={isCountingDown || isRevealing || isMatchOver}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  p2Move === m.id
                    ? 'border-pink-400 bg-pink-500/20 text-pink-400 shadow-glow-pink'
                    : 'border-slate-800 bg-slate-900/80 hover:border-pink-500/50 hover:bg-pink-500/10'
                } disabled:opacity-40`}
              >
                <div className="text-2xl">{m.icon}</div>
                <div className="text-[10px] font-bold mt-1">{m.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Match Victory Dialog */}
      {isMatchOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in zoom-in-95">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border border-cyan-500/40 shadow-2xl space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-400 mx-auto flex items-center justify-center">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Match Finished
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white mt-1">
                {matchWinner} Wins!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Final Score: {p1Score} - {p2Score}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm shadow-glow-cyan transition-all"
            >
              Play Another Match
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
