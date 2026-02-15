'use client';

import { useState, useTransition, useEffect } from 'react';
import { Board } from './Board';
import { Board as BoardType, Player, getValidMoves, calculateScore } from '@/lib/othello';
import { makeMove, resetGame } from '@/app/actions/game';
import { useAI } from '@/hooks/useAI';
import { GameOverDialog } from './GameOverDialog';
import { Button } from '@/components/ui/button';

interface GameContainerProps {
    gameId: string;
    initialBoard: BoardType;
    initialTurn: Player;
    initialStatus: string;
    initialWinner: Player | 'DRAW' | null;
}

export function GameContainer({ gameId, initialBoard, initialTurn, initialStatus, initialWinner }: GameContainerProps) {
    const [board, setBoard] = useState<BoardType>(initialBoard);
    const [turn, setTurn] = useState<Player>(initialTurn);
    const [status, setStatus] = useState(initialStatus);
    const [winner, setWinner] = useState<Player | 'DRAW' | null>(initialWinner);
    const [isPending, startTransition] = useTransition();
    const { getAIMove } = useAI();

    const validMoves = getValidMoves(board, turn);
    const score = calculateScore(board);

    useEffect(() => {
        if (turn === 'WHITE' && status === 'IN_PROGRESS' && !isPending) {
            const triggerAI = async () => {
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
            setWinner(updatedGame.winner as any);
        });
    };

    const handleRestart = async () => {
        startTransition(async () => {
            const updatedGame = await resetGame(gameId);
            setBoard(JSON.parse(updatedGame.board));
            setTurn(updatedGame.turn as Player);
            setStatus(updatedGame.status);
            setWinner(null);
        });
    };

    return (
        <div className="w-full flex flex-col items-center gap-8">
            <Board 
                board={board} 
                validMoves={validMoves} 
                onMove={handleMove} 
                disabled={isPending || status !== 'IN_PROGRESS'}
            />

            <Button 
                variant="outline" 
                onClick={handleRestart}
                disabled={isPending}
                className="font-bold uppercase tracking-widest px-8"
            >
                New Game
            </Button>

            <GameOverDialog 
                open={status === 'COMPLETED'}
                winner={winner}
                score={score}
                onRestart={handleRestart}
            />
        </div>
    );
}
