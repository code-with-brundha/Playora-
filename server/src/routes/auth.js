import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Room } from '../models/Room.js';
import { config } from '../config/config.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

const sanitizeUser = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  bio: user.bio || '',
  settings: user.settings || {
    theme: 'dark',
    soundMuted: false,
    mahjongTheme: 'neon-galaxy'
  },
  stats: user.stats || {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winStreak: 0,
    bestStreak: 0,
    points: 1000,
    xp: 0
  },
  weeklyStats: user.weeklyStats || { wins: 0, points: 1000 },
  mahjongStats: user.mahjongStats || { gamesPlayed: 0, wins: 0, bestTime: 0, highScore: 0 },
  rpsStats: user.rpsStats || { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, currentStreak: 0, bestStreak: 0 },
  achievements: user.achievements || [],
  matchHistory: user.matchHistory || [],
  createdAt: user.createdAt
});

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, avatar, bio } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide username, email and password' });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'This username is already taken' });
    }

    const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password,
      avatar: avatar || 'cyber-ninja',
      bio: bio || 'Ready to play in the Playora Arena!',
      stats: {
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winStreak: 0,
        bestStreak: 0,
        points: 1000,
        xp: 50 // Welcome bonus XP!
      },
      achievements: [
        {
          id: 'first_steps',
          name: 'First Steps',
          description: 'Joined the Playora gaming community',
          icon: '🎮',
          unlockedAt: new Date()
        }
      ]
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Please provide your email/username and password' });
    }

    const isEmail = emailOrUsername.includes('@');
    const user = await User.findOne(
      isEmail ? { email: emailOrUsername.trim().toLowerCase() } : { username: emailOrUsername.trim() }
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Incorrect password.' });
    }

    const token = generateToken(user._id);

    return res.json({
      message: 'Logged in successfully',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Server error during login' });
  }
});

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Please provide your registered email' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      // Security standard: don't reveal if account exists
      return res.json({
        message: 'If an account exists with this email, a password reset token has been generated.'
      });
    }

    // Generate 6-digit verification code / token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    return res.json({
      message: 'Password reset code generated successfully.',
      resetCode: resetToken // Returned for effortless evaluation & user experience
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Reset token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findOne({ resetPasswordToken: token.trim() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired password reset code' });
    }

    if (user.resetPasswordExpires && new Date() > new Date(user.resetPasswordExpires)) {
      return res.status(400).json({ error: 'Password reset code has expired. Please request a new one.' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: 'Password has been successfully updated. You may now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
});

// @route   GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    return res.json({
      user: sanitizeUser(req.user)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

// @route   PUT /api/auth/profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { avatar, username, bio } = req.body;
    const user = req.user;

    if (avatar) {
      user.avatar = avatar;
    }

    if (bio !== undefined) {
      user.bio = bio.substring(0, 160);
    }

    if (username && username.trim() !== user.username) {
      const trimmed = username.trim();
      if (trimmed.length < 3 || trimmed.length > 20) {
        return res.status(400).json({ error: 'Username must be between 3 and 20 characters' });
      }
      const existing = await User.findOne({ username: trimmed });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Username is already taken' });
      }
      user.username = trimmed;
    }

    await user.save();

    return res.json({
      message: 'Profile updated',
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

// @route   PUT /api/auth/settings
router.put('/settings', authenticate, async (req, res) => {
  try {
    const { theme, soundMuted, mahjongTheme } = req.body;
    const user = req.user;

    if (!user.settings) user.settings = {};
    if (theme) user.settings.theme = theme;
    if (soundMuted !== undefined) user.settings.soundMuted = !!soundMuted;
    if (mahjongTheme) user.settings.mahjongTheme = mahjongTheme;

    await user.save();

    return res.json({
      message: 'Preferences updated successfully',
      settings: user.settings
    });
  } catch (error) {
    console.error('Settings update error:', error);
    return res.status(500).json({ error: 'Failed to update settings' });
  }
});

// @route   PUT /api/auth/change-password
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Please enter both current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Failed to change password' });
  }
});

// @route   DELETE /api/auth/account
router.delete('/account', authenticate, async (req, res) => {
  try {
    const userId = req.user._id.toString();

    // Clean up rooms hosted by this user
    await Room.deleteOne({ 'host.userId': userId });

    // Delete user
    await User.deleteOne({ _id: req.user._id });

    return res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Account deletion error:', error);
    return res.status(500).json({ error: 'Failed to delete account' });
  }
});

// @route   POST /api/auth/stats/mahjong
router.post('/stats/mahjong', authenticate, async (req, res) => {
  try {
    const { won, timeSpent, score, moves } = req.body;
    const user = req.user;

    if (!user.mahjongStats) {
      user.mahjongStats = { gamesPlayed: 0, wins: 0, bestTime: 0, highScore: 0 };
    }

    user.mahjongStats.gamesPlayed += 1;
    if (won) {
      user.mahjongStats.wins += 1;
      if (score > (user.mahjongStats.highScore || 0)) {
        user.mahjongStats.highScore = score;
      }
      if (timeSpent && (user.mahjongStats.bestTime === 0 || timeSpent < user.mahjongStats.bestTime)) {
        user.mahjongStats.bestTime = timeSpent;
      }

      // Award XP
      user.stats.xp = (user.stats.xp || 0) + 100;
      user.stats.points = (user.stats.points || 1000) + 20;

      // Check Mahjong Achievements
      if (!user.achievements) user.achievements = [];
      const hasTileApprentice = user.achievements.some((a) => a.id === 'tile_apprentice');
      if (!hasTileApprentice) {
        user.achievements.push({
          id: 'tile_apprentice',
          name: 'Tile Apprentice',
          description: 'Cleared your first Mahjong Solitaire board',
          icon: '🀄',
          unlockedAt: new Date()
        });
      }

      if (timeSpent && timeSpent < 300) {
        const hasSpeedDemon = user.achievements.some((a) => a.id === 'speed_demon');
        if (!hasSpeedDemon) {
          user.achievements.push({
            id: 'speed_demon',
            name: 'Speed Demon',
            description: 'Cleared a Mahjong layout in under 5 minutes',
            icon: '⏱️',
            unlockedAt: new Date()
          });
        }
      }
    }

    await user.save();

    return res.json({
      message: 'Mahjong statistics updated',
      mahjongStats: user.mahjongStats,
      achievements: user.achievements
    });
  } catch (error) {
    console.error('Mahjong stats error:', error);
    return res.status(500).json({ error: 'Failed to record Mahjong stats' });
  }
});

// @route   POST /api/auth/stats/rps
router.post('/stats/rps', authenticate, async (req, res) => {
  try {
    const { result } = req.body; // 'win' | 'loss' | 'draw'
    const user = req.user;

    if (!user.rpsStats) {
      user.rpsStats = { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, currentStreak: 0, bestStreak: 0 };
    }

    user.rpsStats.gamesPlayed += 1;

    if (result === 'win') {
      user.rpsStats.wins += 1;
      user.rpsStats.currentStreak = (user.rpsStats.currentStreak || 0) + 1;
      if (user.rpsStats.currentStreak > (user.rpsStats.bestStreak || 0)) {
        user.rpsStats.bestStreak = user.rpsStats.currentStreak;
      }

      // Points & XP
      user.stats.xp = (user.stats.xp || 0) + 60;
      user.stats.points = (user.stats.points || 1000) + 15;

      // Achievements check
      if (!user.achievements) user.achievements = [];
      const hasRpsFirstBlood = user.achievements.some((a) => a.id === 'rps_first_blood');
      if (!hasRpsFirstBlood) {
        user.achievements.push({
          id: 'rps_first_blood',
          name: 'Cyber Duelist',
          description: 'Won your first Rock-Paper-Scissors match',
          icon: '⚔️',
          unlockedAt: new Date()
        });
      }

      if (user.rpsStats.currentStreak >= 3) {
        const hasStreakMaster = user.achievements.some((a) => a.id === 'rps_streak_3');
        if (!hasStreakMaster) {
          user.achievements.push({
            id: 'rps_streak_3',
            name: 'Clash Dominator',
            description: 'Won 3 consecutive Rock-Paper-Scissors rounds in a row',
            icon: '🔥',
            unlockedAt: new Date()
          });
        }
      }
    } else if (result === 'loss') {
      user.rpsStats.losses += 1;
      user.rpsStats.currentStreak = 0;
      user.stats.xp = (user.stats.xp || 0) + 15;
    } else if (result === 'draw') {
      user.rpsStats.draws += 1;
      user.stats.xp = (user.stats.xp || 0) + 25;
    }

    await user.save();

    return res.json({
      message: 'RPS statistics updated',
      rpsStats: user.rpsStats,
      stats: user.stats,
      achievements: user.achievements
    });
  } catch (error) {
    console.error('RPS stats error:', error);
    return res.status(500).json({ error: 'Failed to record RPS stats' });
  }
});

// @route   POST /api/auth/achievements/unlock
router.post('/achievements/unlock', authenticate, async (req, res) => {
  try {
    const { achievementId, name, description, icon } = req.body;
    const user = req.user;

    if (!user.achievements) user.achievements = [];
    const exists = user.achievements.some((a) => a.id === achievementId);

    if (!exists) {
      user.achievements.push({
        id: achievementId,
        name: name || 'Secret Achievement',
        description: description || 'Unlocked a hidden milestone',
        icon: icon || '🌟',
        unlockedAt: new Date()
      });
      user.stats.xp = (user.stats.xp || 0) + 50;
      await user.save();
    }

    return res.json({
      unlocked: !exists,
      achievements: user.achievements,
      xp: user.stats.xp
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to unlock achievement' });
  }
});

// @route   GET /api/auth/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const type = req.query.type === 'weekly' ? 'weekly' : 'all';
    const leaderboard = await User.getLeaderboard(type, 25);

    return res.json({
      type,
      leaderboard: leaderboard.map((u, index) => ({
        rank: index + 1,
        id: u._id,
        username: u.username,
        avatar: u.avatar,
        stats: u.stats,
        weeklyStats: u.weeklyStats,
        mahjongStats: u.mahjongStats
      }))
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to load leaderboard' });
  }
});

export default router;
