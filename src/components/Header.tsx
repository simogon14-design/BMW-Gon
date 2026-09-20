import React, { useState } from 'react';
import { useCasino } from '../context/CasinoContext';
import { CryptoCurrency } from '../types';
import { GoldenEagleCrest } from './GoldenEagleCrest';
import {
  Wallet,
  ShieldCheck,
  Crown,
  ChevronDown,
  Lock,
  ArrowDownLeft,
  ArrowUpRight,
  Globe,
  Sparkles,
  Volume2,
  VolumeX,
  ExternalLink,
  Gamepad2,
  Vault,
  Users,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Diamond,
  Zap,
  Moon,
  Sun,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';
import { SupportedLanguage } from '../utils/i18n';

const LANGUAGES: { code: SupportedLanguage; name: string; native: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'ar', name: 'Arabic', native: 'العربية (RTL)', flag: '🇸🇦', dir: 'rtl' },
  { code: 'en', name: 'English', native: 'English (US)', flag: '🇺🇸', dir: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', dir: 'ltr' },
];

// Vector Gold Bullion Vault Icon
const GoldBullionVaultIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="vaultGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2A3" />
        <stop offset="40%" stopColor="#FFD700" />
        <stop offset="80%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#996515" />
      </linearGradient>
    </defs>
    <rect x="2.5" y="3.5" width="19" height="17" rx="3" stroke="url(#vaultGoldGrad)" strokeWidth="1.6" fill="rgba(255, 215, 0, 0.08)" />
    <circle cx="12" cy="12" r="4.5" stroke="url(#vaultGoldGrad)" strokeWidth="1.6" fill="rgba(6, 10, 18, 0.85)" />
    <circle cx="12" cy="12" r="1.5" fill="#FFE57F" />
    <line x1="12" y1="7.5" x2="12" y2="9.2" stroke="url(#vaultGoldGrad)" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="12" y1="14.8" x2="12" y2="16.5" stroke="url(#vaultGoldGrad)" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="7.5" y1="12" x2="9.2" y2="12" stroke="url(#vaultGoldGrad)" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="14.8" y1="12" x2="16.5" y2="12" stroke="url(#vaultGoldGrad)" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="4.5" cy="5.5" r="0.8" fill="#FFD700" />
    <circle cx="4.5" cy="18.5" r="0.8" fill="#FFD700" />
  </svg>
);

export const Header: React.FC = () => {
  const {
    navTab,
    setNavTab,
    balances,
    activeCurrency,
    setActiveCurrency,
    openWalletModal,
    openSecurityModal,
    openProvablyFair,
    userProfile,
    vipTierInfo,
    currentLanguage,
    setLanguage,
    isAutoLanguage,
    displayTheme,
    setDisplayTheme,
    isAutoTheme,
    translations: t,
    soundEnabled,
    setSoundEnabled,
    dailyBonusClaimed,
    claimDailyBonus,
    openGame,
    treasuryMetrics,
    isChatOpen,
    toggleChat,
    onlineUsersCount,
    openStealthPinModal,
  } = useCasino();

  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [vipPopoverOpen, setVipPopoverOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const lastClickRef = React.useRef<number>(0);

  const handleLogoClick = () => {
    const now = Date.now();
    const elapsed = now - lastClickRef.current;
    lastClickRef.current = now;

    let nextCount = 1;
    if (elapsed < 1200) {
      nextCount = logoClicks + 1;
    }
    setLogoClicks(nextCount);

    if (nextCount >= 5) {
      setLogoClicks(0);
      openStealthPinModal();
      return;
    }

    setNavTab('arenas');
  };

  const currencies: CryptoCurrency[] = ['USDT', 'BTC', 'ETH', 'SOL'];

  const progressPercent = Math.min(
    100,
    Math.round((userProfile.currentTierProgressWager / userProfile.nextTierRequiredWager) * 100)
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[0.5px] border-amber-400/20 bg-[#06080e]/40 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,0,0,0.65)]">
      {/* Top Security & Real-Time Treasury Micro-Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-1.5 bg-[#070b14]/35 border-b border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          {/* Defense Grade Security Pill with Live Pulsing Ping */}
          <button
            id="header-security-badge"
            onClick={() => {
              triggerHaptic('light');
              openSecurityModal();
            }}
            className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer font-mono active:scale-95 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tracking-wide font-bold">SECURITY: INSTITUTIONAL COLD VAULT</span>
          </button>

          {/* Holographic Shield & Encrypted Lock Provably Fair Pill */}
          <button
            id="header-provably-fair-pill"
            onClick={() => {
              triggerHaptic('light');
              openProvablyFair();
            }}
            className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 transition-all font-mono cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(255,215,0,0.15)]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]" />
            <Lock className="w-3 h-3 text-cyan-300" />
            <span>PROVABLY FAIR SHA-256 PRE-COMMITTED</span>
          </button>

          {/* Soft Pulsing Live System Ping Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold">SYSTEM PING: 18ms</span>
          </div>
        </div>

        {/* Top Right VIP Status, Language, OLED Theme & Audio Synthesizer */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Device Dynamic Auto-Adaptation: Language Selector with Auto-Detection Indicator */}
          <div className="relative">
            <button
              id="header-language-selector-trigger"
              onClick={() => {
                triggerHaptic('light');
                setLangDropdownOpen(!langDropdownOpen);
              }}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-mono text-slate-200 transition-all cursor-pointer active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{LANGUAGES.find((l) => l.code === currentLanguage)?.flag}</span>
              <span className="hidden sm:inline font-bold">
                {LANGUAGES.find((l) => l.code === currentLanguage)?.name}
              </span>
              {isAutoLanguage && (
                <span className="text-[9px] px-1 py-0.1 rounded bg-amber-400/20 text-amber-300 font-mono">
                  AUTO
                </span>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <AnimatePresence>
              {langDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 5 }}
                  className="absolute top-full mt-1.5 right-0 w-48 rounded-xl bg-[#090e1a] border border-amber-400/40 shadow-2xl p-1.5 z-50 text-left"
                >
                  <div className="px-2 py-1 text-[10px] font-mono text-slate-400 border-b border-white/10 mb-1 flex items-center justify-between">
                    <span>SELECT LANGUAGE</span>
                    <span className="text-emerald-400">RTL/LTR Sync</span>
                  </div>
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        triggerHaptic('selection');
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between hover:bg-amber-400/20 cursor-pointer transition ${
                        currentLanguage === lang.code
                          ? 'bg-amber-400/20 text-amber-300 font-bold'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.native}</span>
                      </span>
                      {currentLanguage === lang.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Device Dynamic Display Mode: OLED Pure Black vs Deep Obsidian */}
          <button
            id="header-display-mode-toggle"
            onClick={() => {
              triggerHaptic('light');
              setDisplayTheme(displayTheme === 'oled_black' ? 'deep_obsidian' : 'oled_black');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-all cursor-pointer text-[11px] font-mono active:scale-95 ${
              displayTheme === 'oled_black'
                ? 'bg-black text-amber-300 border-amber-400/60 shadow-[0_0_10px_rgba(255,215,0,0.2)]'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title="Toggle OLED Pure Black / Deep Obsidian Display Mode"
          >
            {displayTheme === 'oled_black' ? (
              <Moon className="w-3 h-3 text-amber-400" />
            ) : (
              <Sun className="w-3 h-3 text-slate-400" />
            )}
            <span className="hidden sm:inline">
              {displayTheme === 'oled_black' ? 'OLED BLACK' : 'OBSIDIAN'}
            </span>
            {isAutoTheme && (
              <span className="text-[9px] px-1 py-0.1 rounded bg-indigo-500/20 text-indigo-300">
                AUTO
              </span>
            )}
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>

          <button
            id="header-top-audio-toggle"
            onClick={() => {
              triggerHaptic('light');
              setSoundEnabled(!soundEnabled);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border transition-all cursor-pointer text-[11px] font-mono active:scale-95 ${
              soundEnabled
                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-400/50 shadow-[0_0_10px_rgba(255,215,0,0.2)]'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
            }`}
            title={soundEnabled ? 'Mute Web Audio Synthesizer' : 'Unmute Web Audio Synthesizer'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span className="font-bold">AUDIO ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span>MUTED</span>
              </>
            )}
          </button>

          <span className="text-slate-700 hidden sm:inline">|</span>
          <div
            id="header-vip-tier-badge"
            className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/40 text-[11px] font-mono text-amber-300 shadow-[0_0_12px_rgba(255,215,0,0.15)]"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_rgba(255,215,0,0.8)] animate-pulse" />
            <span className="font-bold tracking-wider uppercase">VIP: {vipTierInfo.tier}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <span className="text-slate-700">|</span>
          <button
            id="header-claim-daily-top"
            onClick={() => {
              triggerHaptic('success');
              claimDailyBonus();
            }}
            disabled={dailyBonusClaimed}
            className={`flex items-center gap-1.5 font-mono text-xs font-bold transition-all active:scale-95 ${
              dailyBonusClaimed
                ? 'text-slate-500 cursor-not-allowed'
                : 'text-amber-300 hover:text-amber-200 cursor-pointer animate-pulse'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{dailyBonusClaimed ? 'VIP Bonus Claimed' : 'Daily VIP Bonus: +$250 Ready'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Brand & Logo with Stealth Admin Trigger (5 fast clicks on Golden Eagle Crest) */}
        <div
          id="header-brand-logo-trigger"
          onClick={() => {
            triggerHaptic('selection');
            handleLogoClick();
          }}
          className="flex items-center gap-3 cursor-pointer select-none group"
          title="Æ AETHERIUS SOVEREIGN BETTING EMPIRE"
        >
          <div className="relative">
            <GoldenEagleCrest size={44} glow={true} className="group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-luxury font-bold text-lg sm:text-xl tracking-wider text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Aetherius
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 font-mono shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                Sovereign
              </span>
            </div>
            <p className="text-[10px] text-amber-400/70 font-mono tracking-wider hidden sm:block">
              GLOBAL BETTING EMPIRE
            </p>
          </div>
        </div>

        {/* Center Navigation Switcher - Exactly 4 Public Buttons */}
        <div className="hidden xl:flex items-center gap-1.5 p-1 rounded-2xl bg-black/35 backdrop-blur-xl border border-amber-400/20 shadow-inner">
          <button
            id="header-nav-arenas-btn"
            onClick={() => {
              triggerHaptic('selection');
              setNavTab('arenas');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
              navTab === 'arenas'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-[0_0_15px_rgba(255,215,0,0.35)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Casino Arenas</span>
          </button>

          <button
            id="header-nav-vip-empire-btn"
            onClick={() => {
              triggerHaptic('selection');
              setNavTab('vip-empire');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
              navTab === 'vip-empire'
                ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black shadow-[0_0_15px_rgba(255,215,0,0.35)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>VIP Empire</span>
          </button>

          <button
            id="header-nav-affiliates-btn"
            onClick={() => {
              triggerHaptic('selection');
              setNavTab('affiliates');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
              navTab === 'affiliates'
                ? 'bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.35)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Affiliates (25%)</span>
          </button>

          <button
            id="header-nav-investments-btn"
            onClick={() => {
              triggerHaptic('selection');
              setNavTab('investments');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-arabic font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 ${
              navTab === 'investments'
                ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]'
                : 'text-amber-300 hover:text-white hover:bg-amber-400/10'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>الرهانات الاستثمارية</span>
          </button>

          <button
            id="header-nav-royal-crash-btn"
            onClick={() => {
              triggerHaptic('selection');
              openGame('crash');
            }}
            className="px-4 py-2 rounded-xl text-xs font-arabic font-bold transition-all cursor-pointer flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-blue-500/20 hover:from-amber-500/30 hover:to-blue-500/30 border border-amber-400/50 text-amber-300 shadow-sm active:scale-95"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>الرهان الملكي</span>
          </button>
        </div>

        {/* Live VIP Rank Progress Display - Floating Dark Glass Pill Capsule with Embedded Diamond */}
        <div
          className="relative hidden md:flex items-center"
          onMouseEnter={() => setVipPopoverOpen(true)}
          onMouseLeave={() => setVipPopoverOpen(false)}
        >
          <button
            id="header-vip-status-trigger"
            onClick={() => setNavTab('vip-empire')}
            className="px-3.5 py-1.5 rounded-full glass-pill-capsule hover:border-amber-400/70 transition-all cursor-pointer flex items-center gap-3 text-left group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400/20 to-yellow-600/10 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-[0_0_10px_rgba(255,215,0,0.3)]">
              <Diamond className="w-3.5 h-3.5 text-amber-300 fill-amber-300/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 tracking-wide font-luxury">
                  {userProfile.vipTier}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-400/30">
                  Lv.{userProfile.vipLevel}
                </span>
              </div>
              <div className="w-24 sm:w-32 h-1.5 bg-black/60 rounded-full mt-1 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-400 rounded-full transition-all duration-500 shadow-[0_0_8px_#ffd700]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <span className="text-[11px] font-mono text-amber-400/80 ml-1 font-bold">{progressPercent}%</span>
          </button>

          {/* VIP Tooltip / Card */}
          <AnimatePresence>
            {vipPopoverOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.96 }}
                className="absolute top-full mt-2 w-76 p-4.5 rounded-2xl cyber-glass-gold shadow-2xl z-50 text-left border border-amber-400/40 neon-rim-pulse"
              >
                <div className="flex items-center justify-between border-b border-amber-400/20 pb-2.5 mb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-400" />
                    <span className="font-luxury font-bold text-amber-200 text-sm">{vipTierInfo.tier}</span>
                  </div>
                  <span className="text-xs text-amber-300/80 font-mono font-bold">VIP PRIVILEGE</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Instant Cashback:</span>
                    <span className="text-emerald-400 font-bold">{vipTierInfo.cashbackPct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rakeback Privilege:</span>
                    <span className="text-amber-300 font-bold">{vipTierInfo.rakebackPct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Daily Vault Reload:</span>
                    <span className="text-amber-300 font-mono font-bold">${vipTierInfo.dailyBonus} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next Milestone:</span>
                    <span className="text-slate-200 font-mono">Platinum Elite</span>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-amber-400/80 font-mono">Wager ${(userProfile.nextTierRequiredWager - userProfile.currentTierProgressWager).toLocaleString()} to Level Up</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Section: Wallet, Balance, Actions, Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Wallet Balance Widget - Floating Dark Glass Pill Capsule with Gold Bullion Vault & Electric Cyan Lightning */}
          <div className="flex items-center rounded-full frosted-comfort border-[0.5px] border-amber-400/35 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(255,215,0,0.1)]">
            {/* Vault & Currency Selector Dropdown */}
            <div className="relative flex items-center gap-1.5 pl-1.5">
              <div className="p-1 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                <GoldBullionVaultIcon className="w-4 h-4 text-amber-300" />
              </div>

              <button
                id="header-currency-selector-btn"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 text-slate-200 text-xs font-mono font-medium transition cursor-pointer border border-white/10"
              >
                <Diamond className="w-3 h-3 text-cyan-400 fill-cyan-400/40" />
                <span className="text-amber-300 font-bold">{activeCurrency}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <AnimatePresence>
                {currencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute top-full mt-2 left-0 w-44 rounded-2xl cyber-glass-gold shadow-2xl p-1.5 z-50 border border-amber-400/40"
                  >
                    {currencies.map((curr) => (
                      <button
                        key={curr}
                        onClick={() => {
                          setActiveCurrency(curr);
                          setCurrencyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between hover:bg-amber-400/20 cursor-pointer transition ${
                          activeCurrency === curr ? 'text-amber-300 font-bold bg-amber-400/25' : 'text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Diamond className="w-3 h-3 text-amber-400" />
                          <span>{curr}</span>
                        </span>
                        <span className="text-[11px] text-slate-300 font-bold">
                          {curr === 'USDT' ? '$' : ''}{balances[curr].toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Displayed Balance with Live Counter Physics */}
            <div className="px-3.5 py-1 text-right">
              <motion.span
                key={balances[activeCurrency]}
                initial={{ scale: 1.05, filter: 'brightness(1.3)' }}
                animate={{ scale: 1, filter: 'brightness(1)' }}
                transition={{ duration: 0.25 }}
                className="text-xs sm:text-sm font-black font-mono-num tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 drop-shadow-[0_2px_6px_rgba(255,215,0,0.3)] inline-block"
              >
                {balances[activeCurrency].toLocaleString(undefined, {
                  minimumFractionDigits: activeCurrency === 'USDT' ? 2 : 4,
                  maximumFractionDigits: activeCurrency === 'USDT' ? 2 : 4,
                })}
              </motion.span>
              <span className="ml-1 text-[10px] text-amber-400 font-mono font-bold">
                {activeCurrency}
              </span>
            </div>

            {/* 3D Tactile Golden Deposit CTA with Electric Cyan Lightning Bolt */}
            <button
              id="header-deposit-btn"
              onClick={() => {
                triggerHaptic('medium');
                openWalletModal('deposit');
              }}
              className="btn-tactile-gold px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all shadow-[0_0_15px_rgba(255,215,0,0.35)]"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-300 fill-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.95)]" />
              <span>Deposit</span>
            </button>

            {/* Withdraw CTA */}
            <button
              id="header-withdraw-btn"
              onClick={() => {
                triggerHaptic('medium');
                openWalletModal('withdraw');
              }}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs transition-all cursor-pointer ml-1 active:scale-95"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              <span>Withdraw</span>
            </button>
          </div>

          {/* Top Header Mute/Unmute Web Audio Synthesizer Button */}
          <button
            id="header-sound-toggle-btn"
            onClick={() => {
              triggerHaptic('selection');
              setSoundEnabled(!soundEnabled);
            }}
            className={`px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold active:scale-95 ${
              soundEnabled
                ? 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(255,215,0,0.25)]'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-400'
            }`}
            title={soundEnabled ? 'Mute Web Audio Synthesizer (Native Chimes)' : 'Unmute Web Audio Synthesizer'}
            aria-label={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-[11px] text-amber-300 tracking-wider font-bold">AUDIO</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span className="text-[11px] text-slate-400 tracking-wider">MUTED</span>
              </>
            )}
          </button>

          {/* Security Protocol Status Badge */}
          <button
            id="header-security-protocol-badge"
            onClick={openSecurityModal}
            className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition cursor-pointer shadow-sm shadow-emerald-950"
            title="Open Cybersecurity Command Center & Anti-Fraud Hub"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="tracking-wide">SECURITY PROTOCOL</span>
          </button>

          {/* Live Multiplayer Chat Toggle */}
          <button
            id="header-live-chat-toggle-btn"
            onClick={toggleChat}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition cursor-pointer text-xs font-mono font-bold ${
              isChatOpen
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border-white/10'
            }`}
            title="Open AI Live VIP Lounge & Multiplayer Chat"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="hidden xl:inline">LIVE CHAT</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
              {onlineUsersCount}
            </span>
          </button>

          {/* User Profile Avatar */}
          <button
            id="header-user-profile-btn"
            onClick={openSecurityModal}
            className="flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-400/40 transition cursor-pointer"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.username}
              className="w-8 h-8 rounded-lg object-cover border border-amber-400/30"
            />
            <span className="text-xs font-semibold text-slate-200 hidden lg:inline mr-1">
              {userProfile.username}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex lg:hidden items-center justify-center gap-2 px-4 py-2 border-t border-white/5 bg-[#050811]">
        <button
          id="mobile-nav-arenas"
          onClick={() => setNavTab('arenas')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            navTab === 'arenas'
              ? 'bg-amber-400 text-black shadow'
              : 'bg-white/5 text-slate-400'
          }`}
        >
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Casino Arenas</span>
        </button>

        <button
          id="mobile-nav-vip-empire"
          onClick={() => setNavTab('vip-empire')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
            navTab === 'vip-empire'
              ? 'bg-amber-400 text-black shadow'
              : 'bg-white/5 text-slate-400'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>VIP</span>
        </button>

        <button
          id="mobile-nav-affiliates"
          onClick={() => setNavTab('affiliates')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap ${
            navTab === 'affiliates'
              ? 'bg-emerald-400 text-black shadow'
              : 'bg-white/5 text-slate-400'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span>Affiliates (25%)</span>
        </button>

        <button
          id="mobile-nav-royal-crash"
          onClick={() => openGame('crash')}
          className="px-3 py-1.5 rounded-lg text-xs font-arabic font-bold transition flex items-center justify-center gap-1.5 cursor-pointer bg-gradient-to-r from-amber-500/20 to-blue-500/20 text-amber-300 border border-amber-400/40 whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>الرهان الملكي</span>
        </button>
      </div>
    </header>
  );
};
