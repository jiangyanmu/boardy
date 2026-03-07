'use client';

import { useCallback, useMemo } from 'react';
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
        onMove(x, y);
    }, [disabled, onMove]);

    // Pre-calculate valid moves map for O(1) lookup during cell rendering
    const validMovesMap = useMemo(() => {
        const map = Array(8).fill(null).map(() => Array(8).fill(false));
        if (!disabled) {
            for (const move of validMoves) {
                map[move.y][move.x] = true;
            }
        }
        return map;
    }, [validMoves, disabled]);

    return (
        <div className="grid grid-cols-8 grid-rows-8 w-full aspect-square bg-emerald-800 border-[6px] lg:border-12 border-emerald-950 rounded-xl shadow-lg lg:shadow-2xl overflow-hidden">
            {board.map((row, y) =>
                row.map((cell, x) => (
                    <Cell
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        value={cell}
                        isValidMove={validMovesMap[y][x]}
                        onClick={handleCellClick}
                    />
                ))
            )}
        </div>
    );
}

