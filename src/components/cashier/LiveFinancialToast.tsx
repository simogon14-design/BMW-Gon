import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Check,
  Copy,
  ExternalLink,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles,
  X,
  Lock,
  Zap
} from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

export const LiveFinancialToast: React.FC = () => {
  const { financialToast, dismissFinancialToast } = useCasino();
  const [copied, setCopied] = useState(false);

  if (!financialToast) return null;

  const isDeposit = financialToast.type === 'deposit';

  const handleCopyHash = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(financialToast.txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed bottom-20 sm:bottom-6 right-3 sm:right-6 z-50 max-w-md w-full pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="pointer-events-auto rounded-2xl frosted-comfort bg-[#080d19]/95 backdrop-blur-2xl border-[0.5px] border-amber-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_30px_rgba(255,215,0,0.2)] overflow-hidden text-left"
        >
          {/* Top Status Gradient Glow Strip */}
          <div
            className={`h-1 w-full ${
              isDeposit
                ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                : 'bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
            }`}
          />

          <div className="p-4 space-y-3">
            {/* Header Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-sm ${
                    isDeposit
                      ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-400'
                      : 'bg-cyan-500/20 border-cyan-400/50 text-cyan-400'
                  }`}
                >
                  {isDeposit ? (
                    <ArrowDownLeft className="w-4 h-4" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-luxury font-black text-xs sm:text-sm text-white uppercase tracking-wide">
                      {isDeposit ? 'Deposit Approved & Settled' : 'Vault Cashout Dispatched'}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      HMAC-SHA256
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    {financialToast.method} • {financialToast.timestamp}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  dismissFinancialToast();
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
                aria-label="Dismiss financial notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Financial Amount & Bonus Breakdown */}
            <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 block uppercase">
                  {isDeposit ? 'Playable Bankroll Credited' : 'Net Payout Dispatched'}
                </span>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-lg sm:text-xl font-mono-num font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400">
                    +${(financialToast.amountUSD + (financialToast.bonusAmountUSD || 0)).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-xs font-mono text-amber-300 font-bold">
                    {financialToast.currency}
                  </span>
                </div>
              </div>

              {/* Bonus Badge if Applicable */}
              {isDeposit && financialToast.bonusAmountUSD && financialToast.bonusAmountUSD > 0 && (
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                    +30% Match Applied
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 block mt-0.5 font-semibold">
                    +$ {financialToast.bonusAmountUSD.toFixed(2)} Bonus
                  </span>
                </div>
              )}
            </div>

            {/* TxHash Verification Row */}
            <div className="flex items-center justify-between gap-2 pt-1 text-[11px] font-mono">
              <div className="flex items-center gap-1.5 text-slate-300 truncate">
                <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-slate-400">TxHash:</span>
                <span className="text-amber-300 font-bold truncate max-w-[170px] sm:max-w-[210px]">
                  {financialToast.txHash}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyHash}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[10px] font-mono flex items-center gap-1 transition cursor-pointer shrink-0 active:scale-95"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>
            </div>

            {/* Zero-Trust Security Verification Footnote */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-white/5 pt-2">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero-Trust Vault Confirmed
              </span>
              <span className="text-slate-400">Instant Finality</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
