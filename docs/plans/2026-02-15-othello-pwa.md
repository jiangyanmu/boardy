# Othello PWA Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Turn the Othello game into a Progressive Web App (PWA) for a native-like mobile experience.

**Architecture:** Use `next-pwa` to generate a Service Worker for offline asset caching and a Web Manifest for home-screen installation.

**Tech Stack:** `next-pwa`, Web Manifest, Service Workers, React (Meta tags).

---

### Task 1: next-pwa Installation & Configuration

**Files:**
- Modify: `next.config.ts`
- Modify: `package.json`

**Step 1: Install dependencies**
Run: `npm install @ducanh2912/next-pwa` (Note: using @ducanh2912/next-pwa as it has better Next.js 14/15 support)

**Step 2: Update Next Config**
```typescript
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

export default withPWA({
  // Your existing nextConfig here
});
```

**Step 3: Commit**
```bash
git add next.config.ts package.json
git commit -m "chore: install and configure next-pwa"
```

---

### Task 2: Web Manifest & App Icons

**Files:**
- Create: `public/manifest.json`
- Create: `public/icons/` (Placeholder icons)

**Step 1: Create Manifest**
```json
{
  "name": "Boardy Othello",
  "short_name": "Othello",
  "description": "A strategic Othello game with offline AI support.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#065f46",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

**Step 2: Generate placeholder icons**
(I will use simple colored SVG/PNG placeholders since I cannot design complex icons).

**Step 3: Commit**
```bash
git add public/manifest.json public/icons/
git commit -m "feat: add web manifest and app icons"
```

---

### Task 3: Mobile Meta Tags & Layout

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Add PWA meta tags**
Add `theme-color`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, and link to manifest.

**Step 2: Commit**
```bash
git add app/layout.tsx
git commit -m "feat: add mobile meta tags for PWA support"
```

---

### Task 4: Offline Optimization

**Files:**
- Modify: `hooks/useAI.ts`

**Step 1: Ensure AI worker is cached**
Ensure the service worker strategy includes the `/workers/` directory. (Handled by default in next-pwa usually, but worth verifying).

**Step 2: Final Commit**
```bash
git add .
git commit -m "feat: final PWA polish and offline readiness"
```
