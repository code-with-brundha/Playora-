import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, Flag, Timer, Sparkles, MessageSquare, Volume2, ShieldAlert } from 'lucide-react';
import { AvatarBadge } from '../../common/AvatarBadge';
import { Card3D } from '../../common/Card3D';
import { RoomChat } from '../../lobby/RoomChat';
import { useSocket } from '../../../context/SocketContext';
import { playMoveSound, playWinSound, playLoseSound, playClickSound } from '../../../utils/audio';

export const TicTacToeGame = ({ initialGameState, roomCode, currentUserId, onLeaveRoom }) => {
  const { socket, makeMove, requestRematch, forfeitGame } = useSocket();
  const [gameState, setGameState] = useState(initialGameState);
  const [timeLeft, setTimeLeft] = useState(30);
  const [moveError, setMoveError] = useState('');
  const [rematchNotice, setRematchNotice] = useState(null);
  const [showForfeitConfirm, setShowForfeitConfirm] = useState(false);

  // Listen to socket game updates
  useEffect(() => {
    if (!socket) return;

    const handleStateUpdate = ({ gameState: newState, meta }) => {
      setGameState(newState);
      setMoveError('');
      if (meta?.type === 'rematch_started') {
        setRematchNotice(null);
      }
    };

    const handleSync = (syncedState) => {
      setGameState(syncedState);
    };

    const handleGameOver = (data) => {
      setGameState(data.gameState);

      // Trigger celebration / sound effects
      const mySymbol =
        data.gameState.playerX.userId === currentUserId || data.gameState.playerX.socketId === socket.id
          ? 'X'
          : data.gameState.playerO.userId === currentUserId || data.gameState.playerO.socketId === socket.id
          ? 'O'
          : null;

      if (data.isDraw) {
        // Draw sound
        playMoveSound('X');
      } else if (data.winner === mySymbol) {
        // User won! Fire confetti!
        playWinSound();
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {}
      } else if (mySymbol) {
        // User lost
        playLoseSound();
      }
    };

    const handleMoveError = (err) => {
      setMoveError(err.message || 'Invalid move');
      setTimeout(() => setMoveError(''), 3000);
    };

    const handleRematchStatus = (status) => {
      if (status.restarted) {
        setRematchNotice(null);
      } else {
        setRematchNotice(`${status.requestedBy} wants a rematch!`);
      }
    };

    socket.on('game_state_update', handleStateUpdate);
    socket.on('game_state_sync', handleSync);
    socket.on('game_over', handleGameOver);
    socket.on('move_error', handleMoveError);
    socket.on('rematch_status', handleRematchStatus);

    return () => {
      socket.off('game_state_update', handleStateUpdate);
      socket.off('game_state_sync', handleSync);
      socket.off('game_over', handleGameOver);
      socket.off('move_error', handleMoveError);
      socket.off('rematch_status', handleRematchStatus);
    };
  }, [socket, currentUserId]);

  // Turn timer countdown calculation
  useEffect(() => {
    if (!gameState || gameState.status !== 'playing' || !gameState.turnExpiresAt) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.ceil((gameState.turnExpiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 500);
    return () => clearInterval(interval);
  }, [gameState?.turnExpiresAt, gameState?.status]);

  if (!gameState) return null;

  const { board, currentTurn, status, winner, winningLine, scores, playerX, playerO } = gameState;

  // Determine current user's role
  const isPlayerX = playerX.userId === currentUserId || playerX.socketId === socket?.id;
  const isPlayerO = playerO.userId === currentUserId || playerO.socketId === socket?.id;
  const mySymbol = isPlayerX ? 'X' : isPlayerO ? 'O' : null;
  const isMyTurn = status === 'playing' && mySymbol === currentTurn;

  const handleCellClick = (index) => {
    if (!isMyTurn || board[index] !== null) return;
    playClickSound();
    playMoveSound(mySymbol);
    makeMove(roomCode, index);
  };

  const handleRematch = () => {
    playClickSound();
    requestRematch(roomCode);
  };

  const handleForfeit = () => {
    playClickSound();
    forfeitGame(roomCode);
    setShowForfeitConfirm(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
      {/* Top Match Scoreboard */}
      <div className="rounded-3xl glass-panel p-4 sm:p-6 mb-6 border border-slate-200 dark:border-white/10 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Player X Info */}
          <div className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
            currentTurn === 'X' && status === 'playing'
              ? 'bg-cyan-500/10 ring-2 ring-cyan-500/60 shadow-glow-cyan'
              : 'bg-slate-100/60 dark:bg-slate-800/40'
          }`}>
            <AvatarBadge avatarId={playerX.avatar} size="md" />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500 text-white">
                  X
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {playerX.username}
                </span>
                {isPlayerX && (
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">(You)</span>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                Score: <span className="font-mono text-cyan-500 dark:text-cyan-400 text-sm font-bold">{scores.X}</span>
              </div>
            </div>
          </div>

          {/* Central Turn & Timer Banner */}
          <div className="flex flex-col items-center text-center">
            {status === 'playing' ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <Timer className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-500 animate-bounce' : 'text-cyan-400'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {isMyTurn ? "Your Turn" : `${currentTurn === 'X' ? playerX.username : playerO.username}'s Turn`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-2xl font-black font-mono tracking-wider ${
                    timeLeft <= 5 ? 'text-rose-500 animate-pulse' : 'text-slate-900 dark:text-white'
                  }`}>
                    {timeLeft}s
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-36 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-1.5">
                  <div
                    className={`h-full transition-all duration-500 ${
                      timeLeft <= 5 ? 'bg-rose-500' : 'bg-gradient-to-r from-cyan-400 to-purple-500'
                    }`}
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                  />
                </div>
              </>
            ) : status === 'won' ? (
              <div className="text-center animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                  <Trophy className="w-5 h-5 animate-bounce" />
                  <span className="text-xs font-bold uppercase tracking-widest">Match Concluded</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {winner === mySymbol
                    ? '🎉 VICTORY IS YOURS!'
                    : `👑 ${winner === 'X' ? playerX.username : playerO.username} WINS!`}
                </div>
              </div>
            ) : (
              <div className="text-center animate-in zoom-in-95 duration-200">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Match Concluded</span>
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  🤝 IT'S A STALEMATE DRAW!
                </div>
              </div>
            )}
          </div>

          {/* Player O Info */}
          <div className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
            currentTurn === 'O' && status === 'playing'
              ? 'bg-pink-500/10 ring-2 ring-pink-500/60 shadow-glow-pink'
              : 'bg-slate-100/60 dark:bg-slate-800/40'
          }`}>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end">
                {isPlayerO && (
                  <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold">(You)</span>
                )}
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                  {playerO.username}
                </span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-pink-500 text-white">
                  O
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-semibold">
                Score: <span className="font-mono text-pink-500 dark:text-pink-400 text-sm font-bold">{scores.O}</span>
              </div>
            </div>
            <AvatarBadge avatarId={playerO.avatar} size="md" />
          </div>
        </div>
      </div>

      {/* Main Board & Chat Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: 3D Tic-Tac-Toe Arena */}
        <div className="lg:col-span-2 flex flex-col items-center">
          {moveError && (
            <div className="mb-4 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold animate-shake">
              {moveError}
            </div>
          )}

          {/* Rematch banner */}
          {rematchNotice && (
            <div className="mb-4 w-full p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {rematchNotice}
              </span>
              <button
                onClick={handleRematch}
                className="px-4 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-md"
              >
                Accept Rematch
              </button>
            </div>
          )}

          {/* 3D Board Wrapper with Depth and Perspective */}
          <div className="relative p-6 sm:p-8 rounded-[36px] bg-gradient-to-b from-slate-200/90 to-slate-100/90 dark:from-slate-800/90 dark:to-slate-900/90 border border-slate-300 dark:border-white/10 shadow-card-3d">
            {/* Glowing neon halo */}
            <div className="absolute inset-0 rounded-[36px] bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-xl pointer-events-none" />

            <div
              className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10"
              style={{
                perspective: '800px',
                transformStyle: 'preserve-3d'
              }}
            >
              {board.map((cellValue, idx) => {
                const isWinningCell = winningLine && winningLine.includes(idx);
                const isCellOccupied = cellValue !== null;

                return (
                  <button
                    key={idx}
                    onClick={() => handleCellClick(idx)}
                    disabled={!isMyTurn || isCellOccupied || status !== 'playing'}
                    className={`w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl flex items-center justify-center font-black transition-all duration-200 relative select-none ${
                      isWinningCell
                        ? 'bg-gradient-to-tr from-amber-400/30 to-amber-500/30 ring-4 ring-amber-400 shadow-glow-yellow scale-105 z-20 animate-pulse'
                        : isCellOccupied
                        ? 'bg-white/80 dark:bg-slate-800/90 shadow-inner'
                        : isMyTurn
                        ? 'bg-white/95 dark:bg-slate-800/80 hover:bg-cyan-500/10 hover:ring-2 hover:ring-cyan-400/50 cursor-pointer shadow-md transform hover:-translate-y-1'
                        : 'bg-white/60 dark:bg-slate-800/50 cursor-not-allowed opacity-90'
                    } border border-slate-200/80 dark:border-white/10`}
                    style={{
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {cellValue === 'X' && (
                      <span className="text-4xl sm:text-6xl font-black font-display text-cyan-500 dark:text-cyan-400 drop-shadow-[0_0_15px_rgba(0,245,255,0.6)] transform translate-z-20 animate-in zoom-in-75 duration-150">
                        X
                      </span>
                    )}
                    {cellValue === 'O' && (
                      <span className="text-4xl sm:text-6xl font-black font-display text-pink-500 dark:text-pink-400 drop-shadow-[0_0_15px_rgba(255,0,127,0.6)] transform translate-z-20 animate-in zoom-in-75 duration-150">
                        O
                      </span>
                    )}
                    {!cellValue && isMyTurn && (
                      <span className="opacity-0 hover:opacity-30 text-3xl sm:text-5xl font-black text-slate-400 transition-opacity">
                        {mySymbol}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Game Controls Bar */}
          <div className="flex items-center gap-3 mt-6">
            {status !== 'playing' ? (
              <button
                onClick={handleRematch}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:shadow-glow-cyan text-white text-xs font-bold tracking-wider uppercase transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Request Rematch</span>
              </button>
            ) : mySymbol ? (
              <button
                onClick={() => setShowForfeitConfirm(true)}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-rose-500/10 text-slate-600 dark:text-slate-300 hover:text-rose-500 border border-slate-200 dark:border-white/10 text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Surrender Round</span>
              </button>
            ) : null}

            <button
              onClick={onLeaveRoom}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-semibold transition-colors"
            >
              Exit Arena
            </button>
          </div>

          {/* Forfeit Confirmation Modal */}
          {showForfeitConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
              <div className="glass-panel p-6 rounded-3xl max-w-sm w-full text-center border border-rose-500/30">
                <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  Surrender this match?
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  Surrendering will instantly award the victory to your opponent.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowForfeitConfirm(false)}
                    className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleForfeit}
                    className="py-2.5 rounded-xl bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-500/30"
                  >
                    Confirm Forfeit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Live Arena Chat */}
        <div className="lg:col-span-1 h-[480px]">
          <RoomChat roomCode={roomCode} />
        </div>
      </div>
    </div>
  );
};
