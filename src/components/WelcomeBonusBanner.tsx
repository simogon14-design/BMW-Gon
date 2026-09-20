import React, { useState } from 'react';
import { useCasino } from '../context/CasinoContext';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Wallet,
  DollarSign,
  TrendingUp,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';

export const WelcomeBonusBanner: React.FC = () => {
  const {
    welcomeBonusClaimed,
    claimWelcomeBonus,
    antiAbuseStatus,
    auditAntiAbuseSecurity,
    openWalletModal,
    showToast,
    currentLanguage,
    translations: t,
  } = useCasino();

  const [depositSlider, setDepositSlider] = useState<number>(100);
  const [isAuditing, setIsAuditing] = useState(false);
  const [showSecurityDetails, setShowSecurityDetails] = useState(false);

  const bonusAmount = Number((depositSlider * 0.30).toFixed(2));
  const totalBankroll = Number((depositSlider + bonusAmount).toFixed(2));

  const presets = [50, 100, 250, 500, 1000];

  const handleClaim = () => {
    triggerHaptic('medium');
    openWalletModal('deposit', { depositAmount: depositSlider, applyBonus: true });
  };

  const handleAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      auditAntiAbuseSecurity();
      setIsAuditing(false);
    }, 1200);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#070b14] via-[#0d1527] to-[#060912] border-2 border-amber-400/40 shadow-[0_20px_50px_rgba(0,0,0,0.95)] gold-sweep-reflection neon-rim-pulse">
        {/* Glowing Filigree Top Line & Volumetric Cyber Radial Lighting */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_15px_#FFD700]" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Ornate Cyber Corner Brackets */}
        <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-amber-400 pointer-events-none shadow-[0_0_8px_#ffd700]" />
        <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-amber-400 pointer-events-none shadow-[0_0_8px_#ffd700]" />
        <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-amber-400 pointer-events-none shadow-[0_0_8px_#ffd700]" />
        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-amber-400 pointer-events-none shadow-[0_0_8px_#ffd700]" />

        <div className="relative p-5 sm:p-7 lg:p-8">
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-amber-400/20 pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3.5 py-1 rounded-full btn-tactile-gold text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-black stroke-black" />
                  {currentLanguage === 'ar' ? 'مكافأة السيولة السريعة +30%' : '30% WELCOME BOOST'}
                </span>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {currentLanguage === 'ar' ? 'الخزينة الملوكية المشفرة' : 'Instant Liquidity Accelerator'}
                </span>
                <span className="text-xs text-amber-300 font-mono hidden sm:inline font-bold">
                  • {currentLanguage === 'ar' ? 'بدون شروط سحب معقدة' : 'Zero Locked Wagering Hooks'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-luxury font-black text-white tracking-wide">
                {currentLanguage === 'ar' ? (
                  <>
                    عزّز رصيدك الملكي فوراً مع{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 font-black drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]">
                      مكافأة السيولة السريعة +30%
                    </span>
                  </>
                ) : (
                  <>
                    ACCELERATE YOUR BANKROLL WITH{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 font-black drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]">
                      +30% INSTANT MATCH
                    </span>
                  </>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-medium">
                {currentLanguage === 'ar'
                  ? 'اشحن محفظتك الرقمية واحصل فوراً على سيولة إضافية بنسبة 30% تودع مباشرة في رصيدك القابل للعب والسحب مع حماية التشفير الكاملة.'
                  : 'Fund your treasury wallet and receive a direct 30% bonus injection into your playable balance. Guaranteed by the Aetherius Capital Reserve pool with cryptographically enforced fair play.'}
              </p>
            </div>

            {/* Anti-Abuse Security Badge */}
            <div className="flex flex-col items-start lg:items-end gap-1.5 shrink-0">
              <div
                onClick={() => setShowSecurityDetails(!showSecurityDetails)}
                className="px-4 py-2.5 rounded-2xl bg-black/70 border border-emerald-500/50 hover:border-emerald-400 transition cursor-pointer flex items-center gap-3 shadow-inner group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_10px_rgba(0,230,118,0.3)]">
                  <Fingerprint className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-emerald-300 font-mono tracking-wider">
                      ANTI-ABUSE SHIELD
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/25 text-emerald-300 font-mono font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300 font-mono">
                    Device Hash & Single IP Enforced
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Deposit Calculator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
            {/* Left: Interactive Calculator Slider & Presets */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                  Select Deposit Amount (USD / Crypto Equiv)
                </span>
                <span className="text-xs font-mono text-amber-300 bg-amber-400/15 px-3 py-0.5 rounded-full border border-amber-400/40 font-bold">
                  Tier 1 Multiplier: 1.30x
                </span>
              </div>

              {/* Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    id={`welcome-preset-${preset}`}
                    onClick={() => setDepositSlider(preset)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono font-black transition-all cursor-pointer border ${
                      depositSlider === preset
                        ? 'btn-tactile-gold shadow-[0_0_15px_rgba(255,215,0,0.5)]'
                        : 'bg-black/60 text-slate-300 border-white/10 hover:border-amber-400/50 hover:text-white'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>

              {/* Slider Input */}
              <div className="space-y-2 pt-1">
                <div className="relative">
                  <input
                    type="range"
                    min={20}
                    max={2500}
                    step={10}
                    value={depositSlider}
                    onChange={(e) => setDepositSlider(Number(e.target.value))}
                    className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400 shadow-inner"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 font-bold">
                  <span>Min: $20</span>
                  <span className="text-amber-300 text-sm font-black drop-shadow-[0_0_6px_#ffd700]">${depositSlider} Deposit</span>
                  <span>Max: $2,500</span>
                </div>
              </div>

              {/* Live Formula Display */}
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Formula:</span>
                  <span className="text-white font-bold">${depositSlider} Deposit</span>
                  <span className="text-amber-400 font-bold">+</span>
                  <span className="text-emerald-400 font-black">${bonusAmount} (30% Match)</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block font-mono">TOTAL BANKROLL</span>
                  <span className="text-amber-300 font-black text-sm sm:text-base">${totalBankroll} Wager Power</span>
                </div>
              </div>
            </div>

            {/* Right: Summary Visual Card & Claim Trigger - 3D Holographic Display Card */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#131d33] to-[#070b14] border-2 border-amber-400/40 space-y-4 shadow-2xl text-center relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 text-left">
                  <div>
                    <p className="text-[10px] text-amber-400/80 uppercase tracking-widest font-mono font-bold">Instant Bankroll</p>
                    <p className="text-xs text-slate-200 font-semibold">Ready For Sovereign Arenas</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/50 shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                      +30% FREE
                    </span>
                  </div>
                </div>

                <div className="py-2">
                  <p className="text-xs text-slate-300 font-mono font-medium">Deposit ${depositSlider} ➔ Get</p>
                  <div className="text-3xl sm:text-4xl font-black font-mono-num text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 tracking-tight mt-1 drop-shadow-[0_2px_8px_rgba(255,215,0,0.4)]">
                    ${totalBankroll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-emerald-400 font-mono font-bold mt-1.5 flex items-center justify-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
                    +${bonusAmount} Instantly Minted to USDT Vault
                  </p>
                </div>

                {/* Primary Action Button - Multi-layered 3D Tactile Button */}
                <button
                  id="welcome-claim-bonus-btn"
                  onClick={handleClaim}
                  className="w-full py-4 px-5 rounded-2xl font-mono font-black text-sm tracking-wide cursor-pointer flex items-center justify-center gap-2 btn-tactile-gold uppercase shadow-2xl transition hover:brightness-110 active:scale-95"
                >
                  <Zap className="w-5 h-5 fill-black stroke-black" />
                  <span>
                    {currentLanguage === 'ar'
                      ? `تأكيد الإيداع والشحن الفوري (+$${bonusAmount} مكافأة)`
                      : `CLAIM 30% BOOST & DEPOSIT ($${totalBankroll} POWER)`}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>

          {/* Integrated Anti-Abuse Security Drawer */}
          <AnimatePresence>
            {showSecurityDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-6 pt-5 border-t border-white/10"
              >
                <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span className="font-mono text-xs font-bold text-emerald-300">
                        ANTI-ABUSE & SINGLE IP ENFORCEMENT ENGINE
                      </span>
                    </div>
                    <button
                      id="welcome-audit-security-btn"
                      onClick={handleAudit}
                      disabled={isAuditing}
                      className="px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
                    >
                      <RotateCw className={`w-3 h-3 ${isAuditing ? 'animate-spin' : ''}`} />
                      <span>{isAuditing ? 'Auditing Hardware Entropy...' : 'Audit Device Signature'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                      <p className="text-[10px] text-slate-400 uppercase">Device Fingerprint SHA-256</p>
                      <p className="text-slate-200 truncate mt-0.5 text-[11px] font-bold">
                        {antiAbuseStatus.deviceFingerprintHash}
                      </p>
                      <span className="text-[9px] text-emerald-400">✓ Unique Hardware Entropy Confirmed</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                      <p className="text-[10px] text-slate-400 uppercase">Single IP Whitelist Enforced</p>
                      <p className="text-slate-200 mt-0.5 text-[11px] font-bold">
                        {antiAbuseStatus.ipAddress}
                      </p>
                      <span className="text-[9px] text-emerald-400">✓ 1 IP per Bonus Vault Ratio</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/5">
                      <p className="text-[10px] text-slate-400 uppercase">Sybil Attack Defense Score</p>
                      <p className="text-emerald-400 mt-0.5 text-[11px] font-bold">
                        100% SECURE (Zero Multi-Account Flag)
                      </p>
                      <span className="text-[9px] text-slate-400">{antiAbuseStatus.verificationTimestamp}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
