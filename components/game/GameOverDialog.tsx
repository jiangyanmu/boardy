'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Player } from "@/lib/othello";
import { cn } from "@/lib/utils";

interface GameOverDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    winner: Player | 'DRAW' | null;
    score: { BLACK: number; WHITE: number };
    onRestart: () => void;
}

export function GameOverDialog({ open, onOpenChange, winner, score, onRestart }: GameOverDialogProps) {
    const isVictory = winner === 'BLACK';
    const isDefeat = winner === 'WHITE';
    const isDraw = winner === 'DRAW';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={true}
                className={cn(
                    "sm:max-w-110 border-none p-0 overflow-hidden rounded-2xl sm:rounded-none",
                    // Adapting close button color
                    isVictory ? "[&>button]:text-white" : "[&>button]:text-zinc-900"
                )}
            >
                <DialogDescription className="sr-only">
                    Game over. Final score: Black {score.BLACK}, White {score.WHITE}. {isVictory ? "You won!" : isDefeat ? "You lost." : "It's a draw."}
                </DialogDescription>

                {/* THE MATERIAL WRAPPER: Separated from Dialog portal logic */}
                <div className={cn(
                    "w-full h-full p-8 sm:p-14 flex flex-col items-center transition-colors duration-1000",
                    isVictory && "animate-victory-flow text-white shadow-2xl",
                    isDefeat && "animate-defeat-static bg-zinc-200 text-zinc-900",
                    isDraw && "bg-white text-zinc-900"
                )}>

                    <div className="relative z-20 w-full flex flex-col items-center">
                        <DialogHeader className="w-full mb-8 sm:mb-16">
                            <DialogTitle className={cn(
                                "text-5xl sm:text-7xl font-black text-center tracking-tighter uppercase leading-none italic",
                                isVictory && "text-victory-glow",
                                isDefeat && "text-zinc-600 font-bold opacity-90"
                            )}>
                                {isVictory ? "Victory" : isDefeat ? "Defeat" : "Draw"}
                            </DialogTitle>
                            <div className={cn(
                                "h-0.5 mx-auto mt-4 sm:mt-8 transition-all duration-1000",
                                isVictory ? "w-16 sm:w-24 bg-emerald-500 shadow-[0_0_10px_#10b981]" : "w-8 sm:w-12 bg-zinc-400"
                            )} />
                        </DialogHeader>

                        {/* Scores Section */}
                        <div className="flex items-center justify-between w-full px-2 sm:px-4 mb-12 sm:mb-20 gap-4">
                            <div className={cn(
                                "flex flex-col items-center flex-1 transition-all duration-700",
                                isVictory ? "scale-110 sm:scale-125" : "opacity-60"
                            )}>
                                <span className={cn(
                                    "text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] mb-2 sm:mb-4",
                                    isVictory ? "text-emerald-400" : "text-zinc-500"
                                )}>Player</span>
                                <span className={cn(
                                    "text-5xl sm:text-6xl font-black tabular-nums tracking-tighter",
                                    isVictory ? "text-white" : "text-zinc-900"
                                )}>{score.BLACK}</span>
                            </div>

                            <div className={cn(
                                "w-px h-12 sm:h-16 -rotate-12",
                                isVictory ? "bg-emerald-500/30" : "bg-zinc-400/40"
                            )} />

                            <div className={cn(
                                "flex flex-col items-center flex-1 transition-all duration-700",
                                isDefeat ? "scale-105 sm:scale-110" : "opacity-60"
                            )}>
                                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] mb-2 sm:mb-4 text-zinc-500">AI</span>
                                <span className={cn(
                                    "text-5xl sm:text-6xl font-black tabular-nums tracking-tighter",
                                    isDefeat ? "text-zinc-900" : "text-zinc-400"
                                )}>{score.WHITE}</span>
                            </div>
                        </div>

                        <DialogFooter className="w-full">
                            <Button
                                onClick={onRestart}
                                className={cn(
                                    "w-full py-6 sm:py-9 font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-[10px] sm:text-[11px] rounded-xl sm:rounded-none transition-all duration-500 active:scale-[0.97]",
                                    isVictory
                                        ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-xl"
                                        : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg"
                                )}
                            >
                                New Game
                            </Button>
                        </DialogFooter>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
