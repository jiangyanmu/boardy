// Othello AI Worker
// Implements Minimax with Alpha-Beta Pruning

self.onmessage = function(e) {
    const { board, player, difficulty } = e.data;
    const depth = difficulty === 1 ? 3 : difficulty === 2 ? 5 : 7;
    const bestMove = findBestMove(board, player, depth);
    self.postMessage(bestMove);
};

function findBestMove(board, player, depth) {
    const validMoves = getValidMoves(board, player);
    if (validMoves.length === 0) return null;

    let bestScore = -Infinity;
    let bestMove = validMoves[0];

    for (const move of validMoves) {
        const nextBoard = applyMove(board, move.x, move.y, player);
        const score = minimax(nextBoard, depth - 1, -Infinity, Infinity, false, player);
        if (score > bestScore) {
            bestScore = score;
            bestMove = move;
        }
    }

    return bestMove;
}

function minimax(board, depth, alpha, beta, isMaximizing, player) {
    const opponent = player === 'BLACK' ? 'WHITE' : 'BLACK';
    const currentPlayer = isMaximizing ? player : opponent;

    if (depth === 0 || isGameOver(board)) {
        return evaluateBoard(board, player);
    }

    const moves = getValidMoves(board, currentPlayer);

    if (moves.length === 0) {
        return minimax(board, depth - 1, alpha, beta, !isMaximizing, player);
    }

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const nextBoard = applyMove(board, move.x, move.y, player);
            const evaluation = minimax(nextBoard, depth - 1, alpha, beta, false, player);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            const nextBoard = applyMove(board, move.x, move.y, opponent);
            const evaluation = minimax(nextBoard, depth - 1, alpha, beta, true, player);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

// Minimal implementation of game rules for the worker
const DIRECTIONS = [
    { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
    { x: -1, y: 0 },                  { x: 1, y: 0 },
    { x: -1, y: 1 },  { x: 0, y: 1 },  { x: 1, y: 1 }
];

function getValidMoves(board, player) {
    const moves = [];
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (isValidMove(board, x, y, player)) {
                moves.push({ x, y });
            }
        }
    }
    return moves;
}

function isValidMove(board, x, y, player) {
    if (board[y][x] !== null) return false;
    const opponent = player === 'BLACK' ? 'WHITE' : 'BLACK';
    for (const dir of DIRECTIONS) {
        let nx = x + dir.x;
        let ny = y + dir.y;
        let foundOpponent = false;
        while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            if (board[ny][nx] === opponent) foundOpponent = true;
            else if (board[ny][nx] === player) {
                if (foundOpponent) return true;
                break;
            } else break;
            nx += dir.x;
            ny += dir.y;
        }
    }
    return false;
}

function applyMove(board, x, y, player) {
    const newBoard = board.map(row => [...row]);
    newBoard[y][x] = player;
    const opponent = player === 'BLACK' ? 'WHITE' : 'BLACK';
    for (const dir of DIRECTIONS) {
        let nx = x + dir.x;
        let ny = y + dir.y;
        const toFlip = [];
        while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            if (newBoard[ny][nx] === opponent) toFlip.push({ x: nx, y: ny });
            else if (newBoard[ny][nx] === player) {
                for (const pos of toFlip) newBoard[pos.y][pos.x] = player;
                break;
            } else break;
            nx += dir.x;
            ny += dir.y;
        }
    }
    return newBoard;
}

function isGameOver(board) {
    return getValidMoves(board, 'BLACK').length === 0 && getValidMoves(board, 'WHITE').length === 0;
}

const SCORES = [
    [100, -20, 10,  5,  5, 10, -20, 100],
    [-20, -50, -2, -2, -2, -2, -50, -20],
    [ 10,  -2,  5,  1,  1,  5,  -2,  10],
    [  5,  -2,  1,  0,  0,  1,  -2,   5],
    [  5,  -2,  1,  0,  0,  1,  -2,   5],
    [ 10,  -2,  5,  1,  1,  5,  -2,  10],
    [-20, -50, -2, -2, -2, -2, -50, -20],
    [100, -20, 10,  5,  5, 10, -20, 100]
];

function evaluateBoard(board, player) {
    const opponent = player === 'BLACK' ? 'WHITE' : 'BLACK';
    let score = 0;
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (board[y][x] === player) score += SCORES[y][x] + 1;
            else if (board[y][x] === opponent) score -= (SCORES[y][x] + 1);
        }
    }
    return score;
}
