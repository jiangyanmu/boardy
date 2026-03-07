import prisma from '@/lib/prisma';
import { createGame } from './actions/game';
import { Board } from '@/components/game/Board';
import { GameInfo } from '@/components/game/GameInfo';
import { getValidMoves, calculateScore } from '@/lib/othello';
import { GameContainer } from '@/components/game/GameContainer';

export default async function Home() {
    let game = await prisma.game.findFirst({
        where: { status: 'IN_PROGRESS' },
        orderBy: { updatedAt: 'desc' },
    });

    if (!game) {
        game = await createGame();
    }

    const board = JSON.parse(game.board);
    const validMoves = getValidMoves(board, game.turn as any);
    const score = calculateScore(board);

    return (
        <main className="relative h-svh w-full flex flex-col items-center justify-between p-2 sm:p-4 lg:p-8 bg-white overflow-hidden">
            {/* Background Decorative Elements for Desktop */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-[0.03]">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-900 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900 rounded-full blur-[120px]" />
            </div>

            {/* Header Section - Very compact on mobile */}
            <div className="w-full max-w-6xl flex flex-col items-center lg:items-start shrink-0 py-1 sm:py-2">
                <h1 className="text-xl sm:text-3xl lg:text-5xl font-black tracking-tighter text-zinc-900 uppercase leading-none">
                    Boardy <span className="text-zinc-300">Othello</span>
                </h1>
                <div className="hidden sm:flex items-center gap-2 mt-1">
                    <div className="h-0.5 w-8 bg-zinc-900 rounded-full" />
                    <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-400">Local First Strategy</span>
                </div>
            </div>

            {/* Game Content Area - Hero element */}
            <div className="w-full flex-1 flex flex-col items-center justify-center overflow-hidden">
                <GameContainer
                    gameId={game.id}
                    initialBoard={board}
                    initialTurn={game.turn as any}
                    initialStatus={game.status}
                    initialWinner={game.winner as any}
                />
            </div>

            {/* Simple Footer - Hidden on mobile height < 600px */}
            <footer className="hidden sm:block shrink-0 pt-2 lg:pt-8 text-[8px] lg:text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                Built with Next.js & Local-First Tech
            </footer>
        </main>
    );
}
