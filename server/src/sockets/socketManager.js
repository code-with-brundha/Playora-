import { Room } from '../models/Room.js';
import { verifySocketToken } from '../middleware/auth.js';
import { TicTacToeEngine } from './games/ticTacToe.js';
import { RockPaperScissorsEngine } from './games/rockPaperScissors.js';

// Global maps
const activeGames = new Map(); // roomCode -> TicTacToeEngine
const socketUserMap = new Map(); // socketId -> { userId, username, avatar, roomCode }

export const initSocketManager = (io) => {
  io.on('connection', (socket) => {
    console.log(`[Socket] Connected: ${socket.id}`);

    // Heartbeat ping check
    socket.on('ping_check', (callback) => {
      if (typeof callback === 'function') callback();
    });

    socket.on('join_room', async ({ roomCode, user, token }) => {
      try {
        if (!roomCode) {
          return socket.emit('error_message', { message: 'Room code is required' });
        }

        const normalizedCode = roomCode.toUpperCase();
        let room = await Room.findOne({ roomCode: normalizedCode });

        if (!room) {
          return socket.emit('error_message', { message: `Room "${normalizedCode}" not found` });
        }

        // Authenticate user if token provided, otherwise use payload or guest
        let authenticatedUser = null;
        if (token) {
          authenticatedUser = await verifySocketToken(token);
        }

        const userData = {
          userId: authenticatedUser ? authenticatedUser._id.toString() : user?.userId || `guest_${socket.id.substring(0, 5)}`,
          username: authenticatedUser ? authenticatedUser.username : user?.username || `Guest_${socket.id.substring(0, 4)}`,
          avatar: authenticatedUser ? authenticatedUser.avatar : user?.avatar || 'cyber-ninja',
          socketId: socket.id
        };

        socketUserMap.set(socket.id, { ...userData, roomCode: normalizedCode });
        socket.join(normalizedCode);

        // Check if player is already in room (reconnect scenario)
        const existingPlayerIndex = room.players.findIndex(
          (p) => p.userId === userData.userId || p.socketId === socket.id
        );

        if (existingPlayerIndex !== -1) {
          room.players[existingPlayerIndex].socketId = socket.id;
          room.players[existingPlayerIndex].username = userData.username;
          room.players[existingPlayerIndex].avatar = userData.avatar;
        } else if (room.players.length < room.maxPlayers) {
          const assignedSymbol = room.players.length === 0 ? 'X' : 'O';
          room.players.push({
            socketId: socket.id,
            userId: userData.userId,
            username: userData.username,
            avatar: userData.avatar,
            symbol: assignedSymbol,
            isReady: false,
            score: 0
          });
        } else {
          // Join as spectator
          room.spectators.push({
            socketId: socket.id,
            userId: userData.userId,
            username: userData.username
          });
        }

        try {
          await room.save();
        } catch (saveErr) {
          const freshRoom = await Room.findOne({ roomCode: normalizedCode });
          if (freshRoom) room = freshRoom;
        }

        // Broadcast room updated
        io.to(normalizedCode).emit('room_updated', {
          room: {
            roomCode: room.roomCode,
            roomName: room.roomName,
            gameType: room.gameType,
            host: room.host,
            players: room.players,
            spectatorsCount: room.spectators.length,
            status: room.status,
            maxPlayers: room.maxPlayers
          }
        });

        // Send welcome system chat
        io.to(normalizedCode).emit('chat_message', {
          id: 'sys_' + Date.now(),
          system: true,
          message: `${userData.username} entered the room`,
          timestamp: new Date().toISOString()
        });

        // If game is already active in this room, sync state to new/reconnected socket
        if (activeGames.has(normalizedCode)) {
          const game = activeGames.get(normalizedCode);
          socket.emit('game_state_sync', game.getState());
        }
      } catch (error) {
        console.error('Socket join_room error:', error);
        socket.emit('error_message', { message: 'Failed to join room' });
      }
    });

    // Toggle player ready status
    socket.on('toggle_ready', async ({ roomCode }) => {
      try {
        const normalizedCode = (roomCode || '').toUpperCase();
        const room = await Room.findOne({ roomCode: normalizedCode });
        if (!room) return;

        const player = room.players.find((p) => p.socketId === socket.id);
        if (!player) return;

        player.isReady = !player.isReady;
        await room.save();

        io.to(normalizedCode).emit('room_updated', {
          room: {
            roomCode: room.roomCode,
            roomName: room.roomName,
            gameType: room.gameType,
            host: room.host,
            players: room.players,
            spectatorsCount: room.spectators.length,
            status: room.status,
            maxPlayers: room.maxPlayers
          }
        });

        // Check if both players are ready
        if (room.players.length === 2 && room.players.every((p) => p.isReady)) {
          startGame(io, room);
        }
      } catch (err) {
        console.error('Socket toggle_ready error:', err);
      }
    });

    // Make move (Universal: supports TicTacToe and Rock-Paper-Scissors)
    socket.on('make_move', async ({ roomCode, cellIndex, move }) => {
      const normalizedCode = (roomCode || '').toUpperCase();
      const game = activeGames.get(normalizedCode);

      if (!game) {
        return socket.emit('move_error', { message: 'No active match found in this room' });
      }

      if (game instanceof RockPaperScissorsEngine) {
        const result = await game.submitMove(socket.id, move);
        if (!result.success) {
          socket.emit('move_error', { message: result.error });
        }
      } else {
        const result = await game.makeMove(socket.id, cellIndex);
        if (!result.success) {
          socket.emit('move_error', { message: result.error });
        }
      }
    });

    // Rock-Paper-Scissors explicit move submission
    socket.on('rps_submit_move', async ({ roomCode, move }) => {
      const normalizedCode = (roomCode || '').toUpperCase();
      const game = activeGames.get(normalizedCode);

      if (!game || !(game instanceof RockPaperScissorsEngine)) {
        return socket.emit('move_error', { message: 'No active Rock-Paper-Scissors match in this room' });
      }

      const result = await game.submitMove(socket.id, move);
      if (!result.success) {
        socket.emit('move_error', { message: result.error });
      }
    });

    // Request rematch
    socket.on('request_rematch', ({ roomCode }) => {
      const normalizedCode = (roomCode || '').toUpperCase();
      const game = activeGames.get(normalizedCode);
      if (!game) return;

      const res = game.requestRematch(socket.id);
      io.to(normalizedCode).emit('rematch_status', {
        requestedBy: socketUserMap.get(socket.id)?.username || 'A player',
        ...res
      });
    });

    // Chat message
    socket.on('send_chat', ({ roomCode, message }) => {
      if (!message || !message.trim()) return;
      const normalizedCode = (roomCode || '').toUpperCase();
      const user = socketUserMap.get(socket.id);

      io.to(normalizedCode).emit('chat_message', {
        id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        sender: user ? user.username : 'Anonymous',
        avatar: user ? user.avatar : 'cyber-ninja',
        message: message.trim().substring(0, 300),
        timestamp: new Date().toISOString()
      });
    });

    // Forfeit / surrender
    socket.on('forfeit_game', async ({ roomCode }) => {
      const normalizedCode = (roomCode || '').toUpperCase();
      const game = activeGames.get(normalizedCode);
      if (game) {
        await game.handleForfeit(socket.id);
      }
    });

    // Leave room
    socket.on('leave_room', async ({ roomCode }) => {
      await handleLeave(io, socket, roomCode);
    });

    // Disconnect
    socket.on('disconnect', async () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
      const userData = socketUserMap.get(socket.id);
      if (userData && userData.roomCode) {
        await handleLeave(io, socket, userData.roomCode);
      }
      socketUserMap.delete(socket.id);
    });
  });
};

const startGame = async (io, room) => {
  const normalizedCode = room.roomCode;
  room.status = 'playing';
  await room.save();

  const player1 = room.players[0];
  const player2 = room.players[1];

  // Assign symbols based on game type
  if (room.gameType === 'rps') {
    player1.symbol = 'P1';
    player2.symbol = 'P2';
  } else {
    player1.symbol = 'X';
    player2.symbol = 'O';
  }
  await room.save();

  // Clean existing game if any
  if (activeGames.has(normalizedCode)) {
    activeGames.get(normalizedCode).destroy();
  }

  let engine;

  if (room.gameType === 'rps') {
    engine = new RockPaperScissorsEngine(
      normalizedCode,
      player1,
      player2,
      (gameState, meta) => {
        io.to(normalizedCode).emit('game_state_update', { gameState, meta });
        io.to(normalizedCode).emit('rps_state_update', { gameState, meta });
      },
      (roundData, isMatchOver, matchWinner) => {
        // Broadcast simultaneous reveal to both players
        io.to(normalizedCode).emit('rps_round_resolved', {
          roundData,
          isMatchOver,
          matchWinner
        });
      },
      (gameState, gameOverData) => {
        io.to(normalizedCode).emit('game_over', {
          gameState,
          ...gameOverData
        });
      }
    );
  } else {
    engine = new TicTacToeEngine(
      normalizedCode,
      player1,
      player2,
      (gameState, meta) => {
        io.to(normalizedCode).emit('game_state_update', {
          gameState,
          meta
        });
      },
      (gameState, gameOverData) => {
        io.to(normalizedCode).emit('game_over', {
          gameState,
          ...gameOverData
        });
      }
    );
  }

  activeGames.set(normalizedCode, engine);

  const startMsg =
    room.gameType === 'rps'
      ? 'Rock-Paper-Scissors Cyber Clash has begun! Choose your weapon in secret!'
      : 'The match has begun! Player X makes the first move.';

  io.to(normalizedCode).emit('game_started', {
    gameState: engine.getState(),
    message: startMsg
  });

  io.to(normalizedCode).emit('chat_message', {
    id: 'sys_' + Date.now(),
    system: true,
    message: startMsg,
    timestamp: new Date().toISOString()
  });
};

const handleLeave = async (io, socket, roomCode) => {
  if (!roomCode) return;
  const normalizedCode = roomCode.toUpperCase();
  const userData = socketUserMap.get(socket.id);

  try {
    const room = await Room.findOne({ roomCode: normalizedCode });
    if (!room) return;

    // If game in progress, handle forfeit
    const game = activeGames.get(normalizedCode);
    if (game && game.status === 'playing') {
      const isPlayer = room.players.some((p) => p.socketId === socket.id);
      if (isPlayer) {
        await game.handleForfeit(socket.id);
      }
    }

    // Remove from players or spectators
    const playerIndex = room.players.findIndex((p) => p.socketId === socket.id);
    if (playerIndex !== -1) {
      room.players.splice(playerIndex, 1);
    }

    const specIndex = room.spectators.findIndex((p) => p.socketId === socket.id);
    if (specIndex !== -1) {
      room.spectators.splice(specIndex, 1);
    }

    // If room is empty, clean up
    if (room.players.length === 0 && room.spectators.length === 0) {
      if (activeGames.has(normalizedCode)) {
        activeGames.get(normalizedCode).destroy();
        activeGames.delete(normalizedCode);
      }
      await Room.deleteOne({ roomCode: normalizedCode });
      console.log(`[Room] Cleaned empty room: ${normalizedCode}`);
      return;
    }

    // If host left, assign new host to first remaining player
    if (room.host.userId === userData?.userId && room.players.length > 0) {
      room.host = {
        userId: room.players[0].userId,
        username: room.players[0].username,
        avatar: room.players[0].avatar
      };
    }

    // Reset status to waiting if only 1 player remains
    if (room.players.length < 2) {
      room.status = 'waiting';
      room.players.forEach((p) => (p.isReady = false));
    }

    await room.save();

    socket.leave(normalizedCode);

    io.to(normalizedCode).emit('room_updated', {
      room: {
        roomCode: room.roomCode,
        roomName: room.roomName,
        gameType: room.gameType,
        host: room.host,
        players: room.players,
        spectatorsCount: room.spectators.length,
        status: room.status,
        maxPlayers: room.maxPlayers
      }
    });

    if (userData) {
      io.to(normalizedCode).emit('chat_message', {
        id: 'sys_' + Date.now(),
        system: true,
        message: `${userData.username} left the room`,
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error handling player leave:', error);
  }
};
