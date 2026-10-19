import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

const getInitialGuest = () => {
  if (typeof window === 'undefined') {
    return {
      id: 'guest_101',
      username: 'GuestPlayer',
      avatar: 'cyber-ninja',
      isGuest: true,
      bio: 'Ready to play in the Playora Arena!',
      settings: { theme: 'dark', soundMuted: false, mahjongTheme: 'neon-galaxy' },
      stats: { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, points: 1000, xp: 0 },
      mahjongStats: { gamesPlayed: 0, wins: 0, bestTime: 0, highScore: 0 },
      achievements: []
    };
  }
  const savedGuest = localStorage.getItem('playora_guest');
  if (savedGuest) {
    try {
      return JSON.parse(savedGuest);
    } catch (e) {}
  }
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const newGuest = {
    id: `guest_${randomNum}`,
    username: `Guest_${randomNum}`,
    avatar: 'cyber-ninja',
    isGuest: true,
    bio: 'Casual guest challenger',
    settings: { theme: 'dark', soundMuted: false, mahjongTheme: 'neon-galaxy' },
    stats: { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, points: 1000, xp: 0 },
    mahjongStats: { gamesPlayed: 0, wins: 0, bestTime: 0, highScore: 0 },
    achievements: []
  };
  localStorage.setItem('playora_guest', JSON.stringify(newGuest));
  return newGuest;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('playora_token'));
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.auth.getMe();
          setUser({ ...res.user, isGuest: false });
        } catch (err) {
          console.warn('Failed to verify token, clearing session:', err.message);
          localStorage.removeItem('playora_token');
          setToken(null);
          setUser(getInitialGuest());
        }
      } else {
        setUser(getInitialGuest());
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (emailOrUsername, password) => {
    setIsLoading(true);
    try {
      const data = await api.auth.login({ emailOrUsername, password });
      localStorage.setItem('playora_token', data.token);
      setToken(data.token);
      setUser({ ...data.user, isGuest: false });
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, email, password, avatar, bio) => {
    setIsLoading(true);
    try {
      const data = await api.auth.register({ username, email, password, avatar, bio });
      localStorage.setItem('playora_token', data.token);
      setToken(data.token);
      setUser({ ...data.user, isGuest: false });
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('playora_token');
    setToken(null);
    const guest = getInitialGuest();
    setUser(guest);
  };

  const updateProfile = async (data) => {
    if (!user || user.isGuest) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('playora_guest', JSON.stringify(updated));
      return { success: true, user: updated };
    }

    try {
      const res = await api.auth.updateProfile(data);
      setUser({ ...res.user, isGuest: false });
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateSettings = async (settingsData) => {
    if (!user || user.isGuest) {
      const updated = {
        ...user,
        settings: { ...(user.settings || {}), ...settingsData }
      };
      setUser(updated);
      localStorage.setItem('playora_guest', JSON.stringify(updated));
      return { success: true, settings: updated.settings };
    }

    try {
      const res = await api.auth.updateSettings(settingsData);
      setUser((prev) => ({ ...prev, settings: res.settings }));
      return { success: true, settings: res.settings };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const res = await api.auth.changePassword(currentPassword, newPassword);
      return { success: true, message: res.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteAccount = async () => {
    try {
      await api.auth.deleteAccount();
      logout();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const recordMahjongStats = async (stats) => {
    if (!user || user.isGuest) {
      const current = user.mahjongStats || { gamesPlayed: 0, wins: 0, bestTime: 0, highScore: 0 };
      const updated = {
        ...user,
        mahjongStats: {
          gamesPlayed: current.gamesPlayed + 1,
          wins: stats.won ? current.wins + 1 : current.wins,
          highScore: Math.max(current.highScore, stats.score || 0),
          bestTime: stats.won && (current.bestTime === 0 || stats.timeSpent < current.bestTime) ? stats.timeSpent : current.bestTime
        }
      };
      setUser(updated);
      localStorage.setItem('playora_guest', JSON.stringify(updated));
      return { success: true };
    }

    try {
      const res = await api.auth.recordMahjongStats(stats);
      setUser((prev) => ({
        ...prev,
        mahjongStats: res.mahjongStats,
        achievements: res.achievements || prev.achievements
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const recordRpsStats = async (stats) => {
    if (!user || user.isGuest) {
      const current = user.rpsStats || { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, currentStreak: 0, bestStreak: 0 };
      const isWin = stats.result === 'win';
      const isLoss = stats.result === 'loss';
      const isDraw = stats.result === 'draw';
      const newStreak = isWin ? current.currentStreak + 1 : 0;
      const updated = {
        ...user,
        rpsStats: {
          gamesPlayed: current.gamesPlayed + 1,
          wins: isWin ? current.wins + 1 : current.wins,
          losses: isLoss ? current.losses + 1 : current.losses,
          draws: isDraw ? current.draws + 1 : current.draws,
          currentStreak: newStreak,
          bestStreak: Math.max(current.bestStreak, newStreak)
        }
      };
      setUser(updated);
      localStorage.setItem('playora_guest', JSON.stringify(updated));
      return { success: true };
    }

    try {
      const res = await api.auth.recordRpsStats(stats);
      setUser((prev) => ({
        ...prev,
        rpsStats: res.rpsStats,
        stats: res.stats || prev.stats,
        achievements: res.achievements || prev.achievements
      }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const unlockAchievement = async (achievementData) => {
    if (!user || user.isGuest) {
      const currentAch = user.achievements || [];
      if (!currentAch.some((a) => a.id === achievementData.achievementId)) {
        const updated = {
          ...user,
          achievements: [
            ...currentAch,
            {
              id: achievementData.achievementId,
              name: achievementData.name,
              description: achievementData.description,
              icon: achievementData.icon,
              unlockedAt: new Date()
            }
          ]
        };
        setUser(updated);
        localStorage.setItem('playora_guest', JSON.stringify(updated));
      }
      return;
    }

    try {
      const res = await api.auth.unlockAchievement(achievementData);
      if (res.unlocked) {
        setUser((prev) => ({
          ...prev,
          achievements: res.achievements,
          stats: { ...prev.stats, xp: res.xp }
        }));
      }
    } catch (err) {}
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const res = await api.auth.getMe();
        setUser({ ...res.user, isGuest: false });
      } catch (err) {}
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !user.isGuest,
        isGuest: !!user?.isGuest,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        updateSettings,
        changePassword,
        deleteAccount,
        recordMahjongStats,
        recordRpsStats,
        unlockAchievement,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
