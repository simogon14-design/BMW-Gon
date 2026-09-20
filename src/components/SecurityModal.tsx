import React, { useState } from 'react';
import { useCasino } from '../context/CasinoContext';
import {
  ShieldCheck,
  X,
  Key,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Laptop,
  Trash2,
  Lock,
  Copy,
  Check,
  Eye,
  EyeOff,
  Activity,
  Server,
  Zap,
  Globe,
  Radio,
  Cpu,
  ShieldAlert,
  Database,
  Hash,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const SecurityModal: React.FC = () => {
  const {
    isSecurityModalOpen,
    closeSecurityModal,
    securitySettings,
    toggle2FA,
    toggleHardwareKey,
    terminateSession,
    antiAbuseStatus,
    ddosThreatStatus,
    blockedThreatLogs,
    triggerSecurityThreatPurge,
    treasuryMetrics,
    openProvablyFair
  } = useCasino();

  type SecTab = 'ddos' | 'sybil' | 'fairness' | 'hsm' | 'auth';
  const [activeTab, setActiveTab] = useState<SecTab>('ddos');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  if (!isSecurityModalOpen) return null;

  const mockTOTPSecret = 'JBSWY3DPEHPK3PXP';

  const handleCopySecret = () => {
    navigator.clipboard.writeText(mockTOTPSecret);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleManualPurge = () => {
    setIsPurging(true);
    setTimeout(() => {
      triggerSecurityThreatPurge();
      setIsPurging(false);
    }, 600);
  };

  // Calculations for HSM reserves
  const coldReservesUSD = treasuryMetrics.houseVaultReservesUSD;
  const hotBufferUSD = Math.round(coldReservesUSD * 0.016); // 1.6% in hot buffer for instant cashouts
  const coldVaultUSD = coldReservesUSD - hotBufferUSD;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/45 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl cyber-glass-card border border-emerald-500/40 shadow-2xl overflow-hidden flex flex-col my-auto text-left max-h-[92vh] backdrop-blur-2xl">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/35 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-luxury font-black text-lg text-white tracking-wide">
                  CYBERSECURITY & ANTI-FRAUD COMMAND CENTER
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  DEFENSE GRADE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Real-Time DDoS Scrubbing • Sybil Defense • SHA-256 Fairness • HSM Cold Vault Reserves
              </p>
            </div>
          </div>

          <button
            id="security-modal-close-btn"
            onClick={closeSecurityModal}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 bg-black/50 px-4 sm:px-6 pt-2 overflow-x-auto scrollbar-none gap-1 sm:gap-2">
          <button
            id="sec-tab-ddos"
            onClick={() => setActiveTab('ddos')}
            className={`px-3.5 py-3 text-xs font-mono font-bold border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'ddos'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>DDoS Mitigation Gauge</span>
          </button>

          <button
            id="sec-tab-sybil"
            onClick={() => setActiveTab('sybil')}
            className={`px-3.5 py-3 text-xs font-mono font-bold border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'sybil'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Sybil & Bot Defense ({blockedThreatLogs.length})</span>
          </button>

          <button
            id="sec-tab-fairness"
            onClick={() => setActiveTab('fairness')}
            className={`px-3.5 py-3 text-xs font-mono font-bold border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'fairness'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>SHA-256 Provably Fair</span>
          </button>

          <button
            id="sec-tab-hsm"
            onClick={() => setActiveTab('hsm')}
            className={`px-3.5 py-3 text-xs font-mono font-bold border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hsm'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>HSM Cold Vault</span>
          </button>

          <button
            id="sec-tab-auth"
            onClick={() => setActiveTab('auth')}
            className={`px-3.5 py-3 text-xs font-mono font-bold border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'auth'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-500/5'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>2FA & Sessions</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
          {/* TAB 1: DDOS MITIGATION GAUGE & LIVE NETWORK SCRUBBING */}
          {activeTab === 'ddos' && (
            <div className="space-y-6">
              {/* Primary Gauge Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Gauge Metric 1: Capacity */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Scrubbing Capacity</span>
                    <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="my-2">
                    <div className="text-2xl font-black font-mono text-emerald-300">
                      {ddosThreatStatus.currentScrubCapacityTbps} <span className="text-sm font-normal text-slate-400">/ {ddosThreatStatus.maxScrubCapacityTbps} Tbps</span>
                    </div>
                    {/* Linear Gauge Progress Bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${(ddosThreatStatus.currentScrubCapacityTbps / ddosThreatStatus.maxScrubCapacityTbps) * 100}%` }}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-emerald-400/80">
                    Anycast Border Gateway Protocol Active
                  </p>
                </div>

                {/* Gauge Metric 2: Deflection Rate */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Deflection Rate</span>
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="my-2">
                    <div className="text-2xl font-black font-mono text-blue-300">
                      {ddosThreatStatus.attackDeflectionRatePct}%
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '99.9%' }} />
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-blue-400/80">
                    0 Successful Breaches in 365 Days
                  </p>
                </div>

                {/* Gauge Metric 3: Packet Rate */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Ingress Packet Rate</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="my-2">
                    <div className="text-2xl font-black font-mono text-amber-300">
                      {ddosThreatStatus.ingressPacketRateKpps} <span className="text-sm font-normal text-slate-400">kpps</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-amber-400/80">
                    L3 / L4 / L7 Deep Packet Inspection
                  </p>
                </div>

                {/* Gauge Metric 4: Edge Latency */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Edge Latency</span>
                    <Globe className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="my-2">
                    <div className="text-2xl font-black font-mono text-purple-300">
                      {ddosThreatStatus.latencyMs} <span className="text-sm font-normal text-slate-400">ms</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                  <p className="text-[11px] font-mono text-purple-400/80">
                    High-Frequency Financial Transit
                  </p>
                </div>
              </div>

              {/* Anycast Scrubbing Nodes Table & Diagnostic Action */}
              <div className="p-5 rounded-xl bg-slate-950/80 border border-white/10 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <Server className="w-4 h-4 text-emerald-400" />
                      Global Anycast DDoS Scrubbing Nodes
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Multi-region volumetric filtering centers with hardware-accelerated eBPF packet drop.
                    </p>
                  </div>

                  <button
                    id="sec-trigger-purge-btn"
                    onClick={handleManualPurge}
                    disabled={isPurging}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPurging ? 'animate-spin' : ''}`} />
                    <span>{isPurging ? 'Scrubbing Threats...' : 'Trigger Threat Diagnostic'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ddosThreatStatus.activeNodes.map((node, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-lg bg-slate-900 border border-white/5 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-xs font-bold font-mono text-white">{node.name}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">{node.city}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-300">
                          {node.scrubLoadPct}% Load
                        </span>
                        <p className="text-[10px] text-slate-500 font-mono">Status: {node.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYBIL ATTACK & BOT DEFENSE LOG */}
          {activeTab === 'sybil' && (
            <div className="space-y-6">
              {/* Sybil Defense Overview Card */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">
                      Active Sybil Defense & Device Attestation
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                      SCORE: {antiAbuseStatus.sybilDefenseScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Device Fingerprint: <span className="text-slate-300 font-mono">{antiAbuseStatus.deviceFingerprintHash.slice(0, 16)}...</span>
                  </p>
                  <p className="text-xs text-slate-400 font-mono">
                    Single-IP Binding: <span className="text-emerald-400 font-bold">ENFORCED</span> • Hardware HSM Signature: <span className="text-emerald-400 font-bold">VERIFIED</span>
                  </p>
                </div>

                <div className="px-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-right shrink-0">
                  <div className="text-xs font-mono text-slate-400">Total Malicious Attacks Blocked</div>
                  <div className="text-xl font-bold font-mono text-rose-400">148,924</div>
                </div>
              </div>

              {/* Live Blocked Malicious IPs Feed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Live Blocked Malicious IPs & Attack Log
                  </span>
                  <span>Automated Real-Time Ingress Filter</span>
                </div>

                <div className="space-y-2.5">
                  {blockedThreatLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono hover:border-white/20 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          <ShieldAlert className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white tracking-wider">{log.ip}</span>
                            <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 text-[10px]">
                              [{log.countryCode}] {log.countryName}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[11px] mt-0.5">
                            Vector: <span className="text-amber-300">{log.attackVector}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            log.status === 'BLOCKED'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SHA-256 PROVABLY FAIR STATUS */}
          {activeTab === 'fairness' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-amber-400/30 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                    <h4 className="text-sm font-bold text-amber-300 font-mono">
                      SHA-256 HMAC CRYPTOGRAPHIC PRE-COMMITMENT
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Every wager, multiplier curve, and roulette spin outcome is generated via SHA-256 HMAC hash commitments before bets are accepted. The casino cannot manipulate outcome seeds mid-round.
                  </p>
                </div>

                <button
                  id="sec-open-provably-fair-tool"
                  onClick={() => {
                    closeSecurityModal();
                    openProvablyFair();
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Verifier</span>
                </button>
              </div>

              {/* Seed Verification Inspector */}
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Active Server Seed (SHA-256 Pre-committed Hash):</span>
                    <span className="text-emerald-400 font-bold text-[10px]">PRE-COMMITTED</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/10 text-emerald-300 text-xs break-all">
                    e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Your Client Seed (Configurable Entropy):</span>
                    <span className="text-blue-400 font-bold text-[10px]">CLIENT AUTHORIZED</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/10 text-blue-300 text-xs break-all">
                    aetherius_client_entropy_998472019
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Nonce Counter:</span>
                    <span className="text-amber-400 font-bold text-[10px]">SEQUENTIAL</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-white/10 text-amber-300 text-xs">
                    Round #4,921 (Increments by 1 on each wager)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: HSM COLD VAULT RESERVES STATUS */}
          {activeTab === 'hsm' && (
            <div className="space-y-6">
              {/* Cold Vault Overview */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-blue-500/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-blue-400" />
                      <h4 className="text-base font-bold text-white font-mono">
                        HARDWARE SECURITY MODULE (HSM) VAULT RESERVES
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      FIPS 140-3 Level 4 Alpine Cold Vault with 3-of-5 Multi-Sig Quorum.
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-mono font-bold self-start sm:self-center">
                    98.4% AIR-GAPPED COLD
                  </span>
                </div>

                {/* Reserves Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Cold Vault Pool */}
                  <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Air-Gapped Cold Vault Reserves (98.4%)</span>
                      <Lock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black font-mono text-emerald-300">
                      ${coldVaultUSD.toLocaleString()} <span className="text-sm font-normal text-slate-400">USD</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400">
                      Secured in subterranean Swiss Alpine bunker. Offline private keys.
                    </p>
                  </div>

                  {/* Hot Buffer */}
                  <div className="p-4 rounded-xl bg-black/50 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>Instant Cashout Hot Buffer (1.6%)</span>
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-black font-mono text-amber-300">
                      ${hotBufferUSD.toLocaleString()} <span className="text-sm font-normal text-slate-400">USD</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400">
                      Powers sub-3 second instant withdrawals via TRC-20, BTC, and ETH.
                    </p>
                  </div>
                </div>

                {/* Multi-Sig Quorum Signatories */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono text-slate-400">
                    Threshold Signature Scheme (3-of-5 Quorum Required for Vault Rebalancing):
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded bg-slate-950 border border-emerald-500/40 text-emerald-300 text-center">
                      Signer 1 (Zurich HSM) ✓
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-emerald-500/40 text-emerald-300 text-center">
                      Signer 2 (Geneva HSM) ✓
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-emerald-500/40 text-emerald-300 text-center">
                      Signer 3 (London HSM) ✓
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-white/10 text-slate-500 text-center">
                      Signer 4 (Standby)
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-white/10 text-slate-500 text-center">
                      Signer 5 (Standby)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: 2FA & ACTIVE SESSIONS */}
          {activeTab === 'auth' && (
            <div className="space-y-6">
              {/* 2FA Toggle Block */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">
                      Google / Authy Two-Factor Authentication (2FA)
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Enforces a 6-digit TOTP token for instant cashout requests and setting edits.
                    </p>
                  </div>
                </div>

                <button
                  id="sec-toggle-2fa-btn"
                  onClick={toggle2FA}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                    securitySettings.twoFactorEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  }`}
                >
                  {securitySettings.twoFactorEnabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* 2FA Setup Details */}
              {securitySettings.twoFactorEnabled && (
                <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Manual TOTP Key Entry:</span>
                    <button
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      {showSecretKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showSecretKey ? 'Hide' : 'Reveal'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-white/10 font-mono text-xs">
                    <span className="text-amber-300 tracking-widest">
                      {showSecretKey ? mockTOTPSecret : '••••••••••••••••'}
                    </span>
                    <button
                      id="sec-copy-totp-btn"
                      onClick={handleCopySecret}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Hardware Security Key (WebAuthn / YubiKey) */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-blue-400/10 border border-blue-400/30 text-blue-400">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">
                      FIDO2 / WebAuthn Hardware Security Key
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Physical USB / NFC biometric key verification (YubiKey, Apple Touch ID, Windows Hello).
                    </p>
                  </div>
                </div>

                <button
                  id="sec-toggle-hardware-key-btn"
                  onClick={toggleHardwareKey}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                    securitySettings.hardwareKeyEnabled
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  {securitySettings.hardwareKeyEnabled ? 'ACTIVE' : 'INACTIVE'}
                </button>
              </div>

              {/* Active Sessions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Active Cryptographic Sessions ({securitySettings.sessions.length})</span>
                  <span>Binding: TLS 1.3 / Strict IP Check</span>
                </div>

                <div className="space-y-2.5">
                  {securitySettings.sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-white/5 text-slate-300">
                          <Laptop className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-100 font-mono">
                              {sess.device}
                            </span>
                            {sess.isCurrent && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">
                                Current Session
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-mono">
                            {sess.location} • IP: {sess.ip}
                          </p>
                        </div>
                      </div>

                      {!sess.isCurrent && (
                        <button
                          id={`revoke-session-${sess.id}`}
                          onClick={() => terminateSession(sess.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 self-end sm:self-center"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
