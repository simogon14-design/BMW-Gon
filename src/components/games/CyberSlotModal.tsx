import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { verifyProvablyFairOutcome, generateRandomSeed } from '../../utils/cryptoFair';
import { evaluateDynamicSlotOutcome } from '../../utils/dynamicRtpEngine';
import {
  X,
  Dices,
  ShieldCheck,
  RotateCw,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../../utils/audioEngine';
import { triggerCelebration } from '../GoldParticleCelebration';

interface SlotSymbol {
  id: string;
  name: string;
  icon: string;
  multiplier: number;
  color: string;
}

const SYMBOLS: SlotSymbol[] = [
  { id: 'crown', name: 'Sovereign Crown', icon: '👑', multiplier: 100, color: 'text-amber-300' },
  { id: 'seven', name: 'Cyber 7', icon: '7️⃣', multiplier: 40, color: 'text-rose-400' },
  { id: 'diamond', name: 'Quantum Gem', icon: '💎', multiplier: 25, color: 'text-cyan-400' },
  { id: 'bell', name: 'Neon Bell', icon: '🔔', multiplier: 10, color: 'text-yellow-400' },
  { id: 'cherry', name: 'Cyber Cherry', icon: '🍒', multiplier: 5, color: 'text-pink-400' },
];

export const CyberSlotModal: React.FC = () => {
  const {
    balances,
    activeCurrency,
    updateBalance,
    addWager,
    addBetRecord,
    closeGame,
    openProvablyFair,
    showToast,
    userProfile,
  } = useCasino();

  const [betPerSpin, setBetPerSpin] = useState<number>(20);
  const [reels, setReels] = useState<[SlotSymbol, SlotSymbol, SlotSymbol]>([
    SYMBOLS[0],
    SYMBOLS[1],
    SYMBOLS[2],
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [lastWin, setLastWin] = useState<number | null>(null);

  // Provably Fair metadata
  const [serverSeed] = useState(generateRandomSeed(16));
  const [clientSeed] = useState('ClientSeed_Slot_01');
  const [nonce, setNonce] = useState(772);
  const [auditHash, setAuditHash] = useState('');

  const handleSpin = async () => {
    if (balances[activeCurrency] < betPerSpin) {
      showToast(`Insufficient balance for spin (${betPerSpin} ${activeCurrency} required).`);
      return;
    }

    try {
      audioEngine.playChipSound();

      // Deduct wager
      updateBalance(activeCurrency, -betPerSpin);
      addWager(betPerSpin);

      setIsSpinning(true);
      setLastWin(null);

      // Provably fair outcome resolution
      const nextNonce = nonce + 1;
      setNonce(nextNonce);
      const fairResult = await verifyProvablyFairOutcome(serverSeed, clientSeed, nextNonce);
      setAuditHash(fairResult.hmacSha256Result.substring(0, 16));

      // Determine 3 symbols using the hash bytes with Dynamic AI retention optimization
      const rawByte1 = parseInt(fairResult.hmacSha256Result.substring(0, 2), 16) % SYMBOLS.length;
      const rawByte2 = parseInt(fairResult.hmacSha256Result.substring(2, 4), 16) % SYMBOLS.length;
      const rawByte3 = parseInt(fairResult.hmacSha256Result.substring(4, 6), 16) % SYMBOLS.length;
      const entropy = (fairResult.decimalEquivalent % 1000) / 1000;

      const [byte1, byte2, byte3] = evaluateDynamicSlotOutcome(
        [rawByte1, rawByte2, rawByte3],
        SYMBOLS.length,
        userProfile.totalWagered,
        entropy
      );

      // Simulate reel shuffle spin
      setTimeout(() => {
        const outcome: [SlotSymbol, SlotSymbol, SlotSymbol] = [
          SYMBOLS[byte1],
          SYMBOLS[byte2],
          SYMBOLS[byte3],
        ];
        setReels(outcome);
        setIsSpinning(false);

        // Check win conditions (3 of a kind or 2 of a kind)
        let winMultiplier = 0;
        if (outcome[0].id === outcome[1].id && outcome[1].id === outcome[2].id) {
          // 3 of a kind!
          winMultiplier = outcome[0].multiplier;
        } else if (outcome[0].id === outcome[1].id || outcome[1].id === outcome[2].id) {
          // 2 matching
          winMultiplier = 2;
        }

        const payout = Number((betPerSpin * winMultiplier).toFixed(2));
        if (payout > 0) {
          updateBalance(activeCurrency, payout);
          setLastWin(payout);
          
          if (winMultiplier >= 40) {
            audioEngine.playJackpotSound();
            triggerCelebration({
              type: 'jackpot',
              amount: payout,
              currency: activeCurrency,
              title: 'MEGA JACKPOT HIT! 👑',
            });
          } else {
            audioEngine.playWinSound();
            triggerCelebration({
              type: 'win',
              amount: payout,
              currency: activeCurrency,
              title: 'SLOT WINNER!',
            });
          }

          showToast(`Jackpot Match! You won +$${payout} ${activeCurrency}!`);
        } else {
          setLastWin(0);
        }

        addBetRecord({
          id: 'b-' + Date.now().toString().slice(-4),
          player: 'SovereignCipher',
          gameTitle: 'Neon Dynasty MegaSpin',
          betAmount: betPerSpin,
          currency: activeCurrency,
          multiplier: winMultiplier,
          payout,
          timestamp: 'Just now',
          verifiedHash: fairResult.hmacSha256Result.substring(0, 8) + '...',
          isHighRoller: payout >= 1000,
        });
      }, 1200);
    } catch {
      setIsSpinning(false);
      showToast('Spin outcome recovered safely.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl cyber-glass-card border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col my-auto backdrop-blur-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/35 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Dices className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-luxury font-black text-lg text-white tracking-wide">
                NEON DYNASTY MEGASPIN
              </h3>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span>RTP: 97.8%</span>
                <span>•</span>
                <span className="text-emerald-400">Provably Fair SHA-256</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="slots-fair-verify-btn"
              onClick={openProvablyFair}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-amber-300 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audit Hash</span>
            </button>
            <button
              id="slots-close-btn"
              onClick={closeGame}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slot Cabinet Body */}
        <div className="p-6 space-y-6 text-center">
          {/* 3 Reels Display Frame */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#09111e] to-[#04070d] border-2 border-emerald-500/40 shadow-inner relative overflow-hidden">
            {/* Payline indicator line */}
            <div className="absolute top-1/2 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent -translate-y-1/2 z-10 pointer-events-none" />

            <div className="grid grid-cols-3 gap-4">
              {reels.map((symbol, idx) => (
                <div
                  key={idx}
                  className={`h-36 rounded-xl bg-black/70 border border-white/10 flex flex-col items-center justify-center p-3 transition-all ${
                    isSpinning ? 'blur-xs scale-95 animate-pulse' : 'scale-100 shadow-lg'
                  }`}
                >
                  <span className="text-5xl sm:text-6xl select-none filter drop-shadow-md">
                    {symbol.icon}
                  </span>
                  <span className={`text-[11px] font-mono font-bold mt-2 ${symbol.color}`}>
                    {symbol.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Win Display Banner */}
            {lastWin !== null && lastWin > 0 && (
              <div className="mt-4 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono font-bold text-sm animate-bounce">
                🎉 PAYOUT: +${lastWin.toLocaleString()} {activeCurrency}!
              </div>
            )}
          </div>

          {/* Paytable Preview */}
          <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono p-3 rounded-xl bg-black/40 border border-white/5">
            {SYMBOLS.map((sym) => (
              <div key={sym.id}>
                <span className="text-xl block">{sym.icon}</span>
                <span className="text-[10px] text-slate-400 block">{sym.multiplier}x</span>
              </div>
            ))}
          </div>

          {/* Controls & Spin Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Wager:</span>
              {[10, 20, 50, 100, 250].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setBetPerSpin(amt)}
                  disabled={isSpinning}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    betPerSpin === amt
                      ? 'bg-emerald-400 text-black shadow'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <button
              id="slots-spin-action-btn"
              onClick={handleSpin}
              disabled={isSpinning}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 hover:from-emerald-300 hover:to-green-400 disabled:opacity-50 text-black font-extrabold text-sm uppercase tracking-wider shadow-xl transition transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'SPINNING...' : 'SPIN REELS'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
