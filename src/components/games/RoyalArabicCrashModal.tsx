import React, { useState, useEffect, useRef } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { verifyProvablyFairOutcome, generateRandomSeed } from '../../utils/cryptoFair';
import { evaluateDynamicCrashPoint } from '../../utils/dynamicRtpEngine';
import {
  X,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Maximize2,
  Check,
  Flame,
  Diamond
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../../utils/audioEngine';
import { triggerCelebration } from '../GoldParticleCelebration';
import { triggerHaptic } from '../../utils/haptics';

// Royal Golden Eagle SVG Crest with Crown
const RoyalEagleCrest: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF2A3" />
        <stop offset="35%" stopColor="#FFD700" />
        <stop offset="70%" stopColor="#D4AF37" />
        <stop offset="100%" stopColor="#996515" />
      </linearGradient>
      <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    {/* Crown */}
    <path
      d="M36 28 L40 18 L50 24 L60 18 L64 28 L36 28 Z"
      fill="url(#goldGradient)"
      filter="url(#goldGlow)"
    />
    <circle cx="40" cy="17" r="2" fill="#FFE57F" />
    <circle cx="50" cy="22" r="2.5" fill="#FFE57F" />
    <circle cx="60" cy="17" r="2" fill="#FFE57F" />
    
    {/* Eagle Head & Beak */}
    <path
      d="M50 28 C45 28 43 32 44 36 C42 36 38 38 36 41 C40 43 45 42 47 45 C48 48 48 52 50 54 C52 52 52 48 53 45 C55 42 60 43 64 41 C62 38 58 36 56 36 C57 32 55 28 50 28 Z"
      fill="url(#goldGradient)"
    />
    {/* Royal Shield on Chest */}
    <path
      d="M44 48 L50 43 L56 48 L54 62 L50 67 L46 62 Z"
      fill="#080E18"
      stroke="url(#goldGradient)"
      strokeWidth="2"
    />
    <path d="M50 48 L50 62 M46 54 L54 54" stroke="url(#goldGradient)" strokeWidth="1.5" />
    
    {/* Wings */}
    <path
      d="M42 42 C32 36 20 40 12 55 C22 56 32 54 38 58 C26 62 18 70 16 80 C26 76 34 70 40 68 C32 78 28 85 28 92 C38 86 44 78 46 72"
      fill="url(#goldGradient)"
    />
    <path
      d="M58 42 C68 36 80 40 88 55 C78 56 68 54 62 58 C74 62 82 70 84 80 C74 76 66 70 60 68 C68 78 72 85 72 92 C62 86 56 78 54 72"
      fill="url(#goldGradient)"
    />
  </svg>
);

// Ornate Filigree Corner Accent SVG
const FiligreeCorner: React.FC<{ position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({ position }) => {
  const transform = {
    'top-left': 'scale(1, 1)',
    'top-right': 'scale(-1, 1)',
    'bottom-left': 'scale(1, -1)',
    'bottom-right': 'scale(-1, -1)',
  }[position];

  const posClasses = {
    'top-left': 'top-1.5 left-1.5',
    'top-right': 'top-1.5 right-1.5',
    'bottom-left': 'bottom-1.5 left-1.5',
    'bottom-right': 'bottom-1.5 right-1.5',
  }[position];

  return (
    <div className={`absolute ${posClasses} pointer-events-none z-10`} style={{ transform }}>
      <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
        <path
          d="M2 2 L18 2 C12 4 8 8 6 14 C5 18 5 24 2 28 Z"
          fill="url(#goldGradient)"
          opacity="0.8"
        />
        <circle cx="4" cy="4" r="1.5" fill="#FFE57F" />
        <path d="M2 10 C6 10 10 6 10 2" stroke="#FFD700" strokeWidth="1" />
      </svg>
    </div>
  );
};

// Faceted 3D Diamond Gem SVG
const GemDiamond3D: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 36 36" fill="none" className={className}>
    <defs>
      <linearGradient id="diamondFace1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="100%" stopColor="#3B82F6" />
      </linearGradient>
      <linearGradient id="diamondFace2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#1D4ED8" />
      </linearGradient>
      <linearGradient id="diamondGleam" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#BFDBFE" />
      </linearGradient>
    </defs>
    {/* Table & Crown Facets */}
    <polygon points="11,6 25,6 32,13 4,13" fill="url(#diamondGleam)" opacity="0.9" />
    <polygon points="4,13 11,6 18,13" fill="url(#diamondFace1)" />
    <polygon points="25,6 32,13 18,13" fill="url(#diamondFace2)" />
    <polygon points="11,6 25,6 18,13" fill="#DBEAFE" />
    {/* Pavilion Facets */}
    <polygon points="4,13 18,13 18,31" fill="url(#diamondFace1)" />
    <polygon points="32,13 18,13 18,31" fill="url(#diamondFace2)" />
    {/* Outer stroke */}
    <polygon points="11,6 25,6 32,13 18,31 4,13" stroke="#93C5FD" strokeWidth="1" />
  </svg>
);

interface BetSectionState {
  betAmount: number;
  autoPlay: boolean;
  autoCashout: boolean;
  targetMultiplier: string;
  hasActiveBet: boolean;
  cashedOut: boolean;
  cashedOutMultiplier: number | null;
}

export const RoyalArabicCrashModal: React.FC = () => {
  const {
    closeGame,
    openProvablyFair,
    showToast,
    openWalletModal,
    addWager,
    addBetRecord,
    userProfile,
  } = useCasino();

  // Local currency representation for د.م. (Moroccan Dirham)
  const [balanceMAD, setBalanceMAD] = useState<number>(1420.24);
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile-frame' | 'fullscreen'>('mobile-frame');

  // Game Multiplier History Ribbon (as requested)
  const [historyRibbon, setHistoryRibbon] = useState([
    { id: '1', mult: 'x4.12', isHighlight: false },
    { id: '2', mult: 'x1.83', isHighlight: false },
    { id: '3', mult: 'x3.53', isHighlight: true }, // Active/Highlight pill with glowing filigree border
    { id: '4', mult: 'x1.08', isHighlight: false },
    { id: '5', mult: 'x2.45', isHighlight: false },
    { id: '6', mult: 'x7.90', isHighlight: false },
    { id: '7', mult: 'x1.42', isHighlight: false },
  ]);

  // Dual Betting Panels (Stacked Section 1 & Section 2)
  const [panel1, setPanel1] = useState<BetSectionState>({
    betAmount: 3,
    autoPlay: false,
    autoCashout: true,
    targetMultiplier: '2.00',
    hasActiveBet: false,
    cashedOut: false,
    cashedOutMultiplier: null,
  });

  const [panel2, setPanel2] = useState<BetSectionState>({
    betAmount: 50,
    autoPlay: false,
    autoCashout: false,
    targetMultiplier: '1.50',
    hasActiveBet: false,
    cashedOut: false,
    cashedOutMultiplier: null,
  });

  // Central Arena Game Cycle: 'countdown' -> 'flying' -> 'crashed'
  const [gameStatus, setGameStatus] = useState<'countdown' | 'flying' | 'crashed'>('countdown');
  const [countdownSeconds, setCountdownSeconds] = useState<number>(3.4);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.00);
  const [targetCrashPoint, setTargetCrashPoint] = useState<number>(3.53);
  const [roundId, setRoundId] = useState<number>(884210);

  // Provably Fair metadata
  const [serverSeed] = useState(() => generateRandomSeed(16));
  const [clientSeed] = useState('ImperialSovereignClientSeed_01');

  const animRef = useRef<number | null>(null);
  const flightStartTimeRef = useRef<number>(0);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up all timers and animations on component unmount to guarantee zero memory leaks
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  // Sound effects helper using Web Audio API
  const playBeep = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
    if (isMuted) return;
    try {
      audioEngine.playTone(freq, type, duration);
    } catch {
      // Audio context restricted or unavailable
    }
  };

  // Automated game loop cycle
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameStatus === 'countdown') {
      const interval = 100;
      timer = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 0.1) {
            clearInterval(timer);
            startFlight();
            return 0;
          }
          return Math.max(0, +(prev - 0.1).toFixed(1));
        });
      }, interval);
    }

    return () => clearInterval(timer);
  }, [gameStatus]);

  // Launch Flight
  const startFlight = () => {
    setGameStatus('flying');
    setCurrentMultiplier(1.00);
    flightStartTimeRef.current = performance.now();

    // Provably fair calculated outcome with Dynamic AI Retention Profile
    evaluateDynamicCrashPoint(serverSeed, clientSeed, roundId, userProfile.totalWagered).then((res) => {
      const outcome = Math.max(1.15, Math.min(res.outcome, 18.5));
      setTargetCrashPoint(+outcome.toFixed(2));
    });

    playBeep(440, 'triangle', 0.2);
  };

  // Flight multiplier tick
  useEffect(() => {
    if (gameStatus !== 'flying') return;

    const updateFrame = (now: number) => {
      const elapsed = (now - flightStartTimeRef.current) / 1000;
      // Exponential curve: 1.00 + 0.08 * t^1.8
      const calculated = +(1.00 + Math.pow(elapsed * 0.9, 1.7)).toFixed(2);

      if (calculated >= targetCrashPoint) {
        // Round Crashed!
        setCurrentMultiplier(targetCrashPoint);
        handleCrash(targetCrashPoint);
      } else {
        setCurrentMultiplier(calculated);

        // Synthesizer multiplier climb chime
        if (Math.floor(calculated * 10) % 5 === 0 && !isMuted) {
          audioEngine.playMultiplierTick(calculated);
        }

        // Check Auto-cashouts
        checkAutoCashout(panel1, setPanel1, calculated, 1);
        checkAutoCashout(panel2, setPanel2, calculated, 2);

        animRef.current = requestAnimationFrame(updateFrame);
      }
    };

    animRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gameStatus, targetCrashPoint, panel1, panel2]);

  const checkAutoCashout = (
    panel: BetSectionState,
    setPanel: React.Dispatch<React.SetStateAction<BetSectionState>>,
    mult: number,
    panelNum: number
  ) => {
    if (panel.hasActiveBet && !panel.cashedOut && panel.autoCashout) {
      const target = parseFloat(panel.targetMultiplier);
      if (!isNaN(target) && mult >= target) {
        triggerCashout(panel, setPanel, mult, panelNum);
      }
    }
  };

  // Cashout trigger
  const triggerCashout = (
    panel: BetSectionState,
    setPanel: React.Dispatch<React.SetStateAction<BetSectionState>>,
    mult: number,
    panelNum: number
  ) => {
    if (!panel.hasActiveBet || panel.cashedOut) return;

    triggerHaptic('success');
    const payout = +(panel.betAmount * mult).toFixed(2);
    setBalanceMAD((prev) => +(prev + payout).toFixed(2));

    setPanel((prev) => ({
      ...prev,
      cashedOut: true,
      cashedOutMultiplier: mult,
    }));

    if (!isMuted) {
      audioEngine.playWinSound();
    }
    showToast(`🎉 مبروك! تم سحب ${payout} د.م. عند مضاعف x${mult}`);

    // Gold particle celebration
    triggerCelebration({
      id: `crash-win-${Date.now()}`,
      type: payout >= 1000 ? 'jackpot' : 'win',
      amount: payout,
      currency: 'MAD',
      title: `ROYAL CRASH ${mult}x WINNER!`,
    });

    addBetRecord({
      id: `bet-${Date.now()}-${panelNum}`,
      gameTitle: 'Royal Arabic Crash',
      player: 'أنت',
      currency: 'USDT',
      betAmount: panel.betAmount,
      multiplier: mult,
      payout: payout,
      verifiedHash: serverSeed.substring(0, 16),
      timestamp: 'الآن',
    });
  };

  // Crash event
  const handleCrash = (finalMultiplier: number) => {
    setGameStatus('crashed');
    if (!isMuted) {
      audioEngine.playCrashSound();
    }

    // Update history ribbon
    setHistoryRibbon((prev) => [
      { id: Date.now().toString(), mult: `x${finalMultiplier.toFixed(2)}`, isHighlight: finalMultiplier >= 3.0 },
      ...prev.slice(0, 6),
    ]);

    // Check lost bets
    if (panel1.hasActiveBet && !panel1.cashedOut) {
      addBetRecord({
        id: `bet-${Date.now()}-1`,
        gameTitle: 'Royal Arabic Crash',
        player: 'أنت',
        currency: 'USDT',
        betAmount: panel1.betAmount,
        multiplier: finalMultiplier,
        payout: 0,
        verifiedHash: serverSeed.substring(0, 16),
        timestamp: 'الآن',
      });
    }
    if (panel2.hasActiveBet && !panel2.cashedOut) {
      addBetRecord({
        id: `bet-${Date.now()}-2`,
        gameTitle: 'Royal Arabic Crash',
        player: 'أنت',
        currency: 'USDT',
        betAmount: panel2.betAmount,
        multiplier: finalMultiplier,
        payout: 0,
        verifiedHash: serverSeed.substring(0, 16),
        timestamp: 'الآن',
      });
    }

    // Reset for next round after 3 seconds with safe memory cleanup
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setPanel1((prev) => ({
        ...prev,
        hasActiveBet: prev.autoPlay,
        cashedOut: false,
        cashedOutMultiplier: null,
      }));
      setPanel2((prev) => ({
        ...prev,
        hasActiveBet: prev.autoPlay,
        cashedOut: false,
        cashedOutMultiplier: null,
      }));
      setRoundId((prev) => prev + 1);
      setCountdownSeconds(3.4);
      setGameStatus('countdown');
    }, 3000);
  };

  // Place Bet / Cancel Bet Handler
  const handleBetButtonClick = (
    panel: BetSectionState,
    setPanel: React.Dispatch<React.SetStateAction<BetSectionState>>,
    panelNum: number
  ) => {
    if (gameStatus === 'flying') {
      if (panel.hasActiveBet && !panel.cashedOut) {
        // In-flight Cashout!
        triggerCashout(panel, setPanel, currentMultiplier, panelNum);
        return;
      }
    }

    if (panel.hasActiveBet) {
      // Cancel bet before round starts
      triggerHaptic('light');
      setBalanceMAD((prev) => +(prev + panel.betAmount).toFixed(2));
      setPanel((prev) => ({ ...prev, hasActiveBet: false }));
      playBeep(330, 'sine', 0.1);
      showToast('تم إلغاء الرهان واستعادة الرصيد.');
    } else {
      // Place bet
      if (balanceMAD < panel.betAmount) {
        triggerHaptic('error');
        showToast('الرصيد غير كافٍ. يرجى شحن المحفظة.');
        return;
      }

      triggerHaptic('medium');
      setBalanceMAD((prev) => +(prev - panel.betAmount).toFixed(2));
      setPanel((prev) => ({ ...prev, hasActiveBet: true, cashedOut: false, cashedOutMultiplier: null }));
      addWager(panel.betAmount);
      playBeep(580, 'sine', 0.15);
      showToast(`تم تثبيت الرهان: ${panel.betAmount} د.م.`);
    }
  };

  // Adjust Bet amount (+ / -)
  const adjustBet = (
    setPanel: React.Dispatch<React.SetStateAction<BetSectionState>>,
    delta: number
  ) => {
    triggerHaptic('selection');
    setPanel((prev) => {
      if (prev.hasActiveBet) return prev;
      const next = Math.max(1, +(prev.betAmount + delta).toFixed(2));
      return { ...prev, betAmount: next };
    });
    playBeep(700, 'sine', 0.05);
  };

  // Set Chip value
  const applyChip = (
    setPanel: React.Dispatch<React.SetStateAction<BetSectionState>>,
    val: number
  ) => {
    triggerHaptic('selection');
    setPanel((prev) => {
      if (prev.hasActiveBet) return prev;
      return { ...prev, betAmount: val };
    });
    playBeep(800, 'sine', 0.06);
  };

  // 1-Tap Bet Multipliers (1/2, 2X)
  const multiplyBet = (
    setPanel: React.Dispatch<React.SetStateAction<BetSectionState>>,
    factor: number
  ) => {
    triggerHaptic('selection');
    setPanel((prev) => {
      if (prev.hasActiveBet) return prev;
      const next = Math.max(1, Math.min(balanceMAD || 10000, +(prev.betAmount * factor).toFixed(2)));
      return { ...prev, betAmount: next };
    });
    playBeep(750, 'sine', 0.05);
  };

  // 1-Tap Instant Max Bet
  const applyMaxBet = (
    setPanel: React.Dispatch<React.SetStateAction<BetSectionState>>
  ) => {
    triggerHaptic('medium');
    setPanel((prev) => {
      if (prev.hasActiveBet) return prev;
      return { ...prev, betAmount: Math.max(1, balanceMAD) };
    });
    playBeep(850, 'sine', 0.08);
  };

  // 1-Click Auto Cashout Quick Presets
  const applyAutoCashoutPreset = (
    setPanel: React.Dispatch<React.SetStateAction<BetSectionState>>,
    mult: string
  ) => {
    triggerHaptic('light');
    setPanel((prev) => ({
      ...prev,
      autoCashout: true,
      targetMultiplier: mult,
    }));
    playBeep(650, 'sine', 0.04);
  };

  // Quick deposit bonus to test high bets
  const handleQuickDeposit = () => {
    setBalanceMAD((prev) => +(prev + 500).toFixed(2));
    showToast('تم إيداع 500 د.م. في المحفظة الملكية.');
    playBeep(920, 'sine', 0.2);
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-arabic selection:bg-amber-400 selection:text-black"
    >
      {/* Container wrapper: Switchable between mobile frame (9:16) and responsive fullscreen */}
      <div
        className={`relative w-full transition-all duration-300 ${
          viewMode === 'mobile-frame'
            ? 'max-w-[420px] rounded-[44px] border-[6px] border-[#2A2312] shadow-[0_0_50px_rgba(212,175,55,0.35)] overflow-hidden bg-royal-obsidian backdrop-blur-2xl'
            : 'max-w-xl rounded-3xl border border-amber-400/40 shadow-2xl overflow-hidden bg-royal-obsidian backdrop-blur-2xl'
        }`}
        style={{
          boxShadow: '0 0 0 2px rgba(212, 175, 55, 0.4), 0 25px 50px -12px rgba(0, 0, 0, 0.9)',
        }}
      >
        {/* Ornate Filigree Corners on the Mobile Shell */}
        <FiligreeCorner position="top-left" />
        <FiligreeCorner position="top-right" />
        <FiligreeCorner position="bottom-left" />
        <FiligreeCorner position="bottom-right" />

        {/* Outer Mobile Frame Status Bar & Quick Actions */}
        <div className="pt-2 px-5 pb-1 flex items-center justify-between text-[11px] text-amber-300/80 border-b border-amber-400/20 bg-black/30 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold tracking-wider">AETHERIUS ROYAL CRASH</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 text-[9px] font-bold border border-amber-400/30">
              مباشر RTL
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <button
              onClick={() => setViewMode(viewMode === 'mobile-frame' ? 'fullscreen' : 'mobile-frame')}
              title="تبديل وضع العرض (هاتف / كامل)"
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-amber-300 transition"
            >
              {viewMode === 'mobile-frame' ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              title="الصوت"
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-amber-300 transition"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Close Button */}
            <button
              id="close-royal-crash-modal"
              onClick={closeGame}
              className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. HEADER ARCHITECTURE (RTL) */}
        {/* Left: Royal Golden Eagle crest icon with a crown. */}
        {/* Center: Wallet Balance Capsule showing "0.24 د.م." in gold typography inside dark pill with gold border. */}
        {/* Right: Gold Plus icon (+) and 3D cut Diamond gem icon. */}
        {/* ============================================================ */}
        <header className="px-4 py-3 flex items-center justify-between border-b border-amber-500/20 bg-gradient-to-b from-[#0e1626]/40 to-[#080E18]/50 backdrop-blur-xl relative z-20">
          {/* RTL Right Side (Visual Left): Royal Golden Eagle Crest */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-500/20 to-black/60 border border-amber-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.25)]">
              <RoyalEagleCrest className="w-7 h-7" />
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-slate-400 font-mono block leading-none">الإمبراطورية</span>
              <span className="text-xs font-bold text-amber-300 tracking-wide">النسر الذهبي</span>
            </div>
          </div>

          {/* Center: Wallet Balance Capsule showing "0.24 د.م." in gold typography */}
          <div className="relative group">
            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#0a0f1b] via-[#121b2d] to-[#0a0f1b] border-2 border-amber-400/80 shadow-[0_0_15px_rgba(255,215,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.2)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <div className="flex items-baseline gap-1">
                <span className="text-amber-300 font-luxury font-black text-base tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {balanceMAD.toFixed(2)}
                </span>
                <span className="text-amber-400/90 text-xs font-bold font-arabic">د.م.</span>
              </div>
            </div>
          </div>

          {/* RTL Left Side (Visual Right): Gold Plus icon (+) and 3D cut Diamond gem */}
          <div className="flex items-center gap-2">
            {/* Quick Refill (+) */}
            <button
              id="royal-crash-refill-btn"
              onClick={handleQuickDeposit}
              title="شحن الرصيد الفوري"
              className="w-9 h-9 rounded-xl bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 border border-amber-200 text-black flex items-center justify-center font-bold shadow-[0_3px_8px_rgba(0,0,0,0.4),0_0_10px_rgba(255,215,0,0.4)] hover:brightness-110 active:scale-95 transition cursor-pointer"
            >
              <Plus className="w-5 h-5 text-black stroke-[3]" />
            </button>

            {/* 3D Cut Diamond Gem Icon */}
            <div className="w-9 h-9 rounded-xl bg-blue-950/60 border border-blue-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.3)]">
              <GemDiamond3D className="w-6 h-6" />
            </div>
          </div>
        </header>

        {/* ============================================================ */}
        {/* 3. RECENT MULTIPLIERS HISTORY RIBBON */}
        {/* Default pills: "x4.12", "x1.83", "x1.08", "x2.45" with currency subtext "د.م." */}
        {/* Active/Highlight pill: "x3.53" with glowing gold filigree border and sparkling diamond accent */}
        {/* ============================================================ */}
        <div className="py-2 px-3 border-b border-amber-400/20 bg-[#060a12]/90 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {historyRibbon.map((pill) => (
              <div
                key={pill.id}
                className={`relative px-3 py-1 rounded-full transition cursor-pointer flex flex-col items-center justify-center ${
                  pill.isHighlight
                    ? 'bg-gradient-to-b from-amber-400/20 to-black/80 border-2 border-amber-400 shadow-[0_0_15px_rgba(255,215,0,0.5)]'
                    : 'bg-[#0f172a]/70 border border-white/10 hover:border-amber-400/40'
                }`}
              >
                {pill.isHighlight && (
                  <span className="absolute -top-1.5 -right-1 text-amber-300">
                    <Sparkles className="w-3 h-3 animate-spin" />
                  </span>
                )}

                <div className="flex items-center gap-1">
                  <span
                    className={`font-luxury font-black text-xs tracking-wider ${
                      pill.isHighlight
                        ? 'text-amber-300 drop-shadow-[0_0_8px_#ffd700]'
                        : parseFloat(pill.mult.replace('x', '')) >= 2.0
                        ? 'text-emerald-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {pill.mult}
                  </span>
                </div>

                <span className="text-[9px] font-bold text-amber-400/70 font-arabic leading-none -mt-0.5">
                  د.م.
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. CENTRAL CRASH ARENA & TIMER */}
        {/* Large 3D gold numeric display showing live countdown: "3.4 ثانية" (Arabic text) */}
        {/* Subtext underneath: "محفور الجولة التالية" */}
        {/* Progress Indicator: Curved/wavy golden progress bar with glowing gold dust stream */}
        {/* In-flight multiplier graphic with flight ascension */}
        {/* ============================================================ */}
        <div className="relative p-6 sm:p-8 flex flex-col items-center justify-center min-h-[260px] overflow-hidden">
          {/* Subtle radar / cosmic concentric orbits */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-72 h-72 rounded-full border border-amber-400/40" />
            <div className="w-52 h-52 rounded-full border border-amber-400/30" />
            <div className="w-32 h-32 rounded-full border border-amber-400/20" />
          </div>

          {/* Dynamic Floating Golden Dust & Sparkles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 320,
                  y: Math.random() * 240,
                  opacity: 0.2,
                  scale: 0.6,
                }}
                animate={{
                  y: [null, Math.random() * 240 - 30],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.6, 1.2, 0.6],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#ffd700]"
              />
            ))}
          </div>

          {/* Arena Display States */}
          {gameStatus === 'countdown' ? (
            <div className="relative z-10 text-center space-y-3">
              {/* Large 3D Gold Numeric Countdown: "3.4 ثانية" */}
              <div className="relative inline-block">
                <motion.div
                  key={countdownSeconds}
                  initial={{ scale: 0.95, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-luxury font-black text-5xl sm:text-6xl tracking-wider text-gold-gradient drop-shadow-[0_4px_12px_rgba(212,175,55,0.6)]"
                >
                  {countdownSeconds.toFixed(1)}{' '}
                  <span className="text-3xl sm:text-4xl font-arabic font-extrabold text-amber-300">
                    ثانية
                  </span>
                </motion.div>
                {/* 3D Under-glow reflection */}
                <div className="absolute -bottom-2 inset-x-0 h-4 bg-amber-400/20 blur-lg rounded-full pointer-events-none" />
              </div>

              {/* Subtext: "محفور الجولة التالية" */}
              <p className="text-amber-200/90 font-arabic font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>محفور الجولة التالية</span>
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              </p>

              {/* Curved / Wavy Golden Progress Bar flowing with gold dust stream */}
              <div className="w-64 sm:w-72 mx-auto mt-4 space-y-1.5">
                <div className="relative h-3 rounded-full bg-[#0a101d] border border-amber-400/50 p-0.5 overflow-hidden shadow-inner">
                  {/* Flowing golden dust stream inside progress bar */}
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: `${(countdownSeconds / 5.0) * 100}%` }}
                    transition={{ duration: 0.1, ease: 'linear' }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-400 shadow-[0_0_12px_#ffd700]"
                  />
                  {/* Shimmer wave highlight */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse pointer-events-none" />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-amber-400/70">
                  <span>جولة #{roundId}</span>
                  <span>التحقق العادل SHA-256</span>
                </div>
              </div>
            </div>
          ) : gameStatus === 'flying' ? (
            <div className="relative z-10 text-center space-y-2">
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="font-luxury font-black text-6xl sm:text-7xl tracking-wider text-amber-300 drop-shadow-[0_0_25px_rgba(255,215,0,0.8)]"
              >
                {currentMultiplier.toFixed(2)}x
              </motion.div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-arabic text-xs font-bold">
                <Flame className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>الصاروخ الإمبراطوري محلق الآن!</span>
              </div>

              {/* Flight Parabolic Curve Visualization */}
              <div className="w-64 h-12 mx-auto relative mt-2">
                <svg className="w-full h-full" viewBox="0 0 200 40">
                  <path
                    d="M 10 35 Q 100 35 190 5"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="3"
                    strokeDasharray="4 2"
                  />
                  <circle cx="190" cy="5" r="5" fill="#FFD700" className="animate-ping" />
                </svg>
              </div>
            </div>
          ) : (
            /* Crashed state */
            <div className="relative z-10 text-center space-y-2">
              <div className="font-luxury font-black text-6xl text-red-500 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]">
                {currentMultiplier.toFixed(2)}x
              </div>
              <div className="px-4 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-300 font-arabic text-sm font-bold">
                تحطم الصاروخ! الاستعداد للجولة التالية...
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* 5. DUAL BETTING CONTROL PANEL (BOTTOM HUB) */}
        {/* Encased in dark navy container with rounded golden corners and classic filigree */}
        {/* Two stacked identical bet panels for dual-betting */}
        {/* ============================================================ */}
        <div className="p-3 sm:p-4 bg-gradient-to-b from-[#0a111e] to-[#060a12] border-t-2 border-amber-400/40 space-y-3 relative">
          {/* Panel 1: Primary Bet Section */}
          <div className="relative p-3.5 rounded-2xl bg-[#0d1627] border border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-3 overflow-hidden">
            <FiligreeCorner position="top-left" />
            <FiligreeCorner position="top-right" />

            {/* Top Row: Auto Play & Auto Cashout with Target Multiplier Box */}
            <div className="flex items-center justify-between gap-2 text-xs text-slate-300 font-arabic">
              {/* Checkbox: تشغيل تلقائي */}
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={panel1.autoPlay}
                  onChange={(e) => setPanel1({ ...panel1, autoPlay: e.target.checked })}
                  className="w-4 h-4 rounded border-amber-400 text-amber-500 focus:ring-amber-400 accent-amber-500"
                />
                <span className="font-bold">تشغيل تلقائي</span>
              </label>

              {/* Checkbox: السحب التلقائي */}
              <div className="flex items-center gap-1.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={panel1.autoCashout}
                    onChange={(e) => setPanel1({ ...panel1, autoCashout: e.target.checked })}
                    className="w-4 h-4 rounded border-amber-400 text-amber-500 focus:ring-amber-400 accent-amber-500"
                  />
                  <span className="font-bold">السحب التلقائي</span>
                </label>

                {/* Target Multiplier Input Box: "x2.00" */}
                <div className="flex items-center px-2 py-1 rounded-lg bg-[#080E18] border border-amber-400/40">
                  <span className="text-amber-400 font-bold font-mono text-xs">x</span>
                  <input
                    type="number"
                    step="0.1"
                    min="1.01"
                    value={panel1.targetMultiplier}
                    onChange={(e) => setPanel1({ ...panel1, targetMultiplier: e.target.value })}
                    disabled={!panel1.autoCashout || panel1.hasActiveBet}
                    className="w-12 bg-transparent text-center text-white font-mono font-bold text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 1-Tap Quick Auto Cashout Presets */}
            {panel1.autoCashout && (
              <div className="flex items-center justify-end gap-1.5 pt-0.5">
                <span className="text-[10px] text-amber-400/80 font-arabic">أهداف سريعة:</span>
                {['1.50', '2.00', '3.00', '5.00', '10.0'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applyAutoCashoutPreset(setPanel1, preset)}
                    disabled={panel1.hasActiveBet}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition active:scale-95 cursor-pointer border ${
                      panel1.targetMultiplier === preset
                        ? 'bg-amber-400 text-black border-amber-300 font-black shadow-[0_0_8px_rgba(255,215,0,0.5)]'
                        : 'bg-black/40 text-amber-300 border-amber-400/30 hover:bg-amber-400/20'
                    }`}
                  >
                    x{preset}
                  </button>
                ))}
              </div>
            )}

            {/* Middle Row: Bet Adjusters & Sapphire Blue 3D Button */}
            <div className="grid grid-cols-12 gap-2 items-center">
              {/* Bet Amount Adjusters with Metallic Gold Buttons (+ and -) and Indicator "3" */}
              <div className="col-span-6 flex items-center justify-between p-1.5 rounded-xl bg-[#080E18] border border-amber-400/50 shadow-inner">
                {/* Minus Button */}
                <button
                  id="panel1-minus-btn"
                  onClick={() => adjustBet(setPanel1, -1)}
                  disabled={panel1.hasActiveBet}
                  className="w-8 h-8 rounded-full btn-gold-adjuster flex items-center justify-center font-black text-black cursor-pointer disabled:opacity-50"
                >
                  <Minus className="w-4 h-4 stroke-[3]" />
                </button>

                {/* Central Bet Amount Indicator */}
                <div className="text-center">
                  <span className="font-luxury font-black text-lg text-amber-300 leading-none">
                    {panel1.betAmount}
                  </span>
                  <span className="text-[10px] font-arabic font-bold text-amber-400 block -mt-1">
                    د.م.
                  </span>
                </div>

                {/* Plus Button */}
                <button
                  id="panel1-plus-btn"
                  onClick={() => adjustBet(setPanel1, 1)}
                  disabled={panel1.hasActiveBet}
                  className="w-8 h-8 rounded-full btn-gold-adjuster flex items-center justify-center font-black text-black cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Primary Action Button: Large Glowing 3D Sapphire Blue gemstone button */}
              <div className="col-span-6">
                <button
                  id="panel1-primary-bet-btn"
                  onClick={() => handleBetButtonClick(panel1, setPanel1, 1)}
                  className={`w-full py-3 px-2 rounded-2xl font-arabic font-black text-base sm:text-lg text-white shadow-xl cursor-pointer relative overflow-hidden flex items-center justify-center gap-1.5 ${
                    gameStatus === 'flying' && panel1.hasActiveBet && !panel1.cashedOut
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-2 border-emerald-300 shadow-[0_0_20px_#10b981] animate-pulse'
                      : panel1.hasActiveBet
                      ? 'bg-gradient-to-r from-red-600 to-rose-700 border-2 border-red-400'
                      : 'btn-sapphire-3d'
                  }`}
                >
                  {/* Subtle 3D reflective facet sheen */}
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-2xl" />

                  {gameStatus === 'flying' && panel1.hasActiveBet && !panel1.cashedOut ? (
                    <span className="tracking-wide">
                      سحب (+{(panel1.betAmount * currentMultiplier).toFixed(2)} د.م.)
                    </span>
                  ) : panel1.cashedOut ? (
                    <span className="text-emerald-300 flex items-center gap-1">
                      <Check className="w-5 h-5" /> تم السحب (x{panel1.cashedOutMultiplier})
                    </span>
                  ) : panel1.hasActiveBet ? (
                    <span>إلغاء الرهان</span>
                  ) : (
                    <span className="tracking-wider">الرهان</span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Bet Metallic Chips Row + 1-Tap 1/2, 2X, MAX */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              {[
                { val: 1000, type: 'gold', label: '1000' },
                { val: 200, type: 'gold', label: '200' },
                { val: 50, type: 'silver', label: '50' },
                { val: 3, type: 'bronze', label: '3' },
              ].map((chip) => (
                <button
                  key={chip.val}
                  onClick={() => applyChip(setPanel1, chip.val)}
                  disabled={panel1.hasActiveBet}
                  className={`flex-1 py-1.5 rounded-xl flex items-center justify-center font-luxury font-black text-xs cursor-pointer transition active:scale-95 disabled:opacity-50 ${
                    chip.type === 'gold'
                      ? 'chip-gold-3d text-black'
                      : chip.type === 'silver'
                      ? 'chip-silver-3d text-slate-900'
                      : 'chip-bronze-3d text-white'
                  }`}
                >
                  <span>{chip.label}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => multiplyBet(setPanel1, 0.5)}
                disabled={panel1.hasActiveBet}
                className="px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white font-mono font-bold text-xs border border-white/10 active:scale-95 cursor-pointer disabled:opacity-50"
                title="Halve Bet"
              >
                ½
              </button>
              <button
                type="button"
                onClick={() => multiplyBet(setPanel1, 2)}
                disabled={panel1.hasActiveBet}
                className="px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-amber-300 hover:text-amber-200 font-mono font-bold text-xs border border-amber-400/30 active:scale-95 cursor-pointer disabled:opacity-50"
                title="Double Bet"
              >
                2×
              </button>
              <button
                type="button"
                onClick={() => applyMaxBet(setPanel1)}
                disabled={panel1.hasActiveBet}
                className="px-2 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono font-black text-[11px] border border-amber-400/40 active:scale-95 cursor-pointer disabled:opacity-50"
                title="Instant Max Wager"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Panel 2: Stacked Second Identical Bet Section (Dual Betting Capability) */}
          <div className="relative p-3.5 rounded-2xl bg-[#0d1627] border border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-3 overflow-hidden">
            <FiligreeCorner position="top-left" />
            <FiligreeCorner position="top-right" />

            {/* Top Row: Auto Play & Auto Cashout */}
            <div className="flex items-center justify-between gap-2 text-xs text-slate-300 font-arabic">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={panel2.autoPlay}
                  onChange={(e) => setPanel2({ ...panel2, autoPlay: e.target.checked })}
                  className="w-4 h-4 rounded border-amber-400 text-amber-500 focus:ring-amber-400 accent-amber-500"
                />
                <span className="font-bold">تشغيل تلقائي</span>
              </label>

              <div className="flex items-center gap-1.5">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={panel2.autoCashout}
                    onChange={(e) => setPanel2({ ...panel2, autoCashout: e.target.checked })}
                    className="w-4 h-4 rounded border-amber-400 text-amber-500 focus:ring-amber-400 accent-amber-500"
                  />
                  <span className="font-bold">السحب التلقائي</span>
                </label>

                <div className="flex items-center px-2 py-1 rounded-lg bg-[#080E18] border border-amber-400/40">
                  <span className="text-amber-400 font-bold font-mono text-xs">x</span>
                  <input
                    type="number"
                    step="0.1"
                    min="1.01"
                    value={panel2.targetMultiplier}
                    onChange={(e) => setPanel2({ ...panel2, targetMultiplier: e.target.value })}
                    disabled={!panel2.autoCashout || panel2.hasActiveBet}
                    className="w-12 bg-transparent text-center text-white font-mono font-bold text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 1-Tap Quick Auto Cashout Presets for Panel 2 */}
            {panel2.autoCashout && (
              <div className="flex items-center justify-end gap-1.5 pt-0.5">
                <span className="text-[10px] text-amber-400/80 font-arabic">أهداف سريعة:</span>
                {['1.50', '2.00', '3.00', '5.00', '10.0'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applyAutoCashoutPreset(setPanel2, preset)}
                    disabled={panel2.hasActiveBet}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition active:scale-95 cursor-pointer border ${
                      panel2.targetMultiplier === preset
                        ? 'bg-amber-400 text-black border-amber-300 font-black shadow-[0_0_8px_rgba(255,215,0,0.5)]'
                        : 'bg-black/40 text-amber-300 border-amber-400/30 hover:bg-amber-400/20'
                    }`}
                  >
                    x{preset}
                  </button>
                ))}
              </div>
            )}

            {/* Middle Row: Bet Adjusters & Sapphire Blue 3D Button */}
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6 flex items-center justify-between p-1.5 rounded-xl bg-[#080E18] border border-amber-400/50 shadow-inner">
                <button
                  id="panel2-minus-btn"
                  onClick={() => adjustBet(setPanel2, -5)}
                  disabled={panel2.hasActiveBet}
                  className="w-8 h-8 rounded-full btn-gold-adjuster flex items-center justify-center font-black text-black cursor-pointer disabled:opacity-50"
                >
                  <Minus className="w-4 h-4 stroke-[3]" />
                </button>

                <div className="text-center">
                  <span className="font-luxury font-black text-lg text-amber-300 leading-none">
                    {panel2.betAmount}
                  </span>
                  <span className="text-[10px] font-arabic font-bold text-amber-400 block -mt-1">
                    د.م.
                  </span>
                </div>

                <button
                  id="panel2-plus-btn"
                  onClick={() => adjustBet(setPanel2, 5)}
                  disabled={panel2.hasActiveBet}
                  className="w-8 h-8 rounded-full btn-gold-adjuster flex items-center justify-center font-black text-black cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              <div className="col-span-6">
                <button
                  id="panel2-primary-bet-btn"
                  onClick={() => handleBetButtonClick(panel2, setPanel2, 2)}
                  className={`w-full py-3 px-2 rounded-2xl font-arabic font-black text-base sm:text-lg text-white shadow-xl cursor-pointer relative overflow-hidden flex items-center justify-center gap-1.5 ${
                    gameStatus === 'flying' && panel2.hasActiveBet && !panel2.cashedOut
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-2 border-emerald-300 shadow-[0_0_20px_#10b981] animate-pulse'
                      : panel2.hasActiveBet
                      ? 'bg-gradient-to-r from-red-600 to-rose-700 border-2 border-red-400'
                      : 'btn-sapphire-3d'
                  }`}
                >
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-t-2xl" />

                  {gameStatus === 'flying' && panel2.hasActiveBet && !panel2.cashedOut ? (
                    <span className="tracking-wide">
                      سحب (+{(panel2.betAmount * currentMultiplier).toFixed(2)} د.م.)
                    </span>
                  ) : panel2.cashedOut ? (
                    <span className="text-emerald-300 flex items-center gap-1">
                      <Check className="w-5 h-5" /> تم السحب (x{panel2.cashedOutMultiplier})
                    </span>
                  ) : panel2.hasActiveBet ? (
                    <span>إلغاء الرهان</span>
                  ) : (
                    <span className="tracking-wider">الرهان</span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Bet Metallic Chips Row + 1-Tap 1/2, 2X, MAX */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              {[
                { val: 1000, type: 'gold', label: '1000' },
                { val: 200, type: 'gold', label: '200' },
                { val: 50, type: 'silver', label: '50' },
                { val: 3, type: 'bronze', label: '3' },
              ].map((chip) => (
                <button
                  key={chip.val}
                  onClick={() => applyChip(setPanel2, chip.val)}
                  disabled={panel2.hasActiveBet}
                  className={`flex-1 py-1.5 rounded-xl flex items-center justify-center font-luxury font-black text-xs cursor-pointer transition active:scale-95 disabled:opacity-50 ${
                    chip.type === 'gold'
                      ? 'chip-gold-3d text-black'
                      : chip.type === 'silver'
                      ? 'chip-silver-3d text-slate-900'
                      : 'chip-bronze-3d text-white'
                  }`}
                >
                  <span>{chip.label}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => multiplyBet(setPanel2, 0.5)}
                disabled={panel2.hasActiveBet}
                className="px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white font-mono font-bold text-xs border border-white/10 active:scale-95 cursor-pointer disabled:opacity-50"
                title="Halve Bet"
              >
                ½
              </button>
              <button
                type="button"
                onClick={() => multiplyBet(setPanel2, 2)}
                disabled={panel2.hasActiveBet}
                className="px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-amber-300 hover:text-amber-200 font-mono font-bold text-xs border border-amber-400/30 active:scale-95 cursor-pointer disabled:opacity-50"
                title="Double Bet"
              >
                2×
              </button>
              <button
                type="button"
                onClick={() => applyMaxBet(setPanel2)}
                disabled={panel2.hasActiveBet}
                className="px-2 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-mono font-black text-[11px] border border-amber-400/40 active:scale-95 cursor-pointer disabled:opacity-50"
                title="Instant Max Wager"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Bottom Security / Provably Fair Verification Bar */}
          <div className="flex items-center justify-between px-2 pt-1 text-[11px] text-slate-400 font-arabic">
            <button
              onClick={openProvablyFair}
              className="flex items-center gap-1 text-amber-400/80 hover:text-amber-300 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>نظام التحقق العادل المثبت</span>
            </button>
            <span className="font-mono text-slate-500">Hash: {serverSeed.substring(0, 10)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
};
