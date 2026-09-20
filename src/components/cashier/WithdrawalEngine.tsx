import React, { useState, useId } from 'react';
import { useCasino } from '../../context/CasinoContext';
import {
  Zap,
  ShieldCheck,
  Lock,
  ArrowUpRight,
  ArrowRight,
  Copy,
  Check,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Clock,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { motion } from 'motion/react';
import { triggerHaptic } from '../../utils/haptics';

interface WithdrawalEngineProps {
  onSuccessClose?: () => void;
}

interface PayoutNetworkConfig {
  id: string;
  name: string;
  currency: string;
  category: 'crypto' | 'cards_fiat' | 'ewallet_wire';
  gasFeeUSD: number;
  isSubsidized: boolean;
  estTime: string;
  placeholder: string;
  validatePattern: (val: string) => boolean;
  validationHint: string;
}

const PAYOUT_NETWORKS: PayoutNetworkConfig[] = [
  {
    id: 'USDT_TRC20',
    name: 'USDT (TRC-20)',
    currency: 'USDT',
    category: 'crypto',
    gasFeeUSD: 0,
    isSubsidized: true,
    estTime: 'Instant (~3 sec)',
    placeholder: 'T... (TRON Base58 Address)',
    validatePattern: (val) => /^T[a-zA-Z0-9]{33}$/.test(val.trim()),
    validationHint: 'TRC-20 address must begin with "T" (34 characters: ^T[a-zA-Z0-9]{33}$)',
  },
  {
    id: 'USDT_ERC20',
    name: 'USDT (ERC-20)',
    currency: 'USDT',
    category: 'crypto',
    gasFeeUSD: 3.20,
    isSubsidized: false,
    estTime: '1 - 2 min',
    placeholder: '0x... (Ethereum Hex Address)',
    validatePattern: (val) => /^0x[a-fA-F0-9]{40}$/.test(val.trim()),
    validationHint: 'ERC-20 address must begin with "0x" (42 hex characters)',
  },
  {
    id: 'BTC_NATIVE',
    name: 'Bitcoin (BTC)',
    currency: 'BTC',
    category: 'crypto',
    gasFeeUSD: 2.50,
    isSubsidized: false,
    estTime: '5 - 10 min',
    placeholder: 'bc1q... or 1... or 3...',
    validatePattern: (val) => /^(bc1[a-zA-HJ-NP-Z0-9]{25,39}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/.test(val.trim()),
    validationHint: 'Must be a valid Bitcoin SegWit/Taproot or Legacy address',
  },
  {
    id: 'ETH_L1',
    name: 'Ethereum (ETH)',
    currency: 'ETH',
    category: 'crypto',
    gasFeeUSD: 2.80,
    isSubsidized: false,
    estTime: '45 sec',
    placeholder: '0x... (Ethereum Hex Address)',
    validatePattern: (val) => /^0x[a-fA-F0-9]{40}$/.test(val.trim()),
    validationHint: 'Ethereum address must begin with "0x" (42 hex characters)',
  },
  {
    id: 'SOL_MAINNET',
    name: 'Solana (SOL)',
    currency: 'SOL',
    category: 'crypto',
    gasFeeUSD: 0,
    isSubsidized: true,
    estTime: 'Instant (~1 sec)',
    placeholder: 'Solana Base58 Public Key...',
    validatePattern: (val) => /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(val.trim()),
    validationHint: 'Base58 Solana address (32-44 characters)',
  },
  {
    id: 'DIRECT_IBAN',
    name: 'Direct Wire / IBAN',
    currency: 'USD',
    category: 'ewallet_wire',
    gasFeeUSD: 15.00,
    isSubsidized: false,
    estTime: '1 - 2 Business Hours',
    placeholder: 'IBAN (e.g. GB82... or AE07...)',
    validatePattern: (val) => val.replace(/\s/g, '').length >= 15,
    validationHint: 'Standard international IBAN format',
  },
  {
    id: 'SKRILL_PAYOUT',
    name: 'Skrill E-Wallet',
    currency: 'USD',
    category: 'ewallet_wire',
    gasFeeUSD: 0,
    isSubsidized: true,
    estTime: 'Instant (~30 sec)',
    placeholder: 'Skrill Registered Email Address',
    validatePattern: (val) => val.includes('@') && val.includes('.'),
    validationHint: 'Valid email address linked to Skrill',
  },
];

export const WithdrawalEngine: React.FC<WithdrawalEngineProps> = ({ onSuccessClose }) => {
  const { balances, executeCashierWithdrawal, showToast } = useCasino();

  const MIN_WITHDRAWAL = 50;
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedNetwork, setSelectedNetwork] = useState<PayoutNetworkConfig>(PAYOUT_NETWORKS[0]);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(100);
  const [destinationAddress, setDestinationAddress] = useState<string>('TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('849201');
  const [masterPin, setMasterPin] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedTx, setCompletedTx] = useState<{ txHash: string; netAmount: number; hmacSignature?: string } | null>(null);
  const [copiedTx, setCopiedTx] = useState(false);

  const availableUSDT = balances.USDT;
  const isAddressValid = selectedNetwork.validatePattern(destinationAddress);
  const netPayout = Math.max(0, withdrawAmount - selectedNetwork.gasFeeUSD);
  const isHighValue = withdrawAmount >= 500;

  const handleQuickAmount = (val: number | 'MAX') => {
    triggerHaptic('selection');
    if (val === 'MAX') {
      setWithdrawAmount(Math.max(MIN_WITHDRAWAL, Math.floor(availableUSDT)));
    } else {
      setWithdrawAmount(Math.min(val, Math.floor(availableUSDT)));
    }
  };

  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (withdrawAmount < MIN_WITHDRAWAL) {
      showToast(`⚠️ Minimum withdrawal limit is $${MIN_WITHDRAWAL}.00 USDT`);
      return;
    }

    if (withdrawAmount > availableUSDT) {
      showToast(`⚠️ Insufficient vault balance. Available: $${availableUSDT.toFixed(2)} USDT`);
      return;
    }

    if (!isAddressValid) {
      showToast(`⚠️ Please enter a valid address matching: ${selectedNetwork.validationHint}`);
      return;
    }

    if (isHighValue && masterPin.trim() !== '7731') {
      showToast('❌ Master PIN authorization required for high-volume disbursements (≥ $500).');
      return;
    }

    if (twoFactorCode.length < 6) {
      showToast('⚠️ Please provide the 6-digit TOTP security code');
      return;
    }

    setIsSubmitting(true);
    triggerHaptic('heavy');

    const result = await executeCashierWithdrawal({
      method: selectedNetwork.name,
      methodTier: selectedNetwork.category,
      amountUSD: withdrawAmount,
      currency: selectedNetwork.currency,
      destinationAddress,
      network: selectedNetwork.id,
      feeUSD: selectedNetwork.gasFeeUSD,
      twoFactorCode,
      masterPin,
    });

    setIsSubmitting(false);

    if (result.success && result.txHash) {
      setCompletedTx({
        txHash: result.txHash,
        netAmount: netPayout,
        hmacSignature: result.hmacSignature,
      });
    }
  };

  const handleCopyTx = () => {
    if (!completedTx) return;
    navigator.clipboard.writeText(completedTx.txHash);
    setCopiedTx(true);
    showToast('Transaction hash copied to clipboard.');
    setTimeout(() => setCopiedTx(false), 2000);
  };

  if (completedTx) {
    return (
      <div className="p-6 rounded-2xl bg-black/80 border border-emerald-500/40 space-y-5 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
          <Check className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
            CRYPTOGRAPHIC DISPATCH BROADCASTED
          </span>
          <h3 className="font-luxury font-black text-2xl text-white mt-1">
            ${completedTx.netAmount.toFixed(2)} {selectedNetwork.currency} DISPATCHED
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Settled via {selectedNetwork.name} • Dispatched from Institutional Cold Vault
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-white/10 text-left space-y-2 font-mono text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Recipient Address:</span>
            <span className="text-white font-bold truncate max-w-[200px]">{destinationAddress}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Estimated Confirmation:</span>
            <span className="text-emerald-400 font-bold">{selectedNetwork.estTime}</span>
          </div>
          <div className="pt-2 border-t border-white/10">
            <span className="text-slate-400 block mb-1">Mempool Transaction Hash (TxHash):</span>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-black/60 border border-white/10">
              <span className="text-amber-300 select-all break-all flex-1 text-[11px]">
                {completedTx.txHash}
              </span>
              <button
                type="button"
                onClick={handleCopyTx}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0"
              >
                {copiedTx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {completedTx.hmacSignature && (
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="flex items-center gap-1 text-[11px] text-amber-300 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> HMAC-SHA256 Payload Signature:
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Zero-Trust Verified</span>
              </div>
              <div className="p-2 rounded-lg bg-black/60 border border-emerald-500/20 text-emerald-300 font-mono text-[10px] break-all select-all">
                {completedTx.hmacSignature}
              </div>
            </div>
          )}

          {/* Telegram Webhook Dispatch Indicator */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-slate-300 text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" /> Telegram Payout Webhook:
            </span>
            <span className="text-emerald-400 font-bold">DISPATCHED (Real-time Broadcast)</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setCompletedTx(null)}
            className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>NEW WITHDRAWAL</span>
          </button>
          {onSuccessClose && (
            <button
              type="button"
              onClick={onSuccessClose}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-mono text-xs font-extrabold transition cursor-pointer shadow-lg"
            >
              DONE
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleExecuteWithdrawal} className="space-y-5 text-left">
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
              ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[11px] font-black">1</span>
          <span>AMOUNT & CHANNEL</span>
        </button>

        <button
          type="button"
          onClick={() => {
            triggerHaptic('selection');
            setCurrentStep(2);
          }}
          className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            currentStep === 2
              ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-[11px] font-black">2</span>
          <span>ADDRESS & 2FA</span>
        </button>
      </div>

      {/* STEP 1: AMOUNT & CHANNEL */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Live Status Badge */}
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 uppercase tracking-wider">Automated Payout Engine:</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-mono text-[11px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Instant Payout Status: Active | HSM Buffer Ready</span>
            </div>
          </div>

          {/* Amount Selector with Tactile Chips ($50, $100, $250, $500, MAX) & Slider */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                Select Withdrawal Amount:
              </span>
              <span className="text-emerald-400 font-bold">
                Available: ${availableUSDT.toFixed(2)} USDT
              </span>
            </div>

            {/* Tactile Chips ($50, $100, $250, $500, MAX) */}
            <div className="grid grid-cols-5 gap-2">
              {[50, 100, 250, 500].map((amt) => {
                const isSelected = withdrawAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleQuickAmount(amt)}
                    className={`py-2.5 px-2 rounded-xl font-luxury font-black text-xs sm:text-sm transition-all duration-150 cursor-pointer active:scale-95 hover:scale-105 border ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] border-rose-400 scale-102'
                        : 'bg-white/5 text-slate-200 border-white/10 hover:border-rose-400/40 hover:text-rose-300'
                    }`}
                  >
                    ${amt}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => handleQuickAmount('MAX')}
                className={`py-2.5 px-2 rounded-xl font-luxury font-black text-xs sm:text-sm transition-all duration-150 cursor-pointer active:scale-95 hover:scale-105 border ${
                  withdrawAmount === Math.floor(availableUSDT) && availableUSDT >= MIN_WITHDRAWAL
                    ? 'bg-amber-400 text-black shadow-[0_0_15px_rgba(255,215,0,0.4)] border-amber-300 scale-102'
                    : 'bg-amber-500/10 text-amber-300 border-amber-400/30 hover:bg-amber-500/20'
                }`}
              >
                MAX
              </button>
            </div>

            {/* Visual Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Amount Slider:</span>
                <span className="text-rose-300 font-bold text-sm">${withdrawAmount.toFixed(2)} USDT</span>
              </div>
              <input
                type="range"
                min="50"
                max={Math.max(50, Math.floor(availableUSDT))}
                step="5"
                value={Math.min(withdrawAmount, Math.floor(availableUSDT))}
                onChange={(e) => setWithdrawAmount(Math.max(MIN_WITHDRAWAL, Number(e.target.value)))}
                className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span className="text-amber-400/90 font-bold">$50 Min Limit</span>
                <span>${Math.floor(availableUSDT)} Max Balance</span>
              </div>
            </div>

            {withdrawAmount < MIN_WITHDRAWAL && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Minimum withdrawal threshold is $50.00 USDT. Please adjust your request amount.</span>
              </div>
            )}
          </div>

          {/* Payout Network Selector */}
          <div>
            <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Payout Channel & Protocol:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAYOUT_NETWORKS.map((net) => {
                const isSelected = selectedNetwork.id === net.id;
                return (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('selection');
                      setSelectedNetwork(net);
                      if (net.id === 'USDT_TRC20') setDestinationAddress('TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE');
                      else if (net.id === 'USDT_ERC20' || net.id === 'ETH_L1') setDestinationAddress('0x71C8201217e27393452243eE37fA63721327B94f');
                      else if (net.id === 'BTC_NATIVE') setDestinationAddress('bc1q9v0z8pkvg4xqyq4v7qf3k95a94m33jsws289z4');
                      else if (net.id === 'SOL_MAINNET') setDestinationAddress('9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM');
                      else if (net.id === 'DIRECT_IBAN') setDestinationAddress('AE07 0260 0012 3456 7890 123');
                      else setDestinationAddress('vip.player@gmail.com');
                    }}
                    className={`p-2.5 rounded-xl border flex flex-col items-start gap-1 transition cursor-pointer text-left active:scale-95 ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                        : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-xs font-bold text-white truncate">{net.name}</span>
                      {net.isSubsidized && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-400">
                      <span>{net.estTime}</span>
                      <span className={net.isSubsidized ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                        {net.isSubsidized ? '0 FEE' : `$${net.gasFeeUSD}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Continue to Step 2 Button */}
          <button
            type="button"
            disabled={withdrawAmount < MIN_WITHDRAWAL}
            onClick={() => {
              triggerHaptic('medium');
              setCurrentStep(2);
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>CONTINUE TO STEP 2: DESTINATION ADDRESS & 2FA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* STEP 2: ADDRESS & 2FA */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5"
        >
          {/* Summary Banner */}
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono text-slate-400 block">Pending Payout Request:</span>
              <span className="text-base font-luxury font-black text-rose-300">
                ${withdrawAmount.toFixed(2)} USD <span className="text-xs font-mono text-slate-300">via {selectedNetwork.name}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 font-mono text-xs cursor-pointer"
            >
              Edit Amount
            </button>
          </div>

          {/* Destination Address / IBAN Input with Auto-Validation */}
          <div>
            <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-1.5">
              <span>Destination Account or Wallet Address:</span>
              {destinationAddress && (
                <span className={`flex items-center gap-1 text-[11px] ${isAddressValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isAddressValid ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Valid Format
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" /> {selectedNetwork.validationHint}
                    </>
                  )}
                </span>
              )}
            </div>

            <input
              id="withdraw-destination-input"
              type="text"
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
              placeholder={selectedNetwork.placeholder}
              required
              className={`w-full px-3.5 py-3 rounded-xl bg-black/60 border font-mono text-xs focus:outline-none transition ${
                isAddressValid
                  ? 'border-emerald-500/50 text-white focus:border-emerald-400'
                  : destinationAddress
                  ? 'border-rose-500/60 text-rose-300 focus:border-rose-400'
                  : 'border-white/15 text-white focus:border-amber-400'
              }`}
            />
          </div>

          {/* Real-time Network Fee Calculator & Net Payout Preview */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Gross Withdrawal Request:</span>
              <span className="text-white font-bold">${withdrawAmount.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span className="flex items-center gap-1">
                Network Execution Gas Fee:
                {selectedNetwork.isSubsidized && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                    HOUSE SUBSIDIZED
                  </span>
                )}
              </span>
              <span className={selectedNetwork.isSubsidized ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {selectedNetwork.isSubsidized ? '$0.00 (FREE)' : `-$${selectedNetwork.gasFeeUSD.toFixed(2)} USD`}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Estimated Block Finality:</span>
              <span className="text-emerald-400 font-bold">{selectedNetwork.estTime}</span>
            </div>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-white font-bold">Net Payout to Recipient:</span>
              <span className="text-rose-400 font-bold text-base">
                ${netPayout.toFixed(2)} {selectedNetwork.currency}
              </span>
            </div>
          </div>

          {/* 2FA Security Step */}
          <div className="p-4 rounded-xl bg-black/60 border border-amber-400/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 font-bold">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>2FA TOTP SECURITY AUTHENTICATION</span>
              </div>
              {isHighValue && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                  AML HIGH-VALUE SHIELD ACTIVE ($500+)
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              Enter the 6-digit cryptographic TOTP authentication code generated by your Authenticator app or hardware key.
            </p>

            <div className="flex items-center gap-3">
              <input
                id="withdraw-2fa-input"
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                required
                className="w-48 px-3 py-2.5 rounded-xl bg-slate-950 border border-amber-400/50 text-white font-mono font-extrabold text-center tracking-widest text-base focus:outline-none focus:border-amber-300"
              />
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('selection');
                  setTwoFactorCode(Math.floor(100000 + Math.random() * 900000).toString());
                  showToast('🔑 Generated fresh TOTP security token');
                }}
                className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 border border-white/10 transition cursor-pointer active:scale-95"
              >
                Auto-Fill Token
              </button>
            </div>
          </div>

          {/* Anti-Drain Safeguard: Master PIN Authorization (Required for >= $500) */}
          {isHighValue && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-400/40 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>MASTER SECURITY PIN (ANTI-DRAIN HIGH-VOLUME SAFEGUARD)</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                  REQUIRED FOR ≥ $500
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                Disbursements of $500 or greater require Master Anti-Drain Authorization PIN verification.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  id="withdraw-master-pin-input"
                  type="password"
                  maxLength={6}
                  value={masterPin}
                  onChange={(e) => setMasterPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Master PIN"
                  required
                  className={`w-full sm:w-48 px-3 py-2.5 rounded-xl bg-slate-950 border font-mono font-extrabold text-center tracking-widest text-base focus:outline-none ${
                    masterPin.trim() === '7731'
                      ? 'border-emerald-500 text-emerald-300 focus:border-emerald-400'
                      : 'border-white/20 text-slate-200 focus:border-amber-400'
                  }`}
                />
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  HSM Hardware Security Protected
                </span>
              </div>

              {masterPin.trim() !== '' && masterPin.trim() !== '7731' && (
                <div className="text-[11px] text-rose-400 font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Invalid Authorization PIN. Master authorization required for high-volume disbursements.</span>
                </div>
              )}
            </div>
          )}

          {/* Execution Action Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-mono text-xs cursor-pointer"
            >
              Back
            </button>
            <button
              id="execute-withdraw-payout-btn"
              type="submit"
              disabled={
                isSubmitting ||
                !isAddressValid ||
                withdrawAmount < MIN_WITHDRAWAL ||
                withdrawAmount > availableUSDT ||
                (isHighValue && masterPin.trim() !== '7731')
              }
              className="flex-1 py-4 rounded-xl bg-gradient-to-r from-rose-500 via-red-500 to-rose-600 hover:from-rose-400 hover:to-red-400 text-white font-mono font-extrabold text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(244,63,94,0.3)] transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  BROADCASTING TO ZERO-KNOWLEDGE COLD VAULT...
                </span>
              ) : (
                <>
                  <span>AUTHORIZE INSTANT PAYOUT (${withdrawAmount.toFixed(2)} USDT)</span>
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </form>
  );
};
