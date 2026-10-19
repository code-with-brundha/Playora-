import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/common/Logo';
import { playClickSound } from '../utils/audio';

export const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    playClickSound();

    const res = await login(emailOrUsername.trim(), password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    playClickSound();
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md relative">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl">
          {/* Official Logo Badge */}
          <div className="text-center mb-8 flex flex-col items-center">
            <Logo size="lg" showText={false} className="mb-4" />
            <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">
              Welcome Back to Playora
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sign in to track your global rating, win streaks, and match records.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                Email or Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder="player@playora.gg or username"
                  className="w-full px-4 py-3 pl-11 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
                <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  onClick={playClickSound}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pl-11 pr-11 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                />
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 text-white font-bold text-sm shadow-glow-cyan hover:opacity-95 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Arena'}</span>
            </button>
          </form>

          {/* Quick guest option */}
          <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800 text-center space-y-3">
            <button
              onClick={handleGuestContinue}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue as Instant Guest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                onClick={playClickSound}
                className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
