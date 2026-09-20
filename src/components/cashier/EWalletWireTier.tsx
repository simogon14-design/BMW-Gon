import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import {
  Building2,
  Wallet,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  ArrowRight,
  Info,
  ExternalLink
} from 'lucide-react';

interface EWalletWireTierProps {
  onSuccessClose?: () => void;
}

interface EWalletItem {
  id: string;
  name: string;
  category: 'ewallet' | 'wire';
  badgeColor: string;
  feeText: string;
  minAmount: number;
  maxAmount: number;
  estTime: string;
  description: string;
}

const EWALLET_OPTIONS: EWalletItem[] = [
  {
    id: 'skrill',
    name: 'Skrill',
    category: 'ewallet',
    badgeColor: 'text-violet-400 border-violet-500/30 bg-violet-500/10',
    feeText: '0% Platform Fee',
    minAmount: 20,
    maxAmount: 20000,
    estTime: 'Instant (under 1 min)',
    description: 'Instant e-wallet deposit from your Skrill USD/EUR balance.',
  },
  {
    id: 'neteller',
    name: 'Neteller',
    category: 'ewallet',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    feeText: '0% Platform Fee',
    minAmount: 20,
    maxAmount: 20000,
    estTime: 'Instant (under 1 min)',
    description: 'Instant VIP transfer using Neteller secure digital wallet.',
  },
  {
    id: 'muchbetter',
    name: 'MuchBetter',
    category: 'ewallet',
    badgeColor: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    feeText: '0% Platform Fee',
    minAmount: 10,
    maxAmount: 15000,
    estTime: 'Instant (under 30 sec)',
    description: 'Award-winning mobile e-wallet with in-app biometric confirmation.',
  },
  {
    id: 'perfect_money',
    name: 'Perfect Money',
    category: 'ewallet',
    badgeColor: 'text-red-400 border-red-500/30 bg-red-500/10',
    feeText: '0% Platform Fee',
    minAmount: 25,
    maxAmount: 50000,
    estTime: 'Instant',
    description: 'Global electronic payment system for high-limit funding.',
  },
  {
    id: 'payeer',
    name: 'Payeer',
    category: 'ewallet',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    feeText: '0% Platform Fee',
    minAmount: 15,
    maxAmount: 30000,
    estTime: 'Instant',
    description: 'Multi-currency electronic wallet and payment gateway.',
  },
  {
    id: 'direct_wire',
    name: 'Direct Wire / SWIFT / SEPA',
    category: 'wire',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    feeText: 'Subsidized Incoming Fee',
    minAmount: 500,
    maxAmount: 250000,
    estTime: '1 - 2 Business Hours',
    description: 'Direct institutional bank wire to our Swiss / UAE custody accounts.',
  },
];

export const EWalletWireTier: React.FC<EWalletWireTierProps> = ({ onSuccessClose }) => {
  const { executeCashierDeposit, showToast } = useCasino();

  const [selectedMethod, setSelectedMethod] = useState<EWalletItem>(EWALLET_OPTIONS[0]);
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [accountEmail, setAccountEmail] = useState<string>('vip.player@aetherius.com');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleExecuteDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount < selectedMethod.minAmount) {
      showToast(`Minimum deposit for ${selectedMethod.name} is $${selectedMethod.minAmount}`);
      return;
    }

    executeCashierDeposit({
      method: selectedMethod.name,
      methodTier: 'ewallet_wire',
      amountUSD: depositAmount,
      currency: 'USD',
    });

    if (onSuccessClose) onSuccessClose();
  };

  return (
    <div className="space-y-5 text-left">
      {/* Gateway selection grid */}
      <div>
        <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
          Select E-Wallet or Institutional Wire Transfer:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {EWALLET_OPTIONS.map((opt) => {
            const isSelected = selectedMethod.id === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedMethod(opt)}
                className={`p-3 rounded-xl border flex flex-col items-start gap-1 transition cursor-pointer text-left ${
                  isSelected
                    ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                    {opt.category === 'wire' ? <Building2 className="w-3.5 h-3.5 text-amber-400" /> : <Wallet className="w-3.5 h-3.5 text-slate-400" />}
                    {opt.name}
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${opt.badgeColor}`}>
                    {opt.category.toUpperCase()}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">{opt.estTime}</span>
                <span className="text-[10px] text-emerald-400 font-mono">{opt.feeText}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Amount Preset Buttons */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
          <span>Deposit Amount (USD):</span>
          <span className="text-amber-300 font-mono">Min: ${selectedMethod.minAmount} • Max: ${selectedMethod.maxAmount.toLocaleString()}</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
          {[100, 500, 1000, 5000, 10000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setDepositAmount(amt)}
              className={`py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                depositAmount === amt
                  ? 'bg-amber-400 border-amber-300 text-black shadow-md'
                  : 'bg-black/50 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
              }`}
            >
              ${amt.toLocaleString()}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-sm">
            $
          </span>
          <input
            type="number"
            min={selectedMethod.minAmount}
            max={selectedMethod.maxAmount}
            value={depositAmount}
            onChange={(e) => setDepositAmount(Math.max(selectedMethod.minAmount, Number(e.target.value)))}
            className="w-full pl-8 pr-28 py-3 rounded-xl bg-black/60 border border-white/15 text-white font-mono font-bold text-base focus:outline-none focus:border-amber-400"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-emerald-400 flex items-center gap-1">
            = {depositAmount.toFixed(2)} USDT
          </span>
        </div>
      </div>

      {/* Direct Wire Instructions Card */}
      {selectedMethod.id === 'direct_wire' ? (
        <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/30 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> INSTITUTIONAL WIRE INSTRUCTIONS
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              SWIFT / SEPA / GCC RTGS
            </span>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Beneficiary Bank', val: 'Emirates NBD Bank PJSC / Zurich Private Custody' },
              { label: 'Beneficiary Name', val: 'Aetherius Sovereign Gaming Treasury FZ-LLC' },
              { label: 'IBAN / Account #', val: 'AE07 0260 0012 3456 7890 123' },
              { label: 'SWIFT / BIC Code', val: 'EBILAEADXXX' },
              { label: 'Mandatory Reference', val: `AETH-${Date.now().toString().slice(-6)}-VIP` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/80 border border-white/5">
                <div>
                  <span className="text-[10px] text-slate-500 block">{row.label}:</span>
                  <span className="text-slate-200 font-bold">{row.val}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(row.val, row.label)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {copiedField === row.label ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-lg bg-amber-400/5 border border-amber-400/15 flex items-start gap-2 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Always include your Mandatory Reference code in the bank transfer memo for automated ledger reconciliation.</span>
          </div>

          <button
            type="button"
            onClick={handleExecuteDeposit}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-mono font-extrabold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <span>CONFIRM WIRE DISPATCH (${depositAmount.toLocaleString()} USD)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* E-Wallet Form */
        <form onSubmit={handleExecuteDeposit} className="p-4 rounded-2xl bg-black/60 border border-amber-400/25 space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">
              Your {selectedMethod.name} Registered Email or Account ID:
            </label>
            <input
              type="text"
              value={accountEmail}
              onChange={(e) => setAccountEmail(e.target.value)}
              placeholder="e.g. user@gmail.com or 12345678"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-white/10 flex justify-between text-xs font-mono">
            <span className="text-slate-400">Net Credit to Platform Vault:</span>
            <span className="text-emerald-400 font-bold">{depositAmount.toFixed(2)} USDT</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-mono font-extrabold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <span>PROCEED TO {selectedMethod.name.toUpperCase()} REDIRECT (${depositAmount.toFixed(2)})</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
};
