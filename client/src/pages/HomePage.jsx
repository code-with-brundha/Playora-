import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Swords,
  Trophy,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  KeyRound,
  Play,
  Bot,
  Layers,
  Palette
} from 'lucide-react';
import { Card3D } from '../components/common/Card3D';
import { AvatarBadge } from '../components/common/AvatarBadge';
import { Logo } from '../components/common/Logo';
import { api } from '../utils/api';
import { playClickSound } from '../utils/audio';

export const HomePage = ({ onOpenCreateRoom, onOpenJoinRoom }) => {
  const [quickCode, setQuickCode] = useState('');
  const [publicRooms, setPublicRooms] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [matching, setMatching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsData, lbData] = await Promise.all([
          api.rooms.getAll().catch(() => ({ rooms: [] })),
          api.auth.getLeaderboard('all').catch(() => ({ leaderboard: [] }))
        ]);
        setPublicRooms(roomsData.rooms || []);
        setLeaderboard((lbData.leaderboard || []).slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchData();
  }, []);

  const handleQuickJoin = (e) => {
    e.preventDefault();
    if (!quickCode.trim()) return;
    playClickSound();
    navigate(`/room/${quickCode.trim().toUpperCase()}`);
  };

  const handleInstantMatchmaking = async () => {
    playClickSound();
    setMatching(true);
    try {
      const res = await api.rooms.quickMatch('tictactoe');
      navigate(`/room/${res.roomCode}`);
    } catch (err) {
      onOpenCreateRoom();
    } finally {
      setMatching(false);
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient neon lights matching Playora brand */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/15 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-600/15 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* 3D Floating Official Logo */}
          <div className="relative mb-6 group cursor-pointer animate-float">
            <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-purple-600 to-pink-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-500" />
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden bg-[#0a0f1d] p-1 border-2 border-cyan-400/50 shadow-glow-cyan transform transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Playora 3D Logo"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>



          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold tracking-wide mb-4">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span>PLAY ALONE • CHALLENGE AI • COMPETE WITH FRIENDS</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Next-Gen 3D <br />
            <span className="text-gradient-cyan-purple">Multiplayer & Solo Gaming</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Immerse yourself in authentic web gaming. Play solo Mahjong Solitaire across multiple layouts and themes, or conquer online arenas in real-time Tic-Tac-Toe.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleInstantMatchmaking}
              disabled={matching}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 text-white font-bold text-sm tracking-wide shadow-glow-cyan hover:shadow-glow-purple hover:opacity-95 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2.5"
            >
              <Zap className={`w-5 h-5 ${matching ? 'animate-spin' : ''}`} />
              <span>{matching ? 'Searching Arena...' : 'Quick Matchmaking'}</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onOpenCreateRoom();
              }}
              className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all transform hover:-translate-y-1 shadow-md flex items-center justify-center gap-2"
            >
              <Swords className="w-4 h-4 text-cyan-400" />
              <span>Host Custom Room</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onOpenJoinRoom();
              }}
              className="px-6 py-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-all transform hover:-translate-y-1 shadow-md flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-purple-400" />
              <span>Enter Code</span>
            </button>
          </div>

          {/* Quick Room Code Input Bar */}
          <form
            onSubmit={handleQuickJoin}
            className="mt-6 max-w-md w-full mx-auto p-1.5 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 shadow-lg flex items-center gap-2"
          >
            <input
              type="text"
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
              placeholder="QUICK ENTER CODE (e.g. K9TX2A)"
              maxLength={8}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm font-mono uppercase font-bold tracking-widest bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>Join</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>

      {/* Featured 3D Game Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-500">
              Featured Gaming Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white mt-1">
              Select Your Game
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Playable solo against AI, with local friends, or live online
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Mahjong Solitaire 3D (ACTIVE SINGLE-PLAYER) */}
          <Card3D depth={25} glowColor="rgba(176, 38, 255, 0.35)">
            <div className="p-6 rounded-3xl glass-panel border border-purple-500/40 relative overflow-hidden flex flex-col justify-between h-full group">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-glow-purple">
                    🀄
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    SOLO SOLITAIRE
                  </span>
                </div>

                <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">
                  Mahjong Solitaire 3D
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  The complete single-player puzzle. 4 board layouts (Turtle, Fortress, Dragon, Starter), 4 visual themes (Jade, Royal Gold, Pastel, Neon Galaxy), hints, and undo.
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">1 Player (Solo)</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">4 Themes</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Multi-Layout</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <Link
                  to="/games/mahjong"
                  onClick={playClickSound}
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-glow-purple transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Mahjong Solitaire</span>
                </Link>
              </div>
            </div>
          </Card3D>

          {/* Card 2: Tic-Tac-Toe 3D (ACTIVE MULTI-MODE) */}
          <Card3D depth={25} glowColor="rgba(0, 245, 255, 0.35)">
            <div className="p-6 rounded-3xl glass-panel border border-cyan-500/40 relative overflow-hidden flex flex-col justify-between h-full group">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white font-black text-2xl shadow-glow-cyan">
                    #
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    3 MODES ACTIVE
                  </span>
                </div>

                <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">
                  Tic-Tac-Toe 3D
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Play against the smart Minimax AI, pass & play locally with a friend on the same screen, or launch an online room with live chat and synchronized turns.
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Vs AI (3 Levels)</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Pass & Play</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Online Match</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <Link
                  to="/games/tictactoe"
                  onClick={playClickSound}
                  className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-glow-cyan transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Tic-Tac-Toe</span>
                </Link>
              </div>
            </div>
          </Card3D>

          {/* Card 3: Rock-Paper-Scissors 3D */}
          <Card3D depth={25} glowColor="rgba(236, 72, 153, 0.4)">
            <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 relative overflow-hidden flex flex-col justify-between h-full group hover:border-pink-500/50 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-glow-pink transform group-hover:scale-110 transition-transform">
                    ✊
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-pink-400" />
                    PLAYABLE
                  </span>
                </div>

                <h3 className="text-xl font-black font-display text-slate-900 dark:text-white">
                  Rock-Paper-Scissors 3D
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Cyber hand clashes on the neon battle pedestal! Challenge adaptive neural AI or play online with simultaneous hidden moves.
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Solo AI Bot</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Online 1v1</span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">Pass & Play</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                <Link
                  to="/games/rps"
                  onClick={playClickSound}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-xs shadow-glow-pink transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Play Rock-Paper-Scissors</span>
                </Link>
              </div>
            </div>
          </Card3D>
        </div>
      </section>

      {/* Public Rooms & Leaderboard Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Public Rooms */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-500" />
                  Live Public Arenas
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Jump straight into open games or spectate ongoing matches
                </p>
              </div>
              <Link
                to="/rooms"
                onClick={playClickSound}
                className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loadingRooms ? (
              <div className="p-8 text-center text-xs text-slate-400 glass-panel rounded-3xl">
                Scanning multiplayer network...
              </div>
            ) : publicRooms.length === 0 ? (
              <div className="p-8 text-center glass-panel rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No public arenas waiting right now.
                </p>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Launch a room or test the instant quick matchmaking!
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleInstantMatchmaking}
                    className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Quick Match
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      onOpenCreateRoom();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold"
                  >
                    Host Room
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {publicRooms.slice(0, 4).map((r) => (
                  <div
                    key={r.roomCode}
                    className="p-4 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <AvatarBadge avatarId={r.host?.avatar} size="sm" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {r.roomName}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="font-mono text-cyan-500 font-bold">{r.roomCode}</span>
                          <span>•</span>
                          <span>Host: {r.host?.username}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${r.status === 'playing'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        }`}>
                        {r.status === 'playing' ? 'In Progress' : `${r.playersCount}/${r.maxPlayers} Ready`}
                      </span>

                      <button
                        onClick={() => {
                          playClickSound();
                          navigate(`/room/${r.roomCode}`);
                        }}
                        className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mini Leaderboard Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Top Champions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Global verified players
                </p>
              </div>
              <Link
                to="/leaderboard"
                onClick={playClickSound}
                className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1"
              >
                <span>Full Board</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="rounded-3xl glass-panel p-5 border border-slate-200 dark:border-white/10 shadow-lg space-y-3">
              {leaderboard.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  Play matches to claim the #1 spot on the leaderboard!
                </div>
              ) : (
                leaderboard.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-white/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${player.rank === 1
                          ? 'bg-amber-400 text-slate-900'
                          : player.rank === 2
                            ? 'bg-slate-300 text-slate-900'
                            : player.rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}>
                        {player.rank}
                      </div>
                      <AvatarBadge avatarId={player.avatar} size="sm" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {player.username}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {player.stats?.wins || 0} Wins
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-500 dark:text-cyan-400">
                      {player.stats?.points || 1000} PTS
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
