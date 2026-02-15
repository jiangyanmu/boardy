'use client';

import { Player } from '@/lib/othello';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Cloud, RefreshCw } from 'lucide-react';

interface GameInfoProps {
    turn: Player;
    score: { BLACK: number; WHITE: number };
    status: string;
    isSyncing?: boolean;
}

export function GameInfo({ turn, score, status, isSyncing }: GameInfoProps) {
    return (
        <div className="w-full max-w-200 mb-4 flex items-center justify-between px-2">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
                        turn === 'BLACK' ? "bg-zinc-900 ring-2 ring-zinc-400 ring-offset-2 scale-110" : "bg-zinc-800 opacity-40"
                    )}>
                        <span className="text-white text-sm font-black tabular-nums">{score.BLACK}</span>
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Black</span>
                </div>

                <div className="h-6 w-px bg-zinc-200" />

                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md",
                        turn === 'WHITE' ? "bg-zinc-100 ring-2 ring-emerald-500 ring-offset-2 scale-110" : "bg-zinc-200 opacity-40"
                    )}>
                        <span className="text-zinc-900 text-sm font-black tabular-nums">{score.WHITE}</span>
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">White</span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1 text-[8px] text-zinc-400 font-mono uppercase">
                    {isSyncing ? (
                        <>
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                            <span>Syncing</span>
                        </>
                    ) : (
                        <>
                            <Cloud className="w-2.5 h-2.5" />
                            <span>Synced</span>
                        </>
                    )}
                </div>
                <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-black tracking-widest h-5 border-zinc-200 text-zinc-400">
                    {status === 'IN_PROGRESS' ? 'LIVE' : 'FINISHED'}
                </Badge>
            </div>
        </div>
    );
}
