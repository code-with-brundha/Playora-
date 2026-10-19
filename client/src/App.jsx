import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CreateRoomModal } from './components/common/CreateRoomModal';
import { JoinRoomModal } from './components/common/JoinRoomModal';

import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { RoomsPage } from './pages/RoomsPage';
import { GameRoomPage } from './pages/GameRoomPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { MahjongPage } from './pages/MahjongPage';
import { TicTacToePage } from './pages/TicTacToePage';
import { RockPaperScissorsPage } from './pages/RockPaperScissorsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 selection:bg-purple-500 selection:text-white transition-colors duration-300">
              <Navbar
                onOpenCreateRoom={() => setIsCreateModalOpen(true)}
                onOpenJoinRoom={() => setIsJoinModalOpen(true)}
              />

              <main className="flex-1">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <HomePage
                        onOpenCreateRoom={() => setIsCreateModalOpen(true)}
                        onOpenJoinRoom={() => setIsJoinModalOpen(true)}
                      />
                    }
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route
                    path="/rooms"
                    element={
                      <RoomsPage
                        onOpenCreateRoom={() => setIsCreateModalOpen(true)}
                      />
                    }
                  />
                  <Route path="/room/:roomCode" element={<GameRoomPage />} />
                  <Route path="/games/mahjong" element={<MahjongPage />} />
                  <Route
                    path="/games/tictactoe"
                    element={
                      <TicTacToePage
                        onOpenCreateRoom={() => setIsCreateModalOpen(true)}
                        onOpenJoinRoom={() => setIsJoinModalOpen(true)}
                      />
                    }
                  />
                  <Route
                    path="/games/rps"
                    element={
                      <RockPaperScissorsPage
                        onOpenCreateRoom={(gameType) => {
                          setIsCreateModalOpen(true);
                        }}
                        onOpenJoinRoom={() => setIsJoinModalOpen(true)}
                      />
                    }
                  />
                  <Route
                    path="/games/rock-paper-scissors"
                    element={
                      <RockPaperScissorsPage
                        onOpenCreateRoom={(gameType) => {
                          setIsCreateModalOpen(true);
                        }}
                        onOpenJoinRoom={() => setIsJoinModalOpen(true)}
                      />
                    }
                  />
                  <Route
                    path="/leaderboard"
                    element={
                      <LeaderboardPage
                        onOpenCreateRoom={() => setIsCreateModalOpen(true)}
                      />
                    }
                  />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              <Footer />

              {/* Global Modals */}
              <CreateRoomModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
              />
              <JoinRoomModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
              />
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
