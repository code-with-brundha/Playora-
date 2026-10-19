import React, { useRef, useState } from 'react';

export const Card3D = ({ children, className = '', depth = 20, glowColor = 'rgba(0, 245, 255, 0.25)' }) => {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.5
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`perspective-1000 transition-all duration-200 ease-out ${className}`}
      style={{
        transformStyle: 'preserve-3d'
      }}
    >
      <div
        className="relative w-full h-full rounded-2xl transition-transform duration-200 ease-out overflow-hidden"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(${depth}px)`,
          boxShadow: rotate.x !== 0 || rotate.y !== 0
            ? `0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 30px ${glowColor}`
            : undefined
        }}
      >
        {/* Dynamic Glare Reflection */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 65%)`,
            opacity: glare.opacity
          }}
        />
        {children}
      </div>
    </div>
  );
};
