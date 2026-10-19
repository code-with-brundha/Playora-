import React from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center mb-6 shadow-xl border border-slate-200 dark:border-white/10">
        <Gamepad2 className="w-10 h-10 text-cyan-500 animate-bounce" />
      </div>
      <h1 className="text-4xl font-black font-display text-slate-900 dark:text-white">
        404 - Arena Not Found
      </h1>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-2 mb-8">
        The gaming arena or page you are looking for has expired or moved into hyperspace.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-glow-cyan transition-all flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
};
