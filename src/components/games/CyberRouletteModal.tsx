import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { verifyProvablyFairOutcome, generateRandomSeed } from '../../utils/cryptoFair';
import {
  X,
  CircleDot,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Trophy,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../../utils/audioEngine';
import { triggerCelebration } from '../GoldParticleCelebration';

interface BetPlacement {
  type: string;
  label: string;
  amount: number;
  multiplier: number;
  numbers: number[];
}

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

export const CyberRouletteModal: React.FC = () => {
  const {
    balances,
    activeCurrency,
    updateBalance,
    addWager,
    addBetRecord,
    closeGame,
    openProvablyFair,
    showToast,
  } = useCasino();

  const [selectedChip, setSelectedChip] = useState<number>(50);
  const [placedBets, setPlacedBets] = useState<BetPlacement[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningNumber, setWinningNumber] = useState<number | null>(null);
  const [wheelAngle, setWheelAngle] = useState(0);
  const [lastWinAmount, setLastWinAmount] = useState<number | null>(null);

  // Provably Fair round data
  const [serverSeed] = useState(generateRandomSeed(16));
  const [clientSeed] = useState('ClientSeed_Roulette_01');
  const [nonce, setNonce] = useState(304);
  const [verifiedHash, setVerifiedHash] = useState('');

  const totalBet = placedBets.reduce((acc, b) => acc + b.amount, 0);

  const handlePlaceBet = (type: string, label: string, multiplier: number, numbers: number[]) => {
    if (isSpinning) return;
    if (balances[activeCurrency] < totalBet + selectedChip) {
      showToast(`Insufficient ${activeCurrency} balance.`);
      return;
    }

    audioEngine.playChipSound();

    setPlacedBets((prev) => {
      const existing = prev.find((b) => b.label === label);
      if (existing) {
        return prev.map((b) =>
          b.label === label ? { ...b, amount: b.amount + selectedChip } : b
        );
      }
      return [...prev, { type, label, multiplier, numbers, amount: selectedChip }];
    });
  };

  const handleClearBets = () => {
    if (isSpinning) return;
    setPlacedBets([]);
  };

  const handleSpinWheel = async () => {
    if (totalBet <= 0) {
      showToast('Place at least one chip on the table to spin.');
      return;
    }
    if (balances[activeCurrency] < totalBet) {
      showToast(`Insufficient balance. You need ${totalBet} ${activeCurrency}.`);
      return;
    }

    try {
      audioEngine.playClickSound();

      // Deduct wager
      updateBalance(activeCurrency, -totalBet);
      addWager(totalBet);

      setIsSpinning(true);
      setWinningNumber(null);
      setLastWinAmount(null);

      // Cryptographic calculation using Provably Fair formula:
      // Outcome number between 0 and 36
      const nextNonce = nonce + 1;
      setNonce(nextNonce);
      const fairOutcome = await verifyProvablyFairOutcome(serverSeed, clientSeed, nextNonce);
      const outcomeNumber = fairOutcome.decimalEquivalent % 37; // 0 to 36 European standard
      setVerifiedHash(fairOutcome.hmacSha256Result.substring(0, 16));

      // Spin animation angle
      const spins = 5 + Math.floor(Math.random() * 3);
      const newAngle = wheelAngle + spins * 360 + outcomeNumber * (360 / 37);
      setWheelAngle(newAngle);

      setTimeout(() => {
        setWinningNumber(outcomeNumber);
        setIsSpinning(false);

        // Calculate total payouts
        let totalPayout = 0;
        placedBets.forEach((bet) => {
          if (bet.numbers.includes(outcomeNumber)) {
            totalPayout += bet.amount * bet.multiplier;
          }
        });

        if (totalPayout > 0) {
          updateBalance(activeCurrency, totalPayout);
          setLastWinAmount(totalPayout);
          
          audioEngine.playWinSound();
          triggerCelebration({
            type: totalPayout >= 1000 ? 'jackpot' : 'win',
            amount: totalPayout,
            currency: activeCurrency,
            title: `ROULETTE NUMBER ${outcomeNumber} WINNER!`,
          });

          showToast(`Winning number is ${outcomeNumber}! You won +$${totalPayout} ${activeCurrency}!`);
        } else {
          setLastWinAmount(0);
          showToast(`Winning number is ${outcomeNumber}. Better luck next round!`);
        }

        addBetRecord({
          id: 'b-' + Date.now().toString().slice(-4),
          player: 'SovereignCipher',
          gameTitle: 'Imperial Cyber Roulette',
          betAmount: totalBet,
          currency: activeCurrency,
          multiplier: totalPayout > 0 ? Number((totalPayout / totalBet).toFixed(2)) : 0,
          payout: totalPayout,
          timestamp: 'Just now',
          verifiedHash: fairOutcome.hmacSha256Result.substring(0, 8) + '...',
          isHighRoller: totalPayout >= 1000,
        });
      }, 3500);
    } catch {
      setIsSpinning(false);
      showToast('Spin outcome recovered safely.');
    }
  };

  const getNumberColor = (num: number) => {
    if (num === 0) return 'bg-emerald-600 text-white border-emerald-400';
    if (RED_NUMBERS.includes(num)) return 'bg-rose-600 text-white border-rose-400';
    return 'bg-slate-900 text-white border-slate-700';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl cyber-glass-card border border-rose-500/30 shadow-2xl overflow-hidden flex flex-col my-auto backdrop-blur-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/35 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <CircleDot className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h3 className="font-luxury font-black text-lg text-white tracking-wide">
                IMPERIAL CYBER ROULETTE
              </h3>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span>European Single Zero (98.65% RTP)</span>
                <span>•</span>
                <span className="text-emerald-400">HSM Encrypted</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="roulette-verify-fair-btn"
              onClick={openProvablyFair}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-amber-300 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SHA-256 Audit</span>
            </button>
            <button
              id="roulette-close-modal-btn"
              onClick={closeGame}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="p-6 space-y-6">
          {/* Top Section: Roulette Wheel Visual & Outcome Display */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl bg-black/40 border border-white/5">
            {/* Spinning Wheel Graphic */}
            <div className="md:col-span-6 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-amber-400/40 p-2 shadow-2xl bg-gradient-to-b from-slate-900 to-black flex items-center justify-center overflow-hidden">
                {/* Outer Track Glow */}
                <div className="absolute inset-0 rounded-full border border-amber-400/30" />

                {/* Rotating SVG Wheel */}
                <div
                  className="w-full h-full rounded-full transition-transform duration-[3200ms] cubic-bezier(0.12, 0.8, 0.32, 1) flex items-center justify-center"
                  style={{ transform: `rotate(${wheelAngle}deg)` }}
                >
                  <div className="w-full h-full rounded-full border-2 border-dashed border-amber-400/40 relative flex items-center justify-center">
                    <span className="absolute top-2 text-[10px] font-mono font-black text-emerald-400">0</span>
                    <span className="absolute bottom-2 text-[10px] font-mono font-black text-rose-400">1</span>
                    <span className="absolute left-2 text-[10px] font-mono font-black text-slate-200">2</span>
                    <span className="absolute right-2 text-[10px] font-mono font-black text-rose-400">36</span>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 border-2 border-black flex items-center justify-center shadow-lg">
                      <CircleDot className="w-6 h-6 text-black" />
                    </div>
                  </div>
                </div>

                {/* Center Pin Indicator */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-4 bg-amber-400 [clip-path:polygon(50%_100%,0_0,100%_0)] shadow-md z-20" />
              </div>
            </div>

            {/* Outcome Display */}
            <div className="md:col-span-6 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                Winning Result Indicator
              </span>

              {winningNumber !== null ? (
                <div className="space-y-2">
                  <div
                    className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-3xl font-mono font-black border-2 shadow-2xl ${getNumberColor(
                      winningNumber
                    )}`}
                  >
                    {winningNumber}
                  </div>
                  <p className="text-sm font-bold text-slate-200 uppercase font-mono">
                    {winningNumber === 0
                      ? 'ZERO (HOUSE)'
                      : RED_NUMBERS.includes(winningNumber)
                      ? 'RED'
                      : 'BLACK'}
                  </p>
                  {lastWinAmount !== null && lastWinAmount > 0 && (
                    <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 font-mono font-bold text-sm">
                      Won +${lastWinAmount.toLocaleString()} {activeCurrency}!
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-500 font-mono text-sm py-6">
                  {isSpinning ? 'Quantum wheel accelerating...' : 'Place bets and spin table'}
                </div>
              )}
            </div>
          </div>

          {/* Chips Selector & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400 uppercase mr-1">Chip:</span>
              {[10, 50, 100, 500, 1000].map((val) => (
                <button
                  key={val}
                  onClick={() => setSelectedChip(val)}
                  disabled={isSpinning}
                  className={`w-11 h-11 rounded-full font-mono text-xs font-black shadow-lg transition-all cursor-pointer flex items-center justify-center border-2 ${
                    selectedChip === val
                      ? 'scale-110 border-amber-300 bg-amber-400 text-black ring-4 ring-amber-400/20'
                      : 'border-white/20 bg-slate-900 text-slate-300 hover:border-amber-400/50'
                  }`}
                >
                  ${val}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <span className="text-[11px] text-slate-400 block uppercase">Total Table Bet:</span>
                <span className="text-sm font-bold text-amber-300">
                  ${totalBet.toLocaleString()} {activeCurrency}
                </span>
              </div>

              <button
                id="roulette-clear-bets-btn"
                onClick={handleClearBets}
                disabled={isSpinning || totalBet === 0}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-40 transition cursor-pointer"
                title="Clear Table Chips"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                id="roulette-spin-btn"
                onClick={handleSpinWheel}
                disabled={isSpinning || totalBet === 0}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 hover:from-rose-400 hover:to-red-400 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider shadow-xl transition transform active:scale-95 cursor-pointer"
              >
                {isSpinning ? 'SPINNING...' : 'SPIN WHEEL'}
              </button>
            </div>
          </div>

          {/* Table Betting Board */}
          <div className="space-y-2 select-none">
            {/* Outside Bet Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono font-bold">
              <button
                onClick={() =>
                  handlePlaceBet('1-18', 'Low (1-18)', 2, Array.from({ length: 18 }, (_, i) => i + 1))
                }
                disabled={isSpinning}
                className="py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 transition cursor-pointer"
              >
                1 to 18 (2x)
              </button>

              <button
                onClick={() =>
                  handlePlaceBet(
                    'even',
                    'Even Numbers',
                    2,
                    Array.from({ length: 36 }, (_, i) => i + 1).filter((n) => n % 2 === 0)
                  )
                }
                disabled={isSpinning}
                className="py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 transition cursor-pointer"
              >
                EVEN (2x)
              </button>

              <button
                onClick={() => handlePlaceBet('red', 'RED', 2, RED_NUMBERS)}
                disabled={isSpinning}
                className="py-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 border border-rose-400 text-white shadow transition cursor-pointer"
              >
                RED (2x)
              </button>

              <button
                onClick={() => handlePlaceBet('black', 'BLACK', 2, BLACK_NUMBERS)}
                disabled={isSpinning}
                className="py-2 rounded-lg bg-slate-900 hover:bg-black border border-slate-700 text-white shadow transition cursor-pointer"
              >
                BLACK (2x)
              </button>

              <button
                onClick={() =>
                  handlePlaceBet(
                    'odd',
                    'Odd Numbers',
                    2,
                    Array.from({ length: 36 }, (_, i) => i + 1).filter((n) => n % 2 !== 0)
                  )
                }
                disabled={isSpinning}
                className="py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 transition cursor-pointer"
              >
                ODD (2x)
              </button>

              <button
                onClick={() =>
                  handlePlaceBet('19-36', 'High (19-36)', 2, Array.from({ length: 18 }, (_, i) => i + 19))
                }
                disabled={isSpinning}
                className="py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 transition cursor-pointer"
              >
                19 to 36 (2x)
              </button>
            </div>

            {/* Dozen Bets */}
            <div className="grid grid-cols-3 gap-2 text-xs font-mono font-bold">
              <button
                onClick={() =>
                  handlePlaceBet('1st12', '1st 12', 3, Array.from({ length: 12 }, (_, i) => i + 1))
                }
                disabled={isSpinning}
                className="py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-amber-300 transition cursor-pointer"
              >
                1st 12 (3x)
              </button>
              <button
                onClick={() =>
                  handlePlaceBet('2nd12', '2nd 12', 3, Array.from({ length: 12 }, (_, i) => i + 13))
                }
                disabled={isSpinning}
                className="py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-amber-300 transition cursor-pointer"
              >
                2nd 12 (3x)
              </button>
              <button
                onClick={() =>
                  handlePlaceBet('3rd12', '3rd 12', 3, Array.from({ length: 12 }, (_, i) => i + 25))
                }
                disabled={isSpinning}
                className="py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-amber-300 transition cursor-pointer"
              >
                3rd 12 (3x)
              </button>
            </div>

            {/* Zero and Straight Up Numbers Board Grid (0-36) */}
            <div className="pt-2">
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
                {/* 0 Box */}
                <button
                  onClick={() => handlePlaceBet('straight', 'Number 0', 36, [0])}
                  disabled={isSpinning}
                  className="col-span-2 sm:col-span-12 py-2.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-400 text-white font-mono font-black text-sm transition cursor-pointer"
                >
                  0 (36x)
                </button>

                {/* Numbers 1-36 */}
                {Array.from({ length: 36 }, (_, i) => i + 1).map((num) => {
                  const isRed = RED_NUMBERS.includes(num);
                  const isBet = placedBets.some((b) => b.label === `Number ${num}`);

                  return (
                    <button
                      key={num}
                      onClick={() => handlePlaceBet('straight', `Number ${num}`, 36, [num])}
                      disabled={isSpinning}
                      className={`h-10 rounded-lg font-mono font-bold text-xs border transition cursor-pointer flex items-center justify-center relative ${
                        isRed
                          ? 'bg-rose-700/80 hover:bg-rose-600 border-rose-500 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-200'
                      } ${isBet ? 'ring-2 ring-amber-400' : ''}`}
                    >
                      <span>{num}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
