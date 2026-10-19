import React from 'react';
import { getAvatarById } from '../../utils/avatars';

export const AvatarBadge = ({ avatarId = 'cyber-ninja', size = 'md', className = '', showBorder = true }) => {
  const avatar = getAvatarById(avatarId);

  const sizeClasses = {
    sm: 'w-8 h-8 text-base',
    md: 'w-11 h-11 text-xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl'
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${avatar.gradient} ${sizeClasses[size] || sizeClasses.md} shadow-md transition-transform hover:scale-105 ${
        showBorder ? `ring-2 ring-white/20 dark:ring-white/10 ${avatar.border}` : ''
      } ${className}`}
      style={{
        boxShadow: `0 4px 15px -2px ${avatar.color}40`
      }}
      title={avatar.name}
    >
      <span className="select-none transform transition-transform group-hover:scale-110 drop-shadow-md">
        {avatar.emoji}
      </span>
    </div>
  );
};
