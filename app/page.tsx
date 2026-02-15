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
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-zinc-50">
            <h1 className="text-4xl font-black mb-8 tracking-tighter text-zinc-900 uppercase">Boardy Othello</h1>
            
            <GameInfo 
                turn={game.turn as any} 
                score={score} 
                status={game.status} 
            />

            <GameContainer 
                gameId={game.id}
                initialBoard={board}
                initialTurn={game.turn as any}
                initialStatus={game.status}
            />
        </main>
    );
}
