'use client';

import { Player } from '@/lib/othello';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

interface GameInfoProps {
    turn: Player;
    score: { BLACK: number; WHITE: number };
    status: string;
    isSyncing?: boolean;
}

export function GameInfo({ turn, score, status, isSyncing }: GameInfoProps) {
    return (
        <Card className="w-full max-w-[600px] mb-6">
            <CardContent className="relative flex items-center justify-between p-6">
                {/* Sync Indicator */}
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] text-zinc-400 font-mono uppercase">
                    {isSyncing ? (
                        <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Syncing</span>
                        </>
                    ) : (
                        <>
                            <Cloud className="w-3 h-3" />
                            <span>Synced</span>
                        </>
                    )}
                </div>
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Black</span>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-zinc-900 border border-zinc-700" />
                        <span className="text-3xl font-bold">{score.BLACK}</span>
                    </div>
                    {turn === 'BLACK' && status === 'IN_PROGRESS' && (
                        <Badge variant="default" className="bg-zinc-900">Your Turn</Badge>
                    )}
                </div>

                <div className="text-center">
                    <Badge variant="outline" className="px-4 py-1">
                        {status === 'IN_PROGRESS' ? 'MATCH IN PROGRESS' : 'GAME OVER'}
                    </Badge>
                </div>

                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">White</span>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-zinc-100 border border-zinc-300" />
                        <span className="text-3xl font-bold">{score.WHITE}</span>
                    </div>
                    {turn === 'WHITE' && status === 'IN_PROGRESS' && (
                        <Badge variant="secondary">AI Thinking</Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
