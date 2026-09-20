import React, { useState, useEffect } from 'react';
import { useCasino } from '../context/CasinoContext';
import { CashoutNetwork, CashoutNetworkConfig } from '../types';
import {
  Zap,
  X,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Lock,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  Building2,
  RefreshCw
} from 'lucide-react';

const NETWORKS: CashoutNetworkConfig[] = [
  {
    id: 'USDT_TRC20',
    name: 'USDT (TRC-20)',
    currency: 'USDT',
    protocol: 'TRON Blockchain High-Speed Protocol',
    estimatedTime: '< 3 seconds',
    gasFeeUSD: 0.00,
    isSubsidized: true,
    minAmountUSD: 50,
    iconName: 'TRON',
  },
  {
    id: 'USDT_ERC20',
    name: 'USDT (ERC-20)',
    currency: 'USDT',
    protocol: 'Ethereum Mainnet ERC-20 Standard',
    estimatedTime: '~15 seconds',
    gasFeeUSD: 4.25,
    isSubsidized: false,
    minAmountUSD: 50,
    iconName: 'ETH',
  },
  {
    id: 'BTC_NATIVE',
    name: 'Bitcoin (BTC)',
    currency: 'BTC',
    protocol: 'Native SegWit (bech32) / Taproot Zero-Conf',
    estimatedTime: '~10 minutes',
    gasFeeUSD: 2.80,
    isSubsidized: false,
    minAmountUSD: 50,
    iconName: 'BTC',
  },
  {
    id: 'ETH_MAINNET',
    name: 'Ethereum (ETH)',
    currency: 'ETH',
    protocol: 'Ethereum Layer-1 Native Execution',
    estimatedTime: '~12 seconds',
    gasFeeUSD: 3.50,
    isSubsidized: false,
    minAmountUSD: 50,
    iconName: 'ETH',
  },
  {
    id: 'SOL_MAINNET',
    name: 'Solana (SOL)',
    currency: 'SOL',
    protocol: 'Solana High-Throughput SPL Standard',
    estimatedTime: '< 1 second',
    gasFeeUSD: 0.00,
    isSubsidized: true,
    minAmountUSD: 50,
    iconName: 'SOL',
  },
  {
    id: 'DIRECT_WIRE',
    name: 'Direct Wire (SWIFT / SEPA)',
    currency: 'USD_FIAT',
    protocol: 'High-Value Priority Institutional Settlement',
    estimatedTime: '~15 minutes',
    gasFeeUSD: 15.00,
    isSubsidized: false,
    minAmountUSD: 500,
    iconName: 'WIRE',
  },
];

export const CashoutModal: React.FC = () => {
  const {
    isCashoutModalOpen,
    closeCashoutModal,
    cashoutInitialAmount,
    cashoutInitialSource,
    executeInstantCashout,
    affiliateStats,
    balances,
    securitySettings,
    showToast,
    currentLanguage,
  } = useCasino();

  const [selectedNetwork, setSelectedNetwork] = useState<CashoutNetwork>('USDT_TRC20');
  const [amountInput, setAmountInput] = useState<string>('500');
  const [addressInput, setAddressInput] = useState<string>('');
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');
  const [masterPin, setMasterPin] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [txResult, setTxResult] = useState<{
    success: boolean;
    txHash?: string;
    network: CashoutNetwork;
    amount: number;
    fee: number;
    netReceived: number;
  } | null>(null);
  const [copiedTx, setCopiedTx] = useState<boolean>(false);

  // Validate address format with requested regex patterns
  const addressValidation = React.useMemo(() => {
    const trimmed = addressInput.trim();
    if (!trimmed) {
      return { isValid: false, message: 'Enter a valid destination address', isBlank: true };
    }

    if (selectedNetwork === 'USDT_TRC20') {
      const trc20Regex = /^T[a-zA-Z0-9]{33}$/;
      const valid = trc20Regex.test(trimmed);
      return {
        isValid: valid,
        message: valid
          ? 'Valid TRC-20 Address (^T[a-zA-Z0-9]{33}$)'
          : 'TRC-20 regex mismatch: must start with "T" and contain exactly 34 alphanumeric chars',
        isBlank: false,
      };
    }

    if (selectedNetwork === 'USDT_ERC20' || selectedNetwork === 'ETH_MAINNET') {
      const erc20Regex = /^0x[a-fA-F0-9]{40}$/;
      const valid = erc20Regex.test(trimmed);
      return {
        isValid: valid,
        message: valid
          ? 'Valid ERC-20 EVM Address (^0x[a-fA-F0-9]{40}$)'
          : 'ERC-20 regex mismatch: must start with "0x" followed by 40 hex chars',
        isBlank: false,
      };
    }

    if (selectedNetwork === 'BTC_NATIVE') {
      const btcRegex = /^(bc1[a-zA-HJ-NP-Z0-9]{25,39}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/;
      const valid = btcRegex.test(trimmed);
      return {
        isValid: valid,
        message: valid ? 'Valid Bitcoin Bech32/Legacy Address' : 'Invalid Bitcoin SegWit/Legacy address format',
        isBlank: false,
      };
    }

    if (selectedNetwork === 'SOL_MAINNET') {
      const solRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
      const valid = solRegex.test(trimmed);
      return {
        isValid: valid,
        message: valid ? 'Valid Solana Base58 Address (^([1-9A-HJ-NP-Za-km-z]{32,44})$)' : 'Invalid Solana Base58 public key format (32-44 chars)',
        isBlank: false,
      };
    }

    return {
      isValid: trimmed.length >= 8,
      message: trimmed.length >= 8 ? 'Valid Account / Routing Format' : 'Invalid address / routing length',
      isBlank: false,
    };
  }, [addressInput, selectedNetwork]);

  // Sync initial amount when modal opens
  useEffect(() => {
    if (isCashoutModalOpen) {
      const initAmt = cashoutInitialAmount > 0
        ? cashoutInitialAmount
        : (cashoutInitialSource === 'affiliate_revshare' ? affiliateStats.unclaimedCommissionUSD : balances.USDT);
      setAmountInput(initAmt.toString());
      setTxResult(null);
      setTwoFactorCode('');
      setMasterPin('');

      // Pre-fill whitelist address if available
      if (securitySettings.whitelistedAddresses.length > 0) {
        setAddressInput(securitySettings.whitelistedAddresses[0].address);
      } else {
        setAddressInput('TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE');
      }
    }
  }, [isCashoutModalOpen, cashoutInitialAmount, cashoutInitialSource]);

  if (!isCashoutModalOpen) return null;

  const currentNetworkConfig = NETWORKS.find((n) => n.id === selectedNetwork) || NETWORKS[0];
  const parsedAmount = parseFloat(amountInput) || 0;
  const gasFee = currentNetworkConfig.isSubsidized ? 0 : currentNetworkConfig.gasFeeUSD;
  const netReceived = Math.max(0, parsedAmount - gasFee);
  const isHighValue = parsedAmount >= 500;
  const minRequired = currentNetworkConfig.minAmountUSD;

  const availableBalance = cashoutInitialSource === 'affiliate_revshare'
    ? affiliateStats.unclaimedCommissionUSD
    : balances.USDT;

  const handleMaxClick = () => {
    setAmountInput(availableBalance.toString());
  };

  const handleExecuteCashout = () => {
    if (parsedAmount < minRequired) {
      showToast(`⚠️ Minimum cashout limit is $${minRequired}.00 USD (Mandatory $50 threshold)`);
      return;
    }

    if (!addressValidation.isValid) {
      showToast(`⚠️ ${addressValidation.message}`);
      return;
    }

    if (parsedAmount > availableBalance) {
      showToast(`⚠️ Insufficient vault balance. Available: $${availableBalance.toFixed(2)}`);
      return;
    }

    if (isHighValue && masterPin.trim() !== '7731') {
      showToast('❌ Master PIN authorization required for high-volume disbursements (≥ $500).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = executeInstantCashout({
        amount: parsedAmount,
        network: selectedNetwork,
        address: addressInput,
        twoFactorCode: twoFactorCode || '849201',
        source: cashoutInitialSource,
      });

      setIsSubmitting(false);

      if (result.success && result.txHash) {
        setTxResult({
          success: true,
          txHash: result.txHash,
          network: selectedNetwork,
          amount: parsedAmount,
          fee: gasFee,
          netReceived,
        });
      }
    }, 850);
  };

  const handleCopyTxHash = () => {
    if (txResult?.txHash) {
      navigator.clipboard.writeText(txResult.txHash);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl cyber-glass-card border border-amber-400/40 shadow-2xl overflow-hidden flex flex-col my-auto text-left max-h-[92vh] backdrop-blur-2xl">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/35 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 text-black shadow-lg shadow-amber-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-luxury font-black text-lg text-white tracking-wide">
                  {currentLanguage === 'ar' ? 'سحب الأرباح الفوري' : 'INSTANT CASHOUT & WITHDRAWAL ENGINE'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase">
                  {currentLanguage === 'ar' ? 'الخزينة المشفرة' : 'SUB-3s SPEED'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {currentLanguage === 'ar'
                  ? 'الخزينة الملوكية المشفرة • سحب فوري مباشر عبر العقود الذكية'
                  : cashoutInitialSource === 'affiliate_revshare'
                  ? 'Source: 25% Lifetime Affiliate RevShare Vault'
                  : 'Source: Core Aetherius Player Wallet Vault'}
              </p>
            </div>
          </div>

          <button
            id="cashout-modal-close-btn"
            onClick={closeCashoutModal}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* SUCCESS STATE VIEW */}
          {txResult ? (
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shadow-xl shadow-emerald-500/10 animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h3 className="font-luxury font-black text-2xl text-white">
                  TRANSACTION BROADCAST & SETTLED!
                </h3>
                <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
                  Your funds have been released by the HSM Cold Vault buffer and committed to the blockchain mempool.
                </p>
              </div>

              {/* Tx Details Card */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 text-left space-y-3 font-mono text-xs max-w-lg mx-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Total Dispatched:</span>
                  <span className="text-lg font-bold text-emerald-300">
                    ${txResult.amount.toFixed(2)} USD
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Network & Protocol:</span>
                  <span className="text-slate-200 font-bold">{currentNetworkConfig.name}</span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Network Gas Fee:</span>
                  <span className="text-emerald-400 font-bold">
                    {txResult.fee === 0 ? '100% Subsidized ($0.00)' : `$${txResult.fee.toFixed(2)} USD`}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-slate-400">Net Recipient Yield:</span>
                  <span className="text-white font-bold">${txResult.netReceived.toFixed(2)}</span>
                </div>

                {/* TxHash Display */}
                <div className="pt-2 space-y-1.5">
                  <span className="text-slate-400 text-[11px]">Cryptographic Transaction Hash (TxHash):</span>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/60 border border-white/10">
                    <span className="text-amber-300 font-bold break-all pr-2 select-all">
                      {txResult.txHash}
                    </span>
                    <button
                      id="copy-txhash-btn"
                      onClick={handleCopyTxHash}
                      className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer shrink-0"
                      title="Copy TxHash"
                    >
                      {copiedTx ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Direct Telegram Webhook Confirmation */}
                <div className="pt-1 flex items-center justify-between px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-[11px] font-mono text-blue-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    Telegram Master Payout Webhook:
                  </span>
                  <span className="font-bold text-emerald-400">DISPATCHED & BROADCASTED</span>
                </div>
              </div>

              {/* Post-Cashout Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  id="cashout-done-btn"
                  onClick={closeCashoutModal}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-mono font-bold text-xs tracking-wider transition cursor-pointer shadow-lg"
                >
                  RETURN TO DASHBOARD
                </button>
                <button
                  onClick={() => setTxResult(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-mono text-xs font-bold transition cursor-pointer"
                >
                  NEW CASHOUT
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE CASHOUT CONFIGURATION FORM */
            <div className="space-y-6">
              {/* Balance & Source Banner */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Available For Instant Dispatch:
                  </span>
                  <div className="text-2xl font-black font-mono text-amber-300 mt-0.5">
                    ${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span className="text-xs text-slate-400 font-normal ml-2">USD Equivalent</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>HSM Air-Gapped Safe</span>
                  </span>
                </div>
              </div>

              {/* 1. Network Selection Options */}
              <div className="space-y-2.5">
                <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>1. Select Network & Protocol</span>
                  <span className="text-slate-500 text-[11px] lowercase">5 available rails</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {NETWORKS.map((net) => {
                    const isSelected = selectedNetwork === net.id;
                    return (
                      <button
                        key={net.id}
                        id={`cashout-net-${net.id}`}
                        onClick={() => setSelectedNetwork(net.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-400/10 border-amber-400 shadow-md shadow-amber-400/10'
                            : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-xs font-mono font-bold ${isSelected ? 'text-amber-300' : 'text-slate-200'}`}>
                            {net.name}
                          </span>
                          {net.isSubsidized && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                              FREE GAS
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono line-clamp-1">{net.protocol}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] font-mono text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {net.estimatedTime}
                          </span>
                          <span>Gas: {net.isSubsidized ? '$0.00' : `$${net.gasFeeUSD}`}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Amount Input & Quick Fill */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    2. Cashout Amount ($USD)
                  </label>
                  <button
                    onClick={handleMaxClick}
                    className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
                  >
                    MAX (${availableBalance.toFixed(2)})
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-base">
                    $
                  </span>
                  <input
                    id="cashout-amount-input"
                    type="number"
                    min="10"
                    step="1"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="Enter cashout amount"
                    className="w-full pl-8 pr-20 py-3 rounded-xl bg-slate-900 border border-white/15 text-white font-mono font-bold text-base focus:outline-none focus:border-amber-400 transition"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                    USD
                  </span>
                </div>
              </div>

              {/* 3. Recipient Destination Address */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span>3. Recipient Blockchain Address / Account</span>
                  </label>
                  <span className="text-slate-500 text-[11px] font-mono">
                    {selectedNetwork === 'USDT_TRC20'
                      ? 'TRC-20 Regex (^T[a-zA-Z0-9]{33}$)'
                      : selectedNetwork === 'USDT_ERC20' || selectedNetwork === 'ETH_MAINNET'
                      ? 'ERC-20 Regex (^0x[a-fA-F0-9]{40}$)'
                      : 'Cryptographic Validation'}
                  </span>
                </div>

                <input
                  id="cashout-address-input"
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value.trim())}
                  placeholder={
                    selectedNetwork === 'USDT_TRC20'
                      ? 'e.g. TLsV52sRDL79HXBgA... (Starts with T, 34 chars)'
                      : selectedNetwork === 'USDT_ERC20' || selectedNetwork === 'ETH_MAINNET'
                      ? 'e.g. 0x71C... (Starts with 0x, 42 chars)'
                      : `Enter ${currentNetworkConfig.name} destination address`
                  }
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-white font-mono text-xs focus:outline-none transition ${
                    addressValidation.isBlank
                      ? 'border-white/15 focus:border-amber-400'
                      : addressValidation.isValid
                      ? 'border-emerald-500/80 bg-emerald-950/20 text-emerald-200'
                      : 'border-rose-500/80 bg-rose-950/20 text-rose-200'
                  }`}
                />

                {/* Inline Real-Time Regex Validation Status */}
                {!addressValidation.isBlank && (
                  <div
                    className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg border ${
                      addressValidation.isValid
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}
                  >
                    {addressValidation.isValid ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    )}
                    <span>{addressValidation.message}</span>
                  </div>
                )}
              </div>

              {/* 4. Real-Time Network Gas Fee Calculator & Net Calculation */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    Real-Time Network Gas Fee Calculator:
                  </span>
                  <span className="text-emerald-400 font-bold">
                    {currentNetworkConfig.isSubsidized
                      ? '$0.00 (100% Subsidized by Casino Vault)'
                      : `$${currentNetworkConfig.gasFeeUSD.toFixed(2)} USD`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-2">
                  <span>Expected Confirmation Block Time:</span>
                  <span className="text-slate-200">{currentNetworkConfig.estimatedTime}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-200 font-bold">Net Yield Credited to Recipient:</span>
                  <span className="text-base font-black text-amber-300">
                    ${netReceived.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* 5. 2FA Security Input Field */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>5. 2FA Security Authentication Code</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">Google / Authy TOTP</span>
                </div>

                <div className="flex gap-2">
                  <input
                    id="cashout-2fa-input"
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit TOTP (e.g., 849201)"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-amber-300 font-mono font-bold text-sm tracking-widest focus:outline-none focus:border-amber-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setTwoFactorCode('849201')}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono font-bold border border-white/10 cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>

              {/* Anti-Drain Safeguard: Master PIN Authorization (Required for >= $500) */}
              {isHighValue && (
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-400/40 space-y-2.5 font-mono">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      <span>6. Anti-Drain Master PIN (High-Volume ≥ $500)</span>
                    </label>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold">
                      REQUIRED
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    High-volume cashouts (≥ $500) require Master Anti-Drain Authorization PIN verification.
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      id="cashout-master-pin-input"
                      type="password"
                      maxLength={6}
                      value={masterPin}
                      onChange={(e) => setMasterPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Master PIN"
                      className={`flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border font-mono font-bold text-sm tracking-widest focus:outline-none transition ${
                        masterPin.trim() === '7731'
                          ? 'border-emerald-500 text-emerald-300 focus:border-emerald-400'
                          : 'border-white/15 text-slate-200 focus:border-amber-400'
                      }`}
                    />
                    <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
                      <ShieldCheck className="w-4 h-4" />
                      <span>HSM 2FA</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Instant Execution CTA */}
              <button
                id="cashout-execute-btn"
                onClick={handleExecuteCashout}
                disabled={
                  isSubmitting ||
                  parsedAmount < minRequired ||
                  parsedAmount > availableBalance ||
                  !addressValidation.isValid ||
                  (isHighValue && masterPin.trim() !== '7731')
                }
                className={`w-full py-4 rounded-xl font-mono font-bold text-sm tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-xl ${
                  parsedAmount >= minRequired &&
                  parsedAmount <= availableBalance &&
                  addressValidation.isValid &&
                  (!isHighValue || masterPin.trim() === '7731') &&
                  !isSubmitting
                    ? 'btn-tactile-gold shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.98]'
                    : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>BROADCASTING TO ON-CHAIN MEMPOOL...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-current" />
                    <span>
                      {currentLanguage === 'ar'
                        ? `تأكيد سحب الأرباح الفوري ($${parsedAmount.toFixed(2)})`
                        : `DISPATCH INSTANT CASHOUT ($${parsedAmount.toFixed(2)})`}
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
