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

🌐 **Live Demo**: https://playora-game-arena.onrender.com/
👉🏻 **Source Code**:  https://code-with-brundha.github.io/Playora-/

## 🌟 Highlights & Features

### 🎨 1. Futuristic 3D Design & Branding
- **Neon-inspired UI**: glowing accents, glass-style surfaces, and 3D card effects.
- **Light and dark themes**: switch between themes.
- **Player accounts**: sign-up/sign-in, profile and avatar options, and account settings where configured.
- **Multiplayer rooms**: create or join rooms with codes; public-room browsing and quick matchmaking where enabled.
- **Progress tracking**: scores, achievements, and leaderboards where implemented.
- **Responsive layout**: designed for desktop and smaller screens.
- **Sound effects**: browser-generated audio effects for supported game actions.

---

### ✊✌️✋ 2. Rock-Paper-Scissors 3D (Cyber Battle Arena)
- Play against the computer, locally with another player, or online where supported.
- AI options include Casual, Tactical, and Master modes.
- Online matches use server-side move handling so a player's choice stays hidden until the round      is ready to reveal.
- Includes round scoring, streak tracking, countdown effects, and room chat where available.

---

### 🀄 3. Mahjong Solitaire 3D (Complete Solo Game)
- Match pairs of free tiles to clear the board.
- Choose from four visual themes: Neon Galaxy, Classic Jade, Royal Gold, and Pastel Dream.
- Multiple board layouts, including Classic Turtle, Fortress Arena, Imperial Dragon, and Starter  Pyramid.
- Includes tile selection, hints, undo, shuffle, a move counter, a timer, and completion tracking.

---

### ⚔️ 4. Tic-Tac-Toe Arena (3 Distinct Modes)
- Play against the computer with Easy, Medium, and Hard difficulty levels.
- Play locally with a friend or use online multiplayer rooms where configured.
- Includes win/draw detection and online room features such as turn timers, rematches, and chat where available.
  
---

### 🧰 Tech Stack
| Area | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Real-time multiplayer | Socket.IO |
| Database | MongoDB / MongoDB Atlas |
| Authentication | JWT and bcrypt |
| Version control | Git and GitHub |

---

## 📁 Project Structure

```
Playora/
├── package.json
├── render.yaml
├── README.md
├── server/
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── config/
│       ├── models/
│       ├── middleware/
│       ├── routes/
│       ├── sockets/
│       └── index.js
└── client/
    ├── package.json
    ├── index.html
    ├── public/
    │   ├── logo.png
    │   ├── logo-icon.png
    │   └── playora-wordmark.png
    └── src/
        ├── assets/
        ├── components/
        ├── context/
        ├── pages/
        ├── utils/
        ├── App.jsx
        └── index.css
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
If the backend uses environment variables, copy server/.env.example to server/.env and fill in the values required by your local setup. The exact variables depend on your configuration.

Security: Never commit your real .env file, passwords, database connection strings, API keys, or JWT secrets to GitHub. For deployment, add these values through your hosting provider's environment settings.

### 3. Start the Development Servers
In one terminal, start the backend server:
```bash
npm run dev:server
```
In a second terminal, start the frontend Vite server:
```bash
npm run dev:client
```
Open the local URL printed by Vite in your terminal. The default frontend URL may be **`http://localhost:5174`**, depending on your configuration.

---

## 🎮 Basic Game Rules
- **Rock-Paper-Scissors**: Rock beats scissors, scissors beat paper, and paper beats rock.
- **Mahjong Solitaire**: Match identical available tile pairs. A tile is generally free when no tile covers it and at least one side is open. Special flower/season matching depends on the tile rules implemented in the game.
- **Tic-Tac-Toe**: Get three of your symbols in a horizontal, vertical, or diagonal line to win.


<p align="center">Made with ❤️ for people who love to play.</p>
