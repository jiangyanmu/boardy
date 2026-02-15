'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { Board } from './Board';
import { Board as BoardType, Player, getValidMoves, calculateScore, applyMove } from '@/lib/othello';
import { makeMove, resetGame, syncGame } from '@/app/actions/game';
import { useAI } from '@/hooks/useAI';
import { GameOverDialog } from './GameOverDialog';
import { GameInfo } from './GameInfo';
import { Button } from '@/components/ui/button';

interface GameContainerProps {
    gameId: string;
    initialBoard: BoardType;
    initialTurn: Player;
    initialStatus: string;
    initialWinner: Player | 'DRAW' | null;
}

export function GameContainer({ gameId, initialBoard, initialTurn, initialStatus, initialWinner }: GameContainerProps) {
    // 1. Initialize state from localStorage if available, otherwise use props
    const [board, setBoard] = useState<BoardType>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`boardy-othello-board-${gameId}`);
            if (saved) return JSON.parse(saved);
        }
        return initialBoard;
    });
    const [turn, setTurn] = useState<Player>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`boardy-othello-turn-${gameId}`);
            if (saved) return saved as Player;
        }
        return initialTurn;
    });
    const [status, setStatus] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`boardy-othello-status-${gameId}`);
            if (saved) return saved;
        }
        return initialStatus;
    });
    const [winner, setWinner] = useState<Player | 'DRAW' | null>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(`boardy-othello-winner-${gameId}`);
            if (saved) return saved as any;
        }
        return initialWinner;
    });

    const [isPending, startTransition] = useTransition();
    const isPendingRef = useRef(isPending);
    const { getAIMove } = useAI();

    // 2. Persist state to localStorage on every change
    useEffect(() => {
        localStorage.setItem(`boardy-othello-board-${gameId}`, JSON.stringify(board));
        localStorage.setItem(`boardy-othello-turn-${gameId}`, turn);
        localStorage.setItem(`boardy-othello-status-${gameId}`, status);
        if (winner) localStorage.setItem(`boardy-othello-winner-${gameId}`, winner);
        else localStorage.removeItem(`boardy-othello-winner-${gameId}`);
    }, [board, turn, status, winner, gameId]);

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

                // Added artificial delay for better UX
                await new Promise(resolve => setTimeout(resolve, 800));
                if (isCancelled) return;

                const move = await getAIMove(board, 'WHITE', 1);

                if (move && !isCancelled) {
                    if (JSON.stringify(board) !== boardAtStart) {
                        return;
                    }

                    // For Local-First, AI doesn't need to wait for isPending (the database sync)
                    // unless we want to preserve strict sequence.
                    handleMove(move.x, move.y, true);
                }
            };
            triggerAI();
        }

        return () => {
            isCancelled = true;
        };
    }, [turn, status, board]);

    const handleMove = async (x: number, y: number, force: boolean = false) => {
        if (!force && status !== 'IN_PROGRESS') return;

        // --- Pure Local Logic (Authoritative) ---
        const newBoard = applyMove(board, x, y, turn);
        let nextTurn: Player = turn === 'BLACK' ? 'WHITE' : 'BLACK';
        let newStatus = 'IN_PROGRESS';
        let newWinner: Player | 'DRAW' | null = null;

        // Check if next player has moves
        if (getValidMoves(newBoard, nextTurn).length === 0) {
            nextTurn = turn; // Skip turn
            if (getValidMoves(newBoard, nextTurn).length === 0) {
                newStatus = 'COMPLETED';
                const finalScore = calculateScore(newBoard);
                newWinner = finalScore.BLACK > finalScore.WHITE ? 'BLACK' : finalScore.WHITE > finalScore.BLACK ? 'WHITE' : 'DRAW';
            }
        }

        // Update local state instantly
        setBoard(newBoard);
        setTurn(nextTurn);
        setStatus(newStatus);
        setWinner(newWinner);

        // Sync to Supabase in background
        startTransition(async () => {
            try {
                await syncGame(gameId, newBoard, nextTurn, newStatus, newWinner as any);
            } catch (error) {
                console.error("Background sync failed:", error);
            }
        });
    };

    const handleRestart = async () => {
        const initialBoard = [[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,'WHITE','BLACK',null,null,null],[null,null,null,'BLACK','WHITE',null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]];
        setBoard(initialBoard as BoardType);
        setTurn('BLACK');
        setStatus('IN_PROGRESS');
        setWinner(null);

        // Clear local storage
        localStorage.removeItem(`boardy-othello-board-${gameId}`);
        localStorage.removeItem(`boardy-othello-turn-${gameId}`);
        localStorage.removeItem(`boardy-othello-status-${gameId}`);
        localStorage.removeItem(`boardy-othello-winner-${gameId}`);

        // Sync restart to Supabase
        startTransition(async () => {
            try {
                await syncGame(gameId, initialBoard as BoardType, 'BLACK', 'IN_PROGRESS', null);
            } catch (error) {
                console.error("Restart sync failed:", error);
            }
        });
    };

    return (
        <div className="w-full flex flex-col items-center gap-8">
            <GameInfo
                turn={turn}
                score={score}
                status={status}
                isSyncing={isPending}
            />

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
