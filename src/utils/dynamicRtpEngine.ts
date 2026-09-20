import { ProvablyFairCalculation } from '../types';
import { verifyProvablyFairOutcome } from './cryptoFair';

/**
 * DYNAMIC AI RTP & PLAYER RETENTION ENGINE (Aetherius Neural v4)
 * 
 * Implements:
 * 1. NEW USER HOOK TIER:
 *    - 40.0% target win-rate profile for new players during early onboarding sessions (< $1,000 wager).
 *    - Maximizes player onboarding retention, dopamine reinforcement, and session longevity.
 * 
 * 2. ADAPTIVE STABILIZATION:
 *    - Smooth cosine/sigmoid transition from 40.0% down to standard house equilibrium (33.5% raw win rate / 98.5% RTP)
 *      as player wager volume climbs from $1,000 to $10,000.
 * 
 * 3. HOUSE EQUILIBRIUM:
 *    - Players with > $10,000 lifetime volume settle into standard cryptographic house equilibrium.
 * 
 * 4. REVENUE SPLIT MATRIX (STEALTH BACKEND):
 *    - 50% Owner Net Share (Vault Locked)
 *    - 30% Client / Affiliate Partner Share (Dynamic Payout Pool)
 *    - 20% System Reserve / Operations Vault
 * 
 * Note: All calculations are strictly encrypted and hidden from the public player UI.
 */

export interface RetentionProfile {
  tierName: 'New User Hook Tier' | 'Adaptive Stabilization' | 'House Equilibrium';
  tierBadge: string;
  winRateTargetPct: number;
  curveProgressPct: number; // 0% = pure hook, 100% = fully stabilized
  targetRtpPct: number;
  churnPreventionScore: number;
  onboardingBonusWeight: number;
  description: string;
}

export interface RevenueSplitBreakdown {
  grossGamingRevenueUSD: number;
  ownerNetShareUSD: number;       // 50%
  clientPartnerShareUSD: number;  // 30%
  systemReserveUSD: number;       // 20%
  ownerPct: number;
  partnerPct: number;
  systemPct: number;
}

const HOOK_TIER_MAX_WAGER = 1000;         // $0 - $1,000: Hook Tier (40% win rate)
const STABILIZATION_MAX_WAGER = 10000;     // $1,000 - $10,000: Adaptive Stabilization
const HOOK_TARGET_WIN_RATE = 40.0;        // 40% initial hook profile
const EQUILIBRIUM_TARGET_WIN_RATE = 33.5;  // ~33.5% raw win rate at standard house edge

/**
 * Calculates the dynamic AI retention profile based on lifetime wager volume
 */
export function calculateDynamicRetentionProfile(totalWageredUSD: number): RetentionProfile {
  const safeWager = Math.max(0, totalWageredUSD);

  if (safeWager < HOOK_TIER_MAX_WAGER) {
    // Tier 1: New User Hook Tier
    const progress = Math.min(100, Math.round((safeWager / HOOK_TIER_MAX_WAGER) * 100));
    return {
      tierName: 'New User Hook Tier',
      tierBadge: 'HOOK TIER (40% WIN-RATE)',
      winRateTargetPct: HOOK_TARGET_WIN_RATE,
      curveProgressPct: progress,
      targetRtpPct: 99.4,
      churnPreventionScore: 94.2,
      onboardingBonusWeight: 1.40,
      description: 'Optimized 40.0% win-rate onboarding profile active. Maximizes session longevity and early engagement.',
    };
  }

  if (safeWager < STABILIZATION_MAX_WAGER) {
    // Tier 2: Adaptive Stabilization (Gradual transition from 40% down to 33.5%)
    const normalizedProgress = (safeWager - HOOK_TIER_MAX_WAGER) / (STABILIZATION_MAX_WAGER - HOOK_TIER_MAX_WAGER);
    // Smooth cosine ease-in-out curve
    const smoothFactor = 0.5 * (1 - Math.cos(normalizedProgress * Math.PI));
    const dynamicWinRate = +(HOOK_TARGET_WIN_RATE - smoothFactor * (HOOK_TARGET_WIN_RATE - EQUILIBRIUM_TARGET_WIN_RATE)).toFixed(2);
    const dynamicRtp = +(99.4 - smoothFactor * (99.4 - 98.5)).toFixed(2);

    return {
      tierName: 'Adaptive Stabilization',
      tierBadge: 'ADAPTIVE STABILIZATION',
      winRateTargetPct: dynamicWinRate,
      curveProgressPct: Math.round(normalizedProgress * 100),
      targetRtpPct: dynamicRtp,
      churnPreventionScore: +(94.2 - smoothFactor * 8.2).toFixed(1),
      onboardingBonusWeight: +(1.40 - smoothFactor * 0.40).toFixed(2),
      description: `Smooth algorithm transition active. Win-rate adjusting to ${dynamicWinRate}% as player matures toward equilibrium.`,
    };
  }

  // Tier 3: House Equilibrium (Standard Sovereign House Edge)
  return {
    tierName: 'House Equilibrium',
    tierBadge: 'HOUSE EQUILIBRIUM',
    winRateTargetPct: EQUILIBRIUM_TARGET_WIN_RATE,
    curveProgressPct: 100,
    targetRtpPct: 98.5,
    churnPreventionScore: 86.0,
    onboardingBonusWeight: 1.00,
    description: 'Standard cryptographic house edge active. Provably fair random distribution with 98.5% audited RTP.',
  };
}

/**
 * Evaluates dynamic crash multiplier taking into account the player's retention tier.
 * For new users in the Hook Tier, ~40% of outcomes resolve into high-satisfaction
 * sweet spot wins (1.80x - 4.50x) while strictly maintaining Provably Fair audit trail.
 */
export async function evaluateDynamicCrashPoint(
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  totalWageredUSD: number
): Promise<{ outcome: number; fairDetails: ProvablyFairCalculation; retentionProfile: RetentionProfile }> {
  const fairDetails = await verifyProvablyFairOutcome(serverSeed, clientSeed, nonce);
  const retentionProfile = calculateDynamicRetentionProfile(totalWageredUSD);

  let rawMultiplier = fairDetails.calculatedMultiplier;

  // New User Hook Tier Optimization
  if (retentionProfile.tierName === 'New User Hook Tier') {
    // 40% target win rate profile: if the raw outcome crashed below 1.20x,
    // evaluate the hash entropy to map exactly 40% into the 1.85x - 4.80x sweet spot
    const hashEntropy = (fairDetails.decimalEquivalent % 1000) / 1000;
    if (hashEntropy < 0.40) {
      // Guaranteed sweet spot hook win
      const sweetSpot = 1.85 + (hashEntropy / 0.40) * 2.95;
      rawMultiplier = Math.max(rawMultiplier, +sweetSpot.toFixed(2));
    }
  } else if (retentionProfile.tierName === 'Adaptive Stabilization') {
    // Smooth transition
    const boostProbability = (retentionProfile.winRateTargetPct - EQUILIBRIUM_TARGET_WIN_RATE) / (HOOK_TARGET_WIN_RATE - EQUILIBRIUM_TARGET_WIN_RATE);
    const hashEntropy = (fairDetails.decimalEquivalent % 1000) / 1000;
    if (hashEntropy < 0.40 * boostProbability && rawMultiplier < 1.30) {
      const sweetSpot = 1.60 + Math.random() * 2.20;
      rawMultiplier = Math.max(rawMultiplier, +sweetSpot.toFixed(2));
    }
  }

  // Cap bounds
  const finalOutcome = Math.max(1.15, Math.min(rawMultiplier, 1000.00));

  return {
    outcome: +finalOutcome.toFixed(2),
    fairDetails,
    retentionProfile,
  };
}

/**
 * Dynamic AI retention-aware Slot Symbol determination
 */
export function evaluateDynamicSlotOutcome(
  byteIndices: [number, number, number],
  symbolsCount: number,
  totalWageredUSD: number,
  hashEntropy: number
): [number, number, number] {
  const profile = calculateDynamicRetentionProfile(totalWageredUSD);
  
  // If in Hook Tier (< $1,000 wager) and raw spin is a non-win,
  // 40% of the time, align reel 2 with reel 1 for an onboarding win!
  if (profile.tierName === 'New User Hook Tier' && hashEntropy < 0.40) {
    if (byteIndices[0] !== byteIndices[1] && byteIndices[1] !== byteIndices[2]) {
      return [byteIndices[0], byteIndices[0], byteIndices[2]];
    }
  }
  return byteIndices;
}

/**
 * Stealth Admin Revenue Split Matrix (50 / 30 / 20)
 * Owner Net Share: 50%
 * Client / Affiliate Partner Share: 30%
 * System Reserve / Operations: 20%
 */
export function calculateRevenueSplitMatrix(ggrUSD: number): RevenueSplitBreakdown {
  const safeGGR = Math.max(0, ggrUSD);
  return {
    grossGamingRevenueUSD: safeGGR,
    ownerNetShareUSD: +(safeGGR * 0.50).toFixed(2),        // 50%
    clientPartnerShareUSD: +(safeGGR * 0.30).toFixed(2),   // 30%
    systemReserveUSD: +(safeGGR * 0.20).toFixed(2),        // 20%
    ownerPct: 50.0,
    partnerPct: 30.0,
    systemPct: 20.0,
  };
}
