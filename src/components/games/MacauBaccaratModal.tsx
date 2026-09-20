import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { verifyProvablyFairOutcome, generateRandomSeed } from '../../utils/cryptoFair';
import {
  X,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Trophy,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BaccaratCard {
  suit: '♠' | '♥' | '♦' | '♣';
  value: string;
  points: number;
}

const SUITS: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function getBaccaratPoints(val: string): number {
  if (['10', 'J', 'Q', 'K'].includes(val)) return 0;
  if (val === 'A') return 1;
  return parseInt(val, 10);
}

export const MacauBaccaratModal: React.FC = () => {
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

  const [betSide, setBetSide] = useState<'player' | 'banker' | 'tie'>('player');
  const [chipAmount, setChipAmount] = useState<number>(100);
  const [isDealing, setIsDealing] = useState<boolean>(false);
  const [playerCards, setPlayerCards] = useState<BaccaratCard[]>([]);
  const [bankerCards, setBankerCards] = useState<BaccaratCard[]>([]);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const [serverSeed] = useState(generateRandomSeed(16));
  const [clientSeed] = useState('ClientSeed_Bac_88');
  const [nonce, setNonce] = useState(88);

  const drawCard = (n: number): BaccaratCard => {
    const suit = SUITS[n % 4];
    const value = VALUES[(n * 5) % VALUES.length];
    return {
      suit,
      value,
      points: getBaccaratPoints(value),
    };
  };

  const calculateHandPoints = (cards: BaccaratCard[]): number => {
    const total = cards.reduce((acc, c) => acc + c.points, 0);
    return total % 10;
  };

  const handleDeal = async () => {
    if (balances[activeCurrency] < chipAmount) {
      showToast(`Insufficient balance for ${chipAmount} ${activeCurrency}.`);
      return;
    }

    updateBalance(activeCurrency, -chipAmount);
    addWager(chipAmount);

    setIsDealing(true);
    setGameResult(null);

    const nextNonce = nonce + 1;
    setNonce(nextNonce);

    const p1 = drawCard(nextNonce + 1);
    const b1 = drawCard(nextNonce + 2);
    const p2 = drawCard(nextNonce + 3);
    const b2 = drawCard(nextNonce + 4);

    const initialPlayer = [p1, p2];
    const initialBanker = [b1, b2];

    setPlayerCards(initialPlayer);
    setBankerCards(initialBanker);

    setTimeout(() => {
      const pScore = calculateHandPoints(initialPlayer);
      const bScore = calculateHandPoints(initialBanker);

      let winner: 'player' | 'banker' | 'tie' = 'tie';
      if (pScore > bScore) winner = 'player';
      else if (bScore > pScore) winner = 'banker';

      let winPayout = 0;
      let text = '';

      if (winner === betSide) {
        if (winner === 'tie') {
          winPayout = chipAmount * 9; // 8:1 payout
          text = `TIE WINNER! (${pScore} vs ${bScore}) Payout 8:1!`;
        } else {
          winPayout = chipAmount * 2; // 1:1 payout
          text = `${winner.toUpperCase()} WINS! (${pScore} vs ${bScore})`;
        }
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } else if (winner === 'tie' && betSide !== 'tie') {
        winPayout = chipAmount; // Push on tie
        text = `TIE GAME (${pScore} - ${bScore}) - Bet Refunded`;
      } else {
        text = `${winner.toUpperCase()} WINS (${pScore} vs ${bScore})`;
      }

      setGameResult(text);
      if (winPayout > 0) {
        updateBalance(activeCurrency, winPayout);
      }
      setIsDealing(false);

      addBetRecord({
        id: 'b-' + Date.now().toString().slice(-4),
        player: 'SovereignCipher',
        gameTitle: 'No-Commission Macau Baccarat',
        betAmount: chipAmount,
        currency: activeCurrency,
        multiplier: winPayout > chipAmount ? (winPayout / chipAmount) : 0,
        payout: winPayout,
        timestamp: 'Just now',
        verifiedHash: '6f42ee...9012',
        isHighRoller: chipAmount >= 500,
      });
    }, 800);
  };

  const playerScore = calculateHandPoints(playerCards);
  const bankerScore = calculateHandPoints(bankerCards);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl cyber-glass-card border border-purple-400/40 shadow-2xl overflow-hidden flex flex-col my-auto text-left backdrop-blur-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/35 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-luxury font-black text-lg text-white tracking-wide">
                NO-COMMISSION MACAU BACCARAT VIP
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Punto Banco • Zero 5% Banker Fee • Real Squeeze Logic
              </p>
            </div>
          </div>

          <button
            onClick={closeGame}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Felt Table */}
        <div className="p-6 bg-gradient-to-b from-[#0e0720] via-[#150a30] to-[#080314] flex flex-col items-center justify-between min-h-[400px] space-y-6">
          <div className="w-full grid grid-cols-2 gap-6 max-w-2xl">
            {/* Player Side */}
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 flex flex-col items-center space-y-3">
              <span className="font-luxury font-bold text-blue-400 text-sm tracking-wider">
                PLAYER ({playerCards.length > 0 ? playerScore : 0})
              </span>
              <div className="flex gap-2 min-h-[80px]">
                {playerCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="w-14 h-20 rounded-lg bg-white text-slate-900 border flex flex-col justify-between p-1.5 font-mono font-bold text-xs shadow-lg"
                  >
                    <div className="text-left">{card.value}</div>
                    <div className="text-center text-base">{card.suit}</div>
                    <div className="text-right">{card.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Banker Side */}
            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/20 flex flex-col items-center space-y-3">
              <span className="font-luxury font-bold text-rose-400 text-sm tracking-wider">
                BANKER ({bankerCards.length > 0 ? bankerScore : 0})
              </span>
              <div className="flex gap-2 min-h-[80px]">
                {bankerCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="w-14 h-20 rounded-lg bg-white text-slate-900 border flex flex-col justify-between p-1.5 font-mono font-bold text-xs shadow-lg"
                  >
                    <div className="text-left">{card.value}</div>
                    <div className="text-center text-base">{card.suit}</div>
                    <div className="text-right">{card.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {gameResult && (
            <div className="px-6 py-2 rounded-full cyber-glass-gold border border-amber-400/50 text-amber-300 font-mono font-black text-sm tracking-wider animate-bounce shadow-xl">
              {gameResult}
            </div>
          )}

          {/* Bet Areas */}
          <div className="w-full max-w-2xl grid grid-cols-3 gap-3">
            <button
              onClick={() => setBetSide('player')}
              className={`p-4 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                betSide === 'player'
                  ? 'bg-blue-600/30 border-blue-400 text-blue-200 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <span className="font-luxury font-bold text-sm">PLAYER</span>
              <span className="text-[11px] font-mono text-blue-300">1:1 Even Money</span>
            </button>

            <button
              onClick={() => setBetSide('tie')}
              className={`p-4 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                betSide === 'tie'
                  ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <span className="font-luxury font-bold text-sm">TIE</span>
              <span className="text-[11px] font-mono text-emerald-300">8:1 High Payout</span>
            </button>

            <button
              onClick={() => setBetSide('banker')}
              className={`p-4 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                betSide === 'banker'
                  ? 'bg-rose-600/30 border-rose-400 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.5)]'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <span className="font-luxury font-bold text-sm">BANKER</span>
              <span className="text-[11px] font-mono text-rose-300">1:1 No Commission</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-slate-950/80 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">Chip:</span>
            <div className="flex gap-2">
              {[25, 50, 100, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setChipAmount(amt)}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition cursor-pointer ${
                    chipAmount === amt
                      ? 'bg-amber-400 text-black border-amber-300'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleDeal}
            disabled={isDealing}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
          >
            {isDealing ? 'SQUEEZING...' : 'DEAL HAND'}
          </button>
        </div>
      </div>
    </div>
  );
};
