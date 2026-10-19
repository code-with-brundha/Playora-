# 🎮 Playora — Modern 3D Multiplayer & Solo Gaming Arena

<p align="center">
  <img src="client/public/logo.png" width="220" alt="Playora 3D Logo" style="border-radius: 28px; box-shadow: 0 0 40px rgba(0, 245, 255, 0.4);" />
</p>

<p align="center">
  <strong>The Next-Generation Real-Time Web Gaming Hub</strong><br />
  Play 3D Mahjong Solitaire across 4 luxury themes, clash on the neon battle pedestal in Rock-Paper-Scissors 3D against neural AI, challenge friends in Tic-Tac-Toe Minimax, or host private online rooms with live chat.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Vite-6-purple?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8-black?style=for-the-badge&logo=socket.io" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas%20Ready-brightgreen?style=for-the-badge&logo=mongodb" alt="MongoDB" />
</p>

---

## 🌟 Highlights & Features

### 🎨 1. Futuristic 3D Design & Branding
- **Official 3D Logo & Wordmark**: High-fidelity glowing 3D logo emblem with cosmic planetary orbit rings, cyber neon lighting, and metallic illuminated wordmark.
- **Dynamic 3D Cards**: Interactive tilt perspective (`Card3D`) tracking cursor movement with real-time dynamic light glare.
- **Futuristic Cyber Theme**: Curated palette (Cyan `#00f5ff`, Neon Purple `#b026ff`, Pink `#ff007f`, Obsidian `#090d16`).
- **Dark & Light Modes**: Seamless one-click toggle with persistent localStorage theme state.
- **Web Audio Engine**: Zero-asset procedural sound effects synthesized directly using the browser's Web Audio API (countdown beeps, clashes, chimes, victory fanfares, surrender sounds).

---

### ✊✌️✋ 2. Rock-Paper-Scissors 3D (Cyber Battle Arena)
- **High-Tech 3D Arena**: Cyborg Robot Arm (left) vs Human Cyber Arm (right) facing off over an illuminated neon battle pedestal with animated clashing poses, countdown reveal, and particle effects.
- **Mode 1: Solo vs AI (3 Strategic Personalities)**:
  - *Casual*: Fun, unpredictable random moves.
  - *Tactical*: Psychological counter-strategy based on win-stay / lose-shift human tendencies.
  - *Master*: Quantum Markov transition model analyzing your historical move sequences to anticipate your next move.
- **Mode 2: Local 2-Player (Pass & Play)**:
  - Play simultaneously on the same keyboard (`A` / `S` / `D` for Player 1 vs `J` / `K` / `L` for Player 2) or with tactile touch/click buttons.
- **Mode 3: Live Online Multiplayer (Room Codes)**:
  - **Server-Authoritative Secret Commit-Reveal Locking**: The server keeps each player's move strictly hidden until both have submitted. Prevents network inspection or sneak-peeks before the simultaneous countdown reveal!
  - 30-second turn clocks with auto-surrender protection.
  - Real-time room chat with custom emotes.
  - Dynamic score tracking, winning streaks, XP rewards, and achievements (`rps_first_blood`, `rps_streak_3`).

---

### 🀄 3. Mahjong Solitaire 3D (Complete Solo Game)
- **100% Solvable Deals**: Reverse-removal generation algorithm ensures every dealt board can be won without deadlocks.
- **Tactile 3D Bevel Tiles**: Large, responsive tiles with 3D edge depth and unmistakable vibrant green selection highlighting (no disruptive banners shifting the layout).
- **4 Visual Themes**:
  1. *Neon Galaxy*: Signature Playora cyber aesthetic with glowing neon laser borders.
  2. *Classic Jade*: Traditional emerald velvet table with ivory and jade tiles.
  3. *Royal Gold*: Obsidian luxury table with gold-foil engraved tiles.
  4. *Pastel Dream*: Soft marshmallow clouds with lavender & mint gradient tiles.
- **4 Board Layouts**:
  1. *Classic Turtle* (Iconic multi-tier 72-tile traditional layout)
  2. *Fortress Arena* (Stepped ramparts with inner towers)
  3. *Imperial Dragon* (Winged serpentine tiers)
  4. *Starter Pyramid* (36-tile quick & relaxing layout)
- **Authentic Tile Sets**: Characters (Wan), Bamboo (Tiao), Dots (Bing), Winds (E/S/W/N), Dragons (Red/Green/White), Seasons & Flowers (any-with-any matching).
- **Core Mechanics**: Valid free-tile detection, 3D layer perspective, Undo move stack, Hints system, Board Shuffle, Move counter, Timer, Win celebration, and High Score recording.

---

### ⚔️ 4. Tic-Tac-Toe Arena (3 Distinct Modes)
- **Mode 1: Vs Computer (AI)**:
  - *Hard*: Unbeatable mathematical **Minimax** algorithm with depth scoring!
  - *Medium*: Tactical heuristics (blocks immediate wins, takes center/corners).
  - *Easy*: Casual random choices.
- **Mode 2: Local 2-Player (Pass & Play)**:
  - Play with a friend on the same laptop/phone with round score tracking.
- **Mode 3: Live Online Multiplayer**:
  - Socket.IO server-authoritative move validation.
  - 30-second turn clocks with warning pulses.
  - Rematch voting protocol & surrender/forfeit handling.
  - In-room live chat with emoji reactions.

---

### 🌐 5. Multiplayer Network & Matchmaking
- **Instant Matchmaking**: One-click "Quick Match" automatically finds an available public room or spins up a new arena.
- **Invite Room Codes**: 6-character alphanumeric uppercase codes (e.g. `K9TX2A`) with one-click copy and shareable URL direct links (`/room/CODE`).
- **Public Arenas Browser**: Real-time room list with live search, game type filters (Tic-Tac-Toe 3D, Rock-Paper-Scissors 3D), and spectator or player joining.
- **Resilient Reconnections**: Re-syncs room state and player turns seamlessly on network reconnect.

---

### 🛡️ 6. Authentication, Profiles & Achievements
- **Secure Authentication**: JWT token authentication with bcrypt password hashing.
- **Forgot Password**: Verification token flow with self-serve password resets.
- **Player Avatars**: 8 curated champions (*Cyber Ninja*, *Pixel Wizard*, *Neon Valkyrie*, *Cosmic Bot*, *Glitch Fox*, *Astro Cat*, *Quantum Knight*, *Shadow Spectre*).
- **Achievements System**: Unlockable badges (*First Steps*, *Victory Royale*, *Lightning Strike*, *Machine Slayer*, *Tactician*, *Tile Apprentice*, *Speed Demon*, *Zen Master*, *Social Gamer*, *Grandmaster*, *RPS First Blood*, *RPS Streak Master*).
- **Global Hall of Fame**: Dynamic leaderboards for both *All-Time* and *Weekly* master standings.
- **Account Control**: Change password, custom bio, theme preferences, and account deletion.

---

## 📁 Project Architecture

```
Playora/
├── package.json              # Monorepo scripts (dev, build, start)
├── render.yaml               # 1-Click Render Cloud deployment specification
├── README.md                 # Full documentation
├── server/
│   ├── package.json          # Node.js backend dependencies
│   ├── .env.example          # Environment variables template
│   └── src/
│       ├── config/           # Database & environment configuration
│       │   ├── db.js         # Mongoose connector with in-memory fallback
│       │   └── config.js
│       ├── models/
│       │   ├── User.js       # User schema with stats (Mahjong, RPS, TTT)
│       │   └── Room.js       # Multiplayer Room schema
│       ├── middleware/
│       │   └── auth.js       # JWT authentication middleware
│       ├── routes/
│       │   ├── auth.js       # Signup, login, stats tracking, leaderboard
│       │   └── rooms.js      # Room creation, quick-match, public listing
│       ├── sockets/
│       │   ├── socketManager.js # Real-time Socket.IO room coordination
│       │   └── games/
│       │       ├── ticTacToe.js         # Server Tic-Tac-Toe engine
│       │       └── rockPaperScissors.js # Server RPS secret commit-reveal engine
│       └── index.js          # Express app, HTTP server, and static serving
└── client/
    ├── package.json          # React, Vite, Tailwind dependencies
    ├── index.html            # HTML shell with Google fonts & official favicon
    ├── vite.config.js        # Vite build config with API/WebSocket proxy
    ├── tailwind.config.js    # Custom 3D perspective and glow colors
    ├── public/
    │   ├── logo.png          # Official Playora 3D emblem
    │   ├── logo-icon.png     # Favicon and icon badge
    │   └── playora-wordmark.png # Illuminated 3D brand wordmark
    └── src/
        ├── assets/           # Bundled assets & reference imagery
        ├── components/
        │   ├── common/       # Logo, Navbar, Footer, Card3D, Modals, Badges
        │   ├── games/
        │   │   ├── mahjong/   # Mahjong Solitaire 3D, tile sets, layouts, themes
        │   │   ├── tictactoe/ # TicTacToe online & offline Minimax AI boards
        │   │   └── rps/       # Rock-Paper-Scissors 3D arena, AI models, Pass & Play
        │   └── lobby/        # RoomLobby, RoomChat with real-time sockets
        ├── context/          # AuthContext, ThemeContext, SocketContext
        ├── pages/            # Home, Login, Signup, ForgotPass, Profile, Rooms, Games
        ├── utils/            # Web Audio synth, REST API client, avatars
        ├── App.jsx           # Routing & layout setup
        └── index.css         # 3D transforms, glassmorphism, glowing utilities
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (Local daemon OR MongoDB Atlas connection string — in-memory fallback included for instant zero-config testing!)

### 1. Install All Dependencies
From the repository root:
```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy `server/.env.example` to `server/.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5174
MONGODB_URI=mongodb://127.0.0.1:27017/playora
JWT_SECRET=playora-super-secret-jwt-key-2025
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 3. Start the Development Servers
In one terminal, start the backend server:
```bash
npm run dev:server
```
In a second terminal, start the frontend Vite server:
```bash
npm run dev:client
```
Open **`http://localhost:5174`** (or `http://localhost:5000` for production build) in your browser!

---

## 🐙 Pushing to GitHub

Follow these steps to push your project to a new or existing GitHub repository:

### 1. Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "feat: Add Rock-Paper-Scissors 3D arena, 3 AI bots, secret commit-reveal multiplayer, and 3D branding"
```

### 2. Add Remote Repository
Replace `<YOUR_GITHUB_USERNAME>` and `<REPO_NAME>` with your GitHub details:
```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<REPO_NAME>.git
git branch -M main
```

### 3. Push to GitHub
```bash
git push -u origin main
```

---

## ☁️ Free Public Deployment Guide

Playora is built ready for 100% free deployment using **Render** and **MongoDB Atlas**.

### Step 1: Create Free MongoDB Database (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register a free account.
2. Create a free **M0 Sandbox** cluster.
3. Under *Database Access*, create a user with a secure password.
4. Under *Network Access*, add `0.0.0.0/0` (Allow Access from Anywhere).
5. Click *Connect* -> *Drivers* and copy your connection string:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/playora?retryWrites=true&w=majority`

### Step 2: Deploy on Render
1. Push your repository to **GitHub**.
2. Sign in to [Render](https://render.com/).
3. Click **New** -> **Web Service** and connect your GitHub repository.
4. Render will automatically detect `render.yaml`, or you can configure manually:
   - **Environment**: Node
   - **Build Command**: `npm run install:all && npm run build:client`
   - **Start Command**: `npm start --prefix server`
5. Under **Environment Variables**, set:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGODB_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (Any secure random string)
   - `CLIENT_URL`: `https://<your-render-subdomain>.onrender.com`
6. Click **Deploy Web Service**! Render will build the React bundle and serve both the API and WebSocket server on a free HTTPS URL.

---

## 🎮 Game Controls & Rules

### Rock-Paper-Scissors 3D
- **Goal**: Win rounds against your opponent with classic moves (✊ beats ✌️, ✌️ beats ✋, ✋ beats ✊).
- **Controls**:
  - `Solo vs AI`: Choose difficulty (*Casual*, *Tactical*, *Master*), select your move card, and watch the cyber clash!
  - `Pass & Play (Local)`: Player 1 uses `A` (Rock), `S` (Scissors), `D` (Paper). Player 2 uses `J` (Rock), `K` (Scissors), `L` (Paper). Both moves lock silently and reveal simultaneously.
  - `Online 1v1`: Secret commit-reveal move locking ensures no player can view or alter their choice before both submit.

### Mahjong Solitaire 3D
- **Goal**: Clear the entire board by matching identical pairs of free tiles.
- **Free Tile Rule**: A tile is free if no tile is resting on top of it AND either its left or right side is open.
- **Special Rules**: Any Flower tile matches with any Flower tile (🌸, 🌺, 🌼, 🎋); any Season tile matches with any Season tile (🌸, ☀️, 🍁, ❄️).
- **Controls**:
  - `Hint`: Highlights a playable matching pair.
  - `Shuffle`: Re-randomizes tile values while preserving board structure.
  - `Undo`: Steps back the last matched pair.
  - `Theme`: Switch between Neon Galaxy, Classic Jade, Royal Gold, and Pastel Dream.

### Tic-Tac-Toe 3D
- **Goal**: Form 3 matching symbols in a row (horizontal, vertical, or diagonal).
- **Minimax AI**: In *Hard* mode, the algorithm computes optimal minimax tree evaluations to ensure an expert challenge.
- **Online Match**: 30-second clock per move, live chat in arena lobby, and instant rematch voting.

---

## 📜 License
MIT License. Built with pride for real-time web gaming.
