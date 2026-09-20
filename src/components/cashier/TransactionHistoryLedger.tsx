import React, { useState } from 'react';
import { useCasino } from '../../context/CasinoContext';
import { TransactionRecord } from '../../types';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Copy,
  Check,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Receipt,
  X
} from 'lucide-react';

type FilterType = 'all' | 'deposit' | 'withdraw' | 'crypto' | 'cards_fiat' | 'ewallet_wire';

export const TransactionHistoryLedger: React.FC = () => {
  const { transactions, showToast } = useCasino();

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<TransactionRecord | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    // Filter by type or category
    if (activeFilter === 'deposit' && tx.type !== 'deposit') return false;
    if (activeFilter === 'withdraw' && tx.type !== 'withdraw') return false;
    if (activeFilter === 'crypto' && tx.methodTier !== 'crypto') return false;
    if (activeFilter === 'cards_fiat' && tx.methodTier !== 'cards_fiat') return false;
    if (activeFilter === 'ewallet_wire' && tx.methodTier !== 'ewallet_wire') return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMethod = (tx.method || '').toLowerCase().includes(q);
      const matchHash = (tx.txHash || '').toLowerCase().includes(q);
      const matchCurr = (tx.currency || '').toLowerCase().includes(q);
      const matchId = (tx.id || '').toLowerCase().includes(q);
      if (!matchMethod && !matchHash && !matchCurr && !matchId) return false;
    }

    return true;
  });

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHashId(id);
    showToast('Transaction hash copied to clipboard.');
    setTimeout(() => setCopiedHashId(null), 2000);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'deposit', label: 'Deposits' },
            { id: 'withdraw', label: 'Withdrawals' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'cards_fiat', label: 'Cards/Fiat' },
            { id: 'ewallet_wire', label: 'Wire/E-Wallet' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as FilterType)}
              className={`px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-amber-400 text-black font-bold border-amber-300 shadow-sm'
                  : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search hash, method..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl bg-black/60 border border-amber-400/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950/80 border-b border-white/10 text-[10px] text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Method / Gateway</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Hash / Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No transactions matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isDeposit = tx.type === 'deposit';
                  const isCopied = copiedHashId === tx.id;

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-white/[0.02] transition group"
                    >
                      {/* Type */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isDeposit
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {isDeposit ? (
                            <ArrowDownLeft className="w-3 h-3" />
                          ) : (
                            <ArrowUpRight className="w-3 h-3" />
                          )}
                          <span>{isDeposit ? 'DEPOSIT' : 'CASHOUT'}</span>
                        </span>
                      </td>

                      {/* Method */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-white">
                            {tx.method || 'Blockchain Gateway'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {tx.network || (tx.methodTier === 'crypto' ? 'On-Chain Transfer' : 'Instant Settlement')}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span
                            className={`font-bold ${
                              isDeposit ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {isDeposit ? '+' : '-'}${tx.amount.toLocaleString()}{' '}
                            <span className="text-[10px] text-slate-400">{tx.currency}</span>
                          </span>
                          {tx.bonusAmountUSD !== undefined && tx.bonusAmountUSD > 0 && (
                            <span className="text-[9px] text-amber-400 font-bold">
                              +${tx.bonusAmountUSD.toFixed(2)} Match
                            </span>
                          )}
                          {tx.feeUSD !== undefined && tx.feeUSD > 0 && (
                            <span className="text-[9px] text-slate-500">
                              Fee: ${tx.feeUSD.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-400">
                        {tx.timestamp}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{tx.status}</span>
                        </span>
                      </td>

                      {/* Hash & Receipt */}
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyHash(tx.txHash, tx.id)}
                            title="Copy TxHash"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedTxForReceipt(tx)}
                            title="View Cryptographic Receipt"
                            className="px-2 py-1 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                          >
                            <Receipt className="w-3 h-3" />
                            <span>RECEIPT</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedTxForReceipt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/45 backdrop-blur-2xl">
          <div className="w-full max-w-md rounded-2xl cyber-glass-card border border-amber-400/40 p-6 space-y-4 text-left shadow-2xl relative backdrop-blur-2xl">
            <button
              type="button"
              onClick={() => setSelectedTxForReceipt(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-luxury font-black text-white text-base">
                  CRYPTOGRAPHIC RECEIPT
                </h4>
                <p className="text-[10px] font-mono text-slate-400">
                  Immutable Blockchain & Treasury Audit Record
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 space-y-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction ID:</span>
                <span className="text-white font-bold">{selectedTxForReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span
                  className={
                    selectedTxForReceipt.type === 'deposit' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'
                  }
                >
                  {selectedTxForReceipt.type.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="text-white font-bold">
                  ${selectedTxForReceipt.amount.toLocaleString()} {selectedTxForReceipt.currency}
                </span>
              </div>
              {selectedTxForReceipt.bonusAmountUSD !== undefined && selectedTxForReceipt.bonusAmountUSD > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>+30% Match Bonus:</span>
                  <span className="font-bold">+${selectedTxForReceipt.bonusAmountUSD.toFixed(2)} USD</span>
                </div>
              )}
              {selectedTxForReceipt.totalCreditedUSD !== undefined && (
                <div className="flex justify-between text-amber-300 font-bold">
                  <span>Total Credited:</span>
                  <span>${selectedTxForReceipt.totalCreditedUSD.toFixed(2)} USD</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Method:</span>
                <span className="text-amber-300">{selectedTxForReceipt.method}</span>
              </div>
              {selectedTxForReceipt.destinationAddress && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="text-white truncate max-w-[180px]">
                    {selectedTxForReceipt.destinationAddress}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Settled & Confirmed
                </span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <span className="text-slate-400 block mb-1">Mempool Transaction Hash:</span>
                <span className="text-amber-400 select-all break-all text-[11px]">
                  {selectedTxForReceipt.txHash}
                </span>
              </div>
              {selectedTxForReceipt.hmacSignature && (
                <div className="pt-2 border-t border-white/10">
                  <span className="text-slate-400 block mb-1">HMAC-SHA256 Payload Signature:</span>
                  <span className="text-emerald-400 select-all break-all text-[10px]">
                    {selectedTxForReceipt.hmacSignature}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(selectedTxForReceipt.txHash);
                showToast('Receipt hash copied.');
              }}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-mono font-bold text-xs uppercase transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>COPY RECEIPT HASH</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
