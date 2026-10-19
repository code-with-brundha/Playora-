import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Flame,
  RotateCcw,
  Sparkles,
  Send,
  MessageSquare,
  Users,
  CheckCircle2,
  Lock,
  Unlock,
  Shield,
  Zap,
  Clock
} from 'lucide-react';
import { RpsArenaView } from './RpsArenaView';
import { useSocket } from '../../../context/SocketContext';
import {
  playClickSound,
  playWinSound,
  playLoseSound,
  playRpsCountdownBeep,
  playRpsClashSound
} from '../../../utils/audio';

export const RockPaperScissorsOnline = ({
  initialGameState,
  roomCode,
  currentUserId,
  onLeaveRoom
}) => {
  const { socket } = useSocket();

  const [gameState, setGameState] = useState(initialGameState);
  const [selectedMove, setSelectedMove] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Active round reveal state
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealedP1Move, setRevealedP1Move] = useState(null);
  const [revealedP2Move, setRevealedP2Move] = useState(null);
  const [roundResult, setRoundResult] = useState(null);

  // Game over state
  const [isMatchOver, setIsMatchOver] = useState(false);
  const [matchWinner, setMatchWinner] = useState(null);
  const [rematchRequested, setRematchRequested] = useState(false);

  // In-room chat
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const normalizedCode = (roomCode || '').toUpperCase();

  // Find players
  const player1 = gameState?.players?.[0];
  const player2 = gameState?.players?.[1];

  const isPlayer1 = player1?.userId === currentUserId;
  const isPlayer2 = player2?.userId === currentUserId;
  const isSpectator = !isPlayer1 && !isPlayer2;

  const myPlayer = isPlayer1 ? player1 : player2;
  const opponentPlayer = isPlayer1 ? player2 : player1;

  useEffect(() => {
    if (!socket) return;

    // Listen for state updates
    const handleStateUpdate = ({ gameState: updatedState, meta }) => {
      setGameState(updatedState);

      if (meta?.event === 'new_round') {
        setIsRevealing(false);
        setRoundResult(null);
        setSelectedMove(null);
        setHasSubmitted(false);
        setRevealedP1Move(null);
        setRevealedP2Move(null);
      } else if (meta?.event === 'match_reset') {
        setIsMatchOver(false);
        setMatchWinner(null);
        setRematchRequested(false);
        setIsRevealing(false);
        setRoundResult(null);
        setSelectedMove(null);
        setHasSubmitted(false);
      }
    };

    // Listen for round resolution (simultaneous reveal)
    const handleRoundResolved = ({ roundData, isMatchOver: matchFinished, matchWinner: winner }) => {
      // Trigger countdown reveal
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

          const p1M = roundData.moves[player1?.userId];
          const p2M = roundData.moves[player2?.userId];
          setRevealedP1Move(p1M);
          setRevealedP2Move(p2M);

          // Determine outcome for current user
          let outcome = 'draw';
          if (roundData.winnerId) {
            outcome = roundData.winnerId === currentUserId ? 'win' : 'loss';
          }
          setRoundResult(outcome);

          if (outcome === 'win') {
            playWinSound();
            try {
              confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
            } catch (e) {}
          } else if (outcome === 'loss') {
            playLoseSound();
          }

          if (matchFinished) {
            setTimeout(() => {
              setIsMatchOver(true);
              setMatchWinner(winner);
              if (winner?.userId === currentUserId) {
                playWinSound();
                try {
                  confetti({ particleCount: 160, spread: 120, origin: { y: 0.5 } });
                } catch (e) {}
              }
            }, 2500);
          }
        }
      }, 550);
    };

    const handleGameOver = ({ gameState: finalState, winner }) => {
      setGameState(finalState);
      setIsMatchOver(true);
      setMatchWinner(winner);
    };

    const handleRematchStatus = ({ requestedBy, starting }) => {
      if (starting) {
        setIsMatchOver(false);
        setMatchWinner(null);
        setRematchRequested(false);
        setIsRevealing(false);
        setSelectedMove(null);
        setHasSubmitted(false);
      }
    };

    const handleChatMessage = (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    };

    socket.on('game_state_update', handleStateUpdate);
    socket.on('rps_state_update', handleStateUpdate);
    socket.on('rps_round_resolved', handleRoundResolved);
    socket.on('game_over', handleGameOver);
    socket.on('rematch_status', handleRematchStatus);
    socket.on('chat_message', handleChatMessage);

    return () => {
      socket.off('game_state_update', handleStateUpdate);
      socket.off('rps_state_update', handleStateUpdate);
      socket.off('rps_round_resolved', handleRoundResolved);
      socket.off('game_over', handleGameOver);
      socket.off('rematch_status', handleRematchStatus);
      socket.off('chat_message', handleChatMessage);
    };
  }, [socket, currentUserId, player1?.userId, player2?.userId]);

  // Submit move securely
  const handleSubmitMove = (move) => {
    if (hasSubmitted || isRevealing || isCountingDown || isMatchOver || isSpectator) return;

    playClickSound();
    setSelectedMove(move);
    setHasSubmitted(true);

    socket.emit('rps_submit_move', {
      roomCode: normalizedCode,
      move
    });
  };

  const handleRequestRematch = () => {
    playClickSound();
    setRematchRequested(true);
    socket.emit('request_rematch', { roomCode: normalizedCode });
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    socket.emit('send_chat', {
      roomCode: normalizedCode,
      message: inputMessage.trim()
    });
    setInputMessage('');
  };

  // Determine which move to show on left and right
  const leftMove = isPlayer1 ? revealedP2Move : revealedP1Move;
  const rightMove = isPlayer1 ? revealedP1Move : revealedP2Move;

  const opponentSubmitted = isPlayer1
    ? player2?.hasSubmitted
    : player1?.hasSubmitted;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Match HUD */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Online 1v1 Clash
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Arena #{normalizedCode}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 dark:text-white">
            Cyber Duel: Best of 5
          </h2>
        </div>

        {/* Live Scoreboard */}
        <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800/90 px-6 py-2 rounded-2xl border border-slate-200 dark:border-white/10">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              {opponentPlayer?.username || 'Opponent'}
            </span>
            <div className="text-xl font-black font-mono text-cyan-400">
              {opponentPlayer?.score || 0}
            </div>
          </div>
          <div className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-400 font-mono font-bold text-xs">
            Round {gameState?.round || 1} / First to 3
          </div>
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              {myPlayer?.username || 'You'}
            </span>
            <div className="text-xl font-black font-mono text-pink-400">
              {myPlayer?.score || 0}
            </div>
          </div>
        </div>

        {/* Lock-in Status Badges */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              hasSubmitted
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-white/5'
            }`}
          >
            {hasSubmitted ? <Lock className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            <span>You: {hasSubmitted ? 'Locked In' : 'Choosing...'}</span>
          </div>

          <div
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              opponentSubmitted
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-white/5'
            }`}
          >
            {opponentSubmitted ? <Lock className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
            <span>Opponent: {opponentSubmitted ? 'Ready' : 'Thinking...'}</span>
          </div>
        </div>
      </div>

      {/* Main Duel Stage */}
      <RpsArenaView
        playerMove={rightMove}
        opponentMove={leftMove}
        isCountingDown={isCountingDown}
        countdownNumber={countdownNumber}
        timerSeconds={25}
        roundResult={roundResult}
        isRevealing={isRevealing}
        playerLabel={myPlayer?.username || 'You'}
        opponentLabel={opponentPlayer?.username || 'Opponent'}
        opponentIsRobot={false}
      />

      {/* Bottom Move Selection Buttons */}
      {!isSpectator && (
        <div className="p-4 sm:p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl flex flex-col items-center gap-4">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            {hasSubmitted
              ? 'Choice Encrypted & Locked — Waiting for opponent to lock in'
              : 'Choose your weapon in secret!'}
          </span>

          <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl">
            {/* Rock */}
            <button
              onClick={() => handleSubmitMove('rock')}
              disabled={hasSubmitted || isRevealing || isCountingDown || isMatchOver}
              className={`group p-4 sm:p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 select-none ${
                selectedMove === 'rock'
                  ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_20px_rgba(0,245,255,0.7)] scale-105'
                  : 'border-cyan-500/30 bg-slate-900/80 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-glow-cyan hover:-translate-y-1'
              } disabled:opacity-50 disabled:pointer-events-none`}
            >
              <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_10px_#00f5ff]">
                ✊
              </span>
              <span className="text-xs sm:text-sm font-black font-display tracking-wider text-cyan-400">
                ROCK
              </span>
            </button>

            {/* Scissors */}
            <button
              onClick={() => handleSubmitMove('scissors')}
              disabled={hasSubmitted || isRevealing || isCountingDown || isMatchOver}
              className={`group p-4 sm:p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 select-none ${
                selectedMove === 'scissors'
                  ? 'border-pink-400 bg-pink-500/20 shadow-[0_0_20px_rgba(236,72,153,0.7)] scale-105'
                  : 'border-pink-500/30 bg-slate-900/80 hover:border-pink-400 hover:bg-pink-500/10 hover:shadow-glow-pink hover:-translate-y-1'
              } disabled:opacity-50 disabled:pointer-events-none`}
            >
              <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_10px_#ec4899]">
                ✌️
              </span>
              <span className="text-xs sm:text-sm font-black font-display tracking-wider text-pink-400">
                SCISSORS
              </span>
            </button>

            {/* Paper */}
            <button
              onClick={() => handleSubmitMove('paper')}
              disabled={hasSubmitted || isRevealing || isCountingDown || isMatchOver}
              className={`group p-4 sm:p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 select-none ${
                selectedMove === 'paper'
                  ? 'border-purple-400 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.7)] scale-105'
                  : 'border-purple-500/30 bg-slate-900/80 hover:border-purple-400 hover:bg-purple-500/10 hover:shadow-[0_0_15px_#a855f7] hover:-translate-y-1'
              } disabled:opacity-50 disabled:pointer-events-none`}
            >
              <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform filter drop-shadow-[0_0_10px_#a855f7]">
                ✋
              </span>
              <span className="text-xs sm:text-sm font-black font-display tracking-wider text-purple-400">
                PAPER
              </span>
            </button>
          </div>
        </div>
      )}

      {/* In-Game Chat Bar */}
      <div className="p-4 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-lg">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400">
          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
          <span>In-Arena Chat</span>
        </div>

        <div className="h-20 overflow-y-auto space-y-1 pr-1 mb-3 text-xs">
          {chatMessages.length === 0 ? (
            <p className="text-slate-500 italic">No messages yet. Send a friendly taunt!</p>
          ) : (
            chatMessages.map((m, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-bold text-cyan-400">{m.sender}:</span>
                <span className="text-slate-300">{m.message}</span>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSendChat} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type arena chat message..."
            maxLength={100}
            className="flex-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Match Victory Modal */}
      {isMatchOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in zoom-in-95">
          <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border border-cyan-500/40 shadow-2xl space-y-6">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                matchWinner?.userId === currentUserId
                  ? 'bg-amber-400/20 text-amber-400 shadow-glow-yellow'
                  : 'bg-rose-500/20 text-rose-400'
              }`}
            >
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                Duel Concluded
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white mt-1">
                {matchWinner?.userId === currentUserId ? 'Victory Claimed!' : 'Match Lost!'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {matchWinner?.username} has conquered the Cyber Clash Arena!
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRequestRematch}
                disabled={rematchRequested}
                className="flex-1 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-glow-cyan transition-all disabled:opacity-50"
              >
                {rematchRequested ? 'Rematch Voted (Waiting...)' : 'Vote Rematch'}
              </button>

              <button
                onClick={onLeaveRoom}
                className="px-6 py-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
