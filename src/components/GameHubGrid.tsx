import React, { useState } from 'react';
import { useCasino } from '../context/CasinoContext';
import { GameCategory, GameItem } from '../types';
import {
  Rocket,
  Dices,
  CircleDot,
  Crown,
  Sparkles,
  Search,
  Filter,
  Play,
  Users,
  ShieldCheck,
  TrendingUp,
  Zap,
  Flame,
  Lock,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';
import { audioEngine } from '../utils/audioEngine';

export const GameHubGrid: React.FC = () => {
  const { games, openGame, openProvablyFair } = useCasino();
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [volatilityFilter, setVolatilityFilter] = useState<string>('all');

  const categories = [
    { id: 'all' as GameCategory, label: 'All Arenas', icon: Sparkles, badge: 'LIVE' },
    { id: 'crash' as GameCategory, label: 'Quantum Crash', icon: Rocket, badge: '99.4% RTP' },
    { id: 'slots' as GameCategory, label: 'Cyber Slots', icon: Dices, badge: 'x10,000' },
    { id: 'roulette' as GameCategory, label: 'VIP Roulette', icon: CircleDot, badge: 'MAX' },
    { id: 'live' as GameCategory, label: 'Live VIP Tables', icon: Crown, badge: 'INSTANT' },
  ];

  const filteredGames = games.filter((game) => {
    const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVolatility =
      volatilityFilter === 'all' || game.volatility.toLowerCase() === volatilityFilter.toLowerCase();
    return matchesCategory && matchesSearch && matchesVolatility;
  });

  const handleLaunchGame = (game: GameItem) => {
    triggerHaptic('medium');
    audioEngine.playClickSound();
    openGame(game.gameType);
  };

  return (
    <section id="game-hub-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Section Header with High-Impact Badges */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-400/15 border border-amber-400/40 text-amber-300 shadow-[0_0_12px_rgba(255,215,0,0.2)]">
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-bounce" />
              <span>0-LATENCY PROVABLE ARENAS</span>
            </span>

            <button
              onClick={openProvablyFair}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/25 transition cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>SHA-256 VERIFIED</span>
            </button>
          </div>

          <h2 className="font-luxury font-black text-2xl sm:text-3xl text-white tracking-wide uppercase mt-2">
            Game Hub & Sovereign Arenas
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-0.5 max-w-2xl font-medium">
            Every round generated with pre-committed blockchain seed hashes. 1-tap instant launch with zero delay.
          </p>
        </div>

        {/* Search Bar & Volatility */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="game-search-input"
              type="text"
              placeholder="Search games or providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/50 w-48 sm:w-60 font-mono"
            />
          </div>

          <select
            id="game-volatility-select"
            value={volatilityFilter}
            onChange={(e) => setVolatilityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-amber-400/50 font-mono cursor-pointer"
          >
            <option value="all">All Volatilities</option>
            <option value="low">Low Volatility (Frequent Wins)</option>
            <option value="medium">Medium Volatility (Balanced)</option>
            <option value="high">High Volatility (Big Multipliers)</option>
            <option value="extreme">Extreme Volatility (Jackpots)</option>
          </select>
        </div>
      </div>

      {/* Category Pills Tabs with Micro-interactions & Status Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              id={`game-cat-${cat.id}`}
              onClick={() => {
                triggerHaptic('selection');
                setSelectedCategory(cat.id);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 cursor-pointer active:scale-95 hover:scale-105 touch-manipulation ${
                isSelected
                  ? 'btn-tactile-gold shadow-[0_0_18px_rgba(255,215,0,0.45)] scale-102'
                  : 'glass-pill-capsule text-slate-300 hover:text-amber-300 hover:border-amber-400/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-black fill-black/20' : 'text-amber-400'}`} />
              <span>{cat.label}</span>
              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-black/20 text-black font-black'
                    : 'bg-white/10 text-amber-300/80 font-bold'
                }`}
              >
                {cat.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Helper Quick Banner for New Players */}
      <div className="p-3 rounded-2xl bg-black/40 border border-amber-400/20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Quick Tip: Hover on any game card for <strong>Instant 1-Tap Launch</strong> or view verified RTP & volatility stats.</span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> 100% Bankroll Liquid</span>
          <span className="text-amber-400 font-bold">• 1-Click Wagers</span>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="flex sm:hidden items-center justify-between text-[11px] text-slate-400 font-mono px-1">
        <span>ARENA CAROUSEL</span>
        <span className="text-amber-400">👉 Swipe cards horizontally</span>
      </div>

      {/* Game Cards Grid / Mobile Touch Swipe Carousel */}
      <div className="flex sm:grid overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none scrollbar-none touch-pan-x gap-4 sm:gap-6 pb-3 sm:pb-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGames.map((game) => {
          const isHighVolatility = game.volatility.toLowerCase().includes('high') || game.volatility.toLowerCase().includes('extreme');

          return (
            <motion.div
              key={game.id}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.18 }}
              className="group relative rounded-3xl overflow-hidden cyber-glass-card card-3d-tactile gold-specular-sheen border border-amber-400/25 hover:border-amber-400/70 shadow-[0_15px_35px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_45px_rgba(255,215,0,0.2)] flex flex-col justify-between transition-all min-w-[85vw] sm:min-w-0 snap-center shrink-0 sm:shrink gold-sweep-reflection"
            >
              {/* Illuminated Cyber Corner Brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400 pointer-events-none shadow-[0_0_6px_#ffd700] z-20" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400 pointer-events-none shadow-[0_0_6px_#ffd700] z-20" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400 pointer-events-none shadow-[0_0_6px_#ffd700] z-20" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400 pointer-events-none shadow-[0_0_6px_#ffd700] z-20" />

              {/* Card Banner / Graphic Accent */}
              <div className={`relative h-44 w-full bg-gradient-to-br ${game.gradient} p-5 flex flex-col justify-between overflow-hidden border-b border-white/10`}>
                {/* Visual Ambient Grid Lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {game.badge && (
                      <span
                        className={`text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full tracking-wider border shadow-lg flex items-center gap-1 ${
                          game.badge === 'HOT'
                            ? 'bg-amber-400/25 text-amber-300 border-amber-400/60 shadow-[0_0_10px_rgba(255,215,0,0.3)]'
                            : game.badge === 'JACKPOT'
                            ? 'bg-emerald-500/25 text-emerald-300 border-emerald-500/60 shadow-[0_0_10px_rgba(0,230,118,0.3)] animate-pulse'
                            : game.badge === 'VIP EXCLUSIVE'
                            ? 'bg-purple-500/25 text-purple-300 border-purple-500/60 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                            : 'bg-blue-500/25 text-blue-300 border-blue-500/60 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                        }`}
                      >
                        {isHighVolatility && <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />}
                        {game.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] text-slate-200 font-mono border border-white/10 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <Users className="w-3 h-3 text-emerald-400" />
                    <span>{game.activePlayers.toLocaleString()} Live</span>
                  </div>
                </div>

                {/* Center Title in Hero Banner */}
                <div className="relative z-10">
                  <div className="flex items-center gap-1.5">
                    {game.gameType === 'crash' ? (
                      <Rocket className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    ) : game.category === 'slots' ? (
                      <Dices className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span className="text-[11px] font-mono text-amber-300 uppercase tracking-widest block font-bold drop-shadow-[0_0_4px_#ffd700]">
                      {game.provider}
                    </span>
                  </div>
                  <h3 className="font-luxury font-black text-xl text-white group-hover:text-amber-200 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {game.title}
                  </h3>
                </div>

                {/* Hover Quick-Play Overlay */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 z-20 gap-2">
                  <button
                    id={`quick-play-${game.id}`}
                    onClick={() => handleLaunchGame(game)}
                    className="btn-tactile-gold px-6 py-3 rounded-2xl text-xs tracking-wider uppercase flex items-center gap-2 cursor-pointer font-black hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Play className="w-4 h-4 fill-black stroke-black" />
                    <span>1-Tap Instant Launch</span>
                  </button>
                  <span className="text-[10px] font-mono text-amber-300/90 font-bold">Provably Fair Ready</span>
                </div>
              </div>

              {/* Card Meta & Stats Body */}
              <div className="p-5 space-y-4 text-left flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-[#04060a]">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                  {game.description}
                </p>

                {/* Stats Row with Glowing Indicators */}
                <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-2xl bg-black/60 border border-amber-400/20 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">RTP</span>
                    <span className="text-xs font-black text-emerald-400">{game.rtp}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Volatility</span>
                    <span className="text-xs font-black text-amber-300">{game.volatility}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Max Win</span>
                    <span className="text-xs font-black text-slate-100">{game.maxMultiplier}</span>
                  </div>
                </div>

                {/* Enter Table Action Button */}
                <button
                  id={`card-play-btn-${game.id}`}
                  onClick={() => handleLaunchGame(game)}
                  className="w-full py-3 rounded-2xl bg-white/5 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/50 text-slate-100 hover:text-amber-300 font-extrabold text-xs transition-all duration-150 active:scale-95 hover:scale-102 cursor-pointer flex items-center justify-center gap-2 group-hover:border-amber-400/40 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                  <span>Enter Table / Play Game</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
