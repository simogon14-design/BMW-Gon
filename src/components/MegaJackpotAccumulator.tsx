import React, { useEffect, useRef } from 'react';
import { useCasino } from '../context/CasinoContext';
import { Trophy, Sparkles, Zap, ShieldCheck, Flame, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';

export const MegaJackpotAccumulator: React.FC = () => {
  const {
    jackpotTotal,
    openGame,
    openProvablyFair,
    translations: t,
  } = useCasino();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas floating golden ember particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    interface Ember {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      hue: number;
    }

    const embers: Ember[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      hue: Math.random() > 0.3 ? 45 : 38, // Gold / Amber hues
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y += e.speedY;
        e.x += e.speedX;

        if (e.y < -10) {
          e.y = height + 10;
          e.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 100%, 65%, ${e.opacity})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FFD700';
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleQualifyClick = () => {
    triggerHaptic('impact');
    openGame('crash');
  };

  return (
    <div
      id="mega-jackpot-accumulator-card"
      className="relative rounded-3xl overflow-hidden border-2 border-amber-400/50 bg-gradient-to-b from-[#11192e]/95 via-[#0a0f1d]/98 to-[#06080e] shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(255,215,0,0.2)] p-6 sm:p-7 text-center group gold-sweep-reflection"
    >
      {/* Background Floating Ember Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
      />

      {/* Cyber Golden Filigree Accents & Glowing Border Rails */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_20px_#ffd700]" />
      <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
      <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
      <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
      <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

      {/* Header Pill with Live Pulsing Ping */}
      <div className="relative z-10 flex items-center justify-center gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-[11px] font-mono font-bold text-amber-300 shadow-[0_0_12px_rgba(255,215,0,0.25)]">
          <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span className="tracking-wider uppercase">{t.megaJackpot}</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-[10px] font-mono text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>LIVE AUDITED</span>
        </div>
      </div>

      {/* Real-time Accumulator Amount Display */}
      <div className="relative z-10 py-4 px-4 my-2.5 rounded-2xl bg-black/75 border border-amber-400/40 shadow-inner">
        <p className="text-[10px] text-amber-400/80 uppercase tracking-widest font-mono font-bold">
          {t.realtimeAccumulator}
        </p>

        {/* Live Rolling Ascending Counter */}
        <motion.div
          key={Math.floor(jackpotTotal)}
          initial={{ scale: 1.02, filter: 'brightness(1.2)' }}
          animate={{ scale: 1, filter: 'brightness(1)' }}
          transition={{ duration: 0.3 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono-num text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 tracking-tight mt-1.5 drop-shadow-[0_2px_12px_rgba(255,215,0,0.45)]"
        >
          ${jackpotTotal.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </motion.div>

        {/* Real-Time Seed Contribution Notice */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] text-emerald-300 font-mono font-bold">
            {t.seededPerWager}
          </span>
        </div>
      </div>

      {/* 1-Tap Instant Qualify CTA & Provably Fair Edge Verification */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            openProvablyFair();
          }}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition font-mono cursor-pointer"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SHA-256 Ledger Audit</span>
        </button>

        {/* Direct 1-Tap Play Action */}
        <button
          id="mega-jackpot-qualify-btn"
          type="button"
          onClick={handleQualifyClick}
          className="btn-tactile-gold w-full sm:w-auto px-5 py-2 rounded-full text-xs font-black tracking-wider flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,215,0,0.4)]"
        >
          <Flame className="w-4 h-4 text-black fill-black" />
          <span>{t.qualifyNow}</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
