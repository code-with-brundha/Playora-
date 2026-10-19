import React, { useState } from 'react';
import { Copy, Check, Users, Sparkles, Shield, Share2, Swords, UserCheck, AlertCircle } from 'lucide-react';
import { AvatarBadge } from '../common/AvatarBadge';
import { Card3D } from '../common/Card3D';
import { RoomChat } from './RoomChat';
import { useSocket } from '../../context/SocketContext';
import { playClickSound } from '../../utils/audio';

export const RoomLobby = ({ room, currentUserId }) => {
  const { toggleReady } = useSocket();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const players = room?.players || [];
  const player1 = players[0];
  const player2 = players[1];

  const currentPlayer = players.find((p) => p.userId === currentUserId || p.socketId === currentUserId);
  const isCurrentPlayerReady = currentPlayer?.isReady;

  const handleCopyCode = () => {
    playClickSound();
    navigator.clipboard.writeText(room.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    playClickSound();
    const link = `${window.location.origin}/room/${room.roomCode}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleReady = () => {
    playClickSound();
    toggleReady(room.roomCode);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Banner: Arena Info & Invite Code */}
      <div className="relative rounded-3xl glass-panel p-6 sm:p-8 mb-8 border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Lobby Waiting Room
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                • {room?.gameType === 'tictactoe' ? 'Tic-Tac-Toe 3D' : room?.gameType}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
              {room?.roomName || 'Multiplayer Arena'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Share the room code or invite link with a friend to play together in real-time.
            </p>
          </div>

          {/* Room Code Card with One-Click Copy */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-white/10 rounded-2xl p-2.5 px-4 flex items-center justify-between gap-4 w-full sm:w-auto shadow-inner">
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Room Code
                </div>
                <div className="text-2xl font-black font-mono tracking-widest text-cyan-500 dark:text-cyan-400">
                  {room?.roomCode}
                </div>
              </div>
              <button
                onClick={handleCopyCode}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white transition-all shadow-sm flex items-center gap-1.5 text-xs font-bold"
                title="Copy Room Code"
              >
                {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-white/10 hover:border-purple-500 text-slate-700 dark:text-slate-200 hover:text-purple-400 transition-all flex items-center gap-2 text-xs font-bold w-full sm:w-auto justify-center"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-purple-400" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Players Versus Matchup & Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Player 1 vs Player 2 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            {/* Player 1 Card */}
            <Card3D depth={15} glowColor="rgba(0, 245, 255, 0.3)">
              <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 flex flex-col items-center text-center relative overflow-hidden h-full">
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-bold">
                  Symbol: X (Host)
                </div>

                <div className="mt-8 mb-4">
                  <AvatarBadge avatarId={player1?.avatar} size="xl" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {player1?.username || 'Host Player'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Player 1</p>

                <div className="mt-6 w-full pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center">
                  {player1?.isReady ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                      <Check className="w-3.5 h-3.5" /> READY
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> NOT READY
                    </span>
                  )}
                </div>
              </div>
            </Card3D>

            {/* VS Badge floating between */}
            <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 p-0.5 shadow-xl items-center justify-center">
              <div className="w-full h-full bg-[#0d1117] rounded-full flex items-center justify-center">
                <span className="text-xs font-black font-display text-white">VS</span>
              </div>
            </div>

            {/* Player 2 Card (Or waiting for challenger) */}
            <Card3D depth={15} glowColor="rgba(255, 0, 127, 0.3)">
              {player2 ? (
                <div className="p-6 rounded-3xl glass-panel border border-pink-500/30 flex flex-col items-center text-center relative overflow-hidden h-full">
                  <div className="absolute top-4 left-4 px-2.5 py-1 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-mono font-bold">
                    Symbol: O (Challenger)
                  </div>

                  <div className="mt-8 mb-4">
                    <AvatarBadge avatarId={player2?.avatar} size="xl" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {player2?.username}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Player 2</p>

                  <div className="mt-6 w-full pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    {player2?.isReady ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                        <Check className="w-3.5 h-3.5" /> READY
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" /> NOT READY
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-3xl glass-panel border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mb-4 relative">
                    <span className="w-16 h-16 rounded-full border-2 border-dashed border-cyan-500 animate-spin absolute" />
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                    Waiting for Opponent...
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mb-5">
                    Share your Room Code <span className="font-mono text-cyan-400 font-bold">{room?.roomCode}</span> with a friend.
                  </p>

                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-cyan-500 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Room Code</span>
                  </button>
                </div>
              )}
            </Card3D>
          </div>

          {/* Action Center: Ready Up or Spectating */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500">
                <Swords className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Match Readiness
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {players.length < 2
                    ? 'Waiting for 2nd player to enter the arena...'
                    : 'Both players must toggle Ready to begin the real-time match.'}
                </p>
              </div>
            </div>

            {currentPlayer ? (
              <button
                onClick={handleToggleReady}
                disabled={players.length < 2}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all transform hover:-translate-y-0.5 shadow-lg ${
                  isCurrentPlayerReady
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-400'
                    : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-95 text-white shadow-glow-cyan'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isCurrentPlayerReady ? '✓ YOU ARE READY' : 'CLICK TO READY UP'}
              </button>
            ) : (
              <div className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                Spectating Arena
              </div>
            )}
          </div>
        </div>

        {/* Right Col: In-Room Live Chat */}
        <div className="lg:col-span-1 h-full min-h-[420px]">
          <RoomChat roomCode={room?.roomCode} />
        </div>
      </div>
    </div>
  );
};
