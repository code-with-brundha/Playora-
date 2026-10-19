import mongoose from 'mongoose';
import { getDbStatus } from '../config/db.js';

const RoomSchema = new mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    roomName: {
      type: String,
      default: 'Multiplayer Arena'
    },
    gameType: {
      type: String,
      default: 'tictactoe'
    },
    isPrivate: {
      type: Boolean,
      default: false
    },
    host: {
      userId: { type: String, required: true },
      username: { type: String, required: true },
      avatar: { type: String, default: 'cyber-ninja' }
    },
    players: [
      {
        socketId: { type: String },
        userId: { type: String },
        username: { type: String },
        avatar: { type: String },
        symbol: { type: String, default: null },
        isReady: { type: Boolean, default: false },
        score: { type: Number, default: 0 }
      }
    ],
    spectators: [
      {
        socketId: { type: String },
        userId: { type: String },
        username: { type: String }
      }
    ],
    status: {
      type: String,
      enum: ['waiting', 'playing', 'finished'],
      default: 'waiting'
    },
    maxPlayers: {
      type: Number,
      default: 2
    }
  },
  { timestamps: true, versionKey: false }
);

const MongoRoom = mongoose.model('Room', RoomSchema);

// In-Memory storage fallback
const memoryRooms = new Map();

class MemoryRoomDoc {
  constructor(data) {
    this._id = data._id || 'rm_' + Math.random().toString(36).substring(2, 9);
    this.roomCode = data.roomCode.toUpperCase();
    this.roomName = data.roomName || 'Multiplayer Arena';
    this.gameType = data.gameType || 'tictactoe';
    this.isPrivate = !!data.isPrivate;
    this.host = data.host;
    this.players = data.players || [];
    this.spectators = data.spectators || [];
    this.status = data.status || 'waiting';
    this.maxPlayers = data.maxPlayers || 2;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = new Date();
  }

  async save() {
    this.updatedAt = new Date();
    memoryRooms.set(this.roomCode, this);
    return this;
  }

  toObject() {
    return {
      _id: this._id,
      roomCode: this.roomCode,
      roomName: this.roomName,
      gameType: this.gameType,
      isPrivate: this.isPrivate,
      host: this.host,
      players: this.players,
      spectators: this.spectators,
      status: this.status,
      maxPlayers: this.maxPlayers,
      createdAt: this.createdAt
    };
  }
}

export const Room = {
  async findOne(query) {
    if (getDbStatus().connected) {
      return MongoRoom.findOne(query);
    }
    if (query.roomCode) {
      return memoryRooms.get(query.roomCode.toUpperCase()) || null;
    }
    for (const room of memoryRooms.values()) {
      if (query._id && room._id === query._id) return room;
    }
    return null;
  },

  async create(data) {
    if (getDbStatus().connected) {
      return MongoRoom.create(data);
    }
    const newRoom = new MemoryRoomDoc(data);
    await newRoom.save();
    return newRoom;
  },

  async find(query = {}) {
    if (getDbStatus().connected) {
      return MongoRoom.find(query);
    }
    let list = Array.from(memoryRooms.values());
    if (query.isPrivate !== undefined) {
      list = list.filter((r) => r.isPrivate === query.isPrivate);
    }
    if (query.status) {
      list = list.filter((r) => r.status === query.status);
    }
    return list;
  },

  async deleteOne(query) {
    if (getDbStatus().connected) {
      return MongoRoom.deleteOne(query);
    }
    if (query.roomCode) {
      memoryRooms.delete(query.roomCode.toUpperCase());
    }
    return { deletedCount: 1 };
  }
};
