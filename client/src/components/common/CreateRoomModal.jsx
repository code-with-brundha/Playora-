import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Globe, Swords } from 'lucide-react';
import { Modal } from './Modal';
import { api } from '../../utils/api';
import { playClickSound } from '../../utils/audio';

export const CreateRoomModal = ({ isOpen, onClose, defaultGameType = 'tictactoe' }) => {
  const [roomName, setRoomName] = useState('');
  const [gameType, setGameType] = useState(defaultGameType);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (defaultGameType) {
      setGameType(defaultGameType);
    }
  }, [defaultGameType, isOpen]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      playClickSound();
      const res = await api.rooms.create({
        roomName: roomName.trim() || undefined,
        gameType,
        isPrivate
      });

      onClose();
      navigate(`/room/${res.room.roomCode}`);
    } catch (err) {
      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Game Arena">
      <form onSubmit={handleCreate} className="space-y-5">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Arena Name (Optional)
          </label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="e.g. Champions Arena"
            maxLength={30}
            className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Select Game
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Tic-Tac-Toe */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setGameType('tictactoe');
              }}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                gameType === 'tictactoe'
                  ? 'border-cyan-400 bg-cyan-500/15 shadow-glow-cyan'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/40 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-black text-lg">
                #
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Tic-Tac-Toe 3D</h4>
                <p className="text-[10px] text-slate-400">2P • Minimax AI & Online</p>
              </div>
            </button>

            {/* Rock-Paper-Scissors */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setGameType('rps');
              }}
              className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                gameType === 'rps'
                  ? 'border-pink-400 bg-pink-500/15 shadow-glow-pink'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/40 hover:border-slate-300'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black text-lg">
                ✊
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">Rock-Paper-Scissors</h4>
                <p className="text-[10px] text-slate-400">2P • Secret Hidden Moves</p>
              </div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
            Room Privacy
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setIsPrivate(false);
              }}
              className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                !isPrivate
                  ? 'border-cyan-500 bg-cyan-500/10 text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Globe className="w-4 h-4 mt-0.5 text-cyan-500" />
              <div>
                <div className="text-xs font-bold">Public</div>
                <div className="text-[10px] text-slate-500">Visible on room list</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                setIsPrivate(true);
              }}
              className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                isPrivate
                  ? 'border-purple-500 bg-purple-500/10 text-slate-900 dark:text-white'
                  : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Lock className="w-4 h-4 mt-0.5 text-purple-500" />
              <div>
                <div className="text-xs font-bold">Private</div>
                <div className="text-[10px] text-slate-500">Join via code only</div>
              </div>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-pink-500 text-white font-bold text-sm shadow-glow-cyan hover:opacity-95 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Swords className="w-4 h-4" />
          {loading ? 'Creating Arena...' : 'Launch Room'}
        </button>
      </form>
    </Modal>
  );
};
