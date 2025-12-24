
import React, { useState, useEffect } from 'react';
import { GLOBAL_BIRTH_RATE_PER_SEC } from '../constants';

const BirthCounter: React.FC = () => {
  const [totalToday, setTotalToday] = useState(0);

  useEffect(() => {
    const now = new Date();
    const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    const initialToday = Math.floor(secondsSinceMidnight * GLOBAL_BIRTH_RATE_PER_SEC);
    setTotalToday(initialToday);

    const interval = setInterval(() => {
      setTotalToday(prev => prev + 1);
    }, 1000 / GLOBAL_BIRTH_RATE_PER_SEC);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full flex flex-col items-stretch">
      <div className="flex-1 bg-slate-900/80 backdrop-blur-2xl border-2 border-yellow-500/40 p-4 md:p-8 rounded-[2rem] shadow-[0_0_50px_rgba(234,179,8,0.15)] flex flex-col justify-center items-center text-center relative overflow-hidden">
        {/* Persistent Gold Glow at Top */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent shadow-[0_0_20px_rgba(234,179,8,0.6)]"></div>
        
        {/* Gold Label Text - Persistent Highlight */}
        <p className="text-yellow-500 text-[11px] md:text-xs font-black uppercase tracking-[0.3em] mb-4 md:mb-6 animate-pulse drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]">
          Global Births Today
        </p>
        
        {/* Gold Counter Text with Arial Font */}
        <div className="text-4xl md:text-6xl lg:text-8xl font-black font-['Arial',_sans-serif] text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-600 tabular-nums tracking-tighter leading-none mb-2 drop-shadow-[0_0_25px_rgba(234,179,8,0.5)]">
          {totalToday.toLocaleString()}
        </div>
        
        {/* Highlighted Underline - Persistent */}
        <div className="w-32 md:w-48 h-1.5 bg-yellow-500/50 rounded-full mt-6 shadow-[0_0_20px_rgba(234,179,8,0.5)]"></div>
        
        {/* Background Radial Glow */}
        <div className="absolute inset-0 bg-radial-gradient from-yellow-500/10 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
};

export default BirthCounter;
