import React from 'react';

export const Logo = ({ size = 'md', showText = true, className = '', animated = true }) => {
  const sizeMap = {
    xs: { img: 'w-7 h-7', text: 'text-lg', badge: 'text-[9px]' },
    sm: { img: 'w-9 h-9', text: 'text-xl', badge: 'text-[10px]' },
    md: { img: 'w-11 h-11', text: 'text-2xl', badge: 'text-[10px]' },
    lg: { img: 'w-16 h-16', text: 'text-3xl', badge: 'text-xs' },
    xl: { img: 'w-24 h-24 sm:w-28 sm:h-28', text: 'text-4xl sm:text-5xl', badge: 'text-xs' }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D Glowing Emblem */}
      <div className="relative group/logo">
        <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-400 via-purple-600 to-pink-500 rounded-2xl blur-md opacity-70 group-hover/logo:opacity-100 transition duration-300 pointer-events-none" />
        <div className={`relative ${currentSize.img} rounded-2xl overflow-hidden bg-[#0a0f1d] p-0.5 border border-cyan-400/40 shadow-glow-cyan ${
          animated ? 'transition-transform duration-300 group-hover/logo:scale-105 group-hover/logo:rotate-3' : ''
        }`}>
          <img
            src="/logo.png"
            alt="Playora Logo"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className={`${currentSize.text} font-black font-display tracking-tight text-slate-900 dark:text-white`}>
              PLAY<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">ORA</span>
            </span>
            <span className={`${currentSize.badge} uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20`}>
              3D
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider mt-0.5 hidden sm:block">
            MULTIPLAYER ARENA
          </span>
        </div>
      )}
    </div>
  );
};
