# Othello (Reversi) Design Specification

**Date:** 2026-02-15
**Status:** Validated

## Overview
A hybrid Othello game built with Next.js, utilizing a shared logic engine, server-side state persistence with Prisma/SQLite, and a client-side AI powered by Minimax in a Web Worker. The UI will be built using shadcn/ui for a modern aesthetic.

## Architecture

### 1. Shared Game Engine (`/lib/othello`)
- **Board Representation**: 8x8 grid stored as a flat array or 2D array.
- **Rules Engine**: Pure functions for:
    - `getValidMoves(board, player)`
    - `applyMove(board, move, player)`
    - `calculateScore(board)`
    - `isGameOver(board)`
- **Tech**: TypeScript.

### 2. Data Persistence (`Prisma + SQLite`)
- **Model**: `Game`
    - `id`: String (UUID)
    - `board`: String (Serialized JSON)
    - `turn`: Enum (BLACK, WHITE)
    - `status`: Enum (IN_PROGRESS, COMPLETED)
    - `winner`: Enum (BLACK, WHITE, DRAW, NULL)
    - `difficulty`: Int
    - `createdAt`: DateTime
    - `updatedAt`: DateTime

### 3. Hybrid Flow
- **Client**: Handles UI interactions, move previews, and AI move calculation.
- **Server**: Next.js Server Actions validate moves against the database and persist state.
- **AI**: Web Worker runs Minimax with Alpha-Beta pruning to prevent UI blocking.

## UI Design (shadcn/ui + Tailwind)
- **Board**: CSS Grid (8x8) with custom green felt styling.
- **Discs**: 3D-effect discs with flip animations (framer-motion).
- **Components**:
    - `Card`: Container for the game.
    - `Button`: Control actions.
    - `Badge`: Status indicators.
    - `Dialog`: Game over and settings.
    - `Toast`: Error/Notification feedback.

## Implementation Phases
1. **Setup**: Initialize Prisma, shadcn/ui, and project structure.
2. **Engine**: Implement and test core Othello logic.
3. **Database**: Create schema and Server Actions for game state.
4. **UI**: Build the responsive board and game components.
5. **AI**: Develop the Minimax algorithm in a Web Worker.
6. **Polish**: Add animations, sound effects (optional), and refine UX.

## Success Criteria
- Fully functional Othello ruleset.
- Persistent game state (resumable after refresh).
- Challenging AI with multiple difficulty levels.
- Polished, responsive UI using shadcn/ui.
