import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioEngine';

export interface ParticleEvent {
  id?: string;
  type: 'deposit' | 'bonus' | 'win' | 'jackpot';
  amount?: number;
  currency?: string;
  title?: string;
}

interface ParticleItem {
  id: number;
  x: number;
  y: number;
  tx: number;
  ty: number;
  rot: number;
  size: number;
  color: string;
  shape: 'circle' | 'diamond' | 'coin';
  delay: number;
}

// Global celebration trigger helper for any component to invoke
let globalTriggerCallback: ((event: ParticleEvent) => void) | null = null;

export const triggerCelebration = (event: ParticleEvent) => {
  if (globalTriggerCallback) {
    globalTriggerCallback({
      ...event,
      id: event.id || `celeb_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    });
  }
};

export const GoldParticleCelebration: React.FC = () => {
  const [activeEvent, setActiveEvent] = useState<ParticleEvent | null>(null);
  const [particles, setParticles] = useState<ParticleItem[]>([]);

  useEffect(() => {
    globalTriggerCallback = (event: ParticleEvent) => {
      setActiveEvent(event);

      // 1. Play Synthesized Sound based on event type
      if (event.type === 'jackpot') {
        audioEngine.playJackpotSound();
      } else if (event.type === 'bonus') {
        audioEngine.playBonusClaimSound();
      } else if (event.type === 'deposit') {
        audioEngine.playDepositSound();
        setTimeout(() => audioEngine.playWinSound(), 200);
      } else {
        audioEngine.playWinSound();
      }

      // 2. Generate Dynamic CSS Keyframe Gold Particles
      const count = event.type === 'jackpot' ? 50 : 32;
      const newParticles: ParticleItem[] = [];
      const colors = ['#FFD700', '#FFF2A3', '#F59E0B', '#D4AF37', '#60A5FA', '#FFFFFF'];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const dist = Math.random() * 260 + 120;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist - (Math.random() * 80 + 40); // bias upward
        const rot = (Math.random() - 0.5) * 720;
        const shapes: ('circle' | 'diamond' | 'coin')[] = ['circle', 'diamond', 'coin'];

        newParticles.push({
          id: i,
          x: 50 + (Math.random() - 0.5) * 6,
          y: 50 + (Math.random() - 0.5) * 6,
          tx,
          ty,
          rot,
          size: Math.random() * 12 + 8,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          delay: Math.random() * 0.15,
        });
      }
      setParticles(newParticles);

      // 3. Fire Canvas Confetti for Rich Shimmer
      try {
        confetti({
          particleCount: event.type === 'jackpot' ? 120 : 60,
          spread: event.type === 'jackpot' ? 100 : 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#F59E0B', '#FFF2A3', '#D4AF37', '#93C5FD'],
          disableForReducedMotion: true,
        });
      } catch {
        // Confetti fallback
      }

      // Auto dismiss after animation completes
      setTimeout(() => {
        setActiveEvent(null);
        setParticles([]);
      }, 2200);
    };

    return () => {
      globalTriggerCallback = null;
    };
  }, []);

  if (!activeEvent) return null;

  return (
    <div
      id="gold-particle-celebration-root"
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden"
    >
      {/* Golden Flash Shimmer Ambient Background */}
      <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-transparent gold-flash-shimmer" />

      {/* Floating Gold Coin Badge in Center */}
      <div className="relative flex flex-col items-center justify-center text-center p-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 border-2 border-amber-300 shadow-[0_0_40px_rgba(255,215,0,0.6)] flex items-center justify-center gold-coin-spin-float">
          <span className="text-2xl font-black font-luxury text-black drop-shadow">Æ</span>
        </div>

        {activeEvent.title && (
          <div className="mt-3 px-4 py-1.5 rounded-full bg-black/80 border border-amber-400/60 shadow-xl backdrop-blur-md">
            <span className="text-amber-300 font-luxury font-bold text-sm tracking-wider uppercase drop-shadow-[0_0_10px_#FFD700]">
              {activeEvent.title}
            </span>
            {activeEvent.amount && (
              <span className="block text-emerald-400 font-mono font-bold text-lg font-mono-num">
                +${activeEvent.amount.toLocaleString()}{' '}
                {activeEvent.currency ? activeEvent.currency : 'USDT'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Dynamic Gold Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute gold-particle-pop"
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              '--rot': `${p.rot}deg`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties
          }
        >
          {p.shape === 'coin' ? (
            <div
              className="w-full h-full rounded-full border border-amber-200 shadow-sm flex items-center justify-center font-bold text-[8px] text-amber-900"
              style={{
                background: 'radial-gradient(circle, #FFF2A3 20%, #FFD700 70%, #B45309 100%)',
              }}
            >
              $
            </div>
          ) : p.shape === 'diamond' ? (
            <div
              className="w-full h-full transform rotate-45 shadow-sm"
              style={{
                backgroundColor: p.color,
                boxShadow: `0 0 8px ${p.color}`,
              }}
            />
          ) : (
            <div
              className="w-full h-full rounded-full"
              style={{
                backgroundColor: p.color,
                boxShadow: `0 0 10px ${p.color}`,
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};
