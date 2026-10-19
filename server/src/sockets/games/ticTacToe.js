import { User } from '../../models/User.js';

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Row 1
  [3, 4, 5], // Row 2
  [6, 7, 8], // Row 3
  [0, 3, 6], // Col 1
  [1, 4, 7], // Col 2
  [2, 5, 8], // Col 3
  [0, 4, 8], // Diagonal 1
  [2, 4, 6]  // Diagonal 2
];

export class TicTacToeEngine {
  constructor(roomCode, playerX, playerO, onStateChange, onGameOver) {
    this.roomCode = roomCode;
    this.playerX = playerX; // { socketId, userId, username, avatar }
    this.playerO = playerO; // { socketId, userId, username, avatar }
    this.onStateChange = onStateChange;
    this.onGameOver = onGameOver;

    this.board = Array(9).fill(null);
    this.currentTurn = 'X'; // 'X' or 'O'
    this.startingSymbol = 'X';
    this.status = 'playing'; // 'playing' | 'won' | 'draw'
    this.winner = null; // 'X' | 'O' | null
    this.winningLine = null; // [a, b, c]
    this.scores = { X: 0, O: 0, draws: 0 };
    this.rematchRequests = new Set(); // socketIds
    this.turnDuration = 30; // seconds
    this.turnTimer = null;
    this.turnExpiresAt = Date.now() + this.turnDuration * 1000;

    this.startTurnTimer();
  }

  startTurnTimer() {
    this.clearTurnTimer();
    this.turnExpiresAt = Date.now() + this.turnDuration * 1000;

    this.turnTimer = setTimeout(() => {
      this.handleTurnTimeout();
    }, this.turnDuration * 1000);
  }

  clearTurnTimer() {
    if (this.turnTimer) {
      clearTimeout(this.turnTimer);
      this.turnTimer = null;
    }
  }

  handleTurnTimeout() {
    if (this.status !== 'playing') return;

    // The player whose turn it was timed out -> switch turn or award forfeit
    console.log(`[TicTacToe] Player ${this.currentTurn} timed out on room ${this.roomCode}`);
    const nextTurn = this.currentTurn === 'X' ? 'O' : 'X';
    this.currentTurn = nextTurn;
    this.startTurnTimer();

    this.onStateChange(this.getState(), {
      type: 'timeout',
      message: `Time expired! Turn passed to player ${nextTurn}.`
    });
  }

  getCurrentPlayer() {
    return this.currentTurn === 'X' ? this.playerX : this.playerO;
  }

  getPlayerBySocket(socketId) {
    if (this.playerX && this.playerX.socketId === socketId) return { symbol: 'X', player: this.playerX };
    if (this.playerO && this.playerO.socketId === socketId) return { symbol: 'O', player: this.playerO };
    return null;
  }

  checkWinner() {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        return {
          winner: this.board[a],
          line: combo
        };
      }
    }

    const isFull = this.board.every((cell) => cell !== null);
    if (isFull) {
      return { winner: null, draw: true };
    }

    return null;
  }

  async makeMove(socketId, cellIndex) {
    if (this.status !== 'playing') {
      return { success: false, error: 'Game is not currently active' };
    }

    const playerInfo = this.getPlayerBySocket(socketId);
    if (!playerInfo) {
      return { success: false, error: 'You are not a player in this match' };
    }

    if (playerInfo.symbol !== this.currentTurn) {
      return { success: false, error: "It is not your turn" };
    }

    const idx = parseInt(cellIndex, 10);
    if (isNaN(idx) || idx < 0 || idx > 8) {
      return { success: false, error: 'Invalid cell index' };
    }

    if (this.board[idx] !== null) {
      return { success: false, error: 'Cell is already occupied' };
    }

    // Apply move
    this.board[idx] = this.currentTurn;
    const moveResult = this.checkWinner();

    if (moveResult) {
      this.clearTurnTimer();
      if (moveResult.winner) {
        this.status = 'won';
        this.winner = moveResult.winner;
        this.winningLine = moveResult.line;
        this.scores[this.winner] += 1;

        const winningPlayer = this.winner === 'X' ? this.playerX : this.playerO;
        const losingPlayer = this.winner === 'X' ? this.playerO : this.playerX;

        await this.updatePlayerStats(winningPlayer, losingPlayer, 'win');

        this.onGameOver(this.getState(), {
          winner: this.winner,
          winningPlayer,
          winningLine: this.winningLine,
          isDraw: false
        });
      } else if (moveResult.draw) {
        this.status = 'draw';
        this.winner = null;
        this.winningLine = null;
        this.scores.draws += 1;

        await this.updatePlayerStats(this.playerX, this.playerO, 'draw');

        this.onGameOver(this.getState(), {
          winner: null,
          winningLine: null,
          isDraw: true
        });
      }
    } else {
      // Toggle turn
      this.currentTurn = this.currentTurn === 'X' ? 'O' : 'X';
      this.startTurnTimer();
      this.onStateChange(this.getState());
    }

    return { success: true };
  }

  requestRematch(socketId) {
    if (this.status === 'playing') return { success: false, error: 'Game still in progress' };

    this.rematchRequests.add(socketId);

    const playerXReady = this.rematchRequests.has(this.playerX.socketId);
    const playerOReady = this.rematchRequests.has(this.playerO.socketId);

    if (playerXReady && playerOReady) {
      this.resetGame();
      return { success: true, restarted: true };
    }

    return {
      success: true,
      restarted: false,
      waitingFor: playerXReady ? this.playerO.username : this.playerX.username
    };
  }

  resetGame() {
    this.clearTurnTimer();
    this.board = Array(9).fill(null);
    this.status = 'playing';
    this.winner = null;
    this.winningLine = null;
    this.rematchRequests.clear();

    // Alternate who goes first each round for fair play
    this.startingSymbol = this.startingSymbol === 'X' ? 'O' : 'X';
    this.currentTurn = this.startingSymbol;

    this.startTurnTimer();
    this.onStateChange(this.getState(), { type: 'rematch_started' });
  }

  async handleForfeit(forfeitingSocketId) {
    if (this.status !== 'playing') return;

    this.clearTurnTimer();
    const forfeitedPlayer = this.getPlayerBySocket(forfeitingSocketId);
    if (!forfeitedPlayer) return;

    const winningSymbol = forfeitedPlayer.symbol === 'X' ? 'O' : 'X';
    this.status = 'won';
    this.winner = winningSymbol;
    this.scores[winningSymbol] += 1;

    const winningPlayer = winningSymbol === 'X' ? this.playerX : this.playerO;
    const losingPlayer = forfeitedPlayer.player;

    await this.updatePlayerStats(winningPlayer, losingPlayer, 'win');

    this.onGameOver(this.getState(), {
      winner: this.winner,
      winningPlayer,
      winningLine: null,
      isForfeit: true,
      forfeitedBy: losingPlayer.username
    });
  }

  async updatePlayerStats(player1, player2, resultType) {
    try {
      if (resultType === 'win') {
        // Winner updates
        if (player1.userId && !player1.userId.startsWith('guest_')) {
          const user1 = await User.findById(player1.userId);
          if (user1) {
            user1.stats.gamesPlayed += 1;
            user1.stats.wins += 1;
            user1.stats.winStreak += 1;
            if (user1.stats.winStreak > user1.stats.bestStreak) {
              user1.stats.bestStreak = user1.stats.winStreak;
            }
            user1.stats.points += 25;
            user1.matchHistory.unshift({
              gameId: this.roomCode,
              gameType: 'tictactoe',
              opponentName: player2.username,
              opponentAvatar: player2.avatar,
              result: 'win',
              playedAt: new Date()
            });
            if (user1.matchHistory.length > 20) user1.matchHistory.pop();
            await user1.save();
          }
        }

        // Loser updates
        if (player2.userId && !player2.userId.startsWith('guest_')) {
          const user2 = await User.findById(player2.userId);
          if (user2) {
            user2.stats.gamesPlayed += 1;
            user2.stats.losses += 1;
            user2.stats.winStreak = 0;
            user2.stats.points = Math.max(0, user2.stats.points - 15);
            user2.matchHistory.unshift({
              gameId: this.roomCode,
              gameType: 'tictactoe',
              opponentName: player1.username,
              opponentAvatar: player1.avatar,
              result: 'loss',
              playedAt: new Date()
            });
            if (user2.matchHistory.length > 20) user2.matchHistory.pop();
            await user2.save();
          }
        }
      } else if (resultType === 'draw') {
        for (const p of [player1, player2]) {
          const opponent = p === player1 ? player2 : player1;
          if (p.userId && !p.userId.startsWith('guest_')) {
            const user = await User.findById(p.userId);
            if (user) {
              user.stats.gamesPlayed += 1;
              user.stats.draws += 1;
              user.stats.points += 5;
              user.matchHistory.unshift({
                gameId: this.roomCode,
                gameType: 'tictactoe',
                opponentName: opponent.username,
                opponentAvatar: opponent.avatar,
                result: 'draw',
                playedAt: new Date()
              });
              if (user.matchHistory.length > 20) user.matchHistory.pop();
              await user.save();
            }
          }
        }
      }
    } catch (err) {
      console.error('Error updating player stats after game:', err);
    }
  }

  destroy() {
    this.clearTurnTimer();
  }

  getState() {
    return {
      roomCode: this.roomCode,
      board: this.board,
      currentTurn: this.currentTurn,
      status: this.status,
      winner: this.winner,
      winningLine: this.winningLine,
      scores: this.scores,
      turnExpiresAt: this.turnExpiresAt,
      playerX: {
        userId: this.playerX.userId,
        username: this.playerX.username,
        avatar: this.playerX.avatar,
        symbol: 'X',
        score: this.scores.X
      },
      playerO: {
        userId: this.playerO.userId,
        username: this.playerO.username,
        avatar: this.playerO.avatar,
        symbol: 'O',
        score: this.scores.O
      },
      rematchRequestedBy: Array.from(this.rematchRequests)
    };
  }
}
