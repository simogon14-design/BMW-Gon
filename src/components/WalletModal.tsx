import React, { useState } from 'react';
import { useCasino } from '../context/CasinoContext';
import { CryptoPaymentTier } from './cashier/CryptoPaymentTier';
import { FiatCardsTier } from './cashier/FiatCardsTier';
import { EWalletWireTier } from './cashier/EWalletWireTier';
import { WithdrawalEngine } from './cashier/WithdrawalEngine';
import { TransactionHistoryLedger } from './cashier/TransactionHistoryLedger';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  ShieldCheck,
  Lock,
  Zap,
  CreditCard,
  Building2,
  Sparkles,
  Coins
} from 'lucide-react';

export const WalletModal: React.FC = () => {
  const {
    isWalletModalOpen,
    walletModalTab,
    closeWalletModal,
    balances,
    transactions,
    currentLanguage,
    translations: t,
  } = useCasino();

  const [activeMainTab, setActiveMainTab] = useState<'deposit' | 'withdraw' | 'transactions'>(
    walletModalTab || 'deposit'
  );

  React.useEffect(() => {
    if (walletModalTab) {
      setActiveMainTab(walletModalTab);
    }
  }, [walletModalTab, isWalletModalOpen]);

  const [depositChannel, setDepositChannel] = useState<'crypto' | 'cards_fiat' | 'ewallet_wire'>('crypto');

  if (!isWalletModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-black/45 backdrop-blur-2xl overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-3xl rounded-2xl cyber-glass-card border border-amber-400/40 shadow-[0_0_60px_rgba(212,175,55,0.2)] overflow-hidden flex flex-col my-auto text-left backdrop-blur-2xl"
        >
          {/* Top Decorative Border Highlight */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

          {/* Modal Header */}
          <div className="px-5 sm:px-6 py-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/35 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-luxury font-black text-lg text-white tracking-wide">
                    {currentLanguage === 'ar' ? 'الخزينة الملوكية المشفرة' : 'TREASURY CASHIER & BANKING HUB'}
                  </h3>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    {currentLanguage === 'ar' ? 'سيولة فورية معتمدة' : 'V3.8 MULTI-GATEWAY'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  {currentLanguage === 'ar'
                    ? 'احتياطي بارد مؤسسي • تسوية كتل فورية • رسوم غاز مجانية 100%'
                    : 'Cold Storage Reserves • Instant Settlements • Zero Gas Subsidy'}
                </p>
              </div>
            </div>

            {/* Right Header Status & Close */}
            <div className="flex items-center gap-3 justify-between sm:justify-end">
              {/* Security AML Shield Badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                <Lock className="w-3 h-3" />
                <span className="font-bold">100% Encrypted SSL & Vault Secured</span>
              </div>

              <button
                id="close-cashier-modal-btn"
                type="button"
                onClick={closeWalletModal}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Vault Balance Overview Strip */}
          <div className="px-5 sm:px-6 py-2.5 bg-[#0a101d]/35 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Total Liquid Vault Holdings:</span>
              <span className="text-amber-300 font-bold text-sm">
                ${balances.USDT.toLocaleString()} USDT
              </span>
            </div>

            <div className="flex items-center gap-4 text-slate-400 text-[11px]">
              <span>BTC: <strong className="text-white">{balances.BTC.toFixed(3)}</strong></span>
              <span>ETH: <strong className="text-white">{balances.ETH.toFixed(2)}</strong></span>
              <span>SOL: <strong className="text-white">{balances.SOL.toFixed(1)}</strong></span>
            </div>
          </div>

          {/* Primary Navigation Tabs */}
          <div className="px-5 sm:px-6 pt-3 pb-1 border-b border-white/10 flex items-center gap-2 bg-slate-950/25 backdrop-blur-sm">
            <button
              id="cashier-tab-deposit"
              type="button"
              onClick={() => setActiveMainTab('deposit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                activeMainTab === 'deposit'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                  : 'bg-black/30 border-white/5 text-slate-400 hover:text-white hover:border-white/15'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
              <span>{currentLanguage === 'ar' ? 'تأكيد الإيداع والشحن الفوري' : 'DEPOSIT CASHIER'}</span>
            </button>

            <button
              id="cashier-tab-withdraw"
              type="button"
              onClick={() => setActiveMainTab('withdraw')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                activeMainTab === 'withdraw'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                  : 'bg-black/30 border-white/5 text-slate-400 hover:text-white hover:border-white/15'
              }`}
            >
              <ArrowUpRight className="w-4 h-4 text-rose-400" />
              <span>{currentLanguage === 'ar' ? 'سحب الأرباح الفوري' : 'INSTANT WITHDRAWAL'}</span>
            </button>

            <button
              id="cashier-tab-transactions"
              type="button"
              onClick={() => setActiveMainTab('transactions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                activeMainTab === 'transactions'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                  : 'bg-black/30 border-white/5 text-slate-400 hover:text-white hover:border-white/15'
              }`}
            >
              <History className="w-4 h-4 text-amber-400" />
              <span>{currentLanguage === 'ar' ? 'سجل العمليات والتدقيق' : 'TRANSACTION AUDIT LEDGER'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] text-slate-300">
                {transactions.length}
              </span>
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto max-h-[68vh]">
            {/* DEPOSIT FLOW */}
            {activeMainTab === 'deposit' && (
              <div className="space-y-4">
                {/* Deposit Sub-Tiers Selector */}
                <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-black/60 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setDepositChannel('crypto')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                      depositChannel === 'crypto'
                        ? 'bg-amber-400 text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>A. CRYPTO & WEB3 GATEWAYS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDepositChannel('cards_fiat')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                      depositChannel === 'cards_fiat'
                        ? 'bg-amber-400 text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>B. CARDS & FIAT ON-RAMPS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDepositChannel('ewallet_wire')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center gap-2 ${
                      depositChannel === 'ewallet_wire'
                        ? 'bg-amber-400 text-black shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>C. E-WALLETS & DIRECT WIRE</span>
                  </button>
                </div>

                {/* Sub-Tier Content */}
                {depositChannel === 'crypto' && (
                  <CryptoPaymentTier onSuccessClose={closeWalletModal} />
                )}
                {depositChannel === 'cards_fiat' && (
                  <FiatCardsTier onSuccessClose={closeWalletModal} />
                )}
                {depositChannel === 'ewallet_wire' && (
                  <EWalletWireTier onSuccessClose={closeWalletModal} />
                )}
              </div>
            )}

            {/* WITHDRAWAL FLOW */}
            {activeMainTab === 'withdraw' && (
              <WithdrawalEngine onSuccessClose={closeWalletModal} />
            )}

            {/* TRANSACTION AUDIT LEDGER */}
            {activeMainTab === 'transactions' && (
              <TransactionHistoryLedger />
            )}
          </div>

          {/* Modal Footer Security Guarantee */}
          <div className="px-5 sm:px-6 py-3 border-t border-white/10 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>SOC-2 Type II Certified • FinCEN Registered MSB • Zero-Knowledge HSM Vaults</span>
            </div>
            <span className="text-amber-400/80">Proof of Reserves: 100% Backed (1:1 Ratio)</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
