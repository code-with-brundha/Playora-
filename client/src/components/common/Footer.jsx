import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Zap } from 'lucide-react';
import { Logo } from './Logo';
import { playClickSound } from '../../utils/audio';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-[#070a12]/80 backdrop-blur-lg mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand with official Logo */}
          <div className="md:col-span-2 space-y-3">
            <Logo size="sm" />
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              The modern 3D multiplayer & solo web gaming platform. Play alone in Mahjong Solitaire across 4 themes, challenge the Minimax AI, or compete with friends in real-time.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5 text-emerald-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Socket.IO Connected
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-cyan-500">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Server Verified Moves
              </span>
            </div>
          </div>

          {/* Quick Games Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Games & Arenas
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/games/mahjong" onClick={playClickSound} className="hover:text-purple-400 transition-colors">
                  Mahjong Solitaire 3D (Solo)
                </Link>
              </li>
              <li>
                <Link to="/games/tictactoe" onClick={playClickSound} className="hover:text-cyan-400 transition-colors">
                  Tic-Tac-Toe (AI & Local 2P)
                </Link>
              </li>
              <li>
                <Link to="/rooms" onClick={playClickSound} className="hover:text-cyan-400 transition-colors">
                  Public Multiplayer Arenas
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" onClick={playClickSound} className="hover:text-amber-400 transition-colors">
                  Global Hall of Fame
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Full Stack Architecture
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>React 18 & Vite SPA</li>
              <li>Tailwind CSS & 3D Tilt</li>
              <li>Node.js & Express API</li>
              <li>Socket.IO & MongoDB</li>
              <li>Minimax Game Algorithm</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-500">
          <p>© {new Date().getFullYear()} Playora. Powered by real-time websockets & 3D graphics.</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>for players worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
