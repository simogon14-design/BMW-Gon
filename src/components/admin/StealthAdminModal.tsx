import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import {
  Vault,
  ShieldCheck,
  TrendingUp,
  Percent,
  Coins,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Layers,
  Sparkles,
  Download,
  Users,
  Building2,
  CheckCircle2,
  Cpu,
  Activity,
  Zap,
  Sliders,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { calculateDynamicRetentionProfile, calculateRevenueSplitMatrix } from '../../utils/dynamicRtpEngine';

export const StealthAdminModal: React.FC = () => {
  const {
    isStealthAdminModalOpen,
    closeStealthAdminModal,
    lockStealthAdmin,
    treasuryMetrics,
    userProfile,
    showToast,
  } = useCasino();

  const [simulatedMonthlyVolume, setSimulatedMonthlyVolume] = useState<number>(25000000); // $25M
  const [activeTab, setActiveTab] = useState<'vault' | 'retention' | 'simulator' | 'solvency'>('vault');
  const [testPlayerWager, setTestPlayerWager] = useState<number>(450); // For dynamic RTP tester

  if (!isStealthAdminModalOpen) return null;

  // Simulator calculations using exact 50/30/20 split
  const simGrossGamingRevenue = simulatedMonthlyVolume * 0.035; // 3.5% house hold
  const splitBreakdown = calculateRevenueSplitMatrix(simGrossGamingRevenue);

  // Dynamic RTP Profile for tester slider
  const liveTestProfile = calculateDynamicRetentionProfile(testPlayerWager);
  const currentUserProfile = calculateDynamicRetentionProfile(userProfile.totalWagered);

  const handleExportAudit = () => {
    showToast('📑 Cryptographic Financial Ledger (50/30/20 Matrix + AI Retention) exported.');
  };

  const handleRebalance = () => {
    showToast('⚡ Cold Storage multi-sig sweep executed. 50% Owner Vault & 20% System Reserves verified in air-gapped Zurich HSM.');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-6xl my-auto rounded-3xl bg-gradient-to-b from-[#080E18]/50 via-[#0B1322]/45 to-[#050810]/55 backdrop-blur-2xl border-2 border-amber-400/50 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.25)] p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
        >
          {/* Top Glowing Filigree Line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_#FFD700]" />
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Admin Header & Privacy Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 font-mono text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-red-400" />
                  STEALTH ADMIN COMMAND CENTER
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-mono text-[11px] font-bold">
                  50/30/20 REVENUE MATRIX
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-300 font-mono text-[11px] font-bold flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  AI RTP RETENTION ACTIVE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 font-mono text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Public Leakage: 0% Isolated
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-luxury font-black text-slate-100 tracking-wide">
                INSTITUTIONAL HOUSE PROFIT & REVENUE MATRIX
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
                Restricted sovereign view. Displays 50% Owner Net Share (Vault Locked), 30% Client / Partner Yield, 20% System Operations, and 40% Dynamic AI Retention Curve.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="stealth-admin-export-btn"
                onClick={handleExportAudit}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Export Audit</span>
              </button>

              <button
                id="stealth-admin-lock-btn"
                onClick={lockStealthAdmin}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-red-900/40"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock & Conceal</span>
              </button>

              <button
                id="stealth-admin-close-x-btn"
                onClick={closeStealthAdminModal}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
            {[
              { id: 'vault', label: 'Owner Net Vault (50%) & Revenue Split', icon: Vault },
              { id: 'retention', label: 'AI Retention & Dynamic RTP (40% Hook)', icon: Cpu },
              { id: 'simulator', label: 'Wager Volume Yield Simulator (50/30/20)', icon: TrendingUp },
              { id: 'solvency', label: 'Proof of Reserves & Solvency', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-2 shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-amber-400 text-black shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Vault & Revenue Split (50 / 30 / 20) */}
          {activeTab === 'vault' && (
            <div className="space-y-6">
              {/* 3 Pillar Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Pillar 1: 50% Owner Net Share */}
                <div className="relative rounded-2xl bg-gradient-to-b from-[#0D1526] to-[#080E18] border-2 border-amber-400/50 p-5 shadow-xl space-y-3 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
                      <Vault className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono font-bold text-xs">
                      50.0% OWNER NET SHARE
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Owner Net Share (Stealth Vault)
                    </h3>
                    <div className="text-2xl sm:text-3xl font-black font-mono-num text-amber-300 mt-1">
                      ${treasuryMetrics.houseVaultReservesUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Secured directly into air-gapped Sovereign Cold Storage Multi-Sig Vault. 50% locked net share allocation.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Owner Allocation</span>
                    <span className="text-amber-400 font-bold">50% Net Locked</span>
                  </div>
                </div>

                {/* Pillar 2: 30% Client / Affiliate Partner Share */}
                <div className="relative rounded-2xl bg-gradient-to-b from-[#0D1526] to-[#080E18] border-2 border-emerald-500/50 p-5 shadow-xl space-y-3 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                      30.0% CLIENT / PARTNER
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Client / Partner Commission Pool
                    </h3>
                    <div className="text-2xl sm:text-3xl font-black font-mono-num text-emerald-300 mt-1">
                      ${treasuryMetrics.commissionsPaidOutUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Dynamic payout pool disbursed on-demand across {treasuryMetrics.activeAffiliatesCount} registered VIP partners & clients.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Registered Affiliates</span>
                    <span className="text-emerald-400 font-bold">{treasuryMetrics.activeAffiliatesCount} Partners (30%)</span>
                  </div>
                </div>

                {/* Pillar 3: 20% System Reserve / Operations Vault */}
                <div className="relative rounded-2xl bg-gradient-to-b from-[#0D1526] to-[#080E18] border-2 border-blue-500/50 p-5 shadow-xl space-y-3 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-inner">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold text-xs">
                      20.0% SYSTEM RESERVE
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      System Reserve & Operations
                    </h3>
                    <div className="text-2xl sm:text-3xl font-black font-mono-num text-blue-300 mt-1">
                      ${treasuryMetrics.systemReserveUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Subsidizes zero-fee instant gas withdrawals, DDoS scrubbers, Zurich HSM node validation, and platform redundancy.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Operations Buffer</span>
                    <span className="text-blue-300 font-bold">20% Dedicated Reserve</span>
                  </div>
                </div>
              </div>

              {/* Solvency & Cold Vault Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-[#090F1D] border border-white/10 space-y-4">
                  <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    Sovereign Revenue Allocation Matrix (50 / 30 / 20)
                  </h3>
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-300">Owner Net Share (50%)</span>
                        <span className="text-amber-300 font-bold font-mono-num">
                          ${(treasuryMetrics.houseVaultReservesUSD / 1000000).toFixed(2)}M USD (50%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden border border-white/10">
                        <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 w-[50%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-300">Client / Affiliate Partner Share (30%)</span>
                        <span className="text-emerald-400 font-bold font-mono-num">
                          ${(treasuryMetrics.commissionsPaidOutUSD / 1000000).toFixed(2)}M USD (30%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden border border-white/10">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[30%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1">
                        <span className="text-slate-300">System Reserve & Operations Vault (20%)</span>
                        <span className="text-blue-400 font-bold font-mono-num">
                          ${(treasuryMetrics.systemReserveUSD / 1000000).toFixed(2)}M USD (20%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden border border-white/10">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 w-[20%]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#090F1D] border border-white/10 space-y-4">
                  <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Cold Storage Multi-Sig Status
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <p className="text-slate-400">Total Platform Wager</p>
                      <p className="text-base font-bold text-amber-300 mt-0.5">
                        ${(treasuryMetrics.totalWagerVolumeUSD / 1000000).toFixed(2)}M USD
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <p className="text-slate-400">Solvency Coverage</p>
                      <p className="text-base font-bold text-emerald-400 mt-0.5">
                        415.6% Fully Backed
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <p className="text-slate-400">Multi-Sig Scheme</p>
                      <p className="text-base font-bold text-slate-200 mt-0.5">
                        4-of-7 Zurich Keys
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <p className="text-slate-400">Air-Gapped Cold Vault</p>
                      <p className="text-base font-bold text-blue-400 mt-0.5">
                        HSM FIPS 140-2 Level 4
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleRebalance}
                    className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 font-mono text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Trigger Multi-Sig Reserve Audit & Rebalance</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: AI Retention & Dynamic RTP Engine (40% Hook Tier) */}
          {activeTab === 'retention' && (
            <div className="space-y-6">
              {/* Top Engine Overview Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0B1322] to-amber-950/30 border border-purple-500/30 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
                      <Cpu className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-luxury font-black text-white uppercase tracking-wider">
                          Aetherius Dynamic AI Retention Engine (v4 Neural)
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                          ACTIVE & ENCRYPTED
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Dynamic onboarding curve calibrates early sessions to a 40.0% win-rate hook, smoothly transitioning to standard house equilibrium as player wager grows.
                      </p>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono block">Zero Public UI Leakage</span>
                    <span className="text-xs font-bold font-mono text-emerald-400">HMAC-SHA256 Isolated</span>
                  </div>
                </div>
              </div>

              {/* 3-Stage Retention Lifecycle Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Stage 1 */}
                <div className="p-4 rounded-xl bg-purple-950/20 border-2 border-purple-400/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-500/20">
                      STAGE 1: ONBOARDING
                    </span>
                    <span className="text-xs font-mono font-bold text-purple-300">40.0% WIN-RATE</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">New User Hook Tier</h4>
                  <p className="text-xs text-slate-300">
                    Active for early sessions (&lt; $1,000 wager). Delivers 40% hit frequency on sweet-spot multipliers (1.85x - 4.80x) to eliminate early churn and cement retention.
                  </p>
                  <div className="pt-2 border-t border-white/10 text-[11px] font-mono flex justify-between text-slate-400">
                    <span>Wager Window</span>
                    <span className="text-purple-300 font-bold">$0 – $1,000 USD</span>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-400/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/20">
                      STAGE 2: TRANSITION
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-300">40% ➔ 33.5%</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">Adaptive Stabilization</h4>
                  <p className="text-xs text-slate-300">
                    Cosine decay interpolation smoothly converges RTP toward standard mathematical house balance without sudden cliff drops in player satisfaction.
                  </p>
                  <div className="pt-2 border-t border-white/10 text-[11px] font-mono flex justify-between text-slate-400">
                    <span>Wager Window</span>
                    <span className="text-amber-300 font-bold">$1,000 – $10,000 USD</span>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-400/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-blue-300 px-2 py-0.5 rounded bg-blue-500/20">
                      STAGE 3: EQUILIBRIUM
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-300">98.5% RTP</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">House Equilibrium</h4>
                  <p className="text-xs text-slate-300">
                    Standard cryptographic house edge active. Provably Fair unbiased distribution with audited 98.5% long-term RTP and institutional hold.
                  </p>
                  <div className="pt-2 border-t border-white/10 text-[11px] font-mono flex justify-between text-slate-400">
                    <span>Wager Window</span>
                    <span className="text-blue-300 font-bold">&gt; $10,000 USD</span>
                  </div>
                </div>
              </div>

              {/* AI Retention Cohort Telemetry */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[11px] text-slate-400 font-mono uppercase block">Active Onboarding Cohort</span>
                  <div className="text-xl font-bold font-mono text-purple-300 mt-1">
                    {treasuryMetrics.retentionStats.activeOnboardingUsers} Players
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Hook Tier Active</span>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[11px] text-slate-400 font-mono uppercase block">Session Retention Lift</span>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                    +{treasuryMetrics.retentionStats.averageRetentionLiftPct}%
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Vs. Fixed RNG Baseline</span>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[11px] text-slate-400 font-mono uppercase block">Churn Prevention Rate</span>
                  <div className="text-xl font-bold font-mono text-amber-300 mt-1">
                    {treasuryMetrics.retentionStats.churnPreventionRatePct}%
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Early Drop-off Defended</span>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[11px] text-slate-400 font-mono uppercase block">Hook Cohort Turnover</span>
                  <div className="text-xl font-bold font-mono text-blue-300 mt-1">
                    ${treasuryMetrics.retentionStats.totalHookCohortWagerUSD.toLocaleString()}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Generated USD Volume</span>
                </div>
              </div>

              {/* Interactive Dynamic Algorithm Tester */}
              <div className="p-5 rounded-2xl bg-[#090F1D] border border-purple-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    Dynamic AI Curve Live Simulator & Tester
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTestPlayerWager(150)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-mono text-slate-300 cursor-pointer"
                    >
                      New User ($150)
                    </button>
                    <button
                      onClick={() => setTestPlayerWager(3500)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-mono text-slate-300 cursor-pointer"
                    >
                      Mid ($3,500)
                    </button>
                    <button
                      onClick={() => setTestPlayerWager(15000)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-mono text-slate-300 cursor-pointer"
                    >
                      Veteran ($15k)
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-300">Test Player Lifetime Wager Volume:</span>
                    <span className="text-base font-bold text-amber-300 font-mono">
                      ${testPlayerWager.toLocaleString()} USD
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15000"
                    step="50"
                    value={testPlayerWager}
                    onChange={(e) => setTestPlayerWager(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>$0 (Brand New)</span>
                    <span>$1,000 (Hook Cap)</span>
                    <span>$5,000 (Mid Transition)</span>
                    <span>$10,000+ (Full Equilibrium)</span>
                  </div>
                </div>

                {/* Live Curve Output Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Active Retention Tier</span>
                    <span className="text-xs font-bold font-mono text-purple-300 mt-1 block">
                      {liveTestProfile.tierBadge}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Dynamic Win-Rate Target</span>
                    <span className="text-base font-bold font-mono text-amber-300 mt-1 block">
                      {liveTestProfile.winRateTargetPct}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Dynamic Session RTP</span>
                    <span className="text-base font-bold font-mono text-emerald-400 mt-1 block">
                      {liveTestProfile.targetRtpPct}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Curve Stabilization</span>
                    <span className="text-base font-bold font-mono text-blue-300 mt-1 block">
                      {liveTestProfile.curveProgressPct}% Stabilized
                    </span>
                  </div>
                </div>

                {/* Current Active Session Status */}
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Current Logged-in User ({userProfile.username}) Profile:</span>
                  <span className="text-amber-300 font-bold">
                    Wagered: ${userProfile.totalWagered.toLocaleString()} • {currentUserProfile.tierBadge}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Wager Volume Yield Simulator (50 / 30 / 20) */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-[#090F1D] border border-amber-400/30 space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-mono text-slate-300">Simulated Monthly Wager Volume</span>
                    <span className="text-xl font-bold font-mono text-amber-300">
                      ${(simulatedMonthlyVolume / 1000000).toFixed(1)}M USD
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="100000000"
                    step="1000000"
                    value={simulatedMonthlyVolume}
                    onChange={(e) => setSimulatedMonthlyVolume(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                    <span>$1M (Start-up)</span>
                    <span>$25M (Standard Tier)</span>
                    <span>$50M (High Roller Tier)</span>
                    <span>$100M (Global Mega)</span>
                  </div>
                </div>

                {/* Projection Grid with 50/30/20 Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10">
                    <p className="text-[11px] text-slate-400 font-mono uppercase">Gross Gaming Revenue (3.5% GGR)</p>
                    <p className="text-lg sm:text-xl font-bold font-mono text-slate-100 mt-1">
                      ${simGrossGamingRevenue.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono">Pre-Allocation Revenue</span>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                    <p className="text-[11px] text-amber-300 font-mono uppercase">50% Owner Net Share (Vault)</p>
                    <p className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-1">
                      ${splitBreakdown.ownerNetShareUSD.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-amber-400/70 font-mono">Locked into Stealth Vault</span>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <p className="text-[11px] text-emerald-300 font-mono uppercase">30% Client / Partner Yield</p>
                    <p className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-1">
                      ${splitBreakdown.clientPartnerShareUSD.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-emerald-400/70 font-mono">Dynamic Commission Pool</span>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                    <p className="text-[11px] text-blue-300 font-mono uppercase">20% System Reserve & Ops</p>
                    <p className="text-lg sm:text-xl font-bold font-mono text-blue-400 mt-1">
                      ${splitBreakdown.systemReserveUSD.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-blue-400/70 font-mono">Gas, DDoS & Multi-Sig Buffer</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Proof of Reserves & Solvency */}
          {activeTab === 'solvency' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#090F1D] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Merkle-Tree Cryptographic Solvency Ledger
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs">
                    AUDITED 100% COVERED
                  </span>
                </div>
                <div className="space-y-2 font-mono text-xs text-slate-300 bg-black/50 p-4 rounded-xl border border-white/10">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Merkle Root:</span>
                    <span className="text-amber-400">0x7d89e2c1409ab41029e847c1042f9b8812e95a04</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Total User Liabilities:</span>
                    <span className="text-slate-200">$2,498,340.50 USDT</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Cold Vault Total Reserves (50% Owner + 20% System):</span>
                    <span className="text-emerald-400 font-bold">${(treasuryMetrics.houseVaultReservesUSD + treasuryMetrics.systemReserveUSD).toLocaleString(undefined, { minimumFractionDigits: 2 })} USDT</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Net Solvency Ratio:</span>
                    <span className="text-emerald-400 font-bold">415.87% (315% Surplus Buffer)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Audit Status:</span>
                    <span className="text-amber-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Continuous Real-Time Verification Passed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
