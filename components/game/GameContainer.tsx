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
    // 1. Initialize state from props (matches Server Side Rendering)
    const [board, setBoard] = useState<BoardType>(initialBoard);
    const [turn, setTurn] = useState<Player>(initialTurn);
    const [status, setStatus] = useState(initialStatus);
    const [winner, setWinner] = useState<Player | 'DRAW' | null>(initialWinner);
    const [isMounted, setIsMounted] = useState(false);

    const [isPending, startTransition] = useTransition();
    const isPendingRef = useRef(isPending);
    const { getAIMove } = useAI();

    // 2. On mount, load from localStorage if available
    useEffect(() => {
        setIsMounted(true);
        const savedBoard = localStorage.getItem(`boardy-othello-board-${gameId}`);
        const savedTurn = localStorage.getItem(`boardy-othello-turn-${gameId}`);
        const savedStatus = localStorage.getItem(`boardy-othello-status-${gameId}`);
        const savedWinner = localStorage.getItem(`boardy-othello-winner-${gameId}`);

        if (savedBoard) setBoard(JSON.parse(savedBoard));
        if (savedTurn) setTurn(savedTurn as Player);
        if (savedStatus) setStatus(savedStatus);
        if (savedWinner) setWinner(savedWinner as any);
    }, [gameId]);

    // 3. Persist state to localStorage on every change
    useEffect(() => {
        if (!isMounted) return;
        localStorage.setItem(`boardy-othello-board-${gameId}`, JSON.stringify(board));
        localStorage.setItem(`boardy-othello-turn-${gameId}`, turn);
        localStorage.setItem(`boardy-othello-status-${gameId}`, status);
        if (winner) localStorage.setItem(`boardy-othello-winner-${gameId}`, winner);
        else localStorage.removeItem(`boardy-othello-winner-${gameId}`);
    }, [board, turn, status, winner, gameId, isMounted]);

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
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-12 px-4 overflow-hidden lg:overflow-visible">

            {/* Mobile: Game Info at Top (Responsive max-width) */}
            <div className="w-full lg:hidden max-w-125 mb-2">
                <GameInfo
                    turn={turn}
                    score={score}
                    status={status}
                    isSyncing={isPending}
                />
            </div>

            {/* Left/Main Side: The Board */}
            <div className="w-full max-w-[min(90vw,480px)] lg:max-w-125 xl:max-w-150 shrink-0">
                <Board
                    board={board}
                    validMoves={validMoves}
                    onMove={handleMove}
                    disabled={status !== 'IN_PROGRESS'}
                />
            </div>

            {/* Right/Side Side: Info & Controls */}
            <div className="w-full lg:w-80 flex flex-col gap-6">
                <div className="bg-white p-4 lg:p-6 rounded-2xl shadow-sm border border-zinc-100">
                    <h2 className="hidden lg:block text-xs font-black text-zinc-400 uppercase tracking-widest mb-6">Game Status</h2>

                    {/* Desktop only: Info inside the card */}
                    <div className="hidden lg:block mb-8">
                        <GameInfo
                            turn={turn}
                            score={score}
                            status={status}
                            isSyncing={isPending}
                        />
                    </div>

                    <div className="lg:pt-8 lg:border-t border-zinc-100 flex flex-col gap-3">
                        <Button
                            variant="default"
                            onClick={handleRestart}
                            className="w-full font-black uppercase tracking-widest py-5 lg:py-6 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shadow-lg shadow-zinc-200 transition-all active:scale-95 text-xs lg:text-sm"
                        >
                            New Game
                        </Button>
                        <p className="hidden lg:block text-[10px] text-center text-zinc-400 font-medium px-4 leading-relaxed">
                            Othello is a strategy board game for two players, played on an 8×8 uncheckered board.
                        </p>
                    </div>
                </div>

                {/* Desktop-only Help Section */}
                <div className="hidden lg:block bg-zinc-100/50 p-6 rounded-2xl border border-dashed border-zinc-200">
                    <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">How to play</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                        A move is made by placing a disc of the player's color on the board in a position that "out-flanks" one or more of the opponent's discs.
                    </p>
                </div>
            </div>

            <GameOverDialog
                open={status === 'COMPLETED'}
                winner={winner}
                score={score}
                onRestart={handleRestart}
            />
        </div>
    );
}
