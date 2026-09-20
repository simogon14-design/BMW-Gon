import React from 'react';
import { useCasino } from '../context/CasinoContext';
import { GoldenEagleCrest } from './GoldenEagleCrest';
import {
  ShieldCheck,
  Lock,
  Award,
  AlertTriangle,
  FileCheck2,
  ExternalLink,
  Zap,
  Globe
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { openProvablyFair, openSecurityModal } = useCasino();

  return (
    <footer className="w-full border-t border-white/10 bg-[#050811] text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        {/* Top Badges & Regulatory Seals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-200 font-mono">100% PROVABLY FAIR</p>
              <p className="text-[11px] text-slate-500">Public HMAC-SHA256 audits</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
            <Lock className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-200 font-mono">COLD VAULT HSM</p>
              <p className="text-[11px] text-slate-500">Multi-signature hardware</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
            <Award className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-200 font-mono">CURACAO LICENSED</p>
              <p className="text-[11px] text-slate-500">License #8048/JAZ Compliant</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5">
            <FileCheck2 className="w-6 h-6 text-purple-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-200 font-mono">ITECH LABS CERTIFIED</p>
              <p className="text-[11px] text-slate-500">RNG statistical verification</p>
            </div>
          </div>
        </div>

        {/* Links & Brand Description */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <GoldenEagleCrest size={32} glow={false} />
              <div>
                <span className="font-luxury font-bold text-base text-white tracking-wider uppercase block leading-none">
                  Aetherius Sovereign
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                  Betting Empire
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Aetherius Sovereign Betting Empire is an institutional-grade decentralized sports and casino betting empire. All outcomes are cryptographically deterministic and independently auditable using standard HMAC-SHA256 calculation engines.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono pt-1">
              <span>SSL 256-Bit TLS 1.3 Certified</span>
              <span>•</span>
              <button
                id="footer-open-auditor-btn"
                onClick={openProvablyFair}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Inspect Provably Fair Source
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-luxury font-bold text-slate-200 text-sm mb-3 uppercase tracking-wider">
              Gaming Arenas
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-amber-400 transition cursor-pointer">Quantum Crash Protocol</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Imperial Cyber Roulette</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Neon Dynasty MegaSpin</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Salon Privé VIP Blackjack</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Provably Fair Plinko Matrix</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-luxury font-bold text-slate-200 text-sm mb-3 uppercase tracking-wider">
              Security & Fair Play
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={openProvablyFair} className="hover:text-amber-400 transition cursor-pointer">
                  Provably Fair Calculator
                </button>
              </li>
              <li>
                <button onClick={openSecurityModal} className="hover:text-amber-400 transition cursor-pointer">
                  Cybersecurity Center & 2FA
                </button>
              </li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Cold Storage Architecture</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Responsible Gaming (18+)</span></li>
              <li><span className="hover:text-amber-400 transition cursor-pointer">Privacy & Anti-Phishing Guide</span></li>
            </ul>
          </div>
        </div>

        {/* Responsible Gaming & Copyright Warning */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold font-mono">
              18+
            </span>
            <span>Gambling involves financial risk. Play responsibly and within your limits.</span>
          </div>
          <div>
            <span>© 2026 Aetherius iGaming Protocol. All cryptographic rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
