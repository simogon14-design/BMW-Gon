import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { verifyProvablyFairOutcome, generateRandomSeed } from '../../utils/cryptoFair';
import {
  X,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Trophy,
  Plus,
  Hand,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Card {
  suit: '♠' | '♥' | '♦' | '♣';
  value: string;
  weight: number;
}

const SUITS: ('♠' | '♥' | '♦' | '♣')[] = ['♠', '♥', '♦', '♣'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function getCardWeight(val: string): number {
  if (val === 'A') return 11;
  if (['K', 'Q', 'J', '10'].includes(val)) return 10;
  return parseInt(val, 10);
}

function calculateHandScore(cards: Card[]): number {
  let score = 0;
  let aces = 0;
  for (const card of cards) {
    score += card.weight;
    if (card.value === 'A') aces++;
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

export const CelestialBlackjackModal: React.FC = () => {
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

  const [betAmount, setBetAmount] = useState<number>(100);
  const [gameState, setGameState] = useState<'betting' | 'player_turn' | 'dealer_turn' | 'settled'>('betting');
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [dealerHoleCardHidden, setDealerHoleCardHidden] = useState<boolean>(true);
  const [gameResult, setGameResult] = useState<string | null>(null);

  // Provably Fair metadata
  const [serverSeed] = useState(generateRandomSeed(16));
  const [clientSeed] = useState('ClientSeed_BJ_01');
  const [nonce, setNonce] = useState(128);

  const drawCard = (deckNonce: number): Card => {
    const suit = SUITS[deckNonce % 4];
    const value = VALUES[(deckNonce * 7) % VALUES.length];
    return {
      suit,
      value,
      weight: getCardWeight(value),
    };
  };

  const handleDeal = async () => {
    if (balances[activeCurrency] < betAmount) {
      showToast(`Insufficient balance for ${betAmount} ${activeCurrency}.`);
      return;
    }

    updateBalance(activeCurrency, -betAmount);
    addWager(betAmount);

    const nextNonce = nonce + 1;
    setNonce(nextNonce);

    const c1 = drawCard(nextNonce + 1);
    const d1 = drawCard(nextNonce + 2);
    const c2 = drawCard(nextNonce + 3);
    const d2 = drawCard(nextNonce + 4);

    const initialPlayer = [c1, c2];
    const initialDealer = [d1, d2];

    setPlayerHand(initialPlayer);
    setDealerHand(initialDealer);
    setDealerHoleCardHidden(true);
    setGameResult(null);

    const pScore = calculateHandScore(initialPlayer);

    // Instant Natural Blackjack check
    if (pScore === 21) {
      setDealerHoleCardHidden(false);
      const dScore = calculateHandScore(initialDealer);
      if (dScore === 21) {
        // Push
        updateBalance(activeCurrency, betAmount);
        setGameResult('PUSH (Both Natural 21)');
        setGameState('settled');
      } else {
        // Natural 3:2 Payout
        const winPayout = Number((betAmount * 2.5).toFixed(2));
        updateBalance(activeCurrency, winPayout);
        setGameResult('NATURAL BLACKJACK 3:2!');
        setGameState('settled');
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      setGameState('player_turn');
    }
  };

  const handleHit = () => {
    if (gameState !== 'player_turn') return;
    const nextNonce = nonce + 1;
    setNonce(nextNonce);

    const newCard = drawCard(nextNonce);
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);

    const score = calculateHandScore(newHand);
    if (score > 21) {
      setDealerHoleCardHidden(false);
      setGameResult('PLAYER BUST! Dealer Wins.');
      setGameState('settled');
      showToast('Hand busted over 21.');
    } else if (score === 21) {
      handleStandWithHand(newHand);
    }
  };

  const handleStand = () => {
    handleStandWithHand(playerHand);
  };

  const handleStandWithHand = (hand: Card[]) => {
    setGameState('dealer_turn');
    setDealerHoleCardHidden(false);

    let currentDealerHand = [...dealerHand];
    let dScore = calculateHandScore(currentDealerHand);
    const pScore = calculateHandScore(hand);

    let drawNonce = nonce;
    while (dScore < 17) {
      drawNonce++;
      const nextCard = drawCard(drawNonce);
      currentDealerHand.push(nextCard);
      dScore = calculateHandScore(currentDealerHand);
    }
    setNonce(drawNonce);
    setDealerHand(currentDealerHand);

    // Settle outcomes
    setTimeout(() => {
      let finalPayout = 0;
      let resultText = '';

      if (dScore > 21) {
        resultText = 'DEALER BUSTS! You Win!';
        finalPayout = betAmount * 2;
      } else if (pScore > dScore) {
        resultText = `YOU WIN! (${pScore} vs ${dScore})`;
        finalPayout = betAmount * 2;
      } else if (pScore === dScore) {
        resultText = `PUSH! Equal Hands (${pScore})`;
        finalPayout = betAmount;
      } else {
        resultText = `DEALER WINS (${dScore} vs ${pScore})`;
      }

      setGameResult(resultText);
      setGameState('settled');

      if (finalPayout > 0) {
        updateBalance(activeCurrency, finalPayout);
        if (finalPayout > betAmount) {
          confetti({ particleCount: 70, spread: 65, origin: { y: 0.6 } });
        }
      }

      addBetRecord({
        id: 'b-' + Date.now().toString().slice(-4),
        player: 'SovereignCipher',
        gameTitle: 'High-Stakes Obsidian 21',
        betAmount,
        currency: activeCurrency,
        multiplier: finalPayout > betAmount ? 2.0 : finalPayout === betAmount ? 1.0 : 0,
        payout: finalPayout,
        timestamp: 'Just now',
        verifiedHash: '8a9c01...22ff',
        isHighRoller: betAmount >= 500,
      });
    }, 400);
  };

  const playerScore = calculateHandScore(playerHand);
  const dealerScore = dealerHoleCardHidden
    ? dealerHand[0]?.weight || 0
    : calculateHandScore(dealerHand);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl cyber-glass-card border border-blue-400/40 shadow-2xl overflow-hidden flex flex-col my-auto text-left backdrop-blur-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/35 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-luxury font-black text-lg text-white tracking-wide">
                HIGH-STAKES OBSIDIAN 21 (BLACKJACK)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                European Single Deck • 3:2 Natural Payout • Provably Fair Seed Ledger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openProvablyFair}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-blue-300 cursor-pointer"
            >
              <span>Audit Deck</span>
            </button>
            <button
              onClick={closeGame}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Felt Table Area */}
        <div className="p-6 bg-gradient-to-b from-[#060b18] via-[#091124] to-[#050811] flex flex-col items-center justify-between min-h-[420px] space-y-6">
          {/* Dealer Hand */}
          <div className="w-full flex flex-col items-center space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>DEALER HAND:</span>
              <span className="font-bold text-white font-mono bg-white/10 px-2 py-0.5 rounded">
                {dealerHand.length > 0 ? (dealerHoleCardHidden ? `${dealerHand[0].weight} + ?` : dealerScore) : 0}
              </span>
            </div>

            <div className="flex items-center gap-3 min-h-[90px]">
              {dealerHand.map((card, idx) => {
                const isHidden = idx === 1 && dealerHoleCardHidden;
                return (
                  <div
                    key={idx}
                    className={`w-16 h-24 rounded-xl border flex flex-col justify-between p-2 font-mono font-bold text-sm shadow-xl transition-all ${
                      isHidden
                        ? 'bg-gradient-to-br from-blue-900 to-slate-900 border-blue-400/40 text-blue-300 flex items-center justify-center'
                        : card.suit === '♥' || card.suit === '♦'
                        ? 'bg-white text-rose-600 border-white'
                        : 'bg-white text-slate-900 border-white'
                    }`}
                  >
                    {isHidden ? (
                      <span className="text-xl">Æ</span>
                    ) : (
                      <>
                        <div className="text-left leading-none">{card.value}</div>
                        <div className="text-center text-xl">{card.suit}</div>
                        <div className="text-right leading-none">{card.value}</div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outcome Status Banner */}
          {gameResult && (
            <div className="px-6 py-2 rounded-full cyber-glass-gold border border-amber-400/50 text-amber-300 font-mono font-black text-sm tracking-wider animate-bounce shadow-xl">
              {gameResult}
            </div>
          )}

          {/* Player Hand */}
          <div className="w-full flex flex-col items-center space-y-2">
            <div className="flex items-center gap-3 min-h-[90px]">
              {playerHand.map((card, idx) => (
                <div
                  key={idx}
                  className={`w-16 h-24 rounded-xl border flex flex-col justify-between p-2 font-mono font-bold text-sm shadow-xl transition-all ${
                    card.suit === '♥' || card.suit === '♦'
                      ? 'bg-white text-rose-600 border-white'
                      : 'bg-white text-slate-900 border-white'
                  }`}
                >
                  <div className="text-left leading-none">{card.value}</div>
                  <div className="text-center text-xl">{card.suit}</div>
                  <div className="text-right leading-none">{card.value}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>PLAYER SCORE:</span>
              <span className="font-bold text-amber-400 font-mono bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded">
                {playerScore}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-6 bg-slate-950/80 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-mono text-slate-400">Wager:</span>
            <input
              type="number"
              min="10"
              step="10"
              disabled={gameState === 'player_turn'}
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(1, Number(e.target.value)))}
              className="w-28 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white font-mono font-bold text-sm"
            />
            <span className="text-xs font-mono text-amber-400">{activeCurrency}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {gameState === 'betting' || gameState === 'settled' ? (
              <button
                id="bj-deal-action-btn"
                onClick={handleDeal}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
              >
                DEAL CARDS
              </button>
            ) : (
              <>
                <button
                  id="bj-hit-action-btn"
                  onClick={handleHit}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  HIT CARD
                </button>
                <button
                  id="bj-stand-action-btn"
                  onClick={handleStand}
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  STAND
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
