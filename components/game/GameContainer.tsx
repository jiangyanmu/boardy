'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { Board } from './Board';
import { Board as BoardType, Player, getValidMoves, calculateScore, applyMove } from '@/lib/othello';
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
    const isPendingRef = useRef(isPending);
    const { getAIMove } = useAI();

    // Sync ref with isPending state
    useEffect(() => {
        isPendingRef.current = isPending;
    }, [isPending]);

    const validMoves = getValidMoves(board, turn);
    const score = calculateScore(board);

    useEffect(() => {
        let isCancelled = false;

        if (turn === 'WHITE' && status === 'IN_PROGRESS') {
            const triggerAI = async () => {
                const boardAtStart = JSON.stringify(board);

                // await new Promise(resolve => setTimeout(resolve, 500));
                if (isCancelled) return;

                const move = await getAIMove(board, 'WHITE', 1);

                if (move && !isCancelled) {
                    if (JSON.stringify(board) !== boardAtStart) {
                        return;
                    }

                    while (isPendingRef.current) {
                        await new Promise(resolve => setTimeout(resolve, 50));
                        if (isCancelled) return;
                    }

                    if (!isCancelled) {
                        handleMove(move.x, move.y, true);
                    }
                }
            };
            triggerAI();
        }

        return () => {
            isCancelled = true;
        };
    }, [turn, status, board]);

    const handleMove = async (x: number, y: number, force: boolean = false) => {
        console.log("handleMove called for", x, y, "isPending:", isPending, "status:", status, "force:", force);
        if (!force && (isPending || status !== 'IN_PROGRESS')) {
            console.log("handleMove exited early");
            return;
        }

                // --- Optimistic Update ---
                // 1. Calculate the new state locally immediately
                const optimisticBoard = applyMove(board, x, y, turn);
                const opponent = turn === 'BLACK' ? 'WHITE' : 'BLACK';

                // 2. Only switch turn if the opponent has valid moves
                const opponentMoves = getValidMoves(optimisticBoard, opponent);
                const nextTurn = opponentMoves.length > 0 ? opponent : turn;

                // 3. Update the UI state before the server responds
                setBoard(optimisticBoard);
                setTurn(nextTurn);
                // -------------------------
                startTransition(async () => {
            try {
                const updatedGame = await makeMove(gameId, x, y);
                // Sync with the actual server state (includes turn skips, game over, etc.)
                setBoard(JSON.parse(updatedGame.board));
                setTurn(updatedGame.turn as Player);
                setStatus(updatedGame.status);
                setWinner(updatedGame.winner as any);
            } catch (error) {
                // --- Rollback on Error ---
                // If the server move fails, revert to the previous state
                setBoard(board);
                setTurn(turn);
                console.error("Move failed:", error);
            }
        });
    };

    const handleRestart = async () => {
        // Optimistic reset
        const initialBoard = [[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,'WHITE','BLACK',null,null,null],[null,null,null,'BLACK','WHITE',null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]];
        setBoard(initialBoard as BoardType);
        setTurn('BLACK');
        setStatus('IN_PROGRESS');
        setWinner(null);

        startTransition(async () => {
            try {
                const updatedGame = await resetGame(gameId);
                setBoard(JSON.parse(updatedGame.board));
                setTurn(updatedGame.turn as Player);
                setStatus(updatedGame.status);
                setWinner(null);
            } catch (error) {
                console.error("Reset failed:", error);
            }
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
