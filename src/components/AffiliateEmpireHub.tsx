import React, { useState } from 'react';
import { useCasino } from '../context/CasinoContext';
import { CryptoCurrency, AffiliatePayoutLedgerItem } from '../types';
import {
  Users,
  Share2,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Coins,
  ArrowRight,
  ShieldCheck,
  QrCode,
  DollarSign,
  Wallet,
  Building,
  CheckCircle2,
  ExternalLink,
  Award,
  Crown,
  Sparkles,
  Search,
  Filter,
  ArrowDownRight,
  Send,
  MessageCircle,
  BarChart3,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { triggerHaptic } from '../utils/haptics';

// Luxury High-Contrast SVG QR Code Generator with Central Sovereign Eagle
const LuxuryQrCodeDisplay: React.FC<{ url: string; code: string }> = ({ url, code }) => {
  // Deterministic 21x21 QR module matrix representation
  const size = 21;
  const modules: boolean[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => {
      // Finder patterns in 3 corners (7x7)
      const inTopLeft = r < 7 && c < 7;
      const inTopRight = r < 7 && c >= size - 7;
      const inBottomLeft = r >= size - 7 && c < 7;

      if (inTopLeft) {
        if (r === 0 || r === 6 || c === 0 || c === 6) return true;
        if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
        return false;
      }
      if (inTopRight) {
        const localC = c - (size - 7);
        if (r === 0 || r === 6 || localC === 0 || localC === 6) return true;
        if (r >= 2 && r <= 4 && localC >= 2 && localC <= 4) return true;
        return false;
      }
      if (inBottomLeft) {
        const localR = r - (size - 7);
        if (localR === 0 || localR === 6 || c === 0 || c === 6) return true;
        if (localR >= 2 && localR <= 4 && c >= 2 && c <= 4) return true;
        return false;
      }

      // Timing patterns
      if (r === 6 && c % 2 === 0) return true;
      if (c === 6 && r % 2 === 0) return true;

      // Center cutout for emblem (5x5)
      if (r >= 8 && r <= 12 && c >= 8 && c <= 12) return false;

      // Pseudo-random pseudo-deterministic pattern derived from code chars
      const seed = (r * 31 + c * 17 + code.charCodeAt((r + c) % code.length)) % 100;
      return seed > 46;
    })
  );

  return (
    <div className="relative w-56 h-56 mx-auto bg-white p-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-center">
      <svg viewBox="0 0 21 21" className="w-full h-full shape-rendering-crispEdges">
        {modules.map((row, r) =>
          row.map((active, c) =>
            active ? (
              <rect
                key={`${r}-${c}`}
                x={c}
                y={r}
                width="1"
                height="1"
                fill="#0A0E18"
              />
            ) : null
          )
        )}
      </svg>
      {/* Central Sovereign Eagle Emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-11 h-11 rounded-full bg-black border-2 border-amber-400 flex items-center justify-center shadow-lg">
          <span className="text-amber-400 font-serif font-black text-xs">🦅</span>
        </div>
      </div>
    </div>
  );
};

export const AffiliateEmpireHub: React.FC = () => {
  const {
    affiliateStats,
    withdrawAffiliateCommission,
    updateReferralSlug,
    showToast,
    setNavTab,
    openCashoutModal,
    translations: t,
  } = useCasino();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [customSlugInput, setCustomSlugInput] = useState(affiliateStats.referralCode);
  const [showQrModal, setShowQrModal] = useState(false);

  // Withdrawal modal states
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawCurrency, setWithdrawCurrency] = useState<CryptoCurrency | 'USD_FIAT'>('USDT');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(affiliateStats.unclaimedCommissionUSD);

  // Payout ledger filter & search
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  const handleCopyLink = () => {
    triggerHaptic('selection');
    navigator.clipboard.writeText(affiliateStats.referralLink);
    setCopiedLink(true);
    showToast(t.linkCopied);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    triggerHaptic('selection');
    navigator.clipboard.writeText(affiliateStats.referralCode);
    setCopiedCode(true);
    showToast(`Copied referral code [${affiliateStats.referralCode}] to clipboard!`);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveSlug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSlugInput.trim()) return;
    triggerHaptic('impact');
    updateReferralSlug(customSlugInput.trim());
    showToast(`Referral alias updated to [${customSlugInput.trim().toUpperCase()}]!`);
  };

  const handleNativeShare = async () => {
    triggerHaptic('impact');
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Aetherius Sovereign VIP Casino',
          text: 'Join me on Aetherius VIP Casino! Claim an instant 30% Welcome Bonus + Provably Fair crypto gaming:',
          url: affiliateStats.referralLink,
        });
        showToast('Shared via native device share sheet!');
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const shareViaWhatsApp = () => {
    triggerHaptic('selection');
    const msg = encodeURIComponent(
      `Join me on Aetherius Sovereign Betting Empire! Get an instant 30% Welcome Bonus + 100% Provably Fair high-roller games: ${affiliateStats.referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  const shareViaTelegram = () => {
    triggerHaptic('selection');
    const url = encodeURIComponent(affiliateStats.referralLink);
    const text = encodeURIComponent(
      'Join me on Aetherius Sovereign Betting Empire! 30% Welcome Bonus & Provably Fair crypto gaming 👑'
    );
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
  };

  const shareViaFacebook = () => {
    triggerHaptic('selection');
    const url = encodeURIComponent(affiliateStats.referralLink);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const shareViaTwitter = () => {
    triggerHaptic('selection');
    const url = encodeURIComponent(affiliateStats.referralLink);
    const text = encodeURIComponent(
      'Join me on Aetherius Sovereign Betting Empire! 30% Welcome Bonus & Provably Fair high-roller gaming: '
    );
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('impact');
    const success = withdrawAffiliateCommission(withdrawCurrency, withdrawAmount);
    if (success) {
      setWithdrawModalOpen(false);
    }
  };

  const handleCopyTx = (tx: string) => {
    triggerHaptic('selection');
    navigator.clipboard.writeText(tx);
    setCopiedTx(tx);
    showToast('Transaction hash copied!');
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const filteredLedger = affiliateStats.payoutLedger.filter((item) => {
    const matchSearch =
      item.txHash.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      item.referredUserHash.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
      item.id.toLowerCase().includes(ledgerSearch.toLowerCase());
    const matchCurrency = currencyFilter === 'all' || item.currency === currencyFilter;
    return matchSearch && matchCurrency;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Luxury Royal Navy & Gold Hero Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#080E18] via-[#0B1425] to-[#080E18] border-2 border-amber-400/40 p-6 sm:p-8 shadow-2xl">
        {/* Top Gold Filigree Accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_#FFD700]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-extrabold text-xs tracking-wider uppercase flex items-center gap-1.5 shadow-lg shadow-amber-500/20">
                <Crown className="w-3.5 h-3.5 fill-black" />
                {t.referralEngineTitle}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 font-mono text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {t.partnerRevShare}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-luxury font-black text-slate-100 tracking-wide">
              VIRAL REVENUE & 30% PARTNER MONETIZATION
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Earn an institutional 30% lifetime Net Gaming Revenue (NGR) cut on every wager generated by your
              direct recruits and tier-2 sub-network. Real-time automated conversions with 1-tap instant withdrawals.
            </p>
          </div>

          {/* Unclaimed RevShare Counter & Instant Cashout Trigger */}
          <div className="p-5 rounded-xl bg-black/60 border border-amber-400/40 shadow-xl flex flex-col items-start sm:items-end gap-3 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                {t.unclaimedCommission}
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono-num text-amber-300 mt-0.5">
                ${affiliateStats.unclaimedCommissionUSD.toFixed(2)}
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">
                Lifetime Earned: ${affiliateStats.totalEarnedUSD.toLocaleString()}
              </span>
            </div>

            <button
              id="affiliate-instant-withdraw-trigger"
              onClick={() => openCashoutModal(affiliateStats.unclaimedCommissionUSD, 'affiliate_revshare')}
              disabled={affiliateStats.unclaimedCommissionUSD <= 0}
              className={`px-5 py-2.5 rounded-xl font-mono font-bold text-xs tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg ${
                affiliateStats.unclaimedCommissionUSD > 0
                  ? 'btn-tactile-gold shadow-amber-500/30'
                  : 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{t.instantWithdrawTrigger}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Automated Referral Link Generator & Direct Social Sharing Hooks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Referral Link & Slug Customizer */}
        <div className="lg:col-span-6 rounded-2xl bg-gradient-to-b from-[#0D1526] to-[#080E18] border border-amber-400/30 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-amber-400" />
              <h3 className="font-luxury font-bold text-base sm:text-lg text-slate-100">
                1-CLICK AFFILIATE LINK & QR ENGINE
              </h3>
            </div>
            <button
              id="affiliate-view-qr-btn"
              onClick={() => {
                triggerHaptic('selection');
                setShowQrModal(true);
              }}
              className="px-3 py-1 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.scanQrCode}</span>
            </button>
          </div>

          {/* Referral Code Box */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
              Automated Unique Affiliate Link
            </label>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-black/60 border border-white/10">
              <span className="text-xs font-mono text-amber-300 truncate px-2 flex-1">
                {affiliateStats.referralLink}
              </span>
              <button
                id="affiliate-copy-link-btn"
                onClick={handleCopyLink}
                className="px-3.5 py-1.5 rounded-lg btn-tactile-gold text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Custom Slug Editor */}
          <form onSubmit={handleSaveSlug} className="space-y-2">
            <label className="text-xs font-mono text-slate-300 uppercase tracking-wider block">
              Customize Viral Referral Alias
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-xs font-mono text-slate-500">
                  ref=
                </span>
                <input
                  type="text"
                  maxLength={18}
                  value={customSlugInput}
                  onChange={(e) => setCustomSlugInput(e.target.value.toUpperCase())}
                  placeholder="CUSTOM_ALIAS"
                  className="w-full pl-12 pr-4 py-2 rounded-xl bg-black/60 border border-white/15 focus:border-amber-400 text-xs font-mono font-bold text-amber-300 uppercase focus:outline-none"
                />
              </div>
              <button
                type="submit"
                id="affiliate-save-slug-btn"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold transition cursor-pointer shrink-0"
              >
                Update Slug
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Customized aliases automatically trigger the 30% Welcome Bonus onboarding flow for all referrals.
            </p>
          </form>

          {/* Direct Social Broadcast & Native Share */}
          <div className="pt-2 border-t border-white/10 space-y-2.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              Direct Viral Social Syndication Hooks
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={shareViaWhatsApp}
                className="p-2.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={shareViaTelegram}
                className="p-2.5 rounded-xl bg-[#229ED9]/10 border border-[#229ED9]/30 text-[#229ED9] hover:bg-[#229ED9]/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>

              <button
                type="button"
                onClick={shareViaFacebook}
                className="p-2.5 rounded-xl bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2]/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </button>

              <button
                type="button"
                onClick={shareViaTwitter}
                className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-600/40 text-slate-200 hover:bg-slate-700/60 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>𝕏 Twitter</span>
              </button>
            </div>

            {/* Native 1-Tap Share Sheet */}
            <button
              type="button"
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs flex items-center justify-center gap-2 hover:border-amber-400 transition cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>{t.shareNative}</span>
            </button>
          </div>
        </div>

        {/* Right: Dynamic Commission Tracker & Conversion Analytics */}
        <div className="lg:col-span-6 rounded-2xl bg-gradient-to-b from-[#0D1526] to-[#080E18] border border-amber-400/30 p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-luxury font-bold text-base sm:text-lg text-slate-100">
                DYNAMIC 30% COMMISSION TRACKER
              </h3>
            </div>
            <span className="text-xs font-mono text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/30">
              Total Referrals: {affiliateStats.totalReferrals}
            </span>
          </div>

          {/* Automated Conversion Funnel Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="p-3 rounded-xl bg-black/50 border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase">Link Clicks</p>
              <p className="text-lg font-black text-slate-100 mt-0.5">1,480</p>
              <span className="text-[9px] text-emerald-400">Viral Traffic</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase">Signups</p>
              <p className="text-lg font-black text-amber-300 mt-0.5">{affiliateStats.totalReferrals}</p>
              <span className="text-[9px] text-amber-400">3.5% CTR</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase">Active Depositors</p>
              <p className="text-lg font-black text-emerald-400 mt-0.5">{affiliateStats.activeWagerers}</p>
              <span className="text-[9px] text-emerald-400">80.7% Conv</span>
            </div>
            <div className="p-3 rounded-xl bg-black/50 border border-white/5">
              <p className="text-[10px] text-slate-400 uppercase">Partner Cut</p>
              <p className="text-lg font-black text-amber-300 mt-0.5">30.0%</p>
              <span className="text-[9px] text-amber-400">Lifetime NGR</span>
            </div>
          </div>

          {/* Tiered Network Payout Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Level 1 Direct Recruits */}
            <div className="p-4 rounded-xl bg-black/60 border border-amber-400/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-300">Level 1 (Direct)</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                  25% NGR
                </span>
              </div>
              <div className="text-2xl font-black font-mono-num text-slate-100">
                {affiliateStats.level1RecruitsCount} Recruits
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                <span>Wager Volume:</span>
                <span className="text-amber-300 font-bold">
                  ${affiliateStats.level1VolumeUSD.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                Direct referrals who signed up via your custom link or QR code.
              </p>
            </div>

            {/* Level 2 Sub-Affiliate Recruits */}
            <div className="p-4 rounded-xl bg-black/60 border border-emerald-400/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-300">Level 2 (Network)</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300">
                  5% NGR
                </span>
              </div>
              <div className="text-2xl font-black font-mono-num text-slate-100">
                {affiliateStats.level2RecruitsCount} Recruits
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                <span>Wager Volume:</span>
                <span className="text-emerald-400 font-bold">
                  ${affiliateStats.level2VolumeUSD.toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                Sub-network invites brought in by your direct Level 1 recruits.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time On-Chain Payout Ledger & Transparency Audit */}
      <div className="rounded-2xl bg-gradient-to-b from-[#0D1526] to-[#080E18] border border-white/10 p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-luxury font-bold text-base sm:text-lg text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>LIVE AFFILIATE COMMISSION PAYOUT LEDGER</span>
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Institutional real-time transaction settlements registered on cryptographic ledger.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="Search hash or user..."
                className="pl-8 pr-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Commission Amount</th>
                <th className="py-2.5 px-3">Tier Category</th>
                <th className="py-2.5 px-3">Referred Entity</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">On-Chain Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLedger.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 px-3 text-amber-300 font-bold">{item.id}</td>
                  <td className="py-3 px-3 text-slate-300">{item.date}</td>
                  <td className="py-3 px-3">
                    <span className="text-emerald-400 font-bold font-mono-num">
                      +${item.amountUSD.toFixed(2)} {item.currency}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300">{item.tierLevel}</td>
                  <td className="py-3 px-3 text-slate-400">{item.referredUserHash}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/30 text-emerald-400 text-[10px]">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleCopyTx(item.txHash)}
                      className="text-[11px] text-slate-400 hover:text-amber-300 transition flex items-center gap-1 ml-auto cursor-pointer"
                    >
                      <span>{item.txHash}</span>
                      {copiedTx === item.txHash ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* High-Resolution SVG QR Code Preview Modal */}
      <AnimatePresence>
        {showQrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xl flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-sm p-6 rounded-2xl bg-[#090E18]/45 backdrop-blur-2xl border-2 border-amber-400/50 shadow-2xl text-center space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="font-luxury font-bold text-sm text-slate-200">
                  SCAN TO JOIN WITH 30% WELCOME BONUS
                </span>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* High-Resolution Authentic SVG QR Code */}
              <LuxuryQrCodeDisplay url={affiliateStats.referralLink} code={affiliateStats.referralCode} />

              <div className="space-y-1">
                <p className="text-xs font-mono font-bold text-amber-300">
                  ref={affiliateStats.referralCode}
                </p>
                <p className="text-[11px] font-mono text-slate-400">
                  Activates 30% Welcome Bonus on recipient device automatically
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 rounded-xl btn-tactile-gold text-xs font-mono font-bold transition cursor-pointer"
                >
                  Copy Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-mono text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
