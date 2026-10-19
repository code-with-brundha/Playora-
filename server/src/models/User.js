import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { getDbStatus } from '../config/db.js';

const getCurrentWeekId = () => {
  const d = new Date();
  const year = d.getFullYear();
  const oneJan = new Date(year, 0, 1);
  const numberOfDays = Math.floor((d - oneJan) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
  return `${year}-W${weekNumber}`;
};

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username cannot exceed 20 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    avatar: {
      type: String,
      default: 'cyber-ninja'
    },
    bio: {
      type: String,
      default: 'Ready to play in the Playora Arena!'
    },
    settings: {
      theme: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
      soundMuted: { type: Boolean, default: false },
      mahjongTheme: {
        type: String,
        enum: ['classic-jade', 'royal-gold', 'pastel-dream', 'neon-galaxy'],
        default: 'neon-galaxy'
      }
    },
    stats: {
      gamesPlayed: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      winStreak: { type: Number, default: 0 },
      bestStreak: { type: Number, default: 0 },
      points: { type: Number, default: 1000 },
      xp: { type: Number, default: 0 }
    },
    weeklyStats: {
      wins: { type: Number, default: 0 },
      points: { type: Number, default: 1000 },
      weekId: { type: String, default: getCurrentWeekId }
    },
    mahjongStats: {
      gamesPlayed: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      bestTime: { type: Number, default: 0 }, // in seconds
      highScore: { type: Number, default: 0 }
    },
    rpsStats: {
      gamesPlayed: { type: Number, default: 0 },
      wins: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      bestStreak: { type: Number, default: 0 }
    },
    achievements: [
      {
        id: { type: String },
        name: { type: String },
        description: { type: String },
        icon: { type: String },
        unlockedAt: { type: Date, default: Date.now }
      }
    ],
    matchHistory: [
      {
        gameId: { type: String },
        gameType: { type: String, default: 'tictactoe' },
        opponentName: { type: String },
        opponentAvatar: { type: String },
        result: { type: String, enum: ['win', 'loss', 'draw'] },
        playedAt: { type: Date, default: Date.now }
      }
    ],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

// Mongoose hooks
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const MongoUser = mongoose.model('User', UserSchema);

// In-Memory Repository Fallback
const memoryUsers = new Map();

class MemoryUserDoc {
  constructor(data) {
    this._id = data._id || 'usr_' + Math.random().toString(36).substring(2, 9);
    this.username = data.username;
    this.email = data.email.toLowerCase();
    this.password = data.password;
    this.avatar = data.avatar || 'cyber-ninja';
    this.bio = data.bio || 'Ready to play in the Playora Arena!';
    this.settings = {
      theme: data.settings?.theme || 'dark',
      soundMuted: !!data.settings?.soundMuted,
      mahjongTheme: data.settings?.mahjongTheme || 'neon-galaxy'
    };
    this.stats = {
      gamesPlayed: data.stats?.gamesPlayed || 0,
      wins: data.stats?.wins || 0,
      losses: data.stats?.losses || 0,
      draws: data.stats?.draws || 0,
      winStreak: data.stats?.winStreak || 0,
      bestStreak: data.stats?.bestStreak || 0,
      points: data.stats?.points || 1000,
      xp: data.stats?.xp || 0
    };
    this.weeklyStats = {
      wins: data.weeklyStats?.wins || 0,
      points: data.weeklyStats?.points || 1000,
      weekId: data.weeklyStats?.weekId || getCurrentWeekId()
    };
    this.mahjongStats = {
      gamesPlayed: data.mahjongStats?.gamesPlayed || 0,
      wins: data.mahjongStats?.wins || 0,
      bestTime: data.mahjongStats?.bestTime || 0,
      highScore: data.mahjongStats?.highScore || 0
    };
    this.rpsStats = {
      gamesPlayed: data.rpsStats?.gamesPlayed || 0,
      wins: data.rpsStats?.wins || 0,
      losses: data.rpsStats?.losses || 0,
      draws: data.rpsStats?.draws || 0,
      currentStreak: data.rpsStats?.currentStreak || 0,
      bestStreak: data.rpsStats?.bestStreak || 0
    };
    this.achievements = data.achievements || [];
    this.matchHistory = data.matchHistory || [];
    this.resetPasswordToken = data.resetPasswordToken || null;
    this.resetPasswordExpires = data.resetPasswordExpires || null;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = new Date();
  }

  async comparePassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  }

  async save() {
    this.updatedAt = new Date();
    memoryUsers.set(this._id, this);
    return this;
  }

  toObject() {
    return {
      _id: this._id,
      username: this.username,
      email: this.email,
      avatar: this.avatar,
      bio: this.bio,
      settings: this.settings,
      stats: this.stats,
      weeklyStats: this.weeklyStats,
      mahjongStats: this.mahjongStats,
      rpsStats: this.rpsStats,
      achievements: this.achievements,
      matchHistory: this.matchHistory,
      createdAt: this.createdAt
    };
  }
}

// Unified User data access layer
export const User = {
  async findOne(query) {
    if (getDbStatus().connected) {
      return MongoUser.findOne(query);
    }
    for (const user of memoryUsers.values()) {
      if (query.email && user.email.toLowerCase() === query.email.toLowerCase()) return user;
      if (query.username && user.username.toLowerCase() === query.username.toLowerCase()) return user;
      if (query._id && user._id === query._id) return user;
      if (query.resetPasswordToken && user.resetPasswordToken === query.resetPasswordToken) return user;
    }
    return null;
  },

  async findById(id) {
    if (getDbStatus().connected) {
      return MongoUser.findById(id);
    }
    return memoryUsers.get(id) || null;
  },

  async create(data) {
    if (getDbStatus().connected) {
      return MongoUser.create(data);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newUser = new MemoryUserDoc({
      ...data,
      password: hashedPassword
    });
    await newUser.save();
    return newUser;
  },

  async find(query = {}) {
    if (getDbStatus().connected) {
      return MongoUser.find(query);
    }
    return Array.from(memoryUsers.values());
  },

  async deleteOne(query) {
    if (getDbStatus().connected) {
      return MongoUser.deleteOne(query);
    }
    if (query._id) {
      memoryUsers.delete(query._id);
    }
    return { deletedCount: 1 };
  },

  async getLeaderboard(type = 'all', limit = 25) {
    const currentWeek = getCurrentWeekId();

    if (getDbStatus().connected) {
      if (type === 'weekly') {
        return MongoUser.find({ 'weeklyStats.weekId': currentWeek }, 'username avatar stats weeklyStats mahjongStats createdAt')
          .sort({ 'weeklyStats.points': -1, 'weeklyStats.wins': -1 })
          .limit(limit);
      }
      return MongoUser.find({}, 'username avatar stats weeklyStats mahjongStats createdAt')
        .sort({ 'stats.points': -1, 'stats.wins': -1 })
        .limit(limit);
    }

    const all = Array.from(memoryUsers.values());
    if (type === 'weekly') {
      const filtered = all.filter((u) => u.weeklyStats && u.weeklyStats.weekId === currentWeek);
      filtered.sort((a, b) => b.weeklyStats.points - a.weeklyStats.points || b.weeklyStats.wins - a.weeklyStats.wins);
      return (filtered.length > 0 ? filtered : all).slice(0, limit).map((u) => u.toObject());
    }

    all.sort((a, b) => b.stats.points - a.stats.points || b.stats.wins - a.stats.wins);
    return all.slice(0, limit).map((u) => u.toObject());
  }
};
