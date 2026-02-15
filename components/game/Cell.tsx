'use client';

import { Cell as CellType, Player } from '@/lib/othello';
import { Disc } from './Disc';
import { cn } from '@/lib/utils';

interface CellProps {
    value: CellType;
    isValidMove: boolean;
    onClick: () => void;
}

export function Cell({ value, isValidMove, onClick }: CellProps) {
    return (
        <div
            onClick={onClick}
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
}
