import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  Lock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface FiatCardsTierProps {
  onSuccessClose?: () => void;
}

type FiatChannel = 'card' | 'apple_google' | 'moonpay_transak';

export const FiatCardsTier: React.FC<FiatCardsTierProps> = ({ onSuccessClose }) => {
  const { executeCashierDeposit, showToast } = useCasino();

  const [activeChannel, setActiveChannel] = useState<FiatChannel>('card');
  const [fiatAmount, setFiatAmount] = useState<number>(250);

  // Card fields
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState<string>('ALEXANDER V. ROTHSCHILD');
  const [cardExpiry, setCardExpiry] = useState<string>('09/29');
  const [cardCvv, setCardCvv] = useState<string>('888');

  // Moonpay / Transak provider
  const [onrampProvider, setOnrampProvider] = useState<'moonpay' | 'transak'>('moonpay');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleDepositCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (fiatAmount < 20) {
      showToast('Minimum card deposit is $20.00 USD');
      return;
    }
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      executeCashierDeposit({
        method: activeChannel === 'card' ? 'Visa / Mastercard (Stripe PCI-L1)' : activeChannel === 'apple_google' ? 'Apple Pay Direct' : `${onrampProvider.toUpperCase()} On-Ramp`,
        methodTier: 'cards_fiat',
        amountUSD: fiatAmount,
        currency: 'USD',
      });
      if (onSuccessClose) onSuccessClose();
    }, 1200);
  };

  return (
    <div className="space-y-5 text-left">
      {/* Channel Switcher */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => setActiveChannel('card')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
            activeChannel === 'card'
              ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.2)]'
              : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-1 text-xs font-mono font-bold">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Visa / Mastercard</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Instant 3D-Secure 2.0</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveChannel('apple_google')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
            activeChannel === 'apple_google'
              ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.2)]'
              : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-1 text-xs font-mono font-bold">
            <Smartphone className="w-4 h-4 text-sky-400" />
            <span>Apple / Google Pay</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">1-Touch Biometrics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveChannel('moonpay_transak')}
          className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
            activeChannel === 'moonpay_transak'
              ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,215,0,0.2)]'
              : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
          }`}
        >
          <div className="flex items-center gap-1 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>MoonPay / Transak</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Direct Fiat On-Ramp</span>
        </button>
      </div>

      {/* Preset Amount Selector */}
      <div>
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
          <span>Deposit Amount (USD):</span>
          <span className="text-amber-300 font-bold">Exchange Rate: $1.00 USD = 1.00 USDT (0% Spread)</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
          {[50, 100, 250, 500, 1000, 2500].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => setFiatAmount(amt)}
              className={`py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                fiatAmount === amt
                  ? 'bg-amber-400 border-amber-300 text-black shadow-md'
                  : 'bg-black/50 border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold text-sm">
            $
          </span>
          <input
            type="number"
            min="20"
            max="25000"
            value={fiatAmount}
            onChange={(e) => setFiatAmount(Math.max(20, Number(e.target.value)))}
            className="w-full pl-8 pr-28 py-3 rounded-xl bg-black/60 border border-white/15 text-white font-mono font-bold text-base focus:outline-none focus:border-amber-400"
          />
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-emerald-400 flex items-center gap-1">
            = {fiatAmount.toFixed(2)} USDT
          </span>
        </div>
      </div>

      {/* Card Form */}
      {activeChannel === 'card' && (
        <form onSubmit={handleDepositCard} className="space-y-3.5 p-4 rounded-2xl bg-black/60 border border-amber-400/25">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono text-slate-300 font-bold">CARD INFORMATION</span>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>256-Bit Encrypted Vault</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1">
              CARD NUMBER
            </label>
            <div className="relative">
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4000 1234 5678 9010"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400 tracking-wider"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-400 font-bold border border-blue-500/40">
                  VISA
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-600/30 text-rose-400 font-bold border border-rose-500/40">
                  MC
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1">
                CARDHOLDER NAME
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400 uppercase"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  EXPIRY
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs text-center focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  placeholder="•••"
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono text-xs text-center focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-mono font-extrabold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                AUTHENTICATING 3D-SECURE 2.0...
              </span>
            ) : (
              <>
                <span>CONFIRM & DEPOSIT ${fiatAmount.toFixed(2)} USD</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* Apple / Google Pay */}
      {activeChannel === 'apple_google' && (
        <div className="p-5 rounded-2xl bg-black/60 border border-amber-400/25 space-y-4 text-center">
          <div className="w-14 h-14 rounded-full bg-slate-900 border border-sky-400/40 mx-auto flex items-center justify-center text-sky-400">
            <Smartphone className="w-7 h-7" />
          </div>

          <div>
            <h4 className="font-luxury font-black text-white text-base">
              FAST BIOMETRIC CHECKOUT
            </h4>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Authenticate instantly using FaceID, TouchID, or Google Wallet with zero card entry.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-white/10 flex justify-between text-xs font-mono">
            <span className="text-slate-400">Charge Total:</span>
            <span className="text-emerald-400 font-bold">${fiatAmount.toFixed(2)} USD</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={handleDepositCard}
              className="py-3 rounded-xl bg-white hover:bg-slate-100 text-black font-sans font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-95"
            >
              <span> Pay</span>
              <span className="font-mono text-[11px] font-normal">(${fiatAmount})</span>
            </button>

            <button
              type="button"
              onClick={handleDepositCard}
              className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-white/20 font-sans font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-95"
            >
              <span className="text-blue-400">G</span>
              <span>Pay</span>
              <span className="font-mono text-[11px] font-normal">(${fiatAmount})</span>
            </button>
          </div>
        </div>
      )}

      {/* MoonPay / Transak */}
      {activeChannel === 'moonpay_transak' && (
        <div className="p-5 rounded-2xl bg-black/60 border border-amber-400/25 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOnrampProvider('moonpay')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                  onrampProvider === 'moonpay'
                    ? 'bg-purple-600/30 border-purple-400 text-purple-300'
                    : 'bg-black/40 border-white/10 text-slate-400'
                }`}
              >
                MoonPay On-Ramp
              </button>
              <button
                type="button"
                onClick={() => setOnrampProvider('transak')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                  onrampProvider === 'transak'
                    ? 'bg-blue-600/30 border-blue-400 text-blue-300'
                    : 'bg-black/40 border-white/10 text-slate-400'
                }`}
              >
                Transak Gateway
              </button>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Official Licensed Partner
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>You Pay (Fiat):</span>
              <span className="text-white font-bold">${fiatAmount.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>You Receive:</span>
              <span className="text-emerald-400 font-bold">{fiatAmount.toFixed(2)} USDT (TRC-20)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>KYC Level:</span>
              <span className="text-amber-400">Instant Tier 1 (Up to $5,000 without docs)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Delivery Time:</span>
              <span className="text-white">Under 2 minutes</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDepositCard}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-extrabold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <span>LAUNCH {onrampProvider.toUpperCase()} SECURE WIDGET</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
