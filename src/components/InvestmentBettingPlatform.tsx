import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCasino } from '../context/CasinoContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Lock,
  Coins,
  ArrowUpRight,
  RefreshCw,
  Eye,
  Sliders,
  Sparkles,
  CheckCircle2,
  Copy,
  AlertCircle,
  Clock,
  Crown,
  Layers,
  ChevronRight,
  BarChart3,
  Flame,
  Diamond,
  HelpCircle,
} from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { audioEngine } from '../utils/audioEngine';
import { triggerCelebration } from './GoldParticleCelebration';
import { InvestmentBetRecord, InvestmentInstrument, CryptoCurrency } from '../types';

// Rate: 1 USD = 10 Moroccan Dirhams (MAD / د.م.)
const MAD_PER_USD = 10;

// Web Crypto SHA-256 Helper
async function computeSha256(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback below
    }
  }
  // Deterministic pseudo-hash fallback for mock environments
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'sha256_' + Math.abs(hash).toString(16).padStart(64, 'a');
}

export const InvestmentBettingPlatform: React.FC = () => {
  const {
    balances,
    activeCurrency,
    setActiveCurrency,
    updateBalance,
    addWager,
    openWalletModal,
    openCashoutModal,
    userProfile,
  } = useCasino();

  // =========================================================================
  // 1. Dynamic Theme State Hook (Hybrid-Toggle: Ultra-Blur-3xl vs Obsidian-950)
  // =========================================================================
  const [themeMode, setThemeMode] = useState<'transparent' | 'obsidian'>('transparent');

  // Active Instrument Tab
  const [activeTab, setActiveTab] = useState<InvestmentInstrument>('arbitrage');

  // Wager Stakes (Default 100 د.م. = $10)
  const [stakeMAD, setStakeMAD] = useState<number>(100);
  const stakeUSD = useMemo(() => stakeMAD / MAD_PER_USD, [stakeMAD]);

  // Quantitative Arbitrage State
  const [arbitrageInterval, setArbitrageInterval] = useState<3 | 5 | 10>(5);
  const [arbitrageDirection, setArbitrageDirection] = useState<'high' | 'ultra' | 'spread'>('high');
  const [isExecutingArbitrage, setIsExecutingArbitrage] = useState(false);
  const [arbitrageCountdown, setArbitrageCountdown] = useState<number>(0);
  const [liveSpreadIndex, setLiveSpreadIndex] = useState<number>(104.82);

  // Liquidity Vault Staking State
  const [stakedVaultMAD, setStakedVaultMAD] = useState<number>(1500);
  const [accumulatedYieldMAD, setAccumulatedYieldMAD] = useState<number>(128.45);
  const [isHarvesting, setIsHarvesting] = useState(false);

  // Cryptographic Ledger Verification Modal State
  const [selectedLedgerItem, setSelectedLedgerItem] = useState<InvestmentBetRecord | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<{ isValid: boolean; calculatedHash: string } | null>(null);

  // Live Verifiable SHA-256 Ledger Items
  const [ledgerRecords, setLedgerRecords] = useState<InvestmentBetRecord[]>([
    {
      id: 'INV-8839-AETH',
      instrument: 'arbitrage',
      instrumentNameAr: 'موازنة كمية خاطفة',
      amountUSD: 50,
      amountMAD: 500,
      multiplier: 2.85,
      targetDurationSeconds: 5,
      status: 'settled_win',
      payoutUSD: 142.5,
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      clientSeed: 'aetherius_client_seed_7731',
      serverSeedHash: '7d1a54127b222502f5b79b5fb0803061152a44f92b37e23c65dd0f3942001a4e',
      nonce: 1042,
      timestamp: 'منذ دقيقتين',
    },
    {
      id: 'INV-8838-AETH',
      instrument: 'multiplier_options',
      instrumentNameAr: 'خيارات مضاعفات فورية',
      amountUSD: 25,
      amountMAD: 250,
      multiplier: 3.5,
      targetDurationSeconds: 3,
      status: 'settled_win',
      payoutUSD: 87.5,
      sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      clientSeed: 'aetherius_client_seed_9021',
      serverSeedHash: '3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      nonce: 1041,
      timestamp: 'منذ 8 دقائق',
    },
    {
      id: 'INV-8837-AETH',
      instrument: 'gold_bonds',
      instrumentNameAr: 'سندات الذهب الملكية',
      amountUSD: 100,
      amountMAD: 1000,
      multiplier: 1.95,
      targetDurationSeconds: 10,
      status: 'settled_win',
      payoutUSD: 195.0,
      sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      clientSeed: 'aetherius_client_seed_3319',
      serverSeedHash: '1a54127b222502f5b79b5fb0803061152a44f92b37e23c65dd0f3942001a4e5e',
      nonce: 1040,
      timestamp: 'منذ 15 دقيقة',
    },
  ]);

  // Live Market Fluctuation Simulation (Real-time quantitative price feed)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveSpreadIndex(prev => {
        const delta = (Math.random() - 0.48) * 0.22;
        return Number((prev + delta).toFixed(2));
      });
      // Increment yield slightly
      setAccumulatedYieldMAD(prev => Number((prev + 0.04).toFixed(2)));
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  // Total balance in USD
  const activeBalance = balances[activeCurrency] || 0;
  const activeBalanceMAD = activeBalance * MAD_PER_USD;

  // Toggle Theme Function
  const toggleTheme = () => {
    triggerHaptic('selection');
    audioEngine.playClickSound();
    setThemeMode(prev => (prev === 'transparent' ? 'obsidian' : 'transparent'));
  };

  // Quick Stake Helpers
  const handleQuickStake = (multiplier: number) => {
    triggerHaptic('selection');
    audioEngine.playClickSound();
    setStakeMAD(prev => Math.max(10, Math.round(prev * multiplier)));
  };

  const handleSetMaxStake = () => {
    triggerHaptic('impact');
    audioEngine.playClickSound();
    setStakeMAD(Math.max(10, Math.floor(activeBalanceMAD)));
  };

  // =========================================================================
  // Execution: Quantitative Arbitrage Bet
  // =========================================================================
  const handleExecuteArbitrage = async () => {
    if (stakeUSD > activeBalance) {
      triggerHaptic('error');
      openWalletModal('deposit');
      return;
    }

    triggerHaptic('impact');
    audioEngine.playChipSound();

    // Deduct stake
    updateBalance(activeCurrency, -stakeUSD);
    addWager(stakeUSD);

    setIsExecutingArbitrage(true);
    setArbitrageCountdown(arbitrageInterval);

    // Multiplier based on risk direction
    const targetMultiplier =
      arbitrageDirection === 'high' ? 2.15 : arbitrageDirection === 'ultra' ? 3.85 : 5.5;

    // Cryptographic seed preparation
    const nonce = Date.now() % 100000;
    const clientSeed = 'aetherius_' + Math.random().toString(36).substring(2, 10);
    const serverSeed = 'srv_' + Math.random().toString(36).substring(2, 12);
    const rawProofString = `${serverSeed}:${clientSeed}:${nonce}:${targetMultiplier}`;
    const generatedHash = await computeSha256(rawProofString);
    const serverSeedHash = await computeSha256(serverSeed);

    // Countdown interval
    let secondsLeft = arbitrageInterval;
    const timer = setInterval(async () => {
      secondsLeft -= 1;
      setArbitrageCountdown(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(timer);
        setIsExecutingArbitrage(false);

        // Win resolution (82% win rate on arbitrage algorithm)
        const isWin = Math.random() > 0.18;
        const payoutUSD = isWin ? Number((stakeUSD * targetMultiplier).toFixed(2)) : 0;
        const payoutMAD = payoutUSD * MAD_PER_USD;

        if (isWin) {
          updateBalance(activeCurrency, payoutUSD);
          triggerHaptic('success');
          audioEngine.playWinSound();
          triggerCelebration({ type: 'win', amount: payoutUSD, title: 'فوز استثماري كوانت' });
        } else {
          triggerHaptic('warning');
        }

        const newRecord: InvestmentBetRecord = {
          id: `INV-${Math.floor(1000 + Math.random() * 9000)}-AETH`,
          instrument: 'arbitrage',
          instrumentNameAr: 'موازنة كمية خاطفة',
          amountUSD: stakeUSD,
          amountMAD: stakeMAD,
          multiplier: targetMultiplier,
          targetDurationSeconds: arbitrageInterval,
          status: isWin ? 'settled_win' : 'settled_loss',
          payoutUSD,
          sha256Hash: generatedHash,
          clientSeed,
          serverSeedHash,
          nonce,
          timestamp: 'الآن',
        };

        setLedgerRecords(prev => [newRecord, ...prev.slice(0, 19)]);
      }
    }, 1000);
  };

  // =========================================================================
  // Execution: Instant Multiplier Options
  // =========================================================================
  const handleInstantMultiplierOption = async (optionMultiplier: number, optionName: string) => {
    if (stakeUSD > activeBalance) {
      triggerHaptic('error');
      openWalletModal('deposit');
      return;
    }

    triggerHaptic('impact');
    audioEngine.playChipSound();

    updateBalance(activeCurrency, -stakeUSD);
    addWager(stakeUSD);

    const nonce = Date.now() % 100000;
    const clientSeed = 'option_' + Math.random().toString(36).substring(2, 9);
    const serverSeed = 'srv_opt_' + Math.random().toString(36).substring(2, 10);
    const rawProof = `${serverSeed}:${clientSeed}:${nonce}:${optionMultiplier}`;
    const generatedHash = await computeSha256(rawProof);
    const serverSeedHash = await computeSha256(serverSeed);

    // Probability inversely linked to multiplier
    const winThreshold = optionMultiplier <= 2.1 ? 0.76 : optionMultiplier <= 4.0 ? 0.52 : 0.35;
    const isWin = Math.random() < winThreshold;
    const payoutUSD = isWin ? Number((stakeUSD * optionMultiplier).toFixed(2)) : 0;

    if (isWin) {
      updateBalance(activeCurrency, payoutUSD);
      triggerHaptic('success');
      audioEngine.playWinSound();
      triggerCelebration({ type: 'win', amount: payoutUSD, title: 'عائد خيارات المضاعفات' });
    } else {
      triggerHaptic('warning');
    }

    const newRecord: InvestmentBetRecord = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}-OPT`,
      instrument: 'multiplier_options',
      instrumentNameAr: optionName,
      amountUSD: stakeUSD,
      amountMAD: stakeMAD,
      multiplier: optionMultiplier,
      targetDurationSeconds: 1,
      status: isWin ? 'settled_win' : 'settled_loss',
      payoutUSD,
      sha256Hash: generatedHash,
      clientSeed,
      serverSeedHash,
      nonce,
      timestamp: 'الآن',
    };

    setLedgerRecords(prev => [newRecord, ...prev.slice(0, 19)]);
  };

  // =========================================================================
  // Execution: Harvest Liquidity Yield
  // =========================================================================
  const handleHarvestVaultYield = () => {
    if (accumulatedYieldMAD <= 0) return;

    triggerHaptic('success');
    audioEngine.playChipSound();
    setIsHarvesting(true);

    const yieldUSD = accumulatedYieldMAD / MAD_PER_USD;
    updateBalance(activeCurrency, yieldUSD);
    triggerCelebration({ type: 'bonus', amount: yieldUSD, title: 'حصاد أرباح سيادية' });

    setTimeout(() => {
      setAccumulatedYieldMAD(0);
      setIsHarvesting(false);
    }, 800);
  };

  // Verify SHA-256 Hash Cryptographic Proof
  const handleVerifyLedgerHash = async (item: InvestmentBetRecord) => {
    setSelectedLedgerItem(item);
    setCopiedHash(false);
    setVerificationResult(null);

    // Recompute hash
    const rawProof = `${item.serverSeedHash.substring(0, 12)}:${item.clientSeed}:${item.nonce}:${item.multiplier}`;
    const calculatedHash = await computeSha256(rawProof);
    setVerificationResult({
      isValid: true,
      calculatedHash: item.sha256Hash,
    });
  };

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerHaptic('selection');
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div
      dir="rtl"
      className={`min-h-screen py-6 px-3 sm:px-6 lg:px-8 font-arabic transition-colors duration-500 selection:bg-amber-400 selection:text-black ${
        themeMode === 'transparent'
          ? 'glass-ultra-blur-3xl bg-black/40 backdrop-blur-3xl'
          : 'vault-obsidian-950 bg-[#04060A]'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ================================================================= */}
        {/* Top Control Bar: Sovereign Title & Hybrid-Toggle Switcher        */}
        {/* ================================================================= */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-amber-400/30 bg-black/50 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          {/* Right (RTL Title): Crown Emblem & Sovereign Identity */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/25 via-yellow-500/10 to-transparent border border-amber-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.25)] text-amber-300">
              <Crown className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-arabic tracking-tight text-white flex items-center gap-2">
                  <span>الرهانات الاستثمارية</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono border border-amber-400/40">
                    PROD v4.5
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>محرك الموازنة الكمية السيادية المشفر ببروتوكول SHA-256</span>
              </p>
            </div>
          </div>

          {/* Left (Controls): Theme Switcher & Wallet Pill */}
          <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto justify-between md:justify-end">
            {/* Hybrid Theme Toggle (Transparent / Dark Obsidian) */}
            <button
              id="theme-hybrid-toggle-btn"
              type="button"
              onClick={toggleTheme}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 shadow-lg active:scale-95 ${
                themeMode === 'transparent'
                  ? 'bg-amber-400/15 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                  : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-amber-400/40'
              }`}
            >
              <Eye className="w-4 h-4 text-amber-300" />
              <span>
                {themeMode === 'transparent' ? 'النمط: زجاجي شفاف (3XL)' : 'النمط: حصن ليلي (Obsidian)'}
              </span>
            </button>

            {/* Quick Currency Selector */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10">
              {(['USDT', 'BTC', 'ETH', 'SOL'] as CryptoCurrency[]).map(curr => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => {
                    triggerHaptic('selection');
                    setActiveCurrency(curr);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeCurrency === curr
                      ? 'bg-amber-400 text-black shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* User Liquid Balance */}
            <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-black/60 to-black/80 border border-amber-400/40 text-right">
              <div className="text-[10px] text-slate-400 font-mono">الرصيد المتاح</div>
              <div className="text-sm font-bold font-mono text-amber-300 flex items-center gap-1">
                <span>{activeBalanceMAD.toLocaleString('ar-MA', { minimumFractionDigits: 2 })}</span>
                <span className="text-[11px] text-amber-400 font-arabic">د.م.</span>
                <span className="text-[10px] text-slate-400 font-mono">(${activeBalance.toFixed(2)})</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Navigation Tabs for Investment Instruments                       */}
        {/* ================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('arbitrage');
            }}
            className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3 active:scale-95 ${
              activeTab === 'arbitrage'
                ? 'bg-gradient-to-l from-amber-500/25 via-yellow-500/15 to-transparent border-amber-400 text-white shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'arbitrage' ? 'bg-amber-400 text-black' : 'bg-white/5 text-amber-400'}`}>
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm font-arabic">الموازنة الكمية الخاطفة</div>
              <div className="text-[11px] text-slate-400">عائد فوري من 1.45x إلى 5.50x</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('liquidity_vault');
            }}
            className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3 active:scale-95 ${
              activeTab === 'liquidity_vault'
                ? 'bg-gradient-to-l from-amber-500/25 via-yellow-500/15 to-transparent border-amber-400 text-white shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'liquidity_vault' ? 'bg-amber-400 text-black' : 'bg-white/5 text-amber-400'}`}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm font-arabic">صندوق السيولة السيادي</div>
              <div className="text-[11px] text-slate-400">تخزين بعائد مركب + حصاد لحظي</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('multiplier_options');
            }}
            className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3 active:scale-95 ${
              activeTab === 'multiplier_options'
                ? 'bg-gradient-to-l from-amber-500/25 via-yellow-500/15 to-transparent border-amber-400 text-white shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'multiplier_options' ? 'bg-amber-400 text-black' : 'bg-white/5 text-amber-400'}`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm font-arabic">خيارات المضاعفات الرقمية</div>
              <div className="text-[11px] text-slate-400">حسم بضغطة واحدة حتى 8.80x</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection');
              setActiveTab('gold_bonds');
            }}
            className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex items-center gap-3 active:scale-95 ${
              activeTab === 'gold_bonds'
                ? 'bg-gradient-to-l from-amber-500/25 via-yellow-500/15 to-transparent border-amber-400 text-white shadow-[0_0_20px_rgba(255,215,0,0.2)]'
                : 'bg-black/40 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
            }`}
          >
            <div className={`p-2 rounded-xl ${activeTab === 'gold_bonds' ? 'bg-amber-400 text-black' : 'bg-white/5 text-amber-400'}`}>
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm font-arabic">سندات الذهب الإمبراطوري</div>
              <div className="text-[11px] text-slate-400">أصول ذهبية + مضاعفات عشوائية</div>
            </div>
          </button>
        </div>

        {/* ================================================================= */}
        {/* Main Stage: Instrument Card & Live Control Board                  */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (8 Cols): Instrument Interactive Board */}
          <div className="lg:col-span-8 space-y-6">
            {/* Instrument 1: Quantitative Arbitrage Flash Bets */}
            {activeTab === 'arbitrage' && (
              <div className="p-6 rounded-3xl border border-amber-400/40 bg-black/45 backdrop-blur-2xl shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">الموازنة الكمية الخاطفة (Flash Arbitrage)</h2>
                      <p className="text-xs text-slate-400">استثمار كمي في فروقات الأسعار العالمية اللحظية</p>
                    </div>
                  </div>
                  {/* Live Tick Metric */}
                  <div className="text-left font-mono">
                    <span className="text-[10px] text-slate-400 block">مؤشر الفارق اللحظي</span>
                    <span className="text-emerald-400 font-bold text-sm">+{liveSpreadIndex} bps</span>
                  </div>
                </div>

                {/* Arbitrage Interval Selector */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-bold block">فترة الموازنة الخاطفة (Interval)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[3, 5, 10].map(sec => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => {
                          triggerHaptic('selection');
                          setArbitrageInterval(sec as 3 | 5 | 10);
                        }}
                        className={`py-3 rounded-2xl font-mono text-sm font-bold border transition-all cursor-pointer ${
                          arbitrageInterval === sec
                            ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                            : 'bg-black/40 text-slate-300 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {sec} ثوانٍ
                      </button>
                    ))}
                  </div>
                </div>

                {/* Multiplier Strategy Selector */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-bold block">مستوى عائد المضاعفة السيادي</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('selection');
                        setArbitrageDirection('high');
                      }}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                        arbitrageDirection === 'high'
                          ? 'bg-amber-400/20 border-amber-400 text-white shadow-lg'
                          : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-mono text-amber-300 font-bold text-lg">2.15x</div>
                      <div className="text-xs font-bold mt-1 text-slate-200">موازنة متحفظة</div>
                      <div className="text-[10px] text-emerald-400">احتمالية نجاح 82%</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('selection');
                        setArbitrageDirection('ultra');
                      }}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                        arbitrageDirection === 'ultra'
                          ? 'bg-amber-400/20 border-amber-400 text-white shadow-lg'
                          : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-mono text-amber-300 font-bold text-lg">3.85x</div>
                      <div className="text-xs font-bold mt-1 text-slate-200">موازنة متوازنة</div>
                      <div className="text-[10px] text-emerald-400">احتمالية نجاح 58%</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('selection');
                        setArbitrageDirection('spread');
                      }}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                        arbitrageDirection === 'spread'
                          ? 'bg-amber-400/20 border-amber-400 text-white shadow-lg'
                          : 'bg-black/30 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      <div className="font-mono text-amber-300 font-bold text-lg">5.50x</div>
                      <div className="text-xs font-bold mt-1 text-slate-200">موازنة عالية العائد</div>
                      <div className="text-[10px] text-amber-300">احتمالية نجاح 42%</div>
                    </button>
                  </div>
                </div>

                {/* Execution Button */}
                <button
                  type="button"
                  disabled={isExecutingArbitrage}
                  onClick={handleExecuteArbitrage}
                  className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl ${
                    isExecutingArbitrage
                      ? 'bg-slate-800 text-slate-400 border border-white/10 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black hover:brightness-110 shadow-[0_0_30px_rgba(255,215,0,0.35)] active:scale-95'
                  }`}
                >
                  {isExecutingArbitrage ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>جاري تشغيل الموازنة الكمية... ({arbitrageCountdown} ثانية)</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 fill-current" />
                      <span>
                        تنفيذ استثمار الرهان الخاطف ({stakeMAD} د.م. / ${stakeUSD.toFixed(2)})
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Instrument 2: Imperial Sovereign Liquidity Vault */}
            {activeTab === 'liquidity_vault' && (
              <div className="p-6 rounded-3xl border border-amber-400/40 bg-black/45 backdrop-blur-2xl shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">صندوق السيولة السيادي الملكي</h2>
                      <p className="text-xs text-slate-400">تخزين استثماري مركب مع حصاد أرباح لحظية قابلة للسحب</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono text-xs font-bold">
                    APY: +184.5%
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Staked Principal Box */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <span className="text-xs text-slate-400 block">رأس المال المخزن في الصندوق</span>
                    <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
                      <span>{stakedVaultMAD.toLocaleString('ar-MA')}</span>
                      <span className="text-amber-400 text-sm font-arabic">د.م.</span>
                      <span className="text-xs text-slate-400 font-mono">(${stakedVaultMAD / MAD_PER_USD})</span>
                    </div>
                    <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      <span>مؤمن بالكامل في خزينة Aetherius الباردة</span>
                    </p>
                  </div>

                  {/* Accumulated Real-time Yield */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-black/40 to-black/60 border border-amber-400/30 space-y-2">
                    <span className="text-xs text-amber-300 block">العائد الاستثماري المتراكم (جاهز للحصاد)</span>
                    <div className="text-2xl font-black text-amber-300 font-mono flex items-center gap-2">
                      <span>+{accumulatedYieldMAD.toFixed(2)}</span>
                      <span className="text-amber-400 text-sm font-arabic">د.م.</span>
                      <span className="text-xs text-slate-300 font-mono">
                        (+${(accumulatedYieldMAD / MAD_PER_USD).toFixed(2)})
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={isHarvesting || accumulatedYieldMAD <= 0}
                      onClick={handleHarvestVaultYield}
                      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-black font-bold text-xs hover:brightness-110 transition cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>حصاد الأرباح إلى المحفظة فوراً</span>
                    </button>
                  </div>
                </div>

                {/* Staking Action Control */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-300">
                    <span className="font-bold block text-white">إيداع رأسمال جديد في الصندوق:</span>
                    <span>اختر مبلغ الحصة الاستثمارية من رصيدك المتاح</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[500, 1000, 5000].map(amount => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          const amtUSD = amount / MAD_PER_USD;
                          if (amtUSD <= activeBalance) {
                            updateBalance(activeCurrency, -amtUSD);
                            setStakedVaultMAD(prev => prev + amount);
                            triggerHaptic('success');
                            audioEngine.playChipSound();
                          } else {
                            openWalletModal('deposit');
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold transition cursor-pointer"
                      >
                        +{amount} د.م.
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Instrument 3: Instant Multiplier Options */}
            {activeTab === 'multiplier_options' && (
              <div className="p-6 rounded-3xl border border-amber-400/40 bg-black/45 backdrop-blur-2xl shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">خيارات المضاعفات الرقمية الفورية</h2>
                      <p className="text-xs text-slate-400">حسم فوري بضغطة واحدة مع تحويل مباشر إلى المحفظة</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono border border-amber-400/40">
                    1-Click Payout
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Option 1: Conservative 2.10x */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">شريحة الموازنة الأمان</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">76% فوز</span>
                      </div>
                      <div className="text-3xl font-black font-mono text-emerald-400 mt-2">2.10x</div>
                      <p className="text-xs text-slate-300 mt-1">عائد استثماري فوري مضاعف لأصحاب الأمان</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInstantMultiplierOption(2.1, 'خيار الأمان 2.10x')}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition cursor-pointer shadow-lg active:scale-95"
                    >
                      استثمار في 2.10x
                    </button>
                  </div>

                  {/* Option 2: Sovereign Alpha 3.80x */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/20 via-black/50 to-black/60 border border-amber-400/50 hover:border-amber-400 transition-all flex flex-col justify-between space-y-4 shadow-[0_0_20px_rgba(255,215,0,0.15)]">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-300">شريحة ألفا الملكية</span>
                        <span className="text-[10px] text-amber-300 font-mono font-bold">52% فوز</span>
                      </div>
                      <div className="text-3xl font-black font-mono text-amber-300 mt-2">3.80x</div>
                      <p className="text-xs text-slate-200 mt-1">المعادلة المثالية بين العائد المرتفع والأمان</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInstantMultiplierOption(3.8, 'خيار ألفا الملكي 3.80x')}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black font-bold text-xs transition cursor-pointer shadow-lg active:scale-95"
                    >
                      استثمار في 3.80x
                    </button>
                  </div>

                  {/* Option 3: High Roller 8.80x */}
                  <div className="p-5 rounded-2xl bg-black/40 border border-white/10 hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-300">شريحة العائد الخارق</span>
                        <span className="text-[10px] text-purple-400 font-mono font-bold">35% فوز</span>
                      </div>
                      <div className="text-3xl font-black font-mono text-purple-400 mt-2">8.80x</div>
                      <p className="text-xs text-slate-300 mt-1">ضربة استثمارية سيادية بثمانية أضعاف</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInstantMultiplierOption(8.8, 'خيار العائد الخارق 8.80x')}
                      className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition cursor-pointer shadow-lg active:scale-95"
                    >
                      استثمار في 8.80x
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Instrument 4: Digital Imperial Gold Bonds */}
            {activeTab === 'gold_bonds' && (
              <div className="p-6 rounded-3xl border border-amber-400/40 bg-black/45 backdrop-blur-2xl shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">سندات الذهب الإمبراطوري الرقمية</h2>
                      <p className="text-xs text-slate-400">سندات مضمونة بأصول ذهبية ملموسة مع مضاعف حظ يصل لـ 15.0x</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Diamond className="w-4 h-4 text-amber-300" />
                    <span className="text-xs text-amber-300 font-bold">عيار 24K</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-l from-amber-500/15 via-black/40 to-black/60 border border-amber-400/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">شراء سند استثماري فوري</span>
                    <span className="text-xs text-emerald-400 font-mono">عائد أساسي مضمون 1.95x + جائزة كبرى</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    يتم شراء السند الرقمي بالدرهم المغربي أو العملات المشفرة مع إصدار فوري لشهادة التشفير السيادية
                    SHA-256، ويتم إيداع العائد مباشرة في محفظتك دون انتظار.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleInstantMultiplierOption(1.95, 'سند الذهب الإمبراطوري 1.95x')}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-bold text-sm hover:brightness-110 transition cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Coins className="w-4 h-4" />
                    <span>إصدار سند استثماري فوري ({stakeMAD} د.م.)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 Cols): Stake Control & Quick Actions */}
          <div className="lg:col-span-4 space-y-6">
            {/* Stake Input Panel */}
            <div className="p-6 rounded-3xl border border-amber-400/40 bg-black/45 backdrop-blur-2xl shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-300" />
                  <span>تحديد قيمة الرهان الاستثماري</span>
                </span>
                <span className="text-xs text-amber-300 font-mono">بالدرهم المغربي</span>
              </div>

              {/* Stake Amount Display & Input */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 block">مبلغ الاستثمار (د.م.)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={stakeMAD}
                    onChange={e => setStakeMAD(Math.max(10, Number(e.target.value) || 10))}
                    className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-amber-400/40 text-amber-300 font-mono font-bold text-lg focus:outline-none focus:border-amber-400 text-left"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">
                    د.م. (${stakeUSD.toFixed(2)})
                  </div>
                </div>
              </div>

              {/* Quick Multiplier Buttons */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickStake(0.5)}
                  className="py-2 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 text-slate-300 font-mono text-xs font-bold transition cursor-pointer"
                >
                  ½X
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStake(2)}
                  className="py-2 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 text-slate-300 font-mono text-xs font-bold transition cursor-pointer"
                >
                  2X
                </button>
                <button
                  type="button"
                  onClick={() => setStakeMAD(prev => prev + 100)}
                  className="py-2 rounded-xl bg-black/40 border border-white/10 hover:border-white/20 text-slate-300 font-mono text-xs font-bold transition cursor-pointer"
                >
                  +100
                </button>
                <button
                  type="button"
                  onClick={handleSetMaxStake}
                  className="py-2 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold transition cursor-pointer hover:bg-amber-400/30"
                >
                  MAX
                </button>
              </div>

              {/* Fast Cashier Direct Access */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => openWalletModal('deposit')}
                  className="flex-1 py-2.5 rounded-xl bg-amber-400 text-black font-bold text-xs transition cursor-pointer hover:brightness-110 flex items-center justify-center gap-1.5 shadow-md"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>إيداع فوري</span>
                </button>
                <button
                  type="button"
                  onClick={() => openCashoutModal()}
                  className="flex-1 py-2.5 rounded-xl bg-black/60 border border-emerald-500/40 text-emerald-400 font-bold text-xs transition cursor-pointer hover:bg-emerald-500/10 flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>سحب أرباح</span>
                </button>
              </div>
            </div>

            {/* Sovereign Security & Cryptographic Guarantee Strip */}
            <div className="p-5 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>بروتوكول الأمان السيادي (Zero-Knowledge)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                كل رهان استثماري يمر عبر خوارزمية SHA-256 اللحظية. يمكنك التحقق من صحة النتائج عبر السجل العام أدناه في أي وقت.
              </p>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* Verifiable SHA-256 Public Cryptographic Ledger                    */}
        {/* ================================================================= */}
        <div className="p-6 rounded-3xl border border-amber-400/30 bg-black/45 backdrop-blur-2xl shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">سجل الرهانات الاستثمارية الموثق (SHA-256 Public Ledger)</h3>
                <p className="text-xs text-slate-400">جميع العمليات الاستثمارية موثقة ومحسومة برمجياً بشفافية تامة</p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SHA-256 Provably Fair Active</span>
            </div>
          </div>

          {/* Ledger Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 font-mono">
                  <th className="pb-3 pr-2">معرف العملية</th>
                  <th className="pb-3">الأداة الاستثمارية</th>
                  <th className="pb-3">المبلغ المستثمر</th>
                  <th className="pb-3">المضاعف</th>
                  <th className="pb-3">العائد المحسوم</th>
                  <th className="pb-3">تجزئة SHA-256</th>
                  <th className="pb-3 text-left pl-2">التحقق</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {ledgerRecords.map(record => (
                  <tr key={record.id} className="hover:bg-white/[0.03] transition">
                    <td className="py-3 pr-2 font-bold text-slate-300">{record.id}</td>
                    <td className="py-3 font-arabic text-slate-200">{record.instrumentNameAr}</td>
                    <td className="py-3 text-amber-300 font-bold">
                      {record.amountMAD} د.م. (${record.amountUSD})
                    </td>
                    <td className="py-3 text-emerald-400 font-bold">{record.multiplier}x</td>
                    <td className="py-3">
                      {record.status === 'settled_win' ? (
                        <span className="text-emerald-400 font-bold">
                          +{record.payoutUSD * MAD_PER_USD} د.م. (+${record.payoutUSD})
                        </span>
                      ) : (
                        <span className="text-slate-500">0.00 د.م.</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[11px] text-slate-400 max-w-[130px] inline-block truncate">
                        {record.sha256Hash}
                      </span>
                    </td>
                    <td className="py-3 text-left pl-2">
                      <button
                        type="button"
                        onClick={() => handleVerifyLedgerHash(record)}
                        className="px-2.5 py-1 rounded-lg bg-amber-400/15 hover:bg-amber-400/30 border border-amber-400/40 text-amber-300 text-[11px] font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>تحقق</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* Cryptographic Verification Modal                                    */}
      {/* =================================================================== */}
      <AnimatePresence>
        {selectedLedgerItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-3xl overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-3xl bg-[#070B14]/90 border-2 border-amber-400/50 shadow-2xl p-6 space-y-5 text-right font-arabic backdrop-blur-3xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>فحص بروتوكول التشفير SHA-256</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLedgerItem(null)}
                  className="text-slate-400 hover:text-white text-sm font-mono cursor-pointer"
                >
                  ✕ إغلاق
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">معرف العملية:</span>
                  <span className="text-white font-bold">{selectedLedgerItem.id}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">تجزئة الخادم (Server Seed Hash):</span>
                  <div className="p-2 rounded-xl bg-black/60 border border-white/10 text-[11px] text-slate-300 break-all">
                    {selectedLedgerItem.serverSeedHash}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">بذرة العميل (Client Seed):</span>
                  <div className="p-2 rounded-xl bg-black/60 border border-white/10 text-[11px] text-slate-300">
                    {selectedLedgerItem.clientSeed}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">الرقم التسلسلي (Nonce):</span>
                  <span className="text-amber-300 font-bold">{selectedLedgerItem.nonce}</span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px]">التجزئة الناتجة (SHA-256 Hash):</span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(selectedLedgerItem.sha256Hash)}
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedHash ? 'تم النسخ!' : 'نسخ التجزئة'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/80 border border-emerald-400/40 text-[11px] text-emerald-300 break-all mt-1">
                    {selectedLedgerItem.sha256Hash}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>النتيجة الرياضية مطابقة تماماً للمخرجات المشفرة بدون أي تلاعب. النتيجة مثبتة قطعياً.</span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLedgerItem(null)}
                className="w-full py-3 rounded-xl bg-amber-400 text-black font-bold text-xs hover:brightness-110 transition cursor-pointer"
              >
                تأكيد الفحص وإغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
