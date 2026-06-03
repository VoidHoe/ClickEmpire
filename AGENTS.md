# ClickEmpire — Shared Agent Instructions

This file is read by all AI assistants working on this project (Claude Code, Codex, ChatGPT, Cursor, etc.).
Follow these rules exactly regardless of which tool you are.

---

## Project Summary

ClickEmpire is an online multiplayer incremental game. Players build a digital empire:
Bedroom (crypto mining) → Casino → Esports Team. Each empire has a prestige challenge.
A social layer lets players send traps to mess with each other in real time.

Full design: `docs/superpowers/specs/2026-06-03-clickempire-design.md`
Current plan: `docs/superpowers/plans/2026-06-03-clickempire-phase1.md`

---

## Tech Stack

- **Frontend:** Electron + React 18 + TypeScript + Tailwind CSS (via electron-vite)
- **Backend:** Node.js + Express + Socket.io
- **Database:** better-sqlite3 (local save), server is stateless per session
- **Tests:** Vitest + @testing-library/react
- **Language:** TypeScript everywhere, strict mode

---

## File Structure

```
clickempire/
├── electron/         # Electron main process + preload IPC
├── src/
│   ├── engine/       # Pure TS game logic (no React, fully testable)
│   ├── empires/      # One folder per empire (bedroom/, casino/, esport/)
│   ├── save/         # SQLite save/load via IPC
│   ├── multiplayer/  # Socket.io client
│   ├── components/   # Reusable React UI components
│   └── screens/      # Full-screen views (one per empire)
├── server/           # Node.js backend (standalone, not bundled with Electron)
└── tests/            # Mirrors src/ structure
```

---

## Coding Rules

- **TypeScript strict mode** — no `any`, no implicit types
- **Pure functions first** — game logic in `src/engine/` and `src/empires/` must have zero React dependencies
- **TDD** — write the failing test before the implementation, always
- **No comments** unless the WHY is non-obvious
- **No unused code** — delete it, don't comment it out
- **Small focused files** — if a file exceeds ~150 lines, it's probably doing too much
- **No premature abstraction** — solve the problem in front of you

---

## Git Workflow

- **Branch naming:** `void/<feature>` or `friend/<feature>` — never commit directly to `main`
- **Commit style:** `feat:`, `fix:`, `chore:`, `test:` prefixes. One logical change per commit.
- **Always pull before starting work:** `git pull origin main`
- **Update PROGRESS.md at the end of every session** before pushing
- **PRs to merge into main** — no direct pushes to main

---

## Before Starting Any Session

1. `git pull origin main`
2. Read `PROGRESS.md` — understand what was last done and what's blocked
3. Read the current phase plan in `docs/superpowers/plans/`
4. Start on your assigned or next unblocked task

## At the End of Every Session

1. Run `npx vitest run` — all tests must pass before committing
2. Update `PROGRESS.md` with what you did, any blockers, and what's next
3. Commit and push your branch
4. Open a PR if the feature is complete

---

## Server

The backend runs separately from the Electron app.

```bash
# Start backend
npm run server   # runs on port 3001

# Start frontend
npm run dev      # opens Electron window
```

The frontend connects to `http://localhost:3001` by default.
For production/hosted play, update `SERVER_URL` in `src/multiplayer/SocketClient.ts`.

---

## Testing

```bash
npx vitest run          # run all tests once
npx vitest              # watch mode
npx vitest run tests/engine/   # run specific folder
```

All game logic in `src/engine/` and `src/empires/` must have test coverage.
UI components do not require tests in Phase 1.

---

## What's In Scope (Phase 1)

- Bedroom empire (full loop + prestige challenge)
- SQLite local save/load
- Socket.io multiplayer (player list + light traps)
- Basic UI for all of the above

## What's Out of Scope (Phase 1)

- Casino and Esports empires (Phase 2)
- Heavy sabotage / collab system (Phase 3)
- Cloud save, leaderboards, seasons
- Mobile port

Do not add features outside Phase 1 scope. YAGNI.
