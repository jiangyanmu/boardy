-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "board" TEXT NOT NULL,
    "turn" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "winner" TEXT,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
