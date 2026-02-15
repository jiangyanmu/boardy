'use client';

import { motion } from 'framer-motion';
import { Player } from '@/lib/othello';

interface DiscProps {
    color: Player;
}

export function Disc({ color }: DiscProps) {
    return (
        <motion.div
            initial={false}
            animate={{
                rotateY: color === 'BLACK' ? 0 : 180,
            }}
            transition={{
                duration: 0.6,
                type: 'spring',
                stiffness: 260,
                damping: 20,
            }}
            className="relative w-[85%] h-[85%] preserve-3d"
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Black Side */}
            <div
                className="absolute inset-0 rounded-full bg-zinc-900 border-2 border-zinc-700 shadow-lg backface-hidden"
                style={{ backfaceVisibility: 'hidden' }}
            />
            {/* White Side */}
            <div
                className="absolute inset-0 rounded-full bg-zinc-100 border-2 border-zinc-300 shadow-lg backface-hidden"
                style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                }}
            />
        </motion.div>
    );
}
