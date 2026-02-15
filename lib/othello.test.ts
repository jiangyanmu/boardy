import { createInitialBoard, getValidMoves, applyMove, calculateScore, isGameOver } from './othello';

describe('Othello Engine', () => {
    test('initial board setup', () => {
        const board = createInitialBoard();
        // 8x8 grid
        expect(board.length).toBe(8);
        expect(board[0].length).toBe(8);
        
        // Center pieces
        expect(board[3][3]).toBe('WHITE');
        expect(board[3][4]).toBe('BLACK');
        expect(board[4][3]).toBe('BLACK');
        expect(board[4][4]).toBe('WHITE');
    });

    test('initial board has 4 valid moves for BLACK', () => {
        const board = createInitialBoard();
        const moves = getValidMoves(board, 'BLACK');
        expect(moves.length).toBe(4);
        
        // Expected moves for BLACK: (2,3), (3,2), (4,5), (5,4)
        const expectedMoves = [
            { x: 2, y: 3 },
            { x: 3, y: 2 },
            { x: 4, y: 5 },
            { x: 5, y: 4 }
        ];
        
        expectedMoves.forEach(expected => {
            expect(moves.some(m => m.x === expected.x && m.y === expected.y)).toBe(true);
        });
    });

    test('initial board has 4 valid moves for WHITE', () => {
        const board = createInitialBoard();
        const moves = getValidMoves(board, 'WHITE');
        expect(moves.length).toBe(4);
        
        // Expected moves for WHITE: (2,4), (3,5), (4,2), (5,3)
        const expectedMoves = [
            { x: 2, y: 4 },
            { x: 3, y: 5 },
            { x: 4, y: 2 },
            { x: 5, y: 3 }
        ];
        
        expectedMoves.forEach(expected => {
            expect(moves.some(m => m.x === expected.x && m.y === expected.y)).toBe(true);
        });
    });

    test('applyMove flips pieces correctly', () => {
        let board = createInitialBoard();
        // BLACK moves to (2,3)
        board = applyMove(board, 2, 3, 'BLACK');
        
        expect(board[3][2]).toBe('BLACK'); // The placed piece
        expect(board[3][3]).toBe('BLACK'); // Flipped from WHITE
        expect(board[3][4]).toBe('BLACK'); // Already BLACK
        
        const score = calculateScore(board);
        expect(score.BLACK).toBe(4);
        expect(score.WHITE).toBe(1);
    });

    test('isGameOver returns false at start', () => {
        const board = createInitialBoard();
        expect(isGameOver(board)).toBe(false);
    });
});
