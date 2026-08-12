import React from 'react';
import { DollarSign, Users, Zap, PieChart } from 'lucide-react';
import { formatCurrency } from '../utils/settlementAlgorithm';

export default function GroupSummary({ group, settlementData, currency }) {
  const { balances, unsimplifiedCount, simplifiedCount, savingsPercent } = settlementData;
  const members = group.members || [];
  const expenses = group.expenses || [];

  // Total Group Spend
  const totalGroupSpend = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const avgPerPerson = members.length > 0 ? totalGroupSpend / members.length : 0;

  // Active Debt Pool (sum of positive net balances)
  const totalDebtPool = Object.values(balances).reduce((acc, b) => {
    return b.net > 0 ? acc + b.net : acc;
  }, 0);

  return (
    <div className="grid-4 mb-6">
      
      {/* Total Group Spend Card */}
      <div className="glass-card p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
          <DollarSign className="w-16 h-16 text-indigo-400" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-indigo-500/15 text-indigo-400">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Group Spend</span>
        </div>
        <div className="text-2xl font-black text-white tracking-tight">
          {formatCurrency(totalGroupSpend, currency)}
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Across {expenses.length} logged expenses
        </div>
      </div>

      {/* Avg per Member */}
      <div className="glass-card p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
          <Users className="w-16 h-16 text-emerald-400" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Share / Member</span>
        </div>
        <div className="text-2xl font-black text-white tracking-tight">
          {formatCurrency(avgPerPerson, currency)}
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Divided among {members.length} group members
        </div>
      </div>

      {/* Active Debt Pool */}
      <div className="glass-card p-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
          <PieChart className="w-16 h-16 text-amber-400" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-amber-500/15 text-amber-400">
            <PieChart className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unsettled Balance Pool</span>
        </div>
        <div className="text-2xl font-black text-amber-400 tracking-tight">
          {formatCurrency(totalDebtPool, currency)}
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Total amount to be settled
        </div>
      </div>

      {/* Optimization Savings Badge */}
      <div className="glass-card p-4 relative overflow-hidden group border-indigo-500/30">
        <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:opacity-25 transition-opacity">
          <Zap className="w-16 h-16 text-purple-400" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/15 text-purple-400">
              <Zap className="w-5 h-5 animate-bounce" />
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Algorithm Boost</span>
          </div>
          <span className="badge badge-emerald text-[10px]">{savingsPercent}% Fewer Payments</span>
        </div>
        <div className="text-2xl font-black text-white tracking-tight">
          {simplifiedCount} <span className="text-sm font-normal text-slate-400">vs {unsimplifiedCount} payments</span>
        </div>
        <div className="text-xs text-slate-400 mt-1">
          Greedy graph settlement minimization active
        </div>
      </div>

    </div>
  );
}
