import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { api } from '../utils/api';
import { playClickSound } from '../utils/audio';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: enter email, 2: enter code & new pass, 3: success
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    playClickSound();

    try {
      const res = await api.auth.forgotPassword(email.trim());
      setMessage(res.message);
      if (res.resetCode) {
        setResetCode(res.resetCode);
      }
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to request password reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetCode.trim() || !newPassword) {
      setError('Please provide the reset code and your new password');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    playClickSound();

    try {
      const res = await api.auth.resetPassword(resetCode.trim(), newPassword);
      setMessage(res.message);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md relative">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-white/10 shadow-2xl">
          <div className="text-center mb-8 flex flex-col items-center">
            <Logo size="lg" showText={false} className="mb-4" />
            <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white">
              Reset Your Password
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Recover access to your Playora gaming profile and rank
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
              {error}
            </div>
          )}

          {message && step !== 3 && (
            <div className="mb-5 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
              {message}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Account Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@example.com"
                    required
                    className="w-full px-4 py-3 pl-11 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 text-white font-bold text-sm shadow-glow-cyan hover:opacity-95 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Sending Request...' : 'Send Verification Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  6-Digit Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="e.g. 849201"
                    maxLength={10}
                    required
                    className="w-full px-4 py-3 pl-11 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono text-base font-bold tracking-widest placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
                  />
                  <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    required
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
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 text-white font-bold text-sm shadow-glow-cyan hover:opacity-95 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Password Successfully Reset!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You can now sign in using your updated credentials.
              </p>
              <button
                onClick={() => {
                  playClickSound();
                  navigate('/login');
                }}
                className="w-full py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm shadow-glow-cyan transition-all"
              >
                Proceed to Sign In
              </button>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
            <Link
              to="/login"
              onClick={playClickSound}
              className="text-xs font-bold text-slate-500 hover:text-cyan-500 transition-colors"
            >
              Remember your password? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
