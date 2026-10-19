import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight, Clipboard } from 'lucide-react';
import { Modal } from './Modal';
import { playClickSound } from '../../utils/audio';

export const JoinRoomModal = ({ isOpen, onClose }) => {
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    const code = roomCode.trim().toUpperCase();
    if (!code) {
      setError('Please enter a room code');
      return;
    }
    if (code.length < 4) {
      setError('Room code must be at least 4 characters');
      return;
    }

    playClickSound();
    onClose();
    navigate(`/room/${code}`);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        // If it's a URL like http://.../room/XYZ123, extract code
        const match = text.match(/\/room\/([a-zA-Z0-9]+)/);
        if (match) {
          setRoomCode(match[1].toUpperCase());
        } else {
          setRoomCode(text.trim().toUpperCase());
        }
      }
    } catch (e) {}
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Join with Room Code">
      <form onSubmit={handleJoin} className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            6-Digit Room Code
          </label>
          <div className="relative">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="e.g. K9TX2A"
              maxLength={8}
              className="w-full px-4 py-3.5 pl-11 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono tracking-widest text-lg font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all uppercase"
            />
            <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="button"
              onClick={handlePaste}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <Clipboard className="w-3 h-3" /> Paste
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Ask your friend for their invite code or paste the shared link.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 text-white font-bold text-sm shadow-glow-cyan hover:opacity-95 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <span>Join Arena</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </Modal>
  );
};
