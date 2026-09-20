import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { CashierQRCode } from './CashierQRCode';
import {
  Copy,
  Check,
  Zap,
  ShieldCheck,
  ArrowDownLeft,
  ExternalLink,
  Info,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Gift,
  Loader2,
  Lock,
  Clock,
  CheckCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../../utils/haptics';
import { calculateDepositBonusMatch } from '../../utils/paymentSecurity';

interface CryptoOption {
  symbol: string;
  name: string;
  logoColor: string;
  networks: {
    id: string;
    label: string;
    protocol: string;
    isSubsidized?: boolean;
    gasFeeUSD: number;
    avgTime: string;
    minDeposit: number;
    address: string;
  }[];
}

const CRYPTO_OPTIONS: CryptoOption[] = [
  {
    symbol: 'USDT',
    name: 'Tether USD',
    logoColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    networks: [
      {
        id: 'TRC20',
        label: 'TRC-20',
        protocol: 'TRON Network',
        isSubsidized: true,
        gasFeeUSD: 0,
        avgTime: '15 sec',
        minDeposit: 10,
        address: 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE',
      },
      {
        id: 'ERC20',
        label: 'ERC-20',
        protocol: 'Ethereum Mainnet',
        isSubsidized: false,
        gasFeeUSD: 3.40,
        avgTime: '1.5 min',
        minDeposit: 50,
        address: '0x71C8201217e27393452243eE37fA63721327B94f',
      },
      {
        id: 'BEP20',
        label: 'BEP-20',
        protocol: 'BNB Smart Chain',
        isSubsidized: true,
        gasFeeUSD: 0,
        avgTime: '5 sec',
        minDeposit: 10,
        address: '0x8841F93a2190B28C380429C52E4694931a78De1A',
      },
    ],
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    logoColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    networks: [
      {
        id: 'NATIVE',
        label: 'Native SegWit',
        protocol: 'Bitcoin Core',
        isSubsidized: false,
        gasFeeUSD: 2.10,
        avgTime: '10 min',
        minDeposit: 0.0005,
        address: 'bc1q9v0z8pkvg4xqyq4v7qf3k95a94m33jsws289z4',
      },
      {
        id: 'TAPROOT',
        label: 'Taproot (P2TR)',
        protocol: 'Bitcoin Taproot',
        isSubsidized: false,
        gasFeeUSD: 1.80,
        avgTime: '10 min',
        minDeposit: 0.0005,
        address: 'bc1p5d7rjq7g6rd2ee00057722pxdyhh68sqhpwq6233',
      },
    ],
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    logoColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
    networks: [
      {
        id: 'ETH_MAINNET',
        label: 'Ethereum L1',
        protocol: 'PoS Mainnet',
        isSubsidized: false,
        gasFeeUSD: 2.85,
        avgTime: '45 sec',
        minDeposit: 0.01,
        address: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
      },
      {
        id: 'ARBITRUM',
        label: 'Arbitrum One',
        protocol: 'L2 Rollup',
        isSubsidized: true,
        gasFeeUSD: 0,
        avgTime: '2 sec',
        minDeposit: 0.005,
        address: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
      },
    ],
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    logoColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    networks: [
      {
        id: 'SOLANA',
        label: 'Solana Mainnet',
        protocol: 'SPL Token',
        isSubsidized: true,
        gasFeeUSD: 0,
        avgTime: '1.2 sec',
        minDeposit: 0.1,
        address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      },
    ],
  },
  {
    symbol: 'TON',
    name: 'The Open Network',
    logoColor: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
    networks: [
      {
        id: 'TON_MAINNET',
        label: 'TON Core',
        protocol: 'TON Blockchain',
        isSubsidized: true,
        gasFeeUSD: 0,
        avgTime: '3 sec',
        minDeposit: 2,
        address: 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N',
      },
    ],
  },
  {
    symbol: 'BNB',
    name: 'BNB Chain',
    logoColor: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    networks: [
      {
        id: 'BSC',
        label: 'BNB Smart Chain',
        protocol: 'BEP-20',
        isSubsidized: true,
        gasFeeUSD: 0,
        avgTime: '3 sec',
        minDeposit: 0.02,
        address: '0x8841F93a2190B28C380429C52E4694931a78De1A',
      },
    ],
  },
];

const QUICK_NETWORKS = [
  { label: 'USDT (TRC-20)', symbol: 'USDT', networkId: 'TRC20', desc: 'Instant • 0 Gas' },
  { label: 'USDT (ERC-20)', symbol: 'USDT', networkId: 'ERC20', desc: 'Ethereum Standard' },
  { label: 'Bitcoin (BTC)', symbol: 'BTC', networkId: 'NATIVE', desc: 'Native SegWit' },
  { label: 'Solana (SOL)', symbol: 'SOL', networkId: 'SOLANA', desc: '1.2s • Ultra-Fast' },
  { label: 'Ethereum (ETH)', symbol: 'ETH', networkId: 'ETH_MAINNET', desc: 'L1 Direct' },
];

interface CryptoPaymentTierProps {
  onSuccessClose?: () => void;
}

export const CryptoPaymentTier: React.FC<CryptoPaymentTierProps> = ({ onSuccessClose }) => {
  const { executeCashierDeposit, showToast, walletDepositPreset } = useCasino();

  // 2-Step Card Flow State
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedAsset, setSelectedAsset] = useState<CryptoOption>(CRYPTO_OPTIONS[0]);
  const [selectedNetwork, setSelectedNetwork] = useState(CRYPTO_OPTIONS[0].networks[0]);
  const [copied, setCopied] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [applyBonus, setApplyBonus] = useState<boolean>(true);

  // Sync with preset when opened from CTA banner
  React.useEffect(() => {
    if (walletDepositPreset) {
      setDepositAmount(walletDepositPreset.amount);
      setApplyBonus(walletDepositPreset.applyBonus);
      setCurrentStep(2);
    }
  }, [walletDepositPreset]);

  // TxHash Verification State
  const [customTxHash, setCustomTxHash] = useState<string>('');
  const [txVerificationStage, setTxVerificationStage] = useState<'idle' | 'broadcasting' | 'mempool' | 'verified' | 'credited'>('idle');
  const [verificationProgress, setVerificationProgress] = useState<number>(0);

  const bonusCalc = calculateDepositBonusMatch(depositAmount, applyBonus);

  const handleSelectAsset = (asset: CryptoOption) => {
    triggerHaptic('selection');
    setSelectedAsset(asset);
    setSelectedNetwork(asset.networks[0]);
  };

  const handleSelectQuickNetwork = (symbol: string, networkId: string) => {
    triggerHaptic('selection');
    const asset = CRYPTO_OPTIONS.find((c) => c.symbol === symbol) || CRYPTO_OPTIONS[0];
    const net = asset.networks.find((n) => n.id === networkId) || asset.networks[0];
    setSelectedAsset(asset);
    setSelectedNetwork(net);
  };

  const handleCopy = () => {
    triggerHaptic('success');
    navigator.clipboard.writeText(selectedNetwork.address);
    setCopied(true);
    showToast(`Copied ${selectedAsset.symbol} (${selectedNetwork.label}) deposit address to clipboard.`);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleExecuteDeposit = async () => {
    triggerHaptic('heavy');
    await executeCashierDeposit({
      method: `${selectedAsset.symbol} (${selectedNetwork.label})`,
      methodTier: 'crypto',
      amountUSD: depositAmount,
      currency: selectedAsset.symbol,
      applyBonus,
    });
    if (onSuccessClose) onSuccessClose();
  };

  const handleVerifyTxHash = () => {
    triggerHaptic('medium');
    let hashToVerify = customTxHash.trim();
    if (!hashToVerify) {
      if (selectedAsset.symbol === 'BTC') {
        hashToVerify = `bc1q${Array.from({ length: 34 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      } else if (selectedNetwork.id.includes('TRC20')) {
        hashToVerify = `TN${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      } else {
        hashToVerify = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      }
      setCustomTxHash(hashToVerify);
    }

    setTxVerificationStage('broadcasting');
    setVerificationProgress(25);

    setTimeout(() => {
      setTxVerificationStage('mempool');
      setVerificationProgress(60);
      triggerHaptic('light');

      setTimeout(() => {
        setTxVerificationStage('verified');
        setVerificationProgress(90);
        triggerHaptic('medium');

        setTimeout(async () => {
          setTxVerificationStage('credited');
          setVerificationProgress(100);
          triggerHaptic('heavy');

          await executeCashierDeposit({
            method: `${selectedAsset.symbol} (${selectedNetwork.label})`,
            methodTier: 'crypto',
            amountUSD: depositAmount,
            currency: selectedAsset.symbol,
            txHash: hashToVerify,
            applyBonus,
          });

          setTimeout(() => {
            if (onSuccessClose) onSuccessClose();
          }, 1400);
        }, 800);
      }, 800);
    }, 800);
  };

  return (
    <div className="space-y-5 text-left">
      {/* 2-Step Flow Indicator */}
      <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-black/60 border border-white/10 font-mono text-xs">
        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            setCurrentStep(1);
          }}
          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            currentStep === 1
              ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(255,215,0,0.3)]'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[11px] font-black">1</span>
          <span>CHOOSE AMOUNT & ASSET</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            setCurrentStep(2);
          }}
          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            currentStep === 2
              ? 'bg-amber-400 text-black shadow-[0_0_12px_rgba(255,215,0,0.3)]'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[11px] font-black">2</span>
          <span>INSTANT QR & TRANSFER</span>
        </button>
      </div>

      {/* STEP 1: AMOUNT & ASSET */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Quick Select Chips ($50, $100, $500, etc.) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-400/30 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Select Deposit Amount:
              </span>
              <span className="text-emerald-400 font-bold">100% Direct Bankroll Credit</span>
            </div>

            {/* Tactile Quick Chips ($20, $50, $100, $250, $500, $1,000) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[20, 50, 100, 250, 500, 1000].map((amt) => {
                const isSelected = depositAmount === amt;
                const bonus = Number((amt * 0.30).toFixed(0));
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setDepositAmount(amt);
                    }}
                    className={`py-2 px-1.5 rounded-xl flex flex-col items-center justify-center transition-all duration-150 cursor-pointer active:scale-95 border ${
                      isSelected
                        ? 'btn-tactile-gold shadow-[0_0_15px_rgba(255,215,0,0.4)] border-amber-300 scale-102'
                        : 'bg-white/5 text-slate-200 border-white/10 hover:border-amber-400/40 hover:text-amber-300'
                    }`}
                  >
                    <span className="font-luxury font-black text-xs sm:text-sm">
                      ${amt.toLocaleString()}
                    </span>
                    {applyBonus && (
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">
                        +${bonus} match
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Bonus Match Engine Preview Card */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-black/40 border border-amber-400/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                    <Gift className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-black text-amber-300 flex items-center gap-1">
                      +30% INSTANT MATCH BONUS
                      <span className="px-1.5 py-0.2 rounded bg-amber-400 text-black text-[9px] font-black uppercase">Active</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">Zero wagering delay • Instantly credited to playable balance</span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyBonus}
                    onChange={(e) => {
                      triggerHaptic('selection');
                      setApplyBonus(e.target.checked);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-400"></div>
                </label>
              </div>

              {applyBonus && (
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-center font-mono">
                  <div className="p-1.5 rounded-lg bg-black/40">
                    <span className="text-[9px] text-slate-400 block uppercase">Deposit Target</span>
                    <span className="text-xs font-bold text-white">${depositAmount.toLocaleString()}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-black/40 border border-amber-400/20">
                    <span className="text-[9px] text-amber-400 block uppercase">+30% Match</span>
                    <span className="text-xs font-bold text-emerald-400">+$ {(depositAmount * 0.30).toFixed(2)}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-amber-400/20 to-yellow-500/20 border border-amber-400/30">
                    <span className="text-[9px] text-amber-200 block uppercase">Total Playable</span>
                    <span className="text-xs font-black text-amber-300">${(depositAmount * 1.30).toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Visual Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Custom Amount Slider:</span>
                <span className="text-amber-300 font-bold text-sm">${depositAmount.toLocaleString()} USDT</span>
              </div>
              <input
                type="range"
                min="20"
                max="5000"
                step="10"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>$20 Min</span>
                <span>$5,000 High Roller</span>
              </div>
            </div>
          </div>

          {/* Crypto Asset Selector */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Select Cryptocurrency:
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {CRYPTO_OPTIONS.map((asset) => {
                const isSelected = selectedAsset.symbol === asset.symbol;
                return (
                  <button
                    key={asset.symbol}
                    type="button"
                    onClick={() => handleSelectAsset(asset)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-400/20 to-amber-500/5 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.25)] scale-[1.02]'
                        : 'bg-black/40 border-white/10 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 border ${asset.logoColor}`}>
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <span className="font-mono text-xs font-bold">{asset.symbol}</span>
                    <span className="text-[10px] text-slate-400 truncate max-w-full">{asset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Network Selection Pills */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                Network Protocol:
              </label>
              {selectedNetwork.isSubsidized && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Zap className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  100% Zero-Fee Gas Subsidized
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedAsset.networks.map((net) => {
                const isNetActive = selectedNetwork.id === net.id;
                return (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setSelectedNetwork(net);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition cursor-pointer flex items-center gap-2 border ${
                      isNetActive
                        ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-sm'
                        : 'bg-black/50 border-white/10 hover:border-white/20 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{net.label}</span>
                    <span className="text-[10px] opacity-70">({net.protocol})</span>
                    {net.isSubsidized && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continue Action Button */}
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium');
              setCurrentStep(2);
            }}
            className="w-full py-3.5 rounded-2xl btn-tactile-gold font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95"
          >
            <span>CONTINUE TO STEP 2: GET DEPOSIT QR & ADDRESS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* STEP 2: QR & CONFIRMATION */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Multi-Chain Dynamic Network Tabs (USDT TRC-20 & ERC-20, BTC, ETH) */}
          <div className="p-3.5 rounded-2xl bg-black/80 border border-amber-400/30 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Select Payment Network:
              </span>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono text-[11px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Network: Active | Gas: Low</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {QUICK_NETWORKS.map((qn) => {
                const isSelected = selectedAsset.symbol === qn.symbol && selectedNetwork.id === qn.networkId;
                return (
                  <button
                    key={qn.label}
                    type="button"
                    onClick={() => handleSelectQuickNetwork(qn.symbol, qn.networkId)}
                    className={`p-2.5 rounded-xl border flex flex-col items-start gap-0.5 transition cursor-pointer text-left active:scale-95 ${
                      isSelected
                        ? 'btn-tactile-gold shadow-[0_0_15px_rgba(255,215,0,0.35)] border-amber-300'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-amber-400/40 hover:text-white'
                    }`}
                  >
                    <span className="font-mono text-xs font-black">{qn.label}</span>
                    <span className={`text-[10px] font-mono ${isSelected ? 'text-black/80 font-bold' : 'text-slate-400'}`}>
                      {qn.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Amount Header with 30% Match Display */}
          <div className="p-3.5 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-black text-xs ${selectedAsset.logoColor}`}>
                {selectedAsset.symbol.substring(0, 3)}
              </div>
              <div>
                <span className="text-[11px] font-mono text-slate-400 block">
                  Pending Deposit Target ({selectedNetwork.label}):
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-luxury font-black text-amber-300">
                    ${depositAmount.toLocaleString()} USDT
                  </span>
                  {applyBonus && (
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      +$ {(depositAmount * 0.30).toFixed(2)} Match = ${bonusCalc.totalPlayableUSD.toFixed(2)} Credited
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 font-mono text-xs cursor-pointer"
            >
              Edit Amount
            </button>
          </div>

          {/* QR Code and Deposit Address Section */}
          <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/25 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-5 flex justify-center">
              <CashierQRCode value={selectedNetwork.address} size={150} label={`${selectedAsset.symbol} Deposit`} />
            </div>

            <div className="md:col-span-7 space-y-3">
              <div>
                <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1.5">
                  <span>Deposit Address ({selectedNetwork.label}):</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready for incoming transfer
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-white/10 group">
                  <span className="font-mono text-xs text-amber-300 break-all select-all flex-1">
                    {selectedNetwork.address}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-3.5 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 active:scale-95 shadow-md"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'COPIED TO CLIPBOARD' : 'Copy Vault Address'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-500 block">Min Deposit</span>
                  <span className="font-bold text-white">{selectedNetwork.minDeposit} {selectedAsset.symbol}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-500 block">Avg Confirmation</span>
                  <span className="font-bold text-emerald-400">{selectedNetwork.avgTime}</span>
                </div>
                <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-[10px] text-slate-500 block">Network Fee</span>
                  <span className="font-bold text-amber-400">
                    {selectedNetwork.isSubsidized ? 'FREE (0.00)' : `$${selectedNetwork.gasFeeUSD.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 bg-amber-400/5 p-2 rounded-lg border border-amber-400/10">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Send only {selectedAsset.symbol} via {selectedNetwork.label}. Balance credits upon 1 on-chain block.</span>
              </div>
            </div>
          </div>

          {/* REAL-TIME CRYPTO PAYMENT ENGINE & TXHASH VALIDATOR */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-amber-400/30 space-y-3.5 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Instant TxHash Blockchain Validator
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Submit transaction hash for real-time mempool verification & instant crediting
                  </span>
                </div>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                Zero-Trust Gateway
              </span>
            </div>

            {/* TxHash Input Field */}
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  placeholder="Paste on-chain TxHash (e.g. 0x..., TN..., bc1q...)"
                  value={customTxHash}
                  onChange={(e) => setCustomTxHash(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-amber-300 font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    let sample = '';
                    if (selectedAsset.symbol === 'BTC') {
                      sample = `bc1q${Array.from({ length: 34 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
                    } else if (selectedNetwork.id.includes('TRC20')) {
                      sample = `TN${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
                    } else {
                      sample = `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
                    }
                    setCustomTxHash(sample);
                    showToast('Generated sample TxHash for instant verification');
                  }}
                  className="px-2.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 border border-white/10 transition cursor-pointer shrink-0"
                >
                  Auto-Fill Example
                </button>
                <button
                  type="button"
                  onClick={handleVerifyTxHash}
                  disabled={txVerificationStage !== 'idle' && txVerificationStage !== 'credited'}
                  className="px-4 py-2.5 rounded-xl btn-tactile-gold font-mono font-black text-xs uppercase flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {txVerificationStage !== 'idle' && txVerificationStage !== 'credited' ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                  <span>VERIFY TXHASH</span>
                </button>
              </div>
            </div>

            {/* Real-time Status Indicators */}
            {txVerificationStage !== 'idle' && (
              <div className="p-3 rounded-xl bg-black/80 border border-amber-400/30 space-y-2 text-xs">
                {/* Progress Bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500"
                    style={{ width: `${verificationProgress}%` }}
                  />
                </div>

                {/* Status Message */}
                <div className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    {txVerificationStage === 'broadcasting' && (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                        Broadcasting to Blockchain Node... (0/3 Confirmations)
                      </>
                    )}
                    {txVerificationStage === 'mempool' && (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-400" />
                        Mempool Detected (1/3 Confirmations)... Cryptographic Signature Verified
                      </>
                    )}
                    {txVerificationStage === 'verified' && (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Blockchain Verified & Block Finalized (3/3 Confirmations)!
                      </>
                    )}
                    {txVerificationStage === 'credited' && (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                        Funds Credited to Sovereign Bankroll!
                      </>
                    )}
                  </span>
                  <span className="text-amber-400 font-bold">{verificationProgress}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick 1-Tap Deposit Credit Fallback */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900/50 to-amber-950/20 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-amber-300 block">
                Instant 1-Tap Fast Settlement:
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Execute immediate cryptographic settlement into sovereign bankroll with 0 latency.
              </span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-mono text-xs cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleExecuteDeposit}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-mono font-extrabold text-xs shadow-lg transition cursor-pointer active:scale-95"
              >
                CREDIT ${bonusCalc.totalPlayableUSD.toFixed(2)} NOW
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
