import { calculateWinner, availableMoves } from './gameLogic';

// Scores: AI wants to maximize
const scoreMap = { X: -10, O: 10, tie: 0 };

/**
 * minimax returns { score, index }
 * aiPlayer should be 'O' or 'X' — choose consistently in App
 */
export function minimax(board, aiPlayer, humanPlayer, isMaximizng = true) {
  const { winner } = calculateWinner(board);
  if (winner) return { score: scoreMap[winner] };
  if (availableMoves(board).length === 0) return { score: scoreMap.tie };

  if (isMaximizng) {
    let best = { score: -Infinity, index: null };
    for (const idx of availableMoves(board)) {
      board[idx] = aiPlayer;
      const result = minimax(board, aiPlayer, humanPlayer, false);
      board[idx] = null;
      if (result.score > best.score) best = { score: result.score, index: idx };
    }
    return best;
  } else {
    let best = { score: Infinity, index: null };
    for (const idx of availableMoves(board)) {
      board[idx] = humanPlayer;
      const result = minimax(board, aiPlayer, humanPlayer, true);
      board[idx] = null;
      if (result.score < best.score) best = { score: result.score, index: idx };
    }
    return best;
  }
}

/* quick helper to pick move with optional randomness for 'medium' difficulty */
export function pickBestMove(board, aiPlayer, humanPlayer, randomness = 0) {
  // randomness: 0 -> perfect, 0.3 -> sometimes choose second best
  const moves = [];
  for (const idx of availableMoves(board)) {
    board[idx] = aiPlayer;
    const result = minimax(board, aiPlayer, humanPlayer, false);
    board[idx] = null;
    moves.push({ index: idx, score: result.score });
  }
  moves.sort((a,b) => b.score - a.score); // best first
  if (randomness > 0 && moves.length > 1 && Math.random() < randomness) {
    // pick 2nd best with small prob
    return moves[1].index;
  }
  return moves[0].index;
}
