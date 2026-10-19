import React from 'react';
import { Trophy, Check, Lock, Sparkles, Star } from 'lucide-react';

export const ALL_ACHIEVEMENTS = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Joined the Playora gaming community',
    icon: '🎮',
    xp: 50,
    category: 'General'
  },
  {
    id: 'victory_royale',
    name: 'Victory Royale',
    description: 'Won your first Tic-Tac-Toe match',
    icon: '🏆',
    xp: 50,
    category: 'Tic-Tac-Toe'
  },
  {
    id: 'lightning_strike',
    name: 'Lightning Strike',
    description: 'Won a match in 5 moves or less',
    icon: '⚡',
    xp: 75,
    category: 'Tic-Tac-Toe'
  },
  {
    id: 'machine_slayer',
    name: 'Machine Slayer',
    description: 'Defeated the Hard Minimax AI',
    icon: '🤖',
    xp: 100,
    category: 'Tic-Tac-Toe'
  },
  {
    id: 'tactician',
    name: 'Tactician',
    description: 'Maintained a 3-match win streak',
    icon: '🔥',
    xp: 100,
    category: 'Tic-Tac-Toe'
  },
  {
    id: 'tile_apprentice',
    name: 'Tile Apprentice',
    description: 'Cleared your first Mahjong Solitaire board',
    icon: '🀄',
    xp: 100,
    category: 'Mahjong'
  },
  {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Cleared Mahjong in under 5 minutes',
    icon: '⏱️',
    xp: 120,
    category: 'Mahjong'
  },
  {
    id: 'zen_master',
    name: 'Zen Master',
    description: 'Cleared a Mahjong board without shuffling',
    icon: '🧘',
    xp: 150,
    category: 'Mahjong'
  },
  {
    id: 'social_butterfly',
    name: 'Social Gamer',
    description: 'Played an online multiplayer match with a friend',
    icon: '🌐',
    xp: 50,
    category: 'Multiplayer'
  },
  {
    id: 'grandmaster',
    name: 'Grandmaster',
    description: 'Achieved 1200+ global rating points',
    icon: '👑',
    xp: 200,
    category: 'Rank'
  }
];

export const AchievementsList = ({ userAchievements = [] }) => {
  const unlockedMap = new Map();
  userAchievements.forEach((a) => {
    unlockedMap.set(a.id, a);
  });

  const unlockedCount = userAchievements.length;
  const totalCount = ALL_ACHIEVEMENTS.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Overall Progress Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Achievement Progress
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Unlock milestones across Tic-Tac-Toe, Mahjong Solitaire and Multiplayer to earn XP.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-36 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-cyan-500 dark:text-cyan-400 whitespace-nowrap">
            {unlockedCount} / {totalCount} ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ALL_ACHIEVEMENTS.map((item) => {
          const unlockedItem = unlockedMap.get(item.id);
          const isUnlocked = !!unlockedItem;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                isUnlocked
                  ? 'glass-panel border-cyan-500/40 shadow-glow-cyan/20 bg-cyan-500/5'
                  : 'bg-slate-100/40 dark:bg-slate-800/30 border-slate-200/50 dark:border-white/5 opacity-70'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform ${
                  isUnlocked
                    ? 'bg-gradient-to-tr from-cyan-400/20 to-purple-500/20 border border-cyan-400/50 shadow-md transform hover:scale-110'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 grayscale'
                }`}
              >
                {item.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {item.name}
                  </h5>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    +{item.xp} XP
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500">
                    {item.category}
                  </span>
                  {isUnlocked ? (
                    <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Unlocked
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
