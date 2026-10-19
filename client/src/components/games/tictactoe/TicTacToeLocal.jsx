import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Bot, Users, Trophy, RefreshCw, Sparkles, Volume2, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { playClickSound, playMoveSound, playWinSound, playLoseSound } from '../../../utils/audio';

const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Minimax Algorithm for unbeatable Hard AI
const checkWinnerForBoard = (board) => {
  for (const [a, b, c] of WIN_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: null, draw: true };
  }
  return null;
};

const minimax = (board, depth, isMaximizing, aiSymbol, humanSymbol) => {
  const result = checkWinnerForBoard(board);
  if (result) {
    if (result.winner === aiSymbol) return 10 - depth;
    if (result.winner === humanSymbol) return depth - 10;
    if (result.draw) return 0;
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = aiSymbol;
        const evaluation = minimax(board, depth + 1, false, aiSymbol, humanSymbol);
        board[i] = null;
        maxEval = Math.max(maxEval, evaluation);
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = humanSymbol;
        const evaluation = minimax(board, depth + 1, true, aiSymbol, humanSymbol);
        board[i] = null;
        minEval = Math.min(minEval, evaluation);
      }
    }
    return minEval;
  }
};

const getBestAiMove = (board, difficulty, aiSymbol = 'O', humanSymbol = 'X') => {
  const emptyIndices = [];
  board.forEach((cell, idx) => {
    if (cell === null) emptyIndices.push(idx);
  });

  if (emptyIndices.length === 0) return null;

  // Easy: Random choice
  if (difficulty === 'easy') {
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  // Medium: Check for immediate win or immediate block, else random
  if (difficulty === 'medium') {
    // 1. Can AI win in one move?
    for (const idx of emptyIndices) {
      board[idx] = aiSymbol;
      if (checkWinnerForBoard(board)?.winner === aiSymbol) {
        board[idx] = null;
        return idx;
      }
      board[idx] = null;
    }
    // 2. Can Human win in one move? Block them!
    for (const idx of emptyIndices) {
      board[idx] = humanSymbol;
      if (checkWinnerForBoard(board)?.winner === humanSymbol) {
        board[idx] = null;
        return idx;
      }
      board[idx] = null;
    }
    // 3. Take center if available
    if (board[4] === null) return 4;

    // Otherwise random from corners
    const corners = [0, 2, 6, 8].filter((c) => board[c] === null);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  // Hard: Full Minimax!
  let bestScore = -Infinity;
  let bestMove = emptyIndices[0];

  for (const idx of emptyIndices) {
    board[idx] = aiSymbol;
    const score = minimax(board, 0, false, aiSymbol, humanSymbol);
    board[idx] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = idx;
    }
  }

  return bestMove;
};

export const TicTacToeLocal = ({ onSwitchToOnline }) => {
  const { user, unlockAchievement } = useAuth();

  const [mode, setMode] = useState('ai'); // 'ai' | 'local2p'
  const [difficulty, setDifficulty] = useState('hard'); // 'easy' | 'medium' | 'hard'
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState('X');
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Check game over
  useEffect(() => {
    const outcome = checkWinnerForBoard(board);
    if (outcome) {
      if (outcome.winner) {
        setWinner(outcome.winner);
        setWinningLine(outcome.line);
        setScores((prev) => ({ ...prev, [outcome.winner]: prev[outcome.winner] + 1 }));

        if (outcome.winner === 'X') {
          playWinSound();
          try {
            confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
          } catch (e) {}

          // Check AI machine slayer achievement
          if (mode === 'ai' && difficulty === 'hard') {
            unlockAchievement({
              achievementId: 'machine_slayer',
              name: 'Machine Slayer',
              description: 'Defeated the Hard Minimax AI in Tic-Tac-Toe',
              icon: '🤖'
            });
          }
        } else {
          playLoseSound();
        }
      } else if (outcome.draw) {
        setIsDraw(true);
        setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      }
    } else if (mode === 'ai' && currentTurn === 'O' && !winner && !isDraw) {
      // Trigger AI turn with realistic slight delay
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const move = getBestAiMove(board, difficulty, 'O', 'X');
        if (move !== null && move !== undefined) {
          playMoveSound('O');
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);
          setCurrentTurn('X');
        }
        setIsAiThinking(false);
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [board, currentTurn, mode, difficulty]);

  const handleCellClick = (index) => {
    if (board[index] !== null || winner || isDraw || isAiThinking) return;
    if (mode === 'ai' && currentTurn !== 'X') return;

    playClickSound();
    playMoveSound(currentTurn);

    const newBoard = [...board];
    newBoard[index] = currentTurn;
    setBoard(newBoard);
    setCurrentTurn(currentTurn === 'X' ? 'O' : 'X');
  };

  const handleResetRound = () => {
    playClickSound();
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine(null);
    setIsDraw(false);
    setCurrentTurn('X');
    setIsAiThinking(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner Mode Selector */}
      <div className="rounded-3xl glass-panel p-4 sm:p-6 border border-slate-200 dark:border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Tic-Tac-Toe Arena
            </span>
            <span className="text-xs text-slate-500">
              • {mode === 'ai' ? `Vs Computer (${difficulty.toUpperCase()})` : 'Local Pass & Play'}
            </span>
          </div>
          <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">
            {mode === 'ai' ? 'Challenge Artificial Intelligence' : 'Same-Device Multiplayer'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playClickSound();
              setMode('ai');
              handleResetRound();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'ai'
                ? 'bg-cyan-500 text-white shadow-glow-cyan'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Vs Computer</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setMode('local2p');
              handleResetRound();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'local2p'
                ? 'bg-purple-500 text-white shadow-glow-purple'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pass & Play</span>
          </button>

          <button
            onClick={onSwitchToOnline}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-white/10"
          >
            Online Match
          </button>
        </div>
      </div>

      {/* AI Difficulty Bar */}
      {mode === 'ai' && (
        <div className="p-3 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" /> AI Intelligence:
          </span>
          <div className="flex items-center gap-2">
            {['easy', 'medium', 'hard'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  playClickSound();
                  setDifficulty(lvl);
                  handleResetRound();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  difficulty === lvl
                    ? 'bg-cyan-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scoreboard */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className={`p-4 rounded-2xl glass-panel border ${
          currentTurn === 'X' && !winner && !isDraw ? 'border-cyan-400 ring-2 ring-cyan-400/50' : 'border-slate-200 dark:border-white/10'
        }`}>
          <div className="text-xs font-bold text-slate-400">
            {mode === 'ai' ? 'Player (X)' : 'Player 1 (X)'}
          </div>
          <div className="text-2xl font-black font-mono text-cyan-500 dark:text-cyan-400 mt-1">
            {scores.X}
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-white/10">
          <div className="text-xs font-bold text-slate-400">Draws</div>
          <div className="text-2xl font-black font-mono text-amber-500 mt-1">
            {scores.draws}
          </div>
        </div>

        <div className={`p-4 rounded-2xl glass-panel border ${
          currentTurn === 'O' && !winner && !isDraw ? 'border-pink-400 ring-2 ring-pink-400/50' : 'border-slate-200 dark:border-white/10'
        }`}>
          <div className="text-xs font-bold text-slate-400">
            {mode === 'ai' ? `Computer (O)` : 'Player 2 (O)'}
          </div>
          <div className="text-2xl font-black font-mono text-pink-500 dark:text-pink-400 mt-1">
            {scores.O}
          </div>
        </div>
      </div>

      {/* 3D Board */}
      <div className="flex flex-col items-center">
        {/* Game status text */}
        <div className="mb-4 text-center h-8">
          {winner ? (
            <div className="text-lg font-black text-slate-900 dark:text-white flex items-center justify-center gap-2 animate-in zoom-in-95">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>{winner === 'X' ? (mode === 'ai' ? 'You Won!' : 'Player 1 Wins!') : (mode === 'ai' ? 'Computer Wins!' : 'Player 2 Wins!')}</span>
            </div>
          ) : isDraw ? (
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              Stalemate Draw!
            </div>
          ) : isAiThinking ? (
            <div className="text-xs font-bold text-pink-400 animate-pulse flex items-center justify-center gap-1.5">
              <Bot className="w-4 h-4 animate-spin" />
              <span>AI is calculating optimal trajectory...</span>
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-500">
              Turn: <span className={currentTurn === 'X' ? 'text-cyan-400' : 'text-pink-400'}>{currentTurn}</span>
            </div>
          )}
        </div>

        {/* 3D Board Container */}
        <div className="relative p-6 sm:p-8 rounded-[36px] bg-gradient-to-b from-slate-200/90 to-slate-100/90 dark:from-slate-800/90 dark:to-slate-900/90 border border-slate-300 dark:border-white/10 shadow-card-3d">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10">
            {board.map((cellValue, idx) => {
              const isWinning = winningLine && winningLine.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  disabled={cellValue !== null || !!winner || isDraw || isAiThinking}
                  className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl flex items-center justify-center font-black transition-all duration-200 select-none ${
                    isWinning
                      ? 'bg-amber-400/30 ring-4 ring-amber-400 shadow-glow-yellow scale-105 z-20 animate-pulse'
                      : cellValue !== null
                      ? 'bg-white/80 dark:bg-slate-800/90 shadow-inner'
                      : 'bg-white/95 dark:bg-slate-800/80 hover:bg-cyan-500/10 hover:ring-2 hover:ring-cyan-400/50 cursor-pointer shadow-md transform hover:-translate-y-1'
                  } border border-slate-200/80 dark:border-white/10`}
                >
                  {cellValue === 'X' && (
                    <span className="text-4xl sm:text-6xl font-black font-display text-cyan-500 dark:text-cyan-400 drop-shadow-[0_0_15px_rgba(0,245,255,0.6)] animate-in zoom-in-75">
                      X
                    </span>
                  )}
                  {cellValue === 'O' && (
                    <span className="text-4xl sm:text-6xl font-black font-display text-pink-500 dark:text-pink-400 drop-shadow-[0_0_15px_rgba(255,0,127,0.6)] animate-in zoom-in-75">
                      O
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6">
          <button
            onClick={handleResetRound}
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs tracking-wide shadow-glow-cyan transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};
