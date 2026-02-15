'use client';

import { useState, useTransition, useEffect } from 'react';
import { Board } from './Board';
import { Board as BoardType, Player, getValidMoves } from '@/lib/othello';
import { makeMove } from '@/app/actions/game';
import { useAI } from '@/hooks/useAI';

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
    const { getAIMove } = useAI();

    const validMoves = getValidMoves(board, turn);

    useEffect(() => {
        if (turn === 'WHITE' && status === 'IN_PROGRESS' && !isPending) {
            const triggerAI = async () => {
                // Add a small delay so the AI move doesn't feel too instant
                await new Promise(resolve => setTimeout(resolve, 800));
                
                const move = await getAIMove(board, 'WHITE', 1);
                if (move) {
                    handleMove(move.x, move.y);
                }
            };
            triggerAI();
        }
    }, [turn, status, isPending]);

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
