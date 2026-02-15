'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Board, Player, Move } from '@/lib/othello';

export function useAI() {
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        workerRef.current = new Worker(new URL('../public/workers/ai-worker.js', import.meta.url));
        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const getAIMove = useCallback((board: Board, player: Player, difficulty: number): Promise<Move | null> => {
        return new Promise((resolve) => {
            if (!workerRef.current) {
                resolve(null);
                return;
            }

            const handleMessage = (e: MessageEvent) => {
                workerRef.current?.removeEventListener('message', handleMessage);
                resolve(e.data);
            };

            workerRef.current.addEventListener('message', handleMessage);
            workerRef.current.postMessage({ board, player, difficulty });
        });
    }, []);

    return { getAIMove };
}
