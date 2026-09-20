import React from 'react';
import { useCasino } from '../context/CasinoContext';
import { Flame, Rocket, Crown, Wallet, Diamond, Zap, TrendingUp } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';
import { audioEngine } from '../utils/audioEngine';

export const MobileBottomNav: React.FC = () => {
  const { navTab, setNavTab, openGame, openWalletModal, balances } = useCasino();

  const handleTabClick = (tab: 'arenas' | 'investments' | 'crash' | 'vip' | 'wallet') => {
    triggerHaptic('selection');
    audioEngine.playClickSound();

    if (tab === 'arenas') {
      setNavTab('arenas');
      const el = document.getElementById('game-hub-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 500, behavior: 'smooth' });
      }
    } else if (tab === 'investments') {
      setNavTab('investments');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'crash') {
      openGame('crash');
    } else if (tab === 'vip') {
      setNavTab('vip-empire');
      const el = document.getElementById('vip-empire-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 1200, behavior: 'smooth' });
      }
    } else if (tab === 'wallet') {
      openWalletModal('deposit');
    }
  };

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40 safe-area-bottom pointer-events-none">
      <nav
        id="mobile-bottom-navbar"
        className="pointer-events-auto rounded-3xl frosted-comfort bg-[#080d1a]/95 backdrop-blur-2xl border-[0.5px] border-amber-400/40 px-2 py-1.5 shadow-[0_15px_35px_rgba(0,0,0,0.95),0_0_25px_rgba(255,215,0,0.18)]"
      >
        <div className="flex items-center justify-around">
          {/* Arenas Tab - Flame & Live Ping */}
          <button
            id="mobile-nav-arenas"
            onClick={() => handleTabClick('arenas')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-90 hover:scale-105 touch-manipulation cursor-pointer ${
              navTab === 'arenas'
                ? 'text-amber-300 font-black bg-amber-400/20 shadow-[0_0_15px_rgba(255,215,0,0.35)] border border-amber-400/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Flame className={`w-5 h-5 ${navTab === 'arenas' ? 'text-amber-300 fill-amber-400/30 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'text-slate-400'}`} />
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="flex flex-col items-center leading-none mt-1">
              <span className="text-[10px] tracking-wider font-mono font-bold">Arenas</span>
              <span className="text-[8px] font-arabic text-amber-400/90 font-bold">الألعاب</span>
            </div>
          </button>

          {/* Investment Betting Tab */}
          <button
            id="mobile-nav-investments"
            onClick={() => handleTabClick('investments')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-90 hover:scale-105 touch-manipulation cursor-pointer ${
              navTab === 'investments'
                ? 'text-amber-300 font-black bg-amber-400/20 shadow-[0_0_15px_rgba(255,215,0,0.35)] border border-amber-400/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className={`w-5 h-5 ${navTab === 'investments' ? 'text-amber-300 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : 'text-slate-400'}`} />
            <div className="flex flex-col items-center leading-none mt-1">
              <span className="text-[10px] tracking-wider font-mono font-bold">Invest</span>
              <span className="text-[8px] font-arabic text-amber-400/90 font-bold">الاستثمار</span>
            </div>
          </button>

          {/* Crash Game Quick Trigger (Featured High-Roller Button) */}
          <button
            id="mobile-nav-crash"
            onClick={() => handleTabClick('crash')}
            className="relative flex flex-col items-center justify-center py-1 px-3.5 rounded-2xl transition-all duration-200 active:scale-90 hover:scale-105 touch-manipulation cursor-pointer group"
          >
            <div className="absolute -top-5 p-2.5 rounded-full btn-tactile-gold shadow-[0_0_25px_rgba(255,215,0,0.7)] border-2 border-[#080d1a] group-active:scale-90 transition-transform">
              <Rocket className="w-5 h-5 fill-black stroke-black animate-pulse" />
            </div>
            <div className="flex flex-col items-center leading-none mt-5">
              <span className="text-[10px] font-black text-amber-300 tracking-wider uppercase font-mono drop-shadow-[0_0_8px_#ffd700]">
                Crash
              </span>
              <span className="text-[8px] font-arabic text-amber-300 font-bold drop-shadow-[0_0_4px_#ffd700]">
                الصاروخ
              </span>
            </div>
          </button>

          {/* VIP Tab - Imperial Crown Shimmer */}
          <button
            id="mobile-nav-vip"
            onClick={() => handleTabClick('vip')}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-90 hover:scale-105 touch-manipulation cursor-pointer ${
              navTab === 'vip-empire'
                ? 'text-amber-300 font-black bg-amber-400/20 shadow-[0_0_15px_rgba(255,215,0,0.35)] border border-amber-400/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className={`w-5 h-5 ${navTab === 'vip-empire' ? 'text-amber-300 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)] animate-pulse' : 'text-slate-400'}`} />
            <div className="flex flex-col items-center leading-none mt-1">
              <span className="text-[10px] tracking-wider font-mono font-bold">VIP</span>
              <span className="text-[8px] font-arabic text-amber-400/90 font-bold">كبار الشخصيات</span>
            </div>
          </button>

          {/* Cashier Tab - 0-Latency Instant Zap & Diamond */}
          <button
            id="mobile-nav-wallet"
            onClick={() => handleTabClick('wallet')}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 active:scale-90 hover:scale-105 touch-manipulation text-slate-400 hover:text-emerald-300 cursor-pointer"
          >
            <div className="relative">
              <div className="flex items-center gap-0.5">
                <Wallet className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_8px_rgba(0,230,118,0.6)]" />
                <Zap className="w-2.5 h-2.5 text-amber-300 fill-amber-300 absolute -top-1 -right-2 animate-bounce" />
              </div>
              <Diamond className="w-2 h-2 text-cyan-400 absolute -bottom-1 -left-1" />
            </div>
            <div className="flex flex-col items-center leading-none mt-1">
              <span className="text-[10px] tracking-wider text-emerald-400 font-mono font-bold">Cashier</span>
              <span className="text-[8px] font-arabic text-emerald-300 font-bold">الخزينة</span>
            </div>
          </button>
        </div>
      </nav>
    </div>
  );
};
