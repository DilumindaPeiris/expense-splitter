import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, History, Sparkles, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/settlementAlgorithm';
import confetti from 'canvas-confetti';

export default function SettlementMinimizer({ 
  group, 
  settlementData, 
  currency, 
  onAddSettlement,
  onDeleteSettlement
}) {
  const { simplifiedTransactions, savingsPercent, unsimplifiedCount, simplifiedCount } = settlementData;
  const members = group.members || [];
  const settlementsHistory = group.settlements || [];
  const [showHistory, setShowHistory] = useState(false);

  const getMember = (id) => members.find(m => m.id === id) || { name: 'Unknown', avatar: '👤', color: '#6366F1' };

  const handleSettleClick = (t) => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore if confetti fails
    }

    onAddSettlement({
      id: `settle-rec-${Date.now()}`,
      fromMemberId: t.fromMemberId,
      toMemberId: t.toMemberId,
      amount: t.amount,
      date: new Date().toISOString().split('T')[0],
      notes: 'Settled via SplitSmart Minimizer'
    });
  };

  return (
    <div className="glass-card p-5 mb-6 border-emerald-500/20">
      
      {/* Header & Efficiency Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              Minimizer Settlement Plan
            </h2>
            <span className="badge badge-emerald text-xs">
              {simplifiedTransactions.length} Payments Required
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Greedy algorithm simplifies direct debts down to minimal transfers
          </p>
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="btn btn-secondary text-xs flex items-center gap-1.5"
        >
          <History className="w-3.5 h-3.5 text-indigo-400" />
          <span>Settlement History ({settlementsHistory.length})</span>
        </button>
      </div>

      {/* Comparison Metrics */}
      <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <span className="text-slate-300 font-semibold">Direct transactions: </span>
            <span className="text-slate-400 line-through mr-2">{unsimplifiedCount} payments</span>
            <span className="text-emerald-400 font-bold">➜ Optimized to {simplifiedCount} payments</span>
          </div>
        </div>
        <span className="badge badge-emerald text-xs font-bold">
          {savingsPercent}% Reduction
        </span>
      </div>

      {/* Settlement Transaction Step Cards */}
      {simplifiedTransactions.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-white">All Debts Fully Settled!</h3>
          <p className="text-xs text-slate-400 mt-1">
            No pending transactions are needed. Group members are in perfect balance.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {simplifiedTransactions.map((t, idx) => {
            const debtor = getMember(t.fromMemberId);
            const creditor = getMember(t.toMemberId);

            return (
              <div 
                key={t.id || idx} 
                className="flex flex-wrap items-center justify-between p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 transition-all gap-3 group"
              >
                {/* Transfer direction */}
                <div className="flex items-center gap-3">
                  
                  {/* Debtor */}
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: `${debtor.color || '#F43F5E'}25`, border: `1.5px solid ${debtor.color || '#F43F5E'}` }}
                    >
                      {debtor.avatar || debtor.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{debtor.name}</div>
                      <div className="text-[10px] text-rose-400 font-medium">Pays</div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />

                  {/* Creditor */}
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ backgroundColor: `${creditor.color || '#10B981'}25`, border: `1.5px solid ${creditor.color || '#10B981'}` }}
                    >
                      {creditor.avatar || creditor.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{creditor.name}</div>
                      <div className="text-[10px] text-emerald-400 font-medium">Receives</div>
                    </div>
                  </div>

                </div>

                {/* Amount & Action Button */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-base font-black text-emerald-400">
                      {formatCurrency(t.amount, currency)}
                    </div>
                    <div className="text-[10px] text-slate-400">Step {idx + 1} of {simplifiedTransactions.length}</div>
                  </div>

                  <button
                    onClick={() => handleSettleClick(t)}
                    className="btn btn-emerald text-xs px-3 py-1.5 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Settle Up</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History Modal / Accordion */}
      {showHistory && (
        <div className="mt-5 pt-4 border-t border-slate-800 animate-fadeIn">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Recorded Settlement History ({settlementsHistory.length})
          </h3>

          {settlementsHistory.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-2">No manual settlements recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {settlementsHistory.map((s) => {
                const fromM = getMember(s.fromMemberId);
                const toM = getMember(s.toMemberId);

                return (
                  <div key={s.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-300 font-semibold">{fromM.name}</span>
                      <span className="text-slate-500">paid</span>
                      <span className="text-emerald-400 font-semibold">{toM.name}</span>
                      <span className="font-bold text-white">{formatCurrency(s.amount, currency)}</span>
                      <span className="text-[10px] text-slate-500">({s.date})</span>
                    </div>

                    <button
                      onClick={() => onDeleteSettlement(s.id)}
                      className="text-rose-400 hover:text-rose-300 text-xs font-medium"
                    >
                      Undo
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
