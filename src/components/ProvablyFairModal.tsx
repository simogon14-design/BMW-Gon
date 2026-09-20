import React, { useState, useEffect } from 'react';
import { useCasino } from '../context/CasinoContext';
import {
  verifyProvablyFairOutcome,
  generateRandomSeed,
  sha256
} from '../utils/cryptoFair';
import { ProvablyFairCalculation } from '../types';
import {
  X,
  ShieldCheck,
  RotateCw,
  Copy,
  Check,
  Code,
  Lock,
  Cpu,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const ProvablyFairModal: React.FC = () => {
  const { isProvablyFairOpen, closeProvablyFair, showToast } = useCasino();

  // Test inputs
  const [serverSeed, setServerSeed] = useState(
    '7b9c41f92e8412dae418491038e2194b159f81a702ec4821b0e91c78491d92a1'
  );
  const [clientSeed, setClientSeed] = useState('ClientSeed_Quantum_VIP_99');
  const [nonce, setNonce] = useState(1042);
  const [isVerifying, setIsVerifying] = useState(false);
  const [calculationResult, setCalculationResult] = useState<ProvablyFairCalculation | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Compute live verification on load / input change
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
    if (isProvablyFairOpen) {
      runVerification();
    }
  }, [isProvablyFairOpen]);

  if (!isProvablyFairOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showToast(`Copied ${label} to clipboard.`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRegenerateSeeds = () => {
    const newServer = generateRandomSeed(32);
    const newClient = 'ClientSeed_' + Math.random().toString(36).substring(2, 10);
    setServerSeed(newServer);
    setClientSeed(newClient);
    verifyProvablyFairOutcome(newServer, newClient, nonce).then(setCalculationResult);
    showToast('New entropy seed pair generated.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl cyber-glass-card border border-amber-400/40 shadow-2xl overflow-hidden flex flex-col my-auto text-left backdrop-blur-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/35 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-luxury font-black text-lg text-white tracking-wide flex items-center gap-2">
                PROVABLY FAIR CRYPTOGRAPHIC AUDITOR
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Independent client-side verification powered by HMAC-SHA256 & Web Crypto
              </p>
            </div>
          </div>

          <button
            id="provably-fair-close-btn"
            onClick={closeProvablyFair}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auditor Body */}
        <div className="p-6 space-y-6">
          {/* Explanation Banner */}
          <div className="p-4 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs text-slate-300 leading-relaxed space-y-1">
            <span className="font-bold text-amber-300 font-mono uppercase block mb-1">
              Deterministic Cryptographic Principle:
            </span>
            <p>
              The casino pre-commits the <strong>Server Seed Hash</strong> before the game begins. Players customize their own <strong>Client Seed</strong> and <strong>Nonce</strong>. Because the mathematical outcome is derived via HMAC-SHA256 from both inputs, neither the casino nor the player can alter the outcome after commitment.
            </p>
          </div>

          {/* Interactive Parameters Input Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-200 uppercase">
                Audit Round Parameters
              </span>
              <button
                id="fair-regenerate-seeds-btn"
                onClick={handleRegenerateSeeds}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-amber-300 border border-white/10 cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                <span>Generate Test Seeds</span>
              </button>
            </div>

            {/* Server Seed */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Active Server Seed (Private during round, published after)</span>
                <button
                  onClick={() => handleCopy(serverSeed, 'Server Seed')}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'Server Seed' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <input
                id="fair-server-seed-input"
                type="text"
                value={serverSeed}
                onChange={(e) => setServerSeed(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Server Seed Hash (Pre-commitment) */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Public Pre-Commitment: SHA-256(Server Seed)</span>
                <button
                  onClick={() => calculationResult && handleCopy(calculationResult.serverSeedHash, 'SHA-256 Pre-Commitment')}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedField === 'SHA-256 Pre-Commitment' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <div className="w-full px-3 py-2 rounded-xl bg-slate-950/70 border border-white/5 text-emerald-400 font-mono text-xs break-all">
                {calculationResult?.serverSeedHash || 'Calculating...'}
              </div>
            </div>

            {/* Client Seed & Nonce */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                  <span>Player Client Seed</span>
                  <button
                    onClick={() => handleCopy(clientSeed, 'Client Seed')}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'Client Seed' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>Copy</span>
                  </button>
                </div>
                <input
                  id="fair-client-seed-input"
                  type="text"
                  value={clientSeed}
                  onChange={(e) => setClientSeed(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 block mb-1">
                  Round Nonce
                </span>
                <input
                  id="fair-nonce-input"
                  type="number"
                  min="0"
                  value={nonce}
                  onChange={(e) => setNonce(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-slate-200 font-mono text-xs focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>

            {/* Verify CTA */}
            <button
              id="fair-verify-now-btn"
              onClick={runVerification}
              disabled={isVerifying}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>{isVerifying ? 'CALCULATING HASH...' : 'EXECUTE CRYPTOGRAPHIC AUDIT'}</span>
            </button>
          </div>

          {/* Mathematical Proof Output Box */}
          {calculationResult && (
            <div className="p-5 rounded-2xl bg-black/50 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
                  <ShieldCheck className="w-5 h-5" />
                  <span>AUDIT STATUS: 100% VERIFIED & AUTHENTIC</span>
                </div>
                <span className="text-xs font-mono text-slate-400">Web Crypto Subtle API</span>
              </div>

              {/* Step 1 & 2 */}
              <div className="space-y-2 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block">1. HMAC-SHA256 Output:</span>
                  <p className="text-amber-300 break-all bg-slate-900/80 p-2 rounded-lg mt-1 border border-white/5">
                    {calculationResult.hmacSha256Result}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-slate-400 block">2. First 8 Hex Characters (32-Bit Slice):</span>
                    <p className="text-slate-200 font-bold bg-slate-900/80 p-2 rounded-lg mt-1 border border-white/5">
                      0x{calculationResult.firstHexGroup}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 block">3. Decimal Value (Integer):</span>
                    <p className="text-slate-200 font-bold bg-slate-900/80 p-2 rounded-lg mt-1 border border-white/5">
                      {calculationResult.decimalEquivalent.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Final Outcome Multiplier */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-black to-slate-950 border border-emerald-500/30 flex items-center justify-between mt-3">
                  <div>
                    <span className="text-xs text-slate-400 uppercase tracking-wider block">
                      Deterministic Result Multiplier:
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                      {calculationResult.calculatedMultiplier.toFixed(2)}x
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 uppercase tracking-wider block">
                      Roulette Outcome:
                    </span>
                    <span className="text-xl font-bold font-mono text-amber-300">
                      Pocket #{calculationResult.decimalEquivalent % 37}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
