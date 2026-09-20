import React, { useState } from 'react';
import { useCasino } from '../context/CasinoContext';
import { BetRecord } from '../types';
import {
  Activity,
  Flame,
  User,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';
import { audioEngine } from '../utils/audioEngine';

export const LiveActivityFeed: React.FC = () => {
  const { recentBets, openProvablyFair, currentLanguage, translations: t } = useCasino();
  const [activeTab, setActiveTab] = useState<'all' | 'high-rollers' | 'my-bets'>('all');

  const handleTabChange = (tab: 'all' | 'high-rollers' | 'my-bets') => {
    triggerHaptic('selection');
    audioEngine.playClickSound();
    setActiveTab(tab);
  };

  const filteredBets = recentBets.filter((bet) => {
    if (activeTab === 'high-rollers') return bet.isHighRoller || bet.payout >= 1000;
    if (activeTab === 'my-bets') return bet.player === 'SovereignCipher' || bet.player.includes('Sov');
    return true;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="rounded-2xl cyber-glass-card border border-white/10 overflow-hidden shadow-xl">
        {/* Feed Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#00E676]/10 border border-[#00E676]/40 text-[#00E676] shadow-[0_0_12px_rgba(0,230,118,0.25)]">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-luxury font-bold text-sm sm:text-base tracking-wider text-slate-100">
                  {currentLanguage === 'ar' ? 'شريط الرهانات المباشرة عالية السيولة' : t.liveActivityLedger || 'Live Platform Activity Ledger'}
                </h3>
                {/* Emerald Matrix Trust Badge */}
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] text-[10px] font-mono font-bold shadow-[0_0_8px_rgba(0,230,118,0.3)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-ping" />
                  {currentLanguage === 'ar' ? 'نظام الضمان الرقمي المعتمد' : 'PROVABLY FAIR SHA-256'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentLanguage === 'ar'
                  ? 'سجل حي مشفر يُبث مباشرة من عُقد الإجماع • إثبات عدالة فوري'
                  : 'Streamed directly from consensus nodes • Real-time cryptographic receipts'}
              </p>
            </div>
          </div>

          {/* Tab Selector & Mobile Swipe Indicator */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <span className="text-[10px] text-slate-500 font-mono sm:hidden">
              {currentLanguage === 'ar' ? '👈 اسحب لمشاهدة الرهانات' : '👈 Swipe ledger'}
            </span>
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
              <button
                id="live-feed-tab-all"
                onClick={() => handleTabChange('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer active:scale-95 touch-manipulation ${
                  activeTab === 'all'
                    ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {currentLanguage === 'ar' ? 'كافة الرهانات' : 'All Bets'}
              </button>
              <button
                id="live-feed-tab-high-rollers"
                onClick={() => handleTabChange('high-rollers')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer active:scale-95 touch-manipulation ${
                  activeTab === 'high-rollers'
                    ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentLanguage === 'ar' ? 'كبار المراهنين' : 'High Rollers'}</span>
              </button>
              <button
                id="live-feed-tab-my-bets"
                onClick={() => handleTabChange('my-bets')}
                className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer active:scale-95 touch-manipulation ${
                  activeTab === 'my-bets'
                    ? 'bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {currentLanguage === 'ar' ? 'رهاناتي' : 'My Bets'}
              </button>
            </div>
          </div>
        </div>

        {/* Bets Table (Swipeable horizontally on touch screens) */}
        <div className="overflow-x-auto scrollbar-none touch-pan-x">
          <table className="w-full text-left text-xs min-w-[640px]">
            <thead>
              <tr className="border-b border-white/5 bg-slate-950/40 text-slate-400 uppercase font-mono tracking-wider text-[11px]">
                <th className="py-3 px-4">Game</th>
                <th className="py-3 px-4">Player</th>
                <th className="py-3 px-4 text-right">Wager</th>
                <th className="py-3 px-4 text-center">Multiplier</th>
                <th className="py-3 px-4 text-right">Payout</th>
                <th className="py-3 px-4 text-right">Audit Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              <AnimatePresence initial={false}>
                {filteredBets.slice(0, 8).map((bet) => {
                  const isWon = bet.multiplier > 0;
                  const isBigWin = bet.multiplier >= 10;

                  return (
                    <motion.tr
                      key={bet.id}
                      initial={{ opacity: 0, backgroundColor: 'rgba(255, 215, 0, 0.08)' }}
                      animate={{ opacity: 1, backgroundColor: 'rgba(255, 215, 0, 0)' }}
                      transition={{ duration: 0.4 }}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      {/* Game */}
                      <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                          <span className="truncate max-w-[140px] sm:max-w-[200px]">{bet.gameTitle}</span>
                        </div>
                      </td>

                      {/* Player */}
                      <td className="py-3 px-4 text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-500" />
                          <span>{bet.player}</span>
                        </span>
                      </td>

                      {/* Wager */}
                      <td className="py-3 px-4 text-right text-slate-300 font-bold">
                        ${bet.betAmount.toLocaleString()} {bet.currency}
                      </td>

                      {/* Multiplier */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            isBigWin
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                              : isWon
                              ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isWon ? `${bet.multiplier.toFixed(2)}x` : '0.00x'}
                        </span>
                      </td>

                      {/* Payout */}
                      <td
                        className={`py-3 px-4 text-right font-bold ${
                          isWon ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      >
                        {isWon ? `+$${bet.payout.toLocaleString()}` : '$0.00'}
                      </td>

                      {/* Cryptographic Hash Badge with Click to Verify */}
                      <td className="py-3 px-4 text-right">
                        <button
                          id={`bet-verify-${bet.id}`}
                          onClick={openProvablyFair}
                          className="inline-flex items-center gap-1 text-[10px] text-amber-400/80 hover:text-amber-300 bg-amber-400/5 hover:bg-amber-400/15 border border-amber-400/20 px-2 py-1 rounded transition cursor-pointer"
                          title="Open Provably Fair Auditor for this round"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>{bet.verifiedHash}</span>
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
