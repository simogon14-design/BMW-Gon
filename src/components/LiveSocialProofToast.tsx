import React, { useState, useEffect } from 'react';
import { useCasino } from '../context/CasinoContext';
import { ShieldCheck, Flame, Zap, Trophy, X, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';

interface SocialWinItem {
  id: string;
  user: string;
  game: string;
  amount: number;
  multiplier: string;
  action: string;
  gameId: 'crash' | 'roulette' | 'slot' | 'plinko';
  avatar: string;
}

const SAMPLE_WINS: SocialWinItem[] = [
  {
    id: 'w-1',
    user: 'User #8492',
    game: 'Royal Arabic Crash',
    amount: 1420,
    multiplier: '4.82x',
    action: 'instant cashout',
    gameId: 'crash',
    avatar: '🦅',
  },
  {
    id: 'w-2',
    user: 'VIP @Whale_Dubai',
    game: 'Royal Arabic Crash',
    amount: 5850,
    multiplier: '12.40x',
    action: 'secured cashout',
    gameId: 'crash',
    avatar: '👑',
  },
  {
    id: 'w-3',
    user: 'Player #1044',
    game: 'Neon Dynasty MegaSpin',
    amount: 2310,
    multiplier: '24.00x',
    action: 'jackpot drop win',
    gameId: 'slot',
    avatar: '💎',
  },
  {
    id: 'w-4',
    user: 'Partner @Alex_VIP',
    game: 'Affiliate RevShare',
    amount: 760,
    multiplier: '30% cut',
    action: 'instant partner payout',
    gameId: 'crash',
    avatar: '⚡',
  },
  {
    id: 'w-5',
    user: 'User #3918',
    game: 'Imperial Cyber Roulette',
    amount: 3200,
    multiplier: '2.00x',
    action: 'straight win',
    gameId: 'roulette',
    avatar: '🔥',
  },
  {
    id: 'w-6',
    user: 'VIP @Sovereign9',
    game: 'Quantum Gold Plinko',
    amount: 4190,
    multiplier: '43.00x',
    action: 'peg drop payout',
    gameId: 'plinko',
    avatar: '🏆',
  },
];

export const LiveSocialProofToast: React.FC = () => {
  const { openGame, translations: t } = useCasino();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SAMPLE_WINS.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [isPaused, isVisible]);

  const current = SAMPLE_WINS[currentIndex];

  const handlePlayGame = () => {
    triggerHaptic('selection');
    openGame(current.gameId);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      id="live-social-proof-toast-container"
      className="fixed bottom-20 md:bottom-6 left-4 z-40 max-w-[340px] sm:max-w-sm pointer-events-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-2xl border border-amber-400/40 bg-[#070c17]/95 backdrop-blur-xl p-3 sm:p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(255,215,0,0.15)] flex items-start gap-3 relative overflow-hidden group"
        >
          {/* Top subtle gold sweep */}
          <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

          {/* Avatar / Icon Badge */}
          <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-base shrink-0 shadow-inner">
            {current.avatar}
          </div>

          {/* Content Body */}
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold text-slate-200 truncate">
                {current.user}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5" />
                {current.multiplier}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              {current.action}:{' '}
              <span className="font-mono-num font-black text-amber-300">
                +${current.amount.toLocaleString()}
              </span>{' '}
              on <span className="text-white font-semibold">{current.game}</span>
            </p>

            <div className="flex items-center gap-3 mt-1.5">
              <button
                type="button"
                onClick={handlePlayGame}
                className="text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition active:scale-95"
              >
                <span>{t.playGame}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
              <span className="text-[9px] font-mono text-slate-500">
                • Provably Fair SHA-256
              </span>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="text-slate-500 hover:text-slate-300 transition p-1 cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
