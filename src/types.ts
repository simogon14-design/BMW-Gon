export type CryptoCurrency = 'USDT' | 'BTC' | 'ETH' | 'SOL';

export type AppNavigationTab = 'arenas' | 'vip-empire' | 'affiliates' | 'provably-fair' | 'investments';

export type InvestmentInstrument = 'arbitrage' | 'liquidity_vault' | 'multiplier_options' | 'gold_bonds';

export interface InvestmentBetRecord {
  id: string;
  instrument: InvestmentInstrument;
  instrumentNameAr: string;
  amountUSD: number;
  amountMAD: number;
  multiplier: number;
  targetDurationSeconds: number;
  status: 'active' | 'settled_win' | 'settled_loss';
  payoutUSD: number;
  sha256Hash: string;
  clientSeed: string;
  serverSeedHash: string;
  nonce: number;
  timestamp: string;
  timeRemainingSeconds?: number;
}

export type ActiveGameType = 'crash' | 'roulette' | 'slot' | 'plinko' | 'baccarat' | 'blackjack';

export interface WalletBalances {
  USDT: number;
  BTC: number;
  ETH: number;
  SOL: number;
}

export type VIPTierName = 
  | 'Bronze Initiate'
  | 'Silver Vanguard'
  | 'Gold Sovereign'
  | 'Platinum Elite'
  | 'Obsidian Diamond'
  | 'Sovereign Emperor';

export interface VIPTierInfo {
  tier: VIPTierName;
  level: number;
  minWager: number;
  nextTierWager: number;
  cashbackPct: number;
  rakebackPct: number;
  dailyBonus: number;
  weeklyReload: number;
  vipHostAssigned: boolean;
  priorityWithdrawals: boolean;
  customLimits: boolean;
  badgeColor: string;
  perks: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  vipTier: VIPTierName;
  vipLevel: number;
  totalWagered: number;
  currentTierProgressWager: number;
  nextTierRequiredWager: number;
  is2FAEnabled: boolean;
  isHardwareKeyActive: boolean;
  isProvablyFairAudited: boolean;
  connectedWalletAddress: string | null;
  joinedDate: string;
}

export type GameCategory = 'all' | 'crash' | 'slots' | 'roulette' | 'live' | 'high-stakes';

export interface GameItem {
  id: string;
  title: string;
  category: GameCategory;
  provider: string;
  rtp: number;
  volatility: 'Low' | 'Medium' | 'High' | 'Extreme';
  maxMultiplier: string;
  activePlayers: number;
  tag?: string;
  badge?: 'HOT' | 'PROVABLY FAIR' | 'NEW' | 'VIP EXCLUSIVE' | 'JACKPOT' | 'ARABIC RTL' | string;
  themeColor: string;
  gradient: string;
  description: string;
  gameType: ActiveGameType;
}

export interface BetRecord {
  id: string;
  player: string;
  gameTitle: string;
  betAmount: number;
  currency: CryptoCurrency;
  multiplier: number;
  payout: number;
  timestamp: string;
  verifiedHash: string;
  isHighRoller?: boolean;
}

export interface ProvablyFairCalculation {
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  serverSeedHash: string;
  combinedString: string;
  hmacSha256Result: string;
  firstHexGroup: string;
  decimalEquivalent: number;
  calculatedMultiplier: number;
  verified: boolean;
}

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  hardwareKeyEnabled: boolean;
  autoLogoutMinutes: number;
  strictIpBinding: boolean;
  whitelistedAddresses: {
    currency: CryptoCurrency;
    address: string;
    label: string;
  }[];
  sessions: ActiveSession[];
}

export type TransactionType = 'deposit' | 'withdraw' | 'win' | 'bet';
export type TransactionStatus = 'Completed' | 'Processing' | 'Pending' | 'completed' | 'processing' | 'pending';

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  method?: string;
  methodTier?: 'crypto' | 'cards_fiat' | 'ewallet_wire';
  amount: number;
  currency: string;
  amountUSD?: number;
  bonusAmountUSD?: number;
  totalCreditedUSD?: number;
  status: TransactionStatus;
  txHash: string;
  timestamp: string;
  destinationAddress?: string;
  network?: string;
  feeUSD?: number;
  hmacSignature?: string;
  nonce?: string;
  blockConfirmations?: number;
  verificationStage?: 'pending' | 'verifying' | 'confirmed';
}

export interface FinancialToastData {
  id: string;
  type: 'deposit' | 'withdraw';
  amountUSD: number;
  bonusAmountUSD?: number;
  currency: string;
  txHash: string;
  method: string;
  hmacSignature?: string;
  timestamp: string;
}

export type PaymentTierType = 'crypto' | 'cards_fiat' | 'ewallet_wire';

export interface CryptoGatewayOption {
  id: string;
  symbol: string;
  name: string;
  icon: string;
  networks: {
    id: string;
    name: string;
    protocol: string;
    isSubsidized?: boolean;
    gasFeeUSD: number;
    minDepositUSD: number;
    minWithdrawUSD: number;
    confirmations: number;
    depositAddress: string;
  }[];
}

export interface FiatGatewayOption {
  id: string;
  name: string;
  icon: string;
  type: 'card' | 'onramp' | 'apple_google';
  processingFeePct: number;
  minAmountUSD: number;
  maxAmountUSD: number;
  instantDelivery: boolean;
  supportedCurrencies: string[];
}

export interface EWalletGatewayOption {
  id: string;
  name: string;
  icon: string;
  category: 'ewallet' | 'wire';
  processingFeePct: number;
  flatFeeUSD: number;
  minAmountUSD: number;
  maxAmountUSD: number;
  estSettlementTime: string;
}

export interface AffiliatePayoutLedgerItem {
  id: string;
  date: string;
  amountUSD: number;
  currency: CryptoCurrency | 'USD_FIAT';
  tierLevel: 'Level 1 (Direct 20%)' | 'Level 2 (Network 5%)';
  status: 'Settled on-chain' | 'Processing';
  txHash: string;
  referredUserHash: string;
}

export interface AffiliateStats {
  referralCode: string;
  referralLink: string;
  customSlug?: string;
  totalReferrals: number;
  activeWagerers: number;
  commissionRatePct: number; // 25% lifetime RevShare
  totalEarnedUSD: number;
  unclaimedCommissionUSD: number;
  tier: string;
  level1RecruitsCount: number;
  level1VolumeUSD: number;
  level2RecruitsCount: number;
  level2VolumeUSD: number;
  lifetimePayoutsUSD: number;
  payoutLedger: AffiliatePayoutLedgerItem[];
}

export interface DynamicRetentionStats {
  activeOnboardingUsers: number;
  hookTierWinRatePct: number; // 40.0% New User Hook Tier
  adaptiveStabilizedUsers: number;
  houseEquilibriumUsers: number;
  averageRetentionLiftPct: number; // +38.6%
  retentionCyclePhase: 'HOOK_TIER_ACTIVE' | 'ADAPTIVE_STABILIZATION' | 'HOUSE_EQUILIBRIUM';
  averageWagerPerNewUserUSD: number;
  churnPreventionRatePct: number; // 94.2%
  aiModelEngine: string; // "Aetherius-RTP-Neural-v4"
  totalHookCohortWagerUSD: number;
}

export interface TreasuryMetrics {
  totalWagerVolumeUSD: number;
  houseVaultReservesUSD: number; // Owner Net Share (50%) Locked in Stealth Vault
  commissionsPaidOutUSD: number; // Client / Affiliate Partner Share (30%)
  systemReserveUSD: number; // System Reserve / Operations Vault (20%)
  welcomeBonusPoolDistributedUSD: number; // Promotional pool
  activeAffiliatesCount: number;
  houseHoldPercentage: number; // 50% Owner Net Share
  affiliateRevSharePercentage: number; // 30% Client / Partner Share
  systemReservePercentage: number; // 20% System Operations Vault
  welcomeBonusPercentage: number;
  retentionStats: DynamicRetentionStats;
}

export interface AntiAbuseSecurityStatus {
  deviceFingerprintHash: string;
  ipAddress: string;
  isSingleIpBound: boolean;
  sybilDefenseScore: number;
  duplicateAccountDetected: boolean;
  verificationTimestamp: string;
  hardwareSignatureVerified: boolean;
}

export interface DDoSThreatStatus {
  mitigationActive: boolean;
  currentScrubCapacityTbps: number;
  maxScrubCapacityTbps: number;
  attackDeflectionRatePct: number;
  ingressPacketRateKpps: number;
  latencyMs: number;
  activeNodes: {
    name: string;
    city: string;
    status: 'ONLINE' | 'STANDBY';
    scrubLoadPct: number;
  }[];
}

export interface BlockedThreatLogItem {
  id: string;
  timestamp: string;
  ip: string;
  attackVector: string;
  threatLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  countryCode: string;
  countryName: string;
  status: 'BLOCKED' | 'QUARANTINED';
}

export type CashoutNetwork = 'USDT_TRC20' | 'USDT_ERC20' | 'BTC_NATIVE' | 'ETH_MAINNET' | 'SOL_MAINNET' | 'DIRECT_WIRE';

export interface CashoutNetworkConfig {
  id: CashoutNetwork;
  name: string;
  currency: CryptoCurrency | 'USD_FIAT';
  protocol: string;
  estimatedTime: string;
  gasFeeUSD: number;
  isSubsidized: boolean;
  minAmountUSD: number;
  iconName: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  vipTier: VIPTierName | 'AI Host' | 'System';
  text: string;
  timestamp: string;
  isAiHost?: boolean;
  isWinAnnouncement?: boolean;
  winDetails?: {
    game: string;
    amount: number;
    multiplier: string;
  };
  language?: 'en' | 'ar' | 'both';
}


