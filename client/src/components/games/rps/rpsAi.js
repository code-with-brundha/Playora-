// Rock-Paper-Scissors AI Strategy Module

export const MOVES = ['rock', 'paper', 'scissors'];

export const BEATS = {
  rock: 'scissors',
  scissors: 'paper',
  paper: 'rock'
};

export const BEATEN_BY = {
  rock: 'paper',
  paper: 'scissors',
  scissors: 'rock'
};

/**
 * Compute AI Move based on strategy and history
 * @param {string} difficulty - 'easy' | 'tactical' | 'master'
 * @param {Array} history - Array of { playerMove, aiMove, result }
 * @returns {string} - 'rock' | 'paper' | 'scissors'
 */
export const getComputerMove = (difficulty = 'tactical', history = []) => {
  // Strategy 1: Easy (Casual Random)
  if (difficulty === 'easy' || history.length === 0) {
    return MOVES[Math.floor(Math.random() * MOVES.length)];
  }

  const lastRound = history[history.length - 1];

  // Strategy 2: Tactical (Win-Stay / Lose-Shift Psychology)
  if (difficulty === 'tactical') {
    // 65% probability to counter psychological tendency, 35% random to stay unpredictable
    if (Math.random() < 0.35) {
      return MOVES[Math.floor(Math.random() * MOVES.length)];
    }

    if (lastRound.result === 'win') {
      // Player won last round -> Player likely repeats winning move
      // AI plays what beats player's previous winning move
      return BEATEN_BY[lastRound.playerMove];
    } else if (lastRound.result === 'loss') {
      // Player lost last round -> Player shifts to what would have beaten AI's move
      const playerLikelyShift = BEATEN_BY[lastRound.aiMove];
      return BEATEN_BY[playerLikelyShift];
    } else {
      // Draw -> Player tends to switch to what beats their drawn move
      const playerLikelySwitch = BEATEN_BY[lastRound.playerMove];
      return BEATEN_BY[playerLikelySwitch];
    }
  }

  // Strategy 3: Master (Quantum Markov Transition Frequency)
  if (difficulty === 'master') {
    if (history.length < 3) {
      // Fallback to tactical for early rounds
      return getComputerMove('tactical', history);
    }

    // Build transition counts: what did player do after lastRound.playerMove?
    const lastPlayerMove = lastRound.playerMove;
    const transitionCounts = { rock: 0, paper: 0, scissors: 0 };

    for (let i = 0; i < history.length - 1; i++) {
      if (history[i].playerMove === lastPlayerMove) {
        const nextMove = history[i + 1].playerMove;
        transitionCounts[nextMove] = (transitionCounts[nextMove] || 0) + 1;
      }
    }

    // Find the most frequent next move
    let predictedMove = MOVES[Math.floor(Math.random() * MOVES.length)];
    let highestCount = -1;

    for (const move of MOVES) {
      if (transitionCounts[move] > highestCount) {
        highestCount = transitionCounts[move];
        predictedMove = move;
      }
    }

    // Play the move that beats player's predicted next move
    return BEATEN_BY[predictedMove];
  }

  return MOVES[Math.floor(Math.random() * MOVES.length)];
};

/**
 * Determine round outcome from player perspective
 * @returns {'win' | 'loss' | 'draw'}
 */
export const determineRpsWinner = (playerMove, opponentMove) => {
  if (playerMove === opponentMove) return 'draw';
  if (BEATS[playerMove] === opponentMove) return 'win';
  return 'loss';
};
