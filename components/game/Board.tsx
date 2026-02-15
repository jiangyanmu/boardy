'use client';

import { Board as BoardType, Move, Player } from '@/lib/othello';
import { Cell } from './Cell';

interface BoardProps {
    board: BoardType;
    validMoves: Move[];
    onMove: (x: number, y: number) => void;
    disabled?: boolean;
}

export function Board({ board, validMoves, onMove, disabled }: BoardProps) {
    const isMoveValid = (x: number, y: number) => {
        return validMoves.some(m => m.x === x && m.y === y);
    };

    return (
        <div className="grid grid-cols-8 grid-rows-8 w-full max-w-[600px] aspect-square bg-emerald-800 border-4 border-emerald-950 rounded-sm shadow-2xl overflow-hidden">
            {board.map((row, y) =>
                row.map((cell, x) => (
                    <Cell
                        key={`${x}-${y}`}
                        value={cell}
                        isValidMove={!disabled && isMoveValid(x, y)}
                        onClick={() => !disabled && isMoveValid(x, y) && onMove(x, y)}
                    />
                ))
            )}
        </div>
    );
}
