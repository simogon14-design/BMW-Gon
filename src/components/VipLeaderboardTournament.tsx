import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Flame, Sparkles, Clock, Users, Award, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useCasino } from '../context/CasinoContext';
import { triggerHaptic } from '../utils/haptics';
import { audioEngine } from '../utils/audioEngine';
import { triggerCelebration } from './GoldParticleCelebration';

interface TournamentPlayer {
  rank: number;
  prevRank: number;
  name: string;
  avatarFlag: string;
  vipTier: string;
  wageredUSD: number;
  bestMultiplier: string;
  estPrize: number;
  isCurrentUser?: boolean;
}

const INITIAL_LEADERBOARD: TournamentPlayer[] = [
  {
    rank: 1,
    prevRank: 1,
    name: 'Sheikh_Crypto',
    avatarFlag: '🇦🇪',
    vipTier: 'Sovereign Emperor',
    wageredUSD: 412850,
    bestMultiplier: '240.50x',
    estPrize: 25000,
  },
  {
    rank: 2,
    prevRank: 3,
    name: 'CyberSultan_77',
    avatarFlag: '🇸🇦',
    vipTier: 'Royal Sultan',
    wageredUSD: 368400,
    bestMultiplier: '188.20x',
    estPrize: 12500,
  },
  {
    rank: 3,
    prevRank: 2,
    name: 'MonacoWhale',
    avatarFlag: '🇲🇨',
    vipTier: 'High Roller Elite',
    wageredUSD: 312100,
    bestMultiplier: '142.80x',
    estPrize: 6500,
  },
  {
    rank: 4,
    prevRank: 4,
    name: 'TokyoBaron_X',
    avatarFlag: '🇯🇵',
    vipTier: 'Diamond Sovereign',
    wageredUSD: 245900,
    bestMultiplier: '94.30x',
    estPrize: 1500,
  },
  {
    rank: 5,
    prevRank: 5,
    name: 'ZurichVault',
    avatarFlag: '🇨🇭',
    vipTier: 'Platinum Archon',
    wageredUSD: 198450,
    bestMultiplier: '76.10x',
    estPrize: 1500,
  },
  {
    rank: 6,
    prevRank: 7,
    name: 'LondonAlpha',
    avatarFlag: '🇬🇧',
    vipTier: 'Gold Monarch',
    wageredUSD: 154200,
    bestMultiplier: '62.40x',
    estPrize: 600,
  },
  {
    rank: 7,
    prevRank: 6,
    name: 'MacauDragon',
    avatarFlag: '🇲🇴',
    vipTier: 'Gold Monarch',
    wageredUSD: 132800,
    bestMultiplier: '51.90x',
    estPrize: 600,
  },
];

export const VipLeaderboardTournament: React.FC = () => {
  const { userProfile, openGame } = useCasino();
  const [hasJoined, setHasJoined] = useState<boolean>(false);
  const [players, setPlayers] = useState<TournamentPlayer[]>(INITIAL_LEADERBOARD);
  const [lastUpdatedPlayer, setLastUpdatedPlayer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 7,
    minutes: 38,
    seconds: 44,
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer countdown
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Real-time dynamic simulation with position swaps every 4.5 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setPlayers((current) => {
        // Clone
        const updated = current.map((p) => ({ ...p, prevRank: p.rank }));

        // Pick a non-first player to boost wager or pick random player
        const targetIdx = Math.floor(Math.random() * updated.length);
        const bump = Math.floor(Math.random() * 8500) + 1200;
        updated[targetIdx].wageredUSD += bump;
        setLastUpdatedPlayer(updated[targetIdx].name);

        // Sort by wageredUSD descending
        updated.sort((a, b) => b.wageredUSD - a.wageredUSD);

        // Reassign ranks and prizes
        const PRIZES = [25000, 12500, 6500, 1500, 1500, 600, 600, 400, 300, 100];
        return updated.map((p, idx) => ({
          ...p,
          rank: idx + 1,
          estPrize: PRIZES[idx] || 100,
        }));
      });

      // Clear highlight after 1.5s
      setTimeout(() => setLastUpdatedPlayer(null), 1500);
    }, 4500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Reflect user's actual wagers if joined
  useEffect(() => {
    if (!hasJoined) return;

    setPlayers((current) => {
      const exists = current.some((p) => p.isCurrentUser);
      const userTotal = Math.max(124500 + userProfile.totalWagered, 124500);

      let updatedList: TournamentPlayer[];
      if (!exists) {
        const userEntry: TournamentPlayer = {
          rank: current.length + 1,
          prevRank: current.length + 1,
          name: 'SovereignCipher (You)',
          avatarFlag: '👑',
          vipTier: userProfile.vipTier,
          wageredUSD: userTotal,
          bestMultiplier: '88.00x',
          estPrize: 600,
          isCurrentUser: true,
        };
        updatedList = [...current, userEntry];
      } else {
        updatedList = current.map((p) =>
          p.isCurrentUser
            ? { ...p, wageredUSD: userTotal, vipTier: userProfile.vipTier }
            : p
        );
      }

      updatedList.sort((a, b) => b.wageredUSD - a.wageredUSD);
      const PRIZES = [25000, 12500, 6500, 1500, 1500, 600, 600, 400, 300, 100];
      return updatedList.map((p, idx) => ({
        ...p,
        rank: idx + 1,
        estPrize: PRIZES[idx] || 100,
      }));
    });
  }, [hasJoined, userProfile.totalWagered, userProfile.vipTier]);

  const handleJoinTournament = () => {
    triggerHaptic('success');
    audioEngine.playBonusClaimSound();
    setHasJoined(true);

    triggerCelebration({
      type: 'bonus',
      amount: 50000,
      currency: 'USDT',
      title: 'ENTERED DAILY $50K TOURNAMENT! 🏆',
    });
  };

  const currentUser = players.find((p) => p.isCurrentUser);

  return (
    <section id="vip-tournament-card" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0e1628] to-[#070b16] border-2 border-amber-500/30 p-5 sm:p-7 shadow-[0_0_40px_rgba(255,215,0,0.12)] overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Ribbon */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold text-[11px] tracking-wider uppercase flex items-center gap-1 shadow-md shadow-amber-500/30">
                <Trophy className="w-3.5 h-3.5 fill-black" />
                <span>Active Tournament</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Leaderboard</span>
              </span>
            </div>

            <h2 className="font-luxury font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-wide uppercase flex items-center gap-2">
              <span>Daily $50,000 VIP Tournament</span>
              <Sparkles className="w-6 h-6 text-amber-400" />
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              High-roller wagers in Quantum Crash, Royal Roulette, and Provably Fair Arenas score points. Top 10 players share $50,000 USDT daily + 24K Sovereign NFT rewards.
            </p>
          </div>

          {/* Countdown & Quick Action Container */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Countdown Box */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#090e1b] border border-amber-500/30 font-mono">
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest leading-none">Closes in</span>
                <span className="text-sm sm:text-base font-black text-amber-300 font-mono-num leading-tight">
                  {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            {!hasJoined ? (
              <button
                id="join-tournament-btn"
                onClick={handleJoinTournament}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-luxury font-black text-xs sm:text-sm tracking-wider uppercase shadow-xl hover:from-amber-300 hover:to-yellow-300 active:scale-95 transition-all duration-150 cursor-pointer flex items-center gap-2 glow-gold-sm"
              >
                <Award className="w-4 h-4 fill-black" />
                <span>Join Tournament (Free VIP Entry)</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You are in! Rank #{currentUser?.rank ?? '-'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tournament Metrics Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 my-2">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-mono uppercase block">Total Prize Pool</span>
            <div className="text-lg sm:text-xl font-black font-mono-num text-amber-400">$50,000 USDT</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-mono uppercase block">1st Place Payout</span>
            <div className="text-lg sm:text-xl font-black font-mono-num text-emerald-400">$25,000 + NFT</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-mono uppercase block">Active Contenders</span>
            <div className="text-lg sm:text-xl font-black font-mono-num text-slate-200 flex items-center gap-1">
              <Users className="w-4 h-4 text-slate-400" />
              <span>1,284 VIPs</span>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[11px] text-slate-400 font-mono uppercase block">Eligible Games</span>
            <div className="text-lg sm:text-xl font-black text-amber-300 truncate">All Arenas & Crash</div>
          </div>
        </div>

        {/* Dynamic Leaderboard Table (Horizontally Swipeable on Mobile) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-2">
            <span>LIVE POSITIONS & WAGER VOLUME</span>
            <span className="text-[11px] text-amber-400/80">Updates every 4.5s</span>
          </div>

          <div className="overflow-x-auto scrollbar-none touch-pan-x rounded-2xl border border-white/10 bg-black/30">
            <table className="w-full text-left text-xs sm:text-sm font-mono border-collapse min-w-[580px]">
              <thead>
                <tr className="bg-white/5 text-slate-400 text-[11px] uppercase tracking-wider border-b border-white/10">
                  <th className="py-3 px-4 w-16">Rank</th>
                  <th className="py-3 px-4">VIP Player</th>
                  <th className="py-3 px-4 text-right">Volume Wagered</th>
                  <th className="py-3 px-4 text-center">Best Multiplier</th>
                  <th className="py-3 px-4 text-right">Estimated Prize</th>
                  <th className="py-3 px-3 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {players.map((player) => {
                  const isFirst = player.rank === 1;
                  const isSecond = player.rank === 2;
                  const isThird = player.rank === 3;
                  const isFlash = lastUpdatedPlayer === player.name;

                  return (
                    <tr
                      key={player.name}
                      className={`transition-colors duration-300 ${
                        player.isCurrentUser
                          ? 'bg-amber-500/15 border-l-4 border-amber-400'
                          : isFlash
                          ? 'bg-yellow-500/20'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {/* Rank Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {isFirst ? (
                            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-black font-extrabold flex items-center justify-center text-xs shadow-md shadow-amber-500/40">
                              👑 1
                            </span>
                          ) : isSecond ? (
                            <span className="w-7 h-7 rounded-xl bg-slate-300 text-slate-900 font-bold flex items-center justify-center text-xs">
                              🥈 2
                            </span>
                          ) : isThird ? (
                            <span className="w-7 h-7 rounded-xl bg-amber-700/80 text-amber-200 font-bold flex items-center justify-center text-xs">
                              🥉 3
                            </span>
                          ) : (
                            <span className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center text-xs font-semibold">
                              #{player.rank}
                            </span>
                          )}

                          {/* Rank Shift Indicator */}
                          {player.prevRank > player.rank && (
                            <span className="text-emerald-400 text-[10px] font-bold">▲</span>
                          )}
                          {player.prevRank < player.rank && (
                            <span className="text-rose-400 text-[10px] font-bold">▼</span>
                          )}
                        </div>
                      </td>

                      {/* Player Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{player.avatarFlag}</span>
                          <div>
                            <span className={`font-semibold ${player.isCurrentUser ? 'text-amber-300 font-bold' : 'text-slate-100'}`}>
                              {player.name}
                            </span>
                            <span className="block text-[10px] text-slate-400">{player.vipTier}</span>
                          </div>
                        </div>
                      </td>

                      {/* Wagered Volume */}
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono-num font-bold text-slate-100">
                          ${player.wageredUSD.toLocaleString('en-US')}
                        </span>
                        <span className="block text-[10px] text-slate-400">USDT</span>
                      </td>

                      {/* Best Multiplier */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-amber-300 text-xs font-mono font-bold">
                          {player.bestMultiplier}
                        </span>
                      </td>

                      {/* Estimated Prize */}
                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-mono-num font-black ${isFirst ? 'text-amber-400 text-base' : 'text-emerald-400'}`}>
                          +${player.estPrize.toLocaleString('en-US')}
                        </span>
                      </td>

                      {/* Play to Beat */}
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => {
                            triggerHaptic('light');
                            openGame('crash');
                          }}
                          title="Wager in Royal Crash to boost points"
                          className="p-1 rounded-lg hover:bg-amber-400/20 text-slate-400 hover:text-amber-300 transition"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Callout & Quick Play */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 px-2 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Points scale 1:1 with wager volume across all high-stakes Arenas.</span>
            </div>

            <button
              onClick={() => {
                triggerHaptic('medium');
                openGame('crash');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold transition active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Wager in Royal Crash to Climb</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
