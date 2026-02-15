'use server';

import prisma from '@/lib/prisma';
import { createInitialBoard, applyMove, getValidMoves, isGameOver, Player } from '@/lib/othello';
import { revalidatePath } from 'next/cache';

export async function createGame() {
    const game = await prisma.game.create({
        data: {
            board: JSON.stringify(createInitialBoard()),
            turn: 'BLACK',
            status: 'IN_PROGRESS',
            difficulty: 1,
        },
    });
    return game;
}

export async function makeMove(gameId: string, x: number, y: number, player: Player) {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) throw new Error('Game not found');
    if (game.status !== 'IN_PROGRESS') throw new Error('Game is over');
    if (game.turn !== player) throw new Error('Not your turn');

    const board = JSON.parse(game.board);
    const newBoard = applyMove(board, x, y, player);
    
    let nextTurn: Player = player === 'BLACK' ? 'WHITE' : 'BLACK';
    let status = 'IN_PROGRESS';
    let winner = null;

    // Check if next player has moves
    if (getValidMoves(newBoard, nextTurn).length === 0) {
        // Skip turn
        nextTurn = player;
        // If current player also has no moves, game over
        if (getValidMoves(newBoard, nextTurn).length === 0) {
            status = 'COMPLETED';
            const score = calculateScoreLocally(newBoard);
            winner = score.BLACK > score.WHITE ? 'BLACK' : score.WHITE > score.BLACK ? 'WHITE' : 'DRAW';
        }
    }

    const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
            board: JSON.stringify(newBoard),
            turn: nextTurn,
            status,
            winner,
        },
    });

    revalidatePath('/');
    return updatedGame;
}

export async function resetGame(gameId: string) {
    const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
            board: JSON.stringify(createInitialBoard()),
            turn: 'BLACK',
            status: 'IN_PROGRESS',
            winner: null,
        },
    });
    revalidatePath('/');
    return updatedGame;
}

function calculateScoreLocally(board: any[][]) {
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
