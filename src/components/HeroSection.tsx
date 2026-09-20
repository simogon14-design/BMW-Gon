import React, { useState } from 'react';
import { useCasino } from '../context/CasinoContext';
import {
  Flame,
  ShieldCheck,
  TrendingUp,
  Zap,
  Play,
  Trophy,
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { MegaJackpotAccumulator } from './MegaJackpotAccumulator';
import { VipProgressBar } from './VipProgressBar';

export const HeroSection: React.FC = () => {
  const {
    openGame,
    openProvablyFair,
    setNavTab,
    translations: t,
  } = useCasino();

  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      title: 'ROYAL ARABIC CRASH • لعبة الرهان الملكية',
      subtitle: 'ROYAL GOLD & SAPPHIRE 3D INTERFACE WITH RTL SUPPORT',
      description: 'Experience the exact mobile crash game: Golden Eagle Crest, Sapphire 3D Bet Button, Moroccan Dirham (د.م.) wallet, and dual-betting control hub.',
      gameId: 'crash' as const,
      accentColor: 'from-amber-400 to-yellow-600',
      badgeText: 'FEATURED ARABIC RTL',
      badgeIcon: Flame,
      statLabel: 'Highest Multiplier',
      statValue: '842.1x (34,500 د.م.)',
      ctaText: 'Launch Royal Crash (العب الآن)',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
    },
    {
      title: 'IMPERIAL CYBER ROULETTE',
      subtitle: 'VIP SALON PRIVÉ HIGH-LIMIT WHEEL',
      description: 'Zero latency physics, maximum table liquidity, and real-time seed pre-commitment. Bet up to $50,000 per spin.',
      gameId: 'roulette' as const,
      accentColor: 'from-rose-500 to-red-700',
      badgeText: 'VIP EXCLUSIVE',
      badgeIcon: Trophy,
      statLabel: '24h Table Volume',
      statValue: '$4.2M Wagered',
      ctaText: 'Join VIP Table',
      bgGlow: 'rgba(239, 68, 68, 0.15)',
    },
    {
      title: 'NEON DYNASTY MEGASPIN',
      subtitle: '5-REEL CRYPTO SLOTS WITH 50,000X CEILING',
      description: 'Sticky quantum wilds, progressive cascading bonus rounds, and auditable random number generator proof.',
      gameId: 'slot' as const,
      accentColor: 'from-emerald-400 to-teal-600',
      badgeText: 'JACKPOT LINKED',
      badgeIcon: Sparkles,
      statLabel: 'Current Super Drop',
      statValue: '$890,240 USDT',
      ctaText: 'Spin Neon Slots',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
    },
  ];

  const current = heroSlides[activeSlide];
  const BadgeIcon = current.badgeIcon;

  return (
    <div className="relative w-full overflow-hidden pt-4 pb-8">
      {/* Background Cyber Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Main Banner Hero Grid */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-400/35 cyber-glass-card card-3d-tactile gold-specular-sheen shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] p-6 sm:p-8 lg:p-10 gold-sweep-reflection neon-rim-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {/* Badge & Category */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-400/20 border border-amber-400/60 text-amber-300 font-mono shadow-[0_0_15px_rgba(255,215,0,0.25)]">
                  <BadgeIcon className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  {current.badgeText}
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-400/30 text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Cryptographically Verified
                </span>
              </div>

              {/* Headings */}
              <div>
                <motion.h1
                  key={current.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-luxury font-black text-2xl sm:text-4xl lg:text-5xl tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                >
                  {current.title}
                </motion.h1>
                <motion.p
                  key={current.subtitle}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm font-mono tracking-widest text-amber-300 font-bold mt-1.5 uppercase drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]"
                >
                  {current.subtitle}
                </motion.p>
              </div>

              {/* Description */}
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                {current.description}
              </p>

              {/* Action Buttons - Multi-layered 3D Tactile Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-play-featured-game-btn"
                  onClick={() => openGame(current.gameId)}
                  className="btn-tactile-gold px-7 py-3 rounded-2xl text-sm font-black flex items-center gap-2.5 cursor-pointer uppercase tracking-wider"
                >
                  <Play className="w-4 h-4 fill-black stroke-black" />
                  <span>{current.ctaText}</span>
                </button>

                <button
                  id="hero-verify-provably-fair-btn"
                  onClick={openProvablyFair}
                  className="btn-tactile-sapphire px-5 py-3 rounded-2xl font-bold text-sm transition cursor-pointer flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-300" />
                  <span>Audit Fairness Code</span>
                </button>

                <button
                  id="hero-investments-btn"
                  onClick={() => setNavTab('investments')}
                  className="px-4 py-3 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/50 text-amber-300 font-arabic active:scale-95 shadow-md"
                >
                  <TrendingUp className="w-4 h-4 text-amber-300" />
                  <span>الرهانات الاستثمارية (SHA-256)</span>
                </button>
              </div>

              {/* Highlights Ticker */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">{current.statLabel}</p>
                  <p className="text-sm sm:text-base font-black text-amber-300 font-mono mt-0.5">{current.statValue}</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Provable Edge</p>
                  <p className="text-sm sm:text-base font-black text-emerald-400 font-mono mt-0.5">99.4% Player RTP</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Settlement Speed</p>
                  <p className="text-sm sm:text-base font-black text-slate-200 font-mono mt-0.5">&lt; 150ms Instant</p>
                </div>
              </div>
            </div>

            {/* Right Dynamic Mega Jackpot Accumulator with Live Ember Particles */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <MegaJackpotAccumulator />
            </div>
          </div>
        </div>

        {/* High-Converting Interactive VIP Progress Bar */}
        <VipProgressBar />

        {/* Live Metrics Trust Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-400/10 text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">24h Payouts</p>
              <p className="text-sm sm:text-base font-bold text-slate-100 font-mono">$18,490,120</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-400/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Provably Fair</p>
              <p className="text-sm sm:text-base font-bold text-slate-100 font-mono">100% SHA-256</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-400/10 text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">Cold Storage</p>
              <p className="text-sm sm:text-base font-bold text-slate-100 font-mono">Multi-Sig HSM</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-400/10 text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">VIP Max Rakeback</p>
              <p className="text-sm sm:text-base font-bold text-amber-300 font-mono">Up to 25.0%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
