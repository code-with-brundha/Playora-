import React from 'react';
import { AVATARS } from '../../utils/avatars';
import { AvatarBadge } from './AvatarBadge';
import { Check } from 'lucide-react';
import { playClickSound } from '../../utils/audio';

export const AvatarPicker = ({ selectedAvatar, onSelect }) => {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
        Select Your Champion Avatar
      </label>
      <div className="grid grid-cols-4 gap-3">
        {AVATARS.map((avatar) => {
          const isSelected = selectedAvatar === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => {
                playClickSound();
                onSelect(avatar.id);
              }}
              className={`relative p-2 rounded-2xl flex flex-col items-center gap-1.5 transition-all transform hover:scale-105 ${
                isSelected
                  ? 'bg-cyan-500/15 ring-2 ring-cyan-400 shadow-glow-cyan'
                  : 'bg-slate-100/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isSelected && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px] shadow-sm">
                  <Check className="w-2.5 h-2.5" />
                </div>
              )}
              <AvatarBadge avatarId={avatar.id} size="md" showBorder={false} />
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[65px]">
                {avatar.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
