'use client';

import { useCallback } from 'react';
import { Board as BoardType, Move } from '@/lib/othello';
import { Cell } from './Cell';

interface BoardProps {
    board: BoardType;
    validMoves: Move[];
    onMove: (x: number, y: number) => void;
    disabled?: boolean;
}

export function Board({ board, validMoves, onMove, disabled }: BoardProps) {
    const handleCellClick = useCallback((x: number, y: number) => {
        if (disabled) return;
        // The check if move is valid is already handled in Cell or here
        // But to keep it stable, we pass the raw onMove and let Cell decide if it's clickable
        onMove(x, y);
    }, [disabled, onMove]);

    return (
        <div className="grid grid-cols-8 grid-rows-8 w-full aspect-square bg-emerald-800 border-[6px] lg:border-12 border-emerald-950 rounded-xl shadow-2xl shadow-emerald-900/20 overflow-hidden">
            {board.map((row, y) =>
                row.map((cell, x) => {
                    const isValid = !disabled && validMoves.some(m => m.x === x && m.y === y);
                    return (
                        <Cell
                            key={`${x}-${y}`}
                            x={x}
                            y={y}
                            value={cell}
                            isValidMove={isValid}
                            onClick={handleCellClick}
                        />
                    );
                })
            )}
        </div>
    );
}

