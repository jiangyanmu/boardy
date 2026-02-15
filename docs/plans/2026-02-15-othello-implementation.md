# Othello Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a hybrid Othello game with Next.js, shadcn/ui, Prisma/SQLite, and a Client-side AI (Web Worker).

**Architecture:** Shared TypeScript logic for game rules, Server Actions for persisting state in SQLite via Prisma, and a Web Worker for non-blocking Minimax AI.

**Tech Stack:** Next.js (App Router), TypeScript, Prisma, SQLite, shadcn/ui, Tailwind CSS, Framer Motion (animations).

---

### Task 1: Environment & Database Setup

**Files:**
- Create: `prisma/schema.prisma`
- Modify: `.env`
- Modify: `package.json`

**Step 1: Install dependencies**
Run: `npm install prisma @prisma/client lucide-react clsx tailwind-merge framer-motion`
Run: `npx shadcn-ui@latest init` (Select defaults, slate theme, global.css)

**Step 2: Create Prisma Schema**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Game {
  id          String   @id @default(uuid())
  board       String   // JSON stringified 8x8 array
  turn        String   // "BLACK" | "WHITE"
  status      String   // "IN_PROGRESS" | "COMPLETED"
  winner      String?  // "BLACK" | "WHITE" | "DRAW"
  difficulty  Int      @default(1)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Step 3: Initialize Database**
Run: `echo 'DATABASE_URL="file:./dev.db"' > .env`
Run: `npx prisma migrate dev --name init_game`

**Step 4: Commit**
```bash
git add prisma/schema.prisma .env package.json
git commit -m "chore: setup prisma and database"
```

---

### Task 2: Core Game Engine (Logic)

**Files:**
- Create: `lib/othello.ts`
- Create: `lib/othello.test.ts`

**Step 1: Write failing tests for move validation**
```typescript
import { getValidMoves } from './othello';

test('initial board has 4 valid moves for BLACK', () => {
    const board = createInitialBoard();
    const moves = getValidMoves(board, 'BLACK');
    expect(moves.length).toBe(4);
});
```

**Step 2: Implement logic**
Implement `createInitialBoard`, `getValidMoves`, `applyMove`, `isGameOver`, `calculateScore`.

**Step 3: Run tests**
Run: `npx jest lib/othello.test.ts` (Ensure jest is set up or use a simple runner)

**Step 4: Commit**
```bash
git add lib/othello.ts lib/othello.test.ts
git commit -m "feat: implement core othello logic"
```

---

### Task 3: UI Components (Board & Discs)

**Files:**
- Create: `components/game/Board.tsx`
- Create: `components/game/Disc.tsx`
- Create: `components/game/Cell.tsx`

**Step 1: Build the Cell and Disc with shadcn/ui patterns**
Use Tailwind for the 8x8 grid. Use Framer Motion for flip animations.

**Step 2: Build the Board component**
Ensure it accepts `board` and `onMove` props.

**Step 3: Commit**
```bash
git add components/game/
git commit -m "feat: add board and disc components"
```

---

### Task 4: Server Actions & State Management

**Files:**
- Create: `app/actions/game.ts`
- Modify: `app/page.tsx`

**Step 1: Create Server Actions**
- `createGame()`: Initialize a new game in SQLite.
- `makeMove(gameId, x, y)`: Validate and update the game state.

**Step 2: Connect Page to Actions**
Fetch game state on the server and pass to client components.

**Step 3: Commit**
```bash
git add app/actions/game.ts app/page.tsx
git commit -m "feat: implement game server actions"
```

---

### Task 5: AI Implementation (Web Worker)

**Files:**
- Create: `public/workers/ai-worker.js` (or `.ts` if transpiled)
- Create: `hooks/useAI.ts`

**Step 1: Implement Minimax with Alpha-Beta Pruning**
In the worker, implement a search algorithm with a heuristic evaluating corners, edges, and disc count.

**Step 2: Create hook to interface with Worker**
`useAI` hook to send board state and receive the best move.

**Step 3: Commit**
```bash
git add public/workers/ hooks/
git commit -m "feat: add AI minimax worker"
```

---

### Task 6: Final Polish & Game Over

**Files:**
- Create: `components/game/GameOverDialog.tsx`
- Modify: `app/page.tsx`

**Step 1: Add Game Over Dialog**
Use shadcn/ui `AlertDialog` to show the winner and restart button.

**Step 2: Add score badges and turn indicators**
Use shadcn/ui `Badge` and `Card`.

**Step 3: Final Commit**
```bash
git add .
git commit -m "feat: final polish and game over screen"
```
