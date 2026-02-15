# Local-First Othello Optimization Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Eliminate gameplay latency by making Othello "Local-First," using Supabase only for deferred persistence of completed games.

**Architecture:** Client-side state management using React hooks, persistent local state via `localStorage`, and background synchronization to Supabase via Server Actions only when the game concludes.

**Tech Stack:** React (useState, useEffect), localStorage, Next.js Server Actions, Prisma/Supabase.

---

### Task 1: Client-Side Engine Integration

**Files:**
- Modify: `components/game/GameContainer.tsx`

**Step 1: Move game logic to Client**
Refactor `handleMove` to apply logic locally using the `lib/othello` engine instead of calling the server action immediately.

**Step 2: Implement Local Persistence**
Add `useEffect` to save/load the game state from `localStorage` keyed by `gameId`.

**Step 3: Commit**
```bash
git add components/game/GameContainer.tsx
git commit -m "feat: move core game loop to client for 0ms latency"
```

---

### Task 2: Deferred Supabase Synchronization

**Files:**
- Modify: `app/actions/game.ts`
- Modify: `components/game/GameContainer.tsx`

**Step 1: Create Sync Server Action**
Implement `syncGame(gameId, board, turn, status, winner)` to update the entire game state in one go.

**Step 2: Trigger Sync on Game Over**
Update `GameContainer` to call `syncGame` only when `status === 'COMPLETED'`.

**Step 3: Commit**
```bash
git add app/actions/game.ts components/game/GameContainer.tsx
git commit -m "feat: implement deferred cloud sync on game completion"
```

---

### Task 3: Background Auto-Save (Optional but Recommended)

**Files:**
- Modify: `components/game/GameContainer.tsx`

**Step 1: Debounced Auto-Save**
Add a background sync that pushes to Supabase every 10 seconds (if changes occurred) to ensure progress isn't lost if the user switches devices.

**Step 2: Commit**
```bash
git add components/game/GameContainer.tsx
git commit -m "feat: add background auto-save to cloud"
```

---

### Task 4: UI Cleanup & Feedback

**Files:**
- Modify: `components/game/GameInfo.tsx`

**Step 1: Cloud Sync Indicator**
Add a small "Synced" or "Saving..." indicator to let the user know their progress is being backed up to the cloud.

**Step 2: Final Commit**
```bash
git add .
git commit -m "feat: final local-first polish and sync indicator"
```
