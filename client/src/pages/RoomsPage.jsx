import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, RefreshCw, Plus, Swords, Globe, Sparkles } from 'lucide-react';
import { AvatarBadge } from '../components/common/AvatarBadge';
import { api } from '../utils/api';
import { playClickSound } from '../utils/audio';

export const RoomsPage = ({ onOpenCreateRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'waiting' | 'playing'
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await api.rooms.getAll();
      setRooms(data.rooms || []);
    } catch (e) {
      console.error('Failed to load rooms:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 12000);
    return () => clearInterval(interval);
  }, []);

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.roomName.toLowerCase().includes(search.toLowerCase()) ||
      r.roomCode.toLowerCase().includes(search.toLowerCase()) ||
      r.host.username.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'waiting') return r.status === 'waiting' && r.playersCount < r.maxPlayers;
    if (filter === 'playing') return r.status === 'playing';
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Live Arenas
            </span>
            <span className="text-xs text-slate-500">
              • {rooms.length} active public rooms
            </span>
          </div>
          <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white">
            Multiplayer Matchmaking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse open rooms or create your own custom gaming arena.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => {
              playClickSound();
              fetchRooms();
            }}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition-colors"
            title="Refresh Arenas"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              playClickSound();
              onOpenCreateRoom();
            }}
            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 text-white font-bold text-xs tracking-wide shadow-glow-cyan hover:opacity-95 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Arena</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl glass-panel border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by arena, code or host..."
            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['all', 'waiting', 'playing'].map((f) => (
            <button
              key={f}
              onClick={() => {
                playClickSound();
                setFilter(f);
              }}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === f
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {f === 'all' ? 'All Arenas' : f === 'waiting' ? 'Open Slots' : 'In Progress'}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      {loading && rooms.length === 0 ? (
        <div className="p-16 text-center text-xs text-slate-400 glass-panel rounded-3xl">
          Scanning multiplayer network...
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="p-16 text-center glass-panel rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
          <Users className="w-12 h-12 text-slate-400/50 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            No matching arenas found
          </h3>
          <p className="text-xs text-slate-400 mt-1 mb-6">
            Try adjusting your search or launch a new game arena right now!
          </p>
          <button
            onClick={() => {
              playClickSound();
              onOpenCreateRoom();
            }}
            className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-glow-cyan transition-all"
          >
            Create Match Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((r) => {
            const isFull = r.playersCount >= r.maxPlayers;
            return (
              <div
                key={r.roomCode}
                className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 hover:border-cyan-500/50 transition-all flex flex-col justify-between shadow-lg group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-cyan-500 dark:text-cyan-400 border border-slate-200 dark:border-white/5">
                      #{r.roomCode}
                    </span>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      r.status === 'playing'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        : isFull
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                    }`}>
                      {r.status === 'playing' ? 'In Progress' : `${r.playersCount}/${r.maxPlayers} Ready`}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                    {r.roomName}
                  </h3>

                  <div className="mt-4 flex items-center gap-3 p-2.5 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40">
                    <AvatarBadge avatarId={r.host?.avatar} size="sm" />
                    <div className="flex-1 truncate">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {r.host?.username}
                      </div>
                      <div className="text-[10px] text-slate-400">Host</div>
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500">
                      {r.gameType === 'tictactoe' ? 'Tic-Tac-Toe' : r.gameType}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80">
                  <button
                    onClick={() => {
                      playClickSound();
                      navigate(`/room/${r.roomCode}`);
                    }}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-glow-cyan"
                  >
                    <span>{isFull || r.status === 'playing' ? 'Spectate Match' : 'Enter Arena'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
