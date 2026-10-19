import React, { useState } from 'react';
import { Bot, Users, Globe, Swords, Sparkles, Plus, KeyRound } from 'lucide-react';
import { RockPaperScissorsSolo } from '../components/games/rps/RockPaperScissorsSolo';
import { RockPaperScissorsLocal } from '../components/games/rps/RockPaperScissorsLocal';
import { playClickSound } from '../utils/audio';

export const RockPaperScissorsPage = ({ onOpenCreateRoom, onOpenJoinRoom }) => {
  const [activeTab, setActiveTab] = useState('solo'); // 'solo' | 'online' | 'local'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner & Mode Switcher */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Cyber Clash Arena
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
            Rock-Paper-Scissors 3D
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Engage in high-stakes cyber clashes. Play against neural AI, challenge friends online, or pass & play locally.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-white/10">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('solo');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'solo'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Solo AI</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('online');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'online'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Online 1v1</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setActiveTab('local');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'local'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Pass & Play</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Solo AI (Reference Image Style) */}
      {activeTab === 'solo' && <RockPaperScissorsSolo />}

      {/* Tab 2: Online 1v1 Multiplayer Launcher */}
      {activeTab === 'online' && (
        <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-2xl text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
            <Globe className="w-8 h-8 animate-pulse" />
          </div>

          <div>
            <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">
              Real-Time Online Duel
            </h2>
            <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
              Create a custom arena, share your 6-character room code, and engage in simultaneous hidden-move clashes with server verification!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              onClick={() => {
                playClickSound();
                if (onOpenCreateRoom) onOpenCreateRoom('rps');
              }}
              className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-glow-cyan transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Arena</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                if (onOpenJoinRoom) onOpenJoinRoom();
              }}
              className="py-3.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-purple-400" />
              <span>Join via Code</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Local 2-Player Pass & Play */}
      {activeTab === 'local' && <RockPaperScissorsLocal />}
    </div>
  );
};
