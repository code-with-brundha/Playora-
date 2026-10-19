import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Trophy,
  Users,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Settings,
  Sparkles,
  ChevronDown,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { toggleMute, getMuteState, playClickSound } from '../../utils/audio';
import { AvatarBadge } from './AvatarBadge';
import { Logo } from './Logo';
import { api } from '../../utils/api';

export const Navbar = ({ onOpenCreateRoom, onOpenJoinRoom }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [muted, setMuted] = useState(getMuteState());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [matching, setMatching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleMuteToggle = () => {
    const next = toggleMute();
    setMuted(next);
    if (!next) playClickSound();
  };

  const handleQuickMatch = async () => {
    playClickSound();
    setMatching(true);
    try {
      const res = await api.rooms.quickMatch('tictactoe');
      navigate(`/room/${res.roomCode}`);
    } catch (err) {
      onOpenCreateRoom();
    } finally {
      setMatching(false);
    }
  };

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'RPS 3D', path: '/games/rps', badge: 'New' },
    { name: 'Mahjong 3D', path: '/games/mahjong', badge: 'Solo' },
    { name: 'Tic-Tac-Toe', path: '/games/tictactoe', badge: 'AI & 2P' },
    { name: 'Arenas', path: '/rooms' },
    { name: 'Leaderboard', path: '/leaderboard' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/75 dark:bg-[#090d16]/85 border-b border-slate-200/80 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Official Playora Brand Logo */}
        <Link
          to="/"
          onClick={playClickSound}
          className="focus:outline-none"
        >
          <Logo size="md" />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={playClickSound}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-white dark:bg-slate-700/80 text-cyan-600 dark:text-cyan-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/40'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[9px] uppercase font-bold tracking-tight px-1.5 py-0.2 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Quick Match, Sound, Theme, User Auth */}
        <div className="flex items-center gap-2.5">
          {/* Quick Match Action */}
          <button
            onClick={handleQuickMatch}
            disabled={matching}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-pink-500/15 hover:from-cyan-500/25 hover:to-pink-500/25 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-bold transition-all"
            title="Instant Matchmaking"
          >
            <Zap className={`w-3.5 h-3.5 text-cyan-400 ${matching ? 'animate-spin' : ''}`} />
            <span>{matching ? 'Matching...' : 'Quick Match'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleMuteToggle}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-cyan-500" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              playClickSound();
              toggleTheme();
            }}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-indigo-500" />
            )}
          </button>

          {/* User Auth Profile Info */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10 transition-all"
              >
                <div className="flex flex-col text-right hidden sm:block">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {user?.username}
                  </span>
                  <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono font-semibold">
                    ⭐ {user?.stats?.points || 1000} PTS
                  </span>
                </div>
                <AvatarBadge avatarId={user?.avatar} size="sm" />
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-panel shadow-2xl p-2 z-50 border border-slate-200 dark:border-white/10 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2.5 border-b border-slate-200 dark:border-slate-800 mb-1">
                      <p className="text-[11px] text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {user?.username}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => {
                        playClickSound();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-cyan-500" />
                      Player Profile & Stats
                    </Link>

                    <Link
                      to="/profile?tab=settings"
                      onClick={() => {
                        playClickSound();
                        setDropdownOpen(false);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-purple-400" />
                      Account Settings
                    </Link>

                    <button
                      onClick={() => {
                        playClickSound();
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                onClick={playClickSound}
                className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4 text-cyan-500" />
                <span>Log In</span>
              </Link>
              <Link
                to="/signup"
                onClick={playClickSound}
                className="relative px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 hover:shadow-glow-cyan transition-all transform hover:-translate-y-0.5 flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
