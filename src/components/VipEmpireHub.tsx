import React, { useState } from 'react';
import { useCasino } from '../context/CasinoContext';
import { VIPTierInfo } from '../types';
import {
  Crown,
  Sparkles,
  TrendingUp,
  Clock,
  Coins,
  ShieldCheck,
  Share2,
  Users,
  Copy,
  Check,
  Award,
  Zap,
  ArrowRight,
  Gift,
  Lock,
  Flame,
  Star,
  Diamond,
} from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';

export const VipEmpireHub: React.FC = () => {
  const {
    userProfile,
    vipTierInfo,
    allVipTiers,
    rakebackSecondsLeft,
    unclaimedRakebackUSD,
    claimDailyRakeback,
    weeklyCashbackUSD,
    weeklyWagerProgress,
    claimWeeklyCashback,
    weeklyCashbackClaimed,
    affiliateStats,
    claimAffiliateCommission,
    claimDailyBonus,
    dailyBonusClaimed,
    showToast,
    openWalletModal,
    setNavTab,
  } = useCasino();

  const [selectedTier, setSelectedTier] = useState<VIPTierInfo>(vipTierInfo);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Format seconds into HH:MM:SS
  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCopyLink = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(affiliateStats.referralLink);
    setCopiedLink(true);
    showToast('Unique referral link copied to clipboard.');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(affiliateStats.referralCode);
    setCopiedCode(true);
    showToast(`Referral code ${affiliateStats.referralCode} copied.`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const progressPercent = Math.min(
    100,
    Math.round((userProfile.currentTierProgressWager / userProfile.nextTierRequiredWager) * 100)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-left">
      {/* VIP Overview Hero - Cyber-Royal Obsidian Midnight */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#070b14] via-[#05070d] to-[#030406] border border-amber-400/40 p-6 sm:p-10 shadow-[0_0_60px_rgba(255,215,0,0.15)] backdrop-blur-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* User Rank Badge & Info */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(255,215,0,0.2)]">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Imperial Sovereign VIP Club</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <h1 className="font-luxury font-black text-3xl sm:text-5xl text-white tracking-wide uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              VIP EMPIRE REWARDS
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Welcome to the inner sanctum, <span className="text-amber-300 font-bold">{userProfile.username}</span>. As a{' '}
              <span className="text-amber-400 font-bold font-mono">Gold Sovereign (Tier 5)</span> member, you enjoy automated loss rebates, instant hourly rakeback, and priority blockchain settlement.
            </p>

            {/* Current Level Progress */}
            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 space-y-2.5 max-w-lg shadow-inner">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Diamond className="w-3.5 h-3.5 text-amber-400" />
                  Next Milestone: Platinum Elite
                </span>
                <span className="text-amber-300 font-bold">{progressPercent}% Completed</span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden relative border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 rounded-full shadow-[0_0_12px_#ffd700]"
                />
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Wagered: ${userProfile.currentTierProgressWager.toLocaleString()} USDT</span>
                <span className="text-amber-300/90 font-bold">Target: ${userProfile.nextTierRequiredWager.toLocaleString()} USDT</span>
              </div>
            </div>
          </div>

          {/* Quick VIP Stats Widget */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#080d1a]/80 border border-white/10 flex flex-col justify-between hover:border-emerald-400/40 transition-all hover:scale-102">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Cashback</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold font-mono text-white">14.5%</span>
                <p className="text-[11px] text-emerald-400 font-mono mt-0.5">Net loss protection</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080d1a]/80 border border-white/10 flex flex-col justify-between hover:border-amber-400/40 transition-all hover:scale-102">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Rakeback</span>
                <Coins className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold font-mono text-white">8.0%</span>
                <p className="text-[11px] text-amber-400 font-mono mt-0.5">Edge refund per bet</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080d1a]/80 border border-white/10 flex flex-col justify-between hover:border-purple-400/40 transition-all hover:scale-102">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">Daily Reload</span>
                <Gift className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-bold font-mono text-white">+$250</span>
                <p className="text-[11px] text-purple-400 font-mono mt-0.5">Automated credit</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#080d1a]/80 border border-white/10 flex flex-col justify-between hover:border-blue-400/40 transition-all hover:scale-102">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase">VIP Concierge</span>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
              </div>
              <div className="mt-3">
                <span className="text-sm font-bold font-mono text-emerald-400">ACTIVE</span>
                <p className="text-[11px] text-blue-400 font-mono mt-0.5">Dedicated Desk Host</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rewards Claim Hub: Daily Rakeback & Weekly Cashback */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Rakeback Station */}
        <div className="p-6 rounded-3xl cyber-glass-card border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-luxury font-bold text-lg text-white uppercase tracking-wide">
                  Daily Instant Rakeback
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Continuous 8.0% return on every wager, win or lose.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTimer(rakebackSecondsLeft)}</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Accumulated Rakeback:
              </span>
              <span className="text-3xl font-luxury font-black text-amber-300">
                ${unclaimedRakebackUSD.toFixed(2)}{' '}
                <span className="text-sm font-mono text-slate-400">USDT</span>
              </span>
            </div>

            <button
              id="vip-claim-rakeback-btn"
              onClick={() => {
                triggerHaptic('success');
                claimDailyRakeback();
              }}
              disabled={unclaimedRakebackUSD <= 0}
              className={`px-6 py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 ${
                unclaimedRakebackUSD > 0
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-amber-500/20'
                  : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
              }`}
            >
              CLAIM RAKEBACK
            </button>
          </div>

          <p className="text-[11px] text-slate-500 font-mono">
            Rakeback calculates in real-time as you wager across Crash, Slots, Roulette, and Table games.
          </p>
        </div>

        {/* Weekly Loss Cashback Vault */}
        <div className="p-6 rounded-3xl cyber-glass-card border border-white/10 hover:border-emerald-400/30 transition-all flex flex-col justify-between space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-luxury font-bold text-lg text-white uppercase tracking-wide">
                  Weekly Sovereign Cashback
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  14.5% net loss insurance protection credited every Friday.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono text-emerald-300">
              {weeklyCashbackClaimed ? 'CLAIMED THIS CYCLE' : 'READY TO CLAIM'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block uppercase">
                Available Cashback:
              </span>
              <span className="text-3xl font-luxury font-black text-emerald-400">
                ${weeklyCashbackClaimed ? '0.00' : weeklyCashbackUSD.toFixed(2)}{' '}
                <span className="text-sm font-mono text-slate-400">USDT</span>
              </span>
            </div>

            <button
              id="vip-claim-cashback-btn"
              onClick={() => {
                triggerHaptic('success');
                claimWeeklyCashback();
              }}
              disabled={weeklyCashbackClaimed}
              className={`px-6 py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 ${
                !weeklyCashbackClaimed
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black shadow-emerald-500/20'
                  : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
              }`}
            >
              {weeklyCashbackClaimed ? 'CLAIMED' : 'CLAIM CASHBACK'}
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Weekly Wager Volume Bonus</span>
              <span>{weeklyWagerProgress}% of Booster Goal</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${weeklyWagerProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Rank Tier Progression Matrix */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">
              Ascension Ladder
            </span>
            <h2 className="font-luxury font-black text-2xl sm:text-3xl text-white tracking-wide uppercase mt-0.5">
              Imperial Rank Progression
            </h2>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Select a tier to examine privileges, limits, and customized rewards.
          </p>
        </div>

        {/* Tier Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {allVipTiers.map((tier) => {
            const isCurrent = userProfile.vipTier === tier.tier;
            const isSelected = selectedTier.tier === tier.tier;

            return (
              <button
                key={tier.tier}
                onClick={() => {
                  triggerHaptic('selection');
                  setSelectedTier(tier);
                }}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden active:scale-95 hover:scale-102 ${
                  isSelected
                    ? 'cyber-glass-gold border-amber-400 shadow-[0_0_20px_rgba(255,215,0,0.25)]'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-400 text-black font-mono font-bold text-[9px]">
                    YOU
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <Award
                    className="w-5 h-5"
                    style={{ color: tier.badgeColor }}
                  />
                  <span className="font-luxury font-bold text-xs text-white truncate">
                    Lv. {tier.level}
                  </span>
                </div>

                <div>
                  <h4 className="font-luxury font-bold text-xs text-slate-200">
                    {tier.tier}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                    ${tier.minWager.toLocaleString()}+ Wager
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Selected Tier Card */}
        <div className="p-6 sm:p-8 rounded-3xl cyber-glass-card border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-luxury font-black text-2xl text-black shadow-lg shrink-0"
                style={{ backgroundColor: selectedTier.badgeColor }}
              >
                {selectedTier.level}
              </div>
              <div>
                <h3 className="font-luxury font-black text-xl sm:text-2xl text-white tracking-wide uppercase">
                  {selectedTier.tier} Tier Privileges
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Minimum Lifetime Wager Threshold: ${selectedTier.minWager.toLocaleString()} USDT
                </p>
              </div>
            </div>

            {userProfile.vipTier === selectedTier.tier ? (
              <span className="px-4 py-2 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold">
                Current Active Status
              </span>
            ) : (
              <span className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/10 text-xs font-mono">
                {selectedTier.minWager > userProfile.totalWagered ? 'Locked Tier' : 'Completed Tier'}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 p-4 rounded-xl bg-black/40 border border-white/5">
              <span className="text-xs font-mono text-slate-400 block uppercase">Cashback & Rakeback</span>
              <p className="text-lg font-bold font-mono text-amber-300">
                {selectedTier.cashbackPct}% Cashback • {selectedTier.rakebackPct}% Rakeback
              </p>
              <p className="text-[11px] text-slate-500">Credited automatically without wagering requirements.</p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-black/40 border border-white/5">
              <span className="text-xs font-mono text-slate-400 block uppercase">Reload Allowances</span>
              <p className="text-lg font-bold font-mono text-emerald-400">
                +${selectedTier.dailyBonus} Daily / +${selectedTier.weeklyReload} Weekly
              </p>
              <p className="text-[11px] text-slate-500">Claimable directly to cold storage balance.</p>
            </div>

            <div className="space-y-2 p-4 rounded-xl bg-black/40 border border-white/5">
              <span className="text-xs font-mono text-slate-400 block uppercase">Host & Withdrawal Limits</span>
              <p className="text-lg font-bold font-mono text-purple-400">
                {selectedTier.vipHostAssigned ? 'Dedicated Personal Host' : 'Standard Queue'}
              </p>
              <p className="text-[11px] text-slate-500">
                {selectedTier.priorityWithdrawals ? 'Instant Flash Settlements' : 'Standard 15m Settlement'}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-3">
              Included Tier Perks & Benefits:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {selectedTier.perks.map((perk, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-200"
                >
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Affiliate & Referral Empire System */}
      <div className="p-6 sm:p-10 rounded-3xl cyber-glass-card border border-amber-400/30 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
              <Share2 className="w-4 h-4" />
              <span>Decentralized Partner Network</span>
            </div>
            <h2 className="font-luxury font-black text-2xl sm:text-4xl text-white tracking-wide uppercase mt-1">
              AFFILIATE & PARTNER VAULT
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Earn lifetime commissions on every wager placed by your invited network. Direct cryptocurrency settlements with zero clawbacks.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              id="vip-open-affiliates-tab-btn"
              onClick={() => {
                triggerHaptic('selection');
                setNavTab('affiliates');
              }}
              className="px-5 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 hover:scale-102"
            >
              <Users className="w-4 h-4" />
              <span>Affiliate Empire (25% RevShare)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              id="affiliate-claim-commission-btn"
              onClick={() => {
                triggerHaptic('success');
                claimAffiliateCommission();
              }}
              disabled={affiliateStats.unclaimedCommissionUSD <= 0}
              className={`px-6 py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg active:scale-95 ${
                affiliateStats.unclaimedCommissionUSD > 0
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black shadow-amber-500/20'
                  : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
              }`}
            >
              CLAIM ${affiliateStats.unclaimedCommissionUSD.toFixed(2)}
            </button>
          </div>
        </div>

        {/* Affiliate Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              Commission Rate
            </span>
            <span className="text-2xl font-bold font-mono text-amber-300 mt-1 block">
              {affiliateStats.commissionRatePct}% RevShare
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Tier III Sovereign</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              Total Commission Earned
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              ${affiliateStats.totalEarnedUSD.toLocaleString()} USDT
            </span>
            <span className="text-[10px] text-slate-500 font-mono">All-time payout</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              Total Referrals
            </span>
            <span className="text-2xl font-bold font-mono text-white mt-1 block">
              {affiliateStats.totalReferrals}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{affiliateStats.activeWagerers} Active Wagerers</span>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              Unclaimed Balance
            </span>
            <span className="text-2xl font-bold font-mono text-yellow-400 mt-1 block">
              ${affiliateStats.unclaimedCommissionUSD.toFixed(2)} USDT
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Instant claim ready</span>
          </div>
        </div>

        {/* Shareable Links & Codes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Referral Link Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span>Your Unique Referral Link:</span>
              <button
                id="affiliate-copy-link-btn"
                onClick={handleCopyLink}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-slate-200 truncate select-all">
              {affiliateStats.referralLink}
            </div>
          </div>

          {/* Referral Code Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono text-slate-400">
              <span>Referral Promo Code:</span>
              <button
                id="affiliate-copy-code-btn"
                onClick={handleCopyCode}
                className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-bold"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-amber-300 font-bold select-all tracking-wider">
              {affiliateStats.referralCode}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
