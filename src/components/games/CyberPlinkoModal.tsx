import React, { useState, useEffect, useRef } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { verifyProvablyFairOutcome, generateRandomSeed } from '../../utils/cryptoFair';
import {
  X,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Zap,
  TrendingUp,
  CircleDot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../../utils/audioEngine';
import { triggerCelebration } from '../GoldParticleCelebration';

type RiskLevel = 'Low' | 'Medium' | 'High';

interface PlinkoBall {
  id: string;
  x: number;
  y: number;
  path: ('L' | 'R')[];
  currentRow: number;
  currentX: number;
  betAmount: number;
  payoutMultiplier: number;
  active: boolean;
}

const MULTIPLIERS: Record<RiskLevel, number[]> = {
  Low: [16, 9, 2, 1.4, 1, 0.7, 0.7, 1, 1.4, 2, 9, 16],
  Medium: [33, 11, 4, 1.5, 0.8, 0.4, 0.4, 0.8, 1.5, 4, 11, 33],
  High: [100, 24, 8, 2, 0.5, 0.2, 0.2, 0.5, 2, 8, 24, 100],
};

const ROWS = 11; // 11 peg tiers leading into 12 buckets

export const CyberPlinkoModal: React.FC = () => {
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

  const [betAmount, setBetAmount] = useState<number>(25);
  const [risk, setRisk] = useState<RiskLevel>('High');
  const [balls, setBalls] = useState<PlinkoBall[]>([]);
  const [highlightBucket, setHighlightBucket] = useState<number | null>(null);
  const [recentMultipliers, setRecentMultipliers] = useState<number[]>([24, 0.5, 2, 8, 0.2, 100]);

  // Provably Fair metadata
  const [serverSeed] = useState(generateRandomSeed(16));
  const [clientSeed] = useState('ClientSeed_Plinko_99');
  const [nonce, setNonce] = useState(412);
  const [auditHash, setAuditHash] = useState('');

  const bucketMultipliers = MULTIPLIERS[risk];

  const handleDropBall = async () => {
    if (balances[activeCurrency] < betAmount) {
      showToast(`Insufficient ${activeCurrency} balance. Wager requires ${betAmount} ${activeCurrency}.`);
      return;
    }

    try {
      audioEngine.playChipSound();

      // Deduct wager
      updateBalance(activeCurrency, -betAmount);
      addWager(betAmount);

      const nextNonce = nonce + 1;
      setNonce(nextNonce);

      // Provably fair path calculation
      const fairResult = await verifyProvablyFairOutcome(serverSeed, clientSeed, nextNonce);
      setAuditHash(fairResult.hmacSha256Result.substring(0, 16));

      // Derive 11 binary choices (L or R) from hash bytes
      const path: ('L' | 'R')[] = [];
      let rightMoves = 0;
      for (let i = 0; i < ROWS; i++) {
        const hexByte = parseInt(fairResult.hmacSha256Result.substring(i * 2, i * 2 + 2), 16);
        const isRight = hexByte % 2 === 1;
        path.push(isRight ? 'R' : 'L');
        if (isRight) rightMoves++;
      }

      // Bucket index is determined by number of right moves (0 to 11)
      const finalBucketIndex = Math.min(bucketMultipliers.length - 1, rightMoves);
      const finalMultiplier = bucketMultipliers[finalBucketIndex];

      const ballId = 'ball_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      const newBall: PlinkoBall = {
        id: ballId,
        x: 50,
        y: 8,
        path,
        currentRow: 0,
        currentX: 0,
        betAmount,
        payoutMultiplier: finalMultiplier,
        active: true,
      };

      setBalls((prev) => [...prev, newBall]);

      // Animate ball step-by-step through pegs
      let step = 0;
      let currentOffset = 0; // relative to center

      const dropInterval = setInterval(() => {
        step++;
        if (step <= ROWS) {
          const dir = path[step - 1];
          currentOffset += dir === 'R' ? 0.5 : -0.5;
          setBalls((prev) =>
            prev.map((b) =>
              b.id === ballId
                ? {
                    ...b,
                    currentRow: step,
                    currentX: currentOffset,
                    y: 8 + step * 7.2,
                    x: 50 + currentOffset * 6.5,
                  }
                : b
            )
          );
        } else {
          clearInterval(dropInterval);
          // Landed in bucket
          setHighlightBucket(finalBucketIndex);
          setTimeout(() => setHighlightBucket(null), 800);

          const payout = Number((betAmount * finalMultiplier).toFixed(2));
          if (payout > 0) {
            updateBalance(activeCurrency, payout);
          }

          setRecentMultipliers((prev) => [finalMultiplier, ...prev.slice(0, 7)]);

          if (finalMultiplier >= 10) {
            audioEngine.playJackpotSound();
            triggerCelebration({
              type: 'jackpot',
              amount: payout,
              currency: activeCurrency,
              title: `PLINKO ${finalMultiplier}x JACKPOT!`,
            });
            showToast(`Plinko Jackpot Hit! ${finalMultiplier}x Multiplier (+$${payout} ${activeCurrency})!`);
          } else if (finalMultiplier >= 2) {
            audioEngine.playWinSound();
            triggerCelebration({
              type: 'win',
              amount: payout,
              currency: activeCurrency,
              title: `PLINKO ${finalMultiplier}x WINNER!`,
            });
            showToast(`Landed in ${finalMultiplier}x bucket (+$${payout} ${activeCurrency})`);
          } else {
            audioEngine.playClickSound();
          }

          addBetRecord({
            id: 'b-' + Date.now().toString().slice(-4),
            player: 'SovereignCipher',
            gameTitle: 'Quantum Gold Plinko',
            betAmount,
            currency: activeCurrency,
            multiplier: finalMultiplier,
            payout,
            timestamp: 'Just now',
            verifiedHash: fairResult.hmacSha256Result.substring(0, 8) + '...',
            isHighRoller: payout >= 1000,
          });

          // Remove completed ball after short delay
          setTimeout(() => {
            setBalls((prev) => prev.filter((b) => b.id !== ballId));
          }, 1200);
        }
      }, 110);
    } catch {
      showToast('Plinko operation recovered safely.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl cyber-glass-card border border-amber-400/40 shadow-2xl overflow-hidden flex flex-col my-auto text-left backdrop-blur-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/35 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
              <CircleDot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-luxury font-black text-lg text-white tracking-wide">
                QUANTUM GOLD PLINKO
              </h3>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <span>RTP: 99.0%</span>
                <span>•</span>
                <span className="text-emerald-400">SHA-256 Peg Physics</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="plinko-audit-hash-btn"
              onClick={openProvablyFair}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-amber-300 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Audit Hash</span>
            </button>
            <button
              id="plinko-close-modal-btn"
              onClick={closeGame}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Visual Pyramid Canvas */}
          <div className="lg:col-span-8 p-6 bg-[#060913] flex flex-col justify-between items-center relative min-h-[460px] border-b lg:border-b-0 lg:border-r border-white/10 overflow-hidden">
            {/* Top Multiplier Hit Stream */}
            <div className="w-full flex items-center justify-center gap-2 mb-4 overflow-x-auto">
              <span className="text-[10px] text-slate-500 font-mono uppercase mr-1">Recent:</span>
              {recentMultipliers.map((mult, idx) => (
                <span
                  key={idx}
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    mult >= 10
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : mult >= 2
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {mult}x
                </span>
              ))}
            </div>

            {/* Plinko Peg Board */}
            <div className="relative w-full max-w-md h-[340px] flex flex-col justify-between items-center my-auto">
              {/* Animated Falling Balls */}
              {balls.map((b) => (
                <div
                  key={b.id}
                  className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 border border-white shadow-[0_0_12px_#ffd700] z-20 transition-all duration-100 ease-linear pointer-events-none"
                  style={{
                    left: `${b.x}%`,
                    top: `${b.y}%`,
                  }}
                />
              ))}

              {/* Pegs Grid */}
              {Array.from({ length: ROWS }).map((_, rowIndex) => {
                const pegsInRow = rowIndex + 3;
                return (
                  <div key={rowIndex} className="flex justify-center items-center gap-5 sm:gap-7">
                    {Array.from({ length: pegsInRow }).map((_, pegIndex) => (
                      <div
                        key={pegIndex}
                        className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-400/80 border border-white/40 shadow-sm"
                      />
                    ))}
                  </div>
                );
              })}

              {/* Multiplier Buckets at Bottom */}
              <div className="w-full grid grid-cols-12 gap-1 pt-4">
                {bucketMultipliers.map((mult, bIdx) => {
                  const isHighlighted = highlightBucket === bIdx;
                  const isHighTier = mult >= 24;
                  const isMidTier = mult >= 2 && mult < 24;

                  return (
                    <div
                      key={bIdx}
                      className={`py-2 rounded text-center font-mono font-bold text-[10px] sm:text-xs transition-all duration-200 border ${
                        isHighlighted
                          ? 'scale-115 bg-amber-400 text-black border-amber-300 shadow-[0_0_16px_#ffd700]'
                          : isHighTier
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : isMidTier
                          ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                          : 'bg-slate-900 text-slate-400 border-white/5'
                      }`}
                    >
                      {mult}x
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Proof */}
            <div className="w-full flex items-center justify-between text-xs text-slate-500 font-mono pt-3 border-t border-white/5">
              <span>Risk: {risk} Matrix</span>
              <span>HMAC-SHA256 Deterministic Paths</span>
            </div>
          </div>

          {/* Right Control Dashboard */}
          <div className="lg:col-span-4 p-6 bg-slate-900/90 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              {/* Risk Selector */}
              <div>
                <span className="text-xs font-mono text-slate-400 block mb-2">
                  Quantum Risk Distribution:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Low', 'Medium', 'High'] as RiskLevel[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRisk(r)}
                      className={`py-2 rounded-xl text-xs font-mono font-bold border transition cursor-pointer ${
                        risk === r
                          ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-sm'
                          : 'bg-black/50 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bet Amount */}
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                  <span>Wager Per Drop ({activeCurrency})</span>
                  <span>Balance: {balances[activeCurrency].toFixed(2)}</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
                    className="w-full pl-3 pr-20 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono font-bold text-base focus:outline-none focus:border-amber-400/50"
                  />
                  <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      onClick={() => setBetAmount((prev) => Math.max(1, Math.floor(prev / 2)))}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-slate-300 cursor-pointer"
                    >
                      ½
                    </button>
                    <button
                      onClick={() => setBetAmount((prev) => prev * 2)}
                      className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-mono font-bold text-slate-300 cursor-pointer"
                    >
                      2×
                    </button>
                    <button
                      onClick={() => setBetAmount(Math.floor(balances[activeCurrency]))}
                      className="px-2 py-1 rounded bg-amber-400/20 hover:bg-amber-400/30 text-[10px] font-mono font-bold text-amber-300 cursor-pointer"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              {/* Multiplier Range Preview */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Minimum Return:</span>
                  <span className="text-slate-300 font-bold">
                    {(betAmount * Math.min(...bucketMultipliers)).toFixed(2)} {activeCurrency}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Maximum Ceiling:</span>
                  <span className="text-amber-300 font-bold">
                    {(betAmount * Math.max(...bucketMultipliers)).toFixed(2)} {activeCurrency} (
                    {Math.max(...bucketMultipliers)}x)
                  </span>
                </div>
              </div>
            </div>

            {/* Drop Orb Button */}
            <div>
              <button
                id="plinko-drop-ball-action-btn"
                onClick={handleDropBall}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-sm uppercase tracking-wider shadow-2xl transition transform active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 fill-black" />
                <span>DROP QUANTUM ORB</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
