'use client';

import { useState, useTransition } from 'react';
import { Board } from './Board';
import { Board as BoardType, Player, getValidMoves } from '@/lib/othello';
import { makeMove } from '@/app/actions/game';

interface GameContainerProps {
    gameId: string;
    initialBoard: BoardType;
    initialTurn: Player;
    initialStatus: string;
}

export function GameContainer({ gameId, initialBoard, initialTurn, initialStatus }: GameContainerProps) {
    const [board, setBoard] = useState<BoardType>(initialBoard);
    const [turn, setTurn] = useState<Player>(initialTurn);
    const [status, setStatus] = useState(initialStatus);
    const [isPending, startTransition] = useTransition();

    const validMoves = getValidMoves(board, turn);

    const handleMove = async (x: number, y: number) => {
        if (isPending || status !== 'IN_PROGRESS') return;

        startTransition(async () => {
            const updatedGame = await makeMove(gameId, x, y, turn);
            setBoard(JSON.parse(updatedGame.board));
            setTurn(updatedGame.turn as Player);
            setStatus(updatedGame.status);
        });
    };

    return (
        <div className="w-full flex justify-center">
            <Board 
                board={board} 
                validMoves={validMoves} 
                onMove={handleMove} 
                disabled={isPending || status !== 'IN_PROGRESS'}
            />
        </div>
    );
}
