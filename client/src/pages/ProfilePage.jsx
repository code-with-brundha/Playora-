import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Swords,
  Zap,
  Flame,
  Shield,
  History,
  Edit3,
  Check,
  Star,
  Settings,
  Sparkles,
  Lock,
  Trash2,
  Volume2,
  VolumeX,
  Palette,
  User,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AvatarBadge } from '../components/common/AvatarBadge';
import { AvatarPicker } from '../components/common/AvatarPicker';
import { AchievementsList } from '../components/common/AchievementsList';
import { Modal } from '../components/common/Modal';
import { Card3D } from '../components/common/Card3D';
import { playClickSound, toggleMute, getMuteState } from '../utils/audio';

export const ProfilePage = () => {
  const {
    user,
    isGuest,
    updateProfile,
    updateSettings,
    changePassword,
    deleteAccount,
    refreshUser
  } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'cyber-ninja');
  const [savingAvatar, setSavingAvatar] = useState(false);

  // Settings State
  const [bio, setBio] = useState(user?.bio || '');
  const [mahjongTheme, setMahjongTheme] = useState(
    user?.settings?.mahjongTheme || 'neon-galaxy'
  );
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ error: '', success: '' });
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (user?.avatar) setSelectedAvatar(user.avatar);
    if (user?.bio) setBio(user.bio);
    if (user?.settings?.mahjongTheme) setMahjongTheme(user.settings.mahjongTheme);
  }, [user]);

  const stats = user?.stats || {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winStreak: 0,
    bestStreak: 0,
    points: 1000,
    xp: 0
  };

  const mahjongStats = user?.mahjongStats || {
    gamesPlayed: 0,
    wins: 0,
    bestTime: 0,
    highScore: 0
  };

  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.wins / stats.gamesPlayed) * 100)
      : 0;

  const handleSaveAvatar = async () => {
    setSavingAvatar(true);
    playClickSound();
    await updateProfile({ avatar: selectedAvatar });
    setSavingAvatar(false);
    setIsEditingAvatar(false);
  };

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    playClickSound();
    await updateProfile({ bio });
    await updateSettings({ mahjongTheme });
    setSettingsSuccess('Preferences saved successfully!');
    setTimeout(() => setSettingsSuccess(''), 3000);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ error: '', success: '' });
    if (!currentPassword || !newPassword) {
      setPasswordMsg({ error: 'Please enter both current and new password', success: '' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ error: 'New password must be at least 6 characters', success: '' });
      return;
    }

    playClickSound();
    const res = await changePassword(currentPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ error: '', success: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setPasswordMsg({ error: res.error || 'Failed to change password', success: '' });
    }
  };

  const handleDeleteAccount = async () => {
    playClickSound();
    const res = await deleteAccount();
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Player Header Banner */}
      <div className="relative rounded-3xl glass-panel p-6 sm:p-10 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
          <div className="relative group">
            <AvatarBadge avatarId={user?.avatar} size="xl" />
            <button
              onClick={() => {
                playClickSound();
                setIsEditingAvatar(true);
              }}
              className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-slate-900/90 text-cyan-400 border border-cyan-500/40 hover:scale-110 transition-transform shadow-lg"
              title="Change Avatar"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
                {user?.username}
              </h1>
              {isGuest ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Guest Champion
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
                  Verified Player
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {user?.bio || 'Ready to battle in the Playora Arena!'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-amber-500 font-bold">{stats.points}</span> ELO Points
              </span>

              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="font-mono text-purple-400 font-bold">{stats.xp || 0}</span> XP
              </span>

              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-mono text-orange-500 font-bold">{stats.winStreak}</span> Streak
              </span>

              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-cyan-500 font-bold">{winRate}%</span> Win Rate
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Battle Records & Stats', icon: Trophy },
          { id: 'achievements', label: 'Achievements', icon: Sparkles },
          { id: 'settings', label: 'Account Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound();
                setActiveTab(tab.id);
                setSearchParams({ tab: tab.id });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-cyan-500 text-white shadow-glow-cyan'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card3D depth={10} glowColor="rgba(0, 245, 255, 0.2)">
              <div className="p-5 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Tic-Tac-Toe Matches
                </span>
                <div className="text-3xl font-black font-display text-slate-900 dark:text-white mt-1">
                  {stats.gamesPlayed}
                </div>
              </div>
            </Card3D>

            <Card3D depth={10} glowColor="rgba(16, 185, 129, 0.2)">
              <div className="p-5 rounded-3xl glass-panel border border-emerald-500/20 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                  Arena Wins
                </span>
                <div className="text-3xl font-black font-display text-emerald-500 dark:text-emerald-400 mt-1">
                  {stats.wins}
                </div>
              </div>
            </Card3D>

            <Card3D depth={10} glowColor="rgba(168, 85, 247, 0.2)">
              <div className="p-5 rounded-3xl glass-panel border border-purple-500/20 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  Mahjong Solved
                </span>
                <div className="text-3xl font-black font-display text-purple-400 mt-1">
                  {mahjongStats.wins}
                </div>
              </div>
            </Card3D>

            <Card3D depth={10} glowColor="rgba(245, 158, 11, 0.2)">
              <div className="p-5 rounded-3xl glass-panel border border-amber-500/20 text-center">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                  Best Streak
                </span>
                <div className="text-3xl font-black font-display text-amber-500 dark:text-amber-400 mt-1">
                  {stats.bestStreak}
                </div>
              </div>
            </Card3D>
          </div>

          {/* Match History */}
          <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <History className="w-5 h-5 text-cyan-500" />
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                  Match History
                </h3>
              </div>
              <span className="text-xs text-slate-400">Verified server logs</span>
            </div>

            {!user?.matchHistory || user.matchHistory.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Swords className="w-10 h-10 mx-auto text-slate-400/50 mb-2" />
                <p className="text-sm font-semibold">No recorded matches yet.</p>
                <p className="text-xs">Hop into an arena to start your competitive record!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {user.matchHistory.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-white/5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <AvatarBadge avatarId={m.opponentAvatar || 'cyber-ninja'} size="sm" />
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                          vs {m.opponentName || 'Unknown Opponent'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {m.gameType === 'tictactoe' ? 'Tic-Tac-Toe 3D' : m.gameType} • Room #{m.gameId}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                        m.result === 'win'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : m.result === 'loss'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {m.result}
                      </span>

                      <span className="text-[11px] text-slate-400 font-mono hidden sm:block">
                        {m.playedAt ? new Date(m.playedAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Achievements */}
      {activeTab === 'achievements' && (
        <div className="animate-in fade-in">
          <AchievementsList userAchievements={user?.achievements || []} />
        </div>
      )}

      {/* Tab 3: Account Settings */}
      {activeTab === 'settings' && (
        <div className="space-y-8 animate-in fade-in max-w-2xl">
          {settingsSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              {settingsSuccess}
            </div>
          )}

          {/* Preferences Form */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-cyan-400" />
              Gamer Preferences
            </h3>

            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Player Bio / Status Quote
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell other champions about your play style..."
                  maxLength={120}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Favorite Mahjong Theme
                </label>
                <select
                  value={mahjongTheme}
                  onChange={(e) => setMahjongTheme(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="neon-galaxy">Neon Galaxy (Signature Playora)</option>
                  <option value="classic-jade">Classic Jade (Traditional Velvet)</option>
                  <option value="royal-gold">Royal Gold (Luxury Onyx)</option>
                  <option value="pastel-dream">Pastel Dream (Soft Twilight)</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-sm transition-all"
              >
                Save Preferences
              </button>
            </form>
          </div>

          {/* Change Password Form (Registered users) */}
          {!isGuest && (
            <div className="p-6 rounded-3xl glass-panel border border-slate-200 dark:border-white/10 shadow-xl space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-400" />
                Change Password
              </h3>

              {passwordMsg.error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
                  {passwordMsg.error}
                </div>
              )}
              {passwordMsg.success && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  {passwordMsg.success}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* Danger Zone: Account Deletion */}
          <div className="p-6 rounded-3xl glass-panel border border-rose-500/30 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-rose-500 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-500" />
              Danger Zone: Account Deletion
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Permanently remove your account, statistics, leaderboards rankings, and game records from Playora.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/30 text-xs font-bold transition-all"
            >
              Delete Playora Account
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full text-center border border-rose-500/40 shadow-2xl space-y-4">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Permanently Delete Account?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              This action cannot be undone. All your ratings, match logs, and stats will be permanently erased.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-3 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Yes, Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Avatar Modal */}
      <Modal
        isOpen={isEditingAvatar}
        onClose={() => setIsEditingAvatar(false)}
        title="Choose Champion Avatar"
      >
        <div className="space-y-6">
          <AvatarPicker
            selectedAvatar={selectedAvatar}
            onSelect={setSelectedAvatar}
          />
          <button
            onClick={handleSaveAvatar}
            disabled={savingAvatar}
            className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm shadow-glow-cyan transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{savingAvatar ? 'Updating...' : 'Save Avatar'}</span>
          </button>
        </div>
      </Modal>
    </div>
  );
};
