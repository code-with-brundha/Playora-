export const AVATARS = [
  {
    id: 'cyber-ninja',
    name: 'Cyber Ninja',
    emoji: '🥷',
    gradient: 'from-cyan-500 to-blue-600',
    border: 'border-cyan-400',
    color: '#00f5ff'
  },
  {
    id: 'pixel-wizard',
    name: 'Pixel Wizard',
    emoji: '🧙‍♂️',
    gradient: 'from-purple-500 to-indigo-600',
    border: 'border-purple-400',
    color: '#b026ff'
  },
  {
    id: 'neon-valkyrie',
    name: 'Neon Valkyrie',
    emoji: '⚔️',
    gradient: 'from-pink-500 to-rose-600',
    border: 'border-pink-400',
    color: '#ff007f'
  },
  {
    id: 'cosmic-robot',
    name: 'Cosmic Bot',
    emoji: '🤖',
    gradient: 'from-amber-400 to-orange-500',
    border: 'border-amber-400',
    color: '#fbbf24'
  },
  {
    id: 'glitch-fox',
    name: 'Glitch Fox',
    emoji: '🦊',
    gradient: 'from-orange-500 to-red-600',
    border: 'border-orange-400',
    color: '#f97316'
  },
  {
    id: 'astro-cat',
    name: 'Astro Cat',
    emoji: '🐱‍🚀',
    gradient: 'from-teal-400 to-emerald-600',
    border: 'border-teal-400',
    color: '#2dd4bf'
  },
  {
    id: 'quantum-knight',
    name: 'Quantum Knight',
    emoji: '🛡️',
    gradient: 'from-blue-600 to-violet-800',
    border: 'border-blue-400',
    color: '#3b82f6'
  },
  {
    id: 'shadow-spectre',
    name: 'Shadow Spectre',
    emoji: '👻',
    gradient: 'from-slate-600 to-slate-900',
    border: 'border-slate-400',
    color: '#94a3b8'
  }
];

export const getAvatarById = (id) => {
  return AVATARS.find((a) => a.id === id) || AVATARS[0];
};
