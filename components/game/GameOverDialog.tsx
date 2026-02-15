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

interface GameOverDialogProps {
    open: boolean;
    winner: Player | 'DRAW' | null;
    score: { BLACK: number; WHITE: number };
    onRestart: () => void;
}

export function GameOverDialog({ open, winner, score, onRestart }: GameOverDialogProps) {
    const getWinnerText = () => {
        if (winner === 'DRAW') return "It's a Draw!";
        return `${winner === 'BLACK' ? 'Black' : 'White'} Wins!`;
    };

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-black text-center tracking-tighter uppercase">
                        {getWinnerText()}
                    </DialogTitle>
                    <div className="text-center pt-4">
                        <div className="flex justify-around items-center">
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium uppercase text-zinc-500">Black</span>
                                <span className="text-4xl font-bold">{score.BLACK}</span>
                            </div>
                            <div className="text-2xl font-light text-zinc-300">vs</div>
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium uppercase text-zinc-500">White</span>
                                <span className="text-4xl font-bold">{score.WHITE}</span>
                            </div>
                        </div>
                    </div>
                </DialogHeader>
                <DialogFooter className="sm:justify-center mt-6">
                    <Button onClick={onRestart} className="w-full sm:w-auto px-8 font-bold uppercase tracking-widest">
                        Play Again
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
