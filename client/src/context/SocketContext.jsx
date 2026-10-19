import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { API_BASE_URL } from '../utils/api';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [ping, setPing] = useState(24);

  useEffect(() => {
    const socketUrl = API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const socketInstance = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected to server with ID:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[Socket] Disconnected from server');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
      setIsConnected(false);
    });

    // Ping check
    const interval = setInterval(() => {
      if (socketInstance.connected) {
        const start = Date.now();
        socketInstance.emit('ping_check', () => {
          setPing(Date.now() - start);
        });
      }
    }, 10000);

    setSocket(socketInstance);

    return () => {
      clearInterval(interval);
      socketInstance.disconnect();
    };
  }, []);

  const joinRoom = (roomCode, user, token) => {
    if (socket && isConnected) {
      socket.emit('join_room', { roomCode, user, token });
    }
  };

  const toggleReady = (roomCode) => {
    if (socket && isConnected) {
      socket.emit('toggle_ready', { roomCode });
    }
  };

  const makeMove = (roomCode, cellIndex) => {
    if (socket && isConnected) {
      socket.emit('make_move', { roomCode, cellIndex });
    }
  };

  const requestRematch = (roomCode) => {
    if (socket && isConnected) {
      socket.emit('request_rematch', { roomCode });
    }
  };

  const sendChat = (roomCode, message) => {
    if (socket && isConnected) {
      socket.emit('send_chat', { roomCode, message });
    }
  };

  const forfeitGame = (roomCode) => {
    if (socket && isConnected) {
      socket.emit('forfeit_game', { roomCode });
    }
  };

  const leaveRoom = (roomCode) => {
    if (socket && isConnected) {
      socket.emit('leave_room', { roomCode });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        ping,
        joinRoom,
        toggleReady,
        makeMove,
        requestRematch,
        sendChat,
        forfeitGame,
        leaveRoom
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
