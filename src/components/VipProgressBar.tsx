import React from 'react';
import { useCasino } from '../context/CasinoContext';
import { Crown, Sparkles, ArrowRight, Zap, Gift, ShieldAlert, Award } from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';

export const VipProgressBar: React.FC = () => {
  const {
    userProfile,
    vipTierInfo,
    allVipTiers,
    openWalletModal,
    openGame,
    translations: t,
  } = useCasino();

  const nextTierIndex = Math.min(vipTierInfo.level, allVipTiers.length - 1);
  const nextTier = allVipTiers[nextTierIndex];

  const currentWager = userProfile.currentTierProgressWager || 18450;
  const targetWager = vipTierInfo.nextTierWager || 25000;
  const remainingWager = Math.max(0, targetWager - currentWager);
  const progressPct = Math.min(100, Math.max(5, Math.round((currentWager / targetWager) * 100)));

  const handleFastTrack = () => {
    triggerHaptic('impact');
    // 1-tap open Royal Crash or Cashier to accelerate progress
    openGame('crash');
  };

  return (
    <div
      id="vip-progress-bar-card"
      className="relative rounded-2xl border-[0.5px] border-amber-400/40 bg-gradient-to-r from-[#0b1220]/90 via-[#0d1628]/95 to-[#090e1a]/95 p-4 sm:p-5 shadow-[0_12px_30px_rgba(0,0,0,0.8)] overflow-hidden"
    >
      {/* Top Gold Accent Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500/10 via-amber-400 to-amber-500/10" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Tier Milestone Summary */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs">
              <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{vipTierInfo.tier}</span>
            </span>

            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />

            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 font-mono font-bold text-xs">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>{nextTier.tier}</span>
            </span>

            <span className="text-[11px] font-mono text-emerald-400 font-bold ml-auto sm:ml-2">
              {progressPct}% COMPLETED
            </span>
          </div>

          <p className="text-xs text-slate-300 font-sans">
            <span className="text-amber-300 font-bold">${remainingWager.toLocaleString()}</span> {t.wagerNeeded} <span className="text-indigo-300 font-bold">{nextTier.tier}</span> & unlock <span className="text-emerald-400 font-bold">+${nextTier.dailyBonus * 2} Bonus Cash</span> + {nextTier.cashbackPct}% Weekly Cashback!
          </p>

          {/* Glowing Animated Progress Bar */}
          <div className="relative h-3 w-full rounded-full bg-black/70 border border-white/10 overflow-hidden shadow-inner mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 relative shadow-[0_0_12px_rgba(255,215,0,0.6)]"
            >
              {/* Shimmer sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
            </motion.div>
          </div>

          {/* Micro Progress Metrics */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
            <span>Current: ${currentWager.toLocaleString()}</span>
            <span>Target: ${targetWager.toLocaleString()}</span>
          </div>
        </div>

        {/* Right Side: 1-Tap Fast-Track CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="vip-fast-track-btn"
            type="button"
            onClick={handleFastTrack}
            className="btn-tactile-gold px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-[0_0_15px_rgba(255,215,0,0.35)]"
          >
            <Zap className="w-3.5 h-3.5 text-black fill-black" />
            <span>{t.fastTrackVip}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
