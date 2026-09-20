import React, { useState, useEffect } from 'react';
import { useCasino } from '../context/CasinoContext';
import {
  verifyProvablyFairOutcome,
  generateRandomSeed,
  sha256
} from '../utils/cryptoFair';
import { ProvablyFairCalculation } from '../types';
import {
  ShieldCheck,
  RotateCw,
  Copy,
  Check,
  Code,
  Lock,
  Cpu,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Gamepad2,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

export const ProvablyFairHub: React.FC = () => {
  const { showToast, setNavTab, openGame } = useCasino();

  // Verification State
  const [serverSeed, setServerSeed] = useState(
    '7b9c41f92e8412dae418491038e2194b159f81a702ec4821b0e91c78491d92a1'
  );
  const [clientSeed, setClientSeed] = useState('Aetherius_VIP_ClientSeed_4492');
  const [nonce, setNonce] = useState(1042);
  const [isVerifying, setIsVerifying] = useState(false);
  const [calculationResult, setCalculationResult] = useState<ProvablyFairCalculation | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const runVerification = async () => {
    setIsVerifying(true);
    try {
      const res = await verifyProvablyFairOutcome(serverSeed, clientSeed, nonce);
      setCalculationResult(res);
    } catch {
      // Handled silently
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    runVerification();
  }, []);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRandomizeSeeds = () => {
    setServerSeed(generateRandomSeed(32));
    setClientSeed(`Client_${generateRandomSeed(8)}`);
    setNonce((prev) => prev + 1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Luxury Royal Obsidian Header */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#080E18] via-[#0D1628] to-[#080E18] border-2 border-amber-400/40 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_#FFD700]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                CRYPTOGRAPHIC INTEGRITY GUARANTEE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 font-mono text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                HMAC SHA-256 Ledger: PRE-COMMITTED
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-luxury font-black text-slate-100 tracking-wide">
              PROVABLY FAIR VERIFICATION SUITE
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              100% auditable mathematical fairness. The outcome of every single round in Crash, Roulette, and Slots is pre-determined cryptographically before any bet is accepted, rendering manipulation mathematically impossible.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => openGame('crash')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-mono font-bold text-xs transition cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-400/20"
            >
              <Gamepad2 className="w-4 h-4 fill-black" />
              <span>Play Royal Crash</span>
            </button>
            <button
              onClick={() => setNavTab('arenas')}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold transition cursor-pointer"
            >
              Explore Arenas
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Verification Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Seed Input Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-[#090F1D] border-2 border-amber-400/30 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-luxury font-bold text-slate-100 flex items-center gap-2">
                <Code className="w-4 h-4 text-amber-400" />
                Audit Parameters
              </h3>
              <button
                onClick={handleRandomizeSeeds}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 text-xs font-mono transition cursor-pointer flex items-center gap-1.5 border border-white/10"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Randomize Seeds</span>
              </button>
            </div>

            {/* Server Seed */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>Server Seed (Revealed Post-Round)</span>
                <button
                  onClick={() => handleCopy(serverSeed, 'Server Seed')}
                  className="text-amber-400 hover:text-amber-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'Server Seed' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'Server Seed' ? 'Copied' : 'Copy'}</span>
                </button>
              </label>
              <input
                type="text"
                value={serverSeed}
                onChange={(e) => setServerSeed(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-slate-200 font-mono text-xs focus:border-amber-400 outline-none"
              />
            </div>

            {/* Client Seed */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                <span>Client Seed (Player Controlled)</span>
                <button
                  onClick={() => handleCopy(clientSeed, 'Client Seed')}
                  className="text-amber-400 hover:text-amber-300 text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'Client Seed' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedField === 'Client Seed' ? 'Copied' : 'Copy'}</span>
                </button>
              </label>
              <input
                type="text"
                value={clientSeed}
                onChange={(e) => setClientSeed(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-slate-200 font-mono text-xs focus:border-amber-400 outline-none"
              />
            </div>

            {/* Nonce */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Nonce (Round Counter)</label>
              <input
                type="number"
                value={nonce}
                onChange={(e) => setNonce(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-slate-200 font-mono text-xs focus:border-amber-400 outline-none"
              />
            </div>

            <button
              onClick={runVerification}
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-mono font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-400/25 disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>Compute HMAC SHA-256 Proof</span>
            </button>
          </div>
        </div>

        {/* Right Column: Computed Verification Result */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-[#090F1D] border-2 border-amber-400/30 space-y-5 shadow-xl">
            <h3 className="text-base font-luxury font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Cryptographic Computation Proof
            </h3>

            {calculationResult ? (
              <div className="space-y-4">
                {/* Result Card */}
                <div className="p-4 rounded-xl bg-black/50 border border-emerald-500/30 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400 uppercase">Crash Multiplier Result</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold">
                      VERIFIED PROVABLE
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-mono-num text-amber-300">
                    {calculationResult.calculatedMultiplier.toFixed(2)}x
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-3 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Server Seed Pre-Commitment Hash (SHA-256):</span>
                    <span className="text-amber-400 break-all">{calculationResult.serverSeedHash}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">HMAC-SHA256 Combined Hash:</span>
                    <span className="text-emerald-400 break-all">{calculationResult.hmacSha256Result}</span>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex justify-between">
                    <span className="text-slate-400">Equivalent Roulette Pocket:</span>
                    <span className="text-slate-100 font-bold">{calculationResult.decimalEquivalent % 37} (European 0-36)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 font-mono text-xs">
                Computing cryptographic proofs...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
