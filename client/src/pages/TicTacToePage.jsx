import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Users, Globe, Swords, Sparkles, KeyRound } from 'lucide-react';
import { TicTacToeLocal } from '../components/games/tictactoe/TicTacToeLocal';
import { api } from '../utils/api';
import { playClickSound } from '../utils/audio';

export const TicTacToePage = ({ onOpenCreateRoom, onOpenJoinRoom }) => {
  const [activeTab, setActiveTab] = useState('ai'); // 'ai' | 'online'
  const [quickCode, setQuickCode] = useState('');
  const [matching, setMatching] = useState(false);
  const navigate = useNavigate();

  const handleQuickMatch = async () => {
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

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (!quickCode.trim()) return;
    playClickSound();
    navigate(`/room/${quickCode.trim().toUpperCase()}`);
  };

  return (
    <div className="pb-16">
      {/* Top Navigation Tabs */}
      <div className="max-w-4xl mx-auto px-4 pt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => {
            playClickSound();
            setActiveTab('ai');
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ai'
              ? 'bg-cyan-500 text-white shadow-glow-cyan'
              : 'glass-panel text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Solo & Local Play</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveTab('online');
          }}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'online'
              ? 'bg-purple-500 text-white shadow-glow-purple'
              : 'glass-panel text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Online Multiplayer</span>
        </button>
      </div>

      {activeTab === 'ai' ? (
        <TicTacToeLocal onSwitchToOnline={() => setActiveTab('online')} />
      ) : (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-in fade-in">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Online Matchmaking
            </span>
            <h1 className="text-3xl font-black font-display text-slate-900 dark:text-white mt-1">
              Tic-Tac-Toe Multiplayer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Play in real-time with server-side validation, 30-second turn clocks, and live room chat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Quick Match Card */}
            <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                  <Swords className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Instant Matchmaking
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Automatically pairs you with an opponent waiting in a public lobby or sets up a new arena.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={handleQuickMatch}
                  disabled={matching}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs shadow-glow-cyan hover:opacity-95 transition-all flex items-center justify-center gap-2"
                >
                  <Swords className="w-4 h-4" />
                  <span>{matching ? 'Searching Arena...' : 'Find Match Now'}</span>
                </button>
              </div>
            </div>

            {/* Custom Room Card */}
            <div className="p-6 rounded-3xl glass-panel border border-purple-500/30 flex flex-col justify-between shadow-xl">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Private Room Invite
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Create a custom room to share with a specific friend or enter their 6-character invite code.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <button
                  onClick={() => {
                    playClickSound();
                    onOpenCreateRoom();
                  }}
                  className="w-full py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 text-white font-bold text-xs shadow-glow-purple transition-all"
                >
                  Create Custom Room
                </button>

                <form onSubmit={handleCodeSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={quickCode}
                    onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    maxLength={8}
                    className="flex-1 px-3 py-2 text-xs font-mono uppercase font-bold tracking-widest rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold"
                  >
                    Join
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
