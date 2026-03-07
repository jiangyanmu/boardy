'use client';

import { memo } from 'react';
import { Cell as CellType } from '@/lib/othello';
import { Disc } from './Disc';
import { cn } from '@/lib/utils';

interface CellProps {
    x: number;
    y: number;
    value: CellType;
    isValidMove: boolean;
    onClick: (x: number, y: number) => void;
}

export const Cell = memo(function Cell({ x, y, value, isValidMove, onClick }: CellProps) {
    return (
        <div
            onClick={() => isValidMove && onClick(x, y)}
            className={cn(
                "relative flex items-center justify-center w-full aspect-square border-[0.5px] border-emerald-900/30 cursor-pointer transition-colors",
                isValidMove ? "hover:bg-emerald-600/30" : "hover:bg-emerald-700/20"
            )}
        >
            {value && <Disc color={value} />}
            {isValidMove && !value && (
                <div className="w-3 h-3 rounded-full bg-emerald-900/20 animate-pulse" />
            )}
        </div>
    );
}, (prev, next) => {
    // Only re-render if the value changes or the move validity changes
    // Coordinates and onClick are considered stable enough or matched by logic
    return prev.value === next.value && prev.isValidMove === next.isValidMove;
});

