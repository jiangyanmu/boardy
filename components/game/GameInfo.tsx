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
        <div className="w-full flex flex-col gap-3 lg:gap-4 max-w-125 lg:max-w-none mx-auto">
            {/* Players Score Area */}
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
                {/* Black Player Card */}
                <div className={cn(
                    "relative overflow-hidden p-3 lg:p-4 rounded-xl border-2 transition-all duration-300",
                    turn === 'BLACK'
                        ? "bg-zinc-900 border-zinc-900 shadow-lg shadow-zinc-200 lg:-translate-y-1"
                        : "bg-white border-zinc-100 opacity-60"
                )}>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-400">Black</span>
                        <span className={cn(
                            "text-2xl lg:text-3xl font-black tabular-nums leading-none",
                            turn === 'BLACK' ? "text-white" : "text-zinc-900"
                        )}>{score.BLACK}</span>
                    </div>
                    {turn === 'BLACK' && (
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    )}
                </div>

                {/* White Player Card */}
                <div className={cn(
                    "relative overflow-hidden p-3 lg:p-4 rounded-xl border-2 transition-all duration-300",
                    turn === 'WHITE'
                        ? "bg-zinc-100 border-zinc-200 shadow-lg shadow-zinc-100 lg:-translate-y-1"
                        : "bg-white border-zinc-100 opacity-60"
                )}>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] lg:text-[10px] font-black text-zinc-400 uppercase tracking-widest">White</span>
                        <span className="text-2xl lg:text-3xl font-black text-zinc-900 tabular-nums leading-none">{score.WHITE}</span>
                    </div>
                    {turn === 'WHITE' && (
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    )}
                </div>
            </div>

            {/* Status Footer */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1 text-[9px] lg:text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
                    {isSyncing ? (
                        <>
                            <RefreshCw className="w-2.5 h-2.5 lg:w-3 lg:h-3 animate-spin text-emerald-600" />
                            <span>Syncing</span>
                        </>
                    ) : (
                        <>
                            <Cloud className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-emerald-600" />
                            <span>Synced</span>
                        </>
                    )}
                </div>
                <Badge
                    variant="outline"
                    className={cn(
                        "px-1.5 py-0 text-[8px] lg:text-[10px] font-black tracking-widest h-4 lg:h-5 border-zinc-100 lg:border-zinc-200",
                        status === 'IN_PROGRESS' ? "text-emerald-600 bg-emerald-50" : "text-zinc-400"
                    )}
                >
                    {status === 'IN_PROGRESS' ? 'LIVE' : 'FINISHED'}
                </Badge>
            </div>
        </div>
    );
}
