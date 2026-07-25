import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  top: number;
  bg: string;
  duration: number;
  delay: number;
  size: number;
  rotate: number;
}

const PETAL_COLORS = [
  '#f9c5d8',
  '#fde8f0',
  '#f5b8cc',
  '#fad0e4',
  '#e8d0f0',
  '#c8e8f8',
  '#ffd0e8',
];

export const PetalBackground: React.FC = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const list: Petal[] = [];
    for (let i = 0; i < 28; i++) {
      list.push({
        id: i,
        left: Math.random() * 100,
        top: -10 - Math.random() * 40,
        bg: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        duration: 6 + Math.random() * 8,
        delay: Math.random() * 8,
        size: 7 + Math.random() * 8,
        rotate: Math.random() * 360,
      });
    }
    setPetals(list);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-1 overflow-hidden">
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-tl-full rounded-br-full opacity-70 animate-petalfall"
          style={{
            left: `${p.left}%`,
            top: `${p.top}px`,
            backgroundColor: p.bg,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
};
