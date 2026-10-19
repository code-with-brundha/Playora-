import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, AlertTriangle } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { RoomLobby } from '../components/lobby/RoomLobby';
import { TicTacToeGame } from '../components/games/tictactoe/TicTacToeGame';
import { RockPaperScissorsOnline } from '../components/games/rps/RockPaperScissorsOnline';
import { playClickSound, playJoinSound } from '../utils/audio';

export const GameRoomPage = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { socket, isConnected, joinRoom, leaveRoom } = useSocket();
  const { user, token } = useAuth();

  const [room, setRoom] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const normalizedCode = (roomCode || '').toUpperCase();

  // Socket listener & room join
  useEffect(() => {
    if (!socket || !isConnected || !user) return;

    playJoinSound();
    joinRoom(normalizedCode, {
      userId: user._id ? user._id.toString() : user.id,
      username: user.username,
      avatar: user.avatar
    }, token);

    const handleRoomUpdated = ({ room: updatedRoom }) => {
      setRoom(updatedRoom);
      setLoading(false);
      // If room returned to waiting (e.g. player left), clear game state
      if (updatedRoom.status === 'waiting') {
        setGameState(null);
      }
    };

    const handleGameStarted = ({ gameState: startedGame }) => {
      setGameState(startedGame);
      setRoom((prev) => (prev ? { ...prev, status: 'playing' } : prev));
    };

    const handleStateSync = (syncedState) => {
      setGameState(syncedState);
      setRoom((prev) => (prev ? { ...prev, status: 'playing' } : prev));
    };

    const handleErrorMessage = ({ message }) => {
      setError(message);
      setLoading(false);
    };

    socket.on('room_updated', handleRoomUpdated);
    socket.on('game_started', handleGameStarted);
    socket.on('game_state_sync', handleStateSync);
    socket.on('error_message', handleErrorMessage);

    return () => {
      socket.off('room_updated', handleRoomUpdated);
      socket.off('game_started', handleGameStarted);
      socket.off('game_state_sync', handleStateSync);
      socket.off('error_message', handleErrorMessage);
      leaveRoom(normalizedCode);
    };
  }, [socket, isConnected, normalizedCode, user, token]);

  const handleExit = () => {
    playClickSound();
    leaveRoom(normalizedCode);
    navigate('/');
  };

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="glass-panel p-8 rounded-3xl max-w-md w-full text-center border border-rose-500/30 space-y-4">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Arena Error
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs shadow-glow-cyan transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading && !room) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center">
        <div className="relative w-16 h-16">
          <div className="w-16 h-16 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
          <Wifi className="w-6 h-6 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Entering Arena #{normalizedCode}...
        </p>
        <p className="text-xs text-slate-400">
          Syncing encrypted real-time state with server
        </p>
      </div>
    );
  }

  const currentUserId = user?._id ? user._id.toString() : user?.id;

  return (
    <div className="pb-16">
      {/* Top back navigation */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between">
        <button
          onClick={handleExit}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Arena</span>
        </button>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Connected</span>
        </div>
      </div>

      {/* Conditional View: Lobby vs Active Game */}
      {room?.status === 'playing' || gameState ? (
        room?.gameType === 'rps' ? (
          <RockPaperScissorsOnline
            initialGameState={gameState}
            roomCode={normalizedCode}
            currentUserId={currentUserId}
            onLeaveRoom={handleExit}
          />
        ) : (
          <TicTacToeGame
            initialGameState={gameState}
            roomCode={normalizedCode}
            currentUserId={currentUserId}
            onLeaveRoom={handleExit}
          />
        )
      ) : (
        <RoomLobby room={room} currentUserId={currentUserId} />
      )}
    </div>
  );
};
