import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Swords, Sparkles, Flame, RefreshCw, Calendar, Globe } from 'lucide-react';
import { AvatarBadge } from '../components/common/AvatarBadge';
import { api } from '../utils/api';
import { playClickSound } from '../utils/audio';

export const LeaderboardPage = ({ onOpenCreateRoom }) => {
  const [rankingType, setRankingType] = useState('all'); // 'all' | 'weekly'
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async (type) => {
    setLoading(true);
    try {
      const data = await api.auth.getLeaderboard(type || rankingType);
      setLeaderboard(data.leaderboard || []);
    } catch (e) {
      console.error('Failed to load leaderboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(rankingType);
  }, [rankingType]);

  const first = leaderboard[0];
  const second = leaderboard[1];
  const third = leaderboard[2];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold mb-3">
          <Trophy className="w-4 h-4" />
          <span>GLOBAL HALL OF FAME</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-slate-900 dark:text-white">
          Champion Rankings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
          Rankings generated directly from real database match records and verified ELO ratings.
        </p>

        {/* Tab Switcher: All-Time vs Weekly */}
        <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
          <button
            onClick={() => {
              playClickSound();
              setRankingType('all');
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              rankingType === 'all'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All-Time Masters</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              setRankingType('weekly');
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              rankingType === 'weekly'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Weekly Leaders</span>
          </button>
        </div>
      </div>

      {/* Podium for Top 3 */}
      {leaderboard.length >= 2 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-3xl mx-auto items-end pt-8">
          {/* 2nd Place */}
          {second && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <AvatarBadge avatarId={second.avatar} size="lg" />
                <div className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center border-2 border-white shadow-md">
                  2
                </div>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[90px] sm:max-w-none">
                {second.username}
              </span>
              <span className="text-[11px] font-mono text-cyan-500 font-bold">
                {rankingType === 'weekly' ? second.weeklyStats?.points || 1000 : second.stats?.points || 1000} PTS
              </span>

              <div className="w-full h-24 sm:h-32 mt-4 rounded-t-3xl bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700/60 border-t border-x border-slate-300 dark:border-white/10 flex items-center justify-center">
                <Medal className="w-8 h-8 text-slate-400" />
              </div>
            </div>
          )}

          {/* 1st Place */}
          {first && (
            <div className="flex flex-col items-center">
              <Crown className="w-8 h-8 text-amber-400 animate-bounce mb-1" />
              <div className="relative mb-3">
                <AvatarBadge avatarId={first.avatar} size="xl" />
                <div className="absolute -top-3 -right-2 w-8 h-8 rounded-full bg-amber-400 text-slate-900 font-black text-sm flex items-center justify-center border-2 border-white shadow-lg">
                  1
                </div>
              </div>
              <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate max-w-[100px] sm:max-w-none">
                {first.username}
              </span>
              <span className="text-xs font-mono text-amber-500 font-bold">
                {rankingType === 'weekly' ? first.weeklyStats?.points || 1000 : first.stats?.points || 1000} PTS
              </span>

              <div className="w-full h-32 sm:h-44 mt-4 rounded-t-3xl bg-gradient-to-t from-amber-500/30 to-amber-400/20 border-t-2 border-x border-amber-400/60 flex items-center justify-center shadow-glow-yellow">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {third && (
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <AvatarBadge avatarId={third.avatar} size="lg" />
                <div className="absolute -top-3 -right-2 w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-md">
                  3
                </div>
              </div>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-[90px] sm:max-w-none">
                {third.username}
              </span>
              <span className="text-[11px] font-mono text-cyan-500 font-bold">
                {rankingType === 'weekly' ? third.weeklyStats?.points || 1000 : third.stats?.points || 1000} PTS
              </span>

              <div className="w-full h-20 sm:h-24 mt-4 rounded-t-3xl bg-gradient-to-t from-amber-800/20 to-amber-700/10 border-t border-x border-amber-700/30 flex items-center justify-center">
                <Medal className="w-7 h-7 text-amber-700" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {rankingType === 'weekly' ? 'Weekly Standings' : 'All-Time Global Ladder'}
            </h3>
          </div>
          <button
            onClick={() => {
              playClickSound();
              fetchLeaderboard(rankingType);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Updating leaderboard...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No players ranked yet. Play a match to claim the crown!
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800/60">
            {leaderboard.map((player) => {
              const played = player.stats?.gamesPlayed || 0;
              const wins = player.stats?.wins || 0;
              const winPercent = played > 0 ? Math.round((wins / played) * 100) : 0;
              const pts = rankingType === 'weekly' ? player.weeklyStats?.points || 1000 : player.stats?.points || 1000;

              return (
                <div
                  key={player.id}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-center font-mono font-bold text-sm text-slate-400">
                      #{player.rank}
                    </span>
                    <AvatarBadge avatarId={player.avatar} size="sm" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {player.username}
                      </h4>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <span>{wins}W - {player.stats?.losses || 0}L</span>
                        {player.mahjongStats?.wins > 0 && (
                          <span>• {player.mahjongStats.wins} 🀄 Solved</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {winPercent}%
                      </div>
                      <div className="text-[10px] text-slate-400">Win Rate</div>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <div className="text-sm font-black font-mono text-cyan-500 dark:text-cyan-400">
                        {pts}
                      </div>
                      <div className="text-[10px] text-slate-400">Points</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div>
          <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
            Ready to climb the rankings?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Challenge players online or practice against the AI to level up your XP and rating.
          </p>
        </div>
        <button
          onClick={() => {
            playClickSound();
            onOpenCreateRoom();
          }}
          className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-glow-cyan transition-all flex items-center gap-2 whitespace-nowrap"
        >
          <Swords className="w-4 h-4" />
          <span>Launch Arena</span>
        </button>
      </div>
    </div>
  );
};
