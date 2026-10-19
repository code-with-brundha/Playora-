import { User } from '../../models/User.js';

/**
 * Server-Authoritative Rock-Paper-Scissors Engine
 *
 * CRITICAL SECURITY FEATURE:
 * Player choices are stored secretly in memory and are NEVER revealed
 * or sent to any client until BOTH players have committed their moves.
 */
export class RockPaperScissorsEngine {
  constructor(roomCode, player1, player2, onStateUpdate, onRoundResolved, onGameOver) {
    this.roomCode = roomCode;
    this.player1 = player1;
    this.player2 = player2;
    this.onStateUpdate = onStateUpdate;
    this.onRoundResolved = onRoundResolved;
    this.onGameOver = onGameOver;

    this.round = 1;
    this.targetScore = 3; // First to 3 wins match
    this.status = 'playing'; // 'playing' | 'revealing' | 'finished'

    this.scores = {
      [this.player1.userId]: 0,
      [this.player2.userId]: 0
    };

    this.streaks = {
      [this.player1.userId]: 0,
      [this.player2.userId]: 0
    };

    // Secret unrevealed moves keyed by socketId
    this.currentMoves = {
      [this.player1.socketId]: null,
      [this.player2.socketId]: null
    };

    this.history = [];
    this.lastRoundResult = null;
    this.rematchRequests = new Set();
    this.roundTimeout = null;

    this.startRoundTimer();
  }

  startRoundTimer() {
    if (this.roundTimeout) clearTimeout(this.roundTimeout);

    // 30 seconds to choose move; auto-picks random if timed out
    this.roundTimeout = setTimeout(() => {
      this.handleRoundTimeout();
    }, 30000);
  }

  handleRoundTimeout() {
    if (this.status !== 'playing') return;

    const choices = ['rock', 'paper', 'scissors'];
    // If player 1 didn't move, assign random
    if (!this.currentMoves[this.player1.socketId]) {
      this.currentMoves[this.player1.socketId] = choices[Math.floor(Math.random() * 3)];
    }
    // If player 2 didn't move, assign random
    if (!this.currentMoves[this.player2.socketId]) {
      this.currentMoves[this.player2.socketId] = choices[Math.floor(Math.random() * 3)];
    }

    this.resolveRound();
  }

  /**
   * Submit move: 'rock' | 'paper' | 'scissors'
   */
  async submitMove(socketId, move) {
    if (this.status !== 'playing') {
      return { success: false, error: 'Round is currently not accepting moves' };
    }

    const validMoves = ['rock', 'paper', 'scissors'];
    if (!validMoves.includes(move)) {
      return { success: false, error: 'Invalid move selection' };
    }

    // Verify player belongs to room
    if (socketId !== this.player1.socketId && socketId !== this.player2.socketId) {
      return { success: false, error: 'You are not an active player in this duel' };
    }

    // Lock in move secretly
    this.currentMoves[socketId] = move;

    const p1Submitted = !!this.currentMoves[this.player1.socketId];
    const p2Submitted = !!this.currentMoves[this.player2.socketId];

    // Notify clients of lock-in status WITHOUT revealing choices
    this.onStateUpdate(this.getState(), {
      event: 'move_locked',
      p1Submitted,
      p2Submitted
    });

    // If both players have submitted, resolve round simultaneously!
    if (p1Submitted && p2Submitted) {
      if (this.roundTimeout) clearTimeout(this.roundTimeout);
      await this.resolveRound();
      return { success: true, resolved: true };
    }

    return { success: true, resolved: false, waitingForOpponent: true };
  }

  async resolveRound() {
    this.status = 'revealing';

    const p1Move = this.currentMoves[this.player1.socketId];
    const p2Move = this.currentMoves[this.player2.socketId];

    let result = 'draw';
    let winnerId = null;

    if (p1Move === p2Move) {
      result = 'draw';
    } else if (
      (p1Move === 'rock' && p2Move === 'scissors') ||
      (p1Move === 'scissors' && p2Move === 'paper') ||
      (p1Move === 'paper' && p2Move === 'rock')
    ) {
      result = 'p1_win';
      winnerId = this.player1.userId;
      this.scores[this.player1.userId] += 1;
      this.streaks[this.player1.userId] += 1;
      this.streaks[this.player2.userId] = 0;
    } else {
      result = 'p2_win';
      winnerId = this.player2.userId;
      this.scores[this.player2.userId] += 1;
      this.streaks[this.player2.userId] += 1;
      this.streaks[this.player1.userId] = 0;
    }

    const roundData = {
      round: this.round,
      moves: {
        [this.player1.userId]: p1Move,
        [this.player2.userId]: p2Move
      },
      result,
      winnerId,
      scores: { ...this.scores },
      streaks: { ...this.streaks }
    };

    this.lastRoundResult = roundData;
    this.history.push(roundData);

    const isMatchOver =
      this.scores[this.player1.userId] >= this.targetScore ||
      this.scores[this.player2.userId] >= this.targetScore;

    const matchWinner = isMatchOver
      ? this.scores[this.player1.userId] >= this.targetScore
        ? this.player1
        : this.player2
      : null;

    // Broadcast simultaneous reveal to both players
    this.onRoundResolved(roundData, isMatchOver, matchWinner);

    if (isMatchOver) {
      this.status = 'finished';
      await this.recordMatchStats(matchWinner);
      this.onGameOver(this.getState(), {
        winner: matchWinner,
        scores: this.scores,
        totalRounds: this.round
      });
    } else {
      // Advance to next round after 3.2s reveal delay
      setTimeout(() => {
        if (this.status !== 'revealing') return;
        this.round += 1;
        this.status = 'playing';
        this.currentMoves = {
          [this.player1.socketId]: null,
          [this.player2.socketId]: null
        };
        this.startRoundTimer();

        this.onStateUpdate(this.getState(), {
          event: 'new_round',
          round: this.round
        });
      }, 3200);
    }
  }

  async recordMatchStats(matchWinner) {
    try {
      const p1Won = matchWinner && matchWinner.userId === this.player1.userId;
      const p2Won = matchWinner && matchWinner.userId === this.player2.userId;

      const p1User = await User.findOne({ _id: this.player1.userId });
      if (p1User) {
        if (!p1User.rpsStats) {
          p1User.rpsStats = { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, currentStreak: 0, bestStreak: 0 };
        }
        p1User.rpsStats.gamesPlayed += 1;
        if (p1Won) {
          p1User.rpsStats.wins += 1;
          p1User.rpsStats.currentStreak += 1;
          if (p1User.rpsStats.currentStreak > p1User.rpsStats.bestStreak) {
            p1User.rpsStats.bestStreak = p1User.rpsStats.currentStreak;
          }
          p1User.stats.xp = (p1User.stats.xp || 0) + 120;
          p1User.stats.points = (p1User.stats.points || 1000) + 30;
        } else {
          p1User.rpsStats.losses += 1;
          p1User.rpsStats.currentStreak = 0;
          p1User.stats.xp = (p1User.stats.xp || 0) + 30;
        }
        await p1User.save();
      }

      const p2User = await User.findOne({ _id: this.player2.userId });
      if (p2User) {
        if (!p2User.rpsStats) {
          p2User.rpsStats = { gamesPlayed: 0, wins: 0, losses: 0, draws: 0, currentStreak: 0, bestStreak: 0 };
        }
        p2User.rpsStats.gamesPlayed += 1;
        if (p2Won) {
          p2User.rpsStats.wins += 1;
          p2User.rpsStats.currentStreak += 1;
          if (p2User.rpsStats.currentStreak > p2User.rpsStats.bestStreak) {
            p2User.rpsStats.bestStreak = p2User.rpsStats.currentStreak;
          }
          p2User.stats.xp = (p2User.stats.xp || 0) + 120;
          p2User.stats.points = (p2User.stats.points || 1000) + 30;
        } else {
          p2User.rpsStats.losses += 1;
          p2User.rpsStats.currentStreak = 0;
          p2User.stats.xp = (p2User.stats.xp || 0) + 30;
        }
        await p2User.save();
      }
    } catch (err) {
      console.error('Failed to record RPS match stats:', err);
    }
  }

  async handleForfeit(forfeitingSocketId) {
    if (this.status === 'finished') return;
    if (this.roundTimeout) clearTimeout(this.roundTimeout);

    const winner = forfeitingSocketId === this.player1.socketId ? this.player2 : this.player1;
    this.status = 'finished';

    await this.recordMatchStats(winner);

    this.onGameOver(this.getState(), {
      winner,
      forfeit: true,
      message: 'Opponent forfeited the clash'
    });
  }

  requestRematch(socketId) {
    this.rematchRequests.add(socketId);
    if (this.rematchRequests.size >= 2) {
      this.resetMatch();
      return { accepted: true, starting: true };
    }
    return { accepted: true, starting: false };
  }

  resetMatch() {
    if (this.roundTimeout) clearTimeout(this.roundTimeout);
    this.round = 1;
    this.status = 'playing';
    this.scores = {
      [this.player1.userId]: 0,
      [this.player2.userId]: 0
    };
    this.currentMoves = {
      [this.player1.socketId]: null,
      [this.player2.socketId]: null
    };
    this.history = [];
    this.lastRoundResult = null;
    this.rematchRequests.clear();
    this.startRoundTimer();

    this.onStateUpdate(this.getState(), { event: 'match_reset' });
  }

  destroy() {
    if (this.roundTimeout) clearTimeout(this.roundTimeout);
  }

  /**
   * Safe public state: Never leaks choices during 'playing' state!
   */
  getState() {
    return {
      gameType: 'rps',
      roomCode: this.roomCode,
      round: this.round,
      targetScore: this.targetScore,
      status: this.status,
      players: [
        {
          userId: this.player1.userId,
          username: this.player1.username,
          avatar: this.player1.avatar,
          score: this.scores[this.player1.userId] || 0,
          streak: this.streaks[this.player1.userId] || 0,
          hasSubmitted: !!this.currentMoves[this.player1.socketId]
        },
        {
          userId: this.player2.userId,
          username: this.player2.username,
          avatar: this.player2.avatar,
          score: this.scores[this.player2.userId] || 0,
          streak: this.streaks[this.player2.userId] || 0,
          hasSubmitted: !!this.currentMoves[this.player2.socketId]
        }
      ],
      lastRoundResult: this.lastRoundResult,
      history: this.history
    };
  }
}
