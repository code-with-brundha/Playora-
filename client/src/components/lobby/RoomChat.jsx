import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, MessageSquare } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';
import { AvatarBadge } from '../common/AvatarBadge';
import { playClickSound } from '../../utils/audio';

export const RoomChat = ({ roomCode }) => {
  const { socket, sendChat } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('chat_message', handleChatMessage);

    return () => {
      socket.off('chat_message', handleChatMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    playClickSound();
    sendChat(roomCode, input);
    setInput('');
  };

  const handleQuickEmoji = (emoji) => {
    playClickSound();
    sendChat(roomCode, emoji);
  };

  const quickEmojis = ['🔥', '🎮', '⚡', '👑', '😎', '💀', '🎉'];

  return (
    <div className="flex flex-col h-full rounded-3xl glass-panel border border-slate-200 dark:border-white/10 overflow-hidden shadow-lg">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-500" />
          <h3 className="font-bold text-sm text-slate-800 dark:text-white">Arena Chat</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Live</span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[200px] max-h-[340px]">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
            <p className="text-xs">No messages yet.</p>
            <p className="text-[11px]">Say hi or cheer on your opponent!</p>
          </div>
        ) : (
          messages.map((msg) => {
            if (msg.system) {
              return (
                <div key={msg.id} className="text-center my-1">
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 text-cyan-600 dark:text-cyan-400 border border-slate-200 dark:border-white/5">
                    {msg.message}
                  </span>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex items-start gap-2.5">
                <AvatarBadge avatarId={msg.avatar} size="sm" />
                <div className="flex-1 bg-slate-100/80 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {msg.sender}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 break-words">
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reaction Emojis */}
      <div className="px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto border-t border-slate-200/60 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/20">
        {quickEmojis.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleQuickEmoji(emoji)}
            className="px-2 py-1 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message..."
          maxLength={150}
          className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
