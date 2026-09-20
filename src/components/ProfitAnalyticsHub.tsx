import React, { useState } from 'react';
import { useCasino } from '../context/CasinoContext';
import {
  TrendingUp,
  ShieldCheck,
  Coins,
  Users,
  Percent,
  Sparkles,
  Zap,
  ArrowUpRight,
  Lock,
  Layers,
  BarChart3,
  PieChart,
  HelpCircle,
  CheckCircle2,
  RefreshCw,
  Building2,
  Vault
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProfitAnalyticsHub: React.FC = () => {
  const {
    treasuryMetrics,
    setNavTab,
    openProvablyFair,
    openSecurityModal,
    showToast,
  } = useCasino();

  const [simulatedMonthlyVolume, setSimulatedMonthlyVolume] = useState<number>(25000000); // $25M
  const [activeView, setActiveView] = useState<'overview' | 'simulator' | 'solvency'>('overview');

  // Simulated calculations
  const simGrossGamingRevenue = simulatedMonthlyVolume * 0.035; // 3.5% average house hold
  const simHouseNetHold = simGrossGamingRevenue * (treasuryMetrics.houseHoldPercentage / 100); // 70%
  const simAffiliatePayout = simGrossGamingRevenue * (treasuryMetrics.affiliateRevSharePercentage / 100); // 25%
  const simSystemBuffer = simGrossGamingRevenue * 0.05; // 5%

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Luxury Royal Obsidian & Gold Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#080E18] via-[#0B1322] to-[#080E18] border-2 border-amber-400/40 p-6 sm:p-8 shadow-2xl">
        {/* Subtle Watermark & Glowing Top Filigree */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_#FFD700]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
                <Vault className="w-3.5 h-3.5 text-amber-400" />
                70 / 25 / 30 ECONOMIC PROTOCOL
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 font-mono text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Cold Storage Reserve: ACTIVE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-luxury font-black text-slate-100 tracking-wide">
              PROFIT ANALYTICS & REVENUE SHARE HUB
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Transparent, automated fintech architecture balancing institutional solvency with generous
              member monetization. Audited net hold and real-time revenue disbursement ledgers.
            </p>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="profit-hub-go-affiliates"
              onClick={() => setNavTab('affiliates')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-mono font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-400/20"
            >
              <Users className="w-4 h-4 fill-black" />
              <span>Affiliate Empire Tab</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              id="profit-hub-audit-fairness"
              onClick={openProvablyFair}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Audit Solvency</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Key Pillars of the Economic Model */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: 70% House Profit Margin Pool */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#0D1526] to-[#080E18] border-2 border-amber-400/30 p-6 shadow-xl space-y-4 overflow-hidden group hover:border-amber-400/60 transition duration-300">
          <div className="absolute top-0 right-0 w-28 h-28 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono font-black text-sm border border-amber-400/40">
              70% NET HOLD
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              House Profit Margin Pool
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-mono-num text-slate-100 mt-1">
              ${treasuryMetrics.houseVaultReservesUSD.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Guaranteed 70% net ecosystem hold deposited directly into institutional cold-storage HSM vaults to back massive table liquidity.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>Solvency Ratio:</span>
              <span className="text-emerald-400 font-bold">142% Fully Collateralized</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Hold Enforcement:</span>
              <span className="text-slate-200">Algorithmic HSM Contract</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Audited Reserves:</span>
              <span className="text-amber-300">Zurich Cold Nodes</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: 25% Lifetime Affiliate Member RevShare */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#0D1526] to-[#080E18] border-2 border-emerald-400/30 p-6 shadow-xl space-y-4 overflow-hidden group hover:border-emerald-400/60 transition duration-300">
          <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-400/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <Users className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 font-mono font-black text-sm border border-emerald-400/40">
              25% REV-SHARE
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              Affiliate Member RevShare
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-mono-num text-slate-100 mt-1">
              ${treasuryMetrics.commissionsPaidOutUSD.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              25% lifetime commission payout system for active network members. 20% direct Level-1 + 5% multi-tier sub-network override.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>Commission Rate:</span>
              <span className="text-emerald-400 font-bold">25% Lifetime NGR</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Active Partners:</span>
              <span className="text-slate-200">{treasuryMetrics.activeAffiliatesCount} Members</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Payout Speed:</span>
              <span className="text-amber-300">Instant On-Demand Crypto/Fiat</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: 30% Welcome Bonus Accelerator */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#0D1526] to-[#080E18] border-2 border-blue-400/30 p-6 shadow-xl space-y-4 overflow-hidden group hover:border-blue-400/60 transition duration-300">
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-400/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-inner">
              <Zap className="w-6 h-6" />
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 font-mono font-black text-sm border border-blue-400/40">
              +30% MATCH
            </span>
          </div>

          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
              New User Welcome Match
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-mono-num text-slate-100 mt-1">
              ${treasuryMetrics.welcomeBonusPoolDistributedUSD.toLocaleString()}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              30% instant deposit match system on initial account funding. Automatic calculator: Deposit $100 ➔ Get $130 Wager Power.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>Multiplier:</span>
              <span className="text-blue-400 font-bold">1.30x Initial Bankroll</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Anti-Abuse Engine:</span>
              <span className="text-emerald-400">Fingerprint + Single IP</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Deposit Requirement:</span>
              <span className="text-amber-300">Min $20 to Qualify</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Economic Simulator */}
      <div className="rounded-2xl bg-gradient-to-br from-[#080E18] via-[#0D1627] to-[#080E18] border-2 border-amber-400/30 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg sm:text-xl font-luxury font-bold text-slate-100">
                DYNAMIC ECOSYSTEM REVSHARE SIMULATOR
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Drag the platform volume slider to observe algorithmic cashflow distribution under the 70 / 25 / 30 economic model.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Simulated Monthly Wager</span>
            <span className="text-xl sm:text-2xl font-black font-mono-num text-amber-300">
              ${(simulatedMonthlyVolume / 1000000).toFixed(1)}M USD
            </span>
          </div>
        </div>

        {/* Volume Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={5000000}
            max={100000000}
            step={2500000}
            value={simulatedMonthlyVolume}
            onChange={(e) => setSimulatedMonthlyVolume(Number(e.target.value))}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>$5M Micro Volume</span>
            <span className="text-amber-300 font-bold">${(simulatedMonthlyVolume / 1000000).toFixed(1)}M Wager</span>
            <span>$100M Sovereign Whales</span>
          </div>
        </div>

        {/* Dynamic Breakdown Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-black/60 border border-amber-400/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-300">70% House Vault Hold</span>
              <span className="text-xs font-mono text-slate-400">70% NGR</span>
            </div>
            <div className="text-2xl font-black font-mono-num text-amber-300">
              ${Math.round(simHouseNetHold).toLocaleString()}
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '70%' }} />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Net platform profit retained for treasury liquidity and mega-jackpot reserve coverage.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-emerald-400/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-300">25% Affiliate Member Pool</span>
              <span className="text-xs font-mono text-slate-400">25% NGR</span>
            </div>
            <div className="text-2xl font-black font-mono-num text-emerald-400">
              ${Math.round(simAffiliatePayout).toLocaleString()}
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '25%' }} />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Direct lifetime cash payout to active affiliates, VIP referrers, and network ambassadors.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-blue-400/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-300">5% Solvency Buffer</span>
              <span className="text-xs font-mono text-slate-400">5% Buffer</span>
            </div>
            <div className="text-2xl font-black font-mono-num text-blue-400">
              ${Math.round(simSystemBuffer).toLocaleString()}
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full" style={{ width: '5%' }} />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              High-entropy HSM node operational buffer, zero-latency network gas, and insurance pool.
            </p>
          </div>
        </div>
      </div>

      {/* House Edge & Game RTP Transparency Ledger */}
      <div className="rounded-2xl bg-gradient-to-b from-[#0D1526] to-[#080E18] border border-white/10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-luxury font-bold text-slate-100 flex items-center gap-2">
              <Percent className="w-5 h-5 text-amber-400" />
              GAME RTP & MATHEMATICAL HOLD ARCHITECTURE
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified by independent cryptographers with SHA-256 HMAC fairness pre-commitments.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/30">
            Average Player RTP: 98.9%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { game: 'Royal Arabic Crash', rtp: '99.4%', houseEdge: '0.6%', type: 'Multiplier' },
            { game: 'Imperial Roulette', rtp: '98.65%', houseEdge: '1.35%', type: 'Single-Zero' },
            { game: 'Neon Slots', rtp: '97.8%', houseEdge: '2.2%', type: 'Megaways' },
            { game: 'Quantum Plinko', rtp: '99.0%', houseEdge: '1.0%', type: 'Pyramid' },
            { game: 'Macau Baccarat', rtp: '98.94%', houseEdge: '1.06%', type: 'No-Commission' },
            { game: 'Celestial Blackjack', rtp: '99.5%', houseEdge: '0.5%', type: 'Vegas Rules' },
          ].map((item) => (
            <div key={item.game} className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1 text-xs font-mono">
              <p className="text-slate-300 font-bold text-xs truncate">{item.game}</p>
              <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1">
                <span>RTP:</span>
                <span className="text-emerald-400 font-bold">{item.rtp}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Edge:</span>
                <span className="text-amber-300">{item.houseEdge}</span>
              </div>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest pt-1">{item.type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
