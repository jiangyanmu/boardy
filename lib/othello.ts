export type Player = 'BLACK' | 'WHITE';
export type Cell = Player | null;
export type Board = Cell[][];
export type Move = { x: number; y: number };

export function createInitialBoard(): Board {
    const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    board[3][3] = 'WHITE';
    board[3][4] = 'BLACK';
    board[4][3] = 'BLACK';
    board[4][4] = 'WHITE';
    return board;
}

const DIRECTIONS = [
    { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
    { x: -1, y: 0 },                  { x: 1, y: 0 },
    { x: -1, y: 1 },  { x: 0, y: 1 },  { x: 1, y: 1 }
];

export function getValidMoves(board: Board, player: Player): Move[] {
    const moves: Move[] = [];
    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            if (isValidMove(board, x, y, player)) {
                moves.push({ x, y });
            }
        }
    }
    return moves;
}

export function isValidMove(board: Board, x: number, y: number, player: Player): boolean {
    if (board[y][x] !== null) return false;

    const opponent: Player = player === 'BLACK' ? 'WHITE' : 'BLACK';

    for (const dir of DIRECTIONS) {
        let nx = x + dir.x;
        let ny = y + dir.y;
        let foundOpponent = false;

        while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            if (board[ny][nx] === opponent) {
                foundOpponent = true;
            } else if (board[ny][nx] === player) {
                if (foundOpponent) return true;
                break;
            } else {
                break;
            }
            nx += dir.x;
            ny += dir.y;
        }
    }

    return false;
}

export function applyMove(board: Board, x: number, y: number, player: Player): Board {
    if (!isValidMove(board, x, y, player)) {
        throw new Error('Invalid move');
    }

    const newBoard = board.map(row => [...row]);
    newBoard[y][x] = player;

    const opponent: Player = player === 'BLACK' ? 'WHITE' : 'BLACK';

    for (const dir of DIRECTIONS) {
        let nx = x + dir.x;
        let ny = y + dir.y;
        const toFlip: { x: number; y: number }[] = [];

        while (nx >= 0 && nx < 8 && ny >= 0 && ny < 8) {
            if (newBoard[ny][nx] === opponent) {
                toFlip.push({ x: nx, y: ny });
            } else if (newBoard[ny][nx] === player) {
                for (const pos of toFlip) {
                    newBoard[pos.y][pos.x] = player;
                }
                break;
            } else {
                break;
            }
            nx += dir.x;
            ny += dir.y;
        }
    }

    return newBoard;
}

export function calculateScore(board: Board): { BLACK: number; WHITE: number } {
    let black = 0;
    let white = 0;
    for (const row of board) {
        for (const cell of row) {
            if (cell === 'BLACK') black++;
            if (cell === 'WHITE') white++;
        }
    }
    return { BLACK: black, WHITE: white };
}

export function isGameOver(board: Board): boolean {
    return getValidMoves(board, 'BLACK').length === 0 && getValidMoves(board, 'WHITE').length === 0;
}
