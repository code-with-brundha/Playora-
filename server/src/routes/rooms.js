import express from 'express';
import { Room } from '../models/Room.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// @route   POST /api/rooms/quick-match
router.post('/quick-match', optionalAuth, async (req, res) => {
  try {
    const { gameType = 'tictactoe' } = req.body;
    const publicRooms = await Room.find({ isPrivate: false, status: 'waiting', gameType });

    // Look for an available room with 1 player waiting
    const openRoom = publicRooms.find((r) => (r.players || []).length === 1);
    if (openRoom) {
      return res.json({
        roomCode: openRoom.roomCode,
        roomName: openRoom.roomName,
        isNew: false
      });
    }

    // Otherwise create a fresh quick room
    let roomCode = generateRoomCode();
    let existing = await Room.findOne({ roomCode });
    let attempts = 0;
    while (existing && attempts < 5) {
      roomCode = generateRoomCode();
      existing = await Room.findOne({ roomCode });
      attempts++;
    }

    const hostUser = req.user || {
      _id: 'guest_' + Math.random().toString(36).substring(2, 9),
      username: req.body.username || 'Challenger',
      avatar: req.body.avatar || 'cyber-ninja'
    };

    const newRoom = await Room.create({
      roomCode,
      roomName: `Quick Arena #${roomCode}`,
      gameType,
      isPrivate: false,
      host: {
        userId: hostUser._id ? hostUser._id.toString() : hostUser.id,
        username: hostUser.username,
        avatar: hostUser.avatar
      },
      players: [],
      status: 'waiting',
      maxPlayers: 2
    });

    return res.json({
      roomCode: newRoom.roomCode,
      roomName: newRoom.roomName,
      isNew: true
    });
  } catch (error) {
    console.error('Quick match error:', error);
    return res.status(500).json({ error: 'Failed to find or create quick match' });
  }
});

// @route   POST /api/rooms
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { roomName, gameType = 'tictactoe', isPrivate = false } = req.body;

    let roomCode = generateRoomCode();
    let existing = await Room.findOne({ roomCode });
    let attempts = 0;
    while (existing && attempts < 5) {
      roomCode = generateRoomCode();
      existing = await Room.findOne({ roomCode });
      attempts++;
    }

    const hostUser = req.user || {
      _id: 'guest_' + Math.random().toString(36).substring(2, 9),
      username: req.body.username || 'Player 1',
      avatar: req.body.avatar || 'cyber-ninja'
    };

    const newRoom = await Room.create({
      roomCode,
      roomName: roomName || `${hostUser.username}'s Arena`,
      gameType,
      isPrivate: !!isPrivate,
      host: {
        userId: hostUser._id ? hostUser._id.toString() : hostUser.id,
        username: hostUser.username,
        avatar: hostUser.avatar
      },
      players: [],
      status: 'waiting',
      maxPlayers: 2
    });

    return res.status(201).json({
      message: 'Room created successfully',
      room: {
        roomCode: newRoom.roomCode,
        roomName: newRoom.roomName,
        gameType: newRoom.gameType,
        isPrivate: newRoom.isPrivate,
        host: newRoom.host,
        status: newRoom.status,
        playersCount: newRoom.players.length,
        maxPlayers: newRoom.maxPlayers
      }
    });
  } catch (error) {
    console.error('Room creation error:', error);
    return res.status(500).json({ error: 'Failed to create room' });
  }
});

// @route   GET /api/rooms
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false });
    const formatted = rooms
      .map((r) => ({
        roomCode: r.roomCode,
        roomName: r.roomName,
        gameType: r.gameType,
        host: r.host,
        playersCount: (r.players || []).length,
        maxPlayers: r.maxPlayers,
        status: r.status,
        createdAt: r.createdAt
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.json({ rooms: formatted });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// @route   GET /api/rooms/:roomCode
router.get('/:roomCode', async (req, res) => {
  try {
    const { roomCode } = req.params;
    const room = await Room.findOne({ roomCode: roomCode.toUpperCase() });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    return res.json({
      room: {
        roomCode: room.roomCode,
        roomName: room.roomName,
        gameType: room.gameType,
        isPrivate: room.isPrivate,
        host: room.host,
        players: (room.players || []).map((p) => ({
          userId: p.userId,
          username: p.username,
          avatar: p.avatar,
          symbol: p.symbol,
          isReady: p.isReady,
          score: p.score
        })),
        spectatorsCount: (room.spectators || []).length,
        status: room.status,
        maxPlayers: room.maxPlayers
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch room' });
  }
});

export default router;
